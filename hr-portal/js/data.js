/* ═══════════════════════════════════════════
   BYTESTACK HR — DATA STORE
   js/data.js  (localStorage-backed)
═══════════════════════════════════════════ */
'use strict';

const DB = (() => {

  // ── SEED DATA ──
  const SEED = {
    employees: [
      {id:'BS-001',first:'Zaid',last:'Ahsan',email:'zaid@bytestack.io',phone:'+92 317 8495506',role:'Founder & CEO',dept:'Leadership',type:'Full-time',salary:120000,join:'2024-01-01',status:'Active',dob:'1995-03-15',address:'Lahore, Pakistan',emergency:'Hina Ahsan · +92 300 1111111',skills:['Leadership','Strategy','Business Development'],notes:''},
      {id:'BS-002',first:'Sara',last:'Khan',email:'sara@bytestack.io',phone:'+92 300 1234567',role:'Lead Developer',dept:'Development',type:'Full-time',salary:85000,join:'2024-01-15',status:'Active',dob:'1997-06-12',address:'Lahore, Pakistan',emergency:'Ahmed Khan · +92 301 2222222',skills:['React','Node.js','MongoDB'],notes:''},
      {id:'BS-003',first:'Ali',last:'Raza',email:'ali@bytestack.io',phone:'+92 301 2345678',role:'MERN Architect',dept:'Development',type:'Full-time',salary:90000,join:'2024-02-01',status:'Active',dob:'1996-08-22',address:'Lahore, Pakistan',emergency:'Fatima Raza · +92 302 3333333',skills:['MERN','AWS','Docker'],notes:'Birthday tomorrow!'},
      {id:'BS-004',first:'Nadia',last:'Farooq',email:'nadia@bytestack.io',phone:'+92 302 3456789',role:'Head of Marketing',dept:'Marketing',type:'Full-time',salary:75000,join:'2024-02-15',status:'Active',dob:'1998-11-05',address:'Karachi, Pakistan',emergency:'Tariq Farooq · +92 303 4444444',skills:['SEO','Paid Ads','Social Media'],notes:''},
      {id:'BS-005',first:'Marcus',last:'Hill',email:'marcus@bytestack.io',phone:'+92 303 4567890',role:'Mobile Developer',dept:'Development',type:'Full-time',salary:80000,join:'2024-03-01',status:'On Leave',dob:'1994-04-18',address:'Islamabad, Pakistan',emergency:'Clara Hill · +92 304 5555555',skills:['React Native','iOS','Android'],notes:''},
      {id:'BS-006',first:'Layla',last:'Mehmood',email:'layla@bytestack.io',phone:'+92 304 5678901',role:'Content Strategist',dept:'Content',type:'Full-time',salary:65000,join:'2024-03-15',status:'Active',dob:'1999-01-30',address:'Lahore, Pakistan',emergency:'Kamil Mehmood · +92 305 6666666',skills:['Copywriting','SEO','Content Strategy'],notes:''},
      {id:'BS-007',first:'Omar',last:'Butt',email:'omar@bytestack.io',phone:'+92 305 6789012',role:'UI/UX Designer',dept:'Design',type:'Full-time',salary:70000,join:'2024-04-01',status:'Active',dob:'1997-06-18',address:'Lahore, Pakistan',emergency:'Sana Butt · +92 306 7777777',skills:['Figma','Adobe XD','Prototyping'],notes:''},
    ],
    leaves: [
      {id:'LV-001',empId:'BS-005',emp:'Marcus Hill',type:'Annual',from:'2024-06-10',to:'2024-06-12',days:3,reason:'Family vacation',status:'Pending',appliedOn:'2024-06-07',approvedBy:''},
      {id:'LV-002',empId:'BS-006',emp:'Layla Mehmood',type:'Sick',from:'2024-06-07',to:'2024-06-07',days:1,reason:'Feeling unwell',status:'Pending',appliedOn:'2024-06-07',approvedBy:''},
      {id:'LV-003',empId:'BS-003',emp:'Ali Raza',type:'Casual',from:'2024-06-03',to:'2024-06-03',days:1,reason:'Personal work',status:'Approved',appliedOn:'2024-06-02',approvedBy:'Zaid Ahsan'},
      {id:'LV-004',empId:'BS-002',emp:'Sara Khan',type:'Annual',from:'2024-05-20',to:'2024-05-24',days:5,reason:'Vacation',status:'Approved',appliedOn:'2024-05-15',approvedBy:'Zaid Ahsan'},
    ],
    attendance: (() => {
      const rows = [];
      const emps = ['BS-001','BS-002','BS-003','BS-004','BS-005','BS-006','BS-007'];
      const names = ['Zaid Ahsan','Sara Khan','Ali Raza','Nadia Farooq','Marcus Hill','Layla Mehmood','Omar Butt'];
      const today = new Date();
      for (let d = 0; d < 30; d++) {
        const date = new Date(today); date.setDate(today.getDate() - d);
        const ds = date.toISOString().slice(0,10);
        emps.forEach((id, i) => {
          const seed = (d*7+i)*13;
          const absent = seed % 11 === 0;
          const leave = id === 'BS-005' && d < 3;
          const h = 8 + (seed % 2); const m = seed % 60;
          const oh = 17 + (seed % 2); const om = (seed*3) % 60;
          rows.push({date:ds, empId:id, emp:names[i], checkIn: leave||absent?'':'0'+h+':'+String(m).padStart(2,'0'), checkOut: leave||absent?'':''+oh+':'+String(om).padStart(2,'0'), status: leave?'Leave':absent?'Absent':'Present', hours: leave||absent?0:parseFloat(((oh+om/60)-(h+m/60)).toFixed(1))});
        });
      }
      return rows;
    })(),
    payroll: [
      {id:'PAY-001',month:'June 2024',empId:'BS-001',emp:'Zaid Ahsan',dept:'Leadership',base:120000,hra:24000,transport:8000,bonus:15000,tax:12500,eobi:1600,net:152900,status:'Pending'},
      {id:'PAY-002',month:'June 2024',empId:'BS-002',emp:'Sara Khan',dept:'Development',base:85000,hra:17000,transport:6000,bonus:8000,tax:8500,eobi:1600,net:105900,status:'Pending'},
      {id:'PAY-003',month:'June 2024',empId:'BS-003',emp:'Ali Raza',dept:'Development',base:90000,hra:18000,transport:6000,bonus:10000,tax:9200,eobi:1600,net:113200,status:'Pending'},
      {id:'PAY-004',month:'June 2024',empId:'BS-004',emp:'Nadia Farooq',dept:'Marketing',base:75000,hra:15000,transport:5000,bonus:6000,tax:7200,eobi:1600,net:92200,status:'Pending'},
      {id:'PAY-005',month:'June 2024',empId:'BS-005',emp:'Marcus Hill',dept:'Development',base:80000,hra:16000,transport:5500,bonus:7000,tax:8000,eobi:1600,net:98900,status:'Pending'},
      {id:'PAY-006',month:'June 2024',empId:'BS-006',emp:'Layla Mehmood',dept:'Content',base:65000,hra:13000,transport:4500,bonus:4000,tax:6200,eobi:1600,net:78700,status:'Pending'},
      {id:'PAY-007',month:'June 2024',empId:'BS-007',emp:'Omar Butt',dept:'Design',base:70000,hra:14000,transport:5000,bonus:5000,tax:6700,eobi:1600,net:85700,status:'Pending'},
    ],
    jobs: [
      {id:'JOB-001',title:'Senior MERN Developer',dept:'Development',type:'Full-time',salary:'PKR 80,000 – 100,000',desc:'We need an experienced MERN stack developer.',posted:'2024-06-01',deadline:'2024-07-01',status:'Active',applicants:5},
      {id:'JOB-002',title:'Digital Marketing Manager',dept:'Marketing',type:'Full-time',salary:'PKR 60,000 – 80,000',desc:'Lead our digital marketing efforts.',posted:'2024-06-05',deadline:'2024-07-05',status:'Active',applicants:3},
      {id:'JOB-003',title:'React Native Developer',dept:'Development',type:'Full-time',salary:'PKR 70,000 – 90,000',desc:'Build our cross-platform mobile apps.',posted:'2024-06-08',deadline:'2024-07-08',status:'Active',applicants:2},
      {id:'JOB-004',title:'Content Writer',dept:'Content',type:'Part-time',salary:'PKR 30,000 – 45,000',desc:'Create compelling content across channels.',posted:'2024-06-10',deadline:'2024-06-30',status:'Active',applicants:2},
    ],
    applicants: [
      {id:'APP-001',name:'Amara Sheikh',email:'amara@email.com',phone:'+92 300 9001',jobId:'JOB-001',job:'Senior MERN Developer',applied:'2024-06-02',stage:'Interview',score:88,resume:''},
      {id:'APP-002',name:'Hassan Ali',email:'hassan@email.com',phone:'+92 300 9002',jobId:'JOB-001',job:'Senior MERN Developer',applied:'2024-06-03',stage:'Screening',score:74,resume:''},
      {id:'APP-003',name:'Bilal Ahmed',email:'bilal@email.com',phone:'+92 300 9003',jobId:'JOB-002',job:'Digital Marketing Manager',applied:'2024-06-06',stage:'Applied',score:65,resume:''},
      {id:'APP-004',name:'Fatima Malik',email:'fatima@email.com',phone:'+92 300 9004',jobId:'JOB-003',job:'React Native Developer',applied:'2024-06-09',stage:'Offer',score:92,resume:''},
      {id:'APP-005',name:'Kamran Javed',email:'kamran@email.com',phone:'+92 300 9005',jobId:'JOB-001',job:'Senior MERN Developer',applied:'2024-06-04',stage:'Applied',score:70,resume:''},
      {id:'APP-006',name:'Sana Tariq',email:'sana@email.com',phone:'+92 300 9006',jobId:'JOB-004',job:'Content Writer',applied:'2024-06-11',stage:'Screening',score:80,resume:''},
      {id:'APP-007',name:'Usman Ghani',email:'usman@email.com',phone:'+92 300 9007',jobId:'JOB-002',job:'Digital Marketing Manager',applied:'2024-06-07',stage:'Interview',score:85,resume:''},
      {id:'APP-008',name:'Ayesha Iqbal',email:'ayesha@email.com',phone:'+92 300 9008',jobId:'JOB-001',job:'Senior MERN Developer',applied:'2024-06-05',stage:'Hired',score:95,resume:''},
      {id:'APP-009',name:'Raza Hussain',email:'raza@email.com',phone:'+92 300 9009',jobId:'JOB-003',job:'React Native Developer',applied:'2024-06-10',stage:'Applied',score:68,resume:''},
      {id:'APP-010',name:'Zara Qureshi',email:'zara@email.com',phone:'+92 300 9010',jobId:'JOB-004',job:'Content Writer',applied:'2024-06-12',stage:'Screening',score:77,resume:''},
    ],
    performance: [
      {id:'PR-001',empId:'BS-002',emp:'Sara Khan',dept:'Development',period:'Q1 2024',score:4.8,goals:95,notes:'Outstanding performance. Consistently delivers high-quality code.',action:'Salary Increment',reviewed:'2024-03-31',next:'2024-06-30'},
      {id:'PR-002',empId:'BS-003',emp:'Ali Raza',dept:'Development',period:'Q1 2024',score:4.5,goals:90,notes:'Excellent architectural decisions. Strong team contributor.',action:'Continue',reviewed:'2024-03-31',next:'2024-06-30'},
      {id:'PR-003',empId:'BS-004',emp:'Nadia Farooq',dept:'Marketing',period:'Q1 2024',score:4.2,goals:85,notes:'Good results on campaigns. Room to improve on reporting.',action:'Continue',reviewed:'2024-03-31',next:'2024-06-30'},
      {id:'PR-004',empId:'BS-005',emp:'Marcus Hill',dept:'Development',period:'Q1 2024',score:4.0,goals:82,notes:'Reliable developer. Could improve on documentation.',action:'Training Required',reviewed:'2024-03-31',next:'2024-06-30'},
      {id:'PR-005',empId:'BS-006',emp:'Layla Mehmood',dept:'Content',period:'Q1 2024',score:4.4,goals:88,notes:'Excellent content quality. Strong SEO results.',action:'Continue',reviewed:'2024-03-31',next:'2024-06-30'},
      {id:'PR-006',empId:'BS-007',emp:'Omar Butt',dept:'Design',period:'Q1 2024',score:3.8,goals:78,notes:'Good design skills. Needs to improve meeting deadlines.',action:'Continue',reviewed:'2024-03-31',next:'2024-06-30'},
    ],
    training: [
      {id:'TR-001',title:'Advanced React Patterns',cat:'Technical',trainer:'Sara Khan',duration:'3 days',start:'2024-06-17',end:'2024-06-19',status:'Upcoming',enrolled:['BS-003','BS-005','BS-007'],progress:0,desc:'Deep dive into React hooks, context, and performance optimization.'},
      {id:'TR-002',title:'Digital Marketing Fundamentals',cat:'Technical',trainer:'Nadia Farooq',duration:'2 days',start:'2024-06-10',end:'2024-06-11',status:'In Progress',enrolled:['BS-006','BS-007'],progress:60,desc:'SEO, paid ads, email marketing and social media strategy.'},
      {id:'TR-003',title:'Leadership & Management',cat:'Leadership',trainer:'External Trainer',duration:'1 day',start:'2024-06-05',end:'2024-06-05',status:'Completed',enrolled:['BS-001','BS-002','BS-004'],progress:100,desc:'Effective team management and leadership strategies.'},
      {id:'TR-004',title:'UI/UX Design Principles',cat:'Technical',trainer:'Omar Butt',duration:'2 days',start:'2024-06-24',end:'2024-06-25',status:'Upcoming',enrolled:['BS-004','BS-006'],progress:0,desc:'Modern design thinking, prototyping and user research.'},
    ],
    announcements: [
      {id:'AN-001',cat:'Holiday',title:'Eid ul-Adha Public Holiday',body:'The office will remain closed on June 17th (Monday) on account of Eid ul-Adha. Wishing everyone a blessed Eid!',by:'Zaid Ahsan',date:'2024-06-05',priority:'High',pinned:true},
      {id:'AN-002',cat:'Policy',title:'Updated Remote Work Policy',body:'Effective July 1st, all employees may work remotely up to 2 days per week. Please coordinate with your team lead for scheduling. The full policy document is available on the shared drive.',by:'HR Team',date:'2024-06-03',priority:'Normal',pinned:false},
      {id:'AN-003',cat:'Event',title:'ByteStack Team Lunch – June 14th',body:'Join us for our monthly team lunch at Monal Restaurant on Friday June 14th at 1:00 PM. RSVP to HR by June 12th.',by:'Nadia Farooq',date:'2024-06-01',priority:'Normal',pinned:false},
    ],
    departments: ['Leadership','Development','Marketing','Design','Content'],
    leaveTypes: ['Annual','Sick','Casual','Unpaid','Maternity','Paternity'],
    settings: {
      companyName: 'ByteStack Digital Agency',
      email: 'contact.bytestack@gmail.com',
      phone: '+92 317 8495506',
      website: 'bytestack.io',
      address: 'Lahore, Punjab, Pakistan',
      workStart: '09:00', workEnd: '18:00', workDays: 'Mon-Fri',
      lateGrace: 15,
      annualLeave: 25, sickLeave: 10, casualLeave: 12,
      currency: 'PKR'
    }
  };

  // ── STORAGE HELPERS ──
  function getKey(k) {
    const raw = localStorage.getItem('bs_hr_' + k);
    if (!raw) {
      // Seed on first load
      localStorage.setItem('bs_hr_' + k, JSON.stringify(SEED[k] || []));
      return JSON.parse(JSON.stringify(SEED[k] || []));
    }
    return JSON.parse(raw);
  }

  function setKey(k, data) {
    localStorage.setItem('bs_hr_' + k, JSON.stringify(data));
  }

  // ── CRUD HELPERS ──
  function getAll(k) { return getKey(k); }

  function getById(k, id, idField = 'id') {
    return getAll(k).find(r => r[idField] === id) || null;
  }

  function add(k, record) {
    const all = getAll(k);
    all.unshift(record);
    setKey(k, all);
    return record;
  }

  function update(k, id, changes, idField = 'id') {
    const all = getAll(k).map(r => r[idField] === id ? { ...r, ...changes } : r);
    setKey(k, all);
    return all.find(r => r[idField] === id);
  }

  function remove(k, id, idField = 'id') {
    const filtered = getAll(k).filter(r => r[idField] !== id);
    setKey(k, filtered);
  }

  function nextId(k, prefix) {
    const all = getAll(k);
    const nums = all.map(r => parseInt(r.id?.split('-').pop() || '0')).filter(Boolean);
    const next = nums.length ? Math.max(...nums) + 1 : 1;
    return prefix + '-' + String(next).padStart(3, '0');
  }

  // ── SPECIFIC QUERIES ──
  function getAttendanceToday() {
    const today = new Date().toISOString().slice(0,10);
    return getAll('attendance').filter(r => r.date === today);
  }

  function getPendingLeaves() {
    return getAll('leaves').filter(l => l.status === 'Pending');
  }

  function getEmployeeLeaveBalance(empId) {
    const approved = getAll('leaves').filter(l => l.empId === empId && l.status === 'Approved');
    const used = { Annual: 0, Sick: 0, Casual: 0, Unpaid: 0 };
    approved.forEach(l => { if (used[l.type] !== undefined) used[l.type] += l.days; });
    const settings = getAll('settings') || SEED.settings;
    const cfg = Array.isArray(settings) ? SEED.settings : settings;
    return {
      Annual: { total: cfg.annualLeave, used: used.Annual, remaining: cfg.annualLeave - used.Annual },
      Sick:   { total: cfg.sickLeave,   used: used.Sick,   remaining: cfg.sickLeave   - used.Sick   },
      Casual: { total: cfg.casualLeave, used: used.Casual, remaining: cfg.casualLeave - used.Casual }
    };
  }

  function getSettings() {
    const raw = localStorage.getItem('bs_hr_settings');
    return raw ? JSON.parse(raw) : SEED.settings;
  }

  function saveSettings(data) {
    localStorage.setItem('bs_hr_settings', JSON.stringify(data));
  }

  function resetAll() {
    Object.keys(SEED).forEach(k => localStorage.removeItem('bs_hr_' + k));
  }

  return {
    getAll, getById, add, update, remove, nextId,
    getAttendanceToday, getPendingLeaves, getEmployeeLeaveBalance,
    getSettings, saveSettings, resetAll
  };

})();
