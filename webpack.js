// Config reference:
//  http://webpack.github.io/docs/configuration.html
//  https://webpack.js.org/configuration/
let webpack       = require('webpack');
let TsProcessFork = require('fork-ts-checker-webpack-plugin')
let Uglifyjs      = require('uglifyjs-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV;

let plugins = NODE_ENV === 'production'
  ? [new Uglifyjs()]
  : [
      new webpack.HotModuleReplacementPlugin({title: 'HOT!'})
    , new TsProcessFork({ watch: ['./src/']  })
    ];

let config = {
   target   : 'web' // async-node | electron | electron-renderer | node | node-webkit | web | webworker
  ,externals: {}    // http://webpack.github.io/docs/configuration.html#externals
  ,entry    : {bundle: './src/index.ts'}
  ,output   : {
     path    : '' // absolute path required
    ,filename: '[name].js'
  }
  ,plugins  : plugins
  ,devtool  : void 0
  ,module   : {
    rules: [
      {test: /\.tsx?$/  , use: {loader: 'ts-loader'  , options: { transpileOnly: true }} }
    , {test: /\.pug$/   , use: ['pug-loader']}
    , {test: /\.css$/   , use: ['style-loader','css-loader']}
    ]
  }
  ,devServer: {
      port       : 80
    , publicPath : '/public/'
    , hot        : true
    , open       : true
  }
};

module.exports = config;
