module.exports = {
	app: { baseName: 'modern-smc-js' },
	type: 'js',
	compile: {
		src: [
			'../../skins/modern/design/js/smc/NullItem.js',
			'../../skins/modern/design/js/smc/Filter.js',
			'../../skins/modern/design/js/smc/TableItem.js',
			'../../skins/modern/design/js/smc/TreeToolbar.js',
			'../../skins/modern/design/js/smc/TableToolbar.js',
			'../../skins/modern/design/js/smc/Control.js',
			'../../skins/modern/design/js/smc/FilterController.js',
			'../../skins/modern/design/js/smc/TemplatesDataSet.js',
			'../../skins/modern/design/js/smc/DataSet.js',
			'../../skins/modern/design/js/smc/SettingsStore.js',
			'../../skins/modern/design/js/smc/SearchAllTextStorage.js',
			'../../skins/modern/design/js/smc/PageTreeRecursiveOperator.js',
			'../../skins/modern/design/js/smc/editableCell.js',
			'../../skins/modern/design/js/smc/TreeItem.js',
			'../../skins/modern/design/js/smc/context.js',
			'../../skins/modern/design/js/smc/ZeroClipboard.js',
			'../../skins/modern/design/js/smc/TTCustomizer.js'
		]
	},
	buildLocation: {
		name: 'compressed.js',
		src: '../../skins/modern/design/js/smc/'
	}
};