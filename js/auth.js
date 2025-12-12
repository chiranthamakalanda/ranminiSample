// Simple auth utilities for demo (frontend-only)
(function() {
    const ACCOUNT_KEY = 'accounts';

    function ensureAccounts() {
        if (!localStorage.getItem(ACCOUNT_KEY)) {
            const defaultAccounts = [
                { username: 'superadmin', password: 'super123', role: 'superadmin', employeeId: null, passwordLastReset: Date.now() },
                { username: 'admin', password: 'admin123', role: 'admin', employeeId: null, passwordLastReset: Date.now() },
                { username: 'john', password: 'pass123', role: 'employee', employeeId: 'EMP001', passwordLastReset: Date.now() },
                { username: 'jane', password: 'pass123', role: 'employee', employeeId: 'EMP002', passwordLastReset: Date.now() },
                { username: 'mike', password: 'pass123', role: 'employee', employeeId: 'EMP003', passwordLastReset: Date.now() }
            ];
            localStorage.setItem(ACCOUNT_KEY, JSON.stringify(defaultAccounts));
        }
    }

    function getAccounts() {
        ensureAccounts();
        return JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '[]');
    }

    function saveAccounts(accounts) {
        localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts));
    }

    function login(username, password) {
        const accounts = getAccounts();
        const user = accounts.find(acc => acc.username === username && acc.password === password);
        if (user) {
            const session = {
                ...user,
                sessionExpiresAt: Date.now() + 30 * 60 * 1000 // 30 minutes
            };
            sessionStorage.setItem('currentUser', JSON.stringify(session));
            return user;
        }
        logUnauthorized(username);
        return null;
    }

    function logout() {
        sessionStorage.removeItem('currentUser');
    }

    function getCurrentUser() {
        const raw = sessionStorage.getItem('currentUser');
        if (!raw) return null;
        const session = JSON.parse(raw);
        if (session.sessionExpiresAt && Date.now() > session.sessionExpiresAt) {
            logout();
            return null;
        }
        return session;
    }

    function refreshSession() {
        const user = getCurrentUser();
        if (user) {
            user.sessionExpiresAt = Date.now() + 30 * 60 * 1000;
            sessionStorage.setItem('currentUser', JSON.stringify(user));
        }
    }

    function createEmployeeAccount({ username, password, roleId, employeeId }) {
        const accounts = getAccounts();
        if (accounts.some(acc => acc.username === username)) {
            throw new Error('Username already exists');
        }
        accounts.push({ username, password, role: 'employee', employeeId, roleId, passwordLastReset: Date.now() });
        saveAccounts(accounts);
        return { username, password };
    }

    function generatePassword(length = 8) {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
        let pwd = '';
        for (let i = 0; i < length; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pwd;
    }

    function isPasswordExpired(username, days = 90) {
        const accounts = getAccounts();
        const user = accounts.find(acc => acc.username === username);
        if (!user || !user.passwordLastReset) return false;
        const ms = days * 24 * 60 * 60 * 1000;
        return Date.now() - user.passwordLastReset > ms;
    }

    function forcePasswordReset(username) {
        const accounts = getAccounts();
        const user = accounts.find(acc => acc.username === username);
        if (user) {
            user.passwordLastReset = Date.now();
            saveAccounts(accounts);
        }
    }

    function logUnauthorized(username) {
        const logs = JSON.parse(localStorage.getItem('unauthorizedLogs') || '[]');
        logs.unshift({
            username,
            at: new Date().toISOString(),
            ip: '127.0.0.1'
        });
        localStorage.setItem('unauthorizedLogs', JSON.stringify(logs.slice(0, 50)));
    }

    function getUnauthorizedLogs() {
        return JSON.parse(localStorage.getItem('unauthorizedLogs') || '[]');
    }

    window.Auth = {
        login,
        logout,
        getCurrentUser,
        createEmployeeAccount,
        generatePassword,
        refreshSession,
        isPasswordExpired,
        forcePasswordReset,
        getUnauthorizedLogs
    };
})();

