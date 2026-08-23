# IEEE ComSoc Related Work

`ieee-comsoc-related-work` plans, reviews, and revises Related Work sections for IEEE Communications Society manuscripts.

## Use It When

- a Related Work section lists papers without positioning the manuscript
- comparisons need to be recovered from the Introduction and contributions
- literature notes need to be reconciled with primary sources
- a methodological discussion must end at a communications or networking gap
- subsection length and IEEE two-column layout must be controlled

## Core Rule

Every nontrivial clause must map both to a comparison dimension established by the Introduction or contributions and to a necessary move toward the subsection gap. If either mapping is missing, remove the clause. Reframe it only with primary-source support and explicit mappings. Accuracy, source prominence, recency, citation count, convenience, or word-budget pressure cannot rescue an irrelevant detail.

## Workflow

1. Recover literature-facing claims from the Introduction and contributions.
2. Derive the comparisons needed for the current manuscript without imposing a fixed taxonomy.
3. Build a compact relevance map from each comparison dimension through admissible source evidence to the subsection gap.
4. Confirm the subsection length once per task. When no constraint exists, propose approximately 170 words—about 40% of one IEEE two-column template column—and let the user confirm or adjust it.
5. Read `REFERENCES.md`, `REFERENCE.md`, or an equivalent literature ledger for prior verification, inclusion decisions, exclusions, and uncertainties.
6. Verify material claims against primary sources; the ledger is working memory, not factual authority.
7. Group works only when the same comparison applies, audit every nontrivial clause against the relevance map, and calibrate every gap to the sources actually reviewed.
8. Report word counts and inspect the rendered layout when manuscript edits are made.

## Literature Ledger

The ledger makes research reusable across revisions. Its descriptions and historical groupings may be corrected when the manuscript changes or a primary source is reread. Preserve excluded sources and their reasons to avoid repeating searches. Update the ledger only when the task authorizes research-record edits; otherwise report the correction.

## Inputs

- manuscript path and project root
- plan, review, or rewrite mode
- user scope and venue constraints
- optional literature-ledger paths through `source_note_paths`
- optional fixed subsection titles, confirmed word budget, and citation-set constraint
- optional repository-approved build command

## Outputs

- revised section or line-specific audit
- manuscript-derived comparison dimensions
- primary-source and ledger corrections
- word counts and validation results
- modified-file list for rewrite mode

See [`examples/relevance-audit.md`](examples/relevance-audit.md) for an example in which primary-source verification corrects a stale ledger note.
