// Config reference:
//  http://webpack.github.io/docs/configuration.html
//  https://webpack.js.org/configuration/
import merge from 'lodash/merge'

import {resolve} from 'path'
let core = {
  plugins: []
};
let browser = {
   target   : 'web' // async-node | electron | electron-renderer | node | node-webkit | web | webworker
  ,externals: {}    // http://webpack.github.io/docs/configuration.html#externals
  ,entry    : []
  ,output   : {
     path    : '' // absolute path required
    ,filename: '[name].js'
  }
  ,plugins  : []
  ,devtool  : void 0
  ,module   : {
    rules: []
  }
};


let server  = {
   target   : 'node'  // async-node | electron | electron-renderer | node | node-webkit | web | webworker | https://webpack.js.org/configuration/target/
  ,externals: {}      // http://webpack.github.io/docs/configuration.html#externals
  ,entry    : []
  ,output   : {
     path    : '' // absolute path required
    ,filename: '[name].js'
  }
  ,plugins  : []
  ,devtool  : void 0
  ,module   : {
    rules: []
  }
}

browser = merge({}, core, browser);
server  = merge({}, core, server);
export {core, browser, server}
export default [browser, server]