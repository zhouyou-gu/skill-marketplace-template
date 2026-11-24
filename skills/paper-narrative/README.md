# Paper Narrative

Use `$paper-narrative` to draft or revise a paragraph-by-paragraph writing outline. Each numbered prompt identifies the paragraph’s place and purpose. Optional bullets specify what the writer should develop in that paragraph.

Use an accepted outline as the Markdown model, or follow the [default NARRATIVE.md](examples/NARRATIVE.md). The source material informs the instructions. Detailed evidence stays with its source unless the detail itself matters to the argument.

The following request previews a limited revision using an earlier outline as the format model.

```json
{
  "request": "Revise the opening paragraph prompt to reflect the narrower question. Flag later entries that still use the broader wording.",
  "format_reference": "previous-paper/NARRATIVE.md",
  "dry_run": true
}
```

[Drafting rules](SKILL.md) · [Revision example](examples/narrative-excerpts.md) · [Tool contract](tool.json)
