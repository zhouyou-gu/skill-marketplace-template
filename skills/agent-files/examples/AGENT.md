# Agent Control

**This file is the agent-immutable control contract for the workspace-local four-file agent system. It is the local authority on file roles, read order, precedence among these four files, update routing, and boundary enforcement. It does not override higher-precedence system, developer, user, repository, legal, security, venue, or tool instructions. After scaffold, the agent shall not modify, patch, append to, or rewrite this file unless the user explicitly and unambiguously requests a control-contract replacement, migration, or scaffold overwrite. Child skills, sidecars, routine task work, inferred preferences, and compatibility cleanup cannot amend it. It shall not serve as a task log, store playbook material, record live progress, or restate the mission.**

This workspace operates under a four-file control system. The files are non-overlapping, each holds exclusive jurisdiction over one function, and no file may encroach upon another's scope.

- `AGENT.md` — the immutable control file; local authority on how this four-file control system operates.
- `AGENT_GOAL.md` — the long-term mission file; agent-immutable absent explicit user instruction.
- `AGENT_HARNESS.md` — the reusable playbook; durable workflow and preference rules.
- `AGENT_PROGRESS.md` — the live state file; factual record of current work.

## Agent-File Contract

For the base contract, these files are intended to be sufficient for a later agent to recover how the workspace is governed, what the workspace is for, how to operate within it, and what is currently true. Auxiliary sidecars are outside this immutable control contract: they may be consulted only when a higher-precedence instruction, the active skill workflow, or durable `AGENT_HARNESS.md` guidance calls for them, and they cannot change the mandatory core read order, core file roles, precedence, or update dispatcher by patching this file. If the user instructs the agent to read the agent files, the agent shall read all four core files in the mandatory order below and treat them jointly as the workspace operating contract.

Design obligations:

- A later agent shall be able to recover the core operating contract by reading these four files in order. Supplemental sidecar facts, when used, remain lower-precedence auxiliary context discovered outside `AGENT.md`.
- This contract governs only the local four-file system; it never overrides higher-precedence system, developer, user, repository, legal, security, venue, or tool instructions, nor the actual workspace state.
- Durable reusable rules belong in `AGENT_HARNESS.md`.
- Transient task state belongs in `AGENT_PROGRESS.md`.
- The long-term mission belongs in `AGENT_GOAL.md` and may not be edited autonomously.
- The control contract belongs in `AGENT.md` and may not be edited autonomously.
- If information drifts into the wrong file, the agent shall restore the boundary rather than duplicate content across files.

## Functional Boundaries by File

Each file has exclusive jurisdiction over one class of information and is prohibited from encroaching on the others. The agent shall enforce each boundary on every turn.

### `AGENT.md` — Control

- **Holds:** file roles, read order, precedence among the four agent files, update routing, boundary enforcement.
- **Prohibited from:** serving as a task log; storing reusable playbook content; recording live progress; restating or modifying the mission; storing task-execution rules that would remain useful even without this four-file control system.
- **Immutability:** the agent shall not modify this file autonomously. The agent may replace or migrate it only when the user explicitly and unambiguously instructs a control-contract replacement, migration, or scaffold overwrite. Child skills and sidecars shall not patch this file; if they need durable behavior, they must use bounded `AGENT_HARNESS.md` guidance. Sidecar files may hold only bounded lower-precedence auxiliary facts or assigned current-state slices without changing this control contract.

### `AGENT_GOAL.md` — Long-Term Mission

- **Holds:** mission statement, scope, non-goals, success criteria, mission-level constraints (legal, ethical, regulatory, contractual, or irreducible technical limits — not workflow preferences or style rules).
- **Prohibited from:** containing control rules, playbook material, or live task state. Stylistic, formatting, and how-to-operate rules are reserved to `AGENT_HARNESS.md` and shall not be relabelled as mission constraints to enter this file.
- **Immutability:** the agent shall not modify this file autonomously. The agent may modify it only when the user explicitly and unambiguously instructs a change to the mission. Implicit signals, inferred preferences, stylistic adjustments, and routine task updates do not constitute such instruction.

