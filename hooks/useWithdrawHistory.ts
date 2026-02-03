"use client";

import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { kalaMoneyConfig, KALA_DEPLOYMENT_BLOCK } from "@/lib/contracts";
import { parseAbiItem } from "viem";
import { sepolia } from "viem/chains";

export type HistoryEventType = "withdraw" | "repay";

export interface HistoryEvent {
    type: HistoryEventType;
    txHash: `0x${string}`;
    amount: bigint;
    blockNumber: bigint;
    timestamp: number;
}

interface UseWithdrawHistoryResult {
    events: HistoryEvent[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
}

export function useWithdrawHistory(): UseWithdrawHistoryResult {
    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();

    const [events, setEvents] = useState<HistoryEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const refetch = () => setRefetchTrigger((prev) => prev + 1);

    useEffect(() => {
        if (!isConnected || !address || !publicClient) {
            setEvents([]);
            return;
        }

        const fetchEvents = async () => {
            setIsLoading(true);
            setError(null);

            try {
                console.log("Fetching history for address:", address);
                const fromBlock = KALA_DEPLOYMENT_BLOCK[sepolia.id] || "earliest";

                const withdrawLogsPromise = publicClient.getLogs({
                    address: kalaMoneyConfig.address,
                    event: parseAbiItem("event Withdraw(address indexed user, uint256 ethAmount)"),
                    args: { user: address },
                    fromBlock,
                    toBlock: "latest",
                });

                const repayLogsPromise = publicClient.getLogs({
                    address: kalaMoneyConfig.address,
                    event: parseAbiItem("event Repay(address indexed user, uint256 kalaAmount, uint256 remainingDebt)"),
                    args: { user: address },
                    fromBlock,
                    toBlock: "latest",
                });

                const [withdrawLogs, repayLogs] = await Promise.all([withdrawLogsPromise, repayLogsPromise]);

                console.log("Withdraw logs found:", withdrawLogs.length);
                console.log("Repay logs found:", repayLogs.length);

                const allLogs = [
                    ...withdrawLogs.map(log => ({ ...log, type: "withdraw" as const, amount: log.args.ethAmount ?? 0n })),
                    ...repayLogs.map(log => ({ ...log, type: "repay" as const, amount: log.args.kalaAmount ?? 0n }))
                ];

                const eventsWithTimestamp = await Promise.all(
                    allLogs.map(async (log) => {
                        const block = await publicClient.getBlock({
                            blockNumber: log.blockNumber,
                        });
                        return {
                            type: log.type,
                            txHash: log.transactionHash,
                            amount: log.amount,
                            blockNumber: log.blockNumber,
                            timestamp: Number(block.timestamp),
                        };
                    })
                );

                eventsWithTimestamp.sort((a, b) => b.timestamp - a.timestamp);
                console.log("Total events processed:", eventsWithTimestamp.length);

                setEvents(eventsWithTimestamp);
            } catch (err) {
                console.error("Failed to fetch history:", err);
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, [address, isConnected, publicClient, refetchTrigger]);

    return {
        events,
        isLoading,
        error,
        refetch,
    };
}
