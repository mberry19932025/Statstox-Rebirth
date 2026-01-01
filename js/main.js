/* ===============================
   MAIN.JS — GLOBAL CORE
   =============================== */

const DEFAULT_API_BASE = 'http://localhost:5000/v1';
const REMOTE_API_BASE = 'https://statstox-api.onrender.com/v1';

function resolveApiBase() {
  const host = window.location.hostname;
  if (!host || host === 'localhost' || host === '127.0.0.1') {
    return DEFAULT_API_BASE;
  }
  return REMOTE_API_BASE;
}

window.STATSTOX_API_BASE = window.STATSTOX_API_BASE || resolveApiBase();

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
      injectMiniGamesLink();
      initFooterSocial();
      initFeedActions();
      initProjectionLocks();
      initLiveUpdates();
      initFavorites();
      initDemoAuth();
      initDemoEntries();
    } catch (err) {
      console.error('Nav load error:', err);
    }
  } else {
    initNavBehavior();
    injectPageBrand();
    injectMiniGamesLink();
    initFooterSocial();
    initFeedActions();
    initProjectionLocks();
    initLiveUpdates();
    initFavorites();
    initDemoAuth();
    initDemoEntries();
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

function injectMiniGamesLink() {
  const groups = Array.from(document.querySelectorAll('.nav-group'));
  if (!groups.length) return;

  const target = groups.find((group) => {
    const trigger = group.querySelector('.nav-trigger');
    return trigger && trigger.textContent.trim().toLowerCase().startsWith('draft');
  });

  if (!target) return;
  const dropdown = target.querySelector('.nav-dropdown');
  if (!dropdown) return;

  const existing = Array.from(dropdown.querySelectorAll('a')).some((link) =>
    (link.getAttribute('href') || '').includes('draft.html#mini-games')
  );

  if (existing) return;

  const link = document.createElement('a');
  link.href = 'draft.html#mini-games';
  link.textContent = 'Mini Games';
  dropdown.appendChild(link);
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

  const getAuth = () =>
    localStorage.getItem(AUTH_KEY) === 'true' || Boolean(localStorage.getItem('statstox:token'));
  const setAuth = (flag) => localStorage.setItem(AUTH_KEY, flag ? 'true' : 'false');

  const apply = (flag) => {
    statusNodes.forEach((node) => {
      node.textContent = flag ? 'Signed In' : 'Guest';
      node.classList.toggle('success', flag);
      node.classList.toggle('neutral', !flag);
    });

    gated.forEach((button) => {
      const allowPreview = button.hasAttribute('data-demo-entry');
      if (!button.dataset.authLabel) {
        button.dataset.authLabel = button.textContent.trim();
      }
      button.classList.remove('is-disabled', 'is-soft-locked');
      button.textContent = flag ? button.dataset.authLabel : (button.dataset.authLockedLabel || 'Sign In');
      if (!flag) {
        if (allowPreview) {
          button.disabled = false;
          button.classList.add('is-soft-locked');
        } else {
          button.disabled = true;
          button.classList.add('is-disabled');
        }
        button.setAttribute('title', 'Sign in to continue');
      } else {
        button.disabled = false;
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

function initDemoEntries() {
  const triggers = document.querySelectorAll('[data-demo-entry]');
  if (!triggers.length) return;

  const API_BASE = window.STATSTOX_API_BASE || 'http://localhost:5000/v1';
  const modal = ensureDemoModal();

  const getAuth = () =>
    localStorage.getItem('statstox:auth') === 'true' || Boolean(localStorage.getItem('statstox:token'));

  const submitEntry = async (payload) => {
    try {
      await fetch(`${API_BASE}/demo/entry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      // demo only; ignore network failures
    }
  };

  const openModal = ({ title, message, primaryLabel, primaryHref }) => {
    const titleNode = modal.querySelector('[data-demo-title]');
    const copyNode = modal.querySelector('[data-demo-copy]');
    const primary = modal.querySelector('[data-demo-primary]');

    if (titleNode) titleNode.textContent = title;
    if (copyNode) copyNode.textContent = message;

    if (primary && primaryHref) {
      primary.classList.remove('is-hidden');
      primary.href = primaryHref;
      primary.textContent = primaryLabel || 'Continue';
    } else if (primary) {
      primary.classList.add('is-hidden');
    }

    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  };

  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.closest('[data-demo-close]')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });

  triggers.forEach((trigger) => {
    if (trigger.dataset.demoEntryBound === 'true') return;
    trigger.dataset.demoEntryBound = 'true';

    trigger.addEventListener('click', (event) => {
      event.preventDefault();

      const label = trigger.dataset.entryLabel || trigger.textContent.trim() || 'Entry';
      const hrefTarget = trigger.tagName === 'A' ? trigger.getAttribute('href') : '';
      const target = (trigger.dataset.entryTarget || hrefTarget || '').trim();
      const cleanTarget = target === '#' ? '' : target;
      const entryType = trigger.dataset.entryType || '';
      const authed = getAuth();

      if (trigger.hasAttribute('data-auth-required') && !authed) {
        openModal({
          title: 'Sign in required',
          message: 'Sign in to enter this contest. For demo, use the Login page or toggle Demo Auth in Settings.',
          primaryLabel: 'Go to Login',
          primaryHref: 'login.html'
        });
        return;
      }

      submitEntry({
        label,
        entryType,
        target: cleanTarget,
        source: window.location.pathname
      });

      openModal({
        title: 'Entry confirmed',
        message: `${label} locked in for this slate (demo).`,
        primaryLabel: cleanTarget ? 'Continue' : 'Close',
        primaryHref: cleanTarget || ''
      });
    });
  });
}

function ensureDemoModal() {
  const existing = document.querySelector('.demo-modal');
  if (existing) return existing;

  const modal = document.createElement('div');
  modal.className = 'demo-modal';
  modal.innerHTML = `
    <div class="demo-modal-card" role="dialog" aria-modal="true" aria-labelledby="demo-modal-title">
      <div class="demo-modal-head">
        <div>
          <span class="demo-modal-eyebrow">StatStox Demo</span>
          <h3 id="demo-modal-title" data-demo-title>Entry confirmed</h3>
        </div>
        <button class="demo-modal-close" type="button" data-demo-close aria-label="Close">×</button>
      </div>
      <p class="demo-modal-copy" data-demo-copy></p>
      <div class="demo-modal-actions">
        <a href="#" class="btn-primary" data-demo-primary>Continue</a>
        <button class="btn-secondary" type="button" data-demo-close>Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}
