#!/usr/bin/env python3
"""Build registry/search.json from registry/index.json."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[1]
REGISTRY_PATH = ROOT / "registry" / "index.json"
SEARCH_PATH = ROOT / "registry" / "search.json"
SCHEMA_PATH = ROOT / "schemas" / "search.schema.json"

TOKEN_SPLIT_RE = re.compile(r"[^a-z0-9]+")


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def dump_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as fh:
        json.dump(payload, fh, indent=2, ensure_ascii=False)
        fh.write("\n")


def tokenize(text: str) -> list[str]:
    cleaned = TOKEN_SPLIT_RE.sub(" ", text.lower())
    tokens = [token for token in cleaned.split() if token]

    deduped: list[str] = []
    seen: set[str] = set()
    for token in tokens:
        if token in seen:
            continue
        seen.add(token)
        deduped.append(token)
    return deduped


def validate_output(search_index: list[dict[str, Any]]) -> None:
    schema = load_json(SCHEMA_PATH)
    validator = Draft202012Validator(schema)
    errors = sorted(validator.iter_errors(search_index), key=lambda item: list(item.absolute_path))
    if not errors:
        return

    lines = []
    for err in errors:
        location = ".".join(str(part) for part in err.absolute_path) or "<root>"
        lines.append(f"{location}: {err.message}")
    raise ValueError("Generated search index failed schema validation:\n" + "\n".join(lines))


def build_entry(skill: dict[str, Any]) -> dict[str, Any]:
    text_parts = [
        skill.get("name", ""),
        skill.get("description", ""),
        skill.get("category", ""),
        " ".join(skill.get("tags", [])),
    ]
    text = " ".join(part for part in text_parts if isinstance(part, str)).strip().lower()
    tokens = tokenize(text)

    return {
        "id": skill["id"],
        "category": skill["category"],
        "tokens": tokens,
        "text": text,
    }


def main() -> int:
    registry = load_json(REGISTRY_PATH)
    skills = registry.get("skills", [])

    if not isinstance(skills, list):
        raise ValueError("registry/index.json has invalid 'skills' payload")

    entries = [build_entry(skill) for skill in skills if isinstance(skill, dict)]
    entries.sort(key=lambda item: item["id"])

    validate_output(entries)
    dump_json(SEARCH_PATH, entries)

    print(f"Wrote {SEARCH_PATH.relative_to(ROOT)} with {len(entries)} entry(ies).")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
