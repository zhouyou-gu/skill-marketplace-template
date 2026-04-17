---
name: manuscript-revision-agent-files
description: Scaffold AGENT.md, AGENT_GOAL.md, AGENT_HARNESS.md, and AGENT_PROGRESS.md for LaTeX IEEE-style manuscript revision, with an optional REVISION_TASK.md sidecar for joint manuscript and response-letter drafting. Use when a workspace needs a disciplined, recoverable manuscript-revision agent-file contract.
---

# Manuscript Revision Agent Files Scaffold

## Trigger

- Use when a LaTeX IEEE-style manuscript-revision workspace needs the four-file AGENT contract scaffolded with manuscript-specific templates.
- Use when joint manuscript and response-letter drafting requires the optional `REVISION_TASK.md` sidecar alongside the four core AGENT files.
- Do not use for generic agent-file scaffolding; route to `agent-files`.
- Do not use to curate or revise an existing `AGENT_GOAL.md`; route to `research-goal-curator`.
- Do not use when only `REVISION_TASK.md` is wanted without the core four-file contract — the sidecar is lower precedence than the control contract and is not authoritative on its own.

## Inputs

- `target_dir`: directory where the manuscript-revision AGENT files will be scaffolded
- `mission`: long-term manuscript-revision mission written into `AGENT_GOAL.md`; required so the scaffolded contract is internally consistent on first read
- `objective`: optional concrete in-flight objective written into `AGENT_PROGRESS.md`; when omitted, the `## Current Objective` section is removed rather than left as a literal placeholder
- `revision_mode`: `manuscript_only` (default) or `manuscript_and_response_letter`; the latter also scaffolds `REVISION_TASK.md`
- `overwrite`: when true, existing scaffold files in `target_dir` are replaced; otherwise they are skipped and listed in `files_skipped`

## Workflow

1. Receive `target_dir` and `mission`. Confirm the directory exists or create it. `mission` is required so the scaffolded contract is internally consistent the moment a later agent reads it; `AGENT_GOAL.md` is agent-immutable after scaffold and cannot be filled in autonomously later.
2. Resolve `revision_mode`. If it is omitted, default to `manuscript_only`.
3. For each of `AGENT.md`, `AGENT_GOAL.md`, `AGENT_HARNESS.md`, `AGENT_PROGRESS.md`:
   - If the file already exists and `overwrite` is false, skip it and record the path in `files_skipped`.
   - Otherwise copy the corresponding template from `examples/` into `target_dir`. Substitute `mission` for the `{{ mission }}` placeholder in `AGENT_GOAL.md`. If `objective` is provided, substitute it for the `{{ objective }}` placeholder in `AGENT_PROGRESS.md`; if `objective` is omitted, remove the entire `## Current Objective` section from `AGENT_PROGRESS.md` rather than leaving a literal placeholder, so the file remains internally consistent.
4. If `revision_mode` is `manuscript_and_response_letter`, apply the same skip-or-overwrite rule to `REVISION_TASK.md` and copy the corresponding template from `examples/` into `target_dir`.
5. Return `target_dir`, `files_created`, and `files_skipped`.

## Outputs

- `target_dir`
- `files_created`
- `files_skipped`

## Failure / Escalation

- If `target_dir` cannot be created or is not writable, fail cleanly with an explicit error and write no files.
- If `mission` is missing, empty, or not manuscript-specific, stop and ask the user for a concrete manuscript-revision mission before writing; if the mission is generic and not manuscript-related, route to `agent-files` instead.
- If `target_dir` already contains some of the scaffold files and `overwrite` is false, proceed and record them in `files_skipped`; this is not an error.
- If the caller wants to refine an existing `AGENT_GOAL.md`, do not re-scaffold; route to `research-goal-curator`.
- If the caller wants only the `REVISION_TASK.md` sidecar without the four-file contract, stop and explain that the sidecar is lower-precedence and not authoritative on its own.

## Tool Contract

- Read [`tool.json`](tool.json) for the authoritative schema.
- Templates live in [`examples/`](examples/) as standalone markdown files and are copied into `target_dir` under the substitution rules in step 3 of the workflow above.
- The four AGENT files are always scaffolded. `REVISION_TASK.md` is scaffolded only when `revision_mode` is `manuscript_and_response_letter`.
- `AGENT_GOAL.md` is agent-immutable after scaffold. Subsequent modifications require explicit user instruction.
- `REVISION_TASK.md` is an optional auxiliary brief outside the core four-file control-system precedence. It is read after `AGENT_PROGRESS.md` when present and relevant, and it cannot override the core four files.
