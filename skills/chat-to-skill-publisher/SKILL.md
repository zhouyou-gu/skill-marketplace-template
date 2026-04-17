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
- `marketplace_local_path`: optional filesystem path to a local clone of the marketplace repository; when set, it is used as the source for parent inference and for publish
- `publish`: when true, publish after drafting
- `dry_run`: when true, return the draft and publish plan without writing

## Workflow

1. Read the current chat history and any `transcript_text`, then isolate the reusable workflow: triggers, inputs, outputs, failure rules, and concise normalized examples.
2. Interact with the user when the workflow is ambiguous or when too much of the transcript is one-off context rather than reusable instruction.
3. Resolve the skill id from `skill_id_hint` or from the workflow itself. Keep it lowercase kebab-case and consistent across folder name, `SKILL.md`, and `skill.yaml`.
4. Draft a full skill package in `project_dir/.temp/<skill-id>/`: `SKILL.md`, `skill.yaml`, `tool.json`, `README.md`, and `examples/`.
5. If `project_dir` is a git repository and `.temp/` is not ignored, prefer adding a local-only ignore via `.git/info/exclude` instead of editing tracked ignore files. If that is not possible, continue with a warning.
6. **Genericize the draft** (mandatory, see "Genericize Before Publish" below). The chat history the draft was derived from is shaped by one specific project; the published skill is not. Review every file in the draft and rewrite project ties so the skill reads as a reusable workflow, not a replay of the originating session. This step runs before parent inference because a non-generic draft mis-matches existing parents.
7. Infer parent skills from the target marketplace (see "Parent Inference" below) and update the draft in place: record the confirmed ids on `inferred_parents`, write them into the draft's `skill.yaml` under `parents`, and add a matching `## Parents` section to the draft's `README.md` with one line per parent explaining the relationship.
8. Keep the draft aligned to `skill-marketplace-template` conventions: matching ids, allowed category, required metadata, valid tool contract, non-self-referential parents, and concise reusable examples.
9. If `publish` is false, stop after drafting and return the draft summary.
10. If `publish` is true, resolve the marketplace target from `marketplace_local_path` or `marketplace_repo_url` by preferring a matching local clone. If a local clone is available, publish into `skills/<skill-id>/` there and run the validation and registry build checks. If no local clone is available, keep the draft and return a publish-ready summary with warnings.

## Genericize Before Publish

The draft must be reusable by someone who was not in the originating chat. A skill that encodes the local project's names, paths, datasets, or domain vocabulary is not reusable — it is a snapshot. Review every file in the draft against the checklist below and rewrite project ties before parent inference runs. A non-generic draft also mis-matches parent inference because the inference compares the draft against existing generic skills.

**Strip or replace all of the following:**

- Absolute filesystem paths under the originating user's home, repo, or project (`/Users/<name>/...`, `/home/<name>/...`, specific repo names). Replace with `/tmp/<example>/...` or a generic placeholder.
- Proper nouns from the originating project: project names, codenames, dataset names, topic names, product names. Replace example payloads with domain-neutral stand-ins (`my-project`, `module-a`, `module-b`, `area-a`, `area-b`, or a widely recognized analogue).
- Domain-specific vocabulary in descriptions and prose when a neutral term works equally well. Keep domain terms only when they are load-bearing for the skill's purpose.
- Repository URLs that point at the originating user's personal fork. Leave `repo:` unset or use a placeholder; do not hard-code the author's account.
- Install-time dependencies the skill runtime does not actually invoke (for example, `install: pip: <pkg>` entries for libraries the tool never imports). Remove rather than carry dead weight.
- Example file names, variable names, and mission strings that echo the originating chat's domain. Rewrite in abstract or widely applicable terms.
- Sibling-skill references that presume a specific marketplace layout beyond what `parents` already encodes.
- Narrative that reads like "we did X in this session" rather than "the skill does X". Rewrite to imperative, reusable instruction.

**Preserve:**

- Substitution variables like `{{ parent_name }}` or `{{ child_relative_dir }}` — generic by construction.
- The skill's own id and name, even when derived from a project-specific chat, as long as the id is reusable vocabulary.
- Workflow steps and invariants that are genuinely load-bearing, even if discovered in a specific domain.

**Escalation:**

- If genericization would gut the skill's value (the reusable core is inseparable from one domain), stop before publish and record the reason in `open_questions`.
- If a project tie is load-bearing and cannot be abstracted, keep it and emit a warning naming which tie remains and why.
- Record in `warnings` every non-trivial rewrite (path → placeholder, domain term → neutral term, dep removed) so the user can audit what changed between the chat-derived draft and the publishable skill.

## Parent Inference

- Resolve the marketplace source in this order: explicit `marketplace_local_path`, then a local clone matching `marketplace_repo_url`, then skip inference with a warning.
- Enumerate every `skills/*/skill.yaml` in the resolved marketplace and load `id`, `description`, `tags`, and existing `parents` for each.
- Compare the draft's brief, workflow, inputs, and outputs against each existing skill. Classify each existing skill as one of:
  1. `parent_candidate` — the draft depends on, extends, composes, or specializes this skill's functionality (for example: the draft consumes files this skill scaffolds, or the draft is a domain-specific variant of this skill's workflow).
  2. `overlap_warning` — the draft shares inputs, outputs, or purpose at the same abstraction level; flag this and ask the user whether to narrow the draft or abandon it to avoid duplication.
  3. `unrelated` — no meaningful relationship; ignore.
- Interact with the user to confirm each `parent_candidate` before writing it to the draft. Do not auto-add parents silently. Record any rejected candidate as an `open_question` when the evidence is close.
- Reject self-reference and duplicate ids in the confirmed list. Every confirmed parent must match an existing skill id in the resolved marketplace.
- Emit each `overlap_warning` as a string in `warnings`; the user decides whether to proceed, narrow, or stop.
- Return the final confirmed list in `inferred_parents`. An empty list is valid and means no parent relationships were found.

## Outputs

- `skill_id`
- `draft_path`
- `published`
- `published_target`
- `summary`
- `files_created`
- `inferred_parents`
- `warnings`
- `open_questions`

## Failure / Escalation

- If the chat does not contain a reusable workflow, stop with `published=false` and explain what is missing in `open_questions`.
- If the extracted workflow would preserve too much raw transcript narrative, rewrite it into reusable instructions or stop and ask the user what should be retained.
- If `publish=true` but no matching local clone can be resolved for `marketplace_repo_url`, do not guess a publish path; keep the local draft and return warnings.
- If the generated metadata or tool contract would violate marketplace conventions, fix the draft before publishing or stop with explicit warnings.
- If parent inference cannot resolve a marketplace source, skip inference, set `inferred_parents: []`, and add a warning — do not block drafting.
- If the draft overlaps heavily with an existing skill (an `overlap_warning`), surface the warning, stop before publishing, and ask the user whether to narrow the draft or abandon it.

## Tool Contract

- Read [`tool.json`](tool.json) for the authoritative schema.
- `project_dir` and `skill_brief` are required.
- Use current in-agent chat history when available; `transcript_text` is optional supporting input.
- `publish` defaults to `false`; explicit publish intent is required before modifying a marketplace repo.
- `inferred_parents` is always returned (possibly empty) so the caller can see exactly which parent ids were written into the draft.
