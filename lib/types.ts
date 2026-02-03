export interface UserPosition {
    collateralETH: bigint;
    debt: bigint;
    withdrawableETH: bigint;
    lastRepayTime: bigint;
}

export type ActionState = 'idle' | 'pending' | 'confirming' | 'success' | 'error';

export type HealthStatus = 'safe' | 'warning' | 'danger' | 'unknown';

export interface PriceFeed {
    ethUsdPrice: bigint;
    kalaUsdPrice: bigint;
}

export interface ContractConstants {
    withdrawalDelay: bigint;
    minCrBps: bigint;
    decimals: number;
    bps: bigint;
    precision: bigint;
}
