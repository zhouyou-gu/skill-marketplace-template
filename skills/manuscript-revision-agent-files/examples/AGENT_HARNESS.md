# Workspace Harness

**This file is the reusable playbook for the workspace. It holds durable workflow rules and generalized operating preferences. It shall not define control-file update policy, restate or modify the mission, or record live task state.**

## Stable Operating Context

This workspace is for revising a LaTeX IEEE-style manuscript and its directly supporting artifacts. `main.tex` is the primary manuscript source of truth; bibliography, figures, appendix material, and optional derived explanations such as `narrative.md` are supporting artifacts that stay synchronized to the manuscript when the underlying logic changes materially. If `REVISION_TASK.md` exists, it is a task-specific sidecar for joint manuscript-response work and does not replace this harness. Do not describe mission scope, success criteria, current file inventory, active work, or blockers here; those belong in `AGENT_GOAL.md` or `AGENT_PROGRESS.md`.

## Standard Operating Loop

1. Read the agent files in the order required by `AGENT.md`.
2. Confirm the contemplated work is in scope under `AGENT_GOAL.md`.
3. Identify the active workstream from `AGENT_PROGRESS.md`.
4. Gather the context required by the workstream before changing any state.
5. Make the change.
6. Leave every artifact touched in the turn internally consistent.
7. Apply the update dispatcher from `AGENT.md` before reporting the turn complete.
8. Stop when the workstream is in a stable state or requires user direction.

## Reusable Preferences

- Treat `main.tex` as the primary manuscript source of truth; revise secondary artifacts only after the manuscript logic is settled.
- Preserve existing wording when possible and revise minimally when refining manuscript prose.
- Keep manuscript writing consistent, concise, coherent, formal, and natural in technical English.
- Avoid awkward literal phrasing and colon-heavy prose. When leading into a displayed equation definition, prefer connective phrasing such as "as" or "given by" over a colon.
- Build technical narrative in order: where the problem comes from, why it is dangerous, why sensing is needed, why sensing is hard, and why existing methods are insufficient.
- When bridging from the problem to the method, motivate coarse localization or region inference and the architectural design before stating what is developed.
- Explain why a high-frequency band or link setup matters to the system instead of naming it without motivation.
- Reduce notation entropy: remove unused symbols, avoid symbol-role conflicts, and propagate notation changes through the main text, appendix, tables, optimization problems, and simulation expressions.
- Use `\top` for transpose notation and `\dagger` for Hermitian-transpose notation; define `(\cdot)^\dagger` at first use when helpful.
- Treat existing manuscript `\todo{...}` notes as intentional annotations unless the user explicitly asks to remove or rewrite them.
- Prefer concise one-line figure captions that name the plotted quantity and its swept variable, with terminology aligned to the metric defined in the body text.
- Manage references through `references.bib` with `\bibliographystyle{IEEEtran}` and `\bibliography{references}`, and use `\cite{...}` rather than literal bracketed numbers.
- Scope edits to the artifact explicitly requested; do not silently bundle unrelated manuscript changes.
- Do not commit or push unless the user explicitly instructs it.
- When a displayed equation overflows a two-column layout, preserve content by rewriting, introducing shorthand, dropping redundant arguments, or splitting across lines rather than shrinking the equation.
- When diagnosing layout issues, render the PDF and inspect the build log for Overfull `\hbox` warnings, including displayed-equation overflow.

## Handoff Condition

- The active workstream is in a stable state or explicitly awaiting user direction.
- Every artifact touched in the turn is left internally consistent.
- `AGENT_PROGRESS.md` reflects the new state accurately.
- Any durable rule revealed during the turn has been promoted into `Reusable Preferences`.
