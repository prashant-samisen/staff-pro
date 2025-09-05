# Design Document

## Overview

The Simple Attendance Tracker is a Next.js 13+ web application that provides streamlined attendance management with half-day tracking capabilities. The system uses a modern tech stack including Next.js App Router, Prisma ORM, OpenAI for email parsing, and a PostgreSQL database. The architecture follows a clean separation of concerns with API routes, reusable components, and utility libraries.

## Architecture

### Technology Stack
- **Frontend**: Next.js 13+ with App Router, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **AI Integration**: OpenAI API for email parsing
- **Authentication**: NextAuth.js or custom JWT implementation
- **Email Processing**: Webhook integration (SendGrid/Mailgun)

### Project Structure
```
staff-pro/
├── src/
│   ├── app/                    # Next.js 13+ app directory
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── employees/     # Employee CRUD operations
│   │   │   ├── attendance/    # Attendance management
│   │   │   ├── leave/         # Leave request processing
│   │   │   ├── reports/       # Report generation
│   │   │   └── webhooks/      # Email webhook handlers
│   │   ├── dashboard/         # Main dashboard pages
│   │   │   ├── page.tsx       # Dashboard home
│   │   │   ├── employees/     # Employee management
│   │   │   ├── attendance/    # Attendance grid
│   │   │   ├── leave/         # Leave management
│   │   │   └── reports/       # Reports interface
│   │   ├── login/             # Authentication pages
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing/redirect page
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components
│   │   ├── attendance/       # Attendance-specific components
│   │   ├── employees/        # Employee management components
│   │   ├── leave/            # Leave management components
│   │   └── reports/          # Report components
│   ├── lib/                  # Utility libraries
│   │   ├── db.ts            # Prisma client configuration
│   │   ├── ai.ts            # OpenAI integration
│   │   ├── auth.ts          # Authentication utilities
│   │   ├── utils.ts         # General utilities
│   │   └── validations.ts   # Data validation schemas
│   └── types/               # TypeScript type definitions
│       ├── attendance.ts    # Attendance-related types
│       ├── employee.ts      # Employee types
│       └── leave.ts         # Leave request types
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
├── public/                  # Static assets
├── .env.example            # Environment variables template
└── package.json            # Dependencies and scripts
```

## Components and Interfaces

### Core Components

#### 1. Authentication System
- **LoginForm**: Handles admin authentication with email/password
- **AuthProvider**: Context provider for authentication state
- **ProtectedRoute**: HOC for route protection

#### 2. Employee Management
- **EmployeeList**: Displays employee roster with CRUD actions
- **EmployeeForm**: Form for creating/editing employee records
- **EmployeeCard**: Individual employee display component

#### 3. Attendance Management
- **AttendanceGrid**: Main grid interface for daily attendance marking
- **AttendanceDropdown**: Dropdown selector for attendance status
- **MonthNavigator**: Navigation component for switching months
- **AttendanceSummary**: Displays running totals and statistics

#### 4. Leave Management
- **LeaveRequestQueue**: List of pending leave requests
- **LeaveRequestCard**: Individual leave request display
- **LeaveApprovalModal**: Modal for approving/rejecting requests
- **LeaveBalanceDisplay**: Shows employee leave balances

#### 5. Reporting
- **MonthlyReport**: Generates monthly attendance summaries
- **LeaveReport**: Leave usage and balance reports
- **ExportButton**: CSV export functionality

### API Interface Design

#### Authentication Endpoints
```typescript
POST /api/auth/login
  Body: { email: string, password: string }
  Response: { token: string, user: AdminUser }

POST /api/auth/logout
  Response: { success: boolean }
```

#### Employee Management
```typescript
GET /api/employees
  Response: Employee[]

POST /api/employees
  Body: CreateEmployeeRequest
  Response: Employee

PUT /api/employees/[id]
  Body: UpdateEmployeeRequest
  Response: Employee

DELETE /api/employees/[id]
  Response: { success: boolean }
```

#### Attendance Management
```typescript
GET /api/attendance?month=YYYY-MM&employeeId=optional
  Response: AttendanceRecord[]

POST /api/attendance
  Body: { employeeId: string, date: string, status: AttendanceStatus }
  Response: AttendanceRecord

PUT /api/attendance/[id]
  Body: { status: AttendanceStatus }
  Response: AttendanceRecord
```

#### Leave Management
```typescript
GET /api/leave/requests
  Response: LeaveRequest[]

POST /api/leave/approve/[id]
  Response: { success: boolean }

POST /api/leave/reject/[id]
  Body: { reason?: string }
  Response: { success: boolean }

POST /api/webhooks/email
  Body: EmailWebhookPayload
  Response: { success: boolean }
```

## Data Models

### Database Schema (Prisma)

