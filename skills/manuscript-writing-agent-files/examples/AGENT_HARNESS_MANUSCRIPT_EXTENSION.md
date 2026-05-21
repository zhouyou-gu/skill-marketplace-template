## Manuscript-Writing Playbook

These durable rules apply to LaTeX IEEE-style manuscript writing and directly supporting artifacts. They are reusable operating rules, not mission scope or current task state.

Stable operating context:

- Treat the workspace's primary manuscript source as the source of truth; identify it from the project structure or build entry point before making broad edits.
- Keep directly supporting artifacts synchronized with the manuscript when the underlying argument, evidence, notation, or presentation changes materially.
- Treat compiled outputs and generated build artifacts as validation evidence, not manuscript sources.
- Do not describe mission scope, success criteria, current file inventory, active work, or blockers here; those belong in `AGENT_GOAL.md` or `AGENT_PROGRESS.md`.

Reusable preferences:

- Preserve existing wording when it already works; prefer the smallest edit that fixes the prose, logic, notation, or evidence problem.
- Read the relevant manuscript, bibliography, figure, table, appendix, or derived-artifact context directly before editing it.
- Scope edits to the artifact explicitly requested; do not silently bundle unrelated manuscript changes.
- When the user makes manual manuscript edits, inspect the current diff before continuing, treat the edits as intentional unless the surrounding text contradicts them, and propagate only the remaining consistency updates needed.
- During user-guided paragraph-by-paragraph revision, apply each proposed rewrite only after explicit sign-off and do not auto-advance to the next paragraph without user direction.
- Do not commit or push unless the user explicitly instructs it.
- Keep the manuscript voice standalone; do not let authoring scaffolds, revision history, planning notes, or conversational explanations leak into final paper prose unless the user explicitly promotes that content.
- Keep claims evidence-backed and bounded to what has been checked; distinguish established facts, design choices, inference, and open questions.
- Use sources as evidence and explain why the evidence matters; separate what a cited source directly shows from the broader interpretation drawn from it.
- Add supporting citations inline where non-trivial claims are made, and prefer primary sources when they are available.
- State whether gap, novelty, and comparison claims are field-wide or bounded to the reviewed sources.
- When a manuscript claim depends on implementation or experimental behavior, support it with source-file, version, date, or runtime evidence instead of tool availability or parser acceptance alone.
- When presenting formal definitions, objectives, proofs, or evaluation criteria, make the statement precise and self-contained enough to read in isolation.
- When defining validation or test cases in manuscript text, state the condition under test, expected behavior, and pass/fail criterion directly.
- Keep manuscript writing consistent, concise, coherent, formal, and natural in technical English.
- Write for informed technical readers who may be new to the specific subfield; define important terms and abstractions before relying on them heavily.
- Build technical narrative in a clear progression from problem context to limitation, method rationale, contribution, and evidence.
- When an argument feels weak, refine the reasoning before polishing sentence-level wording.
- When introducing a method, motivate the design choices before naming implementation details.
- Explain why domain-specific assumptions, operating conditions, or system settings matter instead of naming them without context.
- Use terminology that matches the method's actual granularity; avoid labels that imply more precision, generality, or capability than the method provides.
- Use venue- and community-standard vocabulary when naming methods, assumptions, controls, metrics, and artifacts.
- Keep manuscript body text concise; shorten the body first, and move extension material elsewhere only when it is still needed.
- Keep section and subsection titles short, structurally parallel with peer titles, and tied to the section's organizing phrase when one exists.
- Use title case for formal problem or method names only when they function as headings, definition labels, or exact name introductions; prefer lowercase phrasing in ordinary prose.
- Keep one spelling convention across the manuscript and synchronized supporting artifacts; align derived artifacts to the manuscript rather than letting wording diverge.
- Avoid conversational or self-defensive framing in manuscript prose; state scope limits as formal paper claims.
- Avoid awkward literal phrasing and colon-heavy prose. When leading into a displayed equation definition, prefer connective phrasing such as "as" or "given by" over a colon.
- Avoid dash-heavy manuscript prose; do not use en dashes or em dashes, including LaTeX `--` or `---`, unless the user explicitly asks for a venue style that requires them.
- Introduce notation only when it is reused and improves clarity; avoid undefined symbols, symbol-role collisions, and symbols referenced before definition.
- Prefer plain-language explanations over symbolic shorthand in technical prose when the prose is clearer.
- Reduce notation entropy: remove unused symbols, avoid symbol-role conflicts, and propagate notation changes through the main text, appendix, tables, optimization problems, and simulation expressions.
- Use single-letter italic bases for math variables where practical, and put descriptive role labels in upright `\mathrm{...}` or `\text{...}` labels rather than bare multi-letter math identifiers.
- Reserve subscripts primarily for indices when possible; use typed superscript labels for variants of a parent set or quantity when that avoids index-role collisions.
- In prose, use the English name of a concept before relying on its math symbol alone.
- Use `\top` for transpose notation and `\dagger` for Hermitian-transpose notation; define `(\cdot)^\dagger` at first use when helpful.
- Do not place a blank line between a display-math closer and a continuation clause, such as a following "where" clause, when they belong to the same sentence.
- When a displayed equation overflows a two-column layout, preserve content by rewriting, introducing shorthand, dropping redundant arguments, or splitting across lines rather than shrinking the equation.
- Revise secondary artifacts only after the manuscript logic is settled.
- Treat existing manuscript `\todo{...}` notes as intentional annotations unless the user explicitly asks to remove or rewrite them.
- Prefer concise one-line figure captions that name the plotted quantity and its swept variable, with terminology aligned to the metric defined in the body text.
- Keep figure files, labels, captions, and in-text references synchronized; refer to figures by explicit number or label rather than relative placement words such as "above" or "below."
- Keep table text concise enough for the target layout, especially two-column IEEE formats.
- Manage references through `references.bib` with `\bibliographystyle{IEEEtran}` and `\bibliography{references}`, and use `\cite{...}` rather than literal bracketed numbers.
- Do not enable bibliography commands against an empty BibTeX database if the toolchain would generate an invalid empty bibliography.
- Do not use standalone supporting-reference blocks in manuscript prose; cite sources inline where the claim is made.
- Run whitespace or diff checks on touched source files when available.
- When manuscript changes affect LaTeX structure, citations, figures, equations, tables, or other build-sensitive content, compile or render when the toolchain is available.
- When diagnosing layout issues, render the PDF and inspect the build log for Overfull `\hbox` warnings, including displayed-equation overflow, table overflow, and awkward appendix or paragraph endings.
