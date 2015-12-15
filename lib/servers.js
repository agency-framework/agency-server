"use strict";

var template = require('lodash/string/template');
var options = require('minimist')(process.argv.slice(2));
var serverConfig = JSON.parse(template(JSON.stringify(require(process.cwd() +'/'+ options.serverConfig)))({'root': process.cwd()}))[(options.env || 'development')];
var ip = require('./services/ip');

module.exports = function(config) {
    if(options.ip) {
        if(options.ip === 'true') {
            config.host = ip();
        } else {
            config.host = options.ip;
        }
    }
    init(config);
}(serverConfig);

function init(config) {
    if(config.hapi) {
        var server = require(__dirname + '/servers/hapi')(config.root, config.hapi);

        if(config.webpack) {
            require(__dirname + '/servers/webpack')(config.dest, config.host, config.hapi, config.webpack);
        }

        if(config.websocket) {
            require(__dirname + '/servers/websocket')(server, config.websocket, config.hapi.options.secret);
        }
    }
//    if(config.weinre) {
//        require(__dirname + '/servers/weinre')(config.weinre);
//    }
}
