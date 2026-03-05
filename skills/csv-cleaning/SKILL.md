---
name: csv-cleaning
description: Clean and normalize CSV datasets by trimming text, dropping duplicates, and filling missing values. Use when Codex needs CSV preprocessing before analysis, import, or reporting.
---

# CSV Cleaning

## Workflow

1. Load the source CSV from `csv_path`.
2. Optionally trim whitespace in string columns.
3. Optionally fill missing values using `fill_missing`.
4. Optionally remove duplicate rows.
5. Write cleaned output and return summary statistics.

## Tool Contract

- Read [`tool.json`](tool.json) for the authoritative schema.
- Use `output_path` when provided, otherwise emit a deterministic default.
- Return `cleaned_path`, row counts, and column summary fields.
