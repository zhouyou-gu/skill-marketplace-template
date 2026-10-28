# Example `AGENT_GOAL.md` After Curation

```markdown
# Mission

**This file defines the long-term mission of the workspace. It is agent-immutable. The agent shall not modify this file autonomously. It may be changed only when the user explicitly and unambiguously instructs a change. Implicit signals, inferred preferences, stylistic adjustments, and routine task updates do not satisfy this condition.**

## Statement

Develop and validate an interpretable adaptive collaboration approach that determines when a primary component needs assistance and which candidate collaborator is most likely to provide complementary capability. The intended outcome is strong task quality with lower resource use, while collaboration decisions remain understandable and the approach remains reusable as components evolve.

> Keep this mission outcome-focused and durable. Named mechanisms, component versions, datasets, task suites, numerical thresholds, infrastructure, implementation plans, current results, and next steps belong in research specifications, implementation artifacts, or progress records rather than this file.

## Scope

- Determine whether internal state provides useful evidence for assistance and collaborator selection beyond observable confidence or aggregate performance.
- Evaluate approaches that match the current state of a primary component to the complementary capabilities of candidate collaborators.
- Make each collaboration decision intelligible by relating the evidence used for selection to the relevant strength of the selected collaborator.
- Support evolving candidate sets through reusable, generic characterization rather than rebuilding the decision process for each task.
- Validate the approach on representative tasks without making any one benchmark or application setting part of the permanent mission.
- Produce a scientifically useful conclusion whether the result is positive or negative.

## Non-Goals

- Building a production-scale serving, deployment, monitoring, or security platform.
- Optimizing one fixed component pairing or evaluation at the expense of broader scientific validity.
- Relabeling a behavior-only selection system as state-based without comparative evidence.
- Presuming that any named representation, signal, or matching technique must succeed.
- Claiming universal complementarity or deployment readiness beyond the evaluated evidence.

## Success Criteria

- Reproducible held-out evidence determines whether internal-state signals improve assistance and collaborator selection over strong behavioral and fixed-choice baselines.
- A successful collaboration policy preserves practically strong task quality while reducing resource use; any trade-off is reported directly rather than hidden in a combined score.
- Decision explanations faithfully expose why the observed state favors one candidate collaborator over another.
- A newly available candidate can be incorporated through the same generic characterization process without target-task routing labels or retraining the decision process.
- The evaluation separates the value of the internal representation from the value of the matching rule and identifies the conditions under which each succeeds or fails.
- If the approach does not outperform simpler alternatives, the work delivers a clear negative result, diagnosed failure modes, and a reusable evaluation protocol.

## Constraints

- Decision-signal construction and candidate onboarding must remain free of target-task outcome supervision.
- Scientific claims must follow the evidence and remain valid if the preferred internal-state method is rejected.
- Explanations must be derived from the actual selection computation rather than added after the decision.

---

**Amendment procedure.** A change to any section of this file requires an explicit user instruction naming the section and the new content. The agent shall not infer a durable amendment from routine tasks, implementation choices, experimental results, operating preferences, or status updates.
```
