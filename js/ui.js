/*
  UI HELPERS (STATSTOX)
  --------------------
  Shared UI behavior only.
*/

document.addEventListener("DOMContentLoaded", () => {
  // NAV DROPDOWNS
  document.querySelectorAll(".nav-dropbtn").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.parentElement.classList.toggle("open");
    });
  });

  // SOCIAL MENU
  const socialToggle = document.getElementById("socialToggle");
  const socialMenu = document.getElementById("socialMenu");

  if (socialToggle && socialMenu) {
    socialToggle.addEventListener("click", () => {
      socialMenu.classList.toggle("open");
    });
  }

  // DISABLED BUTTON FEEDBACK
  document.querySelectorAll("button:disabled").forEach(btn => {
    btn.addEventListener("click", e => e.preventDefault());
  });
});