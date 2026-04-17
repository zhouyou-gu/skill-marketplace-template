# Example: Existing Folder With `overwrite=false`

## Situation

The target project already contains `review/README.md` and `review/AGENT_GOAL.md`.

## Expected Outcome

- create only the missing review scaffold files
- skip the existing files cleanly
- report skipped paths in `files_skipped`
- keep the summary explicit about partial scaffold creation
