document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "roster-run";

  const listEl = document.getElementById("rosterRunList");
  const statusEl = document.getElementById("rosterRunStatus");
  const entryFilter = document.getElementById("rosterRunEntryFilter");

  if (!listEl || !statusEl || !entryFilter) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  window.notifications?.add("roster run loaded");
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  const userTier = window.tierUtils?.getUserTier?.() || "free";
  const tiers = ["free", "starter", "pro", "elite"];

  function canAccess(requiredTier) {
    return tiers.indexOf(userTier) >= tiers.indexOf(requiredTier);
  }

  function money(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  // DFS-safe: entry tiers + lock window
  const runs = [
    { id: "rr2", name: "roster run • starter", entry: 2, tier: "free", lock: 15 },
    { id: "rr5", name: "roster run • momentum", entry: 5, tier: "starter", lock: 12 },
    { id: "rr10", name: "roster run • pro", entry: 10, tier: "pro", lock: 10 },
    { id: "rr25", name: "roster run • pro+", entry: 25, tier: "pro", lock: 8 },
    { id: "rr100", name: "roster run • elite", entry: 100, tier: "elite", lock: 6 }
  ];

  function getFiltered() {
    const entry = entryFilter.value;
    return runs.filter(r => entry === "all" || String(r.entry) === entry);
  }

  function render() {
    const filtered = getFiltered();
    listEl.innerHTML = "";

    filtered.forEach(run => {
      const locked = !canAccess(run.tier);

      const li = document.createElement("li");
      li.className = `run-item ${locked ? "locked" : ""}`;

      li.innerHTML = `
        <strong>${run.name}</strong>
        <p class="small">entry: ${money(run.entry)} • lock: ${run.lock} min • tier: ${run.tier}</p>
        ${
          locked
            ? `<button class="upgrade-btn">upgrade to enter</button>`
            : `<button class="enter-btn">enter</button>`
        }
      `;

      if (locked) {
        li.querySelector(".upgrade-btn").addEventListener("click", () => {
          window.notifications?.add("upgrade required to enter this roster run");
          window.performanceHeatUp?.update({ page: PAGE_ID, action: "upgrade-click", requiredTier: run.tier });
        });
      } else {
        li.querySelector(".enter-btn").addEventListener("click", () => {
          window.notifications?.add(`entered ${run.name}`);
          window.performanceHeatUp?.update({ page: PAGE_ID, action: "enter", runId: run.id, entry: run.entry });

          // backend later: validate balance, lock projection snapshot, generate roster shell
          window.location.href = "locker-room.html";
        });
      }

      listEl.appendChild(li);
    });

    statusEl.textContent = `${filtered.length} runs • tier: ${userTier}`;
  }

  entryFilter.addEventListener("change", render);
  render();
});