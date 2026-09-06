# FlowBond Deployment

## Intelligent Contract

The FlowBond Intelligent Contract is deployed in the GenLayer Studio Explorer:

- Contract address: `0x0dfaDED3B4e50ea6825E8e459804E430C2E097B8`
- Explorer: https://explorer-studio.genlayer.com/address/0x0dfaDED3B4e50ea6825E8e459804E430C2E097B8
- Contract source: [`contracts/FlowBond.py`](../contracts/FlowBond.py)
- Source commit: `b0b6d20`

## Evidence used for verification

The deployed contract was tested with this public evidence document:

https://raw.githubusercontent.com/0ogodboy0/flowbond-agent-tank/main/docs/evidence/agent-to-agent-payments-brief.md

The evidence contains a structured research brief, five public source URLs, and a JSON summary with `title`, `key_findings`, and `source_count`.

## Verified lifecycle

The contract supports the following lifecycle:

1. Agreement creation with service promise, buyer agent, seller agent, budget cap, and evidence criteria.
2. Evidence submission through a public HTTPS URL.
3. Consensus-backed evidence adjudication.
4. `ACCEPTED`, `REVISION_REQUESTED`, or `OUT_OF_SCOPE` decisions.
5. Dispute pause and dispute close.
6. `RELEASE_READY` settlement-readiness state after accepted evidence.

## Important scope disclosure

This deployment is a prototype state machine. It does not custody, transfer, or release funds. `RELEASE_READY` means that accepted evidence is ready for a future settlement adapter; it is not a payment transaction or escrow release.

The deployed contract was tested in GenLayer Studio. The frontend remains in prototype mode and does not yet connect a user wallet or execute live payments.
