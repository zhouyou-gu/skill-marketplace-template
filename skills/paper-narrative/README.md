# Paper Narrative

Use `$paper-narrative` to draft or revise a paper’s `NARRATIVE.md` from the manuscript or the author’s brief. Each numbered entry states one paragraph’s main point. Optional bullets give the supporting details that belong in that paragraph.

The [drafting standard](SKILL.md) sets out the rules for scope, form, support, and revision. The [example NARRATIVE.md](examples/NARRATIVE.md) uses placeholders so it can be adapted to the paper’s subject and section order.

For example, this request previews a limited revision.

```json
{
  "request": "Revise the entry for the opening paragraph to reflect the author’s narrower question. Flag later entries that still use the broader wording.",
  "dry_run": true
}
```

[Revision examples](examples/narrative-excerpts.md) · [Tool contract](tool.json)
