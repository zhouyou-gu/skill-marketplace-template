---
name: json-validation
description: Validate JSON payloads against JSON Schema and return machine-readable errors. Use when Codex needs to enforce config contracts, preflight API payloads, or verify structured files before downstream steps.
---

# JSON Validation

## Workflow

1. Load JSON input from `json_path` and schema from `schema_path`.
2. Run validation using the configured JSON Schema draft.
3. Collect deterministic error entries with `path`, `message`, and `keyword`.
4. Return a stable result object with validity and error details.

## Tool Contract

- Read [`tool.json`](tool.json) for the authoritative schema.
- Honor `max_errors` to keep responses bounded and predictable.
- Always return `valid`, `error_count`, and `errors`.
