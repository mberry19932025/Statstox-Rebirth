document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "index";

  /* ===============================
     GLOBAL SYSTEM HOOKS
     =============================== */
  window.notifications?.add("home loaded");
  window.performanceHeatUp?.update({
    page: PAGE_ID,
    action: "view"
  });

  /* ===============================
     DOM ELEMENTS
     =============================== */
  const ctaFeed = document.getElementById("ctaFeed");
  const ctaContests = document.getElementById("ctaContests");
  const ctaPlayers = document.getElementById("ctaPlayers");

  /* ===============================
     CTA NAVIGATION
     =============================== */
  if (ctaFeed) {
    ctaFeed.addEventListener("click", () => {
      window.location.href = "feed.html";
    });
  }

  if (ctaContests) {
    ctaContests.addEventListener("click", () => {
      window.location.href = "contest-lobby.html";
    });
  }

  if (ctaPlayers) {
    ctaPlayers.addEventListener("click", () => {
      window.location.href = "all-players.html";
    });
  }

  /* ===============================
     FEED HOOK (GLOBAL COMPONENT)
     =============================== */
  window.feed?.push?.({
    source: PAGE_ID,
    type: "system",
    message: "user landed on home",
    tier: "free"
  });
});