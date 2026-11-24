---
name: paper-narrative
description: Draft or update a paper’s NARRATIVE.md as a paragraph-by-paragraph writing outline. Follow the author’s established Markdown format, with one numbered prompt per paragraph and optional supporting bullets.
---

# Paper Narrative

1. **Scope.** Use the manuscript for its current argument and the author’s brief for planned changes. Follow the requested coverage and order. For a whole paper, account for its title, abstract, and keywords when present, then its body through the conclusion. An empty section may have a proposed paragraph if the brief supplies its purpose. If its purpose is still open, leave it open.

2. **Format.** The target paper supplies its section numbers, titles, and order, including when only part of the paper is in scope. An author-designated model or accepted narrative supplies the Markdown conventions. A file identified as faulty is evidence of the defect. When no model is designated, follow the [example NARRATIVE.md](examples/NARRATIVE.md):

   - Begin with `# Paper Narrative`. Group any title, abstract, and keywords under an unnumbered front-matter heading.
   - Give each body section its own Markdown heading with the number and title shown in the paper, such as `## I. Introduction`. Include subsection headings when present, such as `### A. Assumptions`. Preserve the paper’s numbering convention and deliberately unnumbered headings. For a new plan with no established convention, use Roman numerals for body sections.
   - Under those headings, number paragraph entries continuously in paper order. Use a bold label for the paragraph’s role within its section and one optional level of indented bullets. Add a preamble or other fields only when the author or accepted model calls for them.

3. **Paragraph prompts.** Write each numbered line as an instruction to the author. Specify the idea the paragraph must establish and, where it matters, what earlier question it answers or what question it leaves for the next paragraph. Give the entry enough subject matter to distinguish it from every other entry. Add a subpoint only when it changes how the paragraph should be written, for example by narrowing the comparison, identifying a premise, or explaining a transition. Keep each claim in the paragraph that develops it. An earlier paragraph may motivate the question and a later one may draw the consequence.

4. **Evidence.** Use the available sources to check the prompt. Carry a number, citation, equation, or technical setting into the outline only when that particular detail is essential to the paragraph’s argument or the author requests it. Keep repository paths, run logs, source inventories, and verification tasks out of the narrative by default. When an outcome is unknown, phrase the entry as the question the paragraph will answer. Preserve any status wording the author requires. Report material gaps in the response if necessary.

5. **Revision and delivery.** Use the requested path or the narrative’s existing filename. For a new file, use `NARRATIVE.md` beside the manuscript or in the paper directory named in the brief. Revise affected entries in place and preserve unrelated wording and formatting. If a dependent entry lies outside the requested scope, flag it in the response. Before delivery, read the numbered lines alone to check the argument, then compare the rendered list and each subpoint with the chosen model. For a preview, return the proposed edit. For a write, report the path and the change. Manuscript edits require an express request.

See the [revision example](examples/narrative-excerpts.md) for a change in evidentiary scope and the [tool contract](tool.json) for the response fields.
