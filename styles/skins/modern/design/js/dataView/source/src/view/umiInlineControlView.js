/** Контрол илайн редактора */
let umiInLineControlView = Backbone.Marionette.ItemView.extend({
	container: null,
	_target: null,
	tagName: 'span',
	template: 'umiInLineControl.twig',
	oldValue: null,
	field: null,
	conf: {},
	events: {
		'keyup input': 'keyUpHandler'
	},
	row: null,

	initialize: function () {
		let that = this,
			$target = $(this.options._target);
		this.row = this.options.row;
		this.container = $target.closest('td');
		this.field = $target.attr('umi-field');
		this.oldValue = this.container.html();
		this.container.html('');
		this.$el = $('<span></span>');
		this.el = this.$el[0];
		this.container.append(this.$el);
		this.conf = dc_application.config.get('fields')[this.field];
		this.render();

		$('input', this.$el).on('keyup', function (e) {
			that.keyUpHandler.call(that, e);
		});

		if (!this.isDialogEditField()) {
			that.registerOutsideClick();
		}
	},

	/** Включает обработчик нажатия мыши в окне браузера */
	registerOutsideClick: function() {
		let that = this;
		$(window).on('click', function(event) {
			that.outSideClick(event, that);
		});
	},

	/** Выключает обработчик нажатия мыши в окне браузера */
	unregisterOutsideClick: function() {
		let that = this;
		$(window).off('click', function(event) {
			that.outSideClick(event, that);
		});
	},

	/**
	 * Обрабатывает клик вне редактируемого поля
	 * @param {Object} clickEvent событие клика
	 * @param {umiInLineControlView} context объект, в контексте которого выполняется метод
	 */
	outSideClick: function(clickEvent, context) {
		let $clickTarget = $(clickEvent.target);
		let $input = $('input', this.$el);

		if ($input.attr('id') === $clickTarget.attr('id')) {
			return;
		}

		if ($clickTarget.hasClass('small-ico')) {
			return;
		}

		context.keyUpHandler({
			target: $('input', this.$el)[0],
			keyCode: 13
		});
	},

	onBeforeRender: function () {
		this.templateHelpers = {
			type: '',
			field: this.field,
			conf: this.conf,
			id: this.model.get('id'),
			val: this.model.get(this.field)
		};
	},

	onRender: function () {
		let that = this;
		let fieldType = this.conf.type;
		if (fieldType == 'relation') {
			that.makeEditableRelationField();
		} else if (fieldType == 'bool') {
			$('input',this.$el).on('change',function (e) {
				let val = $(e.target).is(':checked');
				that.beforeRemove(val ? 1 : 0);
			})
		} else if (fieldType == 'image' || fieldType == 'file') {
			$('a.icon-action', this.$el).on('click', function(e) {
				let el = $('input', that.$el);
				that.showelfinderFileBrowser(el, el.val());
			});
			$('input', this.$el).on('change', function(e) {
				let $el = $(e.target);
				that.beforeRemove($el.val());
			})
		} else if (fieldType == 'date') {
			$('input[umi-type="date"]', this.$el).datepicker({
				dateFormat: "dd.mm.yy",
			});
		} else if (fieldType == 'datetime') {
			$('input[umi-type="datetime"]', this.$el).datepicker({
				dateFormat: "dd.mm.yy 00:00",
			});
		} else if (that.isDialogEditField()) {
			that.makeDialogEditableField(this.templateHelpers);
		}
	},

	beforeRemove: function (val) {
		this.trigger('il:editcomplite', val);
		this.remove();
		this.$el.closest('div.overflow').css('overflow', 'auto');
	},

	removeSilent: function () {
		this.model = null;
		this.container.html('');
		this.container.append(this.oldValue);
		Backbone.Marionette.ItemView.prototype.remove.call(this);
	},

	keyUpHandler: function (e) {
		let $input = $(e.target);
		let value = $input.val(),
			type = $input.attr('umi-type'),
			valid = require('./../utils/umiDataValidate');

			$(e.target).removeClass('_error');
		if (e.keyCode == 13){
			if (valid.test(type,value) || value == '') {
				this.beforeRemove.call(this, value);
			} else {
				$input.addClass('_error');
			}
		} else if (e.keyCode == 27){
			this.beforeRemove.call(this, '');
		}
	},

	showelfinderFileBrowser: function (select, folder, lang) {
		let qs = 'id=' + select.attr('id');
		let index = select.val().lastIndexOf('/');
		let file = '.'.replace(/^\.\//, "/") + (index != -1 ? select.val().substr(index) : select.val());

		qs = qs + '&file=' + file;
		if (folder) {
			qs = qs + '&folder=' + folder;
		}

		qs = qs + '&image=1';
		if (lang) {
			qs = qs + '&lang=' + lang;
		}

		$.openPopupLayer({
			name: "Filemanager",
			title: getLabel('js-file-manager'),
			width: 1200,
			height: 600,
			url: "/styles/common/other/elfinder/umifilebrowser.html?" + qs
		});

		let $filemanager = $('div#popupLayer_Filemanager div.popupBody');
		if (!$filemanager.length) {
			$filemanager = $(window.parent.document.getElementById('popupLayer_Filemanager')).find('div.popupBody');
		}

		let options = '<div id="watermark_wrapper"><label for="add_watermark">';
		options += getLabel('js-water-mark');
		options += '</label><input type="checkbox" name="add_watermark" id="add_watermark"/>';
		options += '<label for="remember_last_folder">';
		options += getLabel('js-remember-last-dir');
		options += '</label><input type="checkbox" name="remember_last_folder" id="remember_last_folder"';
		if (getCookie('remember_last_folder', true)) {
			options += 'checked="checked"';
		}
		options +='/></div>';

		$filemanager.append(options);
	},

	/** Использует ли данный тип поля диалоговое окно для редактирования */
	isDialogEditField: function() {
		let fieldType = this.conf.type;
		if (~fieldType.indexOf('multiple') || 
			fieldType == 'wysiwyg' || 
			fieldType == 'text' || 
			fieldType == 'symlink' || 
			fieldType == 'relation') {
			return true;
		}

		return false;
	},

	/**
	 * Создает табличный контрол для полей "Выпадающий список" и
	 * "Выпадающий список со множественным выбором"
	 */
	makeEditableRelationField: function() {
		let that = this;
		let $select = $('select', this.$el);

		if (this.conf.guide_id && !this.conf.options) {
			$select.attr('umi-field', that.conf.name);

			let valueList = this.templateHelpers.val;
			if (valueList) {
				if (!Array.isArray(valueList)) {
					valueList = valueList.split(', ');
				}

				$.each(valueList, function (i, val) {
					$select.append($('<option>', {
						'text': val,
						'selected': true,
						'umi-field': that.conf.name
					}));
				});
			}

			let control = new ControlRelation({
				container: this.$el,
				type: this.conf.guide_id,
				preload: false,
				sourceUri: '/admin/data/guide_items_all/' + this.conf.guide_id + '/1000/'
			});

			control.loadItemsAll(function() {
				$select.on('change', function () {
					let val = $select.val();
					if (Array.isArray(val)) {
						let valList = [];
						for (let n in val) {
							valList.push($('option[value="' + val[n] + '"]', $select).text());
						}
						val = valList;
					} else {
						val = $('option[value="' + val + '"]', $select).text();
					}
					that.beforeRemove(val);
				});
			});
			return;
		} else {
			new ControlComboBox({el: $select});
		}

		$select.on('change', function () {
			let val = $('option[value="' + $select.val() + '"]', $select).text();
			that.beforeRemove(val);
		});
	},

	/**
	 * Создает диалог для редактирования поля
	 * @param {Object} fieldInfo информация о редактируемом поле
	 */
	makeDialogEditableField: function(fieldInfo) {
		let that = this;
		$.ajax({
			url: '/styles/skins/modern/design/js/common/dialog_edit_field_template.html',
			dataType: 'html',
			success: function(html) {
				let fieldHtml, dialogLabel;
				let fieldName = fieldInfo.conf.name;
				let fieldType = fieldInfo.conf.type;
				let elemId = 'idm' + fieldInfo.conf.name;
				let objectId = fieldInfo.id.split('_')[1];

				if (fieldType == "multiple_file" || fieldType == "multiple_image") {
					fieldHtml = that.templateDialogFileField(html, fieldInfo);
				} else if (fieldType == 'text' || fieldType == 'wysiwyg') {
					fieldHtml = that.templateDialogTextField(html, fieldInfo);
				} else if (fieldType == 'symlink') {
					fieldHtml = that.templateDialogSymlinkField(html, fieldInfo);
				}
				dialogLabel = getLabel('js-editable-' + fieldType + '-field');

				openDialog('', dialogLabel, {
					width: 800,
					html: fieldHtml,
					cancelButton: true,
					confirmText: getLabel('js-save'),
					cancelText: getLabel('js-new_guide_item_cancel'),

					openCallback: function() {
						that.initDialogFields(fieldType, elemId);
					},

					confirmCallback: function(popupName) {
						let $fieldForm = $('#optionedFieldForm');
						let paramObj = {};
						paramObj[fieldName] = that.getValueFormField(fieldType, $fieldForm);

						let url = '/admin/' + dc_application.config.get('module') + '/' + dc_application.config.get('saveField_method') + '/' + objectId + '/.' + dc_application.options.dataProtocol;
						let data = $fieldForm.serialize();
						data += '&field=' + fieldName;
						data += '&csrf=' + csrfProtection.getToken();

						$.ajax({
							type: 'POST',
							url: url,
							dataType: 'json',
							data: data,

							success: function() {
								that.row.model.set(paramObj);
								that.row.render();
								$.jGrowl(getLabel('js-property-saved-success'));
							},

							error: function(rq, status, error) {
								onError(error, 'save');
							},

							complete: function() {
								closeDialog(popupName);
							}
						});
					},

					cancelCallback: function(popupName) {
						that.row.render();
						closeDialog(popupName);
					},

					closeCallback: function() {
						that.row.render();
					},
				});
			}
		});
	},

	/**
	 * Инициализирует поле в диалоговом окне
	 * @param {String} fieldType тип данных поля
	 * @param {String} elemId идетификатор контейнера поля
	 */
	initDialogFields: function(fieldType, elemId) {
		if (fieldType == "multiple_file") {
			$('div.multifile').each(function() {
				new ControlMultiFile({container: $(this)});
			});
		} else if (fieldType == "multiple_image") {
			$('div.multiimage').each(function() {
				new ControlMultiImage({container: $(this)});
			});
		} else if (fieldType == "wysiwyg") {
			if (typeof uAdmin.wysiwyg != 'undefined') {
				let wysiwyg = tinyMCE.get(elemId);
				if (wysiwyg) {
					wysiwyg.remove();
				}
				uAdmin.wysiwyg.init({
					selector: 'textarea#' + elemId
				});
			}
		} else if (fieldType == "symlink") {
			jQuery("div.symlink#" + elemId).each(function() {
				let $e = $(this);
				let $l = $("ul", $e);
				let $label = $($e).find('div.title-edit');
				let shTypes = $label.prop('className').split(' ');
				let hTypes = [];

				for (let o = 0; o < shTypes.length; o++) {
					if (shTypes[o] != 'title-edit') {
						hTypes.push(shTypes[o]);
					}
				}

				let mode = $e.hasClass('onlyOne');
				let s = new symlinkControl($e.attr("id"), "content", [],
					{
						inputName: $e.attr("name"),
						fadeColorStart: [255, 255, 225],
						fadeColorEnd: [255, 255, 255]
					},
					hTypes, mode);

				let $items = $("li", $e);
				if ($items.length === 0) {
					s.appendStub();
				}

				$items.each(function() {
					let $li = $(this);
					s.addItem($li.attr("umi:id"), $li.text(), [$li.attr("umi:module"), $li.attr("umi:method")], $li.attr("umi:href"));
				});

				$l.remove();
			});
		}
	},

	/**
	 * Возвращает значение поля из формы
	 * @param {String} fieldType тип данных поля
	 * @param {Object} $fieldForm форма поля
	 * @returns {Array}
	 */
	getValueFormField: function(fieldType, $fieldForm) {
		let paramObj;

		if (fieldType == "multiple_file" || fieldType == "multiple_image") {
			paramObj = [];
			$fieldForm.find('.multi_image, .multi_file').each(function(i, val) {
				let $elem = $(val);
				let alt = $elem.find('input[name$="alt]"]').val();
				let param = {
					id: $elem.attr('id').split('_')[1],
					src: $elem.find('input[name$="src]"]').val(),
					alt: alt ? alt : '',
					title: $elem.find('input[name$="title]"]').val(),
					ord: $elem.find('input[name$="order]"]').val(),
					folder_hash: $elem.attr('umi:folder-hash'),
					file_hash: $elem.attr('umi:file-hash')
				}
				paramObj.push(param);
			});

			return paramObj;
		} else if (fieldType == 'text' || fieldType == 'wysiwyg') {
			let value = '';
			let iframe = $fieldForm.find('iframe');
			if (iframe.length) {
				value = $(iframe.get(0).contentDocument).find('body').html()
			} else {
				value = $fieldForm.find('textarea').val();
			}
			$fieldForm.find('textarea').val(value);

			return [value];
		} else if (fieldType == "symlink") {
			paramObj = [];
			$fieldForm.find('input[name]').each(function(i,e) {
				let $input = $(e);
				let $li = $($input.parent().find('li')[i]);
				let span = $li.find('span')

				if (!span.length) return;

				let basetype = span.data('basetype').split(' ');
				let module = basetype[0];
				let method = basetype.length > 1 ? basetype[1] : '';
				let param = {
					'id': $input.val(),
					'name': span.html(),
					'link': $li.find('a:not(.button)').attr('href'),
					'basetype': {'module': module, 'method': method}
				}
				paramObj.push(param);
			});

			return paramObj;
		}
	},

	/**
	 * Шаблонизирует форму редактирования поля "Ссылка на дерево"
	 * @param {String} htmlTemplate HTML шаблон
	 * @param {Object} fieldInfo информация о редактируемом поле
	 * @returns {String}
	 */
	templateDialogSymlinkField: function(htmlTemplate, fieldInfo) {
		let $templates = $($.parseHTML(htmlTemplate));
		let fieldTemplate = $templates.find('#field_template_symlink').html();
		let valueTemplate = $templates.find('#value_template_symlink').html();

		let valueVariableList = [];
		$.each(fieldInfo.val, function(i, val) {
			valueVariableList.push({
				'id': val.id,
				'link': val.link,
				'title': val.name,
				'basetype': val.basetype,
			});
		});

		let valuesHtml = '';
		$.each(valueVariableList, function(i, valueVariables) {
			valuesHtml += $.tmpl(valueTemplate, valueVariables)[0].outerHTML;
		});

		let fieldVariables = {
			'title': fieldInfo.conf.title,
			'elemId': 'idm' + fieldInfo.conf.name,
			'valuesHtml': valuesHtml,
			'inputName': 'value[]',
		};

		return $.tmpl(fieldTemplate, fieldVariables);
	},

	/**
	 * Шаблонизирует форму редактирования полей "Простой текст" и "HTML-текст"
	 * @param {String} htmlTemplate HTML шаблон
	 * @param {Object} fieldInfo информация о редактируемом поле
	 * @returns {String}
	 */
	templateDialogTextField: function(htmlTemplate, fieldInfo) {
		let $templates = $($.parseHTML(htmlTemplate));
		let fieldTemplate = $templates.find('#field_template_wysiwyg_text').html();

		let fieldVariables = {
			'title': fieldInfo.conf.title,
			'elemId': 'idm' + fieldInfo.conf.name,
			'inputName': 'value',
			'value': fieldInfo.val,
			'type': fieldInfo.conf.type
		};

		return $.tmpl(fieldTemplate, fieldVariables);
	},
	/**
	 * Шаблонизирует форму редактирования полей "Набор файлов" и "Набор изображений"
	 * @param {String} htmlTemplate HTML шаблон
	 * @param {Object} fieldInfo информация о редактируемом поле
	 * @returns {String}
	 */
	templateDialogFileField: function(htmlTemplate, fieldInfo) {
		let fieldTemplate,
			valueTemplate,
			$templates = $($.parseHTML(htmlTemplate));

		let fieldType = fieldInfo.conf.type;
		if (fieldType == "multiple_file") {
			fieldTemplate = $templates.find('#field_template_files').html();
			valueTemplate = $templates.find('#value_template_file').html();
		} else if (fieldType == "multiple_image") {
			fieldTemplate = $templates.find('#field_template_images').html();
			valueTemplate = $templates.find('#value_template_image').html();
		}

		let valueVariableList = [];
		$.each(fieldInfo.val, function(i, val) {
			valueVariableList.push({
				'id': val.id,
				'path': val.src,
				'alt': val.alt,
				'title': val.title,
				'order': val.ord,
				'name': val.name,
				'folderHash': val.folder_hash,
				'fileHash': val.file_hash,
				'inputName': 'value',
			});
		});

		let valuesHtml = '';
		$.each(valueVariableList, function(i, valueVariables) {
			valuesHtml += $.tmpl(valueTemplate, valueVariables)[0].outerHTML;
		});

		let fieldVariables = {
			'title': fieldInfo.conf.title,
			'elemId': 'idm' + fieldInfo.conf.name,
			'inputName': 'value',
			'valuesHtml': valuesHtml
		};

		return $.tmpl(fieldTemplate, fieldVariables);
	},

});

module.exports = umiInLineControlView;
