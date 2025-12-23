const PAGE_ID = 'performance';

document.addEventListener('DOMContentLoaded', () => {
  // Tell the engine the user viewed Performance
  performanceHeatUp.update({
    page: PAGE_ID,
    action: 'view'
  });

  // Pull data from the engine (mock for now)
  const data = performanceHeatUp.getSummary();

  document.getElementById('heatScore').textContent = data.heat;
  document.getElementById('winRate').textContent = `${data.winRate}%`;
  document.getElementById('streak').textContent = data.streak;
});