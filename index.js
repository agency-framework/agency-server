module.exports = function(config) {
    if(config) {
        init(JSON.parse(config));
    } else {
        return init;
    }
}(process.env.CONFIG);

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