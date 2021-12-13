let gulp = require('gulp');
let jsOptimizer = require('gulp-minify');
let rename = require('gulp-rename');
let webpack = require('gulp-webpack');

let debug = function() {
	return gulp.src('./src/app.js')
		.pipe(webpack({
			debug: true,
			devtool: '#inline-source-map',
			output: {
				filename: 'app.js'
			},
			module: {
				loaders: [
					{
						test: /\.js$/,
						exclude: /(node_modules|bower_components)/,
						loader: 'babel',
						query: {
							presets: ['es2015']
						}
					},
					{test: /\.twig$/, loader: "twig-loader"}
				]
			},
			node: {
				fs: "empty",
				twig: 'empty'
			}
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./../../dataView'));
};

gulp.task('app-debug', debug);

gulp.task('app-production', function() {
	return gulp.src('./src/app.js')
		.pipe(webpack({
			cache: false,
			output: {
				filename: 'app.js'
			},
			module: {
				loaders: [
					{test: /\.twig$/, loader: "twig-loader"}
				]
			},
			exclude: /(twig)/,
			node: {
				fs: "empty"
			}
		}))
		.pipe(jsOptimizer({
			ext:{
				min:'.min.js'
			}
		}))
		.pipe(gulp.dest('./../../dataView'));
});

gulp.task('watch', function() {
	gulp.watch('./src/**/*', debug);
});

gulp.task('default', function() {
	gulp.watch('./src/**/*', debug);
});

