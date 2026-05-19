## Revision Sidecar Registration

When `REVISION_TASK.md` exists in this workspace, it is an auxiliary current-state sidecar installed by the manuscript-revision child scaffold. Read it only after the four core files and only for active joint manuscript and response-letter revision work.

Sidecar boundaries:

- `REVISION_TASK.md` is lower precedence than all four core files and all higher-precedence system, developer, user, repository, legal, security, venue, and tool instructions.
- `REVISION_TASK.md` holds the current revision package, artifact map, active review item, manuscript-response alignment state, highlighting state, response draft state, revision-specific evidence gaps or open questions, and next joint drafting step.
- `REVISION_TASK.md` shall not hold mission, scope, non-goals, success criteria, reusable revision-response rules, or the canonical workspace resume ledger.
- If `REVISION_TASK.md` conflicts with any core file, the core file wins. Clean the sidecar drift instead of carrying it forward.

Read-order extension:

5. `REVISION_TASK.md` when present and relevant to active revision-response work.

Update extension:

- Update `REVISION_TASK.md` when the active revision package, artifact map, active review item, manuscript-response alignment state, highlighting state, response draft state, revision-specific evidence gaps, open questions, or next joint drafting step changes.
- Update `AGENT_PROGRESS.md` whenever concrete workspace state, execution blockers, or the canonical resume point changes. The revision sidecar never replaces the progress ledger.
- Move durable revision-response workflow lessons into `AGENT_HARNESS.md`; do not store them in the sidecar.
