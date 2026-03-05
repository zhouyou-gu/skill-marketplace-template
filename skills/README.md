# Skills Directory Guide

This folder is the source of truth for all marketplace skills.

## How to Add a Skill

1. Create a new folder: `skills/<skill-id>/`.
2. Add required files:
   - `SKILL.md`
   - `skill.yaml`
   - `tool.json`
3. Add recommended files:
   - `README.md`
   - `examples/basic.py`
4. Keep naming consistent:
   - Folder name must match `skill.yaml:id`.
   - `SKILL.md` frontmatter `name` must match `skill.yaml:id`.
5. Ensure `category` in `skill.yaml` is listed in `config/marketplace.json`.
6. Run checks from the repository root:

```bash
python3 scripts/validate_skills.py
python3 scripts/verify_install_targets.py
python3 scripts/build_registry.py
python3 scripts/build_search_index.py
```

7. Commit your new `skills/<skill-id>/` files and open a pull request.

## Skill Folder Template

```text
skills/my-skill/
├─ SKILL.md
├─ skill.yaml
├─ tool.json
├─ README.md (recommended)
└─ examples/ (recommended)
```

## Skill Specifications

### `SKILL.md` (Codex installer instructions)

Required:

- YAML frontmatter delimited by `---`
- `name` and `description` keys in frontmatter
- Skill body with task instructions

Rules:

1. `name` must match folder name and `skill.yaml:id`.
2. `description` should state what the skill does and when to use it.
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

### `skill.yaml` (skill metadata contract)

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

Rules:

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
  pip: beautifulsoup4
agent:
  protocol: mcp
  tool_schema: tool.json
```

Note: if `repo` uses `https://github.com/example/...`, `build_registry.py` can auto-map it to the current repository path when possible.

### `tool.json` (agent invocation contract)

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

## Common Errors and Fixes

1. **`SKILL.md` not found**
   - Error: Codex install fails with missing `SKILL.md`.
   - Fix: add `SKILL.md` in `skills/<id>/` with valid frontmatter.
2. **`id` mismatch**
   - Error: skill `id` does not match folder name.
   - Fix: make folder name and `skill.yaml:id` identical.
3. **Invalid category**
   - Error: category not in configured category list.
   - Fix: update `config/marketplace.json` or choose an allowed category.
4. **Missing tool schema**
   - Error: `agent.tool_schema` path missing or invalid.
   - Fix: create file and keep path relative to skill folder.
5. **Validation/build script failure**
   - Error: scripts fail due to invalid metadata, schema, or install target.
   - Fix: run validation/build commands locally and fix reported errors before pushing.
