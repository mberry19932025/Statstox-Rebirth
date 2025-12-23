/* globals notifications, performanceHeatUp */
const PAGE_ID = 'promotions';

document.addEventListener('DOMContentLoaded', () => {
  notifications?.add?.('Promotions loaded');
  performanceHeatUp?.update?.({ page: PAGE_ID, action: 'view' });
});