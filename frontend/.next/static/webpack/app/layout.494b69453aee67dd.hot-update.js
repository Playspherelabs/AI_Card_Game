"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/layout",{

/***/ "(app-pages-browser)/./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (\"a576e1d4d744\");\nif (true) { module.hot.accept() }\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3N0eWxlcy9nbG9iYWxzLmNzcyIsIm1hcHBpbmdzIjoiO0FBQUEsK0RBQWUsY0FBYztBQUM3QixJQUFJLElBQVUsSUFBSSxpQkFBaUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3R5bGVzL2dsb2JhbHMuY3NzPzk2MjgiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgXCJhNTc2ZTFkNGQ3NDRcIlxuaWYgKG1vZHVsZS5ob3QpIHsgbW9kdWxlLmhvdC5hY2NlcHQoKSB9XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./styles/globals.css\n"));

/***/ }),

/***/ "(app-pages-browser)/./node_modules/viem/_esm/utils/signature/recoverPublicKey.js":
/*!********************************************************************!*\
  !*** ./node_modules/viem/_esm/utils/signature/recoverPublicKey.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   recoverPublicKey: function() { return /* binding */ recoverPublicKey; }\n/* harmony export */ });\n/* harmony import */ var _data_isHex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../data/isHex.js */ \"(app-pages-browser)/./node_modules/viem/_esm/utils/data/isHex.js\");\n/* harmony import */ var _encoding_fromHex_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../encoding/fromHex.js */ \"(app-pages-browser)/./node_modules/viem/_esm/utils/encoding/fromHex.js\");\n/* harmony import */ var _encoding_toHex_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../encoding/toHex.js */ \"(app-pages-browser)/./node_modules/viem/_esm/utils/encoding/toHex.js\");\n\n\n\nasync function recoverPublicKey(param) {\n    let { hash, signature } = param;\n    const hashHex = (0,_data_isHex_js__WEBPACK_IMPORTED_MODULE_0__.isHex)(hash) ? hash : (0,_encoding_toHex_js__WEBPACK_IMPORTED_MODULE_1__.toHex)(hash);\n    const { secp256k1 } = await __webpack_require__.e(/*! import() */ \"_app-pages-browser_node_modules_noble_curves_esm_secp256k1_js\").then(__webpack_require__.bind(__webpack_require__, /*! @noble/curves/secp256k1 */ \"(app-pages-browser)/./node_modules/@noble/curves/esm/secp256k1.js\"));\n    const signature_ = (()=>{\n        // typeof signature: `Signature`\n        if (typeof signature === \"object\" && \"r\" in signature && \"s\" in signature) {\n            const { r, s, v, yParity } = signature;\n            const yParityOrV = Number(yParity !== null && yParity !== void 0 ? yParity : v);\n            const recoveryBit = toRecoveryBit(yParityOrV);\n            return new secp256k1.Signature((0,_encoding_fromHex_js__WEBPACK_IMPORTED_MODULE_2__.hexToBigInt)(r), (0,_encoding_fromHex_js__WEBPACK_IMPORTED_MODULE_2__.hexToBigInt)(s)).addRecoveryBit(recoveryBit);\n        }\n        // typeof signature: `Hex | ByteArray`\n        const signatureHex = (0,_data_isHex_js__WEBPACK_IMPORTED_MODULE_0__.isHex)(signature) ? signature : (0,_encoding_toHex_js__WEBPACK_IMPORTED_MODULE_1__.toHex)(signature);\n        const yParityOrV = (0,_encoding_fromHex_js__WEBPACK_IMPORTED_MODULE_2__.hexToNumber)(\"0x\".concat(signatureHex.slice(130)));\n        const recoveryBit = toRecoveryBit(yParityOrV);\n        return secp256k1.Signature.fromCompact(signatureHex.substring(2, 130)).addRecoveryBit(recoveryBit);\n    })();\n    const publicKey = signature_.recoverPublicKey(hashHex.substring(2)).toHex(false);\n    return \"0x\".concat(publicKey);\n}\nfunction toRecoveryBit(yParityOrV) {\n    if (yParityOrV === 0 || yParityOrV === 1) return yParityOrV;\n    if (yParityOrV === 27) return 0;\n    if (yParityOrV === 28) return 1;\n    throw new Error(\"Invalid yParityOrV value\");\n} //# sourceMappingURL=recoverPublicKey.js.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL25vZGVfbW9kdWxlcy92aWVtL19lc20vdXRpbHMvc2lnbmF0dXJlL3JlY292ZXJQdWJsaWNLZXkuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUF5QztBQUMwQjtBQUN0QjtBQUN0QyxlQUFlSSxpQkFBaUIsS0FBb0I7UUFBcEIsRUFBRUMsSUFBSSxFQUFFQyxTQUFTLEVBQUcsR0FBcEI7SUFDbkMsTUFBTUMsVUFBVVAscURBQUtBLENBQUNLLFFBQVFBLE9BQU9GLHlEQUFLQSxDQUFDRTtJQUMzQyxNQUFNLEVBQUVHLFNBQVMsRUFBRSxHQUFHLE1BQU0sOFBBQU87SUFDbkMsTUFBTUMsYUFBYSxDQUFDO1FBQ2hCLGdDQUFnQztRQUNoQyxJQUFJLE9BQU9ILGNBQWMsWUFBWSxPQUFPQSxhQUFhLE9BQU9BLFdBQVc7WUFDdkUsTUFBTSxFQUFFSSxDQUFDLEVBQUVDLENBQUMsRUFBRUMsQ0FBQyxFQUFFQyxPQUFPLEVBQUUsR0FBR1A7WUFDN0IsTUFBTVEsYUFBYUMsT0FBT0Ysb0JBQUFBLHFCQUFBQSxVQUFXRDtZQUNyQyxNQUFNSSxjQUFjQyxjQUFjSDtZQUNsQyxPQUFPLElBQUlOLFVBQVVVLFNBQVMsQ0FBQ2pCLGlFQUFXQSxDQUFDUyxJQUFJVCxpRUFBV0EsQ0FBQ1UsSUFBSVEsY0FBYyxDQUFDSDtRQUNsRjtRQUNBLHNDQUFzQztRQUN0QyxNQUFNSSxlQUFlcEIscURBQUtBLENBQUNNLGFBQWFBLFlBQVlILHlEQUFLQSxDQUFDRztRQUMxRCxNQUFNUSxhQUFhWixpRUFBV0EsQ0FBQyxLQUE2QixPQUF4QmtCLGFBQWFDLEtBQUssQ0FBQztRQUN2RCxNQUFNTCxjQUFjQyxjQUFjSDtRQUNsQyxPQUFPTixVQUFVVSxTQUFTLENBQUNJLFdBQVcsQ0FBQ0YsYUFBYUcsU0FBUyxDQUFDLEdBQUcsTUFBTUosY0FBYyxDQUFDSDtJQUMxRjtJQUNBLE1BQU1RLFlBQVlmLFdBQ2JMLGdCQUFnQixDQUFDRyxRQUFRZ0IsU0FBUyxDQUFDLElBQ25DcEIsS0FBSyxDQUFDO0lBQ1gsT0FBTyxLQUFlLE9BQVZxQjtBQUNoQjtBQUNBLFNBQVNQLGNBQWNILFVBQVU7SUFDN0IsSUFBSUEsZUFBZSxLQUFLQSxlQUFlLEdBQ25DLE9BQU9BO0lBQ1gsSUFBSUEsZUFBZSxJQUNmLE9BQU87SUFDWCxJQUFJQSxlQUFlLElBQ2YsT0FBTztJQUNYLE1BQU0sSUFBSVcsTUFBTTtBQUNwQixFQUNBLDRDQUE0QyIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9ub2RlX21vZHVsZXMvdmllbS9fZXNtL3V0aWxzL3NpZ25hdHVyZS9yZWNvdmVyUHVibGljS2V5LmpzPzNlYmUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNIZXggfSBmcm9tICcuLi9kYXRhL2lzSGV4LmpzJztcbmltcG9ydCB7IGhleFRvQmlnSW50LCBoZXhUb051bWJlciwgfSBmcm9tICcuLi9lbmNvZGluZy9mcm9tSGV4LmpzJztcbmltcG9ydCB7IHRvSGV4IH0gZnJvbSAnLi4vZW5jb2RpbmcvdG9IZXguanMnO1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlY292ZXJQdWJsaWNLZXkoeyBoYXNoLCBzaWduYXR1cmUsIH0pIHtcbiAgICBjb25zdCBoYXNoSGV4ID0gaXNIZXgoaGFzaCkgPyBoYXNoIDogdG9IZXgoaGFzaCk7XG4gICAgY29uc3QgeyBzZWNwMjU2azEgfSA9IGF3YWl0IGltcG9ydCgnQG5vYmxlL2N1cnZlcy9zZWNwMjU2azEnKTtcbiAgICBjb25zdCBzaWduYXR1cmVfID0gKCgpID0+IHtcbiAgICAgICAgLy8gdHlwZW9mIHNpZ25hdHVyZTogYFNpZ25hdHVyZWBcbiAgICAgICAgaWYgKHR5cGVvZiBzaWduYXR1cmUgPT09ICdvYmplY3QnICYmICdyJyBpbiBzaWduYXR1cmUgJiYgJ3MnIGluIHNpZ25hdHVyZSkge1xuICAgICAgICAgICAgY29uc3QgeyByLCBzLCB2LCB5UGFyaXR5IH0gPSBzaWduYXR1cmU7XG4gICAgICAgICAgICBjb25zdCB5UGFyaXR5T3JWID0gTnVtYmVyKHlQYXJpdHkgPz8gdik7XG4gICAgICAgICAgICBjb25zdCByZWNvdmVyeUJpdCA9IHRvUmVjb3ZlcnlCaXQoeVBhcml0eU9yVik7XG4gICAgICAgICAgICByZXR1cm4gbmV3IHNlY3AyNTZrMS5TaWduYXR1cmUoaGV4VG9CaWdJbnQociksIGhleFRvQmlnSW50KHMpKS5hZGRSZWNvdmVyeUJpdChyZWNvdmVyeUJpdCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdHlwZW9mIHNpZ25hdHVyZTogYEhleCB8IEJ5dGVBcnJheWBcbiAgICAgICAgY29uc3Qgc2lnbmF0dXJlSGV4ID0gaXNIZXgoc2lnbmF0dXJlKSA/IHNpZ25hdHVyZSA6IHRvSGV4KHNpZ25hdHVyZSk7XG4gICAgICAgIGNvbnN0IHlQYXJpdHlPclYgPSBoZXhUb051bWJlcihgMHgke3NpZ25hdHVyZUhleC5zbGljZSgxMzApfWApO1xuICAgICAgICBjb25zdCByZWNvdmVyeUJpdCA9IHRvUmVjb3ZlcnlCaXQoeVBhcml0eU9yVik7XG4gICAgICAgIHJldHVybiBzZWNwMjU2azEuU2lnbmF0dXJlLmZyb21Db21wYWN0KHNpZ25hdHVyZUhleC5zdWJzdHJpbmcoMiwgMTMwKSkuYWRkUmVjb3ZlcnlCaXQocmVjb3ZlcnlCaXQpO1xuICAgIH0pKCk7XG4gICAgY29uc3QgcHVibGljS2V5ID0gc2lnbmF0dXJlX1xuICAgICAgICAucmVjb3ZlclB1YmxpY0tleShoYXNoSGV4LnN1YnN0cmluZygyKSlcbiAgICAgICAgLnRvSGV4KGZhbHNlKTtcbiAgICByZXR1cm4gYDB4JHtwdWJsaWNLZXl9YDtcbn1cbmZ1bmN0aW9uIHRvUmVjb3ZlcnlCaXQoeVBhcml0eU9yVikge1xuICAgIGlmICh5UGFyaXR5T3JWID09PSAwIHx8IHlQYXJpdHlPclYgPT09IDEpXG4gICAgICAgIHJldHVybiB5UGFyaXR5T3JWO1xuICAgIGlmICh5UGFyaXR5T3JWID09PSAyNylcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgaWYgKHlQYXJpdHlPclYgPT09IDI4KVxuICAgICAgICByZXR1cm4gMTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgeVBhcml0eU9yViB2YWx1ZScpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVjb3ZlclB1YmxpY0tleS5qcy5tYXAiXSwibmFtZXMiOlsiaXNIZXgiLCJoZXhUb0JpZ0ludCIsImhleFRvTnVtYmVyIiwidG9IZXgiLCJyZWNvdmVyUHVibGljS2V5IiwiaGFzaCIsInNpZ25hdHVyZSIsImhhc2hIZXgiLCJzZWNwMjU2azEiLCJzaWduYXR1cmVfIiwiciIsInMiLCJ2IiwieVBhcml0eSIsInlQYXJpdHlPclYiLCJOdW1iZXIiLCJyZWNvdmVyeUJpdCIsInRvUmVjb3ZlcnlCaXQiLCJTaWduYXR1cmUiLCJhZGRSZWNvdmVyeUJpdCIsInNpZ25hdHVyZUhleCIsInNsaWNlIiwiZnJvbUNvbXBhY3QiLCJzdWJzdHJpbmciLCJwdWJsaWNLZXkiLCJFcnJvciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./node_modules/viem/_esm/utils/signature/recoverPublicKey.js\n"));

/***/ })

});