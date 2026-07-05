# Agent Task Cycle Examples

These examples are pressure scenarios for checking that the skill changes agent behavior in useful ways.

## Vague Feature in an Unfamiliar Repo

User request:

> Add team invitations to this app. Make it simple.

Expected behavior:

- Search routes, auth, membership, email, billing, and existing invite code before asking the user.
- Cite discovered facts separately from assumptions.
- Identify architecture-changing unknowns such as permission model, invite expiry, organization boundaries, email delivery, and duplicate users.
- Ask only high-impact questions after inspection.
- Recommend a blindspot pass or implementation plan before coding.
- Keep any implementation notes response-local or in the repo's approved live-progress surface.

Failure mode this skill prevents:

- Creating a new invite model and UI before discovering the repo already has pending-membership semantics or tenant-specific roles.

## Under-Specified Visual Change

User request:

> Make the dashboard feel more premium.

Expected behavior:

- Inspect the current design system, components, and screenshots if available.
- Avoid asking "what does premium mean?" as the first move.
- Produce two or three lightweight visual directions or reference comparisons in a disposable sandbox before editing production UI.
- Ask the user to react to concrete differences: density, contrast, typography, motion, hierarchy, and tone.

Failure mode this skill prevents:

- Applying arbitrary gradients, oversized cards, or decorative styling that conflicts with the product's actual design language.

## Large Agent-Produced Change Before Merge

User request:

> This agent branch looks good. Should we merge it?

Expected behavior:

- Treat the diff, tests, migrations, public APIs, and behavior changes as discoverable facts.
- Build a post-work explainer with acceptance checklist and unresolved risks.
- Ask review questions only when they affect merge readiness.
- Offer a quiz when the user needs to understand behavior beyond the diff.
- Do not persist review notes into durable project docs unless the user asks.

Failure mode this skill prevents:

- Trusting a broad success summary without checking whether the change solved the intended problem or introduced hidden contract changes.

## Boundary and Leakage Check

User request:

> Keep notes while you explore this migration, then implement once the path is clear.

Expected behavior:

- Keep exploration notes in the response or an ignored scratch path by default.
- If AGENT files exist, use only the live-progress surface for current state and follow its existing rules.
- Never patch immutable control files or durable goal/harness docs for transient unknowns.
- Stop before writing tracked prototypes, plans, or notes unless the user requests persistent artifacts.

Failure mode this skill prevents:

- Leaking scratch assumptions into durable project documentation where future agents treat them as approved facts.
