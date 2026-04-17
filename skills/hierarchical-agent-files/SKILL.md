---
name: hierarchical-agent-files
description: Scaffold a two-level parent + children agent-file hierarchy in one shot. Delegates per-node base scaffolding to the agent-files skill, then installs hierarchy-specific clauses so every node is internally consistent on first read. Use when a workspace needs a nested four-file contract with parent-first read order, scope binding to the parent, and the progress-scope rule wired in.
---

# Hierarchical Agent Files Scaffold

## Trigger

- Use when a workspace needs a parent-plus-children agent-file hierarchy where each nested folder carries its own four-file contract and the parent carries the canonical progress-scope rule.
- Use when the single-workspace `agent-files` skill is not enough because two or more sibling nested workspaces must share a common parent mission and a common harness.
- Do not use for a flat, single-folder contract; route to `agent-files`.
- Do not use for trees deeper than parent + direct children; grandchildren are out of scope in this version.
- Do not use to retrofit hierarchy onto an existing hand-edited parent that already has non-trivial content in its four files unless `overwrite=true`.

## Inputs

- `parent_dir`: directory where the parent four-file contract is scaffolded
- `parent_mission`: long-term mission written into the parent `AGENT_GOAL.md`; required so the contract is internally consistent on first read
- `parent_objective`: optional in-flight objective for the parent `AGENT_PROGRESS.md`
- `parent_name`: short name used in child cross-references; defaults to `basename(parent_dir)` with trailing slash stripped
- `children`: non-empty list of direct-child workspaces, each with:
  - `relative_dir`: single path segment (no `/`, no `..`, not absolute)
  - `mission`: child's long-term mission
  - `objective`: optional child in-flight objective
- `overwrite`: when true, existing files are replaced; otherwise base files are skipped per node, but hierarchy patches still run

## Workflow

1. **Validate preconditions**. Abort before any filesystem write if:
   - the `agent-files` skill (tool `agent_files_init`) is not reachable at runtime
   - any `children[i].relative_dir` is absolute, contains `/` or `\`, contains `..`, or collides with another child's `relative_dir`
   - any resolved child path escapes `parent_dir`
   - `parent_mission` is empty or a literal placeholder
   - `parent_dir` already has a four-file contract (any of `AGENT.md`, `AGENT_GOAL.md`, `AGENT_HARNESS.md`, `AGENT_PROGRESS.md` exists) and `overwrite` is false

2. **Scaffold parent**. Invoke `agent_files_init` with `target_dir = parent_dir`, `mission = parent_mission`, `objective = parent_objective` (if provided), and `overwrite`. Record `files_created` and `files_skipped` under the parent's absolute path.

3. **Patch parent `AGENT_HARNESS.md`**. Under `## Reusable Preferences`, replace the placeholder bullet `- _(populate as rules emerge)_` with the verbatim progress-scope rule from `examples/parent-harness.progress-scope.snippet`. If the bullet is already present verbatim (idempotent re-run), skip and emit a warning.

4. **Seed parent `AGENT_PROGRESS.md`**. Under `## Completed Changes`, replace the placeholder bullet with the seed from `examples/parent-progress.seed.snippet`. The seed renders: a header sentence naming every child's `AGENT_PROGRESS.md` path, one `[Scaffold]` bullet for the parent itself, and one `[Scaffold]` bullet per child using the generic phrase "as a nested workspace with its own four-file agent contract". Substitute `{{ parent_name }}`, `{{ child_progress_paths_csv }}` (comma-separated list like `` `child_a/AGENT_PROGRESS.md`, `child_b/AGENT_PROGRESS.md` ``), and `{{ child_relative_dir }}` per child.

5. **For each child** (in input order):
   a. Resolve `child_dir = join(parent_dir, child.relative_dir)`.
   b. Invoke `agent_files_init` with `target_dir = child_dir`, `mission = child.mission`, `objective = child.objective` (if provided), and `overwrite`.
   c. **Replace the scaffolded child `AGENT.md` wholesale** with the rendered `examples/child-AGENT.md.template`. Substitutions: `{{ parent_name }}` and `{{ child_relative_dir }}`. Rationale: the child `AGENT.md` is a slim, nesting-specific file (~46 lines) that differs structurally from the base single-workspace template. Wholesale replacement is cleaner than patching four sections of the base.
   d. **Patch child `AGENT_GOAL.md`**. Locate `## Constraints`; prepend the rendered `examples/child-AGENT_GOAL.constraint.snippet` as the first bullet. If `## Constraints` is absent (user has already hand-edited the file), skip this patch and emit a warning.
   e. Leave the child `AGENT_HARNESS.md` and `AGENT_PROGRESS.md` as scaffolded by `agent-files`. The progress-scope rule lives in the parent harness and governs the child by inheritance; no per-child mirror is needed.

6. **Return** `parent_dir`, `parent_name`, `children_created`, `files_created` per node, `files_skipped` per node, `patches_applied` per node, and `warnings`.

## Patches applied

Parent patches (keyed by `parent_dir`):

- `progress_scope_rule` — verbatim bullet injected into `AGENT_HARNESS.md § Reusable Preferences`
- `parent_progress_seed` — header sentence + one `[Scaffold]` bullet per node injected into `AGENT_PROGRESS.md § Completed Changes`

Child patches (keyed by `child_dir`, per child):

- `child_agent_md` — wholesale replacement of the scaffolded `AGENT.md` with the nesting-aware template
- `child_outer_boundary` — outer-boundary constraint bullet prepended under `AGENT_GOAL.md § Constraints`

## Failure and recovery

- Missing `agent-files` runtime, invalid `relative_dir`, empty mission, or pre-existing parent contract without `overwrite`: abort with a specific error; nothing is written.
- Child directory already has a prior four-file contract and `overwrite=false`: proceed; base files are recorded in `files_skipped` but child patches still run because they are idempotent within the relevant sections.
- Parent harness already contains the progress-scope rule verbatim: skip the injection; emit a warning.
- Child `AGENT_GOAL.md` has been hand-edited and no longer contains `## Constraints`: skip the outer-boundary patch; emit a warning.
- Partial-tree failure (for example, one child's `agent_files_init` call fails mid-loop): no automatic rollback. Warnings list exactly which nodes succeeded and which failed. The caller re-runs the skill on the same inputs; already-scaffolded nodes are handled per the overwrite semantics above.

## Return shape

See `tool.json`. `patches_applied` lets callers verify that every intended patch landed even when `files_skipped` is non-empty.
