document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "badges";

  /* ===============================
     REQUIRED DOM ELEMENTS
     =============================== */
  const grid = document.getElementById("badgesGrid");
  const status = document.getElementById("badgesStatus");

  if (!grid || !status) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  /* ===============================
     GLOBAL SYSTEM HOOKS
     =============================== */
  window.notifications?.add("badges page loaded");

  window.performanceHeatUp?.update({
    page: PAGE_ID,
    action: "view"
  });

  /* ===============================
     BADGE DATA (PLACEHOLDERS)
     =============================== */
  const badges = [
    {
      id: "b1",
      name: "rookie signal",
      stars: 1,
      coinsEarned: 10,
      description: "tracked your first signal"
    },
    {
      id: "b2",
      name: "signal streak",
      stars: 2,
      coinsEarned: 25,
      description: "tracked signals for 7 days straight"
    },
    {
      id: "b3",
      name: "market watcher",
      stars: 3,
      coinsEarned: 50,
      description: "followed market movement consistently"
    },
    {
      id: "b4",
      name: "projection analyst",
      stars: 4,
      coinsEarned: 75,
      description: "high projection accuracy over time"
    },
    {
      id: "b5",
      name: "statstox elite",
      stars: 5,
      coinsEarned: 150,
      description: "top-tier platform engagement"
    }
  ];

  /* ===============================
     RENDER
     =============================== */
  function render() {
    grid.innerHTML = "";
    status.textContent = `${badges.length} badges available`;

    badges.forEach(badge => {
      const card = document.createElement("article");
      card.className = "badge-card";
      card.dataset.badgeId = badge.id;

      card.innerHTML = `
        <img
          src="images/badge-placeholder.png"
          alt="badge placeholder"
          class="badge-image"
        />
        <h3>${badge.name}</h3>
        <p>${badge.description}</p>
        <p>⭐ stars: ${badge.stars}</p>
        <p>🪙 coins earned: ${badge.coinsEarned}</p>
      `;

      grid.appendChild(card);
    });
  }

  render();
});