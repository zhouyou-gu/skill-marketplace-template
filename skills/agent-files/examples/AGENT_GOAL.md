# Mission

**This file defines the long-term mission of the workspace. It is agent-immutable. The agent shall not modify this file autonomously. It may be changed only when the user explicitly and unambiguously instructs a change. Implicit signals, inferred preferences, stylistic adjustments, and routine task updates do not satisfy this condition.**

## Statement

{{ mission }}

> Replace the placeholder above with a one- or two-sentence mission statement. Keep it durable: it shall survive many turns, many tasks, and many contributors without edit.

## Scope

- Name the artifacts, surfaces, or systems this mission covers.
- Name the kinds of work that advance the mission.

## Non-Goals

- Name the surfaces and work the mission explicitly excludes.
- Non-goals bind the agent as strictly as scope. Contemplated work outside scope or inside non-goals is out-of-contract; the agent shall stop and request user direction.

## Success Criteria

- List the concrete outcomes that, taken together, mean the mission is accomplished.
- Each criterion shall be verifiable without re-interviewing the user.

## Constraints

- List the constraints the mission imposes on the workspace itself — legal, ethical, regulatory, contractual, or irreducible technical limits.
- A constraint belongs here only if removing it would change the mission. Workflow preferences, style rules, formatting conventions, validation habits, and operating routines are not mission constraints; they belong in `AGENT_HARNESS.md`.
- Mission constraints outrank harness preferences by virtue of `AGENT.md`'s precedence rules; this section shall not restate that precedence or reach into harness jurisdiction.

---

**Amendment procedure.** A change to any section of this file requires an explicit user instruction naming the section and the new content. The agent shall record no amendment in `AGENT_PROGRESS.md` beyond a single bullet noting that the user amended the mission. The agent shall not treat a new task, a new workstream, or a shift in emphasis as implicit amendment authority.
