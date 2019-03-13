const config = require(`./tools/webpack.default`);

const production    = config.production;
const plugins       = config.plugins;
const loaders       = config.loaders;
const loadersServer = config.loadersServer;
const client        = config.clientConfig;
const server        = config.serverConfig;

module.exports = [client, server];
