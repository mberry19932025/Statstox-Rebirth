document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "promo";

  const listEl = document.getElementById("promoList");
  const statusEl = document.getElementById("promoStatus");

  if (!listEl || !statusEl) {
    console.error(`[${PAGE_ID}] missing elements`);
    return;
  }

  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });
  window.notifications?.add("promo page loaded");

  const userTier = window.tierUtils?.getUserTier?.() || "free";

  const promos = [
    {
      id: "pr1",
      title: "starter boost",
      description: "unlock momentum signals for 24 hours",
      tier: "free",
      action: "activate"
    },
    {
      id: "pr2",
      title: "pro trial",
      description: "try pro analytics for one contest",
      tier: "starter",
      action: "upgrade"
    },
    {
      id: "pr3",
      title: "elite credit",
      description: "$10 contest credit for elite members",
      tier: "elite",
      action: "claim"
    }
  ];

  function canAccess(tier) {
    const tiers = ["free", "starter", "pro", "elite"];
    return tiers.indexOf(userTier) >= tiers.indexOf(tier);
  }

  function render() {
    listEl.innerHTML = "";

    promos.forEach(p => {
      const locked = !canAccess(p.tier);

      const li = document.createElement("li");
      li.className = `promo-item ${locked ? "locked" : ""}`;

      li.innerHTML = `
        <strong>${p.title}</strong>
        <p class="small">${p.description}</p>
        <p class="small">tier required: ${p.tier}</p>
        ${
          locked
            ? `<button class="upgrade-btn">upgrade to unlock</button>`
            : `<button class="action-btn">${p.action}</button>`
        }
      `;

      if (!locked) {
        li.querySelector(".action-btn").addEventListener("click", () => {
          window.notifications?.add(`promo activated: ${p.title}`);
        });
      }

      listEl.appendChild(li);
    });

    statusEl.textContent = `${promos.length} offers available • tier: ${userTier}`;
  }

  render();
});