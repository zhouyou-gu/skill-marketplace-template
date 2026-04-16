# Example: External Transcript Input

## Skill Brief

Extract a reusable skill from a pasted Claude transcript about triaging API failures.

## Transcript Text

User: We keep repeating the same API triage loop.

Claude: First collect the failing endpoint, response body, and auth mode. Then classify whether the issue is network, contract, or credentials. Return a concise next-step report.

User: Save that as a reusable skill workflow, not as a transcript summary.

## Expected Outcome

- preserve the triage workflow
- do not keep the transcript narrative verbatim
- normalize the examples into small reusable inputs and outputs
