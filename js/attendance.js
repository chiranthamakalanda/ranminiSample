// Attendance Management System
// Handles attendance calculations, rules, and data management

class AttendanceManager {
    constructor() {
        this.initializeStorage();
    }

    initializeStorage() {
        // Initialize default employees if not exists
        if (!localStorage.getItem('employees')) {
            const defaultEmployees = [
                { id: 'EMP001', name: 'John Doe', designation: 'Trainee Associate', role: 'trainee', isContract: false },
                { id: 'EMP002', name: 'Jane Smith', designation: 'Junior Associate', role: 'junior', isContract: false },
                { id: 'EMP003', name: 'Mike Johnson', designation: 'Contract Staff - Grade 1', role: 'contract', isContract: true }
            ];
            localStorage.setItem('employees', JSON.stringify(defaultEmployees));
        }

        // Initialize attendance rules if not exists
        if (!localStorage.getItem('attendanceRules')) {
            const defaultRules = {
                fullDay: 1,
                halfDay: 0.5,
                shortLeaves: {
                    trainee: 2,
                    junior: 2,
                    contract: 2,
                    default: 2
                },
                shortLeaveValue: 1, // First 2 short leaves count as 1
                shortLeavePenalty: 0.5 // Additional short leaves count as 0.5
            };
            localStorage.setItem('attendanceRules', JSON.stringify(defaultRules));
        }

        // Initialize attendance data if not exists
        if (!localStorage.getItem('attendance')) {
            localStorage.setItem('attendance', JSON.stringify([]));
        }

        // Initialize attendance settings if not exists
        if (!localStorage.getItem('attendanceSettings')) {
            const defaultSettings = {
                roles: [
                    { id: 'trainee', name: 'Trainee Associate', salary: 1500, shortLeaves: 2 },
                    { id: 'junior', name: 'Junior Associate', salary: 2000, shortLeaves: 2 },
                    { id: 'contract', name: 'Contract Staff', salary: 80000, shortLeaves: 2, isContract: true }
                ]
            };
            localStorage.setItem('attendanceSettings', JSON.stringify(defaultSettings));
        }
    }

    // Generate attendance link
    generateLink(employeeId, validity = 'today') {
        const token = this.generateToken();
        const linkData = {
            employeeId: employeeId,
            token: token,
            validity: validity,
            createdAt: new Date().toISOString()
        };
        
        // Store link data
        let links = JSON.parse(localStorage.getItem('attendanceLinks') || '[]');
        links.push(linkData);
        localStorage.setItem('attendanceLinks', JSON.stringify(links));
        
        const baseUrl = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
        return `${baseUrl}attendance-mark.html?empId=${employeeId}&token=${token}`;
    }

    generateToken() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    // Mark attendance
    markAttendance(employeeId, type, method = 'link') {
        const today = new Date().toISOString().split('T')[0];
        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        let attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
        let record = attendance.find(r => r.employeeId === employeeId && r.date === today);
        
        if (!record) {
            record = {
                employeeId: employeeId,
                date: today,
                checkIn: null,
                checkOut: null,
                method: method,
                type: null, // 'full', 'half', 'short_leave', 'ot'
                hours: 0,
                otHours: 0
            };
            attendance.push(record);
        }
        
        if (type === 'in') {
            record.checkIn = time;
        } else if (type === 'out') {
            record.checkOut = time;
            // Calculate hours
            if (record.checkIn) {
                const hours = this.calculateHours(record.checkIn, record.checkOut);
                record.hours = hours;
            }
        }
        
        localStorage.setItem('attendance', JSON.stringify(attendance));
        return record;
    }

    calculateHours(checkIn, checkOut) {
        const [inHour, inMin] = checkIn.split(':').map(Number);
        const [outHour, outMin] = checkOut.split(/[: ]/).map(Number);
        const in24 = checkIn.includes('PM') && inHour !== 12 ? inHour + 12 : (checkIn.includes('AM') && inHour === 12 ? 0 : inHour);
        const out24 = checkOut.includes('PM') && outHour !== 12 ? outHour + 12 : (checkOut.includes('AM') && outHour === 12 ? 0 : outHour);
        
        const inMinutes = in24 * 60 + inMin;
        const outMinutes = out24 * 60 + outMin;
        const diffMinutes = outMinutes - inMinutes;
        
        return (diffMinutes / 60).toFixed(2);
    }

    // Get attendance for employee for a month
    getMonthlyAttendance(employeeId, year, month) {
        const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
        const employee = this.getEmployee(employeeId);
        
        return attendance.filter(record => {
            const recordDate = new Date(record.date);
            return record.employeeId === employeeId &&
                   recordDate.getFullYear() === year &&
                   recordDate.getMonth() === month - 1;
        }).map(record => {
            return {
                ...record,
                attendanceValue: this.calculateAttendanceValue(record, employee)
            };
        });
    }

