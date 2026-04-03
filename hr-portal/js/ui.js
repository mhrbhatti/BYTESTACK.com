/* ═══════════════════════════════════════════
   BYTESTACK HR — UI UTILITIES
   js/ui.js
═══════════════════════════════════════════ */
'use strict';

const UI = (() => {

  const DEPT_COLORS = {
    Leadership: '#e8ff00', Development: '#4488ff',
    Marketing: '#ff8c00', Design: '#00ffcc',
    Content: '#00cc88', Default: '#888'
  };

  const STATUS_BADGE = {
    Active:    { cls: 'badge-green',   label: 'Active'    },
    'On Leave':{ cls: 'badge-orange',  label: 'On Leave'  },
    Inactive:  { cls: 'badge-red',     label: 'Inactive'  },
    Pending:   { cls: 'badge-orange',  label: 'Pending'   },
    Approved:  { cls: 'badge-green',   label: 'Approved'  },
    Rejected:  { cls: 'badge-red',     label: 'Rejected'  },
    Paid:      { cls: 'badge-green',   label: 'Paid'      },
    Processing:{ cls: 'badge-yellow',  label: 'Processing'},
    Upcoming:  { cls: 'badge-blue',    label: 'Upcoming'  },
    'In Progress': { cls: 'badge-yellow', label: 'In Progress' },
    Completed: { cls: 'badge-green',   label: 'Completed' },
    Applied:   { cls: 'badge-gray',    label: 'Applied'   },
    Screening: { cls: 'badge-blue',    label: 'Screening' },
    Interview: { cls: 'badge-yellow',  label: 'Interview' },
    Offer:     { cls: 'badge-orange',  label: 'Offer'     },
    Hired:     { cls: 'badge-green',   label: 'Hired'     },
    Withdrawn: { cls: 'badge-red',     label: 'Withdrawn' },
  };

  function deptColor(dept) {
    return DEPT_COLORS[dept] || DEPT_COLORS.Default;
  }

  function initials(name) {
    return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  function badge(status) {
    const b = STATUS_BADGE[status] || { cls: 'badge-gray', label: status };
    return `<span class="badge ${b.cls}">${b.label}</span>`;
  }

  function avatar(name, dept, size = 32) {
    const color = deptColor(dept);
    return `<div class="avatar" style="width:${size}px;height:${size}px;background:${color}22;color:${color};font-size:${Math.floor(size*0.3)}px">${initials(name)}</div>`;
  }

  function toast(msg, type = 'success') {
    const existing = document.getElementById('bs-toast');
    if (existing) existing.remove();

    const t = document.createElement('div');
    t.id = 'bs-toast';
    t.className = `toast toast-${type}`;
    t.innerHTML = `<span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span><span>${msg}</span>`;
    document.body.appendChild(t);

    requestAnimationFrame(() => t.classList.add('toast-show'));
    setTimeout(() => {
      t.classList.remove('toast-show');
      setTimeout(() => t.remove(), 300);
    }, 3500);
  }

  function confirm(msg) {
    return window.confirm(msg);
  }

  function formatCurrency(amount) {
    return 'PKR ' + Number(amount).toLocaleString();
  }

  function formatDate(str) {
    if (!str) return '—';
    const d = new Date(str);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function timeAgo(isoStr) {
    const secs = Math.floor((Date.now() - new Date(isoStr)) / 1000);
    if (secs < 60) return 'just now';
    if (secs < 3600) return Math.floor(secs / 60) + 'm ago';
    if (secs < 86400) return Math.floor(secs / 3600) + 'h ago';
    return Math.floor(secs / 86400) + 'd ago';
  }

  function progress(val, max = 100, color = 'var(--accent)') {
    const pct = Math.min(100, Math.round((val / max) * 100));
    return `<div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${color}"></div></div>`;
  }

  // Modal system
  function openModal(id) {
    const m = document.getElementById('modal-' + id);
    if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
  }

  function closeModal(id) {
    const m = document.getElementById('modal-' + id);
    if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
    });
    document.body.style.overflow = '';
  }

  // Tab system
  function initTabs(containerSel) {
    document.querySelectorAll(containerSel + ' .tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const container = tab.closest('.tabs-container');
        container.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        container.querySelectorAll('.tab-pane').forEach(p => {
          p.style.display = p.id === target ? '' : 'none';
        });
      });
    });
  }

  // Render sidebar user info
  function renderSidebarUser() {
    const session = Auth.getSession();
    if (!session) return;
    const el = document.getElementById('sidebar-user');
    if (el) {
      el.innerHTML = `
        <div class="sidebar-avatar" style="background:${deptColor(session.dept)}22;color:${deptColor(session.dept)}">${initials(session.name)}</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name">${session.name}</div>
          <div class="sidebar-user-role">${session.title}</div>
        </div>`;
    }
  }

  // Close modals on overlay click
  document.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) closeAllModals();
  });

  // ESC to close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllModals();
  });

  return {
    deptColor, initials, badge, avatar, toast, formatCurrency,
    formatDate, timeAgo, progress, openModal, closeModal, closeAllModals,
    initTabs, renderSidebarUser
  };

})();

// Global helpers
window.openModal = UI.openModal;
window.closeModal = UI.closeModal;
