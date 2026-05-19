# Manuscript Revision Agent Files Skill

Extend the standalone manuscript-writing scaffold with revision-response coordination by installing bounded child-owned patches and adding `REVISION_TASK.md` for joint manuscript and response-letter drafting.

Use this skill when a LaTeX IEEE-style paper workspace already needs the manuscript-writing four-file contract plus revision-specific coordination. For ordinary drafting without response-letter coordination, use `manuscript-writing-agent-files`.

## Capabilities

- Invoke `manuscript-writing-agent-files` to provision the four core AGENT files and preserve their mutually exclusive jurisdictions
- Install bounded child-owned extensions into generated `AGENT.md` and `AGENT_HARNESS.md` so later agents discover the revision sidecar and reusable revision-response rules from the workspace files themselves
- Add or verify `REVISION_TASK.md` when the workspace needs a task-specific brief for joint manuscript and response-letter drafting
- Skip or overwrite existing files under caller control, with parent compatibility checks for core files, child-extension compatibility checks, and sidecar compatibility checks for `REVISION_TASK.md`

## File Roles

A later agent must read the four core AGENT files in order: `AGENT.md` -> `AGENT_GOAL.md` -> `AGENT_HARNESS.md` -> `AGENT_PROGRESS.md`.

- `AGENT.md`, `AGENT_GOAL.md`, `AGENT_HARNESS.md`, and `AGENT_PROGRESS.md` templates are owned by `agent-files`. This skill reaches them by invoking `manuscript-writing-agent-files`, which composes `agent-files`.
- `AGENT_HARNESS.md` already contains the manuscript-writing harness extension from `manuscript-writing-agent-files` before this skill adds revision-response rules.
- `AGENT.md` receives a child-owned revision sidecar registration patch. The patch only adds lower-precedence `REVISION_TASK.md` discovery and update routing.
- `AGENT_HARNESS.md` receives a child-owned revision-response playbook patch. The patch only adds durable reusable rules for coordinated manuscript and response-letter revision.
- [`REVISION_TASK.md`](examples/REVISION_TASK.md) - an auxiliary sidecar brief for joint manuscript and response-letter drafting. **Not part of the core four-file control contract.** Read after `AGENT_PROGRESS.md` when present and relevant.

## Scaffolded Layout

After a successful call, `target_dir` contains the four parent-owned AGENT files plus child-owned extensions inside `AGENT.md` and `AGENT_HARNESS.md`, and `REVISION_TASK.md`:

```text
target_dir/
├─ AGENT.md                 # base from agent-files + revision sidecar registration
├─ AGENT_GOAL.md            # base from agent-files
├─ AGENT_HARNESS.md         # base from agent-files + manuscript and revision extensions
├─ AGENT_PROGRESS.md        # base from agent-files
└─ REVISION_TASK.md
```

## Tool

- Name: `manuscript_revision_agent_files_init`
- Input: `target_dir` (required), `mission` (required one- or two-sentence manuscript mission statement passed to the parent writing scaffold), optional transient `objective`, optional `overwrite`
- Output: `target_dir`, `files_created`, `files_skipped`, `patches_applied`
- Note: `tool.json` validates input/output shape. The skill workflow performs the semantic checks that keep parent mission/objective boundaries, child-extension boundaries, and sidecar authority clean.

## Example MCP Request

The `mission` and `objective` strings below are illustrative. Keep `mission` durable and purpose-only; keep `objective` transient and tied to the current workstream.

```json
{
  "target_dir": "./paper-workspace",
  "mission": "Revise the manuscript and supporting technical material into a submission-ready IEEE paper with consistent notation, citations, figures, and appendix content",
  "objective": "Refine the sensing-method introduction and update the appendix notation accordingly",
  "overwrite": false
}
```

## Templates

Only revision child templates live in [`examples/`](examples/). The core AGENT templates live in `agent-files`; the manuscript-writing harness extension lives in the parent writing skill.

- `manuscript-writing-agent-files` invokes `agent-files` to create or verify the four core AGENT files subject to the skip-or-overwrite rule, then adds its manuscript-writing harness extension.
- The required `mission` input is passed through to the parent writing scaffold and replaces the `{{ mission }}` placeholder in the parent `AGENT_GOAL.md`.
- The optional `objective` input is passed through to the parent writing scaffold and replaces the `{{ objective }}` placeholder in the parent `AGENT_PROGRESS.md`; if omitted, the parent omits the `Current Objective` section.
- [`AGENT_REVISION_EXTENSION.md`](examples/AGENT_REVISION_EXTENSION.md) is patched into generated `AGENT.md` so the sidecar is discoverable from the workspace control contract.
- [`AGENT_HARNESS_REVISION_EXTENSION.md`](examples/AGENT_HARNESS_REVISION_EXTENSION.md) is patched into generated `AGENT_HARNESS.md` so reusable revision-response rules live in the harness instead of the sidecar.
- Child extensions are identified by the exact section headings `## Revision Sidecar Registration` and `## Revision-Response Playbook`; after the parent handles any `overwrite=true` replacement of its own files, this child refreshes only those child-owned sections inside the core files.
- The two child extensions are applied or verified independently. Section-only edits are reported in `patches_applied`, not as created files.
- `REVISION_TASK.md` is always copied or verified by this child skill and remains current-state only.

The sidecar carries its own boundary clause so it remains lower-precedence than the core four-file control contract and cannot become a second mission, harness, or progress ledger. Durable reviewer-item routing, manuscript-response synchronization, highlighting policy, and response-letter drafting rules belong in the `AGENT_HARNESS.md` extension, not in `REVISION_TASK.md`. Existing sidecar text is never promoted into the harness automatically.

## Parents

- `manuscript-writing-agent-files` - this child skill composes the parent manuscript-writing scaffold and adds only bounded revision-response extensions plus sidecar behavior.
