import { describe, it, expect, vi } from 'vitest'

// Import the actual utility functions we want to test
import {
  validateEmployeeData,
  validateAttendanceData,
  validateLeaveRequestData,
  handlePrismaError,
  DatabaseError,
  ValidationError,
  NotFoundError,
  ConflictError,
  withRetry,
} from '../db'

describe('Database Utility Functions', () => {
  describe('validateEmployeeData', () => {
    it('should pass valid employee data', () => {
      expect(() => {
        validateEmployeeData({
          name: 'John Doe',
          email: 'john@example.com',
          annualLeaveDays: 25,
        })
      }).not.toThrow()
    })

    it('should throw ValidationError for short name', () => {
      expect(() => {
        validateEmployeeData({ name: 'A' })
      }).toThrow(ValidationError)
    })

    it('should throw ValidationError for long name', () => {
      expect(() => {
        validateEmployeeData({ name: 'A'.repeat(101) })
      }).toThrow(ValidationError)
    })

    it('should throw ValidationError for invalid email', () => {
      expect(() => {
        validateEmployeeData({ email: 'invalid-email' })
      }).toThrow(ValidationError)
    })

    it('should throw ValidationError for negative annual leave days', () => {
      expect(() => {
        validateEmployeeData({ annualLeaveDays: -1 })
      }).toThrow(ValidationError)
    })

    it('should throw ValidationError for excessive annual leave days', () => {
      expect(() => {
        validateEmployeeData({ annualLeaveDays: 400 })
      }).toThrow(ValidationError)
    })
  })

  describe('validateAttendanceData', () => {
    it('should pass valid attendance data', () => {
      const recentDate = new Date()
      recentDate.setDate(recentDate.getDate() - 30) // 30 days ago
      
      expect(() => {
        validateAttendanceData({
          date: recentDate,
          status: 'FULL',
          daysCount: 1,
        })
      }).not.toThrow()
    })

    it('should throw ValidationError for future date', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 1)

      expect(() => {
        validateAttendanceData({ date: futureDate })
      }).toThrow(ValidationError)
    })

    it('should throw ValidationError for very old date', () => {
      const oldDate = new Date()
      oldDate.setFullYear(oldDate.getFullYear() - 2)

      expect(() => {
        validateAttendanceData({ date: oldDate })
      }).toThrow(ValidationError)
    })

    it('should throw ValidationError for invalid status', () => {
      expect(() => {
        validateAttendanceData({ status: 'INVALID_STATUS' })
      }).toThrow(ValidationError)
    })

    it('should accept valid statuses', () => {
      const validStatuses = ['FULL', 'HALF_MORNING', 'HALF_AFTERNOON', 'ABSENT', 'LEAVE']
      
      validStatuses.forEach(status => {
        expect(() => {
          validateAttendanceData({ status })
        }).not.toThrow()
      })
    })

    it('should throw ValidationError for invalid days count', () => {
      expect(() => {
        validateAttendanceData({ daysCount: 0.3 })
      }).toThrow(ValidationError)
    })

    it('should accept valid days counts', () => {
      const validDayCounts = [0, 0.5, 1]
      
      validDayCounts.forEach(daysCount => {
        expect(() => {
          validateAttendanceData({ daysCount })
        }).not.toThrow()
      })
    })
  })

  describe('validateLeaveRequestData', () => {
    it('should pass valid leave request data', () => {
      expect(() => {
        validateLeaveRequestData({
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-06-05'),
          totalDays: 5,
        })
      }).not.toThrow()
    })

    it('should throw ValidationError when start date is after end date', () => {
      expect(() => {
        validateLeaveRequestData({
          startDate: new Date('2024-06-05'),
          endDate: new Date('2024-06-01'),
        })
      }).toThrow(ValidationError)
    })

    it('should throw ValidationError for zero total days', () => {
      expect(() => {
        validateLeaveRequestData({ totalDays: 0 })
      }).toThrow(ValidationError)
    })

    it('should throw ValidationError for excessive total days', () => {
      expect(() => {
        validateLeaveRequestData({ totalDays: 400 })
      }).toThrow(ValidationError)
    })

    it('should throw ValidationError for leave request too far in future', () => {
      const farFutureDate = new Date()
      farFutureDate.setFullYear(farFutureDate.getFullYear() + 2)

      expect(() => {
        validateLeaveRequestData({
          startDate: new Date(),
          endDate: farFutureDate,
        })
      }).toThrow(ValidationError)
    })
  })

  describe('handlePrismaError', () => {
    it('should convert P2002 to ConflictError', () => {
      const prismaError = {
        code: 'P2002',
        meta: { target: ['email'] },
      }

      expect(() => handlePrismaError(prismaError)).toThrow(ConflictError)
      
      try {
        handlePrismaError(prismaError)
      } catch (error) {
        expect(error.message).toContain('email already exists')
      }
    })

    it('should convert P2025 to NotFoundError', () => {
      const prismaError = { code: 'P2025' }

      expect(() => handlePrismaError(prismaError)).toThrow(NotFoundError)
    })

    it('should convert P2003 to ValidationError', () => {
      const prismaError = { code: 'P2003' }

      expect(() => handlePrismaError(prismaError)).toThrow(ValidationError)
      
      try {
        handlePrismaError(prismaError)
      } catch (error) {
        expect(error.message).toContain('Referenced record does not exist')
      }
    })

    it('should convert P2014 to ValidationError', () => {
      const prismaError = { code: 'P2014' }

      expect(() => handlePrismaError(prismaError)).toThrow(ValidationError)
    })

    it('should convert P1001 to DatabaseError', () => {
      const prismaError = { code: 'P1001' }

      expect(() => handlePrismaError(prismaError)).toThrow(DatabaseError)
    })

    it('should convert P1008 to DatabaseError', () => {
      const prismaError = { code: 'P1008' }

      expect(() => handlePrismaError(prismaError)).toThrow(DatabaseError)
    })

    it('should convert unknown errors to DatabaseError', () => {
      const prismaError = { code: 'UNKNOWN', message: 'Unknown error' }

      expect(() => handlePrismaError(prismaError)).toThrow(DatabaseError)
      
      try {
        handlePrismaError(prismaError)
      } catch (error) {
        expect(error.message).toBe('Unknown error')
      }
    })
  })

  describe('withRetry', () => {
    it('should succeed on first attempt', async () => {
      const operation = vi.fn().mockResolvedValue('success')
      
      const result = await withRetry(operation)
      
      expect(result).toBe('success')
      expect(operation).toHaveBeenCalledTimes(1)
    })

    it('should retry on failure and eventually succeed', async () => {
      const operation = vi.fn()
        .mockRejectedValueOnce(new Error('First failure'))
        .mockRejectedValueOnce(new Error('Second failure'))
        .mockResolvedValue('success')
      
      const result = await withRetry(operation, 3, 10) // Short delay for testing
      
      expect(result).toBe('success')
      expect(operation).toHaveBeenCalledTimes(3)
    })

    it('should throw error after max retries', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('Persistent failure'))
      
      await expect(withRetry(operation, 2, 10)).rejects.toThrow('Persistent failure')
      expect(operation).toHaveBeenCalledTimes(2)
    })

    it('should use default retry parameters', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('Always fails'))
      
      await expect(withRetry(operation)).rejects.toThrow('Always fails')
      expect(operation).toHaveBeenCalledTimes(3) // Default maxRetries
    })
  })

  describe('Error Classes', () => {
    it('should create DatabaseError with correct properties', () => {
      const error = new DatabaseError('Test message', 'P1001', new Error('Original'))
      
      expect(error.name).toBe('DatabaseError')
      expect(error.message).toBe('Test message')
      expect(error.code).toBe('P1001')
      expect(error.originalError).toBeInstanceOf(Error)
    })

    it('should create ValidationError with correct properties', () => {
      const error = new ValidationError('Invalid field', 'email')
      
      expect(error.name).toBe('ValidationError')
      expect(error.message).toBe('Invalid field')
      expect(error.field).toBe('email')
    })

    it('should create NotFoundError with correct properties', () => {
      const error = new NotFoundError('Employee', '123')
      
      expect(error.name).toBe('NotFoundError')
      expect(error.message).toBe('Employee with id 123 not found')
    })

    it('should create ConflictError with correct properties', () => {
      const error = new ConflictError('Resource already exists')
      
      expect(error.name).toBe('ConflictError')
      expect(error.message).toBe('Resource already exists')
    })
  })
})