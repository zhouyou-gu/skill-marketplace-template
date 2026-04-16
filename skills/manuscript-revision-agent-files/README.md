# Manuscript Revision Agent Files Skill

Scaffold a disciplined manuscript-revision agent contract built around the four core AGENT files, with an optional `REVISION_TASK.md` sidecar for joint manuscript and response-letter drafting.

Use this skill when a LaTeX IEEE-style paper workspace needs a disciplined, recoverable agent-file contract that survives handoff between agents and keeps manuscript-specific editing rules separate from live task state.

## Capabilities

- Provision four files whose jurisdictions remain mutually exclusive: control vs. long-term mission vs. reusable playbook vs. live state
- Seed `AGENT_GOAL.md` with a required long-term manuscript mission so the scaffolded contract is internally consistent on first read
- Optionally seed `AGENT_PROGRESS.md` with an initial objective; if omitted, the `Current Objective` section is removed rather than left as a literal placeholder
- Optionally add `REVISION_TASK.md` when the workspace needs a task-specific brief for joint manuscript and response-letter drafting
- Skip or overwrite existing files under caller control

## File Roles

A later agent must read the four core AGENT files in order: `AGENT.md` -> `AGENT_GOAL.md` -> `AGENT_HARNESS.md` -> `AGENT_PROGRESS.md`.

- [`AGENT.md`](examples/AGENT.md) - the control contract: file roles, read order, precedence, update routing, boundary enforcement. **Sole authority on how the four-file system operates.**
- [`AGENT_GOAL.md`](examples/AGENT_GOAL.md) - the long-term mission: statement, scope, non-goals, success criteria, constraints. **Immutable to the agent.** Changes only on explicit user instruction.
- [`AGENT_HARNESS.md`](examples/AGENT_HARNESS.md) - the reusable playbook: durable workflow rules and generalized manuscript-revision preferences. **Must not become a task log or restate the mission.**
- [`AGENT_PROGRESS.md`](examples/AGENT_PROGRESS.md) - the live state: current objective, repository state, completed changes, next resume point. **Must not define workflow policy or revise the mission.**
- [`REVISION_TASK.md`](examples/REVISION_TASK.md) - an optional sidecar brief for joint manuscript and response-letter drafting. **Not part of the core four-file control contract.** Read after `AGENT_PROGRESS.md` when present and relevant.

## Scaffolded Layout

After a successful call, `target_dir` always contains the four AGENT files and may also contain `REVISION_TASK.md` when `revision_mode` is `manuscript_and_response_letter`:

```text
target_dir/
├─ AGENT.md
├─ AGENT_GOAL.md
├─ AGENT_HARNESS.md
├─ AGENT_PROGRESS.md
└─ REVISION_TASK.md (optional)
```

## Tool

- Name: `manuscript_revision_agent_files_init`
- Input: `target_dir` (required), `mission` (required), optional `objective`, optional `revision_mode`, optional `overwrite`
- Output: `target_dir`, `files_created`, `files_skipped`

## Example MCP Request

The `mission` and `objective` strings below are illustrative. `revision_mode` defaults to `manuscript_only`; set it to `manuscript_and_response_letter` when the scaffold should include the auxiliary joint-revision brief.

```json
{
  "target_dir": "./paper-workspace",
  "mission": "Revise the manuscript and supporting technical material into a submission-ready IEEE paper with consistent notation, citations, figures, and appendix content",
  "objective": "Refine the sensing-method introduction and update the appendix notation accordingly",
  "revision_mode": "manuscript_and_response_letter",
  "overwrite": false
}
```

## Templates

The templates live in [`examples/`](examples/) and are copied into `target_dir` with the following behavior:

- The four core AGENT templates are always copied subject to the skip-or-overwrite rule.
- The required `mission` input replaces the `{{ mission }}` placeholder in `AGENT_GOAL.md`.
- The optional `objective` input replaces the `{{ objective }}` placeholder in `AGENT_PROGRESS.md`. If `objective` is omitted, the `Current Objective` section is removed entirely so that no literal placeholder reaches the workspace.
- `REVISION_TASK.md` is copied only when `revision_mode` is `manuscript_and_response_letter`.

Each template carries its own boundary clause so the core four-file contract does not drift toward duplication or cross-file contamination, and the optional sidecar remains lower-precedence than the control contract.
