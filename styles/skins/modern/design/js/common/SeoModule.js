/**
 * Функционал административной панели модуля SEO:
 *
 * 1) showBadLinkSources() - показывает источники битой ссылки
 * 2) findBadLinks() - ищет битые ссылки
 */
var SeoModule = (function($, _) {
	"use strict";

	/** @type {String} MODULE_NAME системное имя модуля */
	var MODULE_NAME = 'seo';
	/** @type {String} REQUEST_PREFIX префикс запроса к api */
	var REQUEST_PREFIX = '/admin/';
	/** @type {String} REQUEST_LINK_SOURCES_METHOD метод, который возвращает источники битой ссылки */
	var REQUEST_LINK_SOURCES_METHOD = 'getLinkSources';
	/** @type {String} REQUEST_INDEX_LINKS_METHOD метод, который индексирует ссылки на сайте */
	var REQUEST_INDEX_LINKS_METHOD = 'indexLinks';
	/** @type {String} REQUEST_CHECK_LINKS_METHOD метод, который проверяет проиндексированные ссылки */
	var REQUEST_CHECK_LINKS_METHOD = 'checkLinks';
	/** @type {String} REQUEST_ADD_SITE_METHOD метод, который добавляет сайт в Яндекс.Вебмастер */
	var REQUEST_ADD_SITE_METHOD = 'addSite';
	/** @type {String} REQUEST_VERIFY_SITE_METHOD метод, который подтвержает права на сайт в Яндекс.Вебмастер */
	var REQUEST_VERIFY_SITE_METHOD = 'verifySite';
	/** @type {String} REQUEST_ADD_SITE_MAP_METHOD метод, который добавляет карту сайта в Яндекс.Вебмастер */
	var REQUEST_ADD_SITE_MAP_METHOD = 'addSiteMap';
	/** @type {String} REQUEST_DELETE_SITE_METHOD метод, который удаляет сайт из Яндекс.Вебмастер */
	var REQUEST_DELETE_SITE_METHOD = 'deleteSite';
	/** @type {String} REQUEST_GET_SITE_INFO_METHOD метод, который возвращает данные о сайте из Яндекс.Вебмастер */
	var REQUEST_GET_SITE_INFO_METHOD = 'getSiteInfo';
	/** @type {String} INDEX_LINKS_STEP_NAME название шага поиска битых ссылок: индексация ссылок */
	var INDEX_LINKS_STEP_NAME = getLabel('js-label-step-linksGrabber');
	/** @type {String} CHECK_LINKS_STEP_NAME название шага поиска битых ссылок: проверка ссылок */
	var CHECK_LINKS_STEP_NAME = getLabel('js-label-step-linksChecker');
	/** @type {String} ERROR_REQUEST_MESSAGE сообщение об ошибке, если запрос к серверу завершился неудачно */
	var ERROR_REQUEST_MESSAGE = getLabel('js-label-request-error');
	/** @type {String} FIND_BAD_LINKS_BUTTON_ID id элемента кнопки поиска битых ссылок */
	var FIND_BAD_LINKS_BUTTON_ID = 'findBadLinks';
	/** @type {String} BAD_LINKS_SEARCH_INFO_ELEMENT_ID id элемента текста progress bar поиска битых ссылок */
	var BAD_LINKS_SEARCH_INFO_ELEMENT_ID = 'badLinksSearchInfo';
	/**
	 * @type {String} BAD_LINKS_SEARCH_ANIMATION_WRAPPER_CLASS class элемента, в котором отображается анимация прогресс
	 * бара поиска битых ссылок
	 */
	var BAD_LINKS_SEARCH_ANIMATION_WRAPPER_CLASS = 'loading-wrapper';
	/** @type {String} BAD_LINKS_SEARCH_CANCEL_BUTTON_ID id элемента кнопки завершения поиска битых ссылок */
	var BAD_LINKS_SEARCH_CANCEL_BUTTON_ID = 'cancel-button';
	/** @type {String} BAD_LINKS_SEARCH_TEMPLATE_ID id элемента с шаблоном контента progress bar поиска битых ссылок */
	var BAD_LINKS_SEARCH_TEMPLATE_ID = 'bad-links-search-template';
	/** @type {String} BAD_LINK_SOURCES_TEMPLATE_ID id элемента с шаблоном источников битой ссылки */
	var BAD_LINK_SOURCES_TEMPLATE_ID = 'bad-link-sources-template';
	/** @type {String} REQUEST_EDIT_ROBOTS_METHOD метод, который сохраняет данные добавляемые в robots.txt */
	var REQUEST_EDIT_ROBOTS_METHOD = 'editRobotsTxt';
	/** @type {String} REQUEST_GET_ROBOTS_METHOD метод, который возвращает данные из robots.txt */
	var REQUEST_GET_ROBOTS_METHOD = 'getRobotsTxt';

	/** Выполняется, когда все элементы DOM готовы */
	$(function () {
		initRenderSeoCharts();
		bindFindBadLinksButton();
	});

	/** Прикрепляет действие к кнопке поиска битых ссылок */
	var bindFindBadLinksButton = function() {
		$('#' + FIND_BAD_LINKS_BUTTON_ID).on('click', findBadLinks);
	};

	/** Инициализирует отрисовку графиков модуля SEO */
	var initRenderSeoCharts = function() {
		$('div.seo_chart canvas').each(function() {
			new Chart(this.getContext('2d'), window[this.id + 'config']);
		});
	};

	/**
	 * Показывает источники битой ссылки
	 * @param {Integer} linkId идентификатор битой ссылки
	 */
	var showBadLinkSources = function(linkId) {
		requestBadLinkSources(linkId, prepareAndShowBadLinkSources);
	};

	/** Запускает поиск битых ссылок и показыват результат клиенту */
	var findBadLinks = function() {
		showBadLinksSearchProgressBar();

		var firstStepName = getNameOfBadLinksSearchNextStep();
		var responseHandler = handleBadLinksSearchResponse;
		var errorHandler = stopBadLinksSearch;

		requestBadLinksSearchProgress(firstStepName, responseHandler, errorHandler);
	};

	/**
	 * Возвращает название следующего шага поиска битых ссылок
	 * @param {String|Undefined} currentStep название текущего шага поиска, если он был начат
	 * @returns {String|Undefined}
	 */
	var getNameOfBadLinksSearchNextStep = function(currentStep) {
		var stepsNames = getBadLinkSearchStepsNames();

		if (_.isUndefined(currentStep)) {
			return stepsNames.shift();
		}

		var currentStepIndex = stepsNames.indexOf(currentStep);
		var newStepIndex = currentStepIndex + 1;

		return stepsNames[newStepIndex];
	};

	/**
	 * Возвращает название шагов поиска битых ссылок
	 * @returns {Array}
	 */
	var getBadLinkSearchStepsNames = function() {
		return [
			INDEX_LINKS_STEP_NAME,
			CHECK_LINKS_STEP_NAME
		];
	};

	/**
	 * Запрашивает прогресс поиска битых ссылок и обрабатывает ответ
	 * @param {String} stepName название шага поиска
	 * @param {Function} responseHandler обработчик корректно ответа
	 * @param {Function} errorHandler обработчик ошибочного ответа
	 */
	var requestBadLinksSearchProgress = function(stepName, responseHandler, errorHandler) {
		var requestMethod = getRequestMethodBySearchStepName(stepName);

		var requestParams = {
			type:		"POST",
			url:		REQUEST_PREFIX + MODULE_NAME + '/' + requestMethod + '/.json',
			dataType:	"json",
			data: {
				csrf: getCSRFToken()
			}
		};

		sendAjaxRequest(requestParams, responseHandler, errorHandler);
	};

	/**
	 * Запрашивает добавление сайта в Яндекс.Вебмастер
	 * @param {Integer} domainId идентификатор домена, на основен его данных будет добавлен сайт
	 */
	var requestAddSite = function(domainId) {
		var requestParams = {
			type:		'POST',
			url:		REQUEST_PREFIX + MODULE_NAME + '/' + REQUEST_ADD_SITE_METHOD + '/.json',
			dataType:	'json',
			data: {
				csrf: getCSRFToken(),
				domain_id: domainId
			}
		};

		sendAjaxRequest(requestParams, function() {
			dc_application.refresh();
		}, showMessage);
	};

	/**
	 * Запрашивает подтверждение прав на сайт в Яндекс.Вебмастер
	 * @param {String} siteId идентификатор сайта в Яндекс.Вебмастер
	 */
	var requestVerifySite = function(siteId) {
		var requestParams = {
			type:		'POST',
			url:		REQUEST_PREFIX + MODULE_NAME + '/' + REQUEST_VERIFY_SITE_METHOD + '/.json',
			dataType:	'json',
			data: {
				csrf: getCSRFToken(),
				site_id: siteId
			}
		};

		sendAjaxRequest(requestParams, function() {
			dc_application.refresh();
		}, showMessage);
	};

	/**
	 * Запрашивает добавление карты сайта в Яндекс.Вебмастер
	 * @param {String} siteId идентификатор сайта в Яндекс.Вебмастер
	 */
	var requestAddSiteMap = function(siteId) {
		var requestParams = {
			type:		'POST',
			url:		REQUEST_PREFIX + MODULE_NAME + '/' + REQUEST_ADD_SITE_MAP_METHOD + '/.json',
			dataType:	'json',
			data: {
				csrf: getCSRFToken(),
				site_id: siteId
			}
		};

		sendAjaxRequest(requestParams, function() {
			dc_application.refresh();
		}, showMessage);
	};

	/**
	 * Запрашивает удаление сайта из Яндекс.Вебмастер
	 * @param {String} siteId идентификатор сайта в Яндекс.Вебмастер
	 */
	var requestDeleteSite = function(siteId) {
		var requestParams = {
			type:		'POST',
			url:		REQUEST_PREFIX + MODULE_NAME + '/' + REQUEST_DELETE_SITE_METHOD + '/.json',
			dataType:	'json',
			data: {
				csrf: getCSRFToken(),
				site_id: siteId
			}
		};

		sendAjaxRequest(requestParams, function() {
			dc_application.refresh();
		}, showMessage);
	};

	/**
	 * Открывает страницу с информацией о сайте из Яндекс.Вебмастер
	 * @param {String} siteId идентификатор сайта в Яндекс.Вебмастер
	 */
	var openSiteInfoPage = function(siteId) {
		document.location.href = REQUEST_PREFIX + MODULE_NAME + '/' + REQUEST_GET_SITE_INFO_METHOD + '/' + siteId + '/';
	};

	/**
	 * Возвращает идентификатор выбранной сущности в табличном контроле
	 * @returns {String|Integer}
	 */
	var getSelectedId = function() {
		return dc_application.unPackId(getSelectedEntity().attributes.id);
	};

	/**
	 * Возвращает выбранную сущность в табличном контроле
	 * @returns {Object}
	 */
	var getSelectedEntity = function() {
		return dc_application.toolbar.selectedItems[0];
	};

	/**
	 * Определяет выбрана ли только одна сущность в табличном контроле
	 * @returns {Boolean}
	 */
	var isOneEntitySelected = function() {
		return dc_application.toolbar.selectedItemsCount === 1;
	};

	/**
	 * Возвращает значение поля выбранной сущности табличного контрола
	 * @param {String} name название поля
	 * @returns {*}
	 */
	var getSelectedEntityValue = function(name) {
		var item = getSelectedEntity();
		return (typeof item === 'object') ? item.attributes[name] : '';
	};

	/**
	 * Возвращает описание функций тулбара табличного контрола списка сайтов
	 * @return {Object}
	 */
	var getSiteListToolBarFunctions = function() {
		return {
			view: {
				name: 'view',
				className: 'i-vision',
				hint: getLabel('js-label-yandex-button-view'),
				init: function(button) {
					if (!isOneEntitySelected()) {
						return dc_application.toolbar.disableButtons(button);
					}

					var statusCode = getSelectedEntityValue('status_code');

					if (statusCode === 'OK') {
						dc_application.toolbar.enableButtons(button);
					} else {
						dc_application.toolbar.disableButtons(button);
					}
				},
				release: function() {
					openSiteInfoPage(getSelectedId());
					return false;
				}
			},
			add: {
				name: 'add',
				className: 'i-add',
				hint: getLabel('js-label-yandex-button-add'),
				init: function(button) {
					if (!isOneEntitySelected()) {
						return dc_application.toolbar.disableButtons(button);
					}

					var statusCode = getSelectedEntityValue('status_code');

					if (statusCode === 'NOT_ADDED') {
						dc_application.toolbar.enableButtons(button);
					} else {
						dc_application.toolbar.disableButtons(button);
					}
				},
				release: function() {
					requestAddSite(getSelectedId());
					return false;
				}
			},
			verify: {
				name: 'verify',
				className: 'i-edit',
				hint: getLabel('js-label-yandex-button-verify'),
				init: function(button) {
					if (!isOneEntitySelected()) {
						return dc_application.toolbar.disableButtons(button);
					}

					var verifyCode = getSelectedEntityValue('verify_code');
					var statusCode = getSelectedEntityValue('status_code');

					if (verifyCode === 'VERIFIED' || verifyCode === 'IN_PROGRESS' || statusCode === 'NOT_ADDED') {
						dc_application.toolbar.disableButtons(button);
					} else {
						dc_application.toolbar.enableButtons(button);
					}
				},
				release: function() {
					requestVerifySite(getSelectedId());
					return false;
				}
			},
			add_site_map: {
				name: 'add_site_map',
				className: 'i-create',
				hint: getLabel('js-label-yandex-button-add_site_map'),
				init: function(button) {
					if (!isOneEntitySelected()) {
						return dc_application.toolbar.disableButtons(button);
					}

					var isSiteMapAdded = getSelectedEntityValue('is_site_map_added');
					var verifyCode = getSelectedEntityValue('verify_code');
					var statusCode = getSelectedEntityValue('status_code');

					if (isSiteMapAdded || verifyCode !== 'VERIFIED' || statusCode !== 'OK') {
						dc_application.toolbar.disableButtons(button);
					} else {
						dc_application.toolbar.enableButtons(button);
					}
				},
				release: function() {
					requestAddSiteMap(getSelectedId());
					return false;
				}
			},
			remove: {
				name: 'delete',
				className: 'i-remove',
				hint: getLabel('js-label-yandex-button-delete'),
				init: function(button) {
					if (!isOneEntitySelected()) {
						return dc_application.toolbar.disableButtons(button);
					}

					var statusCode = getSelectedEntityValue('status_code');

					if (statusCode === 'NOT_ADDED') {
						dc_application.toolbar.disableButtons(button);
					} else {
						dc_application.toolbar.enableButtons(button);
					}
				},
				release: function() {
					requestDeleteSite(getSelectedId());
					return false;
				}
			},
			refresh: {
				name: 'refresh',
				className: 'i-restore',
				hint: getLabel('js-label-yandex-button-refresh'),
				init: function(button) {
					dc_application.toolbar.enableButtons(button);
				},
				release: function() {
					dc_application.refresh();
					return false;
				}
			}
		};
	};

	/**
	 * Возвращает список названий кнопок для формирования меню тулбара табличного контрола списка сайтов
	 * @returns {String[]}
	 */
	var getSiteListToolBarMenu = function() {
		return ['view', 'add', 'verify', 'add_site_map', 'remove', 'refresh'];
	};

	/**
	 * Возвращает список значений для переключение постраничного вывода (Элементов на странице: 10 20 50 100)
	 * @returns {Array}
	 */
	var getSiteListPageLimitList = function() {
		return [];
	};

	/**
	 * Возвращает описание функций тулбара табличного контрола списка доменов для вкладки sitemap
	 * @return {Object}
	 */
	var getSiteMapToolBarFunctions = function() {
		return {
			updateSiteMap: {
				name: 'updateSiteMap',
				className: 'i-site-map-update',
				hint: getLabel('js-label-button-refresh-sitemap'),
				init: function(button) {
					return dc_application.toggleToolBarButton(button, function(TableControl) {
						return TableControl.isOneRowSelected();
					});
				},
				release: function() {
					showUpdateSiteMapForm(
						getLabel('js-update-sitemap-submit'),
						getLabel('js-update-sitemap'),
						'updateSiteMap'
					);
					return false;
				}
			},
			updateSiteMapImages: {
				name: 'updateSiteMapImages',
				className: 'i-site-map-image-update',
				hint: getLabel('js-label-button-refresh-sitemap-images'),
				init: function(button) {
					return dc_application.toggleToolBarButton(button, function(TableControl) {
						return TableControl.isOneRowSelected();
					});
				},
				release: function() {
					showUpdateSiteMapForm(
						getLabel('js-update-sitemap-images-submit'),
						getLabel('js-update-sitemap-images'),
						'updateSiteMapImages'
					);
					return false;
				}
			}
		};
	};

	/**
	 * Возвращает список названий кнопок для формирования меню тулбара табличного контрола списка доменов
	 * @returns {String[]}
	 */
	var getSiteMapToolBarMenu = function() {
		return ['updateSiteMap', 'updateSiteMapImages'];
	};

	/**
	 * Показывает форму подтверждения обновления карты сайта
	 * @param {String} content содержимое окна
	 * @param {String} header заголовок окна
	 * @param {String} method метод бекенда
	 */
	var showUpdateSiteMapForm = function(content, header, method) {
		openDialog(content, header, {
			width: 390,
			cancelButton: true,
			confirmText: getLabel('js-label-yes'),
			cancelText: getLabel('js-label-no'),
			confirmCallback: function (popupName) { 
				$.get('/styles/skins/modern/design/js/common/html/TemplateUpdateSitemap.html', function(html) {
					openDialog('', header, {
						stdButtons: false,
						html: html,
						width: 390,
						openCallback: function(popupSelector) {
							initTemplateUpdateSiteMap(popupSelector);
						}
					});
					updatingIsStopped = false;
					processUpdateSiteMap(method);
					closeDialog(popupName);
				});	
			}
		});
	};

	/** Инициализирует шаблон сообщения окна обновления карты */
	var initTemplateUpdateSiteMap = function(popupSelector) {
		replaceJsI18nConstants('div[data-i18n-value]', popupSelector, function($element, label) {
			$element.text(label);
		});

		replaceJsI18nConstants('input[data-i18n-value]', popupSelector, function($element, label) {
			$element.val(label);
		});
	};

	/**
	 * Заменяет языковую метку элемента на ее значение
	 * @param {String} elementSelector селектор элемента
	 * @param {String} containerSelector селектор контейнера элемента
	 * @param {Function} callback функция обратного вызова для установки значения метки
	 */
	var replaceJsI18nConstants = function(elementSelector, containerSelector, callback) {
		$(elementSelector, containerSelector).each(function() {
			var $element = $(this);
			var key = $element.data('i18n-value');
			var label = getLabel(key);
			callback($element, label);
		});
	};

	/** Сообщает об ошибке в процессе обновления карты сайта */
	var reportErrorUpdateSiteMap = function(msg) {
		$('#export_log').append(msg + "<br />");
		$('.progress', '.exchange_container').detach();
		$('#process-header').detach();
		$('#exchange-container').detach();
		$.get('/styles/skins/modern/design/js/common/html/TemplateOkButton.html', function(html) {
			$('.eip_buttons').html(html);
			$('.eip_buttons #ok_btn').val(getLabel('js-sitemap-ok'));
			$('#ok_btn').one("click", function() { closeDialog(); });
		});
		if (window.session) {
			window.session.stopAutoActions();
		}
	}

	/** Сообщает о завершении обновления карты сайта */
	var completeUpdatingSiteMap = function() {
		var container = $('.exchange_container');
		$('#process-header', container).text(getLabel('js-sitemap-updating-complete'));
		$('.eip_buttons #stop_btn').val(getLabel('js-sitemap-ok'));
		var progressBar = $('.progress-bar', container);
		progressBar.attr('aria-valuenow', 0);
		progressBar.css('width', 0);
	}

	/** @var boolean updatingIsStopped остановить обновление карты сайта */
	var updatingIsStopped = false;

	/**
	 * Выполняет обновление карты сайта
	 * @param {String} method метод бекенда
	 */
	var processUpdateSiteMap = function (method) {
		var TableControl = dc_application;
		var domainId = TableControl.getFirstSelectedId();
		$('#stop_btn').one("click", function() {
			updatingIsStopped = true;
			closeDialog();
			return false;
		});

		if (window.session) {
			window.session.startAutoActions();
		}

		$.ajax({
			type: "GET",
			url: "/admin/seo/" + method + "/"+ domainId +".xml"+"?r=" + Math.random(),
			dataType: "xml",

			success: function(doc){
				var data_nl = doc.getElementsByTagName('data');
				if (!data_nl.length) {
					reportErrorUpdateSiteMap(getLabel('js-sitemap-ajax-error'));
					return false;
				}
				var data = data_nl[0];
				var complete = data.getAttribute('complete') || false;

				if (complete === false) {
					var errors = data.getElementsByTagName('error');
					var error = errors[0] || false;

					var errorMessage = '';
					if (error !== false) {
						errorMessage = error.textContent;
					} else {
						errorMessage = getLabel('js-sitemap-ajax-error');
					}

					reportErrorUpdateSiteMap(errorMessage);
					return false;
				}

				if (complete == 1) {
					if (window.session) {
						window.session.stopAutoActions();
					}
					completeUpdatingSiteMap();
				} else if (!updatingIsStopped) {
					processUpdateSiteMap(method);
				}
			},
			error: function(event, XMLHttpRequest, ajaxOptions, thrownError) {
				if (window.session) {
					window.session.stopAutoActions();
				}
				reportErrorUpdateSiteMap(getLabel('js-sitemap-ajax-error'));
			}
		});
	};

	/**
	 * Возвращает описание функций тулбара табличного контрола списка доменов для вкладки robots
	 * @return {Object}
	 */
	var getRobotsToolBarFunctions = function() {
		return {
			editRobots: {
				name: 'editRobots',
				className: 'i-edit',
				hint: getLabel('js-label-button-edit-robots'),
				init: function(button) {
					return dc_application.toggleToolBarButton(button, function(TableControl) {
						return TableControl.isOneRowSelected();
					});
				},
				release: function() {
					showRobotsEditForm();
					return false;
				}
			}
		};
	};

	/**
	 * Возвращает список названий кнопок для формирования меню тулбара табличного контрола вкладки robots
	 * @returns {String[]}
	 */
	var getRobotsToolBarMenu = function() {
		return ['editRobots'];
	};

	/** Показывает форму редактирования robots.txt */
	var showRobotsEditForm = function() {
		$.get('/styles/skins/modern/design/js/common/html/TemplateRobotsEditForm.html', function(html) {
			openDialog('', getLabel('js-label-button-edit-robots'), {
				html: html,
				width: 500,
				cancelButton: true,
				confirmText: getLabel('js-label-save-robots-txt'),
				cancelText: getLabel('js-cancel'),
				customClass: 'modalUp',
				confirmCallback: function(popupName, popupSelector) {
					var data = parseRobotsEditForm(popupSelector);
					requestRobotsEdit(data);
					closeDialog(popupName);
				},
				openCallback: function(popupSelector) {
					initRobotsEditForm(popupSelector);
				}
			});
		});
	};

	/**
	 * Запрашивает редактирование robots.txt
	 * @param {Object} data данные robots.txt
	 */
	var requestRobotsEdit = function(data) {
		var TableControl = dc_application;
		data['domain_id'] = TableControl.getFirstSelectedId();

		var requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_EDIT_ROBOTS_METHOD),
			dataType: 'json',
			data: data
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			TableControl.refresh();
		}, false);
	};

	/**
	 * Инициализирует форму редактирования robots.txt
	 * @param {String} popupSelector селектор окна с формой
	 */
	var initRobotsEditForm = function(popupSelector) {
		$('div[data-i18n-value]', popupSelector).each(function() {
			var $div = $(this);
			var key = $div.data('i18n-value');
			$div.text(getLabel(key));
		});
		requestGetRobotsTxt(popupSelector);
	};

	/**
	 * Запрашивает текущеие значение robots.txt для домена
	 * @param {String} popupSelector селектор окна с формой
	 */
	var requestGetRobotsTxt = function(popupSelector) {
		var data = {};
		var TableControl = dc_application;
		data['domain_id'] = TableControl.getFirstSelectedId();

		var requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_GET_ROBOTS_METHOD),
			dataType: 'json',
			data: data
		};

		DefaultModule.sendAjaxRequest(requestParams, function(json) {
			if (json.data['robots_txt']) {
				$('#text-robots-txt', popupSelector).val(json.data['robots_txt']);
			}
		}, false);
	};

	/**
	 * Извлекает данные формы редактирования robots.txt
	 * @param {String} popupSelector селектор окна с формой
	 * @returns {{
	 *      'data[text]': String,
	 * }}
	 */
	var parseRobotsEditForm = function(popupSelector) {
		return {
			'robots_txt': $('#text-robots-txt', popupSelector).val()
		};
	};

	/**
	 * Обрабатывает progress bar битых ссылок.
	 * В зависимости от полученных данных, продожает или завершает поиск.
	 * @param {Object} result результат запрос прогресса поиска битых ссылок
	 */
	var handleBadLinksSearchResponse = function(result) {
		var isResultCorrect =
			!(_.isUndefined(result.isComplete) || _.isUndefined(result.step) || _.isUndefined(result.info));

		if (!isResultCorrect) {
			return stopBadLinksSearch(ERROR_REQUEST_MESSAGE);
		}

		var responseHandler = handleBadLinksSearchResponse;
		var errorHandler = stopBadLinksSearch;

		if (!result.isComplete) {
			setBadLinksSearchProgressBarMessage(result.info);
			return requestBadLinksSearchProgress(result.step, responseHandler, errorHandler);
		}

		var nextStepName = getNameOfBadLinksSearchNextStep(result.step);

		if (!_.isUndefined(nextStepName)) {
			return requestBadLinksSearchProgress(nextStepName, responseHandler, errorHandler);
		}

		finishBadLinksSearch();
	};

	/** Успешно завершает поиск битых ссылок */
	var finishBadLinksSearch = function() {
		var successMessage = getLabel('js-label-bad-links-search-complete');
		setBadLinksSearchProgressBarMessage(successMessage);
		hideBadLinksSearchProgressBarAnimation();
		setBadLinksSearchProgressBarButtonValue(getLabel('js-label-close'));

		$('#'+ BAD_LINKS_SEARCH_CANCEL_BUTTON_ID).on('click', function(){
			window.location.reload();
		});
	};

	/**
	 * Прерывает поиск битых ссылок и показывает результирующее сообщение
	 * @param {String} message сообщение
	 */
	var stopBadLinksSearch  = function(message) {
		closeBadLinksSearchProgressBarWindow();
		showMessage(message);
	};

	/** Показывает окно с progress bar поиска битых ссылок */
	var showBadLinksSearchProgressBar = function() {
		var template = _.template($('#' + BAD_LINKS_SEARCH_TEMPLATE_ID).html());

		var content = template({
			id: BAD_LINKS_SEARCH_INFO_ELEMENT_ID,
			message: getLabel('js-label-bad-links-search-start-message')
		});

		var popupOptions = {
			width: 400,
			html: content,
			confirmButton: false,
			cancelButton: true,
			cancelText: getLabel('js-label-interrupt'),
			cancelCallback: closeBadLinksSearchProgressBarWindow,
			closeCallback: closeBadLinksSearchProgressBarWindow
		};

		openDialog('', getLabel('js-label-bad-links-search'), popupOptions);
	};

	/**
	 * Устанавливает сообщение для progress bar поиска битых ссылок
	 * @param {String} message сообщение
	 */
	var setBadLinksSearchProgressBarMessage = function(message) {
		$('#'+ BAD_LINKS_SEARCH_INFO_ELEMENT_ID).html(message);
	};

	/**
	 * Обновляет текст кнопки прогрес бара поиска битых ссылок
	 * @param {String} text текст
	 */
	var setBadLinksSearchProgressBarButtonValue = function(text) {
		$('#'+ BAD_LINKS_SEARCH_CANCEL_BUTTON_ID).val(text);
	};

	/** Скрывает анимацию progress bar поиска битых ссылок */
	var hideBadLinksSearchProgressBarAnimation = function() {
		$('.' + BAD_LINKS_SEARCH_ANIMATION_WRAPPER_CLASS).hide();
	};

	/** Закрывает окно с progress bar поиска битых ссылок */
	var closeBadLinksSearchProgressBarWindow = function() {
		closeDialog();
	};

	/**
	 * Возвращает имя метода, который отвечает за выполнение шага поиска битых ссылок
	 * @param {String} stepName имя шага поиска битых ссылок
	 * @returns {String} имя метода или null, если передан имя неизвестного шага
	 * @throws Error
	 */
	var getRequestMethodBySearchStepName = function(stepName) {
		switch (stepName) {
			case INDEX_LINKS_STEP_NAME : {
				return REQUEST_INDEX_LINKS_METHOD;
			}
			case CHECK_LINKS_STEP_NAME : {
				return REQUEST_CHECK_LINKS_METHOD;
			}
		}

		throw new Error(getLabel('js-error-label-unknown-search-step-name'));
	};

	/**
	 * Оформляет источники битой ссылки и показывает их пользователю во всплывающем окне
	 * @param {Array} linkSources
	 */
	var prepareAndShowBadLinkSources = function(linkSources) {
		var template = _.template($('#' + BAD_LINK_SOURCES_TEMPLATE_ID).html());

		var content = template({
			header: getLabel('js-label-header-sources'),
			sources: linkSources
		});

		var popupOptions = {
			width: 650,
			html: content,
			confirmText: getLabel('js-confirm'),
			closeButton: false
		};

		openDialog('', getLabel('js-label-title-sources'), popupOptions);
	};

	/**
	 * Запрашивает источники битой ссылки и вызывает callback в случае успеха
	 * @param {Integer} linkId идентификатор битой ссылки
	 * @param {Function} showSources callback успешного запроса
	 */
	var requestBadLinkSources = function(linkId, showSources) {
		var requestParams = {
			type:		"GET",
			url:		REQUEST_PREFIX + MODULE_NAME + '/' + REQUEST_LINK_SOURCES_METHOD + '/.json',
			dataType:	"json",
			data: 	{
				param0: linkId,
				csrf: getCSRFToken()
			}
		};

		sendAjaxRequest(requestParams, showSources, handleRequestError);
	};

	/**
	 * Отправляет ajax запрос
	 * @param {Object} requestParams параметры запроса
	 * @param {Function} successCallback обработчик успешного получения ответа
	 * @param {Function} errorCallback обработчик ошибочного получения ответа
	 */
	var sendAjaxRequest = function(requestParams, successCallback, errorCallback) {
		var response = $.ajax(requestParams);

		response.done(function(result){
			if (isRequestResultContainsErrorMessage(result)) {
				return errorCallback(result.data.error);
			}

			if (isRequestResultContainsException(result)) {
				return errorCallback(result.message);
			}

			successCallback(result);
		});

		response.fail(function(){
			var message = ERROR_REQUEST_MESSAGE;

			if (response.status === 403 && response.responseJSON && response.responseJSON.data && response.responseJSON.data.error) {
				message = response.responseJSON.data.error;
			}

			errorCallback(message);
		});
	};

	/**
	 * Проверяет содержит ли результат запроса сообщение об ошибке и возвращает результат проверки
	 * @param {Object} result результат запроса
	 * @returns {Boolean}
	 */
	var isRequestResultContainsErrorMessage = function(result) {
		return !_.isUndefined(result.data) && !_.isUndefined(result.data.error);
	};

	/**
	 * Проверяет содержит ли результат запроса данные исключения и возвращает результат проверки
	 * @param {Object} result результат запроса
	 * @returns {Boolean}
	 */
	var isRequestResultContainsException = function(result) {
		return !_.isUndefined(result.code) && !_.isUndefined(result.trace) && !_.isUndefined(result.message);
	};

	/**
	 * Обрабатывает ошибку запроса
	 * @param {String} message текст ошибки
	 */
	var handleRequestError = function(message) {
		return showMessage(message);
	};

	/**
	 * Показывает сообщение
	 * @param {String} message сообщение
	 */
	var showMessage = function(message) {
		$.jGrowl(message);
	};

	/**
	 * Возвращает CSRF токен
	 * @returns {String}
	 */
	var getCSRFToken = function() {
		return csrfProtection.token;
	};

	return {
		showBadLinkSources: showBadLinkSources,
		findBadLinks: findBadLinks,
		getSiteListToolBarFunctions: getSiteListToolBarFunctions,
		getSiteListToolBarMenu: getSiteListToolBarMenu,
		getSiteListPageLimitList: getSiteListPageLimitList,
		getSiteMapToolBarFunctions: getSiteMapToolBarFunctions,
		getSiteMapToolBarMenu: getSiteMapToolBarMenu,
		getRobotsToolBarFunctions: getRobotsToolBarFunctions,
		getRobotsToolBarMenu: getRobotsToolBarMenu
	};
})(jQuery, _);
