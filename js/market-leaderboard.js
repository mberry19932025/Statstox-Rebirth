document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "market-leaderboard";

  const listEl = document.getElementById("marketLbList");
  const statusEl = document.getElementById("marketLbStatus");
  const filterEl = document.getElementById("marketLbFilter");

  if (!listEl || !statusEl || !filterEl) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  window.notifications?.add("market leaderboard loaded");
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  const userTier = window.tierUtils?.getUserTier?.() || "free";

  function canAccess(tier) {
    const tiers = ["free", "starter", "pro", "elite"];
    return tiers.indexOf(userTier) >= tiers.indexOf(tier);
  }

  const rows = [
    { id: "m1", user: "diamondhawk", roi: 0.31, consistency: 9, tier: "elite" },
    { id: "m2", user: "signal_sage", roi: 0.24, consistency: 7, tier: "pro" },
    { id: "m3", user: "marketflow", roi: 0.18, consistency: 6, tier: "starter" },
    { id: "m4", user: "rookierun", roi: 0.11, consistency: 4, tier: "free" }
  ];

  function formatPct(n) {
    return `${(n * 100).toFixed(1)}%`;
  }

  function render() {
    listEl.innerHTML = "";

    rows.forEach((r, idx) => {
      const advancedUnlocked = canAccess("pro");

      const li = document.createElement("li");
      li.className = "market-lb-item";

      li.innerHTML = `
        <div>
          <strong>#${idx + 1} ${r.user}</strong>
          <p class="small">tier: ${r.tier}</p>
        </div>

        <div class="metrics">
          <span>roi: ${advancedUnlocked ? formatPct(r.roi) : "locked"}</span>
          <span>consistency: ${advancedUnlocked ? r.consistency : "locked"}</span>
        </div>

        ${
          advancedUnlocked
            ? `<button class="view-btn">view strategy</button>`
            : `<button class="upgrade-btn">unlock metrics</button>`
        }
      `;

      if (!advancedUnlocked) {
        li.querySelector(".upgrade-btn").addEventListener("click", () => {
          window.notifications?.add("upgrade to pro to unlock market metrics");
        });
      }

      listEl.appendChild(li);
    });

    statusEl.textContent = `${rows.length} ranked • tier: ${userTier}`;
  }

  render();
});