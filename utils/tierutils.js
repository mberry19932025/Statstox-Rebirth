/* =========================
   TIER UTILS – FRONTEND
   ========================= */

/**
 * Central source of truth for avatar / feature tiers
 * Frontend ONLY (visual + logic)
 * Backend will override permissions later
 */

export const TIERS = {
  free: {
    key: 'free',
    label: 'Free',
    colorClass: 'tier-free',
    ringClass: 'ring-green',
    price: 0,
    locked: false
  },

  premium: {
    key: 'premium',
    label: 'Premium',
    colorClass: 'tier-premium',
    ringClass: 'ring-blue',
    price: 9.99,
    locked: true
  },

  vip: {
    key: 'vip',
    label: 'VIP',
    colorClass: 'tier-vip',
    ringClass: 'ring-gold',
    price: 24.99,
    locked: true
  }
};

/**
 * Returns tier metadata safely
 */
export function getTierInfo(tierKey) {
  return TIERS[tierKey] || TIERS.free;
}

/**
 * Returns all tiers (for loops, UI rendering)
 */
export function getAllTiers() {
  return Object.values(TIERS);
}

/**
 * Utility: check if user can access tier
 * (frontend placeholder – backend replaces later)
 */
export function canAccessTier(userTier, requiredTier) {
  const order = ['free', 'premium', 'vip'];
  return order.indexOf(userTier) >= order.indexOf(requiredTier);
}