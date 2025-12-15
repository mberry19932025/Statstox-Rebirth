document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "sports-feed";

  const listEl = document.getElementById("sportsFeedList");
  const statusEl = document.getElementById("sportsFeedStatus");
  const sportEl = document.getElementById("sportsFeedSport");

  if (!listEl || !statusEl || !sportEl) {
    console.error(`[${PAGE_ID}] missing elements`);
    return;
  }

  window.notifications?.add("sports feed loaded");
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  const userTier = window.tierUtils?.getUserTier?.() || "free";
  const tiers = ["free", "starter", "pro", "elite"];
  const canAccess = (t) => tiers.indexOf(userTier) >= tiers.indexOf(t);

  const items = [
    { id: "sf1", sport: "NFL", msg: "injury update • limited practice", tier: "free" },
    { id: "sf2", sport: "NBA", msg: "rotation note • minutes bump", tier: "starter" },
    { id: "sf3", sport: "MLB", msg: "pitch count note • volatility", tier: "pro" },
    { id: "sf4", sport: "WWE", msg: "match card movement • momentum", tier: "elite" }
  ];

  function render() {
    const sport = sportEl.value;
    listEl.innerHTML = "";

    const filtered = items.filter(i => sport === "all" || i.sport === sport);

    filtered.forEach(i => {
      const locked = !canAccess(i.tier);

      const li = document.createElement("li");
      li.className = `feed-item ${locked ? "locked" : ""}`;
      li.innerHTML = `
        <strong>${i.sport}</strong>
        <p class="small">${locked ? "locked update" : i.msg}</p>
        <p class="small">tier: ${i.tier}</p>
        ${
          locked
            ? `<button class="upgrade-btn">unlock</button>`
            : `<button class="details-btn">details</button>`
        }
      `;

      if (locked) li.querySelector(".upgrade-btn").addEventListener("click", () => window.notifications?.add("upgrade to unlock sports feed depth"));
      listEl.appendChild(li);
    });

    statusEl.textContent = `${filtered.length} updates • tier: ${userTier}`;
  }

  sportEl.addEventListener("change", render);
  render();
});