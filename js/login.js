document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "login";

  const form = document.getElementById("loginForm");
  const emailEl = document.getElementById("loginEmail");
  const passwordEl = document.getElementById("loginPassword");
  const statusEl = document.getElementById("loginStatus");

  if (!form || !emailEl || !passwordEl || !statusEl) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  window.performanceHeatUp?.update({
    page: PAGE_ID,
    action: "view"
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    statusEl.textContent = "";

    const email = emailEl.value.trim();
    const password = passwordEl.value.trim();

    if (!email || !password) {
      statusEl.textContent = "please enter email and password";
      return;
    }

    // FRONTEND ONLY — backend auth later
    window.notifications?.add("login submitted (placeholder)");

    // Temporary simulated login
    const simulatedTier = "free"; // backend will override later

    window.localStorage.setItem("statstox_user", JSON.stringify({
      email,
      tier: simulatedTier
    }));

    window.performanceHeatUp?.update({
      page: PAGE_ID,
      action: "login",
      tier: simulatedTier
    });

    statusEl.textContent = "login successful — redirecting…";

    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);
  });
});