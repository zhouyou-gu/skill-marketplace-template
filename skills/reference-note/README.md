# Reference Note

Use `$reference-note` to create or maintain a paper’s annotated reference note. Each work has a bold citation and one indented paragraph explaining what the source contributes and how the paper uses it.

A new note begins with the six numbered rules in the [REFERENCE.md template](examples/REFERENCE.md). Organize entries under topic names that fit the paper. Where several approaches answer the same question, subheadings and a short synthesis can make their differences clear.

The [skill instructions](SKILL.md) cover new notes, existing notes, evidence checks, and targeted updates. The [tool contract](tool.json) also supports a read-only preview through `dry_run`.

```json
{
  "note_path": "REFERENCE.md",
  "request": "Update the entry for the revised source and explain which claim it supports in the paper.",
  "manuscript_path": "main.tex",
  "bibliography_path": "main.bib"
}
```
