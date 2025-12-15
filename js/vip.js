document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "vip";

  const listEl = document.getElementById("vipRoomList");
  const statusEl = document.getElementById("vipStatus");

  if (!listEl || !statusEl) {
    console.error(`[${PAGE_ID}] missing elements`);
    return;
  }

  window.notifications?.add("vip loaded");
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  const userTier = window.tierUtils?.getUserTier?.() || "free";
  const tiers = ["free", "starter", "pro", "elite"];
  const canAccess = (t) => tiers.indexOf(userTier) >= tiers.indexOf(t);

  // VIP is per-room pricing (your rule)
  const rooms = [
    { id: "vr1", name: "vip room • signals", price: 4.99, tier: "starter" },
    { id: "vr2", name: "vip room • momentum", price: 7.99, tier: "pro" },
    { id: "vr3", name: "vip room • elite overlay", price: 12.99, tier: "elite" }
  ];

  function money(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  function render() {
    listEl.innerHTML = "";

    rooms.forEach(r => {
      const locked = !canAccess(r.tier);

      const li = document.createElement("li");
      li.className = `vip-room ${locked ? "locked" : ""}`;

      li.innerHTML = `
        <strong>${r.name}</strong>
        <p class="small">room price: ${money(r.price)} / month • tier: ${r.tier}</p>
        ${
          locked
            ? `<button class="upgrade-btn">upgrade to access</button>`
            : `<button class="join-btn">subscribe to room</button>`
        }
      `;

      if (locked) {
        li.querySelector(".upgrade-btn").addEventListener("click", () => window.notifications?.add("upgrade tier to access this room"));
      } else {
        li.querySelector(".join-btn").addEventListener("click", () => {
          window.notifications?.add(`subscribed to ${r.name} (placeholder)`);
        });
      }

      listEl.appendChild(li);
    });

    statusEl.textContent = `${rooms.length} rooms • tier: ${userTier}`;
  }

  render();
});