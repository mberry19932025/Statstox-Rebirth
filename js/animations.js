/* Animations Page – Frontend Only */
const PAGE_ID = 'animations';

document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('[data-animation-toggle]');

  toggles.forEach(toggle => {
    toggle.addEventListener('change', () => {
      const type = toggle.dataset.animationToggle;
      document.body.classList.toggle(`anim-${type}`, toggle.checked);
    });
  });
});