document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "contest-lobby";

  const grid = document.getElementById("contestLobbyGrid");
  const status = document.getElementById("contestLobbyStatus");

  if (!grid || !status) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  /* ===============================
     GLOBAL SYSTEM HOOKS
     =============================== */
  window.notifications?.add("contest lobby loaded");

  window.performanceHeatUp?.update({
    page: PAGE_ID,
    action: "view"
  });

  /* ===============================
     CONTEST TYPES (GATEWAY)
     =============================== */
  const contests = [
    {
      id: "signal-run",
      name: "signal run",
      description: "predict signal direction across players",
      tier: "free"
    },
    {
      id: "projection-pool",
      name: "projection pool",
      description: "lock projections and compete for payout",
      tier: "starter"
    },
    {
      id: "momentum-run",
      name: "momentum run",
      description: "track performance over time windows",
      tier: "pro"
    },
    {
      id: "market-sim",
      name: "market simulation",
      description: "paper-trade player markets",
      tier: "elite"
    }
  ];

  function canAccessContest(contest) {
    if (!window.tierUtils) return contest.tier === "free";
    return window.tierUtils.isTierAllowed(contest.tier);
  }

  /* ===============================
     RENDER
     =============================== */
  function render() {
    grid.innerHTML = "";
    status.textContent = `${contests.length} contest types available`;

    contests.forEach(contest => {
      const allowed = canAccessContest(contest);

      const card = document.createElement("article");
      card.className = "contest-card";
      card.dataset.contestId = contest.id;

      card.innerHTML = `
        <h3>${contest.name}</h3>
        <p>${contest.description}</p>
        <p><strong>tier:</strong> ${contest.tier}</p>
        <button ${!allowed ? "disabled" : ""}>
          ${allowed ? "enter" : "locked"}
        </button>
      `;

      card.querySelector("button").addEventListener("click", () => {
        window.notifications?.add(`contest selected: ${contest.name}`);

        window.performanceHeatUp?.update({
          page: PAGE_ID,
          action: "contest-select",
          contest: contest.id
        });
      });

      grid.appendChild(card);
    });
  }

  render();
});