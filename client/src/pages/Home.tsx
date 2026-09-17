// FlowBond style reminder: Trust Ledger design; evidence before assertion, editorial hierarchy, split-rail composition, chartreuse verified states, coral disputes, and no fabricated live settlement.
import { useEffect, useState } from "react";
import { ArrowUpRight, Check, ChevronRight, CircleAlert, Clock3, Copy, FileCheck2, GitBranch, LockKeyhole, Menu, Pause, Play, ShieldCheck, Sparkles, WalletCards, X } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { TransactionStatus } from "genlayer-js/types";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, handler: (...args: any[]) => void) => void;
      removeListener?: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}

const heroImage = "/manus-storage/flowbond-hero-reference_64581207.png";
const evidenceImage = "/manus-storage/flowbond-evidence-card_8cb65775.png";
const horizonImage = "/manus-storage/flowbond-settlement-horizon_f549f034.png";
const markImage = "/manus-storage/flowbond-mark_c4dfc9a2.png";
const FLOWBOND_CONTRACT = "0x1Ae16B9E32eeFd1b604E9836886884A16F4aAC11" as `0x${string}`;
const STUDIONET_CHAIN_ID = "0xf22f"; // 61999
const METAMASK_MOBILE_DAPP = `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`;

export default function Home() {
  const [activeTab, setActiveTab] = useState<"agreement" | "evidence" | "decision">("agreement");
  const [mobileNav, setMobileNav] = useState(false);
  const [copied, setCopied] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletBusy, setWalletBusy] = useState(false);
  const [testnetTx, setTestnetTx] = useState<string | null>(null);
  const [agreement, setAgreement] = useState<any | null>(null);
  const [agreementLoading, setAgreementLoading] = useState(true);
  const [agreementError, setAgreementError] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [evidenceUri, setEvidenceUri] = useState("");
  const [evidenceSummary, setEvidenceSummary] = useState("");
  const [disputeReason, setDisputeReason] = useState("");



  const loadAgreement = async () => {
    setAgreementLoading(true);
    setAgreementError(null);

    try {
      const client = createClient({ chain: studionet });

      const raw = await (client as any).readContract({
        address: FLOWBOND_CONTRACT,
        functionName: "get_agreement",
        args: [],
      });

      const value = Array.isArray(raw)
        ? {
            service_promise: raw[0],
            buyer_agent: raw[1],
            seller_agent: raw[2],
            budget_cap: raw[3],
            evidence_criteria: raw[4],
            evidence_uri: raw[5],
            evidence_summary: raw[6],
            decision: raw[7],
            decision_reason: raw[8],
            dispute_reason: raw[9],
            settlement_status: raw[10],
            dispute_status: raw[11],
            funded_amount_wei: raw[12],
          }
        : raw;

      if (!value) throw new Error("Empty FlowBond agreement.");

      setAgreement(value);
    } catch (e) {
      setAgreementError(
        e instanceof Error ? e.message : "Unable to read FlowBond."
      );
    } finally {
      setAgreementLoading(false);
    }
  };

  const [draft, setDraft] = useState({ promise: "", buyer: "", seller: "", budget: "480", criteria: "Schema compliance, integration tests" });

  const getWallet = () => window.ethereum;


