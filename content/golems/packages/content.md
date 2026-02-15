---
title: "ContentGolem — Visual Content Factory"
description: "Multi-pipeline content creation: Remotion video, ComfyUI image generation, data visualization, brand-aware theming, and AI-powered pipeline routing."
---

# ContentGolem

> Visual content factory + text publishing. Brand-aware, multi-pipeline, quality-gated.

ContentGolem handles **all content creation**: video animations (Remotion), AI image generation (ComfyUI + Flux), data visualizations, LinkedIn posts, Soltome publishing, and ghostwriting. An AI router automatically picks the best pipeline for any content idea.

## System Overview

```mermaid
flowchart TD
    subgraph input["Content Request"]
        IDEA["Content Idea"]
        BRAND["Brand Config<br/><small>colors, typography, tone</small>"]
    end

    subgraph router["Pipeline Intelligence"]
        ROUTE["AI Router<br/><small>analyze idea → pick pipeline</small>"]
        EXEC["Execution Engine<br/><small>run pipeline, track progress</small>"]
        TRACK["Performance Tracker<br/><small>log results to Supabase</small>"]
    end

    subgraph pipelines["Content Pipelines"]
        REM["Remotion<br/><small>video, gif, thumbnail</small>"]
        COMFY["ComfyUI + Flux<br/><small>AI image generation</small>"]
        DATAVIZ["Data Viz<br/><small>charts, infographics</small>"]
        SATORI["Satori<br/><small>branded cards (planned)</small>"]
        FIGMA["Figma → Remotion<br/><small>design animations (planned)</small>"]
    end

    subgraph quality["Quality Gates"]
        CLIP["CLIP Score ≥ 0.25<br/><small>prompt adherence</small>"]
        LAION["LAION Aesthetic ≥ 5.5<br/><small>visual quality</small>"]
        BRISQUE["BRISQUE ≤ 40<br/><small>perceptual quality</small>"]
    end

    subgraph output["Output"]
        FILE["File<br/><small>mp4, png, svg, gif</small>"]
        PUB["Publishing<br/><small>LinkedIn, Soltome</small>"]
    end

    IDEA --> ROUTE
    BRAND --> ROUTE
    ROUTE --> EXEC
    EXEC --> REM & COMFY & DATAVIZ & SATORI & FIGMA
    REM & COMFY & DATAVIZ --> quality
    quality -->|pass| FILE
    quality -->|fail: retry with new seed| EXEC
    FILE --> PUB
    EXEC --> TRACK
```

## Pipeline Intelligence Router

The router analyzes a content idea and selects the best pipeline based on the idea type, available data, and past performance.

```mermaid
flowchart LR
    IDEA["Describe your idea<br/><small>'Weekly job market chart'</small>"]
    CLASSIFY["Classify Idea<br/><small>LLM: type + complexity</small>"]
    MATCH["Match Pipeline<br/><small>capabilities registry</small>"]
    PLAN["Build Execution Plan<br/><small>steps, params, fallbacks</small>"]
    RUN["Execute<br/><small>run pipeline(s)</small>"]
    LOG["Log Performance<br/><small>duration, quality, feedback</small>"]

    IDEA --> CLASSIFY --> MATCH --> PLAN --> RUN --> LOG
    LOG -->|"learning loop"| MATCH
```

| Pipeline | Best For | Outputs |
|----------|----------|---------|
| **Remotion** | Animations, code demos, data stories | mp4, gif, png |
| **ComfyUI** | Social visuals, merch, memes | png, jpg, webp |
| **DataViz** | Charts, infographics, reports | png, svg |
| **Satori** | Branded cards, quotes | png, svg (planned) |
| **Figma → Remotion** | Design animations | mp4, gif (planned) |

Multi-pipeline combinations are supported: ComfyUI background + Remotion text overlay, or DataViz chart + Remotion animated version.

## Brand System

Every visual output is brand-aware. Per-project `brand.json` configs define colors, typography, tone, and layout rules.

