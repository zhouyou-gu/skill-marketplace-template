---
name: manuscript-writing-agent-files
description: Extend agent-files for standalone LaTeX IEEE-style manuscript writing by invoking the base four-file scaffold with immutable AGENT.md and installing a bounded manuscript-writing harness patch. Use when a paper workspace needs a disciplined, recoverable manuscript-writing agent-file contract.
---

# Manuscript Writing Agent Files Scaffold

## Trigger

- Use when a LaTeX IEEE-style manuscript-writing workspace needs the base four-file AGENT contract plus durable manuscript-writing operating rules.
- Use for drafting, organizing, and maintaining a paper and its directly supporting artifacts.
- Do not use for generic agent-file scaffolding; route to `agent-files`.
- Do not use when the caller asks this skill to create auxiliary sidecar files; this skill owns only the manuscript-writing harness extension on top of the parent four-file contract.
- Do not use to curate or revise an existing `AGENT_GOAL.md`; this skill scaffolds a new or compatible four-file contract only.

## Inputs

- `target_dir`: directory where the parent `agent-files` scaffold will be created before manuscript-specific harness handling
- `mission`: one- or two-sentence long-term manuscript-writing mission statement passed to `agent-files` and written into `AGENT_GOAL.md`; required so the scaffolded contract is internally consistent on first read. It must not include reusable writing rules, formatting preferences, current task state, next steps, external coordination tasks, or transient objectives.
- `objective`: optional concrete in-flight objective written into `AGENT_PROGRESS.md`; it must be transient current manuscript-writing work, not a second mission statement or permanent scope rule. When omitted, the `## Current Objective` section is removed rather than left as a literal placeholder
- `overwrite`: when true, existing parent scaffold files may be replaced by `agent-files`, and this skill refreshes only the child-owned manuscript-writing harness section; otherwise only compatible existing parent files and a compatible child extension are recorded in `files_skipped`

## Workflow

1. Receive `target_dir` and `mission`. Confirm the directory exists or create it. `mission` is required so the scaffolded parent contract is internally consistent the moment a later agent reads it; `AGENT.md` and `AGENT_GOAL.md` are agent-immutable after scaffold and cannot be filled in autonomously later.
2. Classify the supplied `mission` and optional `objective` before writing:
   - durable manuscript-writing purpose belongs in `mission`
   - transient current drafting or writing work belongs in `objective`
   - durable writing, notation, citation, validation, and formatting rules belong in future `AGENT_HARNESS.md` updates, not in `mission`
   - current repository state, blockers, active section plans, and artifact mapping belong in future `AGENT_PROGRESS.md` updates, not in `mission`
3. Invoke `agent_files_init` from `agent-files` with `target_dir`, `mission`, `objective` when provided, and the same `overwrite` flag. Record the parent-created and parent-skipped core AGENT files in this skill's `files_created` and `files_skipped` output. Do not duplicate the parent four-file templates in this skill.
4. Install or verify the child-owned harness extension:
   - Patch `AGENT_HARNESS.md` with the manuscript-writing playbook from `examples/AGENT_HARNESS_MANUSCRIPT_EXTENSION.md`. The patch may add durable manuscript-writing operating rules only; it must not record current manuscript state, current artifact inventory, blockers, mission scope, or sidecar behavior.
   - When the patch is applied or refreshed, record the patch name `manuscript_writing_playbook` in `patches_applied`; do not record section-only edits as created files.
   - Identify the child extension by the exact section heading `## Manuscript-Writing Playbook`. If `overwrite` is true, replace only that child-owned section; do not rewrite unrelated parent-owned or user-authored content in the core files.
   - `AGENT_HARNESS.md` has a compatible manuscript-writing playbook only when the section identifies itself as durable reusable manuscript-writing operating rules, excludes mission scope and current task state, does not record current artifact inventory or blockers, and does not define sidecar behavior.
   - If `AGENT_HARNESS.md` already contains a compatible manuscript-writing extension and `overwrite` is false, treat the patch as verified and record `manuscript_writing_playbook` in `patches_applied`; do not add a section-only entry to `files_skipped`.
   - If `AGENT_HARNESS.md` contains an incompatible child extension or an incompatible parent contract and `overwrite` is false, stop rather than mixing contracts.
5. Return `target_dir`, aggregate `files_created`, aggregate `files_skipped`, and `patches_applied`.

## Outputs

- `target_dir`
- `files_created` (actual file paths created or replaced by the parent scaffold; section-only edits are not reported here)
- `files_skipped` (actual file paths skipped because compatible files already existed and `overwrite=false`)
- `patches_applied` (child-owned section patch names applied or verified, such as `manuscript_writing_playbook`)

## Failure / Escalation

- If `target_dir` cannot be created or is not writable, fail cleanly with an explicit error and write no files.
- If `agent-files` or its tool `agent_files_init` is not reachable at runtime, stop before writing manuscript-specific harness content.
- If `mission` is missing, empty, not manuscript-specific, still a placeholder, or mixes in workflow rules/current state/next steps, stop and ask the user for a clean manuscript-writing mission before writing; if the mission is generic and not manuscript-related, route to `agent-files` instead.
- If `objective` is supplied but reads like permanent mission, manuscript scope, policy, or success criteria, stop and ask the user to reframe it as transient current work or omit it.
- If the parent `agent-files` scaffold rejects existing core AGENT files with `overwrite=false`, stop rather than silently creating a mixed-boundary system.
- If `AGENT_HARNESS.md` cannot be patched without altering parent-owned roles, precedence, mission rules, current-state records, or unrelated content, stop rather than forcing the child extension.
- If the caller wants to refine an existing `AGENT_GOAL.md`, do not re-scaffold; this skill does not curate existing goal files.
- If the caller asks this skill to create auxiliary sidecar files, stop and explain that this skill owns only the manuscript-writing harness extension on top of the parent four-file contract.

## Tool Contract

- Read [`tool.json`](tool.json) for the authoritative schema.
- The JSON schema enforces input/output shape only. The semantic checks for clean `mission`, transient `objective`, compatible parent adoption, and compatible child-extension adoption are workflow requirements enforced before writing files.
- The four AGENT file templates are owned by `agent-files`; this child skill invokes that parent rather than duplicating its templates.
- This child skill owns a bounded extension snippet for generated `AGENT_HARNESS.md`. That snippet adds the durable manuscript-writing playbook without changing the parent four-file contract.
- No auxiliary sidecar file is created here.
- `AGENT.md` remains agent-immutable after the parent scaffold. This skill must not patch it.
- `AGENT_GOAL.md` remains agent-immutable after the parent scaffold. Subsequent modifications require explicit user instruction.
