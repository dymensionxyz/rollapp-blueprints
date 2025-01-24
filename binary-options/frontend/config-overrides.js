// config-overrides.js
const webpack = require('webpack');

module.exports = function override(config, env) {
    // Provide fallbacks for Node modules in the browser
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process/browser'),
        // You can add more if needed:
        // path: require.resolve('path-browserify'),
        // http: require.resolve('stream-http'),
        // https: require.resolve('https-browserify'),
        // etc.
    });
    config.resolve.fallback = fallback;

    // Provide global variables for these polyfills (like “process”)
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    ]);

    // Example: keep source-map-loader if you already have it
    config.module.rules.push({
        test: /\.(js|mjs|jsx)$/,
        enforce: 'pre',
        loader: require.resolve('source-map-loader'),
        resolve: {
            fullySpecified: false,
        },
    });

    return config;
};