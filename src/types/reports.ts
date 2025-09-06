import { Employee } from './employee'
import { AttendanceRecord, AttendanceSummary } from './attendance'
import { LeaveRequest, LeaveBalance } from './leave'

// Report Types
export type ReportType = 'ATTENDANCE' | 'LEAVE' | 'EMPLOYEE_SUMMARY' | 'MONTHLY_OVERVIEW'
export type ReportFormat = 'JSON' | 'CSV' | 'PDF'
export type ReportPeriod = 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM'

// Monthly Attendance Report
export interface MonthlyAttendanceReport {
  month: string // YYYY-MM
  year: number
  monthName: string
  workingDays: number
  totalEmployees: number
  summaries: AttendanceSummary[]
  overallStats: {
    totalWorkingDays: number
    totalPossibleDays: number
    overallAttendanceRate: number
    averageAttendanceRate: number
  }
  generatedAt: Date
}

// Leave Usage Report
export interface LeaveUsageReport {
  period: {
    startDate: string
    endDate: string
    type: ReportPeriod
  }
  employees: LeaveEmployeeReport[]
  overallStats: {
    totalLeaveRequests: number
    totalApprovedDays: number
    totalPendingRequests: number
    totalRejectedRequests: number
    averageLeaveDaysPerEmployee: number
    mostCommonLeaveReason: string
  }
  generatedAt: Date
}

export interface LeaveEmployeeReport {
  employee: Employee
  balance: LeaveBalance
  requests: LeaveRequest[]
  stats: {
    totalRequests: number
    approvedRequests: number
    rejectedRequests: number
    pendingRequests: number
    totalApprovedDays: number
    remainingBalance: number
    utilizationRate: number // percentage of allocated leave used
  }
}

// Employee Summary Report
export interface EmployeeSummaryReport {
  employee: Employee
  period: {
    startDate: string
    endDate: string
  }
  attendance: {
    totalWorkingDays: number
    daysPresent: number
    daysAbsent: number
    halfDays: number
    leaveDays: number
    attendanceRate: number
  }
  leave: {
    totalRequests: number
    approvedDays: number
    remainingBalance: number
    utilizationRate: number
  }
  generatedAt: Date
}

// Report Generation Types
export interface ReportRequest {
  type: ReportType
  format: ReportFormat
  period: ReportPeriod
  startDate?: string
  endDate?: string
  employeeIds?: string[]
  filters?: ReportFilters
}

export interface ReportFilters {
  includeInactive?: boolean
  minAttendanceRate?: number
  maxAttendanceRate?: number
  leaveStatus?: 'APPROVED' | 'PENDING' | 'REJECTED' | 'ALL'
  departments?: string[]
}

export interface ReportResponse {
  reportId: string
  type: ReportType
  format: ReportFormat
  status: 'GENERATING' | 'COMPLETED' | 'FAILED'
  downloadUrl?: string
  data?: any
  error?: string
  generatedAt?: Date
  expiresAt?: Date
}

// API Request/Response Types
export interface GenerateReportRequest {
  type: ReportType
  format: ReportFormat
  period: ReportPeriod
  startDate?: string
  endDate?: string
  employeeIds?: string[]
  filters?: ReportFilters
}

export interface ReportListResponse {
  reports: ReportResponse[]
  total: number
}

export interface DownloadReportResponse {
  url: string
  filename: string
  contentType: string
  size: number
}

// Component Props Types
export interface ReportGeneratorProps {
  onGenerate: (request: ReportRequest) => void
  loading?: boolean
  availableEmployees: Employee[]
}

export interface ReportListProps {
  reports: ReportResponse[]
  onDownload: (reportId: string) => void
  onDelete: (reportId: string) => void
  loading?: boolean
}

export interface MonthlyReportProps {
  report: MonthlyAttendanceReport
  onExport?: (format: ReportFormat) => void
  interactive?: boolean
}

export interface LeaveReportProps {
  report: LeaveUsageReport
  onExport?: (format: ReportFormat) => void
  onEmployeeClick?: (employeeId: string) => void
}

export interface ReportFiltersProps {
  filters: ReportFilters
  onChange: (filters: ReportFilters) => void
  availableEmployees: Employee[]
}

// Chart and Visualization Types
export interface ChartDataPoint {
  label: string
  value: number
  color?: string
  metadata?: any
}

export interface AttendanceChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string[]
  }[]
}

export interface LeaveChartData {
  monthlyUsage: ChartDataPoint[]
  leaveTypes: ChartDataPoint[]
  employeeComparison: ChartDataPoint[]
}

// Export Types
export interface ExportOptions {
  format: ReportFormat
  filename?: string
  includeCharts?: boolean
  includeRawData?: boolean
}

export interface CSVExportData {
  headers: string[]
  rows: (string | number)[][]
  filename: string
}

export interface PDFExportOptions {
  title: string
  subtitle?: string
  includeCharts: boolean
  pageSize: 'A4' | 'LETTER'
  orientation: 'portrait' | 'landscape'
}

// Utility Types
export interface ReportMetadata {
  generatedBy: string
  generatedAt: Date
  version: string
  parameters: ReportRequest
  recordCount: number
}

export interface ReportValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
}