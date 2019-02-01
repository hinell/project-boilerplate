// Config reference:
//  http://webpack.github.io/docs/configuration.html
//  https://webpack.js.org/configuration/
//  webpack version: `4.29.0`

let webpack       = require('webpack');
let TsProcessFork = require('fork-ts-checker-webpack-plugin')
let Uglifyjs      = require('uglifyjs-webpack-plugin');
let join          = require('path').join;


const NODE_ENV = process.env.NODE_ENV;

const production = NODE_ENV === 'production';
let plugins = production
  ? [new Uglifyjs()]
  : [
      new webpack.HotModuleReplacementPlugin()
    , new TsProcessFork({ watch: ['./src/']  })
    ];


module.exports = {
   mode     : production ? `production`: `development`
  ,target   : 'web'
  ,externals: {}
  ,entry    : {bundle: './src/client.tsx'}
  ,output   : {
     path    : join(__dirname, '/dist') // absolute path required
    ,filename: '[name].js'
    ,publicPath: 'dist/'
  }
  ,plugins  : plugins
  ,devtool  : "source-map" // https://webpack.js.org/configuration/devtool/#devtool
  ,resolve: {
    extensions: ['.ts','.tsx','.jsx','.js', '.json']
  }
  ,module   : {
    rules: [
      {test: /\.tsx?$/  , use: {loader: 'ts-loader'  , options: { transpileOnly: true }} }
    , {test: /\.css$/   , use: ['style-loader','css-loader']}
    ]
  }
  // TODO: Replace with webpack-dev-middleware
  ,devServer: {
      port       : 80
    , publicPath : '/public/'
    , hot        : true
    , open       : true
  }
  , bail: true
};
