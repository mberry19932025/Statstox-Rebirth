document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "community";

  /* ===============================
     REQUIRED DOM ELEMENTS
     =============================== */
  const grid = document.getElementById("communityGrid");
  const status = document.getElementById("communityStatus");

  if (!grid || !status) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  /* ===============================
     GLOBAL SYSTEM HOOKS
     =============================== */
  window.notifications?.add("community page loaded");

  window.performanceHeatUp?.update({
    page: PAGE_ID,
    action: "view"
  });

  /* ===============================
     COMMUNITY ROOMS (PLACEHOLDERS)
     - Coin access only
     - Tier logic later
     =============================== */
  const rooms = [
    {
      id: "r1",
      name: "general lounge",
      description: "open community discussion",
      coinCost: 0
    },
    {
      id: "r2",
      name: "signals lounge",
      description: "talk trends, signals, and projections",
      coinCost: 25
    },
    {
      id: "r3",
      name: "market minds",
      description: "advanced market concepts & education",
      coinCost: 50
    }
  ];

  /* ===============================
     RENDER
     =============================== */
  function render() {
    grid.innerHTML = "";
    status.textContent = `${rooms.length} rooms available`;

    rooms.forEach(room => {
      const card = document.createElement("article");
      card.className = "community-card";
      card.dataset.roomId = room.id;

      card.innerHTML = `
        <h3>${room.name}</h3>
        <p>${room.description}</p>
        <p><strong>entry:</strong> ${room.coinCost} 🪙</p>
        <button>
          ${room.coinCost === 0 ? "enter" : "unlock"}
        </button>
      `;

      card.querySelector("button").addEventListener("click", () => {
        window.notifications?.add(`community room selected: ${room.name}`);

        window.performanceHeatUp?.update({
          page: PAGE_ID,
          action: "room-click",
          room: room.id
        });
      });

      grid.appendChild(card);
    });
  }

  render();
});