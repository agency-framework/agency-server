var options = require('minimist')(process.argv.slice(2));

module.exports = function(config) {
    if(config) {
        init(config);
    } else {
        return init;
    }
}(require(options.config)[options.env || 'development']);

function init(config) {
    if(config.hapi) {
        require(__dirname + '/lib/hapi')(config.hapi);
        if(config.webpack) {
            require(__dirname + '/lib/hapi-webpack')(config.dest, config.host, config.hapi, config.webpack);
        }
    }
//    if(config.weinre) {
//        require(__dirname + '/lib/weinre')(config.weinre);
//    }
}