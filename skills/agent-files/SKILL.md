---
name: agent-files
description: Scaffold AGENT.md, AGENT_GOAL.md, AGENT_HARNESS.md, and AGENT_PROGRESS.md into a target directory with strict, non-overlapping functional boundaries for governance, long-term mission, reusable playbook, and live state. Use when a workspace needs a disciplined, recoverable agent-file contract.
---

# Agent Files Scaffold

## Trigger

- Use when a workspace needs the four-file AGENT contract (`AGENT.md`, `AGENT_GOAL.md`, `AGENT_HARNESS.md`, `AGENT_PROGRESS.md`) scaffolded from scratch with strict, non-overlapping functional boundaries.
- Use when preparing a workspace to survive handoff between agents, where the caller wants a disciplined, recoverable contract on first read.
- Do not use to curate or revise an existing `AGENT_GOAL.md`; goal curation is outside this scaffold's write surface.
- Do not use when the caller explicitly asks for a domain-specific AGENT-file scaffolder or sidecar-aware workflow; this generic scaffold owns only the base four-file contract.
- Do not use when only a task checklist is needed and no durable four-file contract is wanted.

## Inputs

- `target_dir`: directory where the four AGENT files will be scaffolded
- `mission`: one- or two-sentence long-term mission statement written into `AGENT_GOAL.md`; required so the scaffolded contract is internally consistent on first read. It must not include reusable workflow rules, formatting preferences, current task state, next steps, or transient objectives.
- `objective`: optional concrete in-flight objective written into `AGENT_PROGRESS.md`; it must be transient current work, not a second mission statement or permanent scope rule. When omitted, the `## Current Objective` section is removed rather than left as a literal placeholder.
- `overwrite`: when true, existing files in `target_dir` are replaced; otherwise only compatible existing files are recorded in `files_skipped`

## Workflow

1. Receive `target_dir` and `mission`. Confirm the directory exists or create it. `mission` is required so the scaffolded contract is internally consistent the moment a later agent reads it; `AGENT_GOAL.md` is agent-immutable after scaffold and cannot be filled in autonomously later.
2. Classify the supplied `mission` and optional `objective` before writing:
   - mission-level purpose belongs in `mission`
   - transient current work belongs in `objective`
   - reusable workflow rules and preferences belong in future `AGENT_HARNESS.md` updates, not in `mission`
   - current repository state, blockers, and next steps belong in future `AGENT_PROGRESS.md` updates, not in `mission`
3. Before partial adoption, inspect any existing `AGENT.md`, `AGENT_GOAL.md`, `AGENT_HARNESS.md`, or `AGENT_PROGRESS.md` in `target_dir`. If any of these files already exist and `overwrite` is false, proceed only when every existing file passes the hardened compatibility checklist below; otherwise stop and ask whether to use `overwrite=true` or choose a clean target directory. Do not mix boundary-aware files with incompatible older files.
   - `AGENT.md` must start with `# Agent Control` and contain the phrase `control contract`, the higher-precedence caveat including `venue`, `## Boundary Audit Checklist`, a precedence section, an update-routing or update-dispatcher section, and the dispatcher-maintenance terminal condition.
   - `AGENT_GOAL.md` must start with `# Mission`, contain the phrase `agent-immutable`, and preserve neutral scaffold entries such as `Not yet specified by user` rather than instructional placeholders.
   - `AGENT_HARNESS.md` must start with `# Workspace Harness`, contain the phrase `reusable playbook`, use `## Stable Operating Context`, include `## Reusable Preferences`, and preserve the neutral reusable-preference placeholder or real durable rules.
   - `AGENT_PROGRESS.md` must start with `# Progress`, contain the phrase `live-state record`, include the neutral completed-changes entry `No completed changes recorded yet.` or real factual progress, and contain no literal `{{ objective }}` placeholder.
4. For each of `AGENT.md`, `AGENT_GOAL.md`, `AGENT_HARNESS.md`, `AGENT_PROGRESS.md`:
   - If the file already exists and `overwrite` is false, skip it and record the path in `files_skipped`.
   - Otherwise copy the corresponding template from `examples/` into `target_dir`. Substitute `mission` for the `{{ mission }}` placeholder in `AGENT_GOAL.md`; the remaining goal sections render as explicit "not yet specified by user" entries rather than instructional placeholders, so they are not mistaken for user-approved scope. If `objective` is provided, substitute it for the `{{ objective }}` placeholder in `AGENT_PROGRESS.md`; if `objective` is omitted, remove the entire `## Current Objective` section from `AGENT_PROGRESS.md` rather than leaving a literal placeholder, so the file remains internally consistent.
5. Return `target_dir`, `files_created`, and `files_skipped`.

## Outputs

- `target_dir`
- `files_created`
- `files_skipped`

## Failure / Escalation

- If `target_dir` cannot be created or is not writable, fail cleanly with an explicit error and write no files.
- If `mission` is missing, empty, still a placeholder, or mixes in workflow rules/current state/next steps, stop and ask the user for a clean mission before writing — `AGENT_GOAL.md` must be internally consistent on first read.
- If `objective` is supplied but reads like permanent mission, scope, policy, or success criteria, stop and ask the user to reframe it as transient current work or omit it.
- If `target_dir` already contains any of the four files and `overwrite` is false, proceed only after hardened compatibility inspection. If the existing files do not match this four-file contract, including the precedence caveat and boundary-audit/update-routing or update-dispatcher semantics, stop rather than silently creating a mixed-boundary system.
- If the caller wants to refine an existing `AGENT_GOAL.md`, do not re-scaffold; goal curation is outside this scaffold's write surface.

## Tool Contract

- Read [`tool.json`](tool.json) for the authoritative schema.
- The JSON schema enforces input/output shape only. The semantic checks for clean `mission`, transient `objective`, and compatible partial adoption are workflow requirements enforced before writing files.
- Templates live in [`examples/`](examples/) as standalone markdown files and are copied into the target directory under the substitution rules in step 4 of the workflow above.
- `AGENT_GOAL.md` is agent-immutable after scaffold. Subsequent modifications require explicit user instruction.
