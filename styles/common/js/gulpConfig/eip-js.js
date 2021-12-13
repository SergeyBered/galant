module.exports = {
	app: { baseName: 'eip-js' },
	type: 'js',
	compile: {
		src: [
			'./moment/moment.js',
			'./moment/ru.js',
			'./cms/admin.js',
			'./cms/panel/panel.js',
			'./cms/panel/tickets.js',
			'./cms/eip/edit_in_place.js',
			'./cms/eip/img_editor.js',
			'./cms/eip/editor.js',
			'./cms/wysiwyg/wysiwyg.js',
			'./cms/session.js',
			'./cms/utils/rgbcolor.js',
			'./relation.control.js',
			'./symlink.control.js',
		]
	},
	buildLocation: {
		name: 'compiled.js',
		src: './cms/'
	}
};