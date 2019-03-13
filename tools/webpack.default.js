// Config references: http://webpack.github.io/docs/configuration.html
//                    https://webpack.js.org/configuration/
//
// webpack version  : 4.29.6
// TODO: Don't need anymore. Consider to return back https://github.com/Realytics/fork-ts-checker-webpack-plugin
// TODO: Checkout production assets version
// TODO: Fix webpackSssets

const webpack       = require(`webpack`);
const Uglifyjs      = require(`uglifyjs-webpack-plugin`);
const CssExtract    = require(`mini-css-extract-plugin`)
const CopyFiles     = require(`copy-webpack-plugin`)
const AssetsPlugin  = require(`assets-webpack-plugin`)
const nodeExternals = require(`webpack-node-externals`);
const path          = require( `path` );
const join          = path.join;

const NODE_ENV = process.env.NODE_ENV;

// This variable is used to configure behaviour of some plugins and loaders below
const production = NODE_ENV === `production`;
console.log(`Building for`, production ? `production` : `development`);


// Lust of plugins for easier reference
// Repeating use of some of these plugins promts their extraction
// into a separate list
let plugins = {};
    plugins.hot = new webpack.HotModuleReplacementPlugin()

    plugins.publicAssets    = new AssetsPlugin({
      filename    : `assets.json`,
      path        : join(process.cwd(), `/dist/public`),
      keepInMemory: true
    })

    plugins.banner = new webpack.BannerPlugin({
      banner    : `Entry-only banner! \nhash:[hash], name:[name]`,
      entryOnly : true
    })

    plugins.copyFiles = new CopyFiles([
      // WARNING: Make sure it is properly configured
      // non-glob patterns aren't watched
      { from: `./src/public/*.*`, to: `./`, flatten: true },
      {
          from: `./src/public/assets/*.*`,

          to: `./data`,

          transformPath: (relDest, absoluteDest) => {
            return relDest.split(`public`)[1]
          }
      } // this won't track file changes
      // { from: `./src/foo/**/*.@(png|svg|gif|mp3|webm|mp4)`, to: `./foo/[name].[ext]`, toType: `template`}
    // Specify path for assets you want to copy to
    // , { from: `./src/component/` }
    // , { from: `./src/index.html` , to: `../index.html` }
    ], {
      // logLevel: `debug`,
      // copyUnmodified: true
    });

    plugins.cssExtract = new CssExtract({
      filename      : production ? `[name].[hash:6].css`   : `[name].css`,
      chunkFilename : production ? `[name].[hash:6].m.css` : `[name].m.css`
    })

    plugins.uglifyJs = new Uglifyjs({
      parallel: true,
      uglifyOptions: {
        output: {
          comments: false, // strip comments
        },
      },
    });

// Currently unused
let developmentPlugins = {
  // new webpack.NoEmitOnErrorsPlugin() // Added if mode is production
};


// List of loader for easier reference
// Many of these are used in both client and server configs
const loaders = {}
      loaders.multimedia = {
        test: /\.(png|jpg|gif|svg|mp3|mp4|webm)$/,
        use: [ {
          loader: `url-loader`,
          options: {
            limit: 1024,
            emitFile: true,
            name: production ? `[hash:8].[ext]` : `[name].[ext]`,
            outputPath ( url, resourcePath, context ) {
              return resourcePath, path.dirname( resourcePath ).split( path.sep ).reverse()[ 0 ] + `/${ url }`;
            }
          },
        }, ],
      };
      loaders.svgraw        = {
        test: /\.svg$/,
        use: `raw-loader`
      }
      loaders.typescript = {
      test: /\.(j|t)sx?$/,
      use: {
        loader: `ts-loader`,
        options: {
          // Make sure webpack`s stats are reported from
          transpileOnly: true
          // See https://github.com/webpack/webpack/issues/5703#issuecomment-357512412
          ,
          configFile: `tsconfig.client.json`
        }
      }
      };

