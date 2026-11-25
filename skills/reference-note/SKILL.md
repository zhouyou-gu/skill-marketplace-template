---
name: reference-note
description: Create or update a paper’s REFERENCE.md, REFERENCES.md, or equivalent literature note. Use for annotated sources, their relevance to the manuscript, and comparisons supported by the works reviewed.
---

# Reference Note

## Set the scope

Use the requested destination. Otherwise, preserve the existing note’s filename and case, or use `REFERENCE.md` for a new note. Read the relevant manuscript passages and bibliography when available. If the paper is still a brief, use its questions to explain why a source might be useful and identify proposed citations as planned.

For a whole-paper note, reconcile the cited works with the bibliography before claiming complete coverage. For a targeted edit, read the affected entries and their surrounding group. Changes to the manuscript or bibliography require an express request.

## Create or update the note

The [reference-note template](examples/REFERENCE.md) contains the entry rules. For a new note, copy its **Entry rules** label and numbered list immediately below the title. For a whole-note revision, keep one list there and preserve equivalent author-approved wording. For an edit confined to a particular entry, preserve the rest of the file.

Apply those rules to the works in scope. When a work informs several topics, give it one full entry and refer to it by name or key elsewhere. Keep materially different editions, preprints, or published versions distinguishable when the difference affects the claim.

Use short, unnumbered topic headings in the paper’s own terms. A sentence introducing a group can explain why the works belong together. Add subheadings when a group contains distinct approaches worth comparing. A comparison can close with what the reviewed works establish together and what remains open. The template illustrates possible groupings. The topic names, number of groups, and presence of a synthesis depend on the material.

## Check the evidence

Use primary material appropriate to the claim. A catalogue record can establish bibliographic identity. An abstract can support a stated aim or reported finding. For a detailed method, numerical result, or limitation, inspect the relevant passage and identify the section, page, figure, or table when it matters. If only a secondary account is available, attribute the account and identify its limits.

Use the manuscript to determine which works it cites. A bibliography entry alone establishes inclusion in the bibliography. Keep the source’s findings distinct from the author’s interpretation of their relevance. Carry forward an earlier check with its known scope and date. Record a new check only for material inspected during this task.

## Deliver

Review the changed entries against the header rules. Preserve useful existing keys, links, qualifications, and outstanding reference questions. Keep task history and unrelated project notes outside the document.

For review-only requests or `dry_run=true`, return the proposed edits without writing files. Otherwise, update the note within scope. Return the fields defined in [tool.json](tool.json). In `sources_checked`, list only the material actually inspected during this task. Use `unresolved` for remaining source or citation questions.
