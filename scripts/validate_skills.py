#!/usr/bin/env python3
"""Validate marketplace config and skills against strict JSON Schemas."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

import yaml
from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parents[1]
SCHEMAS_DIR = ROOT / "schemas"
SKILLS_DIR = ROOT / "skills"
CONFIG_PATH = ROOT / "config" / "marketplace.json"


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def load_yaml(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as fh:
        return yaml.safe_load(fh)


def make_validator(schema_name: str) -> Draft202012Validator:
    schema = load_json(SCHEMAS_DIR / schema_name)
    return Draft202012Validator(schema, format_checker=FormatChecker())


def collect_schema_errors(
    validator: Draft202012Validator,
    instance: Any,
    label: str,
    errors: list[str],
) -> None:
    for err in sorted(validator.iter_errors(instance), key=lambda item: list(item.absolute_path)):
        location = ".".join(str(part) for part in err.absolute_path) or "<root>"
        errors.append(f"{label}:{location}: {err.message}")


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []

    config_validator = make_validator("config.schema.json")
    skill_validator = make_validator("skill.schema.json")
    tool_validator = make_validator("tool.schema.json")

    if not CONFIG_PATH.exists():
        errors.append(f"missing file: {CONFIG_PATH}")
        config: dict[str, Any] = {}
    else:
        try:
            config = load_json(CONFIG_PATH)
        except Exception as exc:  # pragma: no cover - defensive parsing path
            errors.append(f"{CONFIG_PATH}: unable to parse JSON ({exc})")
            config = {}

    if config:
        collect_schema_errors(config_validator, config, str(CONFIG_PATH.relative_to(ROOT)), errors)

    allowed_categories = set(config.get("categories", []))

    if not SKILLS_DIR.exists():
        errors.append(f"missing directory: {SKILLS_DIR}")
        skill_dirs: list[Path] = []
    else:
        skill_dirs = sorted(path for path in SKILLS_DIR.iterdir() if path.is_dir())

    if not skill_dirs:
        warnings.append("No skills found under skills/. Add at least one skill folder.")

    seen_skill_ids: dict[str, Path] = {}
    tool_name_to_ids: dict[str, list[str]] = {}

    for skill_dir in skill_dirs:
        skill_yaml_path = skill_dir / "skill.yaml"
        readme_path = skill_dir / "README.md"

        if not readme_path.exists():
            errors.append(f"{readme_path.relative_to(ROOT)}: missing required file")

        if not skill_yaml_path.exists():
            errors.append(f"{skill_yaml_path.relative_to(ROOT)}: missing required file")
            continue

        try:
            skill_data = load_yaml(skill_yaml_path)
        except Exception as exc:
            errors.append(f"{skill_yaml_path.relative_to(ROOT)}: unable to parse YAML ({exc})")
            continue

        if not isinstance(skill_data, dict):
            errors.append(f"{skill_yaml_path.relative_to(ROOT)}:<root>: expected mapping object")
            continue

        collect_schema_errors(skill_validator, skill_data, str(skill_yaml_path.relative_to(ROOT)), errors)

        skill_id = skill_data.get("id")
        if isinstance(skill_id, str):
            if skill_id != skill_dir.name:
                errors.append(
                    f"{skill_yaml_path.relative_to(ROOT)}:id: '{skill_id}' must match folder '{skill_dir.name}'"
                )

            if skill_id in seen_skill_ids:
                original = seen_skill_ids[skill_id].relative_to(ROOT)
                errors.append(
                    f"{skill_yaml_path.relative_to(ROOT)}:id: duplicate skill id '{skill_id}' "
                    f"(already defined in {original})"
                )
            else:
                seen_skill_ids[skill_id] = skill_yaml_path

        category = skill_data.get("category")
        if isinstance(category, str) and allowed_categories and category not in allowed_categories:
            errors.append(
                f"{skill_yaml_path.relative_to(ROOT)}:category: '{category}' not in config categories "
                f"{sorted(allowed_categories)}"
            )

        agent = skill_data.get("agent", {})
        tool_schema_rel = None
        if isinstance(agent, dict):
            tool_schema_rel = agent.get("tool_schema")

        if not isinstance(tool_schema_rel, str):
            continue

        tool_path = (skill_dir / tool_schema_rel).resolve()
        try:
            tool_rel = tool_path.relative_to(ROOT)
        except ValueError:
            errors.append(
                f"{skill_yaml_path.relative_to(ROOT)}:agent.tool_schema: '{tool_schema_rel}' resolves outside repository"
            )
            continue

        if not tool_path.exists():
            errors.append(
                f"{skill_yaml_path.relative_to(ROOT)}:agent.tool_schema: referenced file missing ({tool_rel})"
            )
            continue

        try:
            tool_data = load_json(tool_path)
        except Exception as exc:
            errors.append(f"{tool_rel}: unable to parse JSON ({exc})")
            continue

        collect_schema_errors(tool_validator, tool_data, str(tool_rel), errors)

        tool_name = tool_data.get("name")
        if isinstance(tool_name, str) and isinstance(skill_id, str):
            tool_name_to_ids.setdefault(tool_name, []).append(skill_id)

    for tool_name, skill_ids in sorted(tool_name_to_ids.items()):
        if len(skill_ids) > 1:
            warnings.append(
                f"tool name collision '{tool_name}' appears in skills: {', '.join(sorted(skill_ids))}"
            )

    for warning in warnings:
        print(f"WARNING: {warning}")

    if errors:
        print(f"Validation failed with {len(errors)} error(s):")
        for err in errors:
            print(f"  - {err}")
        return 1

    print(f"Validation passed: {len(skill_dirs)} skill(s) checked.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
