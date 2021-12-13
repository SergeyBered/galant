/**
 * Класс заглушки элемента контрола
 * @constructor
 */
var NullItem = function() {
	this.draw = function() {};
	this.expand = function() {};
};
/**
 * Filter
 * Класс содержит параметры отбора сущностей dataSet-ом
 */
function filter() {
	/** Параметры */
	this.AllText = [];
	this.Props = {};
	this.EntIDs = [];
	this.Parents = [];
	this.Langs = [];
	this.Domains = [];
	this.Orders = {};
	this.Perms = true;
	this.Full = true;
	this.FldsOr = false;
	this.Depth = null;
	this.CheckVirtual = true;
	this.Page = null;
	this.Limit = null;
	this.hTypes = [];
	this.oTypes = [];
	/** @param _Value */
	this.setAllTextSearch = function(_Value) {
		if (_Value instanceof Array) {
			if (this.AllText.join() == _Value.join()) {
				return;
			}
			if (this.AllText.length) {
				this.AllText = this.AllText.concat(_Value);
			} else {
				this.AllText = _Value;
			}
		} else {
			this.AllText.push(_Value);
		}
	};

	/**
	 * Возвращает значение полнотекстового поиска
	 * @returns {Array}
	 */
	this.getAllTextSearch = function() {
		return this.AllText;
	};

	this.setHTypes = function(_hTypes) {
		if (_hTypes instanceof Array) {
			this.hTypes = _hTypes;
		} else {
			this.hTypes.push(_hTypes);
		}
	};

	/**
	 * Устанавливает проверку свойства объекта/элемента на равентство
	 * @param _PropName имя проверяемого свойства
	 * @param _Value    значение для проверки
	 */
	this.setPropertyEqual = function(_PropName, _Value) {
		if (this.Props[_PropName] == undefined) {
			this.Props[_PropName] = {};
		}
		this.Props[_PropName]['eq'] = _Value;
	};
	/**
	 * Устанавливает проверку свойства объекта/элемента на не равентство
	 * @param _PropName имя проверяемого свойства
	 * @param _Value    значение для проверки
	 */
	this.setPropertyNotEqual = function(_PropName, _Value) {
		if (this.Props[_PropName] == undefined) {
			this.Props[_PropName] = {};
		}
		this.Props[_PropName]['ne'] = _Value;
	};
	/**
	 * Устанавливает проверку свойства объекта/элемента на включение искомой строки
	 * @param _PropName имя проверяемого свойства
	 * @param _Value    искомая строка
	 */
	this.setPropertyLike = function(_PropName, _Value) {
		if (this.Props[_PropName] == undefined) {
			this.Props[_PropName] = {};
		}
		this.Props[_PropName]['like'] = _Value;
	};
	/**
	 * Устанавливает проверку свойства объекта/элемента на "меньше"
	 * @param _PropName имя проверяемого свойства
	 * @param _Value    значение для проверки
	 */
	this.setPropertyLess = function(_PropName, _Value) {
		if (this.Props[_PropName] == undefined) {
			this.Props[_PropName] = {};
		}
		this.Props[_PropName]['lt'] = _Value;
	};
	/**
	 * Устанавливает проверку свойства объекта/элемента на "больше"
	 * @param _PropName имя проверяемого свойства
	 * @param _Value    значение для проверки
	 */
	this.setPropertyGreater = function(_PropName, _Value) {
		if (this.Props[_PropName] == undefined) {
			this.Props[_PropName] = {};
		}
		this.Props[_PropName]['gt'] = _Value;
	};
	/**
	 * Устанавливает проверку свойства объекта/элемента на попадание в интервал
	 * @param _PropName имя проверяемого свойства
	 * @param _Floor    нижняя граница интервала
	 * @param _Ceil     верхняя граница интервала
	 */
	this.setPropertyBetween = function(_PropName, _Floor, _Ceil) {
		if (this.Props[_PropName] == undefined) {
			this.Props[_PropName] = {};
		}
		this.Props[_PropName]['gt'] = _Floor;
		this.Props[_PropName]['lt'] = _Ceil;
	};
	/**
	 * Удаляет условие на какое-то поле
	 * @param _PropName имя свойства
	 */
	this.removeProperty = function(_PropName) {
		this.Props[_PropName] = undefined;
	};
	/**
	 * Добавляет сортировку по определенному свойству
	 * @param _PropName  имя свойства
	 * @param _Direction направление сортировки ('forward'/'asc'/true - в прямом порядке, 'backward'/'desc'/false - в обратном)
	 */
	this.addOrder = function(_PropName, _Direction) {
		var _Asc = true;
		if (_Direction != undefined &&
			(_Direction === false ||
				_Direction.toUpperCase() == 'DESC' ||
				_Direction.toUpperCase() == 'BACKWARD')) {
			_Asc = false;
		}
		this.Orders[_PropName] = _Asc;
	};
	/**
	 * Устанавливает сортировку по определенному свойству (сбрасывая существующие)
	 * @param _PropName  имя свойства
	 * @param _Direction направление сортировки ('forward'/'asc'/true - в прямом порядке, 'backward'/'desc'/false - в обратном)
	 */
	this.setOrder = function(_PropName, _Direction) {
		var _Asc = true;
		if (_Direction != undefined &&
			(_Direction === false ||
				_Direction.toUpperCase() == 'DESC' ||
				_Direction.toUpperCase() == 'BACKWARD')) {
			_Asc = false;
		}
		this.Orders = {};
		this.Orders[_PropName] = _Asc;
	};
	/** Устанавливает филтрацию по правам */
	this.setPermissions = function(_Use) {
		if (_Use == undefined) {
			this.Perms = true;
		} else {
			this.Perms = _Use ? true : false;
		}
	};
	/**
	 * Устанавливает id возможных родителей родителей
	 * @param _ParentElements одиночное значение или массив
	 */
	this.setParentElements = function(_ParentElements) {
		if (_ParentElements instanceof Array) {
			this.Parents = _ParentElements;
		} else {
			this.Parents.push(_ParentElements);
		}
	};
	/**
	 * Устанавливает глубину выборки
	 * @param _iDepth глубина
	 */
	this.setDepth = function(_iDepth) {
		if (typeof(_iDepth) !== 'undefined') {
			this.Depth = parseInt(_iDepth);
		}
	};
	/**
	 * Устанавливает возможные id сущностей
	 * @param _ParentElements одиночное значение или массив
	 */
	this.setEntityIDs = function(_aIDs) {
		if (_aIDs instanceof Array) {
			this.EntIDs = _aIDs;
		} else {
			this.EntIDs.push(_aIDs);
		}
	};
	/**
	 * Устанавливает ограничение на просматриваемые домены
	 * @param _Domain id домена, из которого выбираем элементы, или массив из id
	 */
	this.setDomain = function(_Domain) {
		if (_Domain instanceof Array) {
			this.Domains = _Domain;
		} else {
			this.Domains.push(_Domain);
		}
	};
	/**
	 * Устанавливает ограничение на просматриваемые языковые версии
	 * @param _Domain id языка, из которого выбираем элементы, или массив из id
	 */
	this.setLang = function(_Lang) {
		if (_Lang instanceof Array) {
			this.Langs = _Lang;
		} else {
			this.Langs.push(_Lang);
		}
	};
	/**
	 * Устанавливает возможные типы страниц
	 * @param _hTypes
	 */
	this.setHtypes = function(_hTypes) {
		if (_hTypes instanceof Array) {
			this.hTypes = _hTypes;
		} else {
			this.hTypes.push(_hTypes);
		}
	};
	/**
	 * Устанавливает возможные типы объектов
	 * @param _oTypes
	 */
	this.setOtypes = function(_oTypes) {
		if (_oTypes instanceof Array) {
			this.oTypes = _oTypes;
		} else {
			this.oTypes.push(_oTypes);
		}
	};
	/** Устанавливает проверку на виртуальную копию */
	this.setVirtualCopyChecking = function(_Check) {
		if (typeof(_Check) == 'undefined') {
			this.CheckVirtual = true;
		} else {
			this.CheckVirtual = _Check ? true : false;
		}
	};
	
	this.setViewMode = function(_Full) {
		if (typeof(_Full) == 'undefined') {
			this.Full = true;
		} else {
			this.Full = _Full ? true : false;
		}
	};
	
	this.setConditionModeOr = function(_Or) {
		if (typeof(_Or) == 'undefined') {
			this.FldsOr = true;
		} else {
			this.FldsOr = _Or ? true : false;
		}
	};
	/**
	 * Возвращает массив родителей
	 * @return Array массив родителей
	 */
	this.getParents = function() {
		return this.Parents;
	};
	
	this.setPage = function(_Page) {
		this.Page = parseInt(_Page);
	};
	
	this.getPage = function() {
		return this.Page;
	};
	
	this.setLimit = function(_Limit) {
		this.Limit = parseInt(_Limit);
	};
	
	this.getLimit = function() {
		return this.Limit;
	};
	/**
	 * Возвращает сформированную по параметрам строку запроса
	 * @return строка запроса
	 */
	this.getQueryString = function(_MergeFilter) {
		var QueryPieces = [];
		var i = 0;
		if (_MergeFilter instanceof Object) {
			var o = {};

			for (i in _MergeFilter.Props) {
				o[i] = _MergeFilter.Props[i];
			}

			for (i in this.Props) {
				o[i] = this.Props[i];
			}

			for (i in o) {
				for (var j in o[i]) {
					if (o[i][j] instanceof Array) {
						for (var k = 0; k < o[i][j].length; k++) {
							QueryPieces.push('fields_filter[' + i + '][' + j + '][]=' + encodeURIComponent(o[i][j][k]));
						}
					} else {
						QueryPieces.push('fields_filter[' + i + '][' + j + ']=' + encodeURIComponent(o[i][j]));
					}
				}
			}

			for (i = 0; i < this.AllText.length; i++) {
				QueryPieces.push('search-all-text[]=' + encodeURIComponent(this.AllText[i]));
			}
			for (i = 0; i < _MergeFilter.AllText.length; i++) {
				QueryPieces.push('search-all-text[]=' + encodeURIComponent(_MergeFilter.AllText[i]));
			}

			if (QueryPieces.length) {
				jQuery('#search_result').addClass('active');
				jQuery('#search_result').html(getLabel('js-search-result'));
			} else {
				if (!this.Parents.length && !_MergeFilter.Parents.length) {
					jQuery('#search_result').html('');
					jQuery('#search_result').removeClass('active');
				}
			}

			for (i = 0; i < this.EntIDs.length; i++) {
				QueryPieces.push('id[]=' + this.EntIDs[i]);
			}
			for (i = 0; i < _MergeFilter.EntIDs.length; i++) {
				QueryPieces.push('id[]=' + _MergeFilter.EntIDs[i]);
			}
			for (i = 0; i < this.Parents.length; i++) {
				QueryPieces.push('rel[]=' + this.Parents[i]);
			}
			for (i = 0; i < _MergeFilter.Parents.length; i++) {
				QueryPieces.push('rel[]=' + _MergeFilter.Parents[i]);
			}
			for (i = 0; i < this.hTypes.length; i++) {
				QueryPieces.push('hierarchy_types[]=' + this.hTypes[i]);
			}
			for (i = 0; i < this.Domains.length; i++) {
				QueryPieces.push('domain_id[]=' + this.Domains[i]);
			}
			for (i = 0; i < _MergeFilter.Domains.length; i++) {
				QueryPieces.push('domain_id[]=' + _MergeFilter.Domains[i]);
			}
			for (i = 0; i < this.Langs.length; i++) {
				QueryPieces.push('lang_id[]=' + this.Langs[i]);
			}
			for (i = 0; i < _MergeFilter.Langs.length; i++) {
				QueryPieces.push('lang_id[]=' + _MergeFilter.Langs[i]);
			}
			for (i = 0; i < _MergeFilter.oTypes.length; i++) {
				QueryPieces.push('object_type[]=' + _MergeFilter.oTypes[i]);
			}
			o = {};
			for (i in _MergeFilter.Orders) {
				o[i] = _MergeFilter.Orders[i];
			}
			for (i in this.Orders) {
				o[i] = this.Orders[i];
			}
			for (i in o) {
				QueryPieces.push('order_filter[' + i + ']=' + (o[i] ? 'asc' : 'desc'));
			}

			if (this.Perms !== null) {
				if (this.Perms) {
					QueryPieces.push('permissions');
				} else if (_MergeFilter.Perms) {
					QueryPieces.push('permissions');
				}
			}

			if (this.CheckVirtual !== null) {
				if (this.CheckVirtual) {
					QueryPieces.push('virtuals');
				} else if (_MergeFilter.CheckVirtual) {
					QueryPieces.push('virtuals');
				}
			}

			if (this.Depth !== null) {
				QueryPieces.push('depth=' + this.Depth);
			} else if (_MergeFilter.Depth !== null) {
				QueryPieces.push('depth=' + _MergeFilter.Depth);
			}

			if (this.Page !== null) {
				QueryPieces.push('p=' + this.Page);
			} else if (_MergeFilter.Page !== null) {
				QueryPieces.push('p=' + _MergeFilter.Page);
			}

			if (this.Limit !== null) {
				QueryPieces.push('per_page_limit=' + this.Limit);
			} else if (_MergeFilter.Limit !== null) {
				QueryPieces.push('per_page_limit=' + _MergeFilter.Limit);
			}

			if (this.FldsOr || _MergeFilter.FldsOd) {
				QueryPieces.push('or-mode');
			}

			if (this.Full || _MergeFilter.Full) {
				QueryPieces.push('viewMode=full');
			} // ToDo: Epic WTF, think about it

		} else {
			for (i in this.Props) {
				for (var j in this.Props[i]) {
					if (this.Props[i][j] instanceof Array) {
						for (var k = 0; k < this.Props[i][j].length; k++) {
							QueryPieces.push('fields_filter[' + i + '][' + j + '][]=' + encodeURIComponent(this.Props[i][j][k]));
						}
					} else {
						QueryPieces.push('fields_filter[' + i + '][' + j + ']=' + encodeURIComponent(this.Props[i][j]));
					}
				}
			}
			for (i = 0; i < this.AllText.length; i++) {
				QueryPieces.push('search-all-text[]=' + encodeURIComponent(this.AllText[i]));
			}
			for (i = 0; i < this.EntIDs.length; i++) {
				QueryPieces.push('id[]=' + this.EntIDs[i]);
			}
			for (i = 0; i < this.Parents.length; i++) {
				QueryPieces.push('rel[]=' + this.Parents[i]);
			}
			for (i = 0; i < this.Domains.length; i++) {
				QueryPieces.push('domain_id[]=' + this.Domains[i]);
			}
			for (i = 0; i < this.Langs.length; i++) {
				QueryPieces.push('lang_id[]=' + this.Langs[i]);
			}
			for (i in this.Orders) {
				QueryPieces.push('order_filter[' + i + ']=' + (this.Orders[i] ? 'asc' : 'desc'));
			}

			if (this.Perms) {
				QueryPieces.push('permissions');
			}

			if (this.CheckVirtual) {
				QueryPieces.push('virtuals');
			}

			if (this.Depth !== null) {
				QueryPieces.push('depth=' + this.Depth);
			}

			if (this.Page !== null) {
				QueryPieces.push('p=' + this.Page);
			}

			if (this.Limit !== null) {
				QueryPieces.push('per_page_limit=' + this.Limit);
			}

			if (this.FldsOr) {
				QueryPieces.push('or-mode');
			}

			if (this.Full) {
				QueryPieces.push('viewMode=full');
			}  // ToDo: Epic WTF, think about it
		}

		QueryPieces.push('childs');
		QueryPieces.push('links');
		//QueryPieces.push('virtuals');
		QueryPieces.push('templates');

		return '?' + QueryPieces.join('&');
	};
	/** Сбрасывает все установки */
	this.clear = function() {
		this.AllText = [];
		this.Props = {};
		this.EntIDs = [];
		this.Parents = [];
		this.Langs = [];
		this.Domains = [];
		this.Orders = {};
		this.Perms = true;
		this.Depth = null;
		this.Page = null;
		this.Limit = null;
		this.Full = true;
		this.FldsOr = false;
		this.CheckVirtual = null;
	};
	/** Проверяет, был ли фильтр изменен */
	this.empty = function() {
		var propsCount = 0;
		var ordersCount = 0;
		for (var i in this.Props) {
			propsCount++;
			if (propsCount) {
				break;
			}
		}

		for (var i in this.Orders) {
			ordersCount++;
			if (ordersCount) {
				break;
			}
		}

		return !this.AllText.length && !this.EntIDs.length && !this.Parents.length && !this.Langs.length && !this.Domains.length &&
			!propsCount && !ordersCount && this.Perms && this.Full && !this.Depth && !this.Page && !this.FldsOr && !this.CheckVirtual;
	};
	
	var cloneObject = function(o) {
		if (!o || 'object' !== typeof o) {
			return o;
		}
		var c = 'function' === typeof o.pop ? [] : {};
		var p, v;
		for (p in o) {
			if (o.hasOwnProperty(p)) {
				v = o[p];
				if (v && 'object' === typeof v) {
					c[p] = cloneObject(v);
				} else {
					c[p] = v;
				}
			}
		}
		return c;
	};
	/** Создает копию фильтра */
	this.clone = function() {
		return cloneObject(this);
	};
}

/**
 * TableItem
 * Класс осуществляет визуализацию строки таблицы
 * @param {Control} _oControl - экземпляр класса Control
 * @param {TableItem} _oParent - экземпляр класса TableItem, указывающий на прямого предка элемента
 * @param {Object} _oData - информация о элементе
 * @param {TableItem} _oSiblingItem - экземпляр класса TableItem, указывающий на соседа элемента
 * @param {String} _sInsertMode - режим добавление элемента по отношению к соседу _oSiblingItem. Может быть "after" и "before"
 */
var TableItem = function(_oControl, _oParent, _oData, _oSiblingItem, _sInsertMode) {

	/** @type {Number} Идентификатор элемента */
	var _id = parseInt(_oData.id);

	/** @type {Number} Идентификатор объекта страницы */
	var _objectId = parseInt(_oData['object-id']);

	var _self = this;

	/** @type {Object} Источник данных элемента */
	var _data = _oData;

	/** @type {TableItem} Родительский элемент */
	var _parent = _oParent;

	/** @type {TableItem|null} Соседний элемент */
	var _sibling = _oSiblingItem || null;

	/** @type {String} Режим вставки */
	var _insertMode = _sInsertMode || 'after';

	var _forceDrawing = typeof(_oData['force-draw']) !== 'undefined' ? parseInt(_oData['force-draw']) : 1;

	/** @type {Number} Количество дочерних элементов */
	var _childrenCount = typeof(_oData['childs']) !== 'undefined' ? parseInt(_oData['childs']) : 0;

	/** @type {String} Название модуля базового типа данных элемента */
	var _baseModule = (_oData['basetype'] && typeof(_oData['basetype']['module']) === 'string') ? _oData['basetype']['module'] : 'content';

	/** @type {String} Название метода базового типа данных элемента */
	var _baseMethod = (_oData['basetype'] && typeof(_oData['basetype']['method']) === 'string') ? _oData['basetype']['method'] : '';

	/** @type {String} Название базового типа данных элемента */
	var _typeName = (_oData['basetype'] && typeof(_oData['basetype']['_value']) === 'string') ? _oData['basetype']['_value'] : '';

	var _iconsPath = _oControl.iconsPath;

	var _iconSrc = typeof(_oData['iconbase']) !== 'undefined' ? _oData['iconbase'] : _iconsPath + 'ico_' + _baseModule + '_' + _baseMethod + '.png';

	// Контрол сворачивания/разворачивания
	var _toggleControl = null;

	// Контрол поля заголовка
	var _labelControl = null;

	// Заголовок текст
	var _labelText = null;

	// Иконка элемента заголовка
	var _itemIcon = null;

	/** @type {SettingsStore} объект для сохранения пользовательских настроек */
	var _settings = SettingsStore.getInstance();

	// Вроде как разрешение на авто разворачивание элементов дерева
	var _isAutoExpandAllowed = true;

	// старый класс для селекта строки
	var _oldClassName = null;

	// атрибут селекта строки
	var _selected = false;

	// отключение режима дерева
	var _flatMode = _oControl.flatMode;

	var _objectTypesMode = _oControl.objectTypesMode;

	var _pagesBar = null;

	// Строка с фильтрами
	var _filterRow = null;

	var _activeColumn = null;

	/** @var {Boolean} Нужно ли выводить чекбоксы для элементов */
	var _hasCheckbox = typeof _oControl.hasCheckboxes == 'boolean' ? _oControl.hasCheckboxes : true;

	this.checkBox = null;

	// Строка таблицы которую мы сейчас креайтим
	this.element = null;

	// Ссылка на общий объект контроллер Control
	this.control = _oControl;

	// Контейнер для дочернего элемента дерева
	this.childsContainer = null;

	// Поле ид объекта данных
	this.id = _id;

	// Поле ид объекта страницы
	this.objectId = _objectId;

	// поле name объекта данных
	this.name = typeof(_oData['name']) !== 'undefined' ? _oData['name'] : getLabel('js-smc-noname-page');

	// Индикатор корневой объект или нет
	this.isRoot = _parent ? false : true;

	// Атрибут загруженности данных
	this.loaded = false;

	// Ссылка на просмотр страницы|объекта
	this.viewLink = typeof(_oData['link']) !== 'undefined' ? _oData['link'] : false;

	// Ссылка на форму редактирования страницы|объекта
	this.editLink = typeof(_oData['edit-link']) !== 'undefined' ? _oData['edit-link'] : false;

	// Ссылка на форму создания страницы|объекта
	this.createLink = typeof(_oData['create-link']) !== 'undefined' ? _oData['create-link'] : false;

	this.permissions = typeof(_oData['permissions']) !== 'undefined' ? parseInt(_oData['permissions']) : 0;

	this.isActive = typeof(_oData['is-active']) !== 'undefined' ? parseInt(_oData['is-active']) : 0;

	if (_objectTypesMode) {
		this.isActive = true;
	}

	//Атрибут виртуальной копии
	this.isVirtualCopy = typeof(_oData['has-virtual-copy']) !== 'undefined';

	this.isOriginal = typeof(_oData['is-original']) !== 'undefined';

	// Атрибут блокировки
	this.lockedBy = typeof(_oData['locked-by']) === 'object' ? _oData['locked-by'] : null;

	this.expiration = typeof(_oData['expiration']) === 'object' ? _oData['expiration'] : null;

	// ИД шаблона
	this.templateId = typeof(_oData['template-id']) !== 'undefined' ? _oData['template-id'] : null;

	// ИД языка
	this.langId = typeof(_oData['lang-id']) !== 'undefined' ? _oData['lang-id'] : null;

	// Ид домена
	this.domainId = typeof(_oData['domain-id']) !== 'undefined' ? _oData['domain-id'] : null;

	// Поддержка копирования
	this.allowCopy = typeof(_oData['allow-copy']) !== 'undefined' ? parseInt(_oData['allow-copy']) : true;

	// Поддержка управления активностью
	this.allowActivity = typeof(_oData['allow-activity']) !== 'undefined' ? parseInt(_oData['allow-activity']) : true;

	// Поддержка перетаскивания
	this.allowDrag = typeof(_oData['allow-drag']) !== 'undefined' ? _oData['allow-drag'] : true;

	// Ссылка на родителя из спрятанных свойств
	this.parent = _parent;

	// Дети
	this.childs = [];

	// Атрибут наличия детей
	this.hasChilds = (_childrenCount > 0 || _id == 0);

	// Дубль контрола с заголовком строки
	this.labelControl = null;

	// Позиция
	this.position = false;

	// атрибут развернут или нет
	this.isExpanded = false;

	// Фильтр
	this.filter = new filter;

	// Уровень вложенности
	this.level = _parent ? _parent.level + 1 : 0;

	this.ignoreEmptyFilter = false;

	// Количество записей на страницу
	this.pageLimits = this.control.PerPageLimits;

	this.nextSibling = typeof _oData['nextSibling'] == 'object' ? _oData['nextSibling'] : null;

	this.row = null;

	/** @type {Array} список типов полей, которые поддерживают быстрое редактирование */
	this.editableFieldTypeList = [
		'boolean',
		'color',
		'counter',
		'date',
		'domain_id',
		'domain_id_list',
		'file',
		'float',
		'img_file',
		'int',
		'link_to_object_type',
		'name',
		'price',
		'optioned',
		'relation',
		'string',
		'string',
		'swf_file',
		'tags',
		'text',
		'video_file',
		'multiple_image',
		'multiple_file',
		'lang_id',
		'lang_id_list'
	];

	// Данные пагинации
	this.pageing = {
		'total': 0,
		'limit': 0,
		'offset': 0
	};

	this.baseModule = _baseModule;

	this.baseMethod = _baseMethod;

	/**
	 * Конструктор класса
	 * @access private
	 */
	var constructor = function() {
		if (_oParent) {
			_oParent.childs.push(_id);
			if (_forceDrawing) {
				draw(_parent.childsContainer);
			}
		} else {
			if (_forceDrawing) {
				drawRoot();
			}
		}
	};

	/**
	 * Определяет активность элемента табличного контрола в режиме вывода объектов
	 * @param {TableItem} item элемент
	 * @param {Integer|String|Boolean} defaultActivity активность по умолчанию
	 * @returns {Boolean}
	 */
	var isObjectActivated = function(item, defaultActivity) {
		if (!_flatMode || _self.control.contentType === 'pages') {
			return defaultActivity;
		}

		if (!_self.control.enableObjectsActivity) {
			return true;
		}

		var $groupList = $(_self.control.dataSet.getCommonFields());
		var $disabledField = $('field[name = "disabled"]', $groupList);

		if ($disabledField.length > 0) {
			return item.getValue('disabled').length === 0;
		}

		return (defaultActivity
			|| item.getValue('is_activated')
			|| item.getValue('is_active')
			|| item.getValue('activated')) !== '';
	};

	/**
	 * Добавляет колонку в контейнер
	 * @param {HTMLElement} container элемент контейнера
	 * @param {String} size размер добавляемой колонки
	 * @private
	 */
	var appendColumn = function(container, size) {
		var column = document.createElement('col');
		column.style.width = size;
		$(container).append(column);
	};

	/**
	 * Обновляет данные элемента colgroup таблицы
	 * @param {HTMLElement} columnGroups контейнеры обновляемых данных
	 * @private
	 */
	var updateColumnGroup = function(columnGroups) {
		var $columnGroups = $(columnGroups);
		var usedColumns = getUsedColumns();
		var columnsTable = getColumnsTable();

		$columnGroups.html('');

		var nameColumnSize = parseInt(usedColumns['name']['params'][0]);
		appendColumn($columnGroups, nameColumnSize + 'px');
		var columnSize;

		for (var name in usedColumns) {
			if (!columnsTable.hasOwnProperty(name)) {
				continue;
			}

			columnSize = usedColumns[name]['params'][0];
			appendColumn($columnGroups, columnSize);
		}

		appendColumn($columnGroups, '100%');
	};

	/**
	 * "Рисует" элемент
	 * @access private
	 * @param {HTMLElement} _oContainerEl контейнер для добавления элемента
	 */
	var draw = function(_oContainerEl) {
		_self.isActive = isObjectActivated(_self, _self.isActive);

		var usedColumns = getUsedColumns();
		var columnsTable = getColumnsTable();

		var element = document.createElement('tr');
		element.setAttribute('rel', _id);
		element.className = 'table-row tollbar level-' + _self.level;
		element.rel = _id;
		_self.row = element;

		_labelControl = element;
		_self.labelControl = _labelControl;

		var nameData = usedColumns['name'];

		var labelCell = document.createElement('td');
		labelCell.classList.add('table-cell');
		labelCell.id = 'c_' + _self.control.id + '_' + _id + '_name';
		labelCell.width = parseInt(nameData['params'][0]);
		labelCell.name = 'name';

		if (editableCell.enableEdit !== false) {
			var edit = document.createElement('i');
			edit.className = 'small-ico i-change editable';
			edit.title = getLabel('js-table-control-fast-edit');
			edit.id = 'e_' + _self.control.id + '_' + _self.id + '_name';
			labelCell.appendChild(edit);
		}

		var labelWrapper = document.createElement('div');
		labelWrapper.style.owerflow = 'hidden';

		labelCell.appendChild(labelWrapper);

		var cell = null;

		if (!_objectTypesMode) {
			cell = new editableCell(_self, labelCell, nameData, edit);
		}

		if (cell instanceof editableCell && !cell.isActive) {
			$(edit).detach();
		}

		_toggleControl = document.createElement('span');
		_toggleControl.className = 'catalog-toggle';

		var toggleWrapper = document.createElement('span');
		toggleWrapper.classList.add('catalog-toggle-wrapper');
		toggleWrapper.onclick = function() {
			_self.toggle(this);
			return false;
		};

		if (_self.hasChilds) {
			toggleWrapper.appendChild(_toggleControl);
		} else {
			toggleWrapper.className = 'catalog-toggle-off';
		}

		if (!_self.control.flatMode) {
			labelWrapper.appendChild(toggleWrapper);
		}

		var checkWrapper = document.createElement('div');
		checkWrapper.classList.add('checkbox');

		var checkControl = document.createElement('input');
		checkControl.setAttribute('type', 'checkbox');
		checkControl.value = _id;
		checkControl.classList.add('row_selector');
		checkWrapper.appendChild(checkControl);

		var $element = jQuery(element);
		$element.on('mousedown', function(event) {
			_self.control.handleMouseDown(event, _id);
		});

		$element.on('mouseup', function(event) {
			_self.control.handleMouseUp(event, _self);
		});

		if (_hasCheckbox) {
			_self.checkBox = checkWrapper;
			labelWrapper.appendChild(checkWrapper);
		}

		_itemIcon = document.createElement('img');
		_itemIcon.style.border = '0px';
		_itemIcon.setAttribute('alt', _typeName);
		_itemIcon.setAttribute('title', _typeName);
		_itemIcon.setAttribute('src', _iconSrc);
		_itemIcon.className = 'ti-icon';
		_itemIcon.onmousedown = function() {
			return false;
		};

		if (_self.control.allowDrag && _self.allowDrag) {
			_itemIcon.style.cursor = 'move';
		}

		if (!_self.control.flatMode && !_self.control.objectTypesMode) {
			labelWrapper.appendChild(_itemIcon);
		} else {
			_itemIcon = null;
		}

		if (_self.expiration) {
			var oStatus = _self.expiration['status'];
			if (oStatus) {
				var statusSID = oStatus['id'];
				var statusName = oStatus['_value'];
				if (statusSID) {
					var expInd = document.createElement('img');
					var ico = _iconsPath + 'ico_' + statusSID + '.png';
					expInd.setAttribute('src', ico);
					expInd.setAttribute('alt', statusName);
					expInd.setAttribute('title', statusName);
					expInd.className = 'page-status';
					labelWrapper.appendChild(expInd);
				}
			}
		}

		_labelText = document.createElement('a');
		var itemName = _self.getValue('name');
		var val = String((typeof(itemName) === 'string' && itemName.length) ? itemName : '');

		if (!val.length) {
			val = getLabel('js-smc-noname-page');
		}

		var nameColumnTitle = val.replace(/<[^>]+>/g, '');
		nameColumnTitle = _self.viewLink ? nameColumnTitle + ' ' + _self.viewLink : nameColumnTitle;
		labelWrapper.title = nameColumnTitle;
		_labelText.className = 'name_col';
		_labelText.href = _self.editLink;
		_labelText.innerHTML = val;

		if (!_self.editLink) {
			_labelText.className = 'name_col unactive';
		}

		$(_labelText).on('mousedown click mouseup', function(event) {
			var middleMouseButton = 1;

			if (event.button !== middleMouseButton) {
				event.preventDefault();
			}

			return true;
		});

		labelWrapper.appendChild(_labelText);

		if (typeof _self.editLink === 'string') {
			var editControl = document.createElement('a');
			editControl.classList.add('small-ico');
			editControl.classList.add('i-edit');
			editControl.classList.add('stucktotext');
			editControl.classList.add('editable');
			editControl.setAttribute('href', _self.editLink);
			editControl.setAttribute('title', getLabel('js-goto-edit-page'));
			labelWrapper.appendChild(editControl);
		}

		if (_self.isVirtualCopy) {
			var virtualLabel = document.createElement('span');
			virtualLabel.className = 'label-virtual';
			virtualLabel.innerHTML = (_self.isOriginal) ? getLabel('js-smc-original') : getLabel('js-smc-virtual-copy');
			labelWrapper.appendChild(virtualLabel);
		}

		if (!_self.isActive && !_self.control.objectTypesMode) {
			element.classList.add('disabled');
		}

		element.appendChild(labelCell);

		var colSpan = 2;

		for (var name in usedColumns) {
			var column = columnsTable[name];
			var params = usedColumns[name]['params'];

			if (params[1] === 'static') {
				column = usedColumns[name];
			}
			if (!column) {
				continue;
			}

			colSpan++;

			var col = document.createElement('td');
			col.id = 'c_' + _self.control.id + '_' + _id + '_' + name;
			col.className = 'table-cell';
			col.style.width = params[0];
			col.style.maxWidth = params[0];
			col.name = name;

			val = _self.getValue(name);

			var valueContainer = document.createElement('div');
			valueContainer.style.cursor = 'text';
			valueContainer.style.width = '100%';
			valueContainer.classList.add('cell-item');
			valueContainer.innerHTML = val;

			cell = null;

			if (_self.editableFieldTypeList.indexOf(column.dataType) !== -1 && editableCell.enableEdit !== false) {
				var edit_col = document.createElement('i');
				edit_col.className = 'small-ico i-change editable';
				edit_col.title = getLabel('js-table-control-fast-edit');
				edit_col.id = 'e_' + _self.control.id + '_' + _self.id + '_' + name;
				col.appendChild(edit_col);
				cell = new editableCell(_self, col, column, edit_col);
			}

			col.appendChild(valueContainer);

			if (cell instanceof editableCell && !cell.isActive) {
				$(edit_col).detach();
			}

			if (name === 'is_activated' || name === 'active' || name === 'is_active') {
				_activeColumn = col;
			}

			element.appendChild(col);
		}

		var autoCol = document.createElement('td');
		autoCol.className = 'table-cell';
		autoCol.style.width = '100%';
		element.appendChild(autoCol);

		if (_sibling) {
			var prevEl = null;
			if (_insertMode.toLowerCase() === 'after') {
				prevEl = _sibling.element.nextSibling;
			} else {
				prevEl = _sibling.element;
			}

			if (prevEl) {
				_self.element = _oContainerEl.insertBefore(element, prevEl);
			} else {
				_self.element = _oContainerEl.appendChild(element);
			}
		} else {
			_self.element = _oContainerEl.appendChild(element);
		}

		if (_self.control.dragAllowed && _self.allowDrag) {
			var DropMode = 'child';
			var timeOutHandler;
			var mouseFlag = false;

			jQuery(_labelControl).draggable({
				appendTo: 'body',
				distance: Control.DragSensitivity,
				handle: '.ti-icon, a',
				cursorAt: {right: -2},
				helper: function() {
					var drag_el = document.createElement('div');

					if (_self.control.contentType === 'objects') {
						drag_el.innerHTML = '<div>' + _self.name + '</div>';
						drag_el.className = 'ti-draggable';

						jQuery(drag_el).css({
							'position': 'absolute',
							'background': 'url(' + _iconSrc + ') no-repeat 0 4px',
							'padding-left': '20px'
						});
					} else {
						_self.setSelected(true);
						_self.control.selectedList[_self.id] = _self;

						for (key in _self.control.selectedList) {
							drag_el.innerHTML += '<div>' + _self.control.selectedList[key].name + '</div>';
						}

						drag_el.className = 'ti-draggable';

						jQuery(drag_el).css({
							'position': 'absolute',
							'padding-left': '20px'
						});
					}

					return drag_el;
				},
				start: function() {
					Control.DraggableItem = _self;
					Control.DragMode = true;
					if (_self.control.toolbar) {
						_self.control.toolbar.hide();
					}
				},
				stop: function() {
					if (Control.HandleItem) {
						Control.HandleItem.deInitDroppable();
						if (Control.DraggableItem) {
							Control.DraggableItem.tryMoveTo(Control.HandleItem, DropMode);
						}
					}
					Control.DraggableItem = null;
					Control.DragMode = false;
					jQuery('.pages-bar a').off('mouseover');
					mouseFlag = false;
					window.clearTimeout(timeOutHandler);
				},
				drag: function(event) {
					var $pageBarLink = jQuery('.pages-bar a');

					$pageBarLink.on('mouseover', function() {
						if (!mouseFlag) {
							mouseFlag = true;
							var that = this;
							timeOutHandler = window.setTimeout(function() {
								$(that).trigger('click');
							}, 1000);
						}
					});

					$pageBarLink.on('mouseout', function() {
						if (mouseFlag) {
							mouseFlag = false;
							window.clearTimeout(timeOutHandler);
						}
					});

					var x = event.pageX;
					var y = event.pageY;
					var hItem = Control.detectItemByMousePointer(x, y);
					var oldHItem = Control.HandleItem;
					if (oldHItem) {
						oldHItem.deInitDroppable();
					}

					Control.HandleItem = hItem;
					if (hItem) {
						var cpos = jQuery(hItem.control.initContainer).position();
						// 310, 61, 55 - коэффициенты подобранные вручную для табличного контрола
						var itmDelta = (y - cpos.top - hItem.position.top - 301);

						if (itmDelta > 61) {
							DropMode = 'after';
						} else if (itmDelta > 55) {
							DropMode = 'child';
						} else {
							DropMode = 'before';
						}

						hItem.initDroppable(DropMode);
					}
				}
			});
		}

		var childsRow = document.createElement('tr');
		var childsBar = document.createElement('td');

		if (!_flatMode) {
			colSpan++;
		}

		childsBar.colSpan = colSpan;
		childsRow.appendChild(childsBar);

		var childsBody = document.createElement('table');
		childsBody.classList.add('table');
		childsBody.style.tableLayout = 'fixed';

		var columnGroup = document.createElement('colgroup');
		updateColumnGroup(columnGroup);
		childsBody.appendChild(columnGroup);

		var pagesWrapper = document.createElement('tr');
		pagesWrapper.classList.add('table-row');
		pagesWrapper.classList.add('level-' + _self.level);
		pagesWrapper.style.display = 'none';

		_pagesBar = document.createElement('td');
		_pagesBar.classList.add('pages-bar');
		_pagesBar.classList.add('table-cell');
		_pagesBar.id = 'pb_' + _self.control.id + '_' + _self.id;
		_pagesBar.colSpan = colSpan;

		pagesWrapper.appendChild(_pagesBar);
		childsBar.appendChild(childsBody);
		childsBody.appendChild(pagesWrapper);

		_self.childsContainer = childsBody;

		switch (true) {
			case !element.nextSibling: {
				_oContainerEl.appendChild(childsRow);
				break;
			}
			case _sInsertMode === 'before': {
				element.parentNode.insertBefore(childsRow, element.nextSibling);
				break;
			}
			case _sInsertMode === 'after': {
				element.parentNode.insertBefore(childsRow, element);
				break;
			}
		}

		_self.resizeColumn('name', parseInt(nameData['params'][0]));
	};

	/**
	 * Пытается отправить запрос на перемещение элемента
	 * @access public
	 * @param {Object} Item - элемент в который (или после которого) пытаемся переместить текущий
	 * @param {Boolean} asSibling - если true, перемещаем после элемента Item, если false, то делаем элемент первым ребенком Item'a
	 * @return False если перемещение невозможно
	 */
	this.tryMoveTo = function(Item, MoveMode) {
		if (Item) {
			var before = this.control.getRootNodeId();
			var rel = Item.id;
			var asSibling = 1;
			var after = '';

			if (this.control.contentType == 'pages') {
				asSibling = MoveMode !== 'child' ? 1 : 0;
			}

			if (MoveMode == 'before') {
				if (this.control.contentType == 'pages') {
					before = Item.id;
					rel = Item.parent.id;
					after = rel;
				} else {
					before = Item.id;
					rel = Item.id;
				}
			}
			if (MoveMode == 'after') {
				if (this.control.contentType == 'pages') {
					var s = Item.getNextSibling();
					rel = Item.parent.id;
					before = s ? s.id : this.control.getRootNodeId();
					after = Item.id;
				} else {
					rel = Item.id;
					after = Item.id;
				}
			}

			if (this.control.contentType == 'objects') {
				after = rel;
			}

			if (Item === this) {
				return false;
			}
			if (Item.checkIsChild(this)) {
				return false;
			}
			if (before == this.id) {
				return false;
			}

			var receiver = Item;

			if (asSibling == 1 && this.control.contentType == 'pages') {
				receiver = Item.parent ? Item.parent : Item.control.getRoot();
			}

			var selectedIds = [];
			var counter = 0;

			for (i in this.control.selectedList) {
				selectedIds[counter++] = i;
			}

			this.control.dataSet.execute('move', {
				'element': this.id,
				'before': before,
				'after': after,
				'rel': rel,
				'as-sibling': asSibling,
				'domain': Item.control.getRoot().name,
				'childs': 1,
				'links': 1,
				'virtuals': 1,
				'permissions': 1,
				'templates': 1,
				'receiver_item': receiver,
				'handle_item': this,
				'viewMode': 'full',
				'moveMode': MoveMode,
				'selected_list': selectedIds
			});
		}
	};

	/**
	 * Пытается подготовить элемент, как контейнер для перемещаемого
	 * @access public
	 * @param {Boolean} asSibling - если true, готовим для перемещения после текущего элемента, если false, то готвоим для перемещения в качестве первого ребенка
	 * @return False ,в вслучае если перемещение в этот элемент не возможно
	 */
	this.initDroppable = function(DropMode) {
		var DropMode = DropMode || 'child';
		var di = Control.DraggableItem;
		var cpos = jQuery(this.control.initContainer).offset();
		if (di) {
			if (di === this) {
				return false;
			}
			if (this.checkIsChild(di)) {
				return false;
			}

			var ind = Control.dropIndicator;

			if (oTable) {
				var table_w = jQuery(oTable.container).width();
				if (table_w < this.position.right) {
					this.position.right = table_w;
				}
			}

			if (DropMode == 'after') {
				ind.style.top = this.position.bottom + cpos.top + 'px';
				ind.style.left = this.position.left + cpos.left + 'px';
				ind.style.width = this.position.right - this.position.left;
			}
			if (DropMode == 'before') {
				ind.style.top = this.position.top + cpos.top + ind.offsetHeight + 'px';
				ind.style.left = this.position.left + cpos.left + 'px';
				ind.style.width = this.position.right - this.position.left + 'px';
			}
			if (DropMode == 'child') {
				ind.style.top = this.position.bottom + cpos.top + 'px';
				ind.style.left = this.position.left + cpos.left + 20 + 'px';
				ind.style.width = this.position.right + cpos.left - 20 - this.position.left + 'px';
			}

			ind.style.display = '';

			setTimeout(autoExpandSelf, 3239);
		}
	};

	/**
	 * Восстанавливает состояние элемента из режима "контейнер для перемещаемого"
	 * @access public
	 */
	this.deInitDroppable = function() {
		if (!Control.dropIndicator) {
			return;
		}
		Control.dropIndicator.style.display = 'none';
	};

	var getUsedColumns = function() {
		if (_self.control.usedColumns) {
			return _self.control.usedColumns;
		}

		var usedColumns = {};

		var setColumns = _settings.get(_self.control.id, 'used-columns');
		if (setColumns === false) {
			setColumns = _self.control.visiblePropsMenu;
			if (setColumns.length == 0) {
				setColumns = _self.control.dataSet.getDefaultFields();
			}
			if (!setColumns) {
				setColumns = '';
			}
		}

		if (setColumns.length) {
			var arrCols = setColumns.split('|');
			for (var i = 0; i < arrCols.length; i++) {
				var info = arrCols[i];
				var colName = arrCols[i];
				var colParams = [];
				var offset = info.indexOf('[');
				if (offset) {
					colName = info.substring(0, offset);
					colParams = info.substring(offset + 1, info.length - 1).split(',');

				}
				usedColumns[colName] = {
					'name': colName,
					'params': colParams
				};
			}
		}

		if (!usedColumns['name']) {
			usedColumns['name'] = {
				'name': 'name',
				'params': ['250px']
			};
		}

		var sequenceProps = _self.control.sequencePropsMenu;

		usedColumns = objectSort(usedColumns, sequenceProps);

		_self.control.usedColumns = usedColumns;

		return usedColumns;
	};

	var objectSort = function(object, keys) {
		var property, sortedObject = {}, i = 0;

		for (property in object) {
			if (!object.hasOwnProperty(keys[i])) {
				delete keys[i];
				keys.splice(i);
			}
			if (object.hasOwnProperty(property)) {
				if (keys.indexOf(property) === -1) {
					keys.push(property);
				}
				sortedObject[keys[i]] = object[keys[i]] || '';
				i++;
			}
		}
		return sortedObject;
	};

	var setUsedColumns = function() {
		var usedColumns = getUsedColumns();
		var cols = [];
		for (name in usedColumns) {
			var col = usedColumns[name];
			if (!col) {
				continue;
			}
			cols[cols.length] = name + '[' + col.params.join(',') + ']';
		}

		_settings.set(_self.control.id, cols.join('|'), 'used-columns');
	};

	/**
	 * Определяет, нужно ли выводить меню полей в табличном контроле
	 * @returns {Boolean}
	 */
	var needMenu = function() {
		var menu = getColumnsMenu();
		return Object.keys(menu).length > 0;
	};

	/**
	 * Возвращает меню со всеми полями, которые можно показать/скрыть в таблице контрола
	 * (Кнопка `+` в заголовке таблицы)
	 * @returns {Object}
	 */
	var getColumnsMenu = function() {
		if (_self.control.columnsMenu) {
			return _self.control.columnsMenu;
		}

		var menu = {};
		$.each(getColumnsTable(), function(key, value) {
			if ($.inArray(value.fieldName, _self.control.requiredPropsMenu) === -1) {
				menu[key] = value;
			}
		});

		_self.control.columnsMenu = menu;
		return menu;
	};

	/**
	 * Устанавливает новое значение меню полей
	 * @param {Object} menu
	 */
	var setColumnsMenu = function(menu) {
		_self.control.columnsMenu = menu;
	};

	/**
	 * Возвращает все колонки табличного контрола
	 * @returns {Object}
	 */
	var getColumnsTable = function() {
		if (_self.control.columnsTable) {
			return _self.control.columnsTable;
		}

		var commonGroups = _self.control.dataSet.getCommonFields();
		var usedColumns = getUsedColumns();

		var num = 1;
		var table = {};

		for (var i = 0; i < commonGroups.length; i++) {
			num++;

			var groupFields = commonGroups[i].getElementsByTagName('field');
			var needSeparator = false;

			for (var j = 0; j < groupFields.length; j++) {
				var field = groupFields[j];
				var name = field.getAttribute('name');
				var type = field.getElementsByTagName('type')[0];
				var dataType = type.getAttribute('data-type');

				if (shouldSkipField(name, dataType)) {
					continue;
				}

				var isUsed = (name in usedColumns);
				var title = field.getAttribute('title');
				var fieldId = field.getAttribute('id');
				var guideId = field.getAttribute('guide-id');

				table[name] = {
					'caption': title,
					'icon': isUsed ? 'checked' : 'undefined',
					'id': fieldId,
					'title': title,
					'fieldName': name,
					'dataType': dataType,
					'guideId': guideId,
					'checked': isUsed,
					'execute': function(item) {
						item.checked ? _self.removeColumn(item.fieldName) : _self.appendColumn(item.fieldName);
						Control.recalcItemsPosition();
					}
				};

				num++;

				if (i < groupFields.length - 1) {
					needSeparator = true;
				}
			}

			if (needSeparator) {
				table[num + '-sep'] = '-';
			}
		}

		_self.control.columnsTable = table;
		return table;

		/**
		 * Определяет, нужно ли пропустить поле и не выводить его в табличном контроле
		 * @param {String} name название поля
		 * @param {String} dataType тип данных поля
		 * @returns {boolean}
		 */
		function shouldSkipField(name, dataType) {
			if ($.inArray(dataType, _self.editableFieldTypeList) === -1) {
				return true;
			}

			var ignoredFieldList = _self.control.dataSet.getFieldsStoplist();
			for (var i = 0; i < ignoredFieldList.length; i++) {
				if (ignoredFieldList[i] == name) {
					return true;
				}
			}

			return false;
		}
	};

	this.resizeColumn = function(fieldName, size) {
		var usedColumns = getUsedColumns();
		var column = usedColumns[fieldName];
		if (!column) {
			return false;
		}

		for (var j = 0; j < _self.childs.length; j++) {
			var ch = _self.control.items[_self.childs[j]];
			if (ch) {
				ch.resizeColumn(fieldName, size);
			}
		}

		if (_self.isRoot) {
			var el = document.getElementById('h_' + _self.control.id + '_' + fieldName);
			if (!el) {
				return false;
			}
			el.style.width = size + 'px';
			el.style.maxWidth = size + 'px';

			usedColumns[fieldName].params[0] = size + 'px';
			_self.control.usedColumns = usedColumns;
			setUsedColumns();

		} else {
			var el = document.getElementById('c_' + _self.control.id + '_' + _self.id + '_' + fieldName);
			if (!el) {
				return false;
			}

			el.style.width = size + 'px';
			el.style.maxWidth = size + 'px';
		}

		var $cellContainer = $(el);
		$cellContainer.attr('width', size);
		this.recalculateNameCellWidth($cellContainer);

		var $colGroups = $('colgroup', _self.control.initContainer);
		updateColumnGroup($colGroups);

		return true;
	};

	/**
	 * Устанавливает ширину для ячейки с названием
	 * @param {jQuery|Object} $cellContainer контейнер ячейки с названием
	 */
	this.recalculateNameCellWidth = function($cellContainer) {
		var $nameCellContainer = $('a.name_col', $cellContainer);

		if ($nameCellContainer.length) {
			$nameCellContainer.css({
				'width': this.calculateNameCellContainerWidth($cellContainer)
			});
		}
	},

	/**
	 * Вычисляет ширину значения ячейки с названием
	 * @param {jQuery|Object} $cellContainer контейнер ячейки с названием
	 * @returns {number}
	 */
	this.calculateNameCellContainerWidth = function($cellContainer) {
		var cellContainerWidth = parseInt($cellContainer.attr('width'));
		var checkboxWidth = $('div.checkbox', $cellContainer).outerWidth(true);
		var $iconContainer = $('img.ti-icon', $cellContainer);
		var iconWidth = $iconContainer.length ? ($iconContainer.outerWidth(true) ? parseInt($iconContainer.outerWidth(true)) : 16) : 0;
		var fastEditButtonsWidth = parseInt($('i.i-change', $cellContainer).outerWidth());
		var editLinkButtonsWidth = parseInt($('a.i-edit', $cellContainer).outerWidth());
		var containerPaddingLeft = parseInt($cellContainer.css('padding-left'));
		var containerPaddingRight = parseInt($cellContainer.css('padding-right'));
		return cellContainerWidth - checkboxWidth - iconWidth - fastEditButtonsWidth - editLinkButtonsWidth - containerPaddingLeft - containerPaddingRight;
	};

	/**
	 * Обработчик события изменения размера колонки таблицы
	 * @param {String} fieldName имя поля, размер которого изменяется
	 * @param {Object} event
	 */
	this.startResizeColumn = function(fieldName, event) {
		var $floatResizing = $(document.createElement('div'));
		var $tableContainer = $(this.control.initContainer);
		var containerOffset = $tableContainer.offset();

		$floatResizing.addClass('resizer');

		$floatResizing.css({
			top: containerOffset.top,
			left: event.clientX,
			height: $tableContainer.outerHeight() + 'px'
		});

		/** Отключает выделение текста */
		var disableSelection = function() {
			try {
				document.body.style['-moz-user-select'] = 'none';
				document.body.style['-khtml-user-select'] = 'none';
				document.body.onselectstart = function() {
					return false;
				};
				document.selection.empty();
			} catch (err) {
			}
		};

		/**
		 * Обработчик события изменения размера
		 * @param {Object} event
		 */
		var onResize = function(event) {
			disableSelection();
			$floatResizing.css('left', event.clientX);
		};

		/** Обработчик события окончания изменения размера */
		var onStopResize = function() {
			$(document).off('mouseup');
			$(document).off('mousemove');

			var $columnElement = $('#h_' + _self.control.id + '_' + fieldName);
			var newColumnSize = $floatResizing.position().left - $columnElement.offset().left;

			newColumnSize = Math.min(newColumnSize, TableItem.maxColumnWidth);
			newColumnSize = Math.max(newColumnSize, TableItem.minColumnWidth);

			var oldColumnSize = $columnElement.outerWidth();

			if (newColumnSize !== oldColumnSize) {
				_self.resizeColumn(fieldName, newColumnSize);
				Control.recalcItemsPosition();
			}

			$floatResizing.detach();
		};

		$(document).on('mouseup', onStopResize);
		$(document).on('mousemove', onResize);

		$('body').append($floatResizing);
	};

	/**
	 * Добавляет колонку в таблицу
	 * @param {String} fieldName название поля
	 * @returns {Boolean}
	 */
	this.appendColumn = function(fieldName) {
		var usedColumns = getUsedColumns();
		var columnsMenu = getColumnsMenu();
		var column = columnsMenu[fieldName];
		if (!column || usedColumns[fieldName]) {
			return false;
		}

		for (var j = 0; j < _self.childs.length; j++) {
			var ch = _self.control.items[_self.childs[j]];
			if (ch) {
				ch.appendColumn(fieldName);
			}
		}

		if (_self.isRoot) {
			var col = document.createElement('th');
			col.className = 'table-cell';
			col.setAttribute('id', 'h_' + _self.control.id + '_' + fieldName);
			col.setAttribute('name', name);
			col.name = fieldName;
			col.style.width = '200px';

			var resizer = document.createElement('span');
			resizer.onmousedown = function(event) {
				if (!event) {
					event = window.event;
				}
				_self.startResizeColumn(fieldName, event);
			};

			col.appendChild(resizer);

			var header = document.createElement('div');
			header.classList.add('table-title');
			header.title = column.title;
			header.innerHTML = column.title;
			col.appendChild(header);

			_self.element.insertBefore(col, _self.element.lastChild);

			usedColumns[fieldName] = {
				'name': fieldName,
				'params': ['200px']
			};
			_self.control.usedColumns = usedColumns;

			columnsMenu[fieldName].checked = true;
			columnsMenu[fieldName].icon = 'checked';
			setColumnsMenu(columnsMenu);

			var colFltr = document.createElement('div');
			colFltr.setAttribute('id', 'f_' + _self.control.id + '_' + fieldName);
			colFltr.style.width = '100%';
			_self.control.onDrawFieldFilter(columnsMenu[fieldName], colFltr, usedColumns[fieldName].params);
			col.appendChild(colFltr);

			var pgBar = document.getElementById('pb_' + _self.control.id + '_' + _self.id);
			if (pgBar) {
				pgBar.colSpan += 1;
			}

			setUsedColumns();
			toggleFilterRow();
		} else {
			var col = document.createElement('td');
			col.id = 'c_' + _self.control.id + '_' + _self.id + '_' + fieldName;
			col.style.width = '280px';
			col.style.maxWidth = '200px';
			col.className = 'table-cell';
			col.name = fieldName;

			if (document.getElementById(col.id)) {
				return true;
			}

			var val = _self.getValue(fieldName);

			_self.element.insertBefore(col, _self.element.lastChild);
			_self.childsContainer.parentNode.colSpan += 1;

			var edit_col = document.createElement('i');
			edit_col.className = 'small-ico i-change editable';
			edit_col.title = getLabel('js-table-control-fast-edit');
			edit_col.id = 'e_' + _self.control.id + '_' + _self.id + '_' + fieldName;
			col.appendChild(edit_col);

			var content_col = document.createElement('div');
			content_col.style.cursor = 'text';
			content_col.style.width = '100%';
			content_col.classList.add('cell-item');
			content_col.innerHTML = val;

			col.appendChild(content_col);

			var cell = new editableCell(_self, col, column, edit_col);

			if (cell instanceof editableCell && !cell.isActive) {
				$(edit_col).detach();
			}
		}

		var $colGroups = $('colgroup', _self.control.initContainer);
		updateColumnGroup($colGroups);

		return true;
	};

	/**
	 * Убирает колонку из таблицы
	 * @param {String} fieldName название поля
	 * @returns {Boolean}
	 */
	this.removeColumn = function(fieldName) {
		var usedColumns = getUsedColumns();
		var columnsMenu = getColumnsMenu();
		var column = columnsMenu[fieldName];
		if (!column || !usedColumns[fieldName]) {
			return false;
		}

		for (var j = 0; j < _self.childs.length; j++) {
			var ch = _self.control.items[_self.childs[j]];
			if (ch) {
				ch.removeColumn(fieldName);
			}
		}

		if (_self.isRoot) {
			var el = document.getElementById('h_' + _self.control.id + '_' + fieldName);
			if (!el) {
				return false;
			}
			el.parentNode.removeChild(el);

			var fCell = document.getElementById('f_' + _self.control.id + '_' + fieldName);
			if (fCell) {
				fCell.parentNode.removeChild(fCell);
			}

			var usedCols = {};
			for (var name in usedColumns) {
				if (name == fieldName) {
					continue;
				}
				usedCols[name] = usedColumns[name];
			}
			_self.control.usedColumns = usedCols;

			columnsMenu[fieldName].checked = false;
			columnsMenu[fieldName].icon = 'undefined';
			setColumnsMenu(columnsMenu);

			_self.control.onRemoveColumn(column);

			_self.childsContainer.parentNode.parentNode.colSpan -= 1;
			var pgBar = document.getElementById('pb_' + _self.control.id + '_' + _self.id);
			if (pgBar) {
				pgBar.colSpan -= 1;
			}

			setUsedColumns();
			toggleFilterRow();
		} else {
			var el = document.getElementById('c_' + _self.control.id + '_' + _self.id + '_' + fieldName);
			if (!el) {
				return false;
			}
			el.parentNode.removeChild(el);
			_self.childsContainer.parentNode.parentNode.colSpan -= 1;
		}

		updateColumnGroup($('colgroup', _self.control.initContainer));

		return true;
	};

	/**
	 * Обработчик события выполнения экспорта списка в CSV
	 * @param {Array} relIdList список идентификаторов связанных сущностей, которые могут влиять на результат экспорта
	 */
	this.exportCallback = function(relIdList) {

		/**
		 * Запрашивает скачивание экспортированного файла
		 * @param {Array} relIdList список идентификаторов связанных сущностей, которые могут влиять на результат экспорта
		 * @param {String} encoding кодировка csv файла
		 * @param {String} popupName имя всплывающего окна
		 */
		var requestDownload = function(relIdList, encoding, popupName) {
			closeDialog(popupName);
			var request = _self.getExportLink(relIdList, encoding);
			window.location = request + '&download=1';
		};

		/**
		 * Запрашивает экспорт в csv файл по частям
		 * @param {Array} relIdList список идентификаторов связанных сущностей, которые могут влиять на результат экспорта
		 * @param {String} encoding кодировка csv файла
		 * @param {String} popupName имя всплывающего окна
		 * @param {Function} callback имя обработчика завершения экспорта
		 */
		var requestExport = function(relIdList, encoding, popupName, callback) {
			var request = _self.getExportLink(relIdList, encoding);

			$.ajax({
				url: request,
				dataType: 'json',
				method: 'get'
			}).done(function(response) {
				if (typeof response.is_complete === 'boolean') {
					if (response.is_complete === true) {
						return callback();
					}

					return requestExport(relIdList, encoding, popupName, callback);
				}

				handleError(popupName, 'Unknown');
			}).fail(function(jqXHR, textStatus) {
				handleError(popupName, textStatus);
			});
		};

		/** Показывает диалоговое окно с выбором параметров csv экспорта */
		$.get('/styles/skins/modern/design/js/smc/html/quickExportDialog.html', function(html) {
			html = html.replace(/{{label:(.+)}}/gi, function(match, label) {
				return getLabel(label);
			});

			openDialog('', getLabel('js-csv-export'), {
				confirmText: getLabel('js-csv-export-button'),
				html: html,

				confirmCallback: function(popupName) {
					var $popup = $('#popupLayer_' + popupName);

					selectEncoding(function(encoding) {
						$('#quick_csv_encoding', $popup).hide();
						$('div.eip_buttons', $popup).hide();
						$('div.exchange_container', $popup).show();
						requestExport(relIdList, encoding, popupName, function() {
							requestDownload(relIdList, encoding, popupName);
						});
					});
				},

				openCallback: function() {
					initSelectizer();
				}
			});
		});
	};

	/**
	 * Обработчик события выполнения импорта списка из CSV
	 * @param {Number|null} entityId идентификатор связанной сущности, которая может влиять на результат импорта
	 */
	this.importCallback = function(entityId) {
		entityId = (typeof entityId === 'number') ? entityId : null;

		/**
		 * Запрашивает скачивание экспортированного файла
		 * @param {Number|null} entityId идентификатор связанной сущности, которая может влиять на результат импорта
		 * @param {String} encoding кодировка csv файла
		 * @param {String} popupName имя всплывающего окна
		 * @param {Function} callback имя обработчика завершения экспорта
		 */
		var requestUpload = function(entityId, encoding, popupName, callback) {
			var request = _self.getImportLink(entityId, encoding);
			var $popup = $('#popupLayer_' + popupName);
			var $form = $('#import-csv-form', $popup);

			var formData = new FormData;
			formData.append('csv-file', $('input[name = "csv-file"]', $form).prop('files')[0]);
			formData.append('csrf', csrfProtection.getToken());
			formData.append('upload', 1);

			$.ajax({
				url: request,
				dataType: 'json',
				method: 'post',
				processData: false,
				contentType: false,
				data: formData
			}).done(function(response) {
				if (typeof response.error === 'string') {
					return handleError(popupName, response.error);
				}

				if (typeof response.file === 'string') {
					return callback(response.file, request, popupName);
				}

				handleError(popupName, 'Unknown');
			}).fail(function(jqXHR, textStatus) {
				handleError(popupName, textStatus);
			});
		};

		/**
		 * Запрашивает импорт csv файла по частям
		 * @param {String} file путь до импортированного файла
		 * @param {String} request запрос
		 * @param {String} popupName имя всплывающего окна
		 */
		var requestImport = function(file, request, popupName) {
			var formData = new FormData;
			formData.append('file', file);
			formData.append('csrf', csrfProtection.getToken());

			$.ajax({
				url: request,
				dataType: 'json',
				method: 'post',
				processData: false,
				contentType: false,
				data: formData
			}).done(function(response) {
				if (typeof response.error === 'string') {
					return handleError(popupName, response.error);
				}

				if (typeof response.is_complete === 'boolean') {
					if (response.is_complete === true) {
						return window.location.reload();
					}

					return requestImport(file, request, popupName);
				}

				handleError(popupName, 'Unknown');
			}).fail(function(jqXHR, textStatus) {
				handleError(popupName, textStatus);
			});
		};

		/** Показывает диалоговое окно с выбором параметров csv импорта */
		$.get('/styles/skins/modern/design/js/smc/html/quickImportDialog.html', function(html) {
			html = html.replace(/{{label:(.+)}}/gi, function(match, label) {
				return getLabel(label);
			});

			openDialog('', getLabel('js-csv-import'), {
				confirmText: getLabel('js-csv-import-button'),
				html: html,

				confirmCallback: function(popupName) {
					var $popup = $('#popupLayer_' + popupName);

					selectEncoding(function(encoding) {
						$('#import-csv-form', $popup).hide();
						$('div.eip_buttons', $popup).hide();
						$('div.exchange_container', $popup).show();
						requestUpload(entityId, encoding, popupName, requestImport);
					});
				},

				openCallback: function() {
					initSelectizer();
				}
			});
		});
	};

	/**
	 * Выбирает кодировку и выполняет обработчик
	 * @param {Function} callback обработчик
	 */
	var selectEncoding = function(callback) {
		var selectElement = document.querySelector('select[name=encoding]');
		var selectedEncoding = null;

		if (selectElement && typeof selectElement.selectedIndex === 'number') {
			selectedEncoding = selectElement.item(selectElement.selectedIndex).text;
		}

		callback(selectedEncoding);
	};

	/**
	 * Обрабатывает сообщение об ошибке
	 * @param {String} popupName имя всплывающего окна
	 * @param {String} message сообщение
	 */
	var handleError = function(popupName, message) {
		closeDialog(popupName);
		$.jGrowl(message, {header: getLabel('js-error-header')});
	};

	var toggleFilterRow = function() {
		var usedColumns = getUsedColumns();
		var columnsTable = getColumnsTable();

		var i = 0;
		for (var name in usedColumns) {
			var column = columnsTable[name];
			var params = usedColumns[name]['params'];

			if (params[1] == 'static') {
				column = usedColumns[name];
				column.title = getLabel('js-smc-' + name);
			}

			if (!column) {
				continue;
			}
			i++;
		}

		if (_filterRow) {
			_filterRow.style.display = (i > 0) ? '' : 'none';
		}
	};

	var resizeHandler = function(fieldName) {
		return function(event) {
			if (!event) {
				event = window.event;
			}
			_self.startResizeColumn(fieldName, event);
			return true;
		};
	};

	/**
	 * Рисует корневой элемент
	 * @private
	 */
	var drawRoot = function() {
		initDropIndicator();

		var usedColumns = getUsedColumns();
		var columnsTable = getColumnsTable();
		var usedColumnsCount = 0;

		var tHead = document.createElement('tr');
		tHead.setAttribute('name', _self.control.id);
		tHead.className = 'table-row title';

		var nameData = usedColumns['name'],
			nameCell = document.createElement('th');

		nameCell.className = 'table-cell';
		nameCell.id = 'h_' + _self.control.id + '_name';
		nameCell.setAttribute('name', 'name');
		nameCell.name = name;
		nameCell.width = parseInt(nameData['params'][0]);

		var header = document.createElement('div');
		header.classList.add('table-title');
		header.classList.add('disabled');

		var firstColumnTitle = getLabel('js-smc-name-column');
		if (_self.control.labelFirstColumn.length > 0) {
			firstColumnTitle = _self.control.labelFirstColumn;
		}

		header.innerHTML = firstColumnTitle;
		header.title = firstColumnTitle;

		var resizer = document.createElement('span');
		resizer.onmousedown = resizeHandler('name');

		nameCell.appendChild(resizer);
		nameCell.appendChild(header);

		if (_self.control.enableEdit) {
			var inputSearch = document.createElement('div');
			inputSearch.className = 'input-search';
			inputSearch.id = 'f_' + _self.control.id + '_name';
			_self.control.onDrawFieldFilter('name', inputSearch, nameData.params);
			nameCell.appendChild(inputSearch);
		}

		tHead.appendChild(nameCell);

		var colSpan = 2;

		for (var name in usedColumns) {
			var column = columnsTable[name];
			var params = usedColumns[name]['params'];
			if (params[1] == 'static') {
				column = usedColumns[name];
				column.title = getLabel('js-smc-' + name);
			}
			if (!column) {
				continue;
			}

			colSpan++;

			var col = document.createElement('th');
			col.classList.add('table-cell');
			col.id = 'h_' + _self.control.id + '_' + name;
			col.setAttribute('name', name);
			col.style.width = params[0];

			header = document.createElement('div');
			header.classList.add('table-title');
			header.classList.add('disabled');
			header.title = column.title;
			header.innerHTML = column.title;

			col.appendChild(header);

			var resizer = document.createElement('span');
			resizer.onmousedown = resizeHandler(name);
			col.appendChild(resizer);

			var filterField = document.createElement('div');
			filterField.id = 'f_' + _self.control.id + '_' + name;
			filterField.style.width = '100%';
			_self.control.onDrawFieldFilter(column, filterField, params);

			col.appendChild(filterField);

			tHead.appendChild(col);

			++usedColumnsCount;
		}

		var autocol = document.createElement('th');
		autocol.classList.add('table-cell');
		autocol.classList.add('plus');
		autocol.style.width = '100%';
		autocol.style.textAlign = 'left';
		autocol.style.verticalAlign = 'middle';

		if (!_self.control.objectTypesMode && needMenu()) {
			var invokeBtn = document.createElement('i');
			invokeBtn.classList.add('small-ico');
			invokeBtn.classList.add('i-add');
			invokeBtn.classList.add('pointer');
			jQuery(invokeBtn).on('click', function(event) {
				jQuery.cmenu.hideAll();
				jQuery.cmenu.lockHiding = true;
				jQuery.cmenu.show(
					jQuery.cmenu.getMenu(getColumnsMenu()),
					_self.control.initContainer.offsetParent,
					event
				);
			});

			jQuery(invokeBtn).on('mouseout', function() {
				jQuery.cmenu.lockHiding = false;
			});
			autocol.oncontextmenu = function() {
				return false;
			};
			autocol.appendChild(invokeBtn);
		}

		tHead.appendChild(autocol);

		jQuery(tHead).on('click', function(event) {
			var el = event.target;

			if (el !== autocol) {
				TableItem.orderByColumn(el.parentNode.getAttribute('name'), _self.control, el);
			}
		});

		toggleFilterRow();

		var pagesWrapper = document.createElement('tBody');
		pagesWrapper.classList.add('level-' + _self.level);
		pagesWrapper.style.display = 'none';

		var pagesRow = document.createElement('tr');
		pagesRow.style.display = 'none';
		pagesRow.classList.add('table-row');

		_pagesBar = document.createElement('td');
		_pagesBar.classList.add('pages-bar');
		_pagesBar.classList.add('table-cell');
		_pagesBar.id = 'pb_' + _self.control.id + '_' + _self.id;
		if (!_flatMode) {
			colSpan++;
		}
		_pagesBar.colSpan = colSpan;

		pagesRow.appendChild(_pagesBar);

		pagesWrapper.appendChild(pagesRow);

		_self.element = _self.control.container.appendChild(tHead);
		_self.childsContainer = _self.control.container.appendChild(pagesWrapper);
		_self.control.initContainer = _self.control.container;
		_self.control.container = _self.childsContainer;

		if (_flatMode && !_objectTypesMode) {
			_self.showCsvButtons(_self.exportCallback, _self.importCallback);
		}

		_self.expand();

		/** Инициализирует индикатор перемещения элементов */
		function initDropIndicator() {
			if (!Control.dropIndicator) {
				var dropIndicator = document.createElement('div');
				dropIndicator.className = 'ti-drop';
				Control.dropIndicator = document.body.appendChild(dropIndicator);
			}
		}
	};

	/**
	 * Отображает кнопки обмена данными в формате csv
	 * @param {Function} exportCallback обработчик нажатия кнопки экспорта
	 * @param {Function} importCallback обработчик нажатия кнопки импорта
	 */
	this.showCsvButtons = function(exportCallback, importCallback) {
		if (this.control.disableCSVButtons) {
			return;
		}
		_self.hideCsvButtons();

		var csvButtons = document.createElement('div');
		csvButtons.id = 'csv-buttons';

		var aExportCsv = document.createElement('a');
		var exImg = document.createElement('i');
		exImg.className = 'small-ico i-csv-export';
		aExportCsv.appendChild(exImg);
		aExportCsv.appendChild(document.createTextNode(getLabel('js-csv-export')));
		aExportCsv.href = '#';
		aExportCsv.className = 'csvLink csvExport btn-action';

		aExportCsv.onclick = exportCallback;
		csvButtons.appendChild(aExportCsv);

		if (!this.control.hideCsvImportButton) {
			var aImportCsv = document.createElement('a');
			var imImg = document.createElement('i');
			imImg.className = 'small-ico i-csv-import';
			aImportCsv.appendChild(imImg);
			aImportCsv.appendChild(document.createTextNode(getLabel('js-csv-import')));
			aImportCsv.href = '#';
			aImportCsv.className = 'csvLink csvImport btn-action';

			aImportCsv.onclick = importCallback;
			csvButtons.appendChild(aImportCsv);
		}

		var parent = document.getElementById('csv-buttons-zone');
		parent.appendChild(csvButtons);
		_self.csvButtons = csvButtons;
	};

	/** Скрывает кнопки обмена данными в формате csv */
	this.hideCsvButtons = function() {
		if (_self.csvButtons) {
			jQuery(_self.csvButtons).remove();
			_self.csvButtons = false;
		}

		jQuery('#csv-buttons-zone').html('');
	};

	/**
	 * Возвращает ссылку на адрес бекенда, который отвечает за быстрый csv экспорт
	 * @param {Array} relIdList список идентификаторов связанных сущностей, которые могут влиять на результат экспорта
	 * @param {String} encoding кодировка csv файла
	 * @returns {String}
	 */
	this.getExportLink = function(relIdList, encoding) {
		var usedColumns = getUsedColumns();
		var filterQueryString = this.control.getCurrentFilter().getQueryString();

		var path = document.location['pathname'];
		try { // Обработка вариантов, в которых document.location не совпадает с заданным адресом
			var cleanPath = _self.control.dataSet.getPathModuleMethod();
		} catch (err) {
		}

		if (path !== cleanPath && path.indexOf(cleanPath) === 0) {
			var pathDifference = path.substring(cleanPath.length);
			var expr = new RegExp('/([\/0-9]*)/');
			path = (expr.test(pathDifference)) ? path : cleanPath;
		} else {
			path = cleanPath;
		}

		var link = path + filterQueryString + '&xmlMode=force&export=csv';
		for (var i in usedColumns) {
			if (!usedColumns.hasOwnProperty(i)) {
				continue;
			}

			var columnName = usedColumns[i]['name'];

			if (columnName !== 'name') {
				link += '&used-fields[]=' + columnName;
			}
		}

		if (Array.isArray(relIdList)) {
			relIdList.forEach(function(relId) {
				link += '&rel[]=' + relId;
			});
		}

		link += '&hierarchy-level=100';

		var filter = this.control.dataSet.getDefaultFilter();

		if (filter.Langs[0]) {
			link += '&lang_id[]=' + filter.Langs[0];
		}

		if (filter.Domains[0]) {
			link += '&domain_id[]=' + filter.Domains[0];
		}

		if (typeof encoding === 'string' && encoding.length > 0) {
			link += '&encoding=' + encoding;
		}

		return link;
	};

	/**
	 * Линк на импорт
	 * @param elementId
	 * @param encoding
	 * @returns {*}
	 */
	this.getImportLink = function(elementId, encoding) {
		var filterQueryString = this.control.getCurrentFilter().getQueryString();
		var link = document.location['pathname'];
		link += filterQueryString + '&xmlMode=force&import=csv';

		if (elementId) {
			link += '&rel[]=' + elementId;
		}

		if (typeof encoding === 'string' && encoding.length > 0) {
			link += '&encoding=' + encoding;
		}

		return link;
	};

	/**
	 * Разворачивает элемент, если он находится под курсором
	 * Используется в режиме drag&drop
	 * @access private
	 */
	var autoExpandSelf = function() {
		if (_isAutoExpandAllowed && _self === Control.HandleItem) {
			_self.expand();
		}
	};

	this.draw = function() {
		if (_oParent) {
			if (!_forceDrawing) {
				draw(_parent.childsContainer);
			}
		} else {
			if (!_forceDrawing) {
				drawRoot();
			}
		}
	};

	/**
	 * Добавляет дочерний элемент последним в списке
	 * @access public
	 * @param {Array} _oChildData - массив с информацией о новом элементе
	 * @return {Object} - новый элемент
	 */
	this.appendChild = function(_oChildData) {
		return new TableItem(this.control, _self, _oChildData);
	};

	/**
	 * Добавляет дочерний элемент после указанного элемента
	 * @access public
	 * @param {Array} _oChildData - массив с информацией о новом элементе
	 * @param {Object} oItem - элемент, после которого добавится новый
	 * @return {Object} - новый элемент
	 */
	this.appendAfter = function(_oChildData, oItem) {
		return new TableItem(this.control, _self, _oChildData, oItem, 'after');
	};

	/**
	 * Добавляет дочерний элемент перед указанным элементом
	 * @access public
	 * @param {Array} _oChildData - массив с информацией о новом элементе
	 * @param {Object} oItem - элемент, перед которым добавится новый
	 * @return {Object} - новый элемент
	 */
	this.appendBefore = function(_oChildData, oItem) {
		return new TableItem(this.control, _self, _oChildData, oItem, 'before');
	};

	/**
	 * Добавляет дочерний элемент в начало списка
	 * @access public
	 * @param {Array} _oChildData - массив с информацией о новом элементе
	 * @return {Object} - новый элемент
	 */
	this.appendFirst = function(_oChildData) {
		if (this.childsContainer.childNodes.length == 2) {
			return this.appendChild(_oChildData);
		} else if (typeof(this.childsContainer.childNodes[2].rel) != 'undefined') {
			return this.appendBefore(_oChildData, this.control.getItem(this.childsContainer.childNodes[1].rel));
		} else {
			return false;
		}
	};

	/**
	 * Возвращает предыдущего соседа элемента
	 * @access public
	 * @return {Object} предыдущий сосед, либо null
	 */
	this.getPreviousSibling = function() {
		var prevEl = this.element.previousSibling;
		if (prevEl && prevEl.rel) {
			return this.control.getItem(prevEl.rel);
		}
		return null;
	};

	/**
	 * Возвращает последующего соседа элемента
	 * @access public
	 * @return {Object} последующий сосед, либо null
	 */
	this.getNextSibling = function() {
		var prevEl = this.element.nextSibling;
		if (prevEl && prevEl.rel) {
			return this.control.getItem(prevEl.rel);
		}
		return null;
	};

	/**
	 * Удаляет элемент из DOM
	 * @access public
	 */
	this.clear = function() {
		if (this.isRoot) {
			var parent = this.element.parentNode;
			while (parent.firstChild) {
				parent.removeChild(parent.firstChild);
			}
		} else if (this.element.parentNode) {
			this.element.parentNode.removeChild(this.element.nextSibling);
			this.element.parentNode.removeChild(this.element);
		}
	};

	/**
	 * Проверяет, является ли текущий элемент потомком указанного (на всю глубину)
	 * @access public
	 * @param {Object} oItem - элемент
	 * @return {Boolean} true, если является
	 */
	this.checkIsChild = function(oItem) {
		var parent = this.parent;
		while (parent) {
			if (oItem === parent) {
				return true;
			}
			parent = parent.parent;
		}
		return false;
	};

	/**
	 * Возвращает координаты DOM-представления элемента
	 * Метод является обязательным, вызывается Control'ом.
	 * Служит для определения элемента под курсором мыши
	 * @access public
	 */
	this.recalcPosition = function() {
		if (_self.isRoot) {
			return false;
		}
		try {
			var parent = this.parent;
			while (parent) {
				if (!parent.isExpanded) {
					this.position = false;
					return false;
				}
				parent = parent.parent;
			}

			var container = this.control.getRoot().childsContainer;
			var pos = jQuery(_labelControl).position();

			this.position = {
				'left': pos.left,
				'top': pos.top,
				'right': pos.left + container.offsetWidth,
				'bottom': pos.top + jQuery(_labelControl).height()
			};

			return this.position;
		} catch (e) {
			this.position = false;
			return false;
		}
	};

	/**
	 * Выставляет статус загружены/не загружены дети элемента
	 * Метод является обязательным, вызывается Control'ом!
	 * @param {Boolean} loaded - статус
	 * @access public
	 */
	this.setLoaded = function(loaded) {
		this.loaded = loaded;
		if (_toggleControl) {
			_toggleControl.setAttribute('src', _iconsPath + 'collapse.png');
		}
	};

	/**
	 * Возвращает строковое значение поля для помещения его в колонку табличного контрола
	 * @param {Object} field параметры поля @see http://test.com/upage://112.field
	 * @returns {String}
	 * @private
	 */
	var renderField = function(field) {
		if (!field || !field['type']) {
			return '';
		}

		/**
		 * Возвращает значение поля или значение по умолчанию.
		 * @param {Number} [defaultValue] значение по умолчанию
		 */
		var getValueOrDefault = function(defaultValue) {
			return field.value._value || field.value || defaultValue || '';
		};

		switch (field.type) {
			case 'int':
			case 'float':
			case 'price':
			case 'link_to_object_type':
			case 'counter':
				return getValueOrDefault(0);
			case 'tags':
			case 'string':
				return getStringValue();
			case 'color':
				return getColorValue();
			case 'domain_id':
				return getDomainIdValue();
			case 'domain_id_list':
				return getDomainIdListValue();
			case 'text':
				return getValueOrDefault();
			case 'boolean':
				return getBooleanValue();
			case 'img_file':
				return getImageValue();
			case 'video_file':
			case 'swf_file':
			case 'file':
				return getFileValue();
			case 'relation':
				return getRelationValue();
			case 'date':
				return field['value']['formatted-date'];
			case 'optioned':
				return getLabel('js-optioned-value-hidden');
			case 'lang_id':
				return getLangIdValue();
			case 'lang_id_list':
				return getLangIdListValue();
			case 'multiple_file':
			case 'multiple_image':
				return getMultipleFileValue();
			default:
				return '';
		}

		/**
		 * Возвращает значение полей типа "Строка" или "Теги"
		 * @returns {String}
		 */
		function getStringValue() {
			var value = getValueOrDefault();

			if (field.restriction == 'email') {
				return '<a href="mailto:' + value + '" title="' + value + '" class="link">' + value + '</a>';
			}

			if (typeof value === 'object' && Object.prototype.toString.call(value) === '[object Array]') {
				value = value.join(', ');
			}

			if (/https?:\/\//.test(value)) {
				value = '<a href="' + value + '" title="' + value + '" class="link">' + value + '</a>';
			} else {
				value = '<span title="' + value + '">' + value + '</span>';
			}

			return value;
		}

		/**
		 * Возвращает значение полей типа "Цвет"
		 * @returns {String}
		 */
		function getColorValue() {
			var value = field.value ? field.value : '';
			if (value) {
				value = '<div class="color table"><span class="value">' + value +
					'</span><span class="color-box"><i style="background-color: ' + value +
					'"></i></span></div>';
			}

			return value;
		}

		/**
		 * Возвращает значение полей типа "Ссылка на домен"
		 * @returns {String}
		 */
		function getDomainIdValue() {
			var value = getValueOrDefault();
			if (typeof value === 'object' && typeof value.domain === 'object') {
				value = value.domain.host || '';
			}

			return value;
		}

		/**
		 * Возвращает значение полей типа "Ссылка на список доменов"
		 * @returns {String}
		 */
		function getDomainIdListValue() {
			var value = getValueOrDefault();
			if (typeof value !== 'object') {
				return value;
			}

			if (!value.domain[0]) {
				return value.domain.host || '';
			}

			var hostList = [];
			for (var i = 0; i < value.domain.length; i++) {
				var host = value.domain[i].host || '';
				if (!host) {
					continue;
				}

				hostList.push(host);
			}

			return hostList.join(', ');
		}

		/**
		 * Возвращает значение полей типа "Ссылка на язык"
		 * @returns {String}
		 */
		function getLangIdValue() {
			let value = getValueOrDefault();
			if (typeof value === 'object' && typeof value.lang === 'object') {
				value = value.lang._value || '';
			}

			return value;
		}

		/**
		 * Возвращает значение полей типа "Ссылка на список языков"
		 * @returns {String}
		 */
		function getLangIdListValue() {
			let value = getValueOrDefault();
			if (typeof value !== 'object') {
				return value;
			}

			if (!value.lang[0]) {
				return value.lang._value || '';
			}

			let langList = [];
			for (let i = 0; i < value.lang.length; i++) {
				let lang = value.lang[i]._value || '';
				if (!lang) {
					continue;
				}

				langList.push(lang);
			}

			return langList.join(', ');
		}

		/**
		 * Возвращает значение полей типа "Кнопка-флажок"
		 * @returns {String}
		 */
		function getBooleanValue() {
			if (getValueOrDefault()) {
				return '<img alt="" style="width:13px;height:13px;" src="/styles/skins/modern/design/img/tree/checked.png" />';
			}
			return '';
		}

		/**
		 * Возвращает значение полей типа "Изображение"
		 * @returns {String}
		 */
		function getImageValue() {
			var value = field.value;
			if (!value) {
				return '';
			}

			var src = value._value;
			var path = src.substring(0, src.lastIndexOf('.'));
			var filename = '';

			if (typeof src == 'string') {
				tmp = src.split(/\//);
				filename = tmp[tmp.length - 1];
			}

			if (value.is_broken == '1') {
				value = '<span title="404" style="color:red;font-weight: bold;cursor: pointer;">?</span>';
				value += '&nbsp;&nbsp;<span style="text-decoration: line-through;" title="' + src + '">' + filename + '</span>';
			} else {
				var ext = value.ext;
				var thumbSrc = '/autothumbs.php?img=' + path + '_sl_180_120.' + ext;
				value = '<img alt="" style="width:13px;height:13px;cursor: pointer;" src="/styles/skins/modern/design/img/image.png" onmouseover="TableItem.showPreviewImage(event, \'' + thumbSrc + '\')" />';
				value += '&nbsp;&nbsp;<span title="' + src + '">' + filename + '</span>';
			}

			return value;
		}

		/**
		 * Возвращает значение полей типа "Файл", "Видео-файл" и "Флэш-ролик"
		 * @returns {String}
		 */
		function getFileValue() {
			var value = field.value;
			if (!value) {
				return '';
			}

			src = value._value;
			if (value.is_broken == '1') {
				value = src ? ('<span style="text-decoration: line-through;" title="' + src + '">' + src + '</span>') : '';
			} else {
				value = src ? ('<span title="' + src + '">' + src + '</span>') : '';
			}

			return value;
		}

		/**
		 * Возвращает значение полей типа "Выпадающий список" и
		 * "Выпадающий список со множественным выбором"
		 * @returns {String}
		 */
		function getRelationValue() {
			var relation = getValueOrDefault();
			if (!relation) {
				return '';
			}

			var value = '';
			if (relation.item[0]) {
				for (var i = 0; i < relation.item.length; i++) {
					value += relation.item[i].name;

					if (i < relation.item.length - 1) {
						value += ', ';
					}
				}

				value = '<span title="' + value + '">' + value + '</span>';
			} else {
				value = relation.item.name;

				var guid = 'relation-value';
				if (relation.item.guid != undefined) {
					guid = relation.item.guid;
				}

				value = '<span title="' + value + '" class="c-' + guid + '">' + value + '</span>';
			}

			return value;
		}

		/**
		 * Возвращает значение полей типа "Набор файлов" и "Набор изображений"
		 * @returns {String}
		 */
		function getMultipleFileValue() {
			let value = Array.isArray(field.value) ? field.value : [field.value];
			let type = field.type;
			let val = '',str = '';
			$.each(value, function(i, file) {
				if (type == 'multiple_image') {
					let path = file._value.substring(0, file._value.lastIndexOf('.'));
					let ext = file.ext;
					let thumbSrc = "/autothumbs.php?img=" + path + '_sl_180_120.' + ext;
					str = 'src="/styles/skins/modern/design/img/image.png" onmouseover="TableItem.showPreviewImage(event, \'' + thumbSrc + '\')" />&nbsp;';
				} else {
					str = 'src="/styles/skins/modern/design/img/ico_file.gif" title="' + file._value + '"/>&nbsp;';
				}
				val += '<img alt="" style="width:13px;height:13px;cursor: pointer;" ' + str;
			});

			return val;
		}
	};

	/**
	 * Возвращает значение свойства по имени
	 * @param {String} fieldName - имя свойства
	 * @return {String} значение свойства, либо false, в случае неудачи
	 */
	this.getValue = function(fieldName) {
		var usedColumns = getUsedColumns();
		var column = usedColumns[fieldName];

		if (fieldName === 'name') {
			return this.control.onGetValueCallback(this.name, fieldName, this);
		}

		if (column && column.params[1] === 'static') {
			return this.control.onGetValueCallback(column, fieldName, this);
		}

		if (!_data['properties'] || !_data['properties']['group']) {
			return '&nbsp;';
		}

		var property = this.getProperty(fieldName);

		if (property === null) {
			return this.control.onGetValueCallback('', fieldName, this);
		}

		property = this.control.onGetValueCallback(property, fieldName, this);
		return renderField(property);
	};

	/**
	 * Возвращает свойство объекта по имени
	 * @param {String} fieldName - имя свойства
	 * @returns {Object|null} свойство, либо null, в случае неудачи
	 */
	this.getProperty = function(fieldName) {
		if (!_data['properties'] || !_data['properties']['group']) {
			return null

		}

		var groupList = typeof(_data['properties']['group'][0]) != 'undefined' ? _data['properties']['group'] : [_data['properties']['group']];

		for (var i = 0; i < groupList.length; i++) {

			if (!groupList[i]['property']) {
				continue;
			}

			var propertyList = typeof(groupList[i]['property'][0]) != 'undefined' ? groupList[i]['property'] : [groupList[i]['property']];

			for (var j = 0; j < propertyList.length; j++) {

				if (propertyList[j]['name'] !== fieldName) {
					continue;
				}

				return propertyList[j];
			}
		}

		return null
	};

	/**
	 * Получить данные, которые отдал DataSet
	 * @return Array объект со свойствами
	 */
	this.getData = function() {
		return _data;
	};

	/**
	 * Выставляет pageing у item'а и заполняет pagesBar страницами
	 * @param {Object} pageing объект с информацией о пагинации
	 */
	this.setPageing = function(pageing) {
		if (!pageing || !_pagesBar) {
			return false;
		}

		this.pageing = pageing;
		_pagesBar.parentNode.style.display = 'none';
		_pagesBar.classList.add('panel-sorting');
		_pagesBar.innerHTML = '';
		_pagesBar.style.textAlign = 'left';

		if (this.isRoot) {
			this.setPageingLimits(pageing);
		}

		if (pageing.total <= pageing.limit && pageing.offset <= 0) {
			return;
		}

		_pagesBar.parentNode.style.display = '';

		var getCallback = function(page) {
			return function() {
				_self.filter.setPage(page);
				_self.applyFilter(_self.filter, true);
				return false;
			};
		};

		var totalPages = Math.ceil(pageing.total / pageing.limit);
		var currentPage = Math.ceil(pageing.offset / pageing.limit);
		var nextPage;
		var drawEllipsis = true;

		var FIRST_PAGE = 0;
		var LAST_PAGE = (Math.ceil(pageing.total / pageing.limit) - 1);
		var NUMBER_OF_PAGES_SHOWN = 1;

		var isHiddenPage = function(page) {
			return (page != FIRST_PAGE && page != LAST_PAGE && (Math.abs(page - currentPage) > NUMBER_OF_PAGES_SHOWN));
		};

		for (var page = 0; page < totalPages; page += 1) {
			if (isHiddenPage(page)) {
				if (drawEllipsis) {
					nextPage = document.createElement('a');
					nextPage.href = '#';
					nextPage.innerHTML = '…';
					nextPage.className = 'pagination-ellipsis';
					nextPage.onclick = function() {
						return false;
					};
					_pagesBar.appendChild(nextPage);
				}

				drawEllipsis = false;
				continue;
			}

			drawEllipsis = true;
			nextPage = document.createElement('a');
			nextPage.href = '#';

			if (currentPage == page) {
				nextPage.className = 'current';
			}

			nextPage.innerHTML = page + 1;
			nextPage.onclick = getCallback(page);

			_pagesBar.appendChild(nextPage);
		}
	};

	/**
	 * Разворачивает элемент
	 * Метод является обязательным, вызывается Control'ом!
	 * @access public
	 */
	this.expand = function() {
		if (!this.hasChilds) {
			return false;
		}

		this.isExpanded = true;
		if (!this.loaded) {
			this.loaded = true;
			this.initFilter(_id);
			this.control.load(this.filter);
		}
		if (_toggleControl) {
			_toggleControl.classList.add('switch');
		}

		this.childsContainer.style.display = '';
		$(this.childsContainer).find('.checkbox input:checked').parent().addClass('checked');
		$(this.childsContainer).find('.checkbox').on('click', function() {
			$(this).toggleClass('checked');
		});

		if (this.loaded) {
			Control.recalcItemsPosition();
		}

		this.control.saveItemState(this.id);
	};

	/**
	 * Сворачивает элемент
	 * Метод является обязательным, вызывается Control'ом!
	 * @access public
	 */
	this.collapse = function() {
		if (!this.hasChilds) {
			return false;
		}

		this.isExpanded = false;
		if (_toggleControl) {
			_toggleControl.classList.remove('switch');
		}
		this.childsContainer.style.display = 'none';
		Control.recalcItemsPosition();
		this.control.saveItemState(this.id);
	};

	/**
	 * Сворачивает/разворачивает элемент в зависимости от текущего состояния
	 * Метод является обязательным, вызывается Control'ом!
	 * @access public
	 */
	this.toggle = function(el) {
		if (this.hasChilds) {
			$(el).toggleClass('switch');
			this.isExpanded ? this.collapse() : this.expand();
		}
	};

	/**
	 * Обновляет элемент, используя новые данные о нем
	 * @param {Array} _oNewData - новые данные о элементе
	 * Метод является обязательным, вызывается Control'ом!
	 * @access public
	 */
	this.update = function(_oNewData) {
		if (_oNewData) {
			if (this.id != _oNewData.id) {
				return false;
			}

			_data = _oNewData;

			if (typeof(_oNewData['template-id']) !== 'undefined') {
				this.templateId = _oNewData['template-id'];
			}

			if (typeof(_oNewData['link']) !== 'undefined' && _oNewData['link'] != this.viewLink) {
				this.viewLink = _oNewData['link'];
				_labelControl.setAttribute('href', this.viewLink);
			}

			if (typeof(_oNewData['childs']) !== 'undefined' && parseInt(_oNewData['childs']) !== _childrenCount) {
				_childrenCount = parseInt(_oNewData['childs']);
				this.hasChilds = _childrenCount > 0 || _id == 0;
				var toggleWrapper = $('td.table-cell > div > span:first', _labelControl);

				if (_self.hasChilds) {
					toggleWrapper.removeClass('catalog-toggle-off');
					toggleWrapper.removeClass('switch');
					toggleWrapper.addClass('catalog-toggle-wrapper');
					toggleWrapper.empty();

					_toggleControl = document.createElement('span');
					_toggleControl.className = 'catalog-toggle switch';
					_toggleControl.src = '/styles/skins/modern/design/img/tree/collapse.png';
					toggleWrapper.append(_toggleControl);
				} else {
					toggleWrapper.removeClass('catalog-toggle-wrapper');
					toggleWrapper.removeClass('switch');
					toggleWrapper.addClass('catalog-toggle-off');
					toggleWrapper.empty();
				}
			}

			var newActive = typeof(_oNewData['is-active']) !== 'undefined' ? parseInt(_oNewData['is-active']) : 0;
			if (newActive !== this.isActive) {
				this.isActive = newActive;
				this.isActive = isObjectActivated(this, this.isActive);
				if (!this.isActive && !_self.control.objectTypesMode) {
					jQuery(_self.row).addClass('disabled');
				} else {
					jQuery(_self.row).removeClass('disabled');
				}

				if (_activeColumn) {
					jQuery('div', _activeColumn).html(renderField({'type': 'boolean', 'value': this.isActive}));
				}
			}

			if (typeof(_oNewData['name']) !== 'undefined' && _oNewData['name'] != this.name) {
				this.name = _oNewData['name'].length ? _oNewData['name'] : '';
				_labelText.innerHTML = this.name.length ? this.name : getLabel('js-smc-noname-page');
			}

		}
	};

	/**
	 * Устанавливает фильтр для детей элемента и обновляет содержимое, если потребуется
	 * @access public
	 * @param _Filter
	 * @param ignoreHierarchy
	 */
	this.applyFilter = function(_Filter, ignoreHierarchy) {

		if (_Filter instanceof Object) {
			this.filter = _Filter;
		} else {
			this.filter.clear();
		}

		this.initFilter(!ignoreHierarchy);

		if (this.loaded) {
			this.control.removeItem(_id, true);
			this.loaded = false;
			if (this.isExpanded) {
				this.expand();
			}
		}
	};

	/**
	 * Инициализирует фильтр
	 * @param {Boolean} hasParent имеет ли фильтруемый датасет родительский элемент
	 */
	this.initFilter = function(hasParent) {
		if (hasParent) {
			this.initRelationFilter();
		}
		if (!_objectTypesMode || !hasParent) {
			this.initSearchQuery();
		}
	};

	/**
	 * Инициализирует фильтр по иерархии
	 */
	this.initRelationFilter = function() {
		this.filter.setParentElements(_id);
	};

	/**
	 * Инициализирует фильтр по поисковой строке
	 */
	this.initSearchQuery = function() {
		var searchStorage = new SearchAllTextStorage(this.control.id);
		var searchValueList = searchStorage.load();

		if (searchValueList.length > 0) {
			this.filter.setAllTextSearch(searchValueList);
		}
	};

	this.check = function() {
		if (_hasCheckbox) {
			$(_self.checkBox).toggleClass('checked');
		}
	};

	/**
	 * Определяет есть ли у элемента чекбокс
	 * @returns {Boolean}
	 */
	this.isCheckboxAvailable = function() {
		return _hasCheckbox;
	};

	/**
	 * Устанавливает или снимает выделение элемента
	 * @param {Boolean} selected если true, то элемент будет выделен, если false, то выделение
	 * будет снято
	 */
	this.setSelected = function(selected) {
		if (selected) {
			if (!_oldClassName) {

				_oldClassName = _labelControl.className;
				_labelControl.classList.add('selected');
			}

			if (_hasCheckbox) {
				$(this.checkBox).addClass('checked');
			}

			_selected = true;
		} else {
			if (_oldClassName) {
				_oldClassName = null;
			}
			$(_labelControl).removeClass('selected');
			if (_hasCheckbox) {
				$(this.checkBox).removeClass('checked');
			}

			_selected = false;
		}
	};

	this.getSelected = function() {
		return _selected;
	};

	/**
	 * Рисуем кнопочки с выбором количества элементов на страницу
	 * @param pageing
	 */
	this.setPageingLimits = function(pageing) {
		var getCallback = function(limit) {
			return function() {
				_self.filter.setPage(0);
				_self.filter.setLimit(limit);
				_self.applyFilter(_self.filter, true);
				return false;
			};
		};
		var root = document.getElementById('per_page_limit');
		root.innerHTML = '<span>' + getLabel('js-label-elements-per-page') + '</span>';
		for (var i in _self.pageLimits) {
			var link = document.createElement('a');
			link.className = 'per_page_limit';
			link.rel = '0';
			link.innerHTML = _self.pageLimits[i];
			link.onclick = getCallback(_self.pageLimits[i]);
			if (_self.pageLimits[i] == pageing.limit) {
				link.className += ' current';
			}
			root.appendChild(link);
		}
	};

	/**
	 * Возвращает ссылку на страницу элемента
	 * @return {String} ссылка на страницу элемента
	 */
	this.getUrl = function() {
		var tds = TemplatesDataSet.getInstance();
		var domains = tds.getDomainsList();

		if (!domains) {
			return _self.viewLink;
		}

		for (var n in domains) {
			if (domains[n].id == _self.domainId) {
				return domains[n].url + _self.viewLink;
			}
		}

		return _self.viewLink;
	}

	constructor();
};

TableItem.minColumnWidth = 150;
TableItem.maxColumnWidth = 800;

/**
 * Сортирвока по колонкам дефолт asc
 * asc -> ""
 * desc-> "switch"
 * не активная -> "disabled"
 * @param _FieldName
 * @param _Control
 * @param _ColumnEl
 * @returns {boolean}
 */
TableItem.orderByColumn = function(_FieldName, _Control, _ColumnEl) {
	if (!_Control || !_FieldName || !_ColumnEl) {
		return false;
	}

	var direction, className = '';
	if (_Control.orderColumn === _ColumnEl) {
		className = _ColumnEl.classList.contains('switch') ? '' : 'switch';
		if (className == '') {
			_ColumnEl.classList.remove('switch');
		}
		if (className !== '') {
			_ColumnEl.classList.add(className);
		}
	} else {
		if (_Control.orderColumn) {
			_Control.orderColumn.classList.remove('switch');
			_Control.orderColumn.classList.add('disabled');
		}
		_Control.orderColumn = _ColumnEl;
		_Control.orderColumn.classList.remove('disabled');
	}
	direction = (className == '' ? 'asc' : 'desc');
	var defFilter = _Control.dataSet.getDefaultFilter();
	defFilter.setOrder(_FieldName, direction);
	_Control.dataSet.setDefaultFilter(defFilter);

	_Control.applyFilter();
};

TableItem.showPreviewImage = function(event, src) {
	if (!event || !src) {
		return;
	}
	var el = event.target ? event.target : event.toElement;
	var x = event.pageX ? event.pageX : event.clientX;
	var y = event.pageY ? event.pageY : event.clientY;

	var img = document.createElement('img');
	img.setAttribute('src', src);
	img.src = src;
	img.className = 'img-fieled-preview';
	img.style.position = 'absolute';
	img.style.width = '180px';
	img.style.height = '120px';
	img.style.top = y + 10 + 'px';
	img.style.left = x + 10 + 'px';
	img.style.border = '1px solid #666';

	document.body.appendChild(img);

	el.onmouseout = function() {
		img.parentNode.removeChild(img);
	};

};

/**
 * TreeToolbar
 * use Prototype
 */

var TreeToolbar = function(_oControl) {
	/** (Private properties) */
	var __self = this;
	var Control = _oControl;
	var HandleItem = null;
	var cDepth = parseInt(Control.container.style.zIndex) || 0;
	var DataSet = Control.dataSet;
	var selected_count = 0;
	/** (Public properties) */
	this.highlight = null;
	this.element = null;
	this.buttons = [];

	/** (Private methods) */
	var __drawButtons = function() {
		var btns = document.getElementById('tree_toolbar_' + Control.uid);

		// create
		__appendButton(btns, {
			name: 'ico_add',
			className: 'i-add',
			hint: getLabel('js-add-subpage'),
			init: function(button) {
				var isHandleItemCorrect = (HandleItem !== null && typeof HandleItem.createLink === 'string');
				var isOperationPermitted = false;

				if (isHandleItemCorrect) {
					isOperationPermitted = (
						HandleItem.permissions && HandleItem.permissions & 4 || !HandleItem.permissions
					);
				}

				if (isHandleItemCorrect && isOperationPermitted && __isOnlyOneItemSelected) {
					button.element.setAttribute('href', HandleItem.createLink);
					button.element.classList.remove('disabled');
				} else {
					button.element.classList.add('disabled');
				}
			}
		});
		// edit
		__appendButton(btns, {
			name: 'ico_edit',
			className: 'i-edit',
			hint: getLabel('js-edit-page'),
			init: function(button) {
				var isHandleItemCorrect = (HandleItem !== null && HandleItem.editLink !== false);
				var isOperationPermitted = false;

				if (isHandleItemCorrect) {
					isOperationPermitted = HandleItem.permissions & 2;
				}

				if (isHandleItemCorrect && isOperationPermitted && __isOnlyOneItemSelected) {
					var hint = getLabel('js-edit-page');
					var href = HandleItem.editLink;
					button.element.classList.remove('disabled');

					if (HandleItem.lockedBy) {
						hint = getLabel('js-page-is-locked');
						href = '#';
						button.element.classList.add('disabled');
					}

					button.element.setAttribute('title', hint);
					button.element.setAttribute('href', href);
				} else {
					button.element.classList.add('disabled');
				}
			},
			release: function() {
				if (HandleItem !== null) {
					if (HandleItem.lockedBy) {
						alert(getLabel('js-page-is-locked'));
						return false;
					}
				}
				return true;
			}
		});
		// blocking
		__appendButton(btns, {
			name: 'blocking',
			className: 'i-hidden',
			hint: getLabel('js-disable-page'),
			init: function(button) {
				if (HandleItem !== null && HandleItem.allowActivity) {
					var className = __getCssClassForActivityIcon(HandleItem.isActive);
					var hint = __getTitleForActivityIcon(HandleItem.isActive);
					button.element.firstChild.className = className;
					button.element.setAttribute('href', '#');
					button.element.setAttribute('title', hint);
					button.element.classList.remove('disabled');
				} else {
					button.element.classList.add('disabled');
				}
			},
			release: function(button) {
				if (HandleItem !== null) {
					var className = '';
					var hint = '';
					var recursiveOperator = new PageTreeRecursiveOperator(_oControl);

					if (__isOnlyOneItemSelected()) {
						className = __getCssClassForActivityIcon(!HandleItem.isActive);
						hint = __getTitleForActivityIcon(!HandleItem.isActive);
						button.element.setAttribute('title', hint);
						button.element.firstChild.className = className;
						recursiveOperator.switchActivity(HandleItem.id, !HandleItem.isActive);
					} else {
						var selectedItemsList = __getSelectedItemsList();
						var hasTrue = false, hasFalse = false;

						for (var index in selectedItemsList) {
							if (!selectedItemsList.hasOwnProperty(index)) {
								continue;
							}

							var item = selectedItemsList[index];

							if (item.isActive) {
								hasTrue = true;
							} else {
								hasFalse = true;
							}
						}

						var needToActivate = (!hasTrue && hasFalse);
						className = __getCssClassForActivityIcon(needToActivate);
						hint = __getTitleForActivityIcon(needToActivate);
						button.element.setAttribute('title', hint);
						button.element.firstChild.className = className;

						var pageIdList = __getSelectedItemsIdList();
						recursiveOperator.switchActivity(pageIdList, needToActivate);
					}
				}
				return false;
			}
		});
		// virtual copy
		__appendButton(btns, {
			name: 'copy',
			className: 'i-copy-virtual',
			hint: getLabel('js-vcopy-str'),
			init: function(button) {
				if (HandleItem !== null && HandleItem.allowCopy && __isOnlyOneItemSelected()) {
					button.element.classList.remove('disabled');
				} else {
					button.element.classList.add('disabled');
				}
			},
			release: function() {
				if (HandleItem !== null) {
					HandleItem.className = 'ti virtual';

					if (HandleItem.isDefault) {
						HandleItem.labelControl.className += ' main-page';
					}

					HandleItem.isVirtualCopy = true;
					DataSet.execute('tree_copy_element', {
						'element': HandleItem.id,
						'childs': 1,
						'links': 1,
						'virtuals': 1,
						'permissions': 1,
						'handle_item': HandleItem,
						'copy_all': 0
					});
				}
				return false;
			}
		});
		// real copy
		__appendButton(btns, {
			name: 'clone',
			className: 'i-copy',
			hint: getLabel('js-copy-str'),
			init: function(button) {
				if (HandleItem !== null && HandleItem.allowCopy && __isOnlyOneItemSelected()) {
					button.element.classList.remove('disabled');
				} else {
					button.element.classList.add('disabled');
				}
			},
			release: function() {
				if (HandleItem !== null) {
					DataSet.execute('tree_copy_element', {
						'element': HandleItem.id,
						'childs': 1,
						'links': 1,
						'permissions': 1,
						'handle_item': HandleItem,
						'copy_all': 0,
						'clone_mode': 1
					});
				}
				return false;
			}
		});
		// view
		__appendButton(btns, {
			name: 'view',
			className: 'i-see',
			hint: getLabel('js-view-page'),
			init: function(button) {
				if (HandleItem !== null && HandleItem.viewLink !== false && __isOnlyOneItemSelected()) {
					button.element.setAttribute('href', HandleItem.getUrl());
					button.element.setAttribute('target', '_blank');
					button.element.classList.remove('disabled');
				} else {
					button.element.classList.add('disabled');
				}
			}
		});
		// delete
		__appendButton(btns, {
			name: 'ico_del',
			className: 'i-remove',
			hint: getLabel('js-del-str'),
			init: function(button) {
				var hint = getLabel('js-delete');
				var isHandleItemCorrect = (HandleItem !== null && HandleItem.id > 0);
				var isOperationPermitted = false;

				if (isHandleItemCorrect) {
					isOperationPermitted = (
						HandleItem.permissions && HandleItem.permissions & 8 || !HandleItem.permissions
					);
				}

				if (isHandleItemCorrect && isOperationPermitted) {
					button.element.setAttribute('title', hint);
					button.element.setAttribute('href', '#');
					button.element.classList.remove('disabled');
				} else {
					button.element.classList.add('disabled');
				}
			},
			release: function() {
				if (HandleItem !== null) {
					if (HandleItem.lockedBy) {
						alert(getLabel('js-page-is-locked'));
					} else {
						var recursiveOperator = new PageTreeRecursiveOperator(_oControl);
						var showConfirmation = true;

						if (__isOnlyOneItemSelected()) {
							recursiveOperator.putToTrash(HandleItem.id, showConfirmation);
						} else {
							var selectedItemsList = __getSelectedItemsList();

							for (var i = 0, cnt = selectedItemsList.length; i < cnt; i++) {
								var item = selectedItemsList[i];

								if (item.lockedBy) {
									alert(getLabel('js-page-is-locked') + '\n' + getLabel('js-steal-lock-question'));
									ContextMenu.getInstance().terminate();
									return false;
								}
							}

							var pageIdList = __getSelectedItemsIdList();
							recursiveOperator.putToTrash(pageIdList, showConfirmation);
						}
					}
				}
				return false;
			}
		});

		//Создаем кнопки с выпадающими списками
		//домены
		var wr2 = document.createElement('ul');
		__appendDropdownButton(wr2, {
			name: 'copy-other',
			className: 'i-copy-other',
			hint: getLabel('js-crossdomain-copy'),
			chEl: true,
			init: function(button) {
				var templButtons = __getDomainsLang();
				button.chEl.innerHTML = '';
				for (var i = 0, cnt = templButtons.length; i < cnt; i++) {
					__appendDropdownButton(button.chEl, templButtons[i]);
				}

				if (HandleItem !== null) {
					button.element.classList.remove('disabled');
				} else {
					button.element.classList.add('disabled');
				}
			}
		});

		btns.appendChild(wr2);

		btns.onclick = function(e) {
			e.stopPropagation();
		};

		//Выделить все
		__appendButton(btns, {
			name: 'selectAll',
			className: 'i-select',
			hint: getLabel('js-select-all'),
			alwaysActive: true,
			init: function(button) {
				button.element.classList.remove('disabled');
			},
			release: function() {
				Control.select(Control.items);
			}
		});

		__appendButton(btns, {
			name: 'unSelectAll',
			className: 'i-unselect',
			hint: getLabel('js-un-select-all'),
			alwaysActive: true,
			init: function(button) {
				button.element.classList.remove('disabled');
			},
			release: function() {
				Control.unSelect(Control.items);
				__self.hide();
			}
		});

		__appendButton(btns, {
			name: 'invertAll',
			className: 'i-invertselect',
			hint: getLabel('js-invert-all'),
			init: function(button) {
				if (HandleItem !== null) {
					button.element.classList.remove('disabled');
				} else {
					button.element.classList.add('disabled');
				}
			},
			release: function() {
				Control.forEachItem(Control.items, function(item) {
					Control.toggleItemSelection(item);
				});
			}
		});

		__self.element = btns;
		__disableButtons();
	};

	var __initButtons = function() {
		selected_count = __getSelectedItemsListCount();
		for (var i = 0; i < __self.buttons.length; i++) {
			__self.buttons[i].init(__self.buttons[i]);
		}
	};

	var __disableButtons = function() {
		selected_count = __getSelectedItemsListCount();
		for (var i = 0; i < __self.buttons.length; i++) {
			if (!__self.buttons[i].isAllwaisActive) {
				__self.buttons[i].element.classList.add('disabled');
			}
		}
	};

	/** @deprecated */
	var __getTemplatesFunctions = function() {
		return [];
	};

	var __getDomainsLang = function() {
		var control = HandleItem.control;
		var items = __getSelectedItemsList();
		var i, j, item, domainId = false, langId = false;
		for (i in items) {
			item = items[i];
			domainId = item.domainId;
			langId = item.langId;
		}

		var tds = TemplatesDataSet.getInstance();
		var langsList = tds.getLangsList();
		var domainList = tds.getDomainsList();

		var getClickCallback = function(button) {
			var i, ids = [];
			for (i in items) {
				ids.push(i);
			}

			DataSet.addEventHandler('onBeforeExecute', createConfirm(control.dataSet));
			DataSet.execute('copyElementToSite', {
				'element': ids,
				'lang-id': button.data.langId,
				'domain-id': button.data.domainId,
				'templates': 1,
				'childs': 1,
				'permissions': 1,
				'virtuals': 1,
				'links': 1
			});

			return false;
		};

		var menuItems = [];
		for (i = 0; i < domainList.length; i++) {
			var d = domainList[i];

			var checked = (domainId == d['id']);

			var smenuItems = [];
			for (j = 0; j < langsList.length; j++) {
				var lang = langsList[j];

				var schecked = checked && (langId == lang['id']);

				smenuItems.push({
					className: schecked ? 'checked' : 'undefined',
					caption: lang['nodeValue'],
					data: {domainId: d['id'], langId: lang['id']},
					release: getClickCallback
				});
			}

			menuItems.push({
				className: checked ? 'checked' : 'undefined',
				caption: d['host'],
				chEl: true,
				submenu: smenuItems
			});
		}

		return menuItems;
	};

	var __appendDropdownButton = function(container, options) {
		var el = document.createElement('li');
		container.appendChild(el);
		if (options.chEl) {
			options.chEl = document.createElement('ul');
		}
		__appendButton(el, options);
	};

	/**
	 * Проверяет, что в контроле выделен только один элемент
	 * @returns {Boolean} результат проверки
	 * @private
	 */
	var __isOnlyOneItemSelected = function() {
		return (__getSelectedItemsListCount() == 1);
	};

	/**
	 * Возвращает список выделенных элементов
	 * @returns {TableItem[]|TreeItem[]}
	 * @private
	 */
	var __getSelectedItemsList = function() {
		return Control.selectedList;
	};

	/**
	 * Возвращает список идентификатор выделенных элементов
	 * @returns {Array|*}
	 * @private
	 */
	var __getSelectedItemsIdList = function() {
		return Object.keys(__getSelectedItemsList());
	};

	/**
	 * Возвращает количество выделенных элементов
	 * @returns {Number}
	 * @private
	 */
	var __getSelectedItemsListCount = function() {
		var selectedIdList = __getSelectedItemsIdList();
		return selectedIdList.length;
	};

	/**
	 * Возвращает CSS класс иконки активности элемента
	 * @param {Boolean} isActive активность элемента
	 * @returns {String}
	 * @private
	 */
	var __getCssClassForActivityIcon = function(isActive) {
		return isActive ? 'small-ico i-hidden' : 'small-ico i-vision';
	};
	
	/**
	 * Возвращает описание иконки активности элемента
	 * @param {Boolean} isActive активность элемента
	 * @returns {String}
	 * @private
	 */
	var __getTitleForActivityIcon = function(isActive) {
		return isActive ? getLabel('js-disable-page') : getLabel('js-enable-page');
	};

	var __appendButton = function(container, options) {
		var b = document.createElement('a');
		b.className = 'icon-action';
		var name = options.name || 'toolbtn';
		var caption = options.caption || '';
		var href = options.href || null;
		var className = 'small-ico ' + (options.className || '');
		var init = options.init || function() {
		};
		var title = options.hint || '';
		var data = options.data || null;
		var chEl = options.chEl || null;
		var isAllwaisActive = options.alwaysActive || false;

		var i = document.createElement('i');
		i.className = className;
		b.appendChild(i);

		var el = container.appendChild(b);
		if (chEl !== null) {
			container.appendChild(chEl);
		}

		var button = {
			'name': name,
			'href': href,
			'className': className,
			'init': init,
			'element': el,
			'data': data,
			'caption': caption,
			'chEl': chEl,
			'isAllwaisActive': isAllwaisActive
		};

		__self.buttons.push(button);

		if (href !== null) {
			el.setAttribute('href', href);
		}

		el.setAttribute('title', title);
		$(el).data('info', data);

		if (caption !== '') {
			el.innerHTML = caption;
			el.className = (options.className && options.className != 'undefined' ? options.className : '');
		}

		if (typeof(options.release) === 'function') {
			el.onclick = function(e) {
				if (!DataSet.isAvailable()) {
					return false;
				}

				e.stopPropagation();
				if (HandleItem !== null && !$(this).hasClass('disabled') || isAllwaisActive) {
					return options.release(button);
				}
			};
			el.onmouseup = function(e) {
				e.stopPropagation();
			};
		} else {
			el.onclick = function(e) {
				e.stopPropagation();
				if (!DataSet.isAvailable()) {
					return false;
				}

				if (HandleItem !== null && HandleItem.focus || isAllwaisActive) {
					HandleItem.focus();
				}

				return true;
			};
			el.onmouseup = function(e) {
				e.stopPropagation();
			};
		}

		el.name = name;

		if (chEl !== null && options.submenu != undefined && options.submenu.length > 0) {
			for (var i = 0, cnt = options.submenu.length; i < cnt; i++) {
				__appendDropdownButton(chEl, options.submenu[i]);
			}
		}
	};

	var __draw = function() {
		var el = document.createElement('div');
		el.className = 'tree-highlight';
		el.style.display = 'none';
		el.style.position = 'absolute';
		el.style.zIndex = cDepth - 1;

		__self.highlight = Control.container.appendChild(el);

		__drawButtons();

	};

	/** (Public methods) */
	this.show = function(_HandleItem, bForce) {
		bForce = bForce || false;

		if (typeof(_HandleItem) === 'undefined' || (HandleItem === _HandleItem && !bForce)) {
			return false;
		}

		HandleItem = _HandleItem;

		if (HandleItem.isDefault) {
			HandleItem.labelControl.className += ' main-page';
		}

		__initButtons();
		this.element.style.display = '';
	};

	this.hide = function() {
		if (HandleItem) {
			if (HandleItem.getSelected()) {
				HandleItem.labelControl.classList.add('selected');
			} else if (HandleItem.isVirtualCopy) {
				HandleItem.labelControl.classList.add('virtual');
			} else {
				HandleItem.labelControl.classList.remove('virtual');
				HandleItem.labelControl.classList.remove('selected');
			}

			if (HandleItem.isDefault) {
				HandleItem.labelControl.className += ' main-page';
			}

			HandleItem = null;
		}
		__disableButtons();
	};

	if (typeof(Control) === 'object') {
		__draw();
	} else {
		alert('Can\'t create toolbar without control object');
	}

	/**
	 * Возвращает кнопку тулбара по ее имени
	 * @param {String} name имя кнопки
	 * @returns {*}
	 */
	this.getButton = function(name) {
		return _.findWhere(this.buttons, {name: name});
	};
};


/**
 * TableToolbar
 * use Prototype
 */

var TableToolbar = function(_oControl) {
	/** (Private properties) */
	var __self = this;
	var Control = _oControl;
	var HandleItem = null;
	var cDepth = parseInt(Control.container.style.zIndex) || 0;
	var DataSet = Control.dataSet;

	/** (Public properties) */
	this.TableTollbarFunctions = {
		delButton: {
			name: 'ico_del',
			className: 'i-remove',
			hint: getLabel('js-delete'),
			init: function(button) {
				var $button = $(button.element);
				if (HandleItem !== undefined && __isDeletionAllowed(HandleItem)) {
					$button.removeClass('disabled');
				} else {
					$button.addClass('disabled');
				}
			},
			release: function() {
				if (HandleItem === undefined) {
					return false;
				}

				var selectedItemIdList = __getSelectedItemIdList();

				if (_oControl.contentType === 'pages') {
					var recursiveOperator = new PageTreeRecursiveOperator(_oControl);
					var showConfirmation = true;
					recursiveOperator.putToTrash(selectedItemIdList, showConfirmation);
					return false;
				}

				// старая логика для удаления объектов
				DataSet.execute('tree_delete_element', {
					'element': selectedItemIdList,
					'selected_items': Control.selectedList
				});
				return false;
			}
		},
		killPageButton: {
			name: 'ico_kill_page',
			className: 'i-remove',
			hint: getLabel('js-delete'),
			init: function(button) {
				var $button = $(button.element);
				if (HandleItem !== undefined && __isDeletionAllowed(HandleItem)) {
					$button.removeClass('disabled');
				} else {
					$button.addClass('disabled');
				}
			},
			release: function() {
				if (HandleItem === undefined) {
					return false;
				}

				var selectedItemIdList = __getSelectedItemIdList();
				var recursiveOperator = new PageTreeRecursiveOperator(_oControl);
				var showConfirmation = true;
				recursiveOperator.remove(selectedItemIdList, showConfirmation);

				return false;
			}
		},
		editButton: {
			name: 'ico_edit',
			className: 'i-edit',
			hint: getLabel('js-edit-item'),
			init: function(button) {
				var $button = $(button.element);
				if (HandleItem !== undefined && HandleItem.editLink !== false && __isEditingAllowed(HandleItem)) {
					$button.attr('href', HandleItem.editLink);
					$button.removeClass('disabled');
				} else {
					$button.addClass('disabled');
				}
			},
			release: function(button) {
				return $(button.element).hasClass('disabled') === false;
			}
		},
		addButton: {
			name: 'ico_add',
			className: 'i-add',
			hint: getLabel('js-add-page'),
			init: function(button) {
				var $button = $(button.element);
				if (HandleItem !== undefined && typeof HandleItem.createLink === 'string') {
					$button.attr('href', HandleItem.createLink);
					$button.removeClass('disabled');
				} else {
					$button.removeAttr('href');
					$button.addClass('disabled');
				}
			},
			release: function(button) {
				return $(button.element).hasClass('disabled') === false;
			}
		},

		blockingButton: {
			name: 'blocking',
			hint: getLabel('js-disable-page'),
			className: '',
			init: function(button) {
				if (HandleItem === undefined) {
					button.element.style.display = 'none';
					return false;
				}
				var _allow_activity = HandleItem.allowActivity && (_oControl.contentType == 'pages' || (_oControl.contentType == 'objects' && _oControl.enableObjectsActivity));
				if (HandleItem !== undefined && _allow_activity) {
					var icon = HandleItem.isActive ? 'small-ico i-hidden' : 'small-ico i-vision';
					var hint = HandleItem.isActive ? getLabel('js-disable-page') : getLabel('js-enable-page');

					if (_oControl.contentType == 'objects') {
						hint = HandleItem.isActive ? getLabel('js-disable') : getLabel('js-enable');
					}

					$('i', $(button.element)).attr('class', icon);
					button.element.setAttribute('href', '#');
					button.element.setAttribute('title', hint);
					button.element.style.display = 'inline-block';
				} else {
					button.element.style.display = 'none';
				}
			},
			release: function(button) {
				if (HandleItem !== undefined) {
					var icon = HandleItem.isActive ? 'small-ico i-vision' : 'small-ico i-hidden';
					var hint = HandleItem.isActive ? getLabel('js-enable') : getLabel('js-disable');
					button.element.setAttribute('title', hint);
					$('i', $(button.element)).attr('class', icon);
					var selectedItemIdList = __getSelectedItemIdList();

					if (_oControl.contentType === 'pages') {
						var recursiveOperator = new PageTreeRecursiveOperator(_oControl);
						recursiveOperator.switchActivity(selectedItemIdList, !HandleItem.isActive);
						return false;
					}

					// старая логика для переключение активности объектов
					DataSet.execute('tree_set_activity', {
						'element': selectedItemIdList,
						'object': selectedItemIdList,
						'active': HandleItem.isActive ? 0 : 1,
						'selected_items': HandleItem.control.selectedList,
						'viewMode': 'full'
					});
				}
				return false;
			}
		},

		viewButton: {
			name: 'view',
			hint: getLabel('js-view-page'),
			className: 'i-see',
			init: function(button) {
				if (typeof HandleItem === 'object' && HandleItem.getData && HandleItem.getData().guide == 'guide') {
					button.element.setAttribute('href', window.pre_lang + '/admin/data/guide_items/' + HandleItem.id + '/');
					button.element.style.display = 'inline-block';
				} else if (typeof HandleItem === 'object' && HandleItem.viewLink !== false) {
					button.element.setAttribute('href', HandleItem.getUrl());
					button.element.style.display = 'inline-block';
				} else {
					button.element.style.display = 'none';
				}
			}
		},

		csvExportButton: {
			name: 'csvExport',
			hint: getLabel('js-csv-export'),
			className: 'i-csv-export',
			alwaysActive: true,
			needHide: Control.hideQuickCsvExportButton,
			init: function(button) {
				if (
					!isExchangeableControl() ||
					typeof Control.selectedList !== 'object' ||
					Object.keys(Control.selectedList).length === 0
				) {
					__disableButtons(button);
					return;
				}

				__enableButton(button);
			},
			release: function() {
				executeExchange('exportCallback');
				return false;
			}
		},

		csvImportButton: {
			name: 'csvImport',
			hint: getLabel('js-csv-import'),
			className: 'i-csv-import',
			alwaysActive: true,
			needHide: Control.hideQuickCsvImportButton,
			init: function(button) {
				if (!isExchangeableControl()) {
					__disableButtons(button);
				}
			},
			release: function() {
				executeExchange('importCallback');
				return false;
			}
		},

		restoreButton: {
			name: 'i-restore',
			hint: getLabel('js-trash-restore'),
			className: 'i-restore',
			init: function(button) {
				var $button = $(button.element);
				if (HandleItem !== undefined && __isDeletionAllowed(HandleItem)) {
					$button.removeClass('disabled');
				} else {
					$button.addClass('disabled');
				}
			},
			release: function() {
				if (HandleItem !== undefined) {
					var selectedItemIdList = __getSelectedItemIdList();
					var recursiveOperator = new PageTreeRecursiveOperator(Control);
					recursiveOperator.restoreFromTrash(selectedItemIdList);

					return false;
				}
				return false;
			}
		},

		moveButton: {
			name: 'moveElement',
			hint: getLabel('js-change-parent'),
			className: 'i-move-other',
			init: function(button) {
				if (Control.flatMode || Control.contentType !== 'pages' || (uAdmin.data && uAdmin.data['module'] != 'catalog')) {
					$(button.element).hide();
				}
			},

			release: function() {
				CatalogModule.openCategoriesWindow(HandleItem);
			}
		},

		delIndex: {
			name: 'deleteIndex',
			hint: getLabel('js-indexing-deleting-confirmation'),
			className: 'i-remove',
			init: function(button) {
				if (_.keys(Control.selectedList).length === 0) {
					__disableButton(button);
				} else {
					__enableButton(button);
				}
			},

			release: function() {
				var elementsIds = _.keys(Control.selectedList);

				if (elementsIds.length > 0) {
					AdminIndexing.Controller._deleteIndexes(elementsIds);
				}
			}
		},

		selectAllButton: {
			name: 'selectAll',
			hint: getLabel('js-select-all'),
			className: 'i-select',
			alwaysActive: true,
			init: function(button) {

			},
			release: function() {
				Control.select(Control.items);
				return false;
			}
		},

		unSelectAllButton: {
			name: 'unSelectAll',
			hint: getLabel('js-un-select-all'),
			className: 'i-unselect',
			alwaysActive: true,
			init: function(button) {

			},
			release: function() {
				Control.unSelect(Control.items);
				__self.hide();
				return false;
			}
		},

		invertAllButton: {
			name: 'invertAll',
			hint: getLabel('js-invert-all'),
			className: 'i-invertselect',
			init: function(button) {
				if (HandleItem !== undefined) {
					__enableButton(button);
				} else {
					__disableButton(button);
				}
			},
			release: function() {
				Control.forEachItem(Control.items, function(item) {
					Control.toggleItemSelection(item);
				});

				if (_.size(Control.selectedList) === 0) {
					__self.hide();
				}

				return false;
			}
		},

		copyButton: {
			name: 'copy',
			className: 'i-copy-virtual',
			hint: getLabel('js-vcopy-str'),
			init: function(button) {
				if (Control.contentType !== 'pages') {
					$(button.element).hide();
				}
			},
			release: function() {
				if (HandleItem !== undefined) {
					HandleItem.className = 'ti virtual';

					if (HandleItem.isDefault) {
						HandleItem.labelControl.className += ' main-page';
					}

					HandleItem.isVirtualCopy = true;
					DataSet.execute('tree_copy_element', {
						'element': HandleItem.id,
						'childs': 1,
						'links': 1,
						'virtuals': 1,
						'permissions': 1,
						'handle_item': HandleItem,
						'copy_all': 0
					});
				}
				return false;
			}
		},

		cloneButton: {
			name: 'clone',
			className: 'i-copy',
			hint: getLabel('js-copy-str'),
			init: function(button) {
				if (Control.contentType !== 'pages') {
					$(button.element).hide();
				}
			},
			release: function() {
				if (HandleItem !== undefined) {
					DataSet.execute('tree_copy_element', {
						'element': HandleItem.id,
						'childs': 1,
						'links': 1,
						'permissions': 1,
						'handle_item': HandleItem,
						'copy_all': 0,
						'clone_mode': 1
					});
				}
				return false;
			}
		}
	};

	this.highlight = null;
	this.element = null;
	this.buttons = [];
	this.menu = [
		this.TableTollbarFunctions.viewButton,
		this.TableTollbarFunctions.blockingButton,
		this.TableTollbarFunctions.addButton,
		this.TableTollbarFunctions.editButton,
		this.TableTollbarFunctions.delButton,
		this.TableTollbarFunctions.csvExportButton,
		this.TableTollbarFunctions.csvImportButton,
		this.TableTollbarFunctions.moveButton,
		this.TableTollbarFunctions.copyButton,
		this.TableTollbarFunctions.cloneButton,
	];

	this.__selectButtons = [
		this.TableTollbarFunctions.selectAllButton,
		this.TableTollbarFunctions.unSelectAllButton,
		this.TableTollbarFunctions.invertAllButton
	];

	this.__singleActionButtons = [
		this.TableTollbarFunctions.editButton,
		this.TableTollbarFunctions.addButton,
		this.TableTollbarFunctions.viewButton,
		this.TableTollbarFunctions.copyButton,
		this.TableTollbarFunctions.cloneButton,
	];

	this.__exchangeButtons = [
		this.TableTollbarFunctions.csvExportButton,
		this.TableTollbarFunctions.csvImportButton
	];

	/** (Private methods) */
	let __drawButtons = function() {
		if (Control.toolbarFunctions !== null) {
			let fkeys = Object.keys(Control.toolbarFunctions);
			for (let j = 0, cnt = fkeys.length; j < cnt; j++) {
				__self.TableTollbarFunctions[fkeys[j]] = Control.toolbarFunctions[fkeys[j]];
			}
		}
		if (Control.toolbarMenu !== null) {
			__self.menu = [];
			for (let k = 0, mcnt = Control.toolbarMenu.length; k < mcnt; k++) {
				__self.menu.push(__self.TableTollbarFunctions[Control.toolbarMenu[k]]);
			}
		}
		if (TTCustomizer.menu.length > 0 && _.keys(TTCustomizer.buttons).length > 0) {
			_.extend(__self.TableTollbarFunctions, TTCustomizer.buttons);
			if (!TTCustomizer.extendDefault) {
				__self.menu = [];
			}
			for (let t = 0, tcnt = TTCustomizer.menu.length; t < tcnt; t++) {
				__self.menu.push(__self.TableTollbarFunctions[TTCustomizer.menu[t]]);
			}
		}

		let buttons = document.getElementById('tollbar_wrapper');

		for (let i = 0, cnt = __self.menu.length; i < cnt; i++) {
			let button = __self.menu[i];

			if (button.needHide) {
				continue;
			}

			if (button.name === 'ico_add') {
				if (!TableToolbar.disableAddButton) {
					__appendButton(buttons, button);
				}
			} else {
				__appendButton(buttons, button);
			}

		}

		for (let i = 0, cnt = __self.__selectButtons.length; i < cnt; i++) {
			__appendButton(buttons, __self.__selectButtons[i]);
		}

		__self.element = buttons;

		Control.dataSet.addEventHandler('onAfterLoad', __firstInitToolbar);
		__disableButtons(__self.menu);
		__disableButton(__self.__selectButtons[2]);

		if (isExchangeableControl()) {
			__enableButtons(__self.__exchangeButtons);
		}
	};

	/**
	 * Определяет можно ли удалить элемент контрола
	 * @param {TreeItem|TableItem} item элемент контрола
	 * @returns {Boolean}
	 * @private
	 */
	var __isDeletionAllowed = function(item) {
		return (item.permissions && item.permissions & 8 || !item.permissions)
	};

	/**
	 * Определяет можно ли редактировать элемент контрола
	 * @param {TreeItem|TableItem} item элемент контрола
	 * @returns {Boolean}
	 * @private
	 */
	var __isEditingAllowed = function(item) {
		return item.editLink !== false && (item.permissions && item.permissions & 2 || !item.permissions)
	};

	/**
	 * Возвращает список идентификаторов выбранных элементов контрола
	 * @returns {Array}
	 * @private
	 */
	var __getSelectedItemIdList = function() {
		var itemIdList = [];
		var itemList = Control.selectedList;
		var itemListLength = Object.keys(itemList).length;

		if (itemListLength > 0) {
			for (var id in itemList) {
				if (!itemList.hasOwnProperty(id)) {
					continue;
				}
				itemIdList.push(id);
			}
		}

		return itemIdList;
	};

	/**
	 * Инициализация набора действий тулбара
	 * @private
	 */
	let __firstInitToolbar = function() {
		var keys = Object.keys(Control.items),
			id = keys.length > 1 ? 2 : 1;
		HandleItem = Control.items[keys[id]];
		__initButtons();
		__disableButtons(__self.menu);
		__disableButton(__self.__selectButtons[2]);
	};

	/**
	 * Проверяет может ли быть выполнен импорт/экспорт списка в CSV
	 * @returns {*}
	 */
	var isExchangeable = function() {
		var control = Control;

		if (!isExchangeableControl()) {
			return false;
		}

		var selectedItems = control.selectedList;
		var itemList = (selectedItems && selectedItems.length > 0) ? selectedItems : control.items;
		return Object.keys(itemList).length > 0;
	};

	/**
	 * Определяет, поддерживает ли текущий контрол операции по импорту и экспорту в csv
	 * @returns {boolean}
	 */
	let isExchangeableControl = function() {
		if (!Control || Control.objectTypesMode || Control.disableCSVButtons) {
			return false;
		}

		return true;
	};

	/**
	 * Выполняет экспорт/импорт списка в формате CSV
	 * @param {String} callbackName callbackName имя функции, которая вызывается для непосредственного импорта/экспорта
	 */
	var executeExchange = function(callbackName) {
		var allowedCallbacks = ['importCallback', 'exportCallback'];

		if (!isExchangeable() || allowedCallbacks.indexOf(callbackName) === -1) {
			return;
		}

		var control = Control;
		var selectedItemList = control.selectedList ? control.selectedList : {};
		var itemList = (selectedItemList && Object.keys(selectedItemList).length > 0) ? selectedItemList : control.items;
		var firstItem = itemList[Object.keys(itemList)[0]];
		var selectedItemIdList = [];
		var isFilterApplied = Object.keys(control.getCurrentFilter().Props).length > 0;

		for (var key in itemList) {
			if (!itemList.hasOwnProperty(key)) {
				continue;
			}

			var item = itemList[key];

			if (!isFilterApplied) {
				selectedItemIdList.push(parseInt(key));
			}
		}

		var relIdOrIdList = (callbackName === 'importCallback') ? firstItem.id : selectedItemIdList;
		firstItem[callbackName](relIdOrIdList);
	};

	var __initButtons = function() {
		for (var i = 0; i < __self.buttons.length; i++) {
			__self.buttons[i].init(__self.buttons[i]);
		}
	};

	var __appendButton = function(container, options) {
		var b = document.createElement('a');
		b.className = 'icon-action';
		var name = options.name || 'toolbtn';
		var href = options.href || '#';
		var className = 'small-ico ' + (options.className || '');
		var init = options.init || function() {
		};
		var title = options.hint || '';
		var isAllwaysActive = options.alwaysActive || false;

		var i = document.createElement('i');
		i.className = className;
		b.appendChild(i);

		var el = container.appendChild(b);
		var button = {
			'name': name,
			'href': href,
			'className': className,
			'init': init,
			'element': el
		};

		options.element = el;
		__self.buttons.push(button);

		el.setAttribute('href', href);
		el.setAttribute('title', title);
		if (typeof(options.release) === 'function') {
			el.onclick = function() {
				if (!DataSet.isAvailable()) {
					return false;
				}

				if ((HandleItem || isAllwaysActive) && !$(this).hasClass('disabled')) {
					return options.release(button);
				} else {
					return false;
				}
			};
		} else {
			el.onclick = function() {
				if (!DataSet.isAvailable()) {
					return false;
				}

				if (!isAllwaysActive && $(this).hasClass('disabled')) {
					return false;
				}

				if (HandleItem && HandleItem.focus) {
					HandleItem.focus();
				}

				return true;
			};
		}

		el.name = name;
	};

	/**
	 * Возвращает элемент кнопки тулбара по его имени
	 * @param {Object} button объект кнопки
	 * @returns {*}
	 * @private
	 */
	var __getButtonElement = function(button) {
		var container = __self.element;
		var $button = jQuery(button.element, container);
		return ($button.length > 0 ? $button.eq(0) : null);
	};

	/**
	 * Скрывает кнопку тулбара
	 * @param {Object} button объект кнопки
	 * returns {jQuery}
	 * @private
	 */
	var __disableButton = function(button) {
		var $element = __getButtonElement(button);

		if ($element) {
			$element.addClass('disabled');
		}
	};

	/**
	 * Показывает кнопку тулбара
	 * @param {Object} button объект кнопки
	 * returns {jQuery}
	 * @private
	 */
	var __enableButton = function(button) {
		var $element = __getButtonElement(button);

		if ($element) {
			$element.removeClass('disabled');
		}
	};

	/**
	 * Выполняет для каждой кнопки функцию apply
	 * @param {Array.<Object>} buttons объекты кнопок
	 * @param {Function} apply функция, выполняющаяся для каждой кнопки
	 * @private
	 */
	var __processButtons = function(buttons, apply) {
		var apply = (typeof apply == 'function' ? apply : function() {
		});

		(function() {
			for (var i = 0; i < buttons.length; i++) {
				var button = buttons[i];
				apply(button);
			}
		})();
	};

	/**
	 * Скрывает кнопки тулбара
	 * @param {Array.<Object>} buttons объекты кнопок
	 * @private
	 */
	var __disableButtons = function(buttons) {
		__processButtons(buttons, __disableButton);
	};

	/**
	 * Показывает кнопки тулбара
	 * @param {Array.<Object>} buttons объекты кнопок
	 * @private
	 */
	var __enableButtons = function(buttons) {
		__processButtons(buttons, __enableButton);
	};

	var __draw = function() {
		var el = document.createElement('div');
		el.className = 'tree-highlight';
		el.style.display = 'none';
		el.style.position = 'absolute';
		el.style.zIndex = cDepth - 1;

		__self.highlight = Control.container.appendChild(el);

		__drawButtons();
	};

	/** (Public methods) */
	this.show = function(_HandleItem, bForce) {
		bForce = bForce || false;
		if (typeof(_HandleItem) === 'undefined' || (HandleItem === _HandleItem && !bForce)) {
			return false;
		}

		HandleItem = _HandleItem;

		var selectedItemsCount = Object.keys(HandleItem.control.selectedList).length;

		__enableButtons(this.menu);
		__enableButton(this.__selectButtons[2]);

		if (selectedItemsCount > 1) {
			__disableButtons(this.__singleActionButtons);
		}

		__initButtons();

		if (!isExchangeableControl()) {
			__disableButtons(__self.__exchangeButtons);
		}

		this.element.style.display = '';
	};

	this.hide = function() {
		if (HandleItem) {
			if (HandleItem.getSelected()) {
				HandleItem.labelControl.classList.add('selected');
			} else if (HandleItem.isVirtualCopy) {
				HandleItem.labelControl.classList.add('virtual');
			} else {
				HandleItem.labelControl.classList.remove('virtual');
				HandleItem.labelControl.classList.remove('selected');
			}

			__disableButtons(this.menu);
			__disableButton(this.__selectButtons[2]);
			HandleItem = null;
		}
	};

	if (typeof(Control) === 'object') {
		__draw();
	} else {
		alert('Can\'t create toolbar without control object');
	}
};

TableToolbar.disableAddButton = false;



/** Control Реализация абстрактного контрола, связанного с каким-либо DataSet'ом */

var Control = function(_oDataSet, _ItemClass, options) {
	/** (Private properties) */
	var __self = this;
	var DataSet = _oDataSet;
	var ItemClass = _ItemClass;
	var options = typeof (options) == 'object' ? options : {};
	var ForceDraw = typeof (options['draw']) == 'boolean' ? options['draw'] : false;
	var ExpandAll = typeof (options['expandAll']) == 'boolean' ? options['expandAll'] : false;
	var Toolbar = typeof (options['toolbar']) === 'function' ? options['toolbar'] : false;
	var RootNodeId = null;
	var RootData = null;
	var forceIgnoreHierarchy = typeof (options['ignoreHierarchy']) === 'boolean' ? options['ignoreHierarchy'] : false;
	var onRenderComplete = typeof (options['onRenderComplete']) === 'function' ? options['onRenderComplete'] : function() {
	};
	var CurrentFilter = new filter();
	var Settings = SettingsStore.getInstance();
	var SelectBehaviour = typeof (options['onItemClick']) === 'function' ? options['onItemClick'] : function() {
		return true;
	};
	var SelectCallback = typeof (options['onItemSelect']) === 'function' ? options['onItemSelect'] : function() {
		return true;
	};
	var TargetCallback = typeof (options['onTargetSelect']) === 'function' ? options['onTargetSelect'] : function() {
		return true;
	};
	/** (Static properties) */
	Control.instances[Control.instances.length] = this;

	/* Public properties */
	this.container = typeof (options['container']) == 'object' ? options['container'] : document.body;
	this.dataSet = DataSet;
	this.toolbar = null;
	this.items = {};
	this.id = options['id'] || Math.random();
	this.uid = options['uid'] || Math.round(Math.random() * 100000);
	this.iconsPath = options['iconsPath'] || '/styles/skins/modern/design/img/tree/';
	this.flatMode = options['flatMode'] || false;
	this.defaultRootMode = options['defaultRootMode'] || false;
	this.objectTypesMode = options['objectTypesMode'] || false;
	this.contentType = options['contentType'] || 'pages';
	this.enableObjectsActivity = options['enableObjectsActivity'] || false;
	this.lastClicked = null;
	this.selectedList = {};
	this.targetsList = {};
	this.dragAllowed = typeof (options['allowDrag']) == 'boolean' ? options['allowDrag'] : true;
	this.onGetValueCallback = typeof (options['onGetValueCallback']) === 'function' ? options['onGetValueCallback'] : function(value, name, item) {
		return value;
	};
	this.onDrawFieldFilter = typeof (options['onDrawFieldFilter']) === 'function' ? options['onDrawFieldFilter'] : function(field, th) {
		return false;
	};
	this.onRemoveColumn = typeof (options['onRemoveColumn']) === 'function' ? options['onRemoveColumn'] : function(field) {
		return false;
	};
	this.initContainer = this.container;
	this.disableCSVButtons = options['disableCSVButtons'] || false;
	this.hideCsvImportButton = options['hideCsvImportButton'] || false;
	this.hideQuickCsvImportButton = options['hideQuickCsvImportButton'] || false;
	this.hideQuickCsvExportButton = options['hideQuickCsvExportButton'] || false;
	this.disableTooManyChildsNotification = options['disableTooManyChildsNotification'] || false;
	this.labelFirstColumn = (typeof (options['label_first_column']) === 'string') ? options['label_first_column'] : '';
	this.PerPageLimits = typeof (options['perPageLimits']) == 'array' ? options['perPageLimits'] : [10, 20, 50, 100];
	this.enableEdit = options['enableEdit'];
	this.visiblePropsMenu = options['visiblePropsMenu'];

	/**
	 * Список названий полей, которые обязательно должны быть в табличном контроле.
	 * Это значит, что их нет в меню и их нельзя скрыть.
	 */
	this.requiredPropsMenu = options['requiredPropsMenu'];

	this.sequencePropsMenu = options['sequencePropsMenu'];
	this.toolbarFunctions = options['toolbarFunctions'] || null;
	this.toolbarMenu = options['toolbarMenu'] || null;
	this.disableNameFilter = options['disableNameFilter'] || false;
	this.hasCheckboxes = typeof options['hasCheckboxes'] == 'boolean' ? options['hasCheckboxes'] : true;
	this.isCanSelect = typeof options['isCanSelect'] == 'boolean' ? options['isCanSelect'] : true;
	this.onElementMouseOver = typeof options['onElementMouseOver'] == 'function' ? options['onElementMouseOver'] : function() {
	};
	this.onElementMouseOut = typeof options['onElementMouseOut'] == 'function' ? options['onElementMouseOut'] : function() {
	};
	this.onElementClick = typeof options['onElementClick'] == 'function' ? options['onElementClick'] : function() {
	};
	this.noCheckboxes = !!(parseInt(options['noCheckboxes']));
	/** (Private methods) */

	var __constructor = function() {
		if (ForceDraw) {
			__self.init();
		}
	};

	// event handlers
	var __DataSetInitComplete = function() {

		// create root node if does not exist
		if (typeof (__self.items[RootNodeId]) === 'undefined') {

			__self.items[RootNodeId] = new ItemClass(__self, null, {
				'id': (RootNodeId ? RootNodeId : 0),
				'iconbase': '/styles/skins/modern/design/img/tree/ico_domain.png'
			});
		}

		__self.items[RootNodeId].draw();

		if (Toolbar) {
			__self.toolbar = new Toolbar(__self);

		}

		if (__self.getItemState(RootNodeId) || RootNodeId !== 0) {
			__self.items[RootNodeId].expand();
		}

	};

	var __arraySearch = function(arrList, vVal) {
		for (var i = 0; i < arrList.length; i++) {
			if (arrList[i] === vVal) {
				return arrList[i];
			}
		}
		return null;
	};

	var __buildItems = function(arrNodes, oCurrItem, ignoreHierarchy) {

		if (typeof (oCurrItem) != 'object' || typeof (arrNodes) == 'undefined') {
			return false;
		}
		if (!ignoreHierarchy) {
			ignoreHierarchy = false;
		}
		var currId = oCurrItem.id;
		for (var i = 0; i < arrNodes.length; i++) {
			var parentId = (typeof (arrNodes[i]['parentId']) != 'undefined') ? parseInt(arrNodes[i]['parentId']) : 0;

			if (forceIgnoreHierarchy) {
				parentId = 0;
			}

			if (parentId == currId || ignoreHierarchy) {
				var newItemId = parseInt(arrNodes[i]['id']);

				if (__self.items[newItemId]) {
					__self.items[newItemId].update(arrNodes[i]);
				} else {
					__self.items[newItemId] = oCurrItem.appendChild(arrNodes[i]);

					if (ExpandAll || __self.getItemState(newItemId)) {
						__self.items[newItemId].expand();
					}
				}

				__buildItems(arrNodes, __self.items[newItemId]);
			}
		}

		(function() {
			var objectData = null;
			var item = null;
			var nextObjectData = null;

			for (var i = 0; i < arrNodes.length; i++) {
				objectData = typeof arrNodes[i] == 'object' ? arrNodes[i] : {};
				nextObjectData = typeof arrNodes[i + 1] == 'object' ? arrNodes[i + 1] : {};
				item = __self.getItem(objectData.id);
				item.nextSibling = __self.getItem(nextObjectData.id);
			}
		}());
	};

	var __DataSetAfterLoad = function(arrParams) {
		var arrObjs = arrParams['objects'];
		var oFilter = arrParams['filter'];
		var pageing = arrParams['paging'];
		var arrParents = oFilter.getParents();
		if (oFilter['Parents'] != null) {
			pageing['parent'] = oFilter['Parents'][0];
		}

		if (oFilter.AllText.length > 0 && pageing.total == 0 && arrParents.length == 0) {
			openDialog(getLabel('js-smc-empty-result'), getLabel('js-smc-empty-title'));
		}

		var ignoreHierarchy = false;
		if (!arrParents.length) {
			arrParents = [(RootNodeId ? RootNodeId : 0)];
			ignoreHierarchy = true;
		}
		for (var i = 0; i < arrParents.length; i++) {
			var parentId = parseInt(arrParents[i]);
			var parent = (typeof (__self.items[parentId]) != 'undefined') ? __self.items[parentId] : __self.items[RootNodeId];

			__buildItems(arrObjs, parent, ignoreHierarchy);

			if (parent) {
				parent.setLoaded(true);
				parent.setPageing(pageing);
			}
		}

		onRenderComplete();

		Control.recalcItemsPosition();
		if (Control.HandleItem && __self.toolbar) {
			__self.toolbar.show(Control.HandleItem, true);
		}
	};

	var __DataSetBeforeRefresh = function() {
		__self.removeItem(RootNodeId);
		// restore root
		if (RootData) {
			if (__self.initContainer) {
				__self.container = __self.initContainer;
			}
			var root = __self.setRootNode(RootData, true);
			root.draw();
		}
		Control.recalcItemsPosition();
	};

	var __DataSetAfterExecute = function(arrData) {
		var arrObjs = arrData['objects'];
		var error = arrData['error'];

		var arrParams = arrData['params'];
		var pageing = arrParams['paging'];
		var hItem = arrParams['handle_item'];
		var selItems = arrParams['selected_items'];
		let ignoreHierarchy = false;

		var items = {};
		if (selItems) {
			items = selItems;
		} else if (hItem) {
			items[hItem.id] = hItem;
		}

		var method = arrData['method'];

		if (!error) {
			// delete
			switch (method.toLowerCase()) {
				case 'tree_kill_element' :
				case 'restore_element' :
				case 'del' :
				case 'tree_delete_element' : {
					for (var id in items) {
						var itm = items[id];
						__self.removeItem(id);
						delete __self.selectedList[id];
						if (itm.parent && itm.parent.parent) {
							__buildItems(arrObjs, itm.parent.parent);
						}

					}
					Control.HandleItem = null;
					if (__self.toolbar) {
						__self.toolbar.hide();
					}
					break;
				}

				case 'export' : {
					var i, res = '';
					if (arrData.objects[0].file) {
						window.location = arrData.objects[0].file;
					}
					break;
				}

				case 'move':
				case 'tree_move_element' : {
					var receiver = arrParams['receiver_item'];
					var before = arrParams['before'] ? receiver.control.getItem(arrParams['before']) : null;
					var after = arrParams['after'] ? receiver.control.getItem(arrParams['after']) : null;

					if (!receiver) {
						break;
					}

					if (receiver.control.contentType === 'objects') {
						receiver = receiver.control.getRoot();

						if (arrObjs.length && hItem) {
							var itmData = arrObjs[0] || [];
							var newRelData = arrObjs[1] || [];
							var oldRelData = arrObjs[2] || [];

							if (hItem.parent) {
								hItem.parent.update(oldRelData);
							}

							receiver.update(newRelData);
							hItem.control.removeItem(hItem.id);
							var itm = null;

							if (arrParams['as-sibling']) {
								if (before) {
									itm = receiver.appendBefore(itmData, before);
								} else if (after) {
									itm = receiver.appendAfter(itmData, after);
								} else {
									itm = receiver.appendChild(itmData);
								}
							} else {
								if (receiver.loaded) {
									itm = receiver.appendFirst(itmData);
								}
							}

							if (itm) {
								receiver.control.items[itm.id] = itm;
							}
						}
						break;
					}

					if (arrObjs.length === 0) {
						break;
					}

					var receiverData = [];
					receiverData['id'] = receiver.id;
					receiverData['is-active'] = receiver.isActive;
					receiverData['childs'] = 0;
					var oldParents = [];

					for (var key in arrObjs) {
						var itemData = arrObjs[key];
						var itemId = itemData.id;
						var oldItem = __self.selectedList[itemId];

						if (oldItem) {
							if (!oldParents[oldItem.parent.id]) {
								oldParents[oldItem.parent.id] = 1;
							} else {
								oldParents[oldItem.parent.id]++;
							}
						}

						__self.removeItem(itemId);
						delete __self.selectedList[itemId];

						if (arrParams['as-sibling']) {
							if (before) {
								itm = receiver.appendBefore(itemData, before);
							} else if (after) {
								itm = receiver.appendAfter(itemData, after);
							} else {
								itm = receiver.appendChild(itemData);
							}
						} else {
							itm = receiver.appendFirst(itemData);
						}

						if (itm) {
							receiver.control.items[itm.id] = itm;
							receiverData['childs']++;
							itm.control.getSelectionCallback()(itm);
						}
					}

					for (id in oldParents) {
						var oldParent = __self.getItem(id);

						if (!oldParent) {
							continue;
						}

						var oldParentData = [];
						var oldParentChildrenLength = $('tr[rel=' + oldParent.id + '] + tr > td > table.table > tr[rel]').length;
						oldParentData['id'] = oldParent.id;
						oldParentData['is-active'] = oldParent.isActive;
						oldParentData['childs'] = oldParentChildrenLength - oldParents[id];
						oldParent.update(oldParentData);
					}

					receiver.update(receiverData);
					break;
				}

				case 'change_template': {
					(function() {
						if (!arrData.HandleItem || !arrData.HandleItem.control || !arrData.HandleItem.control.toolbar) {
							return;
						}

						var toolbar = arrData.HandleItem.control.toolbar;
						var buttonName = 'amend';

						if (typeof toolbar.getButton != 'function') {
							return;
						}

						var button = toolbar.getButton(buttonName);
						var buttonElement = button.element;
						var subMenuElement = $(buttonElement).next('ul');
						var subMenuLinks = subMenuElement.find('li a');
						var newTemplateId = parseInt(arrData.params['template-id']);

						subMenuLinks.removeClass('checked');

						subMenuLinks.each(function() {
							var templateId = $(this).data('info');

							if (templateId == newTemplateId) {
								$(this).addClass('checked');
							}
						});
					})();

					break;
				}
				case 'copyelementtosite': {
					(function() {
						for (var objectKey in arrObjs) {
							var copy = arrObjs[objectKey];
							var copyTreeId = 'tree-content-sitetree-' + copy['domain-id'];
							var copyControl = false;

							for (var controlKey in Control.instances) {
								var control = Control.instances[controlKey];

								if (control.id == copyTreeId) {
									copyControl = control;
								}
							}

							if (typeof copyControl != 'object') {
								continue;
							}

							var controlRoot = copyControl.getRoot();
							var newItemId = copy.id;

							if (copyControl.items[newItemId]) {
								copyControl.items[newItemId].update(copy);
							} else {
								copyControl.items[newItemId] = controlRoot.appendChild(copy);
							}
						}
					})();
					break;
				}
				case 'copy': 
				case 'tree_copy_element': {
					ignoreHierarchy = true;
				}
				default : {
					for (var id in items) {
						var parent = __self.items[id].parent;
						var parentId = parent ? parent.id : 0;
						ignoreHierarchy = (!__self.items[parentId]) || ignoreHierarchy;
						__buildItems(arrObjs, parent, ignoreHierarchy);
					}
				}
			}

			if (__self.toolbar && hItem === Control.HandleItem) {
				__self.toolbar.show(Control.HandleItem, true);
			}

			Control.recalcItemsPosition();
			Control.PrepareDrag = false;
			Control.startDragItem = null;
			Control.PrepareDrag = false;
			Control.DragMode = false;
		} else {
			// TODO: Make it beauty
			var error_type = jQuery(error).find('type').text();

			if (error_type == '__alias__') {

				var alias = {};
				var params = arrParams;
				var elems = jQuery(error).find('item');

				elems.each(function() {
					var url = jQuery(this).attr('path') + '' + jQuery(this).attr('alias');
					var html = "<form method='post' id='' enctype='multipart/form-data' ";
					html += " action=''>" + getLabel('js-smc-control-page-already-exist', url);
					html += "<br/><label for='new_alias'>" + getLabel('js-content-alias-copy') + "</label> <br/> ";
					html += jQuery(this).attr('path') + "<input type='text' class='default alt-name' name='new_alias" + jQuery(this).attr('id') + "'  value='" + jQuery(this)
									.attr('alt_name_normal') + "'  id='new_alias" + jQuery(this).attr('id') + "' size='15' />";
					html += "</form>";

					var t = this;

					openDialog('', getLabel('js-move-title'), {
						html: html,
						width: 400,
						confirmText: getLabel('js-content-alias-new'),
						cancelButton: true,
						cancelText: getLabel('js-content-alias-change'),
						cancelCallback: function(popupName) {
							params['move[' + jQuery(t).attr('id') + ']'] = 1;

							callback(function() {
								closeDialog(popupName);
							}, jQuery(t).attr('id'));
						},
						confirmCallback: function(popupName, scope) {
							params['alias[' + jQuery(t).attr('id') + ']'] = jQuery('#new_alias' + jQuery(t).attr('id'), scope).val();

							callback(function() {
								closeDialog(popupName);
							}, jQuery(t).attr('id'));
						}
					});
				});

				/**
				 * Обрабатывает нажатия на кнопки "Заменить" и "Переименовать" во всплывающем окне,
				 * которое возникает, если элемент c переданным псевдостатическим адресом уже существует
				 * в целевой языковой версии.
				 * @param {Function} complete функция, вызывающаяся при успешном завершении
				 * @param {Number} elementId ID обрабатываемого элемента
				 */
				var callback = function(complete, elementId) {
					var completeFunc = typeof complete == 'function' ? complete : function() {
					};
					var handleItem = arrData['HandleItem'];

					if (!handleItem) {
						completeFunc();
						return;
					}
					if (elementId) {
						params['element'] = [];
						params['element'].push(elementId);
					}

					handleItem.control.dataSet.execute('' + method.toLowerCase() + '', params);
					completeFunc();
				};

			} else if (error_type == '__template_not_exists__') {
				var text = jQuery(error).find('text').text();

				openDialog('', 'Ошибка', {
					html: text
				});
			} else {
				alert(error.firstChild.nodeValue);
			}
		}

	};

	/** (Set DataSet Event handlers) */
	DataSet.addEventHandler('onAfterLoad', __DataSetAfterLoad);
	DataSet.addEventHandler('onAfterPieceLoad', __DataSetAfterLoad);
	DataSet.addEventHandler('onInitComplete', __DataSetInitComplete);
	DataSet.addEventHandler('onBeforeRefresh', __DataSetBeforeRefresh);
	DataSet.addEventHandler('onAfterExecute', __DataSetAfterExecute);

	// forse container position
	this.initContainer.style.position = 'relative';

	/** Выполняет инициализацию */
	this.init = function() {
		DataSet.init();

	};

	this.load = function(_oFilter, _bNeedDraw) {
		DataSet.load(_oFilter);
	};

	this.getItemByPosition = function(mX, mY) {
		var hItem = null;
		for (var id in this.items) {
			if (!this.items[id]) {
				continue;
			}
			var pos = this.items[id].position;
			if (mY > pos.top) {
				if (mY <= pos.bottom) {
					if (mX > pos.left) {
						if (mX <= pos.right) {
							hItem = this.items[id];
							break;
						}
					}
				}
			}
		}

		return hItem;
	};

	this.getItem = function(_ID) {
		if (typeof (this.items[parseInt(_ID)]) == 'object') {
			return this.items[parseInt(_ID)];
		} else {
			return false;
		}
	};

	this.setRootNode = function(_RootData, _skipLoad) {
		RootData = _RootData;
		RootNodeId = _RootData['id'];
		this.items[RootNodeId] = new ItemClass(__self, null, _RootData);
		if (_skipLoad) {
			this.items[RootNodeId].loaded = true;
		}
		return this.items[RootNodeId];
	};

	this.getRootNodeId = function() {
		return RootNodeId;
	};

	this.getRoot = function() {
		return this.items[RootNodeId];
	};

	this.applyBehaviour = function(Item) {
		if (SelectBehaviour) {
			return SelectBehaviour(Item);
		}
		return true;
	};

	/**
	 * Сохраняет состояние элемента (свернут/развернут) в профиле пользователя
	 * @access public
	 */
	this.saveItemState = function(_ID) {
		var itemId = parseInt(_ID);
		if (this.items[itemId]) {
			var itm = this.items[itemId];
			var expanded = Settings.get(__self.id, 'expanded');
			var val = '{' + itm.id + '}';
			if (typeof (expanded) != 'string') {
				expanded = '';
			}
			if (expanded.indexOf(val) !== -1 && !itm.isExpanded) {
				expanded = expanded.replace(val, '');
				Settings.set(__self.id, expanded, 'expanded');
				return true;
			} else if (expanded.indexOf(val) === -1 && itm.isExpanded) {
				expanded += val;
				Settings.set(__self.id, expanded, 'expanded');
				return true;
			} else {
				return false;
			}
		}
	};

	/**
	 * Применяет новый фильтр для выбранных элементов
	 * @param _oFilter объект класса filter
	 * @access public
	 */
	this.applyFilter = function(_oFilter) {
		this.selectItems([]);
		if (_oFilter != undefined && (_oFilter instanceof Object)) {
			CurrentFilter = _oFilter;
		}
		if (!CurrentFilter) {
			return;
		}
		var hasTargets = false;
		for (var i in this.targetsList) {
			this.targetsList[i].applyFilter(CurrentFilter.clone());
			hasTargets = true;
		}
		if (!hasTargets) {
			__self.items[RootNodeId].applyFilter(CurrentFilter.clone(), true);
		}
	};

	/** Возвращает текущий фильтр */
	this.getCurrentFilter = function() {
		return CurrentFilter;
	};

	/**
	 * Устанавливае/снимает выделение переданного элемента
	 * @param _oItem выделяемый элемент
	 * @access public
	 */
	this.toggleItemSelection = function(_oItem) {
		if (_oItem) {
			if (_oItem.getSelected()) {
				_oItem.setSelected(false);
				delete this.selectedList[_oItem.id];
				SelectCallback(_oItem, false);
			} else {
				_oItem.setSelected(true);
				this.selectedList[_oItem.id] = _oItem;
				SelectCallback(_oItem, true);
			}
		}
	};

	/**
	 * Устанавливает или снимает (переключает) выделение списка элементов
	 * в диапазоне от выбранных двух на одном уровне вложенности
	 * @param {TreeItem|TableItem} handleItem
	 */
	this.toggleRangeSelection = function(handleItem) {
		if (!this.lastClicked) {
			return;
		}

		var sameLevelItemsIdList = handleItem.parent.childs;
		var firstBoundIndex = sameLevelItemsIdList.indexOf(handleItem.id);
		var secondBoundIndex = sameLevelItemsIdList.indexOf(this.lastClicked.id);
		var leftBoundIndex = Math.min(firstBoundIndex, secondBoundIndex);
		var rightBoundIndex = Math.max(firstBoundIndex, secondBoundIndex);
		var selectedItemsIdList = sameLevelItemsIdList.slice(leftBoundIndex, rightBoundIndex + 1);
		var sameLevelItems = [];

		for (var i = 0; i < sameLevelItemsIdList.length; i++) {
			sameLevelItems.push(this.getItem(sameLevelItemsIdList[i]));
		}

		this.unSelect(sameLevelItems);

		var item = null;
		var selectedItems = [];

		for (i = 0; i < selectedItemsIdList.length; i++) {
			item = this.getItem(selectedItemsIdList[i]);
			selectedItems.push(item);
		}

		this.select(selectedItems);
	};

	/**
	 * Выполняет функцию apply для каждого элемента
	 * @param {TableItem[]|TreeItem[]} items массив элементов
	 * @param {Function} apply
	 */
	this.forEachItem = function(items, apply) {
		var applyFunction = typeof apply == 'function' ? apply : function() {
		};
		var skipZeroElement = (!Array.isArray(items));

		$.each(items, function(index, item) {
			if (skipZeroElement && index == 0) {
				return;
			}

			if (!item) {
				return;
			}

			applyFunction(item, index);
		});
	};

	/**
	 * Снимает выделение элементов
	 * @param {TableItem[]|TreeItem[]} items массив элементов
	 */
	this.unSelect = function(items) {
		var self = this;

		this.forEachItem(items, function(item) {
			item.setSelected(false);
			delete self.selectedList[item.id];
		});

		this.HandleItem = null;
		this.toolbar.hide();
	};

	/**
	 * Выделяет элементы
	 * @param {TableItem[]|TreeItem[]} items массив элементов
	 */
	this.select = function(items) {
		var self = this;

		this.forEachItem(items, function(item) {
			item.setSelected(true);
			self.selectedList[item.id] = item;
			__self.HandleItem = item;
		});

		this.toolbar.show(this.HandleItem);
	};

	this.setSelectionCallback = function(_Callback, _Replace) {
		if (typeof (_Callback) === 'function') {
			if (_Replace) {
				SelectCallback = _Callback;
			} else {
				var h = SelectCallback;
				SelectCallback = function(a, b) {
					h(a, b);
					_Callback(a, b);
				};
			}
		}
	};
	/**
	 * Some dark magic. Don't use it IRL
	 * @return Function callback on item selection
	 */
	this.getSelectionCallback = function() {
		return SelectCallback;
	};

	this.selectItems = function(Items) {
		if (!(Items instanceof Array)) {
			Items = [Items];
		}
		for (var i in this.selectedList) {
			this.toggleItemSelection(this.selectedList[i]);
		}
		this.selectedList = {};
		for (var i = 0; i < Items.length; i++) {
			this.toggleItemSelection(Items[i]);
		}
	};

	this.setTargetItems = function(Targets) {
		this.targetsList = {};
		for (var i in Targets) {
			this.targetsList[i] = Targets[i];
		}
		TargetCallback(this.targetsList);
	};

	this.isTarget = function(Item) {
		for (var i in this.targetsList) {
			if (this.targetsList[i] == Item) {
				return true;
			}
		}
		return false;
	};

	this.setTargetSelectCallback = function(_Callback) {
		if (typeof (_Callback) === 'function') {
			TargetCallback = _Callback;
		}
	};

	this.getItemState = function(_ID) {
		var itemId = parseInt(_ID);

		if (this.items[itemId]) {
			var itm = this.items[itemId];
			if (!itm.hasChilds) {
				return false;
			}
			var expanded = Settings.get(__self.id, 'expanded');
			var val = '{' + itm.id + '}';
			if (typeof (expanded) != 'string') {
				expanded = '';
			}
			return (expanded.indexOf(val) !== -1);
		}
		return false;
	};

	this.removeItem = function(_ID, keepSelf) {
		var itemId = parseInt(_ID);
		if (this.items[itemId]) {
			var itm = this.items[itemId];
			var parent = itm.parent;
			for (var j = 0; j < itm.childs.length; j++) {
				this.removeItem(itm.childs[j]);
			}
			itm.childs = [];
			if (!keepSelf) {
				this.items[itemId] = false;
				itm.clear();
			}
		}
	};

	this.expandAll = function() {
		ExpandAll = true;
		for (id in this.items) {
			this.items[id].expand();
		}
	};

	this.collapseAll = function() {
		ExpandAll = false;
		for (id in this.items) {
			this.items[id].collapse();
		}
	};

	/** Пересчитывает позицию для каждого элемента контрола (нужно для Drag&Drop) */
	this.recalcItemsPosition = function() {
		for (var id in this.items) {
			if (!this.items.hasOwnProperty(id)) {
				continue;
			}

			if (this.items[id] && this.items[id].recalcPosition) {
				this.items[id].recalcPosition();
			}

		}
	};
	/**
	 * Обработчик события нажатия левой кнопкой мыши по строке табличного контрола
	 * @param event
	 * @param {Number} itemId идентификатор элемента табличного контрола
	 */
	this.handleMouseDown = function(event, itemId) {
		var targetElement = event.target,
			currentItem = __self.getItem(itemId),
			checkbox = currentItem.checkBox,
			currentButton = event.button,
			handleElement = currentItem.element;

		var isCellClicked = (handleElement == targetElement || targetElement.parentNode.parentNode == handleElement);
		var isCheckboxClicked = (targetElement == checkbox || targetElement.parentNode == checkbox);

		if ($(targetElement).hasClass('name_col')) {
			var isCellClicked = (handleElement == targetElement || targetElement.parentNode.parentNode.parentNode == handleElement);
		}

		if (currentButton == 2 && currentItem.getSelected() && Object.keys(currentItem.control.selectedList).length == 1) {
			return true;
		}

		if (currentItem instanceof TreeItem && !$(targetElement).hasClass('catalog-toggle') && !$(targetElement).hasClass('catalog-toggle-wrapper')) {
			__self.toggleSelection(currentItem, event);
		}

		if ((isCellClicked || isCheckboxClicked) && currentItem instanceof TableItem) {
			__self.toggleSelection(currentItem, event);
		}

		if (event.shiftKey) {
			__self.toggleRangeSelection(currentItem);
		}

		this.saveSelectedItem(itemId);
		var el = event.target;

		if (el.className.toLowerCase() != 'ti-toggle') {
			Control.PrepareDrag = true;
			Control.startDragItem = Control.HandleItem;
			Control.startDragX = event.pageX;
			Control.startDragY = event.pageY;
		}
	};

	/**
	 * Обработчик события отжатия левой кнопки мыши по строке табличного контрола
	 * @param event
	 * @param {TreeItem|TableItem} item
	 */
	this.handleMouseUp = function(event, item) {
		var self = this;
		var leftMouseButtonCode = 0;
		var leftMouseButtonClicked = (event.button == leftMouseButtonCode);

		if (!Control.enabled || !leftMouseButtonClicked || !item) {
			return;
		}

		var handleItem = Control.HandleItem;
		var toolbar = self.toolbar;
		var selectedCount = Object.keys(self.selectedList).length;

		if (!Control.DragMode && handleItem) {
			if ((handleItem.getSelected() || selectedCount > 0) && toolbar) {
				toolbar.show(handleItem, true);
			}

			self.lastClicked = handleItem;
		}

		if (selectedCount === 0 && toolbar) {
			toolbar.hide();
		}

		Control.PrepareDrag = false;
		Control.startDragItem = null;
		Control.DragMode = false;
	};

	/**
	 * Сохраняет текущий обрабатываемый элемент
	 * @param {Number} id идентификатор элемента
	 * @returns {*}
	 */
	this.saveSelectedItem = function(id) {
		if (!Control.instances.length || Control.DragMode || !Control.enabled) {
			return;
		}

		var item = this.getItem(id);
		var selectedItems = this.selectedList;
		var selectedItemsIdList = Object.keys(selectedItems);
		var lastSelectedId = parseInt(selectedItemsIdList[selectedItemsIdList.length - 1]);
		var lastSelectedItem = selectedItems[lastSelectedId];

		Control.HandleItem = selectedItemsIdList.length > 0 ? lastSelectedItem : null;

		if (item.getSelected()) {
			Control.HandleItem = item;
		}

		return item;
	};

	/**
	 * Переключает выделение строк
	 * @param {TreeItem|TableItem} item объект элемента контрола
	 * @param event
	 */
	this.toggleSelection = function(item) {
		__self.toggleItemSelection(item);
	};

	__constructor();
};

// static properties
Control.DragMode = false;
Control.PrepareDrag = false;
Control.startDragX = 0;
Control.startDragY = 0;
Control.startDragItem = null;

Control.DragSensitivity = 7; // SMF
Control.HandleItem = null;
Control.DraggableItem = null;
Control.instances = [];
Control.enabled = true;

Control.getInstanceById = function(sId) {
	for (var i = 0; i < Control.instances.length; i++) {
		if (Control.instances[i].id === sId) {
			return Control.instances[i];
		}
	}
	return null;
};

// static methods
Control.recalcItemsPosition = function() {
	for (var i = 0; i < Control.instances.length; i++) {
		Control.instances[i].recalcItemsPosition();
	}
};

// define common observers
Control.detectItemByMousePointer = function(x, y) {
	var HandleItem = Control.HandleItem;
	if (HandleItem) {
		var cpos = jQuery(HandleItem.control.initContainer).position();
		var pos = HandleItem.position;
		if (y > pos.top + cpos.top && y <= pos.bottom + cpos.top && x > pos.left + cpos.left && x <= pos.right + cpos.left) {
			return HandleItem;
		}
	}
	var hItem = null;
	for (var i = 0; i < Control.instances.length; i++) {
		var Inst = Control.instances[i];
		var cpos = jQuery(Inst.initContainer).offset();
		hItem = Inst.getItemByPosition(x - cpos.left, y - cpos.top);
		if (hItem) {
			break;
		}
	}

	return hItem;
};

Control.handleMouseUp = function(event) {
	if (!Control.enabled) {
		return;
	}

	if (!Control.DragMode && Control.HandleItem) {
		if (event.altKey) {
			// Nothig to do with selection
		} else if ((event.ctrlKey || event.metaKey) && (event.button != 2)) {
			//Control.HandleItem.control.toggleItemSelection(Control.HandleItem);
		} else if ((event.shiftKey) && (event.button != 2)) {
			//Control.HandleItem.control.toggleRangeSelection(Control.HandleItem);
		} else {
			var el = event.target;
			//debugger;
			if (event.button === 0 && !el.classList.contains('editable') && !el.classList.contains('cmenuItem')
				&& !el.classList.contains('catalog-toggle') && !el.classList.contains('catalog-toggle-wrapper')
				&& (el.type === undefined || el.type.toLocaleLowerCase() === 'checkbox')) {
				if (el.type === undefined) {
					Control.HandleItem.check();
				}

				Control.HandleItem.control.toggleItemSelection(Control.HandleItem);

				if (!Control.HandleItem.getSelected()) {
					var keys = Object.keys(Control.HandleItem.control.selectedList);
					if (keys.length > 0) {
						Control.HandleItem.control.toggleItemSelection(Control.HandleItem.control.selectedList[keys.length - 1]);

						if (Control.HandleItem.control.toolbar) {
							Control.HandleItem.control.toolbar.show(Control.HandleItem);
						}
					} else {
						if (Control.HandleItem.control.toolbar) {
							Control.HandleItem.control.toolbar.hide();
						}
					}
				} else {
					if (Control.HandleItem.control.toolbar) {
						Control.HandleItem.control.toolbar.show(Control.HandleItem);
					}
				}

			} else {

			}
		}
		Control.HandleItem.control.lastClicked = Control.HandleItem;

	}
	Control.PrepareDrag = false;
	Control.startDragItem = null;
	Control.DragMode = false;
};

jQuery(window).on('resize', function(event) {
	Control.recalcItemsPosition();
});

function createAddButton(oButton, oControl, sAddLink, aTypes, validateCallback) {
	oButton.ControlInstance = oControl;
	var _SelectionCallback = function() {
		var Count = 0;
		var id = null;
		var Allow = false;
		var i;
		for (i in oControl.selectedList) {
			Count++;
			id = i;
		}

		var item = (oControl.selectedList[id]) ? oControl.selectedList[id] : null;

		for (i = 0; i < aTypes.length; i++) {
			if ((id == null && aTypes[i] === true) || (id != null && (aTypes[i] === item.baseMethod || aTypes[i] === '*'))) {
				Allow = true;
				break;
			}
		}

		if (Allow && typeof validateCallback === 'function') {
			Allow = validateCallback(item);
		}

		var _sAddLink = sAddLink.replace(/\{id\}/, (id || '0'));
		_sAddLink = _sAddLink.replace(/\{\$param0\}/, (id || '0'));
		_sAddLink = _sAddLink.replace(/\{\$pre_lang\}/, window.pre_lang);
		var domainSelect = document.querySelector('.domains_selector > select');
		if (domainSelect) {
			var domain = domainSelect.options[domainSelect.selectedIndex].text;
			if (_sAddLink.indexOf('?') != -1) {
				_sAddLink = _sAddLink + '&domain=' + domain;
			} else {
				_sAddLink = _sAddLink + '?domain=' + domain;
			}
		}
		oButton.addLink = _sAddLink;
		for (var i = 0; i < oButton.linkCache.length; i++) {
			oButton.linkCache[i].href = oButton.addLink;
			oButton.linkCache[i]['param0'] = (id || '0');
		}
		if (oButton.tagName.toLowerCase() == 'a') {
			oButton.href = oButton.addLink;
			oButton.param0 = (id || '0');
		}
		var needPositionRecalc = false;
		if (Count > 1 || !Allow) {
			if (oButton.style.display != 'none') {
				oButton.style.display = 'none';
				needPositionRecalc = true;
			}
		} else {
			if (oButton.style.display == 'none') {
				oButton.style.display = '';
				needPositionRecalc = true;
			}
		}
		if (needPositionRecalc) {
			Control.recalcItemsPosition();
		}
	};
	oControl.setSelectionCallback(function(a, b) {
		setTimeout(_SelectionCallback, 100);
	});

	var _sAddLink = sAddLink.replace(/\{id\}/, '0');
	_sAddLink = _sAddLink.replace(/\{\$param0\}/, '0');
	_sAddLink = _sAddLink.replace(/\{\$pre_lang\}/, window.pre_lang);
	oButton.addLink = _sAddLink;
	oButton.linkCache = oButton.getElementsByTagName('a');
	_SelectionCallback();
}

/**
 * filterController
 * Класс обеспечивает отрисовку полей для фильтрации содержимого
 * @param  _oControll    объект-контролл, к которому прикрепляется фильтр
 * @param  _iTypeId      Идентификатор типа, по которому производится фильтрация
 * @param  _bSuspendInit Отложенная инициализация
 * @param  _oContainerEl
 * @param  _Params
 * @param {SearchAllTextStorage} searchStorage хранилище значения для полнотекстового поиска
 */
function filterController(_oControll, _iTypeId, _bSuspendInit, _oContainerEl, _Params, searchStorage) {
	var __self = this;
	var quickSearch = null;
	var quickSearchContainer = null;
	var formContainer = null;
	var logicContainer = null;
	var radioLogicAnd = null;
	var radioLogicOr = null;
	var form = null;
	var addSelect = null;
	var addSelectize = null;
	var modeButton = null;
	var expandButton = null;
	var targetsList = null;
	var TypeId = _iTypeId;
	var ControlInst = null;
	var errorCount = 0;
	var tipShowTime = 5000;
	var UsedFields = {};
	var UsedInputs = {};
	var fcId = _oControll.id + '_fc';
	var iconsPath = null;
	var guideCache = {};
	var currentParent = null;
	var quickMode = true;
	var containerEl = _oContainerEl;
	var nativeModeChange = (_Params && _Params.nativeAdvancedMode);
	var interfaceLang = (_Params && _Params.interfaceLang) ? _Params.interfaceLang : null;
	/** @type {number} FILTER_RESET_VALUE специально значение фильтра, для отключения фильтрации */
	var FILTER_RESET_VALUE = -2;

	var DrawFieldFilter = function(_Field, _Placer, _Params) {
		if (_Field == 'name' && _oControll.disableNameFilter) {
			return false;
		}
		if (_Field == 'name' && !_oControll.disableNameFilter) {
			_Field = {
				dataType: 'string',
				fieldName: 'name',
				guideId: 1
			};
		}
		if (_Params && _Params[1] === 'static') {
			return;
		}
		var id = fcId + '_' + 'id_' + _Field.fieldName;
		if (!_Field.dataType) {
			_Field.dataType = 'string';
		}
		var input = createInputByDataType(_Field.dataType, id, _Field.fieldName, _Field.guideId, false);
		if (input) {
			UsedFields[_Field.fieldName] = _Field;
			if (input.classList.contains('sel')) {
				UsedInputs[_Field.fieldName] = $(input).find('select')[0];
			} else {
				UsedInputs[_Field.fieldName] = input;
			}
			if (_Params && _Params[0]) {
				input.style.width = '100%';
			}
			_Placer.appendChild(input);
			if ('boolean,file,img_file,swf_file'.indexOf(_Field['dataType']) >= 0) {
				setTimeout(function() {
					new ControlComboBox({el: $(input.lastChild)});
				}, 50);
			}
		}
	};

	var onRemoveColumn = function(_Field) {
		if (_Field != 'name') {
			delete UsedFields[_Field.fieldName];
			delete UsedInputs[_Field.fieldName];
		}
	};

	this.control = null;
	
	this.getId = function() {
		return fcId;
	};
	
	this.changeMode = function() {
		if (quickMode) {
			quickMode = false;
			formContainer.style.display = 'block';
			quickSearchContainer.style.display = 'none';
			modeButton.childNodes[0].nodeValue = getLabel('js-filter-normal-mode');
		} else {
			quickMode = true;
			formContainer.style.display = 'none';
			quickSearchContainer.style.display = '';
			modeButton.childNodes[0].nodeValue = getLabel('js-filter-extended-mode');
		}
		Control.recalcItemsPosition();
	};
	var applyOnEnterQuickSearch = function(e) {
		var KeyID = (window.event) ? event.keyCode : e.keyCode;
		if (KeyID == 13) {
			__self.applyFilter();
		}
	};
	var applyOnEnterEvent = function(e) {
		var KeyID = (window.event) ? event.keyCode : e.keyCode;
		if (KeyID == 13) {
			if (nativeModeChange) {
				_self.applyFilter();
			} else {
				__self.applyFilterAdvanced();
			}
		}
	};
	var applyOnChangeEvent = function(e) {
		if (!nativeModeChange) {
			__self.applyFilterAdvanced();
		}
	};
	
	this.applyFilterAdvanced = function() {
		if (errorCount > 0) {
			return;
		}
		var oFilter = new filter();
		for (var name in UsedInputs) {
			if (!UsedInputs.hasOwnProperty(name)) {
				continue;
			}
			if (UsedInputs[name].tagName.toLowerCase() == 'select') {
				var value = UsedInputs[name].options[UsedInputs[name].selectedIndex].value;
				if (value != FILTER_RESET_VALUE) {
					oFilter.setPropertyEqual(name, value);
				}
			} else {
				switch (UsedInputs[name].type) {
					case 'button'   :
						break;
					case 'checkbox' :
						oFilter.setPropertyEqual(name, UsedInputs[name].checked ? 1 : 0);
						break;
					case 'text'     : {
						var type = UsedFields[name].dataType;
						switch (type) {
							case 'tags' : {
								var values = UsedInputs[name].value;
								if (values == '') {
									break;
								}
								values = values.split(',');
								for (var j = 0; j < values.length; j++) {
									values[j] = values[j].replace(/^\s+|\s+$/, '');
								}
								if (values.length) {
									oFilter.setPropertyLike(name, values);
								}
								break;
							}
							case 'float':
							case 'price':
							case 'counter':
							case 'int': {
								var value = UsedInputs[name].value.replace(/^\s+|\s+$/, '');
								if (!value.length) {
									break;
								}
								if (value[0] == '<') {
									oFilter.setPropertyLess(name, value.replace(/[^\d.]*/, ''));
								} else if (value[0] == '>') {
									oFilter.setPropertyGreater(name, value.replace(/[^\d.]*/, ''));
								} else {
									value = value.split('-');
									if (value.length > 1) {
										oFilter.setPropertyBetween(name, value[0].replace(/[^\d.]*/, ''), value[1].replace(/[^\d.]*/, ''));
									} else {
										oFilter.setPropertyEqual(name, value[0].replace(/[^\d.]*/, ''));
									}
								}
								break;
							}
							case 'date': {
								var pieces = [];
								var value = UsedInputs[name].value;
								if (UsedInputs[name].isEmpty != undefined && UsedInputs[name].isEmpty == true) {
									break;
								}
								if (value.length > 0) {
									var index = -1;
									var lastindex = value.indexOf('-');
									if ((index = value.indexOf('<')) != -1) {
										oFilter.setPropertyLess(name, (lastindex != -1) ? value.substring(index + 1, lastindex - 1) : value.substring(index + 1));
									} else if ((index = value.indexOf('>')) != -1) {
										oFilter.setPropertyGreater(name, (lastindex != -1) ? value.substring(index + 1, lastindex - 1) : value.substring(index + 1));
									} else {
										if (lastindex != -1) {
											pieces = value.split(/\s-\s/);
										}

										if (pieces.length == 2) {
											oFilter.setPropertyBetween(name, pieces[0], pieces[1]);
										} else {
											oFilter.setPropertyEqual(name, value);
										}
									}
								}
								break;
							}
							case 'relation':
								if (UsedInputs[name].value != undefined && UsedInputs[name].value.length) {
									oFilter.setPropertyEqual(name, UsedInputs[name].value);
								}
								break;
							default:
								if (UsedInputs[name].value != undefined && UsedInputs[name].value.length) {
									oFilter.setPropertyLike(name, UsedInputs[name].value);
								}
						}
						break;
					}
					default :
						if (UsedInputs[name].value != undefined && UsedInputs[name].value.length) {
							oFilter.setPropertyEqual(name, UsedInputs[name].value);
						}
				}
			}

		}
		oFilter.setConditionModeOr(false);
		ControlInst.applyFilter(oFilter);
	};
	/** Применяет фильтр к контроллу */
	this.applyFilter = function() {
		var oFilter = new filter();
		if (quickMode) {
			var value = quickSearch.value.replace(/^\s*|\s*$/, '');
			searchStorage.save([]);

			if (value.length == 0) {
				if (!(ControlInst.flatMode || ControlInst.objectTypesMode || ControlInst.defaultRootMode)) {
					oFilter.setParentElements(0);
				}
			} else {
				if (/^".*"$|^'.*'$/.test(value)) {
					value = value.substr(1, value.length - 2);
				} else {
					value = value.split(' ');
				}

				searchStorage.save(value);
				oFilter.setAllTextSearch(value);
			}
			oFilter.setConditionModeOr(true);
		} else {
			var inputs = formContainer.getElementsByTagName('input');
			for (var i = 0; i < inputs.length; i++) {
				if (inputs[i].id != undefined && UsedFields['row_' + inputs[i].id] == undefined) {
					continue;
				}
				switch (inputs[i].type) {
					case 'button'   :
						break;
					case 'checkbox' :
						oFilter.setPropertyEqual(inputs[i].name, inputs[i].checked ? 1 : 0);
						break;
					case 'text'     : {
						var type = UsedFields['row_' + inputs[i].id].field.getElementsByTagName('type')[0].getAttribute('data-type');
						switch (type) {
							case 'tags' : {
								var values = inputs[i].value.split(',');

								for (var j = 0; j < values.length; j++) {
									values[j] = values[j].replace(/^\s+|\s+$/, '');
								}

								oFilter.setPropertyEqual(inputs[i].name, values);
								break;
							}
							case 'float':
							case 'price':
							case 'int': {
								var value = inputs[i].value.replace(/^\s+|\s+$/, '');
								if (value[0] == '<') {
									oFilter.setPropertyLess(inputs[i].name, value.replace(/[^\d.]*/, ''));
								} else if (value[0] == '>') {
									oFilter.setPropertyGreater(inputs[i].name, value.replace(/[^\d.]*/, ''));
								} else {
									value = value.split('-');

									if (value.length > 1) {
										oFilter.setPropertyBetween(inputs[i].name, value[0].replace(/[^\d.]*/, ''), value[1].replace(/[^\d.]*/, ''));
									} else {
										oFilter.setPropertyEqual(inputs[i].name, value[0].replace(/[^\d.]*/, ''));
									}
								}
								break;
							}
							case 'date': {
								var pieces = [];
								var value = inputs[i].value;
								if (inputs[i].isEmpty != undefined && inputs[i].isEmpty == true) {
									break;
								}
								if (value.length > 0) {
									var index = -1;
									var lastindex = value.indexOf('-');
									if ((index = value.indexOf('<')) != -1) {
										oFilter.setPropertyLess(inputs[i].name, (lastindex != -1) ? value.substring(index + 1, lastindex - 1) : value.substring(index + 1));
									} else if ((index = value.indexOf('>')) != -1) {
										oFilter.setPropertyGreater(inputs[i].name, (lastindex != -1) ? value.substring(index + 1, lastindex - 1) : value.substring(index + 1));
									} else {
										if (lastindex != -1) {
											pieces = value.split(/\s-\s/);
										}
										if (pieces.length == 2) {
											oFilter.setPropertyBetween(inputs[i].name, pieces[0], pieces[1]);
										} else {
											oFilter.setPropertyEqual(inputs[i].name, value);
										}
									}
								}
								break;
							}
							case 'relation': {
								oFilter.setPropertyLike(inputs[i].name, inputs[i].value);
								break;
							}
							default:
								oFilter.setPropertyLike(inputs[i].name, inputs[i].value);
						}
						break;
					}
					default :
						oFilter.setPropertyEqual(inputs[i].name, inputs[i].value);
				}

			}
			inputs = formContainer.getElementsByTagName('select');
			var values = null;

			for (var i = 0; i < inputs.length; i++) {

				if (inputs[i].id == 'select_' + fcId) {
					continue;
				}

				values = [];

				for (var j = 0; j < inputs[i].options.length; j++) {
					if (inputs[i].options[j].selected) {
						values.push(inputs[i].options[j].value);
					}
				}

				oFilter.setPropertyEqual(inputs[i].name, values);
			}

			if (nativeModeChange) {
				oFilter.setConditionModeOr(!radioLogicAnd.checked);
			} else {
				oFilter.setConditionModeOr(true);
			}
		}
		ControlInst.applyFilter(oFilter);
	};
	/** (Private!) */
	var createDeleteRowCallback = function(_RowId) {
		return function() {
			var Row = document.getElementById(_RowId);
			if (Row) {
				Row.parentNode.removeChild(Row);
				UsedFields[_RowId].used = false;
				addSelectize.clearOptions();
				var usedIDs = [];
				var usedCount = 0;
				for (var i in UsedFields) {
					if (UsedFields[i].used) {
						usedIDs.push(UsedFields[i].field.getAttribute('id'));
						usedCount++;
					} else {
						addSelectize.addOption({text: UsedFields[i].field.getAttribute('title'), value: i});
					}
				}
				SettingsStore.getInstance().set(fcId, usedIDs.join(','), currentParent ? '' + currentParent : 'default');
				if (usedCount > 1) {
					logicContainer.style.display = '';
				} else {
					logicContainer.style.display = 'none';
				}
			}
			Control.recalcItemsPosition();
		};
	};
	/** (Private!) */
	var addField = function() {
		if (!addSelect.options.length) {
			return;
		}

		var id = addSelectize.getValue();

		if (id === '') {
			return;
		}

		var row = buildFormRow(UsedFields[id].field);
		if (row) {
			UsedFields[id].used = true;
			formContainer.getElementsByTagName('table')[0].tBodies[1].appendChild(row);
			addSelectize.clear();
			addSelectize.removeOption(id);

			var usedIDs = [];
			for (var i in UsedFields) {
				if (UsedFields[i].used) {
					usedIDs.push(UsedFields[i].field.getAttribute('id'));
				}
			}

			SettingsStore.getInstance().set(fcId, usedIDs.join(','), currentParent ? '' + currentParent : 'default');

			if (usedIDs.length > 1) {
				logicContainer.style.display = '';
			} else {
				logicContainer.style.display = 'none';
			}
			Control.recalcItemsPosition();
		}
	};
	/** (Private!) */
	var createFieldTip = function(Field, Message) {
		var element = Field;
		var p = {x: element.offsetLeft || 0, y: element.offsetTop || 0};
		while (element = element.offsetParent) {
			p.x += element.offsetLeft;
			p.y += element.offsetTop;
		}
		p.x += Field.offsetWidth;
		p.y += Field.offsetHeight;
		var id = 'tip_' + fcId + Math.random();
		var tip = document.createElement('div');
		tip.id = id;
		tip.className = 'fcTip';
		tip.style.zIndex = 50;
		tip.style.position = 'absolute';
		tip.style.left = p.x + 'px';
		tip.style.top = p.y + 'px';
		tip.appendChild(document.createTextNode(Message));
		document.body.appendChild(tip);
		setTimeout(function() {
			tip.parentNode.removeChild(tip);
		}, tipShowTime);
	};
	/** (Private!) */
	var createValidator = function(_Input, _DataType) {
		var re = null;
		var message = '';
		switch (_DataType) {
			case 'int' :
				re = new RegExp("^[<>]?[ ]?\\d*( ?- ?\\d*)?$");
				message = getLabel('js-filter-enter-natural-number');
				break;
			case 'float' :
				re = new RegExp("^[<>]?[ ]?\\d*[\\.]*\\d*( ?- ?\\d*[\\.]*\\d*)?$");
				message = getLabel('js-filter-enter-float-number');
				break;
			case 'date' :
				re = /(^[<>]{1}.*)|(^(((\d\d?[.]\d\d?([.]\d\d(\d\d)?)?)?((\s+|^\s*)\d\d?:\d\d)?)|позавчера|вчера|сегодня|завтра|послезавтра)?(\s*-\s*(((\d\d?[.]\d\d?([.]\d\d(\d\d)?)?)?(\s+\d\d?:\d\d)?)|позавчера|вчера|сегодня|завтра|послезавтра))?)$/i;
				break;
		}
		var vCallback = function() {
			if (_Input) {
				var pos = _Input.classList.contains('_error');
				if (!re.test(_Input.value)) {
					if (!pos) {
						_Input.classList.add('_error');
						errorCount++;
					}
				} else {
					if (pos) {
						_Input.classList.remove('_error');
						errorCount--;
					}
				}
			}
		};
		return vCallback;
	};
	/**
	 * Инициализирует выпадающий список фильтра по полю типа "Ссылка на домен"
	 * @param {HTMLElement} select выпадающий список
	 */
	var initDomainSelect = function(select) {
		requestGet('/udata://core/getDomainsList/', function(response) {
			var domainList = response.responseXML.getElementsByTagName('domain');

			appendOption(select, FILTER_RESET_VALUE, getLabel('js-smc-no-filter'));

			for (var i = 0; i < domainList.length; i++) {
				appendOption(select, domainList[i].getAttribute('id'), domainList[i].getAttribute('decoded-host'));
			}

			new ControlComboBox({el: $(select)});
		});
	};

	/**
	 * Инициализирует выпадающий список фильтра по полю типа "Ссылка на язык"
	 * @param {HTMLElement} select выпадающий список
	 */
	let initLangSelect = function(select) {
		requestGet('/udata://core/getLangsList/', function(response) {
			let langList = response.responseXML.getElementsByTagName('lang');

			appendOption(select, FILTER_RESET_VALUE, getLabel('js-smc-no-filter'));

			for (let i = 0; i < langList.length; i++) {
				appendOption(select, langList[i].getAttribute('id'), langList[i].getAttribute('decoded-host'));
			}

			new ControlComboBox({el: $(select)});
		});
	};

	/**
	 * Добавляет вариант значения в выпадающий список:
	 *
	 * <select>
	 *     <option value="{value}">{label}</option>
	 * </select>
	 *
	 * @param {HTMLElement} select выпадающий список
	 * @param {String|Number} value значение
	 * @param {String} label заголовок значения
	 */
	var appendOption = function(select, value, label) {
		var option = document.createElement('option');
		option.value = value;
		option.appendChild(document.createTextNode(label));
		select.appendChild(option);
	};

	/** (Private!) */
	var loadGuide = function(_Select, _GuideId) {
		if (guideCache[_GuideId] == undefined) {
			var callback = function(_XML) {
				if (!_XML.responseXML.getElementsByTagName('empty').length) {
					var objects = _XML.responseXML.getElementsByTagName('object');
					var guide = [];
					if (!nativeModeChange) {
						guide.push({id: FILTER_RESET_VALUE, value: getLabel('js-smc-no-filter')});
					}
					for (var i = 0; i < objects.length; i++) {
						guide.push({id: objects[i].getAttribute('id'), value: objects[i].getAttribute('name')});
					}
					guideCache[_GuideId] = guide;
				} else {
					guideCache[_GuideId] = 'empty';
				}

				loadGuide(_Select, _GuideId);
			};
			var url = '/admin/data/guide_items_all/' + _GuideId + '.xml?allow-empty';
			requestGet(url, callback);
			return;
		}
		if (guideCache[_GuideId] !== 'empty') {
			for (var j in guideCache[_GuideId]) {
				appendOption(_Select, guideCache[_GuideId][j].id, guideCache[_GuideId][j].value);
			}

			new ControlComboBox({el: $(_Select)});
		} else {
			var name = _Select.name;
			var id = _Select.id;
			var input = createInputByDataType('string', id, name, _GuideId, false);
			var parent = _Select.parentNode;
			parent.removeChild(_Select);
			parent.appendChild(input);
			if (UsedInputs[name]) {
				UsedInputs[name] = input;
			}
		}
	};

	/**
	 * Вешаем событие. Какя-то кривая реализация.
	 * @param el
	 * @param event
	 * @param callback
	 */
	var addEvent = function(el, event, callback) {
		if (typeof(el[event]) == 'function') {
			var h = el[event];
			el[event] = function(e) {
				h(e);
				callback(e);
			};
		} else {
			el[event] = callback;
		}
	};

	/** (Private!) */
	var buildInput = function(_Attributes) {
		var input = document.createElement('input');
		if (_Attributes instanceof Object) {
			for (var i in _Attributes) {
				if (!_Attributes.hasOwnProperty(i)) {
					continue;
				}
				input.setAttribute(i, _Attributes[i]);
			}
		}
		if (_Attributes['class'] != 'fcLogicInput') {
			input.classList.add('default');
		}
		return input;
	};

	/**
	 * Функция создания dom обьекта select под новый дизайн
	 *  <div class="select filter">
	 <div class="selected"></div>
	 <ul  class="list"></ul>
	 <select>
	 <option>Red Hat</option>
	 ...
	 </select>
	 </div>
	 * @param attr      - артибуты селекта обьект формата { lanel : value, ...}
	 * @param options   - массив options в формате массива [label,value]
	 */
	var createSelect = function(attr, options) {
		var wrapper = document.createElement('div');
		wrapper.className = 'filter sel';
		var select = document.createElement('select');
		if (typeof options === 'object' && Object.prototype.toString.call(options) === '[object Array]') {
			for (var i in options) {
				appendOption(select, options[i][1], options[i][0]);
			}
		}
		if (typeof attr === 'object') {
			for (var j in attr) {
				if (!attr.hasOwnProperty(j)) {
					continue;
				}

				if (j != 'multiple' || (j = 'multiple' && !attr[j])) {
					select.setAttribute(j, attr[j]);
				}
			}
		}
		wrapper.appendChild(select);
		return wrapper;
	};

	/** (Private!) */
	var createInputByDataType = function(_DataType, _Id, _Name, _GuideId, _DisallowMultiple) {
		var input = null;
		switch (_DataType) {
			case 'string':
			case 'wysiwyg':
			case 'text':
			case 'password':
			case 'tags':
			case 'color':
			case 'link_to_object_type':
				input = buildInput({'type': 'text', 'class': 'fcStringInput', 'name': _Name, 'id': _Id});
				break;
			case 'date':
				input = buildInput({'type': 'text', 'class': 'fcStringInput', 'name': _Name, 'id': _Id});
				input.setAttribute('placeholder', getLabel('js-filter-date-format'));
				input.onkeyup = createValidator(input, 'date');
				break;
			case 'boolean':
				var bool_no = '0';
			case 'file':
			case 'img_file':
			case 'swf_file':
				var no_value = bool_no || '-1';
				if (!nativeModeChange) {

					var yesLabel = (_DataType == 'boolean') ? getLabel('js-value-yes') : getLabel('js-value-file-yes');
					var noLabel = getLabel('js-value-no');

					input = createSelect({
						name: _Name,
						id: _Id,
						multiple: false
					}, [
						[getLabel('js-smc-no-filter'), FILTER_RESET_VALUE],
						[yesLabel, '1'],
						[noLabel, '0']
					]);

				} else {
					input = document.createElement('div');
					input.className = 'checkbox';
					input.appendChild(buildInput({
						'type': 'checkbox',
						'class': 'fcBooleanInput',
						'name': _Name,
						'id': _Id
					}));
					input.onclick = function() {
						$(this).toggleClass('checked');
					};
				}

				break;
			case 'int':
			case 'counter':
				input = buildInput({'type': 'text', 'class': 'fcStringInput', 'name': _Name, 'id': _Id});
				input.onkeyup = createValidator(input, 'int');
				break;
			case 'float':
			case 'price':
				input = buildInput({'type': 'text', 'class': 'fcStringInput', 'name': _Name, 'id': _Id});
				input.onkeyup = createValidator(input, 'float');
				break;
			case 'relation':
				input = createSelect({
					name: _Name,
					id: _Id,
					multiple: (_DisallowMultiple != undefined && _DisallowMultiple == false)
				});

				loadGuide(input.lastChild, _GuideId);
				break;
			case 'domain_id': {
				input = createSelect({
					name: _Name,
					id: _Id,
					multiple: false
				});

				initDomainSelect(input.lastChild);
				break;
			}
			case 'domain_id_list': {
				input = createSelect({
					name: _Name,
					id: _Id,
					multiple: true
				});

				initDomainSelect(input.lastChild);
				break;
			}
			case 'lang_id': {
				input = createSelect({
					name: _Name,
					id: _Id,
					multiple: false
				});

				initLangSelect(input.lastChild);
				break;
			}
			case 'lang_id_list': {
				input = createSelect({
					name: _Name,
					id: _Id,
					multiple: true
				});

				initLangSelect(input.lastChild);
				break;
			}
		}
		if (input) {
			if (input.classList.contains('checkbox')) {
				addEvent(input.firstChild, 'onkeyup', applyOnEnterEvent);
			} else if (input.classList.contains('sel')) {
				var select = input.lastChild;
				if (select) {
					select.onchange = applyOnChangeEvent;
				}
			} else {
				addEvent(input, 'onkeyup', applyOnEnterEvent);
			}
		}
		return input;
	};
	
	var buildFormRow = function(_Field) {
		var type = _Field.getElementsByTagName('type')[0];
		var input = null;
		var name = _Field.getAttribute('name');
		var id = fcId + '_' + 'id_' + name;
		var rowId = 'row_' + id;

		input = createInputByDataType(type.getAttribute('data-type'), id, name, _Field.getAttribute('guide-id'));

		if (input == null) {
			return null;
		}

		var row = document.createElement('tr');
		var titleCell = document.createElement('td');
		var valueCell = document.createElement('td');
		var deleteCell = document.createElement('td');

		var label = document.createElement('label');
		label.setAttribute('for', id);
		label.appendChild(document.createTextNode(_Field.getAttribute('title')));

		titleCell.className = 'fcTitleCell';
		titleCell.appendChild(label);

		valueCell.className = 'fcValueCell';
		valueCell.appendChild(input);

		var deleteLink = document.createElement('i');
		deleteLink.className = 'small-ico i-remove';
		deleteLink.alt = getLabel('js-filter-remove-field');
		deleteLink.title = getLabel('js-filter-remove-field');
		deleteLink.onclick = createDeleteRowCallback(rowId);

		deleteCell.className = 'fcDeleteCell';
		deleteCell.appendChild(deleteLink);

		row.id = rowId;
		row.appendChild(titleCell);
		row.appendChild(valueCell);
		row.appendChild(deleteCell);
		return row;
	};
	var buildFields = function() {
		if (!nativeModeChange) {
			return;
		}
		while (form.tBodies[1].childNodes.length) {
			form.tBodies[1].removeChild(form.tBodies[1].firstChild);
		}

		addSelectize.clear(true);
		addSelectize.clearOptions();
		var usedCount = 0;
		addSelectize.lock();
		for (var i in UsedFields) {
			if (UsedFields[i].used) {
				var row = buildFormRow(UsedFields[i].field);
				if (row) {
					form.tBodies[1].appendChild(row);
					usedCount++;
				}
			} else {
				addSelectize.addOption({text: UsedFields[i].field.getAttribute('title'), value: i});
			}
		}
		addSelect.disabled = false;
		addSelectize.unlock();

		if (logicContainer) {
			if (usedCount > 1) {
				logicContainer.style.display = '';
			} else {
				logicContainer.style.display = 'none';
			}
		}

		Control.recalcItemsPosition();
	};
	/** (Private!) */
	var buildFilterForm = function(_TypeDOM) {
		if (nativeModeChange) {
			var modeContainer = document.createElement('div');
			modeButton = document.createElement('a');
			modeButton.href   = "javascript:filterController.getInstanceById('" + fcId + "').changeMode();";
			modeContainer.className = 'fcModeContainer';
			modeContainer.appendChild(modeButton);
			modeButton.appendChild(document.createTextNode(getLabel('js-filter-extended-mode')));
		}

		quickSearchContainer = document.createElement('div');
		quickSearchContainer.className = 'input-search';
		quickSearch = buildInput({
			'type': 'text',
			'class': 'default',
			'name': 'quicksearch',
			'id': fcId + '_id_quicksearch',
			'value': (searchStorage && searchStorage.load().join(' ')) || ''
		});

		var searchButton = buildInput({'type': 'button'});
		quickSearch.className = 'default';
		searchButton.className = 'fcApplyButton';
		searchButton.onclick = __self.applyFilter;

		$(window).on('keydown', function(event) {
			if (event.keyCode == 13 && $(quickSearch).is(':focus')) {
				event.preventDefault();
				__self.applyFilter();
			}
		});

		quickSearchContainer.appendChild(quickSearch);
		quickSearchContainer.appendChild(searchButton);

		if (nativeModeChange) {
			formContainer = document.createElement('div');
			form = document.createElement('table');
			form.className = 'fcTable';
			form.appendChild(document.createElement('tbody'));
			form.appendChild(document.createElement('tbody'));
			form.appendChild(document.createElement('tbody'));
			var addRow = document.createElement('tr');
			var dscrCell = document.createElement('td');
			var addCell = document.createElement('td');
			var btnCell = document.createElement('td');
			var addImage = document.createElement('i');
			addSelect = document.createElement('select');

			addSelect.className = 'fcAddSelect default newselect';
			addSelect.id = 'select_' + fcId;
			addSelect.style.width = '100%';

			addImage.className = 'small-ico i-add';
			addImage.alt = getLabel('js-filter-add-field');
			addImage.title = getLabel('js-filter-add-field');
			addImage.onclick = addField;

			addCell.className = 'fcFreeFieldsCell';
			btnCell.className = 'fcAddCell';
			dscrCell.appendChild(document.createTextNode(getLabel('js-filter-fields-list')));

			addCell.colSpan = 1;
			addCell.width = '250px';
			addCell.appendChild(addSelect);
			btnCell.appendChild(addImage);
			addRow.appendChild(dscrCell);
			addRow.appendChild(addCell);
			addRow.appendChild(btnCell);
			form.tBodies[0].appendChild(addRow);

			var emptyRow = document.createElement('tr');
			var emptyCell = document.createElement('td');
			emptyCell.colSpan = 3;
			emptyCell.innerHTML = '&nbsp;';
			emptyRow.appendChild(emptyCell);
			form.tBodies[0].appendChild(emptyRow);

			addRow.className = 'fcAddRow';

			var logicRow = document.createElement('tr');
			var logicCell = document.createElement('td');
			logicCell.colSpan = 3;
			logicCell.className = 'fcLogicCell';

			logicContainer = document.createElement('div');
			radioLogicAnd = buildInput({
				'type': 'radio',
				'class': 'fcLogicInput',
				'value': 'and',
				'name': fcId + '_logic',
				'id': fcId + '_logic_and',
				'checked': true,
				'selected': true
			});
			radioLogicOr = buildInput({'type': 'radio', 'class': 'fcLogicInput', 'value': 'or', 'name': fcId + '_logic', 'id': fcId + '_logic_or'});
			var logicTitle = document.createElement('span');
			var labelLogicAnd = document.createElement('label');
			var labelLogicOr = document.createElement('label');
			var lineLogicAnd = document.createElement('span');
			var lineLogicOr = document.createElement('span');
			logicTitle.className = 'fcLogicTitle';
			logicTitle.appendChild(document.createTextNode(getLabel('js-filter-search-matches')));
			logicContainer.appendChild(logicTitle);

			radioLogicAnd.style.border = '0';
			radioLogicOr.style.border = '0';

			labelLogicAnd.className = 'fcLogicLabel';
			labelLogicAnd.htmlFor = fcId + '_logic_and';
			lineLogicAnd.className = 'fcLogicLine';
			labelLogicAnd.appendChild(document.createTextNode(getLabel('js-filter-with-all-fields')));
			lineLogicAnd.appendChild(labelLogicAnd);
			lineLogicAnd.appendChild(radioLogicAnd);
			logicContainer.appendChild(lineLogicAnd);
			lineLogicOr.className = 'fcLogicLine';
			labelLogicOr.className = 'fcLogicLabel';
			labelLogicOr.htmlFor = fcId + '_logic_or';
			labelLogicOr.appendChild(document.createTextNode(getLabel('js-filter-one-at-least')));
			lineLogicOr.appendChild(labelLogicOr);
			lineLogicOr.appendChild(radioLogicOr);
			logicContainer.appendChild(lineLogicOr);

			logicCell.appendChild(logicContainer);
			logicRow.appendChild(logicCell);
			form.tBodies[2].appendChild(logicRow);

			var applyRow = document.createElement('tr');
			var applyCell = document.createElement('td');
			applyButton = buildInput({'type': 'button', 'value': getLabel('js-filter-do')});
			applyButton.onclick = __self.applyFilter;
			applyButton.className = 'fcApplyButton btn color-blue pull-right';
			applyCell.colSpan = 3;
			applyCell.className = 'fcApplyCell';
			applyCell.appendChild(applyButton);
			applyRow.appendChild(applyCell);
			form.tBodies[2].appendChild(applyRow);

			formContainer.className = 'fcContainer';
			formContainer.style.display = 'none';
			formContainer.appendChild(form);
		}
		var targets = document.createElement('div');
		var targetsTitle = document.createElement('span');
		targetsList = document.createElement('span');
		targetsTitle.appendChild(document.createTextNode(getLabel('js-filter-current-rubrics')));
		targets.appendChild(targetsTitle);
		targets.appendChild(targetsList);
		targets.className = 'fcTargetContainer';
		putEmptyTarget();

		var splitter = document.createElement('div');
		splitter.style.clear = 'both';
		splitter.innerHTML = '&nbsp;';

		if (containerEl) {
			containerEl.appendChild(quickSearchContainer);
			if (nativeModeChange) {
				containerEl.appendChild(modeContainer);
				containerEl.appendChild(formContainer);
			}
			containerEl.appendChild(targets);
		} else {

			containerEl = document.createElement('div');
			containerEl.className = 'filter-container';
			containerEl.appendChild(quickSearchContainer);
			if (nativeModeChange) {
				containerEl.appendChild(modeContainer);
				containerEl.appendChild(formContainer);
			}
			containerEl.appendChild(targets);
			var wr = document.getElementById('filterWrapper_' + _oControll.uid);
			if (wr == null) {
				ControlInst.container.parentNode.insertBefore(containerEl, ControlInst.container);
			} else {
				wr.appendChild(containerEl);
			}
		}

		addSelectize = $(addSelect).selectize({
			allowEmptyOption: true,
			create: false,
			hideSelected: true,
			onDropdownOpen: function(e) {
				offOverflow(e);
			},
			onDropdownClose: function(e) {
				onOverflow(e);
			}
		});
		if (addSelectize[0] != undefined) {
			addSelectize = addSelectize[0].selectize;
		}
		if (nativeModeChange) {
			radioLogicAnd.checked = true;
			buildFields();
		}

	};

	var offOverflow = function(e) {
		var overflowWrapper = $(e).closest('.overflow-block');
		overflowWrapper.css('overflow', 'visible');
		$(e).closest('.table-cell > div').css('overflow', 'visible');

	};

	var onOverflow = function(e) {
		var overflowWrapper = $(e).closest('.overflow-block');
		overflowWrapper.css('overflow', 'auto');
		$(e).closest('.table-cell > div').css('overflow', 'hidden');
	};

	/**
	 * (Private!) Создает новый объект запроса (кросс-браузерная реализация)
	 * @return объект запроса (в зависимости от браузера)
	 */
	var createRequestObject = function() {
		if (window.XMLHttpRequest) {
			try {
				return new XMLHttpRequest();
			} catch (e) {
			}
		} else if (window.ActiveXObject) {
			try {
				return new ActiveXObject('Msxml2.XMLHTTP');
			} catch (e) {
			}
			try {
				return new ActiveXObject('Microsoft.XMLHTTP');
			} catch (e) {
			}
		}
		return null;
	};
	/**
	 * (Private!) Выполняет GET запрос и вызывает соответсвующий CALLBACK
	 * @param _sUrl URL запрашиваемого ресурса
	 * @param _Callback функция, которая будет вызвана в случае успешного завершения запроса
	 */
	var requestGet = function(_sUrl, _Callback) {
		var Request = createRequestObject();
		Request.onreadystatechange = function() {
			if (Request.readyState != 4) {
				return;
			}
			if (Request.status == 200) {
				_Callback(Request);
			} else {
				errorHandler('Request failed');
			}
		};
		Request.open('GET', _sUrl, true);
		Request.send(null);
	};
	/** Выполняет инициализыцию */
	this.init = function() {
		if (nativeModeChange) {
			var Callback = function(_Req) {
				var fields = _Req.responseXML.getElementsByTagName('field');
				parseFields(fields);
				buildFilterForm(_Req.responseXML);
			};

			var tmp = ControlInst.dataSet.getCommonTypeId();
			if (tmp > 0) {
				TypeId = tmp;
			}

			if (TypeId) {
				sUrl = '/utype/' + TypeId + '/';

				if (interfaceLang) {
					sUrl += '?lang=' + interfaceLang;
				}
			} else {
				sUrl = '/utype/dominant/' + TypeId + '/';

				if (interfaceLang) {
					sUrl += '?lang=' + interfaceLang;
				}
			}

			requestGet(sUrl, Callback);
		} else {
			buildFilterForm(null);
		}
	};
	var parseFields = function(_FieldNodes) {
		var fields = _FieldNodes;
		var excludeTypes = ['symlink'];
		var dataType = null;
		var skipField = false;
		var stringIDs = SettingsStore.getInstance().get(fcId, (currentParent) ? '' + currentParent : 'default');
		var usedIDs = (stringIDs === false) ? [] : stringIDs.split(',');
		var used = false;
		var stoplist = ControlInst.dataSet.getFieldsStoplist();
		for (var i = 0; i < fields.length; i++) {
			var name = fields[i].getAttribute('name');
			skipField = false;
			dataType = fields[i].getElementsByTagName('type')[0].getAttribute('data-type');
			for (var j = 0; j < stoplist.length; j++) {
				if (name == stoplist[j]) {
					skipField = true;
					break;
				}
			}
			for (var j = 0; j < excludeTypes.length && !skipField; j++) {
				if (dataType == excludeTypes[j]) {
					skipField = true;
					break;
				}
			}
			if (!skipField) {
				var id = 'row_' + fcId + '_id_' + fields[i].getAttribute('name');
				var fid = fields[i].getAttribute('id');
				used = false;
				for (var k = 0; k < usedIDs.length; k++) {
					if (fid == usedIDs[k]) {
						used = true;
						break;
					}
				}
				UsedFields[id] = {'used': used, 'field': fields[i]};
			}
		}
	};
	/**
	 * (Private!) Вызывается при возникновении какой-либо ошибки
	 * @param _Description описание ошибки
	 */
	var errorHandler = function(_Description) {
		// ToDo: error out
	};
	
	var singleType = false;
	var removeTarget = function() {
		var id = this.id.substr((fcId + '_link_').length);
		delete ControlInst.targetsList[id];
		onTargetSelect({});
		return false;
	};
	var putTarget = function(_Id, _Name) {
		var link = document.createElement('a');
		link.className = 'fcTarget';
		link.id = fcId + '_link_' + _Id;
		link.href = '#';
		link.title = getLabel('js-filter-delete-category');
		link.onclick = removeTarget;
		link.appendChild(document.createTextNode(_Name));

		if (targetsList.childNodes.length) {
			targetsList.appendChild(document.createTextNode(', '));
		}

		targetsList.appendChild(link);
	};

	var putEmptyTarget = function() {
		targetsList.parentNode.style.display = 'none';
	};
	var onTargetSelect = function(_Items) {
		var singleTypeCurrent = false;
		var itemId = null;
		var counter = 0;

		while (targetsList.firstChild) {
			targetsList.removeChild(targetsList.firstChild);
		}

		for (var i in ControlInst.targetsList) {
			counter++;
			itemId = ControlInst.targetsList[i].id;
			putTarget(ControlInst.targetsList[i].id, ControlInst.targetsList[i].name);
		}

		if (!counter) {
			putEmptyTarget();
		} else {
			targetsList.parentNode.style.display = '';
		}

		if (nativeModeChange) {
			if (counter == 1) {
				sUrl = '/utype/dominant/' + itemId + '/';
				singleTypeCurrent = true;
				currentParent = itemId;
			} else {
				sUrl = '/utype/' + TypeId + '/';
				singleTypeCurrent = false;
				currentParent = null;
			}
			if (singleType != singleTypeCurrent) {
				UsedFields = {};
				addSelect.disabled = true;
				requestGet(sUrl,
					function(_Req) {
						if (_Req.responseXML) {
							var fields = _Req.responseXML.getElementsByTagName('field');
							if (fields.length) {
								parseFields(fields);
							}
							buildFields();
						}
					});
				singleType = singleTypeCurrent;
			}
		}
	};
	/** Инициализация */
	if (!(_oControll == undefined || _iTypeId == undefined)) {
		filterController.instances[filterController.instances.length] = this;
		ControlInst = _oControll;
		this.control = ControlInst;
		TypeId = !_iTypeId ? 0 : _iTypeId;
		iconsPath = ControlInst.iconsPath;
		if (!nativeModeChange) {
			ControlInst.onDrawFieldFilter = DrawFieldFilter;
			ControlInst.onRemoveColumn = onRemoveColumn;
		}
		ControlInst.setTargetSelectCallback(onTargetSelect);
		if (_bSuspendInit == undefined || _bSuspendInit == false) {
			this.init();
		} else {
			ControlInst.dataSet.addEventHandler('onInitComplete', this.init);
		}
	}
};

filterController.instances = [];

filterController.getInstanceById = function(sId) {
	for (var i = 0; i < filterController.instances.length; i++) {
		if (filterController.instances[i].getId() === sId) {
			return filterController.instances[i];
		}
	}
	return null;
};

function TemplatesDataSet() {
	var templates = null, domains = null, langs = null;

	var createRequestObject = function() {
		if (window.XMLHttpRequest) {
			try {
				return new XMLHttpRequest();
			} catch (e) {
			}
		} else if (window.ActiveXObject) {
			try {
				return new ActiveXObject('Msxml2.XMLHTTP');
			} catch (e) {
			}
			try {
				return new ActiveXObject('Microsoft.XMLHTTP');
			} catch (e) {
			}
		}
		return null;
	};

	var loadXml = function() {
		var url = '/admin/umiTemplates/domainTemplates.xml';
		var xmlRequest = createRequestObject();

		var onRequestReady = function() {
			if (xmlRequest.readyState != 4) {
				return;
			}

			if (xmlRequest.status == 200) {
				onLoadXml(xmlRequest);
			} else {
				return false;
			}
		};

		xmlRequest.onreadystatechange = onRequestReady;
		xmlRequest.open('GET', url, true);
		xmlRequest.send(null);
	};

	var onLoadXml = function(xmlResponse) {
		var xml = xmlResponse.responseXML;
		templates = parseCollection(xml.getElementsByTagName('template'));
		domains = parseCollection(xml.getElementsByTagName('domain'));
		langs = parseCollection(xml.getElementsByTagName('lang'));
	};

	var getAttributes = function(node) {
		var result = [];
		result['nodeValue'] = (node.textContent || node.text);
		for (var i = 0; i < node.attributes.length; i++) {
			var attr = node.attributes.item(i);
			result[attr.nodeName] = attr.nodeValue;
		}
		return result;
	};

	var parseCollection = function(collection) {
		var result = [];
		for (var i = 0; i < collection.length; i++) {
			var item = collection[i];
			var info = getAttributes(item);
			result.push(info);
		}
		return result;
	};

	this.getLangsList = function() {
		return langs;
	};

	this.getDomainsList = function() {
		return domains;
	};

	this.getTemplatesList = function(domainId, langId) {
		if (!domainId && !langId) {
			return templates;
		}

		var result = [];
		for (var i = 0; i < templates.length; i++) {
			var item = templates[i];
			if (item['domain-id'] == domainId && item['lang-id'] == langId) {
				result.push(item);
			}
		}
		return result;
	};

	loadXml();
};

TemplatesDataSet.instance = null;

TemplatesDataSet.getInstance = function() {
	if (!TemplatesDataSet.instance) {
		TemplatesDataSet.instance = new TemplatesDataSet;
	}
	return TemplatesDataSet.instance;
};

/**
 * dataSet
 * Класс организует передачу данных между сервером и клиентом
 * @param  _sModuleName  имя модуля, предоставляющего данные и некоторую функциональность
 * @param  _bSuspendInit true - отложить инициализацию до явного вызова Init, false - немедленная инициализация
 * @param  _sInitParam
 * @param options дополнительные опции
 */
function dataSet(_sModuleName, _bSuspendInit, _sInitParam, options) {
	/**
	 * (Private!)
	 * Основные данные
	 */
	var ModuleName = _sModuleName;
	var InitParam = (_sInitParam != undefined) ? _sInitParam : '';
	var LoadMethod = '';
	var DefaultFilter = null;
	var StoredFilters = [];
	var Available = false;
	var Inited = false;
	var MethodList = [];
	var CommonFields = [];
	var CommonTypeId = 0;
	var FieldsStoplist = [];
	var DefaultFields = '';
	var LoadedTree = [];
	var ReqCounter = 0;
	/**
	 * (Private!)
	 * Списки обработчиков событий
	 */
	var onInitComplete = [];
	var onBeforeLoad = [];
	var onAfterLoad = [];
	var onBeforeExecute = [];
	var onAfterExecute = [];
	var onBeforeRefresh = [];
	var onAfterRefresh = [];
	var onAfterPieceLoad = [];
	var onRequestFailed = [];

	var options = (typeof(options) === 'object') ? options : {};

	/**
	 * @var {Array} onInitEndRequests Массив объектов вида
	 * {url: someURL, callback: someCallback}
	 * ,где url - адрес, по которому нужно выполнить запрос
	 *        callback - обработчик события получения ответа на запрос
	 */
	var onInitEndRequests = Array.isArray(options.onInitEndRequests) ? options.onInitEndRequests : [];

	/**
	 * Выполняет инициализацию (однократно)
	 * @return true, если уже инициализирован, и false в противном случае
	 */
	this.init = function() {
		if (Inited) {
			return true;
		}
		Inited = true;
		var onLoadType = function(_Type) {
			if (_Type.responseXML) {
				CommonFields = _Type.responseXML.getElementsByTagName('group');
			}
			Available = true;
			if (!processEvents('onInitComplete')) {
				return false;
			}
		};
		var onLoadConfig = function(_Conf) {
			var Methods = _Conf.responseXML.getElementsByTagName('method');
			for (var i = 0; i < Methods.length; i++) {
				var MethodDOM = Methods[i];
				if (MethodDOM.getAttribute('forload') == 'true') {
					LoadMethod = MethodDOM.childNodes[0].nodeValue;
					continue;
				}
				var MethodDesc = {};
				for (var j = 0; j < MethodDOM.attributes.length; j++) {
					var Attribute = MethodDOM.attributes[j];
					if (Attribute.nodeName == 'aliases') {
						continue;
					}
					MethodDesc[Attribute.nodeName] = Attribute.nodeValue;
				}
				MethodDesc['name'] = MethodDOM.childNodes[0].nodeValue;
				var aliasesString = MethodDOM.getAttribute('aliases');
				if (aliasesString) {
					MethodDesc['aliases'] = aliasesString.split(',');
					for (var k = 0; k < MethodDesc.aliases.length; k++) {
						MethodDesc.aliases[k] = MethodDesc.aliases[k].replace(/^\s+|\s+$/, '');
					}
				} else {
					MethodDesc['aliases'] = [];
				}
				MethodList.push(MethodDesc);
			}

			var Excluded = _Conf.responseXML.getElementsByTagName('exclude');
			if (Excluded.length) {
				for (var i = 0; i < Excluded.length; i++) {
					if (Excluded[i].childNodes.length) {
						FieldsStoplist.push(Excluded[i].childNodes[0].nodeValue);
					}
				}
			}

			var Columns = _Conf.responseXML.getElementsByTagName('default');
			if (Columns.length && Columns[0].childNodes.length) {
				DefaultFields = Columns[0].childNodes[0].nodeValue;
			}

			var Types = _Conf.responseXML.getElementsByTagName('type');
			if (Types.length) {
				for (var i = 0; i < Types.length; i++) {
					if (!Types[i].getAttribute('common')) {
						continue;
					}
					var v = Types[i].getAttribute('common').toLowerCase();
					if (v == '1' || v == 'true') {
						CommonTypeId = Types[i].getAttribute('id');
						var sUrl = '/utype/' + CommonTypeId + '/';

						if (interfaceLang) {
							sUrl += '?lang=' + interfaceLang;
						}

						requestGet(sUrl, onLoadType);
						break;
					} else if (v == 'custom') {
						CommonTypeId = Types[i].getAttribute('id');
						var sUrl = CommonTypeId;
						requestGet(sUrl, onLoadType);
					}
				}
			} else {
				Available = true;
				if (!processEvents('onInitComplete')) {
					return false;
				}
			}
		};
		var onInitEnd = function(requests) {
			var data = null;
			for (var i = 0; i < requests.length; i++) {
				data = requests[i];
				if (typeof(data.url) === 'string' && typeof(data.callback) === 'function') {
					requestGet(data.url, data.callback);
				}
			}
		};
		var sUrl = '/admin/' + ModuleName + '/dataset_config.xml' + (InitParam.length ? ('?param=' + InitParam) : '');
		requestGet(sUrl, onLoadConfig);

		onInitEnd(onInitEndRequests);

		return Inited;
	};
	/**
	 * Выполняет загрузку элементов согласно переданому фильтру
	 * @param _Filter фильтр - хэш, определяющий выборку элементов
	 */
	this.load = function(_Filter) {
		if (!Available) {
			return false;
		}
		if (!processEvents('onBeforeLoad')) {
			return false;
		}

		var Callback = function(_Req) {
			var paging = {};
			var Objects = ParseDOM(_Req.responseXML, false, paging);
			if (Objects.length == 0) {
				$('.overflow #nodata').show();
			} else {
				$('.overflow #nodata').hide();
			}
			var Params = {
				'objects': Objects,
				'filter': _Filter,
				'paging': paging
			};
			if ((typeof(Objects) == 'string') || (Objects === null)) {
				Params.error = Objects;
			}
			Available = true;
			if (!processEvents('onAfterLoad', Params)) {
				return false;
			}
		};

		var sUrl = '/admin/' + ModuleName + '/' + LoadMethod + '.xml' + assembleQueryString(_Filter, true);
		requestGet(sUrl, Callback);
	};

	this.getPathModuleMethod = function() {
		return '/admin/' + ModuleName + '/' + LoadMethod;
	};

	/**
	 * Обновляет загруженное с сервера дерево
	 * @param _Branches загружать по родителю или по id, в случае отсутствия кэшированых фильтров
	 */
	this.refresh = function(_Branches) {
		if (!Available) {
			return false;
		}

		if (!processEvents('onBeforeRefresh')) {
			return false;
		}

		if (StoredFilters.length) {
			var sUrl = '/admin/' + ModuleName + '/' + LoadMethod + '.xml';
			var iFilterIndex = 0;

			var ContinuousCallback = function(_Req, _Filter) {
				var paging = {};
				var Objects = ParseDOM(_Req.responseXML, false, paging);

				var Params = {
					'objects': Objects,
					'filter': _Filter,
					'paging': paging
				};

				if ((typeof(Objects) == 'string') || (Objects === null)) {
					Params.error = Objects;
				}

				processEvents('onAfterPieceLoad', Params);
				iFilterIndex++;
				if (iFilterIndex >= StoredFilters.length) {
					Available = true;
					if (!processEvents('onAfterRefresh', {'objects': LoadedTree})) {
						return false;
					}
				} else {
					requestGet(sUrl + assembleQueryString(StoredFilters[iFilterIndex]), ContinuousCallback, StoredFilters[iFilterIndex]);
				}
			};

			Available = false;
			requestGet(sUrl + assembleQueryString(StoredFilters[iFilterIndex]), ContinuousCallback, StoredFilters[iFilterIndex]);

		} else {
			var SimpleCallback = function(_Req, _Filter) {
				var paging = {};
				var Objects = ParseDOM(_Req.responseXML, false, paging);

				var Params = {
					'objects': Objects,
					'filter': new filter(),
					'paging': paging
				};

				if ((typeof(Objects) == 'string') || (Objects === null)) {
					Params.error = Objects;
				}

				Available = true;
				processEvents('onAfterPieceLoad', Params);
				processEvents('onAfterRefresh', {'objects': LoadedTree});

			};
			var aIDs = [];
			var Field = '';
			if (_Branches == undefined || _Branches == false) {
				Field = 'id';
			} else {
				Field = 'rel';
			}
			for (var i = 0; i < LoadedTree.length; i++) {
				aIDs.push(LoadedTree[i][Field]);
			}
			Available = false;
			var sUrl = '/admin/' + ModuleName + '/' + LoadMethod + '.xml?' + Field + '=' + aIDs.join(',');
			LoadedTree = [];  // Don't forget to cleanup
			requestGet(sUrl, SimpleCallback);
		}
	};
	/**
	 * Проверяет доступность некоторого метода
	 * @param _sMethodName имя метода, доступность которого для данного модуля проверяется
	 * @param _returnName  true - возвращать реальное имя метода (если передан имя алиаса)
	 * @return true, если доступен, или false, если не доступен
	 */
	this.isMethodSupported = function(_sMethodName, _returnName) {
		var methodName = _sMethodName.toUpperCase();
		var returnName = (_returnName != undefined && _returnName == true) ? true : false;
		for (var i in MethodList) {
			if (typeof(MethodList[i]) === 'function') {
				continue;
			}
			if (MethodList[i].name.toUpperCase() == methodName) {
				return returnName ? MethodList[i].name : true;
			}
			for (var j = 0; j < MethodList[i].aliases.length; j++) {
				if (MethodList[i].aliases[j].toUpperCase() == methodName) {
					return returnName ? MethodList[i].name : true;
				}
			}
		}
		return false;
	};
	/**
	 * Возвращает список доступных для данного модуля методов
	 * @return массив строк (имен методов)
	 */
	this.getMethodsList = function() {
		return MethodList;
	};
	/**
	 * Возвращает список полей общего для объектов типа
	 * @return массив DOMElement
	 */
	this.getCommonFields = function() {
		return CommonFields;
	};
	
	this.getDefaultFields = function() {
		return DefaultFields;
	};
	
	this.getFieldsStoplist = function() {
		return FieldsStoplist;
	};
	
	this.getCommonTypeId = function() {
		return CommonTypeId;
	};

	/**
	 * Возвращает имя модуля, который предоставляет данные
	 * @returns {String}
	 */
	this.getModule = function() {
		return ModuleName;
	};

	/**
	 * Выполняет указаный метод
	 * @param _sMethodName имя метода
	 * @param _ParamHash   параметры метода
	 */
	this.execute = function(_sMethodName, _ParamHash) {
		if (!Available) {
			return false;
		}

		var methodName = this.isMethodSupported(_sMethodName, true);

		if (!methodName) {
			return false;
		}

		var Params = {
			'method': _sMethodName,
			'params': _ParamHash,
			'objects': []
		};

		if (!processEvents('onBeforeExecute', Params)) {
			return false;
		}

		var Callback = function(_Req) {
			Control.enabled = true;
			var paging = {};
			var Objects = ParseDOM(_Req.responseXML, true, paging);
			updateTree(Objects);
			Params.objects = Objects;
			Params.paging = paging;

			if ((typeof(Objects) == 'string') || (Objects === null)) {
				Params['error'] = Objects;
			}

			if (Objects['error']) {
				Params['error'] = Objects['error'];
			}

			Params['HandleItem'] = jQuery.extend(true, {}, Control.HandleItem);

			Available = true;
			if (!processEvents('onAfterExecute', Params)) {
				return false;
			}
		};

		var currentModule = getModuleForMethod(methodName);
		var sUrl = window.pre_lang + '/admin/' + currentModule + '/' + methodName + '.xml';
		var aQuery = new Array('csrf=' + csrfProtection.getToken());
		for (var PropName in _ParamHash) {
			if (_ParamHash[PropName] instanceof Array) {
				for (var i = 0; i < _ParamHash[PropName].length; i++) {
					aQuery.push(PropName + '[]=' + _ParamHash[PropName][i]);
				}
			} else {
				aQuery.push(PropName + '=' + _ParamHash[PropName]);
			}
		}
		Available = false;
		sUrl = sUrl + '?' + aQuery.join('&');
		requestGet(sUrl, Callback);
	};
	/**
	 * Возвращает уже загруженое дерево
	 * @return дерево элементов/объектов
	 */
	this.getLoadedTree = function() {
		return LoadedTree;
	};
	/** Возвращает доступность dataSet-а */
	this.isAvailable = function() {
		return Available;
	};
	/** Удаляет сохраненные фильтры */
	this.clearFiltersCache = function() {
		StoredFilters = [];
	};
	/**
	 * Устанавливает фильтр по-умолчанию, который применяется ко всем выборкам
	 * @param _Filter фильтр
	 */
	this.setDefaultFilter = function(_Filter) {
		DefaultFilter = _Filter;
	};
	/**
	 * Возвращает фильтр по-умолчанию
	 * @return фильтр
	 */
	this.getDefaultFilter = function() {
		return DefaultFilter;
	};
	/**
	 * Добавляет новый обработчик события в список
	 * @param _sEventKind событие, на которое вешается обработчик
	 * @param _EvHandler  обработчик события
	 * @return внутренний идентификатор обработчика
	 */
	this.addEventHandler = function(_sEventKind, _EvHandler) {
		var EventHandlers = chooseHandlers(_sEventKind);
		if (EventHandlers === null) {
			return false;
		}

		EventHandlers[EventHandlers.length] = {active: true, handler: _EvHandler};
		return EventHandlers.length - 1;
	};
	/**
	 * Удаляет обработчик события из списка
	 * @param _sEventKind событие, с которого снимается обработчик
	 * @param _iHandlerId идентификатор обработчика, возращаемый addEventHandler
	 */
	this.removeEventHandler = function(_sEventKind, _iHandlerId) {
		var EventHandlers = chooseHandlers(_sEventKind);
		if (EventHandlers === null) {
			return false;
		}
		EventHandlers[_iHandlerId].active = false;
	};
	/**
	 * (Private!) Определяет модуль для указаного метода
	 * @param _sMethodName реальное имя метода (не алиас)
	 * @return имя модуля
	 */
	var getModuleForMethod = function(_sMethodName) {
		var methodName = _sMethodName.toUpperCase();
		for (var i = 0; i < MethodList.length; i++) {
			if (MethodList[i].name.toUpperCase() == methodName && MethodList[i].module) {
				return MethodList[i].module;
			}
		}
		return ModuleName;
	};
	/**
	 * (Private!) Запускает обработку событий
	 * @param _sEventKind  событие, обработчики которого вызываются
	 * @param _EventParams параметры (хэш), передаваемые обработчикам
	 */
	var processEvents = function(_sEventKind, _EventParams) {
		if (!Inited) {
			return false;
		}
		var HandlerResult = true;
		var EventHandlers = chooseHandlers(_sEventKind);
		if (EventHandlers === null) {
			return false;
		}
		for (var i in EventHandlers) {
			if (EventHandlers[i].active) {
				HandlerResult = HandlerResult && (EventHandlers[i].handler(_EventParams) !== false);
			}
		}
		return HandlerResult;
	};
	/**
	 * (Private!) Подбирает хранилище обработчиков для данного события
	 * @param _sEventKind  событие
	 * @return массив обработчиков
	 */
	var chooseHandlers = function(_sEventKind) {
		var EventHandlers = null;
		switch (_sEventKind.toUpperCase()) {
			case 'ONINITCOMPLETE'       :
				return onInitComplete;
			case 'ONBEFORELOAD'         :
				return onBeforeLoad;
			case 'ONAFTERLOAD'          :
				return onAfterLoad;
			case 'ONBEFOREEXECUTE'        :
				return onBeforeExecute;
			case 'ONAFTEREXECUTE'        :
				return onAfterExecute;
			case 'ONBEFOREREFRESH'      :
				return onBeforeRefresh;
			case 'ONAFTERREFRESH'       :
				return onAfterRefresh;
			case 'ONAFTERPIECELOAD'        :
				return onAfterPieceLoad;
			case 'ONREQUESTFAILED'      :
				return onRequestFailed;
			default :
				return null;
		}
	};
	/**
	 * (Private!) Создает новый объект запроса (кросс-браузерная реализация)
	 * @return объект запроса (в зависимости от браузера)
	 */
	var createRequestObject = function() {
		if (window.XMLHttpRequest) {
			try {
				return new XMLHttpRequest();
			} catch (e) {
			}
		} else if (window.ActiveXObject) {
			try {
				return new ActiveXObject('Msxml2.XMLHTTP');
			} catch (e) {
			}
			try {
				return new ActiveXObject('Microsoft.XMLHTTP');
			} catch (e) {
			}
		}
		return null;
	};
	/**
	 * (Private!) Выполняет GET запрос и вызывает соответсвующий CALLBACK
	 * @param _sUrl URL запрашиваемого ресурса
	 * @param _Callback функция, которая будет вызвана в случае успешного завершения запроса
	 */
	var requestGet = function(_sUrl, _Callback, _Filter) {
		var Request = createRequestObject();
		Request.onreadystatechange = function() {
			if (Request.readyState != 4) {
				return;
			}
			ReqCounter++;

			if (Request.status === 200 || Request.status === 403) {
				_Callback(Request, _Filter);
			} else {
				processEvents('onRequestFailed');
			}
		};
		Request.open('GET', _sUrl, true);
		Request.send(null);
	};
	/**
	 * (Private!) Формирует строку запроса по переданному фильтру
	 * @param _Filter фильтр - хэш, определяющий выборку элементов
	 * @param _Store true - кэшировать переданный фильтр, false - в противном случае
	 * @return строку запроса
	 */
	var assembleQueryString = function(_Filter, _Store) {
		var sQString = '';
		if (_Filter instanceof Object) {
			if (!DefaultFilter.Full) {
				_Filter.setViewMode(false);
			}

			sQString = _Filter.getQueryString(DefaultFilter);
			if (_Store != undefined && _Store === true) {
				StoredFilters.push(_Filter);
			}
		} else if (_Filter instanceof Object) {
			var Pieces = [];
			if (_Filter.id != undefined) {
				var Param;
				if (_Filter.id instanceof Array) {
					Param = _Filter.id;
				} else {
					Param = [];
					Param.push(_Filter.id);
				}
				Pieces.push('id=' + Param.join(','));
			}
			if (_Filter.rel != undefined) {
				var Param;
				if (_Filter.rel instanceof Array) {
					Param = _Filter.rel;
				} else {
					Param = [];
					Param.push(_Filter.rel);
				}
				Pieces.push('rel=' + Param.join(','));
			}
			if (Pieces.length) {
				sQString = '?' + Pieces.join('&');
				if (_Store != undefined && _Store === true) {
					StoredFilters.push(_Filter);
				}
			}
		}
		return sQString + '&r=' + Math.random();
	};
	/**
	 * (Private!) Обрабатывает DOM и размещает его в массив в соответствии с требованиями
	 * @param _XMLDOM XML DOM с объектами/элементами
	 * @return массив объектов
	 */
	var ParseDOM = function(_XMLDOM, _bIgnoreTree, pagingParams) {
		var Objects = [];
		var DataNode = _XMLDOM.getElementsByTagName('data');
		if (!DataNode.length) {
			return Objects;
		} else {
			DataNode = DataNode[0];
		}
		var Data = DataNode.childNodes;

		for (var i = 0; i < Data.length; i++) {
			var Node = Data[i];
			if (Node.nodeName == 'error') {
				return {error: Node};
			}
			if (Node.nodeName != 'page' && Node.nodeName != 'object' && Node.nodeName != 'type' && Node.nodeName != 'response') {
				continue;
			}
			var o = {};
			for (var j = 0; j < Node.attributes.length; j++) {
				var Attribute = Node.attributes[j];
				o[Attribute.nodeName] = Attribute.nodeValue;
			}
			WalkDOM(o, Node.childNodes);
			Objects.push(o);
			if (_bIgnoreTree == undefined || _bIgnoreTree === false) {
				LoadedTree.push(o);
			}
		}
		if (pagingParams != undefined && (pagingParams instanceof Object)) {
			pagingParams.total = parseInt(DataNode.getAttribute('total')) || Objects.length;
			pagingParams.offset = parseInt(DataNode.getAttribute('offset')) || 0;
			pagingParams.limit = parseInt(DataNode.getAttribute('limit')) || Objects.length;
		}
		return Objects;
	};
	/**
	 * (Private!) Обрабатывает не корневые элементы DOM
	 * @param _Acceptor хэш-приемник результата
	 * @param DOM
	 */
	var WalkDOM = function(_Acceptor, DOM) {
		if (DOM.length == 1 && DOM[0].nodeType == 3) {
			_Acceptor['_value'] = DOM[0].nodeValue;
			return;
		}
		for (var i = 0; i < DOM.length; i++) {
			var Node = DOM[i];

			var o = {};
			if (Node.nodeType != 1) {
				o = Node.nodeValue;
			} else if (!Node.attributes.length && Node.childNodes.length == 1 && Node.childNodes[0].nodeType == 3) {
				o = Node.childNodes[0].nodeValue;
			} else {
				for (var j = 0; j < Node.attributes.length; j++) {
					var Attribute = Node.attributes[j];
					o[Attribute.nodeName] = Attribute.nodeValue;
				}
				WalkDOM(o, Node.childNodes);
			}
			if (_Acceptor[Node.nodeName] == undefined) {
				_Acceptor[Node.nodeName] = o;
			} else {
				if (_Acceptor[Node.nodeName] instanceof Array) {
					_Acceptor[Node.nodeName].push(o);
				} else {
					var Tmp = [];
					Tmp.push(_Acceptor[Node.nodeName]);
					Tmp.push(o);
					_Acceptor[Node.nodeName] = Tmp;
				}
			}
		}
	};
	/**
	 * (Private!) Обновляет элементы в дереве из переданного массива
	 * @param _UpdateHashes
	 */
	var updateTree = function(_UpdateHashes) {
		if (!(_UpdateHashes instanceof Array)) {
			return;
		}

		for (var i = 0; i < _UpdateHashes.length; i++) {
			for (var j = 0; j < LoadedTree.length; j++) {
				if (_UpdateHashes[i].id == LoadedTree[j].id) {
					for (var item in _UpdateHashes[i]) {
						LoadedTree[j][item] = _UpdateHashes[i][item];
					}
					break;
				}
			}
		}
	};
	/** Инициализация */
	if ((typeof(_bSuspendInit) == 'undefined') || (_bSuspendInit == false)) {
		this.init();
	}
};

/**
 * SettingsStore
 * Класс предоставляет интерфейс для сохранения пользовательских предпочтений в профиле пользователя
 */

SettingsStore.instance = null;

SettingsStore.getInstance = function() {
	if (!SettingsStore.instance) {
		SettingsStore.instance = new SettingsStore();
	}
	return SettingsStore.instance;
};

function SettingsStore() {
	/**
	 * Список всех доступных записей
	 * @access private
	 */
	var keys = window.settingsStoreData || {};

	var __self = this;
	/**
	 * Списки обработчиков событий
	 * @access private
	 */
	var onLoadComplete = [];

	this.loaded = window.settingsStoreData ? true : false;

	/** @var {String} PACKED_LIST_DIVIDER разделитель для упаковски списка значений одного ключа */
	var PACKED_LIST_DIVIDER = '|';

	/**
	 * Получить запись по ключу
	 * @access public
	 * @param {String} key ключ записи
	 * @param {String} target_tag получить только те записи, которые соответствуют тегу target_tag
	 * @return {Mixed} значение записи, либо false
	 */
	this.get = function(key, target_tag) {
		target_tag = checkTagsArray(target_tag);

		if (keys[key]) {
			return (keys[key][target_tag]) ? keys[key][target_tag] : false;
		} else {
			return false;
		}
	};

	/**
	 * Упаковывает список значений одного ключа
	 * @param {Array} valueList список значений
	 * @returns {String}
	 */
	this.packValueList = function(valueList) {
		return valueList.join(PACKED_LIST_DIVIDER);
	};

	/**
	 * Распаковывает список значений одного ключа
	 * @param {String} packedValueList
	 * @returns {Array}
	 */
	this.unpackValueList = function(packedValueList) {
		return packedValueList.toString().split(PACKED_LIST_DIVIDER);
	};

	/**
	 * Внести новое значение или изменить существующее
	 * @access public
	 * @param {String} key ключ значения
	 * @param {Mixed} value значение, должно быть ортогональным
	 * @param {Array} filter_tags пометить запись ключами
	 */
	this.set = function(key, value, filter_tags) {
		if (!key) {
			return false;
		}
		filter_tags = checkTagsArray(filter_tags);

		var sUrl = '/admin/users/saveUserSettings/?key=' + key + '&value=' + value;

		if (filter_tags) {
			for (var i = 0; i < filter_tags.length; i++) {
				sUrl += '&tags[]=' + filter_tags[i];
			}
		} else {
			filter_tags = {};
		}

		var Callback = function(request) {
		};
		requestGet(sUrl, Callback);

		for (var i = 0; i < filter_tags.length; i++) {
			var tag = filter_tags[i];

			if (!keys[key]) {
				keys[key] = {};
			}

			if (value) {
				keys[key][tag] = value;
			} else {
				keys[key][tag] = undefined;
			}
		}
	};

	/**
	 * Получить список ключей
	 * @access public
	 * @param {Array} target_tags полуить только те ключи, которые соответствуют тегам в массиве target_tags
	 * @return {Array} список ключей
	 */
	this.list = function(target_tags) {
		target_tags = checkTagsArray(target_tags);
		var result = [];

		for (key in keys) {
			var values = keys[key];

			var value = false;
			for (var i in target_tags) {
				var tag = target_tags[i];

				for (var valueTag in values) {
					if (valueTag == tag) {
						value = values[valueTag];
					}
				}
			}

			if (value) {
				result[key] = value;
			}
		}

		return result;
	};

	this.callback = function(func) {
		if (typeof func == 'function') {
			callback = func;
		}
		return this;
	};

	/**
	 * Загрузить данные с сервера
	 * @access private
	 */
	this.load = function() {
		if (this.loaded) {
			return true;
		}
		setTimeout(function() {
			var sUrl = '/udata/users/loadUserSettings/?r=' + Math.random();
			var Callback = function(request) {
				__self.loaded = true;
				parseXmlDom(request.responseXML);
				processEvents('onLoadComplete');
			};
			requestGet(sUrl, Callback);
		}, 50);
	};

	/**
	 * Добавляет новый обработчик события в список
	 * @param _sEventKind событие, на которое вешается обработчик
	 * @param _EvHandler  обработчик события
	 * @return внутренний идентификатор обработчика
	 */
	this.addEventHandler = function(_sEventKind, _EvHandler) {
		var EventHandlers = chooseHandlers(_sEventKind);
		if (EventHandlers === null) {
			return false;
		}
		EventHandlers[EventHandlers.length] = {active: true, handler: _EvHandler};
		if (this.loaded && _sEventKind.toUpperCase() == 'ONLOADCOMPLETE') {
			_EvHandler();
		}
		return EventHandlers.length - 1;
	};

	/**
	 * (Private!) Запускает обработку событий
	 * @param _sEventKind  событие, обработчики которого вызываются
	 * @param _EventParams параметры (хэш), передаваемые обработчикам
	 */
	var processEvents = function(_sEventKind, _EventParams) {
		var EventHandlers = chooseHandlers(_sEventKind);
		if (EventHandlers === null) {
			return false;
		}
		for (var i in EventHandlers) {
			if (EventHandlers[i].active) {
				EventHandlers[i].handler(_EventParams);
			}
		}
	};

	/**
	 * (Private!) Подбирает хранилище обработчиков для данного события
	 * @param _sEventKind  событие
	 * @return массив обработчиков
	 */
	var chooseHandlers = function(_sEventKind) {
		var EventHandlers = null;
		switch (_sEventKind.toUpperCase()) {
			case 'ONLOADCOMPLETE'       :
				return onLoadComplete;
			default :
				return null;
		}
	};

	/**
	 * Получить гарантировано корректный список тегов
	 * @param Array|String|Mixed tags список тегов
	 * @access private
	 * @return Array список тегов
	 */
	var checkTagsArray = function(tags) {
		var typeofTagsVar = typeof tags;

		if (typeofTagsVar == 'object') {
			if (tags.length > 0) {
				return tags;
			} else {
				tags.push('common');
				return tags;
			}
		} else if (typeofTagsVar == 'string') {
			return new Array(tags);
		} else if (typeofTagsVar == 'undefined') {
			return new Array('common');
		} else {
			return false;
		}
	};

	/**
	 * Создает новый объект запроса (кросс-браузерная реализация)
	 * @access private
	 * @return объект запроса (в зависимости от браузера)
	 */
	var createRequestObject = function() {
		if (window.XMLHttpRequest) {
			try {
				return new XMLHttpRequest();
			} catch (e) {
			}
		} else if (window.ActiveXObject) {
			try {
				return new ActiveXObject('Msxml2.XMLHTTP');
			} catch (e) {
			}
			try {
				return new ActiveXObject('Microsoft.XMLHTTP');
			} catch (e) {
			}
		}
		return null;
	};

	/**
	 * Выполняет GET запрос и вызывает соответсвующий CALLBACK
	 * @param _sUrl URL запрашиваемого ресурса
	 * @param _Callback функция, которая будет вызвана в случае успешного завершения запроса
	 * @access private
	 */
	var requestGet = function(_sUrl, _Callback) {
		var Request = createRequestObject();
		Request.onreadystatechange = function() {
			if (Request.readyState != 4) {
				return;
			}
			if (Request.status == 200) {
				_Callback(Request);
			} else {
				processEvents('onRequestFailed');
			}
		};
		Request.open('GET', _sUrl, false);
		Request.send(null);
	};

	/**
	 * Обработать данные из XML во внутреннее представление
	 * @param xmldom XML DOM из Ajax'а
	 * @access private
	 */
	var parseXmlDom = function(xmldom) {
		var data = xmldom.getElementsByTagName('item');

		for (var i = 0; i < data.length; i++) {
			var entry = data[i];

			var key = entry.getAttribute('key');

			keys[key] = {};

			var childs = entry.childNodes;
			var value = '', tag = '';
			for (var j = 0; j < childs.length; j++) {
				var node = childs[j];

				if (node.nodeName == 'value') {
					value = node.firstChild.nodeValue;
					tag = node.getAttribute('tag');

					keys[key][tag] = value;
					continue;
				}
			}
		}
	};

	if (this.loaded) {
		processEvents('onLoadComplete');
	}

}

jQuery(function() {
	SettingsStore.getInstance().load();
});

/**
 * Класс хранилища значения для полнотекстового поиска в табличном контроле
 * @param {String} controlId идентификатор табличного контрола
 */
function SearchAllTextStorage(controlId) {

	/** @var {String} ключ для хранения значения полнотекстового поиска */
	this.index = 'search-string';

	/** @var {String} тэг для хранения значения полнотекстового поиска */
	this.filterTag = controlId;

	/**
	 * Сохраняет значения полнотекстового поиска
	 * @param {Array} valueList список значений
	 */
	this.save = function(valueList) {
		var settingStore =  SettingsStore.getInstance();
		var packedList = settingStore.packValueList(valueList);
		settingStore.set(this.index, packedList, this.filterTag);
	};

	/**
	 * Загружает значения полнотекстового поиска
	 * @returns {Array}
	 */
	this.load = function() {
		var settingStore =  SettingsStore.getInstance();
		var searchString = settingStore.get(this.index, this.filterTag);

		if (searchString === false) {
			return [];
		}

		return settingStore.unpackValueList(searchString);
	};
}
/**
 * Класс рекурсивного оператора над деревом страниц.
 * Класс отвечает за:
 *
 * 1) Включение активности;
 * 2) Выключение активности;
 * 3) Помещение страниц в корзину;
 * 4) Восстановление страниц из корзины;
 * 5) Удаление страниц;
 *
 * @param {Control} Control контрол для управления страницами
 * @constructor
 */
function PageTreeRecursiveOperator(Control) {

	/** @var {Boolean} isProgressWindowShown флаг факта отображения окна с прелоудером */
	var isProgressWindowShown = false;

	/** @var {Object} parentIdQueue очередь обрабатываемых родительских страниц */
	var parentIdQueue = {};

	/** @var {Integer} CHILDREN_PART_LIMIT ограничение на размер части списка страниц */
	var CHILDREN_PART_LIMIT = 50;

	/** @var {Integer} FUNCTION_EXECUTION_TIMEOUT значение таймаута по умолчанию для отложенного выполнения функции */
	var FUNCTION_EXECUTION_TIMEOUT = 50;

	/** @var {Integer} FORBIDDEN_RESPONSE_STATUS_CODE код ответа сервера при отсутствии прав */
	var FORBIDDEN_RESPONSE_STATUS_CODE = 403;

	/** Кастомный контруктор */
	this.init = function() {
		bindRepetition(this);
	};

	/**
	 * Переключает активность у списка родительских страниц и их детей
	 * @param {Array|Integer} idOrList идентификатор или список идентификаторов родительских страниц
	 * @param {Boolean} targetStatus целевой статус активности
	 */
	this.switchActivity = function(idOrList, targetStatus) {
		targetStatus ? this.activate(idOrList) : this.deactivate(idOrList);
	};

	/**
	 * Включает активность у списка родительских страниц и их детей
	 * @param {Array|Integer} idOrList идентификатор или список идентификаторов родительских страниц
	 */
	this.activate = function(idOrList) {
		var parentIdList = getParentIdList(idOrList);
		parentIdList.forEach(pushParentId);
		parentIdList.forEach(activateTree);
	};

	/**
	 * Выключает активность у списка родительских страниц и их детей
	 * @param {Array|Integer} idOrList идентификатор или список идентификаторов родительских страниц
	 */
	this.deactivate = function(idOrList) {
		var parentIdList = getParentIdList(idOrList);
		parentIdList.forEach(pushParentId);
		parentIdList.forEach(deactivateTree);
	};

	/**
	 * Помещает список родительских страниц и их детей в корзину
	 * @param {Array|Integer} idOrList идентификатор или список идентификаторов родительских страниц
	 * @param {Boolean} showConfirmation необходимо ли показывать подтверждение
	 */
	this.putToTrash = function(idOrList, showConfirmation) {
		var parentIdList = getParentIdList(idOrList);
		parentIdList.forEach(pushParentId);

		function putToTrash() {
			parentIdList.forEach(putTreeToTrash);
		}

		showConfirmation ? showDeleteConfirmation(putToTrash) : putToTrash();
	};

	/**
	 * Восстанавливает список родительских страниц и их детей из корзины
	 * @param {Array|Integer} idOrList идентификатор или список идентификаторов родительских страниц
	 */
	this.restoreFromTrash = function(idOrList) {
		var parentIdList = getParentIdList(idOrList);
		parentIdList.forEach(pushParentId);
		parentIdList.forEach(restoreTreeFromTrash);
	};

	/**
	 * Удаляет список родительских страниц и их детей из корзины
	 * @param {Array|Integer} idOrList идентификатор или список идентификаторов родительских страниц
	 * @param {Boolean} showConfirmation необходимо ли показывать подтверждение
	 */
	this.remove = function(idOrList, showConfirmation) {
		var parentIdList = getParentIdList(idOrList);
		parentIdList.forEach(pushParentId);

		function deleteList() {
			parentIdList.forEach(deleteTree);
		}

		showConfirmation ? showDeleteConfirmation(deleteList) : deleteList();
	};

	/**
	 * Возвращает список идентификаторов страниц
	 * @param {Array|Integer} idOrList идентификатор или список идентификаторов родительских страниц
	 * @returns {Array}
	 */
	function getParentIdList(idOrList) {
		var idList = Array.isArray(idOrList) ? idOrList : [idOrList];

		idList.forEach(function(value, index) {
			idList[index] = parseInt(value);
		});

		return idList;
	}

	/**
	 * Формирует список идентификаторов страниц, над которым производится операция
	 * @param {Document} response ответ бэкенда со списком дочерних страниц
	 * @param {Integer} parentId идентификатор родительской страницы
	 * @returns {Array}
	 */
	function getPageIdListForRequest(response, parentId) {
		var pageIdList = collectChildIdList(response);
		return (pageIdList.length === 0) ? [parentId] : pageIdList
	}

	/**
	 * Включает активность родительской страницы и всех ее детей
	 * @param {Integer} parentId идентификатор родительской страницы
	 */
	function activateTree(parentId) {
		forEachChildInPart(parentId, 'getInactiveChildrenPart', requestActivate);
	}

	/**
	 * Отключает активность родительской страницы и всех ее детей
	 * @param {Integer} parentId идентификатор родительской страницы
	 */
	function deactivateTree(parentId) {
		forEachChildInPart(parentId, 'getActiveChildrenPart', requestDeactivate);
	}

	/**
	 * Помещает родительскую страницу и ее детей в корзину
	 * @param {Integer} parentId идентификатор родительской страницы
	 */
	function putTreeToTrash(parentId) {
		forEachChildInPart(parentId, 'getChildrenPart', requestPutToTrash);
	}

	/**
	 * Восстанавливает родительскую страницу и ее детей из корзины
	 * @param {Integer} parentId идентификатор родительской страницы
	 */
	function restoreTreeFromTrash(parentId) {
		forEachChildInPart(parentId, 'getDeletedChildrenPart', requestRestoreFromTrash);
	}

	/**
	 * Удаляет родительскую страницу и ее детей из корзины
	 * @param {Integer} parentId идентификатор родительской страницы
	 */
	function deleteTree(parentId) {
		forEachChildInPart(parentId, 'getDeletedChildrenPart', requestDelete);
	}

	/**
	 * Выполняет операцию для каждой дочерней страницы в части списка
	 * @param {Integer} parentId идентификатор родительской страницы
	 * @param {String} method метод бэкенда для получение части списка
	 * @param {Function} callback реализация операции
	 */
	function forEachChildInPart(parentId, method, callback) {
		getChildrenPart(parentId, method, function(response) {
			var pageIdList = getPageIdListForRequest(response, parentId);
			callback(pageIdList, parentId);
		});
	}
	
	/**
	 * Показывает окно с подтверждение удаления
	 * @param {Function} callback функция обратного вызова в случае подтверждения
	 */
	function showDeleteConfirmation(callback) {
		openDialog('', getLabel('js-del-object-title-short'), {
			html: getLabel('js-del-page-warning'),
			confirmText: getLabel('js-del-do'),
			cancelButton: true,
			cancelText: getLabel('js-cancel'),
			confirmCallback: function(dialogName) {
				closeDialog(dialogName);
				callback();
			}
		});
	}

	/**
	 * Помещает родительскую страницу в очередь
	 * @param {Integer} id идентификатор родительской страницы
	 */
	function pushParentId(id) {
		parentIdQueue[id] = id;
	}

	/**
	 * Удаляет родительскую страницу из очереди
	 * @param {Integer} id идентификатор родительской страницы
	 */
	function pullParentId(id) {
		delete parentIdQueue[id];
	}

	/**
	 * Определяет находится ли родительская страница в очереди
	 * @param {Integer} id идентификатор родительской страницы
	 * @returns {Boolean}
	 */
	function isParentInQueue(id) {
		return !!parentIdQueue[id];
	}

	/**
	 * Возвращает длину очереди родительских страниц
	 * @returns {Integer}
	 */
	function getParentIdQueueLength() {
		return Object.keys(parentIdQueue).length;
	}

	/**
	 * Подключает повторное выполнение операции
	 * @param {PageTreeRecursiveOperator} operator экземпляр класса оператора
	 */
	function bindRepetition(operator) {
		Control.dataSet.addEventHandler('onAfterExecute', function(request) {
			var parentId = request.params.parent_id;

			if (request.params.is_last_iteration) {
				stopRepetition(parentId);
				return true;
			}

			if (isOperationRequiresSeveralIteration(request.params.element.length)) {
				showProgressWindow(parentId);
			}

			repeatOperation(operator, request);
			return true;
		});
	}

	/**
	 * Останавливает повторение операции над родительской страницей
	 * @param {Integer} parentId идентфикатор родительской страницы
	 */
	function stopRepetition(parentId) {
		pullParentId(parentId);

		if (getParentIdQueueLength() === 0) {
			closeProgressWindow(parentId);
		}
	}

	/**
	 * Запрашивает повторение операции
	 * @param {PageTreeRecursiveOperator} operator экземпляр класса оператора
	 * @param {Object} request запрос предыдущей операции
	 */
	function repeatOperation(operator, request) {
		var parentId = request.params.parent_id;

		if (request.method === 'tree_set_activity') {
			operator.switchActivity(parentId, request.params.active);
		}

		if (request.method === 'restore_element') {
			operator.restoreFromTrash(parentId);
		}

		var showConfirmation = false;

		if (request.method === 'tree_delete_element') {
			operator.putToTrash(parentId, showConfirmation);
		}

		if (request.method === 'tree_kill_element') {
			operator.remove(parentId, showConfirmation);
		}
	}

	/**
	 * Отображает окно с прелоудером
	 * @param {Integer} parentId идентификатор родительской страницы
	 */
	function showProgressWindow(parentId) {
		if (isProgressWindowShown) {
			return;
		}

		isProgressWindowShown = true;
		$.get('/styles/skins/modern/design/js/common/html/ProgressBar.html', function(html) {
			openDialog('', getLabel('js-operation-processing'), {
				name: parentId,
				html: html,
				width: 460,
				cancelButton: false,
				stdButtons: false,
				closeButton: false,
				customClass: 'modalUp'
			});
		});
	}

	/**
	 * Закрывает окно с прелоудером
	 * @param {Integer} parentId идентификатор родительской страницы
	 */
	function closeProgressWindow(parentId) {
		isProgressWindowShown = false;
		var popupName = parentId ? parentId.toString() : '';
		getPopupByName(popupName) ? closeDialog(popupName) : closeDialog();
	}

	/**
	 * Определяет будет ли операция над страницами требовать нескольких итераций
	 * @param {Integer} pageListLength количество страниц, которым требуется поменять статус
	 * @returns {Boolean}
	 */
	function isOperationRequiresSeveralIteration(pageListLength) {
		return !isProgressWindowShown && pageListLength === CHILDREN_PART_LIMIT;
	}

	/**
	 * Запрашивает активацию списка страниц
	 * @param {Array} pageIdList список идентификаторов страниц
	 * @param {Integer} parentId идентификатор родительской страницы
	 */
	function requestActivate(pageIdList, parentId) {
		requestSwitchActivity(pageIdList, parentId, true);
	}

	/**
	 * Запрашивает деактивацию списка страниц
	 * @param {Array} pageIdList список идентификаторов страниц
	 * @param {Integer} parentId идентификатор родительской страницы
	 */
	function requestDeactivate(pageIdList, parentId) {
		requestSwitchActivity(pageIdList, parentId, false);
	}

	/**
	 * Запрашивает изменение активности списка страниц
	 * @param {Array} pageIdList список идентификаторов страниц
	 * @param {Integer} parentId идентификатор родительской страницы
	 * @param {Boolean} status желаемый статус активности
	 */
	function requestSwitchActivity(pageIdList, parentId, status) {
		if (!isParentInQueue(parentId)) {
			return;
		}

		var DataSet = Control.dataSet;

		if (!DataSet.isAvailable()) {
			executeWithTimeout(requestSwitchActivity, [pageIdList, parentId, status], FUNCTION_EXECUTION_TIMEOUT);
			return;
		}

		DataSet.execute('tree_set_activity', {
			'element': pageIdList,
			'selected_items': collectPageList(pageIdList),
			'active': status ? 1 : 0,
			'parent_id': parentId,
			'is_last_iteration': isLastIteration(pageIdList, parentId)
		});
	}

	/**
	 * Запрашивает помещение списка страниц в корзину
	 * @param {Array} pageIdList список идентификаторов страниц
	 * @param {Integer} parentId идентификатор родительской страницы
	 */
	function requestPutToTrash(pageIdList, parentId) {
		if (!isParentInQueue(parentId)) {
			return;
		}

		var DataSet = Control.dataSet;

		if (!DataSet.isAvailable()) {
			executeWithTimeout(requestPutToTrash, [pageIdList, parentId], FUNCTION_EXECUTION_TIMEOUT);
			return;
		}

		DataSet.execute('tree_delete_element', {
			'element': pageIdList,
			'selected_items': collectPageList(pageIdList),
			'allow': true,
			'parent_id': parentId,
			'is_last_iteration': isLastIteration(pageIdList, parentId)
		});
	}

	/**
	 * Запрашивает восстановление списка страниц из корзины
	 * @param {Array} pageIdList список идентификаторов страниц
	 * @param {Integer} parentId идентификатор родительской страницы
	 */
	function requestRestoreFromTrash(pageIdList, parentId) {
		if (!isParentInQueue(parentId)) {
			return;
		}

		var DataSet = Control.dataSet;

		if (!DataSet.isAvailable()) {
			executeWithTimeout(requestRestoreFromTrash, [pageIdList, parentId], FUNCTION_EXECUTION_TIMEOUT);
			return;
		}

		DataSet.execute('restore_element', {
			'element': pageIdList,
			'selected_items': collectPageList(pageIdList),
			'parent_id': parentId,
			'is_last_iteration': isLastIteration(pageIdList, parentId)
		});
	}

	/**
	 * Запрашивает удаление списка страниц из корзины
	 * @param {Array} pageIdList список идентификаторов страниц
	 * @param {Integer} parentId идентификатор родительской страницы
	 */
	function requestDelete(pageIdList, parentId) {
		if (!isParentInQueue(parentId)) {
			return;
		}

		var DataSet = Control.dataSet;

		if (!DataSet.isAvailable()) {
			executeWithTimeout(requestDelete, [pageIdList, parentId], FUNCTION_EXECUTION_TIMEOUT);
			return;
		}

		DataSet.execute('tree_kill_element', {
			'element': pageIdList,
			'selected_items': collectPageList(pageIdList),
			'parent_id': parentId,
			'is_last_iteration': isLastIteration(pageIdList, parentId)
		});
	}

	/**
	 * Выполняет функцию обратного вызова с таймаутом
	 * @param {Function} callback функция обратного вызова
	 * @param {Array} params параметры вызова
	 * @param {Integer} timeout таймаут
	 */
	function executeWithTimeout(callback, params, timeout) {
		setTimeout(function() {
			callback.apply(this, params);
		}, timeout);
	}

	/**
	 * Определяет будет ли следующая итерация последней
	 * @param {Array} pageIdList список идентификаторов изменяемых страниц
	 * @param {Integer} parentId идентификатор родительской страницы
	 * @returns {Boolean}
	 */
	function isLastIteration(pageIdList, parentId) {
		return pageIdList.length === 1 && pageIdList[0] === parentId;
	}

	/**
	 * Возвращает список страниц
	 * @param {Array} pageIdList список идентификаторов страниц
	 * @return {Object}
	 */
	function collectPageList(pageIdList) {
		var pageList = {};

		$(pageIdList).each(function() {
			var entity = Control.getItem(this);

			if (entity) {
				pageList[entity.id] = entity;
			}
		});

		return pageList;
	}

	/**
	 * Запрашивает часть списка дочерних страниц
	 * @param {Integer} parentId идентификатор родительской страницы
	 * @param {String} method метод бэкенда для получение части списка
	 * @param {Function} handleSuccessRequest обработчик успешного получения списка
	 */
	function getChildrenPart(parentId, method, handleSuccessRequest) {
		$.ajax({
			url: window.pre_lang + '/admin/' + Control.dataSet.getModule() + '/' + method + '/.xml',
			dataType: 'xml',
			method: 'get',
			data: { parentId: parentId },
			success: handleSuccessRequest,
			error: handleErrorRequest
		});
	}

	/**
	 * Разбирает ответ бэкенда со списком дочерних страниц и возвращает их идентификаторы
	 * @param {Document} response ответ бэкенда со списком дочерних страниц
	 * @returns {Array}
	 */
	function collectChildIdList(response) {
		var childIdList = [];

		$('child', response).each(function() {
			childIdList.push($(this).attr('id'));
		});

		return childIdList;
	}

	/**
	 * Обрабатывает ответ бэкенда с ошибкой
	 * @param {Document} response ответ бэкенда с ошибкой
	 */
	function handleErrorRequest(response) {
		if (response.status && response.status === FORBIDDEN_RESPONSE_STATUS_CODE) {
			showError('error-require-more-permissions');
		} else {
			showError('js-server_error');
		}
	}

	/**
	 * Отображает ошибку
	 * @param {String} error
	 */
	function showError(error) {
		$.jGrowl(getLabel(error), {header: getLabel('js-error-header')});
	}

	this.init();
}
/**
 * Редактируемая ячейка в табличном контроле.
 *
 * @constructor
 * @param {TableItem} tableItem Ряд табличного контрола, в котором находится ячейка
 * @param {HTMLTableCellElement} htmlTableCell HTML-тег <td>, к которому привязана ячейка
 * @param {Object} propInfo Свойства поля ячейки
 * @param {HTMLElement} editButton HTML-тег <i> - кнопка "Быстрое редактирование" (иконка "Карандаш")
 */
var editableCell = function(tableItem, htmlTableCell, propInfo, editButton) {

	/**
	 * @type {Number} Код кнопки "Escape"
	 * @private
	 */
	var ESCAPE_KEY_CODE = 27;

	/**
	 * @type {Number} Код кнопки "Enter"
	 * @private
	 */
	var ENTER_KEY_CODE = 13;

	/**
	 * @type {editableCell} Ячейка
	 * @private
	 */
	var _self = this;

	/**
	 * @type {Object} Свойства поля ячейки
	 * @private
	 */
	var _propInfo = propInfo;

	/**
	 * @type {String} Название поля
	 * @private
	 */
	var _propName = propInfo.fieldName || propInfo.name;

	/**
	 * @type {TableItem} Ряд табличного контрола, в котором находится ячейка
	 * @private
	 */
	var _item = tableItem;

	/**
	 * @type {Boolean} Индикатор работы табличного контрола в объектном режиме
	 * @private
	 */
	var _isObjectMode = (_item.control.contentType !== 'pages');

	/**
	 * @type {Object} jQuery-объект элемента, в который вводится новое значение поля.
	 * Конкретный элемент зависит от типа поля: это может быть input, select, div и т.д.
	 * @private
	 */
	var _$editControl;

	/**
	 * @type {String} Предыдущее значение поля.
	 * Его нужно запоминать для того, чтобы не делать запрос
	 * на сохранение нового значения поля, если оно равно старому значению.
	 * @private
	 */
	var _oldValue = '';

	/**
	 * @type {String} Предыдущий HTML-текст поля.
	 * Если новое значение поля не было сохранено,
	 * то будет восстановлен старый контент поля.
	 * @private
	 */
	var _oldCellContent = '';

	/**
	 * @type {Boolean} Индикатор активности ячейки
	 * @public
	 */
	this.isActive = false;

	/**
	 * @type {HTMLTableCellElement} HTML-элемент <td>, к которому привязана ячейка
	 * @public
	 */
	this.element = htmlTableCell;

	/**
	 * Инициализирует новую ячейку
	 * @private
	 */
	(function initialize() {
		if (!isValid()) {
			return;
		}

		$(editButton).on('click', editButtonClickHandler);
		_self.isActive = true;

		/**
		 * Проверяет ячейку на валидность
		 * @private
		 * @returns {boolean}
		 */
		function isValid() {
			if (!editableCell.enableEdit) {
				return false;
			}

			if (_.contains(editableCell.ignoreDataTypes, propInfo['dataType'])) {
				return false;
			}

			if (_.contains(editableCell.ignorePropNames, _propName)) {
				return false;
			}

			return true;
		}

		/**
		 * Обработчик нажатия на кнопку "Быстрое редактирование" (иконка "Карандаш")
		 * @private
		 */
		function editButtonClickHandler() {
			if (editableCell.activeCell) {
				return;
			}

			_self.makeEditable();
		}
	})();

	/**
	 * Сохраняет новое значение поля
	 * @public
	 */
	this.prepareSaveData = function() {
		if (_$editControl) {
			_self.save(_$editControl.val(), false);
		}
	};

	/**
	 * Делает ячейку редактируемой.
	 * Одновременно в контроле может быть не больше одной редактируемой ячейки.
	 * @public
	 */
	this.makeEditable = function() {
		editableCell.activeCell = _self;
		getData();
	};

	/**
	 * Запрашивает данные из бекенда для редактирования ячейки.
	 * @private
	 */
	var getData = function() {
		$.ajax({
			url: getBackendUrl('get'),
			type: 'GET',
			dataType: 'xml',
			success: onGetData,
			error: function(rq, status, error) {
				onError(error, 'get');
			}
		});
	};

	/**
	 * Обработчик ошибки от сервера
	 * @param {String} error Сообщение об ошибке
	 * @param {String} type тип запроса - 'get' или 'save'
	 * @private
	 */
	var onError = function(error, type) {
		reportError(getLabel('js-edcell-' + type + '-error') + error);
	};

	/**
	 * Выводит пользователю сообщение об ошибке
	 * @param {String} error Сообщение об ошибке
	 * @private
	 */
	var reportError = function(error) {
		editableCell.activeCell = false;
		$.jGrowl(error, {header: getLabel('js-error-header')});
	};

	/**
	 * Возвращает ссылку для запроса в бекенд в зависимости от типа запроса.
	 *
	 * Есть два вида запросов:
	 *   - Получить значение поля
	 *   - Сохранить значение поля
	 *
	 * @param {String} mode тип запроса - 'get' или 'save'
	 * (для макросов get_editable_region / save_editable_region)
	 * @returns {String}
	 * @private
	 */
	var getBackendUrl = function(mode) {
		var url = window.pre_lang + '/admin/content/' + mode + '_editable_region/' + _item.id + '/' + _propName + '.xml';
		if (_isObjectMode) {
			url += '?is_object=1';
		}
		return url;
	};

	/**
	 * Обработчик получения значения поля от сервера
	 * @param {Document} data Данные поля в xml-формате
	 * @private
	 */
	var onGetData = function(data) {
		var errorList = data.getElementsByTagName('error');
		if (errorList.length > 0) {
			reportError(errorList[0].firstChild.nodeValue);
			return;
		}

		makeEditableField(data);
	};

	/**
	 * Создает контрол редактирования поля
	 * @param {Document} data Данные поля
	 * @private
	 */
	var makeEditableField = function(data) {
		var propertyList = data.getElementsByTagName('property');
		var type = getType(propertyList);
		var valueList = data.getElementsByTagName('value');
		var value = getStringValue(valueList);
		var isMultiple = false;
		var isPublicGuide = false;

		switch (type) {
			case 'wysiwyg':
			case 'text':
			case 'string':
			case 'int':
			case 'price':
			case 'float':
			case 'tags':
			case 'link_to_object_type':
			case 'counter': {
				makeEditableStringField(value);
				break;
			}

			case 'date': {
				value = getDateValue(valueList);
				makeEditableDateField(value);
				break;
			}

			case 'boolean': {
				makeEditableBooleanField(value);
				break;
			}

			case 'relation': {
				valueList = data.getElementsByTagName('item');
				isMultiple = (propertyList[0].getAttribute('multiple') === 'multiple');
				isPublicGuide = (propertyList[0].getAttribute('public-guide') === '1');
				makeEditableRelationField(valueList, isMultiple, isPublicGuide);
				break;
			}

			case 'name': {
				valueList = data.getElementsByTagName('name');
				value = getStringValue(valueList);
				makeEditableStringField(value);
				break;
			}

			case 'color': {
				makeEditableColorField(value);
				break;
			}

			case 'img_file':
			case 'swf_file':
			case 'video_file':
			case 'file': {
				makeEditableFileField(value);
				break;
			}

			case 'domain_id_list' :
			case 'domain_id' : {
				var domainList = data.getElementsByTagName('domain');

				$.each(domainList, function (i, domain) {
					var $domain = $(domain);
					$domain.attr('name', $domain.attr('host'));
				});

				isMultiple = (type === 'domain_id_list');
				makeEditableRelationField(domainList, isMultiple, isPublicGuide, {
					'type': '',
					'sourceUri': '/admin/data/getDomainList/'
				});
				break;
			}

			case 'optioned':
				makeEditableOptionedField(data);
				break;

			case 'multiple_image':
			case 'multiple_file':
				makeEditableMultipleField(data);
				break;

			case 'lang_id_list' :
			case 'lang_id' : {
				let langList = data.getElementsByTagName('lang');

				$.each(langList, function (i, lang) {
					let $lang = $(lang);
					$lang.attr('name', $lang.html());
				});

				isMultiple = (type === 'lang_id_list');
				makeEditableRelationField(langList, isMultiple, isPublicGuide, {
					'type': '',
					'sourceUri': '/admin/data/getLangsList/'
				});
				break;
			}

			default: {
				reportError(getLabel('js-edcell-unsupported-type'));
				break;
			}
		}
	};

	/**
	 * Определяет и возвращает тип поля по списку свойств поля
	 * @param {NodeList} propertyList список свойств
	 * @returns {String}
	 * @private
	 */
	var getType = function(propertyList) {
		if (_propName === 'name') {
			return 'name';
		}

		var type = '';
		if (typeof(propertyList[0]) !== 'undefined') {
			type = propertyList[0].getAttribute('type') || '';
		}

		return type;
	};

	/**
	 * Определяет и возвращает строковое значение поля по списку значений поля
	 * @param {NodeList} valueList список значений
	 * @returns {String}
	 * @private
	 */
	var getStringValue = function(valueList) {
		var value;
		if (valueList.length > 0) {
			value = valueList[0].firstChild ? valueList[0].firstChild.nodeValue : '';
		}
		return value || '';
	};

	/**
	 * Определяет и возвращает значение поля типа "Дата" по списку значений поля
	 * @param {NodeList} valueList список значений
	 * @returns {String}
	 * @private
	 */
	var getDateValue = function(valueList) {
		var value;
		if (valueList.length > 0) {
			value = valueList[0].firstChild ? valueList[0].getAttribute('formatted-date') : '';
		}
		return value || '';
	};

	/** Включает обработчик нажатия мыши в окне браузера */
	this.registerOutsideClick = function() {
		$(window).on('click', _self.outSideClick);
	};

	/** Выключает обработчик нажатия мыши в окне браузера */
	this.unregisterOutsideClick = function() {
		$(window).off('click', _self.outSideClick);
	};

	/**
	 * Обработчик нажатия мыши в окне браузера.
	 * Пытается сохранить новое значение поля, если клик был за пределами ячейки.
	 * @param {Event} e
	 * @public
	 */
	this.outSideClick = function(e) {
		var isClickedOutsideOfCell = $(_self.element).prop('id') != $(e.target).closest('td').prop('id');
		if (isClickedOutsideOfCell) {
			_self.prepareSaveData();
		}
	};

	/**
	 * Создает контрол редактирования поля со строковым значением
	 * @param {String} value текущее значение поля
	 * @private
	 */
	var makeEditableStringField = function(value) {
		_editControl = document.createElement('input');
		_editControl.setAttribute('type', 'text');
		_editControl.value = value;
		_editControl.className = 'editableCtrl default';
		_$editControl = $(_editControl);
		_$editControl.on('keyup', keyboardPressHandler);
		_$editControl.on('blur', function() {
			if (editableCell.activeCell) {
				_self.prepareSaveData();
			}
		});

		var $container = getContainer();
		_oldCellContent = $container.html();
		_oldValue = value;
		$container.html('');

		_$editControl.appendTo($container);
		_$editControl.trigger("focus");
	};

	/**
	 * Обработчик нажатия на кнопку во время редактирования ячейки
	 * @private
	 */
	var keyboardPressHandler = function(e) {
		var keyCode = Number(window.event ? window.event.keyCode : e.which);
		if (keyCode === ESCAPE_KEY_CODE) {
			_self.restore();
		}

		if (keyCode === ENTER_KEY_CODE && editableCell.activeCell) {
			_self.prepareSaveData();
		}
	};

	/**
	 * Возвращает контейнер, в котором хранится значение поля
	 * @returns {jQuery}
	 */
	var getContainer = function() {
		return $('div', _self.element);
	};

	/**
	 * Создает контрол редактирования поля с типом "Дата"
	 * @param {String} value текущее значение поля
	 * @private
	 */
	var makeEditableDateField = function(value) {
		_editControl = document.createElement('input');
		_editControl.setAttribute('type', 'text');
		_editControl.value = value;
		_editControl.className = 'default';
		_$editControl = $(_editControl);
		_$editControl.on('keyup', keyboardPressHandler);
		_$editControl.on('blur', function(event) {
			var relatedTarget = event.relatedTarget || event.toElement;
			if (!relatedTarget) {
				return;
			}

			var isDatePickerClicked = $(event.relatedTarget).closest('table').hasClass('ui-datepicker-calendar');
			if (editableCell.activeCell && !isDatePickerClicked) {
				_self.prepareSaveData();
			}
		});

		var $container = getContainer();
		_oldCellContent = $container.html();
		_oldValue = value;
		$container.html('');

		_$editControl.appendTo($container);
		_$editControl.trigger("focus");
		_$editControl.datepicker({
			dateFormat: 'yy-mm-dd',
			onClose: function(dateText) {
				if (!/\d{1,2}:\d{1,2}(:\d{1,2})?$/.exec(dateText)) {
					dateText += ' 00:00:00';
				}

				_$editControl.val(dateText);

				if (editableCell.activeCell) {
					_self.prepareSaveData();
				}
			}
		});
		_$editControl.datepicker('show');
	};

	/**
	 * Инициализирует форму редактирования в табличном контроле для полей типов:
	 * "Файл", "Изображение", "Видео" и "swf"
	 * @param {String} value значения поля
	 * @private
	 */
	var makeEditableFileField = function(value) {
		var $container = getContainer();
		_oldCellContent = $container.html();
		_oldValue = value;

		var template = _.template($('#fast-edit-file-control').html());
		var editControlHtml = template({
			id: _self.element.id + '_input_id',
			value: value
		});

		$container.html('');
		$container = $(editControlHtml).appendTo($container);

		_$editControl = $('input', $container);
		_$editControl.on('keyup', keyboardPressHandler);
		_$editControl.on('change', function() {
			_$editControl.trigger("focus");
			return true;
		});
		_self.registerOutsideClick();
		var type = _propInfo['dataType'] || '';

		$('a.icon-action', $container).on('click', function() {
			var fileBrowserParam;

			switch (type) {
				case 'img_file': {
					fileBrowserParam = 'image=1';
					break;
				}

				case 'swf_file':
				case 'video_file': {
					fileBrowserParam = 'video=1';
					break;
				}

				default: {
					fileBrowserParam = '';
				}
			}

			showFileBrowser(_$editControl, fileBrowserParam);
		});

		_$editControl.trigger("focus");
	};

	/**
	 * Открывает файловый менеджер
	 * @param {Object} $input Jquery объект инпута, в который необходимо вставить выбранный файл в файловом менеджере
	 * @param {String} customParam кастомный параметр инициализации файлового менеджера
	 * @private
	 */
	var showFileBrowser = function($input, customParam) {
		var inputId = $input.attr('id');
		var filePath = $input.val();
		var matchResult = filePath.match(/(.*\/)/);
		var folderPath = (matchResult) ? matchResult[0] : '';
		var queryString = [];

		queryString.push('id=' + inputId);
		queryString.push('file=' + filePath);
		queryString.push('folder=' + folderPath);
		queryString.push('lang=' + window.lang_id);
		queryString.push('objectId=' + _item.objectId);
		queryString.push('pageId=' + _item.id);
		queryString.push('fieldName=' + _propName);

		if (customParam) {
			queryString.push(customParam);
		}

		$.openPopupLayer({
			name: 'Filemanager',
			title: getLabel('js-file-manager'),
			width  : 1200,
			height : 600,
			url: '/styles/common/other/elfinder/umifilebrowser.html?' + queryString.join('&')
		});

		var $fileBrowser = $('div#popupLayer_Filemanager div.popupBody');

		var template = _.template($('#file-browser-options').html());
		var options = template({
			watermarkMessage: getLabel('js-water-mark'),
			rememberMessage: getLabel('js-remember-last-dir'),
			remember: getCookie('remember_last_folder', true)
		});

		$fileBrowser.append(options);
	};

	/**
	 * Создает контрол редактирования поля с типом "Цвет"
	 * @param {String} value текущее значения поля
	 * @private
	 */
	var makeEditableColorField = function(value) {
		_oldValue = value;
		var $container = getContainer();
		_oldCellContent = $container.html();
		$container.html('');

		var fieldHTML = '<div class="color table"><input type="text" class="default"></div>';
		$container = $(fieldHTML).appendTo($container);
		_$editControl = $('input', $container);

		if (value) {
			_$editControl.val(value);
		}

		_$editControl.on('keyup', keyboardPressHandler);
		_$editControl.on('blur', function() {
			if (editableCell.activeCell) {
				_self.prepareSaveData();
			}
		});

		// noinspection ObjectAllocationIgnored
		new colorControl($container, {});

		$($container).on('hidePicker', function() {
			if (editableCell.activeCell) {
				_self.prepareSaveData();
			}
		});
	};

	/**
	 * Создает контрол редактирования поля с типом "Выпадающий список" или
	 * "Выпадающий список с множественным выбором".
	 * @param {NodeList} valueList список значений поля
	 * @param {Boolean} isMultiple флаг поля с множественным выбором
	 * @param {Boolean} isPublicGuide поле использует публичный справочник (в него можно добавлять значения)
	 * @param {Object} [controlOptions] опции контрола "ControlRelation"
	 * @private
	 */
	var makeEditableRelationField = function(valueList, isMultiple, isPublicGuide, controlOptions) {
		controlOptions = controlOptions || {};

		var $valueList = $(valueList);
		$(_self.element).addClass('hide-editable');
		var container = getContainer();
		container.css('overflow', 'visible');
		_oldCellContent = container.html();

		var multipleValue = (isMultiple ? 'multiple' : '');
		var selectHtml = '<div class="layout-col-control quick selectize-container">' +
			'<select id="" class="default" ' + multipleValue + ' autocomplete="off"></select>' +
			'</div>';

		container.html('');
		var selectContainer = $(selectHtml).appendTo(container);

		_$editControl = $('select', selectContainer);

		$.each($valueList, function (i, item) {
			var $item = $(item);
			_$editControl.append($('<option>', {
				value: $item.attr('id'),
				text : $item.attr('name'),
				selected: true
			}));
		});

		if (isPublicGuide) {
			var addButtonHtml = '<div class="layout-col-icon">' +
				'<a id="" title="'+ getLabel('js-new_guide_item_title') + '" class="icon-action relation-add">' +
				'<i class="small-ico i-add"></i>' +
				'</a></div>';
			container.append(addButtonHtml);
		}

		controlOptions = $.extend({
			container: container,
			type: _propInfo.guideId,
			preload: false
		}, controlOptions);

		var control = new ControlRelation(controlOptions);
		control.loadItemsAll(selectItems, true);
		var selectizeObject;

		/**
		 * Обработчик загрузки элементов справочника в selectize
		 * @param response
		 */
		function selectItems(response) {
			selectizeObject = control.selectize;

			var items = response.responseXML.getElementsByTagName('object');
			if (items.length > 0) {
				control.updateElements(response);
			} else {
				items = response.responseXML.getElementsByTagName('empty');
				var result = String(items[0].getAttribute('result')).toLowerCase().replace(/[\s]/g, '');
				if (result === 'toomuchitems') {
					selectizeObject = control.makeSearch();
				}
			}

			selectizeObject.on('change', function() {
				_self.prepareSaveData();
			});

			selectizeObject.lock();
			$.each($valueList, function (i, item) {
				var $item = $(item);
				selectizeObject.addItem($item.attr('id'), true);
			});
			selectizeObject.unlock();

			selectizeObject.editableCell = _self;
		}

		_self.registerOutsideClick();
		container.on('keyup', keyboardPressHandler);

		_self.prepareSaveData = function() {
			$(_self.element).removeClass('hide-editable');
			if (!selectizeObject) {
				return;
			}

			var result = [];
			for (var i = 0; i < selectizeObject.items.length; i++) {
				var itemId = selectizeObject.items[i];
				result.push(itemId);
			}

			_self.save(result);
		};
	};

	/**
	 * Создает контрол редактирования поля с типом "Кнопка-флажок"
	 * @param {String} value текущее значение поля
	 * @private
	 */
	var makeEditableBooleanField = function(value) {
		var $container = getContainer();
		_oldCellContent = $container.html();

		$container.html('');
		var checkedValue = (value ? 'checked' : '');
		var checkBoxHtml = '<div class="checkbox ' + checkedValue + '"><input type="checkbox editableCtrl"></div>';
		_$editControl = $(checkBoxHtml).appendTo($container);

		_$editControl.on('click', function() {
			var $this = $(this);
			$this.toggleClass('checked');
			var newValue = $this.hasClass('checked') ? 1 : 0;
			_self.save(newValue, true);

			if (_.contains(['is_activated', 'is_active', 'active'], _self.element.name)) {
				_item.update({'is-active': newValue, 'id': _item.id});
			}

			return true;
		});
		_self.registerOutsideClick();

		var checkBox = _$editControl.children('input').eq(0);
		checkBox.trigger("focus");
		_$editControl.trigger("focus");
		checkBox.on('keydown', keyboardPressHandler);
	};

	/**
	 * Создает контрол редактирования поля с типом "Составное"
	 * @param {Document} data Данные поля
	 * @private
	 */
	var makeEditableOptionedField = function(data) {
		_self.restore();
		$.ajax({
			url: '/styles/skins/modern/design/js/common/optioned_template.html',
			dataType: 'html',
			success: function(html) {
				var $templates = $($.parseHTML(html));
				var fieldTemplate = $templates.find('#field_template').html();
				var optionTemplate = $templates.find('#option_template').html();

				var property = data.getElementsByTagName('property')[0];
				var title = data.getElementsByTagName('title')[0].innerHTML;
				var guideId = property.getAttribute('guide-id');
				var objectId = property.getAttribute('object-id');
				var inputName = 'data[' + objectId + '][' + _propName + ']';
				var isPublic = (property.getAttribute('public-guide') === '1');
				var langPrefix = uAdmin.data["pre-lang"];
				var isStores = (_propName === 'stores_state');
				var type = isStores ? 'int' : 'float';

				var optionVariableList = [];
				$(data).find('option').each(function(i, option) {
					var $object = $(option).find('object');
					optionVariableList.push({
						label: $object.attr('name'),
						labelRemoveOption: getLabel('js-remove-option'),
						inputName: inputName,
						position: i,
						relationId: $object.attr('id'),
						value: $(option).attr(type),
						isStores: isStores
					});
				});

				var optionsHtml = '';
				$.each(optionVariableList, function(i, optionVariables) {
					optionsHtml += $.tmpl(optionTemplate, optionVariables)[0].outerHTML;
				});

				var fieldVariables = {
					'title': title,
					'guideId': guideId,
					'inputName': inputName,
					'isPublic': isPublic,
					'langPrefix': langPrefix,
					'type': type,
					'labelEditGuideItems': getLabel('js-edit-guide-items'),
					'labelAddRelationItem': getLabel('js-add-relation-item'),
					'labelAddOption': getLabel('js-add-option'),
					'optionsHtml': optionsHtml
				};
				var fieldHtml = $.tmpl(fieldTemplate, fieldVariables);

				openDialog('', getLabel('js-editable-optioned-field'), {
					width: 800,
					html: fieldHtml,
					cancelButton: true,
					confirmText: getLabel('js-save'),
					cancelText: getLabel('js-new_guide_item_cancel'),

					openCallback: function() {
						initOptionedFields();
					},

					confirmCallback: function(popupName) {
						var data = $('#optionedFieldForm').serialize();
						data += '&csrf=' + csrfProtection.getToken();

						$.ajax({
							type: 'POST',
							url: getBackendUrl('save'),
							dataType: 'xml',
							data: data,

							success: function() {
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
						closeDialog(popupName);
					}
				});
			}
		});
	};

	/**
	 * Создает контрол редактирования поля с типом "Набор файлов" и "Набор изображений"
	 * @param {Document} data Данные поля
	 * @private
	 */
	var makeEditableMultipleField = function(data) {
		_oldCellContent = getContainer().html();
		_self.restore();
		$.ajax({
			url: '/styles/skins/modern/design/js/common/dialog_edit_field_template.html',
			dataType: 'html',
			success: function(html) {
				var dialogLabel,
					fieldTemplate, 
					valueTemplate,
					$templates = $($.parseHTML(html));

				var property = data.getElementsByTagName('property')[0];
				var fieldType = property.getAttribute('type');
				if (fieldType == "multiple_file") {
					fieldTemplate = $templates.find('#field_template_files').html();
					valueTemplate = $templates.find('#value_template_file').html();
					dialogLabel = getLabel('js-editable-multiple_file-field');
				} else {
					fieldTemplate = $templates.find('#field_template_images').html();
					valueTemplate = $templates.find('#value_template_image').html();
					dialogLabel = getLabel('js-editable-multiple_image-field');
				}
				var title = data.getElementsByTagName('title')[0].innerHTML;
				var elemId = 'idm' + property.getAttribute('id');
				var objectId = property.getAttribute('object-id');
				var inputName = 'data[' + objectId + ']';

				var valueVariableList = [];
				$(property).find('value').each(function(i, value) {
					var val = $(value);
					valueVariableList.push({
						id: val.attr('id'),
						path: val.html(),
						alt: val.attr('alt'),
						title: val.attr('title'),
						order: val.attr('ord'),
						folderHash: val.attr('folder_hash'),
						fileHash: val.attr('file_hash'),
						inputName: inputName,
						position: i,
					});
				});

				var valuesHtml = '';
				$.each(valueVariableList, function(i, valueVariables) {
					valuesHtml += $.tmpl(valueTemplate, valueVariables)[0].outerHTML;
				});

				var fieldVariables = {
					'title': title,
					'elemId': elemId,
					'inputName': inputName,
					'valuesHtml': valuesHtml
				};
				var fieldHtml = $.tmpl(fieldTemplate, fieldVariables);

				openDialog('', dialogLabel, {
					width: 800,
					html: fieldHtml,
					cancelButton: true,
					confirmText: getLabel('js-save'),
					cancelText: getLabel('js-new_guide_item_cancel'),

					openCallback: function() {
						if (fieldType == "multiple_file") {
							$('div.multifile').each(function() {
								new ControlMultiFile({container: $(this)});
							});
						} else {
							$('div.multiimage').each(function() {
								new ControlMultiImage({container: $(this)});
							});
						}
					},

					confirmCallback: function(popupName) {
						var data = $('#optionedFieldForm').serialize();
						data += '&csrf=' + csrfProtection.getToken();

						$.ajax({
							type: 'POST',
							url: getBackendUrl('save'),
							dataType: 'xml',
							data: data,

							success: onSetData,

							error: function(rq, status, error) {
								onError(error, 'save');
							},

							complete: function() {
								closeDialog(popupName);
							}
						});
					},

					cancelCallback: function(popupName) {
						closeDialog(popupName);
					}
				});
			}
		});
	};

	/**
	 * Сохраняет измененное значение поля ячейки
	 * @param {String} content новое значение поля
	 * @private
	 */
	var setData = function(content) {
		$.ajax({
			type: 'POST',
			url: getBackendUrl('save'),
			dataType: 'xml',
			data: ({
				'data[]': content,
				'csrf': csrfProtection.getToken()
			}),

			success: onSetData,

			error: function(rq, status, error) {
				onError(error, 'save');
			},

			complete: function() {
				if (editableCell.activeCell === _self) {
					editableCell.activeCell = false;
				}
			}
		});
	};

	/**
	 * Обработчик получения значения сохраненного поля от сервера
	 * @param {Document} data Данные сохраненного поля в xml-формате
	 * @private
	 */
	var onSetData = function(data) {
		var errorList = data.getElementsByTagName('error');
		if (errorList.length > 0) {
			reportError(errorList[0].firstChild.nodeValue);
			_self.restore();
			return;
		}

		var $container = getContainer();
		var propertyList = data.getElementsByTagName('property');
		var valueList = data.getElementsByTagName('value');
		var value = getStringValue(valueList);

		setValue(getType(propertyList));
		afterSetValue();

		/**
		 * Устанавливает новое значение поля
		 * @param {String} type тип поля
		 */
		function setValue(type) {
			switch (type) {
				case 'wysiwyg':
				case 'text':
				case 'int':
				case 'price':
				case 'float':
				case 'tags':
				case 'counter':
				case 'link_to_object_type': {
					updateValue(value);
					return;
				}
				case 'date': {
					updateValue(getDateValue(valueList));
					return;
				}
				case 'string': {
					setStringValue();
					return;
				}
				case 'boolean': {
					setBooleanValue();
					return;
				}
				case 'relation': {
					setRelationValue();
					return;
				}
				case 'domain_id':
				case 'domain_id_list': {
					setDomainValue();
					return;
				}
				case 'lang_id':
				case 'lang_id_list': {
					setLangValue();
					return;
				}
				case 'name': {
					setNameValue();
					return;
				}
				case 'color': {
					setColorValue();
					return;
				}
				case 'video_file':
				case 'swf_file':
				case 'file':
				case 'img_file': {
					setFileValue();
					return;
				}
				case 'multiple_file':
				case 'multiple_image': {
					setMultipleFileValue();
					return;
				}
				default: {
					reportError(getLabel('js-edcell-unsupported-type'));
					return;
				}
			}

			/**
			 * Обновляет значение поля
			 * @param {String} value новое значение поля
			 */
			function updateValue(value) {
				$container.html(value);
				_oldValue = value;
			}

			function setStringValue() {
				var restriction = propertyList[0].getAttribute('restriction');
				if (value && restriction === 'email') {
					value = '<a href=\'mailto:' + value + '\' title=\'' + value + '\' class=\'link\'>' + value + '</a>';
				}
				updateValue(value);
			}

			function setBooleanValue() {
				value = Number(value);
				$container.html(value ? '<img alt="" style="width:13px;height:13px;" src="/styles/skins/modern/design/img/tree/checked.png" />' : '');
				_oldValue = value;
			}

			function setRelationValue() {
				valueList = data.getElementsByTagName('item');
				if (valueList.length === 1) {
					var name = valueList[0].getAttribute('name') || '';
					var guid = valueList[0].getAttribute('guid') || 'relation-value';
					value = '<span title="' + name + '" class="c-' + guid + '">' + name + '</span>';
				} else if (valueList.length > 1) {
					for (var i = 0; i < valueList.length; i++) {
						value += valueList[i].getAttribute('name') || '';
						if (i < valueList.length - 1) {
							value += ', ';
						}
					}
				}

				$container.css('overflow', 'hidden');
				updateValue(value);
			}

			function setDomainValue() {
				valueList = data.getElementsByTagName('domain');
				value = '';

				if (valueList.length === 1) {
					value = valueList[0].getAttribute('host') || '';
				} else if (valueList.length > 1) {
					for (var i = 0; i < valueList.length; i++) {
						var host = valueList[i].getAttribute('host') || '';
						value += host;

						if (i < valueList.length - 1 && host.length > 0) {
							value += ', ';
						}
					}
				}

				updateValue(value);
			}

			/** Обновляет значение поля типа "Ссылка на язык" или "Ссылка на список языков" */
			function setLangValue() {
				let valueList = data.getElementsByTagName('lang');
				let value = '';

				if (valueList.length === 1) {
					value = valueList[0].innerHTML || '';
				} else if (valueList.length > 1) {
					for (let i = 0; i < valueList.length; i++) {
						let lang = valueList[i].innerHTML || '';
						value += lang;

						if (i < valueList.length - 1 && lang.length > 0) {
							value += ', ';
						}
					}
				}

				updateValue(value);
			}

			function setNameValue() {
				valueList = data.getElementsByTagName('name');
				value = getStringValue(valueList);
				$container.html(_oldCellContent);
				$container.find('.name_col').text(value);
				_item.checkBox = $('div.checkbox', $container).get(0);
				_oldValue = value;
			}

			function setColorValue() {
				var newContent = '<div class="color table"><span class="value">' + value +
					'</span><span class="color-box"><i style="background-color: ' + value +
					'"></i></span></div>';

				if (_oldValue.length === 0) {
					$container.html(newContent);
				} else {
					$container.html(_oldCellContent);
				}

				var $content = $('.value', $container);
				var colorBox = $('.color-box i', $container);

				$content.html(value);
				colorBox.css('background-color', value);
				_oldValue = value;
			}

			function setFileValue() {
				if (valueList.length > 0) {
					let $image = $(valueList[0]);
					let filePath = $image.attr('path');
					let filePathWithoutExt = filePath.substring(0, filePath.lastIndexOf('.'));

					if (filePathWithoutExt === '.') {
						updateValue('');
						return;
					}

					let normalisedFilePath = filePath.substring(1);
					let ext = $image.attr('ext');
					let fileName = $image.attr('name');
					let isBroken = $image.attr('is_broken');

					let templateId = (type === 'img_file') ? 'fast-edit-image-preview' : 'fast-edit-file-preview';
					let template = _.template($('#' + templateId).html());
					value = template({
						filePath: normalisedFilePath,
						filePathWithoutExt: filePathWithoutExt,
						fileName: fileName,
						ext: ext,
						isBroken: isBroken
					});
				}

				updateValue(value);
			}

			/** Обновляет значение поля типа "Набор файлов" или "Набор изображений" */
			function setMultipleFileValue() {
				let val = '';
				if (valueList.length > 0) {
					$.each(valueList, function(i, file) {
						file = $(file);
						let path = file.attr('path');
						let filePathWithoutExt = path.substring(0, path.lastIndexOf('.'));
						let normalisedFilePath = path.substring(1);
						if (type == 'multiple_image') {
							let ext = file.attr('ext');
							let thumbSrc = "/autothumbs.php?img=" + filePathWithoutExt + '_sl_180_120.' + ext;
							str = 'src="/styles/skins/modern/design/img/image.png" onmouseover="TableItem.showPreviewImage(event, \'' + thumbSrc + '\')" />&nbsp;';
						} else {
							str = 'src="/styles/skins/modern/design/img/ico_file.gif" title="' + normalisedFilePath + '"/>&nbsp;';
						}
						val += '<img alt="" style="width:13px;height:13px;cursor: pointer;" ' + str;
					});
				}

				updateValue(val);
			}
		}

		/** Завершает обработку */
		function afterSetValue() {
			if (window['onAfterSetProperty']) {
				onAfterSetProperty(_item.id, _propName, value);
			}

			$.jGrowl(getLabel('js-property-saved-success'));
			_oldCellContent = getContainer().html();
			Control.recalcItemsPosition();
		}
	};

	/**
	 * Проверяет введенное значение для поля элемента
	 * @param {String|Object|Number} value новое значение для поля
	 * @returns {boolean} результат проверки
	 * @private
	 */
	var validateValue = function(value) {
		var numberTypes = ['int', 'price', 'float', 'counter'];
		var type = _propInfo['dataType'] || '';

		if (numberTypes.indexOf(type) !== -1) {
			return validateNumberValue(value);
		}

		return true;
	};

	/**
	 * Проверяет введенное значение на соответствие числу
	 * @param {String|Object|Number} value проверяемое значение
	 * @returns {boolean} результат проверки
	 * @private
	 */
	var validateNumberValue = function(value) {
		if (value == '') {
			return true;
		}

		var isNumber = !isNaN(parseFloat(value)) && value.match(/^[0-9eE.,]+$/);

		if (!isNumber) {
			$.jGrowl(getLabel('js-error-validate-number'), {header: getLabel('js-error-header')});
			return false;
		}

		return true;
	};

	/**
	 * Сохраняет значение в поле элемента
	 * @param {String|Object|Number} newValue сохраняемое значение
	 * @param {Boolean} force сохранить при любых условиях
	 * @returns {boolean}
	 * @public
	 */
	this.save = function(newValue, force) {
		_self.unregisterOutsideClick();

		if (!_.isArray(newValue) && !force && (_oldValue == newValue || !validateValue(newValue))) {
			this.restore();
			return false;
		}

		setData(newValue);
		return true;
	};

	/**
	 * Восстанавливает предыдущее значение ячейки и убирает ее активность
	 * @public
	 */
	this.restore = function() {
		_self.unregisterOutsideClick();
		$(_self.element).removeClass('hide-editable');
		editableCell.activeCell = false;
		var $container = getContainer();
		$container.html(_oldCellContent);
		var checkboxContent = $('div.checkbox', $container)[0];

		if (_item.isCheckboxAvailable() && checkboxContent) {
			_item.checkBox = checkboxContent;
		}

		Control.recalcItemsPosition();
	};

	/**
	 * @public
	 * @deprecated
	 * @returns {Object}
	 */
	this.getEditControl = function() {
		return _$editControl;
	};
};

/**
 * @type {editableCell|Boolean}
 * Ссылка на текущую редактируемую ячейку или false
 */
editableCell.activeCell = false;

/**
 * @type {[String]}
 * Список типов полей, для которых не поддерживается быстрое редактирование,
 * и для которых не будут созданы ячейки.
 */
editableCell.ignoreDataTypes = ['wysiwyg'];

/**
 * @type {[String]}
 * Список названий полей, для которых не поддерживается быстрое редактирование,
 * и для которых не будут созданы ячейки.
 */
editableCell.ignorePropNames = [];

/**
 * TreeItem
 * Класс осуществяляет визуализацию узла дерева
 * @param Object _oControl - экземпляр класса Control
 * @param Object _oParent - экземпляр класса TreeItem, указывающий на прямого предка элемента
 * @param Object _oData - информация о элементе
 * @param Object _oSiblingItem - экземпляр класса TreeItem, указывающий на соседа элемента
 * @param String _sInsertMode - режим добавление элемента по отношению к соседу _oSiblingItem. Может быть "after" и "before"
 */
var TreeItem = function(_oControl, _oParent, _oData, _oSiblingItem, _sInsertMode) {
	var id = parseInt(_oData.id);
	var __self = this;
	var Data = _oData;
	var Parent = _oParent;
	var SiblingItem = _oSiblingItem || null;
	var InsertMode = _sInsertMode || 'after';
	var ForceDraw = typeof(_oData['force-draw']) !== 'undefined' ? parseInt(_oData['force-draw']) : 1;
	var CountChilds = typeof(_oData['childs']) !== 'undefined' ? parseInt(_oData['childs']) : 0;
	var typeName = (typeof(_oData['basetype']) !== 'undefined' && typeof(_oData['basetype']['_value']) === 'string') ? _oData['basetype']['_value'] : '';
	var IconsPath = _oControl.iconsPath;
	var baseModule = (typeof(_oData['basetype']) !== 'undefined' && typeof(_oData['basetype']['module']) === 'string') ? _oData['basetype']['module'] : 'content';
	var baseMethod = (typeof(_oData['basetype']) !== 'undefined' && typeof(_oData['basetype']['method']) === 'string') ? _oData['basetype']['method'] : '';
	var iconSrc = typeof(_oData['iconbase']) !== 'undefined' ? _oData['iconbase'] : IconsPath + 'ico_' + baseModule + '_' + baseMethod + '.png';
	var toggleCtrl = null;
	var labelCtrl = null;
	var labelText = null;
	var itemIcon = null;
	var Settings = SettingsStore.getInstance();
	var AutoexpandAllowed = true;
	var oldClassName = null;
	var selected = false;
	var maxChildsCount = 49;
	var pagesBar = null;
	var hasCheckbox = typeof _oControl.hasCheckboxes == 'boolean' ? _oControl.hasCheckboxes : true;
	var isCanSelect = typeof _oControl.isCanSelect == 'boolean' ? _oControl.isCanSelect : true;

	/** (Public properties) */
	this.element = null;
	this.checkBox = null;
	this.control = _oControl;
	this.childsContainer = null;
	this.id = id;
	this.name = typeof(_oData['name']) !== 'undefined' ? _oData['name'] : 'noname';
	this.isRoot = (id === 0);
	this.loaded = false;
	this.viewLink = typeof(_oData['link']) !== 'undefined' ? _oData['link'] : false;
	this.editLink = typeof(_oData['edit-link']) !== 'undefined' ? _oData['edit-link'] : false;
	this.createLink = typeof(_oData['create-link']) !== 'undefined' ? _oData['create-link'] : false;
	this.permissions = typeof(_oData['permissions']) !== 'undefined' ? parseInt(_oData['permissions']) : 0;
	this.isActive = typeof(_oData['is-active']) !== 'undefined' ? parseInt(_oData['is-active']) : 0;
	this.isVirtualCopy = typeof(_oData['has-virtual-copy']) !== 'undefined';
	this.isOriginal = typeof(_oData['is-original']) !== 'undefined';
	this.lockedBy = typeof(_oData['locked-by']) === 'object' ? _oData['locked-by'] : null;
	this.expiration = typeof(_oData['expiration']) === 'object' ? _oData['expiration'] : null;
	this.isDefault = typeof(_oData['is-default']) !== 'undefined' ? true : false;

	this.templateId = typeof(_oData['template-id']) !== 'undefined' ? _oData['template-id'] : null;
	this.langId = typeof(_oData['lang-id']) !== 'undefined' ? _oData['lang-id'] : null;
	this.domainId = typeof(_oData['domain-id']) !== 'undefined' ? _oData['domain-id'] : null;

	this.allowCopy = typeof(_oData['allow-copy']) !== 'undefined' ? parseInt(_oData['allow-copy']) : true;
	this.allowActivity = typeof(_oData['allow-activity']) !== 'undefined' ? parseInt(_oData['allow-activity']) : true;
	this.allowDrag = typeof(_oData['allow-drag']) !== 'undefined' ? _oData['allow-drag'] : true;

	this.parent = Parent;
	this.childs = [];
	this.hasChilds = (CountChilds > 0 || id == 0);
	this.labelControl = null;
	this.position = false;
	this.isExpanded = false;
	this.filter = new filter;
	this.pageing = {
		'total': 0,
		'limit': 0,
		'offset': 0
	};

	this.baseModule = (typeof(_oData['basetype']) !== 'undefined' && typeof(_oData['basetype']['module']) === 'string') ? _oData['basetype']['module'] : 'content';
	this.baseMethod = (typeof(_oData['basetype']) !== 'undefined' && typeof(_oData['basetype']['method']) === 'string') ? _oData['basetype']['method'] : '';

	/** (Private methods) */
	/**
	 * Конструктор класса
	 * @access private
	 */
	var __constructor = function() {
		if (_oParent) {
			_oParent.childs[_oParent.childs.length] = id;
			__draw(Parent.childsContainer);
		} else {
			__drawRoot();
		}
	};

	/**
	 * "Рисует" элемент
	 * @access private
	 * @param DOMElement _oContainerEl контейнер для добавления элемента
	 */
	var __draw = function(_oContainerEl) {
		var element = document.createElement('li');
		element.setAttribute('rel', id);
		element.classList.add('ti');
		element.classList.add('tollbar');
		element.rel = id;

		// fix for opera and mozilla (cancel user select)
		element.onmousedown = function() {
			return false;
		};

		labelCtrl = document.createElement('div');
		labelCtrl.classList.add('ti');
		labelCtrl.classList.add('tree_line');

		if (__self.isVirtualCopy) {
			labelCtrl.className += ' virtual';
		}

		if (__self.isDefault) {
			labelCtrl.className += ' main-page';
		}

		jQuery(labelCtrl).on('mouseover', function() {
			__self.control.onElementMouseOver(__self, this);
		});
		jQuery(labelCtrl).on('mouseout', function() {
			__self.control.onElementMouseOut(__self, this);
		});

		jQuery(labelCtrl).on('click', function(event) {
			__self.control.onElementClick(__self, this, event);
		});

		toggleCtrl = document.createElement('span');
		toggleCtrl.className = 'catalog-toggle';

		var toggleWrapper = document.createElement('span');
		toggleWrapper.classList.add('catalog-toggle-wrapper');

		toggleWrapper.onclick = function(e) {
			__self.toggle(this);
			return false;
		};

		if (__self.hasChilds) {
			toggleWrapper.appendChild(toggleCtrl);
		} else {
			toggleWrapper.className = 'catalog-toggle-off';
		}

		labelCtrl.appendChild(toggleWrapper);

		if (hasCheckbox) {
			var checkWrapper = document.createElement('div');
			checkWrapper.classList.add('checkbox');

			var checkControl = document.createElement('input');
			checkControl.setAttribute('type', 'checkbox');
			checkControl.value = id;
			checkControl.classList.add('row_selector');
			checkWrapper.appendChild(checkControl);

			__self.checkBox = checkWrapper;

			labelCtrl.appendChild(checkWrapper);
		}

		if (isCanSelect) {
			var $label = jQuery(labelCtrl);
			$label.on('mousedown', function(event) {
				__self.control.handleMouseDown(event, id);
			});

			$label.on('mouseup', function(event) {
				__self.control.handleMouseUp(event, __self);
			});
		}

		itemIcon = document.createElement('img');
		itemIcon.style.border = '0px';
		itemIcon.setAttribute('alt', typeName);
		itemIcon.setAttribute('title', typeName);
		itemIcon.setAttribute('src', iconSrc);
		itemIcon.className = 'ti-icon';
		itemIcon.onmousedown = function() {
			return false;
		};

		if (__self.control.allowDrag && __self.allowDrag) {
			itemIcon.style.cursor = 'move';
		}

		labelCtrl.appendChild(itemIcon);

		// indicators
		if (__self.expiration) {
			var oStatus = __self.expiration['status'];
			if (oStatus) {
				var statusSID = oStatus['id'];
				var statusName = oStatus['_value'];
				if (statusSID) {
					var expInd = document.createElement('img');
					var ico = IconsPath + 'ico_' + statusSID + '.png';
					expInd.setAttribute('src', ico);
					expInd.setAttribute('alt', statusName);
					expInd.setAttribute('title', statusName);
					expInd.className = 'page-status';
					labelCtrl.appendChild(expInd);
				}
			}
		}

		labelText = document.createElement('a');
		var title = __self.name;

		if (typeof title != 'string') {
			title = getLabel('js-smc-noname-page');
		}

		labelText.innerHTML = title;

		if (__self.viewLink) {
			labelText.title = __self.viewLink;
		}

		labelText.setAttribute('href', '#');
		if (__self.editLink) {
			labelText.setAttribute('href', __self.editLink);
			labelText.onclick = function() {
				return __self.control.applyBehaviour(__self);
			};
		}

		$(labelText).on('mousedown click mouseup', function(event) {
			var middleMouseButton = 1;

			if (event.button !== middleMouseButton) {
				event.preventDefault();
			}

			return true;
		});

		labelCtrl.appendChild(labelText);

		if (__self.isVirtualCopy) {
			var virtualLabel = document.createElement('span');
			virtualLabel.className = 'label-virtual';
			virtualLabel.innerHTML = (__self.isOriginal) ? getLabel('js-smc-original') : getLabel('js-smc-virtual-copy');
			labelCtrl.appendChild(virtualLabel);
		}

		if (__self.editLink) {
			var editControl = document.createElement('a');
			editControl.classList.add('small-ico');
			editControl.classList.add('i-edit');
			editControl.setAttribute('href', __self.editLink);

			labelCtrl.appendChild(editControl);
		}

		__self.labelControl = element.appendChild(labelCtrl);

		if (!__self.isActive) {
			labelCtrl.classList.add('disabled');
		}

		pagesBar = document.createElement('div');
		pagesBar.className = 'pages-bar';
		pagesBar.style.display = 'none';
		__self.pagesBar = element.appendChild(pagesBar);

		childsContainer = document.createElement('ul');
		childsContainer.className = 'ti-childs-container';
		childsContainer.style.display = 'none';
		__self.childsContainer = element.appendChild(childsContainer);

		if (SiblingItem) {
			var prevEl = null;
			if (InsertMode.toLowerCase() == 'after') {
				prevEl = SiblingItem.element.nextSibling;
			} else {
				prevEl = SiblingItem.element;
			}
			if (prevEl) {
				__self.element = _oContainerEl.insertBefore(element, prevEl);
			} else {
				__self.element = _oContainerEl.appendChild(element);
			}
		} else {
			__self.element = _oContainerEl.appendChild(element);
		}

		if (__self.control.dragAllowed && __self.allowDrag) {
			var DropMode = 'child';
			var timeOutHandler;
			var mouseFlag = false;

			jQuery(labelCtrl).draggable({
				appendTo: 'body',
				distance: Control.DragSensitivity,
				handle: '.ti-icon, a',
				cursorAt: {right: -2},
				helper: function() {
					__self.setSelected(true);
					__self.control.selectedList[__self.id] = __self;

					var drag_el = document.createElement('div');

					for (key in __self.control.selectedList) {
						drag_el.innerHTML += '<div>' + __self.control.selectedList[key].name + '</div>';
					}

					drag_el.className = 'ti-draggable';

					jQuery(drag_el).css({
						'position': 'absolute',
						'padding-left': '20px'
					});

					return drag_el;
				},
				start: function() {
					Control.DraggableItem = __self;
					Control.DragMode = true;

					if (__self.control.toolbar) {
						__self.control.toolbar.hide();
					}
				},
				stop: function() {
					if (Control.HandleItem) {
						Control.HandleItem.deInitDroppable();
						if (Control.DraggableItem) {
							Control.DraggableItem.tryMoveTo(Control.HandleItem, DropMode);
						}
					}
					Control.DraggableItem = null;
					Control.DragMode = false;
					jQuery('.pages-bar a').off('mouseover');
					mouseFlag = false;
					window.clearTimeout(timeOutHandler);
				},
				drag: function(event, ui) {
					jQuery('.pages-bar a').on('mouseover', function() {
						if (!mouseFlag) {
							mouseFlag = true;
							var that = this;
							timeOutHandler = window.setTimeout(function() {
								$(that).trigger('click');
							}, 1000);
						}
					});
					jQuery('.pages-bar a').on('mouseout', function() {
						if (mouseFlag) {
							mouseFlag = false;
							window.clearTimeout(timeOutHandler);
						}
					});

					var x = event.pageX;
					var y = event.pageY;
					var hItem = Control.detectItemByMousePointer(x, y);
					var oldHItem = Control.HandleItem;
					if (oldHItem) {
						oldHItem.deInitDroppable();
					}

					Control.HandleItem = hItem;
					if (hItem) {
						var cpos = jQuery(hItem.control.initContainer).position();
						var itmHeight = hItem.position.bottom - hItem.position.top;
						var itmDelta = y - cpos.top - hItem.position.top;

						if (itmDelta < itmHeight / 3) {
							DropMode = 'before';
						}
						if (itmDelta > itmHeight / 3 && itmDelta < 2 * itmHeight / 3) {
							DropMode = 'child';
						}
						if (itmDelta > 2 * itmHeight / 3) {
							DropMode = 'after';
						}
						// force disable for root
						if (hItem.isRoot) {
							DropMode = 'child';
						}
						hItem.initDroppable(DropMode);
					}
				}
			});
		}

	};

	/**
	 * Рисует корневой элемент
	 * @access private
	 */
	var __drawRoot = function() {
		if (!Control.dropIndicator) {
			var dropIndicator = document.createElement('div');
			dropIndicator.className = 'ti-drop';
			Control.dropIndicator = document.body.appendChild(dropIndicator);
		}
		__draw(__self.control.container);
	};

	/**
	 * Разворачивает элемент, если он находится под курсором
	 * Используется в режиме drag&drop
	 * @access private
	 */
	var __autoExpandSelf = function() {
		if (AutoexpandAllowed && __self === Control.HandleItem && !__self.isExpanded) {
			__self.expand();
		}
	};

	this.draw = function() {
		if (_oParent) {
			if (!ForceDraw) {
				__draw(Parent.childsContainer);
			}
		} else {
			if (!ForceDraw) {
				__drawRoot();
			}
		}
	};

	/**
	 * Добавляет дочерний элемент последним в списке
	 * @access public
	 * @param Array _oChildData - массив с информацией о новом элементе
	 * @return Object - новый элемент
	 */
	this.appendChild = function(_oChildData) {
		return new TreeItem(this.control, __self, _oChildData);
	};

	/**
	 * Добавляет дочерний элемент после указанного элемента
	 * @access public
	 * @param Array _oChildData - массив с информацией о новом элементе
	 * @param Object oItem - элемент, после которого добавится новый
	 * @return Object - новый элемент
	 */
	this.appendAfter = function(_oChildData, oItem) {
		return new TreeItem(this.control, __self, _oChildData, oItem, 'after');
	};

	/**
	 * Добавляет дочерний элемент перед указанным элементом
	 * @access public
	 * @param Array _oChildData - массив с информацией о новом элементе
	 * @param Object oItem - элемент, перед которым добавится новый
	 * @return Object - новый элемент
	 */
	this.appendBefore = function(_oChildData, oItem) {
		return new TreeItem(this.control, __self, _oChildData, oItem, 'before');
	};

	/**
	 * Добавляет дочерний элемент в начало списка
	 * @access public
	 * @param Array _oChildData - массив с информацией о новом элементе
	 * @return Object - новый элемент
	 */
	this.appendFirst = function(_oChildData) {
		if (!this.childsContainer.childNodes.length) {
			return this.appendChild(_oChildData);
		} else if (typeof(this.childsContainer.childNodes[0].rel) != 'undefined') {
			return this.appendBefore(_oChildData, this.control.getItem(this.childsContainer.childNodes[0].rel));
		}
	};

	/**
	 * Возвращает предыдущего соседа элемента
	 * @access public
	 * @return Object предыдущий сосед, либо null
	 */
	this.getPreviousSibling = function() {
		var prevEl = this.element.previousSibling;
		if (prevEl && prevEl.rel) {
			return this.control.getItem(prevEl.rel);
		}
		return null;
	};

	/**
	 * Возвращает последующего соседа элемента
	 * @access public
	 * @return Object последующий сосед, либо null
	 */
	this.getNextSibling = function() {
		var prevEl = this.element.nextSibling;
		if (prevEl && prevEl.rel) {
			return this.control.getItem(prevEl.rel);
		}
		return null;
	};

	/**
	 * Удаляет элемент из DOM
	 * @access public
	 */
	this.clear = function() {
		if (this.element.parentNode) {
			this.element.parentNode.removeChild(this.element);
		}
	};

	/**
	 * Проверяет, является ли текущий элемент потомком указанного (на всю глубину)
	 * @access public
	 * @param Object oItem - элемент
	 * @return Boolean true, если является
	 */
	this.checkIsChild = function(oItem) {
		var parent = this.parent;
		while (parent) {
			if (oItem === parent) {
				return true;
			}
			parent = parent.parent;
		}
		return false;
	};

	/**
	 * Возвращает координаты DOM-представления элемента
	 * Метод является обязательным, вызывается Control'ом.
	 * Служит для определения элемента под курсором мыши
	 * @access public
	 */
	this.recalcPosition = function() {
		try {
			var pos = jQuery(labelCtrl).position();
			this.position = {
				'left': pos.left,
				'top': pos.top,
				'right': this.control.initContainer.offsetWidth,
				'bottom': pos.top + labelCtrl.offsetHeight
			};
			return this.position;
		} catch (e) {
			return false;
		}
	};

	/**
	 * Получает значение свойства c именем fieldName
	 * @param String fieldName - имя свойства
	 * @return Mixed значение свойства, либо false, в случае неудачи
	 */
	this.getValue = function(fieldName) {
		if (!Data['properties']) {
			return false;
		}

		if (!Data['properties']['group']) {
			return false;
		}

		var Groups = typeof(Data['properties']['group'][0]) != 'undefined' ? Data['properties']['group'] : [Data['properties']['group']];

		for (var i = 0; i < Groups.length; i++) {
			if (!Groups[i]['property']) {
				continue;
			}

			var Props = typeof(Groups[i]['property'][0]) != 'undefined' ? Groups[i]['property'] : [Groups[i]['property']];

			for (var j = 0; j < Props.length; j++) {
				if (Props[j]['name'] == fieldName) {
					return Props[j]['value'];
				}
			}

		}

		return false;
	};

	this.check = function() {
		$(checkbox).toggleClass('checked');
	};

	/**
	 * Определяет есть ли у элемента чекбокс
	 * @returns {Boolean}
	 */
	this.isCheckboxAvailable = function() {
		return hasCheckbox;
	};

	/**
	 * Получить данные, которые отдал DataSet
	 * @return Array объект со свойствами
	 */
	this.getData = function() {
		return Data;
	};

	/**
	 * Выставляет статус загружены/не загружены дети элемента
	 * Метод является обязательным, вызывается Control'ом!
	 * @param Boolean loaded - статус
	 * @access public
	 */
	this.setLoaded = function(loaded) {
		this.loaded = loaded;
	};

	/**
	 * Выставляет pageing у item'а и заполняет pagebar страницами
	 * @param Object pageing
	 * @return Boolean false, в случае неудачи
	 */
	this.setPageing = function(pageing) {
		if (!pageing) {
			return false;
		}

		this.pageing = pageing;
		pagesBar.style.display = 'none';
		pagesBar.innerHTML = '';
		pagesBar.style.textAlign = 'left';

		if (pageing.total < 2) {
			pagesBar.parentNode.style.display = '';
			var emptyResult = document.createElement('span');
			emptyResult.className = 'empty-result';
			if (this.isRoot) {
				pagesBar.style.textAlign = 'center';
			}

			pagesBar.appendChild(emptyResult);
		}
		if (pageing.total > pageing.limit || pageing.offset > 0) {
			var pagesLabel = document.createElement('span');
			pagesLabel.appendChild(document.createTextNode(getLabel('js-pages-label')));
			pagesLabel.className = 'pagesLabel';
			pagesBar.appendChild(pagesLabel);
			pagesBar.style.display = '';
			var pages = Math.ceil(pageing.total / pageing.limit);
			var curr_page = Math.ceil(pageing.offset / pageing.limit);

			var getCallback = function(page) {
				return function() {
					__self.filter.setPage(page);
					__self.applyFilter(__self.filter, true);
					return false;
				};
			};

			var skippedPrevious = false;
			var nextPage = false;
			for (var i = 0; i < pages; i++) {
				if (i != 0 && i != (Math.ceil(pageing.total / pageing.limit) - 1)) {
					if (Math.abs(i - curr_page) > 15) {
						if (!skippedPrevious) {
							nextPage = document.createElement('a');
							nextPage.href = '#';
							if (curr_page == i) {
								nextPage.className = 'current';
							}

							nextPage.innerHTML = '&#8230;';
							nextPage.className = 'current';
							nextPage.onclick = function() {
								return false;
							};

							pagesBar.appendChild(nextPage);
						}
						skippedPrevious = true;
						continue;
					}
				}
				skippedPrevious = false;

				nextPage = document.createElement('a');
				nextPage.href = '#';
				if (curr_page == i) {
					nextPage.className = 'current';
				}

				nextPage.innerHTML = i + 1;
				nextPage.onclick = getCallback(i);

				pagesBar.appendChild(nextPage);
			}

		}
	};

	/**
	 * Разворачивает элемент
	 * Метод является обязательным, вызывается Control'ом!
	 * @access public
	 */
	this.expand = function() {
		if (!this.hasChilds) {
			return false;
		}

		$(toggleCtrl).addClass('switch');
		this.isExpanded = true;
		if (!this.loaded) {
			this.initFilter(id);
			this.control.load(this.filter);
		}

		this.childsContainer.style.display = '';

		var pagesData = this.pageing;
		if (pagesData['total'] > pagesData['limit']) {
			__self.pagesBar.style.display = '';
		}

		Control.recalcItemsPosition();
		this.control.saveItemState(this.id);

	};

	/**
	 * Сворачивает элемент
	 * Метод является обязательным, вызывается Control'ом!
	 * @access public
	 */
	this.collapse = function() {
		if (!this.hasChilds) {
			return false;
		}

		this.isExpanded = false;
		toggleCtrl.setAttribute('src', IconsPath + 'expand.png');
		$(toggleCtrl).removeClass('switch');
		this.childsContainer.style.display = 'none';
		__self.pagesBar.style.display = 'none';
		Control.recalcItemsPosition();
		this.control.saveItemState(this.id);
	};

	/**
	 * Сворачивает/разворачивает элемент в зависимости от текущего состояния
	 * Метод является обязательным, вызывается Control'ом!
	 * @access public
	 */
	this.toggle = function(el) {
		if (this.hasChilds) {
			$(el).toggleClass('switch');
			this.isExpanded ? this.collapse() : this.expand();
		}
	};

	/**
	 * Обновляет элемент, используя новые данные о нем
	 * @param {Array} _oNewData - новые данные о элементе
	 * Метод является обязательным, вызывается Control'ом!
	 * @access public
	 */
	this.update = function(_oNewData) {
		if (_oNewData) {
			if (this.id != _oNewData.id) {
				return false;
			}

			// change template id
			if (typeof(_oNewData['template-id']) !== 'undefined') {
				this.templateId = _oNewData['template-id'];
			}

			// change view link
			if (typeof(_oNewData['link']) !== 'undefined' && _oNewData['link'] != this.viewLink) {
				this.viewLink = _oNewData['link'];
				labelCtrl.setAttribute('href', this.viewLink);
			}

			// change childs
			if (typeof(_oNewData['childs']) !== 'undefined' && parseInt(_oNewData['childs']) !== CountChilds) {
				CountChilds = parseInt(_oNewData['childs']);
				this.hasChilds = CountChilds > 0 || id == 0;
				var toggleWrapper = $('span', labelCtrl);

				if (__self.hasChilds) {
					toggleWrapper.removeClass('catalog-toggle-off');
					toggleWrapper.removeClass('switch');
					toggleWrapper.addClass('catalog-toggle-wrapper');
					toggleWrapper.empty();

					toggleCtrl = document.createElement('span');
					toggleCtrl.className = 'catalog-toggle switch';
					toggleWrapper.append(toggleCtrl);
				} else {
					toggleWrapper.removeClass('catalog-toggle-wrapper');
					toggleWrapper.removeClass('switch');
					toggleWrapper.addClass('catalog-toggle-off');
					toggleWrapper.empty();
				}
			}

			// change active
			var newActive = typeof(_oNewData['is-active']) !== 'undefined' ? parseInt(_oNewData['is-active']) : 0;
			if (newActive !== this.isActive) {
				this.isActive = newActive;

				if (!this.isActive) {
					$(labelCtrl).addClass('disabled');
				} else {
					$(labelCtrl).removeClass('disabled');
				}
			}

			if (typeof(_oNewData['name']) !== 'undefined' && _oNewData['name'] != this.name) {
				this.name = _oNewData['name'].length ? _oNewData['name'] : '';
				labelText.innerHTML = this.name.length ? this.name : getLabel('js-smc-noname-page');
			}
		}
	};

	/**
	 * Пытается отправить запрос на перемещение элемента
	 * @access public
	 * @param Object Item - элемент в который (или после которого) пытаемся переместить текущий
	 * @param Boolean asSibling - если true, перемещаем после элемента Item, если false, то делаем элемент первым ребенком Item'a
	 * @return False ,в вслучае если перемещение не возможно
	 */
	this.tryMoveTo = function(Item, MoveMode) {
		if (Item) {
			var before = this.control.getRootNodeId();
			var rel = Item.id;
			var asSibling = MoveMode !== 'child' ? 1 : 0;
			if (MoveMode == 'before') {
				before = Item.id;
				rel = Item.parent.id;
			}
			if (MoveMode == 'after') {
				var s = Item.getNextSibling();
				rel = Item.parent.id;
				before = s ? s.id : this.control.getRootNodeId();
			}

			if (Item === this) {
				return false;
			}

			if (Item.checkIsChild(this)) {
				return false;
			}

			if (before == this.id) {
				return false;
			}

			var receiver = Item;
			if (asSibling) {
				receiver = Item.parent ? Item.parent : Item.control.getRoot();
			}

			var selectedIds = [];
			var counter = 0;

			for (i in this.control.selectedList) {
				selectedIds[counter++] = i;
			}

			this.control.dataSet.execute('move', {
				'element': this.id,
				'before': before,
				'rel': rel,
				'as-sibling': asSibling,
				'domain': Item.control.getRoot().name,
				'childs': 1,
				'links': 1,
				'virtuals': 1,
				'permissions': 1,
				'templates': 1,
				'receiver_item': receiver,
				'handle_item': this,
				'selected_list': selectedIds
			});
		}
	};

	/**
	 * Пытается подготовить элемент, как контейнер для перемещаемого
	 * @access public
	 * @param Boolean asSibling - если true, готовим для перемещения после текущего элемента, если false, то готвоим для перемещения в качестве первого ребенка
	 * @return False ,в вслучае если перемещение в этот элемент не возможно
	 */
	this.initDroppable = function(DropMode) {
		var DropMode = DropMode || 'child';
		var di = Control.DraggableItem;
		var cpos = jQuery(this.control.initContainer).position();
		if (di) {
			if (di === this) {
				return false;
			}

			if (this.checkIsChild(di)) {
				return false;
			}

			var ind = Control.dropIndicator;

			if (DropMode == 'after') {
				ind.style.top = this.position.bottom + cpos.top + 'px';
				ind.style.left = this.position.left + cpos.left + 'px';
				ind.style.width = this.position.right - this.position.left + 'px';
			}
			if (DropMode == 'before') {
				ind.style.top = this.position.top + cpos.top + ind.offsetHeight + 'px';
				ind.style.left = this.position.left + cpos.left + 'px';
				ind.style.width = this.position.right - this.position.left + 'px';
			}
			if (DropMode == 'child') {
				ind.style.top = this.position.bottom + cpos.top + 'px';
				ind.style.left = this.position.left + cpos.left + 20 + 'px';
				ind.style.width = this.position.right + cpos.left - 40 - this.position.left + 'px';
			}

			ind.style.display = '';

			setTimeout(__autoExpandSelf, 3239);
		}
	};

	/**
	 * Восстанавливает состояние элемента из режима "контейнер для перемещаемого"
	 * @access public
	 */
	this.deInitDroppable = function() {
		if (!Control.dropIndicator) {
			return;
		}
		Control.dropIndicator.style.display = 'none';
	};

	/**
	 * Устанавливает фильтр для детей элемента и обновляет содержимое, если потребуется
	 * @access public
	 * @param _Filter
	 */
	this.applyFilter = function(_Filter, ignoreHierarchy) {
		if (_Filter instanceof Object) {
			this.filter = _Filter;
		} else {
			this.filter.clear();
		}

		this.initFilter(!ignoreHierarchy);

		if (this.loaded) {
			this.control.removeItem(id, true);
			this.loaded = false;

			if (this.isExpanded) {
				this.expand();
			}
		}
	};

	/**
	 * Инициализирует фильтр
	 * @param {Boolean} hasParent имеет ли фильтруемый датасет родительский элемент
	 */
	this.initFilter = function(hasParent) {
		if (hasParent) {
			this.initRelationFilter();
		}
		this.initSearchQuery();
	};

	/**
	 * Инициализирует фильтр по иерархии
	 */
	this.initRelationFilter = function() {
		this.filter.setParentElements(id);
	};

	/**
	 * Инициализирует фильтр по поисковой строке
	 */
	this.initSearchQuery = function() {
		var searchStorage = new SearchAllTextStorage(this.control.id);
		var searchValueList = searchStorage.load();

		if (searchValueList.length > 0) {
			this.filter.setAllTextSearch(searchValueList);
		}
	};

	/**
	 * Устанавливает или снимает выделение элемента
	 * @param {Boolean} _selected если true, то элемент будет выделен, если false, то выделение
	 * будет снято
	 */
	this.setSelected = function(_selected) {
		if (_selected) {
			if (!oldClassName) {
				oldClassName = labelCtrl.className;
				labelCtrl.classList.add('selected');

				if (__self.isDefault) {
					labelCtrl.className += ' main-page';
				}
			}
			if (hasCheckbox) {
				$(this.checkBox).addClass('checked');
			}

			selected = true;
		} else {
			if (oldClassName) {
				if (__self.isDefault) {
					labelCtrl.className += ' main-page';
				}
				oldClassName = null;
			}
			$(labelCtrl).removeClass('selected');

			if (hasCheckbox) {
				$(this.checkBox).removeClass('checked');
			}

			selected = false;
		}
	};

	this.getSelected = function() {
		return selected;
	};

	/**
	 * Возвращает ссылку на страницу элемента
	 * @return {String} ссылка на страницу элемента
	 */
	this.getUrl = function() {
		var tds = TemplatesDataSet.getInstance();
		var domains = tds.getDomainsList();

		if (!domains) {
			return __self.viewLink;
		}

		for (var n in domains) {
			if (domains[n].id == __self.domainId) {
				return domains[n].url + __self.viewLink;
			}
		}

		return __self.viewLink;
	};

	/**
	 * Определяет активна ли страница
	 * @returns {bool}
	 */
	this.active = function () {
		return !!__self.isActive;
	};

	__constructor();
};

ContextMenu = {};

ContextMenu.itemHandlers = {};

ContextMenu.itemHandlers.viewElement = function(action) {
	if (!Control.HandleItem) {
		return false;
	}
	if (!Control.HandleItem.id) {
		return false;
	}

	var items = Control.HandleItem.control.selectedList;
	var i, item, size = 0;
	for (i in items) {
		item = items[i];
		size++;
	}

	if (!item) {
		return false;
	}

	var viewLink = item.getData()['link'];

	if (!viewLink) {
		return false;
	}

	var disabled = (size != 1);

	return {
		caption: getLabel('js-' + action[0]),
		icon: 'i-see',
		visible: true,
		disabled: disabled,
		execute: function() {
			window.location = viewLink;
			return false;
		}
	};
};

ContextMenu.itemHandlers.copyUrl = function(action) {
	if (!Control.HandleItem) {
		return false;
	}
	if (!Control.HandleItem.id) {
		return false;
	}

	var items = Control.HandleItem.control.selectedList;
	var i, item, size = 0;
	for (i in items) {
		item = items[i];
		size++;
	}

	if (!item) {
		return false;
	}

	var viewLink = item.getData()['link'];

	if (!viewLink) {
		return false;
	}

	var disabled = (size != 1);

	return {
		caption: getLabel('js-' + action[0]),
		icon: 'i-copy-url',
		visible: true,
		disabled: disabled,
		onRender: function(element) {
			if (window.ZeroClipboard.isFlashUnusable()) {
				return;
			}

			var el = $(element);
			el.attr('data-clipboard-text', location.protocol + '//' + location.hostname + viewLink);
			var client = new ZeroClipboard(element);
		},
		execute: function(action) {
			if (window.ZeroClipboard.isFlashUnusable()) {
				$.jGrowl(getLabel('js-error-copy-url-flash-player-disabled'), {
					'header': 'UMI.CMS',
					'life': 10000
				});
			}
		}
	};
};

ContextMenu.itemHandlers.changeParent = function(action) {
	if (!Control.HandleItem) {
		return false;
	}
	if (!Control.HandleItem.id) {
		return false;
	}

	var _self = this;

	this.moveItem = function(pageId) {
		if (window.page_id == pageId) {
			return false;
		}
		jQuery.ajax({
			url: '/admin/content/tree_move_element.json',
			type: 'get',
			dataType: 'json',
			data: {
				element: window.page_id,
				rel: pageId,
				return_copies: 1
			},
			success: function(response) {
				oFilterController.applyFilterAdvanced();
			}
		});
	};

	return {
		caption: getLabel('js-' + action[0]),
		icon: action[1],
		visible: true,
		execute: function(action) {
			var popUpCallback = '&callback=changeParentControlsList["' + Control.HandleItem.id + '"].moveItem';
			window.page_id = Control.HandleItem.id;

			if (!window.changeParentControlsList) {
				window.changeParentControlsList = {};
			}
			window.changeParentControlsList[Control.HandleItem.id] = _self;

			jQuery.openPopupLayer({
				name: 'Sitetree',
				title: getLabel('js-choice-page'),
				width: 620,
				height: 335,
				url: '/styles/common/js/parents.html?id=' + Control.HandleItem.id + (Control.HandleItem.baseModule ? '&module=' + Control.HandleItem.baseModule : '') + (window.lang_id ? '&lang_id=' + window.lang_id : '') + popUpCallback
			});
		}
	};
};

ContextMenu.itemHandlers.editItem = function(action) {
	if (!Control.HandleItem) {
		return false;
	}
	if (!Control.HandleItem.id) {
		return false;
	}

	var items = Control.HandleItem.control.selectedList;
	var i, item, size = 0;
	for (i in items) {
		item = items[i];
		size++;
	}

	if (!item) {
		return false;
	}

	var editLink = item.editLink;

	if (!editLink) {
		return false;
	}

	var disabled = (size != 1 || !editLink);

	return {
		caption: getLabel('js-' + action[0]),
		icon: 'i-edit',
		visible: true,
		disabled: disabled,
		execute: function() {
			window.location = editLink;
			return false;
		}
	};
};

ContextMenu.itemHandlers.addItem = function(action) {
	if (!Control.HandleItem) {
		return false;
	}

	var items = Control.HandleItem.control.selectedList;
	var i, item, size = 0;
	for (i in items) {
		item = items[i];
		size++;
	}

	if (!item) {
		return false;
	}

	var createLink = item.createLink;
	if (!createLink) {
		return false;
	}
	var disabled = (size != 1 || !createLink);

	return {
		caption: getLabel('js-' + action[0]),
		icon: 'i-add',
		visible: true,
		disabled: disabled,
		execute: function() {
			window.location = createLink;
			return false;
		}
	};
};

ContextMenu.itemHandlers.filterItem = function(action) {
	if (!Control.HandleItem) {
		return false;
	}
	if (!Control.HandleItem.id) {
		return false;
	}

	if (Control.HandleItem.control.flatMode || Control.HandleItem.control.objectTypesMode) {
		return false;
	}

	var control = Control.HandleItem.control;
	var items = Control.HandleItem.control.selectedList, i, n = 0;
	var hasTrue = false, hasFalse = false;
	for (i in items) {
		var item = items[i];
		if (control.isTarget(item)) {
			hasTrue = true;
		} else {
			hasFalse = true;
		}
		n++;
	}

	var disabled = false;
	if (n == 1) {
		if (!item.hasChilds) {
			disabled = true;
		}
	}

	return {
		caption: getLabel('js-' + action[0]),
		icon: hasTrue ? 'i-search-section' : 'i-search-section disabled',
		visible: true,
		disabled: disabled,
		execute: function() {
			var control = Control.HandleItem.control;
			control.setTargetItems(hasTrue ? {} : control.selectedList);
			return false;
		}
	};
};

ContextMenu.itemHandlers.activeItem = function(action) {
	if (!Control.HandleItem) {
		return false;
	}
	if (!Control.HandleItem.id) {
		return false;
	}

	if (Control.HandleItem.control.flatMode || Control.HandleItem.control.objectTypesMode) {
		return false;
	}

	var items = Control.HandleItem.control.selectedList, i;
	var hasTrue = false, hasFalse = false;
	for (i in items) {
		if (items[i].isActive) {
			hasTrue = true;
		} else {
			hasFalse = true;
		}
	}
	var checked = (hasTrue && !hasFalse);

	return {
		caption: getLabel('js-' + action[0]),
		icon: checked ? 'i-hidden' : 'i-vision',
		visible: true,
		execute: function() {
			var control = Control.HandleItem.control, i, idList = [];

			for (i in items) {
				idList.push(i);
			}

			if (control.contentType === 'pages') {
				var recursiveOperator = new PageTreeRecursiveOperator(control);
				recursiveOperator.switchActivity(idList, !checked);
				return false;
			}

			// старая логика для переключение активности объектов
			control.dataSet.execute('tree_set_activity', {
				'element': idList,
				'selected_items': items,
				'active': (checked ? 0 : 1)
			});

			return false;
		}
	};
};

ContextMenu.itemHandlers.activeObjectItem = function(action) {
	if (!Control.HandleItem) {
		return false;
	}
	if (!Control.HandleItem.id) {
		return false;
	}

	if (!Control.HandleItem.control.flatMode) {
		return false;
	}

	var items = Control.HandleItem.control.selectedList, i;
	var hasTrue = false, hasFalse = false;
	for (i in items) {
		var item = items[i];
		if (item.getValue('is_activated') || item.getValue('is_active') || item.getValue('activated')) {
			hasTrue = true;
		} else {
			hasFalse = true;
		}
	}
	var checked = (hasTrue && !hasFalse);

	return {
		caption: getLabel('js-' + action[0]),
		icon: checked ? 'i-vision' : 'i-hidden',
		visible: true,
		execute: function() {
			var control = Control.HandleItem.control, i, ids = [];

			for (i in items) {
				ids.push(i);
			}

			control.dataSet.execute('tree_set_activity', {
				'element': Control.HandleItem.id,
				'object': ids,
				'handle_item': Control.HandleItem,
				'selected_items': items,
				'viewMode': 'full',
				'active': (checked ? 0 : 1)
			});

			return false;
		}
	};
};

ContextMenu.itemHandlers.deleteItem = function(action) {
	if (!Control.HandleItem) {
		return false;
	}
	if (!Control.HandleItem.id) {
		return false;
	}

	var items = Control.HandleItem.control.selectedList;
	var keys = Object.keys(items);
	if (keys.length < 1) {
		return false;
	}

	return {
		caption: getLabel('js-' + action[0]),
		icon: 'i-remove',
		visible: true,
		execute: function() {
			var control = Control.HandleItem.control, cnt, i, ids = [];
			var items = control.selectedList;

			if (items instanceof Array) {
				for (var i = 0; i < items.length; i++) {

					var item = items[i];

					if (item.lockedBy) {
						alert(getLabel('js-page-is-locked') + '\n' + getLabel('js-steal-lock-question'));
						ContextMenu.getInstance().terminate();
						return false;
					}

					ids.push(item);
				}
			}

			if (items instanceof Object) {
				for (var key in items) {
					ids.push(key);
				}
			}

			if (control.contentType === 'pages') {
				var recursiveOperator = new PageTreeRecursiveOperator(control);
				var showConfirmation = true;
				recursiveOperator.putToTrash(ids, showConfirmation);
				return false;
			}

			// старая логика для удаления объектов
			control.dataSet.execute('tree_delete_element', {
				'element': ids,
				'selected_items': items
			});

			return false;
		}
	};
};

ContextMenu.itemHandlers.templatesItem = function(action) {
	if (!Control.HandleItem) {
		return false;
	}
	if (!Control.HandleItem.id) {
		return false;
	}

	if (Control.HandleItem.control.flatMode || Control.HandleItem.control.objectTypesMode) {
		return false;
	}

	//Inspect selected items
	var items = Control.HandleItem.control.selectedList;
	var i, langId = false, domainId = false, templateId = false, multipleTemplates = false;
	for (i in items) {
		var item = items[i];

		if (!langId || !domainId) {
			langId = item.langId;
			domainId = item.domainId;
		}

		if (templateId && multipleTemplates) {
			if (templateId != item.templateId) {
				templateId = false;
			}
		}

		if (!templateId && !multipleTemplates) {
			templateId = item.templateId;
			multipleTemplates = true;
		}
	}

	//Process templates list
	var tds = TemplatesDataSet.getInstance();
	var templateItems = {}, templates = tds.getTemplatesList(domainId, langId);

	var getClickCallback = function(template_id) {
		return function() {
			if (!Control.HandleItem) {
				return false;
			}

			var control = Control.HandleItem.control, i, ids = [];
			for (i in items) {
				ids.push(i);
			}

			control.dataSet.execute('change_template', {
				'element': ids,
				'selected_items': items,
				'template-id': template_id,
				'templates': 1,
				'childs': 1,
				'permissions': 1,
				'virtuals': 1,
				'links': 1
			});

			return false;
		};
	};

	for (i in templates) {
		var template = templates[i];
		var id = template['id'], title = template['title'], checked = false;

		if (!id) {
			continue;
		} //TODO: Fix it in TemplatesDataSet class

		if (templateId && templateId == id) {
			checked = true;
		}

		templateItems[id] = {
			icon: checked ? 'checked' : 'undefined',
			caption: title,
			execute: getClickCallback(id)
		};
	}

	return {
		caption: getLabel('js-' + action[0]),
		icon: 'i-amend',
		visible: true,
		execute: function() {
			return false;
		},
		submenu: templateItems
	};
};

ContextMenu.itemHandlers.storeGoodsItem = function() {
	if (!Control.HandleItem) {
		return false;
	}
	if (!Control.HandleItem.id) {
		return false;
	}

	var items = Control.HandleItem.control.selectedList;
	var i, item, size = 0;
	for (i in items) {
		item = items[i];
		size++;
	}

	if (!item) {
		return false;
	}

	var viewLink = window.pre_lang + '/admin/eshop/store_view/' + item.id + '/';

	if (!viewLink) {
		return false;
	}

	var disabled = (size != 1);

	return {
		'title': getLabel('js-view-store-goods'),
		'callback': function() {
			window.location = viewLink;
			return false;
		},
		'disabled': disabled
	};
};

ContextMenu.itemHandlers.guideViewItem = function() {
	if (!Control.HandleItem) {
		return false;
	}
	if (!Control.HandleItem.id) {
		return false;
	}

	var items = Control.HandleItem.control.selectedList;
	var i, item, size = 0;
	for (i in items) {
		item = items[i];
		size++;
	}

	if (!item) {
		return false;
	}

	var viewLink = window.pre_lang + '/admin/data/guide_items/' + item.id + '/';

	if (!viewLink) {
		return false;
	}

	var _disabled = (size > 1);

	return {
		caption: getLabel('js-view-guide-items'),
		icon: 'view',
		execute: function() {
			window.location = viewLink;
			return false;
		},
		disabled: _disabled
	};
};

ContextMenu.itemHandlers.viewMessage = function() {
	if (!Control.HandleItem) {
		return false;
	}
	if (!Control.HandleItem.id) {
		return false;
	}

	var items = Control.HandleItem.control.selectedList;
	var i, item, size = 0;
	for (i in items) {
		item = items[i];
		size++;
	}

	if (!item) {
		return false;
	}

	var viewLink = window.pre_lang + '/admin/webforms/message/' + item.id + '/';

	var _disabled = (size > 1);

	return {
		caption: getLabel('js-view-message'),
		icon: 'view',
		execute: function() {
			window.location = viewLink;
			return false;
		},
		disabled: _disabled
	};
};

/**
 * Возвращает цель быстрого обмена данными в csv формате
 * @returns {TableItem|boolean}
 */
ContextMenu.getExchangeSourceItem = function() {
	if (!Control.HandleItem) {
		return false;
	}

	if (!Control.HandleItem.id) {
		return false;
	}

	if (Control.HandleItem.control.objectTypesMode || Control.HandleItem.control.flatMode) {
		return false;
	}

	var selectedItemList = Control.HandleItem.control.selectedList;
	var i, item, size = 0;
	for (i in selectedItemList) {
		item = selectedItemList[i];
		size++;
	}

	if (!item.hasChilds || size !== 1) {
		return false;
	}

	return item;
};

/**
 * Обработчик нажатия кнопки "Экспорт списка в CSV" в контекстном меню табличного контрола
 * @param {Array} action
 * @returns {*}
 */
ContextMenu.itemHandlers.csvExport = function(action) {
	var item = ContextMenu.getExchangeSourceItem();

	if (!item) {
		return false;
	}

	return {
		caption: getLabel('js-csv-export'),
		icon: action[1],
		visible: true,
		execute: function() {
			item.exportCallback([item.id]);
		}
	};
};

/**
 * Обработчик нажатия кнопки "Импорт списка в CSV" в контекстном меню табличного контрола
 * @param {Array} action
 * @returns {*}
 */
ContextMenu.itemHandlers.csvImport = function(action) {
	var item = ContextMenu.getExchangeSourceItem();

	if (!item) {
		return false;
	}

	return {
		caption: getLabel('js-csv-import'),
		icon: action[1],
		visible: true,
		execute: function() {
			item.importCallback(item.id);
		}
	};
};

ContextMenu.itemHandlers.restoreItem = function(action) {
	if (!Control.HandleItem) {
		return false;
	}
	if (!Control.HandleItem.id) {
		return false;
	}

	var items = Control.HandleItem.control.selectedList;

	if (items.length < 1) {
		return false;
	}

	return {
		caption: getLabel('js-trash-restore'),
		icon: action[1],
		visible: true,
		execute: function() {
			var control = Control.HandleItem.control, i, ids = [];
			var items = control.selectedList;

			for (i in items) {
				ids.push(i);
			}

			var recursiveOperator = new PageTreeRecursiveOperator(Control);
			recursiveOperator.restoreFromTrash(ids);

			return false;
		}
	};
};

ContextMenu.itemHandlers.copyItemOld = function(action) {
	if (!Control.HandleItem) {
		return false;
	}
	if (!Control.HandleItem.id) {
		return false;
	}

	if (Control.HandleItem.control.flatMode || Control.HandleItem.control.objectTypesMode) {
		return false;
	}

	var control = Control.HandleItem.control;
	var items = control.selectedList;
	var i, j, item, domainId = false, langId = false;
	for (i in items) {
		item = items[i];
		domainId = item.domainId;
		langId = item.langId;
	}

	var tds = TemplatesDataSet.getInstance();
	var langsList = tds.getLangsList();
	var domainList = tds.getDomainsList();

	var getClickCallback = function(domainId, langId) {
		return function() {
			var i, ids = [];
			for (i in items) {
				ids.push(i);
			}

			control.dataSet.addEventHandler('onBeforeExecute', createConfirm(control.dataSet));
			control.dataSet.execute('copyElementToSite', {
				'element': ids,
				'handle_item': $.extend(true, {}, Control.HandleItem),
				'selected_items': items,
				'lang-id': langId,
				'domain-id': domainId,
				'templates': 1,
				'childs': 1,
				'permissions': 1,
				'virtuals': 1,
				'links': 1
			});

			return false;
		};
	};

	var menuItems = {};
	for (i = 0; i < domainList.length; i++) {
		var d = domainList[i];

		var checked = (domainId == d['id']);

		var smenuItems = {};
		for (j = 0; j < langsList.length; j++) {
			var lang = langsList[j];

			var schecked = checked && (langId == lang['id']);

			smenuItems[lang['id']] = {
				icon: schecked ? 'checked' : 'undefined',
				caption: lang['nodeValue'],
				execute: getClickCallback(d['id'], lang['id'])
			};
		}

		menuItems[d['id']] = {
			icon: checked ? 'checked' : 'undefined',
			caption: d['host'],
			execute: function() {
				return false;
			},
			submenu: smenuItems
		};
	}

	return {
		caption: getLabel('js-' + action[0]),
		icon: 'i-copy-other',
		visible: true,
		execute: function() {
			return false;
		},
		submenu: menuItems
	};
};

ContextMenu.itemHandlers.typeRemove = function() {

};

ContextMenu.itemHandlers.typeEdit = function() {

};

ContextMenu.allowControlEnable = true;

/*!
 * ZeroClipboard
 * The ZeroClipboard library provides an easy way to copy text to the clipboard using an invisible Adobe Flash movie and a JavaScript interface.
 * Copyright (c) 2009-2014 Jon Rohan, James M. Greene
 * Licensed MIT
 * http://zeroclipboard.org/
 * v2.2.0
 */
(function(window, undefined) {
  "use strict";
  /**
 * Store references to critically important global functions that may be
 * overridden on certain web pages.
 */
  var _window = window, _document = _window.document, _navigator = _window.navigator, _setTimeout = _window.setTimeout, _clearTimeout = _window.clearTimeout, _setInterval = _window.setInterval, _clearInterval = _window.clearInterval, _getComputedStyle = _window.getComputedStyle, _encodeURIComponent = _window.encodeURIComponent, _ActiveXObject = _window.ActiveXObject, _Error = _window.Error, _parseInt = _window.Number.parseInt || _window.parseInt, _parseFloat = _window.Number.parseFloat || _window.parseFloat, _isNaN = _window.Number.isNaN || _window.isNaN, _now = _window.Date.now, _keys = _window.Object.keys, _defineProperty = _window.Object.defineProperty, _hasOwn = _window.Object.prototype.hasOwnProperty, _slice = _window.Array.prototype.slice, _unwrap = function() {
    var unwrapper = function(el) {
      return el;
    };
    if (typeof _window.wrap === "function" && typeof _window.unwrap === "function") {
      try {
        var div = _document.createElement("div");
        var unwrappedDiv = _window.unwrap(div);
        if (div.nodeType === 1 && unwrappedDiv && unwrappedDiv.nodeType === 1) {
          unwrapper = _window.unwrap;
        }
      } catch (e) {}
    }
    return unwrapper;
  }();
  /**
 * Convert an `arguments` object into an Array.
 *
 * @returns The arguments as an Array
 * @private
 */
  var _args = function(argumentsObj) {
    return _slice.call(argumentsObj, 0);
  };
  /**
 * Shallow-copy the owned, enumerable properties of one object over to another, similar to jQuery's `$.extend`.
 *
 * @returns The target object, augmented
 * @private
 */
  var _extend = function() {
    var i, len, arg, prop, src, copy, args = _args(arguments), target = args[0] || {};
    for (i = 1, len = args.length; i < len; i++) {
      if ((arg = args[i]) != null) {
        for (prop in arg) {
          if (_hasOwn.call(arg, prop)) {
            src = target[prop];
            copy = arg[prop];
            if (target !== copy && copy !== undefined) {
              target[prop] = copy;
            }
          }
        }
      }
    }
    return target;
  };
  /**
 * Return a deep copy of the source object or array.
 *
 * @returns Object or Array
 * @private
 */
  var _deepCopy = function(source) {
    var copy, i, len, prop;
    if (typeof source !== "object" || source == null || typeof source.nodeType === "number") {
      copy = source;
    } else if (typeof source.length === "number") {
      copy = [];
      for (i = 0, len = source.length; i < len; i++) {
        if (_hasOwn.call(source, i)) {
          copy[i] = _deepCopy(source[i]);
        }
      }
    } else {
      copy = {};
      for (prop in source) {
        if (_hasOwn.call(source, prop)) {
          copy[prop] = _deepCopy(source[prop]);
        }
      }
    }
    return copy;
  };
  /**
 * Makes a shallow copy of `obj` (like `_extend`) but filters its properties based on a list of `keys` to keep.
 * The inverse of `_omit`, mostly. The big difference is that these properties do NOT need to be enumerable to
 * be kept.
 *
 * @returns A new filtered object.
 * @private
 */
  var _pick = function(obj, keys) {
    var newObj = {};
    for (var i = 0, len = keys.length; i < len; i++) {
      if (keys[i] in obj) {
        newObj[keys[i]] = obj[keys[i]];
      }
    }
    return newObj;
  };
  /**
 * Makes a shallow copy of `obj` (like `_extend`) but filters its properties based on a list of `keys` to omit.
 * The inverse of `_pick`.
 *
 * @returns A new filtered object.
 * @private
 */
  var _omit = function(obj, keys) {
    var newObj = {};
    for (var prop in obj) {
      if (keys.indexOf(prop) === -1) {
        newObj[prop] = obj[prop];
      }
    }
    return newObj;
  };
  /**
 * Remove all owned, enumerable properties from an object.
 *
 * @returns The original object without its owned, enumerable properties.
 * @private
 */
  var _deleteOwnProperties = function(obj) {
    if (obj) {
      for (var prop in obj) {
        if (_hasOwn.call(obj, prop)) {
          delete obj[prop];
        }
      }
    }
    return obj;
  };
  /**
 * Determine if an element is contained within another element.
 *
 * @returns Boolean
 * @private
 */
  var _containedBy = function(el, ancestorEl) {
    if (el && el.nodeType === 1 && el.ownerDocument && ancestorEl && (ancestorEl.nodeType === 1 && ancestorEl.ownerDocument && ancestorEl.ownerDocument === el.ownerDocument || ancestorEl.nodeType === 9 && !ancestorEl.ownerDocument && ancestorEl === el.ownerDocument)) {
      do {
        if (el === ancestorEl) {
          return true;
        }
        el = el.parentNode;
      } while (el);
    }
    return false;
  };
  /**
 * Get the URL path's parent directory.
 *
 * @returns String or `undefined`
 * @private
 */
  var _getDirPathOfUrl = function(url) {
    var dir;
    if (typeof url === "string" && url) {
      dir = url.split("#")[0].split("?")[0];
      dir = url.slice(0, url.lastIndexOf("/") + 1);
    }
    return dir;
  };
  /**
 * Get the current script's URL by throwing an `Error` and analyzing it.
 *
 * @returns String or `undefined`
 * @private
 */
  var _getCurrentScriptUrlFromErrorStack = function(stack) {
    var url, matches;
    if (typeof stack === "string" && stack) {
      matches = stack.match(/^(?:|[^:@]*@|.+\)@(?=http[s]?|file)|.+?\s+(?: at |@)(?:[^:\(]+ )*[\(]?)((?:http[s]?|file):\/\/[\/]?.+?\/[^:\)]*?)(?::\d+)(?::\d+)?/);
      if (matches && matches[1]) {
        url = matches[1];
      } else {
        matches = stack.match(/\)@((?:http[s]?|file):\/\/[\/]?.+?\/[^:\)]*?)(?::\d+)(?::\d+)?/);
        if (matches && matches[1]) {
          url = matches[1];
        }
      }
    }
    return url;
  };
  /**
 * Get the current script's URL by throwing an `Error` and analyzing it.
 *
 * @returns String or `undefined`
 * @private
 */
  var _getCurrentScriptUrlFromError = function() {
    var url, err;
    try {
      throw new _Error();
    } catch (e) {
      err = e;
    }
    if (err) {
      url = err.sourceURL || err.fileName || _getCurrentScriptUrlFromErrorStack(err.stack);
    }
    return url;
  };
  /**
 * Get the current script's URL.
 *
 * @returns String or `undefined`
 * @private
 */
  var _getCurrentScriptUrl = function() {
    var jsPath, scripts, i;
    if (_document.currentScript && (jsPath = _document.currentScript.src)) {
      return jsPath;
    }
    scripts = _document.getElementsByTagName("script");
    if (scripts.length === 1) {
      return scripts[0].src || undefined;
    }
    if ("readyState" in scripts[0]) {
      for (i = scripts.length; i--; ) {
        if (scripts[i].readyState === "interactive" && (jsPath = scripts[i].src)) {
          return jsPath;
        }
      }
    }
    if (_document.readyState === "loading" && (jsPath = scripts[scripts.length - 1].src)) {
      return jsPath;
    }
    if (jsPath = _getCurrentScriptUrlFromError()) {
      return jsPath;
    }
    return undefined;
  };
  /**
 * Get the unanimous parent directory of ALL script tags.
 * If any script tags are either (a) inline or (b) from differing parent
 * directories, this method must return `undefined`.
 *
 * @returns String or `undefined`
 * @private
 */
  var _getUnanimousScriptParentDir = function() {
    var i, jsDir, jsPath, scripts = _document.getElementsByTagName("script");
    for (i = scripts.length; i--; ) {
      if (!(jsPath = scripts[i].src)) {
        jsDir = null;
        break;
      }
      jsPath = _getDirPathOfUrl(jsPath);
      if (jsDir == null) {
        jsDir = jsPath;
      } else if (jsDir !== jsPath) {
        jsDir = null;
        break;
      }
    }
    return jsDir || undefined;
  };
  /**
 * Get the presumed location of the "ZeroClipboard.swf" file, based on the location
 * of the executing JavaScript file (e.g. "ZeroClipboard.js", etc.).
 *
 * @returns String
 * @private
 */
  var _getDefaultSwfPath = function() {
    var jsDir = _getDirPathOfUrl(_getCurrentScriptUrl()) || _getUnanimousScriptParentDir() || "";
    return jsDir + "ZeroClipboard.swf";
  };
  /**
 * Keep track of if the page is framed (in an `iframe`). This can never change.
 * @private
 */
  var _pageIsFramed = function() {
    return window.opener == null && (!!window.top && window != window.top || !!window.parent && window != window.parent);
  }();
  /**
 * Keep track of the state of the Flash object.
 * @private
 */
  var _flashState = {
    bridge: null,
    version: "0.0.0",
    pluginType: "unknown",
    disabled: null,
    outdated: null,
    sandboxed: null,
    unavailable: null,
    degraded: null,
    deactivated: null,
    overdue: null,
    ready: null
  };
  /**
 * The minimum Flash Player version required to use ZeroClipboard completely.
 * @readonly
 * @private
 */
  var _minimumFlashVersion = "11.0.0";
  /** The ZeroClipboard library version number, as reported by Flash, at the time the SWF was compiled. */
  var _zcSwfVersion;
  /**
 * Keep track of all event listener registrations.
 * @private
 */
  var _handlers = {};
  /**
 * Keep track of the currently activated element.
 * @private
 */
  var _currentElement;
  /**
 * Keep track of the element that was activated when a `copy` process started.
 * @private
 */
  var _copyTarget;
  /**
 * Keep track of data for the pending clipboard transaction.
 * @private
 */
  var _clipData = {};
  /**
 * Keep track of data formats for the pending clipboard transaction.
 * @private
 */
  var _clipDataFormatMap = null;
  /**
 * Keep track of the Flash availability check timeout.
 * @private
 */
  var _flashCheckTimeout = 0;
  /**
 * Keep track of SWF network errors interval polling.
 * @private
 */
  var _swfFallbackCheckInterval = 0;
  /**
 * The `message` store for events
 * @private
 */
  var _eventMessages = {
    ready: "Flash communication is established",
    error: {
      "flash-disabled": "Flash is disabled or not installed. May also be attempting to run Flash in a sandboxed iframe, which is impossible.",
      "flash-outdated": "Flash is too outdated to support ZeroClipboard",
      "flash-sandboxed": "Attempting to run Flash in a sandboxed iframe, which is impossible",
      "flash-unavailable": "Flash is unable to communicate bidirectionally with JavaScript",
      "flash-degraded": "Flash is unable to preserve data fidelity when communicating with JavaScript",
      "flash-deactivated": "Flash is too outdated for your browser and/or is configured as click-to-activate.\nThis may also mean that the ZeroClipboard SWF object could not be loaded, so please check your `swfPath` configuration and/or network connectivity.\nMay also be attempting to run Flash in a sandboxed iframe, which is impossible.",
      "flash-overdue": "Flash communication was established but NOT within the acceptable time limit",
      "version-mismatch": "ZeroClipboard JS version number does not match ZeroClipboard SWF version number",
      "clipboard-error": "At least one error was thrown while ZeroClipboard was attempting to inject your data into the clipboard",
      "config-mismatch": "ZeroClipboard configuration does not match Flash's reality",
      "swf-not-found": "The ZeroClipboard SWF object could not be loaded, so please check your `swfPath` configuration and/or network connectivity"
    }
  };
  /**
 * The `name`s of `error` events that can only occur is Flash has at least
 * been able to load the SWF successfully.
 * @private
 */
  var _errorsThatOnlyOccurAfterFlashLoads = [ "flash-unavailable", "flash-degraded", "flash-overdue", "version-mismatch", "config-mismatch", "clipboard-error" ];
  /**
 * The `name`s of `error` events that should likely result in the `_flashState`
 * variable's property values being updated.
 * @private
 */
  var _flashStateErrorNames = [ "flash-disabled", "flash-outdated", "flash-sandboxed", "flash-unavailable", "flash-degraded", "flash-deactivated", "flash-overdue" ];
  /**
 * A RegExp to match the `name` property of `error` events related to Flash.
 * @private
 */
  var _flashStateErrorNameMatchingRegex = new RegExp("^flash-(" + _flashStateErrorNames.map(function(errorName) {
    return errorName.replace(/^flash-/, "");
  }).join("|") + ")$");
  /**
 * A RegExp to match the `name` property of `error` events related to Flash,
 * which is enabled.
 * @private
 */
  var _flashStateEnabledErrorNameMatchingRegex = new RegExp("^flash-(" + _flashStateErrorNames.slice(1).map(function(errorName) {
    return errorName.replace(/^flash-/, "");
  }).join("|") + ")$");
  /**
 * ZeroClipboard configuration defaults for the Core module.
 * @private
 */
  var _globalConfig = {
    swfPath: _getDefaultSwfPath(),
    trustedDomains: window.location.host ? [ window.location.host ] : [],
    cacheBust: true,
    forceEnhancedClipboard: false,
    flashLoadTimeout: 3e4,
    autoActivate: true,
    bubbleEvents: true,
    containerId: "global-zeroclipboard-html-bridge",
    containerClass: "global-zeroclipboard-container",
    swfObjectId: "global-zeroclipboard-flash-bridge",
    hoverClass: "zeroclipboard-is-hover",
    activeClass: "zeroclipboard-is-active",
    forceHandCursor: false,
    title: null,
    zIndex: 999999999
  };
  /**
 * The underlying implementation of `ZeroClipboard.config`.
 * @private
 */
  var _config = function(options) {
    if (typeof options === "object" && options !== null) {
      for (var prop in options) {
        if (_hasOwn.call(options, prop)) {
          if (/^(?:forceHandCursor|title|zIndex|bubbleEvents)$/.test(prop)) {
            _globalConfig[prop] = options[prop];
          } else if (_flashState.bridge == null) {
            if (prop === "containerId" || prop === "swfObjectId") {
              if (_isValidHtml4Id(options[prop])) {
                _globalConfig[prop] = options[prop];
              } else {
                throw new Error("The specified `" + prop + "` value is not valid as an HTML4 Element ID");
              }
            } else {
              _globalConfig[prop] = options[prop];
            }
          }
        }
      }
    }
    if (typeof options === "string" && options) {
      if (_hasOwn.call(_globalConfig, options)) {
        return _globalConfig[options];
      }
      return;
    }
    return _deepCopy(_globalConfig);
  };
  /**
 * The underlying implementation of `ZeroClipboard.state`.
 * @private
 */
  var _state = function() {
    _detectSandbox();
    return {
      browser: _pick(_navigator, [ "userAgent", "platform", "appName" ]),
      flash: _omit(_flashState, [ "bridge" ]),
      zeroclipboard: {
        version: ZeroClipboard.version,
        config: ZeroClipboard.config()
      }
    };
  };
  /**
 * The underlying implementation of `ZeroClipboard.isFlashUnusable`.
 * @private
 */
  var _isFlashUnusable = function() {
    return !!(_flashState.disabled || _flashState.outdated || _flashState.sandboxed || _flashState.unavailable || _flashState.degraded || _flashState.deactivated);
  };
  /**
 * The underlying implementation of `ZeroClipboard.on`.
 * @private
 */
  var _on = function(eventType, listener) {
    var i, len, events, added = {};
    if (typeof eventType === "string" && eventType) {
      events = eventType.toLowerCase().split(/\s+/);
    } else if (typeof eventType === "object" && eventType && typeof listener === "undefined") {
      for (i in eventType) {
        if (_hasOwn.call(eventType, i) && typeof i === "string" && i && typeof eventType[i] === "function") {
          ZeroClipboard.on(i, eventType[i]);
        }
      }
    }
    if (events && events.length) {
      for (i = 0, len = events.length; i < len; i++) {
        eventType = events[i].replace(/^on/, "");
        added[eventType] = true;
        if (!_handlers[eventType]) {
          _handlers[eventType] = [];
        }
        _handlers[eventType].push(listener);
      }
      if (added.ready && _flashState.ready) {
        ZeroClipboard.emit({
          type: "ready"
        });
      }
      if (added.error) {
        for (i = 0, len = _flashStateErrorNames.length; i < len; i++) {
          if (_flashState[_flashStateErrorNames[i].replace(/^flash-/, "")] === true) {
            ZeroClipboard.emit({
              type: "error",
              name: _flashStateErrorNames[i]
            });
            break;
          }
        }
        if (_zcSwfVersion !== undefined && ZeroClipboard.version !== _zcSwfVersion) {
          ZeroClipboard.emit({
            type: "error",
            name: "version-mismatch",
            jsVersion: ZeroClipboard.version,
            swfVersion: _zcSwfVersion
          });
        }
      }
    }
    return ZeroClipboard;
  };
  /**
 * The underlying implementation of `ZeroClipboard.off`.
 * @private
 */
  var _off = function(eventType, listener) {
    var i, len, foundIndex, events, perEventHandlers;
    if (arguments.length === 0) {
      events = _keys(_handlers);
    } else if (typeof eventType === "string" && eventType) {
      events = eventType.split(/\s+/);
    } else if (typeof eventType === "object" && eventType && typeof listener === "undefined") {
      for (i in eventType) {
        if (_hasOwn.call(eventType, i) && typeof i === "string" && i && typeof eventType[i] === "function") {
          ZeroClipboard.off(i, eventType[i]);
        }
      }
    }
    if (events && events.length) {
      for (i = 0, len = events.length; i < len; i++) {
        eventType = events[i].toLowerCase().replace(/^on/, "");
        perEventHandlers = _handlers[eventType];
        if (perEventHandlers && perEventHandlers.length) {
          if (listener) {
            foundIndex = perEventHandlers.indexOf(listener);
            while (foundIndex !== -1) {
              perEventHandlers.splice(foundIndex, 1);
              foundIndex = perEventHandlers.indexOf(listener, foundIndex);
            }
          } else {
            perEventHandlers.length = 0;
          }
        }
      }
    }
    return ZeroClipboard;
  };
  /**
 * The underlying implementation of `ZeroClipboard.handlers`.
 * @private
 */
  var _listeners = function(eventType) {
    var copy;
    if (typeof eventType === "string" && eventType) {
      copy = _deepCopy(_handlers[eventType]) || null;
    } else {
      copy = _deepCopy(_handlers);
    }
    return copy;
  };
  /**
 * The underlying implementation of `ZeroClipboard.emit`.
 * @private
 */
  var _emit = function(event) {
    var eventCopy, returnVal, tmp;
    event = _createEvent(event);
    if (!event) {
      return;
    }
    if (_preprocessEvent(event)) {
      return;
    }
    if (event.type === "ready" && _flashState.overdue === true) {
      return ZeroClipboard.emit({
        type: "error",
        name: "flash-overdue"
      });
    }
    eventCopy = _extend({}, event);
    _dispatchCallbacks.call(this, eventCopy);
    if (event.type === "copy") {
      tmp = _mapClipDataToFlash(_clipData);
      returnVal = tmp.data;
      _clipDataFormatMap = tmp.formatMap;
    }
    return returnVal;
  };
  /**
 * The underlying implementation of `ZeroClipboard.create`.
 * @private
 */
  var _create = function() {
    var previousState = _flashState.sandboxed;
    _detectSandbox();
    if (typeof _flashState.ready !== "boolean") {
      _flashState.ready = false;
    }
    if (_flashState.sandboxed !== previousState && _flashState.sandboxed === true) {
      _flashState.ready = false;
      ZeroClipboard.emit({
        type: "error",
        name: "flash-sandboxed"
      });
    } else if (!ZeroClipboard.isFlashUnusable() && _flashState.bridge === null) {
      var maxWait = _globalConfig.flashLoadTimeout;
      if (typeof maxWait === "number" && maxWait >= 0) {
        _flashCheckTimeout = _setTimeout(function() {
          if (typeof _flashState.deactivated !== "boolean") {
            _flashState.deactivated = true;
          }
          if (_flashState.deactivated === true) {
            ZeroClipboard.emit({
              type: "error",
              name: "flash-deactivated"
            });
          }
        }, maxWait);
      }
      _flashState.overdue = false;
      _embedSwf();
    }
  };
  /**
 * The underlying implementation of `ZeroClipboard.destroy`.
 * @private
 */
  var _destroy = function() {
    ZeroClipboard.clearData();
    ZeroClipboard.blur();
    ZeroClipboard.emit("destroy");
    _unembedSwf();
    ZeroClipboard.off();
  };
  /**
 * The underlying implementation of `ZeroClipboard.setData`.
 * @private
 */
  var _setData = function(format, data) {
    var dataObj;
    if (typeof format === "object" && format && typeof data === "undefined") {
      dataObj = format;
      ZeroClipboard.clearData();
    } else if (typeof format === "string" && format) {
      dataObj = {};
      dataObj[format] = data;
    } else {
      return;
    }
    for (var dataFormat in dataObj) {
      if (typeof dataFormat === "string" && dataFormat && _hasOwn.call(dataObj, dataFormat) && typeof dataObj[dataFormat] === "string" && dataObj[dataFormat]) {
        _clipData[dataFormat] = dataObj[dataFormat];
      }
    }
  };
  /**
 * The underlying implementation of `ZeroClipboard.clearData`.
 * @private
 */
  var _clearData = function(format) {
    if (typeof format === "undefined") {
      _deleteOwnProperties(_clipData);
      _clipDataFormatMap = null;
    } else if (typeof format === "string" && _hasOwn.call(_clipData, format)) {
      delete _clipData[format];
    }
  };
  /**
 * The underlying implementation of `ZeroClipboard.getData`.
 * @private
 */
  var _getData = function(format) {
    if (typeof format === "undefined") {
      return _deepCopy(_clipData);
    } else if (typeof format === "string" && _hasOwn.call(_clipData, format)) {
      return _clipData[format];
    }
  };
  /**
 * The underlying implementation of `ZeroClipboard.focus`/`ZeroClipboard.activate`.
 * @private
 */
  var _focus = function(element) {
    if (!(element && element.nodeType === 1)) {
      return;
    }
    if (_currentElement) {
      _removeClass(_currentElement, _globalConfig.activeClass);
      if (_currentElement !== element) {
        _removeClass(_currentElement, _globalConfig.hoverClass);
      }
    }
    _currentElement = element;
    _addClass(element, _globalConfig.hoverClass);
    var newTitle = element.getAttribute("title") || _globalConfig.title;
    if (typeof newTitle === "string" && newTitle) {
      var htmlBridge = _getHtmlBridge(_flashState.bridge);
      if (htmlBridge) {
        htmlBridge.setAttribute("title", newTitle);
      }
    }
    var useHandCursor = _globalConfig.forceHandCursor === true || _getStyle(element, "cursor") === "pointer";
    _setHandCursor(useHandCursor);
    _reposition();
  };
  /**
 * The underlying implementation of `ZeroClipboard.blur`/`ZeroClipboard.deactivate`.
 * @private
 */
  var _blur = function() {
    var htmlBridge = _getHtmlBridge(_flashState.bridge);
    if (htmlBridge) {
      htmlBridge.removeAttribute("title");
      htmlBridge.style.left = "0px";
      htmlBridge.style.top = "-9999px";
      htmlBridge.style.width = "1px";
      htmlBridge.style.height = "1px";
    }
    if (_currentElement) {
      _removeClass(_currentElement, _globalConfig.hoverClass);
      _removeClass(_currentElement, _globalConfig.activeClass);
      _currentElement = null;
    }
  };
  /**
 * The underlying implementation of `ZeroClipboard.activeElement`.
 * @private
 */
  var _activeElement = function() {
    return _currentElement || null;
  };
  /**
 * Check if a value is a valid HTML4 `ID` or `Name` token.
 * @private
 */
  var _isValidHtml4Id = function(id) {
    return typeof id === "string" && id && /^[A-Za-z][A-Za-z0-9_:\-\.]*$/.test(id);
  };
  /**
 * Create or update an `event` object, based on the `eventType`.
 * @private
 */
  var _createEvent = function(event) {
    var eventType;
    if (typeof event === "string" && event) {
      eventType = event;
      event = {};
    } else if (typeof event === "object" && event && typeof event.type === "string" && event.type) {
      eventType = event.type;
    }
    if (!eventType) {
      return;
    }
    eventType = eventType.toLowerCase();
    if (!event.target && (/^(copy|aftercopy|_click)$/.test(eventType) || eventType === "error" && event.name === "clipboard-error")) {
      event.target = _copyTarget;
    }
    _extend(event, {
      type: eventType,
      target: event.target || _currentElement || null,
      relatedTarget: event.relatedTarget || null,
      currentTarget: _flashState && _flashState.bridge || null,
      timeStamp: event.timeStamp || _now() || null
    });
    var msg = _eventMessages[event.type];
    if (event.type === "error" && event.name && msg) {
      msg = msg[event.name];
    }
    if (msg) {
      event.message = msg;
    }
    if (event.type === "ready") {
      _extend(event, {
        target: null,
        version: _flashState.version
      });
    }
    if (event.type === "error") {
      if (_flashStateErrorNameMatchingRegex.test(event.name)) {
        _extend(event, {
          target: null,
          minimumVersion: _minimumFlashVersion
        });
      }
      if (_flashStateEnabledErrorNameMatchingRegex.test(event.name)) {
        _extend(event, {
          version: _flashState.version
        });
      }
    }
    if (event.type === "copy") {
      event.clipboardData = {
        setData: ZeroClipboard.setData,
        clearData: ZeroClipboard.clearData
      };
    }
    if (event.type === "aftercopy") {
      event = _mapClipResultsFromFlash(event, _clipDataFormatMap);
    }
    if (event.target && !event.relatedTarget) {
      event.relatedTarget = _getRelatedTarget(event.target);
    }
    return _addMouseData(event);
  };
  /**
 * Get a relatedTarget from the target's `data-clipboard-target` attribute
 * @private
 */
  var _getRelatedTarget = function(targetEl) {
    var relatedTargetId = targetEl && targetEl.getAttribute && targetEl.getAttribute("data-clipboard-target");
    return relatedTargetId ? _document.getElementById(relatedTargetId) : null;
  };
  /**
 * Add element and position data to `MouseEvent` instances
 * @private
 */
  var _addMouseData = function(event) {
    if (event && /^_(?:click|mouse(?:over|out|down|up|move))$/.test(event.type)) {
      var srcElement = event.target;
      var fromElement = event.type === "_mouseover" && event.relatedTarget ? event.relatedTarget : undefined;
      var toElement = event.type === "_mouseout" && event.relatedTarget ? event.relatedTarget : undefined;
      var pos = _getElementPosition(srcElement);
      var screenLeft = _window.screenLeft || _window.screenX || 0;
      var screenTop = _window.screenTop || _window.screenY || 0;
      var scrollLeft = _document.body.scrollLeft + _document.documentElement.scrollLeft;
      var scrollTop = _document.body.scrollTop + _document.documentElement.scrollTop;
      var pageX = pos.left + (typeof event._stageX === "number" ? event._stageX : 0);
      var pageY = pos.top + (typeof event._stageY === "number" ? event._stageY : 0);
      var clientX = pageX - scrollLeft;
      var clientY = pageY - scrollTop;
      var screenX = screenLeft + clientX;
      var screenY = screenTop + clientY;
      var moveX = typeof event.movementX === "number" ? event.movementX : 0;
      var moveY = typeof event.movementY === "number" ? event.movementY : 0;
      delete event._stageX;
      delete event._stageY;
      _extend(event, {
        srcElement: srcElement,
        fromElement: fromElement,
        toElement: toElement,
        screenX: screenX,
        screenY: screenY,
        pageX: pageX,
        pageY: pageY,
        clientX: clientX,
        clientY: clientY,
        x: clientX,
        y: clientY,
        movementX: moveX,
        movementY: moveY,
        offsetX: 0,
        offsetY: 0,
        layerX: 0,
        layerY: 0
      });
    }
    return event;
  };
  /**
 * Determine if an event's registered handlers should be execute synchronously or asynchronously.
 *
 * @returns {boolean}
 * @private
 */
  var _shouldPerformAsync = function(event) {
    var eventType = event && typeof event.type === "string" && event.type || "";
    return !/^(?:(?:before)?copy|destroy)$/.test(eventType);
  };
  /**
 * Control if a callback should be executed asynchronously or not.
 *
 * @returns `undefined`
 * @private
 */
  var _dispatchCallback = function(func, context, args, async) {
    if (async) {
      _setTimeout(function() {
        func.apply(context, args);
      }, 0);
    } else {
      func.apply(context, args);
    }
  };
  /**
 * Handle the actual dispatching of events to client instances.
 *
 * @returns `undefined`
 * @private
 */
  var _dispatchCallbacks = function(event) {
    if (!(typeof event === "object" && event && event.type)) {
      return;
    }
    var async = _shouldPerformAsync(event);
    var wildcardTypeHandlers = _handlers["*"] || [];
    var specificTypeHandlers = _handlers[event.type] || [];
    var handlers = wildcardTypeHandlers.concat(specificTypeHandlers);
    if (handlers && handlers.length) {
      var i, len, func, context, eventCopy, originalContext = this;
      for (i = 0, len = handlers.length; i < len; i++) {
        func = handlers[i];
        context = originalContext;
        if (typeof func === "string" && typeof _window[func] === "function") {
          func = _window[func];
        }
        if (typeof func === "object" && func && typeof func.handleEvent === "function") {
          context = func;
          func = func.handleEvent;
        }
        if (typeof func === "function") {
          eventCopy = _extend({}, event);
          _dispatchCallback(func, context, [ eventCopy ], async);
        }
      }
    }
    return this;
  };
  /**
 * Check an `error` event's `name` property to see if Flash has
 * already loaded, which rules out possible `iframe` sandboxing.
 * @private
 */
  var _getSandboxStatusFromErrorEvent = function(event) {
    var isSandboxed = null;
    if (_pageIsFramed === false || event && event.type === "error" && event.name && _errorsThatOnlyOccurAfterFlashLoads.indexOf(event.name) !== -1) {
      isSandboxed = false;
    }
    return isSandboxed;
  };
  /**
 * Preprocess any special behaviors, reactions, or state changes after receiving this event.
 * Executes only once per event emitted, NOT once per client.
 * @private
 */
  var _preprocessEvent = function(event) {
    var element = event.target || _currentElement || null;
    var sourceIsSwf = event._source === "swf";
    delete event._source;
    switch (event.type) {
     case "error":
      var isSandboxed = event.name === "flash-sandboxed" || _getSandboxStatusFromErrorEvent(event);
      if (typeof isSandboxed === "boolean") {
        _flashState.sandboxed = isSandboxed;
      }
      if (_flashStateErrorNames.indexOf(event.name) !== -1) {
        _extend(_flashState, {
          disabled: event.name === "flash-disabled",
          outdated: event.name === "flash-outdated",
          unavailable: event.name === "flash-unavailable",
          degraded: event.name === "flash-degraded",
          deactivated: event.name === "flash-deactivated",
          overdue: event.name === "flash-overdue",
          ready: false
        });
      } else if (event.name === "version-mismatch") {
        _zcSwfVersion = event.swfVersion;
        _extend(_flashState, {
          disabled: false,
          outdated: false,
          unavailable: false,
          degraded: false,
          deactivated: false,
          overdue: false,
          ready: false
        });
      }
      _clearTimeoutsAndPolling();
      break;

     case "ready":
      _zcSwfVersion = event.swfVersion;
      var wasDeactivated = _flashState.deactivated === true;
      _extend(_flashState, {
        disabled: false,
        outdated: false,
        sandboxed: false,
        unavailable: false,
        degraded: false,
        deactivated: false,
        overdue: wasDeactivated,
        ready: !wasDeactivated
      });
      _clearTimeoutsAndPolling();
      break;

     case "beforecopy":
      _copyTarget = element;
      break;

     case "copy":
      var textContent, htmlContent, targetEl = event.relatedTarget;
      if (!(_clipData["text/html"] || _clipData["text/plain"]) && targetEl && (htmlContent = targetEl.value || targetEl.outerHTML || targetEl.innerHTML) && (textContent = targetEl.value || targetEl.textContent || targetEl.innerText)) {
        event.clipboardData.clearData();
        event.clipboardData.setData("text/plain", textContent);
        if (htmlContent !== textContent) {
          event.clipboardData.setData("text/html", htmlContent);
        }
      } else if (!_clipData["text/plain"] && event.target && (textContent = event.target.getAttribute("data-clipboard-text"))) {
        event.clipboardData.clearData();
        event.clipboardData.setData("text/plain", textContent);
      }
      break;

     case "aftercopy":
      _queueEmitClipboardErrors(event);
      ZeroClipboard.clearData();
      if (element && element !== _safeActiveElement() && element.focus) {
        element.focus();
      }
      break;

     case "_mouseover":
      ZeroClipboard.focus(element);
      if (_globalConfig.bubbleEvents === true && sourceIsSwf) {
        if (element && element !== event.relatedTarget && !_containedBy(event.relatedTarget, element)) {
          _fireMouseEvent(_extend({}, event, {
            type: "mouseenter",
            bubbles: false,
            cancelable: false
          }));
        }
        _fireMouseEvent(_extend({}, event, {
          type: "mouseover"
        }));
      }
      break;

     case "_mouseout":
      ZeroClipboard.blur();
      if (_globalConfig.bubbleEvents === true && sourceIsSwf) {
        if (element && element !== event.relatedTarget && !_containedBy(event.relatedTarget, element)) {
          _fireMouseEvent(_extend({}, event, {
            type: "mouseleave",
            bubbles: false,
            cancelable: false
          }));
        }
        _fireMouseEvent(_extend({}, event, {
          type: "mouseout"
        }));
      }
      break;

     case "_mousedown":
      _addClass(element, _globalConfig.activeClass);
      if (_globalConfig.bubbleEvents === true && sourceIsSwf) {
        _fireMouseEvent(_extend({}, event, {
          type: event.type.slice(1)
        }));
      }
      break;

     case "_mouseup":
      _removeClass(element, _globalConfig.activeClass);
      if (_globalConfig.bubbleEvents === true && sourceIsSwf) {
        _fireMouseEvent(_extend({}, event, {
          type: event.type.slice(1)
        }));
      }
      break;

     case "_click":
      _copyTarget = null;
      if (_globalConfig.bubbleEvents === true && sourceIsSwf) {
        _fireMouseEvent(_extend({}, event, {
          type: event.type.slice(1)
        }));
      }
      break;

     case "_mousemove":
      if (_globalConfig.bubbleEvents === true && sourceIsSwf) {
        _fireMouseEvent(_extend({}, event, {
          type: event.type.slice(1)
        }));
      }
      break;
    }
    if (/^_(?:click|mouse(?:over|out|down|up|move))$/.test(event.type)) {
      return true;
    }
  };
  /**
 * Check an "aftercopy" event for clipboard errors and emit a corresponding "error" event.
 * @private
 */
  var _queueEmitClipboardErrors = function(aftercopyEvent) {
    if (aftercopyEvent.errors && aftercopyEvent.errors.length > 0) {
      var errorEvent = _deepCopy(aftercopyEvent);
      _extend(errorEvent, {
        type: "error",
        name: "clipboard-error"
      });
      delete errorEvent.success;
      _setTimeout(function() {
        ZeroClipboard.emit(errorEvent);
      }, 0);
    }
  };
  /**
 * Dispatch a synthetic MouseEvent.
 *
 * @returns `undefined`
 * @private
 */
  var _fireMouseEvent = function(event) {
    if (!(event && typeof event.type === "string" && event)) {
      return;
    }
    var e, target = event.target || null, doc = target && target.ownerDocument || _document, defaults = {
      view: doc.defaultView || _window,
      canBubble: true,
      cancelable: true,
      detail: event.type === "click" ? 1 : 0,
      button: typeof event.which === "number" ? event.which - 1 : typeof event.button === "number" ? event.button : doc.createEvent ? 0 : 1
    }, args = _extend(defaults, event);
    if (!target) {
      return;
    }
    if (doc.createEvent && target.dispatchEvent) {
      args = [ args.type, args.canBubble, args.cancelable, args.view, args.detail, args.screenX, args.screenY, args.clientX, args.clientY, args.ctrlKey, args.altKey, args.shiftKey, args.metaKey, args.button, args.relatedTarget ];
      e = doc.createEvent("MouseEvents");
      if (e.initMouseEvent) {
        e.initMouseEvent.apply(e, args);
        e._source = "js";
        target.dispatchEvent(e);
      }
    }
  };
  /**
 * Continuously poll the DOM until either:
 *  (a) the fallback content becomes visible, or
 *  (b) we receive an event from SWF (handled elsewhere)
 *
 * IMPORTANT:
 * This is NOT a necessary check but it can result in significantly faster
 * detection of bad `swfPath` configuration and/or network/server issues [in
 * supported browsers] than waiting for the entire `flashLoadTimeout` duration
 * to elapse before detecting that the SWF cannot be loaded. The detection
 * duration can be anywhere from 10-30 times faster [in supported browsers] by
 * using this approach.
 *
 * @returns `undefined`
 * @private
 */
  var _watchForSwfFallbackContent = function() {
    var maxWait = _globalConfig.flashLoadTimeout;
    if (typeof maxWait === "number" && maxWait >= 0) {
      var pollWait = Math.min(1e3, maxWait / 10);
      var fallbackContentId = _globalConfig.swfObjectId + "_fallbackContent";
      _swfFallbackCheckInterval = _setInterval(function() {
        var el = _document.getElementById(fallbackContentId);
        if (_isElementVisible(el)) {
          _clearTimeoutsAndPolling();
          _flashState.deactivated = null;
          ZeroClipboard.emit({
            type: "error",
            name: "swf-not-found"
          });
        }
      }, pollWait);
    }
  };
  /**
 * Create the HTML bridge element to embed the Flash object into.
 * @private
 */
  var _createHtmlBridge = function() {
    var container = _document.createElement("div");
    container.id = _globalConfig.containerId;
    container.className = _globalConfig.containerClass;
    container.style.position = "absolute";
    container.style.left = "0px";
    container.style.top = "-9999px";
    container.style.width = "1px";
    container.style.height = "1px";
    container.style.zIndex = "" + _getSafeZIndex(_globalConfig.zIndex);
    return container;
  };
  /**
 * Get the HTML element container that wraps the Flash bridge object/element.
 * @private
 */
  var _getHtmlBridge = function(flashBridge) {
    var htmlBridge = flashBridge && flashBridge.parentNode;
    while (htmlBridge && htmlBridge.nodeName === "OBJECT" && htmlBridge.parentNode) {
      htmlBridge = htmlBridge.parentNode;
    }
    return htmlBridge || null;
  };
  /**
 * Create the SWF object.
 *
 * @returns The SWF object reference.
 * @private
 */
  var _embedSwf = function() {
    var len, flashBridge = _flashState.bridge, container = _getHtmlBridge(flashBridge);
    if (!flashBridge) {
      var allowScriptAccess = _determineScriptAccess(_window.location.host, _globalConfig);
      var allowNetworking = allowScriptAccess === "never" ? "none" : "all";
      var flashvars = _vars(_extend({
        jsVersion: ZeroClipboard.version
      }, _globalConfig));
      var swfUrl = _globalConfig.swfPath + _cacheBust(_globalConfig.swfPath, _globalConfig);
      container = _createHtmlBridge();
      var divToBeReplaced = _document.createElement("div");
      container.appendChild(divToBeReplaced);
      _document.body.appendChild(container);
      var tmpDiv = _document.createElement("div");
      var usingActiveX = _flashState.pluginType === "activex";
      tmpDiv.innerHTML = '<object id="' + _globalConfig.swfObjectId + '" name="' + _globalConfig.swfObjectId + '" ' + 'width="100%" height="100%" ' + (usingActiveX ? 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"' : 'type="application/x-shockwave-flash" data="' + swfUrl + '"') + ">" + (usingActiveX ? '<param name="movie" value="' + swfUrl + '"/>' : "") + '<param name="allowScriptAccess" value="' + allowScriptAccess + '"/>' + '<param name="allowNetworking" value="' + allowNetworking + '"/>' + '<param name="menu" value="false"/>' + '<param name="wmode" value="transparent"/>' + '<param name="flashvars" value="' + flashvars + '"/>' + '<div id="' + _globalConfig.swfObjectId + '_fallbackContent">&nbsp;</div>' + "</object>";
      flashBridge = tmpDiv.firstChild;
      tmpDiv = null;
      _unwrap(flashBridge).ZeroClipboard = ZeroClipboard;
      container.replaceChild(flashBridge, divToBeReplaced);
      _watchForSwfFallbackContent();
    }
    if (!flashBridge) {
      flashBridge = _document[_globalConfig.swfObjectId];
      if (flashBridge && (len = flashBridge.length)) {
        flashBridge = flashBridge[len - 1];
      }
      if (!flashBridge && container) {
        flashBridge = container.firstChild;
      }
    }
    _flashState.bridge = flashBridge || null;
    return flashBridge;
  };
  /**
 * Destroy the SWF object.
 * @private
 */
  var _unembedSwf = function() {
    var flashBridge = _flashState.bridge;
    if (flashBridge) {
      var htmlBridge = _getHtmlBridge(flashBridge);
      if (htmlBridge) {
        if (_flashState.pluginType === "activex" && "readyState" in flashBridge) {
          flashBridge.style.display = "none";
          (function removeSwfFromIE() {
            if (flashBridge.readyState === 4) {
              for (var prop in flashBridge) {
                if (typeof flashBridge[prop] === "function") {
                  flashBridge[prop] = null;
                }
              }
              if (flashBridge.parentNode) {
                flashBridge.parentNode.removeChild(flashBridge);
              }
              if (htmlBridge.parentNode) {
                htmlBridge.parentNode.removeChild(htmlBridge);
              }
            } else {
              _setTimeout(removeSwfFromIE, 10);
            }
          })();
        } else {
          if (flashBridge.parentNode) {
            flashBridge.parentNode.removeChild(flashBridge);
          }
          if (htmlBridge.parentNode) {
            htmlBridge.parentNode.removeChild(htmlBridge);
          }
        }
      }
      _clearTimeoutsAndPolling();
      _flashState.ready = null;
      _flashState.bridge = null;
      _flashState.deactivated = null;
      _zcSwfVersion = undefined;
    }
  };
  /**
 * Map the data format names of the "clipData" to Flash-friendly names.
 *
 * @returns A new transformed object.
 * @private
 */
  var _mapClipDataToFlash = function(clipData) {
    var newClipData = {}, formatMap = {};
    if (!(typeof clipData === "object" && clipData)) {
      return;
    }
    for (var dataFormat in clipData) {
      if (dataFormat && _hasOwn.call(clipData, dataFormat) && typeof clipData[dataFormat] === "string" && clipData[dataFormat]) {
        switch (dataFormat.toLowerCase()) {
         case "text/plain":
         case "text":
         case "air:text":
         case "flash:text":
          newClipData.text = clipData[dataFormat];
          formatMap.text = dataFormat;
          break;

         case "text/html":
         case "html":
         case "air:html":
         case "flash:html":
          newClipData.html = clipData[dataFormat];
          formatMap.html = dataFormat;
          break;

         case "application/rtf":
         case "text/rtf":
         case "rtf":
         case "richtext":
         case "air:rtf":
         case "flash:rtf":
          newClipData.rtf = clipData[dataFormat];
          formatMap.rtf = dataFormat;
          break;

         default:
          break;
        }
      }
    }
    return {
      data: newClipData,
      formatMap: formatMap
    };
  };
  /**
 * Map the data format names from Flash-friendly names back to their original "clipData" names (via a format mapping).
 *
 * @returns A new transformed object.
 * @private
 */
  var _mapClipResultsFromFlash = function(clipResults, formatMap) {
    if (!(typeof clipResults === "object" && clipResults && typeof formatMap === "object" && formatMap)) {
      return clipResults;
    }
    var newResults = {};
    for (var prop in clipResults) {
      if (_hasOwn.call(clipResults, prop)) {
        if (prop === "errors") {
          newResults[prop] = clipResults[prop] ? clipResults[prop].slice() : [];
          for (var i = 0, len = newResults[prop].length; i < len; i++) {
            newResults[prop][i].format = formatMap[newResults[prop][i].format];
          }
        } else if (prop !== "success" && prop !== "data") {
          newResults[prop] = clipResults[prop];
        } else {
          newResults[prop] = {};
          var tmpHash = clipResults[prop];
          for (var dataFormat in tmpHash) {
            if (dataFormat && _hasOwn.call(tmpHash, dataFormat) && _hasOwn.call(formatMap, dataFormat)) {
              newResults[prop][formatMap[dataFormat]] = tmpHash[dataFormat];
            }
          }
        }
      }
    }
    return newResults;
  };
  /**
 * Will look at a path, and will create a "?noCache={time}" or "&noCache={time}"
 * query param string to return. Does NOT append that string to the original path.
 * This is useful because ExternalInterface often breaks when a Flash SWF is cached.
 *
 * @returns The `noCache` query param with necessary "?"/"&" prefix.
 * @private
 */
  var _cacheBust = function(path, options) {
    var cacheBust = options == null || options && options.cacheBust === true;
    if (cacheBust) {
      return (path.indexOf("?") === -1 ? "?" : "&") + "noCache=" + _now();
    } else {
      return "";
    }
  };
  /**
 * Creates a query string for the FlashVars param.
 * Does NOT include the cache-busting query param.
 *
 * @returns FlashVars query string
 * @private
 */
  var _vars = function(options) {
    var i, len, domain, domains, str = "", trustedOriginsExpanded = [];
    if (options.trustedDomains) {
      if (typeof options.trustedDomains === "string") {
        domains = [ options.trustedDomains ];
      } else if (typeof options.trustedDomains === "object" && "length" in options.trustedDomains) {
        domains = options.trustedDomains;
      }
    }
    if (domains && domains.length) {
      for (i = 0, len = domains.length; i < len; i++) {
        if (_hasOwn.call(domains, i) && domains[i] && typeof domains[i] === "string") {
          domain = _extractDomain(domains[i]);
          if (!domain) {
            continue;
          }
          if (domain === "*") {
            trustedOriginsExpanded.length = 0;
            trustedOriginsExpanded.push(domain);
            break;
          }
          trustedOriginsExpanded.push.apply(trustedOriginsExpanded, [ domain, "//" + domain, _window.location.protocol + "//" + domain ]);
        }
      }
    }
    if (trustedOriginsExpanded.length) {
      str += "trustedOrigins=" + _encodeURIComponent(trustedOriginsExpanded.join(","));
    }
    if (options.forceEnhancedClipboard === true) {
      str += (str ? "&" : "") + "forceEnhancedClipboard=true";
    }
    if (typeof options.swfObjectId === "string" && options.swfObjectId) {
      str += (str ? "&" : "") + "swfObjectId=" + _encodeURIComponent(options.swfObjectId);
    }
    if (typeof options.jsVersion === "string" && options.jsVersion) {
      str += (str ? "&" : "") + "jsVersion=" + _encodeURIComponent(options.jsVersion);
    }
    return str;
  };
  /**
 * Extract the domain (e.g. "github.com") from an origin (e.g. "https://github.com") or
 * URL (e.g. "https://github.com/zeroclipboard/zeroclipboard/").
 *
 * @returns the domain
 * @private
 */
  var _extractDomain = function(originOrUrl) {
    if (originOrUrl == null || originOrUrl === "") {
      return null;
    }
    originOrUrl = originOrUrl.replace(/^\s+|\s+$/g, "");
    if (originOrUrl === "") {
      return null;
    }
    var protocolIndex = originOrUrl.indexOf("//");
    originOrUrl = protocolIndex === -1 ? originOrUrl : originOrUrl.slice(protocolIndex + 2);
    var pathIndex = originOrUrl.indexOf("/");
    originOrUrl = pathIndex === -1 ? originOrUrl : protocolIndex === -1 || pathIndex === 0 ? null : originOrUrl.slice(0, pathIndex);
    if (originOrUrl && originOrUrl.slice(-4).toLowerCase() === ".swf") {
      return null;
    }
    return originOrUrl || null;
  };
  /**
 * Set `allowScriptAccess` based on `trustedDomains` and `window.location.host` vs. `swfPath`.
 *
 * @returns The appropriate script access level.
 * @private
 */
  var _determineScriptAccess = function() {
    var _extractAllDomains = function(origins) {
      var i, len, tmp, resultsArray = [];
      if (typeof origins === "string") {
        origins = [ origins ];
      }
      if (!(typeof origins === "object" && origins && typeof origins.length === "number")) {
        return resultsArray;
      }
      for (i = 0, len = origins.length; i < len; i++) {
        if (_hasOwn.call(origins, i) && (tmp = _extractDomain(origins[i]))) {
          if (tmp === "*") {
            resultsArray.length = 0;
            resultsArray.push("*");
            break;
          }
          if (resultsArray.indexOf(tmp) === -1) {
            resultsArray.push(tmp);
          }
        }
      }
      return resultsArray;
    };
    return function(currentDomain, configOptions) {
      var swfDomain = _extractDomain(configOptions.swfPath);
      if (swfDomain === null) {
        swfDomain = currentDomain;
      }
      var trustedDomains = _extractAllDomains(configOptions.trustedDomains);
      var len = trustedDomains.length;
      if (len > 0) {
        if (len === 1 && trustedDomains[0] === "*") {
          return "always";
        }
        if (trustedDomains.indexOf(currentDomain) !== -1) {
          if (len === 1 && currentDomain === swfDomain) {
            return "sameDomain";
          }
          return "always";
        }
      }
      return "never";
    };
  }();
  /**
 * Get the currently active/focused DOM element.
 *
 * @returns the currently active/focused element, or `null`
 * @private
 */
  var _safeActiveElement = function() {
    try {
      return _document.activeElement;
    } catch (err) {
      return null;
    }
  };
  /**
 * Add a class to an element, if it doesn't already have it.
 *
 * @returns The element, with its new class added.
 * @private
 */
  var _addClass = function(element, value) {
    var c, cl, className, classNames = [];
    if (typeof value === "string" && value) {
      classNames = value.split(/\s+/);
    }
    if (element && element.nodeType === 1 && classNames.length > 0) {
      if (element.classList) {
        for (c = 0, cl = classNames.length; c < cl; c++) {
          element.classList.add(classNames[c]);
        }
      } else if (element.hasOwnProperty("className")) {
        className = " " + element.className + " ";
        for (c = 0, cl = classNames.length; c < cl; c++) {
          if (className.indexOf(" " + classNames[c] + " ") === -1) {
            className += classNames[c] + " ";
          }
        }
        element.className = className.replace(/^\s+|\s+$/g, "");
      }
    }
    return element;
  };
  /**
 * Remove a class from an element, if it has it.
 *
 * @returns The element, with its class removed.
 * @private
 */
  var _removeClass = function(element, value) {
    var c, cl, className, classNames = [];
    if (typeof value === "string" && value) {
      classNames = value.split(/\s+/);
    }
    if (element && element.nodeType === 1 && classNames.length > 0) {
      if (element.classList && element.classList.length > 0) {
        for (c = 0, cl = classNames.length; c < cl; c++) {
          element.classList.remove(classNames[c]);
        }
      } else if (element.className) {
        className = (" " + element.className + " ").replace(/[\r\n\t]/g, " ");
        for (c = 0, cl = classNames.length; c < cl; c++) {
          className = className.replace(" " + classNames[c] + " ", " ");
        }
        element.className = className.replace(/^\s+|\s+$/g, "");
      }
    }
    return element;
  };
  /**
 * Attempt to interpret the element's CSS styling. If `prop` is `"cursor"`,
 * then we assume that it should be a hand ("pointer") cursor if the element
 * is an anchor element ("a" tag).
 *
 * @returns The computed style property.
 * @private
 */
  var _getStyle = function(el, prop) {
    var value = _getComputedStyle(el, null).getPropertyValue(prop);
    if (prop === "cursor") {
      if (!value || value === "auto") {
        if (el.nodeName === "A") {
          return "pointer";
        }
      }
    }
    return value;
  };
  /**
 * Get the absolutely positioned coordinates of a DOM element.
 *
 * @returns Object containing the element's position, width, and height.
 * @private
 */
  var _getElementPosition = function(el) {
    var pos = {
      left: 0,
      top: 0,
      width: 0,
      height: 0
    };
    if (el.getBoundingClientRect) {
      var elRect = el.getBoundingClientRect();
      var pageXOffset = _window.pageXOffset;
      var pageYOffset = _window.pageYOffset;
      var leftBorderWidth = _document.documentElement.clientLeft || 0;
      var topBorderWidth = _document.documentElement.clientTop || 0;
      var leftBodyOffset = 0;
      var topBodyOffset = 0;
      if (_getStyle(_document.body, "position") === "relative") {
        var bodyRect = _document.body.getBoundingClientRect();
        var htmlRect = _document.documentElement.getBoundingClientRect();
        leftBodyOffset = bodyRect.left - htmlRect.left || 0;
        topBodyOffset = bodyRect.top - htmlRect.top || 0;
      }
      pos.left = elRect.left + pageXOffset - leftBorderWidth - leftBodyOffset;
      pos.top = elRect.top + pageYOffset - topBorderWidth - topBodyOffset;
      pos.width = "width" in elRect ? elRect.width : elRect.right - elRect.left;
      pos.height = "height" in elRect ? elRect.height : elRect.bottom - elRect.top;
    }
    return pos;
  };
  /**
 * Determine is an element is visible somewhere within the document (page).
 *
 * @returns Boolean
 * @private
 */
  var _isElementVisible = function(el) {
    if (!el) {
      return false;
    }
    var styles = _getComputedStyle(el, null);
    var hasCssHeight = _parseFloat(styles.height) > 0;
    var hasCssWidth = _parseFloat(styles.width) > 0;
    var hasCssTop = _parseFloat(styles.top) >= 0;
    var hasCssLeft = _parseFloat(styles.left) >= 0;
    var cssKnows = hasCssHeight && hasCssWidth && hasCssTop && hasCssLeft;
    var rect = cssKnows ? null : _getElementPosition(el);
    var isVisible = styles.display !== "none" && styles.visibility !== "collapse" && (cssKnows || !!rect && (hasCssHeight || rect.height > 0) && (hasCssWidth || rect.width > 0) && (hasCssTop || rect.top >= 0) && (hasCssLeft || rect.left >= 0));
    return isVisible;
  };
  /**
 * Clear all existing timeouts and interval polling delegates.
 *
 * @returns `undefined`
 * @private
 */
  var _clearTimeoutsAndPolling = function() {
    _clearTimeout(_flashCheckTimeout);
    _flashCheckTimeout = 0;
    _clearInterval(_swfFallbackCheckInterval);
    _swfFallbackCheckInterval = 0;
  };
  /**
 * Reposition the Flash object to cover the currently activated element.
 *
 * @returns `undefined`
 * @private
 */
  var _reposition = function() {
    var htmlBridge;
    if (_currentElement && (htmlBridge = _getHtmlBridge(_flashState.bridge))) {
      var pos = _getElementPosition(_currentElement);
      _extend(htmlBridge.style, {
        width: pos.width + "px",
        height: pos.height + "px",
        top: pos.top + "px",
        left: pos.left + "px",
        zIndex: "" + _getSafeZIndex(_globalConfig.zIndex)
      });
    }
  };
  /**
 * Sends a signal to the Flash object to display the hand cursor if `true`.
 *
 * @returns `undefined`
 * @private
 */
  var _setHandCursor = function(enabled) {
    if (_flashState.ready === true) {
      if (_flashState.bridge && typeof _flashState.bridge.setHandCursor === "function") {
        _flashState.bridge.setHandCursor(enabled);
      } else {
        _flashState.ready = false;
      }
    }
  };
  /**
 * Get a safe value for `zIndex`
 *
 * @returns an integer, or "auto"
 * @private
 */
  var _getSafeZIndex = function(val) {
    if (/^(?:auto|inherit)$/.test(val)) {
      return val;
    }
    var zIndex;
    if (typeof val === "number" && !_isNaN(val)) {
      zIndex = val;
    } else if (typeof val === "string") {
      zIndex = _getSafeZIndex(_parseInt(val, 10));
    }
    return typeof zIndex === "number" ? zIndex : "auto";
  };
  /**
 * Attempt to detect if ZeroClipboard is executing inside of a sandboxed iframe.
 * If it is, Flash Player cannot be used, so ZeroClipboard is dead in the water.
 *
 * @see {@link http://lists.w3.org/Archives/Public/public-whatwg-archive/2014Dec/0002.html}
 * @see {@link https://github.com/zeroclipboard/zeroclipboard/issues/511}
 * @see {@link http://zeroclipboard.org/test-iframes.html}
 *
 * @returns `true` (is sandboxed), `false` (is not sandboxed), or `null` (uncertain) 
 * @private
 */
  var _detectSandbox = function(doNotReassessFlashSupport) {
    var effectiveScriptOrigin, frame, frameError, previousState = _flashState.sandboxed, isSandboxed = null;
    doNotReassessFlashSupport = doNotReassessFlashSupport === true;
    if (_pageIsFramed === false) {
      isSandboxed = false;
    } else {
      try {
        frame = window.frameElement || null;
      } catch (e) {
        frameError = {
          name: e.name,
          message: e.message
        };
      }
      if (frame && frame.nodeType === 1 && frame.nodeName === "IFRAME") {
        try {
          isSandboxed = frame.hasAttribute("sandbox");
        } catch (e) {
          isSandboxed = null;
        }
      } else {
        try {
          effectiveScriptOrigin = document.domain || null;
        } catch (e) {
          effectiveScriptOrigin = null;
        }
        if (effectiveScriptOrigin === null || frameError && frameError.name === "SecurityError" && /(^|[\s\(\[@])sandbox(es|ed|ing|[\s\.,!\)\]@]|$)/.test(frameError.message.toLowerCase())) {
          isSandboxed = true;
        }
      }
    }
    _flashState.sandboxed = isSandboxed;
    if (previousState !== isSandboxed && !doNotReassessFlashSupport) {
      _detectFlashSupport(_ActiveXObject);
    }
    return isSandboxed;
  };
  /**
 * Detect the Flash Player status, version, and plugin type.
 *
 * @see {@link https://code.google.com/p/doctype-mirror/wiki/ArticleDetectFlash#The_code}
 * @see {@link http://stackoverflow.com/questions/12866060/detecting-pepper-ppapi-flash-with-javascript}
 *
 * @returns `undefined`
 * @private
 */
  var _detectFlashSupport = function(ActiveXObject) {
    var plugin, ax, mimeType, hasFlash = false, isActiveX = false, isPPAPI = false, flashVersion = "";
    /**
   * Derived from Apple's suggested sniffer.
   * @param {String} desc e.g. "Shockwave Flash 7.0 r61"
   * @returns {String} "7.0.61"
   * @private
   */
    function parseFlashVersion(desc) {
      var matches = desc.match(/[\d]+/g);
      matches.length = 3;
      return matches.join(".");
    }
    function isPepperFlash(flashPlayerFileName) {
      return !!flashPlayerFileName && (flashPlayerFileName = flashPlayerFileName.toLowerCase()) && (/^(pepflashplayer\.dll|libpepflashplayer\.so|pepperflashplayer\.plugin)$/.test(flashPlayerFileName) || flashPlayerFileName.slice(-13) === "chrome.plugin");
    }
    function inspectPlugin(plugin) {
      if (plugin) {
        hasFlash = true;
        if (plugin.version) {
          flashVersion = parseFlashVersion(plugin.version);
        }
        if (!flashVersion && plugin.description) {
          flashVersion = parseFlashVersion(plugin.description);
        }
        if (plugin.filename) {
          isPPAPI = isPepperFlash(plugin.filename);
        }
      }
    }
    if (_navigator.plugins && _navigator.plugins.length) {
      plugin = _navigator.plugins["Shockwave Flash"];
      inspectPlugin(plugin);
      if (_navigator.plugins["Shockwave Flash 2.0"]) {
        hasFlash = true;
        flashVersion = "2.0.0.11";
      }
    } else if (_navigator.mimeTypes && _navigator.mimeTypes.length) {
      mimeType = _navigator.mimeTypes["application/x-shockwave-flash"];
      plugin = mimeType && mimeType.enabledPlugin;
      inspectPlugin(plugin);
    } else if (typeof ActiveXObject !== "undefined") {
      isActiveX = true;
      try {
        ax = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
        hasFlash = true;
        flashVersion = parseFlashVersion(ax.GetVariable("$version"));
      } catch (e1) {
        try {
          ax = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
          hasFlash = true;
          flashVersion = "6.0.21";
        } catch (e2) {
          try {
            ax = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
            hasFlash = true;
            flashVersion = parseFlashVersion(ax.GetVariable("$version"));
          } catch (e3) {
            isActiveX = false;
          }
        }
      }
    }
    _flashState.disabled = hasFlash !== true;
    _flashState.outdated = flashVersion && _parseFloat(flashVersion) < _parseFloat(_minimumFlashVersion);
    _flashState.version = flashVersion || "0.0.0";
    _flashState.pluginType = isPPAPI ? "pepper" : isActiveX ? "activex" : hasFlash ? "netscape" : "unknown";
  };
  /** Invoke the Flash detection algorithms immediately upon inclusion so we're not waiting later. */
  _detectFlashSupport(_ActiveXObject);
  /** Always assess the `sandboxed` state of the page at important Flash-related moments. */
  _detectSandbox(true);
  /**
 * A shell constructor for `ZeroClipboard` client instances.
 *
 * @constructor
 */
  var ZeroClipboard = function() {
    if (!(this instanceof ZeroClipboard)) {
      return new ZeroClipboard();
    }
    if (typeof ZeroClipboard._createClient === "function") {
      ZeroClipboard._createClient.apply(this, _args(arguments));
    }
  };
  /**
 * The ZeroClipboard library's version number.
 *
 * @static
 * @readonly
 * @property {string}
 */
  _defineProperty(ZeroClipboard, "version", {
    value: "2.2.0",
    writable: false,
    configurable: true,
    enumerable: true
  });
  /**
 * Update or get a copy of the ZeroClipboard global configuration.
 * Returns a copy of the current/updated configuration.
 *
 * @returns Object
 * @static
 */
  ZeroClipboard.config = function() {
    return _config.apply(this, _args(arguments));
  };
  /**
 * Diagnostic method that describes the state of the browser, Flash Player, and ZeroClipboard.
 *
 * @returns Object
 * @static
 */
  ZeroClipboard.state = function() {
    return _state.apply(this, _args(arguments));
  };
  /**
 * Check if Flash is unusable for any reason: disabled, outdated, deactivated, etc.
 *
 * @returns Boolean
 * @static
 */
  ZeroClipboard.isFlashUnusable = function() {
    return _isFlashUnusable.apply(this, _args(arguments));
  };
  /**
 * Register an event listener.
 *
 * @returns `ZeroClipboard`
 * @static
 */
  ZeroClipboard.on = function() {
    return _on.apply(this, _args(arguments));
  };
  /**
 * Unregister an event listener.
 * If no `listener` function/object is provided, it will unregister all listeners for the provided `eventType`.
 * If no `eventType` is provided, it will unregister all listeners for every event type.
 *
 * @returns `ZeroClipboard`
 * @static
 */
  ZeroClipboard.off = function() {
    return _off.apply(this, _args(arguments));
  };
  /**
 * Retrieve event listeners for an `eventType`.
 * If no `eventType` is provided, it will retrieve all listeners for every event type.
 *
 * @returns array of listeners for the `eventType`; if no `eventType`, then a map/hash object of listeners for all event types; or `null`
 */
  ZeroClipboard.handlers = function() {
    return _listeners.apply(this, _args(arguments));
  };
  /**
 * Event emission receiver from the Flash object, forwarding to any registered JavaScript event listeners.
 *
 * @returns For the "copy" event, returns the Flash-friendly "clipData" object; otherwise `undefined`.
 * @static
 */
  ZeroClipboard.emit = function() {
    return _emit.apply(this, _args(arguments));
  };
  /**
 * Create and embed the Flash object.
 *
 * @returns The Flash object
 * @static
 */
  ZeroClipboard.create = function() {
    return _create.apply(this, _args(arguments));
  };
  /**
 * Self-destruct and clean up everything, including the embedded Flash object.
 *
 * @returns `undefined`
 * @static
 */
  ZeroClipboard.destroy = function() {
    return _destroy.apply(this, _args(arguments));
  };
  /**
 * Set the pending data for clipboard injection.
 *
 * @returns `undefined`
 * @static
 */
  ZeroClipboard.setData = function() {
    return _setData.apply(this, _args(arguments));
  };
  /**
 * Clear the pending data for clipboard injection.
 * If no `format` is provided, all pending data formats will be cleared.
 *
 * @returns `undefined`
 * @static
 */
  ZeroClipboard.clearData = function() {
    return _clearData.apply(this, _args(arguments));
  };
  /**
 * Get a copy of the pending data for clipboard injection.
 * If no `format` is provided, a copy of ALL pending data formats will be returned.
 *
 * @returns `String` or `Object`
 * @static
 */
  ZeroClipboard.getData = function() {
    return _getData.apply(this, _args(arguments));
  };
  /**
 * Sets the current HTML object that the Flash object should overlay. This will put the global
 * Flash object on top of the current element; depending on the setup, this may also set the
 * pending clipboard text data as well as the Flash object's wrapping element's title attribute
 * based on the underlying HTML element and ZeroClipboard configuration.
 *
 * @returns `undefined`
 * @static
 */
  ZeroClipboard.focus = ZeroClipboard.activate = function() {
    return _focus.apply(this, _args(arguments));
  };
  /**
 * Un-overlays the Flash object. This will put the global Flash object off-screen; depending on
 * the setup, this may also unset the Flash object's wrapping element's title attribute based on
 * the underlying HTML element and ZeroClipboard configuration.
 *
 * @returns `undefined`
 * @static
 */
  ZeroClipboard.blur = ZeroClipboard.deactivate = function() {
    return _blur.apply(this, _args(arguments));
  };
  /**
 * Returns the currently focused/"activated" HTML element that the Flash object is wrapping.
 *
 * @returns `HTMLElement` or `null`
 * @static
 */
  ZeroClipboard.activeElement = function() {
    return _activeElement.apply(this, _args(arguments));
  };
  /** Keep track of the ZeroClipboard client instance counter. */
  var _clientIdCounter = 0;
  /**
 * Keep track of the state of the client instances.
 *
 * Entry structure:
 *   _clientMeta[client.id] = {
 *     instance: client,
 *     elements: [],
 *     handlers: {}
 *   };
 */
  var _clientMeta = {};
  /** Keep track of the ZeroClipboard clipped elements counter. */
  var _elementIdCounter = 0;
  /**
 * Keep track of the state of the clipped element relationships to clients.
 *
 * Entry structure:
 *   _elementMeta[element.zcClippingId] = [client1.id, client2.id];
 */
  var _elementMeta = {};
  /**
 * Keep track of the state of the mouse event handlers for clipped elements.
 *
 * Entry structure:
 *   _mouseHandlers[element.zcClippingId] = {
 *     mouseover:  function(event) {},
 *     mouseout:   function(event) {},
 *     mouseenter: function(event) {},
 *     mouseleave: function(event) {},
 *     mousemove:  function(event) {}
 *   };
 */
  var _mouseHandlers = {};
  /** Extending the ZeroClipboard configuration defaults for the Client module. */
  _extend(_globalConfig, {
    autoActivate: true
  });
  /**
 * The real constructor for `ZeroClipboard` client instances.
 * @private
 */
  var _clientConstructor = function(elements) {
    var client = this;
    client.id = "" + _clientIdCounter++;
    _clientMeta[client.id] = {
      instance: client,
      elements: [],
      handlers: {}
    };
    if (elements) {
      client.clip(elements);
    }
    ZeroClipboard.on("*", function(event) {
      return client.emit(event);
    });
    ZeroClipboard.on("destroy", function() {
      client.destroy();
    });
    ZeroClipboard.create();
  };
  /**
 * The underlying implementation of `ZeroClipboard.Client.prototype.on`.
 * @private
 */
  var _clientOn = function(eventType, listener) {
    var i, len, events, added = {}, meta = _clientMeta[this.id], handlers = meta && meta.handlers;
    if (!meta) {
      throw new Error("Attempted to add new listener(s) to a destroyed ZeroClipboard client instance");
    }
    if (typeof eventType === "string" && eventType) {
      events = eventType.toLowerCase().split(/\s+/);
    } else if (typeof eventType === "object" && eventType && typeof listener === "undefined") {
      for (i in eventType) {
        if (_hasOwn.call(eventType, i) && typeof i === "string" && i && typeof eventType[i] === "function") {
          this.on(i, eventType[i]);
        }
      }
    }
    if (events && events.length) {
      for (i = 0, len = events.length; i < len; i++) {
        eventType = events[i].replace(/^on/, "");
        added[eventType] = true;
        if (!handlers[eventType]) {
          handlers[eventType] = [];
        }
        handlers[eventType].push(listener);
      }
      if (added.ready && _flashState.ready) {
        this.emit({
          type: "ready",
          client: this
        });
      }
      if (added.error) {
        for (i = 0, len = _flashStateErrorNames.length; i < len; i++) {
          if (_flashState[_flashStateErrorNames[i].replace(/^flash-/, "")]) {
            this.emit({
              type: "error",
              name: _flashStateErrorNames[i],
              client: this
            });
            break;
          }
        }
        if (_zcSwfVersion !== undefined && ZeroClipboard.version !== _zcSwfVersion) {
          this.emit({
            type: "error",
            name: "version-mismatch",
            jsVersion: ZeroClipboard.version,
            swfVersion: _zcSwfVersion
          });
        }
      }
    }
    return this;
  };
  /**
 * The underlying implementation of `ZeroClipboard.Client.prototype.off`.
 * @private
 */
  var _clientOff = function(eventType, listener) {
    var i, len, foundIndex, events, perEventHandlers, meta = _clientMeta[this.id], handlers = meta && meta.handlers;
    if (!handlers) {
      return this;
    }
    if (arguments.length === 0) {
      events = _keys(handlers);
    } else if (typeof eventType === "string" && eventType) {
      events = eventType.split(/\s+/);
    } else if (typeof eventType === "object" && eventType && typeof listener === "undefined") {
      for (i in eventType) {
        if (_hasOwn.call(eventType, i) && typeof i === "string" && i && typeof eventType[i] === "function") {
          this.off(i, eventType[i]);
        }
      }
    }
    if (events && events.length) {
      for (i = 0, len = events.length; i < len; i++) {
        eventType = events[i].toLowerCase().replace(/^on/, "");
        perEventHandlers = handlers[eventType];
        if (perEventHandlers && perEventHandlers.length) {
          if (listener) {
            foundIndex = perEventHandlers.indexOf(listener);
            while (foundIndex !== -1) {
              perEventHandlers.splice(foundIndex, 1);
              foundIndex = perEventHandlers.indexOf(listener, foundIndex);
            }
          } else {
            perEventHandlers.length = 0;
          }
        }
      }
    }
    return this;
  };
  /**
 * The underlying implementation of `ZeroClipboard.Client.prototype.handlers`.
 * @private
 */
  var _clientListeners = function(eventType) {
    var copy = null, handlers = _clientMeta[this.id] && _clientMeta[this.id].handlers;
    if (handlers) {
      if (typeof eventType === "string" && eventType) {
        copy = handlers[eventType] ? handlers[eventType].slice(0) : [];
      } else {
        copy = _deepCopy(handlers);
      }
    }
    return copy;
  };
  /**
 * The underlying implementation of `ZeroClipboard.Client.prototype.emit`.
 * @private
 */
  var _clientEmit = function(event) {
    if (_clientShouldEmit.call(this, event)) {
      if (typeof event === "object" && event && typeof event.type === "string" && event.type) {
        event = _extend({}, event);
      }
      var eventCopy = _extend({}, _createEvent(event), {
        client: this
      });
      _clientDispatchCallbacks.call(this, eventCopy);
    }
    return this;
  };
  /**
 * The underlying implementation of `ZeroClipboard.Client.prototype.clip`.
 * @private
 */
  var _clientClip = function(elements) {
    if (!_clientMeta[this.id]) {
      throw new Error("Attempted to clip element(s) to a destroyed ZeroClipboard client instance");
    }
    elements = _prepClip(elements);
    for (var i = 0; i < elements.length; i++) {
      if (_hasOwn.call(elements, i) && elements[i] && elements[i].nodeType === 1) {
        if (!elements[i].zcClippingId) {
          elements[i].zcClippingId = "zcClippingId_" + _elementIdCounter++;
          _elementMeta[elements[i].zcClippingId] = [ this.id ];
          if (_globalConfig.autoActivate === true) {
            _addMouseHandlers(elements[i]);
          }
        } else if (_elementMeta[elements[i].zcClippingId].indexOf(this.id) === -1) {
          _elementMeta[elements[i].zcClippingId].push(this.id);
        }
        var clippedElements = _clientMeta[this.id] && _clientMeta[this.id].elements;
        if (clippedElements.indexOf(elements[i]) === -1) {
          clippedElements.push(elements[i]);
        }
      }
    }
    return this;
  };
  /**
 * The underlying implementation of `ZeroClipboard.Client.prototype.unclip`.
 * @private
 */
  var _clientUnclip = function(elements) {
    var meta = _clientMeta[this.id];
    if (!meta) {
      return this;
    }
    var clippedElements = meta.elements;
    var arrayIndex;
    if (typeof elements === "undefined") {
      elements = clippedElements.slice(0);
    } else {
      elements = _prepClip(elements);
    }
    for (var i = elements.length; i--; ) {
      if (_hasOwn.call(elements, i) && elements[i] && elements[i].nodeType === 1) {
        arrayIndex = 0;
        while ((arrayIndex = clippedElements.indexOf(elements[i], arrayIndex)) !== -1) {
          clippedElements.splice(arrayIndex, 1);
        }
        var clientIds = _elementMeta[elements[i].zcClippingId];
        if (clientIds) {
          arrayIndex = 0;
          while ((arrayIndex = clientIds.indexOf(this.id, arrayIndex)) !== -1) {
            clientIds.splice(arrayIndex, 1);
          }
          if (clientIds.length === 0) {
            if (_globalConfig.autoActivate === true) {
              _removeMouseHandlers(elements[i]);
            }
            delete elements[i].zcClippingId;
          }
        }
      }
    }
    return this;
  };
  /**
 * The underlying implementation of `ZeroClipboard.Client.prototype.elements`.
 * @private
 */
  var _clientElements = function() {
    var meta = _clientMeta[this.id];
    return meta && meta.elements ? meta.elements.slice(0) : [];
  };
  /**
 * The underlying implementation of `ZeroClipboard.Client.prototype.destroy`.
 * @private
 */
  var _clientDestroy = function() {
    if (!_clientMeta[this.id]) {
      return;
    }
    this.unclip();
    this.off();
    delete _clientMeta[this.id];
  };
  /**
 * Inspect an Event to see if the Client (`this`) should honor it for emission.
 * @private
 */
  var _clientShouldEmit = function(event) {
    if (!(event && event.type)) {
      return false;
    }
    if (event.client && event.client !== this) {
      return false;
    }
    var meta = _clientMeta[this.id];
    var clippedEls = meta && meta.elements;
    var hasClippedEls = !!clippedEls && clippedEls.length > 0;
    var goodTarget = !event.target || hasClippedEls && clippedEls.indexOf(event.target) !== -1;
    var goodRelTarget = event.relatedTarget && hasClippedEls && clippedEls.indexOf(event.relatedTarget) !== -1;
    var goodClient = event.client && event.client === this;
    if (!meta || !(goodTarget || goodRelTarget || goodClient)) {
      return false;
    }
    return true;
  };
  /**
 * Handle the actual dispatching of events to a client instance.
 *
 * @returns `undefined`
 * @private
 */
  var _clientDispatchCallbacks = function(event) {
    var meta = _clientMeta[this.id];
    if (!(typeof event === "object" && event && event.type && meta)) {
      return;
    }
    var async = _shouldPerformAsync(event);
    var wildcardTypeHandlers = meta && meta.handlers["*"] || [];
    var specificTypeHandlers = meta && meta.handlers[event.type] || [];
    var handlers = wildcardTypeHandlers.concat(specificTypeHandlers);
    if (handlers && handlers.length) {
      var i, len, func, context, eventCopy, originalContext = this;
      for (i = 0, len = handlers.length; i < len; i++) {
        func = handlers[i];
        context = originalContext;
        if (typeof func === "string" && typeof _window[func] === "function") {
          func = _window[func];
        }
        if (typeof func === "object" && func && typeof func.handleEvent === "function") {
          context = func;
          func = func.handleEvent;
        }
        if (typeof func === "function") {
          eventCopy = _extend({}, event);
          _dispatchCallback(func, context, [ eventCopy ], async);
        }
      }
    }
  };
  /**
 * Prepares the elements for clipping/unclipping.
 *
 * @returns An Array of elements.
 * @private
 */
  var _prepClip = function(elements) {
    if (typeof elements === "string") {
      elements = [];
    }
    return typeof elements.length !== "number" ? [ elements ] : elements;
  };
  /**
 * Add a `mouseover` handler function for a clipped element.
 *
 * @returns `undefined`
 * @private
 */
  var _addMouseHandlers = function(element) {
    if (!(element && element.nodeType === 1)) {
      return;
    }
    var _suppressMouseEvents = function(event) {
      if (!(event || (event = _window.event))) {
        return;
      }
      if (event._source !== "js") {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
      delete event._source;
    };
    var _elementMouseOver = function(event) {
      if (!(event || (event = _window.event))) {
        return;
      }
      _suppressMouseEvents(event);
      ZeroClipboard.focus(element);
    };
    element.addEventListener("mouseover", _elementMouseOver, false);
    element.addEventListener("mouseout", _suppressMouseEvents, false);
    element.addEventListener("mouseenter", _suppressMouseEvents, false);
    element.addEventListener("mouseleave", _suppressMouseEvents, false);
    element.addEventListener("mousemove", _suppressMouseEvents, false);
    _mouseHandlers[element.zcClippingId] = {
      mouseover: _elementMouseOver,
      mouseout: _suppressMouseEvents,
      mouseenter: _suppressMouseEvents,
      mouseleave: _suppressMouseEvents,
      mousemove: _suppressMouseEvents
    };
  };
  /**
 * Remove a `mouseover` handler function for a clipped element.
 *
 * @returns `undefined`
 * @private
 */
  var _removeMouseHandlers = function(element) {
    if (!(element && element.nodeType === 1)) {
      return;
    }
    var mouseHandlers = _mouseHandlers[element.zcClippingId];
    if (!(typeof mouseHandlers === "object" && mouseHandlers)) {
      return;
    }
    var key, val, mouseEvents = [ "move", "leave", "enter", "out", "over" ];
    for (var i = 0, len = mouseEvents.length; i < len; i++) {
      key = "mouse" + mouseEvents[i];
      val = mouseHandlers[key];
      if (typeof val === "function") {
        element.removeEventListener(key, val, false);
      }
    }
    delete _mouseHandlers[element.zcClippingId];
  };
  /**
 * Creates a new ZeroClipboard client instance.
 * Optionally, auto-`clip` an element or collection of elements.
 *
 * @constructor
 */
  ZeroClipboard._createClient = function() {
    _clientConstructor.apply(this, _args(arguments));
  };
  /**
 * Register an event listener to the client.
 *
 * @returns `this`
 */
  ZeroClipboard.prototype.on = function() {
    return _clientOn.apply(this, _args(arguments));
  };
  /**
 * Unregister an event handler from the client.
 * If no `listener` function/object is provided, it will unregister all handlers for the provided `eventType`.
 * If no `eventType` is provided, it will unregister all handlers for every event type.
 *
 * @returns `this`
 */
  ZeroClipboard.prototype.off = function() {
    return _clientOff.apply(this, _args(arguments));
  };
  /**
 * Retrieve event listeners for an `eventType` from the client.
 * If no `eventType` is provided, it will retrieve all listeners for every event type.
 *
 * @returns array of listeners for the `eventType`; if no `eventType`, then a map/hash object of listeners for all event types; or `null`
 */
  ZeroClipboard.prototype.handlers = function() {
    return _clientListeners.apply(this, _args(arguments));
  };
  /**
 * Event emission receiver from the Flash object for this client's registered JavaScript event listeners.
 *
 * @returns For the "copy" event, returns the Flash-friendly "clipData" object; otherwise `undefined`.
 */
  ZeroClipboard.prototype.emit = function() {
    return _clientEmit.apply(this, _args(arguments));
  };
  /**
 * Register clipboard actions for new element(s) to the client.
 *
 * @returns `this`
 */
  ZeroClipboard.prototype.clip = function() {
    return _clientClip.apply(this, _args(arguments));
  };
  /**
 * Unregister the clipboard actions of previously registered element(s) on the page.
 * If no elements are provided, ALL registered elements will be unregistered.
 *
 * @returns `this`
 */
  ZeroClipboard.prototype.unclip = function() {
    return _clientUnclip.apply(this, _args(arguments));
  };
  /**
 * Get all of the elements to which this client is clipped.
 *
 * @returns array of clipped elements
 */
  ZeroClipboard.prototype.elements = function() {
    return _clientElements.apply(this, _args(arguments));
  };
  /**
 * Self-destruct and clean up everything for a single client.
 * This will NOT destroy the embedded Flash object.
 *
 * @returns `undefined`
 */
  ZeroClipboard.prototype.destroy = function() {
    return _clientDestroy.apply(this, _args(arguments));
  };
  /**
 * Stores the pending plain text to inject into the clipboard.
 *
 * @returns `this`
 */
  ZeroClipboard.prototype.setText = function(text) {
    if (!_clientMeta[this.id]) {
      throw new Error("Attempted to set pending clipboard data from a destroyed ZeroClipboard client instance");
    }
    ZeroClipboard.setData("text/plain", text);
    return this;
  };
  /**
 * Stores the pending HTML text to inject into the clipboard.
 *
 * @returns `this`
 */
  ZeroClipboard.prototype.setHtml = function(html) {
    if (!_clientMeta[this.id]) {
      throw new Error("Attempted to set pending clipboard data from a destroyed ZeroClipboard client instance");
    }
    ZeroClipboard.setData("text/html", html);
    return this;
  };
  /**
 * Stores the pending rich text (RTF) to inject into the clipboard.
 *
 * @returns `this`
 */
  ZeroClipboard.prototype.setRichText = function(richText) {
    if (!_clientMeta[this.id]) {
      throw new Error("Attempted to set pending clipboard data from a destroyed ZeroClipboard client instance");
    }
    ZeroClipboard.setData("application/rtf", richText);
    return this;
  };
  /**
 * Stores the pending data to inject into the clipboard.
 *
 * @returns `this`
 */
  ZeroClipboard.prototype.setData = function() {
    if (!_clientMeta[this.id]) {
      throw new Error("Attempted to set pending clipboard data from a destroyed ZeroClipboard client instance");
    }
    ZeroClipboard.setData.apply(this, _args(arguments));
    return this;
  };
  /**
 * Clears the pending data to inject into the clipboard.
 * If no `format` is provided, all pending data formats will be cleared.
 *
 * @returns `this`
 */
  ZeroClipboard.prototype.clearData = function() {
    if (!_clientMeta[this.id]) {
      throw new Error("Attempted to clear pending clipboard data from a destroyed ZeroClipboard client instance");
    }
    ZeroClipboard.clearData.apply(this, _args(arguments));
    return this;
  };
  /**
 * Gets a copy of the pending data to inject into the clipboard.
 * If no `format` is provided, a copy of ALL pending data formats will be returned.
 *
 * @returns `String` or `Object`
 */
  ZeroClipboard.prototype.getData = function() {
    if (!_clientMeta[this.id]) {
      throw new Error("Attempted to get pending clipboard data from a destroyed ZeroClipboard client instance");
    }
    return ZeroClipboard.getData.apply(this, _args(arguments));
  };
  if (typeof define === "function" && define.amd) {
    define(function() {
      return ZeroClipboard;
    });
  } else if (typeof module === "object" && module && typeof module.exports === "object" && module.exports) {
    module.exports = ZeroClipboard;
  } else {
    window.ZeroClipboard = ZeroClipboard;
  }
})(function() {
  return this || window;
}());
/** Класс хранилище кастомных кнопок тулбара smc-таблицы */

var TTCustomizer = {
	buttons: {},

	menu: [],

	extendDefault: false,

	extend: function(func) {
		if (_.keys(func).length > 0) {
			_.extend(this.buttons, func);
			return true;
		} else {
			return false;
		}
	}
};
