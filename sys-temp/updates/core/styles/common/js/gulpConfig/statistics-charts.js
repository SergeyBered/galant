module.exports = {
	app: { baseName: 'statistics-charts' },
	type: 'js',
	compile: {
		src: [
			'./node_modules/chart.js/dist/Chart.min.js',
			'../../skins/modern/design/js/module-statistics/statistics-charts.js'
		]
	},
	buildLocation: {
		name: 'statistic-charts.js',
		src: '../../skins/modern/design/js/'
	}
};
