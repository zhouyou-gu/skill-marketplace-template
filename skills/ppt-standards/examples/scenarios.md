# Usage scenarios

The JSON files are normalized requests matching the tool input schema, not real source artifacts. The expected behavior below describes decisions to check; it is not a claim that a deck has already been generated or rendered.

For a worked design reference distilled from an inspected presentation, see [technical-conference-template.md](technical-conference-template.md) and its [editable PPTX](../assets/technical-conference-template.pptx). Its measured styles and slide recipes are optional examples rather than additional requirements for every deck. When reusing the PPTX, replace all bracketed content and illustrative chart data, and insert the user's own assets.

## Create a new deck

Input: [create.json](create.json).

Expected behavior: derive a narrative from the brief and available evidence, use the supplied template, distinguish observations from future work, create an editable deck and its PDF, and inspect both before delivery. Do not invent missing benchmark values or claim unavailable evidence was verified.

## Revise a component and its overview

Input: [revise.json](revise.json).

Expected behavior: identify slides by title and current content, summarize their roles, and propose the requested revisions before editing. Once authorized, keep the detailed component's enclosure and interfaces consistent with the overview. Use one neutral style for repeated internal branches and labeled distinctions for independent inputs. Define equation indices nearby, verify the affected pages, and export the updated PDF at the delivery checkpoint. Do not redesign unrelated slides.

## Review a source mismatch

Input: [review.json](review.json).

Expected behavior: inspect the source and the deck without changing either. If the diagram invents a category absent from the source or shows incomplete connectivity while claiming a complete example, report the issue with the current slide title and location. Distinguish an erroneous claim from a clearly labeled simplification. Do not infer a fixed relationship count without first identifying the topology and direction convention. Even with `sync_pdf: true`, review mode does not save, repair, or regenerate delivered artifacts; use scratch previews if needed. Return `changes: []`, `pptx_path: null`, and `pdf_path: null`.

## Export or rendering unavailable

For an edit request requiring PDF delivery, suppose the PPTX saves successfully but the PDF exporter fails. Preserve the valid editable file; report `status: partial`, identify PDF delivery as incomplete, and do not return a stale PDF as current. If PDF delivery does not apply, do not invoke the exporter; report that check as `not_applicable`. If required visual rendering could not run, report its check as `not_run`, not `passed`.

## Narrow correction and format override

Input: [narrow-edit.json](narrow-edit.json).

Expected behavior: make only the authorized terminology correction, inspect its local layout, and return the PPTX. Do not add a PDF, re-outline the entire presentation, or force a page-by-page approval cycle.

## Omitted PDF choice without an established pair

Input: [revise-unpaired.json](revise-unpaired.json).

Expected behavior: `sync_pdf` is omitted, the request does not ask for PDF, and no paired-delivery workflow is established. Correct the title and return the verified PPTX only. Do not ask for a format choice solely because the flag is absent, and do not treat an unrelated PDF in the folder as authorization to regenerate it.

## Omitted PDF choice with an established pair

Input: [revise-paired.json](revise-paired.json).

Expected behavior: the request establishes ongoing PPTX/PDF delivery, so keep both artifacts synchronized even though `sync_pdf` is omitted. If the user later explicitly requests PPTX only or supplies `sync_pdf: false`, skip PDF export and return no PDF path; do not describe an older PDF as current.
