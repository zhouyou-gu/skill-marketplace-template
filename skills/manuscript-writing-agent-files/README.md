# Manuscript Writing Agent Files Skill

Extend the base `agent-files` scaffold with durable manuscript-writing operating rules.

Use this skill when a LaTeX IEEE-style paper workspace needs the recoverable four-file AGENT contract plus standalone manuscript-writing guidance. For generic workspaces, use `agent-files`.

## Capabilities

- Invoke `agent-files` to provision the four core AGENT files and preserve their mutually exclusive jurisdictions
- Preserve `AGENT.md` as immutable control infrastructure after the parent scaffold; this skill only patches `AGENT_HARNESS.md`
- Pass the required long-term manuscript-writing mission statement through to the parent `AGENT_GOAL.md`
- Optionally pass a transient current objective through to the parent `AGENT_PROGRESS.md`; if omitted, the parent omits the `Current Objective` section
- Install a bounded child-owned `AGENT_HARNESS.md` extension with durable manuscript-writing operating rules
- Skip or overwrite existing files under caller control, with parent compatibility checks for core files and child-extension compatibility checks for the manuscript-writing playbook

## File Roles

A later agent must read the four core AGENT files in order: `AGENT.md` -> `AGENT_GOAL.md` -> `AGENT_HARNESS.md` -> `AGENT_PROGRESS.md`.

- `AGENT.md`, `AGENT_GOAL.md`, `AGENT_HARNESS.md`, and `AGENT_PROGRESS.md` templates are owned by `agent-files`. This skill does not duplicate those templates, and it does not patch immutable `AGENT.md`.
- `AGENT_HARNESS.md` receives a child-owned manuscript-writing playbook patch. The patch only adds durable reusable rules for standalone LaTeX IEEE manuscript writing.

## Scaffolded Layout

After a successful call, `target_dir` contains the four parent-owned AGENT files plus a child-owned extension inside `AGENT_HARNESS.md`:

```text
target_dir/
├─ AGENT.md                 # immutable from agent-files
├─ AGENT_GOAL.md            # from agent-files
├─ AGENT_HARNESS.md         # from agent-files + Manuscript-Writing Playbook
└─ AGENT_PROGRESS.md        # from agent-files
```

## Tool

- Name: `manuscript_writing_agent_files_init`
- Input: `target_dir` (required), `mission` (required one- or two-sentence manuscript-writing mission statement passed to the parent scaffold), optional transient `objective`, optional `overwrite`
- Output: `target_dir`, `files_created`, `files_skipped`, `patches_applied`
- Note: `tool.json` validates input/output shape. The skill workflow performs the semantic checks that keep parent mission/objective boundaries and child-extension boundaries clean.

## Example MCP Request

The `mission` and `objective` strings below are illustrative. Keep `mission` durable and purpose-only; keep `objective` transient and tied to the current workstream.

```json
{
  "target_dir": "./paper-workspace",
  "mission": "Write and maintain a submission-ready IEEE manuscript with consistent technical narrative, notation, citations, figures, and appendix content",
  "objective": "Draft the sensing-method introduction and align the appendix notation with the main text",
  "overwrite": false
}
```

## Templates

Only the manuscript-writing child extension lives in [`examples/`](examples/). The core AGENT templates live in the parent `agent-files` skill.

- `agent-files` creates or verifies the four core AGENT files subject to the skip-or-overwrite rule; `AGENT.md` remains immutable after scaffold.
- The required `mission` input is passed through to the parent scaffold and replaces the `{{ mission }}` placeholder in the parent `AGENT_GOAL.md`.
- The optional `objective` input is passed through to the parent scaffold and replaces the `{{ objective }}` placeholder in the parent `AGENT_PROGRESS.md`; if omitted, the parent omits the `Current Objective` section.
- [`AGENT_HARNESS_MANUSCRIPT_EXTENSION.md`](examples/AGENT_HARNESS_MANUSCRIPT_EXTENSION.md) is patched into generated `AGENT_HARNESS.md` so reusable manuscript-writing rules live in the harness.
- The child extension is identified by the exact section heading `## Manuscript-Writing Playbook`; `overwrite=true` refreshes only that child-owned section inside the core file.
- An existing playbook section is compatible only when it contains durable reusable manuscript-writing operating rules and excludes mission scope, current task state, current artifact inventory, blockers, and sidecar behavior.
- Section-only edits are reported in `patches_applied`, not as created files.
- This skill creates no auxiliary sidecar files.

The parent templates carry the four-file boundary clauses. The child extension stays inside harness jurisdiction and must not become mission scope or current progress.

## Parents

- `agent-files` - this child skill composes the hardened four-file AGENT contract and adds only a bounded manuscript-writing harness extension.
