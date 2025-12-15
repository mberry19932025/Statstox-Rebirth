document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "leaderboard";

  const listEl = document.getElementById("lbList");
  const statusEl = document.getElementById("lbStatus");
  const searchEl = document.getElementById("lbSearch");
  const filterEl = document.getElementById("lbFilter");
  const scopeEl = document.getElementById("lbScope");

  if (!listEl || !statusEl || !searchEl || !filterEl || !scopeEl) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  window.notifications?.add("leaderboard loaded");
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  const userTier = window.tierUtils?.getUserTier?.() || "free";

  function canAccess(requiredTier) {
    const tiers = ["free", "starter", "pro", "elite"];
    return tiers.indexOf(userTier) >= tiers.indexOf(requiredTier);
  }

  // Monetization: Pro+ sees "advanced metrics"
  const ADVANCED_TIER = "pro";

  const rows = [
    { id: "u1", name: "matthias", tier: "free", score: 1280, roi: 0.12, streak: 3, sport: "NFL" },
    { id: "u2", name: "diamondhawk", tier: "starter", score: 1425, roi: 0.18, streak: 5, sport: "NBA" },
    { id: "u3", name: "signal_sage", tier: "pro", score: 1660, roi: 0.27, streak: 8, sport: "MLB" },
    { id: "u4", name: "heatwave", tier: "elite", score: 1905, roi: 0.33, streak: 10, sport: "Multi" }
  ];

  function getFiltered() {
    const q = searchEl.value.toLowerCase().trim();
    const sport = filterEl.value;
    const scope = scopeEl.value; // daily/weekly/alltime

    // (scope is placeholder for backend; we keep it in UI now)
    return rows.filter(r => {
      const searchMatch = !q || r.name.toLowerCase().includes(q);
      const sportMatch = sport === "all" || r.sport === sport;
      return searchMatch && sportMatch;
    });
  }

  function formatPct(n) {
    const v = Number(n) * 100;
    return `${v.toFixed(0)}%`;
  }

  function render() {
    const filtered = getFiltered();
    listEl.innerHTML = "";

    if (!filtered.length) {
      listEl.innerHTML = `<li class="small">no results</li>`;
      statusEl.textContent = "0 results";
      return;
    }

    const advancedUnlocked = canAccess(ADVANCED_TIER);

    filtered.forEach((r, idx) => {
      const li = document.createElement("li");
      li.className = "lb-row";

      li.innerHTML = `
        <div class="lb-rank">#${idx + 1}</div>

        <div class="lb-main">
          <strong>${r.name}</strong>
          <p class="small">sport: ${r.sport} • tier: ${r.tier}</p>

          <div class="lb-metrics">
            <span class="metric">score: ${r.score}</span>
            ${
              advancedUnlocked
                ? `
                  <span class="metric">roi: ${formatPct(r.roi)}</span>
                  <span class="metric">streak: ${r.streak}</span>
                `
                : `
                  <span class="metric locked">roi: locked</span>
                  <span class="metric locked">streak: locked</span>
                `
            }
          </div>
        </div>

        <div class="lb-actions">
          ${
            advancedUnlocked
              ? `<button class="view-btn">view profile</button>`
              : `<button class="upgrade-btn">unlock metrics</button>`
          }
        </div>
      `;

      if (!advancedUnlocked) {
        li.querySelector(".upgrade-btn").addEventListener("click", () => {
          window.notifications?.add("upgrade to pro to unlock leaderboard metrics");
          window.performanceHeatUp?.update({
            page: PAGE_ID,
            action: "upgrade-click",
            requiredTier: ADVANCED_TIER
          });
        });
      } else {
        li.querySelector(".view-btn").addEventListener("click", () => {
          window.notifications?.add(`opened profile: ${r.name} (placeholder)`);
          window.performanceHeatUp?.update({
            page: PAGE_ID,
            action: "open-profile",
            userId: r.id
          });
        });
      }

      listEl.appendChild(li);
    });

    statusEl.textContent = `${filtered.length} ranked • scope: ${scopeEl.value} • tier: ${userTier}`;
  }

  [searchEl, filterEl, scopeEl].forEach(el => el.addEventListener("input", render));
  render();
});