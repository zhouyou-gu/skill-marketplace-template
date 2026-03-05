#!/usr/bin/env python3
"""Build registry/index.json from skill metadata and tool schema summaries."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from typing import Any

import yaml
from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "config" / "marketplace.json"
SKILLS_DIR = ROOT / "skills"
REGISTRY_PATH = ROOT / "registry" / "index.json"
SCHEMAS_DIR = ROOT / "schemas"


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def load_yaml(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as fh:
        return yaml.safe_load(fh)


def dump_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as fh:
        json.dump(payload, fh, indent=2, ensure_ascii=False)
        fh.write("\n")


def detect_marketplace_url() -> str:
    repo = os.getenv("GITHUB_REPOSITORY", "")
    if "/" in repo:
        owner, name = repo.split("/", 1)
        return f"https://{owner}.github.io/{name}"
    return "https://<user>.github.io/<repo>"


def validate_output(registry: dict[str, Any]) -> None:
    schema = load_json(SCHEMAS_DIR / "registry.schema.json")
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    errors = sorted(validator.iter_errors(registry), key=lambda item: list(item.absolute_path))
    if not errors:
        return

    lines = []
    for err in errors:
        location = ".".join(str(part) for part in err.absolute_path) or "<root>"
        lines.append(f"{location}: {err.message}")
    message = "\n".join(lines)
    raise ValueError(f"Generated registry failed schema validation:\n{message}")


def build_skill_entry(skill_dir: Path) -> dict[str, Any]:
    skill_path = skill_dir / "skill.yaml"
    skill_data = load_yaml(skill_path)

    if not isinstance(skill_data, dict):
        raise ValueError(f"{skill_path.relative_to(ROOT)} must be a mapping")

    skill_id = skill_data.get("id")
    if not isinstance(skill_id, str):
        raise ValueError(f"{skill_path.relative_to(ROOT)} missing string id")

    agent = skill_data.get("agent", {})
    if not isinstance(agent, dict):
        raise ValueError(f"{skill_path.relative_to(ROOT)} has invalid agent block")

    tool_schema_rel = agent.get("tool_schema", "tool.json")
    if not isinstance(tool_schema_rel, str):
        raise ValueError(f"{skill_path.relative_to(ROOT)} has invalid agent.tool_schema")

    tool_path = (skill_dir / tool_schema_rel).resolve()
    if not tool_path.exists():
        raise ValueError(
            f"{skill_path.relative_to(ROOT)} references missing tool schema {tool_schema_rel}"
        )

    tool_data = load_json(tool_path)
    if not isinstance(tool_data, dict):
        raise ValueError(f"{tool_path.relative_to(ROOT)} must be an object")

    install = skill_data.get("install", {})
    if not isinstance(install, dict):
        raise ValueError(f"{skill_path.relative_to(ROOT)} install must be an object")

    install_payload: dict[str, str] = {}
    for key in ("pip", "npm"):
        value = install.get(key)
        if isinstance(value, str) and value:
            install_payload[key] = value

    tool_schema_path = tool_path.relative_to(ROOT).as_posix()

    return {
        "id": skill_id,
        "name": skill_data["name"],
        "description": skill_data["description"],
        "category": skill_data["category"],
        "tags": skill_data["tags"],
        "difficulty": skill_data["difficulty"],
        "repo": skill_data["repo"],
        "path": f"skills/{skill_id}",
        "install": install_payload,
        "agent": {
            "protocol": skill_data["agent"]["protocol"],
            "tool_schema": tool_schema_path,
        },
        "tool": {
            "name": tool_data["name"],
            "title": tool_data["title"],
            "description": tool_data["description"],
        },
    }


def main() -> int:
    config = load_json(CONFIG_PATH)
    skill_dirs = sorted(path for path in SKILLS_DIR.iterdir() if path.is_dir())

    skills: list[dict[str, Any]] = []
    for skill_dir in skill_dirs:
        if not (skill_dir / "skill.yaml").exists():
            continue
        skills.append(build_skill_entry(skill_dir))

    skills.sort(key=lambda item: item["id"])

    registry = {
        "version": "1.0.0",
        "marketplace": {
            "title": config["title"],
            "description": config["description"],
            "url": detect_marketplace_url(),
            "theme": config["theme"],
            "categories": config["categories"],
        },
        "skills": skills,
    }

    validate_output(registry)
    dump_json(REGISTRY_PATH, registry)

    print(f"Wrote {REGISTRY_PATH.relative_to(ROOT)} with {len(skills)} skill(s).")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
