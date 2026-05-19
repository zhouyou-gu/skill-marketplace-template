# Hierarchical Agent File Scaffold

Scaffold a parent workspace plus one or more direct children, each with its own four-file agent contract, in one invocation.

## When to use

Use this skill when a single workspace is not enough: you have a durable parent mission and two or more sibling nested workspaces that each need their own local mission, harness, and progress log, but which share a single outer boundary and a single progress-scope rule.

Use the plain `agent-files` skill instead if you only need one workspace.

## What it produces

```text
<parent_dir>/
├─ AGENT.md                     # base parent (from agent-files)
├─ AGENT_GOAL.md                # base parent, mission substituted
├─ AGENT_HARNESS.md             # base parent + progress-scope rule injected
├─ AGENT_PROGRESS.md            # base parent + ## Completed Changes seeded after child success
├─ <child_1>/
│  ├─ AGENT.md                  # immutable nesting-aware template, or verified compatible existing file
│  ├─ AGENT_GOAL.md             # base + outer-boundary constraint
│  ├─ AGENT_HARNESS.md          # base (unchanged)
│  └─ AGENT_PROGRESS.md         # base (unchanged)
└─ <child_n>/
   └─ ... (same four-file layout as <child_1>)
```

Key invariants the scaffold enforces on first read:

- Each child's immutable `AGENT.md` lists the parent's four files first in the mandatory read order, then its own.
- Each child's immutable `AGENT.md` is not an extension surface: child skills, sidecars, routine task work, inferred preferences, and compatibility cleanup must not patch it after scaffold.
- Each child's `AGENT_GOAL.md § Constraints` declares the parent mission as the outer boundary.
- The parent's `AGENT_HARNESS.md § Reusable Preferences` carries the progress-scope rule verbatim, so children never mirror parent-scope changes, the parent never mirrors child-internal changes, and cross-child coordination has a parent-owned place to live.
- The parent's `AGENT_PROGRESS.md § Completed Changes` replaces the upstream neutral "No completed changes recorded yet" bullet only after every child contract succeeds, using a header sentence naming the nested progress files and one `[Scaffold]` bullet per node.
- Child missions and objectives inherit the hardened `agent-files` boundary rules: mission text is durable and purpose-only; objective text is transient current work.
- With `overwrite=false`, existing parent and child contracts must pass both upstream `agent-files` compatibility and hierarchy compatibility; immutable `AGENT.md` files are verified for the full immutability clause, not patched, and incompatible nodes stop the run instead of being silently mixed with new hierarchy rules.

## Parents

- `agent-files` — this skill composes the hardened `agent-files` contract under the hood. `agent-files` places the four base templates per node; `hierarchical-agent-files` installs child-specific immutable control files during fresh scaffold or explicit overwrite and applies or verifies non-`AGENT.md` hierarchy changes so the tree is internally consistent without mixing incompatible existing contracts.

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

Result: `my-project/` has four parent files with the progress-scope rule and, after both children succeed, a seeded `## Completed Changes` handoff ledger. `module-a/` and `module-b/` each have four local files, an immutable nesting-aware `AGENT.md`, and an outer-boundary constraint in `AGENT_GOAL.md`.

The pattern is domain-neutral: the same scaffold works for research workspaces (e.g., `review/` + `system/`), software projects (`frontend/` + `backend/`), product docs (`design/` + `build/`), or any other two-level split where the children share a single outer mission.

See `examples/tree-layout.md` for the full expected layout and `examples/request.json` for a normalized input payload.

## Limitations

- Two levels only. Grandchildren are out of scope; a child's own children would need a separate nested invocation and extra read-order glue.
- Children share the same parent. Cross-child references (for example, one child citing another child's artifacts) are hand-added after scaffolding; the skill has no schema for sibling dependencies. Parent progress/harness files own cross-child coordination, while sibling-internal facts stay in the owning child.
- The `[Scaffold]` ledger bullets use a generic phrase ("as a nested workspace with its own four-file agent contract"). Domain-specific wording is a post-scaffold hand-edit.
- With `overwrite=false`, existing parent and child files must pass upstream and hierarchy compatibility checks before non-`AGENT.md` hierarchy patches are applied or verified. Existing `AGENT.md` files are verified only; missing hierarchy or immutability clauses are fatal. This allows a partial failed run to be retried without requiring a clean target directory.
