const nowIso = () => new Date().toISOString();
const inMinutes = (minutes) => new Date(Date.now() + minutes * 60000).toISOString();

const leagues = [
  {
    id: 'nfl',
    name: 'National Football League',
    sport: 'NFL',
    isSeasonal: false,
    activeWindow: { start: '2024-09-01', end: '2025-02-15' },
    status: 'active'
  },
  {
    id: 'nba',
    name: 'National Basketball Association',
    sport: 'NBA',
    isSeasonal: false,
    activeWindow: { start: '2024-10-01', end: '2025-06-20' },
    status: 'active'
  },
  {
    id: 'mlb',
    name: 'Major League Baseball',
    sport: 'MLB',
    isSeasonal: false,
    activeWindow: { start: '2024-03-20', end: '2024-11-02' },
    status: 'active'
  },
  {
    id: 'wnba',
    name: 'Women\'s National Basketball Association',
    sport: 'WNBA',
    isSeasonal: true,
    activeWindow: { start: '2024-05-15', end: '2024-10-20' },
    status: 'inactive'
  },
  {
    id: 'nhl',
    name: 'National Hockey League',
    sport: 'NHL',
    isSeasonal: false,
    activeWindow: { start: '2024-10-10', end: '2025-06-22' },
    status: 'active'
  },
  {
    id: 'mma',
    name: 'Mixed Martial Arts',
    sport: 'MMA',
    isSeasonal: true,
    activeWindow: { start: '2024-01-01', end: '2024-12-31' },
    status: 'active'
  },
  {
    id: 'pga',
    name: 'Professional Golf Association',
    sport: 'PGA',
    isSeasonal: true,
    activeWindow: { start: '2024-01-10', end: '2024-09-01' },
    status: 'inactive'
  },
  {
    id: 'nascar',
    name: 'NASCAR Cup Series',
    sport: 'NASCAR',
    isSeasonal: true,
    activeWindow: { start: '2024-02-18', end: '2024-11-10' },
    status: 'inactive'
  },
  {
    id: 'boxing',
    name: 'Boxing',
    sport: 'Boxing',
    isSeasonal: true,
    activeWindow: { start: '2024-01-01', end: '2024-12-31' },
    status: 'inactive'
  }
];

const schedule = [
  {
    id: 'event-nba-001',
    leagueId: 'nba',
    name: 'Lakers vs Warriors',
    startTime: inMinutes(90),
    status: 'scheduled',
    venue: 'Crypto.com Arena',
    timezone: 'ET',
    realTime: { updatedAt: nowIso(), nextUpdateAt: inMinutes(1), intervalSeconds: 60, isLive: false }
  },
  {
    id: 'event-nfl-001',
    leagueId: 'nfl',
    name: 'Chiefs vs Bills',
    startTime: inMinutes(15),
    status: 'live',
    venue: 'Highmark Stadium',
    timezone: 'ET',
    realTime: { updatedAt: nowIso(), nextUpdateAt: inMinutes(1), intervalSeconds: 60, isLive: true }
  }
];

const players = [
  {
    id: 'josh-allen',
    name: 'Josh Allen',
    team: 'BUF',
    sport: 'NFL',
    position: 'QB',
    status: 'active',
    dfsEnabled: true,
    marketEnabled: true,
    lastUpdated: nowIso()
  },
  {
    id: 'luka-doncic',
    name: 'Luka Doncic',
    team: 'DAL',
    sport: 'NBA',
    position: 'PG',
    status: 'active',
    dfsEnabled: true,
    marketEnabled: true,
    lastUpdated: nowIso()
  },
  {
    id: 'sue-bird',
    name: 'Sue Bird',
    team: 'SEA',
    sport: 'WNBA',
    position: 'PG',
    status: 'inactive',
    dfsEnabled: false,
    marketEnabled: false,
    lastUpdated: nowIso()
  }
];

