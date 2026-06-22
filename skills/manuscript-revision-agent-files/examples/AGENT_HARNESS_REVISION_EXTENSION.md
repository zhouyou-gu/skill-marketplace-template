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
- Format reviewer and editor comments in the response letter in bold; keep responses and planned/manuscript-change notes under their existing labels.
- Highlight all revised manuscript text in blue, using the manuscript's existing blue-text convention or a minimal LaTeX blue-text macro introduced before the first highlighted edit.
- When a response depends on experimental behavior, runtime, training time, or implementation details, inspect the relevant source, logs, figures, or generated data before stating the claim. If the exact value is unavailable, mark the item as needing measurement or clearly label any estimate before final response-letter wording is finalized.
- Treat highlighting as a derivative artifact of concrete manuscript edits. Do not use highlighting notes as the source of truth for manuscript content.
- Record active review item state, artifact mapping, evidence gaps, and the next review-item-local coordination step in `REVISION_TASK.md`. Record execution blockers, cross-item resume needs, and the canonical resume point in `AGENT_PROGRESS.md`, not in this playbook.
