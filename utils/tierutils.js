/*
  TIER UTILS (STATSTOX)
  --------------------
  Tier comparison helpers.
*/

window.TierUtils = {
  ranks: {
    T0: 0,
    T1: 1,
    T2: 2,
    T3: 3
  },

  canAccess(userTier, requiredTier) {
    return this.ranks[userTier] >= this.ranks[requiredTier];
  }
};