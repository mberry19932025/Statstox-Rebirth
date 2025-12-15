// nav.js
// Global navigation logic

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.getAttribute("data-page");
  const links = document.querySelectorAll(".nav-link");

  links.forEach(link => {
    if (link.dataset.page === page) {
      link.classList.add("active");
    }
  });
});