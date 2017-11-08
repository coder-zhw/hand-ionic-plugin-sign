/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are split into several files in the gulp directory
 *  because putting it all here was too long
 */
'use strict';
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var reload = browserSync.reload;

// 静态服务器 + 监听 scss/html 文件
gulp.task('serve', ['sass', 'js', 'html'], function () {

    var routes = {
        '/bower_components': 'bower_components'
    };
    var baseDir = './dist';
    var server = {
        baseDir: baseDir,
        routes: routes
    };
    browserSync.init({
        startPath: '/sign-test.html',
        server: server
    });

    gulp.watch("src/*.scss", ['sass']).on('change', reload);
    gulp.watch("src/*.html", ['html']).on('change', reload);
    gulp.watch("src/*.js", ['js']).on('change', reload);

});

// scss编译后的css将注入到浏览器里实现更新
gulp.task('sass', function () {
    return gulp.src("src/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("dist"))
        .pipe(reload({stream: true}));
});

gulp.task('js', function () {
    return gulp.src("src/*.js")
        .pipe(gulp.dest("dist"))
        .pipe(reload({stream: true}));
});

gulp.task('html', function () {
    return gulp.src("src/*.html")
        .pipe(gulp.dest("dist"))
        .pipe(reload({stream: true}));
});

gulp.task('default', ['serve']);

gulp.task('build', ['js', 'sass', 'html']);