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

/***/ "./src/pdf/pdf.js":
/*!************************!*\
  !*** ./src/pdf/pdf.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"collectPageDocuments\": () => (/* binding */ collectPageDocuments),\n/* harmony export */   \"extractPageDocument\": () => (/* binding */ extractPageDocument),\n/* harmony export */   \"extractPageDocuments\": () => (/* binding */ extractPageDocuments)\n/* harmony export */ });\n/* harmony import */ var pdf_lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pdf-lib */ \"./node_modules/pdf-lib/es/index.js\");\n/* harmony import */ var pdfjs_dist_build_pdf_worker_entry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pdfjs-dist/build/pdf.worker.entry */ \"./node_modules/pdfjs-dist/build/pdf.worker.entry.js\");\n/* harmony import */ var pdfjs_dist_build_pdf_worker_entry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(pdfjs_dist_build_pdf_worker_entry__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var pdfjs_dist__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! pdfjs-dist */ \"./node_modules/pdfjs-dist/build/pdf.js\");\n/* harmony import */ var pdfjs_dist__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(pdfjs_dist__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\npdfjs_dist__WEBPACK_IMPORTED_MODULE_2__.GlobalWorkerOptions.workerSrc = (pdfjs_dist_build_pdf_worker_entry__WEBPACK_IMPORTED_MODULE_1___default());\n\nclass ScaledPageViewer {\n  constructor(pageViewer, scale) {\n    this.pageViewer = pageViewer;\n    this.params = scale;\n  }\n\n  dimensions() {\n    return this.pdfJsPage.then(p => p.getViewport({\n      scale: scale\n    })).then(dims => ({\n      height: dims.height,\n      width: dims.width\n    }));\n  }\n\n  render(params) {\n    pageViewer.render(params);\n  }\n\n}\n\nclass ConstrainedPageViewer {\n  constructor(pageViewer, maxDim) {\n    this.pageViewer = pageViewer;\n    this.maxDim = maxDim;\n  }\n\n  scaledPageViewer() {\n    return this.scale.then(scale => new ScaledPageViewer(this.pageViewer, scale));\n  }\n\n  scale() {\n    return this.pdfJsPage.then(p => p.getViewport({\n      scale: 1\n    })).then(dims => Math.max(1, Math.min(this.maxDim / dims.width, maxDim / dims.height)));\n  }\n\n  dimensions() {\n    scaledPageViewer().dimensions();\n  }\n\n  render(params) {\n    this.scaledPageViewer().then(viewer => viewer.render(params));\n  }\n\n}\n\nclass PageViewer {\n  constructor(dataPromise) {\n    this.pdfJsPage = dataPromise.then(data => (0,pdfjs_dist__WEBPACK_IMPORTED_MODULE_2__.getDocument)({\n      data: data\n    }).promise).then(viewerdoc => viewerdoc.getPage(1)).then(page => page);\n  }\n\n  render(params) {\n    this.pdfJsPage.then(page => {\n      var vp = page.getViewport({\n        scale: params.scale\n      });\n      var context = params.canvas.getContext('2d');\n      var context = {\n        canvasContext: context,\n        viewport: vp\n      };\n      page.render(context);\n    });\n  }\n\n}\n\nclass PageDocument {\n  constructor(docPromise) {\n    this.docPromise = docPromise;\n  }\n\n  data() {\n    return this.docPromise.then(doc => doc.saveAsBase64()).then(data => atob(data));\n  }\n\n  viewer() {\n    return new PageViewer(this.data());\n  }\n\n  join(dest) {\n    this.docPromise.then(doc => dest.copyPages(doc, [0]).then(page => {\n      dest.addPage(page[0]);\n      return dest;\n    }));\n  }\n\n}\n\nclass PageDocCollection {\n  constructor() {\n    this.pageDocs = [];\n  }\n\n  map(fn) {\n    return this.pageDocs.map(fn);\n  }\n\n  add(page) {\n    this.pageDocs.push(page);\n  }\n\n  extend(pages) {\n    this.pageDocs = this.pageDocs.concat(pages);\n  }\n\n  createDocument() {\n    pdf_lib__WEBPACK_IMPORTED_MODULE_0__.PDFDocument.create().then(dest => pages.forEach(page => page.join(dest)));\n  }\n\n}\n\nfunction collectPageDocuments(arrBuf) {\n  return extractPageDocuments(arrBuf).then(d => {\n    var collection = new PageDocCollection();\n    collection.extend(d);\n    return collection;\n  });\n}\nfunction extractPageDocuments(arrBuf) {\n  return pdf_lib__WEBPACK_IMPORTED_MODULE_0__.PDFDocument.load(arrBuf).then(src => {\n    const indices = src.getPageIndices();\n    return indices.map(idx => extractPageDocument(src, idx));\n  });\n}\nfunction extractPageDocument(src, idx) {\n  return new PageDocument(pdf_lib__WEBPACK_IMPORTED_MODULE_0__.PDFDocument.create().then(dest => dest.copyPages(src, [idx]).then(page => {\n    dest.addPage(page[0]);\n    return dest;\n  })));\n}\n\n//# sourceURL=webpack://pdfobnicator/./src/pdf/pdf.js?");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("042a8fc14019dbb42c25")
/******/ })();
/******/ 
/******/ }
);