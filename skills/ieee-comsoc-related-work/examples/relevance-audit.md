# Example: Relevance Audit

## Manuscript Framing

The Introduction establishes three dimensions for an edge-network controller:

- which artifact is transferred from offline orchestration into constrained execution
- where reasoning or adaptation occurs
- which traces, labels, feedback, or expert knowledge construction requires

## Sentence Under Review

> The model reports a sub-millisecond encoder forward pass on the evaluation server.

The timing statement may be accurate, but it does not identify the transferred artifact, locate reasoning, or explain a construction requirement. It also does not establish complete controller latency. Remove it unless the manuscript's contribution or subsection gap depends on end-to-end timing.

## Relevant Reframe

> The controller learns action-conditioned dynamics from offline state and action traces, then selects actions through numerical rollouts.

This version identifies where control knowledge resides and which construction data it requires. Those dimensions lead directly to a gap about a controller that must adapt without traces or retraining.

## Compact Gap

> Prior systems transfer policies or trained models into execution rather than a frozen structure that guides the constrained controller's intermediate decisions.

The gap names one missing capability and returns the methodological comparison to the communications setting.
