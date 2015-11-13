var options = require('minimist')(process.argv.slice(2));

module.exports = function(config) {
    init(config);
}(require(process.cwd() +'/'+ options.serverConfig)[options.env || 'development']);

function init(config) {
    if(config.hapi) {
        require(__dirname + '/hapi')(config.hapi);
        if(config.webpack) {
            require(__dirname + '/hapi-webpack')(config.dest, config.host, config.hapi, config.webpack);
        }
    }
//    if(config.weinre) {
//        require(__dirname + '/lib/weinre')(config.weinre);
//    }
}