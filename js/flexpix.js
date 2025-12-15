document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "flexpix";

  /* ===============================
     REQUIRED DOM ELEMENTS
     =============================== */
  const gridEl = document.getElementById("fpGrid");
  const filterTypeEl = document.getElementById("fpFilterType");
  const filterTierEl = document.getElementById("fpFilterTier");
  const searchEl = document.getElementById("fpSearch");
  const statusEl = document.getElementById("fpStatus");

  if (!gridEl || !filterTypeEl || !filterTierEl || !searchEl || !statusEl) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  /* ===============================
     GLOBAL SYSTEM HOOKS
     =============================== */
  window.notifications?.add("flexpix loaded");
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  /* ===============================
     USER CONTEXT (PLACEHOLDER)
     =============================== */
  const userTier = window.tierUtils?.getUserTier?.() || "free";

  function canAccess(requiredTier) {
    const tiers = ["free", "starter", "pro", "elite"];
    return tiers.indexOf(userTier) >= tiers.indexOf(requiredTier);
  }

  /* ===============================
     FLEXPIX ITEMS (PLACEHOLDERS)
     - Visual cards tied to signals/heat/projections
     - Shareable, embeddable
     =============================== */
  const items = [
    {
      id: "fp1",
      type: "signal",
      title: "momentum spike",
      caption: "player alpha trending over line",
      tier: "free"
    },
    {
      id: "fp2",
      type: "heat",
      title: "heat-up card",
      caption: "player beta heat index rising",
      tier: "pro"
    },
    {
      id: "fp3",
      type: "projection",
      title: "projection shift",
      caption: "player gamma projection adjusted",
      tier: "elite"
    },
    {
      id: "fp4",
      type: "promo",
      title: "contest highlight",
      caption: "enter $5 contest • earn stacked coins",
      tier: "free"
    }
  ];

  /* ===============================
     FILTER + SEARCH
     =============================== */
  function getFiltered() {
    const t = filterTypeEl.value;
    const tier = filterTierEl.value;
    const q = searchEl.value.toLowerCase().trim();

    return items.filter(it => {
      const typeMatch = t === "all" || it.type === t;
      const tierMatch = tier === "all" || it.tier === tier;
      const searchMatch =
        !q ||
        it.title.toLowerCase().includes(q) ||
        it.caption.toLowerCase().includes(q);

      return typeMatch && tierMatch && searchMatch;
    });
  }

  /* ===============================
     RENDER GRID
     =============================== */
  function render() {
    const filtered = getFiltered();
    gridEl.innerHTML = "";

    if (!filtered.length) {
      statusEl.textContent = "0 flexpix";
      gridEl.innerHTML = `<p class="small">no flexpix available</p>`;
      return;
    }

    filtered.forEach(it => {
      const locked = !canAccess(it.tier);

      const card = document.createElement("article");
      card.className = `fp-card ${locked ? "locked" : ""}`;

      card.innerHTML = `
        <div class="fp-media">
          <img
            src="images/flexpix-placeholder.png"
            alt="flexpix placeholder"
          />
        </div>

        <div class="fp-body">
          <strong>${it.title}</strong>
          <p class="small">${it.caption}</p>
          <p class="small tier-label">tier: ${it.tier}</p>
        </div>

        <div class="fp-actions">
          ${
            locked
              ? `<button class="upgrade-btn">upgrade</button>`
              : `
                <button class="view-btn">view</button>
                <button class="share-btn">share</button>
              `
          }
        </div>
      `;

      if (locked) {
        card.querySelector(".upgrade-btn").addEventListener("click", () => {
          window.notifications?.add("upgrade required to unlock flexpix");
          window.performanceHeatUp?.update({
            page: PAGE_ID,
            action: "upgrade-click",
            requiredTier: it.tier
          });
        });
      } else {
        card.querySelector(".view-btn").addEventListener("click", () => {
          window.notifications?.add(`opened flexpix: ${it.title}`);
          window.performanceHeatUp?.update({
            page: PAGE_ID,
            action: "open",
            itemId: it.id
          });

          // FEED HOOK (global component; no-op until integrated)
          window.feed?.push?.({
            source: PAGE_ID,
            type: it.type,
            message: `flexpix viewed: ${it.title}`,
            tier: it.tier
          });
        });

        card.querySelector(".share-btn").addEventListener("click", () => {
          window.notifications?.add("share link copied (placeholder)");
          window.performanceHeatUp?.update({
            page: PAGE_ID,
            action: "share",
            itemId: it.id
          });
        });
      }

      gridEl.appendChild(card);
    });

    statusEl.textContent = `${filtered.length} flexpix • tier: ${userTier}`;
  }

  /* ===============================
     EVENTS
     =============================== */
  [filterTypeEl, filterTierEl, searchEl].forEach(el =>
    el.addEventListener("input", render)
  );

  render();
});