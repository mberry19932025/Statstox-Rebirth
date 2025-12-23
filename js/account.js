/* =====================================================
   Account Page – Frontend Only
   ===================================================== */

const PAGE_ID = 'account';

document.addEventListener('DOMContentLoaded', () => {
  const status = document.getElementById('accountStatus');

  // Frontend-only simulated account flags
  const hasDeposit = document.body.dataset.depositEligible === 'true';

  status.textContent = hasDeposit
    ? 'Account Active – Eligible for contests'
    : 'Deposit $10+ to unlock full access';

  status.className = hasDeposit
    ? 'status success'
    : 'status muted';
});