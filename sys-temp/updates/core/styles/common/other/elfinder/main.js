/**
 * elFinder client options and main script for RequireJS
 *
 * Rename "main.default.js" to "main.js" and edit it if you need configure elFInder options or any things. And use that in elfinder.html.
 * e.g. `<script data-main="./main.js" src="./require.js"></script>`
 **/
(function(){
	"use strict";
	var // jQuery and jQueryUI version
		jqver = '3.3.1',
		uiver = '1.12.1',

		start = function(elFinder, editors, config) {

			elFinder.prototype.loadCss('/styles/common/other/elfinder/css/jquery-ui.css');
			
			$(function() {
				var optEditors = {
						commandsOptions: {
							edit: {
								editors : [
									{
										// From https://github.com/Studio-42/elFinder/wiki/Using-custom-editor-to-edit-files-within-elfinder
										// ACE Editor
										// `mimes` is not set for support everything kind of text file
										load : function(textarea) {
											var self = this,
												dfrd = $.Deferred(),
												acePath  = '/styles/common/other/ace',
												init = function() {
													if (typeof ace === 'undefined') {
														self.fm.loadScript([
															acePath+'/ace.js',
															acePath+'/ext-modelist.js',
															acePath+'/ext-language_tools.js'
														], start);
													} else {
														start();
													}
												},
												start = function() {
													var editor, mode,
														ta = $(textarea),
														taBase = ta.parent(),
														id = textarea.id + '_ace',
														// MIME/mode map
														mimeMode = {
															'text/x-php'              : 'php',
															'application/x-php'       : 'php',
															'text/html'               : 'html',
															'application/xhtml+xml'   : 'html',
															'text/javascript'         : 'javascript',
															'application/javascript'  : 'javascript',
															'text/css'                : 'css',
															'text/x-c'                : 'c_cpp',
															'text/x-csrc'             : 'c_cpp',
															'text/x-chdr'             : 'c_cpp',
															'text/x-c++'              : 'c_cpp',
															'text/x-c++src'           : 'c_cpp',
															'text/x-c++hdr'           : 'c_cpp',
															'text/x-shellscript'      : 'sh',
															'application/x-csh'       : 'sh',
															'text/x-python'           : 'python',
															'text/x-java'             : 'java',
															'text/x-java-source'      : 'java',
															'text/x-ruby'             : 'ruby',
															'text/x-perl'             : 'perl',
															'application/x-perl'      : 'perl',
															'text/x-sql'              : 'sql',
															'text/xml'                : 'xml',
															'application/docbook+xml' : 'xml',
															'application/xml'         : 'xml'
														};

													// set basePath of ace
													ace.config.set('basePath', acePath);

													// set base height
													taBase.height(taBase.height());

													// detect mode
													mode = ace.require('ace/ext/modelist').getModeForPath('/' + self.file.name).name;
													if (mode === 'text') {
														if (mimeMode[self.file.mime]) {
															mode = mimeMode[self.file.mime];
														}
													}

													// Base node of Ace editor
													$('<div id="'+id+'" style="width:100%; height:100%;"/>').text(ta.val()).insertBefore(ta.hide());

													// Ace editor configure
													ta.data('ace', true);
													editor = ace.edit(id);
													ace.require('ace/ext/language_tools');
													editor.$blockScrolling = Infinity;
													editor.setOptions({//1000
														theme: 'ace/theme/monokai',
														mode: 'ace/mode/' + mode,
														fontSize: '14px',
														wrap: true,
														enableBasicAutocompletion: true,
														enableSnippets: true,
														enableLiveAutocompletion: false,
														printMarginColumn: 120
													});
													editor.commands.addCommand({
														name : "saveFile",
														bindKey: {
															win : 'Ctrl-s',
															mac : 'Command-s'
														},
														exec: function(editor) {
															self.doSave();
														}
													});
													editor.commands.addCommand({
														name : "closeEditor",
														bindKey: {
															win : 'Ctrl-w|Ctrl-q',
															mac : 'Command-w|Command-q'
														},
														exec: function(editor) {
															self.doCancel();
														}
													});

													editor.resize();

													dfrd.resolve(editor);
												};

											// init & start
											init();
											$(textarea).parent().prev().children('.elfinder-titlebar-full').children('.ui-icon').trigger('click');
											return dfrd;
										},
										close : function(textarea, instance) {
											if (instance) {
												instance.destroy();
												$(textarea).show();
											}
										},
										save : function(textarea, instance) {
											instance && $(textarea).data('ace') && (textarea.value = instance.session.getValue());
										},
										focus : function(textarea, instance) {
											instance && $(textarea).data('ace') && instance.focus();
										},
										resize : function(textarea, instance, e, data) {
											instance && instance.resize();
										},
										info: {
											converter: false,
											name: 'cmdedit'
										}
									}
								],
								dialogWidth: 900,
								editorMaximized: true
							}
						}
					},
					opts = {};
				
				if (config && config.managers) {
					$.each(config.managers, function(id, mOpts) {
						opts = Object.assign(opts, config.defaultOpts || {});

						try {
							mOpts.commandsOptions.edit.editors = mOpts.commandsOptions.edit.editors.concat(editors || []);
						} catch(e) {
							Object.assign(mOpts, optEditors);
						}

						var watermark = window.parent.jQuery('#add_watermark').is(':checked') ? 1 : 0;
						var elf = $('#' + id).elfinder(
							$.extend(true, { customData: {water_mark: watermark} }, opts, mOpts || {})
						).elfinder('instance');

						if (window.parent) {
							if (window.parent.edition == 'demo') {
								window.parent.jQuery.jGrowl(window.parent.getLabel('js-filemanager-demo-notice'));
							}

							window.parent.jQuery('#add_watermark').on('change', function() {
								var watermark = jQuery(this).is(':checked') ? 1 : 0;
								Object.assign(elf.options.customData, {water_mark : watermark});
							});

							window.parent.jQuery('#remember_last_folder').on('change', function() {
								let check = jQuery(this).is(':checked');
								if (check) {
									elf.options.rememberLastDir = true;
									elf.lastDir(elf.cwd().hash);
								} else {
									elf.options.rememberLastDir = false;
									elf.lastDir('');
								}
								var remember_last_folder = jQuery(this).is(':checked') ? 1 : null;
								var oneDay = '1';
								setCookie('remember_last_folder', remember_last_folder, oneDay);
							});
						}
					});
				} else {
					alert('"elFinderConfig" object is wrong.');
				}
			});
		},
		
		load = function() {
			require(
				[
					'elfinder',
					'extras/editors.default.min',
					'elFinderConfig'
				],
				start,
				function(error) {
					alert(error.message);
				}
			);
		};

	require.config({
		baseUrl : '/styles/common/other/elfinder/js',
		paths : {
			'jquery'   : 'jquery.min',
			'jquery-ui': 'jquery-ui.min',
			'elfinder' : 'elfinder.min'
		},
		waitSeconds : 10
	});

	load();
})();
