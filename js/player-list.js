document.addEventListener('DOMContentLoaded', () => {
  const list = document.querySelector('[data-player-list]');
  if (!list) return;

  const API_BASE = window.STATSTOX_API_BASE || 'http://localhost:5000/v1';
  const fallbackPlayers = [
    { id: 'josh-allen', name: 'Josh Allen', team: 'BUF', sport: 'NFL', position: 'QB' },
    { id: 'luka-doncic', name: 'Luka Doncic', team: 'DAL', sport: 'NBA', position: 'PG' },
    { id: 'sue-bird', name: 'Sue Bird', team: 'SEA', sport: 'WNBA', position: 'PG' }
  ];

  const fetchJson = async (url) => {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error('Fetch failed');
    return response.json();
  };

  const formatPrice = (value) => {
    if (typeof value !== 'number') return '--';
    return `$${value.toFixed(2)}`;
  };

  const buildRow = (player, quote) => {
    const row = document.createElement('div');
    row.className = 'player-row';

    const name = document.createElement('div');
    name.className = 'player-name';
    name.innerHTML = `
      <strong><a href="player-board.html?player=${player.id}">${player.name}</a></strong>
      <span class="player-team">${player.team || 'FA'}</span>
    `;

    const meta = document.createElement('div');
    meta.className = 'player-meta';
    meta.textContent = `${player.position || '—'} · ${player.sport || '—'}`;

    const price = document.createElement('div');
    price.className = 'player-price align-right';
    price.textContent = formatPrice(quote?.price);

    if (typeof quote?.change === 'number') {
      const change = document.createElement('span');
      change.className = `player-change ${quote.change >= 0 ? 'up' : 'down'}`;
      change.textContent = `${quote.change >= 0 ? '+' : ''}${quote.change.toFixed(2)}`;
      price.appendChild(change);
    }

    row.appendChild(name);
    row.appendChild(meta);
    row.appendChild(price);
    return row;
  };

  const loadPlayers = async () => {
    try {
      const [players, quotes] = await Promise.all([
        fetchJson(`${API_BASE}/players`),
        fetchJson(`${API_BASE}/market/quotes`)
      ]);

      const quoteMap = new Map((quotes || []).map((quote) => [quote.playerId, quote]));
      const listItems = Array.isArray(players) && players.length ? players : fallbackPlayers;

      list.innerHTML = '';
      listItems.forEach((player) => {
        list.appendChild(buildRow(player, quoteMap.get(player.id)));
      });
    } catch (err) {
      list.innerHTML = '';
      fallbackPlayers.forEach((player) => {
        list.appendChild(buildRow(player));
      });
    }
  };

  loadPlayers();
});
