"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/page",{

/***/ "(app-pages-browser)/./app/page.tsx":
/*!**********************!*\
  !*** ./app/page.tsx ***!
  \**********************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ Home; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var components_Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! components/Button */ \"(app-pages-browser)/./components/Button.tsx\");\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! wagmi */ \"(app-pages-browser)/./node_modules/wagmi/dist/esm/hooks/useAccount.js\");\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! wagmi */ \"(app-pages-browser)/./node_modules/wagmi/dist/esm/hooks/useDisconnect.js\");\n/* harmony import */ var _privy_io_react_auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @privy-io/react-auth */ \"(app-pages-browser)/./node_modules/@privy-io/react-auth/dist/esm/privy-context-1qVRD8ny.mjs\");\n/* harmony import */ var lib_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lib/utils */ \"(app-pages-browser)/./lib/utils.ts\");\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\n\n\nfunction Home() {\n    _s();\n    const { ready, authenticated, login, connectWallet, logout } = (0,_privy_io_react_auth__WEBPACK_IMPORTED_MODULE_3__.j)();\n    const { address, isConnected } = (0,wagmi__WEBPACK_IMPORTED_MODULE_4__.useAccount)();\n    const { disconnect } = (0,wagmi__WEBPACK_IMPORTED_MODULE_5__.useDisconnect)();\n    if (!ready) return null;\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"min-h-screen bg-gradient-to-b from-purple-50 to-white\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"header\", {\n                className: \"bg-white/70 backdrop-blur-sm shadow-sm\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"nav\", {\n                    className: \"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\",\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"flex justify-end items-center h-16 gap-4\",\n                        children: [\n                            ready && !authenticated && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"flex items-center gap-4\",\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(components_Button__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n                                        onClick: login,\n                                        cta: \"Login\"\n                                    }, void 0, false, {\n                                        fileName: \"/home/arpit/HDD/Product/ETHGlobal/eth-game/frontend/app/page.tsx\",\n                                        lineNumber: 23,\n                                        columnNumber: 17\n                                    }, this),\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(components_Button__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n                                        onClick: connectWallet,\n                                        cta: \"Connect Wallet\",\n                                        variant: \"secondary\"\n                                    }, void 0, false, {\n                                        fileName: \"/home/arpit/HDD/Product/ETHGlobal/eth-game/frontend/app/page.tsx\",\n                                        lineNumber: 24,\n                                        columnNumber: 17\n                                    }, this)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"/home/arpit/HDD/Product/ETHGlobal/eth-game/frontend/app/page.tsx\",\n                                lineNumber: 22,\n                                columnNumber: 15\n                            }, this),\n                            isConnected && address && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"rounded-xl bg-purple-100 px-4 py-2 font-mono text-purple-900 border border-purple-200\",\n                                        children: (0,lib_utils__WEBPACK_IMPORTED_MODULE_2__.shorten)(address)\n                                    }, void 0, false, {\n                                        fileName: \"/home/arpit/HDD/Product/ETHGlobal/eth-game/frontend/app/page.tsx\",\n                                        lineNumber: 29,\n                                        columnNumber: 17\n                                    }, this),\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(components_Button__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n                                        onClick: disconnect,\n                                        cta: \"Disconnect\",\n                                        variant: \"secondary\"\n                                    }, void 0, false, {\n                                        fileName: \"/home/arpit/HDD/Product/ETHGlobal/eth-game/frontend/app/page.tsx\",\n                                        lineNumber: 32,\n                                        columnNumber: 17\n                                    }, this)\n                                ]\n                            }, void 0, true)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/home/arpit/HDD/Product/ETHGlobal/eth-game/frontend/app/page.tsx\",\n                        lineNumber: 20,\n                        columnNumber: 11\n                    }, this)\n                }, void 0, false, {\n                    fileName: \"/home/arpit/HDD/Product/ETHGlobal/eth-game/frontend/app/page.tsx\",\n                    lineNumber: 19,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"/home/arpit/HDD/Product/ETHGlobal/eth-game/frontend/app/page.tsx\",\n                lineNumber: 18,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"main\", {\n                className: \"h-[calc(100vh-64px)]\"\n            }, void 0, false, {\n                fileName: \"/home/arpit/HDD/Product/ETHGlobal/eth-game/frontend/app/page.tsx\",\n                lineNumber: 39,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/home/arpit/HDD/Product/ETHGlobal/eth-game/frontend/app/page.tsx\",\n        lineNumber: 17,\n        columnNumber: 5\n    }, this);\n}\n_s(Home, \"ql3KFaB+YOJQvUwRS0YQPPXhUmc=\", false, function() {\n    return [\n        _privy_io_react_auth__WEBPACK_IMPORTED_MODULE_3__.j,\n        wagmi__WEBPACK_IMPORTED_MODULE_4__.useAccount,\n        wagmi__WEBPACK_IMPORTED_MODULE_5__.useDisconnect\n    ];\n});\n_c = Home;\nvar _c;\n$RefreshReg$(_c, \"Home\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2FwcC9wYWdlLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFFdUM7QUFDUztBQUNGO0FBQ1o7QUFHbkIsU0FBU0s7O0lBQ3RCLE1BQU0sRUFBQ0MsS0FBSyxFQUFFQyxhQUFhLEVBQUVDLEtBQUssRUFBRUMsYUFBYSxFQUFFQyxNQUFNLEVBQUMsR0FBR1AsdURBQVFBO0lBQ3JFLE1BQU0sRUFBQ1EsT0FBTyxFQUFFQyxXQUFXLEVBQUMsR0FBR1gsaURBQVVBO0lBQ3pDLE1BQU0sRUFBQ1ksVUFBVSxFQUFDLEdBQUdYLG9EQUFhQTtJQUVsQyxJQUFJLENBQUNJLE9BQU8sT0FBTztJQUVuQixxQkFDRSw4REFBQ1E7UUFBSUMsV0FBVTs7MEJBQ2IsOERBQUNDO2dCQUFPRCxXQUFVOzBCQUNoQiw0RUFBQ0U7b0JBQUlGLFdBQVU7OEJBQ2IsNEVBQUNEO3dCQUFJQyxXQUFVOzs0QkFDWlQsU0FBUyxDQUFDQywrQkFDVCw4REFBQ087Z0NBQUlDLFdBQVU7O2tEQUNiLDhEQUFDZix5REFBTUE7d0NBQUNrQixTQUFTVjt3Q0FBT1csS0FBSTs7Ozs7O2tEQUM1Qiw4REFBQ25CLHlEQUFNQTt3Q0FBQ2tCLFNBQVNUO3dDQUFlVSxLQUFJO3dDQUFpQkMsU0FBUTs7Ozs7Ozs7Ozs7OzRCQUdoRVIsZUFBZUQseUJBQ2Q7O2tEQUNFLDhEQUFDRzt3Q0FBSUMsV0FBVTtrREFDWlgsa0RBQU9BLENBQUNPOzs7Ozs7a0RBRVgsOERBQUNYLHlEQUFNQTt3Q0FBQ2tCLFNBQVNMO3dDQUFZTSxLQUFJO3dDQUFhQyxTQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBT2hFLDhEQUFDQztnQkFBS04sV0FBVTs7Ozs7Ozs7Ozs7O0FBS3RCO0dBbkN3QlY7O1FBQ3VDRixtREFBUUE7UUFDdENGLDZDQUFVQTtRQUNwQkMsZ0RBQWFBOzs7S0FIWkciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vYXBwL3BhZ2UudHN4Pzc2MDMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnO1xuXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbXBvbmVudHMvQnV0dG9uJztcbmltcG9ydCB7dXNlQWNjb3VudCwgdXNlRGlzY29ubmVjdH0gZnJvbSAnd2FnbWknO1xuaW1wb3J0IHt1c2VQcml2eX0gZnJvbSAnQHByaXZ5LWlvL3JlYWN0LWF1dGgnO1xuaW1wb3J0IHtzaG9ydGVufSBmcm9tICdsaWIvdXRpbHMnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhvbWUoKSB7XG4gIGNvbnN0IHtyZWFkeSwgYXV0aGVudGljYXRlZCwgbG9naW4sIGNvbm5lY3RXYWxsZXQsIGxvZ291dH0gPSB1c2VQcml2eSgpO1xuICBjb25zdCB7YWRkcmVzcywgaXNDb25uZWN0ZWR9ID0gdXNlQWNjb3VudCgpO1xuICBjb25zdCB7ZGlzY29ubmVjdH0gPSB1c2VEaXNjb25uZWN0KCk7XG5cbiAgaWYgKCFyZWFkeSkgcmV0dXJuIG51bGw7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cIm1pbi1oLXNjcmVlbiBiZy1ncmFkaWVudC10by1iIGZyb20tcHVycGxlLTUwIHRvLXdoaXRlXCI+XG4gICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cImJnLXdoaXRlLzcwIGJhY2tkcm9wLWJsdXItc20gc2hhZG93LXNtXCI+XG4gICAgICAgIDxuYXYgY2xhc3NOYW1lPVwibWF4LXctN3hsIG14LWF1dG8gcHgtNCBzbTpweC02IGxnOnB4LThcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1lbmQgaXRlbXMtY2VudGVyIGgtMTYgZ2FwLTRcIj5cbiAgICAgICAgICAgIHtyZWFkeSAmJiAhYXV0aGVudGljYXRlZCAmJiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e2xvZ2lufSBjdGE9XCJMb2dpblwiIC8+XG4gICAgICAgICAgICAgICAgPEJ1dHRvbiBvbkNsaWNrPXtjb25uZWN0V2FsbGV0fSBjdGE9XCJDb25uZWN0IFdhbGxldFwiIHZhcmlhbnQ9XCJzZWNvbmRhcnlcIiAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7aXNDb25uZWN0ZWQgJiYgYWRkcmVzcyAmJiAoXG4gICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLXhsIGJnLXB1cnBsZS0xMDAgcHgtNCBweS0yIGZvbnQtbW9ubyB0ZXh0LXB1cnBsZS05MDAgYm9yZGVyIGJvcmRlci1wdXJwbGUtMjAwXCI+XG4gICAgICAgICAgICAgICAgICB7c2hvcnRlbihhZGRyZXNzKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e2Rpc2Nvbm5lY3R9IGN0YT1cIkRpc2Nvbm5lY3RcIiB2YXJpYW50PVwic2Vjb25kYXJ5XCIgLz5cbiAgICAgICAgICAgICAgPC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L25hdj5cbiAgICAgIDwvaGVhZGVyPlxuXG4gICAgICA8bWFpbiBjbGFzc05hbWU9XCJoLVtjYWxjKDEwMHZoLTY0cHgpXVwiPlxuICAgICAgICB7LyogQWRkIHlvdXIgZ2FtZSBpZnJhbWUgaGVyZSAqL31cbiAgICAgIDwvbWFpbj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJCdXR0b24iLCJ1c2VBY2NvdW50IiwidXNlRGlzY29ubmVjdCIsInVzZVByaXZ5Iiwic2hvcnRlbiIsIkhvbWUiLCJyZWFkeSIsImF1dGhlbnRpY2F0ZWQiLCJsb2dpbiIsImNvbm5lY3RXYWxsZXQiLCJsb2dvdXQiLCJhZGRyZXNzIiwiaXNDb25uZWN0ZWQiLCJkaXNjb25uZWN0IiwiZGl2IiwiY2xhc3NOYW1lIiwiaGVhZGVyIiwibmF2Iiwib25DbGljayIsImN0YSIsInZhcmlhbnQiLCJtYWluIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./app/page.tsx\n"));

/***/ })

});