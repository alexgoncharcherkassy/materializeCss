'use strict';
var gulp         = require('gulp'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify'),
    less         = require('gulp-less'),
    cleanCss     = require('gulp-clean-css'),
    del          = require('del'),
    sourcemaps   = require('gulp-sourcemaps'),
    babel        = require('gulp-babel');

gulp.task('clean', function () {
    del(['less', 'js']);
});

gulp.task('less', function() {
    return gulp.src([
        'web-src/css/app.less'
    ])
        .pipe(sourcemaps.init(''))
        .pipe(less())
        .pipe(cleanCss())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('web/css/'));
});

gulp.task('js', function() {
    return gulp.src([
        'bower_components/jquery/dist/jquery.js',
        'bower_components/materialize/dist/js/materialize.min.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(babel({compact: true}))
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write("./maps"))
        .pipe(gulp.dest('web/js'));
});

gulp.task('pages-js', function() {
    return gulp.src([
        'web-src/js/*.js',
        'web-src/js/**/*.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(babel({compact: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write("./maps"))
        .pipe(gulp.dest('web/js'));
});

gulp.task('fonts', function () {
    return gulp.src(['bower_components/materialize/dist/fonts/roboto/*'])
        .pipe(gulp.dest('web/fonts/'))
});

gulp.task('default', ['clean'], function () {
    var tasks = [
        'fonts',
        'less',
        'js',
        'pages-js'
    ];

    tasks.forEach(function (val) {
        gulp.start(val);
    });
});

gulp.task('watch', ['less', 'pages-js'], function () {
    gulp.watch('web-src/less/*.less', ['less']);
    gulp.watch('web-src/less/**/*.less', ['less']);
    gulp.watch('web-src/js/*.js', ['pages-js']);
    gulp.watch('web-src/js/**/*.js', ['pages-js']);
});

