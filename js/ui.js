document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Fix footer icon paths globally
  document.querySelectorAll('footer img').forEach(img => {
    if (!img.src.includes('/images/')) return;

    const file = img.src.split('/images/').pop();
    img.src = `./images/${file}`;
  });
});