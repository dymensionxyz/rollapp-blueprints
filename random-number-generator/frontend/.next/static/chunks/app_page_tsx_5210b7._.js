(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/app_page_tsx_5210b7._.js", {

"[project]/app/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>CoinFlipGame)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__ = __turbopack_import__("[project]/node_modules/ethers/lib.esm/ethers.js [app-client] (ecmascript) <export * as ethers>"); // Используем ethers для контрактов
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__ = __turbopack_import__("[project]/node_modules/@mui/material/TextField/TextField.js [app-client] (ecmascript) <export default as TextField>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$RadioGroup$2f$RadioGroup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RadioGroup$3e$__ = __turbopack_import__("[project]/node_modules/@mui/material/RadioGroup/RadioGroup.js [app-client] (ecmascript) <export default as RadioGroup>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$FormControlLabel$2f$FormControlLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControlLabel$3e$__ = __turbopack_import__("[project]/node_modules/@mui/material/FormControlLabel/FormControlLabel.js [app-client] (ecmascript) <export default as FormControlLabel>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Radio$2f$Radio$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Radio$3e$__ = __turbopack_import__("[project]/node_modules/@mui/material/Radio/Radio.js [app-client] (ecmascript) <export default as Radio>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__ = __turbopack_import__("[project]/node_modules/@mui/material/Button/Button.js [app-client] (ecmascript) <export default as Button>");
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
;
;
;
// import CoinFlipABI from './CoinFlipABI.json'; // Путь к ABI вашего контракта
const CoinFlipABI = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_randomnessGenerator",
                type: "address"
            }
        ],
        stateMutability: "nonpayable",
        type: "constructor"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "gameId",
                type: "uint256"
            },
            {
                indexed: false,
                internalType: "address",
                name: "player",
                type: "address"
            },
            {
                indexed: false,
                internalType: "bool",
                name: "won",
                type: "bool"
            }
        ],
        name: "GameCompleted",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "gameId",
                type: "uint256"
            },
            {
                indexed: false,
                internalType: "address",
                name: "player",
                type: "address"
            },
            {
                indexed: false,
                internalType: "enum CoinFlip.CoinSide",
                name: "choice",
                type: "uint8"
            }
        ],
        name: "GameCreated",
        type: "event"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_gameId",
                type: "uint256"
            }
        ],
        name: "completeGame",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "enum CoinFlip.CoinSide",
                name: "choice",
                type: "uint8"
            }
        ],
        name: "createGame",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [],
        name: "gameId",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        name: "games",
        outputs: [
            {
                internalType: "address",
                name: "player",
                type: "address"
            },
            {
                internalType: "enum CoinFlip.CoinSide",
                name: "playerChoice",
                type: "uint8"
            },
            {
                internalType: "uint256",
                name: "randomnessId",
                type: "uint256"
            },
            {
                internalType: "enum CoinFlip.GameStatus",
                name: "status",
                type: "uint8"
            },
            {
                internalType: "bool",
                name: "won",
                type: "bool"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_gameId",
                type: "uint256"
            }
        ],
        name: "getGameResult",
        outputs: [
            {
                internalType: "address",
                name: "player",
                type: "address"
            },
            {
                internalType: "enum CoinFlip.CoinSide",
                name: "playerChoice",
                type: "uint8"
            },
            {
                internalType: "enum CoinFlip.GameStatus",
                name: "status",
                type: "uint8"
            },
            {
                internalType: "bool",
                name: "won",
                type: "bool"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "randomnessGenerator",
        outputs: [
            {
                internalType: "contract RandomnessGenerator",
                name: "",
                type: "address"
            }
        ],
        stateMutability: "view",
        type: "function"
    }
];
function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
function CoinFlipGame() {
    _s();
    const [bet, setBet] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [side, setSide] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('heads');
    const [balance, setBalance] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(100);
    const [isFlipping, setIsFlipping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [provider, setProvider] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // Поставим any, чтобы не было проблем с типами
    const [signer, setSigner] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [coinFlipContract, setCoinFlipContract] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [connected, setConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const CONTRACT_ADDRESS = '0xb590e26c1f5F24a9ff29F3e7D24eC7eba2ab05d4'; // Введите адрес задеплоенного контракта
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CoinFlipGame.useEffect": ()=>{
            if (window.ethereum) {
                const initWeb3 = {
                    "CoinFlipGame.useEffect.initWeb3": async ()=>{
                        const ethereum = window.ethereum;
                        // Проверка на доступность MetaMask
                        if (typeof ethereum !== 'undefined') {
                            try {
                                const web3Provider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].BrowserProvider(ethereum);
                                const network = await web3Provider.getNetwork();
                                console.log('Connected to network:', network.name, 'with chainId', network.chainId);
                                const userSigner = await web3Provider.getSigner();
                                const contract = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(CONTRACT_ADDRESS, CoinFlipABI, userSigner);
                                setProvider(web3Provider);
                                setSigner(userSigner);
                                setCoinFlipContract(contract);
                                setConnected(true);
                            } catch (err) {
                                console.error('Failed to connect to MetaMask', err);
                                setError('Failed to connect to MetaMask');
                            }
                        } else {
                            setError('Please install MetaMask');
                        }
                    }
                }["CoinFlipGame.useEffect.initWeb3"];
                initWeb3();
            } else {
                setError('Please install MetaMask');
            }
        }
    }["CoinFlipGame.useEffect"], []);
    const flipCoin = async ()=>{
        console.log("flipping the coin");
        if (!connected) {
            setError('Please connect to MetaMask');
            return;
        }
        if (bet > balance) {
            setError('Insufficient balance for this bet');
            return;
        }
        setError('');
        setIsFlipping(true);
        setResult(null);
        try {
            const currentNonce = await provider.getTransactionCount(signer.address, "latest");
            const sideEnum = side === 'heads' ? 0 : 1; // 0 - HEADS, 1 - TAILS
            const tx = await coinFlipContract.createGame(sideEnum);
            await tx.wait();
            const gameId = await coinFlipContract.gameId();
            console.log('Game created with ID:', gameId);
            await sleep(1500);
            setTimeout(async ()=>{
                await completeGame(gameId);
            }, 5000);
        } catch (err) {
            console.error('Error flipping the coin:', err);
            setIsFlipping(false);
            setError('Error interacting with the contract');
        }
    };
    const completeGame = async (gameId)=>{
        console.log(`completing the game with ID:${gameId}`);
        try {
            const currentNonce = await provider.getTransactionCount(signer.address, "latest");
            const tx = await coinFlipContract.completeGame(gameId, {
                nonce: currentNonce
            });
            await tx.wait();
            const gameResult = await coinFlipContract.getGameResult(gameId);
            console.log(gameResult);
            if (gameResult.status == 0) {
                throw `Game wasn't finished.`;
            }
            const didWin = gameResult.won;
            const playerChoice = gameResult.playerChoice === 0 ? 'heads' : 'tails';
            const flipResult = didWin ? playerChoice : playerChoice === 'heads' ? 'tails' : 'heads';
            setResult(flipResult);
            setIsFlipping(false);
            // Обновляем баланс
            if (didWin) {
                setBalance(balance + bet);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`You won $${bet}. Your new balance is $${balance + bet}.`);
            } else {
                setBalance(balance - bet);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`You lost $${bet}. Your new balance is $${balance - bet}.`);
            }
        } catch (err) {
            console.error('Error completing game:', err);
            setIsFlipping(false);
            setError('Error completing the game');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-8 bg-white rounded-lg shadow-xl w-full max-w-md",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-3xl font-bold text-center mb-6",
                    children: "Coin Flip Game"
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 339,
                    columnNumber: 11
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-red-500 text-center mb-4",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 341,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 text-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        className: "w-32 h-32 rounded-full bg-yellow-400 mx-auto flex items-center justify-center",
                        animate: {
                            rotateY: isFlipping ? 1800 : 0,
                            scale: isFlipping ? 1.2 : 1
                        },
                        transition: {
                            duration: 2
                        },
                        children: result && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-2xl font-bold",
                            children: result === 'heads' ? 'Heads' : 'Tails'
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 352,
                            columnNumber: 26
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 344,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 343,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                                label: "Your Bet ($)",
                                type: "number",
                                value: bet,
                                onChange: (e)=>setBet(Math.max(1, parseInt(e.target.value))),
                                fullWidth: true,
                                inputProps: {
                                    min: 1,
                                    max: balance
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 358,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 357,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$RadioGroup$2f$RadioGroup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RadioGroup$3e$__["RadioGroup"], {
                            value: side,
                            onChange: (e)=>setSide(e.target.value),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$FormControlLabel$2f$FormControlLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControlLabel$3e$__["FormControlLabel"], {
                                    value: "heads",
                                    control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Radio$2f$Radio$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Radio$3e$__["Radio"], {}, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 369,
                                        columnNumber: 56
                                    }, void 0),
                                    label: "Heads"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 369,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$FormControlLabel$2f$FormControlLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControlLabel$3e$__["FormControlLabel"], {
                                    value: "tails",
                                    control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Radio$2f$Radio$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Radio$3e$__["Radio"], {}, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 370,
                                        columnNumber: 56
                                    }, void 0),
                                    label: "Tails"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 370,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 368,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                            variant: "contained",
                            onClick: flipCoin,
                            disabled: isFlipping,
                            fullWidth: true,
                            children: isFlipping ? 'Flipping...' : 'Flip Coin'
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 373,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center text-xl font-semibold",
                            children: [
                                "Balance: $",
                                balance
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 377,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 356,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 338,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 337,
        columnNumber: 7
    }, this);
}
_s(CoinFlipGame, "WVQ0O/W5uiU4yuPGDiGL7Y7AayI=");
_c = CoinFlipGame;
var _c;
__turbopack_refresh__.register(_c, "CoinFlipGame");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=app_page_tsx_5210b7._.js.map