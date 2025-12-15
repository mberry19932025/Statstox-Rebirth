document.addEventListener("DOMContentLoaded", () => {
  const PAGE_ID = "deposit-withdrawal";

  /* ===============================
     REQUIRED DOM ELEMENTS
     =============================== */
  const tabDeposit = document.getElementById("dwTabDeposit");
  const tabWithdraw = document.getElementById("dwTabWithdraw");

  const panelDeposit = document.getElementById("dwPanelDeposit");
  const panelWithdraw = document.getElementById("dwPanelWithdraw");

  const statusEl = document.getElementById("dwStatus");

  const depositForm = document.getElementById("dwDepositForm");
  const withdrawForm = document.getElementById("dwWithdrawForm");

  const depositMethod = document.getElementById("dwDepositMethod");
  const withdrawMethod = document.getElementById("dwWithdrawMethod");

  const depositMethodFields = document.getElementById("dwDepositMethodFields");
  const withdrawMethodFields = document.getElementById("dwWithdrawMethodFields");

  const balanceUsdEl = document.getElementById("dwBalanceUsd");
  const balanceCoinsEl = document.getElementById("dwBalanceCoins");

  if (
    !tabDeposit || !tabWithdraw ||
    !panelDeposit || !panelWithdraw ||
    !statusEl ||
    !depositForm || !withdrawForm ||
    !depositMethod || !withdrawMethod ||
    !depositMethodFields || !withdrawMethodFields ||
    !balanceUsdEl || !balanceCoinsEl
  ) {
    console.error(`[${PAGE_ID}] missing required DOM elements`);
    return;
  }

  /* ===============================
     GLOBAL SYSTEM HOOKS
     =============================== */
  window.notifications?.add("deposit/withdrawal loaded");
  window.performanceHeatUp?.update({ page: PAGE_ID, action: "view" });

  /* ===============================
     PLACEHOLDER BALANCES (FRONTEND ONLY)
     - Backend will provide real balances later
     =============================== */
  const wallet = {
    usd: 0.0,
    coins: 0
  };

  function money(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  function renderBalances() {
    balanceUsdEl.textContent = money(wallet.usd);
    balanceCoinsEl.textContent = `${wallet.coins}`;
  }

  /* ===============================
     TABS
     =============================== */
  function setActiveTab(which) {
    const depositActive = which === "deposit";

    tabDeposit.classList.toggle("active", depositActive);
    tabWithdraw.classList.toggle("active", !depositActive);

    panelDeposit.classList.toggle("hidden", !depositActive);
    panelWithdraw.classList.toggle("hidden", depositActive);

    statusEl.textContent = depositActive
      ? "deposit funds to enter contests"
      : "withdraw available funds (verification required)";

    window.performanceHeatUp?.update({
      page: PAGE_ID,
      action: "tab",
      tab: which
    });
  }

  tabDeposit.addEventListener("click", () => setActiveTab("deposit"));
  tabWithdraw.addEventListener("click", () => setActiveTab("withdraw"));

  /* ===============================
     METHOD FIELD TEMPLATES
     =============================== */
  function depositFieldsTemplate(method) {
    // NOTE: No real payment handling here. Backend will integrate PCI/KYC/AML.
    switch (method) {
      case "card":
        return `
          <label>amount (usd)
            <input id="dwDepositAmount" type="number" min="1" step="0.01" required />
          </label>
          <label>cardholder name
            <input type="text" id="dwCardName" placeholder="name on card" required />
          </label>
          <label>card number (placeholder)
            <input type="text" id="dwCardNumber" placeholder="•••• •••• •••• ••••" required />
          </label>
          <div class="dw-inline">
            <label>exp
              <input type="text" id="dwCardExp" placeholder="MM/YY" required />
            </label>
            <label>cvv
              <input type="text" id="dwCardCvv" placeholder="•••" required />
            </label>
          </div>
        `;
      case "ach":
        return `
          <label>amount (usd)
            <input id="dwDepositAmount" type="number" min="1" step="0.01" required />
          </label>
          <label>bank routing (placeholder)
            <input type="text" id="dwAchRouting" placeholder="routing number" required />
          </label>
          <label>bank account (placeholder)
            <input type="text" id="dwAchAccount" placeholder="account number" required />
          </label>
        `;
      case "paypal":
      case "applepay":
      case "googlepay":
        return `
          <label>amount (usd)
            <input id="dwDepositAmount" type="number" min="1" step="0.01" required />
          </label>
          <p class="small">
            checkout for ${method} will be handled on backend (secure provider flow).
          </p>
        `;
      case "btc":
      case "eth":
        return `
          <label>amount (usd)
            <input id="dwDepositAmount" type="number" min="1" step="0.01" required />
          </label>
          <p class="small">
            <strong>${method.toUpperCase()} deposits:</strong> coming soon / beta. backend will provide a wallet address + confirmations.
          </p>
          <p class="small">
            note: crypto support requires compliance checks (KYC/AML) and chain confirmation logic.
          </p>
        `;
      default:
        return `<p class="small">select a deposit method</p>`;
    }
  }

  function withdrawFieldsTemplate(method) {
    switch (method) {
      case "ach":
        return `
          <label>amount (usd)
            <input id="dwWithdrawAmount" type="number" min="1" step="0.01" required />
          </label>
          <label>bank routing (placeholder)
            <input type="text" id="dwWAchRouting" placeholder="routing number" required />
          </label>
          <label>bank account (placeholder)
            <input type="text" id="dwWAchAccount" placeholder="account number" required />
          </label>
        `;
      case "paypal":
        return `
          <label>amount (usd)
            <input id="dwWithdrawAmount" type="number" min="1" step="0.01" required />
          </label>
          <label>paypal email
            <input type="email" id="dwPaypalEmail" placeholder="you@example.com" required />
          </label>
        `;
      case "btc":
      case "eth":
        return `
          <label>amount (usd)
            <input id="dwWithdrawAmount" type="number" min="1" step="0.01" required />
          </label>
          <label>${method.toUpperCase()} wallet address (placeholder)
            <input type="text" id="dwCryptoAddress" placeholder="wallet address" required />
          </label>
          <p class="small">
            crypto withdrawals: coming soon / beta. backend will validate address + approvals.
          </p>
        `;
      default:
        return `<p class="small">select a withdrawal method</p>`;
    }
  }

  function renderDepositFields() {
    depositMethodFields.innerHTML = depositFieldsTemplate(depositMethod.value);
  }

  function renderWithdrawFields() {
    withdrawMethodFields.innerHTML = withdrawFieldsTemplate(withdrawMethod.value);
  }

  depositMethod.addEventListener("change", () => {
    renderDepositFields();
    window.performanceHeatUp?.update({ page: PAGE_ID, action: "deposit-method", method: depositMethod.value });
  });

  withdrawMethod.addEventListener("change", () => {
    renderWithdrawFields();
    window.performanceHeatUp?.update({ page: PAGE_ID, action: "withdraw-method", method: withdrawMethod.value });
  });

  /* ===============================
     SUBMIT HANDLERS (FRONTEND PLACEHOLDERS)
     =============================== */
  depositForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const amtInput = document.getElementById("dwDepositAmount");
    const amount = amtInput ? Number(amtInput.value) : 0;

    if (!amount || amount <= 0) {
      window.notifications?.add("enter a valid deposit amount");
      return;
    }

    // Placeholder “success”
    wallet.usd += amount;
    renderBalances();

    window.notifications?.add(`deposit requested: ${money(amount)} via ${depositMethod.value} (placeholder)`);
    window.performanceHeatUp?.update({
      page: PAGE_ID,
      action: "deposit-submit",
      method: depositMethod.value,
      amount
    });

    depositForm.reset();
    renderDepositFields();
  });

  withdrawForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const amtInput = document.getElementById("dwWithdrawAmount");
    const amount = amtInput ? Number(amtInput.value) : 0;

    if (!amount || amount <= 0) {
      window.notifications?.add("enter a valid withdrawal amount");
      return;
    }

    if (amount > wallet.usd) {
      window.notifications?.add("insufficient balance (placeholder check)");
      return;
    }

    // Placeholder “success”
    wallet.usd -= amount;
    renderBalances();

    window.notifications?.add(`withdrawal requested: ${money(amount)} via ${withdrawMethod.value} (placeholder)`);
    window.performanceHeatUp?.update({
      page: PAGE_ID,
      action: "withdraw-submit",
      method: withdrawMethod.value,
      amount
    });

    withdrawForm.reset();
    renderWithdrawFields();
  });

  /* ===============================
     INIT
     =============================== */
  renderBalances();
  renderDepositFields();
  renderWithdrawFields();
  setActiveTab("deposit");
});