var gulp = require('gulp'),
  concat = require('gulp-concat'),
  imagemin = require('gulp-imagemin'),
  fs = require('fs'),
  del = require('del'),
  minify = require('gulp-minify-css'),
  uglify = require('gulp-uglify'),
  connect = require('gulp-connect'),
  template = require('gulp-template');

var filePaths = {
  scripts: [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-aria/angular-aria.js',
    'bower_components/angular-material/angular-material.js',
    'bower_components/bootstrap/dist/js/bootstrap.js',
    'node_modules/mustache/mustache.js',
    'node_modules/codemirror/lib/codemirror.js',
    'node_modules/codemirror/addon/dialog/dialog.js',
    'node_modules/codemirror/addon/search/searchcursor.js',
    'node_modules/codemirror/addon/search/search.js',
    'node_modules/codemirror/mode/javascript/javascript.js',
    'node_modules/codemirror/keymap/sublime.js',
    'bower_components/angular-route/angular-route.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/lodash/dist/lodash.js',
    'app/components/**/**/*.js'
  ],
  images: 'app/assets/img/*',

  styles: [
    'bower_components/bootstrap/dist/css/bootstrap.css',
    'bower_components/angular-material/angular-material.css',
    'node_modules/codemirror/lib/codemirror.css',
    'node_modules/codemirror/theme/**.css',
    'node_modules/codemirror/addon/dialog/dialog.css',
    'node_modules/codemirror/addon/search/matchesonscrollbar.css',
    'app/styles/**/*.css'
  ]
};

//validate sources
var validateFileSources = function(sources) {
  sources.forEach(function(source) {
    if (!source.match(/\*/) && !fs.existsSync(source)) {
      throw source + " not found!";
    }
  });
}

//clean
gulp.task('clean', function(cb) {
  del(['app/public'], cb);
});

//Copy styles
gulp.task('styles', function() {
  validateFileSources(filePaths.styles);
  return gulp.src(filePaths.styles)
    .pipe(concat('app.css'))
    .pipe(minify())
    .pipe(gulp.dest('app/public/css'))
})

// Copy Scripts
gulp.task('scripts', function() {

  validateFileSources(filePaths.scripts);

  return gulp.src(filePaths.scripts)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('app/public/js'))
});

//server connection
gulp.task('connect', function() {
  connect.server({
    livereload: true,
    root: 'app',
    port: 5500
  })
});

// Copy all static images
gulp.task('images', function() {
  return gulp.src(filePaths.images)
    .pipe(imagemin({
      optimizationLevel: 5
    }))
    .pipe(gulp.dest('app/public/img'));
});

// gulp.task('template', function() {
//   return gulp.src(filePaths.html)
//     .pipe(concat('index.html'))
//     .pipe(template())
//     .pipe(gulp.dest('app/public'));
// });
// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(filePaths.scripts, ['scripts']);

  gulp.watch(filePaths.styles, ['styles']);

  gulp.watch(filePaths.images, ['images']);

  // gulp.watch(filePaths.html, ['template']);

});


// The default task (called when you run `gulp` from cli)
gulp.task('default', ['clean', 'watch', 'connect'], function() {
  gulp.start('scripts', 'images', 'styles');
});
