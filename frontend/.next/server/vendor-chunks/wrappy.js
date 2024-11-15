"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/wrappy";
exports.ids = ["vendor-chunks/wrappy"];
exports.modules = {

/***/ "(ssr)/./node_modules/wrappy/wrappy.js":
/*!***************************************!*\
  !*** ./node_modules/wrappy/wrappy.js ***!
  \***************************************/
/***/ ((module) => {

eval("// Returns a wrapper function that returns a wrapped callback\n// The wrapper function should do some stuff, and return a\n// presumably different callback function.\n// This makes sure that own properties are retained, so that\n// decorations and such are not lost along the way.\n\nmodule.exports = wrappy;\nfunction wrappy(fn, cb) {\n    if (fn && cb) return wrappy(fn)(cb);\n    if (typeof fn !== \"function\") throw new TypeError(\"need wrapper function\");\n    Object.keys(fn).forEach(function(k) {\n        wrapper[k] = fn[k];\n    });\n    return wrapper;\n    function wrapper() {\n        var args = new Array(arguments.length);\n        for(var i = 0; i < args.length; i++){\n            args[i] = arguments[i];\n        }\n        var ret = fn.apply(this, args);\n        var cb = args[args.length - 1];\n        if (typeof ret === \"function\" && ret !== cb) {\n            Object.keys(cb).forEach(function(k) {\n                ret[k] = cb[k];\n            });\n        }\n        return ret;\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvd3JhcHB5L3dyYXBweS5qcyIsIm1hcHBpbmdzIjoiQUFBQSw2REFBNkQ7QUFDN0QsMERBQTBEO0FBQzFELDBDQUEwQztBQUMxQyw0REFBNEQ7QUFDNUQsbURBQW1EOztBQUNuREEsT0FBT0MsT0FBTyxHQUFHQztBQUNqQixTQUFTQSxPQUFRQyxFQUFFLEVBQUVDLEVBQUU7SUFDckIsSUFBSUQsTUFBTUMsSUFBSSxPQUFPRixPQUFPQyxJQUFJQztJQUVoQyxJQUFJLE9BQU9ELE9BQU8sWUFDaEIsTUFBTSxJQUFJRSxVQUFVO0lBRXRCQyxPQUFPQyxJQUFJLENBQUNKLElBQUlLLE9BQU8sQ0FBQyxTQUFVQyxDQUFDO1FBQ2pDQyxPQUFPLENBQUNELEVBQUUsR0FBR04sRUFBRSxDQUFDTSxFQUFFO0lBQ3BCO0lBRUEsT0FBT0M7SUFFUCxTQUFTQTtRQUNQLElBQUlDLE9BQU8sSUFBSUMsTUFBTUMsVUFBVUMsTUFBTTtRQUNyQyxJQUFLLElBQUlDLElBQUksR0FBR0EsSUFBSUosS0FBS0csTUFBTSxFQUFFQyxJQUFLO1lBQ3BDSixJQUFJLENBQUNJLEVBQUUsR0FBR0YsU0FBUyxDQUFDRSxFQUFFO1FBQ3hCO1FBQ0EsSUFBSUMsTUFBTWIsR0FBR2MsS0FBSyxDQUFDLElBQUksRUFBRU47UUFDekIsSUFBSVAsS0FBS08sSUFBSSxDQUFDQSxLQUFLRyxNQUFNLEdBQUMsRUFBRTtRQUM1QixJQUFJLE9BQU9FLFFBQVEsY0FBY0EsUUFBUVosSUFBSTtZQUMzQ0UsT0FBT0MsSUFBSSxDQUFDSCxJQUFJSSxPQUFPLENBQUMsU0FBVUMsQ0FBQztnQkFDakNPLEdBQUcsQ0FBQ1AsRUFBRSxHQUFHTCxFQUFFLENBQUNLLEVBQUU7WUFDaEI7UUFDRjtRQUNBLE9BQU9PO0lBQ1Q7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL0Bwcml2eS1pby93YWdtaS1kZW1vLy4vbm9kZV9tb2R1bGVzL3dyYXBweS93cmFwcHkuanM/OTRkNiJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBSZXR1cm5zIGEgd3JhcHBlciBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSB3cmFwcGVkIGNhbGxiYWNrXG4vLyBUaGUgd3JhcHBlciBmdW5jdGlvbiBzaG91bGQgZG8gc29tZSBzdHVmZiwgYW5kIHJldHVybiBhXG4vLyBwcmVzdW1hYmx5IGRpZmZlcmVudCBjYWxsYmFjayBmdW5jdGlvbi5cbi8vIFRoaXMgbWFrZXMgc3VyZSB0aGF0IG93biBwcm9wZXJ0aWVzIGFyZSByZXRhaW5lZCwgc28gdGhhdFxuLy8gZGVjb3JhdGlvbnMgYW5kIHN1Y2ggYXJlIG5vdCBsb3N0IGFsb25nIHRoZSB3YXkuXG5tb2R1bGUuZXhwb3J0cyA9IHdyYXBweVxuZnVuY3Rpb24gd3JhcHB5IChmbiwgY2IpIHtcbiAgaWYgKGZuICYmIGNiKSByZXR1cm4gd3JhcHB5KGZuKShjYilcblxuICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ25lZWQgd3JhcHBlciBmdW5jdGlvbicpXG5cbiAgT2JqZWN0LmtleXMoZm4pLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICB3cmFwcGVyW2tdID0gZm5ba11cbiAgfSlcblxuICByZXR1cm4gd3JhcHBlclxuXG4gIGZ1bmN0aW9uIHdyYXBwZXIoKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV1cbiAgICB9XG4gICAgdmFyIHJldCA9IGZuLmFwcGx5KHRoaXMsIGFyZ3MpXG4gICAgdmFyIGNiID0gYXJnc1thcmdzLmxlbmd0aC0xXVxuICAgIGlmICh0eXBlb2YgcmV0ID09PSAnZnVuY3Rpb24nICYmIHJldCAhPT0gY2IpIHtcbiAgICAgIE9iamVjdC5rZXlzKGNiKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgIHJldFtrXSA9IGNiW2tdXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gcmV0XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwid3JhcHB5IiwiZm4iLCJjYiIsIlR5cGVFcnJvciIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwiayIsIndyYXBwZXIiLCJhcmdzIiwiQXJyYXkiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJpIiwicmV0IiwiYXBwbHkiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/wrappy/wrappy.js\n");

/***/ })

};
;