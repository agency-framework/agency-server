var options = require('minimist')(process.argv.slice(2));
var assemble = require('assemble');

assemble.task('server', function () {
    if(options.env === 'development') {
        require('gulp-nodemon')({
            script: require.resolve(options.server + '/lib/server'),
            ignore: ['src/**/*'],
            args: ['--serverConfig=' + options.serverConfig]
        });
    } else {
        require(options.server + '/lib/server');
    }
});