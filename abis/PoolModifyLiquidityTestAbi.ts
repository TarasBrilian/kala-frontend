export const PoolModifyLiquidityTestAbi = [
    {
        "type": "constructor",
        "inputs": [
            { "name": "_manager", "type": "address", "internalType": "contract IPoolManager" }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "modifyLiquidity",
        "inputs": [
            {
                "name": "key",
                "type": "tuple",
                "internalType": "struct PoolKey",
                "components": [
                    { "name": "currency0", "type": "address", "internalType": "Currency" },
                    { "name": "currency1", "type": "address", "internalType": "Currency" },
                    { "name": "fee", "type": "uint24", "internalType": "uint24" },
                    { "name": "tickSpacing", "type": "int24", "internalType": "int24" },
                    { "name": "hooks", "type": "address", "internalType": "contract IHooks" }
                ]
            },
            {
                "name": "params",
                "type": "tuple",
                "internalType": "struct IPoolManager.ModifyLiquidityParams",
                "components": [
                    { "name": "tickLower", "type": "int24", "internalType": "int24" },
                    { "name": "tickUpper", "type": "int24", "internalType": "int24" },
                    { "name": "liquidityDelta", "type": "int256", "internalType": "int256" },
                    { "name": "salt", "type": "bytes32", "internalType": "bytes32" }
                ]
            },
            { "name": "hookData", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [
            { "name": "delta0", "type": "int256", "internalType": "int256" },
            { "name": "delta1", "type": "int256", "internalType": "int256" }
        ],
        "stateMutability": "payable"
    }
] as const;
