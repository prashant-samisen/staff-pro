import { Employee } from './employee'

export type HalfDayType = 'MORNING' | 'AFTERNOON'
export type LeaveRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface LeaveRequest {
  id: string
  employeeId: string
  startDate: Date
  endDate: Date
  halfDayStart?: HalfDayType
  halfDayEnd?: HalfDayType
  totalDays: number
  reason: string
  status: LeaveRequestStatus
  createdAt: Date
  updatedAt: Date
  employee?: Employee
}

export interface LeaveBalance {
  id: string
  employeeId: string
  allocatedDays: number
  usedDays: number
  updatedAt: Date
  employee?: Employee
}

export interface CreateLeaveRequest {
  employeeId: string
  startDate: string
  endDate: string
  halfDayStart?: HalfDayType
  halfDayEnd?: HalfDayType
  reason: string
}

export interface LeaveRequestData {
  employeeName: string | null
  startDate: string
  endDate: string
  halfDayStart?: 'morning' | 'afternoon'
  halfDayEnd?: 'morning' | 'afternoon'
  totalDays: number
  reason: string
}