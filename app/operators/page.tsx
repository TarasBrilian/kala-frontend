"use client";

import { CheckCircle2, ShieldCheck, Activity, Database, Server, Calculator, Link as LinkIcon, Network } from "lucide-react";
import Link from "next/link";

export default function OperatorsPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-start font-sans py-20 gap-16 px-4 md:px-8 max-w-7xl mx-auto">

            <section className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-4xl md:text-5xl font-bold text-zinc-100">
                    Operators & <span className="text-[#cc7a0e]">CRE</span>
                </h1>
                <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
                    KALA leverages the Chainlink Runtime Environment (CRE) to orchestrate secure,
                    verifiable, and decentralized workflows that power our operational logic.
                </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-backwards delay-100">
                <Card
                    icon={<Database className="w-6 h-6 text-[#cc7a0e]" />}
                    title="Unified Orchestration"
                    description="CRE combines on-chain and off-chain operations into a single workflow, allowing KALA to fetch real-world asset data and compute risk metrics seamlessly."
                />
                <Card
                    icon={<ShieldCheck className="w-6 h-6 text-[#cc7a0e]" />}
                    title="Institutional Security"
                    description="Every operation runs across a Decentralized Oracle Network (DON) with Byzantine Fault Tolerant consensus, eliminating single points of failure."
                />
                <Card
                    icon={<Network className="w-6 h-6 text-[#cc7a0e]" />}
                    title="Verifiable Execution"
                    description="Workflows are cryptographically signed and verified. KALA smart contracts only accept inputs that have achieved consensus from the network."
                />
            </div>

            <section className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-backwards delay-200">
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px bg-zinc-800 flex-1" />
                    <h2 className="text-2xl font-bold text-zinc-200">System Architecture</h2>
                    <div className="h-px bg-zinc-800 flex-1" />
                </div>

                <div className="glass-card rounded-3xl p-8 border border-white/5 shadow-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Data Flow */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-[#cc7a0e]" />
                                Data Workflow
                            </h3>
                            <div className="space-y-4">
                                <Step number="1" title="Data Sourcing">
                                    <p className="text-sm text-zinc-400">
                                        The workflow fetches real-time data from multiple authenticated APIs:
                                    </p>
                                    <ul className="grid grid-cols-2 gap-2 mt-2">
                                        <Badge>Gold API</Badge>
                                        <Badge>Silver API</Badge>
                                        <Badge>PPP API</Badge>
                                        <Badge>Gas API</Badge>
                                    </ul>
                                </Step>
                                <Step number="2" title="Consensus Computation">
                                    <p className="text-sm text-zinc-400">
                                        Independent nodes execute the logic and reach consensus.
                                        KALA calculates a weighted index based on Purchasing Power Parity (PPP), Commodity Prices, and Gas costs.
                                    </p>
                                </Step>
                                <Step number="3" title="On-Chain Settlement">
                                    <p className="text-sm text-zinc-400">
                                        The aggregated, verified result is encoded and submitted to the <span className="font-mono text-zinc-300">KalaOracle</span> smart contract on Ethereum Sepolia.
                                    </p>
                                </Step>
                            </div>
                        </div>

                        <div className="bg-black/40 rounded-2xl p-6 border border-white/10 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-4 text-zinc-300 font-medium">
                                <Calculator className="w-5 h-5" />
                                <span>Index Calculation Logic</span>
                            </div>
                            <div className="font-mono text-sm md:text-base text-zinc-400 space-y-4 bg-black/20 p-4 rounded-xl border border-white/5">
                                <p className="text-zinc-500">// Weighted Basket Formula</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>PPP Contribution</span>
                                        <span className="text-[#cc7a0e]">40%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Gold Contribution</span>
                                        <span className="text-[#cc7a0e]">20%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Silver Contribution</span>
                                        <span className="text-[#cc7a0e]">20%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Gas Contribution</span>
                                        <span className="text-[#cc7a0e]">20%</span>
                                    </div>
                                </div>
                                <div className="h-px bg-zinc-700 my-2" />
                                <p className="text-xs text-zinc-500 leading-relaxed">
                                    Computed relative to baseline values (T0, G0, S0, B0) established at protocol inception.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Operator Responsibilities */}
            <section className="w-full max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-backwards delay-300">
                <h2 className="text-2xl font-bold text-zinc-200 text-center">Operator Responsibilities</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                            <h3 className="font-bold text-zinc-100">Operators MUST</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-zinc-400">
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
                                Maintain high-availability nodes to ensure workflow execution.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
                                Monitor API connectivity for Gold, Silver, and PPP data sources.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
                                Ensure sufficient ETH balance for on-chain report submission gas fees.
                            </li>
                        </ul>
                    </div>

                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <Server className="w-6 h-6 text-[#cc7a0e]" />
                            <h3 className="font-bold text-zinc-100">Operators CANNOT</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-zinc-400">
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
                                Unilaterally alter the index calculation formula or weights.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
                                Manipulate price data without consensus rejection by the DON.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
                                Access user wallet private keys or funds directly.
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Footer / Links */}
            <div className="flex gap-6 pt-8 pb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-backwards delay-500">
                <Link
                    href="https://docs.chain.link/cre"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-zinc-500 hover:text-[#cc7a0e] transition-colors text-sm font-medium"
                >
                    <LinkIcon className="w-4 h-4" />
                    CRE Documentation
                </Link>
                <Link
                    href="https://github.com/kala-money/cre"
                    target="_blank"
                    className="flex items-center gap-2 text-zinc-500 hover:text-[#cc7a0e] transition-colors text-sm font-medium"
                >
                    <LinkIcon className="w-4 h-4" />
                    Run your own node
                </Link>
            </div>

        </div>
    );
}

function Card({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-[#cc7a0e]/30 transition-colors group">
            <div className="mb-4 p-3 bg-zinc-900/50 rounded-xl w-fit group-hover:bg-[#cc7a0e]/10 transition-colors">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-zinc-100 mb-2">{title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
                {description}
            </p>
        </div>
    );
}

function Step({ number, title, children }: { number: string, title: string, children: React.ReactNode }) {
    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#cc7a0e]/10 border border-[#cc7a0e]/20 flex items-center justify-center text-[#cc7a0e] font-bold text-xs shrink-0">
                    {number}
                </div>
                {number !== "3" && <div className="w-px h-full bg-zinc-800 my-2" />}
            </div>
            <div className="pb-6">
                <h4 className="text-base font-medium text-zinc-200 mb-1">{title}</h4>
                {children}
            </div>
        </div>
    );
}

function Badge({ children }: { children: React.ReactNode }) {
    return (
        <li className="bg-zinc-900/80 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-zinc-300 font-mono text-center">
            {children}
        </li>
    );
}
