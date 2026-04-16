# Revision Task Brief

**This file is an auxiliary brief for the current joint manuscript and response-letter revision or drafting effort. It organizes the active revision package and reviewer-facing drafting rules. It does not replace `AGENT_GOAL.md` as mission authority, `AGENT_HARNESS.md` as the reusable playbook, or `AGENT_PROGRESS.md` as the canonical live-state ledger. If it conflicts with any core control file, the core file wins.**

## Current Revision Package

- _(name the manuscript draft, response-letter draft, revision round, and any supporting evidence package for the current joint revision effort)_

## Artifact Map

- `main.tex` - primary manuscript source of truth
- `references.bib` - bibliography database
- _(map the response-letter source, highlighted manuscript, appendix material, figures, simulations, and any supporting narrative or evidence artifacts used for this revision package)_

## Review Item Routing

- Handle one review item at a time.
- Do not move to the next item until the current one is accepted or explicitly deferred.
- If the user rejects an addressment or asks to restart from an earlier item, resume from that item.
- If an item depends on additional simulations or unavailable evidence and the user chooses to defer it, mark it deferred and move only to the next item that can be addressed honestly.

## Manuscript and Response Sync Rules

- Update the manuscript first when the substance of the paper changes, then align the response letter to that source text.
- Keep quoted highlighted text verbatim between the manuscript and the response letter.
- Omit non-highlighted surrounding text from quotes unless it is needed for meaning, location, or clarity.
- If prior text is omitted from a quote, mark the omission with `\dots`.
- Re-check directly from file after user edits or repeated requests to double-check.

## Revision Highlighting Rules

- Highlight substantive manuscript revisions by default.
- Keep grammar-only or typo-only fixes unhighlighted unless requested otherwise.
- While one review item is actively being refined, temporarily mark active substantive edits in a distinct in-progress highlight color.
- Once the item is accepted or treated as stable, convert the same substantive text back to the standard revision color.
- If a whole section or subsection is changed or newly added for the revision, highlight its title in the same color as the body text for that revision state.

## Response Letter Drafting Rules

- Prefer technically honest scope limitations over weak defenses.
- If a claim feels shaky, refine the key points before rewriting the response.
- In response prose, lead with the mathematical reasoning or writing principle behind a revision before enumerating the concrete edits.
- Describe completed manuscript changes in past tense rather than present tense.
- When a reviewer questions a proof or claim, explain the standard being enforced and why the revised statement is the correct one.

## Next Joint Drafting Step

- _(name the next manuscript-response coordination step, while keeping `AGENT_PROGRESS.md` as the canonical resume ledger)_
