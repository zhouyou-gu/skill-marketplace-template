---
name: chat-to-skill-publisher
description: Turn the current chat history and optional pasted agent transcripts into a reusable skill package. Use when a conversation already contains a repeatable workflow that should be drafted in the current project `.temp/` folder and optionally published into a `skill-marketplace-template`-style marketplace. Do not use it for single-file skill edits, ad-hoc note taking, or publishing without first extracting a reusable workflow.
---

# Chat to Skill Publisher

## Trigger

- Use when the user wants to turn a conversation into a reusable skill package.
- Use when the current in-agent chat already contains a stable workflow that should be saved as a skill.
- Use when the user provides optional pasted transcript text from Claude or another agent to supplement the current chat.
- Do not use this skill for small edits to an existing skill unless the main job is still deriving a new reusable skill from chat history.
- Do not use this skill when the conversation has no repeatable workflow yet; refine the workflow first.

## Inputs

- `project_dir`: current project root where the draft should be staged under `.temp/<skill-id>/`
- `skill_brief`: short instruction describing what kind of skill should be extracted
- `transcript_text`: optional pasted transcript text from Claude or another agent
- `skill_id_hint`: optional preferred skill id
- `marketplace_repo_url`: optional target marketplace repository URL, defaulting to `https://github.com/zhouyou-gu/skill-marketplace-template`
- `publish`: when true, publish after drafting
- `dry_run`: when true, return the draft and publish plan without writing

## Workflow

1. Read the current chat history and any `transcript_text`, then isolate the reusable workflow: triggers, inputs, outputs, failure rules, and concise normalized examples.
2. Interact with the user when the workflow is ambiguous or when too much of the transcript is one-off context rather than reusable instruction.
3. Resolve the skill id from `skill_id_hint` or from the workflow itself. Keep it lowercase kebab-case and consistent across folder name, `SKILL.md`, and `skill.yaml`.
4. Draft a full skill package in `project_dir/.temp/<skill-id>/`: `SKILL.md`, `skill.yaml`, `tool.json`, `README.md`, and `examples/`.
5. If `project_dir` is a git repository and `.temp/` is not ignored, prefer adding a local-only ignore via `.git/info/exclude` instead of editing tracked ignore files. If that is not possible, continue with a warning.
6. Keep the draft aligned to `skill-marketplace-template` conventions: matching ids, allowed category, required metadata, valid tool contract, and concise reusable examples.
7. If `publish` is false, stop after drafting and return the draft summary.
8. If `publish` is true, resolve the marketplace target from `marketplace_repo_url` by preferring a matching local clone. If a local clone is available, publish into `skills/<skill-id>/` there and run the validation and registry build checks. If no local clone is available, keep the draft and return a publish-ready summary with warnings.

## Outputs

- `skill_id`
- `draft_path`
- `published`
- `published_target`
- `summary`
- `files_created`
- `warnings`
- `open_questions`

## Failure / Escalation

- If the chat does not contain a reusable workflow, stop with `published=false` and explain what is missing in `open_questions`.
- If the extracted workflow would preserve too much raw transcript narrative, rewrite it into reusable instructions or stop and ask the user what should be retained.
- If `publish=true` but no matching local clone can be resolved for `marketplace_repo_url`, do not guess a publish path; keep the local draft and return warnings.
- If the generated metadata or tool contract would violate marketplace conventions, fix the draft before publishing or stop with explicit warnings.

## Tool Contract

- Read [`tool.json`](tool.json) for the authoritative schema.
- `project_dir` and `skill_brief` are required.
- Use current in-agent chat history when available; `transcript_text` is optional supporting input.
- `publish` defaults to `false`; explicit publish intent is required before modifying a marketplace repo.
