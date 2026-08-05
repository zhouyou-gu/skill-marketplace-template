# Vocabulary Agent Files

Scaffold `AGENT_VOCABULARY.md` next to an `agent-files` contract as the single wording authority for a workspace, and run its load-and-merge workflow over the workspace's documents and code.

## What It Creates

One file, `AGENT_VOCABULARY.md`, holding the workspace's words in four sections — nouns, adjectives, verbs, and a temporary-memory section of unmerged words — under three fixed header rules:

1. **Merge rule** — if two words mean the same thing, keep only the most proper one and replace the other everywhere.
2. **Self-contained rule** — each description uses only everyday words and words defined earlier in the file.
3. **Recursive word check** — every description is checked word by word; vague or undefined words are replaced by concrete ones and the replacement is re-checked, until every word passes.

It also appends one bounded preference to the workspace's `AGENT_HARNESS.md`: use the vocabulary file as the wording authority for all documents and code.

## Why a Separate File

Wording drift is a distinct failure mode from goal drift or state drift: reports and code invent near-synonyms (three names for one concept, one name for three concepts) faster than any prose review catches. A single self-contained word list, with an explicit merge procedure and a working-memory section for undecided words, gives later agents one place to look before writing a sentence or naming an identifier.

## Protected Surfaces

The merge step rewrites prose, comments, and printed output only. Stored data keys, command-line names, and frozen prompt or experiment text keep their old words — renaming them breaks stored data and recorded commands — and each kept old name is recorded in the unmerged section so later agents do not "fix" it.

## Parents

- `agent-files` — this skill requires the four-file contract that agent-files scaffolds, adds `AGENT_VOCABULARY.md` as a bounded sidecar next to it, and appends one bounded preference to the `AGENT_HARNESS.md` that agent-files owns; it never touches the immutable `AGENT.md` or `AGENT_GOAL.md`.

## Example

See [`examples/AGENT_VOCABULARY.md`](examples/AGENT_VOCABULARY.md) for the scaffolded template with a domain-neutral worked example of all four sections, including the compatibility note pattern for protected surfaces.
