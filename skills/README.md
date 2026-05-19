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

## Agent-File Skill Design Harness

Use these rules when adding or changing any skill that scaffolds AGENT files, composes an AGENT-file scaffolder, patches generated AGENT files, or curates AGENT-file content.

### Parent/Child Boundaries

1. Parent skills must be independent from child skills. A parent must not name a child, route to a child, reserve child sidecars, or describe child-specific behavior.
2. Child skills may name and invoke their parents. If a child composes a parent, declare that parent in `skill.yaml:parents` and explain the relationship in the child `README.md`.
3. Do not declare a parent just because a skill can operate after another skill. Declare a parent only when the skill depends on, extends, composes, or patches that parent's output contract.
4. Children are not stored in metadata. They are derived from other skills' `parents` entries.
5. A child must not duplicate parent-owned templates. It may invoke the parent, verify the parent output, and add bounded child-owned extensions.
6. Bounded child extensions must be identified by stable headings or markers. With `overwrite=true`, refresh only those child-owned sections; do not rewrite unrelated parent-owned or user-authored content.
7. Sibling coordination belongs in the nearest common parent-owned contract. One child must not silently become another child's authority.

### Core AGENT File Boundaries

1. `AGENT.md` owns file roles, read order, local precedence, update routing, and boundary enforcement for the local contract only. It must not store mission, reusable playbook content, or live progress.
2. `AGENT_GOAL.md` owns durable mission, scope, non-goals, success criteria, and mission-level constraints. It is agent-immutable unless the user explicitly instructs a durable goal change.
3. `AGENT_HARNESS.md` owns reusable workflow rules and stable operating preferences. It must not record current blockers, artifact inventory, chronological logs, or mission amendments.
4. `AGENT_PROGRESS.md` owns live workspace state, concrete completed changes, execution blockers, and the canonical resume point. It must not define durable policy or revise the mission.
5. `AGENT.md` templates and any patch that defines read order, local precedence, update routing, or sidecar authority must include the higher-precedence caveat: local AGENT files do not override system, developer, user, repository, legal, security, venue, or tool instructions.
6. A normal user task may authorize current-turn work, but it does not silently amend durable mission, scope, non-goals, success criteria, constraints, or reusable rules.

### Mission, Objective, and Sidecar Rules

1. `mission` inputs must be durable and purpose-only. They must not include workflow rules, current state, next steps, transient objectives, or sidecar-specific task details.
2. `objective` inputs must be transient current work. They must not become a second mission statement, permanent scope, policy, or success criteria.
3. Sidecars are lower-precedence auxiliaries. If a later agent needs to read a sidecar, the generated workspace contract must register the sidecar read order and update routing; README-only instructions are not enough.
4. Sidecars must not become second copies of mission, harness, or progress. Durable rules belong in `AGENT_HARNESS.md`; execution blockers and canonical resume state belong in `AGENT_PROGRESS.md`.
5. If a sidecar records current state, define exactly which current-state facts it owns and which facts remain owned by `AGENT_PROGRESS.md`.

### Compatibility and Validation

1. With `overwrite=false`, inspect existing files before adopting them. Compatible files may be skipped; incompatible files must stop the run rather than creating a mixed contract.
2. JSON Schema validates shape only. Semantic checks such as clean mission text, transient objective text, compatible existing files, and bounded child patches must be documented in `SKILL.md`, `README.md`, and `tool.json` descriptions where relevant.
3. `skill.yaml:parents`, the skill `README.md ## Parents` section, and any tool/skill descriptions must agree. Do not leave stale parent references after changing ownership.
4. After boundary-related changes, run:

```bash
python3 scripts/validate_skills.py
python3 scripts/build_registry.py
python3 scripts/build_search_index.py
```

Generated `registry/*.json` files are build artifacts and should not be committed unless the repository policy changes.

### Finding child skills

Child skills are **not stored** — they are the inverse of `parents` and can be derived on demand. To list every skill that declares `<your-id>` as a parent, search the skills folder:

```bash
rg -n "^\s*-\s*<your-id>\s*$" skills/*/skill.yaml
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
