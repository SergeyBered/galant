/**
 * Функционал административной панели модуля Exchange:
 */
var ExchangeModule = (function($, _) {
	"use strict";

	/** @type {String} MODULE_NAME системное имя модуля */
	var MODULE_NAME = 'exchange';
	/** @type {String} REQUEST_PREFIX префикс запроса к api */
	var REQUEST_PREFIX = '/admin/';
	/** @type {String} REQUEST_DOWNLOAD_LOG_FILE метод, который скачивает файл логов */
	const REQUEST_DOWNLOAD_LOG_FILE = 'downloadLogFile';
	/** @type {String} REQUEST_DELETE_LOG_FILE_LIST метод, который удаляет файл логов */
	const REQUEST_DELETE_LOG_FILE_LIST = 'deleteLogFileList';
	/** @type {String} REQUEST_EDIT метод, редактирования сценария импорта */
	const REQUEST_EDIT = 'edit';

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
	 * Возвращает реализацию функций тулбара табличного контрола списка логов
	 * @return {Object}
	 */
	let getLogListToolBarFunctions = function() {
		return {
			download: {
				name: 'download',
				className: 'i-download-backup',
				hint: getLabel('js-label-download-log-file'),
				init: function(button) {
					dc_application.toggleToolBarButton(button, function(TableControl) {
						return TableControl.isOneRowSelected();
					});
				},
				release: function() {
					requestDownloadLogFile();
					return false;
				}
			},
			remove: {
				name: 'delete',
				className: 'i-delete-backup',
				hint: getLabel('js-label-delete-log-file'),
				init: function(button) {
					dc_application.toggleToolBarButton(button, function(TableControl) {
						return TableControl.hasSelectedRows();
					});
				},
				release: function() {
					showDeleteLogFileConfirmationForm();
					return false;
				}
			},
			open: {
				name: 'open',
				className: 'i-see',
				hint: getLabel('js-label-open-import'),
				init: function(button) {
					dc_application.toggleToolBarButton(button, function(TableControl) {
						let scriptId = Number(DefaultModule.getSelectedEntityValue('script_id'));
						return TableControl.isOneRowSelected() && scriptId;
					});
				},
				release: function() {
					openImportScenario();
					return false;
				}
			}
		};
	};

	/** Запрашивает скачивание файла лога */
	let requestDownloadLogFile = function() {
		location.href = DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_DOWNLOAD_LOG_FILE, '?fileName=' + dc_application.getFirstSelectedId());
	};

	/** Показывает форму подтверждения удаления лог файлов */
	let showDeleteLogFileConfirmationForm = function() {
		openDialog('', getLabel('js-label-template-confirm-delete'), {
			html: getLabel('js-label-log-file-delete-confirm'),
			confirmText: getLabel('js-del-do'),
			cancelButton: true,
			cancelText: getLabel('js-cancel'),
			confirmCallback: function (dialogName) {
				requestDeleteLogFileList();
				closeDialog(dialogName);
			}
		});
	};

	/** Запрашивает удаление лог файлов */
	let requestDeleteLogFileList = function() {
		let TableControl = dc_application;
		let requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_DELETE_LOG_FILE_LIST),
			dataType: 'json',
			data: {
				fileNameList: TableControl.getSelectedIdList(),
				domain_id: [DefaultModule.getDomainId()]
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			TableControl.refresh();
		}, handleError);
	};

	/** Открывает страницу сценария импорта выбранного лога */
	let openImportScenario = function() {
		let scriptId = DefaultModule.getSelectedEntityValue('script_id');
		location.href = DefaultModule.getRequestObjextUrl(MODULE_NAME, REQUEST_EDIT, scriptId);
	};

	/**
	 * Возвращает список названий кнопок для формирования меню тулбара табличного контрола списка лог файлов
	 * @returns {String[]}
	 */
	let getLogListToolBarMenu = function() {
		return ['download', 'remove', 'open'];
	};

	/**
	 * Возвращает реализацию функций тулбара табличного контрола раздела "1С идентификаторы"
	 * @return {Object}
	 */
	let getIdentifiersToolBarFunctions = function() {
		let moduleHref = window.location.href.replace(/(\?page=.*)/, '');

		return {
			goToModule: {
				name: 'goToModule',
				className: 'i-rollback',
				hint: getLabel('js-label-open-full-identifiers-list'),
				href: moduleHref,
				init: function(button) {
					dc_application.getToolBar().enableButtons(button);
				}
			}
		}
	}

	/**
	 * Возвращает список названий кнопок для формирования меню тулбара табличного контрола раздела "1С идентификаторы"
	 * @return {String[]}
	 */
	let getIdentifiersToolBarMenu = function () {
		let requestedPageRegexp = /Identifiers\/\?page=(\d*)/;
		let matches = window.location.href.match(requestedPageRegexp);

		return matches ?  ['goToModule'] : [];
	}

	return {
		getLogListToolBarFunctions: getLogListToolBarFunctions,
		getLogListToolBarMenu: getLogListToolBarMenu,
		getIdentifiersToolBarMenu: getIdentifiersToolBarMenu,
		getIdentifiersToolBarFunctions: getIdentifiersToolBarFunctions
	};
})(jQuery, _);
