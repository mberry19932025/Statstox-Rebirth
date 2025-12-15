document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "market-feed";

  const listEl = document.getElementById("marketFeedList");
  const statusEl = document.getElementById("marketFeedStatus");
  const filterEl = document.getElementById("marketFeedFilter");

  if (!listEl || !statusEl || !filterEl) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  window.notifications?.add("market feed loaded");
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  const userTier = window.tierUtils?.getUserTier?.() || "free";

  function canAccess(tier) {
    const tiers = ["free", "starter", "pro", "elite"];
    return tiers.indexOf(userTier) >= tiers.indexOf(tier);
  }

  const feedItems = [
    { id: "mf1", message: "momentum spike detected • nba guard", tier: "free" },
    { id: "mf2", message: "signal confirmation • nfl wr", tier: "starter" },
    { id: "mf3", message: "performance divergence • mlb pitcher", tier: "pro" },
    { id: "mf4", message: "elite market alert • multi-sport", tier: "elite" }
  ];

  function render() {
    listEl.innerHTML = "";

    feedItems.forEach(item => {
      const locked = !canAccess(item.tier);

      const li = document.createElement("li");
      li.className = `market-feed-item ${locked ? "locked" : ""}`;

      li.innerHTML = `
        <p>${locked ? "locked insight" : item.message}</p>
        <p class="small">tier: ${item.tier}</p>
        ${
          locked
            ? `<button class="upgrade-btn">upgrade</button>`
            : `<button class="details-btn">details</button>`
        }
      `;

      if (locked) {
        li.querySelector(".upgrade-btn").addEventListener("click", () => {
          window.notifications?.add("upgrade to unlock market insight");
        });
      }

      listEl.appendChild(li);
    });

    statusEl.textContent = `${feedItems.length} updates • tier: ${userTier}`;
  }

  render();
});