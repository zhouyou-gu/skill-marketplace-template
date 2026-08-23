# IEEE ComSoc Related Work

`ieee-comsoc-related-work` plans, reviews, and revises Related Work sections for IEEE Communications Society manuscripts.

## Use It When

- a Related Work section lists papers without positioning the manuscript
- comparisons need to be recovered from the Introduction and contributions
- literature notes need to be reconciled with primary papers
- a methodological discussion must end at a communications or networking gap
- subsection length and IEEE two-column layout must be controlled

## Core Rule

Include a detail only when it compares prior work along a dimension established by the paper and advances the subsection toward its research gap. Remove or reframe details that do neither.

## Workflow

1. Recover literature-facing claims from the Introduction and contributions.
2. Derive the comparisons needed for the current manuscript without imposing a fixed taxonomy.
3. Confirm the subsection length. When no constraint exists, propose approximately 170 words—about 40% of one IEEE two-column template column—and let the user confirm or adjust it.
4. Read `REFERENCES.md`, `REFERENCE.md`, or an equivalent literature ledger for prior verification, inclusion decisions, exclusions, and uncertainties.
5. Verify material claims against primary papers; the ledger is working memory, not factual authority.
6. Group works only when the same comparison applies, and retain only details that lead toward the subsection gap.
7. Report word counts and inspect the rendered layout when manuscript edits are made.

## Literature Ledger

The ledger makes research reusable across revisions. Its descriptions and historical groupings may be corrected when the manuscript changes or a primary paper is reread. Preserve excluded sources and their reasons to avoid repeating searches. Update the ledger only when the task authorizes research-record edits; otherwise report the correction.

## Inputs

- manuscript path and project root
- plan, review, or rewrite mode
- user scope and venue constraints
- optional literature-ledger paths through `source_note_paths`
- optional fixed subsection titles and confirmed word budget
- optional repository-approved build command

## Outputs

- revised section or line-specific audit
- manuscript-derived comparison dimensions
- primary-source and ledger corrections
- word counts and validation results
- modified-file list for rewrite mode

See [`examples/relevance-audit.md`](examples/relevance-audit.md) for an example in which primary-source verification corrects a stale ledger note.
