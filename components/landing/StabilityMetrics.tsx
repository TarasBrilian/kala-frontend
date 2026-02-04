"use client";

import React from "react";
import { Activity, Shield, TrendingUp } from "lucide-react";

export default function StabilityMetrics() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mx-auto">
            <MetricCard
                label="System Health"
                value="98.5%"
                subValue="Excellent"
                icon={<Activity className="w-4 h-4 text-primary" />}
                color="primary"
            />
            <MetricCard
                label="Collateral Ratio"
                value="164%"
                subValue="Min 140%"
                icon={<Shield className="w-4 h-4 text-primary" />}
                color="primary"
            />
            <MetricCard
                label="Save Buffer"
                value="$4.2M"
                subValue="+12% MoM"
                icon={<TrendingUp className="w-4 h-4 text-primary" />}
                color="primary"
            />
            <MetricCard
                label="CRE Update"
                value="12s ago"
                subValue="Block 182934"
                icon={<Activity className="w-4 h-4 text-primary" />}
                color="primary"
            />
        </div>
    );
}

function MetricCard({ label, value, subValue, icon, color }: any) {
    const colorClasses: any = {
        emerald: "text-emerald-500 border-emerald-500/20 bg-emerald-500/5",
        primary: "text-[var(--primary)] border-[var(--primary)]/20 bg-[var(--primary)]/5",
        blue: "text-blue-500 border-blue-500/20 bg-blue-500/5",
        zinc: "text-zinc-500 border-zinc-500/20 bg-zinc-500/5",
    };

    return (
        <div className={`flex flex-col p-4 rounded-xl border backdrop-blur-sm ${colorClasses[color] || colorClasses.zinc} border-opacity-30`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wider opacity-70">{label}</span>
                {icon}
            </div>
            <div className="text-xl font-bold font-mono tracking-tight text-white/90">{value}</div>
            <div className="text-xs opacity-60 font-mono mt-1">{subValue}</div>
        </div>
    )
}
