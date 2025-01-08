/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/get-answer/[promptId]/route";
exports.ids = ["app/api/get-answer/[promptId]/route"];
exports.modules = {

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fget-answer%2F%5BpromptId%5D%2Froute&page=%2Fapi%2Fget-answer%2F%5BpromptId%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fget-answer%2F%5BpromptId%5D%2Froute.ts&appDir=%2FUsers%2Fkeruch%2FDevelopment%2FDymension%2Frollapp-blueprints%2Fai-agent%2Ffrontend%2Fbrainpump%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fkeruch%2FDevelopment%2FDymension%2Frollapp-blueprints%2Fai-agent%2Ffrontend%2Fbrainpump&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fget-answer%2F%5BpromptId%5D%2Froute&page=%2Fapi%2Fget-answer%2F%5BpromptId%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fget-answer%2F%5BpromptId%5D%2Froute.ts&appDir=%2FUsers%2Fkeruch%2FDevelopment%2FDymension%2Frollapp-blueprints%2Fai-agent%2Ffrontend%2Fbrainpump%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fkeruch%2FDevelopment%2FDymension%2Frollapp-blueprints%2Fai-agent%2Ffrontend%2Fbrainpump&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_keruch_Development_Dymension_rollapp_blueprints_ai_agent_frontend_brainpump_app_api_get_answer_promptId_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/get-answer/[promptId]/route.ts */ \"(rsc)/./app/api/get-answer/[promptId]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/get-answer/[promptId]/route\",\n        pathname: \"/api/get-answer/[promptId]\",\n        filename: \"route\",\n        bundlePath: \"app/api/get-answer/[promptId]/route\"\n    },\n    resolvedPagePath: \"/Users/keruch/Development/Dymension/rollapp-blueprints/ai-agent/frontend/brainpump/app/api/get-answer/[promptId]/route.ts\",\n    nextConfigOutput,\n    userland: _Users_keruch_Development_Dymension_rollapp_blueprints_ai_agent_frontend_brainpump_app_api_get_answer_promptId_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZnZXQtYW5zd2VyJTJGJTVCcHJvbXB0SWQlNUQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmdldC1hbnN3ZXIlMkYlNUJwcm9tcHRJZCU1RCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmdldC1hbnN3ZXIlMkYlNUJwcm9tcHRJZCU1RCUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmtlcnVjaCUyRkRldmVsb3BtZW50JTJGRHltZW5zaW9uJTJGcm9sbGFwcC1ibHVlcHJpbnRzJTJGYWktYWdlbnQlMkZmcm9udGVuZCUyRmJyYWlucHVtcCUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGVXNlcnMlMkZrZXJ1Y2glMkZEZXZlbG9wbWVudCUyRkR5bWVuc2lvbiUyRnJvbGxhcHAtYmx1ZXByaW50cyUyRmFpLWFnZW50JTJGZnJvbnRlbmQlMkZicmFpbnB1bXAmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ3lFO0FBQ3RKO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMva2VydWNoL0RldmVsb3BtZW50L0R5bWVuc2lvbi9yb2xsYXBwLWJsdWVwcmludHMvYWktYWdlbnQvZnJvbnRlbmQvYnJhaW5wdW1wL2FwcC9hcGkvZ2V0LWFuc3dlci9bcHJvbXB0SWRdL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9nZXQtYW5zd2VyL1twcm9tcHRJZF0vcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9nZXQtYW5zd2VyL1twcm9tcHRJZF1cIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2dldC1hbnN3ZXIvW3Byb21wdElkXS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9rZXJ1Y2gvRGV2ZWxvcG1lbnQvRHltZW5zaW9uL3JvbGxhcHAtYmx1ZXByaW50cy9haS1hZ2VudC9mcm9udGVuZC9icmFpbnB1bXAvYXBwL2FwaS9nZXQtYW5zd2VyL1twcm9tcHRJZF0vcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fget-answer%2F%5BpromptId%5D%2Froute&page=%2Fapi%2Fget-answer%2F%5BpromptId%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fget-answer%2F%5BpromptId%5D%2Froute.ts&appDir=%2FUsers%2Fkeruch%2FDevelopment%2FDymension%2Frollapp-blueprints%2Fai-agent%2Ffrontend%2Fbrainpump%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fkeruch%2FDevelopment%2FDymension%2Frollapp-blueprints%2Fai-agent%2Ffrontend%2Fbrainpump&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(rsc)/./app/api/get-answer/[promptId]/route.ts":
/*!************************************************!*\
  !*** ./app/api/get-answer/[promptId]/route.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\nconst AgentHost = 'http://localhost:8080';\nasync function GET(request, { params }) {\n    const promptId = params.promptId;\n    if (!promptId) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Prompt ID is required'\n        }, {\n            status: 400\n        });\n    }\n    try {\n        const response = await fetch(AgentHost + '/get-answer/' + promptId);\n        const data = await response.json();\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(data);\n    } catch (error) {\n        console.error('Error fetching AI answer:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to fetch AI answer'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2dldC1hbnN3ZXIvW3Byb21wdElkXS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7OztBQUFxRDtBQUVyRCxNQUFNQyxZQUFZO0FBRVgsZUFBZUMsSUFDbEJDLE9BQW9CLEVBQ3BCLEVBQUNDLE1BQU0sRUFBbUM7SUFFMUMsTUFBTUMsV0FBV0QsT0FBT0MsUUFBUTtJQUVoQyxJQUFJLENBQUNBLFVBQVU7UUFDWCxPQUFPTCxxREFBWUEsQ0FBQ00sSUFBSSxDQUFDO1lBQUNDLE9BQU87UUFBdUIsR0FBRztZQUFDQyxRQUFRO1FBQUc7SUFDM0U7SUFFQSxJQUFJO1FBQ0EsTUFBTUMsV0FBVyxNQUFNQyxNQUFNVCxZQUFZLGlCQUFpQkk7UUFDMUQsTUFBTU0sT0FBTyxNQUFNRixTQUFTSCxJQUFJO1FBQ2hDLE9BQU9OLHFEQUFZQSxDQUFDTSxJQUFJLENBQUNLO0lBQzdCLEVBQUUsT0FBT0osT0FBTztRQUNaSyxRQUFRTCxLQUFLLENBQUMsNkJBQTZCQTtRQUMzQyxPQUFPUCxxREFBWUEsQ0FBQ00sSUFBSSxDQUFDO1lBQUNDLE9BQU87UUFBMkIsR0FBRztZQUFDQyxRQUFRO1FBQUc7SUFDL0U7QUFDSiIsInNvdXJjZXMiOlsiL1VzZXJzL2tlcnVjaC9EZXZlbG9wbWVudC9EeW1lbnNpb24vcm9sbGFwcC1ibHVlcHJpbnRzL2FpLWFnZW50L2Zyb250ZW5kL2JyYWlucHVtcC9hcHAvYXBpL2dldC1hbnN3ZXIvW3Byb21wdElkXS9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2V9IGZyb20gJ25leHQvc2VydmVyJ1xuXG5jb25zdCBBZ2VudEhvc3QgPSAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJ1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKFxuICAgIHJlcXVlc3Q6IE5leHRSZXF1ZXN0LFxuICAgIHtwYXJhbXN9OiB7IHBhcmFtczogeyBwcm9tcHRJZDogc3RyaW5nIH0gfVxuKSB7XG4gICAgY29uc3QgcHJvbXB0SWQgPSBwYXJhbXMucHJvbXB0SWRcblxuICAgIGlmICghcHJvbXB0SWQpIHtcbiAgICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtlcnJvcjogJ1Byb21wdCBJRCBpcyByZXF1aXJlZCd9LCB7c3RhdHVzOiA0MDB9KVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goQWdlbnRIb3N0ICsgJy9nZXQtYW5zd2VyLycgKyBwcm9tcHRJZCk7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihkYXRhKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZldGNoaW5nIEFJIGFuc3dlcjonLCBlcnJvcilcbiAgICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtlcnJvcjogJ0ZhaWxlZCB0byBmZXRjaCBBSSBhbnN3ZXInfSwge3N0YXR1czogNTAwfSlcbiAgICB9XG59XG5cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJBZ2VudEhvc3QiLCJHRVQiLCJyZXF1ZXN0IiwicGFyYW1zIiwicHJvbXB0SWQiLCJqc29uIiwiZXJyb3IiLCJzdGF0dXMiLCJyZXNwb25zZSIsImZldGNoIiwiZGF0YSIsImNvbnNvbGUiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/get-answer/[promptId]/route.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fget-answer%2F%5BpromptId%5D%2Froute&page=%2Fapi%2Fget-answer%2F%5BpromptId%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fget-answer%2F%5BpromptId%5D%2Froute.ts&appDir=%2FUsers%2Fkeruch%2FDevelopment%2FDymension%2Frollapp-blueprints%2Fai-agent%2Ffrontend%2Fbrainpump%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fkeruch%2FDevelopment%2FDymension%2Frollapp-blueprints%2Fai-agent%2Ffrontend%2Fbrainpump&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();