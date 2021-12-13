(function($, umi) {
	"use strict";

	/** Конструктор */
	$(function() {
		var updateFunction = (umi.data && !!umi.data['demo']) ? updateInDemo : updateSystem;
		jQuery('#update').on('click', updateFunction);
	});

	/**
	 * Релализует обновления в демо режиме
	 * @param {Object} event событие клика по кнопке "Обновить"
	 */
	var updateInDemo = function(event) {
		event.preventDefault();
		$.jGrowl('<p>' + getLabel('js-label-stop-in-demo') + '</p>', {
			'header': 'UMI.CMS',
			'life': 10000
		});
	};

	/** @var {Boolean} updateStarted признак начала обновления */
	var updateStarted = false;

	/**
	 * Реализует обновление
	 * @param {Object} event событие клика по кнопке "Обновить"
	 * @returns {Boolean}
	 */
	var updateSystem = function(event) {
		event.preventDefault();

		checkIntegrity(function() {
			updateStarted = true;
			step = CHECK_USER_STEP;
			install();
		});

		return false;
	};

	/**
	 * Проверяет целостность системы
	 * @param {Function} updateCallback функция для вызова обновления системы
	 */
	function checkIntegrity(updateCallback) {
		showPreloader();

		jQuery.ajax({
			url: '/admin/autoupdate/integrity/.json',
			dataType: 'json',
			success: function(response) {

				if (_.isUndefined(response.data)) {
					return updateCallback();
				}

				if (_.isUndefined(response.data.changed) || _.isUndefined(response.data.deleted)) {
					return updateCallback();
				}

				if (!_.isUndefined(response.data.changed.item) || !_.isUndefined(response.data.deleted.item)) {
					var message = _.template($('#integrity-error-message').html())({});
					showMess(message);
					bindCloseButtonHandler();
					$('.retry-button').on('click', updateCallback);
					return false;
				}

				return updateCallback();
			},
			error: function() {
				showMess(getLabel('js-inner-error-call-care-service'));
			}
		});
	}

	/** @var {Array} stepHeaders список заголовков шагов обновления */
	var stepHeaders = [
		'Проверка прав пользователя',
		'Проверка обновлений',
		'Выбор версии',
		'Загрузка пакета тестирования',
		'Распаковка архива с тестами',
		'Запись начальной конфигурации',
		'Выполняется тестирование',
		'Скачивание компонентов',
		'Распаковка компонентов',
		'Проверка компонентов',
		'Обновление подсистемы',
		'Обновление базы данных',
		'Установка компонентов',
		'Обновление конфигурации',
		'Очистка кеша',
		'Очистка системного кеша'
	];

	/** @var {Array} stepNames список имен шагов обновления */
	var stepNames = [
		'check-user',
		'check-update',
		'select-version',
		'download-service-package',
		'extract-service-package',
		'write-initial-configuration',
		'run-tests',
		'download-components',
		'extract-components',
		'check-components',
		'update-installer',
		'update-database',
		'install-components',
		'configure',
		'cleanup',
		'clear-cache'
	];

	/** @var {Integer} CHECK_USER_STEP идентификатор шага "Проверка прав пользователя" */
	var CHECK_USER_STEP = 0;
	/** @var {Integer} CHECK_USER_STEP идентификатор шага "Проверка обновлений" */
	var CHECK_UPDATE_STEP = 1;
	/** @var {Integer} CHECK_USER_STEP идентификатор шага "Выбор версии" */
	var SELECT_VERSION_STEP = 2;
	/** @var {Integer} CHECK_USER_STEP идентификатор шага "Выполняется тестирование" */
	var RUN_TESTS_STEP = 6;
	/** @var {Integer} CHECK_USER_STEP идентификатор шага "Скачивание компонентов" */
	var DOWNLOAD_COMPONENTS_STEP = 7;
	/** @var {Integer} CHECK_USER_STEP идентификатор шага "Очистка системного кеша" */
	var CLEAR_CACHE_STEP = 15;
	/** @var {Integer} step идентификатор текущего шага */
	var step;
	/** @var {String} updateWindowName имя окна с состоянием обновления */
	var updateWindowName = 'update_window';
	/** @var {String} preloaderCacheTemplate кэш шаблона прелоадера */
	var preloaderCacheTemplate = '';
	/** @var {String|Null} targetVersion версия, до которой надо производить обновления */
	var targetVersion;

	/**
	 * Показывает сообщение об ошибке запроса
	 * @returns {Boolean}
	 */
	function showResponseError() {
		if (!updateStarted) {
			return false;
		}

		loadMessageTemplate('UpdatesInvalidResponseMessage', function(html) {
			showMess(html);
			bindRetryButtonHandler();
		});

		return false;
	}

	/** Назначает обработчик кнопке "Закрыть" */
	function bindCloseButtonHandler() {
		var $closeButton = $('.close-dialog');

		$closeButton.off('click');
		$closeButton.on('click', function() {
			closeDialog(updateWindowName);
		});
	}

	/** Назначает обработчик кнопке "Повторить попытку" */
	function bindRetryButtonHandler() {
		$('.retry-button').on('click', function(event) {
			event.preventDefault();
			install();
			return false;
		});
	}

	/** Назначает обработчик кнопкам "Обновить принудительно" и "Обновить систему" */
	function bindForceUpdateButtonHandler() {
		$('.force-update').on('click', function(event) {
			if (!$(this).attr('disabled')) {
				event.preventDefault();
				step++;
				install();
			}
		});
	}

	/** Назначает обработчик кнопке "Да, я хочу выполнить обновление." */
	function bindUpdateApproveButtonHandler() {
		var $updateButton = $('.force-update');

		$('.wish-update').on('click', function() {
			if ($(this).hasClass('checked')) {
				$updateButton.removeAttr('disabled');
			} else {
				$updateButton.attr('disabled', 'true');
			}
		});
	}

	/** Назначает обработчик кнопке "Продолжить" */
	function bindContinueButtonHandler() {
		$('#continueBackup').on('click', function(event) {
			event.preventDefault();

			if (!$(this).attr('disabled')) {
				beginRealInstallation();
			}

			return false;
		});
	}

	/** Назначает обработчик кнопке "Бекап сделан" */
	function bindBackupApproveButtonHandler() {
		var $continueButton = $('#continueBackup');

		$('.for-backup').on('click', function() {
			if ($(this).hasClass('checked')) {
				$continueButton.removeAttr('disabled');
			} else {
				$continueButton.attr('disabled', 'true');
			}
		});
	}

	/** Назначает обработчик кнопки "Выбрать" */
	function bindApproveSelectedVersionButtonHandler() {
		$('#select_version').on('click', function(event) {
			if (!$(this).attr('disabled')) {
				event.preventDefault();
				step++;
				install();
			}
		});
	}

	/** Назначает обработчик кнопкам выбора версии */
	function bindSelectVersionButtonHandler() {
		$('input[name="version"]').on('click', function() {
			targetVersion = $(this).val();
			$('#select_version').removeAttr('disabled');
		});
	}

	/**
	 * Применяет шаблон ошибки обновления
	 * @param {String} popupSelector селектор содержимого окна состояния обновления
	 * @param {String} message сообщение об ошибке
	 */
	function renderUpdateErrorMessage(popupSelector, message) {
		var template = _.template($('#error-message', popupSelector).html());
		var content = template({
			showScroll: message.length >= 50,
			message: message
		});
		$('div.update-info', popupSelector).html(content);
	}

	/**
	 * Обрабатывает ответ обновлятора
	 * @param {String} response ответ
	 * @returns {Boolean}
	 */
	function callBack(response) {
		if (!response) {
			return showResponseError();
		}

		if (jQuery('html', response).length > 0 || jQuery('result', response).length === 0) {
			return showResponseError();
		}

		var state = jQuery('install', response).attr('state');
		if (state === 'inprogress') {
			install();
			return false;
		}

		var errors = jQuery('error', response);
		var templateName = '';
		var options = {};

		// Ошибки на шаге 0, 1, 2 обрабатываются в свиче, для остальных - обработка здесь.
		if (step > SELECT_VERSION_STEP) {
			if (errors.length > 0) {
				loadMessageTemplate('UpdatesErrorMessage', function(html) {
					options = {
						openCallback: function(popupSelector) {
							renderUpdateErrorMessage(popupSelector, errors.attr('message'))
						}
					};
					showMess(html, null, options);
					bindCloseButtonHandler();
					bindRetryButtonHandler();
				});
				return false;
			}
		}

		switch (step) {
			case CHECK_USER_STEP: {
				if (errors.length > 0) {
					loadMessageTemplate('UpdatesCheckUserErrorMessage', function(html) {
						showMess(html);
						bindCloseButtonHandler();
					});
					return false;
				}
				break;
			}
			case CHECK_UPDATE_STEP: {
				var hasUpdates = true;

				if (errors.length > 0) {
					var message = errors.attr('message');

					if (message === 'Updates not avaiable.') {
						templateName = 'UpdatesCheckUpdateNotAvailableMessage';
					} else if (message === 'Updates avaiable.') {
						templateName = 'UpdatesCheckUpdateAvailableMessage';
					} else {
						hasUpdates = false;
						templateName = 'UpdatesCheckUpdateErrorMessage';
					}

					loadMessageTemplate(templateName, function(html) {
						options = hasUpdates ? {stdButtons: false} : {};
						showMess(html, null, options);
						bindCloseButtonHandler();
						bindForceUpdateButtonHandler();
						bindUpdateApproveButtonHandler();
					});

					return false;
				}
				break;
			}

			case SELECT_VERSION_STEP : {
				if (errors.length > 0) {
					if (errors.attr('message') === 'Save version') {
						targetVersion = $('message', response)[1].innerHTML;
						break;
					}

					if (errors.attr('message') === 'Select version') {
						var header = $('message:first', response)[0].innerHTML;
						var versionList = [];

						$('message', response).not(':first').each(function(index, releaseNode) {
							var release = releaseNode.innerHTML;
							var matches = release.match('([\\d\\.]{2,})-([\\d]{1,})-([\\d]{1,})');
							versionList.push({
								id: matches[2] + '_' + matches[3],
								date: matches[1],
								major: matches[2],
								minor: matches[3]
							});
						});

						options = {
							openCallback: function(popupSelector) {
								var template = _.template($('#select-version', popupSelector).html());
								var content = template({
									header: header,
									versionList: versionList
								});
								$('div.update-info', popupSelector).html(content);
							}
						};

						templateName = 'UpdatesSelectVersionMessage';
					} else {
						templateName = 'UpdatesSelectVersionErrorMessage';
					}

					loadMessageTemplate(templateName, function(html) {
						showMess(html, null, options);
						bindCloseButtonHandler();
						bindApproveSelectedVersionButtonHandler();
						bindSelectVersionButtonHandler();
					});

					return false;
				}
				break;
			}

			case RUN_TESTS_STEP: {
				loadMessageTemplate('UpdatesRunTestsMessage', function(html) {
					showMess(html);
					bindCloseButtonHandler();
					bindContinueButtonHandler();
					bindBackupApproveButtonHandler();
				});

				return false;
			}

			case CLEAR_CACHE_STEP: {
				jQuery(window).off('beforeunload');
				jQuery(window).on('beforeunload', function() {
					return null;
				});

				loadMessageTemplate('UpdatesClearCacheMessage', function(html) {
					showMess(html);
					bindCloseButtonHandler();
				});

				return false;
			}
		}

		bindCloseButtonHandler();
		step++;
		install();
		return false;
	}

	/**
	 * Загружает шаблон сообщения
	 * @param {String} name имя шаблона
	 * @param {Function} callback функция обратного вызова, куда передается html шаблона
	 */
	function loadMessageTemplate(name, callback) {
		var messagePath = '/styles/skins/modern/design/js/common/html/' + name + '.html';
		$.get(messagePath, callback).fail(function() {
			setTimeout(function() {
				loadMessageTemplate(name, callback);
			}, (5 * 1000));
		});
	}

	/** Запускает периодическое выполнение пинга обновлятора */
	function startPing() {
		jQuery.post('/updater.php', {step: 'ping', guiUpdate: 'true'});
		setTimeout(function() {
			startPing();
		}, (3 * 60 * 1000));
	}

	/**
	 * Запускает итерацию обновления
	 * @returns {Boolean}
	 */
	function install() {
		if (step > stepNames.length - 1) {
			return false;
		}

		showPreloader(stepHeaders[step] + '.');

		jQuery.post('/updater.php', {step: stepNames[step], guiUpdate: 'true', version: targetVersion}, function(response) {
			callBack(response);
		}).fail(function() {
			showResponseError();
		});

		return false;
	}

	/**
	 * Показывает прелоудер с заданным сообщением
	 * @param {String} message сообщение
	 */
	function showPreloader(message) {
		message = message || '';

		if (preloaderCacheTemplate) {
			showMess(preloaderCacheTemplate, message);
		} else {
			loadMessageTemplate('UpdatesPreloader', function(html) {
				preloaderCacheTemplate = html;
				showMess(html, message);
			});
		}

		return false;
	}

	/**
	 * Показывает окно с состоянием обновления
	 * @param {String} message сообщение окна
	 * @param {String|Null} title заголовок окна
	 * @param {Object} options опции отображения
	 */
	function showMess(message, title, options) {
		title = title || 'Обновление системы';
		var windowName = updateWindowName;
		var openedWindow = getPopupByName(windowName);

		var content = '<div class="update-info">' + message + '</div>';

		var defaultOptions = {
			name: windowName,
			width: 350,
			html: content,
			stdButtons: false,
			closeButton: false,
			openCallback: function() {}
		};

		options = $.extend(defaultOptions, options);

		if (!openedWindow) {
			openDialog('', title, options);
		} else {
			$(".eip_win_title", openedWindow.id).html(title);
			$(".popupText", openedWindow.id).html(content);
			applyOptions(options, openedWindow.id);
			options.openCallback(openedWindow.id);
			$('.checkbox input:checked', openedWindow.id).parent().addClass('checked');
			$('.checkbox', openedWindow.id).on('click', function() {
				$(this).toggleClass('checked');
			});
		}
	}

	/**
	 * Применяет опции отображения окна к существующему окну
	 * @param {Object} options опции отображения
	 * @param {String} popupContainer идентификатор контейнера окна
	 */
	function applyOptions(options, popupContainer) {
		if (typeof options.stdButtons == 'boolean' && !options.stdButtons) {
			$('.eip_buttons', popupContainer).detach();
		}
	}

	/** Запускает процедуру обновления */
	function beginRealInstallation() {
		step = DOWNLOAD_COMPONENTS_STEP;

		if (window.session) {
			window.session.destroy();
		}

		if (uAdmin.session.pingIntervalHandler) { // отключаем стандартный пинг
			clearInterval(uAdmin.session.pingIntervalHandler);
		}

		startPing(); // Запускаем постоянное обращение к серверу во избежание потери сессии
		install();
	}

}(jQuery, uAdmin));
