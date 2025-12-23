/* =====================================================
   Empty States – Standard UI Messaging
   ===================================================== */

export function showEmpty(el, message = 'Nothing to display right now.') {
  el.innerHTML = `<p class="status muted">${message}</p>`;
}