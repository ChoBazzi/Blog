# Architecture

## Goal

Build a portfolio and blog site for a junior developer using a local Markdown writing workflow and a NAS Docker deployment target.

## Runtime

- Next.js App Router renders static pages from local Markdown files.
- Markdown files live under `content/`, which can be opened directly as an Obsidian Vault.
- Docker builds a standalone Next.js server for NAS deployment.
- Cloudflare DNS points the public domain to the NAS reverse proxy.

## Content Layout

```text
content/
  blog/      retrospective posts and troubleshooting logs
  notes/     study notes and CS/backend/frontend references
  projects/  portfolio project writeups
```

Each Markdown file must include:

```md
---
title: "Title"
description: "Short summary"
date: "2026-05-04"
tags: ["Next.js", "Docker"]
category: "retrospective"
published: true
---
```

## Deployment Shape

```text
Cloudflare DNS
  -> NAS public IP
  -> reverse proxy
  -> portfolio-blog Docker container on port 3000
```

Use `docker compose up -d --build` on the NAS after setting the reverse proxy host.

## Article Diagrams

Architecture and flow diagrams use standalone HTML sources and exported SVGs under `public/diagrams/`. Each diagram has a light (`<slug>`), dark (`<slug>-dark`), and editorial (`<slug>-full`) HTML/SVG pair. The HTML contains editable inline SVG; the exported SVG is the article asset.

Use a standalone Markdown image line in `content/`:

```md
![Diagram description](/diagrams/bizkit-system.svg)
```

`src/lib/content.ts` renders this reserved `/diagrams/<slug>.svg` form as a figure with light/dark companion images, a keyboard-focusable horizontal scroll region, and a link to the original HTML. `src/app/globals.css` selects the image using the site's theme; before an explicit theme is set, it follows the system preference. Diagrams retain their 960 × 600 coordinate system rather than shrinking small labels in a narrow article column. The caption explains horizontal scrolling. Print styles fit the image to the available width.

Diagram images do not become automatic article covers. Explicit covers and the first ordinary image retain precedence. Other images, code blocks, Mermaid syntax, and existing architecture directives keep their original rendering behavior.

### Editing and Exporting

- Edit the corresponding HTML variants and preserve the SVG title, description, prefixed IDs, and source meaning. Keep uncertain plans distinct from completed implementations.
- The project `.diagram-design` selects the local `bazzi-blog` profile at `~/.diagram-design/profiles/bazzi-blog.md`. That home-directory profile is not part of the repository; transfer it or explicitly recreate the profile before generating diagrams on another machine.
- The approved light palette uses paper `#fafaf7`, ink `#1f2328`, and accent `#2563eb`; the dark palette uses `#0f1117`, `#f3f6fb`, and `#7aa2ff`. Font stacks are embedded in each HTML/SVG, without remote font requests. NanumSquare falls back to the available system font.
- With the `diagram-design` skill installed, check each HTML variant and export it using the packaged scripts:

```sh
python3 .omp/skills/diagram-design/scripts/self_check.py public/diagrams/bizkit-system.html
python3 .omp/skills/diagram-design/scripts/export_svg.py public/diagrams/bizkit-system.html --system-fonts
```

Repeat for `-dark` and `-full`. Check actual article rendering in both themes and at desktop/mobile widths, including text bounds, connector routing, keyboard scrolling, and the original-file link. `npm run harness` remains the repository gate.

Article `published` flags are independent of these static assets: an unpublished article remains unavailable, but anything under `public/diagrams/` is directly addressable when deployed. Never put private source material in public diagram files.
