// Generic Form Types
export interface FormField<T = any> {
  name: string
  value: T
  error?: string
  touched?: boolean
  required?: boolean
  disabled?: boolean
}

export interface FormState<T = Record<string, any>> {
  data: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isValid: boolean
  isSubmitting: boolean
  isDirty: boolean
}

export interface FormValidation<T = Record<string, any>> {
  validate: (data: T) => Partial<Record<keyof T, string>>
  validateField: (name: keyof T, value: any, data: T) => string | undefined
}

export interface FormHookOptions<T = Record<string, any>> {
  initialData: T
  validation?: FormValidation<T>
  onSubmit: (data: T) => void | Promise<void>
  resetOnSubmit?: boolean
}

// Common Form Field Types
export interface SelectOption<T = string> {
  value: T
  label: string
  disabled?: boolean
  group?: string
}

export interface FormDateRange {
  startDate: Date | null
  endDate: Date | null
}

export interface FileUpload {
  file: File
  preview?: string
  progress?: number
  error?: string
}

// Validation Rule Types
export type ValidationRule<T = any> = {
  required?: boolean | string
  minLength?: number | string
  maxLength?: number | string
  min?: number | string
  max?: number | string
  pattern?: RegExp | string
  email?: boolean | string
  custom?: (value: T, data: any) => string | undefined
}

export type ValidationSchema<T = Record<string, any>> = {
  [K in keyof T]?: ValidationRule<T[K]>
}

// Form Component Props
export interface FormProps<T = Record<string, any>> {
  initialData?: Partial<T>
  onSubmit: (data: T) => void
  onCancel?: () => void
  loading?: boolean
  errors?: Partial<Record<keyof T, string>>
  className?: string
  children?: React.ReactNode
}

export interface InputProps {
  name: string
  label?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export interface SelectProps<T = string> {
  name: string
  label?: string
  value: T
  onChange: (value: T) => void
  options: SelectOption<T>[]
  error?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export interface DatePickerProps {
  name: string
  label?: string
  value: Date | null
  onChange: (date: Date | null) => void
  error?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  className?: string
}

export interface CheckboxProps {
  name: string
  label?: string
  checked: boolean
  onChange: (checked: boolean) => void
  error?: string
  disabled?: boolean
  className?: string
}

export interface TextareaProps {
  name: string
  label?: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  rows?: number
  className?: string
}

// Form Layout Types
export interface FormSectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export interface FormRowProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export interface FormActionsProps {
  submitLabel?: string
  cancelLabel?: string
  onCancel?: () => void
  loading?: boolean
  disabled?: boolean
  className?: string
}

// Validation Helpers
export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export interface FieldValidationResult {
  isValid: boolean
  error?: string
}