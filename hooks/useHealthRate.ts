"use client";

import { useUserPosition } from "./useUserPosition";
import { usePriceFeed } from "./usePriceFeed";
import { useContractConstants } from "./useContractConstants";
import type { HealthStatus } from "@/lib/types";

interface UseHealthRateResult {
    healthRate: number | null;
    status: HealthStatus;
    rawCrBps: bigint | null;
    isLoading: boolean;
}

export function useHealthRate(): UseHealthRateResult {
    const { position, isLoading: positionLoading } = useUserPosition();
    const { prices, isLoading: pricesLoading } = usePriceFeed();
    const { constants, isLoading: constantsLoading } = useContractConstants();

    const isLoading = positionLoading || pricesLoading || constantsLoading;

    if (!position || !prices || !constants) {
        return {
            healthRate: null,
            status: "unknown",
            rawCrBps: null,
            isLoading,
        };
    }

    if (position.debt === 0n) {
        return {
            healthRate: 5,
            status: "safe",
            rawCrBps: null,
            isLoading,
        };
    }

    if (position.collateralETH === 0n) {
        return {
            healthRate: 0,
            status: "danger",
            rawCrBps: 0n,
            isLoading,
        };
    }

    const collateralValue = position.collateralETH * prices.ethUsdPrice;
    const debtValue = position.debt * prices.kalaUsdPrice;

    if (debtValue === 0n) {
        return {
            healthRate: 5,
            status: "safe",
            rawCrBps: null,
            isLoading,
        };
    }

    const rawCrBps = (collateralValue * constants.bps) / debtValue;

    const minCr = constants.minCrBps;
    const healthRatio = Number(rawCrBps * 100n / minCr) / 100;

    const healthRate = Math.min(5, Math.max(1, Math.round((healthRatio - 1) * 4 + 1)));

    let status: HealthStatus;
    if (healthRate >= 4) {
        status = "safe";
    } else if (healthRate >= 2) {
        status = "warning";
    } else {
        status = "danger";
    }

    return {
        healthRate,
        status,
        rawCrBps,
        isLoading,
    };
}