```mermaid
flowchart TD
    subgraph configs["Brand Configs"]
        G["golems-showcase<br/><small>product demos, architecture</small>"]
        T["techgym-posts<br/><small>Hebrew tech community</small>"]
        P["political-merch<br/><small>bold merch designs</small>"]
    end

    LOAD["loadBrandConfig()<br/><small>validate schema</small>"]
    BRIDGE["Brand Bridge<br/><small>BrandConfig → pipeline colors</small>"]

    subgraph targets["Pipeline Theming"]
        RT["Remotion<br/><small>BrandColors props</small>"]
        CT["ComfyUI<br/><small>style prompts</small>"]
        DT["DataViz<br/><small>chart theme</small>"]
    end

    configs --> LOAD --> BRIDGE --> targets
```

## Remotion Video Pipeline

8 compositions with LinkedIn (1080x1080) variants. Compositions are brand-aware via the Brand Bridge.

```mermaid
flowchart TD
    subgraph compositions["Compositions"]
        CODE["CodeShowcase<br/><small>animated code walkthrough</small>"]
        ARCH["ArchDiagram<br/><small>architecture boxes + arrows</small>"]
        METRICS["MetricsDashboard<br/><small>count-up, trends, sparklines</small>"]
        HERO["ProductHero<br/><small>title → screenshots → metrics</small>"]
        JOBS["WeeklyJobs<br/><small>animated bar chart</small>"]
        FINANCE["MonthlyFinance<br/><small>animated donut chart</small>"]
        BRAIN["BrainGrowth<br/><small>knowledge base line chart</small>"]
        DOMICA["DomicaHero<br/><small>3D magnifying glass</small>"]
    end

    BRAND2["Brand Bridge<br/><small>colors, typography</small>"]
    RENDER["Render Service<br/><small>renderVideo() / renderStill()</small>"]

    subgraph formats["Output Formats"]
        YT["YouTube 1080p<br/><small>1920x1080</small>"]
        LI["LinkedIn Square<br/><small>1080x1080</small>"]
        GIF2["GIF<br/><small>800x450</small>"]
        STILL["Still / Thumbnail<br/><small>any frame</small>"]
    end

    BRAND2 --> compositions
    compositions --> RENDER
    RENDER --> formats
```

### Shared Components

Remotion compositions share a library of animated building blocks:

- **AnimatedText** — typewriter, fade-in, highlight effects
- **FadeIn / SlideIn** — entrance animations with configurable timing
- **Scenes** — sequencer for multi-scene compositions
- **Audio** — background music and sound effect sync
- **Design Tokens** — spacing, breakpoints, timing curves from brand config

## ComfyUI Image Generation

Local Flux.1 Dev model via ComfyUI. Generates images with automatic quality scoring and retry.

```mermaid
flowchart TD
    PROMPT["Prompt + Style<br/><small>social, merch, meme, draft</small>"]
    WORKFLOW["Build Workflow<br/><small>Flux GGUF + T5-XXL + CLIP-L</small>"]
    QUEUE["Queue on ComfyUI<br/><small>WebSocket progress tracking</small>"]
    GENERATE["Generate Image<br/><small>15-30 steps depending on style</small>"]

    subgraph qg["Quality Gates"]
        direction TB
        C["CLIP Score ≥ 0.25<br/><small>does image match prompt?</small>"]
        L["LAION Aesthetic ≥ 5.5<br/><small>is it visually appealing?</small>"]
        B["BRISQUE ≤ 40<br/><small>is it perceptually clean?</small>"]
    end

    PASS{{"All gates pass?"}}
    RETRY["Retry with new seed<br/><small>up to 3 attempts</small>"]
    BEST["Return best result<br/><small>even if gates fail after 3x</small>"]
    OUTPUT["Output Image<br/><small>png/jpg/webp</small>"]

    PROMPT --> WORKFLOW --> QUEUE --> GENERATE --> qg
    qg --> PASS
    PASS -->|yes| OUTPUT
    PASS -->|"no (attempt < 3)"| RETRY --> WORKFLOW
    PASS -->|"no (attempt = 3)"| BEST
```

