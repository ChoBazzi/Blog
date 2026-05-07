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