```prisma
model Employee {
  id                String            @id @default(cuid())
  name              String
  email             String            @unique
  annualLeaveDays   Int               @default(25)
  status            EmployeeStatus    @default(ACTIVE)
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  
  attendanceRecords AttendanceRecord[]
  leaveRequests     LeaveRequest[]
  leaveBalance      LeaveBalance?
  
  @@map("employees")
}

model AttendanceRecord {
  id         String           @id @default(cuid())
  employeeId String
  date       DateTime         @db.Date
  status     AttendanceStatus
  daysCount  Float            // 0.0, 0.5, 1.0
  createdAt  DateTime         @default(now())
  updatedAt  DateTime         @updatedAt
  
  employee   Employee         @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  
  @@unique([employeeId, date])
  @@map("attendance_records")
}

model LeaveRequest {
  id            String            @id @default(cuid())
  employeeId    String
  startDate     DateTime          @db.Date
  endDate       DateTime          @db.Date
  halfDayStart  HalfDayType?      // morning, afternoon, null
  halfDayEnd    HalfDayType?      // morning, afternoon, null
  totalDays     Float             // calculated total including half days
  reason        String
  status        LeaveRequestStatus @default(PENDING)
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt
  
  employee      Employee          @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  
  @@map("leave_requests")
}

model LeaveBalance {
  id            String   @id @default(cuid())
  employeeId    String   @unique
  allocatedDays Float
  usedDays      Float    @default(0)
  updatedAt     DateTime @updatedAt
  
  employee      Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  
  @@map("leave_balances")
}

enum EmployeeStatus {
  ACTIVE
  INACTIVE
}

enum AttendanceStatus {
  FULL
  HALF_MORNING
  HALF_AFTERNOON
  ABSENT
  LEAVE
}

enum HalfDayType {
  MORNING
  AFTERNOON
}

enum LeaveRequestStatus {
  PENDING
  APPROVED
  REJECTED
}
```

### TypeScript Interfaces

```typescript
// Employee Types
interface Employee {
  id: string;
  name: string;
  email: string;
  annualLeaveDays: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

// Attendance Types
interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: Date;
  status: 'FULL' | 'HALF_MORNING' | 'HALF_AFTERNOON' | 'ABSENT' | 'LEAVE';
  daysCount: number;
  employee?: Employee;
}

// Leave Types
interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: Date;
  endDate: Date;
  halfDayStart?: 'MORNING' | 'AFTERNOON';
  halfDayEnd?: 'MORNING' | 'AFTERNOON';
  totalDays: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  employee?: Employee;
}
```

## Error Handling

### API Error Responses
```typescript
interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  details?: any;
}
```

### Error Handling Strategy
1. **Client-side**: Toast notifications for user feedback
2. **Server-side**: Structured error logging with context
3. **Database**: Transaction rollbacks for data consistency
4. **AI Integration**: Fallback to manual processing on AI failures

### Common Error Scenarios
- Invalid attendance date (weekends/holidays)
- Duplicate attendance records
- Leave request conflicts
- Email parsing failures
- Authentication token expiration

## Testing Strategy

### Unit Testing
- **Components**: React Testing Library for UI components
- **Utilities**: Jest for business logic functions
- **API Routes**: Supertest for endpoint testing
- **Database**: Prisma test database with seed data

### Integration Testing
- **Authentication Flow**: Login to dashboard navigation
- **Attendance Workflow**: Employee creation to attendance marking
- **Leave Processing**: Email parsing to approval workflow
- **Report Generation**: Data input to CSV export

### Test Data Management
```typescript
// Test fixtures for consistent testing
const testEmployee = {
  name: "John Doe",
  email: "john@company.com",
  annualLeaveDays: 25
};

const testAttendance = {
  date: new Date('2024-01-15'),
  status: 'FULL' as const,
  daysCount: 1.0
};
```

### Performance Testing
- Load testing with 50+ employees
- Concurrent attendance updates
- Large dataset report generation
- Email webhook processing under load

## AI Integration Design

### Email Parsing System
```typescript
interface EmailParsingPrompt {
  systemPrompt: string;
  userContent: string;
  expectedFormat: LeaveRequestData;
}

interface LeaveRequestData {
  employeeName: string;
  startDate: string;
  endDate: string;
  halfDayStart?: 'morning' | 'afternoon';
  halfDayEnd?: 'morning' | 'afternoon';
  totalDays: number;
  reason: string;
}
```

### AI Prompt Template
```
You are an AI assistant that parses employee leave request emails.

Extract the following information from the email:
- Employee name (if mentioned)
- Start date (format: YYYY-MM-DD)
- End date (format: YYYY-MM-DD)
- Half day specifications (morning/afternoon for start/end dates)
- Reason for leave
- Calculate total days (count half days as 0.5)

Return as JSON matching this schema:
{
  "employeeName": string | null,
  "startDate": string,
  "endDate": string,
  "halfDayStart": "morning" | "afternoon" | null,
  "halfDayEnd": "morning" | "afternoon" | null,
  "totalDays": number,
  "reason": string
}

Email content: {emailContent}
```

### Fallback Mechanisms
1. **AI Parsing Failure**: Queue for manual review
2. **Employee Name Mismatch**: Admin disambiguation interface
3. **Date Parsing Issues**: Default to full day assumptions
4. **Validation Errors**: Detailed error messages for admin correction

## Security Considerations

### Authentication & Authorization
- JWT tokens with expiration
- Role-based access (admin-only for initial version)
- Session management with secure cookies
- Password hashing with bcrypt

### Data Protection
- Input validation and sanitization
- SQL injection prevention via Prisma
- XSS protection with Content Security Policy
- HTTPS enforcement in production

### API Security
- Rate limiting on endpoints
- Request size limits
- CORS configuration
- Webhook signature verification

## Performance Optimization

### Database Optimization
- Indexed queries on frequently accessed fields
- Efficient pagination for large datasets
- Connection pooling for concurrent requests
- Query optimization for reporting functions

### Frontend Optimization
- Component lazy loading
- Memoization for expensive calculations
- Optimistic updates for better UX
- Efficient re-rendering with React keys

### Caching Strategy
- Server-side caching for reports
- Client-side caching for employee data
- CDN for static assets
- Database query result caching