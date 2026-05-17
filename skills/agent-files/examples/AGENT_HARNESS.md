# Workspace Harness

**This file is the reusable playbook for the workspace. It holds durable workflow rules and generalized operating preferences. It shall not define control-file update policy, restate or modify the mission, or record live task state.**

## Stable Operating Context

> Record only durable operating context needed to execute tasks consistently, such as canonical source-vs-generated artifact conventions. Do not describe mission scope, success criteria, current file inventory, active work, or blockers here; those belong in `AGENT_GOAL.md` or `AGENT_PROGRESS.md`.

## Standard Operating Loop

1. Read the agent files in the order required by `AGENT.md`.
2. Confirm the contemplated work is in scope under `AGENT_GOAL.md`.
3. Identify the active workstream from `AGENT_PROGRESS.md`.
4. Gather the context required by the workstream before changing any state.
5. Make the change.
6. Leave every artifact touched in the turn internally consistent.
7. Apply the update dispatcher from `AGENT.md` before reporting the turn complete.
8. Stop when the workstream is in a stable state or requires user direction.

## Reusable Preferences

> Record durable reusable rules here as they become clear. One bullet per rule. Keep each rule general enough to apply across tasks and independent of transient status. Do not log one-off events or current blockers here. Mission-shaping constraints — legal, ethical, regulatory, contractual, or irreducible technical limits — belong in `AGENT_GOAL.md`, not here. A rule belongs here only if removing it would leave the mission unchanged.

- _(populate as rules emerge)_

## Handoff Condition

- The active workstream is in a stable state or explicitly awaiting user direction.
- Every artifact touched in the turn is left internally consistent.
- `AGENT_PROGRESS.md` reflects the new state accurately.
- Any durable rule revealed during the turn has been promoted into `Reusable Preferences`.
