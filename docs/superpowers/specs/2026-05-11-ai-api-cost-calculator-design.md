# AI API Cost Calculator - Design Spec

## Overview

A pure frontend SPA that calculates AI API costs across multiple providers. Users input token counts and cache rate, select a model, and see a detailed cost breakdown. Supports Chinese/English with auto-detection.

## Target Users

- Developers who need precise token-level cost estimation
- Product managers/decision-makers comparing model costs for budget planning

## Technical Stack

- **HTML/CSS/JS** - zero dependencies build
- **Chart.js** - not needed (no charts in final design)
- Pure static files, deployable to GitHub Pages or any static host

## Visual Design

- **Style**: Mocha Mousse warm tone (Pantone 2025 Color of the Year)
- **Palette**: Off-white background (#f5f0eb), Mocha accents (#a47764, #c9a888), dark brown text (#3d2c1e)
- **Feel**: Warm, comfortable, premium

## Core Interaction

Single mode with three inputs:

1. **Select Model** - dropdown grouped by vendor
2. **Input Tokens** - positive integer
3. **Output Tokens** - positive integer
4. **Cache Rate** - slider 0%-100%, default 0%

Real-time calculation, no submit button needed.

## UI Layout

```
┌─────────────────────────────────────────────────┐
│  AI API Cost Calculator          [中文/EN]       │
├─────────────────────────────────────────────────┤
│                                                  │
│  Select Model   [ Claude Sonnet 4.6       ▼ ]   │
│  Input Tokens   [         100,000          ]    │
│  Output Tokens  [          50,000          ]    │
│  Cache Rate     [========●========] 30%         │
│                                                  │
│  ─────────────────────────────────────────────  │
│  Cost Breakdown                                  │
│  Input (100K tokens)           $0.30             │
│  Output (50K tokens)           $0.75             │
│  Cache (30K tokens)            $0.01             │
│  ─────────────────────────────────────────────  │
│  Total                         $1.06             │
│                                                  │
│  Source: Official websites | Updated: 2026-05    │
└─────────────────────────────────────────────────┘
```

## Model Data

Prices per 1M tokens (as of May 2026):

| Vendor    | Model            | Input  | Output | Cache  |
|-----------|------------------|--------|--------|--------|
| OpenAI    | GPT-5.5          | $5.00  | $30.00 | $0.50  |
| Anthropic | Claude Opus 4.6  | $15.00 | $75.00 | $1.50  |
| Anthropic | Claude Sonnet 4.6| $3.00  | $15.00 | $0.30  |
| Anthropic | Claude Haiku 4.5 | $1.00  | $5.00  | $0.10  |
| Google    | Gemini 3.1 Pro   | $2.00  | $12.00 | $0.50  |
| DeepSeek  | DeepSeek V4      | $0.30  | $0.50  | $0.03  |

Data stored in `js/models.js`, easily updatable.

## Calculation Formula

```
input_cost  = (input_tokens / 1,000,000) * price_per_1m_input
output_cost = (output_tokens / 1,000,000) * price_per_1m_output
cache_cost  = (input_tokens * cache_rate / 1,000,000) * price_per_1m_cache
total       = input_cost + output_cost + cache_cost
```

Cache applies to input tokens only (industry standard).

## Internationalization

- Two locale files: `lang/zh.json`, `lang/en.json`
- Auto-detect via `navigator.language`: zh* → Chinese, others → English
- Manual toggle in top-right corner, persisted in `localStorage`
- Model names stay in English (not translated)
- Currency always USD ($)
- All input state preserved on language switch

## Edge Cases

- Input accepts positive integers only, non-numeric chars filtered
- Cache rate slider: 0%-100%, default 0%
- Model dropdown grouped by vendor
- Mobile responsive: single column, horizontally scrollable table

## File Structure

```
api-calculator/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js          # Main logic, event binding
│   ├── calculator.js   # Cost calculation
│   ├── models.js       # Model price data
│   ├── i18n.js         # Internationalization
│   └── lang/
│       ├── zh.json
│       └── en.json
└── favicon.ico
```
