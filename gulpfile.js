const { src, dest, parallel, series, watch } = require('gulp');
const autoprefixer = require('autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const csso = require('postcss-csso');
const webp = require('gulp-webp');
const del = require('del');
const svgstore = require('gulp-svgstore');

const paths = {
    styles: 'source/sass/style.scss',
    html: 'source/*.html',
}
//Styles
function styles() {
    return src(paths.styles)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([ autoprefixer(), csso() ]))
        .pipe(rename('style.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'))
        .pipe(browserSync.stream());
}
exports.styles = styles;

//Scripts

function scripts(done) {
    return src('source/js/nav.js')
        .pipe(dest('build/js'))
        .pipe(browserSync.stream());
}

//Html
function minifyHtml() {
    return src(paths.html)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('build'))
}
exports.minifyHtml = minifyHtml;

//Images
function copyImages() {
    return src('source/image/**/*')
        .pipe(dest('./build/image'))
}
exports.copyImages = copyImages;

function minifyImages() {
    return src('source/image/**/*')
        .pipe(imagemin([
            imagemin.mozjpeg({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 3 }),
            imagemin.svgo()
        ]))
        .pipe(dest('build/image'))
}
exports.minifyImages = minifyImages;

function createWebp() {
    return src('build/image/**/*.{jpg,png}')
        .pipe(webp({ quality: 90 }))
        .pipe(dest('build/image'))
}

//Sprite

const sprite = () => {
    return src("source/image/icons/*.svg")
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename("sprite.svg"))
        .pipe(dest("build/image"));
}

exports.sprite = sprite;

//Fonts
function copyFonts() {
    return src('source/fonts/**/*')
        .pipe(dest('./build/fonts'))
}
exports.copyFonts = copyFonts;

//Clean
function clean() {
    return del('build');
}
exports.clean = clean;

function browsersync(done) {
    browserSync.init({
        server: {
            baseDir: 'build'
        },
        cors: true,
        notify: false,
        ui: false,
    });
    done();
}

exports.browsersync = browsersync;

function reload(done) {
    browserSync.reload();
    done();
}

exports.reload = reload;

function watcher(){
    watch('source/sass/**/*.scss', series(styles));
    watch('source/js/nav.js', series(scripts));
    watch(paths.html, series(minifyHtml, reload));
}

exports.watcher = watcher;

exports.default = series(
    clean,
    copyFonts,
    copyImages,
    parallel(
        styles,
        sprite,
        scripts,
        minifyHtml,
        createWebp,
    ),
    series(
        browsersync,
        watcher
    )
);

exports.build = series(
    clean,
    copyFonts,
    minifyImages,
    parallel(
        styles,
        scripts,
        sprite,
        minifyHtml,
        createWebp,
    ),
);
