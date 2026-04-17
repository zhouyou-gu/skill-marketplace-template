# Skills Directory Guide

This folder is the source of truth for all marketplace skills.

## How to Add a Skill

1. Before creating a new skill, browse `skills/` and the marketplace to check for overlapping functionality. If your skill builds on existing ones, list them under `parents` in `skill.yaml` (see below) so reviewers can confirm you are not duplicating work.
2. Create a new folder: `skills/<skill-id>/`.
3. Add required files:
   - `SKILL.md`
   - `skill.yaml`
   - `tool.json`
4. Add recommended files:
   - `README.md`
   - `examples/` — one or more reference materials such as a runnable script (`basic.py` is the conventional name), templates, sample inputs, or expected outputs
5. Keep naming consistent:
   - Folder name must match `skill.yaml:id`.
   - `SKILL.md` frontmatter `name` must match `skill.yaml:id`.
6. Ensure `category` in `skill.yaml` is listed in `config/marketplace.json`.
7. Run checks from the repository root:

```bash
python3 scripts/validate_skills.py
python3 scripts/verify_install_targets.py
python3 scripts/build_registry.py
python3 scripts/build_search_index.py
```

8. Commit your new `skills/<skill-id>/` files and open a pull request.

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

### `SKILL.md` (agent-facing skill instructions)

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

Optional fields:

- `parents` — list of skill `id`s this skill depends on, extends, or composes. Use it to make reuse explicit and prevent overlapping skills. Validated to exist; self-reference is rejected.

Rules:

1. `id` must be lowercase kebab-case and match folder name.
2. `category` must exist in `config/marketplace.json.categories`.
3. `tags` must be unique, lowercase, and non-empty.
4. `difficulty` must be `beginner|intermediate|advanced`.
5. `install` must include at least one of `pip` or `npm`.
6. `agent.protocol` must be `mcp`.
7. `agent.tool_schema` usually points to `tool.json`.
8. Every entry in `parents` must be the `id` of another skill in `skills/`; a skill must not list itself.

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
parents:
  - agent-files
```

Note: if `repo` uses `https://github.com/example/...`, `build_registry.py` can auto-map it to the current repository path when possible.

### `README.md` (recommended human docs)

When `parents` is set in `skill.yaml`, include a short `## Parents` section in the skill's own `README.md` that explains *why* each parent is listed (one line each). This is human prose for reviewers; the machine-readable truth lives in `skill.yaml:parents`.

Example:

```markdown
## Parents

- `agent-files` — this skill fills in the AGENT_GOAL.md scaffolded by agent-files.
- `research-goal-curator` — extends its goal-curation prompts.
```

### Finding child skills

Child skills are **not stored** — they are the inverse of `parents` and can be derived on demand. To list every skill that declares `<your-id>` as a parent, grep the skills folder:

```bash
grep -rEn "^\s*-\s*<your-id>\s*$" skills/*/skill.yaml
```

For a full parent/child dependency graph across the marketplace, use the [`skill-link`](skill-link/) skill.

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
   - Error: Skill installation fails with missing `SKILL.md`.
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
6. **Invalid parent reference**
   - Error: `parents[i]: parent skill 'X' does not exist`, or `parents[i]: skill cannot list itself as a parent`.
   - Fix: ensure every `parents` entry matches an existing `skills/<id>/` folder and remove any self-reference.
