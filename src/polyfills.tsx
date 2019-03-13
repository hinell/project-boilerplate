import "whatwg-fetch"
import "es5-shim"
import "es6-shim"

// if (!(`fetch` in window)) {
//   console.log(`LOAD FETCH`);
//   await import(/* webpackChunkName: "polyfills/es6" */ "whatwg-fetch");
// }
// if (!(`Map` in window && `Set` in window)) {
//   console.log(`LOAD ES5/6`);
//   await import(/* webpackChunkName: "polyfills/es6" */  "core-js/es6")
// }
