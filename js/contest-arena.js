document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "contest-arena";

  /* ===============================
     REQUIRED DOM ELEMENTS
     =============================== */
  const grid = document.getElementById("contestArenaGrid");
  const status = document.getElementById("contestArenaStatus");

  if (!grid || !status) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  /* ===============================
     GLOBAL SYSTEM HOOKS
     =============================== */
  window.notifications?.add("contest arena loaded");

  window.performanceHeatUp?.update({
    page: PAGE_ID,
    action: "view"
  });

  /* ===============================
     LIVE CONTEST INSTANCES (PLACEHOLDERS)
     - StatStox naming only
     - No draft mechanics here
     - No market mechanics here (Market Simulation is paper-only)
     =============================== */
  const liveContests = [
    {
      id: "sr-nba-tonight",
      name: "Signal Run",
      league: "NBA",
      windowLabel: "Tonight",
      entryFeeUsd: 5,
      prizePoolUsd: 250,
      tier: "free",
      route: "signal-run.html"
    },
    {
      id: "pp-nfl-sunday",
      name: "Projection Pool",
      league: "NFL",
      windowLabel: "Sunday Slate",
      entryFeeUsd: 10,
      prizePoolUsd: 500,
      tier: "starter",
      route: "projection-pool.html"
    },
    {
      id: "mr-multi-7day",
      name: "Momentum Run",
      league: "Multi-League",
      windowLabel: "7-Day Window",
      entryFeeUsd: 15,
      prizePoolUsd: 1000,
      tier: "pro",
      route: "momentum-run.html"
    },
    {
      id: "ms-paper-weekly",
      name: "Market Simulation",
      league: "Paper Mode",
      windowLabel: "Weekly Ranking",
      entryFeeUsd: 0,
      prizePoolUsd: 0,
      tier: "elite",
      route: "market-simulation.html"
    }
  ];

  function canAccess(contest) {
    if (!window.tierUtils) return contest.tier === "free";
    return window.tierUtils.isTierAllowed(contest.tier);
  }

  function money(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  function render() {
    grid.innerHTML = "";
    status.textContent = `${liveContests.length} live contests`;

    liveContests.forEach((c) => {
      const allowed = canAccess(c);

      const card = document.createElement("article");
      card.className = "arena-card";
      card.dataset.contestId = c.id;

      card.innerHTML = `
        <h3>${c.name}</h3>
        <p><strong>league:</strong> ${c.league}</p>
        <p><strong>window:</strong> ${c.windowLabel}</p>
        <p><strong>tier:</strong> ${c.tier}</p>

        <div class="arena-money">
          <p><strong>entry:</strong> ${c.entryFeeUsd === 0 ? "free" : money(c.entryFeeUsd)}</p>
          <p><strong>prize pool:</strong> ${c.prizePoolUsd === 0 ? "n/a" : money(c.prizePoolUsd)}</p>
        </div>

        <button ${!allowed ? "disabled" : ""}>
          ${allowed ? "enter arena" : "locked"}
        </button>
      `;

      card.querySelector("button").addEventListener("click", () => {
        if (!allowed) {
          window.notifications?.add("locked: upgrade tier to enter");
          return;
        }

        window.notifications?.add(`entered: ${c.name} (${c.id})`);

        window.performanceHeatUp?.update({
          page: PAGE_ID,
          action: "enter",
          contest: c.id
        });

        // Frontend routing placeholder (real entry happens backend later)
        window.location.href = c.route;
      });

      grid.appendChild(card);
    });
  }

  render();
});