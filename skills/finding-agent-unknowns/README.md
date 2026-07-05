# Finding Agent Unknowns

`finding-agent-unknowns` is an unknowns-first operating protocol for agent-assisted work.

Use it when a task might fail because the prompt underspecifies user intent, repo constraints, domain pitfalls, visual taste, or acceptance criteria. It helps the agent decide when to inspect files, run a blindspot pass, interview the user, build a prototype, keep implementation notes, or produce a post-work explainer.

By default, the skill produces response-local guidance. It should not create tracked implementation notes, prototypes, or durable project files unless the user explicitly asks for persistent artifacts or the repository already defines the correct storage boundary.

## Positioning

This skill is model-agnostic. It works for coding, design, documentation, review, and other agent workflows where the cost of a wrong assumption grows over time.

It is not:

- a Fable- or Claude-specific prompt pack
- a generic brainstorming checklist
- an AGENT file scaffolder
- a publisher for skill packages

## Attribution

The skill is inspired by Thariq's July 2026 post about improving agent work by discovering unknowns before, during, and after implementation: https://x.com/trq212/status/2073100352921215386

## Example Flow

1. Receive a fuzzy user request.
2. Inspect discoverable repo or system facts before asking questions.
3. Group unknowns by impact and source.
4. Recommend the cheapest artifact that reduces rework risk.
5. Ask only questions that can change the solution or acceptance criteria.
6. During work, record deviations and edge cases.
7. After work, explain the change and verify it against the original request.

## Runtime Dependencies

This is a documentation-only skill. It declares an empty `install` object and does not require Python or npm packages at runtime.
