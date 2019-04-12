// Webpack version: 4.29.6
import Express from "express"
import { join, sep, resolve } from "path";
import webpack, { MultiCompiler } from "webpack";
import webpackConfig from "../webpack.config.js"
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import { watch } from "chokidar";
import { Volume } from "memfs"

declare const ram;
declare global {
  // type BigInt = any;
}

const   log = console.log.bind(console);
        // Use RAM file system for middleware to achive a good performance
const   mdd: any = new Volume();
        mdd.join = join;
const   webpackCompiler = webpack(webpackConfig as webpack.Configuration[]) as any;
const   clientCompiler  = webpackCompiler.compilers[0];
const   secondCompiler  = webpackCompiler.compilers[1];
        clientCompiler.outputFileSystem = mdd;

        (global as any).mdd = mdd;

        // Create dev server
const   dev: any          = Express();
        dev.reportMessage = `Development server:`;
        dev.all(`*`, function(req, res, next) {
          log(dev.reportMessage, `url requested:`, req.url)
          next(`route`)
      })

        dev.use(webpackHotMiddleware(webpackCompiler.compilers[0], { reload: true }));
        dev.all(`*`, function(req, res, next) {
          const service = require(`./server`).service;
                service(req, res, next)
        })

        // Clear require.cache of loaded modules
const   rgx = new RegExp(join(process.cwd(), `dist`).split(sep).join(`[\\/\\\\]`), "g");
const   modulesCacheClear = function () {
          Object.keys(require.cache).forEach(function (id) {
            if (rgx.test(id)) {
              delete require.cache[id];
            }
          })
          log(dev.reportMessage, `require cache cleared`);
        }

        // Watch client sources
const   wpWatcher = webpackCompiler.watch({
          // aggregateTimeout: 300,
          poll: void 0
        }, function (err: any, stats) {
          if (err) {
            log(dev.reportMessage, `WEBPACK FAILURE:`, err, err.details || ``);
            const fileTree = mdd.toJSON()
            webpackCompiler
            // Warning: Infinite loop
            // wpWatcher.invalidate()
            process.exit();
            return
          };
          if (!err && stats.hasErrors()) { log(stats.toJson().errors); }

          modulesCacheClear()
          // File system debugging
          const fs: any[]       = (webpackCompiler instanceof MultiCompiler)
              ? webpackCompiler.compilers.map((compiler) => compiler.outputFileSystem)
              : [webpackCompiler.outputFileSystem];
          const fileTree = mdd.toJSON();
          let dir;
          try {
            dir = mdd.readdirSync(resolve(webpackConfig[0].output.path, `../`))
            dir = dir.concat(mdd.readdirSync(join(webpackConfig[0].output.path)))
          } catch (error) {
            log(dev.reportMessage, error);
          }
          // Logging output
          const statsConfig = (Array.isArray(webpackConfig) ? webpackConfig[0] : webpackConfig).stats;
          log(stats.toString(statsConfig));
          log(dev.reportMessage, `client bundle compilation is done, fs content:`);
          // console.dir(dir);

        });

        // Watch specified above folder
        const   sources = watch(`./src/**/**.*`);
        sources.on(`ready`, function() {
          // TODO: Memory bloating?
          sources.on(`all`, modulesCacheClear)
        })

const   host = `127.0.0.1`;
const   port = 80;
const   server = dev.listen(port, host, function () {
          log(dev.reportMessage, `started at`, server.address())
        })

const   opn = require(`open`);
        setTimeout(opn.bind(void 0, `http://${host}:${port || 80}`), 6500)

        // process.on(`uncaughtException`, function (err) {
        //   log(dev.reportMessage, `unhandled error`)
        //   log(err)
        // })
