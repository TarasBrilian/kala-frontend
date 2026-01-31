import { sepolia } from "wagmi/chains";
import { KalaMoney } from "@/abis/KalaMoneyAbi";

export const KALA_MONEY_ADDRESS = {
    [sepolia.id]: "0xAddress",
} as const;

export const kalaMoneyConfig = {
    address: KALA_MONEY_ADDRESS[sepolia.id] as `0x${string}`,
    abi: KalaMoney,
    chainId: sepolia.id,
} as const;
