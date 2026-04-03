/* ═══════════════════════════════════════════════════
   BYTESTACK HR — EMPLOYEE CREDENTIAL MAILER
   js/mailer.js

   Uses EmailJS — same service as your contact form
   Add this script to: employees.html & dashboard.html

   <script src="js/mailer.js"></script>
═══════════════════════════════════════════════════ */
'use strict';

const Mailer = (() => {

  // ── YOUR EMAILJS KEYS (same ones from contact form) ──
  const PUBLIC_KEY   = 'YOUR_PUBLIC_KEY';       // e.g. 'AbCdEfGh...'
  const SERVICE_ID   = 'YOUR_SERVICE_ID';       // e.g. 'service_xxxxxxx'
  const TEMPLATE_ID  = 'YOUR_CRED_TEMPLATE_ID'; // NEW template — see setup below

  // ── LOAD EMAILJS ONCE ──
  let loaded = false;
  function load(callback) {
    if (loaded && window.emailjs) { callback(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s.onload = () => {
      emailjs.init({ publicKey: PUBLIC_KEY });
      loaded = true;
      callback();
    };
    document.head.appendChild(s);
  }

  // ── GENERATE A RANDOM TEMP PASSWORD ──
  function generatePassword(firstName) {
    const specials = ['@','#','!','$'];
    const sp = specials[Math.floor(Math.random() * specials.length)];
    const num = Math.floor(Math.random() * 900 + 100);
    // e.g. Sara@2024#847
    return firstName.charAt(0).toUpperCase() +
           firstName.slice(1).toLowerCase() +
           sp + new Date().getFullYear() + sp + num;
  }

  // ── SEND CREDENTIALS EMAIL ──
  function sendCredentials(employee, callback) {
    const tempPassword = generatePassword(employee.first);

    // Store temp password in the employee record
    DB.update('employees', employee.id, { tempPassword, mustChangePassword: true });

    // Also add the user to auth (so they can actually log in)
    const stored = JSON.parse(localStorage.getItem('bs_hr_extra_users') || '[]');
    stored.push({
      id: employee.id,
      email: employee.email,
      password: tempPassword,
      name: employee.first + ' ' + employee.last,
      role: 'employee',
      title: employee.role,
      dept: employee.dept,
      avatar: (employee.first[0] + (employee.last[0] || '')).toUpperCase(),
      permissions: ['attendance_self','leaves_self','profile_self','payslip_self']
    });
    localStorage.setItem('bs_hr_extra_users', JSON.stringify(stored));

    const params = {
      to_email:      employee.email,
      to_name:       employee.first + ' ' + employee.last,
      employee_id:   employee.id,
      job_title:     employee.role,
      department:    employee.dept,
      join_date:     employee.join,
      login_url:     window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/hr-portal/login.html'),
      login_email:   employee.email,
      login_password:tempPassword,
      company_name:  DB.getSettings().companyName || 'ByteStack Digital Agency',
      hr_email:      'contact.bytestack@gmail.com',
      reply_to:      'contact.bytestack@gmail.com',
    };

    load(() => {
      emailjs.send(SERVICE_ID, TEMPLATE_ID, params)
        .then(() => {
          Auth.logActivity('Credentials sent to ' + employee.email);
          if (callback) callback(true, tempPassword);
        })
        .catch(err => {
          console.error('Mailer error:', err);
          if (callback) callback(false, tempPassword);
        });
    });

    return tempPassword; // Return immediately for UI display
  }

  // ── RESEND CREDENTIALS (for existing employee) ──
  function resendCredentials(empId, callback) {
    const emp = DB.getById('employees', empId);
    if (!emp) { if (callback) callback(false); return; }
    sendCredentials(emp, callback);
  }

  return { sendCredentials, resendCredentials, generatePassword };

})();


/* ─────────────────────────────────────────────────
   PATCH Auth.login() to also check extra users
   (employees added through the portal)
   Call this once after auth.js loads
───────────────────────────────────────────────── */
(function patchAuth() {
  const _origLogin = Auth.login.bind(Auth);

  // Override the login to also check locally created users
  const patched = function(email, password, remember) {
    // Try original users first
    let result = _origLogin(email, password, remember);
    if (result) return result;

    // Try extra users (employees added via portal)
    const extras = JSON.parse(localStorage.getItem('bs_hr_extra_users') || '[]');
    const user = extras.find(u => u.email === email && u.password === password);
    if (!user) return null;

    const SESSION_KEY = 'bs_hr_session';
    const session = {
      userId: user.id, email: user.email, name: user.name,
      role: user.role, title: user.title, dept: user.dept,
      avatar: user.avatar, permissions: user.permissions,
      loginTime: Date.now(),
      expires: Date.now() + (remember ? 7*24*60*60*1000 : 8*60*60*1000)
    };
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  };

  // Monkey-patch Auth object
  Object.defineProperty(Auth, 'login', { value: patched, writable: true });
})();
