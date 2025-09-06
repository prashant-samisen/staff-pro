import { PrismaClient } from '@prisma/client'

// Global variable to store the Prisma client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with connection pooling configuration
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

// In development, store the client on the global object to prevent
// multiple instances during hot reloading
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Graceful shutdown handler
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export default prisma

// Database utility functions for common operations

/**
 * Database connection health check
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

/**
 * Execute a database operation with retry logic
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxRetries) {
        throw lastError
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }

  throw lastError!
}

/**
 * Execute multiple operations in a transaction
 */
export async function executeTransaction<T>(
  operations: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(async (tx) => {
    return await operations(tx)
  })
}

/**
 * Paginate query results
 */
export interface PaginationOptions {
  page?: number
  limit?: number
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export async function paginate<T>(
  model: any,
  options: PaginationOptions & { where?: any; orderBy?: any; include?: any } = {}
): Promise<PaginatedResult<T>> {
  const page = Math.max(1, options.page || 1)
  const limit = Math.min(100, Math.max(1, options.limit || 10))
  const skip = (page - 1) * limit

  const [data, total] = await Promise.all([
    model.findMany({
      skip,
      take: limit,
      where: options.where,
      orderBy: options.orderBy,
      include: options.include,
    }),
    model.count({ where: options.where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}

/**
 * Soft delete utility (updates status to INACTIVE instead of deleting)
 */
export async function softDeleteEmployee(employeeId: string): Promise<void> {
  await prisma.employee.update({
    where: { id: employeeId },
    data: { status: 'INACTIVE' },
  })
}

/**
 * Bulk operations utility
 */
export async function bulkCreateAttendance(
  records: Array<{
    employeeId: string
    date: Date
    status: string
    daysCount: number
  }>
): Promise<void> {
  await prisma.attendanceRecord.createMany({
    data: records,
    skipDuplicates: true,
  })
}

/**
 * Get attendance records for a specific month
 */
export async function getMonthlyAttendance(
  year: number,
  month: number,
  employeeId?: string
) {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  return await prisma.attendanceRecord.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
      ...(employeeId && { employeeId }),
    },
    include: {
      employee: true,
    },
    orderBy: [
      { employee: { name: 'asc' } },
      { date: 'asc' },
    ],
  })
}

/**
 * Calculate employee leave balance
 */
export async function calculateLeaveBalance(employeeId: string) {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: {
      leaveBalance: true,
      leaveRequests: {
        where: { status: 'APPROVED' },
      },
    },
  })

  if (!employee) {
    throw new Error('Employee not found')
  }

  const totalUsedDays = employee.leaveRequests.reduce(
    (sum, request) => sum + request.totalDays,
    0
  )

  const remainingDays = employee.annualLeaveDays - totalUsedDays

  return {
    allocated: employee.annualLeaveDays,
    used: totalUsedDays,
    remaining: Math.max(0, remainingDays),
  }
}

/**
 * Get or create leave balance for an employee
 */
export async function getOrCreateLeaveBalance(employeeId: string) {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: { leaveBalance: true },
  })

  if (!employee) {
    throw new Error('Employee not found')
  }

  if (!employee.leaveBalance) {
    return await prisma.leaveBalance.create({
      data: {
        employeeId,
        allocatedDays: employee.annualLeaveDays,
        usedDays: 0,
      },
    })
  }

  return employee.leaveBalance
}

// Error handling utilities for database operations

export class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: Error
  ) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends Error {
  constructor(resource: string, id?: string) {
    super(`${resource}${id ? ` with id ${id}` : ''} not found`)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConflictError'
  }
}

/**
 * Handle Prisma errors and convert them to appropriate custom errors
 */
