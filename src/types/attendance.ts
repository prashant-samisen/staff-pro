import { Employee } from './employee'

// Core Attendance Types
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

// API Request/Response Types
export interface CreateAttendanceRequest {
  employeeId: string
  date: string
  status: AttendanceStatus
}

export interface UpdateAttendanceRequest {
  status: AttendanceStatus
}

export interface AttendanceResponse {
  attendance: AttendanceRecord
}

export interface AttendanceListResponse {
  records: AttendanceRecord[]
  total: number
}

export interface BulkAttendanceRequest {
  employeeIds: string[]
  date: string
  status: AttendanceStatus
}

export interface BulkAttendanceResponse {
  success: boolean
  created: number
  updated: number
  errors?: string[]
}

// Query Parameters
export interface AttendanceQueryParams {
  month?: string // YYYY-MM format
  employeeId?: string
  startDate?: string
  endDate?: string
  status?: AttendanceStatus
}

// Grid and Display Types
export interface AttendanceGridData {
  employee: Employee
  records: Record<string, AttendanceRecord>
  monthlyTotal: number
}

export interface AttendanceGridCell {
  date: string
  record?: AttendanceRecord
  isWeekend: boolean
  isToday: boolean
}

export interface AttendanceMonthData {
  month: string // YYYY-MM
  year: number
  monthName: string
  workingDays: number
  employees: AttendanceGridData[]
}

export interface AttendanceSummary {
  employeeId: string
  employeeName: string
  totalDays: number
  fullDays: number
  halfDays: number
  absentDays: number
  leaveDays: number
  attendancePercentage: number
}

// Form and Component Types
export interface AttendanceFormData {
  employeeId: string
  date: string
  status: AttendanceStatus
}

export interface AttendanceFormErrors {
  employeeId?: string
  date?: string
  status?: string
  general?: string
}

// Component Props Types
export interface AttendanceGridProps {
  monthData: AttendanceMonthData
  onAttendanceChange: (employeeId: string, date: string, status: AttendanceStatus) => void
  loading?: boolean
  readonly?: boolean
}

export interface AttendanceDropdownProps {
  value: AttendanceStatus | undefined
  onChange: (status: AttendanceStatus) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export interface MonthNavigatorProps {
  currentMonth: string
  onMonthChange: (month: string) => void
  minMonth?: string
  maxMonth?: string
}

export interface AttendanceSummaryProps {
  summary: AttendanceSummary[]
  month: string
  loading?: boolean
}

export interface AttendanceStatusIconProps {
  status: AttendanceStatus
  size?: number
  className?: string
}

// Utility Types
export type AttendanceStatusOption = {
  value: AttendanceStatus
  label: string
  daysCount: number
  icon?: string
  color?: string
}

export interface DateRange {
  startDate: Date
  endDate: Date
}