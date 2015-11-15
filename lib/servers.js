var options = require('minimist')(process.argv.slice(2));

module.exports = function(config) {
    console.log('config', config);
    init(config);
}(require(process.cwd() +'/'+ options.serverConfig)[options.env || 'development']);

function init(config) {
    if(config.hapi) {
        require(__dirname + '/servers/hapi')(config.hapi);
        if(config.webpack) {
            require(__dirname + '/servers/hapi-webpack')(config.dest, config.host, config.hapi, config.webpack);
        }
    }
//    if(config.weinre) {
//        require(__dirname + '/servers/weinre')(config.weinre);
//    }
}