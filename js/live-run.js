document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "liverun";

  const listEl = document.getElementById("liveRunList");
  const statusEl = document.getElementById("liveRunStatus");
  const sportFilter = document.getElementById("liveRunSport");
  const entryFilter = document.getElementById("liveRunEntry");

  if (!listEl || !statusEl || !sportFilter || !entryFilter) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  window.notifications?.add("live run loaded");
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  const userTier = window.tierUtils?.getUserTier?.() || "free";

  function canAccess(tier) {
    const tiers = ["free", "starter", "pro", "elite"];
    return tiers.indexOf(userTier) >= tiers.indexOf(tier);
  }

  function money(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  // LOCKED entry tiers
  const runs = [
    { id: "lr1", name: "signal run • nfl", sport: "NFL", entry: 2, tier: "free", lock: 12 },
    { id: "lr2", name: "momentum run • nba", sport: "NBA", entry: 5, tier: "starter", lock: 10 },
    { id: "lr3", name: "heat run • mlb", sport: "MLB", entry: 10, tier: "pro", lock: 8 },
    { id: "lr4", name: "pro run • multi", sport: "multi", entry: 25, tier: "pro", lock: 6 },
    { id: "lr5", name: "elite run • multi", sport: "multi", entry: 100, tier: "elite", lock: 5 }
  ];

  function getFiltered() {
    const sport = sportFilter.value;
    const entry = entryFilter.value;

    return runs.filter(r => {
      const sportMatch = sport === "all" || r.sport === sport;
      const entryMatch = entry === "all" || String(r.entry) === entry;
      return sportMatch && entryMatch;
    });
  }

  function render() {
    const filtered = getFiltered();
    listEl.innerHTML = "";

    if (!filtered.length) {
      listEl.innerHTML = `<li class="small">no live runs available</li>`;
      statusEl.textContent = "0 runs";
      return;
    }

    filtered.forEach(run => {
      const locked = !canAccess(run.tier);

      const li = document.createElement("li");
      li.className = `live-run-item ${locked ? "locked" : ""}`;

      li.innerHTML = `
        <strong>${run.name}</strong>
        <p class="small">
          sport: ${run.sport} • entry: ${money(run.entry)} • lock: ${run.lock} min
        </p>
        <p class="small">tier required: ${run.tier}</p>
        ${
          locked
            ? `<button class="upgrade-btn">upgrade to enter</button>`
            : `<button class="enter-btn">enter run</button>`
        }
      `;

      if (locked) {
        li.querySelector(".upgrade-btn").addEventListener("click", () => {
          window.notifications?.add("upgrade required to enter this run");
          window.performanceHeatUp?.update({
            page: PAGE_ID,
            action: "upgrade-click",
            requiredTier: run.tier
          });
        });
      } else {
        li.querySelector(".enter-btn").addEventListener("click", () => {
          window.notifications?.add(`entered ${run.name}`);
          window.performanceHeatUp?.update({
            page: PAGE_ID,
            action: "enter",
            runId: run.id,
            entry: run.entry
          });

          // backend later: validate balance + lock projections
          window.location.href = "locker-room.html";
        });
      }

      listEl.appendChild(li);
    });

    statusEl.textContent = `${filtered.length} runs • tier: ${userTier}`;
  }

  sportFilter.addEventListener("change", render);
  entryFilter.addEventListener("change", render);

  render();
});