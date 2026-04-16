---
name: manuscript-revision-agent-files
description: Scaffold AGENT.md, AGENT_GOAL.md, AGENT_HARNESS.md, and AGENT_PROGRESS.md for LaTeX IEEE-style manuscript revision, with an optional REVISION_TASK.md sidecar for joint manuscript and response-letter drafting. Use when a workspace needs a disciplined, recoverable manuscript-revision agent-file contract.
---

# Manuscript Revision Agent Files Scaffold

## Workflow

1. Receive `target_dir` and `mission`. Confirm the directory exists or create it. `mission` is required so the scaffolded contract is internally consistent the moment a later agent reads it; `AGENT_GOAL.md` is agent-immutable after scaffold and cannot be filled in autonomously later.
2. Resolve `revision_mode`. If it is omitted, default to `manuscript_only`.
3. For each of `AGENT.md`, `AGENT_GOAL.md`, `AGENT_HARNESS.md`, `AGENT_PROGRESS.md`:
   - If the file already exists and `overwrite` is false, skip it and record the path in `files_skipped`.
   - Otherwise copy the corresponding template from `examples/` into `target_dir`. Substitute `mission` for the `{{ mission }}` placeholder in `AGENT_GOAL.md`. If `objective` is provided, substitute it for the `{{ objective }}` placeholder in `AGENT_PROGRESS.md`; if `objective` is omitted, remove the entire `## Current Objective` section from `AGENT_PROGRESS.md` rather than leaving a literal placeholder, so the file remains internally consistent.
4. If `revision_mode` is `manuscript_and_response_letter`, apply the same skip-or-overwrite rule to `REVISION_TASK.md` and copy the corresponding template from `examples/` into `target_dir`.
5. Return `target_dir`, `files_created`, and `files_skipped`.

## Tool Contract

- Read [`tool.json`](tool.json) for the authoritative schema.
- Templates live in [`examples/`](examples/) as standalone markdown files and are copied into `target_dir` under the substitution rules in step 3 of the workflow above.
- The four AGENT files are always scaffolded. `REVISION_TASK.md` is scaffolded only when `revision_mode` is `manuscript_and_response_letter`.
- `AGENT_GOAL.md` is agent-immutable after scaffold. Subsequent modifications require explicit user instruction.
- `REVISION_TASK.md` is an optional auxiliary brief outside the core four-file control-system precedence. It is read after `AGENT_PROGRESS.md` when present and relevant, and it cannot override the core four files.
