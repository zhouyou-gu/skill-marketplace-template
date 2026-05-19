# Expected Tree Layout

Result of running the skill with the inputs in `request.json`.

```text
/tmp/example-workspace/my-project/
├─ AGENT.md                       # base agent-files parent template
├─ AGENT_GOAL.md                  # mission: "Maintain a coherent parent workspace..."
├─ AGENT_HARNESS.md               # base + progress-scope rule bullet injected under ## Reusable Preferences
├─ AGENT_PROGRESS.md              # base + seeded ## Completed Changes after child success:
│                                 #   "Parent-scope entries only. This seed is written after every
│                                 #    listed nested workspace has completed its hierarchy contract.
│                                 #    Changes internal to nested workspaces live in their own progress
│                                 #    file (`module-a/AGENT_PROGRESS.md`, `module-b/AGENT_PROGRESS.md`)."
│                                 #   - [Scaffold] Created `my-project/` with the four-file agent
│                                 #     control contract from the upstream `agent-files` template.
│                                 #   - [Scaffold] Created `module-a/` as a nested workspace with its
│                                 #     own four-file agent contract.
│                                 #   - [Scaffold] Created `module-b/` as a nested workspace with its
│                                 #     own four-file agent contract.
├─ module-a/
│  ├─ AGENT.md                    # immutable nesting-aware template (parent-first read order,
│  │                              # Precedence binding to `my-project/`, Update Routing back
│  │                              # to ../AGENT_PROGRESS.md, Boundary)
│  ├─ AGENT_GOAL.md               # mission: "Own the first area of work..."
│  │                              # + first Constraints bullet:
│  │                              #   "The parent `my-project/` mission remains the outer
│  │                              #    boundary for this workspace."
│  │                              # + child-mission and current-turn context constraints
│  ├─ AGENT_HARNESS.md            # base agent-files template, unchanged
│  └─ AGENT_PROGRESS.md           # base agent-files template, unchanged
└─ module-b/
   ├─ AGENT.md                    # same immutable nesting-aware template, {{ child_relative_dir }} = module-b
   ├─ AGENT_GOAL.md               # mission + outer-boundary constraint
   ├─ AGENT_HARNESS.md            # base
   └─ AGENT_PROGRESS.md           # base
```

## Substitutions applied

- `{{ parent_name }}` → `my-project` (derived from basename of `parent_dir`)
- `{{ child_relative_dir }}` → `module-a` for the first child, `module-b` for the second
- `{{ child_progress_paths_csv }}` → `` `module-a/AGENT_PROGRESS.md`, `module-b/AGENT_PROGRESS.md` ``

## Applied-or-verified changes map

```json
{
  "/tmp/example-workspace/my-project": [
    "progress_scope_rule",
    "parent_progress_seed"
  ],
  "/tmp/example-workspace/my-project/module-a": [
    "child_agent_md",
    "child_outer_boundary"
  ],
  "/tmp/example-workspace/my-project/module-b": [
    "child_agent_md",
    "child_outer_boundary"
  ]
}
```
