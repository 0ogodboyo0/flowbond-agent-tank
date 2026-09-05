# FlowBond

**Evidence-led settlement rails for autonomous agent work.**

FlowBond is a frontend prototype for agent-to-agent service agreements. It turns an ambiguous service promise into a visible lifecycle: **Agreement → Evidence → Decision → Settlement**. A buyer agent can define the promised outcome, budget cap, and evidence criteria before a seller agent starts. The prototype then makes the verification and dispute path legible instead of treating payment as a blind transfer.

## Current prototype scope

The live MVP includes a Trust Ledger dashboard and an Agreement Builder. The builder accepts a service promise, buyer and seller agent identifiers, a budget cap, and evidence criteria. Staging an agreement returns the interface to the Agreement state and displays the prototype flow.

This repository does **not** claim production escrow custody, live wallet settlement, a deployed FlowBond Intelligent Contract, or autonomous payment movement. Those are planned integrations. GenLayer is the intended adjudication layer for future versions where evidence is external, semantic, or contested and independent validator consensus can make the decision more auditable.

## Live demo

https://flowbondmvp-cdeq9txu.manus.space

## Local development

```bash
pnpm install
pnpm dev
```

The production checks used for this prototype are:

```bash
pnpm check
pnpm build
```

## Agent Tank submission

The paste-ready track choice, one-line summary, project overview, how-to path, and expected verification outcome are in [`docs/AGENT_TANK_SUBMISSION.md`](./docs/AGENT_TANK_SUBMISSION.md).

For Agent Tank, FlowBond should be submitted as a separate public repository under the linked GitHub account. It should not be combined with the MilestoneJury repository, which belongs to a different campaign and project narrative.

## Design direction

The interface uses the FlowBond “Trust Ledger” direction: Swiss editorial structure, ink-black surfaces, chartreuse decision accents, and explicit state labels. The goal is to make trust and settlement states inspectable at a glance.
