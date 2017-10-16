var gulp = require('gulp')
var sass = require('gulp-sass')
var del = require('del')
var useref = require('gulp-useref')
var runSequence = require('run-sequence')
var cleanCSS = require('gulp-clean-css')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var browserSync = require('browser-sync').create()

gulp.task('compile-sass', () => {
  return gulp.src('app/scss/*.scss')
         .pipe(sass())
         .pipe(gulp.dest('dist/'))
})

gulp.task('clean-dist', () => {
  return del('dist/')
})

gulp.task('copy-assets', () => {
  return gulp.src([
           'app/fonts/*',
           'app/images/*'
         ])
         .pipe(gulp.dest('dist/'))
})

gulp.task('minify-css', () => {
  return gulp.src('dist/*.css')
         .pipe(concat('main.min.css'))
         .pipe(gulp.dest('dist/'))

})

gulp.task('prepare-css', () => {
  runSequence(
    'compile-sass',
    'minify-css'
  )
})

gulp.task('minify-js', () => {
  return gulp.src('app/js/*.js')
         .pipe(concat('main.min.js'))
         .pipe(uglify())
         .pipe(gulp.dest('dist/'))
})

gulp.task('copy-html', () => {
  return gulp.src('app/index.html')
         .pipe(gulp.dest('dist/'))
})

gulp.task('watch-changes', () => {
  gulp.watch('app/scss/*.scss', ['prepare-css'])
  gulp.watch('app/js/*.js', ['minify-js'])
  gulp.watch('app/index.html').on('change', browserSync.reload())
})

gulp.task('auto-reload', () => {
  browserSync.init({
    server: {
      baseDir: "dist/"
    }
  })
})

gulp.task('build', () => {
  runSequence(
    'clean-dist',
    'copy-assets',
    'prepare-css',
    'minify-js',
    'copy-html'
  )
})

gulp.task('default', () => {
  runSequence(
    'build',
    'auto-reload'
  )
})
