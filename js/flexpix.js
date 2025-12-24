const PAGE_ID = 'flexpix';

document.addEventListener('DOMContentLoaded', () => {
  console.log(`${PAGE_ID} loaded`);

  // future hooks:
  // - add/remove picks
  // - flex payout logic
  // - projection locking

  const slip = document.querySelector('[data-pick-slip]');
  const countNode = document.querySelector('[data-slip-count]');
  const clearButton = document.querySelector('[data-clear-slip]');
  const addButtons = document.querySelectorAll('[data-pick]');

  if (!slip || !addButtons.length) return;

  const picks = new Set();

  const render = () => {
    slip.innerHTML = '';
    if (!picks.size) {
      const item = document.createElement('li');
      item.className = 'pick-slip-item';
      item.innerHTML = '<span>No picks yet</span><span>—</span>';
      slip.appendChild(item);
    } else {
      picks.forEach((pick) => {
        const item = document.createElement('li');
        item.className = 'pick-slip-item';
        item.innerHTML = `<span>${pick}</span><span>Ready</span>`;
        slip.appendChild(item);
      });
    }

    if (countNode) {
      countNode.textContent = `Entries: ${picks.size}`;
    }
  };

  addButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const pick = button.dataset.pick;
      if (!pick) return;
      picks.add(pick);
      render();
    });
  });

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      picks.clear();
      render();
    });
  }

  render();
});
