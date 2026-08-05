---
name: vocabulary-agent-files
description: Scaffold AGENT_VOCABULARY.md next to an agent-files contract as the single wording authority for a workspace, with noun/adjective/verb lists kept plain, self-contained, and synonym-free, plus the workflow to load words from the workspace's documents and code and merge them. Use when a workspace's reports and code need one fixed vocabulary; do not use for one-off glossaries outside an agent-files workspace.
---

# Vocabulary Agent Files

## Trigger

- Use when a workspace governed by the `agent-files` four-file contract needs one fixed vocabulary shared by its documents and code.
- Use when reports and code in a workspace have drifted into near-synonyms and need a recorded merge procedure.
- Do not use for a one-off glossary in a workspace that has no agent-files contract; scaffold the contract first or keep a plain glossary instead.
- Do not use to rename stored data keys, command-line names, or frozen experiment text; those surfaces are explicitly protected below.

## Inputs

- `target_dir`: directory holding the agent-files contract where `AGENT_VOCABULARY.md` will be created
- `sources`: optional list of files or directories (documents, code) to scan for the workspace's established words
- `overwrite`: when true, an existing `AGENT_VOCABULARY.md` is replaced; otherwise it is kept and recorded in `files_skipped`

## The Vocabulary File Contract

`AGENT_VOCABULARY.md` opens with a short statement — "This file lists the words used in the documents and the code. Use these words and no others." — followed by three highlighted rules in one blockquote:

1. **Merge rule.** If two words mean the same thing, keep only the most proper one and replace the other everywhere.
2. **Self-contained rule.** Each description uses only everyday words and words defined earlier in the file.
3. **Recursive word check.** Check every description word by word, and recursively: any vague word, and any word that is neither an everyday word nor defined earlier in the file, must be replaced by a concrete one — then re-check the replacement, until every word passes.

The body holds four sections, each one entry per line in the format `word: short description.`:

- `## Nouns`, `## Adjectives`, `## Verbs` — the established words, ordered so every description depends only on entries above it (base words of the domain first).
- `## Unmerged Words (temporary memory)` — words found in the sources that are not yet merged, one line each in the format `word — where it lives — what to do` (a merge target, or `open` when no proper word is chosen yet). This section is working memory: lines are removed when their merge is executed and added when new drift is found.

Description style, enforced on every entry:

- plain everyday language; no cute or invented phrasing;
- no number-specific facts (counts, sizes, ranges belong in the documents, not in word meanings);
- one word per concept, one concept per word.

## Workflow

1. Receive `target_dir`. Verify the agent-files contract is present (at least `AGENT.md` and `AGENT_HARNESS.md`). If absent, stop and ask whether to run `agent-files` first; do not create the vocabulary file in an ungoverned directory.
2. If `AGENT_VOCABULARY.md` exists and `overwrite` is false, keep it, record it in `files_skipped`, and continue with the load-and-merge steps against the existing file.
3. Otherwise copy the template from `examples/AGENT_VOCABULARY.md` into `target_dir`.
4. **Load.** Scan each entry in `sources` for the workspace's recurring domain words. Put clearly established words into the noun/adjective/verb lists, inserting each entry at the position where its description only needs earlier entries. Put synonym pairs, misnamed identifiers, and undecided words into `## Unmerged Words` with their location and a proposed action.
5. **Merge.** For each unmerged line whose action is a merge, replace the losing word with the winning word across the sources — in prose, comments, and printed output only. Never rename these protected surfaces: stored data keys, command-line names and flags, and frozen prompt or experiment text; when a protected surface keeps an old word, record that fact as a line in `## Unmerged Words` so later agents do not "fix" it.
6. **Check.** Re-run the three header rules over the whole file: apply the merge rule inside the lists, re-order entries that use later words, and run the recursive word check on every description; base words of the domain that surface during the check are added at the top of the nouns.
7. **Harness extension (bounded).** Append one preference bullet to the `## Reusable Preferences` section of `target_dir/AGENT_HARNESS.md`, replacing its empty placeholder when present: use `AGENT_VOCABULARY.md` as the wording authority for all documents and code, add missing words there before first use, and apply its merge rule. Do not modify `AGENT.md` or `AGENT_GOAL.md`; do not add any other harness content.
8. Return `target_dir`, `files_created`, `files_skipped`, `unmerged_count`, and `warnings`.

## Outputs

- `target_dir`
- `files_created`
- `files_skipped`
- `unmerged_count`
- `warnings`

## Failure / Escalation

- If `target_dir` has no agent-files contract, stop and ask before writing; the vocabulary file is a bounded extension of that contract, not a standalone artifact.
- If a merge would touch a protected surface (stored data keys, command-line names, frozen text), do not rename it; record the kept old name in `## Unmerged Words` and continue.
- If two established words resist merging because the documents use both with genuinely different meanings, keep both, and make the two descriptions state the difference plainly.
- If the user questions a single word in a description, treat it as a recursive-check trigger for that entry: replace the word with a concrete one and re-check the result, rather than defending the old wording.
- If loading from `sources` would import one-off narrative rather than established words, skip those words; the vocabulary lists only words the workspace actually reuses.

## Tool Contract

- Read [`tool.json`](tool.json) for the authoritative schema.
- `target_dir` is required; `sources` and `overwrite` are optional.
- The template lives in [`examples/AGENT_VOCABULARY.md`](examples/AGENT_VOCABULARY.md) and is copied, then filled by the load step; the three header rules are fixed template text and are not reworded per workspace.
- `AGENT_VOCABULARY.md` is agent-editable by design — unlike `AGENT.md` and `AGENT_GOAL.md`, it is meant to be updated whenever words are added or merged — but every edit must leave the file passing its own three header rules.
