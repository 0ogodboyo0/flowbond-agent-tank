# v0.2.16
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
"""FlowBond public GenLayer Studionet testnet agreement.

This contract is intended for a public testnet demo. Any connected user may
fund the agreement with test GEN, submit public evidence, request consensus
adjudication, and open or close a dispute. It does not implement mainnet
escrow, seller payouts, or release of funds.
"""
from genlayer import *


class FlowBond(gl.Contract):
    owner: Address
    service_promise: str
    buyer_agent: str
    seller_agent: str
    budget_cap: str
    evidence_criteria: str
    evidence_uri: str
    evidence_summary: str
    decision: str
    decision_reason: str
    dispute_reason: str
    settlement_status: str
    dispute_status: str
    funded_amount: u256

    def __init__(
        self,
        service_promise: str,
        buyer_agent: str,
        seller_agent: str,
        budget_cap: str,
        evidence_criteria: str,
    ):
        if len(service_promise.strip()) < 10:
            raise gl.vm.UserError("Service promise needs at least 10 characters")
        if len(buyer_agent.strip()) == 0 or len(seller_agent.strip()) == 0:
            raise gl.vm.UserError("Buyer and seller agents are required")
        if len(budget_cap.strip()) == 0 or len(evidence_criteria.strip()) < 20:
            raise gl.vm.UserError("Budget cap and evidence criteria are required")

        self.owner = gl.message.sender_address
        self.service_promise = service_promise.strip()
        self.buyer_agent = buyer_agent.strip()
        self.seller_agent = seller_agent.strip()
        self.budget_cap = budget_cap.strip()
        self.evidence_criteria = evidence_criteria.strip()
        self.evidence_uri = ""
        self.evidence_summary = ""
        self.decision = "PENDING"
        self.decision_reason = "Evidence has not been submitted."
        self.dispute_reason = ""
        self.settlement_status = "LOCKED"
        self.dispute_status = "OPEN"
        self.funded_amount = u256(0)

    @gl.public.view
    def get_agreement(self) -> dict[str, str]:
        return {
            "service_promise": self.service_promise,
            "buyer_agent": self.buyer_agent,
            "seller_agent": self.seller_agent,
            "budget_cap": self.budget_cap,
            "evidence_criteria": self.evidence_criteria,
            "evidence_uri": self.evidence_uri,
            "evidence_summary": self.evidence_summary,
            "decision": self.decision,
            "decision_reason": self.decision_reason,
            "dispute_reason": self.dispute_reason,
            "settlement_status": self.settlement_status,
            "dispute_status": self.dispute_status,
            "funded_amount_wei": str(self.funded_amount),
        }

    @gl.public.write.payable
    def fund_agreement(self) -> str:
        if gl.message.value == u256(0):
            raise gl.vm.UserError("Send some GEN to fund the testnet agreement")
        self.funded_amount = self.funded_amount + gl.message.value
        self.settlement_status = "FUNDED_TESTNET"
        return "FUNDED_TESTNET"

    @gl.public.write
    def submit_evidence(self, evidence_uri: str, evidence_summary: str) -> str:
        if self.decision == "DISPUTED":
            raise gl.vm.UserError("Close the dispute before submitting evidence")
        if not evidence_uri.startswith("https://"):
            raise gl.vm.UserError("Evidence must use a public HTTPS URL")
        if len(evidence_summary.strip()) < 20:
            raise gl.vm.UserError("Evidence summary needs at least 20 characters")
        self.evidence_uri = evidence_uri.strip()
        self.evidence_summary = evidence_summary.strip()
        self.decision = "EVIDENCE_SUBMITTED"
        self.decision_reason = "Evidence is ready for consensus-backed review."
        self.settlement_status = "FUNDED_TESTNET" if self.funded_amount > u256(0) else "LOCKED"
        return self.decision

    @gl.public.write
    def adjudicate_evidence(self) -> str:
        if self.evidence_uri == "":
            raise gl.vm.UserError("Evidence URI is required")

        def get_input() -> str:
            page = gl.nondet.web.get(self.evidence_uri).body.decode("utf-8")[:7000]
            return f"""Review this public evidence for the FlowBond agreement.
Service promise: {self.service_promise}
Evidence criteria: {self.evidence_criteria}
Evidence summary: {self.evidence_summary}
Public evidence page:
<page>{page}</page>"""

        result = gl.eq_principle.prompt_non_comparative(
            get_input,
            task="Return exactly one label: ACCEPTED, REVISION_REQUESTED, or OUT_OF_SCOPE.",
            criteria="""
The response contains exactly one of these labels:
ACCEPTED: the public page contains material evidence satisfying the service promise and criteria.
REVISION_REQUESTED: the page is relevant but evidence is incomplete or needs clarification.
OUT_OF_SCOPE: the page is inaccessible, unrelated, deceptive, or contradicts the promise.
The response must contain no other label.
""",
        )
        decision = result.strip().upper()
        if decision not in ["ACCEPTED", "REVISION_REQUESTED", "OUT_OF_SCOPE"]:
            raise gl.vm.UserError("Invalid consensus decision")
        self.decision = decision
        self.decision_reason = "Consensus-backed evidence review completed."
        self.settlement_status = "RELEASE_READY" if decision == "ACCEPTED" else "HELD"
        return decision

    @gl.public.write
    def pause_dispute(self, reason: str) -> str:
        if len(reason.strip()) < 10:
            raise gl.vm.UserError("Dispute reason needs at least 10 characters")
        self.dispute_reason = reason.strip()
        self.dispute_status = "PAUSED"
        self.decision = "DISPUTED"
        self.settlement_status = "HELD"
        return self.decision

    @gl.public.write
    def close_dispute(self) -> str:
        if self.dispute_status != "PAUSED":
            raise gl.vm.UserError("No paused dispute")
        self.dispute_status = "OPEN"
        self.decision = "EVIDENCE_SUBMITTED" if self.evidence_uri != "" else "PENDING"
        self.decision_reason = "Dispute closed; evidence can be reviewed again."
        self.settlement_status = "FUNDED_TESTNET" if self.funded_amount > u256(0) else "LOCKED"
        return self.decision
