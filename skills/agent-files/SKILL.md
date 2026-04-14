---
name: agent-files
description: Scaffold AGENT.md, AGENT_GOAL.md, AGENT_HARNESS.md, and AGENT_PROGRESS.md into a target directory with strict, non-overlapping functional boundaries for governance, long-term mission, reusable playbook, and live state. Use when a workspace needs a disciplined, recoverable agent-file contract.
---

# Agent Files Scaffold

## Workflow

1. Receive `target_dir` and `mission`. Confirm the directory exists or create it. `mission` is required so the scaffolded contract is internally consistent the moment a later agent reads it; `AGENT_GOAL.md` is agent-immutable after scaffold and cannot be filled in autonomously later.
2. For each of `AGENT.md`, `AGENT_GOAL.md`, `AGENT_HARNESS.md`, `AGENT_PROGRESS.md`:
   - If the file already exists and `overwrite` is false, skip it and record the path in `files_skipped`.
   - Otherwise copy the corresponding template from `examples/` into `target_dir`. Substitute `mission` for the `{{ mission }}` placeholder in `AGENT_GOAL.md`. If `objective` is provided, substitute it for the `{{ objective }}` placeholder in `AGENT_PROGRESS.md`; if `objective` is omitted, remove the entire `## Current Objective` section from `AGENT_PROGRESS.md` rather than leaving a literal placeholder, so the file remains internally consistent.
3. Return `target_dir`, `files_created`, and `files_skipped`.

## Tool Contract

- Read [`tool.json`](tool.json) for the authoritative schema.
- Templates live in [`examples/`](examples/) as standalone markdown files and are copied into the target directory under the substitution rules in step 2 of the workflow above.
- `AGENT_GOAL.md` is agent-immutable after scaffold. Subsequent modifications require explicit user instruction.
