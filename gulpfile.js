'use strict';

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');

gulp.task('default', function() {
  gulp.start('app');
});

gulp.task('app', function() {
  gulp.start('app-styles', 'app-scripts', 'app-images', 'app-move');
});

gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('app/**/*.scss', ['app-styles']);

  // Watch .html files
  gulp.watch('app/**/*.html', ['app-move']);

  // Watch .js files
  gulp.watch('app/**/*.js', ['app-scripts']);

  // Watch image files
  gulp.watch('app/images/**/*', ['app-images']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed);


});


gulp.task('app-move',function(){
  // the base option sets the relative root for the set of files,
  // preserving the folder structure
  gulp.src(['app/bower_components/**/*','app/css/fonts/**/*','app/views/**/*','app/index.html','app/404.html'], { base: 'app/' })
  .pipe(gulp.dest('dist/'));
});


gulp.task('app-styles', function() {
  return gulp.src('app/css/main.scss')
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('app-scripts', function() {
  return gulp.src('app/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('app-images', function() {
  return gulp.src('app/images/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('app-clean', function(cb) {
    del(['dist/css', 'dist/js', 'dist/images','dist/bower_components','dist/iconic','dist/views','dist/index.html','dist/404.html'], cb);
});
