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


/* ── Contact form (client-side demo submission) ───────────── */
const contactForm  = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    // Basic validation — check required fields
    let valid = true;
    contactForm.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#e53935';
      } else {
        field.style.borderColor = '';
      }
    });

    // Email format check
    const emailField = contactForm.querySelector('#email');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      valid = false;
      emailField.style.borderColor = '#e53935';
    }

    if (!valid) return;

    // Show success message (replace with real backend / mailto / Formspree etc.)
    if (formSuccess) {
      formSuccess.classList.add('show');
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    contactForm.reset();
  });

  // Clear red border on input
  contactForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => { field.style.borderColor = ''; });
  });
}
