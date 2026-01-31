"use client";

import { useReadContract } from "wagmi";
import { parseEther } from "viem";
import { kalaMoneyConfig } from "@/lib/contracts";

interface PreviewDepositResult {
    kalaAmount: bigint | undefined;
    crBps: bigint | undefined;
    ethUsdPrice: bigint | undefined;
    kalaUsdPrice: bigint | undefined;
    isLoading: boolean;
    error: Error | null;
}

export function usePreviewDeposit(ethAmount: string): PreviewDepositResult {
    const parsedAmount = ethAmount && parseFloat(ethAmount) > 0
        ? parseEther(ethAmount)
        : BigInt(0);

    const { data, isLoading, error } = useReadContract({
        ...kalaMoneyConfig,
        functionName: "previewDeposit",
        args: [parsedAmount],
        query: {
            enabled: parsedAmount > BigInt(0),
        },
    });

    return {
        kalaAmount: data?.[0],
        crBps: data?.[1],
        ethUsdPrice: data?.[2],
        kalaUsdPrice: data?.[3],
        isLoading,
        error: error as Error | null,
    };
}
