document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "locker-room";

  const insightsEl = document.getElementById("lrInsights");
  const statusEl = document.getElementById("lrStatus");

  if (!insightsEl || !statusEl) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  window.notifications?.add("locker room loaded");
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  const userTier = window.tierUtils?.getUserTier?.() || "free";

  const insights = [
    { id: "i1", title: "basic lineup note", tier: "free" },
    { id: "i2", title: "momentum breakdown", tier: "starter" },
    { id: "i3", title: "volatility model", tier: "pro" },
    { id: "i4", title: "elite signal overlay", tier: "elite" }
  ];

  function canAccess(tier) {
    const tiers = ["free", "starter", "pro", "elite"];
    return tiers.indexOf(userTier) >= tiers.indexOf(tier);
  }

  function render() {
    insightsEl.innerHTML = "";

    insights.forEach(insight => {
      const locked = !canAccess(insight.tier);

      const div = document.createElement("div");
      div.className = `lr-insight ${locked ? "locked" : ""}`;

      div.innerHTML = `
        <strong>${insight.title}</strong>
        <p class="small">tier: ${insight.tier}</p>
        ${
          locked
            ? `<button class="upgrade-btn">upgrade</button>`
            : `<button class="view-btn">view</button>`
        }
      `;

      if (locked) {
        div.querySelector(".upgrade-btn").addEventListener("click", () => {
          window.notifications?.add("upgrade to unlock insight");
          window.performanceHeatUp?.update({
            page: PAGE_ID,
            action: "upgrade-click",
            requiredTier: insight.tier
          });
        });
      }

      insightsEl.appendChild(div);
    });

    statusEl.textContent = `insights available • tier: ${userTier}`;
  }

  render();
});