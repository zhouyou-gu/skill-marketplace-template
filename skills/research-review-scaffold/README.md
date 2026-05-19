# Research Review Scaffold

`research-review-scaffold` creates a low-entropy `review/` workspace from a user's research intention.

It is for the step before literature collection. The skill creates the review structure, nested review agent files, root review docs, a reusable paper-note template, and topic-derived theme folders. It does not create a seeded corpus.

## Use It When

- a user has a research topic and wants a clean review folder created from it
- the project needs a review workspace even though no parent agent workspace exists
- the user wants theme folders and initial review framing before note-taking begins

## It Creates

- nested review agent files
- `README.md`, `methodology.md`, `summary.md`, `source-index.md`, `references.bib`, and `reference-audit.md`
- `templates/paper-note-template.md`
- numbered `NN-<theme>/` folders derived from the topic

## It Does Not Create in v1

- literature notes
- source-index rows beyond the header
- bibliography entries
- matrices, scripts, caches, or full-text workflow files

## Inputs

- `project_dir`
- `research_intention` (used to derive a purpose-only review mission)
- optional `review_dir`
- optional `chat_context` (supporting context only; not persistent scope unless intentionally converted into mission/scaffold text)
- optional `theme_count_hint`
- optional `overwrite`
- optional `dry_run`

## Parents

- `agent-files` — this skill scaffolds the hardened four base AGENT files inside the review workspace with a purpose-only mission, then adds review-specific root docs, a paper-note template, and topic-derived theme folders on top of that base.

## Example Flow

1. Read the user's research intention and any topic-defining chat context.
2. Interact to stabilize the review question, decide which chat context becomes durable scaffold text, and derive a compact seed theme map.
3. Create the nested review workspace with low-entropy root docs and a paper-note template.
4. Return the created and skipped files, the chosen theme folders, and any open questions.
