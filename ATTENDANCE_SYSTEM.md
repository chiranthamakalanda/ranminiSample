# Attendance Management System

## Overview
A comprehensive attendance tracking system with two methods: Fingerprint Tracker and Link-Based Tracker. The system supports customizable attendance rules, role-based configurations, and detailed reporting.

## Features

### 1. Link-Based Attendance Tracking
- **Location**: `attendance-mark.html`
- Employees can mark attendance via a personalized link
- Automatic employee identification through Employee ID or token
- Support for:
  - Check In / Check Out
  - Full Day (1.0)
  - Half Day (0.5)
  - Short Leaves
  - Overtime (for contract staff only)

### 2. Attendance Management Dashboard
- **Location**: `attendance.html`
- Generate personalized attendance links for employees
- View daily attendance records
- Monthly attendance summary
- Customizable settings for:
  - Attendance values (Full day, Half day)
  - Short leave rules
  - Role-specific configurations
  - Salaries per role

### 3. Employee Profile Integration
- **Location**: `agent-profile.html`
- View monthly attendance summary per employee
- Download monthly attendance reports as HTML documents
- Select any month/year to view/download

### 4. Attendance Rules

#### Default Rules:
- **Full Day**: 1.0
- **Half Day**: 0.5
- **Short Leaves**: 
  - First 2 per month = 1.0 each
  - Additional short leaves = 0.5 each
- **Overtime**: Only for contract staff, tracked separately

#### Customizable:
- All rules can be customized through Settings modal
- Role-specific short leave limits
- Salary configurations per role

## How to Use

### For Administrators:

1. **Generate Attendance Links**:
   - Go to Attendance page
   - Click "Generate Link"
   - Select employee
   - Choose link validity (Today, Week, Month, or Custom)
   - Copy and share the link with the employee

2. **Configure Settings**:
   - Click "Configure Settings" on Attendance page
   - Adjust attendance values
   - Configure short leave rules
   - Manage roles and salaries
   - Save settings

3. **View Attendance Records**:
   - View daily attendance on Attendance page
   - Check monthly summaries
   - Download reports

### For Employees:

1. **Mark Attendance via Link**:
   - Click the attendance link provided by HR
   - Enter Employee ID if prompted
   - Click "Check In" when arriving
   - Click "Check Out" when leaving
   - Or mark attendance type directly (Full Day, Half Day, Short Leave)

2. **Mark Overtime** (Contract Staff Only):
   - Click "Mark Overtime" button
   - Enter overtime hours
   - Select date
   - Save

### Download Monthly Reports:

1. Go to Agent Profile page
2. Select an employee
3. Choose month and year
4. Click "Download Monthly Report"
5. Report will be downloaded as HTML document

## File Structure

```
├── attendance.html          # Main attendance management dashboard
├── attendance-mark.html     # Employee attendance marking page
├── agent-profile.html       # Employee profiles with attendance download
├── js/
│   ├── attendance.js        # Attendance management logic
│   └── main.js             # General utilities
└── ATTENDANCE_SYSTEM.md     # This documentation
```

## Data Storage

The system uses browser localStorage for data persistence:
- `employees`: Employee data
- `attendance`: Attendance records
- `attendanceRules`: Customizable attendance rules
- `attendanceSettings`: Role and salary configurations
- `attendanceLinks`: Generated attendance links

## Attendance Calculation Logic

1. **Full Day**: 8+ hours worked = 1.0
2. **Half Day**: 4-8 hours worked = 0.5
3. **Short Leaves**: 
   - Counted per month per employee
   - First 2 short leaves = 1.0 each
   - Additional short leaves = 0.5 each
4. **Overtime**: 
   - Only tracked for contract staff
   - Stored separately in attendance records
   - Calculated in monthly summaries

## Customization

All attendance rules can be customized:
- Full day value (default: 1)
- Half day value (default: 0.5)
- Short leave value for first 2 (default: 1)
- Short leave penalty after 2 (default: 0.5)
- Short leaves per role (default: 2)
- Role-specific salaries
- Contract staff designation

## Future Enhancements

For production use, consider:
- Backend API integration
- Database storage instead of localStorage
- Authentication and authorization
- Email notifications for attendance links
- Real-time attendance tracking
- Biometric device integration
- Mobile app support


