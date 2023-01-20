
const gulp = require('gulp');
const compiler = require('webpack');
const webpack = require('webpack-stream');

gulp.task('build', function() {
  return gulp.src('src/index.js')
    .pipe(webpack(
      require('./webpack.conf.js'), 
      compiler
    ))
    .pipe(gulp.dest('public/js'))
});

gulp.task('default', function() {
  gulp.watch(['src/**/*.js', 'src/**/*.jsx'], gulp.series('build'));
});