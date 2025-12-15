document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "momentum-run";

  const listEl = document.getElementById("momentumRunList");
  const statusEl = document.getElementById("momentumRunStatus");

  if (!listEl || !statusEl) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  window.notifications?.add("momentum run loaded");
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  const userTier = window.tierUtils?.getUserTier?.() || "free";

  function canAccess(tier) {
    const tiers = ["free", "starter", "pro", "elite"];
    return tiers.indexOf(userTier) >= tiers.indexOf(tier);
  }

  function money(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  const runs = [
    { id: "mo1", name: "momentum run • starter", entry: 5, tier: "starter", lock: 10 },
    { id: "mo2", name: "momentum run • pro", entry: 10, tier: "pro", lock: 8 },
    { id: "mo3", name: "momentum run • elite", entry: 25, tier: "elite", lock: 6 }
  ];

  function render() {
    listEl.innerHTML = "";

    runs.forEach(run => {
      const locked = !canAccess(run.tier);

      const li = document.createElement("li");
      li.className = `momentum-run ${locked ? "locked" : ""}`;

      li.innerHTML = `
        <strong>${run.name}</strong>
        <p class="small">
          entry: ${money(run.entry)} • lock: ${run.lock} min
        </p>
        ${
          locked
            ? `<button class="upgrade-btn">upgrade to enter</button>`
            : `<button class="enter-btn">enter run</button>`
        }
      `;

      if (!locked) {
        li.querySelector(".enter-btn").addEventListener("click", () => {
          window.notifications?.add(`entered ${run.name}`);
          window.performanceHeatUp?.update({
            page: PAGE_ID,
            action: "enter",
            runId: run.id,
            entry: run.entry
          });

          window.location.href = "locker-room.html";
        });
      }

      listEl.appendChild(li);
    });

    statusEl.textContent = `${runs.length} momentum runs • tier: ${userTier}`;
  }

  render();
});