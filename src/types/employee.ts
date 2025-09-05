export interface Employee {
  id: string
  name: string
  email: string
  annualLeaveDays: number
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: Date
  updatedAt: Date
}

export interface CreateEmployeeRequest {
  name: string
  email: string
  annualLeaveDays: number
}

export interface UpdateEmployeeRequest {
  name?: string
  email?: string
  annualLeaveDays?: number
  status?: 'ACTIVE' | 'INACTIVE'
}