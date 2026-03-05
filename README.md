# Skill Marketplace Template

GitHub-native, fork-friendly template for publishing reusable AI agent skills.

**Status:** Bootstrap phase. This repository currently documents the target design; scaffold files and automation are planned to follow this specification.

## Current State vs Target State

- Current state: repository initialized, documentation-first.
- Target state (v1): Registry + UI + CI are implemented and deployable on GitHub Pages.
- Target state (v1.1): CLI installer compatibility is added.

## What This Template Is

This template gives maintainers a repeatable way to run a skill marketplace on top of GitHub:

- Fork or generate a new marketplace repository.
- Accept skill contributions through pull requests.
- Validate skill metadata and tool schemas in CI.
- Publish a machine-readable registry and a searchable static UI on GitHub Pages.

Primary audience order:

1. Fork maintainers
2. Skill contributors
3. End users

v1 scope is intentionally narrow: `Registry + UI + CI`.

## Core Capabilities

1. Skill metadata contract (`skill.yaml`)
2. MCP-compatible tool contract (`tool.json`)
3. Generated marketplace registry (`registry/index.json`)
4. Generated client-side search index (`registry/search.json`)
5. GitHub Pages marketplace UI (`marketplace/`)
6. Planned CLI compatibility (v1.1)

## Architecture

High-level flow:

```text
Contributor
   |
   v
Add skill folder
   |
   v
Pull Request
   |
   v
CI pipeline
   |-- validate schema
   |-- generate registry
   `-- generate search index
   |
   v
GitHub Pages marketplace
   |
   v
Agents discover and install skills
```

Agent discovery flow:

```text
agent
  |
  v
registry/index.json
  |
  v
skill metadata + tool schema reference
  |
  v
