/* ═══════════════════════════════════════════════════════════
   NEXAFORGE — CONTACT FORM EMAIL SENDER
   Uses EmailJS (free, no backend needed)
   Sends to: contact.bytestack@gmail.com
   Save as: js/contact-mailer.js
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────
  // STEP 1 ► Replace these three values after EmailJS setup
  //          (instructions in README / integration guide)
  // ─────────────────────────────────────────────────────────
  const EMAILJS_PUBLIC_KEY  = 'wLVRZFRE1HlHjFp4Q';       // e.g. 'abc123XYZ'
  const EMAILJS_SERVICE_ID  = 'service_fqc35fz';       // e.g. 'service_xxxxxxx'
  const EMAILJS_TEMPLATE_ID = 'template_afly7mq';      // e.g. 'template_xxxxxxx'
  // ─────────────────────────────────────────────────────────

  // Load EmailJS SDK dynamically (no extra <script> tag needed)
  function loadEmailJS(callback) {
    if (window.emailjs) { callback(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s.onload = () => {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      callback();
    };
    document.head.appendChild(s);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form   = e.target;
    const btn    = form.querySelector('.form-submit');
    const orig   = btn.textContent;

    // Basic validation
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--accent3, #ff3d3d)';
        valid = false;
      }
    });
    if (!valid) {
      shakeBtn(btn);
      return;
    }

    // Build template params — these names must match your EmailJS template
    const params = {
      from_name  : (form.fname?.value + ' ' + form.lname?.value).trim(),
      from_email : form.email?.value,
      phone      : form.phone?.value      || 'Not provided',
      service    : form.service?.value    || 'Not specified',
      budget     : form.budget?.value     || 'Not specified',
      timeline   : form.timeline?.value   || 'Not specified',
      message    : form.message?.value,
      to_email   : 'contact.bytestack@gmail.com',
      reply_to   : form.email?.value,
    };

    // UI: loading state
    btn.textContent = 'Sending…';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    loadEmailJS(() => {
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
        .then(() => {
          btn.textContent   = '✓ Message Sent!';
          btn.style.opacity = '1';
          btn.style.background = 'var(--accent2, #00ffcc)';
          btn.style.color      = '#000';
          form.reset();
          setTimeout(() => {
            btn.textContent      = orig;
            btn.disabled         = false;
            btn.style.background = '';
            btn.style.color      = '';
          }, 4000);
        })
        .catch(err => {
          console.error('EmailJS error:', err);
          btn.textContent   = '✗ Failed — Try Again';
          btn.style.opacity = '1';
          btn.style.background = 'var(--accent3, #ff3d3d)';
          btn.disabled = false;
          setTimeout(() => {
            btn.textContent      = orig;
            btn.style.background = '';
          }, 3500);
        });
    });
  }

  function shakeBtn(btn) {
    btn.style.animation = 'none';
    btn.offsetHeight; // reflow
    btn.style.animation = 'shake 0.4s ease';
    if (!document.getElementById('shakeKeyframes')) {
      const style = document.createElement('style');
      style.id = 'shakeKeyframes';
      style.textContent = `
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60%  { transform: translateX(-6px); }
          40%,80%  { transform: translateX(6px); }
        }`;
      document.head.appendChild(style);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Remove the old inline listener from script.js (safe — addEventListener doesn't stack)
    form.addEventListener('submit', handleSubmit);
  });

})();
