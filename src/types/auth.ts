// Authentication Types
export interface AdminUser {
  id: string
  email: string
  name?: string
  role: 'ADMIN'
  createdAt: Date
  updatedAt: Date
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AdminUser
  expiresAt: Date
}

export interface LogoutResponse {
  success: boolean
  message?: string
}

export interface AuthToken {
  token: string
  expiresAt: Date
  refreshToken?: string
}

export interface TokenPayload {
  userId: string
  email: string
  role: string
  iat: number
  exp: number
}

// Authentication State Types
export interface AuthState {
  isAuthenticated: boolean
  user: AdminUser | null
  token: string | null
  loading: boolean
  error: string | null
}

export interface AuthContextType {
  state: AuthState
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  clearError: () => void
}

// Form Types
export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginFormErrors {
  email?: string
  password?: string
  general?: string
}

// Component Props Types
export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void
  loading?: boolean
  errors?: LoginFormErrors
}

export interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

export interface AuthProviderProps {
  children: React.ReactNode
}

// Session Types
export interface SessionData {
  user: AdminUser
  token: string
  expiresAt: Date
}

export interface SessionStorage {
  getSession: () => SessionData | null
  setSession: (session: SessionData) => void
  clearSession: () => void
  isSessionValid: () => boolean
}