export function handlePrismaError(error: any): never {
  if (error.code === 'P2002') {
    // Unique constraint violation
    const field = error.meta?.target?.[0] || 'field'
    throw new ConflictError(`${field} already exists`)
  }

  if (error.code === 'P2025') {
    // Record not found
    throw new NotFoundError('Record')
  }

  if (error.code === 'P2003') {
    // Foreign key constraint violation
    throw new ValidationError('Referenced record does not exist')
  }

  if (error.code === 'P2014') {
    // Required relation violation
    throw new ValidationError('Required relation is missing')
  }

  if (error.code === 'P1001') {
    // Database connection error
    throw new DatabaseError('Unable to connect to database', error.code, error)
  }

  if (error.code === 'P1008') {
    // Database timeout
    throw new DatabaseError('Database operation timed out', error.code, error)
  }

  // Generic database error
  throw new DatabaseError(
    error.message || 'An unexpected database error occurred',
    error.code,
    error
  )
}

/**
 * Wrapper function to handle database operations with proper error handling
 */
export async function safeDbOperation<T>(
  operation: () => Promise<T>,
  context?: string
): Promise<T> {
  try {
    return await operation()
  } catch (error: any) {
    console.error(`Database operation failed${context ? ` in ${context}` : ''}:`, error)
    handlePrismaError(error)
  }
}

/**
 * Validate employee data before database operations
 */
export function validateEmployeeData(data: {
  name?: string
  email?: string
  annualLeaveDays?: number
}) {
  if (data.name !== undefined) {
    if (!data.name || data.name.trim().length < 2) {
      throw new ValidationError('Name must be at least 2 characters long', 'name')
    }
    if (data.name.length > 100) {
      throw new ValidationError('Name must be less than 100 characters', 'name')
    }
  }

  if (data.email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!data.email || !emailRegex.test(data.email)) {
      throw new ValidationError('Invalid email format', 'email')
    }
  }

  if (data.annualLeaveDays !== undefined) {
    if (data.annualLeaveDays < 0 || data.annualLeaveDays > 365) {
      throw new ValidationError('Annual leave days must be between 0 and 365', 'annualLeaveDays')
    }
  }
}

/**
 * Validate attendance data before database operations
 */
export function validateAttendanceData(data: {
  date?: Date
  status?: string
  daysCount?: number
}) {
  if (data.date !== undefined) {
    const today = new Date()
    const maxPastDate = new Date()
    maxPastDate.setFullYear(today.getFullYear() - 1)

    if (data.date > today) {
      throw new ValidationError('Cannot mark attendance for future dates', 'date')
    }
    if (data.date < maxPastDate) {
      throw new ValidationError('Cannot mark attendance for dates older than 1 year', 'date')
    }
  }

  if (data.status !== undefined) {
    const validStatuses = ['FULL', 'HALF_MORNING', 'HALF_AFTERNOON', 'ABSENT', 'LEAVE']
    if (!validStatuses.includes(data.status)) {
      throw new ValidationError('Invalid attendance status', 'status')
    }
  }

  if (data.daysCount !== undefined) {
    const validDayCounts = [0, 0.5, 1]
    if (!validDayCounts.includes(data.daysCount)) {
      throw new ValidationError('Days count must be 0, 0.5, or 1', 'daysCount')
    }
  }
}

/**
 * Validate leave request data before database operations
 */
export function validateLeaveRequestData(data: {
  startDate?: Date
  endDate?: Date
  totalDays?: number
}) {
  if (data.startDate && data.endDate) {
    if (data.startDate > data.endDate) {
      throw new ValidationError('Start date cannot be after end date', 'startDate')
    }

    const today = new Date()
    const maxFutureDate = new Date()
    maxFutureDate.setFullYear(today.getFullYear() + 1)

    if (data.endDate > maxFutureDate) {
      throw new ValidationError('Leave request cannot be more than 1 year in the future', 'endDate')
    }
  }

  if (data.totalDays !== undefined) {
    if (data.totalDays <= 0 || data.totalDays > 365) {
      throw new ValidationError('Total days must be between 0 and 365', 'totalDays')
    }
  }
}