document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "feed";

  /* ===============================
     REQUIRED DOM ELEMENTS
     =============================== */
  const feedList = document.getElementById("feedList");
  const feedStatus = document.getElementById("feedStatus");
  const feedSearch = document.getElementById("feedSearch");
  const feedFilter = document.getElementById("feedFilter");

  if (!feedList || !feedStatus || !feedSearch || !feedFilter) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  /* ===============================
     GLOBAL SYSTEM HOOKS
     =============================== */
  window.notifications?.add("feed loaded");
  window.performanceHeatUp?.update({
    page: PAGE_ID,
    action: "view"
  });

  /* ===============================
     USER CONTEXT (PLACEHOLDERS)
     =============================== */
  const userTier = window.tierUtils?.getUserTier?.() || "free";
  let stackedCoins = 0;

  function addCoins(amount) {
    stackedCoins += amount;
    window.notifications?.add(`+${amount} stacked coins`);
    window.performanceHeatUp?.update({
      page: PAGE_ID,
      action: "coins-earned",
      amount
    });
  }

  function canAccess(requiredTier) {
    const tiers = ["free", "starter", "pro", "elite"];
    return tiers.indexOf(userTier) >= tiers.indexOf(requiredTier);
  }

  /* ===============================
     FEED DATA (DFS-FIRST)
     =============================== */
  const feedItems = [
    {
      id: "signal-001",
      type: "signal",
      title: "momentum signal",
      description: "player alpha trending above line",
      tier: "free"
    },
    {
      id: "heat-001",
      type: "heat",
      title: "heat-up alert",
      description: "player beta heat index rising fast",
      tier: "pro"
    },
    {
      id: "momentum-001",
      type: "momentum",
      title: "momentum run",
      description: "player gamma entering sustained run window",
      tier: "starter"
    },
    {
      id: "projection-001",
      type: "projection",
      title: "projection shift",
      description: "player delta projection adjusted post-update",
      tier: "elite"
    },
    {
      id: "promo-001",
      type: "promo",
      title: "contest promo",
      description: "enter a $5 contest today and earn stacked coins",
      tier: "free",
      route: "contest-lobby.html"
    }
  ];

  /* ===============================
     FILTER + SEARCH
     =============================== */
  function getFilteredItems() {
    const query = feedSearch.value.toLowerCase().trim();
    const type = feedFilter.value;

    return feedItems.filter(item => {
      const typeMatch = type === "all" || item.type === type;
      const searchMatch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      return typeMatch && searchMatch;
    });
  }

  /* ===============================
     RENDER FEED
     =============================== */
  function renderFeed() {
    const items = getFilteredItems();
    feedList.innerHTML = "";

    if (!items.length) {
      feedList.innerHTML = `<li class="small">no feed items found</li>`;
      feedStatus.textContent = "0 items";
      return;
    }

    items.forEach(item => {
      const locked = !canAccess(item.tier);

      const li = document.createElement("li");
      li.className = `feed-item ${locked ? "locked" : ""}`;

      li.innerHTML = `
        <div class="feed-top">
          <strong>${item.title}</strong>
          <span class="badge">${item.type}</span>
        </div>

        <p class="small">${item.description}</p>

        <p class="small tier-label">
          tier: ${item.tier.toUpperCase()}
        </p>

        <div class="feed-actions">
          ${
            locked
              ? `<button class="upgrade-btn">upgrade</button>`
              : `<button class="open-btn">open</button>`
          }
          <button class="coin-btn">claim coins</button>
        </div>
      `;

      li.querySelector(".coin-btn").addEventListener("click", () => {
        addCoins(5);
      });

      if (locked) {
        li.querySelector(".upgrade-btn").addEventListener("click", () => {
          window.notifications?.add("upgrade required");
          window.performanceHeatUp?.update({
            page: PAGE_ID,
            action: "upgrade-click",
            requiredTier: item.tier
          });
        });
      } else {
        li.querySelector(".open-btn").addEventListener("click", () => {
          window.notifications?.add(`opened: ${item.title}`);
          window.performanceHeatUp?.update({
            page: PAGE_ID,
            action: "open",
            itemId: item.id
          });

          if (item.route) {
            window.location.href = item.route;
          }
        });
      }

      feedList.appendChild(li);
    });

    feedStatus.textContent = `${items.length} items • tier: ${userTier}`;
  }

  /* ===============================
     EVENTS
     =============================== */
  [feedSearch, feedFilter].forEach(el =>
    el.addEventListener("input", renderFeed)
  );

  renderFeed();
});