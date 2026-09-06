# Agent-to-Agent Payments: Evidence Brief for FlowBond

## Title

Agent-to-agent payments: bounded autonomy, verifiable intent, and evidence-led settlement

## Executive summary

Agent-to-agent payments are emerging as a coordination problem rather than merely a faster checkout flow. An autonomous agent may discover a service, negotiate terms, invoke an API, request a resource, or initiate a payment while the human principal is absent. The central design question is therefore bounded autonomy: what authority was granted, which conditions constrain that authority, what evidence proves that the service was delivered, and who can resolve a dispute? FlowBond addresses the verification layer in this lifecycle. It records a service promise, identifies buyer and seller agents, captures evidence criteria, and uses a consensus-backed review to classify submitted public evidence. Its current Intelligent Contract is a state machine and does not custody or transfer funds.

## Key findings

### 1. Agent payments require a verifiable chain of intent and authority

Traditional payment experiences assume that a person is directly approving a purchase on a trusted surface. That assumption becomes weaker when software agents act through APIs and delegated permissions. The Agent Payments Protocol documentation identifies authorization, authenticity, and accountability as the core gaps: a merchant needs to know whether a user granted a particular authority, whether the agent accurately represented the user's intent, and who is responsible if the action is incorrect. AP2 addresses this with signed mandates and verifiable credentials. Open and closed mandates can describe user constraints before a transaction and the finalized checkout or payment after the details are known. The important lesson for FlowBond is that a budget cap or service promise should be explicit, inspectable, and bound to an auditable record rather than inferred from an agent's natural-language explanation.

### 2. Payment rails are becoming machine-readable, but payment is not proof of delivery

Cloudflare's agentic-payments documentation describes a common HTTP flow for x402 and the Machine Payments Protocol: a client requests a resource, the server returns a payment challenge, the client supplies a payment credential, and the server verifies the payment before returning the resource and receipt. Stripe similarly documents machine payments as a way for agents to pay for APIs and services programmatically, with payment challenges and credentials handled without a conventional account-creation flow. These mechanisms reduce friction for metered services and digital resources. They do not, by themselves, prove that a complex deliverable met a buyer's acceptance criteria. A successful payment receipt answers “was the payment accepted?” but not necessarily “was the promised research, reconciliation, code change, or uptime outcome delivered?” FlowBond therefore treats payment as a later adapter and puts Evidence and Decision before release readiness.

### 3. Evidence criteria must be defined before the seller acts

A buyer and seller agent need a shared acceptance surface. For a research brief, that surface could require an accessible public URI, approximately 1,200 words, five source URLs, a JSON summary, and no private data. For software work, it might require schema checks, integration tests, uptime proof, and a human review note. Pre-declared criteria reduce disputes because the seller can optimize for observable outcomes rather than an ambiguous request. They also make automated adjudication more bounded: the consensus process can classify evidence against known criteria instead of inventing a new standard after delivery. This is why FlowBond stores the service promise and evidence criteria as part of the initial Agreement state.

### 4. Consensus-backed review is useful for semantic evidence, but it is not a substitute for governance

Some acceptance tests are deterministic and should be performed by code. Others are semantic: whether a report is materially responsive, whether sources support a conclusion, or whether a deliverable is in scope. GenLayer's model is useful for the second category because validators can assess a leader's proposed classification against criteria rather than requiring identical free-form text. A result such as `ACCEPTED`, `REVISION_REQUESTED`, or `OUT_OF_SCOPE` is more operationally useful than an opaque paragraph. However, consensus does not eliminate model risk, web-page changes, inaccessible URLs, prompt injection, or the need for an appeal path. FlowBond keeps a dispute state and records the evidence URI and summary so that a later settlement adapter can be subject to additional policy and human review.

### 5. The practical architecture is hybrid, not fully autonomous

The research literature on agent-to-agent finance frames the problem as infrastructure for identity, authorization, payment, verification, reputation, and accountability. Blockchain can contribute programmable settlement, persistent identifiers, auditable state, and policy-controlled wallets, but it cannot by itself solve hallucination, legal responsibility, prompt injection, or governance failures. The most credible near-term architecture is hybrid: agents handle discovery and workflow; payment networks or stablecoin rails handle settlement; signed mandates constrain authority; public or permissioned records preserve evidence; and organizations retain policy, compliance, and dispute responsibilities. FlowBond fits this hybrid model by making the service promise and verification record explicit before any future payment movement.

## FlowBond interpretation

The prototype currently demonstrates the Agreement Builder and the Agreement → Evidence → Decision → Settlement-readiness lifecycle. The FlowBond Intelligent Contract stores the buyer and seller identifiers, budget cap, promise, criteria, evidence URI, evidence summary, decision, dispute reason, and settlement status. A consensus-backed review can produce `ACCEPTED`, `REVISION_REQUESTED`, or `OUT_OF_SCOPE`. Only the first result sets `RELEASE_READY`; that label means that evidence is ready for a future settlement adapter and does not transfer funds. This separation is intentional: payment protocols can prove authorization and payment execution, while FlowBond supplies a structured verification gate for outcome-based work.

## Limitations and next steps

This brief is evidence for a prototype evaluation, not financial, legal, or investment advice. The cited protocols and research describe active or emerging infrastructure, and production integrations would require security review, access-control design, compliance analysis, replay protection, revocation, monitoring, and explicit handling of failed or changing web evidence. The next technical step for FlowBond is to bind accepted evidence to a real settlement adapter only after the contract state, evidence provenance, dispute policy, and operator permissions have been independently reviewed.

## Sources

1. AP2 Protocol Documentation — https://ap2-protocol.org/
2. Google Cloud, “Powering AI commerce with the new Agent Payments Protocol (AP2)” — https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol
3. Cloudflare Agents Documentation, “Agentic Payments” — https://developers.cloudflare.com/agents/tools/payments/
4. Stripe Documentation, “Machine payments” — https://docs.stripe.com/payments/machine
5. Hui Gong, “Agent-to-Agent Finance: Blockchain Payments and Trust Infrastructure for Autonomous AI Agents” — https://arxiv.org/html/2607.00245v1

## JSON summary

```json
{
  "title": "Agent-to-agent payments: bounded autonomy, verifiable intent, and evidence-led settlement",
  "key_findings": [
    "Agent payments need verifiable authority, intent, and accountability.",
    "Machine-readable payment rails reduce payment friction but do not prove service delivery.",
    "Evidence criteria should be defined before work begins and reviewed against observable outcomes.",
    "Consensus-backed semantic review is useful but does not replace governance or dispute handling.",
    "A hybrid architecture combining agents, payment rails, signed authority, evidence, and policy is more credible than fully autonomous settlement."
  ],
  "source_count": 5
}
```
