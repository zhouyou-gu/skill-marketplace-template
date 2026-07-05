# Artifact Patterns

Use these compact patterns when the main skill asks for a specific artifact.

## Durability Rules

- Keep artifacts response-local unless the user asks for persistence.
- If a file is necessary, use an ignored scratch path and verify it is ignored when inside a git repository.
- Do not write transient unknowns into durable docs, specs, `AGENT.md`, `AGENT_GOAL.md`, or `AGENT_HARNESS.md`.
- If an AGENT-file contract exists and current-state persistence is needed, use `AGENT_PROGRESS.md` according to that contract.
- Label facts with sources. Keep assumptions, open questions, and guesses in separate sections.

## Blindspot Pass

```markdown
# Blindspot Pass

## Task
<one-sentence restatement>

## Discovered Facts
- <source: repo, docs, code, data, policy, command output, user statement, or observed behavior>

## Unknowns
- Known unknowns: <visible questions>
- Unknown knowns: <taste, conventions, expectations the user may recognize>
- Unknown unknowns: <likely pitfalls, hidden constraints, better approaches>

## High-Impact Questions
1. <question that could change architecture, scope, acceptance, or review outcome>

## Safe Assumptions
- <assumption safe to proceed with>

## Blocked By
- <unknown that prevents safe progress, or "None">

## Stop Conditions
- <future discovery that requires pausing for user input>

## Recommended Next Artifact
<none | interview | prototype | implementation_notes | post_work_explainer>
```

## Interview

Ask one question at a time unless the interface supports multiple-choice questions. Prioritize questions that affect architecture, scope, data shape, UX acceptance, security, compatibility, or merge readiness.

```markdown
# Interview Queue

1. <highest-impact question>
2. <second question only if the first answer will not determine it>

## Default If Unanswered
<safe conservative default and why>
```

## Prototype or Reference Comparison

Use when the user can recognize the right direction more easily than describe it.

```markdown
# Prototype Brief

## Sandbox Boundary
<response-local | ignored scratch path | explicitly approved tracked path>

## Goal
<what the user should react to>

## Variants
- A: <direction and tradeoff>
- B: <direction and tradeoff>
- C: <direction and tradeoff>

## Non-Goals
- <what this prototype intentionally does not implement>

## Feedback Requested
- <specific reaction points>
```

## Implementation Notes

```markdown
# Implementation Notes

## Storage Boundary
<response-local by default; if persisted, state the approved path and why>

## Decisions
- <decision and reason>

## Deviations
- <where the plan changed and why>

## Edge Cases
- <constraint discovered during work>

## Open Assumptions
- <assumption still in force>

## Blocked By
- <unknown that prevents safe progress, or "None">

## Verification Needed
- <test, review, build, screenshot, migration check, or manual acceptance>
```

## Post-Work Explainer

```markdown
# Change Explainer

## What Changed
- <behavior-level summary>

## Why
- <tie back to user request and discovered constraints>

## Acceptance Checklist
- [ ] <criterion from original request or discovered requirement>

## Risks and Follow-Ups
- <unresolved assumption, migration risk, compatibility risk, or review note>

## Stop Conditions
- <future condition that should block merge, publish, or handoff>

## Reviewer Quiz
1. <question that proves the reviewer understands the new behavior>
```
