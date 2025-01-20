self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
<<<<<<< HEAD
<<<<<<< HEAD
  "devFiles": [],
=======
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
>>>>>>> 2e5115aa (...)
=======
  "devFiles": [],
>>>>>>> 1832d436 (...)
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [
    "static/chunks/webpack.js",
    "static/chunks/main-app.js"
  ],
  "pages": {
<<<<<<< HEAD
<<<<<<< HEAD
    "/_app": []
=======
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ]
>>>>>>> 2e5115aa (...)
=======
    "/_app": []
>>>>>>> 1832d436 (...)
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];