const demoUser = {
  id: 'user-demo-001',
  username: 'statstoxfan',
  email: 'demo@statstox.com',
  tier: 'free',
  status: 'active',
  verified: true,
  createdAt: nowIso()
};

const playerStats = {
  'josh-allen': {
    playerId: 'josh-allen',
    season: '2024',
    aggregates: { yards: 3200, touchdowns: 28, turnovers: 7 },
    gameLogs: [
      {
        gameId: 'nfl-1001',
        date: '2024-09-15',
        opponent: 'MIA',
        stats: { yards: 312, touchdowns: 3 },
        fantasyPoints: 31.2
      }
    ],
    realTime: { updatedAt: nowIso(), nextUpdateAt: inMinutes(1), intervalSeconds: 60, isLive: true }
  }
};

const dfsRules = {
  minEntryFee: 1,
  maxEntryFee: 250,
  maxEntriesPerUser: 20,
  defaultRakePercent: 8,
  payoutCapPercent: 35,
  payoutCurveDefault: {
    shape: 'balanced',
    minCashRate: 0.22,
    maxShare: 0.25,
    payoutCap: 50000,
    note: 'Balanced curve to protect mid-field entries.'
  },
  notes: 'Entry caps and payout caps protect competitive balance.'
};

const dfsContests = [
  {
    id: 'dfs-classic-001',
    name: 'StatStox Classic',
    type: 'classic',
    sport: 'NFL',
    entryFee: 10,
    prizePool: 900,
    maxEntries: 100,
    entryCap: 10,
    payoutCap: 250,
    rakePercent: 8,
    payoutCurve: dfsRules.payoutCurveDefault,
    status: 'open',
    startTime: inMinutes(120),
    realTime: { updatedAt: nowIso(), nextUpdateAt: inMinutes(1), intervalSeconds: 60, isLive: false }
  },
  {
    id: 'dfs-showdown-001',
    name: 'StatStox Showdown',
    type: 'showdown',
    sport: 'NBA',
    entryFee: 25,
    prizePool: 2000,
    maxEntries: 200,
    entryCap: 20,
    payoutCap: 600,
    rakePercent: 9,
    payoutCurve: {
      shape: 'topHeavy',
      minCashRate: 0.18,
      maxShare: 0.35,
      payoutCap: 600,
      note: 'Top-heavy with payout cap.'
    },
    status: 'open',
    startTime: inMinutes(75),
    realTime: { updatedAt: nowIso(), nextUpdateAt: inMinutes(1), intervalSeconds: 60, isLive: false }
  }
];

const marketRules = {
  spreadBps: 35,
  maxDailyTrades: 30,
  maxPositionSize: 1000,
  feePercent: 1.2,
  payoutCapPercent: 40,
  notes: 'Spread and trade limits keep market fair and sustainable.'
};

const marketContracts = [
  {
    id: 'contract-josh-allen-2024',
    playerId: 'josh-allen',
    season: '2024',
    expiryDate: '2025-02-15',
    maxShares: 20000,
    dayTradeLimit: 6,
    priceTick: 0.05
  }
];

const marketQuotes = [
  {
    playerId: 'josh-allen',
    price: 18.4,
    change: 0.6,
    volume: 1540,
    signal: 'bullish',
    realTime: { updatedAt: nowIso(), nextUpdateAt: inMinutes(0.5), intervalSeconds: 30, isLive: true }
  }
];

