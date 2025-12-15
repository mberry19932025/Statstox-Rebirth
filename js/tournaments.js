document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "tournaments";

  const listEl = document.getElementById("tournamentList");
  const statusEl = document.getElementById("tournamentStatus");

  if (!listEl || !statusEl) {
    console.error(`[${PAGE_ID}] missing elements`);
    return;
  }

  window.notifications?.add("tournaments loaded");
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  const userTier = window.tierUtils?.getUserTier?.() || "free";
  const tiers = ["free", "starter", "pro", "elite"];
  const canAccess = (t) => tiers.indexOf(userTier) >= tiers.indexOf(t);

  const tournaments = [
    { id: "t1", name: "signal cup", entry: 2, tier: "free" },
    { id: "t2", name: "momentum major", entry: 10, tier: "starter" },
    { id: "t3", name: "pro circuit", entry: 25, tier: "pro" },
    { id: "t4", name: "elite championship", entry: 100, tier: "elite" }
  ];

  function money(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  function render() {
    listEl.innerHTML = "";

    tournaments.forEach(t => {
      const locked = !canAccess(t.tier);

      const li = document.createElement("li");
      li.className = `tournament ${locked ? "locked" : ""}`;
      li.innerHTML = `
        <strong>${t.name}</strong>
        <p class="small">entry: ${money(t.entry)} • tier: ${t.tier}</p>
        ${
          locked
            ? `<button class="upgrade-btn">upgrade to enter</button>`
            : `<button class="enter-btn">enter</button>`
        }
      `;

      if (locked) {
        li.querySelector(".upgrade-btn").addEventListener("click", () => window.notifications?.add("upgrade required to enter tournament"));
      } else {
        li.querySelector(".enter-btn").addEventListener("click", () => {
          window.notifications?.add(`entered ${t.name}`);
          window.location.href = "contest-lobby.html";
        });
      }

      listEl.appendChild(li);
    });

    statusEl.textContent = `${tournaments.length} tournaments • tier: ${userTier}`;
  }

  render();
});