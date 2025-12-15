document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "promotions";

  const listEl = document.getElementById("promotionsList");
  const statusEl = document.getElementById("promotionsStatus");

  if (!listEl || !statusEl) {
    console.error(`[${PAGE_ID}] missing elements`);
    return;
  }

  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  const campaigns = [
    {
      id: "pm1",
      title: "market arena launch",
      description: "new market-style runs now live",
      type: "feature"
    },
    {
      id: "pm2",
      title: "momentum run weekend",
      description: "enhanced momentum contests all weekend",
      type: "event"
    },
    {
      id: "pm3",
      title: "elite tier expansion",
      description: "new analytics added to elite access",
      type: "upgrade"
    }
  ];

  function render() {
    listEl.innerHTML = "";

    campaigns.forEach(c => {
      const li = document.createElement("li");
      li.className = `promotion-item ${c.type}`;

      li.innerHTML = `
        <strong>${c.title}</strong>
        <p class="small">${c.description}</p>
        <span class="tag">${c.type}</span>
      `;

      listEl.appendChild(li);
    });

    statusEl.textContent = `${campaigns.length} active promotions`;
  }

  render();
});