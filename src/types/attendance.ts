import { Employee } from './employee'

export type AttendanceStatus = 'FULL' | 'HALF_MORNING' | 'HALF_AFTERNOON' | 'ABSENT' | 'LEAVE'

export interface AttendanceRecord {
  id: string
  employeeId: string
  date: Date
  status: AttendanceStatus
  daysCount: number
  createdAt: Date
  updatedAt: Date
  employee?: Employee
}

export interface CreateAttendanceRequest {
  employeeId: string
  date: string
  status: AttendanceStatus
}

export interface UpdateAttendanceRequest {
  status: AttendanceStatus
}

export interface AttendanceGridData {
  employee: Employee
  records: Record<string, AttendanceRecord>
  monthlyTotal: number
}