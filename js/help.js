document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "help";

  /* ===============================
     REQUIRED DOM ELEMENTS
     =============================== */
  const faqList = document.getElementById("faqList");
  const helpSearch = document.getElementById("helpSearch");
  const helpStatus = document.getElementById("helpStatus");

  if (!faqList || !helpSearch || !helpStatus) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  /* ===============================
     GLOBAL SYSTEM HOOKS
     =============================== */
  window.notifications?.add("help loaded");
  window.performanceHeatUp?.update({
    page: PAGE_ID,
    action: "view"
  });

  const userTier = window.tierUtils?.getUserTier?.() || "free";

  /* ===============================
     FAQ DATA (PLACEHOLDER)
     =============================== */
  const faqs = [
    {
      id: "faq-1",
      question: "what is statstox?",
      answer:
        "statstox is a daily fantasy sports platform that uses stock-style signals, momentum, and projections instead of traditional lineups.",
      tier: "free"
    },
    {
      id: "faq-2",
      question: "how do stacked coins work?",
      answer:
        "stacked coins are rewards earned through activity and promos. they can unlock perks, discounts, or future entries.",
      tier: "free"
    },
    {
      id: "faq-3",
      question: "why are some signals locked?",
      answer:
        "advanced signals and heat indicators are reserved for higher tiers to maintain fair value and platform balance.",
      tier: "starter"
    },
    {
      id: "faq-4",
      question: "is statstox dfs compliant?",
      answer:
        "yes. statstox follows dfs contest rules with fair entry pricing, locked projections, and transparent payouts.",
      tier: "free"
    }
  ];

  function canAccess(requiredTier) {
    const tiers = ["free", "starter", "pro", "elite"];
    return tiers.indexOf(userTier) >= tiers.indexOf(requiredTier);
  }

  /* ===============================
     FILTER + SEARCH
     =============================== */
  function getFilteredFaqs() {
    const q = helpSearch.value.toLowerCase().trim();

    return faqs.filter(faq =>
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q)
    );
  }

  /* ===============================
     RENDER
     =============================== */
  function render() {
    const filtered = getFilteredFaqs();
    faqList.innerHTML = "";

    if (!filtered.length) {
      faqList.innerHTML = `<li class="small">no results found</li>`;
      helpStatus.textContent = "0 results";
      return;
    }

    filtered.forEach(faq => {
      const locked = !canAccess(faq.tier);

      const li = document.createElement("li");
      li.className = `faq-item ${locked ? "locked" : ""}`;

      li.innerHTML = `
        <button class="faq-question">
          ${faq.question}
          <span class="badge">${faq.tier}</span>
        </button>

        <div class="faq-answer ${locked ? "hidden" : ""}">
          <p class="small">${faq.answer}</p>
          ${
            locked
              ? `<button class="upgrade-btn">upgrade to unlock</button>`
              : ""
          }
        </div>
      `;

      li.querySelector(".faq-question").addEventListener("click", () => {
        if (locked) {
          window.notifications?.add("upgrade required to view this answer");
          return;
        }
        li.querySelector(".faq-answer").classList.toggle("hidden");
      });

      if (locked) {
        li.querySelector(".upgrade-btn").addEventListener("click", () => {
          window.notifications?.add("upgrade clicked");
          window.performanceHeatUp?.update({
            page: PAGE_ID,
            action: "upgrade-click",
            requiredTier: faq.tier
          });
        });
      }

      faqList.appendChild(li);
    });

    helpStatus.textContent = `${filtered.length} questions`;
  }

  helpSearch.addEventListener("input", render);
  render();
});