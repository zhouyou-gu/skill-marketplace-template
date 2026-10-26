# Delivery checks

For review-only work, use the content and visual checks on existing artifacts. Put any temporary inspection renderings in scratch storage, report findings, and do not save over, correct, or regenerate deliverable files. Artifact-handling and export steps below apply to create/revise work only.

## Artifact handling

- Establish which file is canonical and which outputs are derived. Inspect the latest deck before editing; do not overwrite a more recent manual revision with an older generated copy.
- Preserve editability, theme, slide dimensions, speaker notes, links, and intentional animation when relevant to the request and supported by the selected tool. If conversion loses a required feature, disclose the loss and use a suitable authoring path before treating the result as complete.
- If the working tool uses an intermediate source format, keep it in the allowed output area and ensure the saved PPTX contains the latest edits. Do not create unrelated project files.
- When PDF delivery is requested or part of an established workflow, use `<deck>.pptx` and `<deck>.pdf` beside each other unless a different destination was requested. Export after the final PPTX save. Regenerate the PDF after any later PPTX change before claiming the pair is synchronized. Do not infer that workflow merely from an existing PDF; honor an explicit PPTX-only choice.
- Avoid a collection of ambiguous `final-v2-final` files. Use the established canonical filename and the user's backup/versioning convention; create a backup when needed to protect a destructive conversion.

## Content acceptance

Check the final artifact, not just the authoring script:

- The title, main visual, equation, and caption explain the same concept.
- Terms, shapes, colors, indices, and object levels agree with related slides.
- Claims and examples match available sources; important uncertainty remains visible.
- Diagram endpoints, multiplicities, directions, and labels are correct for the stated example.
- An inserted or deleted slide has not left stale page numbers, overview entries, navigation links, or cross-references.
- User-requested scope is complete and unrelated content is preserved.

## Visual acceptance

Render the affected PPTX slides through a compatible presentation renderer and inspect images at presentation size. Inspect matching PDF pages when PDF is part of delivery; use close-up views only to investigate an issue.

- Text fits without clipping or unexpected wrapping; important labels remain readable.
- Fonts, symbols, equations, and charts survive export without substitution that changes meaning or layout.
- Related objects share intentional alignment, spacing, and size; containers provide padding.
- Arrows reach the correct endpoints, heads are legible, crossings are unambiguous, and labels do not float away from their objects.
- No accidental overlap, off-slide objects, missing images, hidden labels, or blank pages appear.
- Style changes are consistent across every affected slide. A change to the master or theme requires inspecting the whole deck, not only one representative slide.

Geometry or overflow checks can help locate issues, but they do not replace visual inspection. Recheck corrected pages and any pages affected by shared-style changes; do not repeat unrelated checks without a reason.

## PPTX/PDF agreement

- Confirm the intended slide order and count against the PDF export scope. For a complete deck export, counts should match. If hidden slides, builds, or selected-page export explain a difference, make that choice explicit.
- Confirm a recent changed title, label, equation, or visual appears in both outputs; timestamps and matching filenames alone do not prove synchronization.
- Check that the PDF uses the intended page size, orientation, and slide boundaries.
- A still PDF cannot preserve animations or interactive behavior. Verify its chosen static state is understandable and state the limitation if those features are important.

## Failure and handoff

- If required PDF export fails, keep the valid editable deck and identify PDF delivery as incomplete. Do not label a stale PDF as current or repeatedly retry a path that has no new reason to succeed. If PDF delivery does not apply, skip export and report its check as not applicable.
- If no compatible renderer is available, report visual inspection as not performed. Distinguish content checks, package checks, and visual checks in the handoff.
- If source verification is blocked, name the unverified claim and the missing evidence. Do not repair the source outside the slide-edit scope.
- For review-only work, give actionable findings with stable slide identifiers or current titles and page numbers. Separate meaning-changing issues from readability and cosmetic issues.
- Report actual artifact paths, completed changes, verification performed, and unresolved limitations. Keep the final response proportional to the work.
