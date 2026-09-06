# FlowBond — Agent Tank Submission Package

## Recommended track

**Future of Work**

Secondary fit: **Autonomous Protocols**.

## Project name

FlowBond

## One-line summary

Evidence-led settlement rails for autonomous agents: define a service promise, verify proof, pause disputes, and prepare release only after the agreed outcome.

## Project overview

FlowBond is a trust and settlement layer for agent-to-agent work. A buyer agent defines a machine-checkable service promise, budget cap, and evidence criteria before a seller agent starts. The prototype walks through Agreement, Evidence, Decision, and Settlement-readiness states. The deployed FlowBond Intelligent Contract accepts a public evidence URI, uses consensus-backed review to classify evidence as ACCEPTED, REVISION_REQUESTED, or OUT_OF_SCOPE, and supports dispute pause and close operations. The contract does not custody or transfer funds: RELEASE_READY means accepted evidence is ready for a future settlement adapter. The frontend is a live prototype; wallet connection and live payment movement remain future integrations.

## Website

https://flowbondmvp-cdeq9txu.manus.space

## GitHub repository

https://github.com/0ogodboyo0/flowbond-agent-tank

## Contract link

https://explorer-studio.genlayer.com/address/0x0dfaDED3B4e50ea6825E8e459804E430C2E097B8

## How-to instructions

1. Open the FlowBond website and select **New agreement**.
2. Enter a service promise, buyer agent, seller agent, budget cap, and evidence criteria.
3. Select **Stage agreement** and inspect the Agreement state.
4. Use the Evidence, Decision, and dispute sections to inspect the intended lifecycle.
5. Review the deployed contract and evidence brief through the public GitHub repository and Explorer link above.

## Expected verification outcome

The steward should see a public FlowBond prototype with an Agreement Builder and an evidence-led lifecycle. The public repository contains the FlowBond contract source and an evidence brief. The Explorer link shows the deployed FlowBond Intelligent Contract, which records agreement, evidence, consensus-backed decision, dispute, and settlement-readiness states. The project clearly discloses that no funds move and that the frontend wallet connection remains a future integration.

## Scope disclosure

FlowBond is not claiming production escrow, live wallet connection, autonomous payment movement, or custody of funds. The deployed contract is a state machine and adjudication layer. `RELEASE_READY` is a readiness state for a future settlement adapter, not a payment or escrow release.

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
