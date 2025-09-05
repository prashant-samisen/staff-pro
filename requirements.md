Perfect! Half-day increments make this much simpler. Here's the revised specs:

## Simple Attendance Tracker - Half-Day System (1 Month)

### Core Features (Simplified):

#### 1. Admin Dashboard (Week 1)
- **Single admin login**
- **Employee roster management**
- **Daily attendance grid** (Present Full Day / Present Half Day / Absent / On Leave)
- **Monthly attendance summary**

#### 2. Half-Day Attendance Management (Week 2)
- **Simple dropdown selection per employee per day:**
  - Full Day (1.0)
  - Morning Half Day (0.5)
  - Afternoon Half Day (0.5) 
  - Absent (0.0)
  - On Leave (marked separately)
- **Monthly view with easy bulk entry**
- **Running totals** (days worked this month)

#### 3. Leave Management (Week 3)
- **Email AI parsing** for leave requests
- **Leave approval queue**
- **Automatic attendance marking** (approved leaves show as "On Leave")
- **Simple leave balance** (total days allocated vs used)

#### 4. Basic Reports (Week 4)
- **Monthly attendance summary** per employee
- **Leave usage reports**
- **Attendance percentage calculations**
- **CSV exports**

## Simplified Database Schema:

```sql
employees (id, name, email, annual_leave_days, status)

attendance (
  id, 
  employee_id, 
  date, 
  status, -- 'full', 'half_morning', 'half_afternoon', 'absent', 'leave'
  days_count -- 1.0, 0.5, 0.5, 0.0, 0.0
)

leave_requests (
  id, 
  employee_id, 
  start_date, 
  end_date, 
  half_day_start, -- morning/afternoon/null
  half_day_end,   -- morning/afternoon/null
  total_days,     -- calculated (1.5 days, 2.5 days, etc.)
  reason, 
  status, 
  created_at
)

leave_balances (id, employee_id, allocated_days, used_days)
```

## UI Simplification:

### Daily Attendance Grid:
```
Employee Name    | Mon | Tue | Wed | Thu | Fri | Total Days
John Doe        | [▼] | [▼] | [▼] | [▼] | [▼] | 4.5
Jane Smith      | [▼] | [▼] | [▼] | [▼] | [▼] | 5.0
```

**Dropdown options:**
- ✅ Full Day (1.0)
- 🌅 Morning Only (0.5) 
- 🌆 Afternoon Only (0.5)
- ❌ Absent (0.0)
- 🏖️ On Leave

### Leave Request Email Parsing:
**AI Prompt (simplified):**
```
Parse this leave email and extract:
- Employee name
- Start date and if it's half day (morning/afternoon)  
- End date and if it's half day (morning/afternoon)
- Calculate total days (counting half days as 0.5)
- Reason

Email: [email content]
Return as JSON.
```

## Revised Timeline (Much Faster):

### Week 1: Foundation (20-25 hours)
- Project setup
- Admin auth
- Employee management
- Basic UI framework

### Week 2: Half-Day Attendance (20-25 hours)
- Daily attendance grid with dropdowns
- Half-day logic and calculations  
- Monthly view and navigation
- Running totals display

### Week 3: Leave System (15-20 hours)
- Email webhook + AI parsing
- Leave request queue
- Auto-update attendance when leave approved
- Leave balance tracking

### Week 4: Reports & Polish (10-15 hours)
- Monthly reports with half-day calculations
- CSV exports
- UI polish
- Testing

**Total: 65-85 hours** (much more reasonable!)

## Key Simplifications:

### No Clock-in/Clock-out:
- Just daily status selection
- No time calculations needed
- No "late" concept

### Half-Day Logic:
```javascript
// Simple half-day calculations
const calculateDays = (status) => {
  switch(status) {
    case 'full': return 1.0;
    case 'half_morning': return 0.5;
    case 'half_afternoon': return 0.5;
    case 'absent': return 0.0;
    case 'leave': return 0.0; // tracked separately
  }
};

// Monthly total
const monthlyTotal = attendanceRecords
  .reduce((sum, record) => sum + record.days_count, 0);
```

### Leave Email Examples AI Should Parse:
```
"Hi, I need leave on Dec 5th morning half day for doctor appointment"
→ Start: Dec 5 (morning half), End: Dec 5 (morning half), Total: 0.5 days

"Taking leave from Dec 10-12, returning afternoon of Dec 12"  
→ Start: Dec 10 (full), End: Dec 12 (morning half), Total: 2.5 days
```

## Success Metrics:
- Admin can mark attendance in under 30 seconds per employee
- Leave emails auto-create requests with accurate day calculations
- Monthly reports show correct half-day totals
- System handles 50+ employees smoothly

This is **much more achievable in 1 month** and still provides real value. The half-day simplification removes tons of complexity around time tracking while still giving you the flexibility most small companies need.

Want me to detail any specific component or provide sample code for the half-day calculations?
