/* ═══════════════════════════════════════════
   BYTESTACK HR — AUTH MODULE
   js/auth.js
═══════════════════════════════════════════ */
'use strict';

const Auth = (() => {

  // ── USERS DATABASE ──
  const USERS = [
    {
      id: 'USR-001',
      email: 'hr.admin@bytestack.io',
      password: 'Admin@2024',
      name: 'Zaid Ahsan',
      role: 'admin',
      title: 'HR Admin',
      dept: 'Leadership',
      avatar: 'ZA',
      permissions: ['all']
    },
    {
      id: 'USR-002',
      email: 'manager@bytestack.io',
      password: 'Manager@2024',
      name: 'Sara Khan',
      role: 'manager',
      title: 'Lead Developer',
      dept: 'Development',
      avatar: 'SK',
      permissions: ['employees_read','attendance','leaves_approve','performance','reports']
    },
    {
      id: 'USR-003',
      email: 'employee@bytestack.io',
      password: 'Employee@2024',
      name: 'Ali Raza',
      role: 'employee',
      title: 'MERN Architect',
      dept: 'Development',
      avatar: 'AR',
      permissions: ['attendance_self','leaves_self','profile_self','payslip_self']
    }
  ];

  const SESSION_KEY = 'bs_hr_session';
  const REMEMBER_KEY = 'bs_hr_remember';

  function login(email, password, remember = false) {
    const user = USERS.find(u => u.email === email && u.password === password);
    if (!user) return null;

    const session = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      title: user.title,
      dept: user.dept,
      avatar: user.avatar,
      permissions: user.permissions,
      loginTime: Date.now(),
      expires: Date.now() + (remember ? 7 * 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000)
    };

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify(session));
    if (remember) localStorage.setItem(REMEMBER_KEY, 'true');

    // Log activity
    logActivity(`${user.name} logged in`);
    return session;
  }

  function logout() {
    logActivity(`${getSession()?.name || 'User'} logged out`);
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    window.location.href = 'login.html';
  }

  function getSession() {
    const storage = localStorage.getItem(REMEMBER_KEY) ? localStorage : sessionStorage;
    const raw = storage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() > session.expires) {
      storage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  }

  function isLoggedIn() {
    return !!getSession();
  }

  function requireAuth() {
    if (!isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  function hasPermission(perm) {
    const session = getSession();
    if (!session) return false;
    return session.permissions.includes('all') || session.permissions.includes(perm);
  }

  function isAdmin() {
    return getSession()?.role === 'admin';
  }

  function isManager() {
    const role = getSession()?.role;
    return role === 'admin' || role === 'manager';
  }

  function logActivity(msg) {
    const logs = JSON.parse(localStorage.getItem('bs_activity_log') || '[]');
    logs.unshift({ msg, time: new Date().toISOString() });
    localStorage.setItem('bs_activity_log', JSON.stringify(logs.slice(0, 100)));
  }

  function getActivityLog() {
    return JSON.parse(localStorage.getItem('bs_activity_log') || '[]');
  }

  return { login, logout, getSession, isLoggedIn, requireAuth, hasPermission, isAdmin, isManager, logActivity, getActivityLog };

})();
