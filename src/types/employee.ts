// Core Employee Types
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE'

export interface Employee {
  id: string
  name: string
  email: string
  annualLeaveDays: number
  status: EmployeeStatus
  createdAt: Date
  updatedAt: Date
}

// API Request/Response Types
export interface CreateEmployeeRequest {
  name: string
  email: string
  annualLeaveDays: number
}

export interface UpdateEmployeeRequest {
  name?: string
  email?: string
  annualLeaveDays?: number
  status?: EmployeeStatus
}

export interface EmployeeResponse {
  employee: Employee
}

export interface EmployeesResponse {
  employees: Employee[]
  total: number
  page?: number
  limit?: number
}

export interface DeleteEmployeeResponse {
  success: boolean
  message?: string
}

// Query Parameters
export interface EmployeeQueryParams {
  page?: number
  limit?: number
  status?: EmployeeStatus
  search?: string
}

// Form Validation Types
export interface EmployeeFormData {
  name: string
  email: string
  annualLeaveDays: number
  status?: EmployeeStatus
}

export interface EmployeeFormErrors {
  name?: string
  email?: string
  annualLeaveDays?: string
  status?: string
  general?: string
}

// Component Props Types
export interface EmployeeListProps {
  employees: Employee[]
  onEdit: (employee: Employee) => void
  onDelete: (employeeId: string) => void
  loading?: boolean
}

export interface EmployeeFormProps {
  employee?: Employee
  onSubmit: (data: EmployeeFormData) => void
  onCancel: () => void
  loading?: boolean
  errors?: EmployeeFormErrors
}

export interface EmployeeCardProps {
  employee: Employee
  onEdit: () => void
  onDelete: () => void
  showActions?: boolean
}