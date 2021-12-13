/**
 * Сборщик css и js.
 * 
 * 0) Загрузка компонентов
 * $ npm install
 *
 * 1) Сборка всех ресурсов с минификацией:
 * $ gulp production
 * 
 * 2) Сборка без минификации
 * $ gulp dev
 *
 * 3) Режим разработки, ресурсы автоматически пересобираются при сохранении исходных файлов:
 * $ gulp
 *
 * Требования:
 * node: 8.16.1
 * npm: 6.4.1
 * gulp-cli: 2.2.0
 */
const gulp = require('gulp');
const concat = require('gulp-concat');
const cssOptimizer = require('gulp-cssmin');
const jsOptimizer = require('gulp-minify');
const merge = require('merge-stream');
const fileRename = require('gulp-rename');

const CONFIG_LIST = [
	require('./gulpConfig/css'),
	require('./gulpConfig/eip-css'),
	require('./gulpConfig/eip-js'),
	require('./gulpConfig/jquery-migrate'),
	require('./gulpConfig/jquery-config'),
	require('./gulpConfig/requirejs'),
	require('./gulpConfig/control'),
	require('./gulpConfig/modern-smc-js'),
	require('./gulpConfig/modern-common-js'),
	require('./gulpConfig/backbone'),
	require('./gulpConfig/statistics-charts')
];

gulp.task('dev', () => {
	let tasks = CONFIG_LIST.map(config => {
		return gulp.src(config.compile.src)
			.pipe(concat(config.buildLocation.name))
			.pipe(gulp.dest(config.buildLocation.src))
	});

	return merge(tasks)
});

gulp.task('production', () => {
	let tasks = CONFIG_LIST.map(config => {
		let stream = gulp.src(config.compile.src)
			.pipe(concat(config.buildLocation.name));

		if (config.type === "css") {
			return stream.pipe(gulp.dest(config.buildLocation.src))
				.pipe(fileRename({suffix: '.min'}))
				.pipe(cssOptimizer())
				.pipe(gulp.dest(config.buildLocation.src));
		}

		return stream.pipe(jsOptimizer({
			ext:{
				min:'.min.js'
			}
		})).pipe(gulp.dest(config.buildLocation.src));
	});

	return merge(tasks)
});

gulp.task('watch', () => {
	let src = [];

	CONFIG_LIST.forEach(config => {
		config.compile.src.forEach(file => {
			src.push(file);
		})
	});

	gulp.watch(src, gulp.series('dev'));
});

gulp.task('default', gulp.series('watch'));