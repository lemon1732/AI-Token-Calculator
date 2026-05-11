const Calculator = (() => {
  function calculate(model, inputTokens, outputTokens, cacheWriteTokens, cacheReadTokens) {
    const inputCost = (inputTokens / 1_000_000) * model.input;
    const outputCost = (outputTokens / 1_000_000) * model.output;
    const cacheWriteCost = (cacheWriteTokens / 1_000_000) * model.cacheWrite;
    const cacheReadCost = (cacheReadTokens / 1_000_000) * model.cacheRead;
    const total = inputCost + outputCost + cacheWriteCost + cacheReadCost;

    return {
      inputTokens,
      outputTokens,
      cacheWriteTokens,
      cacheReadTokens,
      inputCost,
      outputCost,
      cacheWriteCost,
      cacheReadCost,
      total,
      model,
    };
  }

  function formatUSD(value) {
    if (value === 0) return "$0.00";
    if (value < 0.005) return "<$0.01";
    return "$" + value.toFixed(2);
  }

  function formatTokens(n) {
    return n.toLocaleString("en-US");
  }

  return { calculate, formatUSD, formatTokens };
})();
