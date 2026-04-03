/* ═══════════════════════════════════════════
   BYTESTACK HR — LAYOUT BUILDER
   js/layout.js — injects sidebar + topbar
═══════════════════════════════════════════ */
'use strict';

const Layout = (() => {

  const NAV = [
    { group: 'Main', items: [
      { id: 'dashboard',    icon: '⬛', label: 'Dashboard',       href: 'dashboard.html',    roles: ['admin','manager','employee'] },
      { id: 'employees',    icon: '👥', label: 'Employees',        href: 'employees.html',    roles: ['admin','manager'], count: () => DB.getAll('employees').length },
      { id: 'recruitment',  icon: '🎯', label: 'Recruitment',      href: 'recruitment.html',  roles: ['admin','manager'], count: () => DB.getAll('applicants').filter(a=>a.stage==='Applied').length },
    ]},
    { group: 'Time & Pay', items: [
      { id: 'attendance',   icon: '📅', label: 'Attendance',       href: 'attendance.html',   roles: ['admin','manager','employee'] },
      { id: 'leaves',       icon: '🏖️', label: 'Leave Management', href: 'leaves.html',       roles: ['admin','manager','employee'], count: () => DB.getPendingLeaves().length },
      { id: 'payroll',      icon: '💰', label: 'Payroll',          href: 'payroll.html',      roles: ['admin'] },
    ]},
    { group: 'Growth', items: [
      { id: 'performance',  icon: '📈', label: 'Performance',      href: 'performance.html',  roles: ['admin','manager'] },
      { id: 'training',     icon: '🎓', label: 'Training',         href: 'training.html',     roles: ['admin','manager','employee'] },
      { id: 'announcements',icon: '📢', label: 'Announcements',    href: 'announcements.html',roles: ['admin','manager','employee'] },
    ]},
    { group: 'System', items: [
      { id: 'reports',      icon: '📊', label: 'Reports',          href: 'reports.html',      roles: ['admin'] },
      { id: 'settings',     icon: '⚙️', label: 'Settings',         href: 'settings.html',     roles: ['admin'] },
    ]},
  ];

  function currentPage() {
    return location.pathname.split('/').pop().replace('.html','') || 'dashboard';
  }

  function render(activeId) {
    const session = Auth.getSession();
    if (!session) return;
    const role = session.role;
    const deptColor = UI.deptColor(session.dept);
    const active = activeId || currentPage();

    // Build nav HTML
    let navHtml = '';
    NAV.forEach(group => {
      const visibleItems = group.items.filter(item => item.roles.includes(role));
      if (!visibleItems.length) return;
      navHtml += `<div class="nav-group"><div class="nav-group-label">${group.group}</div>`;
      visibleItems.forEach(item => {
        const count = item.count ? item.count() : 0;
        const countBadge = count > 0 ? `<span class="nav-count">${count}</span>` : '';
        navHtml += `<a class="nav-link ${item.id === active ? 'active' : ''}" href="${item.href}" data-label="${item.label}">
          <span class="nav-icon">${item.icon}</span>
          <span class="nav-text">${item.label}</span>
          ${countBadge}
        </a>`;
      });
      navHtml += '</div>';
    });

    const sidebarHtml = `
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-brand">
          <div>
            <div class="brand-logo">BYTE<span>STACK</span></div>
            <div class="brand-sub">HR Portal</div>
          </div>
          <button class="sidebar-toggle" onclick="Layout.toggleSidebar()" title="Toggle sidebar">☰</button>
        </div>
        ${navHtml}
        <div class="sidebar-bottom">
          <div class="sidebar-user" onclick="location.href='profile.html'" id="sidebar-user">
            <div class="sidebar-avatar" style="background:${deptColor}22;color:${deptColor}">${UI.initials(session.name)}</div>
            <div class="sidebar-user-info">
              <div class="sidebar-user-name">${session.name}</div>
              <div class="sidebar-user-role">${session.title}</div>
            </div>
          </div>
          <button class="nav-link" onclick="Auth.logout()" style="width:100%;text-align:left;border:none;background:none;margin-top:4px" data-label="Logout">
            <span class="nav-icon">🚪</span>
            <span class="nav-text">Logout</span>
          </button>
        </div>
      </aside>`;

    document.getElementById('layout-sidebar').innerHTML = sidebarHtml;
  }

  function renderTopbar(title, subtitle, actionBtn) {
    const session = Auth.getSession();
    const tb = document.getElementById('topbar');
    if (!tb || !session) return;
    tb.innerHTML = `
      <div class="topbar-page">
        <div class="topbar-title">${title}</div>
        <div class="topbar-sub">${subtitle || session.name + ' · ' + session.role}</div>
      </div>
      <div class="topbar-spacer"></div>
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Search…" id="global-search" oninput="Layout.globalSearch(this.value)">
      </div>
      ${actionBtn ? `<button class="btn btn-primary" id="topbar-cta" onclick="${actionBtn.fn}">${actionBtn.label}</button>` : ''}
      <button class="icon-btn" onclick="Layout.toggleNotif()" title="Notifications">
        🔔<span class="badge-dot" id="notif-dot"></span>
      </button>`;

    // Update notif dot
    const pending = DB.getPendingLeaves().length;
    const dot = document.getElementById('notif-dot');
    if (dot && pending === 0) dot.style.display = 'none';
  }

  function renderNotifPanel() {
    const panel = document.getElementById('notif-panel');
    if (!panel) return;
    const pending = DB.getPendingLeaves();
    const logs = Auth.getActivityLog().slice(0,8);
    let html = `<div class="notif-header"><div class="notif-title">NOTIFICATIONS</div><button class="btn btn-ghost btn-sm" onclick="Layout.markAllRead()">Mark all read</button></div>`;

    if (pending.length) {
      pending.forEach(l => {
        html += `<div class="notif-item unread">
          <div class="notif-icon" style="background:rgba(255,140,0,.12)">📋</div>
          <div class="notif-body">
            <div class="notif-text"><strong>${l.emp}</strong> requested ${l.days} day ${l.type} leave</div>
            <div class="notif-time">${UI.formatDate(l.appliedOn)}</div>
          </div>
          <div class="notif-dot"></div>
        </div>`;
      });
    }

    logs.forEach(log => {
      html += `<div class="notif-item">
        <div class="notif-icon" style="background:rgba(232,255,0,.08)">⚡</div>
        <div class="notif-body">
          <div class="notif-text">${log.msg}</div>
          <div class="notif-time">${UI.timeAgo(log.time)}</div>
        </div>
      </div>`;
    });

    if (!pending.length && !logs.length) html += `<div class="empty-state"><div class="empty-icon">🔔</div><div class="empty-title">All caught up</div></div>`;
    panel.innerHTML = html;
  }

  function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
  }

  function toggleNotif() {
    const p = document.getElementById('notif-panel');
    if (p) {
      p.classList.toggle('open');
      if (p.classList.contains('open')) renderNotifPanel();
    }
  }

  function markAllRead() {
    document.querySelectorAll('.notif-item.unread').forEach(n => {
      n.classList.remove('unread');
      const dot = n.querySelector('.notif-dot');
      if (dot) dot.remove();
    });
    const dot = document.getElementById('notif-dot');
    if (dot) dot.style.display = 'none';
  }

  function globalSearch(q) {
    if (!q) return;
    // Navigate to employees with search
    if (q.length > 2) {
      sessionStorage.setItem('hr_search', q);
    }
  }

  function init(pageId, title, subtitle, actionBtn) {
    if (!Auth.requireAuth()) return;
    render(pageId);
    renderTopbar(title, subtitle, actionBtn);

    // Close notif panel when clicking outside
    document.addEventListener('click', e => {
      const panel = document.getElementById('notif-panel');
      const btn = e.target.closest('.icon-btn');
      if (panel && panel.classList.contains('open') && !panel.contains(e.target) && !btn) {
        panel.classList.remove('open');
      }
    });
  }

  return { init, render, renderTopbar, toggleSidebar, toggleNotif, markAllRead, globalSearch };
})();
