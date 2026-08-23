# Example: Correcting a Stale Literature-Ledger Note

## Manuscript Frame

A communications manuscript claims robustness under realistic deployment conditions. Its Introduction makes two dimensions relevant: the evaluation environment and which operating variations the evidence covers.

## Existing Ledger Note

> The method was validated in a live network.

This note would support a field-validation comparison, but it is provisional. It must not be copied into Related Work without checking the source.

## Primary-Source Check

The source reports packet-level simulations configured with measurements from an operational network. It does not report deployment or experiments in that network.

The ledger has confused measurement-informed simulation with field validation. Correct it when research-record edits are authorized; otherwise report the discrepancy.

## Relevance Map

| Candidate detail | Manuscript dimension | Necessary gap role | Disposition |
| --- | --- | --- | --- |
| Live-network validation | Evaluation environment | Would establish field evidence, but the source does not support it | Reframe |
| Measurement-informed simulation | Evaluation environment | Establishes that the reviewed evidence stops short of field validation | Keep |
| Training took 3.2 hours on four GPUs | None | None | Remove |

The training detail may be accurate and prominent in the source. It still fails the gate because the manuscript does not compare training cost or compute resources, and the detail does not advance the field-validation gap. Do not retain it for completeness or to meet a word budget.

## Relevant Reframe

> Prior methods evaluate robustness in simulations configured from operational measurements~\\cite{example}.

The sentence now compares the evidence on a manuscript-established dimension without downgrading or overstating the source.

## Gap Test

The reviewed evidence can support a gap about field validation because that dimension already appears in the manuscript frame. It cannot support a claim that the method fails in deployment, that no field study exists anywhere, or that training efficiency is unresolved. The last claim would introduce a comparison dimension absent from the Introduction. The Introduction defines relevance, the primary source defines factual accuracy, and the ledger preserves—but does not control—the evolving interpretation.