;



  const connectToStudionet = async (requestAccounts = true) => {
    const ethereum = getWallet();

    if (!ethereum) {
      throw new Error(
        `No browser wallet provider. Open this site in MetaMask Mobile: ${METAMASK_MOBILE_DAPP}`
      );
    }

    // First read the currently selected account.
    // This prevents unnecessary duplicate wallet popups.
    let accounts = (await ethereum.request({
      method: "eth_accounts"
    })) as string[];

    if ((!accounts || accounts.length === 0) && requestAccounts) {
      accounts = (await ethereum.request({
        method: "eth_requestAccounts"
      })) as string[];
    }

    if (!accounts?.[0]) {
      throw new Error("No wallet account selected.");
    }

    const address = accounts[0] as `0x${string}`;

    const client = createClient({
      chain: studionet,
      account: address,
      provider: ethereum,
    });

    // Connect to the exact GenLayer Studionet network.
    await client.connect("studionet");

    return {
      client,
      address
    };
  };

  const runContractAction = async (
    functionName: string,
    args: unknown[] = [],
  ) => {
    setActionBusy(true);

    try {
      const { client, address } = await connectToStudionet(true);
      setWalletAddress(address);

      const hash = String(
        await (client as any).writeContract({
          address: FLOWBOND_CONTRACT,
          functionName,
          args,
        }),
      );

      setTestnetTx(hash);

      toast.info(`${functionName} submitted`, {
        description:
          "Waiting for GenLayer consensus finalization...",
      });

      await (client as any).waitForTransactionReceipt({
        hash,
        status: TransactionStatus.FINALIZED,
      });

      toast.success(`${functionName} finalized`, {
        description:
          "The transaction reached FINALIZED status on GenLayer Studionet.",
      });

      await loadAgreement();

      return hash;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Transaction failed.";

      toast.error(`${functionName} failed`, {
        description: message,
      });

      throw error;
    } finally {
      setActionBusy(false);
    }
  };

  const submitEvidence = async () => {
    const uri = evidenceUri.trim();
    const summary = evidenceSummary.trim();

    if (!uri.startsWith("https://")) {
      toast.error("Invalid evidence URI", {
        description: "Evidence URI must start with https://",
      });
      return;
    }

    if (summary.length < 20) {
      toast.error("Evidence summary too short", {
        description: "The evidence summary must contain at least 20 characters.",
      });
      return;
    }

    if (agreement?.decision === "DISPUTED") {
      toast.error("Evidence submission blocked", {
        description: "Close the active dispute before submitting new evidence.",
      });
      return;
    }

    return runContractAction("submit_evidence", [uri, summary]);
  };

  const adjudicateEvidence = async () => {
    if (!agreement?.evidence_uri) {
      toast.error("Evidence required", {
        description:
          "Submit an HTTPS evidence URI before adjudicating.",
      });
      return;
    }

    return runContractAction("adjudicate_evidence");
  };

  const pauseDispute = async () => {
    const reason = disputeReason.trim();

    if (reason.length < 10) {
      toast.error("Dispute reason too short", {
        description:
          "The dispute reason must contain at least 10 characters.",
      });
      return;
    }

    return runContractAction("pause_dispute", [reason]);
  };

  const closeDispute = async () => {
    return runContractAction("close_dispute");
  };

  const copyAddress = () => {
    setCopied(true);
    toast.success("Agreement reference copied", { description: `${FLOWBOND_CONTRACT.slice(0, 6)}...${FLOWBOND_CONTRACT.slice(-4)} is ready to share.` });
    window.setTimeout(() => setCopied(false), 1800);
  };

  const createAgreement = () => {
    setCreateOpen(false);
    setActiveTab("agreement");
    toast.info("Agreement builder", {
      description: "The deployed FlowBond contract is the active public agreement. Deployment of new agreements is not enabled yet.",
    });
  };

  useEffect(() => {
    void loadAgreement();
  }, []);

  useEffect(() => {
    void loadAgreement();
  }, []);

  useEffect(() => {
    const ethereum = getWallet();

    if (!ethereum) return;

    const syncWallet = async () => {
      try {
        const accounts = (await ethereum.request({
          method: "eth_accounts"
        })) as string[];

        if (accounts?.[0]) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress(null);
        }
      } catch {
        // Wallet availability is optional until user clicks Connect.
      }
    };

    const onAccountsChanged = (accounts: string[]) => {
      setWalletAddress(accounts?.[0] ?? null);
      setTestnetTx(null);
    };

    const onChainChanged = () => {
      void syncWallet();
    };

    void syncWallet();

    ethereum.on?.("accountsChanged", onAccountsChanged);
    ethereum.on?.("chainChanged", onChainChanged);


{agreementError && (
  <div className="rounded-lg border border-coral/30 bg-coral/10 p-4">
    <p className="meta-label text-coral">Contract read error</p>
    <p className="mt-2 text-xs text-white/60">{agreementError}</p>
  </div>
)}

<div className="mt-4 grid gap-3 sm:grid-cols-2">
  <div className="rounded-lg border border-white/10 p-4">
    <p className="meta-label">On-chain decision</p>
    <p className="mt-2 font-mono text-sm text-chartreuse">
      {agreementLoading ? "LOADING..." : agreement?.decision || "PENDING"}
    </p>
    <p className="mt-1 text-xs text-white/45">
      {agreement?.decision_reason || "Waiting for evidence."}
    </p>
  </div>

  <div className="rounded-lg border border-white/10 p-4">
    <p className="meta-label">Settlement status</p>
    <p className="mt-2 font-mono text-sm text-chartreuse">
      {agreement?.settlement_status || "LOCKED"}
    </p>
    <p className="mt-1 text-xs text-white/45">
      Dispute: {agreement?.dispute_status || "OPEN"}
    </p>
  </div>

  <div className="rounded-lg border border-white/10 p-4 sm:col-span-2">
    <p className="meta-label">Funded amount</p>
    <p className="mt-2 font-mono text-sm text-bone">
      {agreement?.funded_amount_wei != null
        ? `${Number(agreement.funded_amount_wei) / 1e18} GEN`
        : "0 GEN"}
    </p>
  </div>
</div>

return () => {
      ethereum.removeListener?.("accountsChanged", onAccountsChanged);
      ethereum.removeListener?.("chainChanged", onChainChanged);
    };
  }, []);

  const connectWallet = async () => {
    setWalletBusy(true);

    try {
      const { address } = await connectToStudionet(true);

      setWalletAddress(address);

      toast.success(
        "Wallet connected",
        {
          description: "GenLayer Studionet selected (Chain ID 61999)."
        }
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The wallet connection was rejected.";

      if (
        message.includes("4001") ||
        /reject|denied|cancel/i.test(message)
      ) {
        toast.error(
          "Wallet connection cancelled",
          {
            description:
              "Approve the account and network request in your wallet."
          }
        );
      } else {
        toast.error(
          "Wallet connection failed",
          {
            description: message
          }
        );
      }
    } finally {
      setWalletBusy(false);
    }
  };

  const sendTestnetPayment = async () => {
    setWalletBusy(true);

    try {
      const { client, address } = await connectToStudionet(true);
      setWalletAddress(address);

      const write = {
        address: FLOWBOND_CONTRACT,
        functionName: "fund_agreement",
        args: [],
        value: BigInt("1000000000000000"),
      };

      const hash = String(
        await client.writeContract(write),
      );

      setTestnetTx(hash);

      toast.info("GEN testnet funding submitted", {
        description:
          "Waiting for GenLayer consensus finalization...",
      });

      await (client as any).waitForTransactionReceipt({
        hash,
        status: TransactionStatus.FINALIZED,
      });

      toast.success("GEN testnet funding finalized", {
        description:
          "0.001 GEN funding is finalized on GenLayer Studionet.",
      });

      await loadAgreement();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The funding transaction failed.";

      toast.error("GEN testnet funding failed", {
        description: message,
      });
    } finally {
      setWalletBusy(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-ink text-bone">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="brand-glyph"><span className="brand-link brand-link-a" /><span className="brand-link brand-link-b" /><img src={markImage} alt="FlowBond mark" /></div>
            <div>
              <p className="font-display text-lg font-bold tracking-tight">flowbond</p>
              <p className="hidden font-mono text-[9px] uppercase tracking-[0.28em] text-white/45 sm:block">accountable work rails</p>
            </div>
          </div>
          <div className="hidden items-center gap-8 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 md:flex">
            <a href="#agreement" className="transition-colors hover:text-chartreuse">Agreements</a>
            <a href="#evidence" className="transition-colors hover:text-chartreuse">Evidence</a>
            <a href="#decision" className="transition-colors hover:text-chartreuse">Decisions</a>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-chartreuse/30 bg-chartreuse/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-chartreuse sm:inline-flex">GenLayer Studionet</span>
            <button onClick={() => setMobileNav((value) => !value)} className="rounded-md border border-white/10 p-2 text-white/70 md:hidden" aria-label="Toggle navigation">{mobileNav ? <X size={16} /> : <Menu size={16} />}</button>
            <button onClick={connectWallet} disabled={walletBusy} className="hidden items-center gap-2 rounded-md bg-chartreuse px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-ink transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 sm:flex"><WalletCards size={14} /> {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : walletBusy ? "Connecting..." : "Connect wallet"}</button>
          </div>
        </div>
        {mobileNav && <nav className="border-t border-white/10 px-5 py-4 md:hidden"><div className="flex flex-col gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60"><a href="#agreement">Agreements</a><a href="#evidence">Evidence</a><a href="#decision">Decisions</a></div></nav>}
      </header>

      <section className="relative border-b border-white/10" id="agreement">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,11,20,0.99)_0%,rgba(6,11,20,0.92)_45%,rgba(6,11,20,0.58)_100%)]" />
        <div className="relative mx-auto grid min-h-[520px] max-w-[1440px] items-end gap-10 px-5 pb-16 pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:pb-20">
          <div className="relative z-10 max-w-[600px]">
            <p className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-chartreuse"><span className="h-px w-8 bg-chartreuse" /> Agent-to-agent work, made accountable</p>
            <h1 className="font-display text-[clamp(3.3rem,7vw,7.5rem)] font-bold leading-[0.88] tracking-[-0.07em] text-bone">Payment follows<br /><span className="text-chartreuse">proof.</span></h1>
            <p className="mt-7 max-w-[480px] text-base leading-7 text-white/62 sm:text-lg">FlowBond turns ambiguous service promises into machine-checkable agreements—so autonomous agents can hire, verify, and settle work without blind trust.</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <button onClick={() => setActiveTab("evidence")} className="group inline-flex items-center gap-2 rounded-md bg-chartreuse px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink transition-transform hover:-translate-y-0.5 active:scale-[0.98]">Inspect evidence <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></button>
              <button onClick={() => document.getElementById("decision")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-bone transition-colors hover:border-chartreuse/60 hover:text-chartreuse">See settlement path <ChevronRight size={15} /></button>
              <button onClick={() => setCreateOpen(true)} className="inline-flex items-center gap-2 rounded-md border border-chartreuse/40 px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-chartreuse transition-colors hover:bg-chartreuse/10">New agreement <ArrowUpRight size={15} /></button>
            </div>
          </div>
          <div className="absolute bottom-7 left-5 right-5 z-10 hidden max-w-[570px] items-center gap-0 border-y border-white/12 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-white/42 sm:flex lg:left-8"><span className="proof-step proof-step-active">Agreement</span><span className="proof-connector" /><span className="proof-step">Evidence</span><span className="proof-connector" /><span className="proof-step">Decision</span><span className="proof-connector" /><span className="proof-step">Settlement</span></div>
          <div className="pointer-events-none absolute inset-0 overflow-hidden lg:relative lg:inset-auto lg:h-[360px]">
            <img src={heroImage} alt="Abstract FlowBond evidence and settlement network" className="h-full w-full object-cover opacity-45" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8 lg:py-12"><div className="ledger-spine mb-10 grid grid-cols-2 gap-3 border-y border-white/10 py-4 sm:grid-cols-4"><div className="ledger-cell ledger-cell-active"><span>01</span><strong>Agreement</strong><small>promise locked</small></div><div className="ledger-cell"><span>02</span><strong>Evidence</strong><small>{agreement?.evidence_uri ? "evidence submitted" : "awaiting evidence"}</small></div><div className="ledger-cell"><span>03</span><strong>Decision</strong><small>validator-ready</small></div><div className="ledger-cell"><span>04</span><strong>Settlement</strong><small>{agreement?.settlement_status || "loading state"}</small></div></div><div className="grid gap-6 lg:grid-cols-[210px_1fr_320px]">
        <aside className="hidden border-r border-white/10 pr-6 lg:block">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">Live agreement</p>
          <div className="mt-8 space-y-6">
            {[{num:"01", label:"Agreement", active: activeTab === "agreement", action: () => setActiveTab("agreement")}, {num:"02", label:"Evidence", active: activeTab === "evidence", action: () => setActiveTab("evidence")}, {num:"03", label:"Decision", active: activeTab === "decision", action: () => setActiveTab("decision")}].map((item) => <button key={item.num} onClick={item.action} className={`flex w-full items-start gap-3 text-left transition-colors ${item.active ? "text-chartreuse" : "text-white/35 hover:text-white/70"}`}><span className="font-mono text-[10px]">{item.num}</span><span className="font-display text-sm font-bold">{item.label}</span></button>)}
          </div>
          <div className="mt-20 border-t border-white/10 pt-5"><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">Agreement reference</p><button onClick={copyAddress} className="mt-3 flex items-center gap-2 font-mono text-xs text-white/65 hover:text-chartreuse">{FLOWBOND_CONTRACT.slice(0, 6)}...{FLOWBOND_CONTRACT.slice(-4)} {copied ? <Check size={13} className="text-chartreuse" /> : <Copy size={13} />}</button></div>
        </aside>

        <div className="min-w-0">
          <div className="mb-6 flex items-end justify-between gap-4"><div><p className="font-mono text-[9px] uppercase tracking-[0.25em] text-chartreuse">01 / Agreement state</p><h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-bone sm:text-4xl">The promise, made legible.</h2></div><span className={`hidden rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.15em] sm:inline-flex ${agreement?.decision === "DISPUTED" ? "border-coral/40 bg-coral/10 text-coral" : "border-chartreuse/35 bg-chartreuse/10 text-chartreuse"}`}>{agreement?.decision || "LOADING"}</span></div>
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-ocean/70 p-5 shadow-2xl shadow-black/20 sm:p-7">
            <div className="absolute right-0 top-0 h-32 w-32 bg-[radial-gradient(circle,rgba(199,243,107,0.12),transparent_65%)]" />
            {activeTab === "agreement" && <div className="relative"><div className="grid gap-8 sm:grid-cols-[1fr_0.8fr]"><div><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-lg border border-chartreuse/30 bg-chartreuse/10 text-chartreuse"><LockKeyhole size={20} /></div><div><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">Service agreement</p><h3 className="mt-1 font-display text-xl font-bold">{agreement?.service_promise || "FlowBond agreement"}</h3></div></div><p className="mt-7 max-w-[470px] text-sm leading-6 text-white/60">“Deliver an {agreement?.service_promise || "FlowBond agreement"} with schema checks and reproducible integration tests. Payment continues while the agreed evidence remains green.”</p><div className="mt-7 flex flex-wrap gap-2"><span className="proof-chip"><GitBranch size={12} /> schema / v2.3</span><span className="proof-chip"><ShieldCheck size={12} /> evidence-led</span><span className="proof-chip"><Sparkles size={12} /> GenLayer ready</span></div></div><div className="space-y-5 border-t border-white/10 pt-5 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0"><div><p className="meta-label">Buyer agent</p><p className="mt-1 font-mono text-sm text-bone">{agreement?.buyer_agent || "—"}</p></div><div><p className="meta-label">Seller agent</p><p className="mt-1 font-mono text-sm text-bone">{agreement?.seller_agent || "—"}</p></div><div><p className="meta-label">Budget horizon</p><p className="mt-1 font-display text-2xl font-bold text-chartreuse">{agreement?.budget_cap || "—"} <span className="font-mono text-[10px] font-normal text-white/40">GEN / capped</span></p></div></div></div></div>}
            {activeTab === "evidence" && <div className="relative"><div className="grid gap-6 sm:grid-cols-[1fr_0.85fr]"><div><p className="meta-label">Submit evidence / on-chain</p><div className="mt-4 space-y-3"><div className="rounded-lg border border-white/10 bg-black/10 p-4"><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/35">Evidence URI</p><input value={evidenceUri} onChange={(event) => setEvidenceUri(event.target.value)} placeholder="https://example.com/evidence" className="mt-3 w-full rounded-md border border-white/10 bg-black/20 px-3 py-3 text-sm text-bone outline-none placeholder:text-white/25 focus:border-chartreuse/50" type="url" /></div><div className="rounded-lg border border-white/10 bg-black/10 p-4"><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/35">Evidence summary</p><textarea value={evidenceSummary} onChange={(event) => setEvidenceSummary(event.target.value)} placeholder="Describe the evidence and how it satisfies the agreement criteria..." className="mt-3 min-h-[120px] w-full resize-y rounded-md border border-white/10 bg-black/20 px-3 py-3 text-sm leading-6 text-bone outline-none placeholder:text-white/25 focus:border-chartreuse/50" /></div><button onClick={submitEvidence} disabled={actionBusy || !walletAddress} className="inline-flex items-center gap-2 rounded-md bg-chartreuse px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink disabled:cursor-not-allowed disabled:opacity-50"><FileCheck2 size={14} /> {walletAddress ? "Submit evidence on-chain" : "Connect wallet to submit"}</button><div className="rounded-lg border border-white/10 bg-black/10 p-4"><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/35">Current on-chain evidence</p><p className="mt-2 break-all text-sm text-bone">{agreement?.evidence_uri || "No evidence submitted yet."}</p>{agreement?.evidence_summary && <p className="mt-2 text-sm leading-6 text-white/55">{agreement.evidence_summary}</p>}</div><div className="rounded-lg border border-white/10 bg-black/10 p-4"><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/35">Criteria</p><p className="mt-2 text-sm leading-6 text-white/65">{agreement?.evidence_criteria || "—"}</p></div></div></div><div className="overflow-hidden rounded-lg border border-white/10 bg-ink"><img src={evidenceImage} alt="Abstract evidence review card" className="h-full min-h-[220px] w-full object-cover opacity-90" /></div></div></div>}
            {activeTab === "decision" && <div className="relative"><div className="grid gap-8 sm:grid-cols-[0.9fr_1.1fr]"><div><p className="meta-label">Decision / on-chain consensus</p><div className="mt-4 rounded-lg border border-white/10 bg-black/10 p-4"><p className="font-display text-2xl font-bold text-bone">{agreement?.decision || "—"}</p><p className="mt-2 text-sm leading-6 text-white/55">{agreement?.decision_reason || "—"}</p></div><div className="mt-4 rounded-lg border border-white/10 bg-black/10 p-4"><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/35">Dispute status</p><p className="mt-2 text-sm font-medium text-bone">{agreement?.dispute_status || "—"}</p>{agreement?.dispute_reason && <p className="mt-2 text-sm text-white/55">{agreement.dispute_reason}</p>}</div><div className="mt-5 rounded-lg border border-white/10 bg-black/10 p-4">
<p className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/35">Dispute reason / on-chain</p>
<textarea
  value={disputeReason}
  onChange={(event) => setDisputeReason(event.target.value)}
  placeholder="Explain why this agreement should be paused for dispute review..."
  className="mt-3 min-h-[100px] w-full resize-y rounded-md border border-white/10 bg-black/20 px-3 py-3 text-sm leading-6 text-bone outline-none placeholder:text-white/25 focus:border-chartreuse/50"
/>
<p className="mt-2 font-mono text-[9px] text-white/30">Minimum 10 characters. This text will be written to the contract.</p>
</div>
<div className="mt-5 flex flex-wrap gap-2">
<button disabled={actionBusy || !walletAddress} onClick={adjudicateEvidence} className="state-button"><ShieldCheck size={13} /> Adjudicate</button>
<button disabled={actionBusy || !walletAddress || disputeReason.trim().length < 10} onClick={pauseDispute} className="state-button"><Pause size={13} /> Pause dispute</button>
<button disabled={actionBusy || !walletAddress} onClick={closeDispute} className="state-button"><Play size={13} /> Close dispute</button>
</div></div><div className="flex min-h-[240px] items-center justify-center rounded-lg border border-white/10 bg-ink/80 p-4"><img src={horizonImage} alt="FlowBond settlement horizon" className="max-h-[240px] w-full object-cover opacity-90" /></div></div><div className="mt-8 border-t border-white/10 pt-5"><p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/45">GenLayer testnet boundary</p><p className="mt-2 text-sm leading-6 text-white/55">Decision and dispute actions are real GenLayer Studionet contract transactions. RELEASE_READY means ready for future settlement; this demo does not transfer funds to a seller.</p></div></div>}          <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-white/40"><span className="text-chartreuse">{agreement?.evidence_uri ? "1 evidence submission" : "0 evidence submissions"}</span> <span className="mx-2 text-white/15">•</span> live contract state</p><button onClick={() => setActiveTab(activeTab === "agreement" ? "evidence" : activeTab === "evidence" ? "decision" : "agreement")} className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/60 hover:text-chartreuse">Next view <ArrowUpRight size={14} /></button></div>
        </div>

        <aside className="space-y-4" id="decision">
          <div className="rounded-xl border border-chartreuse/25 bg-chartreuse/10 p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-chartreuse">Testnet payment rail</p>
            <p className="mt-3 text-sm leading-6 text-white/65">Connect an EVM wallet on GenLayer Studionet and send 0.001 test GEN to the deployed FlowBond agreement. This is testnet funding, not escrow or mainnet payment.</p>
            <button onClick={sendTestnetPayment} disabled={walletBusy} className="mt-4 inline-flex items-center gap-2 rounded-md bg-chartreuse px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink disabled:opacity-60"><WalletCards size={14} /> {walletAddress ? "Fund with 0.001 GEN" : "Connect GenLayer wallet"}</button>
            {testnetTx && <a className="mt-3 block truncate font-mono text-[9px] text-chartreuse underline" href={`https://explorer-studio.genlayer.com/tx/${testnetTx}`} target="_blank" rel="noreferrer">View GenLayer transaction</a>}
          </div>
          <div className="rounded-xl border border-white/10 bg-bone p-5 text-ink"><div className="flex items-center justify-between"><p className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink/55">Settlement horizon</p><span className="h-2 w-2 rounded-full bg-chartreuse shadow-[0_0_0_4px_rgba(199,243,107,0.18)]" /></div><div className="mt-7 flex items-end justify-between"><div><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/50">Locked budget</p><p className="mt-1 font-display text-4xl font-bold tracking-[-0.06em]">{agreement?.budget_cap || "—"}</p></div><p className="font-mono text-xs text-ink/50">GEN</p></div><div className="mt-6 rounded-md border border-ink/15 bg-ink/5 px-3 py-3">
  <div className="flex items-center justify-between gap-3">
    <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-ink/45">On-chain settlement state</span>
    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-ink">{agreement?.settlement_status || "UNKNOWN"}</span>
  </div>
</div><div className="mt-3 flex justify-between font-mono text-[9px] uppercase tracking-[0.15em] text-ink/45"><span>locked</span><span>{agreement?.settlement_status || "unknown"}</span></div><button onClick={() => setActiveTab("decision")} className="mt-7 flex w-full items-center justify-between border-t border-ink/15 pt-4 text-left font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink">Open decision path <ArrowUpRight size={15} /></button></div>
          <div className="rounded-xl border border-white/10 bg-ocean/80 p-5"><p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/40">Why FlowBond</p><h3 className="mt-3 font-display text-2xl font-bold leading-tight">Make the promise machine-checkable.</h3><p className="mt-3 text-sm leading-6 text-white/55">Agents can call APIs and move money. FlowBond gives them a shared language for proof, pause, and accountable settlement.</p><a href="#agreement" className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-chartreuse hover:underline">Read the agreement <ChevronRight size={14} /></a></div>
        </aside>
        </div>
        </div>
      </section>

      {createOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-ink/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="agreement-dialog-title"><div className="w-full max-w-2xl rounded-xl border border-white/15 bg-ocean p-5 shadow-2xl shadow-black/40 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[9px] uppercase tracking-[0.22em] text-chartreuse">Agreement builder</p><h2 id="agreement-dialog-title" className="mt-2 font-display text-2xl font-bold tracking-[-0.04em]">Make the promise machine-checkable.</h2><p className="mt-2 max-w-lg text-sm leading-6 text-white/55">Define the agreement first. FlowBond will use these fields to decide which evidence can move the settlement state.</p></div><button onClick={() => setCreateOpen(false)} className="rounded-md border border-white/10 p-2 text-white/55 hover:text-bone" aria-label="Close agreement builder"><X size={16} /></button></div><div className="mt-7 grid gap-4 sm:grid-cols-2"><label className="field-label sm:col-span-2">Service promise<input value={draft.promise} onChange={(event) => setDraft({ ...draft, promise: event.target.value })} placeholder="e.g. Deliver a tested API integration" /></label><label className="field-label">Buyer agent<input value={draft.buyer} onChange={(event) => setDraft({ ...draft, buyer: event.target.value })} placeholder="buyer_agent" /></label><label className="field-label">Seller agent<input value={draft.seller} onChange={(event) => setDraft({ ...draft, seller: event.target.value })} placeholder="seller_agent" /></label><label className="field-label">Budget cap<input value={draft.budget} onChange={(event) => setDraft({ ...draft, budget: event.target.value })} inputMode="decimal" placeholder="480" /></label><label className="field-label">Evidence criteria<input value={draft.criteria} onChange={(event) => setDraft({ ...draft, criteria: event.target.value })} placeholder="schema, tests, uptime" /></label></div><div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5"><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/35">GenLayer Studionet • GEN funding enabled</p><button onClick={createAgreement} className="inline-flex items-center gap-2 rounded-md bg-chartreuse px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink">Stage agreement <Check size={14} /></button></div></div></div>}

      <footer className="border-t border-white/10"><div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 py-7 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between lg:px-8"><p><span className="font-display font-bold text-bone">flowbond</span> / evidence-led settlement for autonomous work</p><p className="font-mono text-[9px] uppercase tracking-[0.18em]">GenLayer Studionet • Mainnet disabled</p></div></footer>
    </main>
  );
}
