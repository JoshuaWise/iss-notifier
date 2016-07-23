'use strict';
const path = require('path');
const gulp = require('gulp');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-minify-css'); // gulp-minify-css uses the cleanCSS module
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserify = require('browserify');
const sourceStream = require('vinyl-source-stream');
const bufferStream = require('vinyl-buffer');

/**
 * This app uses a single main JS file. That JS file can require other
 * files using the same rules as used by Node.js. All of the required files are
 * then bundled together, minified, and exported to a single output JS file,
 * for use by the browser. Sourcemaps are created for debugging.
 */
gulp.task('build-js', function () {
	const sourceFile = './src/master.js';
	const destFile = './build/master.js';
	
	return browserify(sourceFile, {debug: true /* provides sourcemaps */})
		.bundle()
		.pipe(sourceStream(path.basename(sourceFile)))
		.pipe(bufferStream())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(uglify({
			compress: {unsafe: false},
			output: {comments: /@license|@preserve|^!/i}
		}))
		.pipe(rename(path.basename(destFile)))
		.pipe(sourcemaps.write('.')) // relative to path passed to gulp.dest()
		.pipe(gulp.dest(path.dirname(destFile)));
});

/**
 * This app uses a single main SCSS file, which is compiled to CSS,
 * minified, and exported to a single CSS file, for use by the browser.
 * We're using Autoprefixer, which allows us to write prefixless SCSS.
 * Sourcemaps are created for debugging.
 */
gulp.task('build-css', function () {
	const sourceFile = './src/master.scss';
	const destFile = './build/master.css';
	
	return gulp.src(sourceFile)
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: ['./node_modules'],
			outputStyle: 'compact'
		}).on('error', sass.logError))
		.pipe(autoprefixer({browsers: [
			'last 2 versions',
			'> 1%',
			'> 1% in US',
			'ie >= 9',
			'last 8 Chrome versions',
			'last 8 Firefox versions',
			'Firefox ESR'
		]}))
		.pipe(cleanCSS({
			processImport: false,
			rebase: false,
			roundingPrecision: 5,
			advanced: true,
			aggressiveMerging: false,
			restructuring: false,
			shorthandCompacting: false
		}))
		.pipe(rename(path.basename(destFile)))
		.pipe(sourcemaps.write('.')) // relative to path passed to gulp.dest()
		.pipe(gulp.dest(path.dirname(destFile)));
});

gulp.task('default', ['build-css', 'build-js']);

/**
 * The `watch` task is only capable of watching already-existing files. If you
 * add new files to be used, you'll need to re-run the task.
 */
gulp.task('watch', ['default'], function () {
	gulp.watch(['./src/**/*.scss', './src/**/*.css'], ['build-css']);
	gulp.watch(['./src/**/*.js'], ['build-js']);
	gulp.watch(['./node_modules/**/*.*'], ['default']);
});
