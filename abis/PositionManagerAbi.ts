export const PositionManagerAbi = [
    {
        type: "function",
        name: "modifyLiquidities",
        inputs: [
            { name: "unlockData", type: "bytes", internalType: "bytes" },
            { name: "deadline", type: "uint256", internalType: "uint256" }
        ],
        outputs: [],
        stateMutability: "payable"
    },
    {
        type: "function",
        name: "nextTokenId",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "positionInfo",
        inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
        outputs: [{ name: "info", type: "bytes32", internalType: "PositionInfo" }],
        stateMutability: "view"
    }
] as const;

// Actions enum from Uniswap V4
export const Actions = {
    INCREASE_LIQUIDITY: 0x00,
    DECREASE_LIQUIDITY: 0x01,
    MINT_POSITION: 0x02,
    BURN_POSITION: 0x03,
    INCREASE_LIQUIDITY_FROM_DELTAS: 0x04,
    MINT_POSITION_FROM_DELTAS: 0x05,
    SWAP_EXACT_IN_SINGLE: 0x06,
    SWAP_EXACT_IN: 0x07,
    SWAP_EXACT_OUT_SINGLE: 0x08,
    SWAP_EXACT_OUT: 0x09,
    SETTLE: 0x0b,
    SETTLE_ALL: 0x0c,
    SETTLE_PAIR: 0x0d,
    TAKE: 0x0e,
    TAKE_ALL: 0x0f,
    TAKE_PORTION: 0x10,
    TAKE_PAIR: 0x11,
    CLOSE_CURRENCY: 0x12,
    CLEAR_OR_TAKE: 0x13,
    SWEEP: 0x14,
    WRAP: 0x15,
    UNWRAP: 0x16,
} as const;
