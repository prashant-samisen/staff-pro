// Generic API Response Types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  statusCode?: number
}

export interface ApiError {
  error: string
  message: string
  statusCode: number
  details?: any
}

export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface SortParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface FilterParams {
  search?: string
  status?: string
  startDate?: string
  endDate?: string
}

export interface BulkOperationResponse {
  success: boolean
  processed: number
  failed: number
  errors?: string[]
  details?: any[]
}

// HTTP Method Types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// API Endpoint Types
export interface ApiEndpoint {
  method: HttpMethod
  path: string
  params?: Record<string, any>
  body?: any
}

// Request/Response Wrapper Types
export interface RequestOptions {
  headers?: Record<string, string>
  timeout?: number
  retries?: number
}

export interface ResponseMetadata {
  timestamp: string
  requestId?: string
  version?: string
}