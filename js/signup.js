document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "signup";

  const form = document.getElementById("signupForm");
  const emailEl = document.getElementById("signupEmail");
  const passEl = document.getElementById("signupPassword");
  const statusEl = document.getElementById("signupStatus");

  if (!form || !emailEl || !passEl || !statusEl) {
    console.error(`[${PAGE_ID}] missing elements`);
    return;
  }

  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    statusEl.textContent = "";

    const email = emailEl.value.trim();
    const password = passEl.value.trim();
    if (!email || !password) {
      statusEl.textContent = "please enter email and password";
      return;
    }

    // frontend only
    localStorage.setItem("statstox_user", JSON.stringify({ email, tier: "free" }));
    window.notifications?.add("account created (placeholder)");
    statusEl.textContent = "account created — redirecting…";

    setTimeout(() => (window.location.href = "index.html"), 800);
  });
});