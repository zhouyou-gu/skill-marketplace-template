# Skill Link

`skill-link` derives the parent/child dependency graph across every skill in a marketplace by reading each `skill.yaml`.

Children are never stored on disk — they are the inverse of `parents`. This skill is the canonical answer to "which skills depend on `<id>`?" without introducing dual-maintenance.

## Use It When

- auditing the marketplace for overlapping or duplicate skills
- checking who depends on a skill before deprecating or renaming it
- answering "what are the children of `<id>`?" in a reviewer-friendly format

## Inputs

- `skills_root` — path to the `skills/` directory (default `"skills"`)
- `skill_id` — optional; return only that node

## Outputs

- `nodes` — list of `{id, parents, children}`, sorted by `id`
- `warnings` — dangling parent references or malformed `skill.yaml` files

## Example

From the repository root:

```bash
python3 skills/skill-link/examples/basic.py skills
```

Or for a single skill:

```bash
python3 skills/skill-link/examples/basic.py skills agent-files
```

## Parents

None. `skill-link` is a meta/audit skill and does not depend on other skills.
