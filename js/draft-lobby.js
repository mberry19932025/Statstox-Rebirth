document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "draft-lobby";

  /* ===============================
     REQUIRED DOM ELEMENTS
     =============================== */
  const lobbyList = document.getElementById("dlRoomsList");
  const filterSport = document.getElementById("dlFilterSport");
  const filterEntry = document.getElementById("dlFilterEntry");
  const searchInput = document.getElementById("dlSearch");
  const statusEl = document.getElementById("dlStatus");

  if (
    !lobbyList ||
    !filterSport ||
    !filterEntry ||
    !searchInput ||
    !statusEl
  ) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  /* ===============================
     GLOBAL SYSTEM HOOKS
     =============================== */
  window.notifications?.add("draft lobby loaded");
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  /* ===============================
     USER TIER (PLACEHOLDER)
     =============================== */
  const userTier = window.tierUtils?.getUserTier?.() || "free";

  function canAccess(requiredTier) {
    const tiers = ["free", "starter", "pro", "elite"];
    return tiers.indexOf(userTier) >= tiers.indexOf(requiredTier);
  }

  function money(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  /* ===============================
     DRAFT ROOMS (PLACEHOLDERS)
     =============================== */
  const draftRooms = [
    {
      id: "dl-nfl-2",
      name: "NFL Starter Draft",
      sport: "NFL",
      entry: 2,
      tier: "free",
      spots: 12,
      filled: 6
    },
    {
      id: "dl-nba-5",
      name: "NBA Standard Draft",
      sport: "NBA",
      entry: 5,
      tier: "starter",
      spots: 12,
      filled: 9
    },
    {
      id: "dl-mlb-10",
      name: "MLB Advanced Draft",
      sport: "MLB",
      entry: 10,
      tier: "pro",
      spots: 12,
      filled: 10
    },
    {
      id: "dl-nfl-25",
      name: "NFL Pro Draft",
      sport: "NFL",
      entry: 25,
      tier: "pro",
      spots: 10,
      filled: 7
    },
    {
      id: "dl-multi-100",
      name: "Elite Multi-Sport Draft",
      sport: "Multi",
      entry: 100,
      tier: "elite",
      spots: 8,
      filled: 4
    }
  ];

  /* ===============================
     FILTER + SEARCH
     =============================== */
  function applyFilters() {
    const sportVal = filterSport.value;
    const entryVal = filterEntry.value;
    const searchVal = searchInput.value.toLowerCase();

    return draftRooms.filter(room => {
      const sportMatch = sportVal === "all" || room.sport === sportVal;
      const entryMatch = entryVal === "all" || String(room.entry) === entryVal;
      const searchMatch = room.name.toLowerCase().includes(searchVal);

      return sportMatch && entryMatch && searchMatch;
    });
  }

  /* ===============================
     RENDER LOBBY
     =============================== */
  function renderLobby() {
    const filtered = applyFilters();
    lobbyList.innerHTML = "";

    if (!filtered.length) {
      lobbyList.innerHTML = `<li class="small">no draft rooms available</li>`;
      return;
    }

    filtered.forEach(room => {
      const locked = !canAccess(room.tier);
      const li = document.createElement("li");
      li.className = `dl-room ${locked ? "locked" : ""}`;

      li.innerHTML = `
        <div class="dl-room-main">
          <strong>${room.name}</strong>
          <p class="small">
            ${room.sport} • entry ${money(room.entry)} •
            ${room.filled}/${room.spots} filled
          </p>
          <p class="small tier-label">tier: ${room.tier}</p>
        </div>

        ${
          locked
            ? `<button class="upgrade-btn">upgrade to join</button>`
            : `<button class="join-btn">enter draft</button>`
        }
      `;

      if (locked) {
        li.querySelector(".upgrade-btn").addEventListener("click", () => {
          window.notifications?.add("upgrade required to access this draft tier");
          window.performanceHeatUp?.update({
            page: PAGE_ID,
            action: "locked-room",
            tier: room.tier
          });
        });
      } else {
        li.querySelector(".join-btn").addEventListener("click", () => {
          window.notifications?.add(`entering draft room: ${room.name}`);
          window.performanceHeatUp?.update({
            page: PAGE_ID,
            action: "join-room",
            roomId: room.id
          });

          // Backend will validate entry + seat assignment
          window.location.href = `draft-arena.html?contestId=${room.id}`;
        });
      }

      lobbyList.appendChild(li);
    });

    statusEl.textContent = `${filtered.length} draft rooms available`;
  }

  /* ===============================
     EVENTS
     =============================== */
  [filterSport, filterEntry, searchInput].forEach(el =>
    el.addEventListener("input", renderLobby)
  );

  /* ===============================
     INIT
     =============================== */
  renderLobby();
});