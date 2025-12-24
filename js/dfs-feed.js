const PAGE_ID = 'dfs-feed';

document.addEventListener('DOMContentLoaded', () => {
  console.log(`${PAGE_ID} loaded`);

  const grid = document.querySelector('.feed-grid');
  if (!grid) return;

  const API_BASE = window.STATSTOX_API_BASE || 'http://localhost:5000/v1';

  const buildCard = (item) => {
    const card = document.createElement('article');
    card.className = 'feed-card';

    const title = document.createElement('strong');
    title.textContent = item.title || 'StatStox Update';

    const text = document.createElement('p');
    text.textContent = item.text || item.message || 'Live DFS signal update.';

    const meta = document.createElement('div');
    meta.className = 'arena-meta';

    const sportChip = document.createElement('span');
    sportChip.className = 'stat-chip';
    sportChip.textContent = item.sport || item.league || 'Multi-Sport';
    meta.appendChild(sportChip);

    if (item.createdAt || item.timestamp) {
      const timeChip = document.createElement('span');
      timeChip.className = 'stat-chip';
      const date = new Date(item.createdAt || item.timestamp);
      timeChip.textContent = Number.isNaN(date.getTime())
        ? 'Updated'
        : `Updated ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      meta.appendChild(timeChip);
    }

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
      const items = await fetchJson(`${API_BASE}/feeds/dfs`);
      if (!Array.isArray(items) || !items.length) return;
      items.slice(0, 3).reverse().forEach((item) => {
        grid.insertBefore(buildCard(item), grid.firstChild);
      });
      if (typeof initFeedActions === 'function') {
        initFeedActions();
      }
    } catch (err) {
      console.warn('DFS feed live data unavailable');
    }
  };

  loadFeed();
});
