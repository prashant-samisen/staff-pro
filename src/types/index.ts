// Employee Types
export * from './employee'

// Attendance Types
export * from './attendance'

// Leave Types
export * from './leave'

// Authentication Types
export * from './auth'

// API Types
export * from './api'

// Report Types
export * from './reports'

// Form Types
export * from './forms'

// Re-export commonly used types for convenience
export type {
  Employee,
  EmployeeStatus,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
} from './employee'

export type {
  AttendanceRecord,
  AttendanceStatus,
  CreateAttendanceRequest,
  UpdateAttendanceRequest,
  AttendanceGridData,
} from './attendance'

export type {
  LeaveRequest,
  LeaveBalance,
  LeaveRequestStatus,
  HalfDayType,
  CreateLeaveRequest,
  LeaveRequestData,
} from './leave'

export type {
  AdminUser,
  LoginRequest,
  LoginResponse,
  AuthState,
} from './auth'

export type {
  ApiResponse,
  ApiError,
  PaginatedResponse,
} from './api'

export type {
  MonthlyAttendanceReport,
  LeaveUsageReport,
  ReportType,
  ReportFormat,
} from './reports'

export type {
  FormState,
  ValidationRule,
  SelectOption,
} from './forms'