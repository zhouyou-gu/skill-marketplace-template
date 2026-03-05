# Skills Directory Guide

This folder is the source of truth for all marketplace skills.

For full project context, architecture, and CI behavior, see the root README: [../README.md](../README.md).

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
├─ README.md
└─ examples/
   └─ basic.py
```

Need detailed field rules for `SKILL.md`, `skill.yaml`, and `tool.json`? See [../README.md](../README.md).
