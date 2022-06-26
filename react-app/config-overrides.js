/* config-overrides.js */
module.exports = function override(config, env) {
    config.output.library = '[name]'
    config.output.libraryTarget = 'umd'
    config.output.publicPath = '//localhost:8099/'
    return config;
}
