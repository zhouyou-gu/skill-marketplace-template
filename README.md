# Skill Marketplace Template

Fork-friendly, GitHub-native template for building a marketplace of reusable AI agent skills.

**Author:** Zhouyou Gu  
**License:** MIT

## Why This Project Exists

Most teams can build one good skill, but struggle to share, review, and reuse skills across contributors.

This project exists to solve that by giving you a simple, repeatable system:

1. Keep skills in a clear folder structure.
2. Validate skill quality automatically in CI.
3. Generate machine-readable registry files for agents.
4. Publish a searchable static UI on GitHub Pages.

In short: this template turns random skill files into a real, maintainable ecosystem.

## Project Intention (Plain English)

This template is intentionally opinionated:

1. **GitHub-first workflow**: contributors use pull requests, not ad-hoc uploads.
2. **Schema-first quality**: bad metadata is blocked early.
3. **Static hosting simplicity**: no backend required for discovery UI.
4. **Agent compatibility**: skills expose MCP-style tool contracts.
5. **Forkability**: anyone can create their own marketplace with minimal edits.

## Who This Is For

1. **Maintainers**: run and moderate a skill marketplace.
2. **Contributors**: submit new skills using a consistent format.
3. **Agent/tool builders**: discover skills from `registry/index.json`.

## What You Get

1. Codex skill runtime instructions (`SKILL.md`) per skill
2. Skill metadata schema (`skill.yaml`)
3. Tool contract schema (`tool.json`)
4. Validation scripts (strict checks)
5. Generated registry (`registry/index.json`)
6. Generated search index (`registry/search.json`)
7. Searchable marketplace UI (`marketplace/`)
8. GitHub Actions pipeline for validate/build/deploy

## High-Level Architecture

```text
Contributor
   |
   v
Add skill folder (skills/<id>/...)
   |
   v
Pull Request
   |
   v
CI pipeline
   |-- validate metadata and tool schema
   |-- build registry/index.json
   `-- build registry/search.json
   |
   v
GitHub Pages UI + agent-readable registry
```

Agent discovery flow:

```text
Agent/Client
   |
   v
registry/index.json
   |
   v
skill metadata + tool schema path
   |
   v
