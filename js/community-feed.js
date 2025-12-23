// community.js
// Purpose: Community interactions only (safe frontend logic)

document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     COMMUNITY POST EXPAND
  =============================== */
  document.querySelectorAll(".community-card").forEach(card => {
    card.addEventListener("click", () => {
      card.classList.toggle("expanded");
    });
  });

  /* ===============================
     LIKE / REACT BUTTONS
  =============================== */
  document.querySelectorAll("[data-like]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      const countEl = btn.querySelector(".like-count");
      let count = parseInt(countEl.textContent, 10) || 0;

      if (btn.classList.contains("liked")) {
        count--;
        btn.classList.remove("liked");
      } else {
        count++;
        btn.classList.add("liked");
      }

      countEl.textContent = count;
    });
  });

  /* ===============================
     FILTER TABS (OPTIONAL)
  =============================== */
  document.querySelectorAll("[data-community-tab]").forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.communityTab;

      document.querySelectorAll(".community-section").forEach(sec => {
        sec.classList.toggle("hidden", sec.id !== target);
      });

      document.querySelectorAll("[data-community-tab]").forEach(t =>
        t.classList.remove("active")
      );

      tab.classList.add("active");
    });
  });

});