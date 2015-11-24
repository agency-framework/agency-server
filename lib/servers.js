var options = require('minimist')(process.argv.slice(2));

module.exports = function(config) {  
    if(options.ip) {
        config.host = options.ip
    }
    init(config);
}(require(process.cwd() +'/'+ options.serverConfig)[options.env || 'development']);

function init(config) {
    if(config.hapi) {
        var server = require(__dirname + '/servers/hapi')(config.hapi);

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