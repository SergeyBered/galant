module.exports = {
	app: { baseName: 'backbonemarionette' },
	type: 'js',
	compile: {
		src: [
			'./node_modules/backbone/backbone.js',
			'./node_modules/twig/twig.js',
			'./node_modules/backbone-relational/backbone-relational.js',
			'./backbone.marionette/backbone.marionette.js',
		]
	},
	buildLocation: {
		name: '/backbone.compiled.js',
		src: './'
	}
};