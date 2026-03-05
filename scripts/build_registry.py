#!/usr/bin/env python3
"""Build registry/index.json from skill metadata and tool schema summaries."""

from __future__ import annotations

import json
import subprocess
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


def get_git_remote_url() -> str | None:
    """Get the git remote URL for the current repository."""
    try:
        result = subprocess.run(
            ["git", "config", "--get", "remote.origin.url"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=False,
            timeout=5,
        )
        if result.returncode == 0 and result.stdout.strip():
            url = result.stdout.strip()
            # Convert SSH to HTTPS format
            if url.startswith("git@github.com:"):
                url = url.replace("git@github.com:", "https://github.com/")
            # Remove .git suffix
            if url.endswith(".git"):
                url = url[:-4]
            return url
    except (subprocess.TimeoutExpired, FileNotFoundError):
        pass
    return None


def resolve_marketplace_url(config: dict[str, Any]) -> str:
    """Resolve marketplace URL deterministically from config."""
    url = config.get("url")
    if isinstance(url, str) and url.startswith("https://"):
        return url
    return "https://<user>.github.io/<repo>"


def resolve_skill_repo_url(skill_id: str, skill_data: dict[str, Any]) -> str:
    """Resolve skill repository URL, auto-detecting from git if using example URL."""
    repo_url = skill_data.get("repo", "")
    
    # If it's not an example URL, use it as-is
    if not repo_url.startswith("https://github.com/example/"):
        return repo_url
    
    # Try to auto-detect from git
    git_url = get_git_remote_url()
    if git_url and git_url.startswith("https://github.com/"):
        # Point to the skill directory in the actual repository
        return f"{git_url}/tree/main/skills/{skill_id}"
    
    # Fallback to the original example URL if git detection fails
    return repo_url


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
        "repo": resolve_skill_repo_url(skill_id, skill_data),
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
            "author": config.get("author"),
            "license": config.get("license"),
            "url": resolve_marketplace_url(config),
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
