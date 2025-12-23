/* ===============================
   MAIN.JS — GLOBAL CORE
   =============================== */

document.addEventListener('DOMContentLoaded', async () => {
  /* ---------------------------------
     1. LOAD GLOBAL NAV (optional)
  ---------------------------------- */
  const navMount = document.getElementById('nav-mount');

  if (navMount) {
    try {
      const response = await fetch('./nav.html');
      if (!response.ok) throw new Error('Nav failed to load');
      navMount.innerHTML = await response.text();
      initNavBehavior();
      injectPageBrand();
      initFooterSocial();
      initFeedActions();
    } catch (err) {
      console.error('Nav load error:', err);
    }
  } else {
    initNavBehavior();
    injectPageBrand();
    initFooterSocial();
    initFeedActions();
  }
});

/* ---------------------------------
   2. NAV BEHAVIOR (LOCKED)
---------------------------------- */
function initNavBehavior() {
  const navLinks = document.querySelectorAll('.nav-links a');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-links');

  /* ACTIVE LINK HIGHLIGHT */
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  /* MOBILE TOGGLE */
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  }
}

function injectPageBrand() {
  const headers = document.querySelectorAll('.page-header');
  if (!headers.length) return;

  headers.forEach((header) => {
    if (header.querySelector('.page-brand')) return;

    const brand = document.createElement('div');
    brand.className = 'page-brand';
    brand.innerHTML = `
      <img src="./images/logo.png" alt="StatStox Logo" class="page-brand-logo" />
      <div class="page-brand-text">
        <span class="page-brand-name">StatStox</span>
        <span class="page-brand-tagline">We are changing the game while changing the game</span>
      </div>
    `;
    header.prepend(brand);
  });
}

function initFooterSocial() {
  const socials = document.querySelectorAll('.footer-social');
  socials.forEach((social) => {
    const trigger = social.querySelector('.social-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      social.classList.toggle('is-open');
    });
  });
}

function initFeedActions() {
  const actions = document.querySelectorAll('.feed-action');
  actions.forEach((button) => {
    if (!button.dataset.count) {
      button.dataset.count = '0';
    }

    button.addEventListener('click', () => {
      const label = (button.dataset.action || button.textContent || '').trim().toLowerCase();
      const count = Number(button.dataset.count || 0);

      if (label.includes('like')) {
        if (button.classList.contains('is-active')) {
          button.dataset.count = String(Math.max(0, count - 1));
          button.classList.remove('is-active');
        } else {
          button.dataset.count = String(count + 1);
          button.classList.add('is-active');
        }
      } else {
        button.dataset.count = String(count + 1);
      }

      button.classList.remove('is-bumped');
      void button.offsetWidth;
      button.classList.add('is-bumped');
    });
  });
}
