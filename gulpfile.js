var gulp = require('gulp'),
  del = require('del'),
  autoprefixer = require('gulp-autoprefixer'),
  notify = require('gulp-notify'),
  browserSync = require('browser-sync'),
  sass = require('gulp-sass'),
  concat = require("gulp-concat"),
  rename = require("gulp-rename"),
  imagemin = require('gulp-imagemin'),
  minify = require('gulp-minify'),
  plumber = require('gulp-plumber');


var paths = {
  html: {
    src: './index.html'
  },
  dirs: {
    build: './dist'
  },
  scss: {
    src: './assets/scss/main.scss',
    dest: './dist/css',
    watch: './assets/scss/**/*.scss'
  },
  js: {
    src: ['./assets/plugins/*.js', './assets/js/**/*.js'],
    dest: './dist/js',
    watch: './assets/js/**/*.js',
    watchPlugins: './plugins/*.js'
  },
  images: {
    src: './assets/images/**/*',
    dest: './dist/images',
    watch: './assets/images/**/*'
  },
  fonts: {
    src: './assets/fonts/*',
    dest: './dist/fonts',
    watch: './assets/fonts/*'
  }
};

gulp.task('clean', function () {
  return del(paths.dirs.build);
});

gulp.task('html', function () {
  return gulp.src(paths.html.src)
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('styles', function () {
  return gulp.src(paths.scss.src)
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'compressed' }).on("error", notify.onError( function (error) {
      return error.message;
    } )))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('scripts', function () {
  return gulp.src(paths.js.src)
    .pipe(plumber())
    .pipe(concat('scripts.js'))
    .pipe(minify())
    .pipe(gulp.dest(paths.js.dest));
});

gulp.task('images', function () {
  return gulp.src(paths.images.src)
    .pipe(plumber())
    .pipe(imagemin())
    /*.pipe(rename({
      dirname: ''
    }))*/
    .pipe(gulp.dest(paths.images.dest));
});

gulp.task('fonts', function () {
  return gulp.src(paths.fonts.src)
    .pipe(plumber())
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('server', function () {
  browserSync.init({
    server: {
      baseDir: "./"
    },
    reloadOnRestart: true
  });
  gulp.watch(paths.html.src, gulp.parallel('html'));
  gulp.watch(paths.scss.watch, gulp.parallel('styles'));
  gulp.watch(paths.js.watch, gulp.parallel('scripts'));
  gulp.watch(paths.js.watchPlugins, gulp.parallel('scripts'));
  gulp.watch(paths.images.watch, gulp.parallel('images'));
  gulp.watch(paths.fonts.watch, gulp.parallel('fonts'));
});


gulp.task('build', gulp.series(
  'clean',
  'styles',
  'scripts',
  'images',
  'fonts'
));

gulp.task('dev', gulp.series(
  'build', 'server'
));
