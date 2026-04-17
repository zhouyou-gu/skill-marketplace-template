---
name: research-review-scaffold
description: Create a low-entropy `review/` workspace from a user's research intention. Use when a project needs a literature-review folder with nested agent files, root review docs, a reusable note template, and topic-derived theme folders. Do not use it to seed a paper corpus or to curate an existing review in place without first clarifying the review intention.
---

# Research Review Scaffold

## Trigger

- Use when the user wants a `review/` folder created from a research topic or research intention.
- Use when the user needs a clean literature-review scaffold before collecting sources.
- Use when the user wants topic-derived theme folders and topic-aware review framing, but not a seeded corpus.
- Do not use this skill to create paper notes, source-index rows, or bibliography entries in the initial scaffold.
- Do not use this skill when the research intention is still too vague to derive stable review themes; refine the intention first.

## Inputs

- `project_dir`: project root where the review workspace should be created
- `research_intention`: concise statement of the review topic or research question
- `review_dir`: optional relative path for the review folder, default `review`
- `chat_context`: optional conversation context that helps clarify wording and theme derivation
- `theme_count_hint`: optional preferred starting theme count; default behavior is approximately 3 themes
- `overwrite`: when true, allow replacing existing scaffold files; otherwise skip collisions
- `dry_run`: when true, return the scaffold plan without writing

## Workflow

1. Read `research_intention` and any `chat_context`, then clarify the review question until the intended literature scope is stable enough to scaffold.
2. Derive a low-entropy starting theme map from the user's intention. Default to about 3 themes when no `theme_count_hint` is provided, but do not hard-code a maximum.
3. Resolve the target review folder as `project_dir/<review_dir>`.
4. Create a self-contained review workspace even when no parent agent workspace exists.
5. Scaffold the four base agent files by invoking the `agent-files` skill (tool `agent_files_init`) with `target_dir = project_dir/<review_dir>`, `mission` derived from the stabilized `research_intention`, and the same `overwrite` flag. This is the mechanism by which the parent relationship to `agent-files` is realized — do not re-implement the four base templates locally. On completion the target folder holds:
   - `AGENT.md`
   - `AGENT_GOAL.md`
   - `AGENT_HARNESS.md`
   - `AGENT_PROGRESS.md`
6. Always scaffold the root review docs:
   - `README.md`
   - `methodology.md`
   - `summary.md`
   - `source-index.md`
   - `references.bib`
   - `reference-audit.md`
   - `templates/paper-note-template.md`
7. Create numbered theme folders using `NN-<theme>/` and preserve user-approved wording for the theme names whenever possible.
8. Initialize topic-aware scaffold text only:
   - `summary.md` contains framing and placeholder synthesis sections, not final conclusions
   - `source-index.md` contains only the canonical header row
   - `references.bib` is empty or stubbed
   - no literature notes, source rows, or bibliography entries are created in v1
9. If the topic crosses domains, mark transfer into the target domain as inference in the scaffold text unless the user clearly scopes the review as cross-domain by design.
10. If `overwrite` is false, skip existing files cleanly and return them in `files_skipped`.
11. If `dry_run` is true, perform steps 1–3 and 7 (derive the theme map) without writing. Return `written=false`, the planned `review_path`, the planned `theme_folders`, and the list of files that would be created in `files_created` as intent only; leave `files_skipped` empty; do not invoke `agent_files_init`.

## Outputs

- `review_path`
- `theme_folders`
- `files_created`
- `files_skipped`
- `summary`
- `written`
- `warnings`
- `open_questions`

## Failure / Escalation

- If the research intention is too ambiguous to derive a stable review question or theme map, stop with `written=false` and list the blockers in `open_questions`.
- If the derived themes are obviously unstable or one-off chat artifacts, refine them with the user before writing.
- If the target folder already exists and `overwrite=false`, do not replace files silently; skip them and report the collisions.
- If the request expands into corpus building, note taking, or bibliography population, state that those are follow-on review tasks rather than part of the initial scaffold.

## Tool Contract

- Read [`tool.json`](tool.json) for the authoritative schema.
- `project_dir` and `research_intention` are required.
- `review_dir`, `chat_context`, `theme_count_hint`, `overwrite`, and `dry_run` are optional.
- Return the full output envelope even when no write occurs.
