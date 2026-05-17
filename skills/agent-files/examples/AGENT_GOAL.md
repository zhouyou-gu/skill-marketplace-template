# Mission

**This file defines the long-term mission of the workspace. It is agent-immutable. The agent shall not modify this file autonomously. It may be changed only when the user explicitly and unambiguously instructs a change. Implicit signals, inferred preferences, stylistic adjustments, and routine task updates do not satisfy this condition.**

## Statement

{{ mission }}

> Mission statement supplied at scaffold time. Keep it durable: it shall survive many turns, many tasks, and many contributors without edit.

## Scope

- Not yet specified by user. Until amended, only the mission statement above is durable scope. Explicit user instructions govern the current turn but do not become persistent scope unless the user explicitly amends this file.

## Non-Goals

- No non-goals have been specified by user. If contemplated work appears outside the mission statement, stop and request user direction rather than inferring a durable non-goal.

## Success Criteria

- Not yet specified by user. Do not invent success criteria from routine task progress; ask the user before recording durable completion criteria.

## Constraints

- No additional mission-level constraints have been specified by user.
- A constraint belongs here only if removing it would change the mission. Workflow preferences, style rules, formatting conventions, validation habits, and operating routines are not mission constraints; they belong in `AGENT_HARNESS.md`.
- Mission constraints outrank harness preferences by virtue of `AGENT.md`'s precedence rules; this section shall not restate that precedence or reach into harness jurisdiction.

---

**Amendment procedure.** A change to any section of this file requires an explicit user instruction naming the section and the new content. The agent shall record no amendment in `AGENT_PROGRESS.md` beyond a single bullet noting that the user amended the mission. The agent shall not treat a new task, a new workstream, or a shift in emphasis as implicit amendment authority.
