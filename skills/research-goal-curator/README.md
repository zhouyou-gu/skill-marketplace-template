# Research Goal Curator

`research-goal-curator` is a post-scaffold companion to `agent-files`.

It curates an existing `AGENT_GOAL.md` from a research brief and optional chat context, with an emphasis on making the research intention explicit before anything is written. Chat context is supporting evidence; it does not become persistent scope unless the user approves it as goal-file content.

## Use It When

- a workspace already contains `AGENT_GOAL.md`
- the user wants to refine, clarify, or save a research goal
- you need to preserve exact user-approved wording while making the whole goal file internally consistent

## Scaffold First When

- the workspace does not yet have `AGENT_GOAL.md`
- the user wants to scaffold the full AGENT-file contract

Route to `agent-files` for generic workspaces or `manuscript-revision-agent-files` for LaTeX IEEE manuscript revision, then return to this skill to curate the goal file.

## Inputs

- `target_dir`
- `research_brief`
- optional `chat_context` (supporting context only, not persistent scope unless explicitly approved)
- optional `dry_run`

## Example Flow

1. Verify that `target_dir/AGENT_GOAL.md` exists.
2. Read the current goal file plus the research brief and any chat context.
3. Interact with the user until the goal wording is explicit.
4. Preserve approved wording where the user has clearly chosen it.
5. Preserve neutral scaffold entries such as "Not yet specified by user" when the user has not approved durable content for that section.
6. Update the full goal file, or preview the update when `dry_run=true`.

## Parents

- `agent-files` — this skill refines the hardened `AGENT_GOAL.md` file that `agent-files` scaffolds for generic workspaces.
- `manuscript-revision-agent-files` — this skill also refines the hardened `AGENT_GOAL.md` file that the manuscript-revision scaffolder produces for LaTeX IEEE workspaces.
