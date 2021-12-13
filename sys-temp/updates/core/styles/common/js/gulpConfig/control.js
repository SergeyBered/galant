module.exports = {
	app: { baseName: 'control' },
	type: 'js',
	compile: {
		src: [
			'./utilities.js',
			'./relation.control.js',
			'./symlink.control.js',
			'./file.control.js',
			'./messages.js',
			'./color.control.js'
		]
	},
	buildLocation: {
		name: 'compressed.js',
		src: './'
	}
};