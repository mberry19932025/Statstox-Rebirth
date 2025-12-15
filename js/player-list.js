document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "player-list";

  const listEl = document.getElementById("playerList");
  const statusEl = document.getElementById("playerListStatus");
  const filterEl = document.getElementById("playerSportFilter");

  if (!listEl || !statusEl || !filterEl) {
    console.error(`[${PAGE_ID}] missing elements`);
    return;
  }

  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  const userTier = window.tierUtils?.getUserTier?.() || "free";

  function canAccess(tier) {
    const tiers = ["free", "starter", "pro", "elite"];
    return tiers.indexOf(userTier) >= tiers.indexOf(tier);
  }

  const players = [
    { id: "pl1", name: "NFL Player A", sport: "NFL", metric: "uptrend", tier: "free" },
    { id: "pl2", name: "NBA Player B", sport: "NBA", metric: "breakout", tier: "starter" },
    { id: "pl3", name: "MLB Player C", sport: "MLB", metric: "volatility", tier: "pro" }
  ];

  function render() {
    const sport = filterEl.value;
    listEl.innerHTML = "";

    players
      .filter(p => sport === "all" || p.sport === sport)
      .forEach(p => {
        const locked = !canAccess(p.tier);

        const li = document.createElement("li");
        li.className = `player-item ${locked ? "locked" : ""}`;

        li.innerHTML = `
          <strong>${p.name}</strong>
          <p class="small">sport: ${p.sport}</p>
          <p class="small">signal: ${locked ? "locked" : p.metric}</p>
          ${
            locked
              ? `<button class="upgrade-btn">unlock</button>`
              : `<button class="view-btn">view</button>`
          }
        `;

        listEl.appendChild(li);
      });

    statusEl.textContent = `${players.length} players • tier: ${userTier}`;
  }

  filterEl.addEventListener("change", render);
  render();
});