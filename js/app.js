const App = (() => {
  let selectedModel = null;

  function formatNumberWithCommas(str) {
    const num = str.replace(/[^0-9]/g, "");
    if (!num) return "";
    return Number(num).toLocaleString("en-US");
  }

  function stripCommas(str) {
    return str.replace(/[^0-9]/g, "");
  }

  function buildModelSelect() {
    const select = document.getElementById("model-select");
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
    if (selectedModel) select.value = selectedModel.id;
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

  function bindEvents() {
    document.getElementById("model-select").addEventListener("change", (e) => {
      selectedModel = MODELS.find((m) => m.id === e.target.value);
      updateResult();
    });

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

    document.getElementById("lang-toggle").addEventListener("click", () => {
      I18n.toggle().then(() => {
        buildModelSelect();
        updateResult();
      });
    });
  }

  function init() {
    selectedModel = MODELS.find((m) => m.id === "claude-sonnet-4.6");
    I18n.init().then(() => {
      buildModelSelect();
      bindEvents();
      updateResult();
      document.body.classList.add("ready");
    });
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", App.init);
