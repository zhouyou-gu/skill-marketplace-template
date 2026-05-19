---
name: manuscript-revision-agent-files
description: Extend manuscript-writing-agent-files for LaTeX IEEE-style manuscript revision by installing bounded revision-response patches and adding REVISION_TASK.md for joint manuscript and response-letter drafting. Use when a manuscript-writing workspace needs revision-response coordination without weakening the parent four-file contract.
---

# Manuscript Revision Agent Files Scaffold

## Trigger

- Use when a LaTeX IEEE-style manuscript-writing workspace needs revision-specific coordination on top of the parent `manuscript-writing-agent-files` contract.
- Use when joint manuscript and response-letter drafting requires `REVISION_TASK.md` alongside the four core AGENT files.
- Do not use for standalone manuscript writing or drafting without revision-response coordination; route to `manuscript-writing-agent-files`.
- Do not use for generic agent-file scaffolding; route to `agent-files`.
- Do not use to curate or revise an existing `AGENT_GOAL.md`; goal curation is outside this skill's write surface.
- Do not use when only `REVISION_TASK.md` is wanted without the core four-file contract — the sidecar is lower precedence than the control contract and is not authoritative on its own.

## Inputs

- `target_dir`: directory where the parent manuscript-writing AGENT files will be scaffolded before revision-specific sidecar handling
- `mission`: one- or two-sentence long-term manuscript-writing or revision mission statement passed to `manuscript-writing-agent-files` and written into `AGENT_GOAL.md`; required so the scaffolded contract is internally consistent on first read. It must not include reusable editing rules, formatting preferences, current task state, transient response-letter tasks, response-letter next steps, or transient objectives.
- `objective`: optional concrete in-flight objective written into `AGENT_PROGRESS.md`; it must be transient current manuscript-writing or revision work, not a second mission statement or permanent scope rule. When omitted, the `## Current Objective` section is removed rather than left as a literal placeholder
- `overwrite`: when true, existing parent scaffold files may be replaced by `manuscript-writing-agent-files`, and this skill refreshes only its own child-owned extension sections plus `REVISION_TASK.md`; otherwise only compatible existing parent files, child extensions, and sidecars are recorded in `files_skipped`

## Workflow

1. Receive `target_dir` and `mission`. Confirm the directory exists or create it. `mission` is required so the scaffolded parent contract is internally consistent the moment a later agent reads it; `AGENT_GOAL.md` is agent-immutable after scaffold and cannot be filled in autonomously later.
2. Classify the supplied `mission` and optional `objective` before writing:
   - durable manuscript-writing or revision purpose belongs in `mission`
   - transient current manuscript-writing or revision work belongs in `objective`
   - durable editing, notation, citation, validation, and formatting rules belong in future `AGENT_HARNESS.md` updates, not in `mission`
   - current repository state and execution blockers belong in future `AGENT_PROGRESS.md` updates; reviewer items, response-letter coordination state, artifact mapping, and revision-specific evidence gaps belong in future `REVISION_TASK.md` updates, not in `mission`
3. Invoke `manuscript_writing_agent_files_init` from `manuscript-writing-agent-files` with `target_dir`, `mission`, `objective` when provided, and the same `overwrite` flag. Record the parent-created and parent-skipped core AGENT files in this skill's `files_created` and `files_skipped` output. Do not duplicate the parent four-file templates in this skill.
4. Install or verify the child-owned extension patches:
   - Patch `AGENT.md` with the sidecar registration from `examples/AGENT_REVISION_EXTENSION.md`. The patch may add only lower-precedence `REVISION_TASK.md` read and update routing; it must not change the four-file roles, parent read order, parent precedence, update dispatcher, or mission rules.
   - Patch `AGENT_HARNESS.md` with the durable revision-response playbook from `examples/AGENT_HARNESS_REVISION_EXTENSION.md`. The patch may add reusable revision-response operating rules only; it must not record current review state, current artifact inventory, evidence gaps, blockers, or mission scope.
   - Evaluate the two extension patches independently. Do not skip both patches because one is already present; each patch must be applied or verified on its own target file.
   - Identify the child extensions by the exact section headings `## Revision Sidecar Registration` and `## Revision-Response Playbook`. If `overwrite` is true, replace only those child-owned sections; do not rewrite unrelated parent-owned or user-authored content in the core files.
   - `AGENT.md` has a compatible revision sidecar registration only when the section contains `REVISION_TASK.md`, a lower-precedence statement, a read-order extension, and an update extension. If compatible and `overwrite` is false, treat `revision_sidecar_registration` as verified.
   - `AGENT_HARNESS.md` has a compatible revision-response playbook only when the section identifies itself as durable reusable operating rules, excludes mission scope and current task state, and routes active review state back to `REVISION_TASK.md` or `AGENT_PROGRESS.md`. If compatible and `overwrite` is false, treat `revision_response_playbook` as verified.
   - Record applied or verified child-owned section patches in `patches_applied`; do not record section-only edits as created or skipped files.
   - If either target file contains an incompatible child extension or an incompatible parent contract and `overwrite` is false, stop rather than mixing contracts.
