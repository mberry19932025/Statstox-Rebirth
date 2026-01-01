document.addEventListener('DOMContentLoaded', () => {
  const feed = document.querySelector('.feed-grid');
  if (!feed) return;

  const API_BASE = window.STATSTOX_API_BASE || 'http://localhost:5000/v1';

  const buildSignal = (item) => {
    const card = document.createElement('article');
    card.className = 'feed-card';

    const title = document.createElement('strong');
    title.textContent = item.title || 'Signal Update';

    const text = document.createElement('p');
    text.textContent = item.text || 'Live signal update.';

    const meta = document.createElement('div');
    meta.className = 'arena-meta';
    const chip = document.createElement('span');
    chip.className = 'stat-chip';
    chip.textContent = item.sport || 'Signal';
    meta.appendChild(chip);

    const actions = document.createElement('div');
    actions.className = 'feed-actions';
    ['like', 'comment', 'share'].forEach((action) => {
      const button = document.createElement('button');
      button.className = 'feed-action';
      button.type = 'button';
      button.dataset.action = action;
      button.dataset.count = '0';
      button.textContent = action.charAt(0).toUpperCase() + action.slice(1);
      actions.appendChild(button);
    });

    card.appendChild(title);
    card.appendChild(text);
    card.appendChild(meta);
    card.appendChild(actions);
    return card;
  };

  const fetchJson = async (url) => {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error('Fetch failed');
    return response.json();
  };

  const loadFeed = async () => {
    try {
      const items = await fetchJson(`${API_BASE}/feeds/community`);
      if (Array.isArray(items) && items.length) {
        feed.innerHTML = '';
        items.slice(0, 4).reverse().forEach((item) => {
          feed.appendChild(buildSignal(item));
        });
      }

      if (typeof initFeedActions === 'function') {
        initFeedActions();
      }
    } catch (err) {
      console.warn('Signal Run live data unavailable');
    }
  };

  loadFeed();
});
