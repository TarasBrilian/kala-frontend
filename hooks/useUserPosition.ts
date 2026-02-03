"use client";

import { useReadContract, useAccount } from "wagmi";
import { kalaMoneyConfig } from "@/lib/contracts";
import type { UserPosition } from "@/lib/types";

interface UseUserPositionResult {
    position: UserPosition | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
}

export function useUserPosition(): UseUserPositionResult {
    const { address, isConnected } = useAccount();

    const {
        data,
        isLoading,
        error,
        refetch,
    } = useReadContract({
        ...kalaMoneyConfig,
        functionName: "positions",
        args: address ? [address] : undefined,
        query: {
            enabled: isConnected && !!address,
            refetchInterval: 5000,
        },
    });

    const position: UserPosition | null = data
        ? {
            collateralETH: data[0],
            debt: data[1],
            withdrawableETH: data[2],
            lastRepayTime: data[3],
        }
        : null;

    return {
        position,
        isLoading,
        error: error as Error | null,
        refetch,
    };
}
