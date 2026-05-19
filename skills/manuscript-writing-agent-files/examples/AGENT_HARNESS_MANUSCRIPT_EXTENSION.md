## Manuscript-Writing Playbook

These durable rules apply to LaTeX IEEE-style manuscript writing and directly supporting artifacts. They are reusable operating rules, not mission scope or current task state.

Stable operating context:

- Treat the workspace's primary manuscript source as the source of truth; identify it from the project structure or build entry point before making broad edits.
- Keep directly supporting artifacts synchronized with the manuscript when the underlying argument, evidence, notation, or presentation changes materially.
- Do not describe mission scope, success criteria, current file inventory, active work, or blockers here; those belong in `AGENT_GOAL.md` or `AGENT_PROGRESS.md`.

Reusable preferences:

- Revise secondary artifacts only after the manuscript logic is settled.
- Keep manuscript writing consistent, concise, coherent, formal, and natural in technical English.
- Avoid awkward literal phrasing and colon-heavy prose. When leading into a displayed equation definition, prefer connective phrasing such as "as" or "given by" over a colon.
- Build technical narrative in a clear progression from problem context to limitation, method rationale, contribution, and evidence.
- When introducing a method, motivate the design choices before naming implementation details.
- Explain why domain-specific assumptions, operating conditions, or system settings matter instead of naming them without context.
- Reduce notation entropy: remove unused symbols, avoid symbol-role conflicts, and propagate notation changes through the main text, appendix, tables, optimization problems, and simulation expressions.
- Use `\top` for transpose notation and `\dagger` for Hermitian-transpose notation; define `(\cdot)^\dagger` at first use when helpful.
- Treat existing manuscript `\todo{...}` notes as intentional annotations unless the user explicitly asks to remove or rewrite them.
- Prefer concise one-line figure captions that name the plotted quantity and its swept variable, with terminology aligned to the metric defined in the body text.
- Manage references through `references.bib` with `\bibliographystyle{IEEEtran}` and `\bibliography{references}`, and use `\cite{...}` rather than literal bracketed numbers.
- Scope edits to the artifact explicitly requested; do not silently bundle unrelated manuscript changes.
- Do not commit or push unless the user explicitly instructs it.
- When a displayed equation overflows a two-column layout, preserve content by rewriting, introducing shorthand, dropping redundant arguments, or splitting across lines rather than shrinking the equation.
- When diagnosing layout issues, render the PDF and inspect the build log for Overfull `\hbox` warnings, including displayed-equation overflow.