install metadata and/or tool invocation contract
```

## Repository Structure (Target)

```text
skill-marketplace-template/
├─ skills/
│  └─ <skill-id>/
│     ├─ skill.yaml
│     ├─ tool.json
│     ├─ README.md
│     └─ examples/
├─ schemas/
│  ├─ skill.schema.json
│  ├─ tool.schema.json
│  ├─ config.schema.json
│  ├─ registry.schema.json
│  └─ search.schema.json
├─ registry/
│  ├─ index.json
│  └─ search.json
├─ marketplace/
│  ├─ index.html
│  ├─ app.js
│  └─ style.css
├─ config/
│  └─ marketplace.json
├─ scripts/
│  ├─ validate_skills.py
│  ├─ build_registry.py
│  └─ build_search_index.py
├─ .github/workflows/
│  └─ build.yml
└─ README.md
```

Generated artifacts in `registry/*.json` are committed to git (not deploy-only artifacts).

## Skill Authoring Contract

Each skill lives under:

```text
skills/<skill-id>/
```

Required files:

1. `skill.yaml`
2. `tool.json`
3. `README.md`
4. `examples/` (recommended, optional for v1 acceptance unless maintainers require it)

### `skill.yaml` (required fields and constraints)

Required top-level keys:

- `id`
- `name`
- `description`
- `category`
- `tags`
- `difficulty`
- `repo`
- `install`
- `agent`

Constraints:

- `id` format: lowercase kebab-case (`^[a-z0-9]+(?:-[a-z0-9]+)*$`) and must match folder name.
- `category` must be one of `config/marketplace.json.categories`.
- `tags` must be non-empty, lowercase, and unique.
- `difficulty` enum: `beginner | intermediate | advanced`.
- `repo` must be HTTPS.
- `install` must contain at least one of `pip` or `npm` (both allowed).
- `agent.protocol` must be `mcp`.
- `agent.tool_schema` points to `tool.json` (relative path).

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

### `tool.json` (required fields and constraints)

Required keys:

- `name`
- `title`
- `description`
- `inputSchema`

Optional:

- `outputSchema`

Constraints:

- `name` format: `^[a-zA-Z][a-zA-Z0-9_]*$`
- `inputSchema` and `outputSchema` are JSON Schema object roots.
- Unknown top-level fields should be rejected by strict validation.

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

## Registry and Search Contracts

### `registry/index.json` (rich registry)

Purpose:

- Primary machine-discovery document for agents and future CLI.
- Single read to retrieve display metadata + install metadata + tool summary.

Shape:

```json
{
  "version": "1.0.0",
  "marketplace": {
    "title": "AI Skills Marketplace",
    "description": "Reusable agent skills",
    "url": "https://<user>.github.io/<repo>",
    "theme": "dark",
    "categories": ["data", "automation", "ai", "devtools"]
  },
  "skills": [
    {
      "id": "web-scraping",
      "name": "Web Scraping",
      "description": "Extract structured data from webpages",
      "category": "data",
      "tags": ["python", "scraping"],
      "difficulty": "intermediate",
      "repo": "https://github.com/example/web-scraping-skill",
      "path": "skills/web-scraping",
      "install": { "pip": "webscraper" },
      "agent": {
        "protocol": "mcp",
        "tool_schema": "skills/web-scraping/tool.json"
      },
      "tool": {
        "name": "web_scrape",
        "title": "Website Scraper",
        "description": "Extract structured data from a webpage"
      }
    }
  ]
}
```

### `registry/search.json` (search index)

Purpose:

- Fast client-side filtering without server infrastructure.

Shape:

```json
[
  {
    "id": "web-scraping",
    "category": "data",
    "tokens": ["web", "scraping", "python", "automation", "data"],
    "text": "web scraping extract structured data python automation"
  }
]
```

Generation guarantees:

1. Deterministic output
2. Sorted by `id`
3. Derived from validated source metadata only

## Configuration

`config/marketplace.json` controls branding and category policy.

Required fields:

- `title`
- `description`
- `theme`
- `categories`

Optional fields:

- `url` (HTTPS marketplace URL; defaults to `https://<user>.github.io/<repo>` when omitted)

Rules:

- `categories` is a controlled list (authoritative).
- Category display order in UI follows this list by default.
- Alternative alphabetical category sort is supported in UI.

Example:

```json
{
  "title": "AI Skills Marketplace",
  "description": "Reusable agent skills",
  "url": "https://<user>.github.io/<repo>",
  "theme": "dark",
  "categories": ["data", "automation", "ai", "devtools"]
}
```

## CI/CD Workflow

Planned workflow in `.github/workflows/build.yml`:

1. Run on `pull_request` and `push` to `main`
2. Validate all skill and config contracts
3. Generate `registry/index.json`
4. Generate `registry/search.json`
5. Fail if generated artifacts differ from committed files (drift check)
6. Deploy GitHub Pages on `main`

Planned command interface:

```bash
python scripts/validate_skills.py
python scripts/build_registry.py
python scripts/build_search_index.py
git diff --exit-code registry/index.json registry/search.json
```

## Quickstart (Maintainer)

1. Create a repo from this template (or fork it).
2. Update `config/marketplace.json` branding and categories.
3. Add your first skill folder with `skill.yaml` and `tool.json`.
4. Run planned validation/build commands locally.
5. Open PR, merge to `main`, verify GitHub Pages deployment.

Minimal first skill:

```text
skills/web-scraping/
├─ skill.yaml
├─ tool.json
└─ README.md
```

## Usage (Agent/CLI Compatibility)

Planned compatibility target for v1.1:

```bash
skill marketplace add https://<user>.github.io/<repo>/registry/index.json
skill search scraping
skill install web-scraping
```

Notes:

- v1 documents install metadata contracts.
- v1.1 implements CLI installer behavior against the registry.

## Contribution Guidelines

PR expectations:

1. Keep one skill per PR when possible.
2. Include complete metadata and documentation.
3. Keep categories within configured allowed list.
4. Ensure generated registry/search artifacts are updated.

Policy:

- Schema compliance is required for merge.
- Install metadata supports `pip` and `npm` only in v1.
- Arbitrary install command fields are not allowed in v1.

## Roadmap

1. v1: Registry + UI + CI
2. v1.1: CLI installer integration
3. Future:
   - trust tiers and security policy checks
   - improved relevance ranking in search
   - optional curation workflows

## License

Add your chosen license in `LICENSE` (for example MIT, Apache-2.0, or proprietary internal).
