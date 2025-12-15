document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "draft-arena";

  /* ===============================
     REQUIRED DOM ELEMENTS
     =============================== */
  const titleEl = document.getElementById("daTitle");
  const metaEl = document.getElementById("daMeta");

  const tiersGrid = document.getElementById("daEntryTiers");
  const selectedTierEl = document.getElementById("daSelectedTier");

  const timerEl = document.getElementById("daPickTimer");
  const currentPickerEl = document.getElementById("daCurrentPicker");
  const draftStatusEl = document.getElementById("daDraftStatus");

  const queueList = document.getElementById("daQueueList");
  const addToQueueBtnsWrap = document.getElementById("daPlayersGrid");

  const lockBtn = document.getElementById("daLockEntryBtn");
  const lockStatusEl = document.getElementById("daLockStatus");

  if (
    !titleEl || !metaEl ||
    !tiersGrid || !selectedTierEl ||
    !timerEl || !currentPickerEl || !draftStatusEl ||
    !queueList || !addToQueueBtnsWrap ||
    !lockBtn || !lockStatusEl
  ) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  /* ===============================
     GLOBAL SYSTEM HOOKS
     =============================== */
  window.notifications?.add("draft arena loaded");
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  /* ===============================
     CONTEST CONTEXT (FROM LOBBY LATER)
     =============================== */
  const url = new URL(window.location.href);
  const contestId = url.searchParams.get("contestId") || "draft-nfl-room-001";

  const contest = {
    id: contestId,
    name: "Draft Arena",
    league: "NFL",
    windowLabel: "Live Draft Room",
    pickSeconds: 20
  };

  titleEl.textContent = contest.name;
  metaEl.textContent = `${contest.league} • ${contest.windowLabel} • contest id: ${contest.id}`;

  function money(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  /* ===============================
     ENTRY TIERS (LOCKED)
     - Draft tiers compete separately
     =============================== */
  const entryTiers = [
    { id: "t2", label: "starter", entry: 2, tier: "free" },
    { id: "t5", label: "standard", entry: 5, tier: "starter" },
    { id: "t10", label: "advanced", entry: 10, tier: "pro" },
    { id: "t25", label: "pro", entry: 25, tier: "pro" },
    { id: "t100", label: "elite", entry: 100, tier: "elite" }
  ];

  let selectedTier = null;
  let entryLocked = false;

  function canAccess(tierObj) {
    if (!window.tierUtils) return tierObj.tier === "free";
    return window.tierUtils.isTierAllowed(tierObj.tier);
  }

  /* ===============================
     DRAFT POOL (PLACEHOLDERS)
     =============================== */
  const playerPool = [
    { id: "p1", name: "Player Alpha", pos: "QB", team: "TBD" },
    { id: "p2", name: "Player Beta", pos: "RB", team: "TBD" },
    { id: "p3", name: "Player Gamma", pos: "WR", team: "TBD" },
    { id: "p4", name: "Player Delta", pos: "TE", team: "TBD" },
    { id: "p5", name: "Player Echo", pos: "DST", team: "TBD" }
  ];

  /* ===============================
     DRAFT QUEUE
     =============================== */
  const draftQueue = []; // array of player IDs in order

  function renderQueue() {
    queueList.innerHTML = "";

    if (draftQueue.length === 0) {
      queueList.innerHTML = `<li class="small">queue is empty — add players below</li>`;
      return;
    }

    draftQueue.forEach((pid, idx) => {
      const pl = playerPool.find(p => p.id === pid);
      const li = document.createElement("li");
      li.className = "da-queue-item";
      li.innerHTML = `
        <span>${idx + 1}. ${pl ? pl.name : pid}</span>
        <button ${entryLocked ? "disabled" : ""} data-remove="${pid}">remove</button>
      `;

      li.querySelector("button").addEventListener("click", () => {
        if (entryLocked) return;
        const i = draftQueue.indexOf(pid);
        if (i > -1) draftQueue.splice(i, 1);
        window.notifications?.add("removed from queue");
        renderQueue();
      });

      queueList.appendChild(li);
    });
  }

  function addToQueue(playerId) {
    if (entryLocked) return;

    if (draftQueue.includes(playerId)) {
      window.notifications?.add("already in queue");
      return;
    }

    draftQueue.push(playerId);
    window.notifications?.add("added to queue");
    window.performanceHeatUp?.update({ page: PAGE_ID, action: "queue-add", player: playerId });
    renderQueue();
  }

  /* ===============================
     PLAYER GRID (ADD TO QUEUE)
     =============================== */
  function renderPlayers() {
    addToQueueBtnsWrap.innerHTML = "";

    playerPool.forEach(pl => {
      const card = document.createElement("article");
      card.className = "da-player-card";
      card.innerHTML = `
        <div class="da-player-top">
          <img src="images/player-silhouette.png" alt="player silhouette" class="da-player-img" />
          <div>
            <h3>${pl.name}</h3>
            <p class="small">${pl.pos} • ${pl.team}</p>
          </div>
        </div>
        <button ${entryLocked ? "disabled" : ""} class="primary-btn">add to queue</button>
      `;

      card.querySelector("button").addEventListener("click", () => addToQueue(pl.id));
      addToQueueBtnsWrap.appendChild(card);
    });
  }

  /* ===============================
     ENTRY TIER UI
     =============================== */
  function renderTiers() {
    tiersGrid.innerHTML = "";

    entryTiers.forEach(t => {
      const allowed = canAccess(t);

      const card = document.createElement("article");
      card.className = "da-tier-card";
      card.dataset.tierId = t.id;

      card.innerHTML = `
        <h3>${t.label}</h3>
        <p><strong>entry:</strong> ${money(t.entry)}</p>
        <p class="small"><strong>access:</strong> ${t.tier}</p>
        <button ${(!allowed || entryLocked) ? "disabled" : ""}>
          ${selectedTier?.id === t.id ? "selected" : (allowed ? "select" : "locked")}
        </button>
      `;

      card.querySelector("button").addEventListener("click", () => {
        if (entryLocked) return;
        if (!allowed) {
          window.notifications?.add("locked: upgrade tier to access this draft tier");
          return;
        }

        selectedTier = t;
        selectedTierEl.textContent = `${t.label} • ${money(t.entry)}`;

        window.notifications?.add(`draft tier selected: ${t.label}`);
        window.performanceHeatUp?.update({ page: PAGE_ID, action: "tier-select", tier: t.id });

        renderTiers();
      });

      tiersGrid.appendChild(card);
    });

    if (!selectedTier) selectedTierEl.textContent = "no tier selected";
  }

  /* ===============================
     PICK TIMER + AUTO-PICK (PLACEHOLDER)
     - This simulates the behavior; backend will control real timer later
     =============================== */
  let secondsLeft = contest.pickSeconds;
  let currentPicker = "you";
  let timerInterval = null;

  function renderTimer() {
    timerEl.textContent = `${secondsLeft}s`;
    currentPickerEl.textContent = currentPicker;
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    secondsLeft = contest.pickSeconds;

    timerInterval = setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft <= 0) {
        clearInterval(timerInterval);
        autoPick();
      }
      renderTimer();
    }, 1000);
  }

  function autoPick() {
    // Auto-pick uses the first available player from queue; if empty, first pool item
    let pickId = draftQueue.shift();
    if (!pickId) pickId = playerPool[0]?.id;

    draftStatusEl.textContent = `auto-pick triggered: ${pickId || "none"}`;
    window.notifications?.add("auto-pick triggered (placeholder)");

    window.performanceHeatUp?.update({
      page: PAGE_ID,
      action: "autopick",
      player: pickId || "none"
    });

    renderQueue();
    startTimer(); // next pick cycle placeholder
  }

  /* ===============================
     LOCK ENTRY (FAIRNESS)
     - Must pick tier
     - Queue can still be edited until lock
     - After lock: queue becomes final
     =============================== */
  lockBtn.addEventListener("click", () => {
    if (!selectedTier) {
      window.notifications?.add("select an entry tier before locking");
      return;
    }

    entryLocked = true;
    lockBtn.disabled = true;
    lockStatusEl.textContent = "entry locked — queue saved (draft starts / controlled by backend later)";

    window.notifications?.add("draft entry locked (placeholder)");
    window.performanceHeatUp?.update({
      page: PAGE_ID,
      action: "lock",
      contest: contest.id,
      tier: selectedTier.id,
      queueCount: draftQueue.length
    });

    renderTiers();
    renderPlayers();
    renderQueue();

    // start a simulated timer loop once locked
    startTimer();
  });

  /* ===============================
     INIT
     =============================== */
  draftStatusEl.textContent = "build your queue, select tier, then lock entry";
  renderTiers();
  renderPlayers();
  renderQueue();
  renderTimer();
});