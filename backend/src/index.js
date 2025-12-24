const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const { body } = require('express-validator');
const { generalLimiter, writeLimiter } = require('./middleware/limits');
const { handleValidation } = require('./middleware/validate');
const {
  leagues,
  schedule,
  players,
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
  nowIso
} = require('./data/stubs');

const app = express();
const base = '/v1';

app.disable('x-powered-by');
app.use(helmet());
app.use(hpp());
app.use(morgan('tiny'));

const corsOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

app.use(cors({
  origin: corsOrigins.length ? corsOrigins : '*'
}));
app.use(express.json({ limit: '200kb' }));
app.use(generalLimiter);

app.get(`${base}/meta/health`, (req, res) => {
  res.json({ status: 'ok', time: nowIso() });
});

app.get(`${base}/sports/leagues`, (req, res) => {
  const { active, seasonal } = req.query;
  let list = [...leagues];

  if (typeof seasonal !== 'undefined') {
    const flag = seasonal === 'true';
    list = list.filter((league) => league.isSeasonal === flag);
  }

  if (typeof active !== 'undefined') {
    const flag = active === 'true';
    list = list.filter((league) => (flag ? league.status === 'active' : league.status !== 'active'));
  }

  res.json(list);
});

app.get(`${base}/sports/schedule`, (req, res) => {
  const { date, sport } = req.query;

  let list = [...schedule];
  if (sport) {
    list = list.filter((event) => event.name.toLowerCase().includes(String(sport).toLowerCase()) || event.leagueId === String(sport).toLowerCase());
  }

  if (date) {
    list = list.filter((event) => event.startTime.startsWith(date));
  }

  res.json(list);
});

app.get(`${base}/players`, (req, res) => {
  const { sport, status, marketEnabled, dfsEnabled, q } = req.query;
  let list = [...players];

  if (sport) {
    list = list.filter((player) => player.sport.toLowerCase() === String(sport).toLowerCase());
  }

  if (status) {
    list = list.filter((player) => player.status === status);
  }

  if (typeof marketEnabled !== 'undefined') {
    const flag = marketEnabled === 'true';
    list = list.filter((player) => player.marketEnabled === flag);
  }

  if (typeof dfsEnabled !== 'undefined') {
    const flag = dfsEnabled === 'true';
    list = list.filter((player) => player.dfsEnabled === flag);
  }

  if (q) {
    const query = String(q).toLowerCase();
    list = list.filter((player) => player.name.toLowerCase().includes(query));
  }

  res.json(list);
});

app.get(`${base}/players/:playerId`, (req, res) => {
  const player = players.find((item) => item.id === req.params.playerId);
  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }
  res.json(player);
});

app.get(`${base}/players/:playerId/stats`, (req, res) => {
  const stats = playerStats[req.params.playerId];
  if (!stats) {
    return res.status(404).json({ error: 'Stats not found' });
  }
  res.json(stats);
});

app.get(`${base}/dfs/contests`, (req, res) => {
  const { type, sport, status } = req.query;
  let list = [...dfsContests];

  if (type) {
    list = list.filter((contest) => contest.type === type);
  }

  if (sport) {
    list = list.filter((contest) => contest.sport.toLowerCase() === String(sport).toLowerCase());
  }

  if (status) {
    list = list.filter((contest) => contest.status === status);
  }

  res.json(list);
});

app.get(`${base}/dfs/contests/:contestId`, (req, res) => {
  const contest = dfsContests.find((item) => item.id === req.params.contestId);
  if (!contest) {
    return res.status(404).json({ error: 'Contest not found' });
  }
  res.json(contest);
});

app.post(
  `${base}/dfs/contests/:contestId/enter`,
  writeLimiter,
  [
    body('entries').optional().isInt({ min: 1, max: 50 }),
    body('lineupId').optional().isString().isLength({ max: 64 })
  ],
  handleValidation,
  (req, res) => {
  const contest = dfsContests.find((item) => item.id === req.params.contestId);
  if (!contest) {
    return res.status(404).json({ error: 'Contest not found' });
  }

  res.json({
    status: 'accepted',
    contestId: contest.id,
    entries: req.body?.entries || 1,
    receivedAt: nowIso()
  });
  }
);

