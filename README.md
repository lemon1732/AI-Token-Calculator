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
