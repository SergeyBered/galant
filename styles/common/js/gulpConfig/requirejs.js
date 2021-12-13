module.exports = {
	app: { baseName: 'requirejs' },
	type: 'js',
	compile: {
		src: [
			'./node_modules/requirejs/require.js'
		]
	},
	buildLocation: {
		name: 'require.js',
		src: './'
	}
};