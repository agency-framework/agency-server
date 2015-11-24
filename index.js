var options = require('minimist')(process.argv.slice(2));

module.exports = function (cb) {
    if(options.env === 'development') {
        require('gulp-nodemon')({
            script: require.resolve(options.server + '/lib/servers'),
            ignore: ['src/**/*'],
            args: ['--serverConfig=' + options.serverConfig, (options.ip) ? '--ip=' + options.ip : null]
        });

        process.once('SIGINT', function() { process.exit(0); });
    } else {
        require(options.server + '/lib/servers');
    }

    if(options.timeout) {
        setTimeout(function(){
            process.exit(0);
        },+options.timeout);
    }
};