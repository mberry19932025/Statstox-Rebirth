document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "portfolio";

  const listEl = document.getElementById("portfolioList");
  const statusEl = document.getElementById("portfolioStatus");

  if (!listEl || !statusEl) {
    console.error(`[${PAGE_ID}] missing elements`);
    return;
  }

  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  const userTier = window.tierUtils?.getUserTier?.() || "free";

  function canAccess(tier) {
    const tiers = ["free", "starter", "pro", "elite"];
    return tiers.indexOf(userTier) >= tiers.indexOf(tier);
  }

  const holdings = [
    { id: "h1", name: "NFL Player A", value: "+12%", tier: "free" },
    { id: "h2", name: "NBA Player B", value: "+22%", tier: "starter" },
    { id: "h3", name: "MLB Player C", value: "-5%", tier: "pro" }
  ];

  function render() {
    listEl.innerHTML = "";

    holdings.forEach(h => {
      const locked = !canAccess(h.tier);

      const li = document.createElement("li");
      li.className = `portfolio-item ${locked ? "locked" : ""}`;

      li.innerHTML = `
        <strong>${h.name}</strong>
        <p class="small">
          performance: ${locked ? "locked" : h.value}
        </p>
        ${
          locked
            ? `<button class="upgrade-btn">unlock analytics</button>`
            : `<button class="details-btn">details</button>`
        }
      `;

      listEl.appendChild(li);
    });

    statusEl.textContent = `${holdings.length} positions • tier: ${userTier}`;
  }

  render();
});