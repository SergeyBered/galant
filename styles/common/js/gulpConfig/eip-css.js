module.exports = {
	app: { baseName: 'eip-css' },
	type: 'css',
	compile: {
		src: [
			'./jquery/ui.all.css',
			'./cms/eip/design.css',
			'./cms/eip/img_editor.css',
			'./cms/utils/img_area_select.css',
			'./cms/panel/design.css',
			'../../skins/modern/design/css/popup.css',
			'../../skins/modern/design/calendar/calendar.css',
			'./node_modules/@fancyapps/fancybox/dist/jquery.fancybox.css',
		]
	},
	buildLocation: {
		name: 'compiled.css',
		src: './cms/'
	}
};