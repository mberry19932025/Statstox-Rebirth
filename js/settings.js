document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "settings";
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });
  window.notifications?.add("settings loaded");

  const toggles = document.querySelectorAll("[data-setting]");
  toggles.forEach(t => {
    const key = t.dataset.setting;
    const saved = localStorage.getItem(`statstox_setting_${key}`);
    if (saved !== null) t.checked = saved === "true";

    t.addEventListener("change", () => {
      localStorage.setItem(`statstox_setting_${key}`, String(t.checked));
      window.notifications?.add(`setting updated: ${key}`);
    });
  });
});