module.exports = {
	app: { baseName: 'jquery' },
	type: 'js',
	compile: {
		src: [
			'./node_modules/jquery/dist/jquery.js',
			'./jquery/jquery-migrate.js',
			'./jquery/jquery-ui.js',
			'./jquery/jquery-ui-i18n.js',
			'./jquery/jquery.umipopups.js',
			'./jquery/jquery.jgrowl_minimized.js',
			'./jquery/jquery.cookie.js',
			'./jquery/jquery.browser.js',
			'./node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
			'./cms/init_fancybox.js',
			'./cms/utils/img_area_select.js'
		]
	},
	buildLocation: {
		name: 'jquery.compiled.js',
		src: './cms/'
	}
};