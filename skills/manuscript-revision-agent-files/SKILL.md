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
- `mission`: one- or two-sentence long-term manuscript-revision mission statement written into `AGENT_GOAL.md`; required so the scaffolded contract is internally consistent on first read. It must not include reusable editing rules, formatting preferences, current task state, response-letter next steps, or transient objectives.
- `objective`: optional concrete in-flight objective written into `AGENT_PROGRESS.md`; it must be transient current manuscript/revision work, not a second mission statement or permanent scope rule. When omitted, the `## Current Objective` section is removed rather than left as a literal placeholder
- `revision_mode`: `manuscript_only` (default) or `manuscript_and_response_letter`; the latter also scaffolds `REVISION_TASK.md`
- `overwrite`: when true, existing scaffold files in `target_dir` are replaced; otherwise only compatible existing files are recorded in `files_skipped`

## Workflow

1. Receive `target_dir` and `mission`. Confirm the directory exists or create it. `mission` is required so the scaffolded contract is internally consistent the moment a later agent reads it; `AGENT_GOAL.md` is agent-immutable after scaffold and cannot be filled in autonomously later.
2. Resolve `revision_mode`. If it is omitted, default to `manuscript_only`.
3. Classify the supplied `mission` and optional `objective` before writing:
   - manuscript-level purpose belongs in `mission`
   - transient current revision work belongs in `objective`
   - durable editing, notation, citation, validation, and formatting rules belong in future `AGENT_HARNESS.md` updates, not in `mission`
   - current repository state, blockers, reviewer items, response-letter next steps, and artifact mapping belong in future `AGENT_PROGRESS.md` or `REVISION_TASK.md` updates, not in `mission`
4. Before partial adoption, inspect any existing `AGENT.md`, `AGENT_GOAL.md`, `AGENT_HARNESS.md`, `AGENT_PROGRESS.md`, or `REVISION_TASK.md` in `target_dir`. If any of these files already exist and `overwrite` is false, proceed only when every existing core AGENT file passes the compatibility checklist below; otherwise stop and ask whether to use `overwrite=true` or choose a clean target directory. Do not mix boundary-aware files with incompatible older files.
   - `AGENT.md` must start with `# Agent Control` and contain the phrase `control contract`.
   - `AGENT_GOAL.md` must start with `# Mission` and contain the phrase `agent-immutable`.
   - `AGENT_HARNESS.md` must start with `# Workspace Harness` and contain the phrase `reusable playbook`.
   - `AGENT_PROGRESS.md` must start with `# Progress` and contain the phrase `live-state record`.
   - `REVISION_TASK.md`, when present, must not claim to override the core four-file contract.
5. For each of `AGENT.md`, `AGENT_GOAL.md`, `AGENT_HARNESS.md`, `AGENT_PROGRESS.md`:
   - If the file already exists and `overwrite` is false, skip it and record the path in `files_skipped`.
   - Otherwise copy the corresponding template from `examples/` into `target_dir`. Substitute `mission` for the `{{ mission }}` placeholder in `AGENT_GOAL.md`; the remaining goal sections render as explicit "not yet specified by user" entries rather than instructional placeholders, so they are not mistaken for user-approved manuscript scope. If `objective` is provided, substitute it for the `{{ objective }}` placeholder in `AGENT_PROGRESS.md`; if `objective` is omitted, remove the entire `## Current Objective` section from `AGENT_PROGRESS.md` rather than leaving a literal placeholder, so the file remains internally consistent.
6. If `revision_mode` is `manuscript_and_response_letter`, apply the same compatibility-aware skip-or-overwrite rule to `REVISION_TASK.md` and copy the corresponding template from `examples/` into `target_dir`.
7. Return `target_dir`, `files_created`, and `files_skipped`.

## Outputs

- `target_dir`
- `files_created`
- `files_skipped`

## Failure / Escalation

- If `target_dir` cannot be created or is not writable, fail cleanly with an explicit error and write no files.
- If `mission` is missing, empty, not manuscript-specific, still a placeholder, or mixes in workflow rules/current state/next steps, stop and ask the user for a clean manuscript-revision mission before writing; if the mission is generic and not manuscript-related, route to `agent-files` instead.
- If `objective` is supplied but reads like permanent mission, manuscript scope, policy, or success criteria, stop and ask the user to reframe it as transient current work or omit it.
- If `target_dir` already contains any scaffold file and `overwrite` is false, proceed only after compatibility inspection. If existing files do not match this contract, stop rather than silently creating a mixed-boundary system.
- If the caller wants to refine an existing `AGENT_GOAL.md`, do not re-scaffold; route to `research-goal-curator`.
- If the caller wants only the `REVISION_TASK.md` sidecar without the four-file contract, stop and explain that the sidecar is lower-precedence and not authoritative on its own.

## Tool Contract

- Read [`tool.json`](tool.json) for the authoritative schema.
- The JSON schema enforces input/output shape only. The semantic checks for clean `mission`, transient `objective`, and compatible partial adoption are workflow requirements enforced before writing files.
- Templates live in [`examples/`](examples/) as standalone markdown files and are copied into `target_dir` under the substitution rules in step 5 of the workflow above.
- The four AGENT files are always scaffolded. `REVISION_TASK.md` is scaffolded only when `revision_mode` is `manuscript_and_response_letter`.
- `AGENT_GOAL.md` is agent-immutable after scaffold. Subsequent modifications require explicit user instruction.
- `REVISION_TASK.md` is an optional auxiliary brief outside the core four-file control-system precedence. It is read after `AGENT_PROGRESS.md` when present and relevant, and it cannot override the core four files.
