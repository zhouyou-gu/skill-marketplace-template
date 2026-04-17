# Hierarchical Agent File Scaffold

Scaffold a parent workspace plus one or more direct children, each with its own four-file agent contract, in one invocation.

## When to use

Use this skill when a single workspace is not enough: you have a parent mission and two or more sibling nested workspaces that each need their own local mission, harness, and progress log, but which share a single outer boundary and a single progress-scope rule.

Use the plain `agent-files` skill instead if you only need one workspace.

## What it produces

```text
<parent_dir>/
├─ AGENT.md                     # base parent (from agent-files)
├─ AGENT_GOAL.md                # base parent, mission substituted
├─ AGENT_HARNESS.md             # base parent + progress-scope rule injected
├─ AGENT_PROGRESS.md            # base parent + ## Completed Changes seeded
├─ <child_1>/
│  ├─ AGENT.md                  # slim nesting-aware template
│  ├─ AGENT_GOAL.md             # base + outer-boundary constraint
│  ├─ AGENT_HARNESS.md          # base (unchanged)
│  └─ AGENT_PROGRESS.md         # base (unchanged)
└─ <child_n>/
   └─ ... (same four-file layout as <child_1>)
```

Key invariants the scaffold enforces on first read:

- Each child's `AGENT.md` lists the parent's four files first in the mandatory read order, then its own.
- Each child's `AGENT_GOAL.md § Constraints` declares the parent mission as the outer boundary.
- The parent's `AGENT_HARNESS.md § Reusable Preferences` carries the progress-scope rule verbatim, so children never mirror parent-scope changes and the parent never mirrors child-scope changes.
- The parent's `AGENT_PROGRESS.md § Completed Changes` starts with a header sentence naming the nested progress files and one `[Scaffold]` bullet per node.

## Parents

- `agent-files` — this skill composes `agent-files` under the hood. `agent-files` places the four base templates per node; `hierarchical-agent-files` adds the nesting-specific patches on top so the tree is internally consistent.

## Worked example

Input:

```json
{
  "parent_dir": "/tmp/example-workspace/my-project",
  "parent_mission": "Maintain a coherent parent workspace whose work is partitioned across two sibling nested workspaces.",
  "children": [
    { "relative_dir": "module-a", "mission": "Own the first area of work inside the parent mission." },
    { "relative_dir": "module-b", "mission": "Own the second area of work inside the parent mission." }
  ]
}
```

Result: `my-project/` has four parent files with the progress-scope rule and a seeded `## Completed Changes` ledger. `module-a/` and `module-b/` each have four local files, a slim nesting-aware `AGENT.md`, and an outer-boundary constraint in `AGENT_GOAL.md`.

The pattern is domain-neutral: the same scaffold works for research workspaces (e.g., `review/` + `system/`), software projects (`frontend/` + `backend/`), product docs (`design/` + `build/`), or any other two-level split where the children share a single outer mission.

See `examples/tree-layout.md` for the full expected layout and `examples/request.json` for a normalized input payload.

## Limitations

- Two levels only. Grandchildren are out of scope; a child's own children would need a separate nested invocation and extra read-order glue.
- Children share the same parent. Cross-child references (for example, one child citing another child's artifacts) are hand-added after scaffolding; the skill has no schema for sibling dependencies.
- The `[Scaffold]` ledger bullets use a generic phrase ("as a nested workspace with its own four-file agent contract"). Domain-specific wording is a post-scaffold hand-edit.
