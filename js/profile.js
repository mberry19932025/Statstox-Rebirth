document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "profile";

  const nameEl = document.getElementById("profileName");
  const tierEl = document.getElementById("profileTier");
  const perksEl = document.getElementById("profilePerks");

  if (!nameEl || !tierEl || !perksEl) {
    console.error(`[${PAGE_ID}] missing elements`);
    return;
  }

  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  const user =
    JSON.parse(localStorage.getItem("statstox_user")) || {
      email: "guest",
      tier: "free"
    };

  const perksByTier = {
    free: ["basic signals", "limited market feed"],
    starter: ["momentum signals", "market feed access"],
    pro: ["advanced analytics", "leaderboards", "market insights"],
    elite: ["all features", "priority alerts", "vip access"]
  };

  nameEl.textContent = user.email;
  tierEl.textContent = user.tier;
  perksEl.innerHTML = "";

  perksByTier[user.tier].forEach(p => {
    const li = document.createElement("li");
    li.textContent = p;
    perksEl.appendChild(li);
  });

  const upgradeBtn = document.getElementById("upgradeBtn");
  if (upgradeBtn && user.tier !== "elite") {
    upgradeBtn.addEventListener("click", () => {
      window.notifications?.add("upgrade flow coming soon");
    });
  }
});