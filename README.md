# HR Management System - Frontend

A comprehensive HR Management System frontend built with HTML, CSS (Bootstrap 5), and JavaScript.

## Features

### 1. **Dashboard** (`index.html`)
- Overview of all system modules
- Quick statistics and navigation cards
- Easy access to all features

### 2. **Attendance Management** (`attendance.html`)
- Two attendance tracking methods:
  - **Fingerprint Tracker**: For biometric attendance
  - **Link-Based Tracker**: Generate shareable links for agents
- View daily attendance records
- Monthly attendance summary
- Download attendance reports

### 3. **Payroll Management** (`payroll.html`)
- Three staff categories:
  - **Trainee Associate**: Rs. 1,500 per day
  - **Junior Associate**: Rs. 2,000 per day
  - **Contract Staff**: Monthly fixed salary
    - Grade 1: Rs. 80,000+
    - Grade 2: Rs. 60,000 - 70,000
    - Grade 3: Rs. 40,000 - 45,000
- Generate payroll for any month
- View and download payslips
- Payroll summary statistics

### 4. **Agent Profile** (`agent-profile.html`)
- Comprehensive employee profiles including:
  - Personal details (name, address, email, contact, emergency contact)
  - Academic qualifications
  - Employment details (start date, designation, salary)
  - Document management (Birth Certificate, CV, NIC, Bank Details, Photo)
  - Attendance tracking with downloadable sheets
  - Leave management (taken/remaining)
  - Complaints tracking
  - Comments section
- Search and filter employees
- Add new agents

### 5. **Application Tracker** (`application-tracker.html`)
- Track CVs and job applications
- Application status management:
  - Pending Review
  - Shortlisted
  - Interview Scheduled
  - Interview Completed
  - Offer Sent
  - Hired
  - Rejected
- View application timeline
- Upload and manage CVs
- Create employee profiles from successful applications

### 6. **Roaster Management** (`roaster.html`)
- Weekly schedule management
- Shift assignments:
  - Morning (8 AM - 4 PM)
  - Evening (4 PM - 12 AM)
  - Night (12 AM - 8 AM)
- View employee schedules
- Bulk schedule updates
- Leave management in roaster
- Export roaster reports

## File Structure

```
ranmini/
├── index.html                  # Main dashboard
├── attendance.html             # Attendance management
├── payroll.html                # Payroll management
├── agent-profile.html          # Employee profiles
├── application-tracker.html    # CV/Application tracking
├── roaster.html                # Schedule management
├── css/
│   └── style.css              # Custom styles
└── README.md                   # This file
```

## How to Use

1. **Open the website**: Simply open `index.html` in your web browser
2. **Navigate**: Use the navigation bar at the top to switch between different modules
3. **All pages are connected**: Clicking on any navigation link or button will take you to the respective page
4. **Interactive elements**: All buttons and links are functional (they show alerts/demos for demonstration purposes)

## Technologies Used

- **HTML5**: Structure and content
- **Bootstrap 5.3.0**: Responsive design and UI components
- **Bootstrap Icons**: Icon library
- **CSS3**: Custom styling
- **JavaScript**: Interactive functionality

## Browser Compatibility

This website works on all modern browsers:
- Chrome
- Firefox
- Edge
- Safari
- Opera

## Notes

- This is a **frontend-only** demonstration
- No backend integration is included
- All data shown is sample/demo data
- Buttons show alerts for demonstration purposes
- In a real implementation, these would connect to a backend API

## Future Enhancements

When implementing the backend, you would need to:
- Connect forms to API endpoints
- Implement authentication and authorization
- Add database integration
- Implement file upload functionality
- Add real-time updates
- Implement email notifications
- Add advanced reporting features




