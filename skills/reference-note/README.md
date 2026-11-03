# Reference Note

Create or maintain `REFERENCE.md`, `REFERENCES.md`, or an existing equivalent as a narrative companion to a paper's bibliography.

Each distinct work gets an identity line, existing citation keys, and one compact paragraph explaining what it does and why it matters to the paper. Source links and verification limits distinguish inspected evidence from interpretation. Additional reading stays separate from cited works.

This skill maintains the reference note. Manuscript prose, bibliography corrections, and agent-file policy retain their own scope; no dependency on an agent-file scaffold or Related Work writer is required.

See [the workflow](SKILL.md), [the invocation schema](tool.json), and [the Markdown template](examples/REFERENCE.md). The template's placeholders are filled from actual sources, not treated as verified content.

```json
{
  "note_path": "REFERENCE.md",
  "request": "Create narrative notes for the manuscript's cited works and keep additional reading separate.",
  "manuscript_path": "main.tex",
  "bibliography_path": "main.bib"
}
```

Use `dry_run: true` to preview changes. No runtime package dependencies are required.
