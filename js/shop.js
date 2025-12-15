document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "shop";

  const listEl = document.getElementById("shopList");
  const statusEl = document.getElementById("shopStatus");

  if (!listEl || !statusEl) {
    console.error(`[${PAGE_ID}] missing elements`);
    return;
  }

  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });
  window.notifications?.add("shop loaded");

  const userTier = window.tierUtils?.getUserTier?.() || "free";
  const tiers = ["free", "starter", "pro", "elite"];

  function canAccess(requiredTier) {
    return tiers.indexOf(userTier) >= tiers.indexOf(requiredTier);
  }

  // Monetized, but NOT pay-to-win (cosmetic + access tools)
  const items = [
    { id: "sh1", name: "avatar pack • basic", price: 2.99, tier: "free", type: "cosmetic" },
    { id: "sh2", name: "badge glow • starter", price: 4.99, tier: "starter", type: "cosmetic" },
    { id: "sh3", name: "signal skin • pro", price: 7.99, tier: "pro", type: "cosmetic" },
    { id: "sh4", name: "elite dashboard theme", price: 12.99, tier: "elite", type: "cosmetic" }
  ];

  function money(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  function render() {
    listEl.innerHTML = "";

    items.forEach(it => {
      const locked = !canAccess(it.tier);

      const li = document.createElement("li");
      li.className = `shop-item ${locked ? "locked" : ""}`;

      li.innerHTML = `
        <strong>${it.name}</strong>
        <p class="small">type: ${it.type} • price: ${money(it.price)} • tier: ${it.tier}</p>
        ${
          locked
            ? `<button class="upgrade-btn">upgrade to buy</button>`
            : `<button class="buy-btn">buy</button>`
        }
      `;

      li.querySelector(locked ? ".upgrade-btn" : ".buy-btn").addEventListener("click", () => {
        window.notifications?.add(locked ? "upgrade required to purchase" : `purchased: ${it.name} (placeholder)`);
      });

      listEl.appendChild(li);
    });

    statusEl.textContent = `${items.length} items • tier: ${userTier}`;
  }

  render();
});