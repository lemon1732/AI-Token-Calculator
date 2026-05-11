const Calculator = (() => {
  function calculate(model, inputTokens, outputTokens, cacheReadTokens) {
    const inputCost = (inputTokens / 1_000_000) * model.input;
    const outputCost = (outputTokens / 1_000_000) * model.output;
    const cacheReadCost = (cacheReadTokens / 1_000_000) * model.cacheRead;
    const total = inputCost + outputCost + cacheReadCost;

    return {
      inputTokens,
      outputTokens,
      cacheReadTokens,
      inputCost,
      outputCost,
      cacheReadCost,
      total,
      model,
    };
  }

  function formatUSD(value) {
    if (value <= 0) return "$0.00";
    if (value < 0.005) return "<$0.01";
    return "$" + value.toFixed(2);
  }

  function formatTokens(n) {
    return n.toLocaleString("en-US");
  }

  return { calculate, formatUSD, formatTokens };
})();
