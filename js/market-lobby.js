document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "market-lobby";

  window.notifications?.add("market lobby loaded");
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  const userTier = window.tierUtils?.getUserTier?.() || "free";

  const cards = document.querySelectorAll(".market-card");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const target = card.dataset.target;
      window.location.href = target;
    });
  });

  const tierEl = document.getElementById("marketTierStatus");
  if (tierEl) {
    tierEl.textContent = `current tier: ${userTier}`;
  }
});