### Image Styles

| Style | Size | Steps | Use Case |
|-------|------|-------|----------|
| `base` | 768x768 | 25 | General purpose |
| `social` | 1080x1080 | 25 | Instagram/LinkedIn square |
| `merch` | 1024x1024 | 30 | Print-quality (upscaled 4x) |
| `meme` | 1280x720 | 20 | Landscape memes |
| Quick draft | 512x512 | 15 | Fast iteration (2-4 min) |

Print-quality (`merch`) images are upscaled 4x via UltimateSDUpscale with LAION Aesthetic gate raised to 6.0.

## Data Visualization Pipeline

Fetches live data from Supabase and Zikaron, renders branded charts as SVG, converts to PNG via sharp.

```mermaid
flowchart TD
    subgraph sources["Data Sources"]
        SJOBS["Supabase<br/><small>golem_jobs, scrape_activity</small>"]
        SFIN["Supabase<br/><small>llm_usage, subscriptions</small>"]
        ZBRAIN["Zikaron SQLite<br/><small>chunks, projects, enrichment</small>"]
        SACT["Supabase<br/><small>golem_events, service_runs</small>"]
    end

    subgraph fetchers["Fetchers"]
        FJ["fetchJobMarketData()"]
        FF["fetchFinanceData()"]
        FB["fetchBrainData()"]
        FA["fetchActivityData()"]
    end

    subgraph charts["Chart Generators"]
        BAR["Bar Chart<br/><small>rankings, comparisons</small>"]
        DONUT["Donut Chart<br/><small>proportions, distributions</small>"]
        LINE["Line Chart<br/><small>time series, growth</small>"]
        STAT["Stat Cards<br/><small>key metrics + deltas</small>"]
    end

    subgraph templates["Infographic Templates"]
        LIC["LinkedIn Card<br/><small>1200x627</small>"]
        IG["Instagram Square<br/><small>1080x1080</small>"]
        STORY["Story Format<br/><small>1080x1920</small>"]
    end

    SHARP["SVG → PNG<br/><small>sharp renderer</small>"]

    sources --> fetchers --> charts --> templates --> SHARP
```

Charts automatically inherit brand colors when a `BrandConfig` is provided via `themeFromBrand()`.

## Text Publishing Pipeline

Content drafting and publishing follows a critique-wave quality process:

```mermaid
flowchart TD
    TOPIC["Topic Discovery<br/><small>commits, research, conversations</small>"]
    DRAFT["LLM Draft<br/><small>match owner's voice + style</small>"]

    subgraph critique["Critique Waves"]
        C1["Agent 1: Clarity<br/><small>is the message clear?</small>"]
        C2["Agent 2: Engagement<br/><small>will people read it?</small>"]
        C3["Agent 3: Accuracy<br/><small>are claims correct?</small>"]
    end

    REFINE["Refine Draft<br/><small>incorporate feedback</small>"]
    APPROVE["Human Approval<br/><small>Telegram /drafts command</small>"]

    subgraph publish["Publish"]
        SOLT["Soltome<br/><small>2 credits per post</small>"]
        LINKED["LinkedIn<br/><small>2026 algorithm rules</small>"]
    end

    TOPIC --> DRAFT --> critique --> REFINE --> APPROVE --> publish
    REFINE -->|"not ready"| critique
```

### Writing Voice

The GolemsZikaron persona for published content:
- Casual but technically deep
- Collaborative researcher tone
- Open source evangelist
- Hebrew-English code-switching where natural

## Dependencies

- `@golems/shared` — Supabase factory, event log, LLM
- `remotion` + `@remotion/cli` — video rendering
- `sharp` — SVG to PNG conversion
- Python 3.10+ — quality scoring (CLIP, LAION Aesthetic, BRISQUE)
- ComfyUI — local Flux image generation server

## Source

[`packages/content/`](https://github.com/EtanHey/golems/tree/master/packages/content)
