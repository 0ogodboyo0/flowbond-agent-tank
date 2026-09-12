// FlowBond style reminder: Trust Ledger design; evidence before assertion, editorial hierarchy, split-rail composition, chartreuse verified states, coral disputes, and no fabricated live settlement.
import { useMemo, useState } from "react";
import { ArrowUpRight, Check, ChevronRight, CircleAlert, Clock3, Copy, FileCheck2, GitBranch, LockKeyhole, Menu, Pause, Play, ShieldCheck, Sparkles, WalletCards, X } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

const heroImage = "/manus-storage/flowbond-hero-reference_64581207.png";
const evidenceImage = "/manus-storage/flowbond-evidence-card_8cb65775.png";
const horizonImage = "/manus-storage/flowbond-settlement-horizon_f549f034.png";
const markImage = "/manus-storage/flowbond-mark_c4dfc9a2.png";
const FLOWBOND_CONTRACT = "0x1Ae16B9E32eeFd1b604E9836886884A16F4aAC11" as `0x${string}`;

type EvidenceStatus = "verified" | "pending" | "attention";

type Evidence = {
  title: string;
  detail: string;
  status: EvidenceStatus;
  icon: typeof FileCheck2;
};

const evidence: Evidence[] = [
  { title: "Schema compliance", detail: "OpenAPI response matches v2.3 contract", status: "verified", icon: FileCheck2 },
  { title: "Integration test", detail: "18 / 18 checks passed on the last run", status: "verified", icon: Check },
  { title: "Availability window", detail: "Uptime signal is still being collected", status: "pending", icon: Clock3 },
  { title: "Human review", detail: "Buyer requested a second look at edge cases", status: "attention", icon: CircleAlert },
];

