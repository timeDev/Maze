/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Oskar Homburg
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/*global require, module, exports*/

var
    gulp = require('gulp'),
    connect = require('gulp-connect');

gulp.task('default', ['build'], function () {
    connect.server({
        root: '../build'
    })
});

var
    del = require('del');

gulp.task('clean', function (cb) {
    del(['../build'], {force: true}, cb);
});

var
    gutil = require('gulp-util'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    watchify = require('watchify');

gulp.task('watchify', ['clean'], function () {
    var bundler = watchify(browserify({
        entries: ['../src/js/main.js'],
        baseDir: './../src/js',
        debug: true,
        cache: {},
        packageCache: {}
    }));

    function bundle() {
        return bundler.bundle()
            // log errors if they happen
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .on('log', console.error)
            .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('../build'));
    }

    bundler.on('update', bundle);

    return bundle();
});

gulp.task('build', ['clean', 'watchify'], function () {
    return gulp.src(['../src/**', '!../src/{js,js/**}'])
        .pipe(gulp.dest('../build'));
});

gulp.task('make', function () {
    browserify({
        entries: ['../src/js/main.js'],
        baseDir: './../src/js',
        debug: false,
        cache: {},
        packageCache: {}
    })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('../build'));

    gulp.src(['../src/**', '!../src/{js,js/**}'])
        .pipe(gulp.dest('../build'));
});
