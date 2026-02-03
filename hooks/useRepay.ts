"use client";

import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { parseUnits } from "viem";
import { kalaMoneyConfig } from "@/lib/contracts";
import { useUserPosition } from "./useUserPosition";
import { useKalaBalance } from "./useKalaBalance";

interface UseRepayResult {
    repay: (kalaAmount: string) => void;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    error: Error | null;
    txHash: `0x${string}` | undefined;
    reset: () => void;
    currentDebt: bigint;
    kalaBalance: bigint;
    canRepay: boolean;
    validationError: string | null;
}

export function useRepay(): UseRepayResult {
    const { isConnected } = useAccount();
    const { position, refetch: refetchPosition } = useUserPosition();
    const { balance: kalaBalance, refetch: refetchBalance } = useKalaBalance();

    const {
        writeContract,
        data: txHash,
        isPending,
        error: writeError,
        reset,
    } = useWriteContract();

    const {
        isLoading: isConfirming,
        isSuccess,
        error: receiptError,
    } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    if (isSuccess) {
        refetchPosition();
        refetchBalance();
    }

    const currentDebt = position?.debt ?? 0n;
    const canRepay = isConnected && currentDebt > 0n;

    const repay = (kalaAmount: string) => {
        if (!kalaAmount || parseFloat(kalaAmount) <= 0) {
            return;
        }

        const amount = parseUnits(kalaAmount, 18);

        const repayAmount = amount > currentDebt ? currentDebt : amount;

        writeContract({
            ...kalaMoneyConfig,
            functionName: "repay",
            args: [repayAmount],
        });
    };

    let validationError: string | null = null;
    if (!isConnected) {
        validationError = "Wallet not connected";
    } else if (currentDebt === 0n) {
        validationError = "No debt to repay";
    }

    return {
        repay,
        isPending,
        isConfirming,
        isSuccess,
        error: (writeError || receiptError) as Error | null,
        txHash,
        reset,
        currentDebt,
        kalaBalance,
        canRepay,
        validationError,
    };
}
