#!/usr/bin/env python3
"""Build the parent/child dependency graph across a skills directory.

Usage:
    python3 basic.py [skills_root] [skill_id]

Defaults:
    skills_root = "skills" (relative to cwd)
    skill_id    = None     (return the full graph)
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import yaml


def build_graph(skills_root: Path, only_id: str | None = None) -> dict:
    warnings: list[str] = []

    if not skills_root.is_dir():
        return {"nodes": [], "warnings": [f"skills_root does not exist: {skills_root}"]}

    parents_by_id: dict[str, list[str]] = {}
    for skill_dir in sorted(p for p in skills_root.iterdir() if p.is_dir()):
        skill_yaml = skill_dir / "skill.yaml"
        if not skill_yaml.exists():
            continue
        try:
            data = yaml.safe_load(skill_yaml.read_text(encoding="utf-8"))
        except Exception as exc:
            warnings.append(f"{skill_yaml}: unable to parse YAML ({exc})")
            continue
        if not isinstance(data, dict):
            warnings.append(f"{skill_yaml}: expected mapping object")
            continue
        skill_id = data.get("id")
        if not isinstance(skill_id, str):
            continue
        parents = data.get("parents") or []
        if not isinstance(parents, list):
            warnings.append(f"{skill_yaml}: 'parents' must be a list")
            parents = []
        parents_by_id[skill_id] = [p for p in parents if isinstance(p, str)]

    known = set(parents_by_id.keys())
    children_by_id: dict[str, list[str]] = {sid: [] for sid in known}
    for skill_id, parents in parents_by_id.items():
        for parent_id in parents:
            if parent_id not in known:
                warnings.append(
                    f"{skill_id}: declares parent '{parent_id}' which is not a known skill"
                )
                continue
            children_by_id[parent_id].append(skill_id)

    nodes = [
        {
            "id": sid,
            "parents": sorted(parents_by_id[sid]),
            "children": sorted(children_by_id[sid]),
        }
        for sid in sorted(known)
    ]

    if only_id is not None:
        nodes = [n for n in nodes if n["id"] == only_id]
        if not nodes:
            warnings.append(f"skill_id '{only_id}' not found")

    return {"nodes": nodes, "warnings": warnings}


def main(argv: list[str]) -> int:
    skills_root = Path(argv[1]) if len(argv) > 1 else Path("skills")
    skill_id = argv[2] if len(argv) > 2 else None
    result = build_graph(skills_root, skill_id)
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
