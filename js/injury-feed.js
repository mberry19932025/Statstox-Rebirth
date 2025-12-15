document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "injury-feed";

  /* ===============================
     REQUIRED DOM ELEMENTS
     =============================== */
  const listEl = document.getElementById("injuryFeedList");
  const statusEl = document.getElementById("injuryFeedStatus");
  const filterEl = document.getElementById("injuryFeedFilter");

  if (!listEl || !statusEl || !filterEl) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  /* ===============================
     GLOBAL SYSTEM HOOKS
     =============================== */
  window.notifications?.add("injury feed loaded");
  window.performanceHeatUp?.update({
    page: PAGE_ID,
    action: "view"
  });

  /* ===============================
     USER CONTEXT
     =============================== */
  const userTier = window.tierUtils?.getUserTier?.() || "free";

  function canAccess(requiredTier) {
    const tiers = ["free", "starter", "pro", "elite"];
    return tiers.indexOf(userTier) >= tiers.indexOf(requiredTier);
  }

  /* ===============================
     INJURY DATA (PLACEHOLDER)
     =============================== */
  const injuries = [
    {
      id: "inj-001",
      player: "player alpha",
      team: "team a",
      status: "questionable",
      impact: "moderate",
      tier: "free"
    },
    {
      id: "inj-002",
      player: "player beta",
      team: "team b",
      status: "out",
      impact: "high",
      tier: "starter"
    },
    {
      id: "inj-003",
      player: "player gamma",
      team: "team c",
      status: "doubtful",
      impact: "high",
      tier: "pro"
    },
    {
      id: "inj-004",
      player: "player delta",
      team: "team d",
      status: "game-time decision",
      impact: "critical",
      tier: "elite"
    }
  ];

  /* ===============================
     FILTER
     =============================== */
  function getFiltered() {
    const value = filterEl.value;
    if (value === "all") return injuries;
    return injuries.filter(i => i.status === value);
  }

  /* ===============================
     RENDER
     =============================== */
  function render() {
    const filtered = getFiltered();
    listEl.innerHTML = "";

    if (!filtered.length) {
      listEl.innerHTML = `<li class="small">no injury updates</li>`;
      statusEl.textContent = "0 updates";
      return;
    }

    filtered.forEach(item => {
      const locked = !canAccess(item.tier);

      const li = document.createElement("li");
      li.className = `injury-item ${locked ? "locked" : ""}`;

      li.innerHTML = `
        <strong>${item.player}</strong>
        <p class="small">
          ${item.team} • status: ${item.status}
        </p>
        <p class="small">
          impact: ${item.impact}
        </p>
        <p class="small tier-label">
          tier: ${item.tier}
        </p>
        ${
          locked
            ? `<button class="upgrade-btn">upgrade for details</button>`
            : `<button class="details-btn">view details</button>`
        }
      `;

      if (locked) {
        li.querySelector(".upgrade-btn").addEventListener("click", () => {
          window.notifications?.add("upgrade required for full injury details");
          window.performanceHeatUp?.update({
            page: PAGE_ID,
            action: "upgrade-click",
            requiredTier: item.tier
          });
        });
      } else {
        li.querySelector(".details-btn").addEventListener("click", () => {
          window.notifications?.add(`viewed injury: ${item.player}`);
          window.performanceHeatUp?.update({
            page: PAGE_ID,
            action: "view",
            itemId: item.id
          });
        });
      }

      listEl.appendChild(li);
    });

    statusEl.textContent = `${filtered.length} updates • tier: ${userTier}`;
  }

  filterEl.addEventListener("change", render);
  render();
});