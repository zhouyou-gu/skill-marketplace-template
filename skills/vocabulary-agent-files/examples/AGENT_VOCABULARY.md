# Vocabulary

**This file lists the words used in the documents and the code. Use these words and no others.**

> **If two words mean the same thing, keep only the most proper one and replace the other everywhere.**
>
> **The file is self-contained: each description uses only everyday words and words defined earlier in it.**
>
> **Check every description word by word, and recursively: any vague word, and any word that is neither an everyday word nor defined earlier in the file, must be replaced by a concrete one — then re-check the replacement, until every word passes.**

Format: one entry per line, `Word: short description.`

## Nouns

- module: one named part of the system; the one being worked on is called this module.
- record: one stored piece of data the system reads or writes.

## Adjectives

- external: belonging to a system other than this one.

## Verbs

- check: compare a thing against a stated rule and report whether it passes.

## Unmerged Words (temporary memory)

Words still in the documents or the code that need merging into the lists above. Each line: word — where it lives — what to do.

- component — `docs/overview.md` — merge into module.
- entry — `store.py` printouts — open: may mean record or something narrower; decide before merging.
- kept old names for compatibility — stored data keys and command-line names — merged in all prose and printouts, but renaming these would break stored data and recorded commands; do not rename.
