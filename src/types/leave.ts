import { Employee } from './employee'

// Core Leave Types
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

// API Request/Response Types
export interface CreateLeaveRequest {
  employeeId: string
  startDate: string
  endDate: string
  halfDayStart?: HalfDayType
  halfDayEnd?: HalfDayType
  reason: string
}

export interface UpdateLeaveRequest {
  startDate?: string
  endDate?: string
  halfDayStart?: HalfDayType
  halfDayEnd?: HalfDayType
  reason?: string
}

export interface LeaveRequestResponse {
  leaveRequest: LeaveRequest
}

export interface LeaveRequestsResponse {
  requests: LeaveRequest[]
  total: number
  pending: number
  approved: number
  rejected: number
}

export interface ApproveLeaveRequest {
  reason?: string
}

export interface RejectLeaveRequest {
  reason: string
}

export interface LeaveApprovalResponse {
  success: boolean
  message?: string
  updatedAttendance?: number
}

export interface LeaveBalanceResponse {
  balance: LeaveBalance
}

export interface LeaveBalancesResponse {
  balances: LeaveBalance[]
}

export interface UpdateLeaveBalanceRequest {
  allocatedDays?: number
  adjustment?: number // positive or negative adjustment
  reason?: string
}

// Query Parameters
export interface LeaveRequestQueryParams {
  status?: LeaveRequestStatus
  employeeId?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

// Email Parsing Types
export interface LeaveRequestData {
  employeeName: string | null
  startDate: string
  endDate: string
  halfDayStart?: 'morning' | 'afternoon'
  halfDayEnd?: 'morning' | 'afternoon'
  totalDays: number
  reason: string
}

export interface EmailWebhookPayload {
  from: string
  subject: string
  body: string
  timestamp: string
  messageId?: string
}

export interface EmailParsingResult {
  success: boolean
  data?: LeaveRequestData
  error?: string
  confidence?: number
}

// Form and Validation Types
export interface LeaveRequestFormData {
  employeeId: string
  startDate: string
  endDate: string
  halfDayStart?: HalfDayType
  halfDayEnd?: HalfDayType
  reason: string
}

export interface LeaveRequestFormErrors {
  employeeId?: string
  startDate?: string
  endDate?: string
  halfDayStart?: string
  halfDayEnd?: string
  reason?: string
  dateRange?: string
  balance?: string
  general?: string
}

export interface LeaveBalanceFormData {
  allocatedDays: number
  adjustment?: number
  reason?: string
}

export interface LeaveBalanceFormErrors {
  allocatedDays?: string
  adjustment?: string
  reason?: string
  general?: string
}

// Component Props Types
export interface LeaveRequestQueueProps {
  requests: LeaveRequest[]
  onApprove: (requestId: string, reason?: string) => void
  onReject: (requestId: string, reason: string) => void
  loading?: boolean
}

export interface LeaveRequestCardProps {
  request: LeaveRequest
  onApprove: (reason?: string) => void
  onReject: (reason: string) => void
  showActions?: boolean
  compact?: boolean
}

export interface LeaveApprovalModalProps {
  request: LeaveRequest | null
  isOpen: boolean
  onClose: () => void
  onApprove: (reason?: string) => void
  onReject: (reason: string) => void
  loading?: boolean
}

export interface LeaveBalanceDisplayProps {
  balance: LeaveBalance
  showDetails?: boolean
  editable?: boolean
  onUpdate?: (data: LeaveBalanceFormData) => void
}

export interface LeaveRequestFormProps {
  employees: Employee[]
  onSubmit: (data: LeaveRequestFormData) => void
  onCancel: () => void
  initialData?: Partial<LeaveRequestFormData>
  loading?: boolean
  errors?: LeaveRequestFormErrors
}

export interface LeaveCalendarProps {
  requests: LeaveRequest[]
  month: string
  onRequestClick?: (request: LeaveRequest) => void
  readonly?: boolean
}

// Utility Types
export interface LeaveRequestSummary {
  employeeId: string
  employeeName: string
  totalRequests: number
  pendingRequests: number
  approvedDays: number
  rejectedRequests: number
  remainingBalance: number
}

export interface LeavePeriodStats {
  period: string
  totalRequests: number
  approvedRequests: number
  rejectedRequests: number
  totalDaysApproved: number
  averageDaysPerRequest: number
}

export type LeaveRequestStatusFilter = LeaveRequestStatus | 'ALL'

export interface LeaveRequestFilters {
  status: LeaveRequestStatusFilter
  employeeId?: string
  dateRange?: {
    start: string
    end: string
  }
}