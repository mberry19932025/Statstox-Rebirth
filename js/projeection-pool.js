document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "projection-pool";

  const listEl = document.getElementById("projectionList");
  const statusEl = document.getElementById("projectionStatus");

  if (!listEl || !statusEl) {
    console.error(`[${PAGE_ID}] missing elements`);
    return;
  }

  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  const userTier = window.tierUtils?.getUserTier?.() || "free";

  function canAccess(tier) {
    const tiers = ["free", "starter", "pro", "elite"];
    return tiers.indexOf(userTier) >= tiers.indexOf(tier);
  }

  const projections = [
    { id: "pp1", name: "NFL Player A", value: "15.2 pts", tier: "free" },
    { id: "pp2", name: "NBA Player B", value: "24.8 pts", tier: "starter" },
    { id: "pp3", name: "MLB Player C", value: "volatile range", tier: "pro" },
    { id: "pp4", name: "Elite Model Composite", value: "confidence bands", tier: "elite" }
  ];

  function render() {
    listEl.innerHTML = "";

    projections.forEach(p => {
      const locked = !canAccess(p.tier);

      const li = document.createElement("li");
      li.className = `projection-item ${locked ? "locked" : ""}`;

      li.innerHTML = `
        <strong>${p.name}</strong>
        <p class="small">
          projection: ${locked ? "locked" : p.value}
        </p>
        ${
          locked
            ? `<button class="upgrade-btn">unlock</button>`
            : `<button class="details-btn">details</button>`
        }
      `;

      if (locked) {
        li.querySelector(".upgrade-btn").addEventListener("click", () => {
          window.notifications?.add("upgrade to unlock advanced projections");
        });
      }

      listEl.appendChild(li);
    });

    statusEl.textContent = `${projections.length} projections • tier: ${userTier}`;
  }

  render();
});