5. Apply a compatibility-aware skip-or-overwrite rule to `REVISION_TASK.md`:
   - If `REVISION_TASK.md` exists and `overwrite` is false, proceed only when it does not claim to override the core four-file contract and clearly identifies itself as an auxiliary revision brief; otherwise stop rather than mixing sidecar authority with the parent contract.
   - Treat durable reviewer-item routing, manuscript-response synchronization, highlighting policy, and response-letter drafting rules as harness material. If those rules appear in an existing `REVISION_TASK.md`, treat the sidecar as incompatible with this contract. Do not promote sidecar text into `AGENT_HARNESS.md` unless the user explicitly approves exact durable harness wording outside the sidecar adoption flow.
   - If compatible and `overwrite` is false, skip it and record the path in `files_skipped`.
   - Otherwise copy `examples/REVISION_TASK.md` into `target_dir`.
6. Return `target_dir`, aggregate `files_created`, aggregate `files_skipped`, and `patches_applied`.

## Outputs

- `target_dir`
- `files_created` (actual file paths created or replaced by the parent scaffold, plus `REVISION_TASK.md` when this skill creates or replaces it; section-only edits are not reported here)
- `files_skipped` (actual file paths skipped because compatible files already existed and `overwrite=false`)
- `patches_applied` (child-owned section patch names applied or verified, such as `revision_sidecar_registration` and `revision_response_playbook`)

## Failure / Escalation

- If `target_dir` cannot be created or is not writable, fail cleanly with an explicit error and write no files.
- If `manuscript-writing-agent-files` or its tool `manuscript_writing_agent_files_init` is not reachable at runtime, stop before writing revision-specific files.
- If `mission` is missing, empty, not manuscript-specific, still a placeholder, or mixes in workflow rules/current state/next steps, stop and ask the user for a clean manuscript-writing or revision mission before writing; if the mission is generic and not manuscript-related, route to `agent-files` instead.
- If `objective` is supplied but reads like permanent mission, manuscript scope, policy, or success criteria, stop and ask the user to reframe it as transient current work or omit it.
- If the parent writing scaffold rejects existing core AGENT files with `overwrite=false`, stop rather than silently creating a mixed-boundary system.
- If `AGENT.md` or `AGENT_HARNESS.md` cannot be patched without altering parent-owned roles, precedence, mission rules, current-state records, or unrelated content, stop rather than forcing the child extension.
- If `REVISION_TASK.md` exists and fails sidecar compatibility with `overwrite=false`, including by containing durable workflow rules, stop rather than allowing a sidecar to overclaim authority or promoting its text into the harness.
- If the caller wants to refine an existing `AGENT_GOAL.md`, do not re-scaffold; this skill is not a goal-curation workflow.
- If the caller wants only the `REVISION_TASK.md` sidecar without the four-file contract, stop and explain that the sidecar is lower-precedence and not authoritative on its own.

## Tool Contract

- Read [`tool.json`](tool.json) for the authoritative schema.
- The JSON schema enforces input/output shape only. The semantic checks for clean `mission`, transient `objective`, compatible parent adoption, compatible child-extension adoption, and compatible sidecar adoption are workflow requirements enforced before writing files.
- The four AGENT file templates are owned by `agent-files`. This skill invokes `manuscript-writing-agent-files`, which invokes `agent-files` and adds the manuscript-writing harness extension.
- This child skill owns bounded extension snippets for generated `AGENT.md` and `AGENT_HARNESS.md`. Those snippets register the lower-precedence sidecar and durable revision-response playbook without changing the base four-file contract or the manuscript-writing harness extension.
- `REVISION_TASK.md` is the only standalone workspace file template owned by this skill and is always scaffolded or verified by this child skill.
- `AGENT_GOAL.md` remains agent-immutable after the parent scaffold. Subsequent modifications require explicit user instruction.
- `REVISION_TASK.md` is an auxiliary brief outside the core four-file control-system precedence. It is read after `AGENT_PROGRESS.md` when present and relevant, and it cannot override the core four files.
