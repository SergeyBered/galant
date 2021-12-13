module.exports = {
	app: { baseName: 'jquery-migrate' },
	type: 'js',
	compile: {
		src: [
			'./node_modules/jquery-migrate/dist/jquery-migrate.js',
			'./jquery/jquery.browser.js',
		]
	},
	buildLocation: {
		name: 'jquery-migrate.js',
		src: './jquery/'
	}
};