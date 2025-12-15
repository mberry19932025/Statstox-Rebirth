document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "subscriptions";

  const listEl = document.getElementById("subList");
  const statusEl = document.getElementById("subStatus");

  if (!listEl || !statusEl) {
    console.error(`[${PAGE_ID}] missing elements`);
    return;
  }

  window.notifications?.add("subscriptions loaded");
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  const plans = [
    { id: "free", name: "free", price: 0, perks: ["basic signals", "limited feeds"] },
    { id: "starter", name: "starter", price: 7.99, perks: ["momentum signals", "more feeds"] },
    { id: "pro", name: "pro", price: 14.99, perks: ["advanced analytics", "leaderboard metrics"] },
    { id: "elite", name: "elite", price: 24.99, perks: ["everything unlocked", "vip access"] }
  ];

  function money(n) {
    return n === 0 ? "$0.00" : `$${Number(n).toFixed(2)}`;
  }

  function render() {
    listEl.innerHTML = "";
    plans.forEach(p => {
      const li = document.createElement("li");
      li.className = "sub-plan";
      li.innerHTML = `
        <strong>${p.name}</strong>
        <p class="small">${money(p.price)} / month</p>
        <ul class="small">${p.perks.map(x => `<li>${x}</li>`).join("")}</ul>
        <button class="select-btn">select</button>
      `;

      li.querySelector(".select-btn").addEventListener("click", () => {
        window.notifications?.add(`selected plan: ${p.name} (placeholder)`);
      });

      listEl.appendChild(li);
    });

    statusEl.textContent = `${plans.length} plans`;
  }

  render();
});