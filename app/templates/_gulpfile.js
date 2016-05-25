// generated on 2016-05-23 using generator-webapp 2.1.0
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const wiredep = require('wiredep').stream;

const browserify = require('browserify');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');

const replace = require('gulp-replace');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

const SITE_URL = 'mysite.dev';

gulp.task('styles', () => {
  return gulp.src('app/resources/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('app/tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
    const b = browserify({
      entries: 'app/resources/scripts/main.js',
      transform: babelify,
      debug: true
    });

    return b.bundle()
      .pipe(source('bundle.js'))
    .pipe($.plumber())
    .pipe(buffer())
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('app/tmp/scripts'))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return gulp.src(files)
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/resources/scripts/**/*.js', {
    fix: true
  })
    .pipe(gulp.dest('app/resources/scripts'));
});
gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js', {
    fix: true,
    env: {
      mocha: true
    }
  })
    .pipe(gulp.dest('test/spec/**/*.js'));
});

gulp.task('html', ['styles', 'scripts'], () => {
  return gulp.src('app/**/*.html')
    .pipe($.useref({searchPath: ['app/tmp', 'app', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('app/resources/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('dist/resources/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/resources/fonts/**/*'))
    .pipe(gulp.dest('app/tmp/fonts'))
    .pipe(gulp.dest('dist/resources/fonts'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    'app/**/.htaccess',
    '!app/**/*.html',
    '!app/tmp/*.*'
  ], {
    dot: true
  })
  .pipe($.if('*.php', $.replace('../app/templates/', '../craft/templates/')))
  .pipe(gulp.dest('dist'));
});

gulp.task('extra-resources', () => {
  return gulp.src([
    'app/resources/**/*.*',
    '!app/resources/bower_components/**/*.*',
    '!app/resources/fonts/**/*.*',
    '!app/resources/images/**/*.*',
    '!app/resources/scripts/**/*.*',
    '!app/resources/styles/**/*.*',
  ], {
    dot: true
  })
  .pipe(gulp.dest('dist/resources'));
});

gulp.task('templates', ['html'], () => {
  // del.bind(null, ['craft/templates/**/*.*']);

  return gulp.src([
    'dist/templates/**/*.*'
  ], {
    dot: true
  })
  .pipe(gulp.dest('craft/templates'));
});

gulp.task('clean', del.bind(null, ['app/tmp', 'dist', 'craft/templates/*.html']));

gulp.task('serve', ['styles', 'scripts', 'fonts'], () => {

  browserSync({
    notify: false,
    host: SITE_URL,
    proxy: SITE_URL,
    port: 9000
    // server: {
    //   baseDir: ['app/tmp', 'app'],
    //   routes: {
    //     '/bower_components': 'bower_components'
    //   }
    // }
  });

  gulp.watch([
    'app/templates/**/*.html',
    'app/resources/images/**/*',
    'app/tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/resources/styles/**/*.scss', ['styles']);
  gulp.watch('app/resources/scripts/**/*.js', ['scripts']);
  gulp.watch('app/resources/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);

});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('serve:test', ['scripts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': 'app/tmp/scripts',
        '/bower_components': 'app/resources/bower_components'
      }
    }
  });

  gulp.watch('app/resources/scripts/**/*.js', ['scripts']);
  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/resources/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/resources/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      exclude: ['bootstrap-sass'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['lint', 'templates', 'images', 'fonts', 'extras', 'extra-resources'], () => {
  del.sync(['dist/templates/**']);
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
