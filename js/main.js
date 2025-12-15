/**
 * main.js
 * Global application bootstrap for StatStox
 * Safe to include on ALL pages
 */

document.addEventListener("DOMContentLoaded", () => {
  // --------- APP ID ----------
  window.STATS_TOX_APP = {
    name: "StatStox",
    version: "1.0.0",
    environment: "frontend"
  };

  // --------- USER STATE ----------
  const user =
    JSON.parse(localStorage.getItem("statstox_user")) || {
      email: "guest",
      tier: "free"
    };

  window.STATS_TOX_USER = user;

  // --------- ACTIVE NAV ----------
  const currentPath = window.location.pathname.split("/").pop();
  document.querySelectorAll(".global-nav a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath) {
      link.classList.add("active");
    }
  });

  // --------- GLOBAL SAFETY ----------
  if (!window.notifications) {
    console.warn("notifications system not loaded");
  }

  if (!window.performanceHeatUp) {
    console.warn("performanceHeatUp system not loaded");
  }

  // --------- GLOBAL LOG ----------
  console.log(
    `[StatStox] loaded • user: ${user.email} • tier: ${user.tier}`
  );
});