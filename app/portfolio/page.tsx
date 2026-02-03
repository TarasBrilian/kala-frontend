"use client";

import { GlassCard } from "@/components/features/ui/GlassCard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/features/ui/Tooltip";
import { HelpCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAccount, useBalance } from "wagmi";
import { formatEther, formatUnits } from "viem";
import { useUserPosition } from "@/hooks/useUserPosition";
import { useKalaBalance } from "@/hooks/useKalaBalance";
import { useHealthRate } from "@/hooks/useHealthRate";
import { usePriceFeed } from "@/hooks/usePriceFeed";
import type { HealthStatus } from "@/lib/types";

/**
 * Get color class for health status.
 */
function getHealthColor(status: HealthStatus): string {
    switch (status) {
        case "safe":
            return "text-green-500";
        case "warning":
            return "text-[#cc7a0e]";
        case "danger":
            return "text-red-500";
        default:
            return "text-zinc-500";
    }
}

/**
 * Format bigint to display string with specified decimals.
 */
function formatAmount(value: bigint | undefined, decimals: number = 18, precision: number = 4): string {
    if (value === undefined) return "—";
    const formatted = formatUnits(value, decimals);
    const num = parseFloat(formatted);
    if (num === 0) return "0";
    return num.toFixed(precision).replace(/\.?0+$/, "");
}

