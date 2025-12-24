# StatStox Security (Free Tooling)

This security baseline keeps DFS and Market logic separate, protects payouts, and supports real-time data without violating provider policies.

## Core Security Stack (Free)
1) Helmet (HTTP security headers)
2) Express-rate-limit (request throttling)
3) HPP (query param pollution protection)
4) Express-validator (input validation)
5) Morgan (request logging)

## Auth + Access (Phase 2)
- JWT-based auth (free) with short-lived access tokens.
- Role gates: free, premium, VIP, admin.
- Enforce entry caps and payout caps per role.

## DFS-Specific Protections
- Entry caps per contest, max multi-entry limits.
- Payout caps to prevent high-variance abuse.
- Contest lock windows to prevent late swaps.
- Anti-collusion signals (same IP/device + correlated entries).

## Market-Specific Protections
- Day-trade limits and position caps per user.
- Spread and fee controls for sustainable profit.
- Circuit breakers on rapid price swings.
- Contract expirations per season.

## Data Integrity
- Validate all payloads and query params.
- Reject malformed inputs with 400.
- Log writes and reactions for audit trails.

## Privacy + Secrets
- Keep API keys in backend `.env` only.
- Never expose provider tokens in frontend.
- Use Render env vars in production.

## Monitoring (Free Tier Options)
- Render logs + metrics
- GitHub Dependabot + CodeQL
- Sentry (free tier) for error tracking

## Compliance Guardrails
- Respect API rate limits and attribution.
- Separate DFS and Market data paths.
- Avoid scraping against ToS.
