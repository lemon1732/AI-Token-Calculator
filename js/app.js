const App = (() => {
  let selectedModel = null;
  let tcModel = null;
  let activeTab = "calculator";
  let debounceTimer = null;

  function formatNumberWithCommas(str) {
    const num = str.replace(/[^0-9]/g, "");
    if (!num) return "";
    return Number(num).toLocaleString("en-US");
  }

  function stripCommas(str) {
    return str.replace(/[^0-9]/g, "");
  }

  function buildModelSelect(selectId, selected) {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = "";
    VENDORS.forEach((vendor) => {
      const group = document.createElement("optgroup");
      group.label = I18n.t(`vendor_${vendor}`);
      MODELS.filter((m) => m.vendor === vendor).forEach((m) => {
        const opt = document.createElement("option");
        opt.value = m.id;
        opt.textContent = m.name;
        group.appendChild(opt);
      });
      select.appendChild(group);
    });
    if (selected) select.value = selected.id;
  }

  function val(id) {
    return parseInt(stripCommas(document.getElementById(id).value)) || 0;
  }

  function updateResult() {
    const result = Calculator.calculate(
      selectedModel,
      val("input-tokens"),
      val("output-tokens"),
      val("cache-read")
    );

    document.getElementById("res-input-tokens").textContent = Calculator.formatTokens(result.inputTokens);
    document.getElementById("res-input-cost").textContent = Calculator.formatUSD(result.inputCost);

    document.getElementById("res-output-tokens").textContent = Calculator.formatTokens(result.outputTokens);
    document.getElementById("res-output-cost").textContent = Calculator.formatUSD(result.outputCost);

    document.getElementById("res-cr-tokens").textContent = Calculator.formatTokens(result.cacheReadTokens);
    document.getElementById("res-cr-cost").textContent = Calculator.formatUSD(result.cacheReadCost);

    document.getElementById("res-total").textContent = Calculator.formatUSD(result.total);

    document.getElementById("price-input").textContent = `$${selectedModel.input}/1M`;
    document.getElementById("price-output").textContent = `$${selectedModel.output}/1M`;
    document.getElementById("price-cr").textContent = selectedModel.cacheRead > 0 ? `$${selectedModel.cacheRead}/1M` : "N/A";
  }

  function updateTokenCount() {
    const text = document.getElementById("tc-input").value;
    const modelId = tcModel ? tcModel.id : "";
    const result = TokenCounter.countTokens(text, modelId);

    const tokenEl = document.getElementById("tc-token-count");
    const charEl = document.getElementById("tc-char-count");
    const noteEl = document.querySelector(".tc-note");

    tokenEl.textContent = result.tokens.toLocaleString("en-US");
    charEl.textContent = result.chars.toLocaleString("en-US");

    if (noteEl) noteEl.hidden = !result.isEstimate;
  }

  function switchTab(tabName) {
    if (activeTab === tabName) return;
    activeTab = tabName;

    document.querySelectorAll(".tab").forEach((btn) => {
      const isActive = btn.dataset.tab === tabName;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", isActive);
    });

    const calcPanel = document.getElementById("calculator-panel");
    const tcPanel = document.getElementById("token-counter-panel");

    if (tabName === "calculator") {
      calcPanel.hidden = false;
      tcPanel.hidden = true;
      I18n.renderFaq("cost");
    } else {
      calcPanel.hidden = true;
      tcPanel.hidden = false;
      I18n.renderFaq("token");
      TokenCounter.loadTokenizer();
    }
  }

  function formatPrice(val) {
    if (val <= 0) return null;
    if (val < 0.01) return val.toFixed(4);
    if (val < 1) return val.toFixed(2);
    return val.toFixed(2);
  }

  function renderPricingTable() {
    const tbody = document.getElementById("pricing-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const vendorNames = {
      openai: I18n.t("vendor_openai"),
      anthropic: I18n.t("vendor_anthropic"),
      google: I18n.t("vendor_google"),
      deepseek: I18n.t("vendor_deepseek"),
    };

    VENDORS.forEach((vendor) => {
      const headerRow = document.createElement("tr");
      headerRow.className = "vendor-row";
      headerRow.innerHTML = `<td colspan="4">${vendorNames[vendor]}</td>`;
      tbody.appendChild(headerRow);

      MODELS.filter((m) => m.vendor === vendor).forEach((m) => {
        const tr = document.createElement("tr");
        const inputP = formatPrice(m.input);
        const outputP = formatPrice(m.output);
        const crP = formatPrice(m.cacheRead);
        tr.innerHTML = `
          <td class="model-name">${m.name}</td>
          <td class="num">$${inputP}</td>
          <td class="num">$${outputP}</td>
          <td class="num">${crP ? "$" + crP : '<span class="na">N/A</span>'}</td>
        `;
        tbody.appendChild(tr);
      });
    });
  }

  function bindEvents() {
    // Tab switching
    document.querySelectorAll(".tab").forEach((btn) => {
      btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });

    // Calculator model select
    document.getElementById("model-select").addEventListener("change", (e) => {
      selectedModel = MODELS.find((m) => m.id === e.target.value);
      updateResult();
    });

    // Calculator inputs
    ["input-tokens", "output-tokens", "cache-read"].forEach((id) => {
      const el = document.getElementById(id);
      el.addEventListener("input", (e) => {
        const raw = e.target.value;
        const cleaned = stripCommas(raw);
        const formatted = formatNumberWithCommas(cleaned);
        if (raw !== formatted) {
          const start = e.target.selectionStart;
          const prevLen = raw.length;
          e.target.value = formatted;
          const newLen = formatted.length;
          const newPos = start + (newLen - prevLen);
          e.target.setSelectionRange(newPos, newPos);
        }
        updateResult();
      });
    });

    // Token counter model select
    document.getElementById("tc-model-select").addEventListener("change", (e) => {
      tcModel = MODELS.find((m) => m.id === e.target.value);
      updateTokenCount();
    });

    // Token counter textarea with debounce
    document.getElementById("tc-input").addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(updateTokenCount, 150);
    });

    // Language toggle
    document.getElementById("lang-toggle").addEventListener("click", () => {
      I18n.toggle().then(() => {
        buildModelSelect("model-select", selectedModel);
        buildModelSelect("tc-model-select", tcModel);
        renderPricingTable();
        updateResult();
        updateTokenCount();
      });
    });
  }

  function init() {
    selectedModel = MODELS.find((m) => m.id === "claude-sonnet-4.6");
    tcModel = MODELS.find((m) => m.id === "gpt-5.5");
    I18n.init().then(() => {
      buildModelSelect("model-select", selectedModel);
      buildModelSelect("tc-model-select", tcModel);
      renderPricingTable();
      bindEvents();
      updateResult();
      document.body.classList.add("ready");
    });
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", App.init);
