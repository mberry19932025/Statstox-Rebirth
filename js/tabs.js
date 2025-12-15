/**
 * tabs.js
 * Generic tab switching logic
 * Include ONLY on pages that use tabs
 */

document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll("[data-tab]");
  const tabPanels = document.querySelectorAll("[data-tab-panel]");

  if (!tabButtons.length || !tabPanels.length) return;

  function activateTab(tabKey) {
    tabPanels.forEach(panel => {
      panel.classList.toggle(
        "hidden",
        panel.dataset.tabPanel !== tabKey
      );
    });

    tabButtons.forEach(btn => {
      btn.classList.toggle(
        "active",
        btn.dataset.tab === tabKey
      );
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      activateTab(btn.dataset.tab);
    });
  });

  // Auto-activate first tab
  activateTab(tabButtons[0].dataset.tab);
});