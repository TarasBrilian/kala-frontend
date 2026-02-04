"use client";

import React from "react";
import { motion } from "framer-motion";

const TICKER_ITEMS = [
    { label: "KALA Target", value: "$3.45 PPP", change: "+0.02%", positive: true },
    { label: "ETH / USD", value: "$2,850.20", change: "-1.2%", positive: false },
    { label: "Gold (Oz)", value: "$2,340.50", change: "+0.5%", positive: true },
    { label: "Silver (Oz)", value: "$28.10", change: "+0.1%", positive: true },
    { label: "Global CPI", value: "3.2%", change: "stable", positive: true },
];

export default function EconomicTicker() {
    return (
        <div className="w-full bg-black/40 border-y border-white/10 backdrop-blur-md overflow-hidden flex items-center h-12">
            <div className="flex w-full relative">
                <motion.div
                    className="flex gap-12 px-4 min-w-max"
                    animate={{ x: "-50%" }}
                    transition={{
                        repeat: Infinity,
                        duration: 30,
                        ease: "linear",
                    }}
                >
                    {/* Duplicate list for seamless loop */}
                    {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                                {item.label}
                            </span>
                            <span className="text-sm font-semibold text-zinc-100">
                                {item.value}
                            </span>
                            <span
                                className={`text-xs ${item.positive ? "text-emerald-400" : "text-rose-400"
                                    }`}
                            >
                                {item.change}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
