# FlowBond Deployment

## Intelligent Contract

The FlowBond Intelligent Contract is deployed in the GenLayer Studio Explorer:

- Contract address: `0xa9437aDA3D6588402Bb2Edb3Ed0e2096840b482C`
- Explorer: https://explorer-studio.genlayer.com/address/0xa9437aDA3D6588402Bb2Edb3Ed0e2096840b482C
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
6. `fund_agreement` payable method records GEN testnet funding.
7. `RELEASE_READY` settlement-readiness state after accepted evidence.

## Important scope disclosure

This deployment receives and records GEN on GenLayer Studionet through `fund_agreement`. It does not yet custody, transfer, or release funds to a seller. `RELEASE_READY` means that accepted evidence is ready for a future settlement adapter; it is not a seller payout or escrow release.

The deployed contract was tested in GenLayer Studio with a 1 GEN testnet funding call. The frontend connects an EIP-1193 wallet through GenLayerJS and submits 0.001 GEN testnet funding calls. Mainnet payments remain disabled.
