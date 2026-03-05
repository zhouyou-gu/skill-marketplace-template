---
name: api-testing
description: Validate HTTP APIs with reusable request and assertion flows. Use when Codex needs to test REST or HTTP endpoints, assert status codes, or run repeatable API checks against a URL.
---

# API Testing

## Workflow

1. Collect `url`, `method`, and `expected_status`.
2. Execute the request using the selected HTTP method.
3. Compare the observed status code to `expected_status`.
4. Return a structured result with `passed` and `actual_status`.

## Tool Contract

- Read [`tool.json`](tool.json) for the authoritative input and output schema.
- Keep request execution idempotent when possible.
- Report assertion failures explicitly in the returned result.
