"""Minimal local example for json-validation skill behavior."""

from __future__ import annotations

import json
from pathlib import Path

from jsonschema import Draft202012Validator


def json_validate(json_path: str, schema_path: str, max_errors: int = 20) -> dict[str, object]:
    payload = json.loads(Path(json_path).read_text(encoding="utf-8"))
    schema = json.loads(Path(schema_path).read_text(encoding="utf-8"))

    validator = Draft202012Validator(schema)
    errors: list[dict[str, str]] = []

    for err in validator.iter_errors(payload):
        path = "/".join(str(part) for part in err.path) or "<root>"
        errors.append(
            {
                "path": path,
                "message": err.message,
                "keyword": str(err.validator),
            }
        )
        if len(errors) >= max_errors:
            break

    return {
        "valid": len(errors) == 0,
        "error_count": len(errors),
        "errors": errors,
    }


if __name__ == "__main__":
    print(
        json_validate(
            json_path="./input.json",
            schema_path="./schema.json",
            max_errors=10,
        )
    )
