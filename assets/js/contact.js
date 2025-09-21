'use strict';

/**
 * CONTACT PAGE
 * - Custom validation (name, email, message)
 * - Success message + localStorage save
 * - FAQ accordion behavior
 * - Newsletter save (optional to keep parity with site)
 */

document.addEventListener('DOMContentLoaded', () => {
  // ===== DOM =====
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const feedbackEl = document.getElementById('formFeedback');

  // Prefill name/email if saved previously
  try {
    const last = JSON.parse(localStorage.getItem('gb_lastContact') || 'null');
    if (last) {
      if (last.name) nameInput.value = last.name;
      if (last.email) emailInput.value = last.email;
    }
  } catch (_) {}

  // ===== Validation helpers =====
  // Basic, permissive email pattern for client-side checks
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  // Set field error state and show message
  function setError(input, errorEl, msg) {
    input.classList.add('input-error');
    errorEl.textContent = msg;
  }

  // Clear field error state and message
  function clearError(input, errorEl) {
    input.classList.remove('input-error');
    errorEl.textContent = '';
  }

  // Name must be at least 2 characters
  function validateName() {
    const v = nameInput.value.trim();
    if (v.length < 2) {
      setError(nameInput, nameError, 'Please enter at least 2 characters.');
      return false;
    }
    clearError(nameInput, nameError);
    return true;
  }

  // Email must match regex
  function validateEmail() {
    const v = emailInput.value.trim();
    if (!emailRegex.test(v)) {
      setError(emailInput, emailError, 'Please enter a valid email address.');
      return false;
    }
    clearError(emailInput, emailError);
    return true;
  }

  // Message must be at least 10 characters
  function validateMessage() {
    const v = messageInput.value.trim();
    if (v.length < 10) {
      setError(messageInput, messageError, 'Please write at least 10 characters.');
      return false;
    }
    clearError(messageInput, messageError);
    return true;
  }

  // Live validation on blur for faster feedback
  nameInput.addEventListener('blur', validateName);
  emailInput.addEventListener('blur', validateEmail);
  messageInput.addEventListener('blur', validateMessage);

  // ===== Submit =====
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Use bitwise & to ensure all validators run; truthiness is what's needed
    const ok =
      validateName() &
      validateEmail() &
      validateMessage(); // bitwise OK since we only care truthiness; keeps all messages

    if (!ok) return;

    // Basic payload to store (no network)
    const payload = {
      ts: new Date().toISOString(),
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim(),
    };

    // Save feedback list locally and remember last contact info
    try {
      const list = JSON.parse(localStorage.getItem('gb_feedback') || '[]');
      list.push(payload);
      localStorage.setItem('gb_feedback', JSON.stringify(list));
      // Save "last contact" for prefill
      localStorage.setItem(
        'gb_lastContact',
        JSON.stringify({ name: payload.name, email: payload.email })
      );
    } catch (_) {
      // ignore storage errors
    }

    // UI feedback and reset
    feedbackEl.textContent =
      'Thanks! Your message has been received. We’ll get back to you soon.';
    form.reset();

    // Remove error states after successful submit
    [nameInput, emailInput, messageInput].forEach((el) => el.classList.remove('input-error'));
    [nameError, emailError, messageError].forEach((el) => (el.textContent = ''));
  });

  // ===== FAQ Accordion =====
  // Single-open accordion with ARIA state sync
  const faqList = document.getElementById('faqList');
  if (faqList) {
    faqList.addEventListener('click', (e) => {
      const btn = e.target.closest('.faq-question');
      if (!btn) return;

      const item = btn.parentElement;
      const expanded = btn.getAttribute('aria-expanded') === 'true';

      // close others
      faqList.querySelectorAll('.faq-item').forEach((it) => {
        if (it !== item) {
          it.classList.remove('active');
          const b = it.querySelector('.faq-question');
          if (b) b.setAttribute('aria-expanded', 'false');
        }
      });

      // toggle current
      item.classList.toggle('active', !expanded);
      btn.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // ===== Optional: store newsletter email (matches other pages’ localStorage usage) =====
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailField = newsletterForm.querySelector('.email-field');
      const emailVal = (emailField?.value || '').trim();
      if (emailVal) {
        try {
          const saved = JSON.parse(localStorage.getItem('gb_newsletter') || '[]');
          if (!saved.includes(emailVal)) {
            saved.push(emailVal);
            localStorage.setItem('gb_newsletter', JSON.stringify(saved));
          }
        } catch (_) {}
      }
      // quick visual feedback via button text
      const btn = newsletterForm.querySelector('button[type="submit"]');
      const oldText = btn.textContent;
      btn.textContent = 'Thanks!';
      setTimeout(() => (btn.textContent = oldText), 1500);
      newsletterForm.reset();
    });
  }
});
