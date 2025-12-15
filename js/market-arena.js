document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "market-arena";

  const listEl = document.getElementById("marketArenaList");
  const statusEl = document.getElementById("marketArenaStatus");
  const entryFilter = document.getElementById("marketEntryFilter");
  const runFilter = document.getElementById("marketRunFilter");

  if (!listEl || !statusEl || !entryFilter || !runFilter) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  window.notifications?.add("market arena loaded");
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  const userTier = window.tierUtils?.getUserTier?.() || "free";

  function canAccess(tier) {
    const tiers = ["free", "starter", "pro", "elite"];
    return tiers.indexOf(userTier) >= tiers.indexOf(tier);
  }

  function money(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  const marketRuns = [
    { id: "mr1", name: "signal market run", type: "signal", entry: 2, tier: "free", lock: 15 },
    { id: "mr2", name: "momentum market run", type: "momentum", entry: 5, tier: "starter", lock: 12 },
    { id: "mr3", name: "performance market run", type: "performance", entry: 10, tier: "pro", lock: 10 },
    { id: "mr4", name: "pro market run", type: "multi", entry: 25, tier: "pro", lock: 8 },
    { id: "mr5", name: "elite market run", type: "multi", entry: 100, tier: "elite", lock: 6 }
  ];

  function getFiltered() {
    return marketRuns.filter(r => {
      const entryMatch = entryFilter.value === "all" || String(r.entry) === entryFilter.value;
      const runMatch = runFilter.value === "all" || r.type === runFilter.value;
      return entryMatch && runMatch;
    });
  }

  function render() {
    const filtered = getFiltered();
    listEl.innerHTML = "";

    if (!filtered.length) {
      listEl.innerHTML = `<li class="small">no market runs available</li>`;
      statusEl.textContent = "0 runs";
      return;
    }

    filtered.forEach(run => {
      const locked = !canAccess(run.tier);

      const li = document.createElement("li");
      li.className = `market-run-item ${locked ? "locked" : ""}`;

      li.innerHTML = `
        <strong>${run.name}</strong>
        <p class="small">
          type: ${run.type} • entry: ${money(run.entry)} • lock: ${run.lock} min
        </p>
        <p class="small">tier required: ${run.tier}</p>
        ${
          locked
            ? `<button class="upgrade-btn">upgrade to enter</button>`
            : `<button class="enter-btn">enter market run</button>`
        }
      `;

      if (locked) {
        li.querySelector(".upgrade-btn").addEventListener("click", () => {
          window.notifications?.add("upgrade required for this market run");
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

  entryFilter.addEventListener("change", render);
  runFilter.addEventListener("change", render);

  render();
});