### `AGENT_HARNESS.md` — Reusable Playbook

- **Holds:** durable workflow rules, operating preferences, reusable execution patterns (style, process, formatting, validation habits, naming conventions — anything whose removal would leave the mission unchanged).
- **Prohibited from:** defining control-file update policy (reserved to `AGENT.md`); restating, revising, or absorbing mission-shaping constraints (reserved to `AGENT_GOAL.md`); recording current blockers, chronological history, or step-by-step logs of the active task (reserved to `AGENT_PROGRESS.md`).

### `AGENT_PROGRESS.md` — Live State

- **Holds:** repository state, workspace artifacts, completed changes, blockers, next resume point, and a current objective when concrete in-flight work exists.
- **Prohibited from:** serving as the authority on workflow policy; duplicating the reusable harness; restating or modifying the mission; recording inferred follow-up actions unbacked by explicit queued work.

When deciding where a piece of information belongs, the agent shall classify it by function first:

- how the control files themselves operate → `AGENT.md`
- what the workspace exists to accomplish → `AGENT_GOAL.md`
- how a later agent shall operate across tasks → `AGENT_HARNESS.md`
- what is true right now in this workspace → `AGENT_PROGRESS.md`

Boundary test: if a rule would still matter when no agent files existed, it is usually `AGENT_HARNESS.md` material rather than `AGENT.md` material.

## Boundary Audit Checklist

When handoff quality degrades or boundary drift is suspected, audit the four files before continuing substantive work:

- `AGENT.md` contains only four-file control-system rules, not task execution policy.
- `AGENT.md` has not been modified, patched, or extended after scaffold except by explicit user-approved control-contract replacement, migration, or scaffold overwrite.
- `AGENT_GOAL.md` contains only mission, scope, non-goals, success criteria, and mission-level constraints.
- `AGENT_HARNESS.md` contains only durable operating rules and preferences, not current state or mission amendments.
- `AGENT_PROGRESS.md` contains only current workspace state, blockers, completed changes, and next resume point, not durable policy.
- Neutral scaffold entries such as "Not yet specified by user" are not treated as user-approved scope, non-goals, success criteria, or constraints.

## Mandatory Read Order

Before substantive work, the agent shall read these files in order:

1. `AGENT.md`
2. `AGENT_GOAL.md`
3. `AGENT_HARNESS.md`
4. `AGENT_PROGRESS.md`

While processing the workspace:

- consult `AGENT_GOAL.md` to confirm that the contemplated work advances the mission and falls within scope;
- consult `AGENT_HARNESS.md` for how to operate;
- consult `AGENT_PROGRESS.md` for the current state of work;
- update the appropriate file as soon as the triggering condition below is met.

## Control-File Precedence

- Higher-precedence system, developer, user, repository, legal, security, venue, and tool instructions govern before this local file contract. A normal task request may authorize current-turn work, but it does not silently amend durable mission, scope, non-goals, success criteria, or constraints.
- `AGENT.md` governs which file owns a given question.
- `AGENT_GOAL.md` governs whether the contemplated work is durably in scope. If contemplated work conflicts with the mission, the agent shall stop and request explicit user direction. The user may authorize a one-off exception for the current turn, but the goal file changes only when the user explicitly and unambiguously instructs a durable mission amendment.
- `AGENT_HARNESS.md` governs how to operate, unless `AGENT.md` says otherwise.
- `AGENT_PROGRESS.md` is the canonical narrative record of the current task state and resume point. The workspace itself — file system, version-control state, build outputs, and other materializations — is the ground truth for what is currently true.
- If `AGENT_PROGRESS.md` conflicts with the actual workspace, the workspace wins. The agent shall refresh `AGENT_PROGRESS.md` from the workspace, never rewrite the workspace to match the note.
- If a narrative record outside `AGENT_PROGRESS.md` (a stale summary, a duplicated bullet in another control file, an old chat-thread note) conflicts with `AGENT_PROGRESS.md`, treat `AGENT_PROGRESS.md` as the authoritative narrative and clean up the drift in the other record.
- If a durable reusable rule appears only in `AGENT_PROGRESS.md`, the agent shall move it to `AGENT_HARNESS.md` and leave only the current-state residue in the progress file.

