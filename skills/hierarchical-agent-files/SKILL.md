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
- `parent_mission`: one- or two-sentence long-term mission statement written into the parent `AGENT_GOAL.md`; required so the contract is internally consistent on first read. It must not include reusable workflow rules, current state, next steps, or transient objectives.
- `parent_objective`: optional transient in-flight objective for the parent `AGENT_PROGRESS.md`; it must not define permanent mission, scope, policy, or success criteria
- `parent_name`: short name used in child cross-references; defaults to `basename(parent_dir)` with trailing slash stripped
- `children`: non-empty list of direct-child workspaces, each with:
  - `relative_dir`: single path segment (no `/`, no `..`, not absolute)
  - `mission`: child's one- or two-sentence long-term mission statement; it must stay within the parent mission and avoid reusable workflow/current-state details
  - `objective`: optional transient child in-flight objective
- `overwrite`: when true, existing files are replaced; otherwise compatible existing parent and child files are recorded in `files_skipped` per node, and hierarchy patches or verifications run only after upstream and hierarchy compatibility checks pass

## Workflow

1. **Validate preconditions**. Abort before any filesystem write if:
   - the `agent-files` skill (tool `agent_files_init`) is not reachable at runtime
   - any `children[i].relative_dir` is absolute, contains `/` or `\`, contains `..`, or collides with another child's `relative_dir`
   - any resolved child path escapes `parent_dir`
   - `parent_mission` is empty, a literal placeholder, or mixes in workflow rules/current state/next steps
   - any child `mission` is empty, a literal placeholder, outside the parent mission, or mixes in workflow rules/current state/next steps
   - `parent_objective` or any child `objective` reads like permanent mission, scope, policy, or success criteria
   - `parent_dir` already has a four-file contract and `overwrite` is false, but the existing parent files fail upstream `agent-files` compatibility or cannot safely accept/verify the parent hierarchy patches

2. **Scaffold or verify parent**. Invoke `agent_files_init` with `target_dir = parent_dir`, `mission = parent_mission`, `objective = parent_objective` (if provided), and `overwrite`. If `overwrite=false` and compatible parent files already exist, record them in `files_skipped` under the parent's absolute path and continue with hierarchy patch verification.

3. **Patch or verify parent `AGENT_HARNESS.md`**. Under `## Reusable Preferences`, replace the placeholder bullet `- _(populate as rules emerge)_` with the verbatim progress-scope rule from `examples/parent-harness.progress-scope.snippet`. If the bullet is already present verbatim, treat it as verified and emit a warning. If neither the placeholder nor the rule is present and `overwrite=false`, abort rather than guessing where to place parent-scope policy.

4. **For each child** (in input order):
   a. Resolve `child_dir = join(parent_dir, child.relative_dir)`.
   b. Invoke `agent_files_init` with `target_dir = child_dir`, `mission = child.mission`, `objective = child.objective` (if provided), and `overwrite`. If `overwrite=false` and existing child files fail the upstream compatibility checks, abort before applying child hierarchy patches.
   c. **Install or verify child `AGENT.md`**. If `AGENT.md` was created in this run, or `overwrite=true`, replace the scaffolded child `AGENT.md` with the rendered `examples/child-AGENT.md.template`. If `overwrite=false` and `AGENT.md` already existed, do not replace it; verify that it already contains the hierarchy contract: parent-first read order, `## Precedence`, `## Update Routing`, and an explicit reference to `{{ parent_name }}/` as the outer boundary. If any clause is missing, abort rather than creating a mixed-boundary child.
   d. **Patch or verify child `AGENT_GOAL.md`**. Locate `## Constraints`; prepend the rendered `examples/child-AGENT_GOAL.constraint.snippet` as the first constraint block. If the same block is already present, treat the patch as verified. If `## Constraints` is absent, abort rather than leaving the child without an outer-boundary constraint.
   e. Leave the child `AGENT_HARNESS.md` and `AGENT_PROGRESS.md` as scaffolded by `agent-files`. The progress-scope rule lives in the parent harness and governs the child by inheritance; no per-child mirror is needed.

5. **Seed or verify parent `AGENT_PROGRESS.md` after every child succeeds**. Under `## Completed Changes`, replace the neutral upstream bullet `- No completed changes recorded yet.` with the seed from `examples/parent-progress.seed.snippet`. The seed renders: a header sentence naming every child's `AGENT_PROGRESS.md` path, one `[Scaffold]` bullet for the parent itself, and one `[Scaffold]` bullet per child using the generic phrase "as a nested workspace with its own four-file agent contract". Substitute `{{ parent_name }}`, `{{ child_progress_paths_csv }}` (comma-separated list like `` `child_a/AGENT_PROGRESS.md`, `child_b/AGENT_PROGRESS.md` ``), and `{{ child_relative_dir }}` per child. If the rendered seed is already present verbatim, treat it as verified. If neither the neutral bullet nor the rendered seed is present and `overwrite=false`, abort rather than overwriting real parent progress. Do not seed parent progress before the child contracts are installed or verified.

6. **Return** `parent_dir`, `parent_name`, `children_created`, `files_created` per node, `files_skipped` per node, `patches_applied` per node, and `warnings`.

## Patches applied

Parent patches (keyed by `parent_dir`):

- `progress_scope_rule` — verbatim bullet injected or verified in `AGENT_HARNESS.md § Reusable Preferences`
- `parent_progress_seed` — header sentence + one `[Scaffold]` bullet per node injected or verified in `AGENT_PROGRESS.md § Completed Changes` after every child succeeds, replacing the upstream `No completed changes recorded yet` neutral bullet when present

Child patches (keyed by `child_dir`, per child):

- `child_agent_md` — nesting-aware `AGENT.md` installed for new/overwritten children, or verified for compatible existing children
- `child_outer_boundary` — parent-boundary constraint block prepended or verified under `AGENT_GOAL.md § Constraints`

## Failure and recovery

- Missing `agent-files` runtime, invalid `relative_dir`, dirty mission/objective content, or incompatible pre-existing parent contract with `overwrite=false`: abort with a specific error before writing files.
- Parent directory already has a prior four-file contract and `overwrite=false`: proceed only if upstream `agent-files` compatibility checks pass and the parent hierarchy patches can be applied or verified without overwriting real progress or policy. Base files are recorded in `files_skipped`; missing or unpatchable parent hierarchy clauses abort rather than creating a mixed-boundary system.
- Child directory already has a prior four-file contract and `overwrite=false`: proceed only if upstream `agent-files` compatibility checks pass and the existing child files already satisfy the hierarchy compatibility checks. Base files are recorded in `files_skipped`; missing hierarchy clauses abort rather than being papered over by replacement.
- Parent harness already contains the progress-scope rule verbatim: skip the injection; emit a warning.
- Child `AGENT_GOAL.md` has been hand-edited and no longer contains `## Constraints`: abort before continuing.
- Partial-tree failure (for example, one child's compatibility check fails mid-loop): no automatic rollback. Parent progress is not seeded until every child contract succeeds, so a failed run leaves the parent ledger neutral rather than claiming child success. Warnings list exactly which nodes succeeded and which failed. The caller re-runs the skill on the same inputs; compatible already-scaffolded parent and child nodes are handled per the overwrite semantics above.

## Return shape

See `tool.json`. `patches_applied` lets callers verify that every intended patch landed even when `files_skipped` is non-empty.

## Tool Contract

- Read [`tool.json`](tool.json) for the authoritative schema.
- The JSON schema enforces input/output shape only. The semantic checks for clean missions, transient objectives, and compatible child hierarchy adoption are workflow requirements enforced before writing or patching files.
