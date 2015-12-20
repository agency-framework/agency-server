"use strict";

var hapi = require('hapi');
var webpackConnection = require('hapi-webpack-connection');
var webpack = require('webpack');
var path = require('path');


module.exports = function(dest, serverName, hapiConfig, webpackConfig) {
    dest = dest || 'tmp';
    serverName = serverName || 'localhost';

    var options = {
        entry: webpackConfig.files.src,

        output: {
            path: path.dirname(dest + '/' + webpackConfig.files.dest),
            filename: path.basename(dest + '/' + webpackConfig.files.dest),
            publicPath: path.dirname(dest + '/' + webpackConfig.files.dest)
        },

        plugins: function() {
            return webpackConfig.plugins.map(function(plugin) {
                return require(plugin.script)(webpack, plugin.config);
            });
        }(),

        module: {
            preLoaders: (webpackConfig.module.preLoaders || []).map(convertLoader),
            loaders: (webpackConfig.module.loaders || []).map(convertLoader),
            postLoaders: (webpackConfig.module.postLoaders || []).map(convertLoader)
        },

        resolve: webpackConfig.resolve,

        node: {
            __filename: true,
            __dirname: true
        },

        devServer: {
            contentBase: 'http://' + serverName + ':' + hapiConfig.port + '/',
//            contentBae: process.cwd(),
            filename: null, // Get from output.filename
            historyApiFallback: false,
            host: serverName,
            port: webpackConfig.port, // 0 = Randomly selected
            hot: true,
            https: false,
            inline: true,
            lazy: false,
            noInfo: false,
            outputPath: 'http://' + serverName + ':' + webpackConfig.port + '/' + dest + '/',
            publicPath: null, // Get from output.publicPath
            proxy: {},
            quiet: false,
            stats: {
                cached: false,
                cachedAssets: false
                // colors: true or false, turned on if the terminal supports it
            }
        },

        devtool: "#eval-source-map",
        debug: true
    };

    var server = new hapi.Server();
    server.connection(webpackConnection(options).connection);
    server.start(function () {
        console.log('Debug Server running at:', server.info.uri);
    });
};

function convertLoader(loader) {
    loader.test = new RegExp(loader.test);
    if(loader.exclude) {
        loader.exclude = new RegExp(loader.exclude);
    }
    return loader;
}