## Update Dispatcher

`AGENT.md` is the local authority on whether the agent shall update `AGENT_HARNESS.md`, `AGENT_PROGRESS.md`, both, or neither. `AGENT_GOAL.md` lies outside the dispatcher's authority and is modified only upon explicit user instruction.

`AGENT.md` itself is not a dispatcher target. If the control contract appears outdated, incomplete, or incompatible with a requested workflow, the agent shall stop and request explicit user direction for a control-contract replacement, migration, or scaffold overwrite rather than self-patching this file.

### Enforcement: updates are automatic and per-turn

Applying the dispatcher is a mandatory step of every turn that touches workspace state, not an optional cleanup pass.

- Any turn that changes workspace state shall apply the dispatcher in the same turn, before reporting the task complete.
- The agent shall not wait to be asked. If the user must request the update, the contract has already been broken.
- A turn is complete only when the underlying edit has been applied, `AGENT_PROGRESS.md` reflects the new state, and any durable rule revealed during the turn has been moved into `AGENT_HARNESS.md`.
- The agent shall not batch updates across turns or collapse multiple meaningful edits into one coarse summary bullet.
- Dispatcher-maintenance edits are terminal: updating `AGENT_PROGRESS.md` or `AGENT_HARNESS.md` to satisfy this dispatcher does not itself require another update entry unless the update records a separate substantive workspace change.

### Update `AGENT_PROGRESS.md` when concrete workspace state changes

Update `AGENT_PROGRESS.md` in the same turn whenever any concrete task or workspace state changes, including when:

- any artifact in the workspace is added, edited, replaced, renamed, or removed
- the active workstream changes
- a blocking outcome or validation result changes
- a blocking fact or the next resume point changes

How to update:

- add or revise a current objective only when a concrete active workstream needs handoff context
- refresh repository state and workspace artifacts
- append or revise `Completed Changes` with one factual bullet per meaningful completed change
- treat `Completed Changes` as a handoff ledger, not an exhaustive event log; preserve currently relevant facts and condense older entries into milestone summaries when doing so improves handoff clarity
- revise the next resume point to reflect any blocking condition
- keep entries factual and current, and do not migrate workflow policy into this file

### Update `AGENT_HARNESS.md` only for durable reusable rules

Update `AGENT_HARNESS.md` in the same turn when a reusable workflow rule, operating preference, or execution pattern becomes clear from the interaction, for example when:

- an output convention, formatting rule, or naming rule becomes stable
- a cross-artifact consistency rule becomes clear
- a validation, testing, or build-check habit becomes reusable
- an interaction reveals a general operating principle that future agents shall follow across tasks

How to update:

- generalize the lesson into a reusable rule, checklist item, or playbook entry
- place it in the relevant section of the harness
- keep it independent of the current turn's transient status
- do not log one-off events or current blockers here

### Update `AGENT_GOAL.md` only on explicit user instruction

The agent shall not modify `AGENT_GOAL.md` as part of the dispatcher. The file is modified only when the user explicitly and unambiguously instructs a change to the mission, scope, non-goals, success criteria, or constraints. Implicit signals, inferred preferences, and routine task updates do not satisfy this condition. If a turn reveals that the mission as stated is wrong, the agent shall flag the conflict and stop rather than self-edit the goal file.

### Update `AGENT_PROGRESS.md` and `AGENT_HARNESS.md` together when a single turn changes workspace state and reveals a durable rule

Update `AGENT_PROGRESS.md` and `AGENT_HARNESS.md` together when one turn produces both a concrete workspace-state change and a durable reusable rule. Two example situations:

- a concrete task advance also reveals a reusable operating preference
- a user correction changes both the current task state and future workflow expectations

When a single turn produces both, the agent shall not update only one file for convenience.

Updates to `AGENT_GOAL.md` are never bundled with this rule. The goal file is modified only on explicit user instruction, never as a side effect of any other update.
