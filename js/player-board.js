document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('player') || 'josh-allen';
  const API_BASE = window.STATSTOX_API_BASE || 'http://localhost:5000/v1';

  const fallbackProfiles = {
    'josh-allen': {
      player: { id: 'josh-allen', name: 'Josh Allen', team: 'BUF', sport: 'NFL', position: 'QB', status: 'active', tier: 'vip' },
      dfs: {
        salary: 7200,
        projection: 24.8,
        ownership: 0.12,
        ceiling: 32.5,
        floor: 18.2,
        matchup: 'BUF vs KC',
        startTime: '8:20 PM ET',
        slot: 'QB'
      },
      market: {
        price: 18.4,
        change: 0.6,
        volume: 1540,
        signal: 'bullish',
        dayTradeLimit: 6,
        expiryDate: '2025-02-15',
        spreadBps: 35,
        positionCap: 1000
      },
      projections: [
        { label: 'Passing Yards', value: '275.5' },
        { label: 'Passing TDs', value: '2.5' },
        { label: 'Rushing Yards', value: '34.5' },
        { label: 'Fantasy Points', value: '24.8' }
      ],
      gameLogs: [
        { date: 'Sep 15', opponent: 'MIA', line: '312 YDS · 3 TD', fp: 31.2 },
        { date: 'Sep 08', opponent: 'NYJ', line: '287 YDS · 2 TD', fp: 27.4 },
        { date: 'Sep 01', opponent: 'LAR', line: '254 YDS · 2 TD', fp: 24.1 }
      ]
    },
    'luka-doncic': {
      player: { id: 'luka-doncic', name: 'Luka Doncic', team: 'DAL', sport: 'NBA', position: 'PG', status: 'active', tier: 'premium' },
      dfs: {
        salary: 8450,
        projection: 46.2,
        ownership: 0.18,
        ceiling: 58.4,
        floor: 38.1,
        matchup: 'DAL vs LAL',
        startTime: '7:30 PM ET',
        slot: 'PG'
      },
      market: {
        price: 25.9,
        change: -0.4,
        volume: 980,
        signal: 'neutral',
        dayTradeLimit: 6,
        expiryDate: '2025-06-20',
        spreadBps: 35,
        positionCap: 1000
      },
      projections: [
        { label: 'Points', value: '31.5' },
        { label: 'Assists', value: '9.8' },
        { label: 'Rebounds', value: '8.4' },
        { label: 'Fantasy Points', value: '46.2' }
      ],
      gameLogs: [
        { date: 'Dec 20', opponent: 'PHX', line: '34 PTS · 11 AST', fp: 54.3 },
        { date: 'Dec 18', opponent: 'UTA', line: '29 PTS · 9 AST', fp: 46.7 },
        { date: 'Dec 15', opponent: 'SAS', line: '27 PTS · 8 AST', fp: 42.1 }
      ]
    },
    'sue-bird': {
      player: { id: 'sue-bird', name: 'Sue Bird', team: 'SEA', sport: 'WNBA', position: 'PG', status: 'inactive', tier: 'free' },
      dfs: {
        salary: 6100,
        projection: 22.1,
        ownership: 0.08,
        ceiling: 28.6,
        floor: 16.2,
        matchup: 'SEA vs LVA',
        startTime: '7:00 PM ET',
        slot: 'PG'
      },
      market: {
        price: 12.1,
        change: 0.1,
        volume: 320,
        signal: 'bearish',
        dayTradeLimit: 4,
        expiryDate: '2024-10-20',
        spreadBps: 35,
        positionCap: 800
      },
      projections: [
        { label: 'Points', value: '16.4' },
        { label: 'Assists', value: '6.2' },
        { label: 'Rebounds', value: '4.1' },
        { label: 'Fantasy Points', value: '22.1' }
      ],
      gameLogs: [
        { date: 'Aug 10', opponent: 'PHX', line: '18 PTS · 7 AST', fp: 26.8 },
        { date: 'Aug 07', opponent: 'MIN', line: '14 PTS · 6 AST', fp: 22.3 },
        { date: 'Aug 05', opponent: 'ATL', line: '11 PTS · 5 AST', fp: 18.6 }
      ]
    }
  };

  const fetchJson = async (url) => {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error('Fetch failed');
    return response.json();
  };

  const safeFetch = async (url) => {
    try {
      return await fetchJson(url);
    } catch (err) {
      return null;
    }
  };

  const formatCurrency = (value, digits = 0) => {
    if (typeof value !== 'number') return '--';
    if (window.formatutils?.currency) {
      return window.formatutils.currency(value);
    }
    return `$${value.toFixed(digits).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const formatNumber = (value) => {
    if (typeof value !== 'number') return '--';
    return value.toLocaleString();
  };

  const formatPercent = (value) => {
    if (typeof value !== 'number') return '--';
    return `${Math.round(value * 100)}%`;
  };

  const setText = (selector, value, fallback = '--') => {
    const node = document.querySelector(selector);
    if (!node) return;
    node.textContent = value ?? fallback;
  };

  const setTier = (tier) => {
    const avatar = document.querySelector('[data-player-avatar]');
    if (!avatar) return;
    const tiers = ['tier-free', 'tier-premium', 'tier-vip'];
    avatar.classList.remove(...tiers);
    const key = tier ? `tier-${tier}` : 'tier-free';
    avatar.classList.add(key);

    const tierNode = document.querySelector('[data-player-tier]');
    if (tierNode) {
      const label = window.tierutils?.getTierInfo(tier)?.label || tier || 'Free';
      tierNode.textContent = `${label} Tier`;
    }
  };

  const setSignal = (signal) => {
    const chips = document.querySelectorAll('[data-player-signal]');
    const text = document.querySelector('[data-player-signal-text]');
    const normalized = signal ? signal.toLowerCase() : 'neutral';
    const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);

    chips.forEach((chip) => {
      chip.textContent = label;
      chip.classList.remove('up', 'down');
      if (normalized === 'bullish') chip.classList.add('up');
      if (normalized === 'bearish') chip.classList.add('down');
    });

    if (text) {
      text.textContent = label;
    }
  };

  const setStatus = (status) => {
    const node = document.querySelector('[data-player-status]');
    if (!node) return;
    const normalized = status || 'inactive';
    node.textContent = normalized === 'active' ? 'Active' : 'Inactive';
    node.classList.remove('open', 'locked', 'neutral');
    node.classList.add(normalized === 'active' ? 'open' : 'locked');
  };

  const setChange = (value) => {
    const node = document.querySelector('[data-player-change]');
    if (!node) return;
    if (typeof value !== 'number') {
      node.textContent = '--';
      node.classList.remove('up', 'down');
      return;
    }
    node.textContent = `${value >= 0 ? '+' : ''}${value.toFixed(2)}`;
    node.classList.remove('up', 'down');
    node.classList.add(value >= 0 ? 'up' : 'down');
  };

  const renderGameLog = (logs) => {
    const body = document.querySelector('[data-player-gamelog]');
    if (!body) return;
    body.innerHTML = '';

    (logs || []).forEach((log) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${log.date || '--'}</td>
        <td>${log.opponent || '--'}</td>
        <td>${log.line || '--'}</td>
        <td class="align-right">${typeof log.fp === 'number' ? log.fp.toFixed(1) : '--'}</td>
      `;
      body.appendChild(row);
    });
  };

  const renderProjections = (items) => {
    const grid = document.querySelector('[data-player-projections]');
    if (!grid) return;
    grid.innerHTML = '';

    (items || []).forEach((item) => {
      const card = document.createElement('div');
      card.className = 'projection-card';
      card.innerHTML = `
        <span class="label">${item.label}</span>
        <span class="value">${item.value}</span>
      `;
      grid.appendChild(card);
    });
  };

  const hydrate = (profile) => {
    const player = profile.player || {};
    const dfs = profile.dfs || {};
    const market = profile.market || {};

    setText('[data-player-name]', player.name);
    setText('[data-player-meta]', `${player.position || '--'} · ${player.team || '--'} · ${player.sport || '--'}`);
    setText('[data-player-salary]', formatCurrency(dfs.salary));
    setText('[data-player-projection]', dfs.projection?.toFixed ? dfs.projection.toFixed(1) : dfs.projection);
    setText('[data-player-ownership]', formatPercent(dfs.ownership));
    setText('[data-player-ownership-inline]', formatPercent(dfs.ownership));
    setText('[data-player-price]', formatCurrency(market.price, 2));
    setText('[data-player-matchup]', dfs.matchup);
    setText('[data-player-start]', dfs.startTime);
    setText('[data-player-slot]', dfs.slot);
    setText('[data-player-ceiling]', dfs.ceiling?.toFixed ? dfs.ceiling.toFixed(1) : dfs.ceiling);
    setText('[data-player-floor]', dfs.floor?.toFixed ? dfs.floor.toFixed(1) : dfs.floor);
    setText('[data-player-volume]', formatNumber(market.volume));
    setText('[data-player-daytrade]', market.dayTradeLimit ? `${market.dayTradeLimit} trades` : '--');
    setText('[data-player-contract]', market.expiryDate || '--');
    setText('[data-player-spread]', market.spreadBps ? `${market.spreadBps} bps` : '--');
    setText('[data-player-position-cap]', market.positionCap ? `${formatNumber(market.positionCap)} shares` : '--');

    setTier(player.tier);
    setSignal(market.signal);
    setStatus(player.status);
    setChange(market.change);
    renderProjections(profile.projections);
    renderGameLog(profile.gameLogs);
  };

  const load = async () => {
    const fallback = fallbackProfiles[slug] || fallbackProfiles['josh-allen'];

    const [player, stats, quotes, rules, contracts] = await Promise.all([
      safeFetch(`${API_BASE}/players/${slug}`),
      safeFetch(`${API_BASE}/players/${slug}/stats`),
      safeFetch(`${API_BASE}/market/quotes?playerId=${slug}`),
      safeFetch(`${API_BASE}/market/rules`),
      safeFetch(`${API_BASE}/market/contracts`)
    ]);

    const quote = Array.isArray(quotes) ? quotes[0] : null;
    const contract = Array.isArray(contracts)
      ? contracts.find((item) => item.playerId === slug)
      : null;

    const profile = {
      player: {
        ...fallback.player,
        ...(player || {})
      },
      dfs: {
        ...fallback.dfs
      },
      market: {
        ...fallback.market,
        price: quote?.price ?? fallback.market.price,
        change: quote?.change ?? fallback.market.change,
        volume: quote?.volume ?? fallback.market.volume,
        signal: quote?.signal ?? fallback.market.signal,
        dayTradeLimit: contract?.dayTradeLimit ?? fallback.market.dayTradeLimit,
        expiryDate: contract?.expiryDate ?? fallback.market.expiryDate,
        spreadBps: rules?.spreadBps ?? fallback.market.spreadBps,
        positionCap: rules?.maxPositionSize ?? fallback.market.positionCap
      },
      projections: fallback.projections,
      gameLogs: fallback.gameLogs
    };

    if (stats?.gameLogs?.length) {
      profile.gameLogs = stats.gameLogs.map((log) => ({
        date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        opponent: log.opponent,
        line: buildLine(log.stats),
        fp: log.fantasyPoints
      }));
    }

    hydrate(profile);
  };

  const buildLine = (stats) => {
    if (!stats || typeof stats !== 'object') return '--';
    const parts = [];
    if (stats.yards) parts.push(`${stats.yards} YDS`);
    if (stats.touchdowns) parts.push(`${stats.touchdowns} TD`);
    if (stats.points) parts.push(`${stats.points} PTS`);
    if (stats.assists) parts.push(`${stats.assists} AST`);
    if (stats.rebounds) parts.push(`${stats.rebounds} REB`);
    return parts.join(' · ') || '--';
  };

  load();
});
