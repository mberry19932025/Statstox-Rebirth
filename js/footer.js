document.addEventListener("DOMContentLoaded", () => {
  /* ===============================
     FOOTER: YEAR
     =============================== */
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ===============================
     FOOTER: SOCIAL MENU TOGGLE
     =============================== */
  const socialToggle = document.getElementById("socialToggle");
  const socialMenu = document.getElementById("socialMenu");

  if (socialToggle && socialMenu) {
    socialToggle.addEventListener("click", () => {
      socialMenu.classList.toggle("hidden");
    });

    // Close when clicking outside
    document.addEventListener("click", e => {
      if (
        !socialToggle.contains(e.target) &&
        !socialMenu.contains(e.target)
      ) {
        socialMenu.classList.add("hidden");
      }
    });
  }
});