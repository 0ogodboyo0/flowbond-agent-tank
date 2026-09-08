# FlowBond — Agent Tank Submission Package

## Recommended track

**Future of Work**

Secondary fit: **Autonomous Protocols**.

## Project name

FlowBond

## One-line summary

Evidence-led settlement rails for autonomous agents: define a service promise, verify proof, pause disputes, and prepare release only after the agreed outcome.

## Project overview

FlowBond is a trust and settlement layer for agent-to-agent work. A buyer agent defines a machine-checkable service promise, budget cap, and evidence criteria before a seller agent starts. The deployed FlowBond Intelligent Contract accepts a public evidence URI, uses consensus-backed review to classify evidence as ACCEPTED, REVISION_REQUESTED, or OUT_OF_SCOPE, supports dispute pause and close operations, and receives GEN testnet funding through a payable method. The frontend connects an EIP-1193 wallet through GenLayerJS and submits a small Studionet funding transaction. Mainnet settlement and seller payouts remain disabled.

## Website

https://flowbondmvp-cdeq9txu.manus.space

## GitHub repository

https://github.com/0ogodboyo0/flowbond-agent-tank

## Contract link

https://explorer-studio.genlayer.com/address/0xa9437aDA3D6588402Bb2Edb3Ed0e2096840b482C

## How-to instructions

1. Open the FlowBond website and select **New agreement**.
2. Enter a service promise, buyer agent, seller agent, budget cap, and evidence criteria.
3. Select **Stage agreement** and inspect the Agreement state.
4. Use the Evidence, Decision, and dispute sections to inspect the lifecycle.
5. Connect a wallet on GenLayer Studionet and use the testnet funding action to submit 0.001 GEN.
6. Review the deployed contract and evidence brief through the public GitHub repository and Explorer link above.

## Expected verification outcome

The steward should see a public FlowBond application with an Agreement Builder, GenLayer wallet connection, and an evidence-led lifecycle. The public repository contains the FlowBond contract source and an evidence brief. The Explorer link shows the deployed FlowBond Intelligent Contract, which records agreement, evidence, consensus-backed decision, dispute, settlement-readiness, and GEN testnet funding states. The project clearly discloses that mainnet payments and seller payouts remain disabled.

## Scope disclosure

FlowBond is not claiming production escrow, mainnet payments, autonomous seller payouts, or production custody of funds. The deployed contract receives and records GEN on Studionet as a testnet funding action. `RELEASE_READY` is a readiness state for a future settlement adapter, not a seller payout or escrow release.

## Submission checklist

| Item | Status |
|---|---:|
| Track | Ready — Future of Work |
| Project name | Ready — FlowBond |
| Website | Ready |
| Public GitHub repository | Ready |
| Contract link | Ready — GenLayer Explorer |
| One-line summary | Ready |
| Project overview | Ready |
| How-to instructions | Ready |
| Expected verification outcome | Ready |
| Logo | Upload FlowBond mark |
| YouTube demo | Optional |