app.get(`${base}/dfs/rules`, (req, res) => {
  res.json(dfsRules);
});

app.get(`${base}/market/contracts`, (req, res) => {
  const { season, sport } = req.query;
  let list = [...marketContracts];

  if (season) {
    list = list.filter((contract) => contract.season === season);
  }

  if (sport) {
    const sportLower = String(sport).toLowerCase();
    const playerIds = players
      .filter((player) => player.sport.toLowerCase() === sportLower)
      .map((player) => player.id);
    list = list.filter((contract) => playerIds.includes(contract.playerId));
  }

  res.json(list);
});

app.get(`${base}/market/quotes`, (req, res) => {
  const { sport, playerId } = req.query;
  let list = [...marketQuotes];

  if (playerId) {
    list = list.filter((quote) => quote.playerId === playerId);
  }

  if (sport) {
    const sportLower = String(sport).toLowerCase();
    const playerIds = players
      .filter((player) => player.sport.toLowerCase() === sportLower)
      .map((player) => player.id);
    list = list.filter((quote) => playerIds.includes(quote.playerId));
  }

  res.json(list);
});

app.post(
  `${base}/market/orders`,
  writeLimiter,
  [
    body('playerId').isString().notEmpty(),
    body('type').isIn(['buy', 'sell']),
    body('quantity').isFloat({ gt: 0 }),
    body('price').isFloat({ gt: 0 })
  ],
  handleValidation,
  (req, res) => {
    const payload = req.body || {};
    res.json({
      id: `order-${Date.now()}`,
      status: 'pending',
      createdAt: nowIso(),
      ...payload
    });
  }
);

app.get(`${base}/market/orders/:orderId`, (req, res) => {
  res.json({
    id: req.params.orderId,
    status: 'pending',
    createdAt: nowIso()
  });
});

app.get(`${base}/market/rules`, (req, res) => {
  res.json(marketRules);
});

app.get(`${base}/feeds/dfs`, (req, res) => {
  res.json(feeds.dfs);
});

app.get(`${base}/feeds/market`, (req, res) => {
  res.json(feeds.market);
});

app.get(`${base}/feeds/sports`, (req, res) => {
  res.json(feeds.sports);
});

app.get(`${base}/feeds/community`, (req, res) => {
  res.json(feeds.community);
});

app.post(
  `${base}/feeds/:feedId/reactions`,
  writeLimiter,
  [
    body('type').isIn(['like', 'comment', 'share']),
    body('payload').optional().isString().isLength({ max: 280 })
  ],
  handleValidation,
  (req, res) => {
    res.json({
      status: 'accepted',
      feedId: req.params.feedId,
      type: req.body?.type || 'like',
      receivedAt: nowIso()
    });
  }
);

app.get(`${base}/transactions`, (req, res) => {
  res.json(transactions);
});

app.get(`${base}/wallet`, (req, res) => {
  res.json(wallet);
});

app.get(`${base}/wallet/payment-methods`, (req, res) => {
  res.json(paymentMethods);
});

app.get(`${base}/wallet/statcoin`, (req, res) => {
  res.json(statCoin);
});

app.post(
  `${base}/wallet/statcoin/purchase`,
  writeLimiter,
  [
    body('amount').isFloat({ gt: 0, max: 5000 }),
    body('paymentMethod').optional().isString().isLength({ max: 64 })
  ],
  handleValidation,
  (req, res) => {
    const amount = Number(req.body?.amount || 0);
    const rate = statCoin.rateUsd || 1;
    const statCoinAmount = amount / rate;

    res.json({
      status: 'accepted',
      amountUsd: amount,
      statCoinAmount,
      rateUsd: rate,
      receivedAt: nowIso()
    });
  }
);

app.get(`${base}/wallet/dividends`, (req, res) => {
  res.json(dividends);
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`StatStox API listening on ${port}`);
});
