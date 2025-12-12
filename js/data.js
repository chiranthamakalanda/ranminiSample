// Sample data bootstrap and lightweight data access helpers
// This keeps demo data consistent across pages without a backend.
(function() {
    const sampleData = {
        employees: [
            {
                id: 'EMP001',
                name: 'John Doe',
                email: 'john.doe@example.com',
                contact: '+94 77 123 4567',
                emergency: '+94 77 999 8888',
                address: '123 Main Street, Colombo 05',
                designation: 'Trainee Associate',
                role: 'trainee',
                grade: null,
                salaryPerDay: 1500,
                isContract: false,
                startDate: '2024-01-01',
                status: 'Active'
            },
            {
                id: 'EMP002',
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                contact: '+94 77 234 5678',
                emergency: '+94 77 333 4444',
                address: '45 Park Lane, Colombo 07',
                designation: 'Junior Associate',
                role: 'junior',
                grade: null,
                salaryPerDay: 2000,
                isContract: false,
                startDate: '2023-12-15',
                status: 'Active'
            },
            {
                id: 'EMP003',
                name: 'Mike Johnson',
                email: 'mike.johnson@example.com',
                contact: '+94 77 345 6789',
                emergency: '+94 77 567 6789',
                address: '78 Lake Road, Dehiwala',
                designation: 'Contract Staff - Grade 1',
                role: 'contract',
                grade: 'Grade 1',
                salaryMonthly: 85000,
                isContract: true,
                startDate: '2023-11-01',
                status: 'Active'
            },
            {
                id: 'EMP004',
                name: 'Sarah Williams',
                email: 'sarah.williams@example.com',
                contact: '+94 77 456 7890',
                emergency: '+94 77 101 2020',
                address: '9 Flower Avenue, Nugegoda',
                designation: 'Contract Staff - Grade 2',
                role: 'contract',
                grade: 'Grade 2',
                salaryMonthly: 65000,
                isContract: true,
                startDate: '2023-10-05',
                status: 'Active'
            },
            {
                id: 'EMP005',
                name: 'David Brown',
                email: 'david.brown@example.com',
                contact: '+94 77 555 6666',
                emergency: '+94 77 202 3030',
                address: '5 Palm Grove, Kandy',
                designation: 'Contract Staff - Grade 3',
                role: 'contract',
                grade: 'Grade 3',
                salaryMonthly: 42000,
                isContract: true,
                startDate: '2023-09-20',
                status: 'Active'
            }
        ],
        attendance: [
            { employeeId: 'EMP001', date: new Date().toISOString().split('T')[0], checkIn: '09:00 AM', checkOut: '05:30 PM', hours: 8.5, type: 'full', method: 'fingerprint' },
            { employeeId: 'EMP002', date: new Date().toISOString().split('T')[0], checkIn: '08:45 AM', checkOut: null, hours: 0, type: null, method: 'link' },
            { employeeId: 'EMP003', date: new Date().toISOString().split('T')[0], checkIn: '09:15 AM', checkOut: '06:00 PM', hours: 8.75, type: 'full', method: 'fingerprint' },
            { employeeId: 'EMP004', date: new Date().toISOString().split('T')[0], checkIn: null, checkOut: null, hours: 0, type: 'absent', method: '-' }
        ],
        payrollRecords: [
            { employeeId: 'EMP001', month: '2024-01', workingDays: 22, baseSalary: 1500 * 22, deductions: 0, netSalary: 1500 * 22, status: 'Paid', category: 'Trainee Associate', grade: '-' },
            { employeeId: 'EMP002', month: '2024-01', workingDays: 22, baseSalary: 2000 * 22, deductions: 0, netSalary: 2000 * 22, status: 'Paid', category: 'Junior Associate', grade: '-' },
            { employeeId: 'EMP003', month: '2024-01', workingDays: 0, baseSalary: 85000, deductions: 5000, netSalary: 80000, status: 'Pending', category: 'Contract Staff', grade: 'Grade 1' },
            { employeeId: 'EMP004', month: '2024-01', workingDays: 0, baseSalary: 65000, deductions: 3000, netSalary: 62000, status: 'Paid', category: 'Contract Staff', grade: 'Grade 2' },
            { employeeId: 'EMP005', month: '2024-01', workingDays: 0, baseSalary: 42000, deductions: 2000, netSalary: 40000, status: 'Paid', category: 'Contract Staff', grade: 'Grade 3' }
        ],
        applications: [
            { id: 'APP001', name: 'Robert Taylor', email: 'robert.taylor@example.com', contact: '+94 77 111 2222', position: 'Trainee Associate', date: '2024-01-10', status: 'Pending Review' },
            { id: 'APP002', name: 'Emily Davis', email: 'emily.davis@example.com', contact: '+94 77 222 3333', position: 'Junior Associate', date: '2024-01-12', status: 'Shortlisted' },
            { id: 'APP003', name: 'Michael Wilson', email: 'michael.wilson@example.com', contact: '+94 77 333 4444', position: 'Contract Staff - Grade 2', date: '2024-01-08', status: 'Interview Scheduled' },
            { id: 'APP004', name: 'Lisa Anderson', email: 'lisa.anderson@example.com', contact: '+94 77 444 5555', position: 'Trainee Associate', date: '2024-01-14', status: 'Hired' },
            { id: 'APP005', name: 'David Martinez', email: 'david.martinez@example.com', contact: '+94 77 555 6666', position: 'Contract Staff - Grade 1', date: '2024-01-05', status: 'Rejected' }
        ],
        roaster: [
            { employeeId: 'EMP001', days: ['Morning', 'Morning', 'Morning', 'Morning', 'Morning', 'Off', 'Off'], hours: 40 },
            { employeeId: 'EMP002', days: ['Evening', 'Evening', 'Evening', 'Evening', 'Evening', 'Leave', 'Off'], hours: 40 },
            { employeeId: 'EMP003', days: ['Morning', 'Morning', 'Leave', 'Morning', 'Morning', 'Morning', 'Off'], hours: 32 },
            { employeeId: 'EMP004', days: ['Night', 'Night', 'Night', 'Night', 'Night', 'Off', 'Off'], hours: 40 }
        ]
    };

    function ensureLocal(key, value) {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }

    // Bootstrap sample data once
    ensureLocal('employees', sampleData.employees);
    ensureLocal('attendance', sampleData.attendance);
    ensureLocal('payrollRecords', sampleData.payrollRecords);
    ensureLocal('applications', sampleData.applications);
    ensureLocal('roaster', sampleData.roaster);
    // Accounts seed happens in auth.js; keep roles handy
    ensureLocal('rolesCatalog', [
        { id: 'trainee', name: 'Trainee Associate', salary: 1500, isContract: false },
        { id: 'junior', name: 'Junior Associate', salary: 2000, isContract: false },
        { id: 'contract_g1', name: 'Contract Staff - Grade 1', salary: 85000, isContract: true },
        { id: 'contract_g2', name: 'Contract Staff - Grade 2', salary: 65000, isContract: true },
        { id: 'contract_g3', name: 'Contract Staff - Grade 3', salary: 42000, isContract: true }
    ]);

    window.DataStore = {
        getEmployees() {
            return JSON.parse(localStorage.getItem('employees') || '[]');
        },
        getAttendance() {
            return JSON.parse(localStorage.getItem('attendance') || '[]');
        },
        getAttendanceForDate(date) {
            const target = typeof date === 'string' ? date : date.toISOString().split('T')[0];
            return this.getAttendance().filter(r => r.date === target);
        },
        getPayroll() {
            return JSON.parse(localStorage.getItem('payrollRecords') || '[]');
        },
        getApplications() {
            return JSON.parse(localStorage.getItem('applications') || '[]');
        },
        getRoaster() {
            return JSON.parse(localStorage.getItem('roaster') || '[]');
        },
        getRoles() {
            return JSON.parse(localStorage.getItem('rolesCatalog') || '[]');
        }
    };
})();

