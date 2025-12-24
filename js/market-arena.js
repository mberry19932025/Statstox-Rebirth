document.addEventListener('DOMContentLoaded', () => {
  console.log('Market Arena loaded');

  const rows = document.querySelectorAll('.market-row:not(.header)');
  if (!rows.length) return;

  setInterval(() => {
    const row = rows[Math.floor(Math.random() * rows.length)];
    row.classList.remove('tick');
    void row.offsetWidth;
    row.classList.add('tick');
  }, 2500);
});
