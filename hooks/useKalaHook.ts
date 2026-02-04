"use client";

import { useReadContract } from "wagmi";
import { kalaHookConfig } from "@/lib/contracts";

export interface KalaHookData {
    kalaOracle: `0x${string}` | undefined;
    kalaToken: `0x${string}` | undefined;
    ethUsdFeed: `0x${string}` | undefined;
    poolManager: `0x${string}` | undefined;
    bps: bigint | undefined;
    precision: bigint | undefined;
    isLoading: boolean;
    error: Error | null;
}

export function useKalaHook(): KalaHookData {
    const { data: kalaOracle, isLoading: isLoadingOracle, error: errorOracle } = useReadContract({
        ...kalaHookConfig,
        functionName: "kalaOracle",
    });

    const { data: kalaToken, isLoading: isLoadingToken, error: errorToken } = useReadContract({
        ...kalaHookConfig,
        functionName: "kalaToken",
    });

    const { data: ethUsdFeed, isLoading: isLoadingFeed, error: errorFeed } = useReadContract({
        ...kalaHookConfig,
        functionName: "ethUsdFeed",
    });

    const { data: poolManager, isLoading: isLoadingManager, error: errorManager } = useReadContract({
        ...kalaHookConfig,
        functionName: "poolManager",
    });

    const { data: bps } = useReadContract({
        ...kalaHookConfig,
        functionName: "BPS",
    });

    const { data: precision } = useReadContract({
        ...kalaHookConfig,
        functionName: "PRECISION",
    });

    const isLoading = isLoadingOracle || isLoadingToken || isLoadingFeed || isLoadingManager;
    const error = errorOracle || errorToken || errorFeed || errorManager || null;

    return {
        kalaOracle: kalaOracle as `0x${string}` | undefined,
        kalaToken: kalaToken as `0x${string}` | undefined,
        ethUsdFeed: ethUsdFeed as `0x${string}` | undefined,
        poolManager: poolManager as `0x${string}` | undefined,
        bps: bps as bigint | undefined,
        precision: precision as bigint | undefined,
        isLoading,
        error,
    };
}
