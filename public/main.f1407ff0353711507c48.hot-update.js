"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdatepdfobnicator"]("main",{

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _pdf_pdf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pdf/pdf.js */ \"./src/pdf/pdf.js\");\n/* harmony import */ var _ui_render_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui/render.jsx */ \"./src/ui/render.jsx\");\n\n\ndocument.getElementById('file-selector-go').addEventListener(\"click\", e => {\n  var file = document.getElementById('file-selector').files[0];\n  var collectionPromise = file.arrayBuffer().then(arrBuf => (0,_pdf_pdf_js__WEBPACK_IMPORTED_MODULE_0__.collectPageDocuments)(arrBuf));\n  collectionPromise.then(collection => {\n    var root = document.getElementById('canvases');\n    root.forEach(child => root.removeChild(child));\n    (0,_ui_render_jsx__WEBPACK_IMPORTED_MODULE_1__.attach)(root, collection);\n  });\n});\n\n//# sourceURL=webpack://pdfobnicator/./src/index.js?");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("f27db48f4910780b0a1b")
/******/ })();
/******/ 
/******/ }
);