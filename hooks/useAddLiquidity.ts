"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, zeroAddress } from "viem";
import { PoolModifyLiquidityTestAbi } from "@/abis/PoolModifyLiquidityTestAbi";
import { KALA_HOOK_ADDRESS } from "@/lib/contracts";
import { sepolia } from "wagmi/chains";

const POOL_MODIFY_LIQUIDITY_TEST = "0x0C478023803a644c94c4CE1C1e7b9A087e411B0A" as const;
const KALA_TOKEN = "0xAF53484b277e9b7e9Fb224D2e534ee9beB68B7BA" as const;

// Full range ticks for tick spacing of 60
const TICK_LOWER = -887220;
const TICK_UPPER = 887220;

export function useAddLiquidity() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const addLiquidity = async (ethAmount: string, kalaAmount: string) => {
        if (!ethAmount || !kalaAmount) return;

        const ethWei = parseEther(ethAmount);
        const kalaWei = parseEther(kalaAmount);

        // Calculate liquidity based on the smaller value to avoid out of funds
        // Use a simple multiplier that works with the pool
        const liquidityDelta = ethWei; // Use ETH amount directly as liquidity

        const poolKey = {
            currency0: zeroAddress,
            currency1: KALA_TOKEN,
            fee: 3000,
            tickSpacing: 60,
            hooks: KALA_HOOK_ADDRESS[sepolia.id],
        };

        const params = {
            tickLower: TICK_LOWER,
            tickUpper: TICK_UPPER,
            liquidityDelta: liquidityDelta,
            salt: "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`,
        };

        writeContract({
            address: POOL_MODIFY_LIQUIDITY_TEST,
            abi: PoolModifyLiquidityTestAbi,
            functionName: "modifyLiquidity",
            args: [poolKey, params, "0x"],
            value: ethWei,
        });
    };

    const removeLiquidity = async (liquidityDelta: bigint) => {
        const poolKey = {
            currency0: zeroAddress,
            currency1: KALA_TOKEN,
            fee: 3000,
            tickSpacing: 60,
            hooks: KALA_HOOK_ADDRESS[sepolia.id],
        };

        const params = {
            tickLower: TICK_LOWER,
            tickUpper: TICK_UPPER,
            liquidityDelta: -liquidityDelta,
            salt: "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`,
        };

        writeContract({
            address: POOL_MODIFY_LIQUIDITY_TEST,
            abi: PoolModifyLiquidityTestAbi,
            functionName: "modifyLiquidity",
            args: [poolKey, params, "0x"],
        });
    };

    return {
        addLiquidity,
        removeLiquidity,
        isPending,
        isConfirming,
        isSuccess,
        error,
        hash,
    };
}
