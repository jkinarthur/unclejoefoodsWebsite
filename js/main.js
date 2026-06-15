/* ============================================================
   Uncle Joe Foods — main.js
   ============================================================ */

'use strict';

/* ── Footer year ──────────────────────────────────────────── */
const yearEls = document.querySelectorAll('#year');
yearEls.forEach(el => { el.textContent = new Date().getFullYear(); });


/* ── Mobile nav toggle ────────────────────────────────────── */
const toggle   = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close nav when clicking outside
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}


/* ── Hero background slider ───────────────────────────────── */
const heroBg   = document.getElementById('heroBg');
const heroSlides = [
  'images/banner-hero.jpg',
  'images/banner-hero-2.jpg'
];
const dotBtns = document.querySelectorAll('.hero-dots button');
let currentSlide = 0;
let slideTimer;

function goToSlide(index) {
  if (!heroBg) return;
  currentSlide = index;
  heroBg.style.backgroundImage = `url('${heroSlides[currentSlide]}')`;
  dotBtns.forEach((btn, i) => btn.classList.toggle('active', i === currentSlide));
}

function nextSlide() {
  goToSlide((currentSlide + 1) % heroSlides.length);
}

if (heroBg && heroSlides.length > 1) {
  dotBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      clearInterval(slideTimer);
      goToSlide(i);
      slideTimer = setInterval(nextSlide, 5000);
    });
  });
  slideTimer = setInterval(nextSlide, 5000);
}


/* ── Scroll-reveal ────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));


/* ── Product filter tabs ──────────────────────────────────── */
const filterTabs  = document.querySelectorAll('.filter-tab');
const productCards = document.querySelectorAll('.product-card[data-category]');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const filter = tab.dataset.filter;

    // Update active tab
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Show/hide cards
    productCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? '' : 'none';

      // Re-trigger reveal animation for visible cards
      if (match) {
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 30);
      }
    });
  });
});


/* ── FAQ accordion ────────────────────────────────────────── */
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen   = btn.classList.contains('open');
    const answer   = btn.nextElementSibling;

    // Close all
    faqQuestions.forEach(q => {
      q.classList.remove('open');
      q.setAttribute('aria-expanded', 'false');
      q.nextElementSibling.classList.remove('open');
    });

    // Open clicked (if it was closed)
    if (!isOpen) {
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});


/* ── Contact form → mailto submission ─────────────────────── */
const CONTACT_EMAIL = 'jjfetrading@gmail.com';

function buildMailtoLink(to, subjectText, fields) {
  const body = fields
    .map(f => `${f.label}: ${f.value}`)
    .join('\n');
  return `mailto:${to}?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(body)}`;
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    if (!field.value.trim()) {
      valid = false;
      field.style.borderColor = '#e53935';
    } else {
      field.style.borderColor = '';
    }
  });
  const emailField = form.querySelector('[type="email"]');
  if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
    valid = false;
    emailField.style.borderColor = '#e53935';
  }
  return valid;
}

/* General contact form */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => { field.style.borderColor = ''; });
  });

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm(contactForm)) return;

    const firstName = contactForm.firstName?.value.trim() || '';
    const lastName  = contactForm.lastName?.value.trim() || '';
    const emailVal  = contactForm.email?.value.trim() || '';
    const phoneVal  = contactForm.phone?.value.trim() || '';
    const subjectVal = contactForm.subject?.value || '';
    const messageVal = contactForm.message?.value.trim() || '';

    const mailto = buildMailtoLink(
      CONTACT_EMAIL,
      `Website Enquiry: ${subjectVal}`,
      [
        { label: 'Name',    value: `${firstName} ${lastName}` },
        { label: 'Email',   value: emailVal },
        { label: 'Phone',   value: phoneVal || 'Not provided' },
        { label: 'Subject', value: subjectVal },
        { label: 'Message', value: messageVal }
      ]
    );

    window.location.href = mailto;

    if (formSuccess) {
      formSuccess.classList.add('show');
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    contactForm.reset();
  });
}

/* Partner application form */
const partnerForm    = document.getElementById('partnerForm');
const partnerSuccess = document.getElementById('partnerSuccess');

if (partnerForm) {
  partnerForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => { field.style.borderColor = ''; });
  });

  partnerForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm(partnerForm)) return;

    const firstName    = partnerForm.firstName?.value.trim() || '';
    const lastName     = partnerForm.lastName?.value.trim() || '';
    const businessName = partnerForm.businessName?.value.trim() || '';
    const emailVal     = partnerForm.email?.value.trim() || '';
    const phoneVal     = partnerForm.phone?.value.trim() || '';
    const location     = partnerForm.location?.value.trim() || '';
    const partnerType  = partnerForm.partnerType?.value || '';
    const businessType = partnerForm.businessType?.value.trim() || '';
    const messageVal   = partnerForm.message?.value.trim() || '';

    const mailto = buildMailtoLink(
      CONTACT_EMAIL,
      `Partner Application: ${businessName}`,
      [
        { label: 'Applicant',       value: `${firstName} ${lastName}` },
        { label: 'Business Name',   value: businessName },
        { label: 'Email',           value: emailVal },
        { label: 'Phone',           value: phoneVal },
        { label: 'Location',        value: location },
        { label: 'Partnership Type',value: partnerType },
        { label: 'Business Type',   value: businessType || 'Not specified' },
        { label: 'Message',         value: messageVal }
      ]
    );

    window.location.href = mailto;

    if (partnerSuccess) {
      partnerSuccess.classList.add('show');
      partnerSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    partnerForm.reset();
  });
}
