document.addEventListener('DOMContentLoaded', () => {
  console.log('Sports Feed loaded');

  const grid = document.querySelector('.sports-feed-grid');
  if (!grid) return;

  const API_BASE = window.STATSTOX_API_BASE || 'http://localhost:5000/v1';

  const buildCard = (titleText, bodyText, chips = []) => {
    const card = document.createElement('article');
    card.className = 'sports-card';

    const title = document.createElement('h3');
    title.textContent = titleText;

    const text = document.createElement('p');
    text.textContent = bodyText;

    const meta = document.createElement('div');
    meta.className = 'arena-meta';
    chips.forEach((chipText) => {
      const chip = document.createElement('span');
      chip.className = 'stat-chip';
      chip.textContent = chipText;
      meta.appendChild(chip);
    });

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
      const items = await fetchJson(`${API_BASE}/feeds/sports`);
      if (Array.isArray(items) && items.length) {
        items.slice(0, 2).reverse().forEach((item) => {
          const chips = [];
          if (item.sport) chips.push(item.sport);
          if (item.createdAt) {
            const date = new Date(item.createdAt);
            if (!Number.isNaN(date.getTime())) {
              chips.push(`Updated ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
            }
          }
          grid.insertBefore(buildCard(item.title || 'Sports Update', item.text || 'Live update', chips), grid.firstChild);
        });
      }

      const today = new Date().toISOString().slice(0, 10);
      const schedule = await fetchJson(`${API_BASE}/sports/schedule?date=${today}`);
      if (Array.isArray(schedule) && schedule.length) {
        schedule.slice(0, 2).reverse().forEach((event) => {
          const time = new Date(event.startTime);
          const chipTime = Number.isNaN(time.getTime())
            ? 'Scheduled'
            : `Start ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          const chips = [event.leagueId?.toUpperCase() || 'Event', chipTime];
          grid.insertBefore(buildCard(event.name || 'Live Event', event.venue || 'Scheduled', chips), grid.firstChild);
        });
      }

      if (typeof initFeedActions === 'function') {
        initFeedActions();
      }
    } catch (err) {
      console.warn('Sports feed live data unavailable');
    }
  };

  loadFeed();
});
