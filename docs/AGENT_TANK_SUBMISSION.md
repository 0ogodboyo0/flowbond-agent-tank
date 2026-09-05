# FlowBond — Agent Tank Submission Package

This document contains paste-ready copy for the Agent Tank form. It is written for the current FlowBond prototype and does not claim live escrow, live payments, or a deployed FlowBond Intelligent Contract.

## Recommended track

**Future of Work**

Secondary fit: **Autonomous Protocols**. Use Future of Work as the primary track because the project is about verified work, outcome-based settlement, and accountable collaboration between autonomous agents.

## Project name

FlowBond

## One-line summary — under 180 characters

Evidence-led settlement rails for autonomous agents: define a service promise, verify proof, pause disputes, and release payment only after the agreed outcome.

## Project overview — under 1000 characters

FlowBond is a trust and settlement layer for agent-to-agent work. A buyer agent defines a machine-checkable service promise, budget cap, and evidence criteria before a seller agent starts. The prototype then walks through Agreement, Evidence, Decision, and Settlement states: evidence can be inspected, a dispute can pause the stream, and a verified outcome can prepare a release. GenLayer is the planned adjudication layer for cases where evidence is external, semantic, or contested, using web-aware Intelligent Contracts and independent validator consensus rather than a single opaque decision. This submission is an honest frontend prototype: the Agreement Builder and state transitions are live in the demo, while wallet custody, production escrow, and a deployed FlowBond contract remain planned.

## Website

https://flowbondmvp-cdeq9txu.manus.space

## GitHub repository

Create a separate public repository named `flowbond-agent-tank`. Do not submit the MilestoneJury repository. The repository must belong to the GitHub account linked to the GenLayer Portal.

## How-to instructions

### Step 1 — Open the live prototype

Open the FlowBond website and select **New agreement** in the hero section.

### Step 2 — Define the promise

Enter a service promise, buyer agent, seller agent, budget cap, and evidence criteria in the Prototype Builder. Select **Stage agreement**.

### Step 3 — Inspect the agreement state

Confirm that the dashboard returns to the Agreement state and displays the evidence-led service agreement flow. The interface should visibly show the prototype/no-live-funds disclosure.

### Step 4 — Explore the verification path

Use the Agreement, Evidence, and Decision sections to inspect the intended lifecycle. The current build demonstrates the interaction model; it does not move real funds or claim production escrow custody.

## Expected verification outcome — under 500 characters

The steward should see a live FlowBond dashboard with a New agreement action. After entering the service promise, agent identities, budget, and evidence criteria, selecting Stage agreement closes the builder, returns to the Agreement state, and shows a prototype confirmation. The page clearly states that no live funds move. Evidence, Decision, dispute pause, and settlement release are presented as prototype states.

## Demo video

Optional. If a YouTube demo is ready, show the exact path above and keep the on-screen labels honest: Prototype Builder, Prototype state, and No live funds.

## Contract link

Leave the contract link empty for this submission unless a separate FlowBond Intelligent Contract is deployed and publicly verifiable. Do not use MilestoneJury deployment links as FlowBond evidence.

## Submission checklist

| Item | Status | Action |
|---|---:|---|
| Track | Ready | Select Future of Work |
| Public GitHub repository | Needed | Create `flowbond-agent-tank` under the linked GitHub account |
| Logo | Ready | Upload the FlowBond mark as PNG, JPEG, or WebP within the portal limits |
| One-liner | Ready | Paste the one-line summary above |
| Overview | Ready | Paste the overview above |
| Website | Ready | Paste the live FlowBond URL |
| How-to | Ready | Add the four steps above |
| Expected outcome | Ready | Paste the verification outcome above |
| YouTube | Optional | Add only if the demo is recorded |
| Contract link | Not applicable yet | Leave empty unless FlowBond has its own deployment |
