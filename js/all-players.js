/* globals formatutils, notifications, performanceHeatUp */
const PAGE_ID = 'all-players';

document.addEventListener('DOMContentLoaded', () => {
  // --- elements ---
  const grid = document.getElementById('allPlayersGrid');
  const searchInput = document.getElementById('allPlayersSearch');
  const leagueSelect = document.getElementById('allPlayersLeague');
  const signalSelect = document.getElementById('allPlayersSignal');
  const sortSelect = document.getElementById('allPlayersSort');
  const statusText = document.getElementById('allPlayersStatus');

  // --- safety ---
  if (!grid || !searchInput || !leagueSelect || !signalSelect || !sortSelect || !statusText) {
    console.warn('[all-players] Missing required DOM nodes. Check IDs in all-players.html');
    return;
  }

  // --- helpers ---
  const normalize = (val) =>
    window.formatutils?.normalize
      ? window.formatutils.normalize(val)
      : String(val ?? '').toLowerCase().trim();

  const money = (n) =>
    window.formatutils?.money
      ? window.formatutils.money(n)
      : `$${Number(n || 0).toLocaleString()}`;

  const number1 = (n) =>
    window.formatutils?.number1
      ? window.formatutils.number1(n)
      : Number(n || 0).toFixed(1);

  // --- mock SPORTS player data (NOT avatars) ---
  // Backend later will replace this with real player feed.
  const players = [
    { id: 'nfl-josh-allen', name: 'Josh Allen', league: 'NFL', position: 'QB', team: 'BUF', signal: 'bullish', projection: 24.6, salary: 9200 },
    { id: 'nfl-tyreek-hill', name: 'Tyreek Hill', league: 'NFL', position: 'WR', team: 'MIA', signal: 'neutral', projection: 21.3, salary: 8800 },
    { id: 'nba-luka-doncic', name: 'Luka Dončić', league: 'NBA', position: 'PG', team: 'DAL', signal: 'bullish', projection: 52.1, salary: 11400 },
    { id: 'nba-joel-embiid', name: 'Joel Embiid', league: 'NBA', position: 'C', team: 'PHI', signal: 'bearish', projection: 47.8, salary: 10900 },
    { id: 'mlb-mookie-betts', name: 'Mookie Betts', league: 'MLB', position: 'OF', team: 'LAD', signal: 'bullish', projection: 10.4, salary: 5600 },
    { id: 'nhl-connor-mcdavid', name: 'Connor McDavid', league: 'NHL', position: 'C', team: 'EDM', signal: 'neutral', projection: 17.2, salary: 8700 },
    { id: 'wnba-aja-wilson', name: "A'ja Wilson", league: 'WNBA', position: 'F', team: 'LVA', signal: 'bullish', projection: 44.9, salary: 10300 },
    { id: 'mma-main-event', name: 'Main Event Fighter', league: 'MMA', position: 'FTR', team: '—', signal: 'bullish', projection: 8.9, salary: 7900 }
  ];

  // --- telemetry ---
  window.notifications?.add?.('All Players loaded');
  window.performanceHeatUp?.update?.({ page: PAGE_ID, action: 'view' });

  function renderPlayers(list) {
    grid.innerHTML = '';

    if (!list.length) {
      statusText.textContent = 'No players match your filters.';
      return;
    }

    statusText.textContent = `Showing ${list.length} players`;

    list.forEach((p) => {
      const card = document.createElement('a');
      card.className = 'player-card-link';
      card.href = `player-board.html?playerId=${encodeURIComponent(p.id)}`;
      card.setAttribute('aria-label', `Open ${p.name} player board`);

      card.innerHTML = `
        <article class="player-card" data-player-id="${p.id}">
          <div class="player-card-left">
            <img class="player-avatar-img" src="./images/player-silhouette.png" alt="Player silhouette" />
          </div>

          <div class="player-card-mid">
            <h3 class="player-name">${p.name}</h3>
            <p class="player-sub">
              <span class="pill">${p.position}</span>
              <span class="dot">•</span>
              <span class="pill">${p.team}</span>
              <span class="dot">•</span>
              <span class="pill">${p.league}</span>
            </p>

            <p class="player-metrics">
              <span class="metric"><strong>Proj</strong> ${number1(p.projection)}</span>
              <span class="metric"><strong>Salary</strong> ${money(p.salary)}</span>
            </p>
          </div>

          <div class="player-card-right">
            <span class="signal-badge signal-${p.signal}">${p.signal}</span>
            <span class="cta-mini">Open</span>
          </div>
        </article>
      `;

      grid.appendChild(card);
    });
  }

  function applyFilters() {
    const query = normalize(searchInput.value);
    const league = leagueSelect.value;
    const signal = signalSelect.value;
    const sort = sortSelect.value;

    let filtered = players.filter((p) => {
      const nameOk = normalize(p.name).includes(query);
      const leagueOk = league === 'ALL' || p.league === league;
      const signalOk = signal === 'ALL' || p.signal === signal;
      return nameOk && leagueOk && signalOk;
    });

    filtered.sort((a, b) => {
      if (sort === 'proj-asc') return a.projection - b.projection;
      return b.projection - a.projection; // default desc
    });

    renderPlayers(filtered);
  }

  // --- events ---
  searchInput.addEventListener('input', applyFilters);
  leagueSelect.addEventListener('change', applyFilters);
  signalSelect.addEventListener('change', applyFilters);
  sortSelect.addEventListener('change', applyFilters);

  // first render
  applyFilters();
});