# IEEE ComSoc Related Work

`ieee-comsoc-related-work` plans, audits, and rewrites compact Related Work sections for IEEE Communications Society manuscripts.

## Use It When

- a Related Work section reads like a catalogue instead of an argument
- cited papers need to be regrouped around the Introduction's contribution axes
- methodological literature must return to a communications-specific gap
- local literature notes need verification against primary papers
- subsection word budgets and LaTeX validation must be enforced

## Core Rule

Include a detail only when it compares prior work along a dimension established by the paper and advances the subsection toward its research gap. Remove or reframe details that do neither.

## Workflow

1. Recover the paper's comparison axes from the title, Introduction, and contributions.
2. Verify each work's stated focus and relevant mechanism from the primary paper.
3. Group works by mechanism rather than listing papers one by one.
4. Identify execution artifacts, reasoning locations, data requirements, and answer sources precisely.
5. End each subsection at one concise communications-specific gap.
6. Audit every sentence for relevance, support, fairness, and redundancy.
7. Enforce requested word limits and validate the LaTeX build and rendered pages.

## Inputs

- manuscript path and project root
- plan, review, or rewrite mode
- user scope and venue constraints
- optional literature-note paths
- optional fixed subsection titles and exact word budget
- optional repository-approved build command

## Outputs

- revised section or line-specific audit
- subsection comparison axes
- source and relevance warnings
- word counts and validation results
- modified-file list for rewrite mode

See [`examples/relevance-audit.md`](examples/relevance-audit.md) for a normalized sentence-level example.
