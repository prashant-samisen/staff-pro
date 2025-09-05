# Requirements Document

## Introduction

The Simple Attendance Tracker is a web-based application designed to streamline attendance management for small to medium-sized companies. The system focuses on half-day attendance tracking, automated leave management through email parsing, and comprehensive reporting. Built with Next.js, the application provides an intuitive admin dashboard for managing employee attendance, processing leave requests, and generating monthly reports with accurate half-day calculations.

## Requirements

### Requirement 1: Admin Authentication and Dashboard

**User Story:** As an admin, I want to securely access the attendance system through a login interface, so that I can manage employee attendance data with proper authorization.

#### Acceptance Criteria

1. WHEN an admin visits the application THEN the system SHALL display a login form
2. WHEN an admin enters valid credentials THEN the system SHALL authenticate and redirect to the dashboard
3. WHEN an admin enters invalid credentials THEN the system SHALL display an error message and remain on login page
4. WHEN an admin is authenticated THEN the system SHALL display the main dashboard with navigation options
5. IF an admin session expires THEN the system SHALL redirect to the login page

### Requirement 2: Employee Management

**User Story:** As an admin, I want to manage employee information including names, emails, and leave allocations, so that I can maintain an accurate employee roster for attendance tracking.

#### Acceptance Criteria

1. WHEN an admin accesses employee management THEN the system SHALL display a list of all employees
2. WHEN an admin clicks "Add Employee" THEN the system SHALL display a form with fields for name, email, and annual leave days
3. WHEN an admin submits a valid employee form THEN the system SHALL create the employee record and update the roster
4. WHEN an admin clicks "Edit" on an employee THEN the system SHALL display a pre-populated form for modification
5. WHEN an admin updates employee information THEN the system SHALL save changes and reflect them in the roster
6. WHEN an admin attempts to delete an employee THEN the system SHALL prompt for confirmation before removal

### Requirement 3: Daily Attendance Management

**User Story:** As an admin, I want to mark daily attendance for employees using a simple dropdown system with half-day options, so that I can accurately track work hours and calculate monthly totals.

#### Acceptance Criteria

1. WHEN an admin accesses the attendance grid THEN the system SHALL display employees in rows and weekdays in columns
2. WHEN an admin clicks on a day cell THEN the system SHALL display a dropdown with options: Full Day (1.0), Morning Half Day (0.5), Afternoon Half Day (0.5), Absent (0.0), On Leave
3. WHEN an admin selects an attendance status THEN the system SHALL save the selection and update the running total
4. WHEN attendance is marked as "Full Day" THEN the system SHALL record 1.0 days worked
5. WHEN attendance is marked as "Morning Half Day" or "Afternoon Half Day" THEN the system SHALL record 0.5 days worked
6. WHEN attendance is marked as "Absent" THEN the system SHALL record 0.0 days worked
7. WHEN attendance is marked as "On Leave" THEN the system SHALL record 0.0 days worked but track separately from absences
8. WHEN viewing the attendance grid THEN the system SHALL display running monthly totals for each employee

### Requirement 4: Monthly Attendance View and Navigation

**User Story:** As an admin, I want to navigate between different months and view attendance data in a monthly format, so that I can review historical attendance patterns and plan ahead.

#### Acceptance Criteria

1. WHEN an admin accesses attendance view THEN the system SHALL default to the current month
2. WHEN an admin clicks month navigation arrows THEN the system SHALL display the selected month's attendance data
3. WHEN viewing any month THEN the system SHALL show all working days with weekend highlighting or exclusion
4. WHEN an admin performs bulk entry THEN the system SHALL allow marking multiple employees for the same day efficiently
5. WHEN viewing monthly data THEN the system SHALL display accurate totals accounting for half-day calculations

### Requirement 5: Email-Based Leave Request Processing

**User Story:** As an admin, I want the system to automatically parse leave request emails and create leave requests, so that I can process employee leave efficiently without manual data entry.

#### Acceptance Criteria

