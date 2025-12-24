document.addEventListener('DOMContentLoaded', () => {
  console.log('Market Feed loaded');

  const grid = document.querySelector('.sports-feed-grid');
  if (!grid) return;

  const API_BASE = window.STATSTOX_API_BASE || 'http://localhost:5000/v1';

  const buildCard = (item) => {
    const card = document.createElement('article');
    card.className = 'sports-card';

    const title = document.createElement('strong');
    title.textContent = item.title || 'Market Update';

    const text = document.createElement('span');
    text.textContent = item.text || item.message || 'Live market movement.';

    const meta = document.createElement('div');
    meta.className = 'arena-meta';
    const sportChip = document.createElement('span');
    sportChip.className = 'stat-chip';
    sportChip.textContent = item.sport || item.league || 'Market';
    meta.appendChild(sportChip);

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
      const items = await fetchJson(`${API_BASE}/feeds/market`);
      if (Array.isArray(items) && items.length) {
        items.slice(0, 2).reverse().forEach((item) => {
          grid.insertBefore(buildCard(item), grid.firstChild);
        });
      }

      const dividends = await fetchJson(`${API_BASE}/wallet/dividends`);
      if (Array.isArray(dividends) && dividends.length) {
        const card = document.createElement('article');
        card.className = 'sports-card';
        const title = document.createElement('strong');
        title.textContent = 'DIVIDEND · StatCoin Credit';
        const text = document.createElement('span');
        text.textContent = `+${dividends[0].amount || 0} ${dividends[0].currency || 'STX'}`;
        const meta = document.createElement('div');
        meta.className = 'arena-meta';
        const chip = document.createElement('span');
        chip.className = 'stat-chip';
        chip.textContent = 'Market Rewards';
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
        grid.insertBefore(card, grid.firstChild);
      }

      if (typeof initFeedActions === 'function') {
        initFeedActions();
      }
    } catch (err) {
      console.warn('Market feed live data unavailable');
    }
  };

  loadFeed();
});
