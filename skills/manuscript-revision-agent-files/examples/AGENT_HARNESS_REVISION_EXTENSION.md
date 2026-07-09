## Revision-Response Playbook

These durable rules apply only when active work involves coordinated manuscript and response-letter revision. They are reusable operating rules, not mission scope or current task state.

- After completing the mandatory core AGENT-file read order, consult `REVISION_TASK.md` only when it exists and active work involves joint manuscript and response-letter revision; treat it as a lower-precedence current-state brief, not as a control file.
- Do not patch `AGENT.md` to register `REVISION_TASK.md`; the control file is immutable after scaffold. These rules may describe when the sidecar is useful and which revision facts it owns, but they do not change core read order, precedence, file roles, or update-dispatcher authority.
- Handle one review item at a time unless the user explicitly asks for grouped handling.
- For each review item, identify the manuscript change, response-letter claim, supporting evidence, and any highlighted-manuscript effect before marking the item resolved.
- Revise manuscript content before finalizing response-letter text when the response depends on a technical or textual manuscript change.
- Keep manuscript, response letter, highlighted manuscript, appendix material, figures, simulations, and bibliography mutually consistent when one of them changes the substance of the reply.
- Do not claim that a reviewer concern has been addressed unless the manuscript source and response-letter draft make compatible claims and cite or point to the same supporting evidence.
- Keep response-letter drafting concise, specific, and respectful. State what changed, where it changed, and why the change addresses the concern.
- Vary response-letter openings and avoid starting most responses with `We agree`; use it only when agreement is substantive, and otherwise state the revision action directly.
- When a reviewer comment uses numbered references to papers, tables, figures, or equations, preserve the reviewer's original number in the response text. Add an immediate mapping to the manuscript or response-letter reference when numbering changed.
- In response-letter entries, keep the visual paragraph structure consistent: put a blank line after the reviewer comment, after `\textbf{Response:}` text, after manuscript-change or planned-change text, and before the next reviewer comment.
- When a response-letter entry describes completed manuscript edits, use `\textbf{Manuscript changes:}`, name the manuscript location, and introduce quoted changes with a short sentence ending in "as".
- When reproducing a manuscript table in a response letter, preserve the manuscript table's semantic content, caption identity, and reviewer traceability; adapt only the local presentation needed for the response-letter class and page geometry.
- Format reviewer and editor comments in the response letter in bold; keep responses and planned/manuscript-change notes under their existing labels.
- Highlight all revised manuscript text in blue, using the manuscript's existing blue-text convention or a minimal LaTeX blue-text macro introduced before the first highlighted edit.
- When a response depends on experimental behavior, runtime, training time, or implementation details, inspect the relevant source, logs, figures, or generated data before stating the claim. If the exact value is unavailable, mark the item as needing measurement or clearly label any estimate before final response-letter wording is finalized.
- Treat highlighting as a derivative artifact of concrete manuscript edits. Do not use highlighting notes as the source of truth for manuscript content.
- Treat proofreading-only language cleanup as an exception to blue-highlight and quoted-change rules when the user asks for proofreading rather than a substantive manuscript change.
- Record active review item state, artifact mapping, evidence gaps, and the next review-item-local coordination step in `REVISION_TASK.md`. Record execution blockers, cross-item resume needs, and the canonical resume point in `AGENT_PROGRESS.md`, not in this playbook.
