/**
 * Модуль, содержащий функционал тулбара табличного контрола шаблонов сайта
 * @type {{getTemplatesListToolBarMenu, getTemplatesListToolBarFunctions}}
 */
let TemplatesModule;
TemplatesModule = (function($, _) {
	"use strict";

	/** @type {String} MODULE_NAME системное имя модуля */
	const MODULE_NAME = 'umiTemplates';
	/** @type {String} REQUEST_ADD_TEMPLATE_METHOD метод, который создает шаблон */
	const REQUEST_ADD_TEMPLATE_METHOD = 'createTemplate';
	/** @type {String} REQUEST_DELETE_TEMPLATE_LIST_METHOD метод, который удаляет шаблоны */
	const REQUEST_DELETE_TEMPLATE_LIST_METHOD = 'deleteTemplateList';
	/** @type {String} REQUEST_GET_TEMPLATE_TREE_METHOD метод, который возвращает дерево шаблонов */
	const REQUEST_GET_TEMPLATE_TREE_METHOD = 'getRelatedPageTree';
	/** @type {String} REQUEST_CHANGE_TEMPLATE_FOR_PAGE_LIST метод, который изменяет шаблон для списка страниц */
	const REQUEST_CHANGE_TEMPLATE_FOR_PAGE_LIST = 'changeTemplateForPageList';
	/** @type {String} REQUEST_CREATE_BACKUP метод, который создает бэкап шаблонов */
	const REQUEST_CREATE_BACKUP = 'createBackup';
	/** @type {String} REQUEST_DOWNLOAD_BACKUP метод, который скачивает бэкап шаблонов */
	const REQUEST_DOWNLOAD_BACKUP = 'downloadBackup';
	/** @type {String} REQUEST_RESTORE_FROM_BACKUP метод, который восстаналивает шаблоны из бэкапа */
	const REQUEST_RESTORE_FROM_BACKUP = 'restoreFromBackup';
	/** @type {String} REQUEST_DELETE_BACKUP_LIST метод, который удаляет список бэкапов */
	const REQUEST_DELETE_BACKUP_LIST = 'deleteBackupList';

	/**
	 * Возвращает реализацию функций тулбара табличного контрола списка шаблонов
	 * @return {Object}
	 */
	let getTemplatesListToolBarFunctions = function() {
		return {
			add: {
				name: 'add',
				className: 'i-add',
				hint: getLabel('js-add'),
				init: function(button) {
					return dc_application.toggleToolBarButton(button, function(TableControl) {
						return !TableControl.hasSelectedRows();
					});
				},
				release: function() {
					showTemplateCreateForm();
					return false;
				}
			},
			remove: {
				name: 'delete',
				className: 'i-remove',
				hint: getLabel('js-remove'),
				init: function(button) {
					return dc_application.toggleToolBarButton(button, function(TableControl) {
						return TableControl.hasSelectedRows();
					});
				},
				release: function() {
					showDeleteTemplatesConfirmationForm();
					return false;
				}
			}
		};
	};

	/** Показывает форму создания шаблона сайта */
	let showTemplateCreateForm = function() {
		$.get('/styles/skins/modern/design/js/common/html/TemplateCreateForm.html', function(html) {
			openDialog('', getLabel('js-label-template-creating'), {
				html: html,
				width: 360,
				cancelButton: true,
				confirmText: getLabel('js-add'),
				cancelText: getLabel('js-cancel'),
				customClass: 'modalUp',
				confirmCallback: function(popupName, popupSelector) {
					let data = parseTemplateCreateFormData(popupSelector);

					if (validateTemplateCreateFormData(data)) {
						requestCreateTemplate(data);
						closeDialog(popupName);
					}
				},
				openCallback: function(popupSelector) {
					initTemplateCreateForm(popupSelector);
				}
			});
		});
	};

	/**
	 * Извлекает данные формы создания шаблона сайта
	 * @param {String} popupSelector селектор окна с формой
	 * @returns {{
	 *      'data[isDefault]': Number,
	 *      'data[type]': String,
	 *      'data[name]': String,
	 *      'data[fileName]': String,
	 *      'data[directory]': String
	 * }}
	 */
	let parseTemplateCreateFormData = function(popupSelector) {
		return {
			'data[name]': $('#new-template-name', popupSelector).val(),
			'data[fileName]': $('#new-template-file-name', popupSelector).val(),
			'data[directory]': $('#new-template-directory', popupSelector).val(),
			'data[type]': $('select[name = "type"] option[selected]', popupSelector).val(),
			'data[isDefault]': $('div.checkbox input', popupSelector).is(':checked') ? 1 : 0
		};
	};

	/**
	 * Валидирует заполнение формы создания шаблона сайта
	 * @param {Object} data данные формы создания шаблона сайта
	 * @returns {boolean}
	 */
	let validateTemplateCreateFormData = function(data) {
		let messageList = [];
		let name = data['data[name]'].toString();

		if (name === '') {
			messageList.push(getLabel('js-error-label-empty-template-name'));
		}

		let fileName = data['data[fileName]'].toString();

		if (!fileName.match(/([a-zA-Z0-9-_]+\.(phtml|xsl|tpl)$)/)) {
			messageList.push(getLabel('js-error-label-invalid-template-file-name'));
		}

		let directory = data['data[directory]'].toString();

		if (!directory.match(/^([a-zA-Z0-9-_\/]+)/)) {
			messageList.push(getLabel('js-error-label-invalid-template-directory'));
		}

		if (messageList.length === 0) {
			return true;
		}

		let message = messageList.join('<br>');
		DefaultModule.showMessage(message);
		return false;
	};

	/**
	 * Инициализирует форму создания шаблона сайта
	 * @param {String} popupSelector селектор окна с формой
	 */
	let initTemplateCreateForm = function(popupSelector) {
		$('div[data-i18n-value]', popupSelector).each(function() {
			let $div = $(this);
			let key = $div.data('i18n-value');
			$div.text(getLabel(key));
		});
		$('label.checkbox-wrapper span[data-i18n-value]', popupSelector).each(function() {
			let $span = $(this);
			let key = $span.data('i18n-value');
			$span.text(getLabel(key));
		});
		$('input[data-i18n-placeholder]', popupSelector).each(function() {
			let $input = $(this);
			let key = $input.data('i18n-placeholder');
			$input.attr('placeholder', getLabel(key));
		});

		$('select[name = "type"]', popupSelector).selectize();
		$('input[name = "isDefault"]', popupSelector).on('click', function(event) {
			let $input = $(event.target);
			$input.toggleClass('checked');
			$input.parent().toggleClass('checked');
		});
	};

	/**
	 * Запрашивает создание нового шаблона
	 * @param {Object} data данные нового шаблона
	 */
	let requestCreateTemplate = function(data) {
		data['data[domain_id]'] = DefaultModule.getDomainId();
		data['data[language_id]'] = DefaultModule.getLanguageId();

		let TableControl = dc_application;
		let requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_ADD_TEMPLATE_METHOD),
			dataType: 'json',
			data: data
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			TableControl.refresh();
		}, false);
	};

	/** Показывает форму подтверждения удаления шаблона сайта */
	let showDeleteTemplatesConfirmationForm = function() {
		openDialog('', getLabel('js-label-template-confirm-delete'), {
			html: getLabel('js-label-template-confirmation-delete'),
			confirmText: getLabel('js-del-do'),
			cancelButton: true,
			cancelText: getLabel('js-cancel'),
			confirmCallback: function (dialogName) {
				requestDeleteTemplateList();
				closeDialog(dialogName);
			}
		});
	};

	/** Запрашивает удаление списка шаблонов, выбранных в табличном контроле */
	let requestDeleteTemplateList = function() {
		let TableControl = dc_application;
		let requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_DELETE_TEMPLATE_LIST_METHOD),
			dataType: 'json',
			data: {
				id_list: TableControl.getSelectedIdList()
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			TableControl.refresh();
		}, false);
	};

	/**
	 * Возвращает список названий кнопок для формирования меню тулбара табличного контрола списка шаблонов
	 * @returns {String[]}
	 */
	let getTemplatesListToolBarMenu = function() {
		return ['add', 'remove'];
	};

	/**
	 * Возвращает реализацию функций тулбара табличного контрола дерева шаблонов
	 * @return {Object}
	 */
	let getRelatedPageTreeToolBarFunctions = function() {
		return {
			bindTemplate: {
				name: 'bindTemplate',
				className: 'i-bind',
				hint: getLabel('js-label-bind-template'),
				init: toggleToolBarButtonForPageAction,
				release: function() {
					triggerShowTemplateSelectForm(function(popupName, popupSelector) {
						let templateId = parseSelectedTemplateId(popupSelector);
						let TableControl = dc_application;
						let selectedIdList = TableControl.getSelectedIdList();
						requestChangeTemplateForSelectedPageList(templateId, selectedIdList, function() {
							TableControl.refresh();
						});
						closeDialog(popupName);
					});
					return false;
				}
			},
			bindTemplateForAll: {
				name: 'bindTemplateForAll',
				className: 'i-mass-bind',
				hint: getLabel('js-label-mass-bind-template'),
				init: toggleToolBarButtonForTemplateAction,
				release: function() {
					triggerShowTemplateSelectForm(function(popupName, popupSelector) {
						let oldTemplateId = dc_application.getFirstSelectedId();
						let newTemplateId = parseSelectedTemplateId(popupSelector);
						closeDialog(popupName);

						if (oldTemplateId === newTemplateId) {
							return DefaultModule.showMessage(getLabel('js-label-error-old-and-new-templates-equal'));
						}

						showProgressWindow(getLabel('js-label-template-change-for-all-pages'));
						requestChangeTemplateForAllPages(oldTemplateId, newTemplateId, '');
					});
					return false;
				}
			}
		};
	};

	/**
	 * Запрашивает смену шаблона для всех страниц заданного шаблона.
	 * @param {Integer|String} oldTemplateId шаблон, которому принадлежат изменяемые страницы
	 * @param {Integer|String} newTemplateId новый шаблон
	 * @param {String} popupName имя окна, которое требуется закрыть по завершению процесса
	 */
	let requestChangeTemplateForAllPages = function(oldTemplateId, newTemplateId, popupName) {
		requestPageList(oldTemplateId, function(response) {
			let idList = DefaultModule.extractIdList(response);

			if (idList.length === 0) {
				dc_application.refresh();
				return closeDialog(popupName);
			}

			requestChangeTemplateForSelectedPageList(newTemplateId, idList, function() {
				requestChangeTemplateForAllPages(oldTemplateId, newTemplateId, popupName);
			});
		});
	};

	/**
	 * Показывает окно с индикатором итерационной операции
	 * @param {String} header заголовок окна
	 */
	let showProgressWindow = function(header) {
		$.get('/styles/skins/modern/design/js/common/html/ProgressBar.html', function(html) {
			openDialog('', header, {
				html: html,
				width: 400,
				cancelButton: false,
				stdButtons: false,
				closeButton: false,
				customClass: 'modalUp'
			});
		});
	};

	/**
	 * Переключает активность кнопки тулбара, работающей только для страниц
	 * @param {Object} button кнопка тулбара
	 * @returns {*|void}
	 */
	let toggleToolBarButtonForPageAction = function(button) {
		dc_application.toggleToolBarButton(button, function(TableControl) {
			return TableControl.hasSelectedRows() && !isTemplateInList(TableControl.getSelectedRowList());
		});
	};

	/**
	 * Запускает показ формы выбора шаблона сайта
	 * @param {Function} selectTemplateCallback обработчик выбора шаблона
	 */
	let triggerShowTemplateSelectForm = function(selectTemplateCallback) {
		requestTemplateList(function(response) {
			let templateList = DefaultModule.extractRowList(response);
			showTemplateSelectForm(templateList, selectTemplateCallback);
		});
	};

	/**
	 * Показывает форму выбора шаблона сайта
	 * @param {Object} templateList список шаблонов сайта
	 * @param {Function} selectTemplateCallback обработчик выбора шаблона
	 */
	let showTemplateSelectForm = function(templateList, selectTemplateCallback) {
		$.get('/styles/skins/modern/design/js/common/html/TemplateSelectForm.html', function(html) {
			openDialog('', getLabel('js-label-template-change-for-pages'), {
				html: html,
				width: 360,
				cancelButton: true,
				confirmText: getLabel('js-choose'),
				cancelText: getLabel('js-cancel'),
				customClass: 'modalUp',
				confirmCallback: selectTemplateCallback,
				openCallback: function(popupSelector) {
					initTemplateSelectForm(popupSelector, templateList);
				}
			});
		});
	};

	/**
	 * Запрашивает список шаблонов сайта
	 * @param {Function} callback обработчик ответа на запрос
	 */
	let requestTemplateList = function(callback) {
		let requestParams = {
			type: 'GET',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_GET_TEMPLATE_TREE_METHOD),
			dataType: 'json',
			data: {
				per_page_limit: 'mode=all',
				p: '0',
				domain_id: DefaultModule.getDomainId()
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, function(response) {
			callback(response);
		}, false);
	};

	/**
	 * Возвращает список страниц, использующих заданный шаблон
	 * @param {Integer|String} templateId идентификатор шаблона
	 * @param {Function} callback обработчик ответа на запрос
	 */
	let requestPageList = function(templateId, callback) {
		let requestParams = {
			type: 'GET',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_GET_TEMPLATE_TREE_METHOD),
			dataType: 'json',
			data: {
				rel: [templateId],
				domain_id: DefaultModule.getDomainId()
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, function(response) {
			callback(response);
		}, false);
	};

	/**
	 * Извлекает идентификатор выбранного шаблона
	 * @param {String} popupSelector селектор окна с формой выбора шаблона
	 * @returns {Integer}
	 */
	let parseSelectedTemplateId = function(popupSelector) {
		return $('select[name = "id"] option[selected]', popupSelector).val();
	};

	/**
	 * Запрашивает смену шаблона для списка выбранных страниц
	 * @param {Integer|String} templateId идентификатор шаблона, на который производится замена
	 * @param {Array} selectedIdList список выбранных страниц
	 * @param {Function} callback обработчик успешной смены
	 */
	let requestChangeTemplateForSelectedPageList = function(templateId, selectedIdList, callback) {
		let pageIdList = [];

		for (let i = 0; i < selectedIdList.length; i++) {
			pageIdList.push({
				id: selectedIdList[i]
			});
		}

		let requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_CHANGE_TEMPLATE_FOR_PAGE_LIST),
			dataType: 'json',
			data: {
				rel: {
					id: templateId
				},
				selected_list: pageIdList
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, callback, false);
	};

	/**
	 * Инициализирует форму создания шаблона сайта
	 * @param {String} popupSelector селектор окна с формой
	 * @param {Object} templateList список шаблонов
	 */
	let initTemplateSelectForm = function(popupSelector, templateList) {
		let templateListPattern = _.template($('#template-option', popupSelector).html());
		let templateListHtml = templateListPattern({
			label: getLabel('js-label-select-template-from-list'),
			templateList: templateList
		});
		$('div.group-block', popupSelector).html(templateListHtml);
		$('select', popupSelector).selectize();
	};

	/**
	 * Переключает активность кнопки тулбара, работающей только для шаблонов
	 * @param {Object} button кнопка тулбара
	 * @returns {*|void}
	 */
	let toggleToolBarButtonForTemplateAction = function(button) {
		dc_application.toggleToolBarButton(button, function(TableControl) {
			return TableControl.hasSelectedRows() && !isNoTemplateInList(TableControl.getSelectedRowList()) && TableControl.isOneRowSelected();
		});
	};

	/**
	 * Возвращает список названий кнопок для формирования меню тулбара табличного контрола дерева шаблонов
	 * @returns {String[]}
	 */
	let getRelatedPageTreeToolBarMenu = function() {
		return ['bindTemplate', 'bindTemplateForAll'];
	};

	/**
	 * Валидирует операцию перетаскивания в табличном контроле дерева привязанных страниц
	 * @param {umiDataTableRow} target элемент, относительно которого выполняется перетаскивание
	 * @param {umiDataTableRow[]} draggedList список перетаскиваемых элементов
	 * @param {String} mode режим перетаскивания (after/before/child)
	 * @returns {String|Boolean}
	 */
	let getRelatedPageTreeDragAndDropValidator = function(target, draggedList, mode) {
		if (isTemplateInList(draggedList) || !isTemplate(target)) {
			return false;
		}

		mode = 'child';
		return mode;
	};

	/**
	 * Определяет есть шаблон в списке сущностей
	 * @param {umiDataTableRow[]} entityList
	 * @returns {Boolean}
	 */
	let isTemplateInList = function(entityList) {
		return entityList.some(isTemplate);
	};

	/**
	 * Определяет отсутствует ли шаблон в списке сущностей
	 * @param {umiDataTableRow[]} entityList
	 * @returns {Boolean}
	 */
	let isNoTemplateInList = function(entityList) {
		return entityList.some(function(entity) {
			return !isTemplate(entity);
		});
	};

	/**
	 * Определяет является ли сущность шаблонов
	 * @param {umiDataTableRow} entity сущность
	 * @returns {Boolean}
	 */
	let isTemplate = function(entity) {
		let attributes = entity.attributes || entity.model.attributes;
		return attributes.module_id === MODULE_NAME;
	};

	/**
	 * Обрабатывает ошибку запроса бекенда
	 * @param {String} errorMessage сообщение об ошибке
	 */
	let handleError = function(errorMessage) {
		DefaultModule.showMessage(errorMessage);
		closeDialog();
		dc_application.refresh();
	};

	/**
	 * Возвращает реализацию функций тулбара табличного контрола списка бэкапов
	 * @return {Object}
	 */
	let getTemplateBackupsToolBarFunctions = function() {
		return {
			create: {
				name: 'create',
				className: 'i-create-backup',
				hint: getLabel('js-label-create-backup'),
				init: function(button) {
					dc_application.toggleToolBarButton(button, function(TableControl) {
						return !TableControl.hasSelectedRows();
					});
				},
				release: function() {
					requestCreateBackup();
					return false;
				}
			},
			download: {
				name: 'download',
				className: 'i-download-backup',
				hint: getLabel('js-label-download-backup'),
				init: function(button) {
					dc_application.toggleToolBarButton(button, function(TableControl) {
						return TableControl.isOneRowSelected();
					});
				},
				release: function() {
					requestDownloadBackup();
					return false;
				}
			},
			restore: {
				name: 'restore',
				className: 'i-restore-backup',
				hint: getLabel('js-label-restore-backup'),
				init: function(button) {
					dc_application.toggleToolBarButton(button, function(TableControl) {
						return TableControl.isOneRowSelected();
					});
				},
				release: function() {
					requestRestoreFromBackup();
					return false;
				}
			},
			remove: {
				name: 'delete',
				className: 'i-delete-backup',
				hint: getLabel('js-label-delete-backup'),
				init: function(button) {
					dc_application.toggleToolBarButton(button, function(TableControl) {
						return TableControl.hasSelectedRows();
					});
				},
				release: function() {
					showDeleteBackupConfirmationForm();
					return false;
				}
			}
		};
	};

	/** Запрашивает создание бэкапа */
	let requestCreateBackup = function() {
		showProgressWindow(getLabel('js-label-backup-creating-processing'));

		let requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_CREATE_BACKUP),
			dataType: 'json'
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			closeDialog();
			dc_application.refresh();
		}, handleError);
	};

	/** Запрашивает скачивание бэкапа */
	let requestDownloadBackup = function() {
		location.href = DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_DOWNLOAD_BACKUP, '?fileName=' + dc_application.getFirstSelectedId());
	};

	/** Запрашивает восстановление из бэкапа */
	let requestRestoreFromBackup = function() {
		showProgressWindow(getLabel('js-label-backup-restoring-processing'));

		let TableControl = dc_application;
		let requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_RESTORE_FROM_BACKUP),
			dataType: 'json',
			data: {
				fileName: TableControl.getFirstSelectedId()
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			closeDialog();
			TableControl.refresh();
		}, handleError);
	};

	/** Показывает форму подтверждения удаления бекапов шаблонов */
	let showDeleteBackupConfirmationForm = function() {
		openDialog('', getLabel('js-label-template-confirm-delete'), {
			html: getLabel('js-label-backup-delete-confirm'),
			confirmText: getLabel('js-del-do'),
			cancelButton: true,
			cancelText: getLabel('js-cancel'),
			confirmCallback: function (dialogName) {
				requestDeleteBackupList();
				closeDialog(dialogName);
			}
		});
	};

	/** Запрашивает удаление бэкапов */
	let requestDeleteBackupList = function() {
		let TableControl = dc_application;
		let requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_DELETE_BACKUP_LIST),
			dataType: 'json',
			data: {
				fileNameList: TableControl.getSelectedIdList()
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			TableControl.refresh();
		}, handleError);
	};

	/**
	 * Возвращает список названий кнопок для формирования меню тулбара табличного контрола списка бэкапов
	 * @returns {String[]}
	 */
	let getTemplateBackupsToolBarMenu = function() {
		return ['create', 'download', 'restore', 'remove'];
	};

	return {
		getTemplatesListToolBarFunctions: getTemplatesListToolBarFunctions,
		getTemplatesListToolBarMenu: getTemplatesListToolBarMenu,
		getRelatedPageTreeToolBarFunctions: getRelatedPageTreeToolBarFunctions,
		getRelatedPageTreeToolBarMenu: getRelatedPageTreeToolBarMenu,
		getRelatedPageTreeDragAndDropValidator: getRelatedPageTreeDragAndDropValidator,
		getTemplateBackupsToolBarFunctions: getTemplateBackupsToolBarFunctions,
		getTemplateBackupsToolBarMenu: getTemplateBackupsToolBarMenu
	};
})(jQuery, _);