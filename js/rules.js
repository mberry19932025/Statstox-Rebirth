document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "rules";
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });
  window.notifications?.add("rules loaded");

  const tabs = document.querySelectorAll("[data-rules-tab]");
  const panels = document.querySelectorAll("[data-rules-panel]");

  function activate(key) {
    panels.forEach(p => p.classList.toggle("hidden", p.dataset.rulesPanel !== key));
    tabs.forEach(t => t.classList.toggle("active", t.dataset.rulesTab === key));
  }

  tabs.forEach(t => t.addEventListener("click", () => activate(t.dataset.rulesTab)));
  activate("contests");
});