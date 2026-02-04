"use client";

import { useState, useEffect } from "react";
import { ArrowUpDown, Loader2, CheckCircle2, ExternalLink } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useAccount, useBalance } from "wagmi";
import { formatEther, parseEther, formatUnits } from "viem";
import { usePreviewDeposit } from "@/hooks/usePreviewDeposit";
import { useDeposit } from "@/hooks/useDeposit";

function formatTokenAmount(value: bigint, decimals: number = 18): string {
    const formatted = formatUnits(value, decimals);
    const num = parseFloat(formatted);
    return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

export default function StakeCard() {
    const { address, isConnected } = useAccount();
    const { data: balanceData } = useBalance({
        address: address,
    });

    const [amount, setAmount] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successTxHash, setSuccessTxHash] = useState<string | null>(null);

    const MAX_LTV = 66.666666;

    const [sliderPercent, setSliderPercent] = useState<number>(MAX_LTV);

    const {
        kalaAmount,
        ethUsdPrice,
        kalaUsdPrice,
        isLoading: isPreviewLoading
    } = usePreviewDeposit(amount);

    const {
        deposit,
        isPending,
        isConfirming,
        isSuccess,
        error: depositError,
        txHash,
        reset
    } = useDeposit();

    useEffect(() => {
        if (isSuccess && txHash) {
            setSuccessTxHash(txHash);
            setShowSuccessModal(true);

            // Reset inputs and hook state after 3s to allow "Staked!" feedback
            setTimeout(() => {
                setAmount("");
                setSliderPercent(MAX_LTV);
                reset();
            }, 3000);
        }
    }, [isSuccess, txHash, reset]);

    // Independent auto-dismiss timer
    useEffect(() => {
        if (showSuccessModal) {
            const timer = setTimeout(() => {
                setShowSuccessModal(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessModal]);

    useEffect(() => {
        if (!amount || !balanceData) {
            setError(null);
            return;
        }

        try {
            const inputAmount = parseEther(amount);
            const balanceAmount = balanceData.value;
            const minAmount = parseEther("0.001");

            if (inputAmount > balanceAmount) {
                setError("Insufficient balance");
            } else if (inputAmount < minAmount) {
                setError("Minimum stake is 0.001 ETH");
            } else {
                setError(null);
            }
        } catch {
            setError(null);
        }
    }, [amount, balanceData]);

    const handleMaxClick = () => {
        if (balanceData) {
            const ethValue = parseFloat(formatEther(balanceData.value));
            setAmount(ethValue.toFixed(6));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        const clampedValue = Math.min(value, MAX_LTV);
        setSliderPercent(clampedValue);
    };

    const handleStake = () => {
        if (amount && parseFloat(amount) > 0) {
            setSuccessTxHash(null);
            deposit(amount);
        }
    };

    const isStakeDisabled = !isConnected || !amount || !!error || parseFloat(amount) <= 0 || isPending || isConfirming;

    const showSlider = !!(amount && parseFloat(amount) > 0 && kalaAmount);

    const adjustedKalaAmount = kalaAmount
        ? (kalaAmount * BigInt(Math.floor((sliderPercent / MAX_LTV) * 10000))) / BigInt(10000)
        : undefined;

    const formattedKalaAmount = adjustedKalaAmount
        ? formatTokenAmount(adjustedKalaAmount, 18)
        : "";

    const exchangeRate = ethUsdPrice && kalaUsdPrice && kalaUsdPrice > BigInt(0)
        ? (Number(ethUsdPrice) / Number(kalaUsdPrice)).toFixed(4)
        : null;

    const getButtonText = () => {
        if (!isConnected) return "Connect Wallet to Stake";
        if (error) return error;
        if (isPending) return "Confirm in Wallet...";
        if (isConfirming) return "Confirming...";
        if (isSuccess) return "Staked!";
        return "Stake";
    };

    return (
        <div className="w-full max-w-md mx-auto relative">
            <AnimatePresence>
                {showSuccessModal && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, y: 0 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="fixed top-24 right-4 z-[100]"
                    >
                        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 w-72 shadow-2xl space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-green-500/10 rounded-full shrink-0">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-zinc-100">Staked Successfully!</h3>
                                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">KALA Money Protocol</p>
                                </div>
                                <button
                                    onClick={() => setShowSuccessModal(false)}
                                    className="text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    ×
                                </button>
                            </div>
                            {successTxHash && (
                                <a
                                    href={`https://sepolia.etherscan.io/tx/${successTxHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 py-2 px-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[10px] font-mono text-[#cc7a0e] transition-colors"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    {successTxHash.slice(0, 8)}...{successTxHash.slice(-6)}
                                </a>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <h1 className="text-3xl -mt-10 font-bold text-center text-zinc-100 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700">Stake</h1>
            <p className="text-sm text-zinc-400 mb-2 text-center">Stake your ETH and get KALA with 0% rate</p>
            <div className="glass-card rounded-3xl p-6 shadow-2xl shadow-black/40 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-backwards">
                <div className="space-y-2 mb-2">
                    <label className="text-xs font-medium text-zinc-400 ml-1">ETH amount</label>
                    <div className={`bg-black/40 border rounded-2xl p-4 flex items-center justify-between transition-colors ${error ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'}`}>
                        <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 flex items-center justify-center shrink-0">
                                <Image src="/ethereum-eth.svg" alt="ETH Logo" width={64} height={64} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <input
                                type="text"
                                className="bg-transparent border-none outline-none text-2xl font-medium text-white placeholder-zinc-600 w-full min-w-0"
                                placeholder="0.0"
                                value={amount}
                                onChange={handleInputChange}
                                disabled={isPending || isConfirming}
                            />
                        </div>
                        <button
                            onClick={handleMaxClick}
                            disabled={isPending || isConfirming}
                            className="text-xs font-bold text-[#cc7a0e] bg-[#cc7a0e]/10 border border-[#cc7a0e]/20 px-3 py-1.5 rounded-lg hover:bg-[#cc7a0e]/20 transition-colors uppercase tracking-wide cursor-pointer ml-3 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Max
                        </button>
                    </div>
                    <div className="flex justify-between items-center px-1">
                        <span className="text-xs text-red-400 font-medium h-4">{error}</span>
                        <div className="text-right text-xs text-zinc-500 font-mono">
                            Balance: {balanceData ? `${parseFloat(formatEther(balanceData.value)).toFixed(4)} ${balanceData.symbol}` : '0.0 ETH'}
                        </div>
                    </div>
                </div>

                <div className="relative h-4 flex items-center justify-center my-2">
                    <div className="bg-[#1a1a1a] rounded-full p-1.5 border border-white/5 relative z-10 text-zinc-500">
                        <ArrowUpDown className="w-4 h-4" />
                    </div>
                </div>

                <div className="space-y-2 mb-8">
                    <label className="text-xs font-medium text-zinc-400 ml-1">You will receive</label>
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 flex items-center justify-center shrink-0">
                                <Image src="/kala-logo-no-bg.png" alt="KALA Logo" width={64} height={64} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex items-center gap-2 flex-1">
                                <input
                                    type="text"
                                    className="bg-transparent border-none outline-none text-2xl font-medium text-white placeholder-zinc-600 w-full min-w-0"
                                    placeholder="0.0"
                                    readOnly
                                    value={formattedKalaAmount}
                                />
                                {isPreviewLoading && amount && parseFloat(amount) > 0 && (
                                    <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className={`grid transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${showSlider ? "grid-rows-[1fr] mb-6" : "grid-rows-[0fr] mb-0"
                        }`}
                >
                    <div className="overflow-hidden">
                        <div
                            className={`space-y-3 transition-opacity duration-700 ${showSlider ? "opacity-100 delay-300" : "opacity-0"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-zinc-400">Mint LTV %</span>
                                <span className="text-xs font-mono text-[#cc7a0e]">{sliderPercent.toFixed(2)}%</span>
                            </div>
                            <div className="relative w-full h-6 flex items-center">
                                <div className="absolute left-0 h-1 bg-[#cc7a0e]/20 rounded-l-full top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: `${MAX_LTV}%` }}></div>

                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={sliderPercent}
                                    onChange={handleSliderChange}
                                    className="slider-stake w-full z-10 relative"
                                    style={{ '--slider-progress': `${sliderPercent}%` } as React.CSSProperties}
                                    disabled={isPending || isConfirming}
                                />

                                {/* Max LTV Marker */}
                                <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-red-500/50 z-0 pointer-events-none" style={{ left: `${MAX_LTV}%` }}></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-zinc-600">
                                <span>0%</span>
                                <span style={{ marginLeft: `${MAX_LTV - 15}%` }} className="text-[#cc7a0e]">Max Safe (66.67%)</span>
                                <span>100%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleStake}
                    disabled={isStakeDisabled}
                    className={`w-full font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_-5px_rgba(204,122,14,0.4)] transition-all duration-300 transform mb-8 flex items-center justify-center gap-2 ${isStakeDisabled ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none' : 'bg-[#cc7a0e] hover:bg-[#b0680c] text-black hover:shadow-[0_0_25px_-5px_rgba(204,122,14,0.6)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer'}`}
                >
                    {(isPending || isConfirming) && <Loader2 className="w-5 h-5 animate-spin" />}
                    {getButtonText()}
                </button>

                {txHash && (
                    <div className="mb-4 p-3 bg-[#cc7a0e]/10 border border-[#cc7a0e]/20 rounded-xl animate-in fade-in slide-in-from-top-2">
                        <p className="text-xs text-zinc-400 mb-1">Transaction Submitted</p>
                        <a
                            href={`https://sepolia.etherscan.io/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#cc7a0e] font-mono hover:underline break-all"
                        >
                            View on Etherscan
                        </a>
                    </div>
                )}

                {depositError && (
                    <div className="absolute top-4 right-4 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
                        <div className="bg-zinc-900/90 backdrop-blur-md border border-red-500/20 shadow-xl rounded-xl p-4 flex items-start gap-3 max-w-sm">
                            <div className="p-2 bg-red-500/10 rounded-full shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-0.5">Transaction Failed</h4>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    {(() => {
                                        const msg = depositError.message.toLowerCase();
                                        if (msg.includes("user rejected") || msg.includes("user denied")) return "You cancelled the transaction.";
                                        if (msg.includes("insufficient funds")) return "Insufficient ETH for gas fees.";
                                        if (msg.includes("gas too low")) return "Gas price too low. Try increasing slippage.";
                                        return "Something went wrong. Please try again.";
                                    })()}
                                </p>
                            </div>
                            <button onClick={() => window.location.reload()} className="ml-auto text-zinc-500 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-3 px-1">
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                        <span>Exchange rate</span>
                        <span className="text-zinc-200 font-mono text-xs">
                            {exchangeRate ? `1 ETH = ${exchangeRate} KALA` : "—"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                        <span>ETH/USD</span>
                        <span className="text-zinc-200 font-mono text-xs">
                            {ethUsdPrice ? `$${parseFloat(formatUnits(ethUsdPrice, 18)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                        <span>KALA/USD</span>
                        <span className="text-zinc-200 font-mono text-xs">
                            {kalaUsdPrice ? `$${parseFloat(formatUnits(kalaUsdPrice, 18)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                        <span>Collateral Ratio</span>
                        <span className="text-zinc-200 font-mono text-xs"> 150%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