1. WHEN a leave request email is received THEN the system SHALL parse the email content using AI
2. WHEN parsing an email THEN the system SHALL extract employee name, start date, end date, half-day specifications, and reason
3. WHEN parsing detects half-day requests THEN the system SHALL correctly identify morning or afternoon specifications
4. WHEN parsing is complete THEN the system SHALL calculate total leave days including half-day increments (0.5, 1.5, 2.5, etc.)
5. WHEN email parsing succeeds THEN the system SHALL create a leave request record with "pending" status
6. IF email parsing fails THEN the system SHALL log the error and notify admin for manual processing

### Requirement 6: Leave Approval and Management

**User Story:** As an admin, I want to review and approve leave requests through a queue interface, so that I can manage employee leave efficiently and maintain accurate records.

#### Acceptance Criteria

1. WHEN an admin accesses leave management THEN the system SHALL display a queue of pending leave requests
2. WHEN an admin views a leave request THEN the system SHALL show employee name, dates, half-day details, total days, and reason
3. WHEN an admin approves a leave request THEN the system SHALL update the request status to "approved"
4. WHEN a leave request is approved THEN the system SHALL automatically mark corresponding attendance dates as "On Leave"
5. WHEN an admin rejects a leave request THEN the system SHALL update the request status to "rejected"
6. WHEN leave spans multiple days with half-day start/end THEN the system SHALL correctly mark each affected date

### Requirement 7: Leave Balance Tracking

**User Story:** As an admin, I want to track employee leave balances showing allocated versus used days, so that I can ensure employees don't exceed their annual leave allowance.

#### Acceptance Criteria

1. WHEN an employee is created THEN the system SHALL initialize their leave balance with allocated annual days
2. WHEN leave is approved THEN the system SHALL deduct the calculated days from the employee's available balance
3. WHEN viewing employee information THEN the system SHALL display current leave balance (allocated vs used vs remaining)
4. WHEN leave balance reaches zero THEN the system SHALL flag future leave requests for admin attention
5. IF an admin adjusts leave allocation THEN the system SHALL update the balance calculations accordingly

### Requirement 8: Monthly Attendance Reports

**User Story:** As an admin, I want to generate monthly attendance reports with accurate half-day calculations, so that I can review employee attendance patterns and export data for payroll processing.

#### Acceptance Criteria

1. WHEN an admin requests a monthly report THEN the system SHALL generate a summary showing each employee's attendance data
2. WHEN generating reports THEN the system SHALL calculate attendance percentages based on working days
3. WHEN displaying totals THEN the system SHALL show full days, half days, absences, and leave days separately
4. WHEN calculating percentages THEN the system SHALL use accurate half-day arithmetic (0.5 increments)
5. WHEN an admin requests export THEN the system SHALL generate CSV files with all attendance data
6. WHEN exporting data THEN the system SHALL include employee names, dates, status, and calculated day values

### Requirement 9: Leave Usage Reports

**User Story:** As an admin, I want to generate reports showing leave usage patterns and balances, so that I can monitor leave trends and plan for coverage needs.

#### Acceptance Criteria

1. WHEN an admin requests leave reports THEN the system SHALL display leave usage by employee for selected periods
2. WHEN generating leave reports THEN the system SHALL show approved leave days, pending requests, and remaining balances
3. WHEN viewing leave patterns THEN the system SHALL highlight employees approaching leave limits
4. WHEN exporting leave data THEN the system SHALL include all leave request details and balance calculations
5. WHEN analyzing trends THEN the system SHALL provide monthly and yearly leave usage summaries

### Requirement 10: System Performance and Scalability

**User Story:** As an admin managing a growing company, I want the system to handle multiple employees efficiently, so that attendance management remains fast and responsive as the organization scales.

#### Acceptance Criteria

1. WHEN the system has 50+ employees THEN response times SHALL remain under 2 seconds for all operations
2. WHEN performing bulk attendance entry THEN the system SHALL process updates without noticeable delays
3. WHEN generating monthly reports THEN the system SHALL complete processing within 5 seconds
4. WHEN multiple admins access the system THEN concurrent operations SHALL not cause data conflicts
5. WHEN the database grows with historical data THEN query performance SHALL remain consistent