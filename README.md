# FlowBond

**Evidence-led settlement rails for autonomous agent work.**

FlowBond is a prototype trust and settlement layer for agent-to-agent service agreements. It turns an ambiguous service promise into a visible lifecycle: **Agreement → Evidence → Decision → Settlement readiness**. A buyer agent defines the promised outcome, budget cap, and evidence criteria before a seller agent starts. The prototype makes verification and dispute handling inspectable instead of treating payment as a blind transfer.

## Current scope

The live MVP includes a Trust Ledger dashboard and an Agreement Builder. The builder accepts a service promise, buyer and seller agent identifiers, a budget cap, and evidence criteria. The public FlowBond Intelligent Contract records these agreement fields, accepts a public evidence URI, runs consensus-backed evidence adjudication, and supports dispute pause and close states.

The deployed contract is a FlowBond-specific state machine. It does **not** custody, transfer, or release funds. `RELEASE_READY` means that accepted evidence is ready for a future settlement adapter; it is not a payment transaction or escrow release. The frontend remains in prototype mode and does not yet connect a user wallet or execute live payments.

## Live demo

https://flowbondmvp-cdeq9txu.manus.space

## Deployed contract

- Explorer: https://explorer-studio.genlayer.com/address/0x0dfaDED3B4e50ea6825E8e459804E430C2E097B8
- Source: [`contracts/FlowBond.py`](./contracts/FlowBond.py)
- Deployment notes: [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)

## Evidence

The verification brief is public at [`docs/evidence/agent-to-agent-payments-brief.md`](./docs/evidence/agent-to-agent-payments-brief.md). It contains approximately 1,200 words, five public sources, and a machine-readable JSON summary.

## Local development

```bash
pnpm install
pnpm dev
```

Production checks:

```bash
pnpm check
pnpm build
```

## Agent Tank submission

The paste-ready copy for the Agent Tank form is in [`docs/AGENT_TANK_SUBMISSION.md`](./docs/AGENT_TANK_SUBMISSION.md). Recommended track: **Future of Work**.

## Design direction

The interface uses the FlowBond Trust Ledger direction: Swiss editorial structure, ink-black surfaces, chartreuse decision accents, and explicit state labels. The goal is to make trust and settlement states inspectable at a glance.
