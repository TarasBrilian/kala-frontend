"use client";

import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { parseEther } from "viem";
import { kalaMoneyConfig } from "@/lib/contracts";
import { useUserPosition } from "./useUserPosition";

const WITHDRAWAL_DELAY = 3 * 24 * 60 * 60; // 3 days in seconds

interface UseWithdrawResult {
    withdraw: (ethAmount: string) => void;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    error: Error | null;
    txHash: `0x${string}` | undefined;
    reset: () => void;
    collateralETH: bigint;
    currentDebt: bigint;
    canWithdraw: boolean;
    delayMet: boolean;
    timeRemaining: number;
    validationError: string | null;
}

export function useWithdraw(): UseWithdrawResult {
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

    const collateralETH = position?.collateralETH ?? 0n;
    const currentDebt = position?.debt ?? 0n;
    const lastRepayTime = position?.lastRepayTime ?? 0n;

    const now = BigInt(Math.floor(Date.now() / 1000));
    const unlockTime = lastRepayTime + BigInt(WITHDRAWAL_DELAY);

    // Delay only starts tracking when debt is 0. If debt > 0, delay is technically not "met"
    const delayMet = currentDebt === 0n && now >= unlockTime;
    const timeRemaining = currentDebt > 0n ? WITHDRAWAL_DELAY : Math.max(0, Number(unlockTime - now));

    const canWithdraw = isConnected && collateralETH > 0n && currentDebt === 0n;

    const withdraw = (ethAmount: string) => {
        if (!ethAmount || parseFloat(ethAmount) <= 0 || !canWithdraw) {
            return;
        }

        const amount = parseEther(ethAmount);

        writeContract({
            ...kalaMoneyConfig,
            functionName: "withdraw",
            args: [amount],
        });
    };

    let validationError: string | null = null;
    if (!isConnected) {
        validationError = "Wallet not connected";
    } else if (collateralETH === 0n) {
        validationError = "No collateral to withdraw";
    } else if (currentDebt > 0n) {
        validationError = "Repay debt before withdrawal";
    }

    return {
        withdraw,
        isPending,
        isConfirming,
        isSuccess,
        error: (writeError || receiptError) as Error | null,
        txHash,
        reset,
        collateralETH,
        currentDebt,
        canWithdraw,
        delayMet,
        timeRemaining,
        validationError,
    };
}
