'use stict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const bs = require('browser-sync');
const del = require('del');

gulp.task('styles', function() {  
  return gulp 
    .src('app/static/css/**/main.scss', {base : 'app'})
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 8 versions'],
      browsers: [ 
        "Android >= 4",
        "Chrome >= 20",
        "Firefox >= 24",
        "Explorer >= 11",
        "iOS >= 6",
        "Opera >= 12",
        "Safari >= 6"
      ] 
    }))
    .pipe(csso())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
    .pipe(bs.reload({ stream: true }))
})

gulp.task('clean', function() {  
  return del('dist');
})

gulp.task('static:fonts', function() { 
  return gulp
    .src('app/static/fonts/**/*', {base : 'app', since: gulp.lastRun('templates')})
    .pipe(gulp.dest('dist'))
    .pipe(bs.reload({ stream: true }));
})

gulp.task('static:img', function() {  
  return gulp
    .src('app/static/img/**/*', {base : 'app', since: gulp.lastRun('templates')})
    .pipe(gulp.dest('dist'))
    .pipe(bs.reload({ stream: true }));
})

gulp.task('templates', function() {  
  return gulp
    .src('app/templates/**/*.html', {base : 'app', since: gulp.lastRun('templates')})
    .pipe(gulp.dest('dist'))
    .pipe(bs.reload({ stream: true }));
})

gulp.task('watch', function() {  
  gulp.watch('app/static/css/**/*', gulp.series('styles'));
  gulp.watch('app/templates/**/*', gulp.series('templates'));
})

gulp.task('serve', function() { 
  bs.init({
    server: 'dist',
    directory: true
  });
});

gulp.task(
  'build',
  gulp.series(
    gulp.parallel('clean'),
    gulp.parallel('styles', 'templates'),
    gulp.parallel('static:fonts', 'static:img')
  )
);

gulp.task(
  'dev', 
  gulp.series(
    gulp.parallel('build'),
    gulp.parallel('watch', 'serve')
  )
);