var http = require('http');
var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var livereload = require('gulp-livereload');
var cLivereload = require('connect-livereload');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var insert = require('gulp-insert');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var connect = require('connect');
var serveStatic = require('serve-static');
var del = require('del');
var yargs = require('yargs')
  .default('env', 'local')
  .argv;

var env = yargs.env;

var paths = {
  src: {
    root: './src/',
    html: './src/**/*.html',
    assets: {
      images: './src/styles/img/**/*.*',
      css: './src/styles/**/*.css',
      js: [
      	'./src/styles/private_layout.css',
      	'./src/styles/public_layout.css',
      	'./src/styles/lib_overwrite.css',
      ],
      lib: {
        css: [
          'lib/ionic/css/ionic.css',
          'lib/Ionicons/css/ionicons.css',
          'lib/Swiper/dist/css/swiper.css',
        ],
        js: [
          'lib/ionic/js/ionic.bundle.js',
          'lib/ng-file-upload/ng-file-upload.js',
          'lib/lodash/dist/lodash.js',
          'lib/Swiper/dist/js/swiper.js',
          'lib/jquery/dist/jquery.js'
        ],
        fonts: './src/styles/fonts/**/*.*'
      }
    }
  },
  tmp: {
    root: './.tmp/',
    images: './.tmp/img/',
    styles: './.tmp/styles/',
    scripts: './.tmp/js/',
    fonts: './.tmp/fonts/'
  },
  build: {
    root: './build/'
  }
};

var apis = {
  'local': 'http://127.0.0.1:8080/chinaoe',
  'test': 'http://172.16.9.50:8080/chinaoe',
  'dev': 'http://192.168.12.21:8080/chinaoe',
  'abc': 'http://10.1.10.137:8080/chinaoe',
  'production': 'http://172.16.9.50:8080/chinaoe',
  'uat':'http://106.14.47.190:8080/chinaoe',
  'suping': 'http://192.168.12.38:8080/chinaoe',
  'fang': 'http://192.168.12.143:8080/chinaoe'
};

var API = apis[env];

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
};

// Task clean
gulp.task('clean', function() {
  return del([paths.tmp.root, paths.build.root]).then(function(paths) {
    console.log('Deleted files and folders:\n', paths.join('\n'));
  })
});

// Task html
gulp.task('html', function() {
  return gulp.src(paths.src.html)
    .pipe(gulp.dest(paths.tmp.root))
    .pipe(livereload());;
});

// Task font
gulp.task('font', function() {
  return gulp.src(paths.src.assets.lib.fonts)
    .pipe(gulp.dest(paths.tmp.fonts))
});

// Task js
gulp.task('js', function() {
  return gulp.src(paths.src.assets.js)
    // .pipe(replace(/__REPLACE_API__/g, API))
    .pipe(insert.append(';'))
    .pipe(concat('build.js'))
    .on('error', handleError)
    //.pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(paths.tmp.scripts))
    .pipe(livereload());
});

// Task lib_js
gulp.task('lib_js', function() {
  return gulp.src(paths.src.assets.lib.js)
    .pipe(insert.append(';'))
    .pipe(concat('lib.js'))
    .on('error', handleError)
    //.pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(paths.tmp.scripts))
    .pipe(livereload());
});

// Task lib
gulp.task('css', function() {
  return gulp.src(paths.src.assets.css)
    .pipe(concatCss('app.css'))
    .pipe(gulp.dest(paths.tmp.styles))
    .pipe(livereload());
});

// Task lib_css
gulp.task('lib_css', function() {
  return gulp.src(paths.src.assets.lib.css)
    .pipe(concatCss('lib.css'))
    .pipe(gulp.dest(paths.tmp.styles))
    .pipe(livereload());
});

gulp.task('lib', ['lib_css', 'css', 'lib_js', 'js']);

// Task image
gulp.task('image', function() {
  return gulp.src(paths.src.assets.images)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(paths.tmp.images))
    .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(paths.src.html, ['html']);
  gulp.watch(paths.src.assets.lib.fonts, ['font']);
  gulp.watch(['src/js/**/*.js'], ['js']);
  gulp.watch(['src/styles/css/**/*.css'], ['css']);
  gulp.watch(paths.src.assets.images, ['image']);
});

gulp.task('s', ['html', 'font', 'image', 'lib', 'watch'], function() {
  var app = connect()
    .use(cLivereload({ port: 39000 }))
    .use(serveStatic(paths.tmp.root, {
      index: 'index.html'
    }));
  http.createServer(app)
    .listen(9000)
    .on('listening', function() {
      console.log('Web server started on http://localhost:9000')
    });
  livereload.listen();
});

gulp.task('build', ['html', 'font', 'image', 'lib'], function() {
  return gulp.src(paths.tmp.root + '**/*.*')
    .pipe(gulp.dest(paths.build.root));
});
