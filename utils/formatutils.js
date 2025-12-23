// format.utils.js — formatting helpers

window.formatutils = {
  normalize(value) {
    return String(value ?? '').toLowerCase().trim();
  },

  currency(value) {
    if (isNaN(value)) return '$0';
    return `$${Number(value).toLocaleString()}`;
  },

  money(value) {
    return window.formatutils.currency(value);
  },

  percent(value) {
    if (isNaN(value)) return '0%';
    return `${value}%`;
  },

  signed(value) {
    if (isNaN(value)) return '0';
    return value > 0 ? `+${value}` : `${value}`;
  },

  number1(value) {
    if (isNaN(value)) return '0.0';
    return Number(value).toFixed(1);
  }
};
