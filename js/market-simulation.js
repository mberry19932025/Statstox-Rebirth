document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "market-simulation";

  const listEl = document.getElementById("simulationList");
  const statusEl = document.getElementById("simulationStatus");

  if (!listEl || !statusEl) {
    console.error(`[${PAGE_ID}] missing elements`);
    return;
  }

  window.notifications?.add("market simulation loaded");
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  const userTier = window.tierUtils?.getUserTier?.() || "free";

  function canAccess(tier) {
    const tiers = ["free", "starter", "pro", "elite"];
    return tiers.indexOf(userTier) >= tiers.indexOf(tier);
  }

  const simulations = [
    { id: "s1", title: "basic signal sim", tier: "free" },
    { id: "s2", title: "momentum reaction sim", tier: "starter" },
    { id: "s3", title: "volatility scenario sim", tier: "pro" },
    { id: "s4", title: "elite multi-signal sim", tier: "elite" }
  ];

  function render() {
    listEl.innerHTML = "";

    simulations.forEach(sim => {
      const locked = !canAccess(sim.tier);

      const li = document.createElement("li");
      li.className = `simulation-item ${locked ? "locked" : ""}`;

      li.innerHTML = `
        <strong>${sim.title}</strong>
        <p class="small">tier: ${sim.tier}</p>
        ${
          locked
            ? `<button class="upgrade-btn">unlock simulation</button>`
            : `<button class="run-btn">run simulation</button>`
        }
      `;

      if (locked) {
        li.querySelector(".upgrade-btn").addEventListener("click", () => {
          window.notifications?.add("upgrade to unlock simulation tools");
        });
      }

      listEl.appendChild(li);
    });

    statusEl.textContent = `${simulations.length} simulations • tier: ${userTier}`;
  }

  render();
});