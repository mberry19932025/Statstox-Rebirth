document.addEventListener('DOMContentLoaded', () => {
  const groups = Array.from(document.querySelectorAll('.nav-group'));
  if (!groups.length) return;

  const closeAll = (except) => {
    groups.forEach((group) => {
      if (group !== except) group.classList.remove('is-open');
    });
  };

  groups.forEach((group) => {
    const trigger = group.querySelector('.nav-trigger');
    const dropdown = group.querySelector('.nav-dropdown');
    if (!trigger || !dropdown) return;

    trigger.addEventListener('click', (event) => {
      const isOpen = group.classList.contains('is-open');

      if (trigger.tagName === 'A' && !isOpen) {
        event.preventDefault();
      } else if (trigger.tagName !== 'A') {
        event.preventDefault();
      }

      closeAll(group);
      group.classList.toggle('is-open');

      if (trigger.hasAttribute('aria-expanded')) {
        trigger.setAttribute('aria-expanded', String(group.classList.contains('is-open')));
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-group')) {
      groups.forEach((group) => group.classList.remove('is-open'));
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      groups.forEach((group) => group.classList.remove('is-open'));
    }
  });
});
