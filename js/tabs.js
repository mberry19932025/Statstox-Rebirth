// tabs.js — reusable tab logic

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-tab-group]').forEach(group => {
    const tabs = group.querySelectorAll('[data-tab]');
    const panels = group.querySelectorAll('[data-tab-panel]');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.add('hidden'));

        tab.classList.add('active');
        group.querySelector(`[data-tab-panel="${target}"]`)
             ?.classList.remove('hidden');
      });
    });
  });
});