/* eslint-disable @typescript-eslint/no-var-requires */

const gulp = require('gulp')
const compiler = require('webpack')
const mocha = require('gulp-mocha')
const webpack = require('webpack-stream')

gulp.task('build', function () {
  return gulp.src('src/index.js')
    .pipe(webpack(
      require('./webpack.conf.js'),
      compiler
    ))
    .pipe(gulp.dest('public/js'))
})

gulp.task('test', function () {
  return gulp.src('test/**/*.js')
    .pipe(mocha({ require: '@babel/register' }))
})

gulp.task('watch', function () {
    gulp.watch(['src/**/*.js', 'src/**/*.jsx','test/**/*.js'], gulp.series('build', 'test'))
})

gulp.task('default', gulp.series('build', 'test', 'watch'))
