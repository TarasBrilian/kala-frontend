"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { kalaMoneyConfig } from "@/lib/contracts";

interface DepositResult {
    deposit: (ethAmount: string) => void;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    error: Error | null;
    txHash: `0x${string}` | undefined;
    reset: () => void;
}

export function useDeposit(): DepositResult {
    const {
        writeContract,
        data: txHash,
        isPending,
        error: writeError,
        reset
    } = useWriteContract();

    const {
        isLoading: isConfirming,
        isSuccess,
        error: receiptError
    } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    const deposit = (ethAmount: string) => {
        const value = parseEther(ethAmount);
        writeContract({
            ...kalaMoneyConfig,
            functionName: "deposit",
            value,
        });
    };

    return {
        deposit,
        isPending,
        isConfirming,
        isSuccess,
        error: (writeError || receiptError) as Error | null,
        txHash,
        reset,
    };
}
