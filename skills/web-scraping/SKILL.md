---
name: web-scraping
description: Extract structured data from public webpages. Use when Codex needs to scrape content from a URL, parse HTML, and return normalized records for downstream use.
---

# Web Scraping

## Workflow

1. Validate the target `url` and confirm it is reachable.
2. Fetch page content and parse HTML safely.
3. Extract the requested fields into structured records.
4. Return extracted data as an array of objects.

## Tool Contract

- Read [`tool.json`](tool.json) for the authoritative schema.
- Prefer deterministic selectors when available.
- Keep output stable and machine-readable for automation.
