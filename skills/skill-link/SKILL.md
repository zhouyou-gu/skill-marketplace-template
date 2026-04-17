---
name: skill-link
description: Build and query the parent/child dependency graph across all skills in a marketplace. Use when auditing for overlapping functionality, finding consumers of a skill, or answering "what depends on X?" without storing a separate children list. Do not use this skill to edit skill metadata or create new skills.
---

# Skill Link

## Trigger

- Use when the caller wants a structured parent/child map across every skill under `skills/`.
- Use when checking whether a proposed new skill overlaps existing ones.
- Use when asked "which skills depend on `<id>`?" — children are derived, not stored.
- Do not use to write or modify any `skill.yaml` / `SKILL.md` files.

## Inputs

- `skills_root`: filesystem path to the marketplace `skills/` directory. Defaults to `"skills"` relative to the current working directory.
- `skill_id`: optional. When provided, return only the node for that skill (its declared parents plus derived children). Otherwise return the full graph.

## Workflow

1. Resolve `skills_root` and enumerate every immediate subdirectory that contains a `skill.yaml`.
2. For each skill, load `skill.yaml` and record `id` plus `parents` (an empty list when the field is absent).
3. Build a map `children: id -> [ids that declare id as a parent]` by inverting the `parents` relation.
4. If `skill_id` is supplied, return only the single node for that id. Otherwise return a sorted list of all nodes.
5. Flag any `parents` entry that does not match a known skill id as a warning — do not error; surfacing dangling references is part of the audit value.

## Outputs

- `nodes`: list of `{id, parents, children}` objects, sorted by `id`.
- `warnings`: list of human-readable strings for dangling parent references or malformed `skill.yaml` files.

## Failure / Escalation

- If `skills_root` does not exist, fail cleanly with a single warning and return an empty `nodes` list.
- If `skill_id` is supplied but not found, return `nodes: []` and a warning naming the missing id.
- If a `skill.yaml` fails to parse, skip it, add a warning, and continue — one bad file should not break the audit.

## Tool Contract

- Read [`tool.json`](tool.json) for the authoritative schema.
- `skills_root` is optional (default `"skills"`); `skill_id` is optional.
- A runnable reference implementation lives in [`examples/basic.py`](examples/basic.py).
