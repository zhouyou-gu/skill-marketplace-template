---
name: research-goal-curator
description: Curate an existing AGENT_GOAL.md from a research brief and optional chat context. Use when a workspace already has AGENT_GOAL.md and the user wants to refine or save an explicit research goal. Do not use it to scaffold AGENT files, rewrite AGENT.md or other agent files, or infer a final goal without interacting with the user.
---

# Research Goal Curator

## Trigger

- Use when a workspace already contains `AGENT_GOAL.md` and the user wants to refine, clarify, or save a research goal.
- Use when the user has a research brief, chat history, or tentative wording that should be turned into an internally consistent goal file.
- Do not use this skill to scaffold AGENT files. If `AGENT_GOAL.md` does not exist, route to the appropriate scaffolder: `agent-files` for generic workspaces or `manuscript-writing-agent-files` for LaTeX IEEE manuscript writing.
- Do not use this skill to rewrite `AGENT.md`, `AGENT_HARNESS.md`, or `AGENT_PROGRESS.md`; its write surface is only `AGENT_GOAL.md`.

## Inputs

- `target_dir`: workspace directory expected to contain `AGENT_GOAL.md`
- `research_brief`: concise statement of the research intent to preserve and refine into durable goal-file content
- `chat_context`: optional conversation excerpts, notes, or prior wording; supporting context only, not persistent scope unless explicitly approved as goal-file content
- `dry_run`: when true, return a structured preview without writing

## Workflow

1. Verify that `target_dir/AGENT_GOAL.md` exists. If it does not, stop and tell the caller to scaffold the workspace first with the appropriate scaffolder (`agent-files` for generic workspaces or `manuscript-writing-agent-files` for LaTeX IEEE manuscript writing).
2. Read the existing `AGENT_GOAL.md` and identify its current sections: statement, scope, non-goals, success criteria, and constraints.
3. Read `research_brief` and any `chat_context`, then interact with the user until the research intention is explicit enough to save. Treat chat context as evidence for wording and intent; do not turn it into persistent scope, non-goals, success criteria, or constraints unless the user explicitly approves that content for `AGENT_GOAL.md`.
4. When the user has already approved exact wording, preserve that wording unless the user explicitly asks for a revision. If approved wording mixes durable mission content with reusable workflow rules, implementation detail, current state, or next steps, surface the boundary conflict before writing; do not silently leak the misplaced content into `AGENT_GOAL.md` or silently rewrite the user's words.
5. Curate the whole `AGENT_GOAL.md` so the sections are mutually consistent and reflect the same research intention. Preserve neutral scaffold entries such as "Not yet specified by user" only when the user has not approved durable content for that section; replace them deliberately when the user approves concrete section content.
6. Run a boundary audit before writing:
   - Keep durable purpose, scope, non-goals, success criteria, and mission-level constraints in `AGENT_GOAL.md`.
   - Route reusable workflow rules and stable operating preferences to `AGENT_HARNESS.md`.
   - Route current results, completed work, blockers, and next steps to `AGENT_PROGRESS.md`.
   - Keep named mechanisms, component versions, datasets, task suites, numerical thresholds, infrastructure choices, and implementation plans in explicitly approved research specifications or implementation artifacts unless the user explicitly makes them part of the durable mission.
   - Treat a constraint as mission-level only when removing it would change the mission; validation habits, source preferences, formatting rules, and routine procedures are harness content.
7. If `dry_run` is true, return the proposed update summary without writing. Otherwise update `AGENT_GOAL.md` and return a concise report of what changed.

## Durable Goal Example

- Read [`examples/goal-after.md`](examples/goal-after.md) as the complete example of an outcome-focused, agent-immutable research goal.
- Reuse its section boundaries and amendment safeguards, not its topical wording.
- The example deliberately keeps the research hypothesis and evidence standard while routing volatile project detail elsewhere.

## Outputs

- `goal_path`
- `written`
- `summary`
- `updated_sections`
- `warnings`
- `open_questions`

## Failure / Escalation

- If `AGENT_GOAL.md` is missing, fail cleanly and route to the appropriate scaffolder: `agent-files` for generic workspaces or `manuscript-writing-agent-files` for LaTeX IEEE manuscript writing.
- If the user intention remains ambiguous after refinement, stop with `written=false` and put the remaining blockers in `open_questions`.
- If the chat contains conflicting goal statements, ask the user which wording governs before writing.
- If chat context suggests additional scope or constraints but the user has not approved them as durable goal-file content, leave the relevant neutral scaffold entries in place and report the ambiguity in `open_questions`.
- If proposed content crosses an AGENT-file boundary, report where it belongs and do not write it into `AGENT_GOAL.md` merely because it appeared in the brief, chat context, or an existing draft.
- If the request expands into broader agent-file editing, state that the other agent files are out of scope for this skill.

## Tool Contract

- Read [`tool.json`](tool.json) for the authoritative schema.
- The JSON schema enforces input/output shape only. The semantic checks for approved durable goal content and neutral scaffold-entry preservation are workflow requirements enforced before writing.
- `target_dir` and `research_brief` are required.
- `chat_context` is optional supporting input and should not override explicit user-approved wording.
- Always return the full output envelope even when no write occurs.
