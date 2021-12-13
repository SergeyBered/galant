module.exports = {
	app: { baseName: 'css' },
	type: 'css',
	compile: {
		src: [
			'../css/contentTable.css',
			'../css/contentTree.css',
			'../css/context.css',
			'../css/photoalbum_zip_upload_from.css'
		]
	},
	buildLocation: {
		name: 'compiled.css',
		src: '../css/'
	}
};