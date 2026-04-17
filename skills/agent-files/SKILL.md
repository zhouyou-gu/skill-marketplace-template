---
name: agent-files
description: Scaffold AGENT.md, AGENT_GOAL.md, AGENT_HARNESS.md, and AGENT_PROGRESS.md into a target directory with strict, non-overlapping functional boundaries for governance, long-term mission, reusable playbook, and live state. Use when a workspace needs a disciplined, recoverable agent-file contract.
---

# Agent Files Scaffold

## Trigger

- Use when a workspace needs the four-file AGENT contract (`AGENT.md`, `AGENT_GOAL.md`, `AGENT_HARNESS.md`, `AGENT_PROGRESS.md`) scaffolded from scratch with strict, non-overlapping functional boundaries.
- Use when preparing a workspace to survive handoff between agents, where the caller wants a disciplined, recoverable contract on first read.
- Do not use to curate or revise an existing `AGENT_GOAL.md`; route to `research-goal-curator`.
- Do not use for LaTeX IEEE-style manuscript-revision workspaces that need the manuscript-specific variant or the optional `REVISION_TASK.md` sidecar; route to `manuscript-revision-agent-files`.
- Do not use when only a task checklist is needed and no durable four-file contract is wanted.

## Inputs

- `target_dir`: directory where the four AGENT files will be scaffolded
- `mission`: long-term mission string written into `AGENT_GOAL.md`; required so the scaffolded contract is internally consistent on first read
- `objective`: optional concrete in-flight objective written into `AGENT_PROGRESS.md`; when omitted, the `## Current Objective` section is removed rather than left as a literal placeholder
- `overwrite`: when true, existing files in `target_dir` are replaced; otherwise they are skipped and listed in `files_skipped`

## Workflow

1. Receive `target_dir` and `mission`. Confirm the directory exists or create it. `mission` is required so the scaffolded contract is internally consistent the moment a later agent reads it; `AGENT_GOAL.md` is agent-immutable after scaffold and cannot be filled in autonomously later.
2. For each of `AGENT.md`, `AGENT_GOAL.md`, `AGENT_HARNESS.md`, `AGENT_PROGRESS.md`:
   - If the file already exists and `overwrite` is false, skip it and record the path in `files_skipped`.
   - Otherwise copy the corresponding template from `examples/` into `target_dir`. Substitute `mission` for the `{{ mission }}` placeholder in `AGENT_GOAL.md`. If `objective` is provided, substitute it for the `{{ objective }}` placeholder in `AGENT_PROGRESS.md`; if `objective` is omitted, remove the entire `## Current Objective` section from `AGENT_PROGRESS.md` rather than leaving a literal placeholder, so the file remains internally consistent.
3. Return `target_dir`, `files_created`, and `files_skipped`.

## Outputs

- `target_dir`
- `files_created`
- `files_skipped`

## Failure / Escalation

- If `target_dir` cannot be created or is not writable, fail cleanly with an explicit error and write no files.
- If `mission` is missing, empty, or still a placeholder, stop and ask the user for a concrete mission before writing — `AGENT_GOAL.md` must be internally consistent on first read.
- If `target_dir` already contains some of the four files and `overwrite` is false, proceed and record them in `files_skipped`; this is not an error.
- If the caller wants to refine an existing `AGENT_GOAL.md`, do not re-scaffold; route to `research-goal-curator`.

## Tool Contract

- Read [`tool.json`](tool.json) for the authoritative schema.
- Templates live in [`examples/`](examples/) as standalone markdown files and are copied into the target directory under the substitution rules in step 2 of the workflow above.
- `AGENT_GOAL.md` is agent-immutable after scaffold. Subsequent modifications require explicit user instruction.
