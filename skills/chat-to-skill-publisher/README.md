# Chat to Skill Publisher

`chat-to-skill-publisher` turns a reusable workflow from chat history into a complete skill package.

It works in two stages:

1. draft the skill in the current project under `.temp/<skill-id>/`
2. publish it into a `skill-marketplace-template`-style repository only when explicitly requested

## Use It When

- the current chat already contains a repeatable workflow worth saving
- you have optional pasted transcript text from Claude or another agent
- you want a full reviewable skill package rather than just a spec

## Inputs

- `project_dir`
- `skill_brief`
- optional `transcript_text`
- optional `skill_id_hint`
- optional `marketplace_repo_url`
- optional `marketplace_local_path`
- optional `publish`
- optional `dry_run`

## Draft Behavior

- drafts to `project_dir/.temp/<skill-id>/`
- prefers local-only ignore configuration for `.temp/` when the project is a git repo
- keeps only reusable workflow and small normalized examples

## Parent Inference

- resolves the marketplace source from `marketplace_local_path` first, then a local clone matching `marketplace_repo_url`; skips inference with a warning otherwise
- loads every existing `skills/*/skill.yaml` and classifies each existing skill as a parent candidate, an overlap warning, or unrelated
- interacts with the user to confirm each parent candidate before writing it into the draft's `skill.yaml:parents` and a matching `## Parents` section in the draft README
- surfaces overlap warnings so heavy duplication with an existing skill is caught before publish
- returns the confirmed ids in `inferred_parents`; an empty list is valid

## Publish Behavior

- publish is gated by explicit request
- publishing prefers a matching local clone of `marketplace_repo_url`
- if no local clone is available, the draft is kept and the result returns a publish-ready warning summary
