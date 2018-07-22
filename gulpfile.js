var gulp            = require('gulp'),
    scss            = require('gulp-sass'),
    cleanCSS        = require('gulp-clean-css'),
    autoprefixer    = require('gulp-autoprefixer'),
    concatCSS       = require('gulp-concat-css'),
    rename          = require('gulp-rename'),
    inject          = require('gulp-inject'),
    uglify          = require('gulp-uglify'),
    concat          = require('gulp-concat'),
    plumber         = require('gulp-plumber'),
    babel           = require('gulp-babel'),
    browserify      = require('gulp-browserify'),
    clean           = require('gulp-clean'),
    sourcemaps      = require('gulp-sourcemaps'),
    htmlmin         = require('gulp-html-minifier'),
    browsersync     = require('browser-sync');
    wait            = require('gulp-wait');

var src             = './src/',
    dist            = './dist/';

 // #################################################
    // MINIFY JS

    gulp.task('js',function(){
        gulp.src(src + 'js/*.js')
            .pipe(sourcemaps.init())
                .pipe(plumber())
                .pipe(concat('global.js'))
                .pipe(babel({
                    presets: ['es2015'] }))
                .pipe(browserify({
                    insertGlobals: true,
                    debug: !gulp.env.production }))
                .pipe(uglify())
                .pipe(rename({ suffix: '.min'}))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(dist + 'assets/js'))
            .pipe(browsersync.stream());
    });

    // #################################################
    // MINIFY SCSS

    gulp.task('scss',function(){
        gulp.src(src + 'sass/*.scss')
            .pipe(sourcemaps.init())
                .pipe(plumber())
                .pipe(wait(500))
                .pipe(scss())
                .pipe(autoprefixer())
                .pipe(rename({ basename: 'style'}))
                .pipe(cleanCSS())
                .pipe(rename({ suffix: '.min'}))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(dist + 'assets/css'))
            .pipe(browsersync.stream());
    });
    
    // #################################################
    // MINIFY HTML

    gulp.task('html',function(){
        gulp.src(dist + '*.html',{force: true})
        .pipe(clean());
        gulp.src(src + '*.html')
            .pipe(plumber())
            .pipe(wait(500))
            .pipe(htmlmin({collapseWhitespace: true}))
            .pipe(gulp.dest(dist))
            .pipe(browsersync.stream());
    });

    // #################################################
    // WATCH

    gulp.task('default' ,function(){

        browsersync.init({
                server:'./dist'
        });

        gulp.watch([src + '*.html'],['html'])
        gulp.watch([src + 'sass/*.scss'],['scss'])
        gulp.watch([src + 'js/*.js'],['js'])
    });