"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { formatEther, formatUnits } from "viem";
import { GlassCard } from "@/components/features/ui/GlassCard";
import { AmountInput } from "@/components/features/ui/AmountInput";
import { useRepay } from "@/hooks/useRepay";
import { useWithdraw } from "@/hooks/useWithdraw";
import { useClaim } from "@/hooks/useClaim";
import { useUserPosition } from "@/hooks/useUserPosition";
import { useKalaBalance } from "@/hooks/useKalaBalance";
import { useWithdrawHistory } from "@/hooks/useWithdrawHistory";
import { parseContractError } from "@/lib/contracts";
import { AlertCircle, CheckCircle2, Loader2, Clock, ExternalLink } from "lucide-react";

type Tab = "repay" | "withdraw";

/**
 * Format bigint to display string.
 */
function formatAmount(value: bigint, decimals: number = 18): string {
    const formatted = formatUnits(value, decimals);
    const num = parseFloat(formatted);
    if (num === 0) return "0";
    return num.toFixed(6).replace(/\.?0+$/, "");
}

export default function WithdrawCard() {
    const [activeTab, setActiveTab] = useState<Tab>("repay");
    const [repayAmount, setRepayAmount] = useState<string>("");
    const [withdrawAmount, setWithdrawAmount] = useState<string>("");

    // Position and balance data
    const { position, refetch: refetchPosition } = useUserPosition();
    const { balance: kalaBalance, formatted: kalaFormatted, refetch: refetchBalance } = useKalaBalance();
    const { events: withdrawHistory, isLoading: historyLoading, refetch: refetchHistory } = useWithdrawHistory();

    // Write hooks
    const {
        repay,
        isPending: repayPending,
        isConfirming: repayConfirming,
        isSuccess: repaySuccess,
        error: repayError,
        reset: resetRepay,
        canRepay,
        currentDebt,
        validationError: repayValidation,
    } = useRepay();

    const {
        withdraw,
        isPending: withdrawPending,
        isConfirming: withdrawConfirming,
        isSuccess: withdrawSuccess,
        error: withdrawError,
        reset: resetWithdraw,
        canWithdraw,
        collateralETH,
        delayMet: withdrawDelayMet,
        timeRemaining: withdrawTimeRemaining,
        validationError: withdrawValidation,
    } = useWithdraw();

    const {
        claim,
        isPending: claimPending,
        isConfirming: claimConfirming,
        isSuccess: claimSuccess,
        error: claimError,
        reset: resetClaim,
        canClaim,
        withdrawableETH,
        validationError: claimValidation,
    } = useClaim();

    // Refetch data on transaction success
    useEffect(() => {
        if (repaySuccess || withdrawSuccess || claimSuccess) {
            refetchPosition();
            refetchBalance();
            // Reset inputs after short delay
            setTimeout(() => {
                setRepayAmount("");
                setWithdrawAmount("");
                resetRepay();
                resetWithdraw();
                resetClaim();
            }, 3000);
        }
    }, [repaySuccess, withdrawSuccess, claimSuccess, refetchPosition, refetchBalance, resetRepay, resetWithdraw, resetClaim]);

    // Determine which tab should be active/available
    const hasDebt = currentDebt > 0n;
    const hasWithdrawable = withdrawableETH > 0n;

    // Debug logging - check browser console
    console.log('[WithdrawCard] Position data:', {
        currentDebt: currentDebt.toString(),
        hasDebt,
        collateralETH: collateralETH.toString(),
        withdrawableETH: withdrawableETH.toString(),
        kalaBalance: kalaBalance.toString(),
    });

    // Set max values
    const handleRepayMax = () => {
        const maxRepay = currentDebt < kalaBalance ? currentDebt : kalaBalance;
        setRepayAmount(formatAmount(maxRepay));
    };

    const handleWithdrawMax = () => {
        setWithdrawAmount(formatAmount(collateralETH));
    };

    // Handle transactions
    const handleRepay = () => {
        if (!repayAmount || parseFloat(repayAmount) <= 0) return;
        repay(repayAmount);
    };

    const handleWithdraw = () => {
        if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return;
        withdraw(withdrawAmount);
    };

    const handleClaim = () => {
        claim();
    };

    // Transaction states
    const isRepayLoading = repayPending || repayConfirming;
    const isWithdrawLoading = withdrawPending || withdrawConfirming;
    const isClaimLoading = claimPending || claimConfirming;

    // Get button state for each tab
    const getRepayButtonState = () => {
        if (repaySuccess) return { text: "Repaid Successfully", disabled: true, icon: <CheckCircle2 className="w-5 h-5" /> };
        if (repayConfirming) return { text: "Confirming...", disabled: true, icon: <Loader2 className="w-5 h-5 animate-spin" /> };
        if (repayPending) return { text: "Confirm in Wallet", disabled: true, icon: <Loader2 className="w-5 h-5 animate-spin" /> };
        if (!canRepay) return { text: repayValidation || "Cannot Repay", disabled: true };
        if (!repayAmount || parseFloat(repayAmount) <= 0) return { text: "Enter Amount", disabled: true };
        return { text: "Repay", disabled: false };
    };

    const getWithdrawButtonState = () => {
        if (withdrawSuccess) return { text: "Withdrawal Requested", disabled: true, icon: <CheckCircle2 className="w-5 h-5" /> };
        if (withdrawConfirming) return { text: "Confirming...", disabled: true, icon: <Loader2 className="w-5 h-5 animate-spin" /> };
        if (withdrawPending) return { text: "Confirm in Wallet", disabled: true, icon: <Loader2 className="w-5 h-5 animate-spin" /> };
        if (!canWithdraw) return { text: withdrawValidation || "Cannot Withdraw", disabled: true };
        if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return { text: "Enter Amount", disabled: true };
        return { text: "Withdraw", disabled: false };
    };

    const getClaimButtonState = () => {
        if (claimSuccess) return { text: "Claimed Successfully", disabled: true, icon: <CheckCircle2 className="w-5 h-5" /> };
        if (claimConfirming) return { text: "Confirming...", disabled: true, icon: <Loader2 className="w-5 h-5 animate-spin" /> };
        if (claimPending) return { text: "Confirm in Wallet", disabled: true, icon: <Loader2 className="w-5 h-5 animate-spin" /> };
        if (!hasWithdrawable) return { text: "No ETH to Claim", disabled: true };
        if (!canClaim) return { text: claimValidation || "Cannot Claim", disabled: true };
        return { text: "Claim", disabled: false };
    };

    const repayButton = getRepayButtonState();
    const withdrawButton = getWithdrawButtonState();
    const claimButton = getClaimButtonState();

    return (
        <div className="w-full max-w-md mx-auto">
            <h1 className="text-xl font-medium text-center text-zinc-100 mb-8">Withdrawals</h1>

            {/* Tab navigation */}
            <div className="flex justify-center gap-8 mb-8">
                {(["repay", "withdraw"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-lg font-medium transition-colors duration-300 relative ${activeTab === tab
                            ? "text-white cursor-pointer"
                            : "text-zinc-500 hover:text-zinc-300 cursor-pointer"
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        {activeTab === tab && (
                            <motion.span
                                layoutId="activeTab"
                                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#cc7a0e] rounded-full shadow-[0_0_10px_#cc7a0e]"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            <GlassCard>
                <AnimatePresence mode="wait">
                    {activeTab === "repay" && (
                        <motion.div
                            key="repay"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Debt info banner */}
                            {hasDebt && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-6 flex items-center justify-between">
                                    <span className="text-red-400 text-sm">Outstanding Debt</span>
                                    <span className="text-red-400 font-mono font-bold">{formatAmount(currentDebt)} KALA</span>
                                </div>
                            )}

                            <div className="space-y-2 mb-8">
                                <AmountInput
                                    label="KALA amount to repay"
                                    value={repayAmount}
                                    onChange={setRepayAmount}
                                    onMax={handleRepayMax}
                                    placeholder="0.0"
                                    disabled={isRepayLoading}
                                />
                                <div className="flex justify-between text-xs text-zinc-500 px-1">
                                    <span>Balance: {formatAmount(kalaBalance)} KALA</span>
                                    <span>Debt: {formatAmount(currentDebt)} KALA</span>
                                </div>
                            </div>

                            {/* Error display */}
                            {repayError && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                    <span className="text-red-400 text-sm">{parseContractError(repayError)}</span>
                                </div>
                            )}

                            <button
                                onClick={handleRepay}
                                disabled={repayButton.disabled}
                                className={`w-full border font-medium text-lg py-4 rounded-xl transition-all duration-300 mb-8 flex items-center justify-center gap-2 ${repaySuccess
                                    ? "border-green-500/30 bg-green-500/10 text-green-400"
                                    : repayButton.disabled
                                        ? "border-white/10 bg-white/5 text-zinc-500 cursor-not-allowed"
                                        : "border-white/20 hover:border-white/40 text-white bg-white/5 hover:bg-white/10 cursor-pointer transform hover:scale-[1.01] active:scale-[0.99]"
                                    }`}
                            >
                                {repayButton.icon}
                                {repayButton.text}
                            </button>
                        </motion.div>
                    )}

                    {activeTab === "withdraw" && (
                        <motion.div
                            key="withdraw"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Debt warning with estimated claim time */}
                            {hasDebt && (
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                        <span className="text-yellow-400 text-sm font-medium">Outstanding debt: {formatAmount(currentDebt)} KALA</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-yellow-400/70 flex-shrink-0" />
                                        <span className="text-yellow-400/70 text-xs">
                                            After full repayment, you must wait 3 days before claiming.
                                            {withdrawTimeRemaining > 0 && ` Current wait: ${formatTimeRemaining(withdrawTimeRemaining)} remaining.`}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Show CLAIM UI when there's withdrawable ETH */}
                            {hasWithdrawable ? (
                                <>
                                    <div className="space-y-2 mb-8">
                                        <label className="text-xs font-medium text-zinc-400 ml-1">Ready to claim</label>
                                        <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-zinc-800/50">
                                                    <Image src="/ethereum-eth.svg" alt="ETH Logo" width={32} height={32} className="w-full h-full object-cover opacity-80" />
                                                </div>
                                                <span className="text-2xl font-medium text-white">{formatAmount(withdrawableETH)}</span>
                                            </div>
                                            <span className="text-zinc-400">ETH</span>
                                        </div>
                                    </div>

                                    {/* Claim error display */}
                                    {claimError && (
                                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                            <span className="text-red-400 text-sm">{parseContractError(claimError)}</span>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleClaim}
                                        disabled={claimButton.disabled}
                                        className={`w-full border font-medium text-lg py-4 rounded-xl transition-all duration-300 mb-8 flex items-center justify-center gap-2 ${claimSuccess
                                            ? "border-green-500/30 bg-green-500/10 text-green-400"
                                            : claimButton.disabled
                                                ? "border-white/10 bg-white/5 text-zinc-500 cursor-not-allowed"
                                                : "border-green-500/30 hover:border-green-500/50 text-green-400 bg-green-500/10 hover:bg-green-500/20 cursor-pointer transform hover:scale-[1.01] active:scale-[0.99]"
                                            }`}
                                    >
                                        {claimButton.icon}
                                        {claimButton.text}
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* Delay countdown (only when debt = 0 but delay not met) */}
                                    {!hasDebt && !withdrawDelayMet && withdrawTimeRemaining > 0 && (
                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-6">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                                <span className="text-blue-400 text-sm font-medium">
                                                    Security Delay: {formatTimeRemaining(withdrawTimeRemaining)}
                                                </span>
                                            </div>
                                            <span className="text-blue-400/70 text-xs">
                                                After repaying debt, there is a 3-day waiting period before you can withdraw.
                                            </span>
                                        </div>
                                    )}

                                    <div className="space-y-2 mb-8">
                                        <AmountInput
                                            label="ETH amount to withdraw"
                                            value={withdrawAmount}
                                            onChange={setWithdrawAmount}
                                            onMax={handleWithdrawMax}
                                            placeholder="0.0"
                                            disabled={isWithdrawLoading}
                                        />
                                        <div className="flex justify-between text-xs text-zinc-500 px-1">
                                            <span>Collateral: {formatAmount(collateralETH)} ETH</span>
                                        </div>
                                    </div>

                                    {/* Withdraw error display */}
                                    {withdrawError && (
                                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                            <span className="text-red-400 text-sm">{parseContractError(withdrawError)}</span>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleWithdraw}
                                        disabled={withdrawButton.disabled}
                                        className={`w-full border font-medium text-lg py-4 rounded-xl transition-all duration-300 mb-8 flex items-center justify-center gap-2 ${withdrawSuccess
                                            ? "border-green-500/30 bg-green-500/10 text-green-400"
                                            : withdrawButton.disabled
                                                ? "border-white/10 bg-white/5 text-zinc-500 cursor-not-allowed"
                                                : "border-white/20 hover:border-white/40 text-white bg-white/5 hover:bg-white/10 cursor-pointer transform hover:scale-[1.01] active:scale-[0.99]"
                                            }`}
                                    >
                                        {withdrawButton.icon}
                                        {withdrawButton.text}
                                    </button>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-3 px-1 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                        <span>Your KALA Balance</span>
                        <span className="text-zinc-200 font-mono text-xs">{formatAmount(kalaBalance)} KALA</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                        <span>Collateral Locked</span>
                        <span className="text-zinc-200 font-mono text-xs">{formatAmount(collateralETH)} ETH</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                        <span>Outstanding Debt</span>
                        <span className={`font-mono text-xs ${hasDebt ? "text-red-400" : "text-zinc-200"}`}>
                            {formatAmount(currentDebt)} KALA
                        </span>
                    </div>
                </div>
            </GlassCard>

            {/* Withdrawal History - Table Layout */}
            <div className="mt-6">
                <h2 className="text-sm font-medium text-zinc-400 mb-3">History</h2>
                <div className="bg-black/20 border border-white/5 rounded-xl overflow-hidden">
                    {historyLoading ? (
                        <div className="p-6 text-center">
                            <Loader2 className="w-5 h-5 animate-spin text-zinc-500 mx-auto" />
                            <p className="text-zinc-500 text-xs mt-2">Loading history...</p>
                        </div>
                    ) : withdrawHistory.length > 0 ? (
                        <>
                            {/* Table Header */}
                            <div className="grid grid-cols-2 gap-4 px-4 py-2 border-b border-white/5 bg-black/20">
                                <span className="text-xs font-medium text-zinc-500">Action & Amount</span>
                                <span className="text-xs font-medium text-zinc-500 text-right">Status / Remaining</span>
                            </div>
                            {/* Table Rows */}
                            <div className="divide-y divide-white/5">
                                {withdrawHistory.map((event) => {
                                    // Logic for Repay events
                                    if (event.type === "repay") {
                                        // For Repay, we check if this specific repay started a timer?
                                        // Actually, we can only check the global timer.
                                        const isTimerActive = !hasDebt;
                                        const DELAY_SECONDS = 3 * 24 * 60 * 60;

                                        // We use the event timestamp + delay to show when *this* repay would allow withdrawal 
                                        // IF it was the final one.
                                        // But really, if debt exists, this repay didn't finish the job.

                                        let statusText = "";
                                        let statusColor = "text-zinc-500";

                                        if (hasDebt) {
                                            statusText = "Partial Repayment";
                                        } else {
                                            // Debt is 0, so timer is running based on lastRepayTime
                                            // We compare current time with global timer
                                            if (withdrawTimeRemaining > 0) {
                                                statusText = formatTimeRemaining(withdrawTimeRemaining);
                                                statusColor = "text-yellow-400";
                                            } else {
                                                statusText = "Ready to Withdraw";
                                                statusColor = "text-green-400";
                                            }
                                        }

                                        return (
                                            <div key={event.txHash} className="grid grid-cols-2 gap-4 px-4 py-3 items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-medium text-sm">Repay {formatAmount(event.amount)} KALA</span>
                                                    <a
                                                        href={`https://sepolia.etherscan.io/tx/${event.txHash}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-zinc-600 hover:text-zinc-400"
                                                    >
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>
                                                <div className={`text-right text-xs font-medium ${statusColor}`}>
                                                    {statusText}
                                                </div>
                                            </div>
                                        );
                                    }

                                    // Logic for Withdraw events (ETH moved to buffer)
                                    return (
                                        <div key={event.txHash} className="grid grid-cols-2 gap-4 px-4 py-3 items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-medium text-sm">Withdraw {formatAmount(event.amount)} ETH</span>
                                                <a
                                                    href={`https://sepolia.etherscan.io/tx/${event.txHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-zinc-600 hover:text-zinc-400"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                            <div className="text-right">
                                                {/* If this withdrawal exists, it's ready to claim or already claimed. 
                                                    Since we don't track Claim events yet, we assume it's claimable if withdrawableETH > 0 */}
                                                {hasWithdrawable ? (
                                                    <button
                                                        onClick={handleClaim}
                                                        disabled={claimButton.disabled || hasDebt}
                                                        className={`px-3 py-1 text-xs font-medium rounded-md border transition-all ${hasDebt
                                                                ? "bg-zinc-800/50 border-zinc-700/50 text-zinc-500 cursor-not-allowed"
                                                                : claimButton.disabled
                                                                    ? "bg-zinc-800/50 border-zinc-700/50 text-zinc-500 cursor-not-allowed"
                                                                    : "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 cursor-pointer"
                                                            }`}
                                                    >
                                                        {claimPending || claimConfirming ? (
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                        ) : (
                                                            "Claim"
                                                        )}
                                                    </button>
                                                ) : (
                                                    <span className="text-zinc-500 text-xs">Processed</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="p-6 text-center">
                            <p className="text-zinc-500 text-sm">No history found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Format seconds into human-readable time.
 */
function formatTimeRemaining(seconds: number): string {
    if (seconds <= 0) return "now";

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);

    return parts.join(" ") || "< 1m";
}
