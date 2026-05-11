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
      val("cache-write"),
      val("cache-read")
    );

    document.getElementById("res-input-tokens").textContent = Calculator.formatTokens(result.inputTokens);
    document.getElementById("res-input-cost").textContent = Calculator.formatUSD(result.inputCost);

    document.getElementById("res-output-tokens").textContent = Calculator.formatTokens(result.outputTokens);
    document.getElementById("res-output-cost").textContent = Calculator.formatUSD(result.outputCost);

    document.getElementById("res-cw-tokens").textContent = Calculator.formatTokens(result.cacheWriteTokens);
    document.getElementById("res-cw-cost").textContent = Calculator.formatUSD(result.cacheWriteCost);

    document.getElementById("res-cr-tokens").textContent = Calculator.formatTokens(result.cacheReadTokens);
    document.getElementById("res-cr-cost").textContent = Calculator.formatUSD(result.cacheReadCost);

    document.getElementById("res-total").textContent = Calculator.formatUSD(result.total);

    document.getElementById("price-input").textContent = `$${selectedModel.input}/1M`;
    document.getElementById("price-output").textContent = `$${selectedModel.output}/1M`;
    document.getElementById("price-cw").textContent = selectedModel.cacheWrite > 0 ? `$${selectedModel.cacheWrite}/1M` : "N/A";
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
    } else {
      calcPanel.hidden = true;
      tcPanel.hidden = false;
      // Lazy load tiktoken on first switch
      TokenCounter.loadTokenizer();
    }
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
    ["input-tokens", "output-tokens", "cache-write", "cache-read"].forEach((id) => {
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
      bindEvents();
      updateResult();
      document.body.classList.add("ready");
    });
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", App.init);
