"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/fetch-retry";
exports.ids = ["vendor-chunks/fetch-retry"];
exports.modules = {

/***/ "(ssr)/./node_modules/fetch-retry/index.js":
/*!*******************************************!*\
  !*** ./node_modules/fetch-retry/index.js ***!
  \*******************************************/
/***/ ((module) => {

eval("\nmodule.exports = function(fetch, defaults) {\n    defaults = defaults || {};\n    if (typeof fetch !== \"function\") {\n        throw new ArgumentError(\"fetch must be a function\");\n    }\n    if (typeof defaults !== \"object\") {\n        throw new ArgumentError(\"defaults must be an object\");\n    }\n    if (defaults.retries !== undefined && !isPositiveInteger(defaults.retries)) {\n        throw new ArgumentError(\"retries must be a positive integer\");\n    }\n    if (defaults.retryDelay !== undefined && !isPositiveInteger(defaults.retryDelay) && typeof defaults.retryDelay !== \"function\") {\n        throw new ArgumentError(\"retryDelay must be a positive integer or a function returning a positive integer\");\n    }\n    if (defaults.retryOn !== undefined && !Array.isArray(defaults.retryOn) && typeof defaults.retryOn !== \"function\") {\n        throw new ArgumentError(\"retryOn property expects an array or function\");\n    }\n    var baseDefaults = {\n        retries: 3,\n        retryDelay: 1000,\n        retryOn: []\n    };\n    defaults = Object.assign(baseDefaults, defaults);\n    return function fetchRetry(input, init) {\n        var retries = defaults.retries;\n        var retryDelay = defaults.retryDelay;\n        var retryOn = defaults.retryOn;\n        if (init && init.retries !== undefined) {\n            if (isPositiveInteger(init.retries)) {\n                retries = init.retries;\n            } else {\n                throw new ArgumentError(\"retries must be a positive integer\");\n            }\n        }\n        if (init && init.retryDelay !== undefined) {\n            if (isPositiveInteger(init.retryDelay) || typeof init.retryDelay === \"function\") {\n                retryDelay = init.retryDelay;\n            } else {\n                throw new ArgumentError(\"retryDelay must be a positive integer or a function returning a positive integer\");\n            }\n        }\n        if (init && init.retryOn) {\n            if (Array.isArray(init.retryOn) || typeof init.retryOn === \"function\") {\n                retryOn = init.retryOn;\n            } else {\n                throw new ArgumentError(\"retryOn property expects an array or function\");\n            }\n        }\n        // eslint-disable-next-line no-undef\n        return new Promise(function(resolve, reject) {\n            var wrappedFetch = function(attempt) {\n                // As of node 18, this is no longer needed since node comes with native support for fetch:\n                /* istanbul ignore next */ var _input = typeof Request !== \"undefined\" && input instanceof Request ? input.clone() : input;\n                fetch(_input, init).then(function(response) {\n                    if (Array.isArray(retryOn) && retryOn.indexOf(response.status) === -1) {\n                        resolve(response);\n                    } else if (typeof retryOn === \"function\") {\n                        try {\n                            // eslint-disable-next-line no-undef\n                            return Promise.resolve(retryOn(attempt, null, response)).then(function(retryOnResponse) {\n                                if (retryOnResponse) {\n                                    retry(attempt, null, response);\n                                } else {\n                                    resolve(response);\n                                }\n                            }).catch(reject);\n                        } catch (error) {\n                            reject(error);\n                        }\n                    } else {\n                        if (attempt < retries) {\n                            retry(attempt, null, response);\n                        } else {\n                            resolve(response);\n                        }\n                    }\n                }).catch(function(error) {\n                    if (typeof retryOn === \"function\") {\n                        try {\n                            // eslint-disable-next-line no-undef\n                            Promise.resolve(retryOn(attempt, error, null)).then(function(retryOnResponse) {\n                                if (retryOnResponse) {\n                                    retry(attempt, error, null);\n                                } else {\n                                    reject(error);\n                                }\n                            }).catch(function(error) {\n                                reject(error);\n                            });\n                        } catch (error) {\n                            reject(error);\n                        }\n                    } else if (attempt < retries) {\n                        retry(attempt, error, null);\n                    } else {\n                        reject(error);\n                    }\n                });\n            };\n            function retry(attempt, error, response) {\n                var delay = typeof retryDelay === \"function\" ? retryDelay(attempt, error, response) : retryDelay;\n                setTimeout(function() {\n                    wrappedFetch(++attempt);\n                }, delay);\n            }\n            wrappedFetch(0);\n        });\n    };\n};\nfunction isPositiveInteger(value) {\n    return Number.isInteger(value) && value >= 0;\n}\nfunction ArgumentError(message) {\n    this.name = \"ArgumentError\";\n    this.message = message;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZmV0Y2gtcmV0cnkvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFFQUEsT0FBT0MsT0FBTyxHQUFHLFNBQVVDLEtBQUssRUFBRUMsUUFBUTtJQUN4Q0EsV0FBV0EsWUFBWSxDQUFDO0lBQ3hCLElBQUksT0FBT0QsVUFBVSxZQUFZO1FBQy9CLE1BQU0sSUFBSUUsY0FBYztJQUMxQjtJQUVBLElBQUksT0FBT0QsYUFBYSxVQUFVO1FBQ2hDLE1BQU0sSUFBSUMsY0FBYztJQUMxQjtJQUVBLElBQUlELFNBQVNFLE9BQU8sS0FBS0MsYUFBYSxDQUFDQyxrQkFBa0JKLFNBQVNFLE9BQU8sR0FBRztRQUMxRSxNQUFNLElBQUlELGNBQWM7SUFDMUI7SUFFQSxJQUFJRCxTQUFTSyxVQUFVLEtBQUtGLGFBQWEsQ0FBQ0Msa0JBQWtCSixTQUFTSyxVQUFVLEtBQUssT0FBT0wsU0FBU0ssVUFBVSxLQUFLLFlBQVk7UUFDN0gsTUFBTSxJQUFJSixjQUFjO0lBQzFCO0lBRUEsSUFBSUQsU0FBU00sT0FBTyxLQUFLSCxhQUFhLENBQUNJLE1BQU1DLE9BQU8sQ0FBQ1IsU0FBU00sT0FBTyxLQUFLLE9BQU9OLFNBQVNNLE9BQU8sS0FBSyxZQUFZO1FBQ2hILE1BQU0sSUFBSUwsY0FBYztJQUMxQjtJQUVBLElBQUlRLGVBQWU7UUFDakJQLFNBQVM7UUFDVEcsWUFBWTtRQUNaQyxTQUFTLEVBQUU7SUFDYjtJQUVBTixXQUFXVSxPQUFPQyxNQUFNLENBQUNGLGNBQWNUO0lBRXZDLE9BQU8sU0FBU1ksV0FBV0MsS0FBSyxFQUFFQyxJQUFJO1FBQ3BDLElBQUlaLFVBQVVGLFNBQVNFLE9BQU87UUFDOUIsSUFBSUcsYUFBYUwsU0FBU0ssVUFBVTtRQUNwQyxJQUFJQyxVQUFVTixTQUFTTSxPQUFPO1FBRTlCLElBQUlRLFFBQVFBLEtBQUtaLE9BQU8sS0FBS0MsV0FBVztZQUN0QyxJQUFJQyxrQkFBa0JVLEtBQUtaLE9BQU8sR0FBRztnQkFDbkNBLFVB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QixJQUFJLENBQUNDLElBQUksR0FBRztJQUNaLElBQUksQ0FBQ0QsT0FBTyxHQUFHQTtBQUNqQiIsInNvdXJjZXMiOlsid2VicGFjazovL0Bwcml2eS1pby93YWdtaS1kZW1vLy4vbm9kZV9tb2R1bGVzL2ZldGNoLXJldHJ5L2luZGV4LmpzP2FmNDYiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmZXRjaCwgZGVmYXVsdHMpIHtcbiAgZGVmYXVsdHMgPSBkZWZhdWx0cyB8fCB7fTtcbiAgaWYgKHR5cGVvZiBmZXRjaCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBBcmd1bWVudEVycm9yKCdmZXRjaCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgZGVmYXVsdHMgIT09ICdvYmplY3QnKSB7XG4gICAgdGhyb3cgbmV3IEFyZ3VtZW50RXJyb3IoJ2RlZmF1bHRzIG11c3QgYmUgYW4gb2JqZWN0Jyk7XG4gIH1cblxuICBpZiAoZGVmYXVsdHMucmV0cmllcyAhPT0gdW5kZWZpbmVkICYmICFpc1Bvc2l0aXZlSW50ZWdlcihkZWZhdWx0cy5yZXRyaWVzKSkge1xuICAgIHRocm93IG5ldyBBcmd1bWVudEVycm9yKCdyZXRyaWVzIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyJyk7XG4gIH1cblxuICBpZiAoZGVmYXVsdHMucmV0cnlEZWxheSAhPT0gdW5kZWZpbmVkICYmICFpc1Bvc2l0aXZlSW50ZWdlcihkZWZhdWx0cy5yZXRyeURlbGF5KSAmJiB0eXBlb2YgZGVmYXVsdHMucmV0cnlEZWxheSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBBcmd1bWVudEVycm9yKCdyZXRyeURlbGF5IG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyIG9yIGEgZnVuY3Rpb24gcmV0dXJuaW5nIGEgcG9zaXRpdmUgaW50ZWdlcicpO1xuICB9XG5cbiAgaWYgKGRlZmF1bHRzLnJldHJ5T24gIT09IHVuZGVmaW5lZCAmJiAhQXJyYXkuaXNBcnJheShkZWZhdWx0cy5yZXRyeU9uKSAmJiB0eXBlb2YgZGVmYXVsdHMucmV0cnlPbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBBcmd1bWVudEVycm9yKCdyZXRyeU9uIHByb3BlcnR5IGV4cGVjdHMgYW4gYXJyYXkgb3IgZnVuY3Rpb24nKTtcbiAgfVxuXG4gIHZhciBiYXNlRGVmYXVsdHMgPSB7XG4gICAgcmV0cmllczogMyxcbiAgICByZXRyeURlbGF5OiAxMDAwLFxuICAgIHJldHJ5T246IFtdLFxuICB9O1xuXG4gIGRlZmF1bHRzID0gT2JqZWN0LmFzc2lnbihiYXNlRGVmYXVsdHMsIGRlZmF1bHRzKTtcblxuICByZXR1cm4gZnVuY3Rpb24gZmV0Y2hSZXRyeShpbnB1dCwgaW5pdCkge1xuICAgIHZhciByZXRyaWVzID0gZGVmYXVsdHMucmV0cmllcztcbiAgICB2YXIgcmV0cnlEZWxheSA9IGRlZmF1bHRzLnJldHJ5RGVsYXk7XG4gICAgdmFyIHJldHJ5T24gPSBkZWZhdWx0cy5yZXRyeU9uO1xuXG4gICAgaWYgKGluaXQgJiYgaW5pdC5yZXRyaWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChpc1Bvc2l0aXZlSW50ZWdlcihpbml0LnJldHJpZXMpKSB7XG4gICAgICAgIHJldHJpZXMgPSBpbml0LnJldHJpZXM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgQXJndW1lbnRFcnJvcigncmV0cmllcyBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlcicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpbml0ICYmIGluaXQucmV0cnlEZWxheSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoaXNQb3NpdGl2ZUludGVnZXIoaW5pdC5yZXRyeURlbGF5KSB8fCAodHlwZW9mIGluaXQucmV0cnlEZWxheSA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgcmV0cnlEZWxheSA9IGluaXQucmV0cnlEZWxheTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBBcmd1bWVudEVycm9yKCdyZXRyeURlbGF5IG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyIG9yIGEgZnVuY3Rpb24gcmV0dXJuaW5nIGEgcG9zaXRpdmUgaW50ZWdlcicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpbml0ICYmIGluaXQucmV0cnlPbikge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW5pdC5yZXRyeU9uKSB8fCAodHlwZW9mIGluaXQucmV0cnlPbiA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgcmV0cnlPbiA9IGluaXQucmV0cnlPbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBBcmd1bWVudEVycm9yKCdyZXRyeU9uIHByb3BlcnR5IGV4cGVjdHMgYW4gYXJyYXkgb3IgZnVuY3Rpb24nKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHdyYXBwZWRGZXRjaCA9IGZ1bmN0aW9uIChhdHRlbXB0KSB7XG4gICAgICAgIC8vIEFzIG9mIG5vZGUgMTgsIHRoaXMgaXMgbm8gbG9uZ2VyIG5lZWRlZCBzaW5jZSBub2RlIGNvbWVzIHdpdGggbmF0aXZlIHN1cHBvcnQgZm9yIGZldGNoOlxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICB2YXIgX2lucHV0ID1cbiAgICAgICAgICB0eXBlb2YgUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcgJiYgaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0XG4gICAgICAgICAgICA/IGlucHV0LmNsb25lKClcbiAgICAgICAgICAgIDogaW5wdXQ7XG4gICAgICAgIGZldGNoKF9pbnB1dCwgaW5pdClcbiAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJldHJ5T24pICYmIHJldHJ5T24uaW5kZXhPZihyZXNwb25zZS5zdGF0dXMpID09PSAtMSkge1xuICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHJldHJ5T24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJldHJ5T24oYXR0ZW1wdCwgbnVsbCwgcmVzcG9uc2UpKVxuICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJldHJ5T25SZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBpZihyZXRyeU9uUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXRyeShhdHRlbXB0LCBudWxsLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKHJlamVjdCk7XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKGF0dGVtcHQgPCByZXRyaWVzKSB7XG4gICAgICAgICAgICAgICAgcmV0cnkoYXR0ZW1wdCwgbnVsbCwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJldHJ5T24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgICAgICAgICAgICAgICBQcm9taXNlLnJlc29sdmUocmV0cnlPbihhdHRlbXB0LCBlcnJvciwgbnVsbCkpXG4gICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmV0cnlPblJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHJldHJ5T25SZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgIHJldHJ5KGF0dGVtcHQsIGVycm9yLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXR0ZW1wdCA8IHJldHJpZXMpIHtcbiAgICAgICAgICAgICAgcmV0cnkoYXR0ZW1wdCwgZXJyb3IsIG51bGwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGZ1bmN0aW9uIHJldHJ5KGF0dGVtcHQsIGVycm9yLCByZXNwb25zZSkge1xuICAgICAgICB2YXIgZGVsYXkgPSAodHlwZW9mIHJldHJ5RGVsYXkgPT09ICdmdW5jdGlvbicpID9cbiAgICAgICAgICByZXRyeURlbGF5KGF0dGVtcHQsIGVycm9yLCByZXNwb25zZSkgOiByZXRyeURlbGF5O1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB3cmFwcGVkRmV0Y2goKythdHRlbXB0KTtcbiAgICAgICAgfSwgZGVsYXkpO1xuICAgICAgfVxuXG4gICAgICB3cmFwcGVkRmV0Y2goMCk7XG4gICAgfSk7XG4gIH07XG59O1xuXG5mdW5jdGlvbiBpc1Bvc2l0aXZlSW50ZWdlcih2YWx1ZSkge1xuICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSkgJiYgdmFsdWUgPj0gMDtcbn1cblxuZnVuY3Rpb24gQXJndW1lbnRFcnJvcihtZXNzYWdlKSB7XG4gIHRoaXMubmFtZSA9ICdBcmd1bWVudEVycm9yJztcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbn1cbiJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwiZmV0Y2giLCJkZWZhdWx0cyIsIkFyZ3VtZW50RXJyb3IiLCJyZXRyaWVzIiwidW5kZWZpbmVkIiwiaXNQb3NpdGl2ZUludGVnZXIiLCJyZXRyeURlbGF5IiwicmV0cnlPbiIsIkFycmF5IiwiaXNBcnJheSIsImJhc2VEZWZhdWx0cyIsIk9iamVjdCIsImFzc2lnbiIsImZldGNoUmV0cnkiLCJpbnB1dCIsImluaXQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIndyYXBwZWRGZXRjaCIsImF0dGVtcHQiLCJfaW5wdXQiLCJSZXF1ZXN0IiwiY2xvbmUiLCJ0aGVuIiwicmVzcG9uc2UiLCJpbmRleE9mIiwic3RhdHVzIiwicmV0cnlPblJlc3BvbnNlIiwicmV0cnkiLCJjYXRjaCIsImVycm9yIiwiZGVsYXkiLCJzZXRUaW1lb3V0IiwidmFsdWUiLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJtZXNzYWdlIiwibmFtZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/fetch-retry/index.js\n");

/***/ })

};
;