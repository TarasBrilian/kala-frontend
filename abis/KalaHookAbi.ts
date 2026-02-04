export const KalaHookAbi = [
    {
        "type": "constructor",
        "inputs": [
            {
                "name": "_poolManager",
                "type": "address",
                "internalType": "contract IPoolManager"
            },
            {
                "name": "_kalaOracle",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_ethUsdFeed",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_kalaToken",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "BPS",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },

    {
        "type": "function",
        "name": "PRECISION",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "afterAddLiquidity",
        "inputs": [
            {
                "name": "sender",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "key",
                "type": "tuple",
                "internalType": "struct PoolKey",
                "components": [
                    {
                        "name": "currency0",
                        "type": "address",
                        "internalType": "Currency"
                    },
                    {
                        "name": "currency1",
                        "type": "address",
                        "internalType": "Currency"
                    },
                    {
                        "name": "fee",
                        "type": "uint24",
                        "internalType": "uint24"
                    },
                    {
                        "name": "tickSpacing",
                        "type": "int24",
                        "internalType": "int24"
                    },
                    {
                        "name": "hooks",
                        "type": "address",
                        "internalType": "contract IHooks"
                    }
                ]
            },
            {
                "name": "params",
                "type": "tuple",
                "internalType": "struct ModifyLiquidityParams",
                "components": [
                    {
                        "name": "tickLower",
                        "type": "int24",
                        "internalType": "int24"
                    },
                    {
                        "name": "tickUpper",
                        "type": "int24",
                        "internalType": "int24"
                    },
                    {
                        "name": "liquidityDelta",
                        "type": "int256",
                        "internalType": "int256"
                    },
                    {
                        "name": "salt",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ]
            },
            {
                "name": "delta",
                "type": "int256",
                "internalType": "BalanceDelta"
            },
            {
                "name": "feesAccrued",
                "type": "int256",
                "internalType": "BalanceDelta"
            },
            {
                "name": "hookData",
                "type": "bytes",
                "internalType": "bytes"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bytes4",
                "internalType": "bytes4"
            },
            {
                "name": "",
                "type": "int256",
                "internalType": "BalanceDelta"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "afterDonate",
        "inputs": [
            {
                "name": "sender",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "key",
                "type": "tuple",
                "internalType": "struct PoolKey",
                "components": [
                    {
                        "name": "currency0",
                        "type": "address",
                        "internalType": "Currency"
                    },
                    {
                        "name": "currency1",
                        "type": "address",
                        "internalType": "Currency"
                    },
                    {
                        "name": "fee",
                        "type": "uint24",
                        "internalType": "uint24"
                    },
                    {
                        "name": "tickSpacing",
                        "type": "int24",
                        "internalType": "int24"
                    },
                    {
                        "name": "hooks",
                        "type": "address",
                        "internalType": "contract IHooks"
                    }
                ]
            },
            {
                "name": "amount0",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amount1",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "hookData",
                "type": "bytes",
                "internalType": "bytes"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bytes4",
                "internalType": "bytes4"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "afterInitialize",
        "inputs": [
            {
                "name": "sender",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "key",
                "type": "tuple",
                "internalType": "struct PoolKey",
                "components": [
                    {
                        "name": "currency0",
                        "type": "address",
                        "internalType": "Currency"
                    },
                    {
                        "name": "currency1",
                        "type": "address",
                        "internalType": "Currency"
                    },
                    {
                        "name": "fee",
                        "type": "uint24",
                        "internalType": "uint24"
                    },
                    {
                        "name": "tickSpacing",
                        "type": "int24",
                        "internalType": "int24"
                    },
                    {
                        "name": "hooks",
                        "type": "address",
                        "internalType": "contract IHooks"
                    }
                ]
            },
            {
                "name": "sqrtPriceX96",
                "type": "uint160",
                "internalType": "uint160"
            },
            {
                "name": "tick",
                "type": "int24",
                "internalType": "int24"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bytes4",
                "internalType": "bytes4"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "afterRemoveLiquidity",
        "inputs": [
            {
                "name": "sender",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "key",
                "type": "tuple",
                "internalType": "struct PoolKey",
                "components": [
                    {
                        "name": "currency0",
                        "type": "address",
                        "internalType": "Currency"
                    },
                    {
                        "name": "currency1",
                        "type": "address",
                        "internalType": "Currency"
                    },
                    {
                        "name": "fee",
                        "type": "uint24",
                        "internalType": "uint24"
                    },
                    {
                        "name": "tickSpacing",
                        "type": "int24",
                        "internalType": "int24"
                    },
                    {
                        "name": "hooks",
                        "type": "address",
                        "internalType": "contract IHooks"
                    }
                ]
            },
            {
                "name": "params",
                "type": "tuple",
                "internalType": "struct ModifyLiquidityParams",
                "components": [
                    {
                        "name": "tickLower",
                        "type": "int24",
                        "internalType": "int24"
                    },
                    {
                        "name": "tickUpper",
                        "type": "int24",
                        "internalType": "int24"
                    },
                    {
                        "name": "liquidityDelta",
                        "type": "int256",
                        "internalType": "int256"
                    },
                    {
                        "name": "salt",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ]
            },
            {
                "name": "delta",
                "type": "int256",
                "internalType": "BalanceDelta"
            },
            {
                "name": "feesAccrued",
                "type": "int256",
                "internalType": "BalanceDelta"
            },
            {
                "name": "hookData",
                "type": "bytes",
                "internalType": "bytes"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bytes4",
                "internalType": "bytes4"
            },
            {
                "name": "",
                "type": "int256",
                "internalType": "BalanceDelta"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "afterSwap",
        "inputs": [
            {
                "name": "sender",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "key",
                "type": "tuple",
                "internalType": "struct PoolKey",
                "components": [
                    {
                        "name": "currency0",
                        "type": "address",
                        "internalType": "Currency"
                    },
                    {
                        "name": "currency1",
                        "type": "address",
                        "internalType": "Currency"
                    },
                    {
                        "name": "fee",
                        "type": "uint24",
                        "internalType": "uint24"
                    },
                    {
                        "name": "tickSpacing",
                        "type": "int24",
                        "internalType": "int24"
                    },
                    {
                        "name": "hooks",
                        "type": "address",
                        "internalType": "contract IHooks"
                    }
                ]
            },
            {
                "name": "params",
                "type": "tuple",
                "internalType": "struct SwapParams",
                "components": [
                    {
                        "name": "zeroForOne",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "amountSpecified",
                        "type": "int256",
                        "internalType": "int256"
                    },
                    {
                        "name": "sqrtPriceLimitX96",
                        "type": "uint160",
                        "internalType": "uint160"
                    }
                ]
            },
            {
                "name": "delta",
                "type": "int256",
                "internalType": "BalanceDelta"
            },
            {
                "name": "hookData",
                "type": "bytes",
                "internalType": "bytes"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bytes4",
                "internalType": "bytes4"
            },
            {
                "name": "",
                "type": "int128",
                "internalType": "int128"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "beforeAddLiquidity",
        "inputs": [
            {
                "name": "sender",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "key",
                "type": "tuple",
                "internalType": "struct PoolKey",
                "components": [
                    {
                        "name": "currency0",
                        "type": "address",
                        "internalType": "Currency"
                    },
                    {
                        "name": "currency1",
                        "type": "address",
                        "internalType": "Currency"
                    },
                    {
                        "name": "fee",
                        "type": "uint24",
                        "internalType": "uint24"
                    },
                    {
                        "name": "tickSpacing",
                        "type": "int24",
                        "internalType": "int24"
                    },
                    {
                        "name": "hooks",
                        "type": "address",
                        "internalType": "contract IHooks"
                    }
                ]
            },
            {
                "name": "params",
                "type": "tuple",
                "internalType": "struct ModifyLiquidityParams",
                "components": [
                    {
                        "name": "tickLower",
                        "type": "int24",
                        "internalType": "int24"
                    },
                    {
                        "name": "tickUpper",
                        "type": "int24",
                        "internalType": "int24"
                    },
                    {
                        "name": "liquidityDelta",
                        "type": "int256",
                        "internalType": "int256"
                    },
                    {
                        "name": "salt",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ]
            },
            {
                "name": "hookData",
                "type": "bytes",
                "internalType": "bytes"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bytes4",
                "internalType": "bytes4"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "beforeDonate",
        "inputs": [
            {
                "name": "sender",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "key",
                "type": "tuple",
                "internalType": "struct PoolKey",
                "components": [
                    {
                        "name": "currency0",
                        "type": "address",
                        "internalType": "Currency"
                    },
                    {
                        "name": "currency1",
                        "type": "address",
                        "internalType": "Currency"
                    },
                    {
                        "name": "fee",
                        "type": "uint24",
                        "internalType": "uint24"
                    },
                    {
                        "name": "tickSpacing",
                        "type": "int24",
                        "internalType": "int24"
                    },
                    {
                        "name": "hooks",
                        "type": "address",
                        "internalType": "contract IHooks"
                    }
                ]
            },
            {
                "name": "amount0",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amount1",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "hookData",
                "type": "bytes",
                "internalType": "bytes"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bytes4",
                "internalType": "bytes4"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "beforeInitialize",
        "inputs": [
            {
                "name": "sender",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "key",
                "type": "tuple",
                "internalType": "struct PoolKey",
                "components": [
                    {
                        "name": "currency0",
                        "type": "address",
                        "internalType": "Currency"
                    },
                    {
                        "name": "currency1",
                        "type": "address",
                        "internalType": "Currency"
                    },
                    {
                        "name": "fee",
                        "type": "uint24",
                        "internalType": "uint24"
                    },
                    {
                        "name": "tickSpacing",
                        "type": "int24",
                        "internalType": "int24"
                    },
                    {
                        "name": "hooks",
                        "type": "address",
                        "internalType": "contract IHooks"
                    }
                ]
            },
            {
                "name": "sqrtPriceX96",
                "type": "uint160",
                "internalType": "uint160"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bytes4",
                "internalType": "bytes4"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "beforeRemoveLiquidity",
        "inputs": [
            {
                "name": "sender",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "key",
                "type": "tuple",
                "internalType": "struct PoolKey",
                "components": [
                    {
                        "name": "currency0",
                        "type": "address",
                        "internalType": "Currency"
                    },
                    {
                        "name": "currency1",
                        "type": "address",
                        "internalType": "Currency"
                    },
                    {
                        "name": "fee",
                        "type": "uint24",
                        "internalType": "uint24"
                    },
                    {
                        "name": "tickSpacing",
                        "type": "int24",
                        "internalType": "int24"
                    },
                    {
                        "name": "hooks",
                        "type": "address",
                        "internalType": "contract IHooks"
                    }
                ]
            },
            {
                "name": "params",
                "type": "tuple",
                "internalType": "struct ModifyLiquidityParams",
                "components": [
                    {
                        "name": "tickLower",
                        "type": "int24",
                        "internalType": "int24"
                    },
                    {
                        "name": "tickUpper",
                        "type": "int24",
                        "internalType": "int24"
                    },
                    {
                        "name": "liquidityDelta",
                        "type": "int256",
                        "internalType": "int256"
                    },
                    {
                        "name": "salt",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ]
            },
            {
                "name": "hookData",
                "type": "bytes",
                "internalType": "bytes"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bytes4",
                "internalType": "bytes4"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "beforeSwap",
        "inputs": [
            {
                "name": "sender",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "key",
                "type": "tuple",
                "internalType": "struct PoolKey",
                "components": [
                    {
                        "name": "currency0",
                        "type": "address",
                        "internalType": "Currency"
                    },
                    {
                        "name": "currency1",
                        "type": "address",
                        "internalType": "Currency"
                    },
                    {
                        "name": "fee",
                        "type": "uint24",
                        "internalType": "uint24"
                    },
                    {
                        "name": "tickSpacing",
                        "type": "int24",
                        "internalType": "int24"
                    },
                    {
                        "name": "hooks",
                        "type": "address",
                        "internalType": "contract IHooks"
                    }
                ]
            },
            {
                "name": "params",
                "type": "tuple",
                "internalType": "struct SwapParams",
                "components": [
                    {
                        "name": "zeroForOne",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "amountSpecified",
                        "type": "int256",
                        "internalType": "int256"
                    },
                    {
                        "name": "sqrtPriceLimitX96",
                        "type": "uint160",
                        "internalType": "uint160"
                    }
                ]
            },
            {
                "name": "hookData",
                "type": "bytes",
                "internalType": "bytes"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bytes4",
                "internalType": "bytes4"
            },
            {
                "name": "",
                "type": "int256",
                "internalType": "BeforeSwapDelta"
            },
            {
                "name": "",
                "type": "uint24",
                "internalType": "uint24"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "ethUsdFeed",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "contract IChainlinkFeed"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getHookPermissions",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "tuple",
                "internalType": "struct Hooks.Permissions",
                "components": [
                    {
                        "name": "beforeInitialize",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "afterInitialize",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "beforeAddLiquidity",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "afterAddLiquidity",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "beforeRemoveLiquidity",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "afterRemoveLiquidity",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "beforeSwap",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "afterSwap",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "beforeDonate",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "afterDonate",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "beforeSwapReturnDelta",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "afterSwapReturnDelta",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "afterAddLiquidityReturnDelta",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "afterRemoveLiquidityReturnDelta",
                        "type": "bool",
                        "internalType": "bool"
                    }
                ]
            }
        ],
        "stateMutability": "pure"
    },
    {
        "type": "function",
        "name": "kalaOracle",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "contract KalaOracle"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "kalaToken",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "poolManager",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "contract IPoolManager"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "OracleCheck",
        "inputs": [
            {
                "name": "oraclePriceWad",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "poolPriceWad",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "deviationBps",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "error",
        "name": "HookNotImplemented",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidFeed",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidOracle",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidToken",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NegativePrice",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotPoolManager",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PriceDeviationTooHigh",
        "inputs": [
            {
                "name": "spotPrice",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "targetPrice",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "deviation",
                "type": "uint256",
                "internalType": "uint256"
            }
        ]
    },
    {
        "type": "error",
        "name": "ZeroDenominator",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ZeroDenominator",
        "inputs": []
    }
] as const