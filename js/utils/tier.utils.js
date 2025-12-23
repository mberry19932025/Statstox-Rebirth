// tier.utils.js — frontend-only tier helpers
window.tierutils = (() => {
  const tiers = {
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

  const order = ['free', 'premium', 'vip'];

  return {
    tiers,
    getTierInfo(tierKey) {
      return tiers[tierKey] || tiers.free;
    },
    getAllTiers() {
      return Object.values(tiers);
    },
    canAccessTier(userTier, requiredTier) {
      return order.indexOf(userTier) >= order.indexOf(requiredTier);
    }
  };
})();
