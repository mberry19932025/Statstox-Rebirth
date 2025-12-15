document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "dfs-feed";

  /* ===============================
     REQUIRED DOM ELEMENTS
     =============================== */
  const feedList = document.getElementById("dfsFeedList");
  const filterSport = document.getElementById("dfsFilterSport");
  const filterTier = document.getElementById("dfsFilterTier");
  const searchInput = document.getElementById("dfsSearch");
  const statusEl = document.getElementById("dfsFeedStatus");

  if (
    !feedList ||
    !filterSport ||
    !filterTier ||
    !searchInput ||
    !statusEl
  ) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  /* ===============================
     GLOBAL SYSTEM HOOKS
     =============================== */
  window.notifications?.add("dfs feed loaded");
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  /* ===============================
     USER TIER (PLACEHOLDER)
     - Backend will inject real tier
     =============================== */
  const userTier = window.tierUtils?.getUserTier?.() || "free";

  /* ===============================
     SIGNAL DATA (PLACEHOLDER)
     =============================== */
  const signals = [
    {
      id: "sig1",
      player: "Player Alpha",
      sport: "NFL",
      type: "momentum",
      projection: "over 24.5",
      tier: "free"
    },
    {
      id: "sig2",
      player: "Player Beta",
      sport: "NBA",
      type: "heat",
      projection: "assist spike",
      tier: "pro"
    },
    {
      id: "sig3",
      player: "Player Gamma",
      sport: "MLB",
      type: "signal",
      projection: "hits momentum",
      tier: "elite"
    }
  ];

  /* ===============================
     FILTER / SEARCH
     =============================== */
  function applyFilters() {
    const sportVal = filterSport.value;
    const tierVal = filterTier.value;
    const searchVal = searchInput.value.toLowerCase();

    return signals.filter(sig => {
      const sportMatch = sportVal === "all" || sig.sport === sportVal;
      const tierMatch = tierVal === "all" || sig.tier === tierVal;
      const searchMatch =
        sig.player.toLowerCase().includes(searchVal) ||
        sig.type.toLowerCase().includes(searchVal);

      return sportMatch && tierMatch && searchMatch;
    });
  }

  /* ===============================
     ACCESS CONTROL
     =============================== */
  function canAccessSignal(signalTier) {
    const tiers = ["free", "pro", "elite"];
    return tiers.indexOf(userTier) >= tiers.indexOf(signalTier);
  }

  /* ===============================
     RENDER FEED
     =============================== */
  function renderFeed() {
    const filtered = applyFilters();
    feedList.innerHTML = "";

    if (!filtered.length) {
      feedList.innerHTML = `<li class="small">no signals found</li>`;
      return;
    }

    filtered.forEach(sig => {
      const li = document.createElement("li");
      const locked = !canAccessSignal(sig.tier);

      li.className = `dfs-signal ${locked ? "locked" : ""}`;

      li.innerHTML = `
        <div class="dfs-signal-header">
          <strong>${sig.player}</strong>
          <span class="badge">${sig.sport}</span>
        </div>

        <p class="small">
          <strong>${sig.type}</strong> — ${sig.projection}
        </p>

        <p class="small tier-label">
          tier: ${sig.tier.toUpperCase()}
        </p>

        ${
          locked
            ? `<button class="upgrade-btn">upgrade to unlock</button>`
            : `<button class="signal-btn">view signal</button>`
        }
      `;

      if (locked) {
        li.querySelector(".upgrade-btn").addEventListener("click", () => {
          window.notifications?.add("upgrade required to unlock this signal");
          window.performanceHeatUp?.update({
            page: PAGE_ID,
            action: "locked-signal",
            tier: sig.tier
          });
        });
      } else {
        li.querySelector(".signal-btn").addEventListener("click", () => {
          window.notifications?.add(`signal opened: ${sig.player}`);
          window.performanceHeatUp?.update({
            page: PAGE_ID,
            action: "signal-open",
            signalId: sig.id
          });
        });
      }

      feedList.appendChild(li);
    });

    statusEl.textContent = `${filtered.length} signals available`;
  }

  /* ===============================
     EVENT LISTENERS
     =============================== */
  [filterSport, filterTier, searchInput].forEach(el =>
    el.addEventListener("input", renderFeed)
  );

  /* ===============================
     INIT
     =============================== */
  renderFeed();
});