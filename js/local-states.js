/* =====================================================
   Local States – Frontend Session Flags
   ===================================================== */

export function setState(key, value) {
  document.body.dataset[key] = value;
}

export function getState(key) {
  return document.body.dataset[key];
}

export function hasState(key) {
  return key in document.body.dataset;
}