    // Calculate attendance value based on rules
    calculateAttendanceValue(record, employee) {
        const rules = JSON.parse(localStorage.getItem('attendanceRules') || '{}');
        
        if (record.type === 'full') {
            return rules.fullDay || 1;
        } else if (record.type === 'half') {
            return rules.halfDay || 0.5;
        } else if (record.type === 'short_leave') {
            // Check how many short leaves this month
            const month = new Date(record.date).getMonth();
            const year = new Date(record.date).getFullYear();
            const monthlyShortLeaves = this.getMonthlyShortLeaves(employee.id, year, month + 1);
            const maxShortLeaves = rules.shortLeaves[employee.role] || rules.shortLeaves.default || 2;
            
            if (monthlyShortLeaves <= maxShortLeaves) {
                return rules.shortLeaveValue || 1;
            } else {
                return rules.shortLeavePenalty || 0.5;
            }
        }
        
        // Default: check if full day based on hours
        if (record.hours >= 8) {
            return rules.fullDay || 1;
        } else if (record.hours >= 4) {
            return rules.halfDay || 0.5;
        }
        
        return 0;
    }

    getMonthlyShortLeaves(employeeId, year, month) {
        const attendance = this.getMonthlyAttendance(employeeId, year, month);
        return attendance.filter(r => r.type === 'short_leave').length;
    }

    // Get employee data
    getEmployee(employeeId) {
        const employees = JSON.parse(localStorage.getItem('employees') || '[]');
        return employees.find(emp => emp.id === employeeId);
    }

    // Get attendance summary for month
    getMonthlySummary(employeeId, year, month) {
        const records = this.getMonthlyAttendance(employeeId, year, month);
        const employee = this.getEmployee(employeeId);
        const rules = JSON.parse(localStorage.getItem('attendanceRules') || '{}');
        
        let fullDays = 0;
        let halfDays = 0;
        let shortLeaves = 0;
        let totalOT = 0;
        let totalValue = 0;
        
        records.forEach(record => {
            const value = this.calculateAttendanceValue(record, employee);
            totalValue += value;
            
            if (record.type === 'short_leave') {
                shortLeaves++;
            } else if (value === 1) {
                fullDays++;
            } else if (value === 0.5) {
                halfDays++;
            }
            
            if (record.otHours) {
                totalOT += parseFloat(record.otHours);
            }
        });
        
        return {
            fullDays,
            halfDays,
            shortLeaves,
            totalOT,
            totalValue,
            workingDays: records.length
        };
    }

    // Export attendance to document (for download)
    exportMonthlyAttendance(employeeId, year, month) {
        const employee = this.getEmployee(employeeId);
        const records = this.getMonthlyAttendance(employeeId, year, month);
        const summary = this.getMonthlySummary(employeeId, year, month);
        
        // Create HTML document
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Attendance Report - ${employee.name} - ${month}/${year}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
        .summary { background-color: #f2f2f2; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <h1>Attendance Report</h1>
    <h2>${employee.name} (${employee.id})</h2>
    <p><strong>Period:</strong> ${this.getMonthName(month)} ${year}</p>
    
    <div class="summary">
        <h3>Summary</h3>
        <p><strong>Full Days:</strong> ${summary.fullDays}</p>
        <p><strong>Half Days:</strong> ${summary.halfDays}</p>
        <p><strong>Short Leaves:</strong> ${summary.shortLeaves}</p>
        ${employee.isContract ? `<p><strong>Overtime Hours:</strong> ${summary.totalOT}</p>` : ''}
        <p><strong>Total Attendance Value:</strong> ${summary.totalValue}</p>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours</th>
                <th>Type</th>
                <th>Value</th>
                ${employee.isContract ? '<th>OT Hours</th>' : ''}
            </tr>
        </thead>
        <tbody>
            ${records.map(record => `
                <tr>
                    <td>${record.date}</td>
                    <td>${record.checkIn || '-'}</td>
                    <td>${record.checkOut || '-'}</td>
                    <td>${record.hours || '-'}</td>
                    <td>${record.type || 'Full Day'}</td>
                    <td>${this.calculateAttendanceValue(record, employee)}</td>
                    ${employee.isContract ? `<td>${record.otHours || 0}</td>` : ''}
                </tr>
            `).join('')}
        </tbody>
    </table>
    
    <p style="margin-top: 30px;"><small>Generated on: ${new Date().toLocaleString()}</small></p>
</body>
</html>
        `;
        
        return html;
    }

    getMonthName(month) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        return months[month - 1];
    }

    // Download attendance as document
    downloadMonthlyAttendance(employeeId, year, month) {
        const html = this.exportMonthlyAttendance(employeeId, year, month);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const employee = this.getEmployee(employeeId);
        a.href = url;
        a.download = `Attendance_${employee.name}_${month}_${year}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Update attendance rules
    updateRules(rules) {
        localStorage.setItem('attendanceRules', JSON.stringify(rules));
    }

    // Get attendance rules
    getRules() {
        return JSON.parse(localStorage.getItem('attendanceRules') || '{}');
    }

    // Update attendance settings (roles, salaries, etc.)
    updateSettings(settings) {
        localStorage.setItem('attendanceSettings', JSON.stringify(settings));
    }

    // Get attendance settings
    getSettings() {
        return JSON.parse(localStorage.getItem('attendanceSettings') || '{}');
    }
}

// Initialize global instance
const attendanceManager = new AttendanceManager();


