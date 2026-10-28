---
name: ppt-standards
description: Create, revise, or review PowerPoint decks with a coherent narrative, consistent visual meaning, source-faithful diagrams and equations, and verified PPTX/PDF delivery. Use when slide quality or presentation standards matter, especially across iterative technical revisions; adapt to the user's template and audience.
---

# PowerPoint Standards

Produce slides whose message, visual structure, terminology, and supporting evidence agree. These are authoring and review standards, not a fixed visual theme or a rendering library.

## Choose the operation first

- **Create or revise:** apply the requested changes, verify the affected slides, and deliver the agreed artifacts.
- **Review only:** inspect the existing deck and evidence, then report prioritized findings. Do not edit, save over, repair, or regenerate delivered artifacts. Temporary renderings for inspection may be created in a scratch location; they are not new deliverables. Treat the editing guidance below as review criteria, not permission to apply fixes.

## Establish the working contract

- Identify the editable deck or creation brief, audience, purpose, reference material, requested slide scope, and deliverables. Reuse information already provided; ask only for missing information that changes the work.
- Inspect the latest artifact and user edits before changing it. Preserve the user's template, aspect ratio, language, and intentional formatting unless the request calls for a redesign. For a new deck without a template, choose a consistent readable theme appropriate to the audience.
- Treat source code, datasets, and documents as read-only evidence unless edits to them are separately requested. A request to fix slides does not authorize repairing the source implementation.
- For create/revise, deliver an editable PPTX. Generate a PDF only when requested or when maintaining an established PPTX/PDF delivery workflow. An explicit PPTX-only instruction overrides that workflow; an existing PDF alone does not establish it. If PDF delivery applies, keep it current at every delivery checkpoint.
- In structured inputs, `sync_pdf: true` requests PDF delivery and `sync_pdf: false` disables it. Omission means infer from the request and established workflow, otherwise deliver PPTX only. Review mode produces findings regardless of `sync_pdf`.
- Use the available presentation authoring and rendering tools. Read applicable tool instructions. Do not assume a particular library, operating system, cloud service, font, or sibling skill is installed.

## Optional template example

For a technical conference talk using the supplied deck's style, read [examples/technical-conference-template.md](examples/technical-conference-template.md) and reuse [assets/technical-conference-template.pptx](assets/technical-conference-template.pptx). The 23-slide editable template preserves the design with generic text, image placeholders, and clearly labeled demo chart data; replace the demo data before presenting. The companion example distills measured typography, colors, layout guides, narrative roles, and reusable slide compositions. Use these when selected by the user or when they fit a brief without a prescribed theme; they do not replace a different user template or make example-specific choices universal standards.

## Read the story before changing the slides

For a new deck or substantial revision, map the narrative first: each slide's role, its main point, and its connection to the next slide. A narrow correction only needs the affected slide and enough surrounding context to preserve consistency.

- Organize around what the audience needs to understand or decide. Use an appropriate progression such as problem → method → evidence → limits → next action; do not impose that sequence on every presentation.
- Give each slide one main explanatory job. Titles should name the actual subject or state a supported conclusion. Add the missing noun to vague titles such as “Topology,” “Model,” or “Architecture.”
- Separate concepts that require different explanations. Show one component's behavior before showing how several components combine. Split a slide when its diagram and equation are trying to teach different levels at once.
- Remove side panels, code excerpts, disclaimers, and repeated captions when they do not help the slide's main point. Retain limitations necessary to interpret a claim accurately.
- Distinguish illustrative configurations from general system properties. State what is an example and what the evidence establishes; do not turn one demonstrated case into an unrestricted capability claim.

## Keep meaning consistent

Maintain a compact working convention for terms, shapes, colors, arrows, and notation. Use the existing deck's convention where it is clear; otherwise derive one from the content. This need not become a separate deliverable.

