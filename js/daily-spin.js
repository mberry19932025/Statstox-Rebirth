document.addEventListener('DOMContentLoaded', () => {
  const baseRoot = document.querySelector('[data-daily-spin]');
  if (!baseRoot) return;

  const modal = buildSpinModal(baseRoot);
  if (modal) {
    document.body.appendChild(modal);
  }

  const roots = Array.from(document.querySelectorAll('[data-daily-spin]'));
  if (!roots.length) return;

  const SPIN_KEY = 'statstox:dailySpin';
  const POPUP_KEY = 'statstox:dailySpinPopup';
  const rewards = [
    { label: '5 STX', weight: 40 },
    { label: '10 STX', weight: 28 },
    { label: '15 STX', weight: 18 },
    { label: 'VIP Boost', weight: 14 }
  ];

  const todayKey = new Date().toDateString();
  const stored = safeParse(localStorage.getItem(SPIN_KEY));
  const hasSpun = stored?.date === todayKey;

  const getAuth = () =>
    localStorage.getItem('statstox:auth') === 'true' ||
    Boolean(localStorage.getItem('statstox:token'));

  const syncState = () => {
    const current = safeParse(localStorage.getItem(SPIN_KEY));
    const claimed = current?.date === todayKey;
    roots.forEach((root) => {
      const wheel = root.querySelector('[data-spin-wheel]');
      const button = root.querySelector('[data-spin-btn]');
      const status = root.querySelector('[data-spin-status]');
      if (!wheel || !button || !status) return;

      const authed = getAuth();
      if (!authed) {
        button.disabled = true;
        button.classList.add('is-disabled');
        status.textContent = 'Sign in to spin';
        return;
      }

      if (claimed) {
        status.textContent = `Claimed: ${current.reward}`;
        button.disabled = true;
        button.classList.add('is-disabled');
      } else {
        button.disabled = false;
        button.classList.remove('is-disabled');
        status.textContent = 'Available now';
      }
    });
  };

  const triggerSpin = (root) => {
    const wheel = root.querySelector('[data-spin-wheel]');
    const button = root.querySelector('[data-spin-btn]');
    const status = root.querySelector('[data-spin-status]');
    if (!wheel || !button || !status) return;
    if (button.disabled) return;

    const reward = pickReward(rewards);
    const rotation = spinRotation(rewards, reward.index);
    wheel.style.transform = `rotate(${rotation}deg)`;

    button.disabled = true;
    button.classList.add('is-disabled');
    status.textContent = 'Spinning...';

    window.setTimeout(() => {
      localStorage.setItem(SPIN_KEY, JSON.stringify({
        date: todayKey,
        reward: reward.label
      }));
      syncState();
    }, 3200);
  };

  roots.forEach((root) => {
    const button = root.querySelector('[data-spin-btn]');
    if (!button) return;
    if (button.dataset.spinBound === 'true') return;
    button.dataset.spinBound = 'true';
    button.addEventListener('click', () => triggerSpin(root));
  });

  syncState();

  const popupStored = safeParse(localStorage.getItem(POPUP_KEY));
  if (!hasSpun && getAuth() && (!popupStored || popupStored.date !== todayKey)) {
    openSpinModal();
    localStorage.setItem(POPUP_KEY, JSON.stringify({ date: todayKey }));
  }

  function openSpinModal() {
    const modalRoot = document.querySelector('.daily-spin-modal');
    if (!modalRoot) return;
    modalRoot.classList.add('is-open');
    document.body.classList.add('spin-modal-open');
  }

  function closeSpinModal() {
    const modalRoot = document.querySelector('.daily-spin-modal');
    if (!modalRoot) return;
    modalRoot.classList.remove('is-open');
    document.body.classList.remove('spin-modal-open');
  }

  document.addEventListener('click', (event) => {
    const modalRoot = document.querySelector('.daily-spin-modal');
    if (!modalRoot || !modalRoot.classList.contains('is-open')) return;
    if (event.target === modalRoot || event.target.closest('[data-spin-close]')) {
      closeSpinModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSpinModal();
    }
  });
});

function pickReward(options) {
  const total = options.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < options.length; i += 1) {
    roll -= options[i].weight;
    if (roll <= 0) {
      return { label: options[i].label, index: i };
    }
  }
  return { label: options[0].label, index: 0 };
}

function spinRotation(options, index) {
  const segment = 360 / options.length;
  const offset = Math.random() * (segment * 0.7) + (segment * 0.15);
  const turns = 5;
  return (turns * 360) + (index * segment) + offset;
}

function safeParse(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function buildSpinModal(source) {
  if (!source) return null;
  if (document.querySelector('.daily-spin-modal')) return null;

  const modal = document.createElement('div');
  modal.className = 'daily-spin-modal';
  modal.innerHTML = `
    <div class="daily-spin-modal-card">
      <button class="daily-spin-close" type="button" data-spin-close aria-label="Close">×</button>
    </div>
  `;

  const modalCard = modal.querySelector('.daily-spin-modal-card');
  const clone = source.cloneNode(true);
  clone.classList.add('daily-spin-popup');
  modalCard.appendChild(clone);
  return modal;
}
