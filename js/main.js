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
      initProjectionLocks();
      initLiveUpdates();
      initFavorites();
      initDemoAuth();
    } catch (err) {
      console.error('Nav load error:', err);
    }
  } else {
    initNavBehavior();
    injectPageBrand();
    initFooterSocial();
    initFeedActions();
    initProjectionLocks();
    initLiveUpdates();
    initFavorites();
    initDemoAuth();
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
    if (button.dataset.bound === 'true') {
      return;
    }
    button.dataset.bound = 'true';

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

function initProjectionLocks() {
  const lockPanels = document.querySelectorAll('[data-lock-time], [data-lock-in-minutes]');
  lockPanels.forEach((panel) => {
    const lockTime = resolveLockTime(panel);
    if (!lockTime) return;

    const badge = panel.querySelector('[data-lock-badge]');
    const meta = panel.querySelector('[data-lock-meta]');
    const targetSelector = panel.dataset.lockTarget;

    const update = () => {
      const now = new Date();
      const locked = now >= lockTime;

      panel.classList.toggle('is-locked', locked);

      if (badge) {
        badge.textContent = locked ? 'Locked' : 'Open';
        badge.classList.toggle('locked', locked);
        badge.classList.toggle('open', !locked);
      }

      if (meta) {
        if (locked) {
          meta.textContent = 'Locked for slate start';
        } else {
          const mins = Math.max(0, Math.ceil((lockTime - now) / 60000));
          meta.textContent = `Locks in ${mins}m`;
        }
      }

      if (targetSelector) {
        const targets = document.querySelectorAll(targetSelector);
        targets.forEach((target) => {
          target.classList.toggle('is-locked', locked);
          const buttons = target.querySelectorAll('button');
          buttons.forEach((button) => {
            button.disabled = locked;
            button.classList.toggle('is-disabled', locked);
          });
        });
      }
    };

    update();
    const intervalMinutes = Number(panel.dataset.lockIntervalMinutes || 1);
    if (intervalMinutes > 0) {
      setInterval(update, intervalMinutes * 60000);
    }
  });
}

function resolveLockTime(panel) {
  if (panel.dataset.lockTime) {
    const time = new Date(panel.dataset.lockTime);
    if (!Number.isNaN(time.getTime())) {
      return time;
    }
  }

  const minutes = Number(panel.dataset.lockInMinutes);
  if (!Number.isNaN(minutes) && minutes > 0) {
    const time = new Date(Date.now() + minutes * 60000);
    panel.dataset.lockTime = time.toISOString();
    return time;
  }

  return null;
}

function initLiveUpdates() {
  const nodes = document.querySelectorAll('[data-live-updated]');
  if (!nodes.length) return;

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const update = () => {
    const now = new Date();
    nodes.forEach((node) => {
      const prefix = node.dataset.livePrefix || 'Updated';
      node.textContent = `${prefix} ${formatTime(now)}`;
    });
  };

  update();
  const intervalSeconds = Number(nodes[0].dataset.liveInterval || 30);
  if (intervalSeconds > 0) {
    setInterval(update, intervalSeconds * 1000);
  }
}

function initFavorites() {
  const STORAGE_KEY = 'statstox:favorites';
  const toggleButtons = document.querySelectorAll('[data-favorite-toggle]');
  const targets = document.querySelectorAll('[data-favorite-team]');

  if (!toggleButtons.length && !targets.length) return;

  const getFavorites = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch (err) {
      return new Set();
    }
  };

  const saveFavorites = (set) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
  };

  const applyFavorites = (set) => {
    toggleButtons.forEach((button) => {
      const team = button.dataset.favoriteTeam;
      const active = team && set.has(team);
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    targets.forEach((target) => {
      const team = target.dataset.favoriteTeam;
      const active = team && set.has(team);
      target.classList.toggle('is-favorite', active);
    });
  };

  const favorites = getFavorites();
  applyFavorites(favorites);

  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const team = button.dataset.favoriteTeam;
      if (!team) return;

      if (favorites.has(team)) {
        favorites.delete(team);
      } else {
        favorites.add(team);
      }

      saveFavorites(favorites);
      applyFavorites(favorites);
    });
  });
}

function initDemoAuth() {
  const AUTH_KEY = 'statstox:auth';
  const toggle = document.querySelector('[data-auth-toggle]');
  const statusNodes = document.querySelectorAll('[data-auth-status]');
  const gated = document.querySelectorAll('[data-auth-required]');

  if (!toggle && !statusNodes.length && !gated.length) return;

  const getAuth = () => localStorage.getItem(AUTH_KEY) === 'true';
  const setAuth = (flag) => localStorage.setItem(AUTH_KEY, flag ? 'true' : 'false');

  const apply = (flag) => {
    statusNodes.forEach((node) => {
      node.textContent = flag ? 'Signed In' : 'Guest';
      node.classList.toggle('success', flag);
      node.classList.toggle('neutral', !flag);
    });

    gated.forEach((button) => {
      if (!button.dataset.authLabel) {
        button.dataset.authLabel = button.textContent.trim();
      }
      button.disabled = !flag;
      button.classList.toggle('is-disabled', !flag);
      button.textContent = flag ? button.dataset.authLabel : (button.dataset.authLockedLabel || 'Sign In');
      if (!flag) {
        button.setAttribute('title', 'Sign in to continue');
      } else {
        button.removeAttribute('title');
      }
    });
  };

  apply(getAuth());

  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = !getAuth();
      setAuth(next);
      apply(next);
    });
  }
}
