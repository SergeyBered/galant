/**
 * Модуль по умолчанию
 * @type {{getRequestUrl, sendAjaxRequest}}
 */
let DefaultModule;
DefaultModule = (function($) {
	"use strict";

	/** @type {String} REQUEST_PREFIX префикс запроса к api */
	const REQUEST_PREFIX = '/admin/';
	/** @type {String} ERROR_REQUEST_MESSAGE сообщение об ошибке, если запрос к серверу завершился неудачно */
	const ERROR_REQUEST_MESSAGE = getLabel('js-label-request-error');

	/**
	 * Возвращает адрес для запроса к бэкэнду
	 * @param {String} module модуль
	 * @param {String} method метод
	 * @param {String|Null} params параметры
	 * @returns {String}
	 */
	let getRequestUrl = function(module, method, params) {
		params = params || '';
		return DefaultModule.getRequestUrlPrefix()  + module + '/' + method + '/.json' + params;
	};

	/**
	 * Отправляет ajax запрос
	 * @param {Object} requestParams параметры запроса
	 * @param {Function} successCallback обработчик успешного получения ответа
	 * @param {Function|Boolean} errorCallback обработчик ошибочного получения ответа
	 */
	let sendAjaxRequest = function(requestParams, successCallback, errorCallback) {
		errorCallback = errorCallback || showMessage;

		if (!requestParams.data) {
			requestParams.data = {};
		}

		requestParams.data.csrf = getCSRFToken();
		let response = $.ajax(requestParams);

		response.done(function(result) {

			if (isRequestResultContainsErrorMessage(result)) {
				return errorCallback(result.data.error);
			}

			if (isRequestResultContainsException(result)) {
				return errorCallback(result.message);
			}

			successCallback(result);
		});

		response.fail(function(response) {
			let message = ERROR_REQUEST_MESSAGE;

			if (response.status === 403 && response.responseJSON && response.responseJSON.data && response.responseJSON.data.error) {
				message = response.responseJSON.data.error;
			}

			errorCallback(message);
		});
	};

	/**
	 * Возвращает CSRF токен
	 * @returns {String}
	 */
	let getCSRFToken = function() {
		return csrfProtection.token;
	};

	/**
	 * Проверяет содержит ли результат запроса сообщение об ошибке и возвращает результат проверки
	 * @param {Object} result результат запроса
	 * @returns {Boolean}
	 */
	let isRequestResultContainsErrorMessage = function(result) {
		return !_.isUndefined(result.data) && !_.isUndefined(result.data.error);
	};

	/**
	 * Проверяет содержит ли результат запроса данные исключения и возвращает результат проверки
	 * @param {Object} result результат запроса
	 * @returns {Boolean}
	 */
	let isRequestResultContainsException = function(result) {
		return !_.isUndefined(result.code) && !_.isUndefined(result.trace) && !_.isUndefined(result.message);
	};

	/**
	 * Показывает сообщение
	 * @param {String} message сообщение
	 * @param {Object} options опции сообщения
	 */
	let showMessage = function(message, options) {
		options = options || {
			'header': 'UMI.CMS',
			'life': 10000
		};

		$.jGrowl(message, options);
	};

	/**
	 * Возвращает идентификатор домена
	 * @returns {*}
	 */
	let getDomainId = function() {
		let TableControl = dc_application;
		let QueryBuilder = TableControl.getQueryBuilder();
		let selectedDomain = QueryBuilder.Domains;
		return (typeof selectedDomain === 'object') ? selectedDomain[0] : selectedDomain;
	};

	/**
	 * Возвращает идентификатор языка
	 * @returns {*}
	 */
	let getLanguageId = function() {
		let TableControl = dc_application;
		let QueryBuilder = TableControl.getQueryBuilder();
		let selectedLanguage = QueryBuilder.Langs;
		return (typeof selectedLanguage === 'object') ? selectedLanguage[0] : selectedLanguage;
	};

	/**
	 * Очищает ответ на запрос списка сущностей от служебных параметров
	 * @param {Object} response ответ на запрос списка сущностей
	 * @return {Object}
	 */
	let extractRowList = function(response) {
		return _.omit(response.data, ['action', 'offset', 'per_page_limit', 'total', 'type']);
	};

	/**
	 * Извлекает список идентификаторов сущностей из ответа на запрос сущностей
	 * @param {Object} response ответ на запрос списка сущностей
	 * @return {Object}
	 */
	let extractIdList = function(response) {
		let pageList = this.extractRowList(response);
		let idList = [];

		for (let index in pageList) {
			idList.push(pageList[index].id)
		}

		return idList;
	};

	/**
	 * Включает отображения контрола "Дерево" для выбора страницы
	 * @param {String} inputSelector селектор input, куда требуется сохранить id
	 * @param {Function} callback обработчик выбора страницы
	 */
	let showTreeControl = function(inputSelector, callback) {
		window.saveTreeElementToContainer = function(id) {

			if (typeof callback === 'function') {
				callback(id);
			} else {
				$(inputSelector).val('%content get_page_url(' + id + ')%');
			}

			jQuery.closePopupLayer("tree");
		};

		jQuery.openPopupLayer({
			name : "tree",
			title : getLabel('js-label-select-page'),
			width : 'auto',
			height : 340,
			url : "/styles/common/js/tree.html?callback=saveTreeElementToContainer"
		});
	};

	/**
	 * Возвращает префикс для адреса запроса
	 * @returns {String}
	 */
	let getRequestUrlPrefix = function() {
		return window.pre_lang + REQUEST_PREFIX;
	};

	/**
	 * Возвращает строковый идентификатор текущего языка
	 * @returns {String}
	 */
	let getRequestLanguageCodeName = function() {
		return window.pre_lang ? window.pre_lang : 'ru';
	};

	/**
	 * Включает отображения файлового менеджера для выбора изображений
	 * @param {String} inputSelector селектор input, куда требуется сохранить изображение
	 * @param {Function} callback обработчик выбора изображения
	 */
	let showImageBrowser = function (inputSelector, callback) {
		let $imageContainer = $(inputSelector);
		let infoRequest = {};

		if ($imageContainer.val()) {
			let imageSource = $imageContainer.val();
			infoRequest.file = imageSource;
			infoRequest.folder = imageSource.substr(0, imageSource.lastIndexOf('/'));
		} else {
			infoRequest.folder = './images/cms/data/';
		}

		jQuery.ajax({
			url: DefaultModule.getRequestUrlPrefix() + '/filemanager/get_filemanager_info/',
			data: infoRequest,
			dataType: 'json',
			type: 'GET',
			complete: function (data) {
				let response = eval('(' + data.responseText + ')');

				if (typeof response !== 'object') {
					return DefaultModule.showMessage(getLabel('js-error-cannot-show-file-browser'));
				}

				let folderHash = (typeof response['folder_hash'] == 'string') ? response['folder_hash'] : '';
				let	fileHash = (typeof response['file_hash'] == 'string') ? response['file_hash'] : '';
				let	lang = (typeof response['lang'] == 'string') ? response['lang'] : DefaultModule.getRequestLanguageCodeName();
				let fileBrowser = (typeof response['filemanager'] == 'string') ? response['filemanager'] : 'elfinder';

				let filesRequest = [];
				filesRequest.push('image=1');
				filesRequest.push('multiple=0');
				filesRequest.push('imagesOnly=1');
				filesRequest.push('noTumbs=1');
				filesRequest.push('lang=' + lang);
				filesRequest.push('folder_hash=' + folderHash);
				filesRequest.push('file_hash=' + fileHash);

				jQuery.openPopupLayer({
					name: "Filemanager",
					title: window.parent.getLabel('js-file-manager'),
					width  : 1200,
					height : 600,
					url: "/styles/common/other/elfinder/umifilebrowser.html?" + filesRequest.join("&"),
					afterClose: function (selectedImage) {
						if (typeof selectedImage !== 'object' || !selectedImage[0] || !selectedImage[0].url){
							return false;
						}

						if (typeof callback === 'function') {
							callback(selectedImage[0].url);
							return true;
						}

						$imageContainer.attr('src', selectedImage[0].url);
						return true;
					},
					success: function() {
						if (uAdmin.wysiwyg) {
							let fileBrowserFooter = uAdmin.wysiwyg.getFilemanagerFooter(fileBrowser);
							jQuery('#popupLayer_Filemanager').append(fileBrowserFooter);
						}
					}
				});
			}
		});
	};

	/**
	 * Возвращает адрес страницы редактирования объекта
	 * @param {String} module модуль
	 * @param {String} method метод
	 * @param {String|Null} objectId id объекта
	 * @returns {String}
	 */
	let getRequestObjextUrl = function(module, method, objectId) {
		return DefaultModule.getRequestUrlPrefix() + module + '/' + method + '/' + objectId + '/';
	};

	/**
	 * Возвращает выбранную сущность в табличном контроле
	 * @returns {Object}
	 */
	var getSelectedEntity = function() {
		return dc_application.toolbar.selectedItems[0];
	};

	/**
	 * Возвращает значение поля выбранной сущности табличного контрола
	 * @param {String} name название поля
	 * @returns {*}
	 */
	let getSelectedEntityValue = function(name) {
		var item = DefaultModule.getSelectedEntity();
		return (typeof item === 'object') ? item.attributes[name] : '';
	};

	return {
		getRequestUrl: getRequestUrl,
		sendAjaxRequest: sendAjaxRequest,
		showMessage: showMessage,
		getDomainId: getDomainId,
		getLanguageId: getLanguageId,
		extractRowList: extractRowList,
		extractIdList: extractIdList,
		showTreeControl: showTreeControl,
		getRequestLanguageCodeName: getRequestLanguageCodeName,
		getRequestUrlPrefix: getRequestUrlPrefix,
		showImageBrowser: showImageBrowser,
		getRequestObjextUrl: getRequestObjextUrl,
		getSelectedEntity: getSelectedEntity,
		getSelectedEntityValue: getSelectedEntityValue,
	};
})(jQuery);