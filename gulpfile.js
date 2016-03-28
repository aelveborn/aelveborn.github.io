var gulp = require('gulp');
var $    = require('gulp-load-plugins')();
$.cleancss = require('gulp-clean-css');
$.imagemin = require('gulp-imagemin');
$.pngquant = require('imagemin-pngquant');

var sassPaths = [
	'bower_components/foundation-sites/scss',
	'bower_components/motion-ui/src'
];

var jsFiles = [
	'bower_components/jquery/dist/jquery.js',
	'bower_components/what-input/what-input.js',
	'bower_components/foundation-sites/dist/foundation.js',
	'bower_components/motion-ui/dist/motion-ui.js',
	'source/scripts/**/*.js'
];

gulp.task('fonts', function() {
	return gulp.src('source/fonts/*	')
		.pipe(gulp.dest('static/fonts/'));
});

gulp.task('images', function() {
	return gulp.src('source/images/**/*')
		.pipe($.imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [$.pngquant()]
		}))
		.pipe(gulp.dest('static/images'));
});

gulp.task('scripts', function() {
	return gulp.src(jsFiles)
		.pipe($.sourcemaps.init())
		.pipe($.concat('app.min.js'))
		.pipe($.uglify())
		.pipe($.sourcemaps.write('./'))
		.pipe(gulp.dest('static/scripts/'));
});

gulp.task('sass', function() {
	return gulp.src('source/scss/app.scss')
		.pipe($.sass({
			includePaths: sassPaths
		})
		.on('error', $.sass.logError))
		.pipe($.autoprefixer({
			browsers: ['last 2 versions', 'ie >= 9']
		}))
		.pipe($.rename({suffix: '.min'}))
		.pipe($.sourcemaps.init())
        .pipe($.cleancss())
        .pipe($.sourcemaps.write('./'))
		.pipe(gulp.dest('static/styles/'));
});

gulp.task('default', ['sass', 'scripts', 'images', 'fonts'], function() {
	gulp.watch(['source/images/**/*'], ['images']);
	gulp.watch(['source/scss/**/*.scss'], ['sass']);
	gulp.watch(['source/scripts/**/*.js'], ['scripts']);
	gulp.watch(['source/fonts/*'], ['fonts']);
});
