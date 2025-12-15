document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "signal-run";

  /* ===============================
     REQUIRED DOM ELEMENTS
     =============================== */
  const contestTitle = document.getElementById("srContestTitle");
  const contestMeta = document.getElementById("srContestMeta");

  const entryFeeEl = document.getElementById("srEntryFee");
  const prizePoolEl = document.getElementById("srPrizePool");
  const payoutEl = document.getElementById("srPayoutDetails");

  const timerEl = document.getElementById("srTimer");
  const lockBtn = document.getElementById("srLockEntryBtn");
  const lockStatus = document.getElementById("srLockStatus");

  const picksCountEl = document.getElementById("srPicksCount");
  const playersGrid = document.getElementById("srPlayersGrid");

  if (
    !contestTitle || !contestMeta ||
    !entryFeeEl || !prizePoolEl || !payoutEl ||
    !timerEl || !lockBtn || !lockStatus ||
    !picksCountEl || !playersGrid
  ) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  /* ===============================
     GLOBAL SYSTEM HOOKS
     =============================== */
  window.notifications?.add("signal run loaded");
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  /* ===============================
     CONTEST CONTEXT (from Arena later)
     - For now, default values are used
     - Backend will supply real details
     =============================== */
  const url = new URL(window.location.href);
  const contestId = url.searchParams.get("contestId") || "sr-nba-tonight";

  const contest = {
    id: contestId,
    name: "Signal Run",
    league: "NBA",
    windowLabel: "Tonight",
    entryFeeUsd: 5,
    prizePoolUsd: 250,
    // Transparent payout model (example): top 20% paid, flat-ish distribution
    payoutModel: "top-20",
    entryLockMinutes: 5 // placeholder: lock before start
  };

  function money(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  /* ===============================
     FAIR PAYOUT + PROFIT STRUCTURE (FRONTEND DISPLAY)
     - Backend will calculate exact payouts later.
     - We display transparent rules now to build trust.
     =============================== */
  const payoutStructures = {
    "top-20": {
      label: "top 20% paid (transparent split)",
      description:
        "payouts are distributed to the top 20% of entries. exact amounts depend on final entries and platform rake."
    },
    "top-10": {
      label: "top 10% paid (higher risk / higher reward)",
      description:
        "payouts are distributed to the top 10% of entries. exact amounts depend on final entries and platform rake."
    }
  };

  /* ===============================
     PLAYER LIST (PLACEHOLDERS)
     - No real data until backend
     - Each pick is a "signal" (bullish/neutral/bearish)
     =============================== */
  const players = [
    { id: "p1", name: "Player Alpha", position: "G", team: "TBD" },
    { id: "p2", name: "Player Beta", position: "F", team: "TBD" },
    { id: "p3", name: "Player Gamma", position: "C", team: "TBD" },
    { id: "p4", name: "Player Delta", position: "G", team: "TBD" },
    { id: "p5", name: "Player Echo", position: "F", team: "TBD" }
  ];

  // store picks as: { [playerId]: "bullish" | "neutral" | "bearish" }
  const picks = {};
  let isLocked = false;

  /* ===============================
     RENDER HEADER + META
     =============================== */
  function renderContestHeader() {
    contestTitle.textContent = `${contest.name}`;
    contestMeta.textContent = `${contest.league} • ${contest.windowLabel} • contest id: ${contest.id}`;

    entryFeeEl.textContent = contest.entryFeeUsd === 0 ? "free" : money(contest.entryFeeUsd);
    prizePoolEl.textContent = contest.prizePoolUsd === 0 ? "n/a" : money(contest.prizePoolUsd);

    const payout = payoutStructures[contest.payoutModel] || payoutStructures["top-20"];
    payoutEl.innerHTML = `
      <p><strong>payout:</strong> ${payout.label}</p>
      <p class="small">${payout.description}</p>
      <p class="small"><strong>fairness:</strong> picks lock after entry. no edits after lock.</p>
    `;

    timerEl.textContent = `entry locks in ${contest.entryLockMinutes} minutes (placeholder timer)`;
  }

  /* ===============================
     RENDER PLAYERS
     =============================== */
  function renderPlayers() {
    playersGrid.innerHTML = "";

    players.forEach((pl) => {
      const card = document.createElement("article");
      card.className = "sr-player-card";
      card.dataset.playerId = pl.id;

      const currentPick = picks[pl.id] || "neutral";

      card.innerHTML = `
        <div class="sr-player-top">
          <img src="images/player-silhouette.png" alt="player silhouette" class="sr-player-img" />
          <div class="sr-player-meta">
            <h3>${pl.name}</h3>
            <p class="small">${pl.position} • ${pl.team}</p>
            <p class="small"><strong>signal:</strong> <span class="sr-signal">${currentPick}</span></p>
          </div>
        </div>

        <div class="sr-signal-controls" role="group" aria-label="signal selection">
          <button class="sr-signal-btn" data-signal="bullish" ${isLocked ? "disabled" : ""}>bullish</button>
          <button class="sr-signal-btn" data-signal="neutral" ${isLocked ? "disabled" : ""}>neutral</button>
          <button class="sr-signal-btn" data-signal="bearish" ${isLocked ? "disabled" : ""}>bearish</button>
        </div>
      `;

      card.querySelectorAll(".sr-signal-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (isLocked) return;

          const signal = btn.dataset.signal;
          picks[pl.id] = signal;

          window.notifications?.add(`signal set: ${pl.name} → ${signal}`);
          window.performanceHeatUp?.update({
            page: PAGE_ID,
            action: "pick",
            player: pl.id,
            signal
          });

          renderPlayers();
          renderPicksCount();
        });
      });

      playersGrid.appendChild(card);
    });
  }

  function renderPicksCount() {
    const total = Object.keys(picks).length;
    picksCountEl.textContent = `${total} picks set`;
  }

  /* ===============================
     LOCK ENTRY (FAIRNESS)
     - Once locked: disable edits
     - Backend later will validate lock + store entry
     =============================== */
  function lockEntry() {
    const total = Object.keys(picks).length;

    if (total === 0) {
      window.notifications?.add("set at least 1 signal before locking");
      return;
    }

    isLocked = true;
    lockBtn.disabled = true;
    lockStatus.textContent = "entry locked — signals cannot be changed";

    window.notifications?.add("entry locked (frontend placeholder)");
    window.performanceHeatUp?.update({
      page: PAGE_ID,
      action: "lock",
      contest: contest.id,
      picksCount: total
    });

    renderPlayers();
  }

  lockBtn.addEventListener("click", lockEntry);

  /* ===============================
     INITIAL RENDER
     =============================== */
  renderContestHeader();
  renderPlayers();
  renderPicksCount();
});document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "signal-run";

  const listEl = document.getElementById("signalRunList");
  const statusEl = document.getElementById("signalRunStatus");

  if (!listEl || !statusEl) {
    console.error(`[${PAGE_ID}] missing elements`);
    return;
  }

  window.notifications?.add("signal run loaded");
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  const userTier = window.tierUtils?.getUserTier?.() || "free";
  const tiers = ["free", "starter", "pro", "elite"];

  function canAccess(requiredTier) {
    return tiers.indexOf(userTier) >= tiers.indexOf(requiredTier);
  }

  function money(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  // Locked entry structure you specified
  const runs = [
    { id: "sr2", name: "signal run • entry", entry: 2, tier: "free", lock: 15 },
    { id: "sr5", name: "signal run • starter", entry: 5, tier: "starter", lock: 12 },
    { id: "sr10", name: "signal run • pro", entry: 10, tier: "pro", lock: 10 },
    { id: "sr25", name: "signal run • pro+", entry: 25, tier: "pro", lock: 8 },
    { id: "sr100", name: "signal run • elite", entry: 100, tier: "elite", lock: 6 }
  ];

  function render() {
    listEl.innerHTML = "";

    runs.forEach(run => {
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
          window.notifications?.add("upgrade required to enter this signal run");
        });
      } else {
        li.querySelector(".enter-btn").addEventListener("click", () => {
          window.notifications?.add(`entered ${run.name}`);
          window.performanceHeatUp?.update({ page: PAGE_ID, action: "enter", runId: run.id, entry: run.entry });
          window.location.href = "locker-room.html";
        });
      }

      listEl.appendChild(li);
    });

    statusEl.textContent = `${runs.length} runs • tier: ${userTier}`;
  }

  render();
});