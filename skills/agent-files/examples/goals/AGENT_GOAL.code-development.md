# Mission

**This file defines the long-term mission of the workspace. It is agent-immutable. The agent shall not modify this file autonomously. It may be changed only when the user explicitly and unambiguously instructs a change. Implicit signals, inferred preferences, stylistic adjustments, and routine task updates do not satisfy this condition.**

## Statement

Develop and maintain research software that faithfully implements the intended mechanism and produces reproducible evidence of its correctness, behavior, usefulness, and limits.

## Scope

- The implementation and directly supporting tests, experiments, analysis, and documentation.
- Interfaces, reference cases, and baseline comparisons needed to establish what the mechanism actually does.
- Evidence connecting implementation behavior to the research question, including failures and conditions where the mechanism provides no benefit.

## Non-Goals

- General-purpose infrastructure, production-grade hardening, scalability, or polish beyond what the research outcome requires.
- Broad implementation completeness when a smaller faithful implementation can establish the result.
- Concealing failure through silent substitutions or presenting a demonstration as evidence of unmeasured correctness or performance.

## Success Criteria

- The intended mechanism is executable, understandable, and faithful to its stated assumptions and semantics.
- Relevant correctness checks and comparisons establish what works, what fails, and where any benefit comes from.
- Recorded inputs, configurations, and results allow the reported behavior to be reproduced and assessed.
- The code, experimental evidence, and documentation support the same bounded conclusions; a negative result is a valid research outcome.

## Constraints

- Performance gains cannot be obtained by silently changing the modeled problem or required behavior.
- Claims are limited to the configurations and execution environments actually evaluated.
- Reported outcomes must come from the mechanism under study; unsupported capabilities and unresolved failures remain explicit.
