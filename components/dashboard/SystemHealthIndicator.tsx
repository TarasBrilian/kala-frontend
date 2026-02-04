"use client";

export default function SystemHealthIndicator() {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-help group relative">
            <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-xs font-medium text-zinc-300">System Healthy</span>

            {/* Tooltip */}
            <div className="absolute top-full mt-2 right-0 w-48 p-3 glass-card rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <p className="text-[10px] text-zinc-400 mb-1">Current Status</p>
                <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-zinc-300">Collateralization</span>
                    <span className="text-emerald-400">164%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-300">Oracle Sync</span>
                    <span className="text-emerald-400">Online</span>
                </div>
            </div>
        </div>
    );
}
