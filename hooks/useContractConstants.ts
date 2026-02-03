"use client";

import { useReadContracts } from "wagmi";
import { kalaMoneyConfig } from "@/lib/contracts";
import type { ContractConstants } from "@/lib/types";

interface UseContractConstantsResult {
    constants: ContractConstants | null;
    isLoading: boolean;
    error: Error | null;
}

export function useContractConstants(): UseContractConstantsResult {
    const { data, isLoading, error } = useReadContracts({
        contracts: [
            {
                ...kalaMoneyConfig,
                functionName: "WITHDRAWAL_DELAY",
            },
            {
                ...kalaMoneyConfig,
                functionName: "MIN_CR_BPS",
            },
            {
                ...kalaMoneyConfig,
                functionName: "decimals",
            },
            {
                ...kalaMoneyConfig,
                functionName: "BPS",
            },
            {
                ...kalaMoneyConfig,
                functionName: "PRECISION",
            },
        ],
        query: {
            staleTime: Infinity,
        },
    });

    const constants: ContractConstants | null =
        data && data.every((d) => d.status === "success")
            ? {
                withdrawalDelay: data[0].result as bigint,
                minCrBps: data[1].result as bigint,
                decimals: Number(data[2].result),
                bps: data[3].result as bigint,
                precision: data[4].result as bigint,
            }
            : null;

    return {
        constants,
        isLoading,
        error: error as Error | null,
    };
}