const feeds = {
  dfs: [
    {
      id: 'feed-dfs-001',
      type: 'signal',
      title: 'Josh Allen Surge',
      text: 'Projection up 18% heading into prime time.',
      sport: 'NFL',
      source: 'StatStox Signals',
      createdAt: nowIso(),
      reactions: [
        { type: 'like', count: 24 },
        { type: 'comment', count: 5 },
        { type: 'share', count: 3 }
      ]
    }
  ],
  market: [
    {
      id: 'feed-market-001',
      type: 'update',
      title: 'Price Momentum',
      text: 'Luka Doncic price trending up.',
      sport: 'NBA',
      source: 'Market Engine',
      createdAt: nowIso(),
      reactions: [
        { type: 'like', count: 10 }
      ]
    }
  ],
  sports: [
    {
      id: 'feed-sports-001',
      type: 'news',
      title: 'NBA Tip-Off',
      text: 'Games start 7:30 PM ET.',
      sport: 'NBA',
      source: 'Schedule',
      createdAt: nowIso(),
      reactions: []
    }
  ],
  community: [
    {
      id: 'feed-community-001',
      type: 'update',
      title: '@MarketRunner',
      text: 'Momentum Run looking spicy tonight.',
      sport: 'NFL',
      source: 'Community',
      createdAt: nowIso(),
      reactions: [
        { type: 'like', count: 4 }
      ]
    }
  ]
};

const transactions = [
  {
    id: 'txn-001',
    type: 'deposit',
    amount: 50,
    currency: 'USD',
    status: 'completed',
    createdAt: nowIso()
  },
  {
    id: 'txn-002',
    type: 'entry_fee',
    amount: -10,
    currency: 'USD',
    status: 'posted',
    createdAt: nowIso()
  },
  {
    id: 'txn-003',
    type: 'statcoin_purchase',
    amount: -25,
    currency: 'USD',
    status: 'completed',
    createdAt: nowIso()
  },
  {
    id: 'txn-004',
    type: 'dividend_credit',
    amount: 8,
    currency: 'STX',
    status: 'posted',
    createdAt: nowIso()
  }
];

const wallet = {
  cashBalance: 250,
  statCoinBalance: 120,
  pending: 20,
  payoutCaps: { dfs: 35, market: 40 },
  updatedAt: nowIso()
};

const paymentMethods = [
  {
    id: 'card',
    name: 'Debit / Credit',
    type: 'card',
    rails: ['visa', 'mastercard', 'amex'],
    status: 'available',
    supports: { deposit: true, withdraw: true }
  },
  {
    id: 'ach',
    name: 'Bank Transfer (ACH)',
    type: 'bank',
    rails: ['ach'],
    status: 'available',
    supports: { deposit: true, withdraw: true }
  },
  {
    id: 'paypal',
    name: 'PayPal',
    type: 'wallet',
    rails: ['paypal'],
    status: 'available',
    supports: { deposit: true, withdraw: true }
  },
  {
    id: 'apple-pay',
    name: 'Apple Pay',
    type: 'wallet',
    rails: ['apple-pay'],
    status: 'available',
    supports: { deposit: true, withdraw: false }
  },
  {
    id: 'google-pay',
    name: 'Google Pay',
    type: 'wallet',
    rails: ['google-pay'],
    status: 'available',
    supports: { deposit: true, withdraw: false }
  },
  {
    id: 'promo',
    name: 'Promo Credits',
    type: 'promo',
    rails: ['statstox'],
    status: 'limited',
    supports: { deposit: true, withdraw: false }
  },
  {
    id: 'statcoin',
    name: 'StatCoin',
    type: 'token',
    rails: ['statstox'],
    status: 'beta',
    supports: { deposit: true, withdraw: false }
  }
];

const statCoin = {
  symbol: 'STX',
  name: 'StatCoin',
  rateUsd: 1,
  minPurchase: 10,
  maxPurchase: 500,
  status: 'beta',
  dividends: {
    mode: 'credits',
    cadence: 'weekly',
    note: 'Dividends are in-app credits, not cash payouts.'
  }
};

const dividends = [
  {
    id: 'div-001',
    source: 'market-performance',
    amount: 8,
    currency: 'STX',
    status: 'posted',
    createdAt: nowIso()
  }
];

module.exports = {
  leagues,
  schedule,
  players,
  demoUser,
  playerStats,
  dfsRules,
  dfsContests,
  marketRules,
  marketContracts,
  marketQuotes,
  feeds,
  transactions,
  wallet,
  paymentMethods,
  statCoin,
  dividends,
  nowIso,
  inMinutes
};