install metadata and tool invocation contract
```

## Repository Tour

```text
skill-marketplace-template/
├─ skills/                        # Source of truth skill folders
│  └─ <skill-id>/
│     ├─ SKILL.md                 # Codex installer-compatible skill instructions
│     ├─ skill.yaml               # Skill metadata
│     ├─ tool.json                # Tool input/output contract
│     ├─ README.md                # Human docs for the skill
│     └─ examples/                # Usage examples (recommended)
├─ schemas/                       # JSON Schemas used for strict validation
├─ config/marketplace.json        # Marketplace branding + category policy
├─ scripts/                       # Validation and generation scripts
├─ registry/index.json            # Generated machine registry (local/CI artifact)
├─ registry/search.json           # Generated search index (local/CI artifact)
├─ marketplace/                   # Static frontend for GitHub Pages
├─ .github/workflows/build.yml    # CI/CD pipeline
├─ index.html                     # Root redirect to marketplace/
└─ README.md
```

Important rule: `registry/*.json` is generated and not tracked in git.

## Quick Start (Maintainer)

### 1) Prerequisites

- Python 3.11+
- Git
- A GitHub repository (template/fork)

### 2) Configure your marketplace

Edit [`config/marketplace.json`](config/marketplace.json):

- `title`: marketplace name
- `description`: one-line value proposition
- `author`: maintainer/owner name
- `license`: license label
- `url`: GitHub Pages URL
- `categories`: allowed category list (controlled vocabulary)

### 3) Validate and build artifacts

```bash
python3 scripts/validate_skills.py
python3 scripts/verify_install_targets.py
python3 scripts/build_registry.py
python3 scripts/build_search_index.py
```

### 4) Preview locally

```bash
python3 -m http.server 8000
```

Open:

- `http://localhost:8000/` (redirects to marketplace)
- `http://localhost:8000/marketplace/`

### 5) Push and deploy

- Push to `main`
- GitHub Actions validates and deploys Pages

## Add a New Skill (Step-by-Step)

Create:

```text
skills/my-skill/
├─ SKILL.md
├─ skill.yaml
├─ tool.json
├─ README.md
└─ examples/
```

Then run:

```bash
python3 scripts/validate_skills.py
python3 scripts/verify_install_targets.py
python3 scripts/build_registry.py
python3 scripts/build_search_index.py
```

Commit and open PR.

## Skill Contract for Contributors

### `SKILL.md` (what Codex installer loads)

Required:

- YAML frontmatter delimited by `---`
- `name` and `description` keys in frontmatter
- Skill body with task instructions

Key rules:

1. `name` must match folder name and `skill.yaml:id`.
2. `description` should clearly state what the skill does and when to use it.
3. Keep only frontmatter keys `name` and `description` for compatibility.

Example:

```markdown
---
name: web-scraping
description: Extract structured data from webpages. Use for URL scraping and HTML parsing tasks.
---

# Web Scraping

Use this skill to fetch webpages, parse content, and return structured data.
```

### `skill.yaml` (what maintainers and agents read)

Required fields:

- `id`
- `name`
- `description`
- `category`
- `tags`
- `difficulty`
- `repo`
- `install`
- `agent`

Key rules:

1. `id` must be lowercase kebab-case and match folder name.
2. `category` must exist in `config/marketplace.json.categories`.
3. `tags` must be unique, lowercase, and non-empty.
4. `difficulty` must be `beginner|intermediate|advanced`.
5. `install` must include at least one of `pip` or `npm`.
6. `agent.protocol` must be `mcp`.
7. `agent.tool_schema` usually points to `tool.json`.

Example:

```yaml
id: web-scraping
name: Web Scraping
description: Extract structured data from webpages
category: data
tags:
  - python
  - scraping
difficulty: intermediate
repo: https://github.com/example/web-scraping-skill
install:
  pip: webscraper
agent:
  protocol: mcp
  tool_schema: tool.json
```

Note: if `repo` uses `https://github.com/example/...`, `build_registry.py` can auto-map it to your actual repo path when possible.

### `tool.json` (how agents understand invocation)

Required fields:

- `name`
- `title`
- `description`
- `inputSchema`

Optional:

- `outputSchema`

Example:

```json
{
  "name": "web_scrape",
  "title": "Website Scraper",
  "description": "Extract structured data from a webpage",
  "inputSchema": {
    "type": "object",
    "properties": {
      "url": { "type": "string" }
    },
    "required": ["url"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "data": { "type": "array" }
    }
  }
}
```

## Generated Contracts

### `registry/index.json`

Purpose:

- Canonical machine-readable marketplace registry.
- Contains marketplace metadata and rich skill entries.

Includes (per skill):

- identity + description
- category + tags + difficulty
- install metadata
- resolved repo URL
- tool summary (`name/title/description`)

### `registry/search.json`

Purpose:

- Pre-tokenized client-side search index for the static UI.

Includes (per skill):

- `id`
- `category`
- token list
- normalized text blob

Both generated files are deterministic and sorted by `id`.

## CI/CD Behavior

Workflow: [`.github/workflows/build.yml`](.github/workflows/build.yml)

On `pull_request` and `push` to `main`:

1. Install Python dependencies (`pyyaml`, `jsonschema`)
2. Run validation script
3. Verify `install.pip` and `install.npm` targets resolve in real registries
4. Build `registry/index.json`
5. Build `registry/search.json`
6. Fail if validation or generation fails

On `push` to `main`:

- Rebuild `registry/index.json` and `registry/search.json`
- Deploy GitHub Pages artifact (including generated registry files)

## Junior-Friendly Mental Model

When in doubt, remember this chain:

1. `skills/` is source truth.
2. `scripts/` turns source truth into registry files.
3. `registry/` is what UI/agents consume.
4. `marketplace/` is only a viewer over registry data.

If something looks wrong in UI, first check skill metadata and regenerate registry files.

## Common Errors and Fixes

1. **`SKILL.md` not found**
   - Error: Codex install fails with missing `SKILL.md`.
   - Fix: add `SKILL.md` in each `skills/<id>/` folder with valid frontmatter.

2. **`id` mismatch**
   - Error: skill `id` does not match folder name.
   - Fix: make folder name and `skill.yaml:id` identical.

3. **Invalid category**
   - Error: category not in configured category list.
   - Fix: either update `config/marketplace.json` or choose an allowed category.

4. **Missing tool schema**
   - Error: `agent.tool_schema` path missing or invalid.
   - Fix: create file and keep path relative to skill folder.

5. **CI fails while generating registry/search**
   - Error: build scripts fail in CI due invalid skill metadata, schema, or tool paths.
   - Fix: run validation/build scripts locally, fix the reported issue, and push again.

## Contribution Guidelines

1. Keep PRs small and focused (prefer one skill per PR).
2. Include both `SKILL.md` and `README.md` for each skill.
3. Run validation/build scripts locally before pushing.
4. Do not add arbitrary install command fields; use `pip` and/or `npm` only.

## CLI Compatibility (Planned)

Planned command style:

```bash
skill marketplace add https://<user>.github.io/<repo>/registry/index.json
skill search scraping
skill install web-scraping
```

Current status:

- Registry format is ready for CLI consumers.
- Full installer behavior remains a future extension.

## Roadmap

1. v1: registry + UI + CI (current template direction)
2. v1.1: CLI installer integration
3. Future: trust tiers, stronger security policy checks, richer search ranking

## License

MIT License - see [LICENSE](LICENSE).

Copyright (c) 2026 Zhouyou Gu
