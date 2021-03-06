/**
 * Модуль, содержащий конструкторы контролов и некоторые функции для модуля "Каталог"
 * @type {{ElementMovingControl, CopyCreatingControl, getControl, addControl, openCategoriesWindow, moveItem}}
 */
var CatalogModule;
CatalogModule = (function($, _) {
	"use strict";

	/** @type {String} MODULE_NAME системное имя модуля */
	var MODULE_NAME = 'catalog';
	/** @type {String} REQUEST_ADD_TRADE_OFFER_METHOD метод, который создает торговое предложение */
	var REQUEST_ADD_TRADE_OFFER_METHOD = 'addTradeOffer';
	/** @type {String} REQUEST_COPY_TRADE_OFFER_METHOD метод, который копирует торговое предложение */
	var REQUEST_COPY_TRADE_OFFER_METHOD = 'copyTradeOffer';
	/** @type {String} REQUEST_CHANGE_ACTIVITY_TRADE_OFFER_LIST_METHOD метод, который изменяет активность торговых предложений */
	var REQUEST_CHANGE_ACTIVITY_TRADE_OFFER_LIST_METHOD = 'changeTradeOfferListActivity';
	/** @type {String} REQUEST_DELETE_TRADE_OFFER_METHOD метод, который удаляет торговые предложения */
	var REQUEST_DELETE_TRADE_OFFER_LIST_METHOD = 'deleteTradeOfferList';
	/** @type {String} REQUEST_ADD_TRADE_OFFER_PRICE_TYPE_METHOD метод, который создает тип цены торгового предложения */
	var REQUEST_ADD_TRADE_OFFER_PRICE_TYPE_METHOD = 'addTradeOfferPriceType';
	/** @type {String} REQUEST_DELETE_TRADE_OFFER_PRICE_TYPE_LIST_METHOD метод, который удаляет типы цен торговых предложений */
	var REQUEST_DELETE_TRADE_OFFER_PRICE_TYPE_LIST_METHOD = 'deleteTradeOfferPriceTypeList';

	/**
	 * Инициализирует контрол
	 * @param {Object} context объект контекста выполнения
	 * @param {String} id идентификатор контейнера для контрола
	 * @param {String} module текущий модуль
	 * @param {Object} options объект срдержащий опции для контрола
	 * @param {String} hierarchyType строка вида: 'Модуль::Метод',
	 * обозначающая тип выводимых объектов в дереве
	 */
	var initControl = function(context, id, module, options, hierarchyType) {
		hierarchyType = hierarchyType || '';
		var self = context;
		var hierarchyTypeString = hierarchyType.split('::').join('-');
		var controlOptions = {
			idPrefix: '',
			treeURL: '/styles/skins/modern/design/js/common/parents.html',
			inputWidth: '100%',
			popupTitle: getLabel('js-choose-category')
		};

		var construct = function() {
			var userOptions = $.extend(options, controlOptions);
			self.symlinkControl = new symlinkControl(id, module, hierarchyTypeString, userOptions, hierarchyType);
			self.id = id;
			self.container = self.symlinkControl.container;
			self.itemsContainer = $('.items-list', self.container).get(0);
			$('li i', self.itemsContainer).each(function() {
				var deleteIcon = $(this);
				var page = deleteIcon.parent();
				var pageId = page.attr('umi:id');
				bindDeletePage(deleteIcon, pageId, page);
			});
		};

		construct();
	};

	/**
	 * Возвращает ID текущей страницы
	 * @returns {*}
	 */
	var getCurrentId = function() {
		return (uAdmin.data && uAdmin.data.page ? uAdmin.data.page.id : window.page_id);
	};

	/**
	 * Создает элемент со ссылками на родительские страницы (хлебные крошки)
	 * @param {JSON} data исходные данные страницы
	 * @returns {Element}
	 */
	var createPathLinks = function(data) {
		var parentsList = data.parents.item;
		var parent;
		var linksContainer = document.createElement('span');
		linksContainer.className = 'paths';

		for (var i in parentsList) {
			if (!parentsList.hasOwnProperty(i)) {
				continue;
			}

			parent = parentsList[i];
			linksContainer.appendChild(createParentLink(parent));
		}

		linksContainer.appendChild(createPathElement(data));
		return linksContainer;
	};

	/**
	 * Создает ссылку на родительскую страницу
	 * @param {JSON} data исходные данные родительской страницы
	 * @returns {Element}
	 */
	var createParentLink = function createParentLink(data) {
		var link = document.createElement('a');

		link.href = "/admin/" + data.module + "/" + data.method + "/";
		link.className = "tree_link";
		link.target = "_blank";
		link.title = data.url;
		link.appendChild(document.createTextNode(data.name));

		$(link).on('click', function() {
			return treeLink(data.settingsKey, data.treeLink);
		});

		return link;
	};

	/**
	 * Создает текстовый элемент, содержащий название страницы
	 * @param {JSON} data исходные данные страницы
	 * @returns {Element}
	 */
	var createPathElement = function(data) {
		var pathElement = document.createElement('span');
		pathElement.title = data.url;
		pathElement.appendChild(document.createTextNode(data.name));
		return pathElement;
	};

	/**
	 * Перемещает страницу в другой раздел
	 * @param {Number} parentId ID нового родителя
	 * @param {Function} callback вызывается при успешном перемещении
	 * @param {Number} element ID перемещаемой страницы
	 * @param {Boolean} toEnd переносить ли страницу в конец списка
	 */
	var moveItem = function(parentId, callback, element, toEnd) {
		var elementId = element || getCurrentId(),
			selectedList = (Control.HandleItem !== null) ? Control.HandleItem.control.selectedList : [],
			data;
		callback = typeof callback == 'function' ? callback : function() {
		};

		if (!elementId || !parentId || elementId == parentId) {
			return;
		}

		var isMoveToEnd = toEnd ? 1 : 0;

		data = {
			element: elementId,
			rel: parentId,
			return_copies: true,
			to_end: isMoveToEnd
		};

		if (_.keys(selectedList).length > 0) {
			data['selected_list'] = [];
			_.each(selectedList, function(item) {
				data['selected_list'].push(item.id);
			});
		}

		$.ajax({
			url: "/admin/content/tree_move_element.json",
			type: "get",
			dataType: "json",
			data: data,
			success: function(response) {
				callback(response);
			}
		});
	};

	/**
	 * Контрол для осуществления перемещения элементов
	 * @param {String} id идентификатор контейнера
	 * @param {String} module целевой модуль
	 * @param {Object} options опции контрола
	 * @param {String} hierarchyType строка вида: 'Модуль::Метод',
	 * обозначающая тип выводимых объектов в дереве
	 * @constructor
	 */
	function ElementMovingControl(id, module, options, hierarchyType) {
		initControl(this, id, module, options, hierarchyType);
	}

	/**
	 * Перемещает элемент в другой раздел
	 * @param {Number} parentId ID нового раздела
	 * @param {Boolean} toEnd переносить ли страницу в конец списка
	 */
	ElementMovingControl.prototype.moveItem = function(parentId, toEnd) {
		var self = this;
		var isMoveToEnd = toEnd ? 1 : 0;

		moveItem(parentId, function(response) {
			if (!response.data || !response.data.page) {
				return;
			}

			var movedElementData = response.data.page.copies.copy[0];
			var pathElement = createPathLinks(movedElementData);
			var listElement = $('li', self.itemsContainer).eq(0);
			listElement.html('');
			listElement.append(pathElement);
		}, null, isMoveToEnd);
	};

	/**
	 * Возвращает идентификатор контрола
	 * @returns {*}
	 */
	ElementMovingControl.prototype.getId = CopyCreatingControl.prototype.getId = function() {
		return this.id;
	};

	/**
	 * Контрол для создания виртуальных копий
	 * @param {String} id идентификатор контейнера
	 * @param {String} module целевой модуль
	 * @param {Object} options опции контрола
	 * @param {String} hierarchyType строка вида: 'Модуль::Метод',
	 * обозначающая тип выводимых объектов в дереве
	 * @constructor
	 */
	function CopyCreatingControl(id, module, options, hierarchyType) {
		initControl(this, id, module, options, hierarchyType);
	}

	/**
	 * Создает виртуальную копию страницы в разделе с ID = parentId
	 * @param {Number} parentId ID раздела, в котором будет создана виртуальная копия
	 */
	CopyCreatingControl.prototype.addCopy = function(parentId) {
		var elementId = getCurrentId();
		var self = this;

		if (!elementId || !parentId || elementId == parentId) {
			return;
		}

		$.ajax({
			url: "/admin/content/tree_copy_element.json",
			type: "get",
			dataType: "json",
			data: {
				element: elementId,
				rel: parentId,
				copyAll: 1,
				return_copies: 1,
				clone_mode: 0
			},
			success: function(response) {
				if (!response.data || !response.data.page) {
					return;
				}

				var copyData = response.data.page.copies.copy[0];
				var pathElement = createPathLinks(copyData);

				var deleteIcon = $(document.createElement('i'));
				deleteIcon.attr('class', 'small-ico i-remove virtual-copy-delete');

				var listElement = $(document.createElement('li'));
				listElement.attr('umi:id', copyData.id);

				bindDeletePage(deleteIcon, copyData.id, listElement);

				if (copyData.basetype) {
					listElement.attr('umi:module', copyData.basetype.module);
					listElement.attr('umi:method', copyData.basetype.method);
				}

				listElement.append(deleteIcon);
				listElement.append(pathElement);
				$(self.itemsContainer).append(listElement);
			}
		});
	};

	/** @var [] controlsList хранит список добавленных контролов**/
	var controlsList = [];

	/**
	 * Устанавливает обработчик клика кнопки, который
	 * удаляет заданную страницу
	 * @param {Object} button jquery объект, которому назначается обработчик
	 * @param {String} pageId идентификатор удаляемой страницы
	 * @param {Object} page jquery объект, который нужно удалить вместе со страницей
	 */
	function bindDeletePage(button, pageId, page) {
		button.on("click", function() {
			$.ajax({
				url: "/admin/content/tree_delete_element.xml?csrf=" + csrfProtection.getToken(),
				type: "get",
				dataType: "xml",
				data: {
					element: pageId,
					childs: 1,
					allow: true
				},
				context: this,
				success: function() {
					page.remove();
				}
			});
		});
	}

	/**
	 * Возвращает контрол по его идентификатору
	 * @param {String} id идентификатор контрола
	 * @returns {*}
	 */
	function getControl(id) {
		return controlsList[id];
	}

	/**
	 * Добавляет контрол в список
	 * @param {Object} control объект контрола
	 * @returns {*}
	 */
	function addControl(control) {
		return controlsList[control.getId()] = control;
	}

	/**
	 * Открывает окно с выбором категорий
	 * @param {TableItem|TreeItem} handleItem выбранный элемент, для которого нужно произвести
	 * какие-либо действия
	 */
	function openCategoriesWindow(handleItem) {
		var popupName = 'SiteTree';
		var popupTitle = getLabel('js-choose-category');
		var treeBaseURL = '/styles/skins/modern/design/js/common/parents.html';
		var module = 'catalog';
		var typeString = '&hierarchy_types=catalog-category';
		var rootId = '';

		jQuery.openPopupLayer({
			name: popupName,
			title: popupTitle,
			width: '100%',
			height: 335,
			url: treeBaseURL + "?id=" + (handleItem.id) + (module ? "&module=" + module : "") +
				'&name=' + popupName +
				typeString + (window.lang_id ? "&lang_id=" + window.lang_id : "") +
				(rootId ? "&root_id=" + rootId : "") + '&mode=tree'
		});
	}

	/**
	 * Возвращает реализацию функций тулбара табличного контрола списка торговых предложений
	 * @return {Object}
	 */
	var getTradeOfferListToolBarFunctions = function() {
		return {
			add: {
				name: 'add',
				className: 'i-add',
				hint: getLabel('js-add'),
				init: function(button) {
					var TableControl = dc_application;
					var toolBar = TableControl.getToolBar();

					if (TableControl.hasSelectedRows()) {
						return toolBar.disableButtons(button);
					}

					toolBar.enableButtons(button);
				},
				release: function() {
					requestAddTradeOffer();
					return false;
				}
			},
			copy: {
				name: 'copy',
				className: 'i-copy',
				hint: getLabel('js-copy'),
				init: function(button) {
					var TableControl = dc_application;
					var toolBar = TableControl.getToolBar();

					if (!TableControl.isOneRowSelected()) {
						return toolBar.disableButtons(button);
					}

					toolBar.enableButtons(button);
				},
				release: function() {
					requestCopyTradeOffer();
					return false;
				}
			},
			activate: {
				name: 'activate',
				className: 'i-vision',
				hint: getLabel('js-activate'),
				init: function(button) {
					var TableControl = dc_application;
					var toolBar = TableControl.getToolBar();

					if (!TableControl.hasSelectedRows()) {
						return toolBar.disableButtons(button);
					}

					var className = 'i-vision';
					var hint = getLabel('js-activate');

					if (TableControl.getFirstSelectedRow().attributes.is_active) {
						className = 'i-hidden';
						hint = getLabel('js-deactivate');
					}

					button.className = className;
					button.hint = hint;
					toolBar.renderButton(button);
					toolBar.enableButtons(button);
				},
				release: function() {
					requestChangeTradeOfferListActivity();
					return false;
				}
			},
			remove: {
				name: 'delete',
				className: 'i-remove',
				hint: getLabel('js-remove'),
				init: function(button) {
					var TableControl = dc_application;
					var toolBar = TableControl.getToolBar();

					if (!TableControl.hasSelectedRows()) {
						return toolBar.disableButtons(button);
					}

					toolBar.enableButtons(button);
				},
				release: function() {
					requestDeleteTradeOfferList();
					return false;
				}
			}
		};
	};

	/** Запрашивает добавление торгового предложения */
	var requestAddTradeOffer = function() {
		var requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_ADD_TRADE_OFFER_METHOD),
			dataType: 'json',
			data: {
				object_id: getProductObjectId(),
				field_name: getTradeOfferFieldName()
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			dc_application.refresh();
		}, false);
	};

	/**
     * Возвращает идентификатор объекта товара
	 * @returns {Number}
	 */
	var getProductObjectId = function() {
	    return window.object_id;
    };

	/**
     * Возвращает имя поля объекта товара со списком торговых предложений
	 * @returns {String}
	 */
	var getTradeOfferFieldName = function() {
		return dc_application.config.attributes.param;
    };

	/** Запрашивает копирование торгового предложения */
	var requestCopyTradeOffer = function() {
		var TableControl = dc_application;
		var requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_COPY_TRADE_OFFER_METHOD),
			dataType: 'json',
			data: {
				offer_id: TableControl.getFirstSelectedId(),
				object_id: getProductObjectId(),
				field_name: getTradeOfferFieldName()
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			TableControl.refresh();
		}, false);
	};

	/** Запрашивает удаление выбранных торговых предложений */
	var requestDeleteTradeOfferList = function() {
		var TableControl = dc_application;
		var requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_DELETE_TRADE_OFFER_LIST_METHOD),
			dataType: 'json',
			data: {
				offer_id_list: TableControl.getSelectedIdList()
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			TableControl.refresh();
		}, false);
	};

	/** Запрашивает изменение статуса активности выбранных торговых предложений **/
	var requestChangeTradeOfferListActivity = function() {
		var TableControl = dc_application;
		var requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_CHANGE_ACTIVITY_TRADE_OFFER_LIST_METHOD),
			dataType: 'json',
			data: {
				offer_id_list: TableControl.getSelectedIdList(),
				is_active: Number(!TableControl.getFirstSelectedRow().attributes.is_active)
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			TableControl.refresh();
		}, false);
	};

	/**
	 * Возвращает список названий кнопок для формирования меню тулбара табличного контрола списка торговых предложений
	 * @returns {String[]}
	 */
	var getTradeOfferListToolBarMenu = function() {
		return ['add', 'copy', 'activate', 'remove'];
	};

	/**
	 * Валидирует операцию перетаскивания в табличном контроле списка торговых предложений
	 * @param {umiDataTableRow} target элемент, относительно которого выполняется перетаскивание
	 * @param {umiDataTableRow} dragged перетаскиваемый элемент
	 * @param {String} mode режим перетаскивания (after/before/child)
	 * @returns {String|boolean}
	 */
	var getDragAndDropValidator = function(target, dragged, mode) {

		if (mode === 'child') {
			return false;
		}

		return mode;
	};

	/**
	 * Возвращает реализацию функций тулбара табличного контрола списка типов цен торговых предложений
	 * @return {Object}
	 */
	var getTradeOfferPriceTypeListToolBarFunction = function() {
		return {
			add: {
				name: 'add',
				className: 'i-add',
				hint: getLabel('js-add'),
				init: function(button) {
					var TableControl = dc_application;
					var toolBar = TableControl.getToolBar();

					if (TableControl.hasSelectedRows()) {
						return toolBar.disableButtons(button);
					}

					toolBar.enableButtons(button);
				},
				release: function() {
					requestAddTradeOfferPriceType();
					return false;
				}
			},
			remove: {
				name: 'delete',
				className: 'i-remove',
				hint: getLabel('js-remove'),
				init: function(button) {
					var TableControl = dc_application;
					var toolBar = dc_application.getToolBar();

					if (!TableControl.hasSelectedRows()) {
						return toolBar.disableButtons(button);
					}

					toolBar.enableButtons(button);
				},
				release: function() {
					requestDeleteTradeOfferPriceTypeList();
					return false;
				}
			}
		};
	};

	/**
	 * Возвращает список названий кнопок для формирования меню тулбара табличного контрола списка типов цен торговых предложений
	 * @returns {String[]}
	 */
	var getTradeOfferPriceTypeListToolBarMenu = function() {
		return ['add', 'remove'];
	};

	/** Запрашивает добавление типа цены торгового предложения */
	var requestAddTradeOfferPriceType = function() {
		var requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_ADD_TRADE_OFFER_PRICE_TYPE_METHOD),
			dataType: 'json'
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			dc_application.refresh();
		}, false);
	};

	/** Запрашивает удаление выбранных типов цен торговых предложений */
	var requestDeleteTradeOfferPriceTypeList = function() {
		var TableControl = dc_application;
		var requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_DELETE_TRADE_OFFER_PRICE_TYPE_LIST_METHOD),
			dataType: 'json',
			data: {
				price_type_id_list: TableControl.getSelectedIdList()
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			dc_application.refresh();
		}, false);
	};

	return {
		ElementMovingControl: ElementMovingControl,
		CopyCreatingControl: CopyCreatingControl,
		getControl: getControl,
		addControl: addControl,
		openCategoriesWindow: openCategoriesWindow,
		moveItem: moveItem,
		getTradeOfferListToolBarFunctions: getTradeOfferListToolBarFunctions,
		getTradeOfferListToolBarMenu: getTradeOfferListToolBarMenu,
		getDragAndDropValidator: getDragAndDropValidator,
		getTradeOfferPriceTypeListToolBarFunction: getTradeOfferPriceTypeListToolBarFunction,
		getTradeOfferPriceTypeListToolBarMenu: getTradeOfferPriceTypeListToolBarMenu
	};

})(jQuery, _);

