var gulp = require('gulp');
var webserver = require('gulp-webserver');

var webserverConfig = {
    "https": false,
    "hostname": "localhost",
    "host": "127.0.0.1",
    "port": 9001,
    "open": true,
    "livereload": true
};

gulp.task('webserver', function() {
    gulp.src('app')
        .pipe(webserver(webserverConfig));
});

gulp.task('default', ['webserver']);
