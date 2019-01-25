var configData = {
    "ETH":{
        "testNet":{
            "web3": "https://ropsten.infura.io/v3/5a89dae544414c24951c3144d47dc84d",        //web接口
            "NodeUriWebSocketIp": "ws://47.104.81.20:9000",                                 //全节点IP
            "NetMagic":"527465737419990331",                                                //网络号
            "trinityContractAddress": "0x5eC045d849539688e6Ab70946c94834AEED84d74",         //Trinity状态通道逻辑合约地址
            "trinityDataContractAddress": "0xD634eFCA91cA716A46C3C603e29200b3907e4524",     //Trinity状态通道数据合约地址
            "tncContractAddress": "0x65096f2B7A8dc1592479F1911cd2B98dae4d2218",             //TNC代币合约地址
            "spvPort": 8866,                                                                //SPV端口号
            "nodeWebSocketIp": "ws://47.98.228.81",                                         //任意稳定节点IP,用于获取图的数据
            "delayBlock": 15,                                                               //HTLC延迟块高数(每一跳)
        },
        "mainNet":{
            "web3": "https://mainnet.infura.io/v3/5a89dae544414c24951c3144d47dc84d",        //web接口
            "NodeUriWebSocketIp": "wss://wss.trinity.ink:9000",                             //全节点IP
            "NetMagic": "4061696020030515",                                                 //网络号
            "trinityContractAddress": "0x7A332beF593d6bd6B9d314959295239c46D5C127",         //Trinity状态通道逻辑合约地址
            "trinityDataContractAddress": "0xF8ac6d07e825338720bC7D3ee119B3C88560FaF5",     //Trinity状态通道数据合约地址
            "tncContractAddress": "0x67fbA6D5eed1f20F8454Ab93Aed3a010F36F549d",             //TNC代币合约地址
            "spvPort": 8866,                                                                //SPV端口号
            "nodeWebSocketIp": "ws://39.105.110.25",                                        //任意稳定节点IP,用于获取图的数据
            "delayBlock": 5760,                                                               //HTLC延迟块高数(每一跳)
        },
        "trinityContractAbi": [{                                                            //Trinity状态通道逻辑合约Abi
                "constant": false,
                "inputs": [{
                        "name": "channelId",
                        "type": "bytes32"
                    },
                    {
                        "name": "nonce",
                        "type": "uint256"
                    },
                    {
                        "name": "founder",
                        "type": "address"
                    },
                    {
                        "name": "founderBalance",
                        "type": "uint256"
                    },
                    {
                        "name": "partner",
                        "type": "address"
                    },
                    {
                        "name": "partnerBalance",
                        "type": "uint256"
                    },
                    {
                        "name": "lockHash",
                        "type": "bytes32"
                    },
                    {
                        "name": "secret",
                        "type": "bytes32"
                    },
                    {
                        "name": "closerSignature",
                        "type": "bytes"
                    },
                    {
                        "name": "partnerSignature",
                        "type": "bytes"
                    }
                ],
                "name": "closeChannel",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "channelId",
                        "type": "bytes32"
                    },
                    {
                        "name": "nonce",
                        "type": "uint256"
                    },
                    {
                        "name": "funderAddress",
                        "type": "address"
                    },
                    {
                        "name": "funderAmount",
                        "type": "uint256"
                    },
                    {
                        "name": "partnerAddress",
                        "type": "address"
                    },
                    {
                        "name": "partnerAmount",
                        "type": "uint256"
                    },
                    {
                        "name": "funderSignature",
                        "type": "bytes"
                    },
                    {
                        "name": "partnerSignature",
                        "type": "bytes"
                    }
                ],
                "name": "deposit",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "pause",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "channelId",
                        "type": "bytes32"
                    },
                    {
                        "name": "nonce",
                        "type": "uint256"
                    },
                    {
                        "name": "funder",
                        "type": "address"
                    },
                    {
                        "name": "funderBalance",
                        "type": "uint256"
                    },
                    {
                        "name": "partner",
                        "type": "address"
                    },
                    {
                        "name": "partnerBalance",
                        "type": "uint256"
                    },
                    {
                        "name": "closerSignature",
                        "type": "bytes"
                    },
                    {
                        "name": "partnerSignature",
                        "type": "bytes"
                    }
                ],
                "name": "quickCloseChannel",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                    "name": "_dataContract",
                    "type": "address"
                }],
                "name": "setDataContract",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                    "name": "channelId",
                    "type": "bytes32"
                }],
                "name": "settleTransaction",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "unpause",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "channelId",
                        "type": "bytes32"
                    },
                    {
                        "name": "nonce",
                        "type": "uint256"
                    },
                    {
                        "name": "funderAddress",
                        "type": "address"
                    },
                    {
                        "name": "funderAmount",
                        "type": "uint256"
                    },
                    {
                        "name": "partnerAddress",
                        "type": "address"
                    },
                    {
                        "name": "partnerAmount",
                        "type": "uint256"
                    },
                    {
                        "name": "funderSignature",
                        "type": "bytes"
                    },
                    {
                        "name": "partnerSignature",
                        "type": "bytes"
                    }
                ],
                "name": "updateDeposit",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "channelId",
                        "type": "bytes32"
                    },
                    {
                        "name": "nonce",
                        "type": "uint256"
                    },
                    {
                        "name": "partnerA",
                        "type": "address"
                    },
                    {
                        "name": "updateBalanceA",
                        "type": "uint256"
                    },
                    {
                        "name": "partnerB",
                        "type": "address"
                    },
                    {
                        "name": "updateBalanceB",
                        "type": "uint256"
                    },
                    {
                        "name": "lockHash",
                        "type": "bytes32"
                    },
                    {
                        "name": "secret",
                        "type": "bytes32"
                    },
                    {
                        "name": "signedStringA",
                        "type": "bytes"
                    },
                    {
                        "name": "signedStringB",
                        "type": "bytes"
                    }
                ],
                "name": "updateTransaction",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "channelId",
                        "type": "bytes32"
                    },
                    {
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "name": "receiver",
                        "type": "address"
                    },
                    {
                        "name": "lockTime",
                        "type": "uint256"
                    },
                    {
                        "name": "lockAmount",
                        "type": "uint256"
                    },
                    {
                        "name": "lockHash",
                        "type": "bytes32"
                    },
                    {
                        "name": "partnerAsignature",
                        "type": "bytes"
                    },
                    {
                        "name": "partnerBsignature",
                        "type": "bytes"
                    },
                    {
                        "name": "secret",
                        "type": "bytes32"
                    }
                ],
                "name": "withdraw",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "channelId",
                        "type": "bytes32"
                    },
                    {
                        "name": "nonce",
                        "type": "uint256"
                    },
                    {
                        "name": "funder",
                        "type": "address"
                    },
                    {
                        "name": "funderBalance",
                        "type": "uint256"
                    },
                    {
                        "name": "partner",
                        "type": "address"
                    },
                    {
                        "name": "partnerBalance",
                        "type": "uint256"
                    },
                    {
                        "name": "closerSignature",
                        "type": "bytes"
                    },
                    {
                        "name": "partnerSignature",
                        "type": "bytes"
                    }
                ],
                "name": "withdrawBalance",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "channelId",
                        "type": "bytes32"
                    },
                    {
                        "name": "lockHash",
                        "type": "bytes32"
                    }
                ],
                "name": "withdrawSettle",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [{
                        "indexed": false,
                        "name": "channleId",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "name": "partnerA",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "amountA",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "name": "partnerB",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "amountB",
                        "type": "uint256"
                    }
                ],
                "name": "Settle",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [{
                        "indexed": false,
                        "name": "channleId",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "name": "invoker",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "hashLock",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "name": "secret",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "name": "paymentBlock",
                        "type": "uint256"
                    }
                ],
                "name": "Withdraw",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [{
                        "indexed": false,
                        "name": "channleId",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "name": "invoker",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "hashLock",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "name": "lockAmount",
                        "type": "uint256"
                    }
                ],
                "name": "WithdrawSettle",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [{
                        "indexed": false,
                        "name": "channleId",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "name": "partnerA",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "amountA",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "name": "partnerB",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "amountB",
                        "type": "uint256"
                    }
                ],
                "name": "UpdateTransaction",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [{
                        "indexed": false,
                        "name": "channleId",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "name": "invoker",
                        "type": "address"
                    }
                ],
                "name": "WithdrawUpdate",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [{
                        "indexed": false,
                        "name": "channleId",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "name": "invoker",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "nonce",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "name": "blockNumber",
                        "type": "uint256"
                    }
                ],
                "name": "CloseChannel",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [{
                        "indexed": false,
                        "name": "channleId",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "name": "closer",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "amount1",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "name": "partner",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "amount2",
                        "type": "uint256"
                    }
                ],
                "name": "WithdrawBalance",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [{
                        "indexed": false,
                        "name": "channleId",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "name": "closer",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "amount1",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "name": "partner",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "amount2",
                        "type": "uint256"
                    }
                ],
                "name": "QuickCloseChannel",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [{
                        "indexed": false,
                        "name": "channleId",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "name": "partnerA",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "amountA",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "name": "partnerB",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "amountB",
                        "type": "uint256"
                    }
                ],
                "name": "Deposit",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [{
                        "indexed": false,
                        "name": "channleId",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "name": "partnerA",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "amountA",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "name": "partnerB",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "amountB",
                        "type": "uint256"
                    }
                ],
                "name": "UpdateDeposit",
                "type": "event"
            },
            {
                "inputs": [{
                    "name": "_dataAddress",
                    "type": "address"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "fallback"
            },
            {
                "constant": true,
                "inputs": [{
                    "name": "channelId",
                    "type": "bytes32"
                }],
                "name": "getChannelBalance",
                "outputs": [{
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [{
                    "name": "channelId",
                    "type": "bytes32"
                }],
                "name": "getChannelStatus",
                "outputs": [{
                    "name": "",
                    "type": "uint8"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [{
                        "name": "channelId",
                        "type": "bytes32"
                    },
                    {
                        "name": "lockHash",
                        "type": "bytes32"
                    }
                ],
                "name": "getHtlcTimeoutBlock",
                "outputs": [{
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [{
                    "name": "channelId",
                    "type": "bytes32"
                }],
                "name": "getTimeoutBlock",
                "outputs": [{
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "owner",
                "outputs": [{
                    "name": "",
                    "type": "address"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "trinityDataContract",
                "outputs": [{
                    "name": "",
                    "type": "address"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }
        ],  
        "tncContractAbi": [{                                                            //ERC20代币通用合约Abi
                "constant": true,
                "inputs": [],
                "name": "mintingFinished",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "name",
                "outputs": [{
                    "name": "",
                    "type": "string"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "totalSupply",
                "outputs": [{
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "decimals",
                "outputs": [{
                    "name": "",
                    "type": "uint8"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "cap",
                "outputs": [{
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "unpause",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_amount",
                        "type": "uint256"
                    }
                ],
                "name": "mint",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                    "name": "_value",
                    "type": "uint256"
                }],
                "name": "burn",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "paused",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "name": "_subtractedValue",
                        "type": "uint256"
                    }
                ],
                "name": "decreaseApproval",
                "outputs": [{
                    "name": "success",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [{
                    "name": "_owner",
                    "type": "address"
                }],
                "name": "balanceOf",
                "outputs": [{
                    "name": "balance",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "finishMinting",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "pause",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "owner",
                "outputs": [{
                    "name": "",
                    "type": "address"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "symbol",
                "outputs": [{
                    "name": "",
                    "type": "string"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [{
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "name": "_addedValue",
                        "type": "uint256"
                    }
                ],
                "name": "increaseApproval",
                "outputs": [{
                    "name": "success",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [{
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "name": "_spender",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [{
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{
                    "name": "newOwner",
                    "type": "address"
                }],
                "name": "transferOwnership",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [{
                        "indexed": true,
                        "name": "burner",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Burn",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [],
                "name": "Pause",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [],
                "name": "Unpause",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [{
                        "indexed": true,
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "Mint",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [],
                "name": "MintFinished",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [{
                        "indexed": true,
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [{
                        "indexed": true,
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            }
        ]
    },
    "NEO":{
        "testNet": {
            "NodeRpcUri": "http://neoapi-testnet.trinity.ink:21332",
            "NetMagic": "195378745719990331",
            "spvPort": 8766,
            "nodeWebSocketIp": "ws://47.254.39.10"                                         //任意稳定节点IP,用于获取图的数据
        },
        "mainNet": {
            "NodeRpcUri": "https://neoapi.trinity.ink",
            "NetMagic": "763040120030515",
            "spvPort": 8766,
            "nodeWebSocketIp": "ws://39.105.110.25"                                         //任意稳定节点IP,用于获取图的数据
        }
    }
} 