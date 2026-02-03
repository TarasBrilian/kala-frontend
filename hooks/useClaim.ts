"use client";

import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { kalaMoneyConfig } from "@/lib/contracts";
import { useUserPosition } from "./useUserPosition";

interface UseClaimResult {
    claim: () => void;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    error: Error | null;
    txHash: `0x${string}` | undefined;
    reset: () => void;
    withdrawableETH: bigint;
    currentDebt: bigint;
    canClaim: boolean;
    validationError: string | null;
}

export function useClaim(): UseClaimResult {
    const { isConnected } = useAccount();
    const { position, refetch: refetchPosition } = useUserPosition();

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
    }

    const withdrawableETH = position?.withdrawableETH ?? 0n;
    const currentDebt = position?.debt ?? 0n;

    const canClaim = isConnected && withdrawableETH > 0n && currentDebt === 0n;

    const claim = () => {
        if (!canClaim) {
            console.error("Cannot claim: conditions not met");
            return;
        }

        writeContract({
            ...kalaMoneyConfig,
            functionName: "claim",
        });
    };

    let validationError: string | null = null;
    if (!isConnected) {
        validationError = "Wallet not connected";
    } else if (currentDebt > 0n) {
        validationError = "Repay all debt before claiming";
    } else if (withdrawableETH === 0n) {
        validationError = "No ETH to claim";
    }

    return {
        claim,
        isPending,
        isConfirming,
        isSuccess,
        error: (writeError || receiptError) as Error | null,
        txHash,
        reset,
        withdrawableETH,
        currentDebt,
        canClaim,
        validationError,
    };
}
