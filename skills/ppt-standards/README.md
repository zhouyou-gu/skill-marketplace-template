# PowerPoint Standards

A reusable authoring and review skill for PowerPoint: clear narrative, stable visual meaning, source-faithful content, readable diagrams and equations, and verified editable-deck/PDF delivery. It adapts to the user's template and audience rather than imposing a fixed theme.

## Usage

Invoke `$ppt-standards` with a deck or creation brief, the requested changes, and any source material. Choose page-by-page collaboration or batch work as appropriate. Review-only requests produce findings without editing, saving over, or regenerating delivered artifacts; inspection previews belong in scratch storage.

For create/revise, PDF delivery applies only when requested or when maintaining an established PPTX/PDF workflow. In structured inputs, `sync_pdf: true` enables it, `false` disables it, and omission infers the choice from the request and workflow, otherwise delivering PPTX only. An explicit PPTX-only instruction overrides an established pair. Review mode never creates deliverable artifacts, regardless of this flag.

Start with [SKILL.md](SKILL.md). Read [technical-content.md](references/technical-content.md) for technical diagrams, equations, examples, and evidence; use [delivery-checks.md](references/delivery-checks.md) when editing, exporting, or reviewing final artifacts.

[Examples](examples/scenarios.md) include normalized inputs and expected decisions. [tool.json](tool.json) is required in the marketplace package, although conversational use need not invoke the structured contract. It is not an executable MCP server. The skill itself has no package dependency; the chosen presentation authoring/rendering environment supplies its own tooling.

[Technical conference example](examples/technical-conference-template.md) distills the supplied presentation into reusable design tokens, layout recipes, and a narrative example. The companion [editable PowerPoint template](assets/technical-conference-template.pptx) includes all 23 slide layouts with generic placeholders and native diagrams, charts, and a comparison table. Project-specific names, links, artwork, results, citations, and speaker notes have been replaced. Charts contain labeled illustrative data and editable embedded workbooks; replace every demo value before presenting. These are optional references, not the skill's default theme. The original deck and artwork are not bundled.

## Parents

None. This skill does not require a marketplace scaffold or another marketplace skill at runtime. The publisher used to create a skill is not automatically its parent.

## Metadata

`skill.yaml` uses the `automation` category and an empty dependency list. The marketplace registry builder resolves its generic `repo` placeholder to this skill’s location in the hosting repository when a GitHub origin is available.
