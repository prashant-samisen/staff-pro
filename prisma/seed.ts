import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data
  await prisma.leaveRequest.deleteMany()
  await prisma.leaveBalance.deleteMany()
  await prisma.attendanceRecord.deleteMany()
  await prisma.employee.deleteMany()

  // Create sample employees
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@company.com',
        annualLeaveDays: 25,
        status: 'ACTIVE',
      },
    }),
    prisma.employee.create({
      data: {
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        annualLeaveDays: 30,
        status: 'ACTIVE',
      },
    }),
    prisma.employee.create({
      data: {
        name: 'Mike Johnson',
        email: 'mike.johnson@company.com',
        annualLeaveDays: 25,
        status: 'ACTIVE',
      },
    }),
    prisma.employee.create({
      data: {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@company.com',
        annualLeaveDays: 28,
        status: 'ACTIVE',
      },
    }),
    prisma.employee.create({
      data: {
        name: 'David Brown',
        email: 'david.brown@company.com',
        annualLeaveDays: 25,
        status: 'INACTIVE',
      },
    }),
  ])

  console.log(`✅ Created ${employees.length} employees`)

  // Create leave balances for all employees
  const leaveBalances = await Promise.all(
    employees.map((employee) =>
      prisma.leaveBalance.create({
        data: {
          employeeId: employee.id,
          allocatedDays: employee.annualLeaveDays,
          usedDays: 0,
        },
      })
    )
  )

  console.log(`✅ Created ${leaveBalances.length} leave balance records`)

  // Create sample attendance records for the current month
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  
  // Get working days for current month (excluding weekends)
  const workingDays: Date[] = []
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day)
    const dayOfWeek = date.getDay()
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays.push(date)
    }
  }

  // Create attendance records for active employees
  const activeEmployees = employees.filter(emp => emp.status === 'ACTIVE')
  const attendanceRecords = []

  for (const employee of activeEmployees) {
    for (let i = 0; i < Math.min(workingDays.length, 15); i++) { // Only first 15 working days
      const date = workingDays[i]
      const random = Math.random()
      
      let status: 'FULL' | 'HALF_MORNING' | 'HALF_AFTERNOON' | 'ABSENT' | 'LEAVE'
      let daysCount: number
      
      if (random < 0.7) {
        status = 'FULL'
        daysCount = 1.0
      } else if (random < 0.85) {
        status = Math.random() < 0.5 ? 'HALF_MORNING' : 'HALF_AFTERNOON'
        daysCount = 0.5
      } else if (random < 0.95) {
        status = 'ABSENT'
        daysCount = 0.0
      } else {
        status = 'LEAVE'
        daysCount = 0.0
      }

      const record = await prisma.attendanceRecord.create({
        data: {
          employeeId: employee.id,
          date: date,
          status: status,
          daysCount: daysCount,
        },
      })
      
      attendanceRecords.push(record)
    }
  }

  console.log(`✅ Created ${attendanceRecords.length} attendance records`)

  // Create sample leave requests
  const leaveRequests = await Promise.all([
    prisma.leaveRequest.create({
      data: {
        employeeId: employees[0].id, // John Doe
        startDate: new Date(currentYear, currentMonth + 1, 5), // Next month
        endDate: new Date(currentYear, currentMonth + 1, 7),
        halfDayStart: null,
        halfDayEnd: null,
        totalDays: 3.0,
        reason: 'Family vacation',
        status: 'PENDING',
      },
    }),
    prisma.leaveRequest.create({
      data: {
        employeeId: employees[1].id, // Jane Smith
        startDate: new Date(currentYear, currentMonth + 1, 10),
        endDate: new Date(currentYear, currentMonth + 1, 10),
        halfDayStart: 'MORNING',
        halfDayEnd: null,
        totalDays: 0.5,
        reason: 'Medical appointment',
        status: 'APPROVED',
      },
    }),
    prisma.leaveRequest.create({
      data: {
        employeeId: employees[2].id, // Mike Johnson
        startDate: new Date(currentYear, currentMonth + 1, 15),
        endDate: new Date(currentYear, currentMonth + 1, 16),
        halfDayStart: 'AFTERNOON',
        halfDayEnd: 'MORNING',
        totalDays: 1.0,
        reason: 'Personal matters',
        status: 'PENDING',
      },
    }),
    prisma.leaveRequest.create({
      data: {
        employeeId: employees[3].id, // Sarah Wilson
        startDate: new Date(currentYear, currentMonth - 1, 20), // Last month
        endDate: new Date(currentYear, currentMonth - 1, 22),
        halfDayStart: null,
        halfDayEnd: null,
        totalDays: 3.0,
        reason: 'Sick leave',
        status: 'APPROVED',
      },
    }),
  ])

  console.log(`✅ Created ${leaveRequests.length} leave requests`)

  // Update leave balances for approved leave requests
  const approvedLeave = leaveRequests.filter(req => req.status === 'APPROVED')
  for (const leave of approvedLeave) {
    await prisma.leaveBalance.update({
      where: { employeeId: leave.employeeId },
      data: {
        usedDays: {
          increment: leave.totalDays,
        },
      },
    })
  }

  console.log(`✅ Updated leave balances for approved requests`)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })