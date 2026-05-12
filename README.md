# AI Token Cost Calculator

> Free AI API token cost calculator. Compare pricing across OpenAI, Anthropic, Google, and DeepSeek models.

## Features

- **Real-time cost calculation** for input, output, cache write, and cache read tokens
- **20+ models** from OpenAI, Anthropic, Google, and DeepSeek
- **Bilingual support** (English / Chinese) with auto-detection
- **SEO optimized** with structured data, Open Graph, and FAQ
- **Responsive design** for desktop and mobile
- **Zero dependencies** - pure HTML, CSS, and JavaScript

## Supported Providers

| Provider | Models |
|----------|--------|
| OpenAI | GPT-5.5, GPT-5.5 Pro, GPT-5.4, GPT-5.4 Mini/Nano/Pro |
| Anthropic | Claude Opus 4.7/4.6/4.5, Sonnet 4.6/4.5, Haiku 4.5 |
| Google | Gemini 3.1 Pro, 3 Flash, 3 Deep Think, 2.5 Pro/Flash/Flash-Lite |
| DeepSeek | V4 Flash, V4 Pro |

## Blog

Guides on AI API pricing, model selection, and cost optimization:

- [How to Build a Model Router](https://tokencostcalc.com/blog/model-router-cheap-models.html) — Route simple tasks to cheap models, cutting your bill by 80%
- [Complete API Pricing Comparison 2026](https://tokencostcalc.com/blog/openai-vs-anthropic-vs-google-pricing-2026.html) — Every model, every price across OpenAI, Anthropic, Google, and DeepSeek
- [GPT-5.5 vs Claude Opus 4.7 vs Gemini 3.1 Pro](https://tokencostcalc.com/blog/gpt55-vs-opus47-vs-gemini31.html) — Frontier model comparison with benchmarks and cost analysis
- [How to Save 90% on AI API Costs with Prompt Caching](https://tokencostcalc.com/blog/prompt-caching-guide.html) — How caching works and how to structure prompts for maximum savings
- [What Are Tokens? A Guide to AI API Pricing](https://tokencostcalc.com/blog/token-pricing-guide.html) — Token fundamentals and cost estimation

## Development

This is a static site with no build step. Just open `index.html` in a browser or use any local server:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```

## Deployment

Deployed on [Vercel](https://tokencostcalc.com). To deploy your own instance:

1. Fork this repository
2. Import on [vercel.com](https://vercel.com)
3. Update domain references in `sitemap.xml`, `robots.txt`, and `index.html`

## License

MIT
