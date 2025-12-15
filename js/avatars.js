document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "avatars";

  /* ===============================
     REQUIRED DOM ELEMENTS
     =============================== */
  const grid = document.getElementById("avatarsGrid");
  const tierFilter = document.getElementById("avatarTierFilter");
  const status = document.getElementById("avatarsStatus");

  if (!grid || !tierFilter || !status) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  /* ===============================
     GLOBAL SYSTEM HOOKS
     =============================== */
  window.notifications?.add("avatars page loaded");

  window.performanceHeatUp?.update({
    page: PAGE_ID,
    action: "view"
  });

  /* ===============================
     AVATAR DATA (PLACEHOLDERS)
     - Cosmetic only
     - Tier + coin gated
     =============================== */
  const avatars = [
    {
      id: "av1",
      name: "default silhouette",
      tier: "free",
      coinCost: 0
    },
    {
      id: "av2",
      name: "green outline",
      tier: "starter",
      coinCost: 25
    },
    {
      id: "av3",
      name: "black gold glow",
      tier: "pro",
      coinCost: 75
    },
    {
      id: "av4",
      name: "neon statstox",
      tier: "elite",
      coinCost: 150
    }
  ];

  /* ===============================
     ACCESS CHECK
     =============================== */
  function canAccessAvatar(avatar) {
    if (!window.tierUtils) return avatar.tier === "free";
    return window.tierUtils.isTierAllowed(avatar.tier);
  }

  /* ===============================
     RENDER
     =============================== */
  function render(list) {
    grid.innerHTML = "";

    if (!list.length) {
      status.textContent = "no avatars found";
      return;
    }

    status.textContent = `${list.length} avatars available`;

    list.forEach(avatar => {
      const unlocked = canAccessAvatar(avatar);

      const card = document.createElement("article");
      card.className = "avatar-card";
      card.dataset.avatarId = avatar.id;

      card.innerHTML = `
        <img
          src="images/avatar-placeholder.png"
          alt="avatar placeholder"
          class="avatar-image"
        />
        <h3>${avatar.name}</h3>
        <p><strong>tier:</strong> ${avatar.tier}</p>
        <p><strong>cost:</strong> ${avatar.coinCost} 🪙</p>
        <button ${!unlocked ? "disabled" : ""}>
          ${unlocked ? "select avatar" : "locked"}
        </button>
      `;

      grid.appendChild(card);
    });
  }

  /* ===============================
     FILTER
     =============================== */
  function applyFilter() {
    const tier = tierFilter.value;
    const filtered =
      tier === "ALL"
        ? avatars
        : avatars.filter(a => a.tier === tier);

    window.performanceHeatUp?.update({
      page: PAGE_ID,
      action: "filter",
      tier
    });

    render(filtered);
  }

  tierFilter.addEventListener("change", applyFilter);

  render(avatars);
});