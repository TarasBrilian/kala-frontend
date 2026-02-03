"use client";

import { useReadContract, useAccount } from "wagmi";
import { formatUnits } from "viem";
import { kalaMoneyConfig } from "@/lib/contracts";

interface UseKalaBalanceResult {
    balance: bigint;
    formatted: string;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
}

export function useKalaBalance(): UseKalaBalanceResult {
    const { address, isConnected } = useAccount();

    const {
        data: balance,
        isLoading,
        error,
        refetch,
    } = useReadContract({
        ...kalaMoneyConfig,
        functionName: "sharesOf",
        args: address ? [address] : undefined,
        query: {
            enabled: isConnected && !!address,
            refetchInterval: 12000,
        },
    });

    return {
        balance: balance ?? 0n,
        formatted: balance ? formatUnits(balance, 18) : "0",
        isLoading,
        error: error as Error | null,
        refetch,
    };
}
