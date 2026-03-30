/* ═══════════════════════════════════════
   BYTESTACK — THEME TOGGLE (MODERN)
═══════════════════════════════════════ */

(function () {
  'use strict';

  // ── 1. Inject Toggle Button ──
  function injectToggleButton() {
    const navCta = document.querySelector('.nav-cta');
    if (!navCta) return;

    const btn = document.createElement('button');
    btn.id = 'themeToggle';
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', 'Toggle theme');

    btn.innerHTML = `
      <div class="toggle-track">
        <div class="toggle-thumb"></div>
      </div>
    `;

    navCta.insertAdjacentElement('beforebegin', btn);

    btn.addEventListener('click', toggleTheme);
  }

  // ── 2. Apply Theme ──
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nf-theme', theme);

    // update toggle position
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.classList.toggle('active', theme === 'dark');
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // ── 3. Init ──
  document.addEventListener('DOMContentLoaded', () => {
    injectToggleButton();
    const saved = localStorage.getItem('nf-theme') || 'dark';
    applyTheme(saved);
  });

})();