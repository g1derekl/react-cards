var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var nodemon = require('gulp-nodemon');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var reactify = require('reactify');

gulp.task('styles', function(){
  return gulp.src(['src/styles/**/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
      }
    }))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    // .pipe(gulp.dest('public/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest('public/'));
});

gulp.task('scripts', function(){

  var b = browserify({
    entries: 'src/js/index.jsx',
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [reactify]
  });

  return b.bundle()
    .pipe(source('src/js/index.jsx'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename('public/index.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./'));
});

gulp.task('start', ['scripts'], function () {
  return nodemon({
    script: 'server.js',
    watch: ['server.js', 'config.js', 'server/'],
    env: { 'NODE_ENV': 'development' }
  });
});

gulp.task('default', ['styles', 'start'], function() {
  gulp.watch("src/styles/**/*.scss", ['styles']);
  gulp.watch(["src/js/**/*.jsx", "src/js/**/*.js"], ['scripts']);
});