const loadersServer = {};

      loadersServer.multimedia = {
        test: loaders.multimedia.test,
        use: [{
          loader: `file-loader`,
          options: {
            name: loaders.multimedia.use[ 0 ].options.name,
            // Do NOT emit files cause it is already
            // done by client's configuration above
            emitFile: false
          }
        }]
      };

      loadersServer.css = {
        test: /\.css$/g,
        use: [
        // TODO: consider to use isomorphic loader
        // `raw-loader`,       // may be used, excluding to-string loader
        `to-string-loader`, // Just load file as string
        `css-loader`
        ]
      }

const clientConfig = {
  // WARNING: Conflicts with MiniCssExtractPlugin when set to `production`
  // WARNING: It sets NODE_ENV to `production`
   mode     : production  ? `production` : `none`
  ,stats    : {
      colors      : true
    , publicPath  : true
  }
  ,target   : `web`
  ,externals: {}
  ,entry    : {
      bundle    : production ? `./src/client.tsx` : [`webpack-hot-middleware/client`, `./src/client.tsx`],
      polyfills : `./src/polyfills.tsx`

  }

  ,output   : {
      path              : join(process.cwd(), `./dist/public`) // absolute path required
    , filename          : production ? `[name].[hash:6].js`     : `[name].js`
    , chunkFilename     : production ? `[name].[hash:6].m.js`   : `[name].m.js`
    , pathinfo          : !production
    , publicPath        : `/public/`
    , crossOriginLoading: false // production ? `use-credentials` : 'anonymous'
  }

  ,plugins  : production
    ? [
        plugins.publicAssets
      , plugins.banner
      , plugins.copyFiles
      , plugins.cssExtract
      , plugins.uglifyJs
    ]
    : [
        plugins.publicAssets
      , plugins.banner
      , plugins.copyFiles
      , plugins.hot
    ]

  ,devtool  : `source-map` // https://webpack.js.org/configuration/devtool/#devtool
  ,resolve: {
    extensions: [`.ts`,`.tsx`,`.jsx`,`.js`, `.json`]
  }
  ,module   : {
    rules: [
      // TODO: Provide babel js loader
      loaders.typescript
    , loaders.multimedia
    , {test: /\.css$/   , use: [
          production ? CssExtract.loader : `style-loader`
        , `css-loader`
      ]}
    ]
  }
  ,node     : {}
  ,optimization: {
    splitChunks: {
      // chunks: `all`,
      automaticNameDelimiter: `.`,
      // name (module, chunks, cacheGroupKey){},
      // chunks = async | initial | all | func
      chunks (chunk) {
        // Exclude polifills
        // WARNING: if additional entries are used
        // then webpack may output weird chunks
        return chunk.name !== `polyfills`;
      },
      // cacheGroups: {}
    }
  }
  // TODO: Replace with webpack-dev-middleware
  /* ,devServer: {
      port       : 80
    , publicPath : `./public/`
    , hot        : true
    , open       : true
  } */
  ,bail: true
};

const serverConfig = {
  ...clientConfig,
  target: `node`,
  entry: {
    server: `./src/server.tsx`
  },
  output: {
      library           : `server`
    , libraryTarget     : `commonjs2`
    , path              : join(process.cwd(), `dist/`) // absolute path required
    // , filename          : `[name].js`
    // , chunkFilename     : clientConfig.output.chunkFilename
    , pathinfo          : !production
    // , publicPath        : clientConfig.output.publicPath
  },
  plugins: production
    ? [
        plugins.banner
      , plugins.uglifyJs
      , plugins.cssExtract // If not provided then loader throws error
    ]
    : [
        plugins.banner
    ],
  devtool  : false,
  module: {
    rules: [
        loaders.typescript
      , loadersServer.multimedia
      , loadersServer.css
    ]
  },
  /* externals: {
      react                             : `react`
    , express                           : `express`
    , send                              : `send`
    , dotenv                            : `dotenv`
    , [`@emmetio/expand-abbreviation`]  : `@emmetio/expand-abbreviation`
    , expressua                         : `express-useragent`
  }, */
  externals: [nodeExternals({
    // whitelist: []
  })],
  optimization: void 0
}


// It is possible to export several configs like [config1, config2, ...configN ]
module.exports = {
  production,
  plugins,
  loaders,
  loadersServer,
  clientConfig,
  serverConfig
}
