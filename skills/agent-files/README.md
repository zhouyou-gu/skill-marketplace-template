# Agent Files Skill

Scaffold a disciplined four-file agent contract (`AGENT.md`, `AGENT_GOAL.md`, `AGENT_HARNESS.md`, `AGENT_PROGRESS.md`) with strict, non-overlapping functional boundaries.

Use this skill when a workspace needs a disciplined, recoverable agent-file contract — one that survives handoff between agents and cannot drift toward duplication or cross-file contamination.

## Capabilities

- Provision four files whose jurisdictions are mutually exclusive — control vs. long-term mission vs. reusable playbook vs. live state — each with its own boundary clause to prevent cross-file drift
- Seed `AGENT_GOAL.md` with a required long-term mission string so the scaffolded contract is internally consistent on first read
- Optionally seed `AGENT_PROGRESS.md` with an initial objective; if omitted, the `Current Objective` section is removed rather than left as a literal placeholder
- Skip or overwrite existing files under caller control

## File Roles

A later agent must read these files in order: `AGENT.md` → `AGENT_GOAL.md` → `AGENT_HARNESS.md` → `AGENT_PROGRESS.md`.

- [`AGENT.md`](examples/AGENT.md) — the control contract: file roles, read order, precedence, update routing, boundary enforcement. **Sole authority on how the four-file system operates.**
- [`AGENT_GOAL.md`](examples/AGENT_GOAL.md) — the long-term mission: statement, scope, non-goals, success criteria, constraints. **Immutable to the agent.** Changes only on explicit user instruction.
- [`AGENT_HARNESS.md`](examples/AGENT_HARNESS.md) — the reusable playbook: durable workflow rules and generalized preferences. **Must not become a task log or restate the mission.**
- [`AGENT_PROGRESS.md`](examples/AGENT_PROGRESS.md) — the live state: current objective, repository state, completed changes, next resume point. **Must not define workflow policy or revise the mission.**

## Scaffolded Layout

After a successful call, `target_dir` contains exactly four files:

```text
target_dir/
├─ AGENT.md
├─ AGENT_GOAL.md
├─ AGENT_HARNESS.md
└─ AGENT_PROGRESS.md
```

## Tool

- Name: `agent_files_init`
- Input: `target_dir` (required), `mission` (required), optional `objective`, optional `overwrite`
- Output: `target_dir`, `files_created`, `files_skipped`

## Example MCP Request

The `mission` and `objective` strings below are illustrative — any mission and any objective are valid; the skill is domain-agnostic.

```json
{
  "target_dir": "./workspace",
  "mission": "Maintain a release-ready trunk branch with passing tests at every commit",
  "objective": "Draft the initial release checklist",
  "overwrite": false
}
```

## Templates

The four template files live in [`examples/`](examples/) and are copied into `target_dir` with the following substitutions:

- The required `mission` input replaces the `{{ mission }}` placeholder in `AGENT_GOAL.md`.
- The optional `objective` input replaces the `{{ objective }}` placeholder in `AGENT_PROGRESS.md`. If `objective` is omitted, the `Current Objective` section is removed entirely so that no literal placeholder reaches the workspace.

Each template carries its own functional-boundary clause in its header so that the four-file contract cannot drift toward duplication or cross-file contamination.
