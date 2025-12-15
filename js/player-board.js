document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "player-board";

  const listEl = document.getElementById("playerBoardList");
  const statusEl = document.getElementById("playerBoardStatus");

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

  const players = [
    { id: "pb1", name: "NFL Player A", metric: "uptrend", tier: "free" },
    { id: "pb2", name: "NBA Player B", metric: "breakout", tier: "starter" },
    { id: "pb3", name: "MLB Player C", metric: "volatility", tier: "pro" }
  ];

  function render() {
    listEl.innerHTML = "";

    players.forEach(p => {
      const locked = !canAccess(p.tier);

      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${p.name}</strong>
        <p class="small">
          metric: ${locked ? "locked" : p.metric}
        </p>
        ${
          locked
            ? `<button class="upgrade-btn">unlock metrics</button>`
            : `<button class="view-btn">view player</button>`
        }
      `;

      listEl.appendChild(li);
    });

    statusEl.textContent = `${players.length} players • tier: ${userTier}`;
  }

  render();
});