var options = require('minimist')(process.argv.slice(2));
var assemble = require('assemble');

assemble.task('server', function () {
    if(options.env === 'development') {
        require('gulp-nodemon')({
            script: require.resolve(options.server + '/lib/servers'),
            ignore: ['src/**/*'],
            args: ['--serverConfig=' + options.serverConfig]
        });
    } else {
        require(options.server + '/lib/servers');
    }
});

process.once('SIGINT', function() { process.exit(0); });