document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "animations";

  /* ===============================
     REQUIRED DOM ELEMENTS
     =============================== */
  const grid = document.getElementById("animationsGrid");
  const filter = document.getElementById("animationsCategory");
  const status = document.getElementById("animationsStatus");

  if (!grid || !filter || !status) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  /* ===============================
     GLOBAL SYSTEM HOOKS
     =============================== */
  window.notifications?.add("animations page loaded");

  window.performanceHeatUp?.update({
    page: PAGE_ID,
    action: "view"
  });

  /* ===============================
     ANIMATION DATA (PLACEHOLDERS)
     =============================== */
  const animations = [
    {
      id: "a1",
      title: "what is a signal?",
      category: "education",
      description: "learn how bullish and bearish signals work",
      thumbnail: "images/animation-placeholder.png"
    },
    {
      id: "a2",
      title: "how projections move",
      category: "education",
      description: "why projections change over time",
      thumbnail: "images/animation-placeholder.png"
    },
    {
      id: "a3",
      title: "market momentum explained",
      category: "market",
      description: "understanding momentum without gambling",
      thumbnail: "images/animation-placeholder.png"
    },
    {
      id: "a4",
      title: "statstox brand story",
      category: "brand",
      description: "why statstox exists",
      thumbnail: "images/animation-placeholder.png"
    }
  ];

  /* ===============================
     RENDER
     =============================== */
  function render(list) {
    grid.innerHTML = "";

    if (!list.length) {
      status.textContent = "no animations found";
      return;
    }

    status.textContent = `${list.length} animations`;

    list.forEach(anim => {
      const card = document.createElement("article");
      card.className = "animation-card";
      card.dataset.animationId = anim.id;

      card.innerHTML = `
        <img src="${anim.thumbnail}" alt="animation thumbnail" />
        <h3>${anim.title}</h3>
        <p>${anim.description}</p>
        <button class="secondary-btn">play (frontend)</button>
      `;

      card.querySelector("button").addEventListener("click", () => {
        window.notifications?.add(`animation played: ${anim.title}`);
        window.performanceHeatUp?.update({
          page: PAGE_ID,
          action: "play",
          animation: anim.id
        });
      });

      grid.appendChild(card);
    });
  }

  /* ===============================
     FILTER
     =============================== */
  function applyFilter() {
    const value = filter.value;
    const filtered =
      value === "ALL"
        ? animations
        : animations.filter(a => a.category === value);

    window.performanceHeatUp?.update({
      page: PAGE_ID,
      action: "filter",
      category: value
    });

    render(filtered);
  }

  filter.addEventListener("change", applyFilter);

  render(animations);
});