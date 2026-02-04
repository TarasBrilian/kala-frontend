"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, encodeAbiParameters, encodePacked, zeroAddress, maxUint128 } from "viem";
import { PositionManagerAbi, Actions } from "@/abis/PositionManagerAbi";
import { KALA_HOOK_ADDRESS } from "@/lib/contracts";
import { sepolia } from "wagmi/chains";

const POSITION_MANAGER = "0x429ba70129df741B2Ca2a85BC3A2a3328e5c09b4" as const;
const KALA_TOKEN = "0xAF53484b277e9b7e9Fb224D2e534ee9beB68B7BA" as const;

const TICK_LOWER = -887220;
const TICK_UPPER = 887220;

export function usePositionManager() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const mintPosition = async (ethAmount: string, kalaAmount: string, recipient: `0x${string}`) => {
        if (!ethAmount || !kalaAmount) return;

        const ethWei = parseEther(ethAmount);
        const kalaWei = parseEther(kalaAmount);

        // Pool key for KALA/ETH pool
        const poolKey = {
            currency0: zeroAddress as `0x${string}`,
            currency1: KALA_TOKEN as `0x${string}`,
            fee: 3000,
            tickSpacing: 60,
            hooks: KALA_HOOK_ADDRESS[sepolia.id] as `0x${string}`,
        };

        // Encode MINT_POSITION_FROM_DELTAS params
        // (PoolKey, int24 tickLower, int24 tickUpper, uint128 amount0Max, uint128 amount1Max, address owner, bytes hookData)
        const mintParams = encodeAbiParameters(
            [
                {
                    name: "poolKey", type: "tuple", components: [
                        { name: "currency0", type: "address" },
                        { name: "currency1", type: "address" },
                        { name: "fee", type: "uint24" },
                        { name: "tickSpacing", type: "int24" },
                        { name: "hooks", type: "address" },
                    ]
                },
                { name: "tickLower", type: "int24" },
                { name: "tickUpper", type: "int24" },
                { name: "amount0Max", type: "uint128" },
                { name: "amount1Max", type: "uint128" },
                { name: "owner", type: "address" },
                { name: "hookData", type: "bytes" },
            ],
            [poolKey, TICK_LOWER, TICK_UPPER, ethWei, kalaWei, recipient, "0x"]
        );

        // Encode SETTLE for ETH (currency0)
        const settleEthParams = encodeAbiParameters(
            [
                { name: "currency", type: "address" },
                { name: "amount", type: "uint256" },
                { name: "payerIsUser", type: "bool" },
            ],
            [zeroAddress, ethWei, true]
        );

        // Encode SETTLE for KALA (currency1)
        const settleKalaParams = encodeAbiParameters(
            [
                { name: "currency", type: "address" },
                { name: "amount", type: "uint256" },
                { name: "payerIsUser", type: "bool" },
            ],
            [KALA_TOKEN, kalaWei, true]
        );

        // Encode SWEEP for any excess ETH
        const sweepEthParams = encodeAbiParameters(
            [
                { name: "currency", type: "address" },
                { name: "to", type: "address" },
            ],
            [zeroAddress, recipient]
        );

        // Encode SWEEP for any excess KALA
        const sweepKalaParams = encodeAbiParameters(
            [
                { name: "currency", type: "address" },
                { name: "to", type: "address" },
            ],
            [KALA_TOKEN, recipient]
        );

        // Build actions sequence
        const actions = encodePacked(
            ["uint8", "uint8", "uint8", "uint8", "uint8"],
            [
                Actions.MINT_POSITION_FROM_DELTAS,
                Actions.SETTLE,
                Actions.SETTLE,
                Actions.SWEEP,
                Actions.SWEEP,
            ]
        );

        // Encode full unlockData
        const unlockData = encodeAbiParameters(
            [
                { name: "actions", type: "bytes" },
                { name: "params", type: "bytes[]" },
            ],
            [actions, [mintParams, settleEthParams, settleKalaParams, sweepEthParams, sweepKalaParams]]
        );

        const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour

        writeContract({
            address: POSITION_MANAGER,
            abi: PositionManagerAbi,
            functionName: "modifyLiquidities",
            args: [unlockData, deadline],
            value: ethWei,
        });
    };

    return {
        mintPosition,
        isPending,
        isConfirming,
        isSuccess,
        error,
        hash,
    };
}
