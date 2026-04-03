# ByteStack HR Portal — Integration Guide

## File Structure

```
hr-portal/
├── login.html              ← Entry point (authentication)
├── dashboard.html          ← Main dashboard
├── employees.html          ← Employee management
├── attendance.html         ← Attendance tracking
├── leaves.html             ← Leave management
├── payroll.html            ← Payroll & payslips
├── recruitment.html        ← Job postings & applicants
├── performance.html        ← Performance reviews
├── training.html           ← Training programs
├── announcements.html      ← Company announcements
├── reports.html            ← Reports & CSV exports
├── settings.html           ← Portal settings
├── profile.html            ← Employee self-service profile
├── css/
│   ├── main.css            ← All portal styles
│   └── login.css           ← Login page styles
└── js/
    ├── auth.js             ← Authentication module
    ├── data.js             ← LocalStorage data layer
    ├── ui.js               ← UI helpers & utilities
    ├── layout.js           ← Sidebar & topbar builder
    └── pages/
        ├── recruitment.js
        ├── performance.js
        ├── training.js
        ├── announcements.js
        ├── reports.js
        └── settings.js
```

---

## Demo Credentials

| Role       | Email                        | Password        | Access |
|------------|------------------------------|-----------------|--------|
| HR Admin   | hr.admin@bytestack.io        | Admin@2024      | Full   |
| Manager    | manager@bytestack.io         | Manager@2024    | Dept   |
| Employee   | employee@bytestack.io        | Employee@2024   | Self   |

---

## HOW TO LINK FROM YOUR WEBSITE

Add a single button/link anywhere on your website:

### Option A — Simple Link (recommended)
```html
<!-- In your website navbar or contact page -->
<a href="hr-portal/login.html" class="btn-primary">
  HR Portal Login →
</a>
```

### Option B — Navbar Button (paste into your nav-links section)
Open each of your `.html` files and add this inside `<ul class="nav-links">`:
```html
<li><a href="hr-portal/login.html">HR Portal</a></li>
```

### Option C — Footer Link
```html
<a href="hr-portal/login.html">Employee Login</a>
```

---

## FOLDER PLACEMENT

Put the entire `hr-portal/` folder INSIDE your existing website folder:

```
agency-website/          ← your website root
├── index.html
├── services.html
├── portfolio.html
├── packages.html
├── about.html
├── contact.html
├── css/
├── js/
├── assets/
└── hr-portal/           ← paste here
    ├── login.html
    ├── dashboard.html
    └── ...
```

Then the link from your website becomes:
```html
<a href="hr-portal/login.html">HR Portal</a>
```

---

## CUSTOMIZING CREDENTIALS

Open `js/auth.js` and edit the USERS array:

```javascript
const USERS = [
  {
    email: 'hr.admin@bytestack.io',   // ← change this
    password: 'Admin@2024',            // ← change this
    name: 'Zaid Ahsan',               // ← your name
    role: 'admin',                    // admin | manager | employee
    title: 'HR Admin',
    dept: 'Leadership',
    ...
  }
];
```

---

## ADDING REAL BACKEND (Optional - for production)

The portal uses localStorage for storage. For real production use, replace the DB methods in `js/data.js` with API calls:

```javascript
// Replace DB.getAll('employees') calls with:
const response = await fetch('/api/employees', { headers: { Authorization: 'Bearer ' + token } });
const employees = await response.json();
```

Recommended backend: Node.js + Express + MongoDB (MERN — already in your stack!)

---

## NOTES

- All data is stored in browser localStorage (persists between sessions)
- Click "Reset Data" in Settings to restore demo data
- The portal is fully responsive — works on mobile
- Print payslips using Ctrl+P from the payslip modal
- Export any report as CSV from the Reports page
