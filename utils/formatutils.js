/*
  FORMAT UTILS (STATSTOX)
  ----------------------
  Global helpers. No DOM.
*/

window.FormatUtils = {
  formatCoins(amount) {
    return `${Number(amount).toLocaleString()} Stox Coins`;
  },

  formatPrice(value) {
    return `$${Number(value).toFixed(2)}`;
  },

  formatSignal(value) {
    return `${Math.round(value)}% Signal`;
  }
};