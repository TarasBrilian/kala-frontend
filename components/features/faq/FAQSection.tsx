"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "../../../lib/utils";

interface FAQItem {
    question: string;
    answer: string;
}

const FAQS: FAQItem[] = [
    {
        question: "What is KALA Money?",
        answer: "KALA Money is a programmable stable coin designed to preserve real purchasing power rather than track a fiat currency. Its value dynamically adjusts based on economic fundamentals instead of remaining fixed to USD."
    },
    {
        question: "What does “non-fiat pegged” mean in KALA?",
        answer: "Non-fiat pegged means KALA does not attempt to maintain a constant $1 price. Instead, its price reflects changes in purchasing power, hard asset value."
    },
    {
        question: "What problem does KALA Money solve?",
        answer: "Traditional stablecoins inherit inflation risk and dependency on national monetary policy. KALA removes this dependency by dynamically adjusting its USD value to preserve long-term economic value."
    },
    {
        question: "How does KALA maintain stability without a fiat peg?",
        answer: "KALA uses an oracle-based index that tracks purchasing power, gold, silver, and Ethereum gas costs. Its price adjusts automatically based on changes in these components."
    },
    {
        question: "How do users mint KALA?",
        answer: "Users stake ETH into the protocol. The ETH is placed into a buffer fund and delegated to validators, allowing users to mint KALA as long as they satisfy the required collateral ratio."
    },
    {
        question: "Is there interest cost when minting KALA?",
        answer: "No. KALA uses a 0% interest model. All operational costs and risk coverage are funded by ETH staking rewards."
    },
    {
        question: "What is the Kala Save Buffer?",
        answer: "The Kala Save Buffer is a collective reserve funded entirely by staking yields. It acts as slashing insurance, protocol solvency support, and a dynamic risk absorber."
    },
    {
        question: "How does the Dynamic Collateral Ratio work?",
        answer: "The target collateral ratio adjusts automatically based on buffer solvency, market volatility, and ETH liquidity conditions, improving capital efficiency without sacrificing security."
    },
    {
        question: "How is the KALA price calculated on-chain?",
        answer: "KALA uses an cre (Chainlink Runtime Environment) to execute complex, off-chain computations securely. This infrastructure aggregates real-time data from multiple decentralized oracles spanning purchasing power indices, commodities, and network costs before verifying it on-chain. By leveraging CRE, KALA ensures that its purchasing power peg remains tamper-proof, transparent, and responsive to global economic shifts without burdening the Ethereum mainnet with excessive gas costs."
    },
    {
        question: "What are the main risks of using KALA Money?",
        answer: "Risks include oracle failures, extreme validator slashing events, liquidity delays during exits, and broader Ethereum network risks."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="w-full max-w-2xl mx-auto mt-10 mb-24 px-4">
            <h2 className="text-2xl font-semibold text-start text-zinc-100 mb-12 tracking-tight">
                FAQ
            </h2>

            <div className="space-y-4 ">
                {FAQS.map((faq, index) => {
                    const isOpen = openIndex === index;

                    return (
                        <div
                            key={index}
                            className={cn(
                                "border-b border-white/5 transition-colors duration-500",
                                isOpen ? "border-white/20" : "hover:border-white/10"
                            )}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full text-left py-4 flex items-center justify-between group focus:outline-none cursor-pointer"
                                aria-expanded={isOpen}
                                aria-controls={`faq-answer-${index}`}
                            >
                                <span className={cn(
                                    "text-base md:text-lg font-medium transition-colors duration-500",
                                    isOpen ? "text-[#cc7a0e]" : "text-zinc-200 group-hover:text-zinc-100"
                                )}>
                                    {faq.question}
                                </span>
                                <div className={cn(
                                    "ml-4 p-1.5 rounded-full transition-all duration-500 flex items-center justify-center shrink-0",
                                    isOpen ? "bg-[#cc7a0e]/20 text-[#cc7a0e]" : "bg-white/5 text-zinc-500 group-hover:bg-white/10 group-hover:text-zinc-300"
                                )}>
                                    {isOpen ? (
                                        <Minus className="w-4 h-4" />
                                    ) : (
                                        <Plus className="w-4 h-4" />
                                    )}
                                </div>
                            </button>

                            <div
                                id={`faq-answer-${index}`}
                                className={cn(
                                    "overflow-hidden transition-all duration-500 ease-in-out",
                                    isOpen ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0 pb-0"
                                )}
                            >
                                <p className="text-zinc-400 text-sm md:text-base leading-relaxed pr-8">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
