const TokenCounter = (() => {
  let encoder = null;
  let loading = false;
  let loaded = false;

  // Model to tiktoken encoding mapping
  const ENCODING_MAP = {
    "gpt-5.5": "o200k_base",
    "gpt-5.5-pro": "o200k_base",
    "gpt-5.4": "o200k_base",
    "gpt-5.4-mini": "o200k_base",
    "gpt-5.4-nano": "o200k_base",
    "gpt-5.4-pro": "o200k_base",
  };

  const OPENAI_IDS = new Set(Object.keys(ENCODING_MAP));

  async function loadTokenizer() {
    if (loaded || loading) return;
    loading = true;
    const loadingEl = document.getElementById("tc-loading");
    if (loadingEl) loadingEl.hidden = false;

    try {
      // Load tiktoken from CDN (ES module)
      const tiktokenModule = await import(
        "https://cdn.jsdelivr.net/npm/tiktoken@1.0.20/+esm"
      );
      // Get the encoder for o200k_base (used by all current OpenAI models)
      encoder = tiktokenModule.encoding_for_model("gpt-4o");
      loaded = true;
    } catch (e) {
      console.error("Failed to load tiktoken:", e);
    } finally {
      loading = false;
      if (loadingEl) loadingEl.hidden = true;
    }
  }

  function isOpenAI(modelId) {
    return OPENAI_IDS.has(modelId);
  }

  function countTokens(text, modelId) {
    if (!text) return { tokens: 0, chars: 0, isEstimate: false };

    const chars = text.length;
    if (!encoder) {
      // Fallback estimation if tiktoken not loaded
      return { tokens: Math.ceil(chars / 4), chars, isEstimate: true };
    }

    try {
      const encoded = encoder.encode(text);
      const isOpenAi = isOpenAI(modelId);
      return {
        tokens: encoded.length,
        chars,
        isEstimate: !isOpenAi,
      };
    } catch (e) {
      return { tokens: Math.ceil(chars / 4), chars, isEstimate: true };
    }
  }

  return { loadTokenizer, countTokens, isOpenAI };
})();