| Element | Standard |
| --- | --- |
| Terms | Use one name per concept at the correct level of detail. Explain unfamiliar terms where first needed. |
| Shapes | Use the same shape and comparable styling for the same kind of object. Use containers or distinct shapes to separate a whole from its parts. |
| Colors | Assign color to a meaningful distinction and preserve that meaning across related slides. Use labels as well as color. |
| Arrows | Make direction, endpoints, and meaning readable at presentation size. Use consistent stroke and arrowhead sizes for equivalent relationships. |
| Detail views | Match the detailed diagram's enclosing block to the corresponding block in the overview, including its name and interfaces. |
| Claims | Make the prose, figure, equation, example, and source evidence describe the same mechanism and scope. |

Do not invent a visual distinction that implies an unsupported implementation category. Conversely, one shared processing mechanism does not imply shared parameters or identical state for every instance. Use a neutral style for equivalent relationships; distinguish instances only when the slide needs that distinction.

For diagrams, equations, configuration examples, and measured results, read [references/technical-content.md](references/technical-content.md). For an ordinary text or photographic deck, use only the relevant general standards.

## Make the slide readable

- Align related blocks, labels, and equations to shared guides. Use consistent spacing and comparable dimensions for equivalent objects. Size containers to fit their contents with visible padding.
- Keep text, labels, and connector endpoints inside their intended bounds. Avoid accidental touching, overlap, ambiguous line crossings, detached labels, and clipped arrowheads.
- Judge type size, contrast, line thickness, and density in a rendered slide at normal presentation size. Do not solve an overcrowded slide by shrinking essential text; simplify, redistribute, or split the content.
- Prefer native editable text, shapes, connectors, and charts where supported. Keep diagrams and mathematical notation crisp in any requested PDF. Do not flatten a whole slide merely to conceal rendering problems.
- Carry a deliberate global change, such as larger arrows or a terminology correction, through the authorized scope. Preserve unrelated content and user edits.

## Revise at the requested pace

- In collaborative page-by-page mode, summarize the outline when useful, then explain the current slide's purpose and propose concrete edits if requested. Once the user authorizes an edit, implement and verify it without asking again.
- In batch mode, finish the authorized set of changes without stopping after every slide. Neither mode authorizes unrelated redesigns.
- Locate annotations by stable slide/shape identifiers when available, plus current title and content. After insertion or deletion, recheck numbering and references before interpreting later page-number requests.
- If feedback could mean a content error or a layout error, inspect the targeted element and context first. Ask a focused question only when the ambiguity remains consequential.
- Keep discussion and editing notes out of the audience-facing deck. Include a slide reference only when it helps the audience; maintain it after structural changes.

## Verify and deliver

Use [references/delivery-checks.md](references/delivery-checks.md) for the render/export loop and concrete acceptance checks.

For **review only**, check the requested scope against the evidence and inspect relevant rendered slides. Inspect an existing PDF when it is part of the review; do not regenerate it. Return prioritized findings with slide locations, verification performed, and limitations. Skip the create/revise steps below. Structured results have `changes: []` and null artifact paths.

For **create or revise**:

1. Check content against the requested scope and available evidence, including connected slides affected by a shared concept.
2. Save the final editable deck. If PDF delivery applies, export it from that saved revision, not an earlier intermediate file.
3. Render and visually inspect affected slides and, when delivered, their PDF counterparts. For a new deck or a change to theme, numbering, or global styles, inspect all affected pages across the deck.
4. Correct detected issues and rerun the checks they invalidate. A successful save or export alone is not a visual-quality check.
5. Return the artifact links, a concise change summary, what was verified, and any unresolved limitation.

Do not report “PDF synced,” “source verified,” or “visually checked” unless that check actually ran. If a source or renderer is unavailable, identify the affected claim or artifact and deliver only what was completed. Do not silently substitute an older PDF or an invented source example.

[tool.json](tool.json) is a required marketplace package file describing inputs and result fields for agent integrations; it does not implement an MCP server. Conversational use does not require a structured invocation. When invoked through the contract, return its defined result fields. See [examples/scenarios.md](examples/scenarios.md) for normalized usage and expected behavior.
