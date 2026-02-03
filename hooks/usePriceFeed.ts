"use client";

import { useReadContract } from "wagmi";
import { parseEther } from "viem";
import { kalaMoneyConfig } from "@/lib/contracts";
import type { PriceFeed } from "@/lib/types";

interface UsePriceFeedResult {
    prices: PriceFeed | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
}

export function usePriceFeed(): UsePriceFeedResult {
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useReadContract({
        ...kalaMoneyConfig,
        functionName: "previewDeposit",
        args: [parseEther("1")],
        query: {
            refetchInterval: 30000,
        },
    });

    const prices: PriceFeed | null = data
        ? {
            ethUsdPrice: data[2],
            kalaUsdPrice: data[3],
        }
        : null;

    return {
        prices,
        isLoading,
        error: error as Error | null,
        refetch,
    };
}
