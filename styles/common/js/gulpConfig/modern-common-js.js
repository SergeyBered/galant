module.exports = {
	app: { baseName: 'modern-common-js' },
	type: 'js',
	compile: {
		src: [
			'../../skins/modern/design/js/common/utilities.js',
			'../../skins/modern/design/js/common/symlink.control.js',
			'../../skins/modern/design/js/common/permissions.control.js',
			'../../skins/modern/design/js/common/messages.js',
			'../../skins/modern/design/js/common/color.control.js',
			'../../skins/modern/design/js/common/DefaultModule.js',
			'../../skins/modern/design/js/common/CatalogModule.js',
			'../../skins/modern/design/js/common/SeoModule.js',
			'../../skins/modern/design/js/common/StatModule.js',
			'../../skins/modern/design/js/common/TemplatesModule.js',
			'../../skins/modern/design/js/common/ExchangeModule.js'
		]
	},
	buildLocation: {
		name: 'compressed.js',
		src: '../../skins/modern/design/js/common/'
	}
};