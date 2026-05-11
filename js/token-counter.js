const TokenCounter = (() => {
  let encoder = null;
  let loading = false;
  let loaded = false;
  let failed = false;

  const OPENAI_IDS = new Set([
    "gpt-5.5", "gpt-5.5-pro",
    "gpt-5.4", "gpt-5.4-mini", "gpt-5.4-nano", "gpt-5.4-pro",
  ]);

  function withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms)),
    ]);
  }

  async function loadTokenizer() {
    if (loaded || loading || failed) return;
    loading = true;

    try {
      const { getEncoding } = await withTimeout(
        import("https://cdn.jsdelivr.net/npm/js-tiktoken@1.0.21/+esm"),
        15000
      );
      encoder = getEncoding("o200k_base");
      loaded = true;
    } catch (e) {
      console.error("Failed to load tokenizer:", e);
      failed = true;
    } finally {
      loading = false;
    }
  }

  function countTokens(text, modelId) {
    if (!text) return { tokens: 0, chars: 0, isEstimate: false };

    const chars = text.length;
    if (!encoder) {
      return { tokens: Math.ceil(chars / 4), chars, isEstimate: true };
    }

    try {
      const encoded = encoder.encode(text);
      const isOpenAi = OPENAI_IDS.has(modelId);
      return {
        tokens: encoded.length,
        chars,
        isEstimate: !isOpenAi,
      };
    } catch (e) {
      return { tokens: Math.ceil(chars / 4), chars, isEstimate: true };
    }
  }

  return { loadTokenizer, countTokens };
})();
