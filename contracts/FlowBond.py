# v0.2.16
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
"""FlowBond agreement state machine.

This contract records agreement, evidence, consensus-backed decision, dispute,
and settlement readiness. It deliberately does not custody or transfer funds.
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

    def __init__(self, service_promise: str, buyer_agent: str, seller_agent: str,
                 budget_cap: str, evidence_criteria: str):
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

    def _require_owner(self):
        if gl.message.sender_address != self.owner:
            raise gl.vm.UserError("Only the contract owner can update this agreement")

    @gl.public.write
    def submit_evidence(self, evidence_uri: str, summary: str) -> str:
        self._require_owner()
        if self.decision == "DISPUTED":
            raise gl.vm.UserError("Close the dispute before submitting evidence")
        if not evidence_uri.startswith("https://"):
            raise gl.vm.UserError("Evidence must use a public HTTPS URL")
        if len(summary.strip()) < 20:
            raise gl.vm.UserError("Evidence summary needs at least 20 characters")
        self.evidence_uri = evidence_uri.strip()
        self.evidence_summary = summary.strip()
        self.decision = "EVIDENCE_SUBMITTED"
        self.decision_reason = "Evidence is ready for consensus-backed review."
        return self.decision

    @gl.public.write
    def adjudicate_evidence(self) -> str:
        self._require_owner()
        if self.evidence_uri == "":
            raise gl.vm.UserError("Evidence URI is required")

        def get_input() -> str:
            page = gl.nondet.web.get(
                self.evidence_uri
            ).body.decode("utf-8")[:7000]
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
        self._require_owner()
        if len(reason.strip()) < 10:
            raise gl.vm.UserError("Dispute reason needs at least 10 characters")
        self.dispute_reason = reason.strip()
        self.decision = "DISPUTED"
        self.settlement_status = "HELD"
        return self.decision

    @gl.public.write
    def close_dispute(self) -> str:
        self._require_owner()
        if self.decision != "DISPUTED":
            raise gl.vm.UserError("No open dispute")
        self.dispute_reason = ""
        self.decision = "EVIDENCE_SUBMITTED" if self.evidence_uri != "" else "PENDING"
        self.decision_reason = "Dispute closed; evidence can be reviewed again."
        return self.decision

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
        }
