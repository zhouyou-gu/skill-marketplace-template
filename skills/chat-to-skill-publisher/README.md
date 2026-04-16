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
- optional `publish`
- optional `dry_run`

## Draft Behavior

- drafts to `project_dir/.temp/<skill-id>/`
- prefers local-only ignore configuration for `.temp/` when the project is a git repo
- keeps only reusable workflow and small normalized examples

## Publish Behavior

- publish is gated by explicit request
- publishing prefers a matching local clone of `marketplace_repo_url`
- if no local clone is available, the draft is kept and the result returns a publish-ready warning summary