const statusCopy = {
  locked: { label: "Funds locked", color: "chartreuse", description: "Agreement is active. Settlement follows evidence." },
  paused: { label: "Stream paused", color: "coral", description: "A dispute needs an accountable decision." },
  released: { label: "Ready to release", color: "chartreuse", description: "The evidence threshold has been met." },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<"agreement" | "evidence" | "decision">("agreement");
  const [streamState, setStreamState] = useState<keyof typeof statusCopy>("locked");
  const [mobileNav, setMobileNav] = useState(false);
  const [copied, setCopied] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletBusy, setWalletBusy] = useState(false);
  const [testnetTx, setTestnetTx] = useState<string | null>(null);
  const [draft, setDraft] = useState({ promise: "", buyer: "", seller: "", budget: "480", criteria: "Schema compliance, integration tests" });
  const current = statusCopy[streamState];

  const verifiedCount = useMemo(() => evidence.filter((item) => item.status === "verified").length, []);

  const copyAddress = () => {
    setCopied(true);
    toast.success("Agreement reference copied", { description: "0x7a2e...a91c is ready to share." });
    window.setTimeout(() => setCopied(false), 1800);
  };

  const createAgreement = () => {
    setStreamState("locked");
    setActiveTab("agreement");
    setCreateOpen(false);
    toast.success("Agreement staged", { description: "Connect a GenLayer wallet to fund this agreement with test GEN." });
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("Wallet not detected", { description: "Open FlowBond in MetaMask or another EVM wallet browser." });
      return;
    }
    setWalletBusy(true);
    try {
      const accounts = (await window.ethereum.request({ method: "eth_requestAccounts" })) as string[];
      const address = accounts[0] as `0x${string}`;
      const client = createClient({ chain: studionet, account: address, provider: window.ethereum });
      await client.connect("studionet");
      setWalletAddress(accounts[0] ?? null);
      toast.success("Wallet connected", { description: "GenLayer Studionet selected (Chain ID 61999)." });
    } catch (error) {
      toast.error("Wallet connection cancelled", { description: error instanceof Error ? error.message : "No wallet account was selected." });
    } finally {
      setWalletBusy(false);
    }
  };

  const sendTestnetPayment = async () => {
    if (!walletAddress) return connectWallet();
    setWalletBusy(true);
    try {
      const client = createClient({ chain: studionet, account: walletAddress as `0x${string}`, provider: window.ethereum });
      await client.connect("studionet");
      const write = { address: FLOWBOND_CONTRACT, functionName: "fund_agreement", args: [], value: BigInt("1000000000000000") };
      const hash = await client.writeContract(write);
      setTestnetTx(String(hash));
      toast.success("GEN testnet funding submitted", { description: "The transaction is being processed by GenLayer consensus." });
    } catch (error) {
      toast.error("Testnet payment failed", { description: error instanceof Error ? error.message : "The wallet rejected the transaction." });
    } finally {
      setWalletBusy(false);
    }
  };

  const changeState = (next: keyof typeof statusCopy) => {
    setStreamState(next);
    toast(next === "paused" ? "Stream paused" : next === "released" ? "Release preview ready" : "Agreement active", {
      description: next === "paused" ? "The dispute path is now visible to both parties." : "This is a prototype state transition; no funds move here.",
    });
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

      <section className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8 lg:py-12"><div className="ledger-spine mb-10 grid grid-cols-2 gap-3 border-y border-white/10 py-4 sm:grid-cols-4"><div className="ledger-cell ledger-cell-active"><span>01</span><strong>Agreement</strong><small>promise locked</small></div><div className="ledger-cell"><span>02</span><strong>Evidence</strong><small>{verifiedCount} signals verified</small></div><div className="ledger-cell"><span>03</span><strong>Decision</strong><small>validator-ready</small></div><div className="ledger-cell"><span>04</span><strong>Settlement</strong><small>state preview</small></div></div><div className="grid gap-6 lg:grid-cols-[210px_1fr_320px]">
        <aside className="hidden border-r border-white/10 pr-6 lg:block">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">Live agreement</p>
          <div className="mt-8 space-y-6">
            {[{num:"01", label:"Agreement", active: activeTab === "agreement", action: () => setActiveTab("agreement")}, {num:"02", label:"Evidence", active: activeTab === "evidence", action: () => setActiveTab("evidence")}, {num:"03", label:"Decision", active: activeTab === "decision", action: () => setActiveTab("decision")}].map((item) => <button key={item.num} onClick={item.action} className={`flex w-full items-start gap-3 text-left transition-colors ${item.active ? "text-chartreuse" : "text-white/35 hover:text-white/70"}`}><span className="font-mono text-[10px]">{item.num}</span><span className="font-display text-sm font-bold">{item.label}</span></button>)}
          </div>
          <div className="mt-20 border-t border-white/10 pt-5"><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">Agreement reference</p><button onClick={copyAddress} className="mt-3 flex items-center gap-2 font-mono text-xs text-white/65 hover:text-chartreuse">0x7a2e...a91c {copied ? <Check size={13} className="text-chartreuse" /> : <Copy size={13} />}</button></div>
        </aside>

        <div className="min-w-0">
          <div className="mb-6 flex items-end justify-between gap-4"><div><p className="font-mono text-[9px] uppercase tracking-[0.25em] text-chartreuse">01 / Agreement state</p><h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-bone sm:text-4xl">The promise, made legible.</h2></div><span className={`hidden rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.15em] sm:inline-flex ${streamState === "paused" ? "border-coral/40 bg-coral/10 text-coral" : "border-chartreuse/35 bg-chartreuse/10 text-chartreuse"}`}>{current.label}</span></div>
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-ocean/70 p-5 shadow-2xl shadow-black/20 sm:p-7">
            <div className="absolute right-0 top-0 h-32 w-32 bg-[radial-gradient(circle,rgba(199,243,107,0.12),transparent_65%)]" />
            {activeTab === "agreement" && <div className="relative"><div className="grid gap-8 sm:grid-cols-[1fr_0.8fr]"><div><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-lg border border-chartreuse/30 bg-chartreuse/10 text-chartreuse"><LockKeyhole size={20} /></div><div><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">Service agreement</p><h3 className="mt-1 font-display text-xl font-bold">API reliability audit</h3></div></div><p className="mt-7 max-w-[470px] text-sm leading-6 text-white/60">“Deliver an API reliability audit with schema checks and reproducible integration tests. Payment continues while the agreed evidence remains green.”</p><div className="mt-7 flex flex-wrap gap-2"><span className="proof-chip"><GitBranch size={12} /> schema / v2.3</span><span className="proof-chip"><ShieldCheck size={12} /> evidence-led</span><span className="proof-chip"><Sparkles size={12} /> GenLayer ready</span></div></div><div className="space-y-5 border-t border-white/10 pt-5 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0"><div><p className="meta-label">Buyer agent</p><p className="mt-1 font-mono text-sm text-bone">atlas_researcher</p></div><div><p className="meta-label">Seller agent</p><p className="mt-1 font-mono text-sm text-bone">relay_ops_04</p></div><div><p className="meta-label">Budget horizon</p><p className="mt-1 font-display text-2xl font-bold text-chartreuse">$480 <span className="font-mono text-[10px] font-normal text-white/40">USDC / capped</span></p></div></div></div></div>}
            {activeTab === "evidence" && <div className="relative"><div className="grid gap-6 sm:grid-cols-[1fr_0.85fr]"><div><p className="meta-label">Collected evidence / 04 signals</p><div className="mt-4 space-y-2">{evidence.map((item) => { const Icon = item.icon; return <div key={item.title} className="flex items-center gap-3 rounded-lg border border-white/8 bg-black/10 px-3 py-3"><div className={`grid h-8 w-8 place-items-center rounded-md ${item.status === "verified" ? "bg-chartreuse/10 text-chartreuse" : item.status === "attention" ? "bg-coral/10 text-coral" : "bg-white/8 text-white/45"}`}><Icon size={15} /></div><div className="min-w-0 flex-1"><p className="text-sm font-medium text-bone">{item.title}</p><p className="mt-0.5 truncate text-xs text-white/45">{item.detail}</p></div><span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/35">{item.status}</span></div>})}</div></div><div className="overflow-hidden rounded-lg border border-white/10 bg-ink"><img src={evidenceImage} alt="Abstract evidence review card" className="h-full min-h-[220px] w-full object-cover opacity-90" /></div></div></div>}
            {activeTab === "decision" && <div className="relative"><div className="grid gap-8 sm:grid-cols-[0.9fr_1.1fr]"><div><p className="meta-label">Decision preview</p><div className={`mt-4 flex items-center gap-3 rounded-lg border p-4 ${streamState === "paused" ? "border-coral/35 bg-coral/10" : "border-chartreuse/35 bg-chartreuse/10"}`}><div className={`grid h-11 w-11 place-items-center rounded-full ${streamState === "paused" ? "bg-coral text-ink" : "bg-chartreuse text-ink"}`}>{streamState === "paused" ? <Pause size={18} /> : <Check size={18} />}</div><div><p className="font-display text-xl font-bold">{current.label}</p><p className="mt-1 text-xs text-white/55">{current.description}</p></div></div><div className="mt-6 flex flex-wrap gap-2"><button onClick={() => changeState("locked")} className="state-button"><LockKeyhole size={13} /> Lock</button><button onClick={() => changeState("paused")} className="state-button"><Pause size={13} /> Pause</button><button onClick={() => changeState("released")} className="state-button"><Play size={13} /> Release preview</button></div></div><div className="flex min-h-[240px] items-center justify-center rounded-lg border border-white/10 bg-ink/80 p-4"><img src={horizonImage} alt="FlowBond settlement horizon" className="max-h-[240px] w-full object-cover opacity-90" /></div></div><div className="mt-8 border-t border-white/10 pt-5"><p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/45">GenLayer testnet boundary</p><p className="mt-2 text-sm leading-6 text-white/55">Wallet connection and GEN funding use GenLayer Studionet. Mainnet, escrow release, and production settlement remain disabled.</p></div></div>}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-white/40"><span className="text-chartreuse">{verifiedCount} verified</span> / {evidence.length} evidence signals <span className="mx-2 text-white/15">•</span> updated 4 min ago</p><button onClick={() => setActiveTab(activeTab === "agreement" ? "evidence" : activeTab === "evidence" ? "decision" : "agreement")} className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/60 hover:text-chartreuse">Next view <ArrowUpRight size={14} /></button></div>
        </div>

        <aside className="space-y-4" id="decision">
          <div className="rounded-xl border border-chartreuse/25 bg-chartreuse/10 p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-chartreuse">Testnet payment rail</p>
            <p className="mt-3 text-sm leading-6 text-white/65">Connect an EVM wallet on GenLayer Studionet and send 0.001 test GEN to the deployed FlowBond agreement. This is testnet funding, not escrow or mainnet payment.</p>
            <button onClick={sendTestnetPayment} disabled={walletBusy} className="mt-4 inline-flex items-center gap-2 rounded-md bg-chartreuse px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink disabled:opacity-60"><WalletCards size={14} /> {walletAddress ? "Fund with 0.001 GEN" : "Connect GenLayer wallet"}</button>
            {testnetTx && <a className="mt-3 block truncate font-mono text-[9px] text-chartreuse underline" href={`https://explorer-studio.genlayer.com/tx/${testnetTx}`} target="_blank" rel="noreferrer">View GenLayer transaction</a>}
          </div>
          <div className="rounded-xl border border-white/10 bg-bone p-5 text-ink"><div className="flex items-center justify-between"><p className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink/55">Settlement horizon</p><span className="h-2 w-2 rounded-full bg-chartreuse shadow-[0_0_0_4px_rgba(199,243,107,0.18)]" /></div><div className="mt-7 flex items-end justify-between"><div><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/50">Locked budget</p><p className="mt-1 font-display text-4xl font-bold tracking-[-0.06em]">$480</p></div><p className="font-mono text-xs text-ink/50">USDC</p></div><div className="mt-6 h-2 overflow-hidden rounded-full bg-ink/10"><div className={`h-full rounded-full bg-ink transition-all duration-500 ${streamState === "paused" ? "w-[42%]" : streamState === "released" ? "w-full" : "w-[68%]"}`} /></div><div className="mt-3 flex justify-between font-mono text-[9px] uppercase tracking-[0.15em] text-ink/45"><span>locked</span><span>{streamState === "paused" ? "paused" : streamState === "released" ? "released" : "evidence"}</span></div><button onClick={() => setActiveTab("decision")} className="mt-7 flex w-full items-center justify-between border-t border-ink/15 pt-4 text-left font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink">Open decision path <ArrowUpRight size={15} /></button></div>
          <div className="rounded-xl border border-white/10 bg-ocean/80 p-5"><p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/40">Why FlowBond</p><h3 className="mt-3 font-display text-2xl font-bold leading-tight">Make the promise machine-checkable.</h3><p className="mt-3 text-sm leading-6 text-white/55">Agents can call APIs and move money. FlowBond gives them a shared language for proof, pause, and accountable settlement.</p><a href="#agreement" className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-chartreuse hover:underline">Read the agreement <ChevronRight size={14} /></a></div>
        </aside>
        </div>
      </section>

      {createOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-ink/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="agreement-dialog-title"><div className="w-full max-w-2xl rounded-xl border border-white/15 bg-ocean p-5 shadow-2xl shadow-black/40 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[9px] uppercase tracking-[0.22em] text-chartreuse">Agreement builder</p><h2 id="agreement-dialog-title" className="mt-2 font-display text-2xl font-bold tracking-[-0.04em]">Make the promise machine-checkable.</h2><p className="mt-2 max-w-lg text-sm leading-6 text-white/55">Define the agreement first. FlowBond will use these fields to decide which evidence can move the settlement state.</p></div><button onClick={() => setCreateOpen(false)} className="rounded-md border border-white/10 p-2 text-white/55 hover:text-bone" aria-label="Close agreement builder"><X size={16} /></button></div><div className="mt-7 grid gap-4 sm:grid-cols-2"><label className="field-label sm:col-span-2">Service promise<input value={draft.promise} onChange={(event) => setDraft({ ...draft, promise: event.target.value })} placeholder="e.g. Deliver a tested API integration" /></label><label className="field-label">Buyer agent<input value={draft.buyer} onChange={(event) => setDraft({ ...draft, buyer: event.target.value })} placeholder="buyer_agent" /></label><label className="field-label">Seller agent<input value={draft.seller} onChange={(event) => setDraft({ ...draft, seller: event.target.value })} placeholder="seller_agent" /></label><label className="field-label">Budget cap<input value={draft.budget} onChange={(event) => setDraft({ ...draft, budget: event.target.value })} inputMode="decimal" placeholder="480" /></label><label className="field-label">Evidence criteria<input value={draft.criteria} onChange={(event) => setDraft({ ...draft, criteria: event.target.value })} placeholder="schema, tests, uptime" /></label></div><div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5"><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/35">GenLayer Studionet • GEN funding enabled</p><button onClick={createAgreement} className="inline-flex items-center gap-2 rounded-md bg-chartreuse px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink">Stage agreement <Check size={14} /></button></div></div></div>}

      <footer className="border-t border-white/10"><div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 py-7 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between lg:px-8"><p><span className="font-display font-bold text-bone">flowbond</span> / evidence-led settlement for autonomous work</p><p className="font-mono text-[9px] uppercase tracking-[0.18em]">GenLayer Studionet • Mainnet disabled</p></div></footer>
    </main>
  );
}