export default function PortfolioPage() {
    const router = useRouter();
    const { address, isConnected } = useAccount();

    // Fetch ETH balance
    const { data: ethBalance } = useBalance({ address });

    // Fetch on-chain position data
    const { position, isLoading: positionLoading, error: positionError } = useUserPosition();
    const { balance: kalaBalance, formatted: kalaFormatted, isLoading: kalaLoading } = useKalaBalance();
    const { healthRate, status: healthStatus, isLoading: healthLoading } = useHealthRate();
    const { prices } = usePriceFeed();

    const isLoading = positionLoading || kalaLoading || healthLoading;

    // Calculate USD values if prices available
    const ethUsd = prices ? Number(formatUnits(prices.ethUsdPrice, 18)) : null;
    const kalaUsd = prices ? Number(formatUnits(prices.kalaUsdPrice, 18)) : null;

    // Determine repay status for current position
    const hasDebt = position && position.debt > 0n;
    const hasCollateral = position && position.collateralETH > 0n;
    const hasWithdrawable = position && position.withdrawableETH > 0n;

    // Status badge for position
    const getStatusBadge = () => {
        if (!position) return null;
        if (position.debt > 0n) {
            return { text: "Debt Outstanding", color: "bg-red-500/10 text-red-400 border-red-500/20" };
        }
        if (position.withdrawableETH > 0n) {
            return { text: "Claimable", color: "bg-green-500/10 text-green-400 border-green-500/20" };
        }
        if (position.collateralETH > 0n) {
            return { text: "Active", color: "bg-[#cc7a0e]/10 text-[#cc7a0e] border-[#cc7a0e]/20" };
        }
        return { text: "No Position", color: "bg-zinc-800 text-zinc-300 border-white/10" };
    };

    const statusBadge = getStatusBadge();

    return (
        <main className="min-h-screen px-4 md:px-10 py-8 max-w-7xl mx-auto space-y-8">
            {/* Not connected warning */}
            {!isConnected && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <p className="text-yellow-200 text-sm">Connect your wallet to view your position</p>
                </div>
            )}

            {/* Error state */}
            {positionError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-200 text-sm">Failed to load position data</p>
                </div>
            )}

            <GlassCard className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row justify-between gap-10">
                    <div className="flex-1 space-y-8">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-zinc-100">My Position</h2>
                            {isLoading && (
                                <div className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                            <div className="space-y-2">
                                <p className="text-zinc-400 text-sm font-medium">Wallet Balance</p>
                                <p className="text-3xl font-bold text-white font-mono">
                                    {ethBalance ? `${parseFloat(ethBalance.formatted).toFixed(4)} ETH` : "—"}
                                </p>
                                {ethUsd && ethBalance && (
                                    <p className="text-zinc-500 text-sm font-mono">
                                        ≈ ${(parseFloat(ethBalance.formatted) * ethUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 relative">
                                <div className="absolute -left-6 top-0 bottom-0 w-px bg-white/10 hidden md:block"></div>
                                <p className="text-zinc-400 text-sm font-medium">KALA Balance</p>
                                <p className="text-3xl font-bold text-white font-mono">
                                    {isConnected ? `${formatAmount(kalaBalance)} KALA` : "—"}
                                </p>
                                {kalaUsd && kalaBalance > 0n && (
                                    <p className="text-zinc-500 text-sm font-mono">
                                        ≈ ${(parseFloat(kalaFormatted) * kalaUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 relative">
                                <div className="absolute -left-6 top-0 bottom-0 w-px bg-white/10 hidden md:block"></div>
                                <div className="flex items-center gap-2">
                                    <p className="text-zinc-400 text-sm font-medium">Heart Rate</p>
                                    <TooltipProvider delayDuration={200}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <HelpCircle className="w-4 h-4 text-zinc-500 cursor-help hover:text-zinc-300 transition-colors" />
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-[200px] break-words">
                                                <p>Heart Rate indicates the health of your collateral against KALA minting range between 1-5 Higher is better.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <p className={`text-3xl font-bold font-mono ${getHealthColor(healthStatus)}`}>
                                    {healthRate !== null ? healthRate : "—"}
                                </p>
                                <p className="text-zinc-500 text-sm capitalize">{healthStatus}</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-80 flex flex-col justify-center space-y-4 pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-10">
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-zinc-400 text-sm font-medium">Collateral Locked</span>
                            <span className="text-white font-mono font-bold">
                                {formatAmount(position?.collateralETH)} ETH
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-zinc-400 text-sm font-medium">Current Debt</span>
                            <span className={`font-mono font-bold ${hasDebt ? "text-red-400" : "text-white"}`}>
                                {formatAmount(position?.debt)} KALA
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-zinc-400 text-sm font-medium">Withdrawable ETH</span>
                            <span className={`font-mono font-bold ${hasWithdrawable ? "text-green-400" : "text-white"}`}>
                                {formatAmount(position?.withdrawableETH)} ETH
                            </span>
                        </div>
                    </div>
                </div>
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-zinc-200">Current Position</h3>
                    <GlassCard className="p-0 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 text-zinc-400 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4 font-medium">Assets</th>
                                        <th className="px-6 py-4 font-medium">Collateral</th>
                                        <th className="px-6 py-4 font-medium">Debt</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {hasCollateral || hasDebt ? (
                                        <tr
                                            onClick={() => router.push('/withdraw')}
                                            className="text-sm hover:bg-white/5 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 relative flex-shrink-0">
                                                        <Image
                                                            src="/ethereum-eth.svg"
                                                            alt="ETH Logo"
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                    <span className="font-bold text-zinc-200">ETH</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-zinc-300">
                                                {formatAmount(position?.collateralETH)}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-zinc-300">
                                                {formatAmount(position?.debt)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {statusBadge && (
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                                                        {statusBadge.text}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr className="text-sm">
                                            <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                                                No active position
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-zinc-200">Actions</h3>
                    <GlassCard className="p-6">
                        <div className="space-y-4">
                            <button
                                onClick={() => router.push('/withdraw')}
                                disabled={!hasDebt && !hasWithdrawable}
                                className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-between ${hasDebt
                                    ? "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
                                    : hasWithdrawable
                                        ? "bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20"
                                        : "bg-white/5 border border-white/10 text-zinc-500 cursor-not-allowed"
                                    }`}
                            >
                                <span>{hasDebt ? "Repay Debt" : hasWithdrawable ? "Claim ETH" : "No Actions"}</span>
                                {hasDebt && <span className="text-sm font-mono">{formatAmount(position?.debt)} KALA</span>}
                                {hasWithdrawable && <span className="text-sm font-mono">{formatAmount(position?.withdrawableETH)} ETH</span>}
                            </button>

                            <div className="text-xs text-zinc-500 space-y-1">
                                <p>• Repay: Enabled when you have outstanding debt</p>
                                <p>• Withdraw: Enabled after full debt repayment</p>
                                <p>• Claim: Enabled after withdrawal delay (3 days)</p>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </main>
    );
}
