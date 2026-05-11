const I18n = (() => {
  let currentLang = "en";
  let strings = {};

  const FAQ_DATA = [
    {
      cat: "cost",
      q: { en: "How much does GPT-5.5 cost per million tokens in 2026?", zh: "2026年 GPT-5.5 每百万 token 多少钱？" },
      a: { en: "GPT-5.5 costs $5.00 per million input tokens and $30.00 per million output tokens. Cache read tokens are $0.50/M. It is OpenAI's most capable model released in April 2026, roughly 2x the price of GPT-5.4.", zh: "GPT-5.5 输入 $5.00/百万 token，输出 $30.00/百万 token，缓存命中 $0.50/百万。它是 OpenAI 2026 年 4 月发布的最强模型，价格约为 GPT-5.4 的 2 倍。" }
    },
    {
      cat: "cost",
      q: { en: "Claude Sonnet 4.6 vs GPT-5.4 — which is cheaper?", zh: "Claude Sonnet 4.6 和 GPT-5.4 哪个更便宜？" },
      a: { en: "Claude Sonnet 4.6 costs $3.00/$15.00 per million input/output tokens. GPT-5.4 costs $2.50/$15.00. GPT-5.4 is slightly cheaper for input-heavy tasks, but Sonnet 4.6 has cheaper cache reads ($0.30 vs $0.25/M).", zh: "Claude Sonnet 4.6 输入/输出 $3.00/$15.00 每百万 token，GPT-5.4 为 $2.50/$15.00。输入密集任务 GPT-5.4 略便宜，但 Sonnet 4.6 缓存命中更便宜（$0.30 vs $0.25/百万）。" }
    },
    {
      cat: "cost",
      q: { en: "What is the cheapest AI API model in 2026?", zh: "2026年最便宜的 AI API 模型是哪个？" },
      a: { en: "DeepSeek V4 Flash is the cheapest at $0.14/M input and $0.28/M output. Other budget options include Gemini 2.5 Flash-Lite ($0.10/$0.40), GPT-5.4 Nano ($0.20/$1.25), and Claude Haiku 4.5 ($1.00/$5.00).", zh: "DeepSeek V4 Flash 最便宜，输入/输出 $0.14/$0.28 每百万 token。其他经济选择包括 Gemini 2.5 Flash-Lite（$0.10/$0.40）、GPT-5.4 Nano（$0.20/$1.25）和 Claude Haiku 4.5（$1.00/$5.00）。" }
    },
    {
      cat: "cost",
      q: { en: "How does AI API prompt caching pricing work?", zh: "AI API 缓存定价是怎么算的？" },
      a: { en: "Cache write tokens cost 1.25x base input (Anthropic), same as input (OpenAI/DeepSeek). Cache read tokens are much cheaper at 0.1x input price. For example, Claude Sonnet 4.6: input $3.00/M, cache write $3.75/M, cache read $0.30/M.", zh: "缓存写入 token 收费为基础输入的 1.25 倍（Anthropic），OpenAI/DeepSeek 等于原价。缓存命中便宜很多，为输入价的 0.1 倍。例如 Sonnet 4.6：输入 $3.00/百万，缓存写入 $3.75/百万，缓存命中 $0.30/百万。" }
    },
    {
      cat: "cost",
      q: { en: "Gemini 3.1 Pro vs Claude Opus 4.6 pricing", zh: "Gemini 3.1 Pro 和 Claude Opus 4.6 价格对比" },
      a: { en: "Gemini 3.1 Pro costs $2.00/$12.00 per million input/output tokens. Claude Opus 4.6 costs $5.00/$25.00. Gemini is 2.5x cheaper on input and 2x cheaper on output.", zh: "Gemini 3.1 Pro 输入/输出 $2.00/$12.00 每百万 token，Claude Opus 4.6 为 $5.00/$25.00。Gemini 输入便宜 2.5 倍，输出便宜 2 倍。" }
    },
    {
      cat: "cost",
      q: { en: "DeepSeek V4 API pricing — how much does it cost?", zh: "DeepSeek V4 API 定价是多少？" },
      a: { en: "DeepSeek V4 Flash costs $0.14/M input and $0.28/M output (cache read $0.0028/M). DeepSeek V4 Pro costs $1.74/M input and $3.48/M output.", zh: "DeepSeek V4 Flash 输入 $0.14/百万，输出 $0.28/百万（缓存命中 $0.0028/百万）。DeepSeek V4 Pro 输入 $1.74/百万，输出 $3.48/百万。" }
    },
    {
      cat: "cost",
      q: { en: "Which is the most expensive AI model in 2026?", zh: "2026年最贵的 AI 模型是哪个？" },
      a: { en: "Claude Opus 4.7/4.6 cost $5/$25 per million tokens. GPT-5.5 costs $5/$30. For Pro-tier reasoning models, GPT-5.5 Pro ($30/$180) and GPT-5.4 Pro ($21/$168) are the highest priced.", zh: "Claude Opus 4.7/4.6 为 $5/$25 每百万 token，GPT-5.5 为 $5/$30。Pro 级推理模型中，GPT-5.5 Pro（$30/$180）和 GPT-5.4 Pro（$21/$168）价格最高。" }
    },
    {
      cat: "token",
      q: { en: "How to count tokens in text for GPT-5?", zh: "怎么计算文字的 token 数量？" },
      a: { en: "Use our free online token counter — paste your text and get instant token counts powered by tiktoken. It uses the same tokenizer as OpenAI's API (o200k_base encoding), so the count matches exactly what GPT-5.5 and GPT-5.4 would charge you.", zh: "使用我们的免费在线 token 计数器，粘贴文字即可获得精确的 token 数量。它使用与 OpenAI API 相同的 tiktoken 分词器（o200k_base 编码），计数结果与 GPT-5.5、GPT-5.4 的实际收费完全一致。" }
    },
    {
      cat: "token",
      q: { en: "How many tokens is 1000 words?", zh: "1000 个单词有多少 token？" },
      a: { en: "1000 English words is roughly 1,300-1,500 tokens using OpenAI's o200k_base tokenizer. The exact count depends on word complexity — common words like 'the' are 1 token, while technical terms may be split into multiple tokens. Use our token counter for exact counts.", zh: "1000 个英文单词大约是 1300-1500 个 token（使用 OpenAI o200k_base 分词器）。具体数量取决于单词复杂度——常见词如 'the' 是 1 个 token，而专业术语可能被拆分成多个 token。使用我们的 token 计数器获取精确数值。" }
    },
    {
      cat: "token",
      q: { en: "How many tokens is one Chinese character?", zh: "一个中文字等于多少 token？" },
      a: { en: "One Chinese character is typically 2-3 tokens in OpenAI's tokenizer. A 500-character Chinese paragraph is about 1,000-1,500 tokens. This makes Chinese text significantly more expensive than English per character. Use our token counter to measure exact counts for your text.", zh: "一个中文字在 OpenAI 分词器中通常等于 2-3 个 token。500 字的中文段落大约是 1000-1500 个 token。这意味着按字符计算，中文比英文贵得多。使用我们的 token 计数器测量您的文字精确数量。" }
    },
    {
      cat: "token",
      q: { en: "Is there a free online token counter like tiktoken?", zh: "有免费的在线 token 计数器吗？" },
      a: { en: "Yes! This tool includes a built-in token counter powered by js-tiktoken, the same algorithm used by OpenAI's API. It runs entirely in your browser — no data is sent to any server. Paste your text and get instant, accurate token counts for GPT-5.5, GPT-5.4, and all OpenAI models.", zh: "有！本工具内置了基于 js-tiktoken 的 token 计数器，与 OpenAI API 使用相同算法。完全在浏览器端运行，不发送任何数据到服务器。粘贴文字即可获得 GPT-5.5、GPT-5.4 及所有 OpenAI 模型的精确 token 数量。" }
    },
    {
      cat: "token",
      q: { en: "Do Claude and GPT tokenize text the same way?", zh: "Claude 和 GPT 的分词方式一样吗？" },
      a: { en: "No. Each AI provider uses a different tokenizer. OpenAI uses tiktoken (o200k_base), Anthropic uses a proprietary tokenizer for Claude, and Google uses SentencePiece for Gemini. The same text can produce different token counts across providers. Our tool shows exact counts for OpenAI and estimates for others.", zh: "不一样。每个 AI 厂商使用不同的分词器。OpenAI 使用 tiktoken（o200k_base），Anthropic 的 Claude 使用自研分词器，Google 的 Gemini 使用 SentencePiece。同一段文字在不同厂商的 token 数量可能不同。我们的工具对 OpenAI 显示精确数量，其他显示估算值。" }
    },
    {
      cat: "token",
      q: { en: "How to reduce token usage and save money on AI APIs?", zh: "怎么减少 token 用量节省 AI API 费用？" },
      a: { en: "Key strategies: 1) Use prompt caching to save up to 90% on repeated inputs. 2) Shorten system prompts. 3) Use cheaper models like DeepSeek V4 Flash ($0.14/M) for simple tasks. 4) Count tokens before sending to avoid exceeding limits. Use our calculator to estimate costs and our token counter to measure input size.", zh: "主要策略：1）使用缓存命中可节省高达 90% 的重复输入费用。2）精简系统提示词。3）简单任务用便宜模型如 DeepSeek V4 Flash（$0.14/百万）。4）发送前计算 token 数避免超限。用我们的计算器估算费用，用 token 计数器测量输入大小。" }
    }
  ];

  const translations = {
    en: {
      title: "AI Token Cost Calculator",
      faqTitle: "FAQs",
      selectModel: "Select Model",
      inputTokens: "Input Tokens",
      outputTokens: "Output Tokens",
      cacheWrite: "Cache Write",
      cacheRead: "Cache Read",
      costBreakdown: "Cost Breakdown",
      inputCost: "Input",
      outputCost: "Output",
      cacheWriteCost: "Cache Write",
      cacheReadCost: "Cache Read",
      total: "Total",
      source: "Source: Official websites",
      updated: "Updated: May 2026",
      tokens: "tokens",
      vendor_openai: "OpenAI",
      vendor_anthropic: "Anthropic",
      vendor_google: "Google",
      vendor_deepseek: "DeepSeek",
      placeholder_tokens: "e.g. 1,000,000",
      tabCalculator: "Cost Calculator",
      tabTokenCounter: "Token Counter",
      inputText: "Input Text",
      tokenCount: "Token Count",
      charCount: "Character Count",
      placeholder_text: "Paste or type text...",
      approxNote: "* Non-OpenAI models are estimates",
      aboutText: 'This free AI Token Cost Calculator helps developers and teams compare API pricing across OpenAI GPT-5.5, GPT-5.4, Anthropic Claude Opus 4.6, Sonnet 4.6, Google Gemini 3.1 Pro, and DeepSeek V4 models. Calculate input tokens, output tokens, cache write, and cache read costs instantly. Includes a built-in token counter powered by tiktoken for accurate OpenAI token counting. All prices are updated monthly from official vendor websites.',
    },
    zh: {
      title: "AI Token 费用计算器",
      faqTitle: "常见问题",
      selectModel: "选择模型",
      inputTokens: "输入 Token",
      outputTokens: "输出 Token",
      cacheWrite: "缓存写入",
      cacheRead: "缓存命中",
      costBreakdown: "费用明细",
      inputCost: "输入",
      outputCost: "输出",
      cacheWriteCost: "缓存写入",
      cacheReadCost: "缓存命中",
      total: "合计",
      source: "数据来源：各厂商官网",
      updated: "最后更新：2026年5月",
      tokens: "tokens",
      vendor_openai: "OpenAI",
      vendor_anthropic: "Anthropic",
      vendor_google: "Google",
      vendor_deepseek: "DeepSeek",
      placeholder_tokens: "例如 1,000,000",
      tabCalculator: "费用计算器",
      tabTokenCounter: "Token 计数器",
      inputText: "输入文字",
      tokenCount: "Token 数",
      charCount: "字符数",
      placeholder_text: "粘贴或输入文字...",
      approxNote: "* 非 OpenAI 模型为估算值",
      aboutText: '这个免费的 AI Token 费用计算器帮助开发者和团队比较 OpenAI GPT-5.5、GPT-5.4、Anthropic Claude Opus 4.6、Sonnet 4.6、Google Gemini 3.1 Pro 和 DeepSeek V4 等模型的 API 价格。即时计算输入 token、输出 token、缓存写入和缓存读取费用。内置基于 tiktoken 的 token 计数器，可精确计算 OpenAI 模型的 token 数量。所有价格每月从各厂商官网更新。',
    },
  };

  function loadLang(lang) {
    strings = translations[lang] || translations.en;
    currentLang = lang;
    document.documentElement.lang = lang;
    localStorage.setItem("lang", lang);
    renderAll();
  }

  function detectLang() {
    const saved = localStorage.getItem("lang");
    if (saved && (saved === "zh" || saved === "en")) return saved;
    return navigator.language.startsWith("zh") ? "zh" : "en";
  }

  function t(key) {
    return strings[key] || key;
  }

  let activeFaqCat = "cost";

  function renderAll() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
    });
    document.title = t("title");
    const btn = document.getElementById("lang-toggle");
    if (btn) btn.textContent = currentLang === "zh" ? "EN" : "中文";
    renderFaq(activeFaqCat);
    injectFaqJsonLd();
  }

  function renderFaq(cat) {
    if (cat) activeFaqCat = cat;
    const list = document.getElementById("faq-list");
    if (!list) return;
    list.innerHTML = "";
    const items = cat ? FAQ_DATA.filter((item) => item.cat === cat) : FAQ_DATA;
    items.forEach((item, i) => {
      const div = document.createElement("div");
      div.className = "faq-item";
      const answerId = `faq-answer-${i}`;
      div.innerHTML = `
        <button class="faq-question" aria-expanded="false" aria-controls="${answerId}">
          <span class="faq-number">${i + 1}.</span>
          <span class="faq-text">${item.q[currentLang]}</span>
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-answer" id="${answerId}">
          <p>${item.a[currentLang]}</p>
        </div>
      `;
      const btn = div.querySelector(".faq-question");
      const answer = div.querySelector(".faq-answer");
      const icon = div.querySelector(".faq-icon");
      btn.addEventListener("click", () => {
        const open = answer.classList.contains("open");
        answer.classList.toggle("open");
        btn.setAttribute("aria-expanded", !open);
        icon.textContent = open ? "+" : "−";
      });
      list.appendChild(div);
    });
  }

  function injectFaqJsonLd() {
    const existing = document.getElementById("faq-jsonld");
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.id = "faq-jsonld";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ_DATA.map((item) => ({
        "@type": "Question",
        name: item.q.en,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a.en,
        },
      })),
    });
    document.head.appendChild(script);
  }

  function init() {
    loadLang(detectLang());
    return Promise.resolve();
  }

  function toggle() {
    loadLang(currentLang === "zh" ? "en" : "zh");
    return Promise.resolve();
  }

  function lang() {
    return currentLang;
  }

  return { init, toggle, t, lang, renderFaq };
})();
