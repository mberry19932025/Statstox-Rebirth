document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "auth";

  /* ===============================
     REQUIRED DOM ELEMENTS
     =============================== */
  const loginBtn = document.getElementById("authLoginBtn");
  const signupBtn = document.getElementById("authSignupBtn");
  const statusText = document.getElementById("authStatus");

  if (!loginBtn || !signupBtn || !statusText) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  /* ===============================
     GLOBAL SYSTEM HOOKS
     =============================== */
  window.notifications?.add("auth page loaded");

  window.performanceHeatUp?.update({
    page: PAGE_ID,
    action: "view"
  });

  /* ===============================
     ACTIONS (FRONTEND PLACEHOLDERS)
     =============================== */
  loginBtn.addEventListener("click", () => {
    statusText.textContent = "redirecting to login…";

    window.notifications?.add("login selected");

    window.performanceHeatUp?.update({
      page: PAGE_ID,
      action: "login-click"
    });

    // backend route later
    window.location.href = "login.html";
  });

  signupBtn.addEventListener("click", () => {
    statusText.textContent = "redirecting to sign up…";

    window.notifications?.add("signup selected");

    window.performanceHeatUp?.update({
      page: PAGE_ID,
      action: "signup-click"
    });

    // backend route later
    window.location.href = "signup.html";
  });
});