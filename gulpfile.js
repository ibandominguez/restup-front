'use strict';

var gulp = require('gulp');
var fs = require('fs');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var minifyHtml = require('gulp-minify-html');
var cssmin = require('gulp-cssmin');
var del = require('del');
var rev = require('gulp-rev');
var templateCache = require('gulp-angular-templatecache');

gulp.task('clean', function() {
  return del('www/');
});

gulp.task('views', function() {
  return gulp
    .src('app/views/**/*.html')
    .pipe(templateCache('views.js', { root: 'views', module: 'restup-front.views', standalone: true }))
    .pipe(gulp.dest('app/scripts/'));
});

gulp.task('usemin', function() {
  return gulp
    .src('app/index.html')
    .pipe(usemin({
      css: [cssmin(), 'concat', rev()],
      html: [minifyHtml({ empty: true })],
      js: [uglify(), rev()]
    }))
    .pipe(gulp.dest('www/'));
});

gulp.task('build', function() {
  runSequence(['views', 'clean'], 'usemin', function() {
    fs.writeFileSync('app/scripts/views.js', 'angular.module("restup-front.views", []);');
  });

  gulp
    .src(['app/images/**/*'], { base: 'app' })
    .pipe(gulp.dest('www/'));

  gulp
    .src(['app/bower_components/roboto-fontface/fonts/**/*'])
    .pipe(gulp.dest('www/fonts/'));

  gulp
    .src(['app/bower_components/ionic/fonts/*'])
    .pipe(gulp.dest('www/fonts/'));
});
