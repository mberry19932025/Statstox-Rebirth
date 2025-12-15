document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "market";

  const listEl = document.getElementById("marketList");
  const statusEl = document.getElementById("marketStatus");
  const filterEl = document.getElementById("marketSportFilter");

  if (!listEl || !statusEl || !filterEl) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  window.notifications?.add("market loaded");
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  const userTier = window.tierUtils?.getUserTier?.() || "free";

  function canAccess(tier) {
    const tiers = ["free", "starter", "pro", "elite"];
    return tiers.indexOf(userTier) >= tiers.indexOf(tier);
  }

  const players = [
    { id: "p1", name: "NFL WR Alpha", sport: "NFL", signal: "up", tier: "free" },
    { id: "p2", name: "NBA Guard Beta", sport: "NBA", signal: "hot", tier: "starter" },
    { id: "p3", name: "MLB Pitcher Gamma", sport: "MLB", signal: "volatile", tier: "pro" },
    { id: "p4", name: "Multi-Sport Delta", sport: "Multi", signal: "elite", tier: "elite" }
  ];

  function render() {
    listEl.innerHTML = "";

    players.forEach(p => {
      const locked = !canAccess(p.tier);

      const li = document.createElement("li");
      li.className = `market-player ${locked ? "locked" : ""}`;

      li.innerHTML = `
        <strong>${p.name}</strong>
        <p class="small">sport: ${p.sport}</p>
        <p class="small">signal: ${locked ? "locked" : p.signal}</p>
        ${
          locked
            ? `<button class="upgrade-btn">unlock signal</button>`
            : `<button class="details-btn">view details</button>`
        }
      `;

      if (locked) {
        li.querySelector(".upgrade-btn").addEventListener("click", () => {
          window.notifications?.add("upgrade to unlock advanced market signals");
        });
      }

      listEl.appendChild(li);
    });

    statusEl.textContent = `${players.length} tracked • tier: ${userTier}`;
  }

  render();
});