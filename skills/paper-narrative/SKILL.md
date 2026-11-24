---
name: paper-narrative
description: Draft or update a paper’s NARRATIVE.md as a paragraph-by-paragraph writing outline. Follow the author’s established Markdown format, with one numbered prompt per paragraph and optional supporting bullets.
---

# Paper Narrative

1. **Scope.** Use the manuscript for its current argument and the author’s brief for planned changes. Follow the requested coverage and order. For a whole paper, account for its title, abstract, and keywords when present, then its body through the conclusion. An empty section may have a proposed paragraph if the brief supplies its purpose. If its purpose is still open, leave it open.

2. **Format.** Read the author-designated model or the accepted narrative being updated. Match its heading text and levels, entry labels, numbering, indentation, and spacing. A file supplied as an example of a faulty output is evidence of the defect. In the absence of an accepted model, follow [NARRATIVE.md](examples/NARRATIVE.md) literally for Markdown structure. Begin with `# Paper Narrative`, go directly to the numbered entries, and use a bold label identifying the location and rhetorical purpose of each paragraph. One level of indented bullets is available under each entry. Add a preamble, section headings, fields, or a different form only when the author requests them or the accepted model uses them. A model supplies formatting conventions. Its claims, vocabulary, and section inventory belong to its own paper.

3. **Paragraph prompts.** Write each numbered line as an instruction to the author. Specify the idea the paragraph must establish and, where it matters, what earlier question it answers or what question it leaves for the next paragraph. Give the entry enough subject matter to distinguish it from every other entry. Add a subpoint only when it changes how the paragraph should be written, for example by narrowing the comparison, identifying a premise, or explaining a transition. Keep each claim in the paragraph that develops it. An earlier paragraph may motivate the question and a later one may draw the consequence.

4. **Evidence.** Use the available sources to check the prompt. Carry a number, citation, equation, or technical setting into the outline only when that particular detail is essential to the paragraph’s argument or the author requests it. Keep repository paths, run logs, source inventories, and verification tasks out of the narrative by default. When an outcome is unknown, phrase the entry as the question the paragraph will answer. Preserve any status wording the author requires. Report material gaps in the response if necessary.

5. **Revision and delivery.** Use the requested path or the narrative’s existing filename. For a new file, use `NARRATIVE.md` beside the manuscript or in the paper directory named in the brief. Revise affected entries in place and preserve unrelated wording and formatting. If a dependent entry lies outside the requested scope, flag it in the response. Before delivery, read the numbered lines alone to check the argument, then compare the rendered list and each subpoint with the chosen model. For a preview, return the proposed edit. For a write, report the path and the change. Manuscript edits require an express request.

See the [revision example](examples/narrative-excerpts.md) for a change in evidentiary scope and the [tool contract](tool.json) for the response fields.
