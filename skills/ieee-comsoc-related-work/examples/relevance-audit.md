# Example: Correcting a Stale Literature-Ledger Note

## Manuscript Frame

A communications manuscript motivates adaptation under changing deployment conditions. Its Introduction makes two dimensions relevant: when adaptation occurs and what deployment-time supervision it requires.

## Existing Ledger Note

> The method adapts online from labeled deployment samples.

This note would support a comparison about runtime supervision, but it is provisional. It must not be copied into Related Work without checking the paper.

## Primary-Source Check

The paper states that labeled simulated samples are used during offline training. At deployment, the learned parameters remain fixed and the method consumes ordinary observations without labels.

The old note confuses training input with runtime input. Correct the ledger when research-record edits are authorized; otherwise report the discrepancy.

## Relevant Reframe

> Prior learning-based methods encode adaptation during offline training on labeled simulated conditions, then apply fixed parameters to unlabeled deployment observations~\\cite{example}.

The sentence now compares the work on dimensions established by the manuscript and says no more than the paper supports.

## Gap Test

A gap about label-free *training* could follow from this evidence. A gap about label-free *deployment* could not, because the cited method already has that property. This distinction illustrates why the Introduction defines relevance, the primary paper defines factual accuracy, and the ledger preserves—but does not control—the evolving interpretation.
