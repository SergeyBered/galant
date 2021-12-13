/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/** Основной класс контроллер компонента Data */
	var Twig = __webpack_require__(1);

	var umiDataController = Backbone.Marionette.Application.extend({
	    opt: {},
	    layouts: null,
	    data: null,
	    config: null,
	    userSettings: null,
	    control: null,
	    controlViews: [],
	    level0view: null,
	    colCount: 0,
	    debug: false,
	    dragAllowed: false,
	    head: 'umiTableHeader.twig',
	    row: 'umiDataTableRow.twig',
	    dataProtocol: 'json',
	    usedColumns: [],
	    columnsMenu: {},
	    lastSelect: -1,
	    expanded: [],
	    drugMode: false,
	    hView: null,
	    draggableItem: null,
	    dropIndicator: null,
	    dropValidator: null,
	    perPageLimit: 10,
	    pageLimits: [10, 20, 50, 100],
	    configUrl: '',
	    childTemplate: {},
	    tableHeaderView: null,

	    /** Инициализация контрола */
	    initialize: function() {
	        if (this.options.container !== undefined) {
	            this.addRegions({
	                umiMain: this.options.container
	            });
	        }
	        if (this.options.debug) {
	            this.debug = true;
	        }
	        this.head = this.options.head || this.head;
	        this.row = this.options.row || this.row;
	        this.dragAllowed = this.options.dragAllowed || false;
	        this.dropValidator = this.options.dropValidator || null;
	        this.perPageLimit = this.options.perPageLimit || null;
	        this.configUrl = this.options.configUrl || '';
	        this.pageLimits = this.options.pageLimits || [10, 20, 50, 100];
	        this.dataProtocol = this.options.dataProtocol || 'json';

	        window.dc_application = this;

	        Twig.extendFunction("trans", function(value) {
	            if (typeof getLabel === "function") {
	                value = getLabel(value);
	            }
	            return value;
	        });

	        Twig.extendFunction("isDefined", function(obj, key) {
	            return _.has(obj, key);
	        });

	        Twig.extendFunction('imageField', function(value) {
	            if (_.isNull(value)) {
	                return '';
	            }
	            var src = value,
	                path = src.substring(0, src.lastIndexOf('.')),
	                filename = "",
	                tmp = '',
	                ext = src.substring(src.lastIndexOf('.') + 1),
	                val = '';
	            if (typeof src == "string") {
	                tmp = src.split(/\//);
	                filename = tmp[tmp.length - 1];
	            }

	            if (filename) {
	                var thumbSrc = "/autothumbs.php?img=" + path + '_sl_180_120.' + ext;
	                val = '<img alt="" style="width:13px;height:13px;cursor: pointer;" src="/styles/skins/modern/design/img/image.png" onmouseover="dc_application.showPreviewImage(event, \'' + thumbSrc + '\')" />';
	                val += '&nbsp;&nbsp;<span title="' + src + '">' + filename + "</span>";
	            }

	            return val;
	        });

	        Twig.extendFunction('fileField', function(value) {
	            if (_.isNull(value)) {
	                return '';
	            }

	            var src = value,
	                filename = "",
	                tmp = '',
	                val = '';

	            if (typeof src === "string") {
	                tmp = src.split(/\//);
	                filename = tmp[tmp.length - 1];
	                val = '<span title="' + src + '">' + filename + "</span>";
	            }

	            return val;
	        });

	        Twig.extendFunction('multipleImageField', function(value) {
	            if (_.isNull(value)) {
	                return '';
	            }

	            var val = '';
	            $.each(value, function(i, img) {
	                var path = img.src.substring(0, img.src.lastIndexOf('.'));
	                var ext = img.src.substring(img.src.lastIndexOf('.') + 1);
	                var thumbSrc = "/autothumbs.php?img=" + path + '_sl_180_120.' + ext;
	                val += '<img alt="" style="width:13px;height:13px;cursor: pointer;" src="/styles/skins/modern/design/img/image.png" onmouseover="dc_application.showPreviewImage(event, \'' + thumbSrc + '\')" />&nbsp;';
	            });

	            return val;
	        });

	        Twig.extendFunction('multipleFileField', function(value) {
	            if (_.isNull(value)) {
	                return '';
	            }
	            var val = '';
	            $.each(value, function(i, file) {
	                val += '<img alt="" style="width:13px;height:13px;cursor: pointer;" src="/styles/skins/modern/design/img/ico_file.gif" title="' + file.src + '"/>&nbsp;';
	            });

	            return val;
	        });

	        Twig.extendFunction('textWysiwygField', function(value) {
	            if (_.isNull(value) || value == '') {
	                return '';
	            }

	            return '<img alt="" style="width:13px;height:13px;cursor: pointer;" src="/styles/skins/modern/design/img/ico_file.gif"/>&nbsp;';
	        });

	        Twig.extendFunction('relationField', function(value) {
	            if (_.isNull(value) || value == '') {
	                return '';
	            }

	            if (Array.isArray(value)) {
	                value = value.join(', ');
	            }

	            return value;
	        });

	        Twig.extendFunction('textSymlinkField', function(value) {
	            if (_.isNull(value) || value == '') {
	                return '';
	            }

	            let val = [];
	            for(let n = 0; value[n]; n++) {
	                val.push(value[n].name);
	            }
	            val = val.join(', ');

	            return val;
	        });

	        Backbone.Marionette.TemplateCache.prototype.loadTemplate = function(templateId) {
	            return templateId;
	        };

	        Backbone.Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate) {
	            return __webpack_require__(6)("./" + rawTemplate).template;
	        };

	        Backbone.Marionette.Renderer.render = function(template, data) {
	            return __webpack_require__(6)("./" + template)(data);
	        };

	        if (this.dragAllowed) {
	            var dropIndicator = document.createElement('div');
	            dropIndicator.className = 'ti-drop';
	            this.dropIndicator = document.body.appendChild(dropIndicator);
	        }
	    },

	    /** Обработчик события start */
	    onStart: function() {
	        var that = this;
	        this.layouts = __webpack_require__(16);
	        this.layouts = new this.layouts({
	            perPageLimit: this.perPageLimit,
	            pageLimits: this.pageLimits,
	            domainsList: this.options.domainsList || false
	        });
	        this.layouts.on('show', function() {
	            that.onLayoutShow.call(that);
	        });
	        this.getRegion('umiMain').show(this.layouts);

	        this.childTemplate = __webpack_require__(11);
	    },

	    /** Обработчик события отрисовки базовой верстки контрола */
	    onLayoutShow: function() {
	        var that = this;
	        this.config = __webpack_require__(17);
	        this.config = new this.config({
	            configUrl: this.configUrl,
	            module: this.options['module'],
	            param: this.options['controlParam']
	        });

	        this.config.fetch().then(function() {
	            that.userSettings = __webpack_require__(18);
	            that.userSettings = new that.userSettings();
	            return that.userSettings.fetch();
	        }).then(function() {
	            var defaultColumns = that.config.get('def'),
	                fields = that.config.get('fields'),
	                userSettings = that.userSettings.get(that.config.get('column_order_key')),
	                userColumns = defaultColumns;

	            if (!_.isUndefined(userSettings) && !_.isUndefined(userSettings['used-columns'])) {
	                userColumns = userSettings['used-columns'];
	            }

	            var existsColumns = [];

	            _.each(userColumns, function(userColumn) {
	                if (userColumn.field in fields) {
	                    existsColumns.push(userColumn);
	                }
	            });

	            _.each(existsColumns, function(column) {
	                _.extend(column, fields[column.field]);
	            });

	            that.usedColumns = existsColumns;

	            var columns = _.pluck(that.usedColumns, 'field'),
	                keys = _.keys(fields);
	            for (var i = 0, cnt = keys.length; i < cnt; i++) {
	                var f = fields[keys[i]],
	                    used = (_.indexOf(columns, f.name) > -1);
	                that.columnsMenu[f.name] = {
	                    'caption': f.title,
	                    'icon': used ? 'checked' : 'undefined',
	                    'id': 0,
	                    'title': f.title,
	                    'fieldName': f.name,
	                    'dataType': 0,
	                    'guideId': 0,
	                    'checked': used,
	                    'execute': function(item) {
	                        that.changeUsedColumns.call(that, item);
	                    }
	                }
	            }

	            var filter = __webpack_require__(19);
	            that.data = __webpack_require__(20);
	            that.data = new that.data({
	                prefix: that.options.prefix,
	                loadMethod: that.config.get('load_method'),
	                dataProtocol: that.options.dataProtocol,
	                qb: new filter({
	                    lang: [that.options.lang],
	                    domain: [that.options.domain],
	                    limit: that.perPageLimit
	                })
	            });

	            return that.data.fetch();
	        }).done(function() {
	            var limit = that.data.limit;
	            $('.per_page_limit', $(that.options.container)).each(function(index, item) {
	                if (item.text == limit) {
	                    $(item).addClass('current');
	                }
	            });

	            that.onDataLoaded.call(that);
	        });

	        this.vent.on('b:getselected', function() {
	            that.getSel(that.data)
	        });

	        this.vent.on('b:limitchange', function(val) {
	            that.data.qb.setLimit(val);
	            that.data.qb.setPage(0);
	            that.refresh();
	        });

	        this.vent.on('b:pagechange', function(val, view) {
	            var data = view.collection;
	            data.qb.setPage(parseInt(val) - 1);
	            data.reset();
	            view.$el.empty();
	            data.fetch(data.qb.Parents[0]).done(function() {
	                view.render();
	            });
	        });

	        this.vent.on('b:orderhange', function(field, direction) {
	            that.data.qb.setOrder(field, direction);
	            that.refresh();
	        });

	        this.vent.on('data:saveusercolls', function() {
	            var cols = $('th[umi-field]', $(that.options.container)),
	                key = that.config.get('column_order_key'),
	                data = [];
	            if (cols.length) {
	                for (var i = 0, cnt = cols.length; i < cnt; i++) {
	                    var col = $(cols[i]);
	                    data.push(col.attr('umi-field') + '[' + col.outerWidth() + 'px]')
	                }
	                data = data.join('|');
	                SettingsStore.getInstance().set(key, data, 'used-columns');
	            }
	        });

	        this.vent.on('item:selected', function(item) {
	            var models = _.isUndefined(item.model.collection) ? {} : item.model.collection.models,
	                selected = item.model.cid,
	                id = _.indexOf(models, item.model),
	                from = 0, to = 0, i = 0;
	            if (!_.isUndefined(item.model.collection) && item.shiftMode && that.lastSelect >= 0 && models[that.lastSelect].selected) {
	                models = item.model.collection.models;
	                if (selected.length > 1) {
	                    from = Math.min(id, that.lastSelect);
	                    to = Math.max(id, that.lastSelect);

	                    for (i = from; i <= to; i++) {
	                        if (!models[i].selected) {
	                            models[i].select(true);
	                        }
	                    }
	                }
	                item.shiftMode = false;
	            }
	            if (item.model.selected) {
	                that.lastSelect = id;
	            }
	            that.toolbar.redraw();
	            that.trigger('row_select', item.model);
	            if (_.isFunction(that.options.onSelect)) {
	                that.options.onSelect.call(that, item.model);
	            }
	        });

	        this.vent.on('domainchange', function(domainId) {
	            that.data.qb.setDomain(domainId);
	            that.refresh();
	        })
	    },

	    /** Обработчик события загрузки данных 0 уровня */
	    onDataLoaded: function() {
	        var that = this,
	            columns = this.config.get('def'),
	            header = new umiTableHeaderModel({
	                fields: this.usedColumns,
	                countFields: columns.length
	            });
	        this.colCount = _.keys(header.get('fields')[0]).length;
	        var headerView = __webpack_require__(21);
	        headerView = new headerView({model: header, el: '#udcControlHeader', template: this.head});
	        headerView.render();
	        this.tableHeaderView = headerView;

	        this.vent.on('data:filter', function(pattern) {
	            that.filterData.call(that, pattern);
	        });
	        this.vent.on('data:reset_filter', function() {
	            that.resetFilter.call(that);
	        });

	        var Table = __webpack_require__(23);
	        Table = new Table({
	            collection: this.data,
	            el: '#udcControlBody',
	            template: this.row,
	            fields: this.usedColumns,
	            dragAllowed: this.dragAllowed
	        });
	        Table.on('udcrow:expand', function(item) {
	            that.rowExpanded.call(that, item);
	        });
	        Table.render();
	        this.level0view = Table;

	        $('.overflow-block').on('resize', function() {
	            var over = $(this),
	                table = $('.overflow-block table'),
	                plus = $('.overflow-block table .plus');
	            if (plus.length > 0) {
	                if (over.width() !== table.width()) {
	                    plus.css('width', '80px');
	                } else {
	                    plus.css('width', '100%');
	                }
	            }
	        });

	        headerView.recalculateAllValueCellsWidth();

	        //Рисуем тулбар
	        this.toolbar = __webpack_require__(25);
	        this.toolbar = new this.toolbar({
	            el: '#udcToolbar',
	            toolbarFunctions: this.options.toolbarFunction,
	            toolbarMenu: this.options.toolbarMenu,
	            showSelectButtons: this.options.showSelectButtons,
	            showResetButtons: this.options.showResetButtons
	        });
	        this.toolbar.render();
	    },

	    /**
	     * Обработчик события клика на маркер разворачивания ветки
	     * @param item - представление разворачиваемого узла
	     */
	    rowExpanded: function(item) {
	        var that = this;
	        var model = item.model,
	            el = item.$el,
	            ch_container = $('#' + model.cid);
	        if (model.expanded) {
	            this.expanded.push(model.get('id'));
	            this.expanded = _.uniq(this.expanded);
	            if (ch_container.length > 0) {
	                ch_container.show();
	            } else {
	                var queryBuilder = that.getQueryBuilder().clone();
	                queryBuilder.setParentElements([model.get('id')]);

	                var ch_data = __webpack_require__(20);
	                ch_data = new ch_data({
	                    prefix: that.options.prefix,
	                    loadMethod: that.config.get('load_method'),
	                    dataProtocol: that.options.dataProtocol,
	                    qb: queryBuilder

	                });
	                $(this.childTemplate({id: model.cid, col_count: this.usedColumns.length + 1})).insertAfter(el);
	                ch_data.fetch(model.get('id')).done(function() {
	                    model.set('children', ch_data);
	                    that.renderChild.call(that, model, item);
	                });
	            }
	        } else {
	            this.expanded = _.without(this.expanded, model.cid);
	            ch_container.hide();
	        }
	    },

	    /**
	     * Отрисовывает дочернюю ветку
	     * @param model - модель данных
	     * @param item - представление узла которы развернули
	     */
	    renderChild: function(model, item) {
	        var that = this;
	        var Table = __webpack_require__(23);
	        Table = new Table({
	            collection: model.attributes['children'],
	            el: '#ch_' + model.cid,
	            template: this.row,
	            fields: this.usedColumns,
	            dragAllowed: this.dragAllowed,
	            parentView: item
	        });
	        Table.on('udcrow:expand', function(item) {
	            that.dataExpanded.call(that, item);
	        });
	        Table.render();
	        this.controlViews.push(Table);
	    },

	    /**
	     * Очищает переданный набор представлений
	     * @param views - массив объектов представлений
	     */
	    clearControl: function(views) {
	        for (var i = 0, cnt = views.length; i < cnt; i++) {
	            var delView = views[i];
	            this.controlViews = _.without(this.controlViews, views[i]);
	            delView.remove();
	        }
	    },

	    /**
	     * Обработчик изменения фильтров колонок
	     * @param pattern - массив полей и значений фильтра
	     */
	    filterData: function(pattern) {
	        $('.umiDC').remove();
	        this.clearControl(this.controlViews);
	        var field;
	        var queryBuilder = this.getQueryBuilder();
	        queryBuilder.setPage(0);

	        for (var i = 0, cnt = pattern.length; i < cnt; i++) {
	            field = _.where(this.usedColumns, {name: pattern[i].field});

	            if (pattern[i].value.length > 0) {
	                if (_.indexOf(['date', 'datetime', 'image', 'file', 'float', 'int', 'number', 'integer', 'bool', 'relation', 'multiple_image', 'multiple_file'], field[0].type) > -1) {
	                    queryBuilder.setPropertyEqual(pattern[i].field, pattern[i].value);
	                } else if (!field.length) {
	                    queryBuilder.setPropertyLike(pattern[i].field, pattern[i].value);
	                } else {
	                    queryBuilder.setPropertyLike(pattern[i].field, pattern[i].value);
	                }
	            } else {
	                queryBuilder.removeProperty(pattern[i].field);
	            }
	        }

	        this.refresh();
	    },

	    /** Сбрасывает все фильтры в таблице */
	    resetFilter: function() {
	        this.clearControl(this.controlViews);
	        var queryBuilder = this.getQueryBuilder();
	        queryBuilder.resetPropertyFilter();
	        this.refresh();
	    },

	    /** Сбрасывает фильтры и сортировку **/
	    resetFilterAndSort: function() {
	        var queryBuilder = this.getQueryBuilder();
	        var headerView = this.getTableHeaderView();
	        queryBuilder.resetPropertyFilter();
	        headerView.resetFilter();
	        queryBuilder.resetPropertyOrder();
	        headerView.resetOrder();
	        this.refresh();
	    },

	    /**
	     * Возвращает генератор запросов
	     * @returns {umiQueryBuilder|null}
	     */
	    getQueryBuilder: function() {
	        return this.data.qb;
	    },

	    /**
	     * Возвращает туллбар
	     * @returns {Toolbar|null}
	     */
	    getToolBar: function() {
	        return this.toolbar;
	    },

	    /**
	     * Определяет есть ли выбранные строки
	     * @returns {Boolean}
	     */
	    hasSelectedRows: function() {
	        return this.getSelectedRowsCount() !== 0;
	    },

	    /**
	     * Определяет выбрана ли только одна строка
	     * @returns {boolean}
	     */
	    isOneRowSelected: function() {
	        return this.getSelectedRowsCount() === 1;
	    },

	    /**
	     * Возвращает количество выбранных строк
	     * @returns {number|*}
	     */
	    getSelectedRowsCount: function() {
	        return this.getToolBar().selectedItemsCount;
	    },

	    /**
	     * Возвращает список идентификаторов выбранных строк
	     * @returns {Array}
	     */
	    getSelectedIdList: function() {
	        var idList = [];
	        var that = this;

	        _.each(that.getSelectedRowList(), function(entity) {
	            idList.push(that.unPackId(entity.attributes.id));
	        });

	        return idList;
	    },

	    /**
	     * Возвращает список выбранных строк
	     * @returns {Array}
	     */
	    getSelectedRowList: function() {
	        return this.getToolBar().selectedItems;
	    },

	    /**
	     * Возвращает первую выбранную строку
	     * @returns {*}
	     */
	    getFirstSelectedRow: function() {
	        return this.getSelectedRowList()[0];
	    },

	    /**
	     * Возвращает идентификатор первой выбранной строки
	     * @returns {*}
	     */
	    getFirstSelectedId: function() {
	        return this.unPackId(this.getFirstSelectedRow().attributes.id);
	    },

	    /**
	     * Переключает активность кнопки тулбара
	     * @param {Object} button кнопка тулбара
	     * @param {Function} callback функция определяющая должна ли кнопка быть активной
	     * @returns {*|void}
	     */
	    toggleToolBarButton: function(button, callback) {
	        var toolBar = this.getToolBar();

	        if (callback(this)) {
	            return toolBar.enableButtons(button);
	        }

	        toolBar.disableButtons(button);
	    },

	    /**
	     * Возвращает отображение верхних строк таблицы
	     * @returns {umiTableHeaderView|null}
	     */
	    getTableHeaderView: function() {
	        return this.tableHeaderView;
	    },

	    /** Обновляет контрол */
	    refresh: function() {
	        var that = this;
	        this.clearControl(this.controlViews);

	        _.each(this.data.models, function(model) {
	            model.clear();
	        });

	        that.data.reset();
	        that.toolbar.redraw();
	        this.level0view.$el.empty();
	        this.data.fetch().done(function() {
	            that.level0view.once('render', function() {
	                var expanded = that.expanded;
	                if (expanded.length > 0) {
	                    for (var i = 0, cnt = expanded.length; i < cnt; i++) {
	                        $('span.catalog-toggle-wrapper.ex_' + expanded[i]).trigger('click');
	                    }
	                }
	            });
	            that.level0view.render();
	        });
	    },

	    /**
	     * Создает урл строку запроса с учетом всех фильтров
	     * @param _Filter - массив фильтров
	     * @returns {string}
	     */
	    assembleQueryString: function(_Filter) {
	        var query = _Filter.getQueryString();
	        var Pieces = [];
	        var Param;

	        if (_Filter.id != undefined) {
	            if (_.isArray(_Filter.id)) {
	                Param = _Filter.id;
	            } else {
	                Param = [];
	                Param.push(_Filter.id);
	            }
	            Pieces.push('id=' + Param.join(','));
	        }

	        if (_Filter.rel != undefined) {
	            if (_.isArray(_Filter.rel)) {
	                Param = _Filter.rel;
	            } else {
	                Param = [];
	                Param.push(_Filter.rel);
	            }
	            Pieces.push('rel=' + Param.join(','));
	        }

	        if (Pieces.length) {
	            query = '?' + Pieces.join('&');
	        }

	        if (!_.isUndefined(csrfProtection) && csrfProtection !== null) {
	            query += '&csrf=' + csrfProtection.getToken();
	        }

	        return query + "&r=" + Math.random();
	    },

	    /**
	     * Функция выполняющая один из методов бэкенда
	     * @param method - имя обработчика бекенда
	     * @param input - данные запроса
	     * @returns {*}
	     */
	    runmethod: function(method, input) {
	        var url = '/admin/' + this.config.get('module') + '/';

	        if (this.config.has(method)) {
	            url += this.config.get(method);
	        } else {
	            url += method;
	        }
	        if (!_.isUndefined(input.id)) {
	            url += '/' + input.id + '/';
	        }
	        url += '.' + this.options.dataProtocol;

	        if (!_.isUndefined(input.data)) {
	            if (csrfProtection !== undefined) {
	                input.data['csrf'] = csrfProtection.getToken();
	            }
	            input.data['r'] = Math.random();
	        } else {
	            input['data'] = {
	                r: Math.random()
	            }
	        }

	        return this.confirmeMethod(method).then(function() {
	            return $.ajax({
	                url: url,
	                data: input.data,
	                dataType: 'json',
	                method: 'POST',
	            });
	        });
	    },

	    /**
	     * Функция показывает окно подтверждения для выполняющихся методов бэкенда
	     * @param Method - имя функции обработчика бекенда
	     */
	    confirmeMethod: function(Method) {
	        var def = $.Deferred();
	        var dlgTitle = "";
	        var dlgContent = "";
	        var dlgOk = "";
	        var dlgCancel = getLabel('js-cancel');

	        switch (Method) {
	            case "delete_method" :
	                if (Control.HandleItem != null && Control.HandleItem.control.flatMode) {
	                    dlgTitle = getLabel('js-del-object-title-short');
	                    dlgContent = getLabel('js-del-object-warning');
	                } else if (Control.HandleItem != null && Control.HandleItem.control.objectTypesMode) {
	                    dlgTitle = getLabel('js-del-object-type-title-short');
	                    dlgContent = getLabel('js-del-object-type-shured');
	                } else if (Control.HandleItem == null) {
	                    dlgTitle = getLabel('js-del-object-title-short');
	                    dlgContent = getLabel('js-del-object-warning');
	                } else {
	                    dlgTitle = getLabel('js-del-object-title-short');
	                    dlgContent = getLabel('js-del-page-warning');
	                }

	                dlgOk = getLabel('js-del-do');
	                break;

	            default:
	                return def.resolve();
	                break;
	        }

	        dlgContent = '<div class="confirm">' + dlgContent + '</div>';

	        openDialog('', dlgTitle, {
	            html: dlgContent,
	            confirmText: dlgOk,
	            cancelButton: true,
	            cancelText: dlgCancel,
	            confirmCallback: function(dialogName) {
	                closeDialog(dialogName);
	                return def.resolve();
	            },
	            cancelCallback: function() {
	                return def.reject();
	            }
	        });

	        return def.promise();
	    },

	    /**
	     * Сохраняет пользовательские настройки колонок таблицы
	     * @param item - модель данных
	     */
	    changeUsedColumns: function(item) {
	        var key = this.config.get('column_order_key'),
	            userColumns = this.usedColumns,
	            data = [];

	        for (var i = 0, cnt = userColumns.length; i < cnt; i++) {
	            if (item.checked && item.fieldName === userColumns[i].field) {
	                continue;
	            }
	            data.push(userColumns[i].field + '[' + (_.isUndefined(userColumns[i].size) ? '170px' : userColumns[i].size) + ']');
	        }

	        if (!item.checked) {
	            data.push(item.fieldName + '[170px]')
	        }

	        SettingsStore.getInstance().set(key, data.join('|'), 'used-columns');

	        this.getRegion('umiMain').reset();
	        this.start();
	        this.toolbar.bindAllButtonsClick();
	    },

	    /**
	     * Создает превью изображения поля типа image
	     * @param event - обьект события onmouseover
	     * @param src - урл изображения
	     */
	    showPreviewImage: function(event, src) {
	        if (!event || !src) return;
	        var el = (!event.target) ? event.toElement : event.target;
	        var x = (!event.pageX) ? event.clientX : event.pageX;
	        var y = (!event.pageY) ? event.clientY : event.pageY;

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
	    },

	    /**
	     * Превращает системный id в id обьекта бекенда
	     * @param obj - id или массив id
	     * @returns {*}
	     */
	    unPackId: function(obj) {
	        if (_.isArray(obj)) {
	            for (var i = 0, cnt = obj.length; i < cnt; i++) {
	                obj[i] = dc_application.unPackId(obj[i]);
	            }
	        } else if (_.isString(obj)) {
	            if (String(obj).indexOf('_') > 0) {
	                obj = String(obj).split('_');
	                obj = obj[obj.length - 1];
	            }
	        } else {
	            if (!_.isUndefined(obj['id'])) {
	                if (String(obj['id']).indexOf('_') > 0) {
	                    obj['id'] = String(obj['id']).split('_');
	                    obj['id'] = obj['id'][obj['id'].length - 1];
	                }
	            }
	        }

	        return obj;
	    },

	    /**
	     * Отрисовывает индикатор перетаскивания в элементе над которым находится перетаскиваемый элемент
	     * @param DropMode - режим вставки
	     * @returns {boolean}
	     */
	    initDroppable: function(DropMode) {
	        DropMode = DropMode || 'child';
	        var di = this.draggableItem[0],
	            hi = this.hView.$el,
	            ind = this.dropIndicator,
	            hilevel = this.hView.model.get('id').split('_').length - 1,
	            cpos = $('table.table', $(dc_application.options.container)).offset();
	        if (di) {
	            if (di.cid == hi.cid) return false;
	            if (this.dropValidator !== null) {
	                DropMode = this.dropValidator(this.hView, this.draggableItem, DropMode);

	                if (DropMode === false) {
	                    return false;
	                }
	            }
	            if (DropMode == 'after') {
	                ind.style.top = hi.position().top + hi.height() + cpos.top + 'px';
	                ind.style.left = hi.position().left + cpos.left + (40 * (hilevel - 1)) + 'px';
	                ind.style.width = hi.width() - (40 * (hilevel - 1)) + 'px';
	            }
	            if (DropMode == 'before') {
	                ind.style.top = hi.position().top + cpos.top + ind.offsetHeight + 'px';
	                ind.style.left = hi.position().left + cpos.left + (40 * (hilevel - 1)) + 'px';
	                ind.style.width = hi.width() - (40 * (hilevel - 1)) + 'px';
	            }
	            if (DropMode == 'child') {
	                ind.style.top = hi.position().top + hi.height() + cpos.top + 'px';
	                ind.style.left = hi.position().left + cpos.left + (40 * hilevel) + 'px';
	                ind.style.width = hi.width() - (40 * hilevel) + 'px';
	            }

	            ind.style.display = 'block';
	        }
	    },

	    /**
	     * Выполняет сохранение данных после того как завершилось перемещение
	     * @param DropMode - режим вставки
	     * @param dItem - перемещаемый элемент
	     * @param hItem - элемент цель
	     * @returns {boolean}
	     */
	    tryToMove: function(DropMode, dItem, hItem) {
	        var that = this;

	        if (!dItem || !hItem || !that.hView) {
	            return false;
	        }

	        var parent = dItem[0].parent;

	        if (this.dropValidator !== null) {
	            DropMode = this.dropValidator(this.hView, this.draggableItem, DropMode);

	            if (DropMode === false) {
	                return false;
	            }

	            var selected = [];
	            var toRemove = [];
	            var toRemoveObj = [];

	            for (var i = 0, cnt = this.draggableItem.length; i < cnt; i++) {
	                selected.push({
	                    id: this.unPackId(this.draggableItem[i].model.get('id')),
	                    type: this.draggableItem[i].model.get('__type')
	                });
	                this.draggableItem[i].model.selected = false;
	                toRemove.push(this.draggableItem[i].model.attributes);
	                toRemoveObj.push(this.draggableItem[i].model);
	            }

	            this.runmethod('move_method', {
	                data: {
	                    rel: {
	                        id: this.unPackId(hItem.model.get('id')),
	                        type: hItem.model.get('__type')
	                    },
	                    selected_list: selected,
	                    mode: DropMode
	                }
	            }).done(function(res) {
	                if (!_.isUndefined(res['data']) && !_.isUndefined(res['data']['error'])) {
	                    return openDialog(res['data']['error'], getLabel('js-error-header'));
	                }

	                var cv = _.where(that.controlViews, {collection: hItem.model.attributes['children']});

	                if (DropMode === 'child' && cv.length > 0) {
	                    cv = cv[0];
	                    cv.collection.add(toRemove);
	                    cv.collection.sync();
	                    cv.render();
	                } else if (DropMode === 'child' && cv.length === 0) {
	                    hItem.model.set('__children', toRemove.length);
	                    hItem.render();
	                    $('.catalog-toggle-wrapper', hi).trigger('click');
	                } else {
	                    var collectionView = hItem._parent,
	                        nodeView = collectionView.parentView;

	                    if (!_.isEmpty(nodeView)) {
	                        _.each(collectionView.collection.models, function(model) {
	                            if (model) {
	                                model.clear();
	                            }
	                        });
	                        collectionView.remove();
	                        $('tr#' + nodeView.model.cid).remove();
	                        that.rowExpanded(nodeView);
	                    } else {
	                        that.refresh();
	                    }
	                }

	                if (parent.collection.length === 0) {
	                    return;
	                }

	                parent.collection.remove(toRemoveObj);

	                if (parent.collection.length === 0) {
	                    var container = parent.$el.closest('tr.umiDC');

	                    if (parent.parentView) {
	                        parent.parentView.model.set('__children', 0);
	                        parent.parentView.model.set('children', null);
	                        parent.parentView.model.expanded = false;
	                        parent.parentView.render();
	                    }

	                    parent.remove();
	                    container.remove();
	                }
	            });
	        }
	    }
	});
	var umiTableHeaderModel = Backbone.Model.extend({});
	window.umiDataController = umiDataController;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(__dirname, module) {/**
	 * Twig.js 0.8.9
	 *
	 * @copyright 2011-2015 John Roepke and the Twig.js Contributors
	 * @license   Available under the BSD 2-Clause License
	 * @link      https://github.com/justjohn/twig.js
	 */
	var Twig=function(Twig){Twig.VERSION="0.8.9";return Twig}(Twig||{});var Twig=function(Twig){"use strict";Twig.trace=false;Twig.debug=false;Twig.cache=true;Twig.placeholders={parent:"{{|PARENT|}}"};Twig.indexOf=function(arr,searchElement){if(Array.prototype.hasOwnProperty("indexOf")){return arr.indexOf(searchElement)}if(arr===void 0||arr===null){throw new TypeError}var t=Object(arr);var len=t.length>>>0;if(len===0){return-1}var n=0;if(arguments.length>0){n=Number(arguments[1]);if(n!==n){n=0}else if(n!==0&&n!==Infinity&&n!==-Infinity){n=(n>0||-1)*Math.floor(Math.abs(n))}}if(n>=len){return-1}var k=n>=0?n:Math.max(len-Math.abs(n),0);for(;k<len;k++){if(k in t&&t[k]===searchElement){return k}}if(arr==searchElement){return 0}return-1};Twig.forEach=function(arr,callback,thisArg){if(Array.prototype.forEach){return arr.forEach(callback,thisArg)}var T,k;if(arr==null){throw new TypeError(" this is null or not defined")}var O=Object(arr);var len=O.length>>>0;if({}.toString.call(callback)!="[object Function]"){throw new TypeError(callback+" is not a function")}if(thisArg){T=thisArg}k=0;while(k<len){var kValue;if(k in O){kValue=O[k];callback.call(T,kValue,k,O)}k++}};Twig.merge=function(target,source,onlyChanged){Twig.forEach(Object.keys(source),function(key){if(onlyChanged&&!(key in target)){return}target[key]=source[key]});return target};Twig.Error=function(message){this.message=message;this.name="TwigException";this.type="TwigException"};Twig.Error.prototype.toString=function(){var output=this.name+": "+this.message;return output};Twig.log={trace:function(){if(Twig.trace&&console){console.log(Array.prototype.slice.call(arguments))}},debug:function(){if(Twig.debug&&console){console.log(Array.prototype.slice.call(arguments))}}};if(typeof console!=="undefined"){if(typeof console.error!=="undefined"){Twig.log.error=function(){console.error.apply(console,arguments)}}else if(typeof console.log!=="undefined"){Twig.log.error=function(){console.log.apply(console,arguments)}}}else{Twig.log.error=function(){}}Twig.ChildContext=function(context){var ChildContext=function ChildContext(){};ChildContext.prototype=context;return new ChildContext};Twig.token={};Twig.token.type={output:"output",logic:"logic",comment:"comment",raw:"raw",output_whitespace_pre:"output_whitespace_pre",output_whitespace_post:"output_whitespace_post",output_whitespace_both:"output_whitespace_both",logic_whitespace_pre:"logic_whitespace_pre",logic_whitespace_post:"logic_whitespace_post",logic_whitespace_both:"logic_whitespace_both"};Twig.token.definitions=[{type:Twig.token.type.raw,open:"{% raw %}",close:"{% endraw %}"},{type:Twig.token.type.raw,open:"{% verbatim %}",close:"{% endverbatim %}"},{type:Twig.token.type.output_whitespace_pre,open:"{{-",close:"}}"},{type:Twig.token.type.output_whitespace_post,open:"{{",close:"-}}"},{type:Twig.token.type.output_whitespace_both,open:"{{-",close:"-}}"},{type:Twig.token.type.logic_whitespace_pre,open:"{%-",close:"%}"},{type:Twig.token.type.logic_whitespace_post,open:"{%",close:"-%}"},{type:Twig.token.type.logic_whitespace_both,open:"{%-",close:"-%}"},{type:Twig.token.type.output,open:"{{",close:"}}"},{type:Twig.token.type.logic,open:"{%",close:"%}"},{type:Twig.token.type.comment,open:"{#",close:"#}"}];Twig.token.strings=['"',"'"];Twig.token.findStart=function(template){var output={position:null,close_position:null,def:null},i,token_template,first_key_position,close_key_position;for(i=0;i<Twig.token.definitions.length;i++){token_template=Twig.token.definitions[i];first_key_position=template.indexOf(token_template.open);close_key_position=template.indexOf(token_template.close);Twig.log.trace("Twig.token.findStart: ","Searching for ",token_template.open," found at ",first_key_position);if(first_key_position>=0){if(token_template.open.length!==token_template.close.length){if(close_key_position<0){continue}}}if(first_key_position>=0&&(output.position===null||first_key_position<output.position)){output.position=first_key_position;output.def=token_template;output.close_position=close_key_position}else if(first_key_position>=0&&output.position!==null&&first_key_position===output.position){if(token_template.open.length>output.def.open.length){output.position=first_key_position;output.def=token_template;output.close_position=close_key_position}else if(token_template.open.length===output.def.open.length){if(token_template.close.length>output.def.close.length){if(close_key_position>=0&&close_key_position<output.close_position){output.position=first_key_position;output.def=token_template;output.close_position=close_key_position}}else if(close_key_position>=0&&close_key_position<output.close_position){output.position=first_key_position;output.def=token_template;output.close_position=close_key_position}}}}delete output["close_position"];return output};Twig.token.findEnd=function(template,token_def,start){var end=null,found=false,offset=0,str_pos=null,str_found=null,pos=null,end_offset=null,this_str_pos=null,end_str_pos=null,i,l;while(!found){str_pos=null;str_found=null;pos=template.indexOf(token_def.close,offset);if(pos>=0){end=pos;found=true}else{throw new Twig.Error("Unable to find closing bracket '"+token_def.close+"'"+" opened near template position "+start)}if(token_def.type===Twig.token.type.comment){break}if(token_def.type===Twig.token.type.raw){break}l=Twig.token.strings.length;for(i=0;i<l;i+=1){this_str_pos=template.indexOf(Twig.token.strings[i],offset);if(this_str_pos>0&&this_str_pos<pos&&(str_pos===null||this_str_pos<str_pos)){str_pos=this_str_pos;str_found=Twig.token.strings[i]}}if(str_pos!==null){end_offset=str_pos+1;end=null;found=false;while(true){end_str_pos=template.indexOf(str_found,end_offset);if(end_str_pos<0){throw"Unclosed string in template"}if(template.substr(end_str_pos-1,1)!=="\\"){offset=end_str_pos+1;break}else{end_offset=end_str_pos+1}}}}return end};Twig.tokenize=function(template){var tokens=[],error_offset=0,found_token=null,end=null;while(template.length>0){found_token=Twig.token.findStart(template);Twig.log.trace("Twig.tokenize: ","Found token: ",found_token);if(found_token.position!==null){if(found_token.position>0){tokens.push({type:Twig.token.type.raw,value:template.substring(0,found_token.position)})}template=template.substr(found_token.position+found_token.def.open.length);error_offset+=found_token.position+found_token.def.open.length;end=Twig.token.findEnd(template,found_token.def,error_offset);Twig.log.trace("Twig.tokenize: ","Token ends at ",end);tokens.push({type:found_token.def.type,value:template.substring(0,end).trim()});if(template.substr(end+found_token.def.close.length,1)==="\n"){switch(found_token.def.type){case"logic_whitespace_pre":case"logic_whitespace_post":case"logic_whitespace_both":case"logic":end+=1;break}}template=template.substr(end+found_token.def.close.length);error_offset+=end+found_token.def.close.length}else{tokens.push({type:Twig.token.type.raw,value:template});template=""}}return tokens};Twig.compile=function(tokens){try{var output=[],stack=[],intermediate_output=[],token=null,logic_token=null,unclosed_token=null,prev_token=null,prev_output=null,prev_intermediate_output=null,prev_template=null,next_token=null,tok_output=null,type=null,open=null,next=null;var compile_output=function(token){Twig.expression.compile.apply(this,[token]);if(stack.length>0){intermediate_output.push(token)}else{output.push(token)}};var compile_logic=function(token){logic_token=Twig.logic.compile.apply(this,[token]);type=logic_token.type;open=Twig.logic.handler[type].open;next=Twig.logic.handler[type].next;Twig.log.trace("Twig.compile: ","Compiled logic token to ",logic_token," next is: ",next," open is : ",open);if(open!==undefined&&!open){prev_token=stack.pop();prev_template=Twig.logic.handler[prev_token.type];if(Twig.indexOf(prev_template.next,type)<0){throw new Error(type+" not expected after a "+prev_token.type)}prev_token.output=prev_token.output||[];prev_token.output=prev_token.output.concat(intermediate_output);intermediate_output=[];tok_output={type:Twig.token.type.logic,token:prev_token};if(stack.length>0){intermediate_output.push(tok_output)}else{output.push(tok_output)}}if(next!==undefined&&next.length>0){Twig.log.trace("Twig.compile: ","Pushing ",logic_token," to logic stack.");if(stack.length>0){prev_token=stack.pop();prev_token.output=prev_token.output||[];prev_token.output=prev_token.output.concat(intermediate_output);stack.push(prev_token);intermediate_output=[]}stack.push(logic_token)}else if(open!==undefined&&open){tok_output={type:Twig.token.type.logic,token:logic_token};if(stack.length>0){intermediate_output.push(tok_output)}else{output.push(tok_output)}}};while(tokens.length>0){token=tokens.shift();prev_output=output[output.length-1];prev_intermediate_output=intermediate_output[intermediate_output.length-1];next_token=tokens[0];Twig.log.trace("Compiling token ",token);switch(token.type){case Twig.token.type.raw:if(stack.length>0){intermediate_output.push(token)}else{output.push(token)}break;case Twig.token.type.logic:compile_logic.call(this,token);break;case Twig.token.type.comment:break;case Twig.token.type.output:compile_output.call(this,token);break;case Twig.token.type.logic_whitespace_pre:case Twig.token.type.logic_whitespace_post:case Twig.token.type.logic_whitespace_both:case Twig.token.type.output_whitespace_pre:case Twig.token.type.output_whitespace_post:case Twig.token.type.output_whitespace_both:if(token.type!==Twig.token.type.output_whitespace_post&&token.type!==Twig.token.type.logic_whitespace_post){if(prev_output){if(prev_output.type===Twig.token.type.raw){output.pop();if(prev_output.value.match(/^\s*$/)===null){prev_output.value=prev_output.value.trim();output.push(prev_output)}}}if(prev_intermediate_output){if(prev_intermediate_output.type===Twig.token.type.raw){intermediate_output.pop();if(prev_intermediate_output.value.match(/^\s*$/)===null){prev_intermediate_output.value=prev_intermediate_output.value.trim();intermediate_output.push(prev_intermediate_output)}}}}switch(token.type){case Twig.token.type.output_whitespace_pre:case Twig.token.type.output_whitespace_post:case Twig.token.type.output_whitespace_both:compile_output.call(this,token);break;case Twig.token.type.logic_whitespace_pre:case Twig.token.type.logic_whitespace_post:case Twig.token.type.logic_whitespace_both:compile_logic.call(this,token);break}if(token.type!==Twig.token.type.output_whitespace_pre&&token.type!==Twig.token.type.logic_whitespace_pre){if(next_token){if(next_token.type===Twig.token.type.raw){tokens.shift();if(next_token.value.match(/^\s*$/)===null){next_token.value=next_token.value.trim();tokens.unshift(next_token)}}}}break}Twig.log.trace("Twig.compile: "," Output: ",output," Logic Stack: ",stack," Pending Output: ",intermediate_output)}if(stack.length>0){unclosed_token=stack.pop();throw new Error("Unable to find an end tag for "+unclosed_token.type+", expecting one of "+unclosed_token.next)}return output}catch(ex){Twig.log.error("Error compiling twig template "+this.id+": ");if(ex.stack){Twig.log.error(ex.stack)}else{Twig.log.error(ex.toString())}if(this.options.rethrow)throw ex}};Twig.parse=function(tokens,context){try{var output=[],chain=true,that=this;Twig.forEach(tokens,function parseToken(token){Twig.log.debug("Twig.parse: ","Parsing token: ",token);switch(token.type){case Twig.token.type.raw:output.push(Twig.filters.raw(token.value));break;case Twig.token.type.logic:var logic_token=token.token,logic=Twig.logic.parse.apply(that,[logic_token,context,chain]);if(logic.chain!==undefined){chain=logic.chain}if(logic.context!==undefined){context=logic.context}if(logic.output!==undefined){output.push(logic.output)}break;case Twig.token.type.comment:break;case Twig.token.type.output_whitespace_pre:case Twig.token.type.output_whitespace_post:case Twig.token.type.output_whitespace_both:case Twig.token.type.output:Twig.log.debug("Twig.parse: ","Output token: ",token.stack);output.push(Twig.expression.parse.apply(that,[token.stack,context]));break}});return Twig.output.apply(this,[output])}catch(ex){Twig.log.error("Error parsing twig template "+this.id+": ");if(ex.stack){Twig.log.error(ex.stack)}else{Twig.log.error(ex.toString())}if(this.options.rethrow)throw ex;if(Twig.debug){return ex.toString()}}};Twig.prepare=function(data){var tokens,raw_tokens;Twig.log.debug("Twig.prepare: ","Tokenizing ",data);raw_tokens=Twig.tokenize.apply(this,[data]);Twig.log.debug("Twig.prepare: ","Compiling ",raw_tokens);tokens=Twig.compile.apply(this,[raw_tokens]);Twig.log.debug("Twig.prepare: ","Compiled ",tokens);return tokens};Twig.output=function(output){if(!this.options.autoescape){return output.join("")}var strategy="html";if(typeof this.options.autoescape=="string")strategy=this.options.autoescape;var escaped_output=[];Twig.forEach(output,function(str){if(str&&(str.twig_markup!==true&&str.twig_markup!=strategy)){str=Twig.filters.escape(str,[strategy])}escaped_output.push(str)});return Twig.Markup(escaped_output.join(""))};Twig.Templates={loaders:{},parsers:{},registry:{}};Twig.validateId=function(id){if(id==="prototype"){throw new Twig.Error(id+" is not a valid twig identifier")}else if(Twig.cache&&Twig.Templates.registry.hasOwnProperty(id)){throw new Twig.Error("There is already a template with the ID "+id)}return true};Twig.Templates.registerLoader=function(method_name,func,scope){if(typeof func!=="function"){throw new Twig.Error("Unable to add loader for "+method_name+": Invalid function reference given.")}if(scope){func=func.bind(scope)}this.loaders[method_name]=func};Twig.Templates.unRegisterLoader=function(method_name){if(this.isRegisteredLoader(method_name)){delete this.loaders[method_name]}};Twig.Templates.isRegisteredLoader=function(method_name){return this.loaders.hasOwnProperty(method_name)};Twig.Templates.registerParser=function(method_name,func,scope){if(typeof func!=="function"){throw new Twig.Error("Unable to add parser for "+method_name+": Invalid function regerence given.")}if(scope){func=func.bind(scope)}this.parsers[method_name]=func};Twig.Templates.unRegisterParser=function(method_name){if(this.isRegisteredParser(method_name)){delete this.parsers[method_name]}};Twig.Templates.isRegisteredParser=function(method_name){return this.parsers.hasOwnProperty(method_name)};Twig.Templates.save=function(template){if(template.id===undefined){throw new Twig.Error("Unable to save template with no id")}Twig.Templates.registry[template.id]=template};Twig.Templates.load=function(id){if(!Twig.Templates.registry.hasOwnProperty(id)){return null}return Twig.Templates.registry[id]};Twig.Templates.loadRemote=function(location,params,callback,error_callback){var loader;if(params.async===undefined){params.async=true}if(params.id===undefined){params.id=location}if(Twig.cache&&Twig.Templates.registry.hasOwnProperty(params.id)){if(typeof callback==="function"){callback(Twig.Templates.registry[params.id])}return Twig.Templates.registry[params.id]}params.parser=params.parser||"twig";loader=this.loaders[params.method]||this.loaders.fs;return loader.apply(this,arguments)};function is(type,obj){var clas=Object.prototype.toString.call(obj).slice(8,-1);return obj!==undefined&&obj!==null&&clas===type}Twig.Template=function(params){var data=params.data,id=params.id,blocks=params.blocks,macros=params.macros||{},base=params.base,path=params.path,url=params.url,name=params.name,method=params.method,options=params.options;this.id=id;this.method=method;this.base=base;this.path=path;this.url=url;this.name=name;this.macros=macros;this.options=options;this.reset(blocks);if(is("String",data)){this.tokens=Twig.prepare.apply(this,[data])}else{this.tokens=data}if(id!==undefined){Twig.Templates.save(this)}};Twig.Template.prototype.reset=function(blocks){Twig.log.debug("Twig.Template.reset","Reseting template "+this.id);this.blocks={};this.importedBlocks=[];this.originalBlockTokens={};this.child={blocks:blocks||{}};this.extend=null};Twig.Template.prototype.render=function(context,params){params=params||{};var output,url;this.context=context||{};this.reset();if(params.blocks){this.blocks=params.blocks}if(params.macros){this.macros=params.macros}output=Twig.parse.apply(this,[this.tokens,this.context]);if(this.extend){var ext_template;if(this.options.allowInlineIncludes){ext_template=Twig.Templates.load(this.extend);if(ext_template){ext_template.options=this.options}}if(!ext_template){url=Twig.path.parsePath(this,this.extend);ext_template=Twig.Templates.loadRemote(url,{method:this.getLoaderMethod(),base:this.base,async:false,id:url,options:this.options})}this.parent=ext_template;return this.parent.render(this.context,{blocks:this.blocks})}if(params.output=="blocks"){return this.blocks}else if(params.output=="macros"){return this.macros}else{return output}};Twig.Template.prototype.importFile=function(file){var url,sub_template;if(!this.url&&this.options.allowInlineIncludes){file=this.path?this.path+"/"+file:file;sub_template=Twig.Templates.load(file);if(!sub_template){sub_template=Twig.Templates.loadRemote(url,{id:file,method:this.getLoaderMethod(),async:false,options:this.options});if(!sub_template){throw new Twig.Error("Unable to find the template "+file)}}sub_template.options=this.options;return sub_template}url=Twig.path.parsePath(this,file);sub_template=Twig.Templates.loadRemote(url,{method:this.getLoaderMethod(),base:this.base,async:false,options:this.options,id:url});return sub_template};Twig.Template.prototype.importBlocks=function(file,override){var sub_template=this.importFile(file),context=this.context,that=this,key;override=override||false;sub_template.render(context);Twig.forEach(Object.keys(sub_template.blocks),function(key){if(override||that.blocks[key]===undefined){that.blocks[key]=sub_template.blocks[key];that.importedBlocks.push(key)}})};Twig.Template.prototype.importMacros=function(file){var url=Twig.path.parsePath(this,file);var remoteTemplate=Twig.Templates.loadRemote(url,{method:this.getLoaderMethod(),async:false,id:url});return remoteTemplate};Twig.Template.prototype.getLoaderMethod=function(){if(this.path){return"fs"}if(this.url){return"ajax"}return this.method||"fs"};Twig.Template.prototype.compile=function(options){return Twig.compiler.compile(this,options)};Twig.Markup=function(content,strategy){if(typeof strategy=="undefined"){strategy=true}if(typeof content==="string"&&content.length>0){content=new String(content);content.twig_markup=strategy}return content};return Twig}(Twig||{});(function(Twig){"use strict";Twig.Templates.registerLoader("ajax",function(location,params,callback,error_callback){var template,xmlhttp,precompiled=params.precompiled,parser=this.parsers[params.parser]||this.parser.twig;if(typeof XMLHttpRequest==="undefined"){throw new Twig.Error("Unsupported platform: Unable to do ajax requests "+'because there is no "XMLHTTPRequest" implementation')}xmlhttp=new XMLHttpRequest;xmlhttp.onreadystatechange=function(){var data=null;if(xmlhttp.readyState===4){if(xmlhttp.status===200||window.cordova&&xmlhttp.status==0){Twig.log.debug("Got template ",xmlhttp.responseText);if(precompiled===true){data=JSON.parse(xmlhttp.responseText)}else{data=xmlhttp.responseText}params.url=location;params.data=data;template=parser.call(this,params);if(typeof callback==="function"){callback(template)}}else{if(typeof error_callback==="function"){error_callback(xmlhttp)}}}};xmlhttp.open("GET",location,!!params.async);xmlhttp.send();if(params.async){return true}else{return template}})})(Twig);(function(Twig){"use strict";var fs,path;try{fs=__webpack_require__(3);path=__webpack_require__(4)}catch(e){}Twig.Templates.registerLoader("fs",function(location,params,callback,error_callback){var template,data=null,precompiled=params.precompiled,parser=this.parsers[params.parser]||this.parser.twig;if(!fs||!path){throw new Twig.Error("Unsupported platform: Unable to load from file "+'because there is no "fs" or "path" implementation')}var loadTemplateFn=function(err,data){if(err){if(typeof error_callback==="function"){error_callback(err)}return}if(precompiled===true){data=JSON.parse(data)}params.data=data;params.path=params.path||location;template=parser.call(this,params);if(typeof callback==="function"){callback(template)}};params.path=params.path||location;if(params.async){fs.stat(params.path,function(err,stats){if(err||!stats.isFile()){throw new Twig.Error("Unable to find template file "+location)}fs.readFile(params.path,"utf8",loadTemplateFn)});return true}else{if(!fs.statSync(params.path).isFile()){throw new Twig.Error("Unable to find template file "+location)}data=fs.readFileSync(params.path,"utf8");loadTemplateFn(undefined,data);return template}})})(Twig);(function(Twig){"use strict";Twig.Templates.registerParser("source",function(params){return params.data||""})})(Twig);(function(Twig){"use strict";Twig.Templates.registerParser("twig",function(params){return new Twig.Template(params)})})(Twig);(function(){"use strict";if(!String.prototype.trim){String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")}}if(!Object.keys)Object.keys=function(o){if(o!==Object(o)){throw new TypeError("Object.keys called on non-object")}var ret=[],p;for(p in o)if(Object.prototype.hasOwnProperty.call(o,p))ret.push(p);return ret}})();var Twig=function(Twig){Twig.lib={};var sprintfLib=function(){var re={not_string:/[^s]/,number:/[diefg]/,json:/[j]/,not_json:/[^j]/,text:/^[^\x25]+/,modulo:/^\x25{2}/,placeholder:/^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijosuxX])/,key:/^([a-z_][a-z_\d]*)/i,key_access:/^\.([a-z_][a-z_\d]*)/i,index_access:/^\[(\d+)\]/,sign:/^[\+\-]/};function sprintf(){var key=arguments[0],cache=sprintf.cache;if(!(cache[key]&&cache.hasOwnProperty(key))){cache[key]=sprintf.parse(key)}return sprintf.format.call(null,cache[key],arguments)}sprintf.format=function(parse_tree,argv){var cursor=1,tree_length=parse_tree.length,node_type="",arg,output=[],i,k,match,pad,pad_character,pad_length,is_positive=true,sign="";for(i=0;i<tree_length;i++){node_type=get_type(parse_tree[i]);if(node_type==="string"){output[output.length]=parse_tree[i]}else if(node_type==="array"){match=parse_tree[i];if(match[2]){arg=argv[cursor];for(k=0;k<match[2].length;k++){if(!arg.hasOwnProperty(match[2][k])){throw new Error(sprintf("[sprintf] property '%s' does not exist",match[2][k]))}arg=arg[match[2][k]]}}else if(match[1]){arg=argv[match[1]]}else{arg=argv[cursor++]}if(get_type(arg)=="function"){arg=arg()}if(re.not_string.test(match[8])&&re.not_json.test(match[8])&&(get_type(arg)!="number"&&isNaN(arg))){throw new TypeError(sprintf("[sprintf] expecting number but found %s",get_type(arg)))}if(re.number.test(match[8])){is_positive=arg>=0}switch(match[8]){case"b":arg=arg.toString(2);break;case"c":arg=String.fromCharCode(arg);break;case"d":case"i":arg=parseInt(arg,10);break;case"j":arg=JSON.stringify(arg,null,match[6]?parseInt(match[6]):0);break;case"e":arg=match[7]?arg.toExponential(match[7]):arg.toExponential();break;case"f":arg=match[7]?parseFloat(arg).toFixed(match[7]):parseFloat(arg);break;case"g":arg=match[7]?parseFloat(arg).toPrecision(match[7]):parseFloat(arg);break;case"o":arg=arg.toString(8);break;case"s":arg=(arg=String(arg))&&match[7]?arg.substring(0,match[7]):arg;break;case"u":arg=arg>>>0;break;case"x":arg=arg.toString(16);break;case"X":arg=arg.toString(16).toUpperCase();break}if(re.json.test(match[8])){output[output.length]=arg}else{if(re.number.test(match[8])&&(!is_positive||match[3])){sign=is_positive?"+":"-";arg=arg.toString().replace(re.sign,"")}else{sign=""}pad_character=match[4]?match[4]==="0"?"0":match[4].charAt(1):" ";pad_length=match[6]-(sign+arg).length;pad=match[6]?pad_length>0?str_repeat(pad_character,pad_length):"":"";output[output.length]=match[5]?sign+arg+pad:pad_character==="0"?sign+pad+arg:pad+sign+arg}}}return output.join("")};sprintf.cache={};sprintf.parse=function(fmt){var _fmt=fmt,match=[],parse_tree=[],arg_names=0;while(_fmt){if((match=re.text.exec(_fmt))!==null){parse_tree[parse_tree.length]=match[0]}else if((match=re.modulo.exec(_fmt))!==null){parse_tree[parse_tree.length]="%"}else if((match=re.placeholder.exec(_fmt))!==null){if(match[2]){arg_names|=1;var field_list=[],replacement_field=match[2],field_match=[];if((field_match=re.key.exec(replacement_field))!==null){field_list[field_list.length]=field_match[1];while((replacement_field=replacement_field.substring(field_match[0].length))!==""){if((field_match=re.key_access.exec(replacement_field))!==null){field_list[field_list.length]=field_match[1]}else if((field_match=re.index_access.exec(replacement_field))!==null){field_list[field_list.length]=field_match[1]}else{throw new SyntaxError("[sprintf] failed to parse named argument key")}}}else{throw new SyntaxError("[sprintf] failed to parse named argument key")}match[2]=field_list}else{arg_names|=2}if(arg_names===3){throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported")}parse_tree[parse_tree.length]=match}else{throw new SyntaxError("[sprintf] unexpected placeholder")}_fmt=_fmt.substring(match[0].length)}return parse_tree};var vsprintf=function(fmt,argv,_argv){_argv=(argv||[]).slice(0);_argv.splice(0,0,fmt);return sprintf.apply(null,_argv)};function get_type(variable){return Object.prototype.toString.call(variable).slice(8,-1).toLowerCase()}function str_repeat(input,multiplier){return Array(multiplier+1).join(input)}return{sprintf:sprintf,vsprintf:vsprintf}}();var sprintf=sprintfLib.sprintf;var vsprintf=sprintfLib.vsprintf;Twig.lib.sprintf=sprintf;Twig.lib.vsprintf=vsprintf;(function(){var shortDays="Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",");var fullDays="Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(",");var shortMonths="Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(",");var fullMonths="January,February,March,April,May,June,July,August,September,October,November,December".split(",");function getOrdinalFor(intNum){return(intNum=Math.abs(intNum)%100)%10==1&&intNum!=11?"st":intNum%10==2&&intNum!=12?"nd":intNum%10==3&&intNum!=13?"rd":"th"}function getISO8601Year(aDate){var d=new Date(aDate.getFullYear()+1,0,4);if((d-aDate)/864e5<7&&(aDate.getDay()+6)%7<(d.getDay()+6)%7)return d.getFullYear();if(aDate.getMonth()>0||aDate.getDate()>=4)return aDate.getFullYear();return aDate.getFullYear()-((aDate.getDay()+6)%7-aDate.getDate()>2?1:0)}function getISO8601Week(aDate){var d=new Date(getISO8601Year(aDate),0,4);d.setDate(d.getDate()-(d.getDay()+6)%7);return parseInt((aDate-d)/6048e5)+1}Twig.lib.formatDate=function(date,format){if(typeof format!=="string"||/^\s*$/.test(format))return date+"";var jan1st=new Date(date.getFullYear(),0,1);var me=date;return format.replace(/[dDjlNSwzWFmMntLoYyaABgGhHisuU]/g,function(option){switch(option){case"d":return("0"+me.getDate()).replace(/^.+(..)$/,"$1");case"D":return shortDays[me.getDay()];case"j":return me.getDate();case"l":return fullDays[me.getDay()];case"N":return(me.getDay()+6)%7+1;case"S":return getOrdinalFor(me.getDate());case"w":return me.getDay();case"z":return Math.ceil((jan1st-me)/864e5);case"W":return("0"+getISO8601Week(me)).replace(/^.(..)$/,"$1");case"F":return fullMonths[me.getMonth()];case"m":return("0"+(me.getMonth()+1)).replace(/^.+(..)$/,"$1");case"M":return shortMonths[me.getMonth()];case"n":return me.getMonth()+1;case"t":return new Date(me.getFullYear(),me.getMonth()+1,-1).getDate();case"L":return new Date(me.getFullYear(),1,29).getDate()==29?1:0;case"o":return getISO8601Year(me);case"Y":return me.getFullYear();case"y":return(me.getFullYear()+"").replace(/^.+(..)$/,"$1");case"a":return me.getHours()<12?"am":"pm";case"A":return me.getHours()<12?"AM":"PM";case"B":return Math.floor(((me.getUTCHours()+1)%24+me.getUTCMinutes()/60+me.getUTCSeconds()/3600)*1e3/24);case"g":return me.getHours()%12!=0?me.getHours()%12:12;case"G":return me.getHours();case"h":return("0"+(me.getHours()%12!=0?me.getHours()%12:12)).replace(/^.+(..)$/,"$1");case"H":return("0"+me.getHours()).replace(/^.+(..)$/,"$1");case"i":return("0"+me.getMinutes()).replace(/^.+(..)$/,"$1");case"s":return("0"+me.getSeconds()).replace(/^.+(..)$/,"$1");case"u":return me.getMilliseconds();case"U":return me.getTime()/1e3}})}})();Twig.lib.strip_tags=function(input,allowed){allowed=(((allowed||"")+"").toLowerCase().match(/<[a-z][a-z0-9]*>/g)||[]).join("");var tags=/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,commentsAndPhpTags=/<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;return input.replace(commentsAndPhpTags,"").replace(tags,function($0,$1){return allowed.indexOf("<"+$1.toLowerCase()+">")>-1?$0:""})};Twig.lib.parseISO8601Date=function(s){var re=/(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(\.\d+)?(Z|([+-])(\d\d):(\d\d))/;var d=[];d=s.match(re);if(!d){throw"Couldn't parse ISO 8601 date string '"+s+"'"}var a=[1,2,3,4,5,6,10,11];for(var i in a){d[a[i]]=parseInt(d[a[i]],10)}d[7]=parseFloat(d[7]);var ms=Date.UTC(d[1],d[2]-1,d[3],d[4],d[5],d[6]);if(d[7]>0){ms+=Math.round(d[7]*1e3)}if(d[8]!="Z"&&d[10]){var offset=d[10]*60*60*1e3;if(d[11]){offset+=d[11]*60*1e3}if(d[9]=="-"){ms-=offset}else{ms+=offset}}return new Date(ms)};Twig.lib.strtotime=function(text,now){var parsed,match,today,year,date,days,ranges,len,times,regex,i,fail=false;if(!text){return fail}text=text.replace(/^\s+|\s+$/g,"").replace(/\s{2,}/g," ").replace(/[\t\r\n]/g,"").toLowerCase();match=text.match(/^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/);if(match&&match[2]===match[4]){if(match[1]>1901){switch(match[2]){case"-":{if(match[3]>12||match[5]>31){return fail}return new Date(match[1],parseInt(match[3],10)-1,match[5],match[6]||0,match[7]||0,match[8]||0,match[9]||0)/1e3}case".":{return fail}case"/":{if(match[3]>12||match[5]>31){return fail}return new Date(match[1],parseInt(match[3],10)-1,match[5],match[6]||0,match[7]||0,match[8]||0,match[9]||0)/1e3}}}else if(match[5]>1901){switch(match[2]){case"-":{if(match[3]>12||match[1]>31){return fail}return new Date(match[5],parseInt(match[3],10)-1,match[1],match[6]||0,match[7]||0,match[8]||0,match[9]||0)/1e3}case".":{if(match[3]>12||match[1]>31){return fail}return new Date(match[5],parseInt(match[3],10)-1,match[1],match[6]||0,match[7]||0,match[8]||0,match[9]||0)/1e3}case"/":{if(match[1]>12||match[3]>31){return fail}return new Date(match[5],parseInt(match[1],10)-1,match[3],match[6]||0,match[7]||0,match[8]||0,match[9]||0)/1e3}}}else{switch(match[2]){case"-":{if(match[3]>12||match[5]>31||match[1]<70&&match[1]>38){return fail}year=match[1]>=0&&match[1]<=38?+match[1]+2e3:match[1];return new Date(year,parseInt(match[3],10)-1,match[5],match[6]||0,match[7]||0,match[8]||0,match[9]||0)/1e3}case".":{if(match[5]>=70){if(match[3]>12||match[1]>31){return fail}return new Date(match[5],parseInt(match[3],10)-1,match[1],match[6]||0,match[7]||0,match[8]||0,match[9]||0)/1e3}if(match[5]<60&&!match[6]){if(match[1]>23||match[3]>59){return fail}today=new Date;return new Date(today.getFullYear(),today.getMonth(),today.getDate(),match[1]||0,match[3]||0,match[5]||0,match[9]||0)/1e3}return fail}case"/":{if(match[1]>12||match[3]>31||match[5]<70&&match[5]>38){return fail}year=match[5]>=0&&match[5]<=38?+match[5]+2e3:match[5];return new Date(year,parseInt(match[1],10)-1,match[3],match[6]||0,match[7]||0,match[8]||0,match[9]||0)/1e3}case":":{if(match[1]>23||match[3]>59||match[5]>59){return fail}today=new Date;return new Date(today.getFullYear(),today.getMonth(),today.getDate(),match[1]||0,match[3]||0,match[5]||0)/1e3}}}}if(text==="now"){return now===null||isNaN(now)?(new Date).getTime()/1e3|0:now|0}if(!isNaN(parsed=Date.parse(text))){return parsed/1e3|0}if(match=text.match(/^([0-9]{4}-[0-9]{2}-[0-9]{2})[ t]([0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?)([\+-][0-9]{2}(:[0-9]{2})?|z)/)){if(match[4]=="z"){match[4]="Z"}else if(match[4].match(/^([\+-][0-9]{2})$/)){match[4]=match[4]+":00"}if(!isNaN(parsed=Date.parse(match[1]+"T"+match[2]+match[4]))){return parsed/1e3|0}}date=now?new Date(now*1e3):new Date;days={sun:0,mon:1,tue:2,wed:3,thu:4,fri:5,sat:6};ranges={yea:"FullYear",mon:"Month",day:"Date",hou:"Hours",min:"Minutes",sec:"Seconds"};function lastNext(type,range,modifier){
	var diff,day=days[range];if(typeof day!=="undefined"){diff=day-date.getDay();if(diff===0){diff=7*modifier}else if(diff>0&&type==="last"){diff-=7}else if(diff<0&&type==="next"){diff+=7}date.setDate(date.getDate()+diff)}}function process(val){var splt=val.split(" "),type=splt[0],range=splt[1].substring(0,3),typeIsNumber=/\d+/.test(type),ago=splt[2]==="ago",num=(type==="last"?-1:1)*(ago?-1:1);if(typeIsNumber){num*=parseInt(type,10)}if(ranges.hasOwnProperty(range)&&!splt[1].match(/^mon(day|\.)?$/i)){return date["set"+ranges[range]](date["get"+ranges[range]]()+num)}if(range==="wee"){return date.setDate(date.getDate()+num*7)}if(type==="next"||type==="last"){lastNext(type,range,num)}else if(!typeIsNumber){return false}return true}times="(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec"+"|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?"+"|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)";regex="([+-]?\\d+\\s"+times+"|"+"(last|next)\\s"+times+")(\\sago)?";match=text.match(new RegExp(regex,"gi"));if(!match){return fail}for(i=0,len=match.length;i<len;i++){if(!process(match[i])){return fail}}return date.getTime()/1e3};Twig.lib.is=function(type,obj){var clas=Object.prototype.toString.call(obj).slice(8,-1);return obj!==undefined&&obj!==null&&clas===type};Twig.lib.copy=function(src){var target={},key;for(key in src)target[key]=src[key];return target};Twig.lib.replaceAll=function(string,search,replace){return string.split(search).join(replace)};Twig.lib.chunkArray=function(arr,size){var returnVal=[],x=0,len=arr.length;if(size<1||!Twig.lib.is("Array",arr)){return[]}while(x<len){returnVal.push(arr.slice(x,x+=size))}return returnVal};Twig.lib.round=function round(value,precision,mode){var m,f,isHalf,sgn;precision|=0;m=Math.pow(10,precision);value*=m;sgn=value>0|-(value<0);isHalf=value%1===.5*sgn;f=Math.floor(value);if(isHalf){switch(mode){case"PHP_ROUND_HALF_DOWN":value=f+(sgn<0);break;case"PHP_ROUND_HALF_EVEN":value=f+f%2*sgn;break;case"PHP_ROUND_HALF_ODD":value=f+!(f%2);break;default:value=f+(sgn>0)}}return(isHalf?value:Math.round(value))/m};Twig.lib.max=function max(){var ar,retVal,i=0,n=0,argv=arguments,argc=argv.length,_obj2Array=function(obj){if(Object.prototype.toString.call(obj)==="[object Array]"){return obj}else{var ar=[];for(var i in obj){if(obj.hasOwnProperty(i)){ar.push(obj[i])}}return ar}},_compare=function(current,next){var i=0,n=0,tmp=0,nl=0,cl=0;if(current===next){return 0}else if(typeof current==="object"){if(typeof next==="object"){current=_obj2Array(current);next=_obj2Array(next);cl=current.length;nl=next.length;if(nl>cl){return 1}else if(nl<cl){return-1}for(i=0,n=cl;i<n;++i){tmp=_compare(current[i],next[i]);if(tmp==1){return 1}else if(tmp==-1){return-1}}return 0}return-1}else if(typeof next==="object"){return 1}else if(isNaN(next)&&!isNaN(current)){if(current==0){return 0}return current<0?1:-1}else if(isNaN(current)&&!isNaN(next)){if(next==0){return 0}return next>0?1:-1}if(next==current){return 0}return next>current?1:-1};if(argc===0){throw new Error("At least one value should be passed to max()")}else if(argc===1){if(typeof argv[0]==="object"){ar=_obj2Array(argv[0])}else{throw new Error("Wrong parameter count for max()")}if(ar.length===0){throw new Error("Array must contain at least one element for max()")}}else{ar=argv}retVal=ar[0];for(i=1,n=ar.length;i<n;++i){if(_compare(retVal,ar[i])==1){retVal=ar[i]}}return retVal};Twig.lib.min=function min(){var ar,retVal,i=0,n=0,argv=arguments,argc=argv.length,_obj2Array=function(obj){if(Object.prototype.toString.call(obj)==="[object Array]"){return obj}var ar=[];for(var i in obj){if(obj.hasOwnProperty(i)){ar.push(obj[i])}}return ar},_compare=function(current,next){var i=0,n=0,tmp=0,nl=0,cl=0;if(current===next){return 0}else if(typeof current==="object"){if(typeof next==="object"){current=_obj2Array(current);next=_obj2Array(next);cl=current.length;nl=next.length;if(nl>cl){return 1}else if(nl<cl){return-1}for(i=0,n=cl;i<n;++i){tmp=_compare(current[i],next[i]);if(tmp==1){return 1}else if(tmp==-1){return-1}}return 0}return-1}else if(typeof next==="object"){return 1}else if(isNaN(next)&&!isNaN(current)){if(current==0){return 0}return current<0?1:-1}else if(isNaN(current)&&!isNaN(next)){if(next==0){return 0}return next>0?1:-1}if(next==current){return 0}return next>current?1:-1};if(argc===0){throw new Error("At least one value should be passed to min()")}else if(argc===1){if(typeof argv[0]==="object"){ar=_obj2Array(argv[0])}else{throw new Error("Wrong parameter count for min()")}if(ar.length===0){throw new Error("Array must contain at least one element for min()")}}else{ar=argv}retVal=ar[0];for(i=1,n=ar.length;i<n;++i){if(_compare(retVal,ar[i])==-1){retVal=ar[i]}}return retVal};return Twig}(Twig||{});var Twig=function(Twig){"use strict";Twig.logic={};Twig.logic.type={if_:"Twig.logic.type.if",endif:"Twig.logic.type.endif",for_:"Twig.logic.type.for",endfor:"Twig.logic.type.endfor",else_:"Twig.logic.type.else",elseif:"Twig.logic.type.elseif",set:"Twig.logic.type.set",setcapture:"Twig.logic.type.setcapture",endset:"Twig.logic.type.endset",filter:"Twig.logic.type.filter",endfilter:"Twig.logic.type.endfilter",shortblock:"Twig.logic.type.shortblock",block:"Twig.logic.type.block",endblock:"Twig.logic.type.endblock",extends_:"Twig.logic.type.extends",use:"Twig.logic.type.use",include:"Twig.logic.type.include",spaceless:"Twig.logic.type.spaceless",endspaceless:"Twig.logic.type.endspaceless",macro:"Twig.logic.type.macro",endmacro:"Twig.logic.type.endmacro",import_:"Twig.logic.type.import",from:"Twig.logic.type.from",embed:"Twig.logic.type.embed",endembed:"Twig.logic.type.endembed"};Twig.logic.definitions=[{type:Twig.logic.type.if_,regex:/^if\s+([\s\S]+)$/,next:[Twig.logic.type.else_,Twig.logic.type.elseif,Twig.logic.type.endif],open:true,compile:function(token){var expression=token.match[1];token.stack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:expression}]).stack;delete token.match;return token},parse:function(token,context,chain){var output="",result=Twig.expression.parse.apply(this,[token.stack,context]);chain=true;if(result){chain=false;output=Twig.parse.apply(this,[token.output,context])}return{chain:chain,output:output}}},{type:Twig.logic.type.elseif,regex:/^elseif\s+([^\s].*)$/,next:[Twig.logic.type.else_,Twig.logic.type.elseif,Twig.logic.type.endif],open:false,compile:function(token){var expression=token.match[1];token.stack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:expression}]).stack;delete token.match;return token},parse:function(token,context,chain){var output="";if(chain&&Twig.expression.parse.apply(this,[token.stack,context])===true){chain=false;output=Twig.parse.apply(this,[token.output,context])}return{chain:chain,output:output}}},{type:Twig.logic.type.else_,regex:/^else$/,next:[Twig.logic.type.endif,Twig.logic.type.endfor],open:false,parse:function(token,context,chain){var output="";if(chain){output=Twig.parse.apply(this,[token.output,context])}return{chain:chain,output:output}}},{type:Twig.logic.type.endif,regex:/^endif$/,next:[],open:false},{type:Twig.logic.type.for_,regex:/^for\s+([a-zA-Z0-9_,\s]+)\s+in\s+([^\s].*?)(?:\s+if\s+([^\s].*))?$/,next:[Twig.logic.type.else_,Twig.logic.type.endfor],open:true,compile:function(token){var key_value=token.match[1],expression=token.match[2],conditional=token.match[3],kv_split=null;token.key_var=null;token.value_var=null;if(key_value.indexOf(",")>=0){kv_split=key_value.split(",");if(kv_split.length===2){token.key_var=kv_split[0].trim();token.value_var=kv_split[1].trim()}else{throw new Twig.Error("Invalid expression in for loop: "+key_value)}}else{token.value_var=key_value}token.expression=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:expression}]).stack;if(conditional){token.conditional=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:conditional}]).stack}delete token.match;return token},parse:function(token,context,continue_chain){var result=Twig.expression.parse.apply(this,[token.expression,context]),output=[],len,index=0,keyset,that=this,conditional=token.conditional,buildLoop=function(index,len){var isConditional=conditional!==undefined;return{index:index+1,index0:index,revindex:isConditional?undefined:len-index,revindex0:isConditional?undefined:len-index-1,first:index===0,last:isConditional?undefined:index===len-1,length:isConditional?undefined:len,parent:context}},loop=function(key,value){var inner_context=Twig.ChildContext(context);inner_context[token.value_var]=value;if(token.key_var){inner_context[token.key_var]=key}inner_context.loop=buildLoop(index,len);if(conditional===undefined||Twig.expression.parse.apply(that,[conditional,inner_context])){output.push(Twig.parse.apply(that,[token.output,inner_context]));index+=1}delete inner_context["loop"];delete inner_context[token.value_var];delete inner_context[token.key_var];Twig.merge(context,inner_context,true)};if(Twig.lib.is("Array",result)){len=result.length;Twig.forEach(result,function(value){var key=index;loop(key,value)})}else if(Twig.lib.is("Object",result)){if(result._keys!==undefined){keyset=result._keys}else{keyset=Object.keys(result)}len=keyset.length;Twig.forEach(keyset,function(key){if(key==="_keys")return;loop(key,result[key])})}continue_chain=output.length===0;return{chain:continue_chain,output:Twig.output.apply(this,[output])}}},{type:Twig.logic.type.endfor,regex:/^endfor$/,next:[],open:false},{type:Twig.logic.type.set,regex:/^set\s+([a-zA-Z0-9_,\s]+)\s*=\s*([\s\S]+)$/,next:[],open:true,compile:function(token){var key=token.match[1].trim(),expression=token.match[2],expression_stack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:expression}]).stack;token.key=key;token.expression=expression_stack;delete token.match;return token},parse:function(token,context,continue_chain){var value=Twig.expression.parse.apply(this,[token.expression,context]),key=token.key;context[key]=value;return{chain:continue_chain,context:context}}},{type:Twig.logic.type.setcapture,regex:/^set\s+([a-zA-Z0-9_,\s]+)$/,next:[Twig.logic.type.endset],open:true,compile:function(token){var key=token.match[1].trim();token.key=key;delete token.match;return token},parse:function(token,context,continue_chain){var value=Twig.parse.apply(this,[token.output,context]),key=token.key;this.context[key]=value;context[key]=value;return{chain:continue_chain,context:context}}},{type:Twig.logic.type.endset,regex:/^endset$/,next:[],open:false},{type:Twig.logic.type.filter,regex:/^filter\s+(.+)$/,next:[Twig.logic.type.endfilter],open:true,compile:function(token){var expression="|"+token.match[1].trim();token.stack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:expression}]).stack;delete token.match;return token},parse:function(token,context,chain){var unfiltered=Twig.parse.apply(this,[token.output,context]),stack=[{type:Twig.expression.type.string,value:unfiltered}].concat(token.stack);var output=Twig.expression.parse.apply(this,[stack,context]);return{chain:chain,output:output}}},{type:Twig.logic.type.endfilter,regex:/^endfilter$/,next:[],open:false},{type:Twig.logic.type.block,regex:/^block\s+([a-zA-Z0-9_]+)$/,next:[Twig.logic.type.endblock],open:true,compile:function(token){token.block=token.match[1].trim();delete token.match;return token},parse:function(token,context,chain){var block_output,output,isImported=Twig.indexOf(this.importedBlocks,token.block)>-1,hasParent=this.blocks[token.block]&&Twig.indexOf(this.blocks[token.block],Twig.placeholders.parent)>-1;if(this.blocks[token.block]===undefined||isImported||hasParent||context.loop||token.overwrite){if(token.expression){block_output=Twig.expression.parse.apply(this,[{type:Twig.expression.type.string,value:Twig.expression.parse.apply(this,[token.output,context])},context])}else{block_output=Twig.expression.parse.apply(this,[{type:Twig.expression.type.string,value:Twig.parse.apply(this,[token.output,context])},context])}if(isImported){this.importedBlocks.splice(this.importedBlocks.indexOf(token.block),1)}if(hasParent){this.blocks[token.block]=Twig.Markup(this.blocks[token.block].replace(Twig.placeholders.parent,block_output))}else{this.blocks[token.block]=block_output}this.originalBlockTokens[token.block]={type:token.type,block:token.block,output:token.output,overwrite:true}}if(this.child.blocks[token.block]){output=this.child.blocks[token.block]}else{output=this.blocks[token.block]}return{chain:chain,output:output}}},{type:Twig.logic.type.shortblock,regex:/^block\s+([a-zA-Z0-9_]+)\s+(.+)$/,next:[],open:true,compile:function(token){token.expression=token.match[2].trim();token.output=Twig.expression.compile({type:Twig.expression.type.expression,value:token.expression}).stack;token.block=token.match[1].trim();delete token.match;return token},parse:function(token,context,chain){return Twig.logic.handler[Twig.logic.type.block].parse.apply(this,arguments)}},{type:Twig.logic.type.endblock,regex:/^endblock(?:\s+([a-zA-Z0-9_]+))?$/,next:[],open:false},{type:Twig.logic.type.extends_,regex:/^extends\s+(.+)$/,next:[],open:true,compile:function(token){var expression=token.match[1].trim();delete token.match;token.stack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:expression}]).stack;return token},parse:function(token,context,chain){var file=Twig.expression.parse.apply(this,[token.stack,context]);this.extend=file;return{chain:chain,output:""}}},{type:Twig.logic.type.use,regex:/^use\s+(.+)$/,next:[],open:true,compile:function(token){var expression=token.match[1].trim();delete token.match;token.stack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:expression}]).stack;return token},parse:function(token,context,chain){var file=Twig.expression.parse.apply(this,[token.stack,context]);this.importBlocks(file);return{chain:chain,output:""}}},{type:Twig.logic.type.include,regex:/^include\s+(ignore missing\s+)?(.+?)\s*(?:with\s+([\S\s]+?))?\s*(only)?$/,next:[],open:true,compile:function(token){var match=token.match,includeMissing=match[1]!==undefined,expression=match[2].trim(),withContext=match[3],only=match[4]!==undefined&&match[4].length;delete token.match;token.only=only;token.includeMissing=includeMissing;token.stack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:expression}]).stack;if(withContext!==undefined){token.withStack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:withContext.trim()}]).stack}return token},parse:function(token,context,chain){var innerContext={},withContext,i,template;if(!token.only){innerContext=Twig.ChildContext(context)}if(token.withStack!==undefined){withContext=Twig.expression.parse.apply(this,[token.withStack,context]);for(i in withContext){if(withContext.hasOwnProperty(i))innerContext[i]=withContext[i]}}var file=Twig.expression.parse.apply(this,[token.stack,innerContext]);if(file instanceof Twig.Template){template=file}else{template=this.importFile(file)}return{chain:chain,output:template.render(innerContext)}}},{type:Twig.logic.type.spaceless,regex:/^spaceless$/,next:[Twig.logic.type.endspaceless],open:true,parse:function(token,context,chain){var unfiltered=Twig.parse.apply(this,[token.output,context]),rBetweenTagSpaces=/>\s+</g,output=unfiltered.replace(rBetweenTagSpaces,"><").trim();return{chain:chain,output:output}}},{type:Twig.logic.type.endspaceless,regex:/^endspaceless$/,next:[],open:false},{type:Twig.logic.type.macro,regex:/^macro\s+([a-zA-Z0-9_]+)\s*\(\s*((?:[a-zA-Z0-9_]+(?:,\s*)?)*)\s*\)$/,next:[Twig.logic.type.endmacro],open:true,compile:function(token){var macroName=token.match[1],parameters=token.match[2].split(/[\s,]+/);for(var i=0;i<parameters.length;i++){for(var j=0;j<parameters.length;j++){if(parameters[i]===parameters[j]&&i!==j){throw new Twig.Error("Duplicate arguments for parameter: "+parameters[i])}}}token.macroName=macroName;token.parameters=parameters;delete token.match;return token},parse:function(token,context,chain){var template=this;this.macros[token.macroName]=function(){var macroContext={_self:template.macros};for(var i=0;i<token.parameters.length;i++){var prop=token.parameters[i];if(typeof arguments[i]!=="undefined"){macroContext[prop]=arguments[i]}else{macroContext[prop]=undefined}}return Twig.parse.apply(template,[token.output,macroContext])};return{chain:chain,output:""}}},{type:Twig.logic.type.endmacro,regex:/^endmacro$/,next:[],open:false},{type:Twig.logic.type.import_,regex:/^import\s+(.+)\s+as\s+([a-zA-Z0-9_]+)$/,next:[],open:true,compile:function(token){var expression=token.match[1].trim(),contextName=token.match[2].trim();delete token.match;token.expression=expression;token.contextName=contextName;token.stack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:expression}]).stack;return token},parse:function(token,context,chain){if(token.expression!=="_self"){var file=Twig.expression.parse.apply(this,[token.stack,context]);var template=this.importFile(file||token.expression);context[token.contextName]=template.render({},{output:"macros"})}else{context[token.contextName]=this.macros}return{chain:chain,output:""}}},{type:Twig.logic.type.from,regex:/^from\s+(.+)\s+import\s+([a-zA-Z0-9_, ]+)$/,next:[],open:true,compile:function(token){var expression=token.match[1].trim(),macroExpressions=token.match[2].trim().split(/[ ,]+/),macroNames={};for(var i=0;i<macroExpressions.length;i++){var res=macroExpressions[i];var macroMatch=res.match(/^([a-zA-Z0-9_]+)\s+(.+)\s+as\s+([a-zA-Z0-9_]+)$/);if(macroMatch){macroNames[macroMatch[1].trim()]=macroMatch[2].trim()}else if(res.match(/^([a-zA-Z0-9_]+)$/)){macroNames[res]=res}else{}}delete token.match;token.expression=expression;token.macroNames=macroNames;token.stack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:expression}]).stack;return token},parse:function(token,context,chain){var macros;if(token.expression!=="_self"){var file=Twig.expression.parse.apply(this,[token.stack,context]);var template=this.importFile(file||token.expression);macros=template.render({},{output:"macros"})}else{macros=this.macros}for(var macroName in token.macroNames){if(macros.hasOwnProperty(macroName)){context[token.macroNames[macroName]]=macros[macroName]}}return{chain:chain,output:""}}},{type:Twig.logic.type.embed,regex:/^embed\s+(ignore missing\s+)?(.+?)\s*(?:with\s+(.+?))?\s*(only)?$/,next:[Twig.logic.type.endembed],open:true,compile:function(token){var match=token.match,includeMissing=match[1]!==undefined,expression=match[2].trim(),withContext=match[3],only=match[4]!==undefined&&match[4].length;delete token.match;token.only=only;token.includeMissing=includeMissing;token.stack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:expression}]).stack;if(withContext!==undefined){token.withStack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:withContext.trim()}]).stack}return token},parse:function(token,context,chain){var innerContext={},withContext,i,template;if(!token.only){for(i in context){if(context.hasOwnProperty(i))innerContext[i]=context[i]}}if(token.withStack!==undefined){withContext=Twig.expression.parse.apply(this,[token.withStack,context]);for(i in withContext){if(withContext.hasOwnProperty(i))innerContext[i]=withContext[i]}}var file=Twig.expression.parse.apply(this,[token.stack,innerContext]);if(file instanceof Twig.Template){template=file}else{template=this.importFile(file)}this.blocks={};var output=Twig.parse.apply(this,[token.output,innerContext]);return{chain:chain,output:template.render(innerContext,{blocks:this.blocks})}}},{type:Twig.logic.type.endembed,regex:/^endembed$/,next:[],open:false}];Twig.logic.handler={};Twig.logic.extendType=function(type,value){value=value||"Twig.logic.type"+type;Twig.logic.type[type]=value};Twig.logic.extend=function(definition){if(!definition.type){throw new Twig.Error("Unable to extend logic definition. No type provided for "+definition)}else{Twig.logic.extendType(definition.type)}Twig.logic.handler[definition.type]=definition};while(Twig.logic.definitions.length>0){Twig.logic.extend(Twig.logic.definitions.shift())}Twig.logic.compile=function(raw_token){var expression=raw_token.value.trim(),token=Twig.logic.tokenize.apply(this,[expression]),token_template=Twig.logic.handler[token.type];if(token_template.compile){token=token_template.compile.apply(this,[token]);Twig.log.trace("Twig.logic.compile: ","Compiled logic token to ",token)}return token};Twig.logic.tokenize=function(expression){var token={},token_template_type=null,token_type=null,token_regex=null,regex_array=null,regex=null,match=null;expression=expression.trim();for(token_template_type in Twig.logic.handler){if(Twig.logic.handler.hasOwnProperty(token_template_type)){token_type=Twig.logic.handler[token_template_type].type;token_regex=Twig.logic.handler[token_template_type].regex;regex_array=[];if(token_regex instanceof Array){regex_array=token_regex}else{regex_array.push(token_regex)}while(regex_array.length>0){regex=regex_array.shift();match=regex.exec(expression.trim());if(match!==null){token.type=token_type;token.match=match;Twig.log.trace("Twig.logic.tokenize: ","Matched a ",token_type," regular expression of ",match);return token}}}}throw new Twig.Error("Unable to parse '"+expression.trim()+"'")};Twig.logic.parse=function(token,context,chain){var output="",token_template;context=context||{};Twig.log.debug("Twig.logic.parse: ","Parsing logic token ",token);token_template=Twig.logic.handler[token.type];if(token_template.parse){output=token_template.parse.apply(this,[token,context,chain])}return output};return Twig}(Twig||{});var Twig=function(Twig){"use strict";Twig.expression={};Twig.expression.reservedWords=["true","false","null","TRUE","FALSE","NULL","_context"];Twig.expression.type={comma:"Twig.expression.type.comma",operator:{unary:"Twig.expression.type.operator.unary",binary:"Twig.expression.type.operator.binary"},string:"Twig.expression.type.string",bool:"Twig.expression.type.bool",array:{start:"Twig.expression.type.array.start",end:"Twig.expression.type.array.end"},object:{start:"Twig.expression.type.object.start",end:"Twig.expression.type.object.end"},parameter:{start:"Twig.expression.type.parameter.start",end:"Twig.expression.type.parameter.end"},key:{period:"Twig.expression.type.key.period",brackets:"Twig.expression.type.key.brackets"},filter:"Twig.expression.type.filter",_function:"Twig.expression.type._function",variable:"Twig.expression.type.variable",number:"Twig.expression.type.number",_null:"Twig.expression.type.null",context:"Twig.expression.type.context",test:"Twig.expression.type.test"};Twig.expression.set={operations:[Twig.expression.type.filter,Twig.expression.type.operator.unary,Twig.expression.type.operator.binary,Twig.expression.type.array.end,Twig.expression.type.object.end,Twig.expression.type.parameter.end,Twig.expression.type.comma,Twig.expression.type.test],expressions:[Twig.expression.type._function,Twig.expression.type.bool,Twig.expression.type.string,Twig.expression.type.variable,Twig.expression.type.number,Twig.expression.type._null,Twig.expression.type.context,Twig.expression.type.parameter.start,Twig.expression.type.array.start,Twig.expression.type.object.start]};Twig.expression.set.operations_extended=Twig.expression.set.operations.concat([Twig.expression.type.key.period,Twig.expression.type.key.brackets]);Twig.expression.fn={compile:{push:function(token,stack,output){output.push(token)},push_both:function(token,stack,output){output.push(token);stack.push(token)}},parse:{push:function(token,stack,context){stack.push(token)},push_value:function(token,stack,context){stack.push(token.value)}}};Twig.expression.definitions=[{type:Twig.expression.type.test,regex:/^is\s+(not)?\s*([a-zA-Z_][a-zA-Z0-9_]*)/,next:Twig.expression.set.operations.concat([Twig.expression.type.parameter.start]),compile:function(token,stack,output){token.filter=token.match[2];token.modifier=token.match[1];delete token.match;delete token.value;output.push(token)},parse:function(token,stack,context){var value=stack.pop(),params=token.params&&Twig.expression.parse.apply(this,[token.params,context]),result=Twig.test(token.filter,value,params);if(token.modifier=="not"){stack.push(!result)}else{stack.push(result)}}},{type:Twig.expression.type.comma,regex:/^,/,next:Twig.expression.set.expressions.concat([Twig.expression.type.array.end,Twig.expression.type.object.end]),compile:function(token,stack,output){var i=stack.length-1,stack_token;delete token.match;delete token.value;for(;i>=0;i--){stack_token=stack.pop();if(stack_token.type===Twig.expression.type.object.start||stack_token.type===Twig.expression.type.parameter.start||stack_token.type===Twig.expression.type.array.start){stack.push(stack_token);break}output.push(stack_token)}output.push(token)}},{type:Twig.expression.type.operator.binary,regex:/(^[\+\-~%\?\:]|^[!=]==?|^[!<>]=?|^\*\*?|^\/\/?|^and\s+|^or\s+|^in\s+|^not in\s+|^\.\.)/,next:Twig.expression.set.expressions.concat([Twig.expression.type.operator.unary]),compile:function(token,stack,output){delete token.match;token.value=token.value.trim();var value=token.value,operator=Twig.expression.operator.lookup(value,token);Twig.log.trace("Twig.expression.compile: ","Operator: ",operator," from ",value);while(stack.length>0&&(stack[stack.length-1].type==Twig.expression.type.operator.unary||stack[stack.length-1].type==Twig.expression.type.operator.binary)&&(operator.associativity===Twig.expression.operator.leftToRight&&operator.precidence>=stack[stack.length-1].precidence||operator.associativity===Twig.expression.operator.rightToLeft&&operator.precidence>stack[stack.length-1].precidence)){var temp=stack.pop();output.push(temp)}if(value===":"){if(stack[stack.length-1]&&stack[stack.length-1].value==="?"){}else{var key_token=output.pop();if(key_token.type===Twig.expression.type.string||key_token.type===Twig.expression.type.variable){token.key=key_token.value}else if(key_token.type===Twig.expression.type.number){token.key=key_token.value.toString()}else if(key_token.type===Twig.expression.type.parameter.end&&key_token.expression){token.params=key_token.params}else{throw new Twig.Error("Unexpected value before ':' of "+key_token.type+" = "+key_token.value)}output.push(token);return}}else{stack.push(operator)}},parse:function(token,stack,context){if(token.key){stack.push(token)}else if(token.params){token.key=Twig.expression.parse.apply(this,[token.params,context]);stack.push(token);delete token.params}else{Twig.expression.operator.parse(token.value,stack)}}},{type:Twig.expression.type.operator.unary,regex:/(^not\s+)/,next:Twig.expression.set.expressions,compile:function(token,stack,output){delete token.match;token.value=token.value.trim();var value=token.value,operator=Twig.expression.operator.lookup(value,token);Twig.log.trace("Twig.expression.compile: ","Operator: ",operator," from ",value);while(stack.length>0&&(stack[stack.length-1].type==Twig.expression.type.operator.unary||stack[stack.length-1].type==Twig.expression.type.operator.binary)&&(operator.associativity===Twig.expression.operator.leftToRight&&operator.precidence>=stack[stack.length-1].precidence||operator.associativity===Twig.expression.operator.rightToLeft&&operator.precidence>stack[stack.length-1].precidence)){var temp=stack.pop();output.push(temp)}stack.push(operator)},parse:function(token,stack,context){Twig.expression.operator.parse(token.value,stack)}},{type:Twig.expression.type.string,regex:/^(["'])(?:(?=(\\?))\2[\s\S])*?\1/,next:Twig.expression.set.operations,compile:function(token,stack,output){var value=token.value;delete token.match;if(value.substring(0,1)==='"'){value=value.replace('\\"','"')}else{value=value.replace("\\'","'")}token.value=value.substring(1,value.length-1).replace(/\\n/g,"\n").replace(/\\r/g,"\r");Twig.log.trace("Twig.expression.compile: ","String value: ",token.value);output.push(token)},parse:Twig.expression.fn.parse.push_value},{type:Twig.expression.type.parameter.start,regex:/^\(/,next:Twig.expression.set.expressions.concat([Twig.expression.type.parameter.end]),compile:Twig.expression.fn.compile.push_both,parse:Twig.expression.fn.parse.push},{type:Twig.expression.type.parameter.end,regex:/^\)/,next:Twig.expression.set.operations_extended,compile:function(token,stack,output){var stack_token,end_token=token;stack_token=stack.pop();while(stack.length>0&&stack_token.type!=Twig.expression.type.parameter.start){output.push(stack_token);stack_token=stack.pop()}var param_stack=[];while(token.type!==Twig.expression.type.parameter.start){param_stack.unshift(token);token=output.pop()}param_stack.unshift(token);var is_expression=false;token=output[output.length-1];if(token===undefined||token.type!==Twig.expression.type._function&&token.type!==Twig.expression.type.filter&&token.type!==Twig.expression.type.test&&token.type!==Twig.expression.type.key.brackets&&token.type!==Twig.expression.type.key.period){end_token.expression=true;param_stack.pop();param_stack.shift();end_token.params=param_stack;output.push(end_token)}else{end_token.expression=false;token.params=param_stack}},parse:function(token,stack,context){var new_array=[],array_ended=false,value=null;if(token.expression){value=Twig.expression.parse.apply(this,[token.params,context]);stack.push(value)}else{while(stack.length>0){value=stack.pop();if(value&&value.type&&value.type==Twig.expression.type.parameter.start){array_ended=true;break}new_array.unshift(value)}if(!array_ended){throw new Twig.Error("Expected end of parameter set.")}stack.push(new_array)}}},{type:Twig.expression.type.array.start,regex:/^\[/,next:Twig.expression.set.expressions.concat([Twig.expression.type.array.end]),compile:Twig.expression.fn.compile.push_both,parse:Twig.expression.fn.parse.push},{type:Twig.expression.type.array.end,regex:/^\]/,next:Twig.expression.set.operations_extended,compile:function(token,stack,output){var i=stack.length-1,stack_token;for(;i>=0;i--){stack_token=stack.pop();if(stack_token.type===Twig.expression.type.array.start){break}output.push(stack_token)}output.push(token)},parse:function(token,stack,context){var new_array=[],array_ended=false,value=null;while(stack.length>0){value=stack.pop();if(value.type&&value.type==Twig.expression.type.array.start){array_ended=true;break}new_array.unshift(value)}if(!array_ended){throw new Twig.Error("Expected end of array.")}stack.push(new_array)}},{type:Twig.expression.type.object.start,regex:/^\{/,next:Twig.expression.set.expressions.concat([Twig.expression.type.object.end]),compile:Twig.expression.fn.compile.push_both,parse:Twig.expression.fn.parse.push},{type:Twig.expression.type.object.end,regex:/^\}/,next:Twig.expression.set.operations_extended,compile:function(token,stack,output){var i=stack.length-1,stack_token;for(;i>=0;i--){stack_token=stack.pop();if(stack_token&&stack_token.type===Twig.expression.type.object.start){break}output.push(stack_token)}output.push(token)},parse:function(end_token,stack,context){var new_object={},object_ended=false,token=null,token_key=null,has_value=false,value=null;while(stack.length>0){token=stack.pop();if(token&&token.type&&token.type===Twig.expression.type.object.start){object_ended=true;break}if(token&&token.type&&(token.type===Twig.expression.type.operator.binary||token.type===Twig.expression.type.operator.unary)&&token.key){if(!has_value){throw new Twig.Error("Missing value for key '"+token.key+"' in object definition.")}new_object[token.key]=value;if(new_object._keys===undefined)new_object._keys=[];new_object._keys.unshift(token.key);value=null;has_value=false}else{has_value=true;value=token}}if(!object_ended){throw new Twig.Error("Unexpected end of object.")}stack.push(new_object)}},{type:Twig.expression.type.filter,regex:/^\|\s?([a-zA-Z_][a-zA-Z0-9_\-]*)/,next:Twig.expression.set.operations_extended.concat([Twig.expression.type.parameter.start]),compile:function(token,stack,output){
	token.value=token.match[1];output.push(token)},parse:function(token,stack,context){var input=stack.pop(),params=token.params&&Twig.expression.parse.apply(this,[token.params,context]);stack.push(Twig.filter.apply(this,[token.value,input,params]))}},{type:Twig.expression.type._function,regex:/^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/,next:Twig.expression.type.parameter.start,transform:function(match,tokens){return"("},compile:function(token,stack,output){var fn=token.match[1];token.fn=fn;delete token.match;delete token.value;output.push(token)},parse:function(token,stack,context){var params=token.params&&Twig.expression.parse.apply(this,[token.params,context]),fn=token.fn,value;if(Twig.functions[fn]){value=Twig.functions[fn].apply(this,params)}else if(typeof context[fn]=="function"){value=context[fn].apply(context,params)}else{throw new Twig.Error(fn+" function does not exist and is not defined in the context")}stack.push(value)}},{type:Twig.expression.type.variable,regex:/^[a-zA-Z_][a-zA-Z0-9_]*/,next:Twig.expression.set.operations_extended.concat([Twig.expression.type.parameter.start]),compile:Twig.expression.fn.compile.push,validate:function(match,tokens){return Twig.indexOf(Twig.expression.reservedWords,match[0])<0},parse:function(token,stack,context){var value=Twig.expression.resolve(context[token.value],context);stack.push(value)}},{type:Twig.expression.type.key.period,regex:/^\.([a-zA-Z0-9_]+)/,next:Twig.expression.set.operations_extended.concat([Twig.expression.type.parameter.start]),compile:function(token,stack,output){token.key=token.match[1];delete token.match;delete token.value;output.push(token)},parse:function(token,stack,context){var params=token.params&&Twig.expression.parse.apply(this,[token.params,context]),key=token.key,object=stack.pop(),value;if(object===null||object===undefined){if(this.options.strict_variables){throw new Twig.Error("Can't access a key "+key+" on an null or undefined object.")}else{return null}}var capitalize=function(value){return value.substr(0,1).toUpperCase()+value.substr(1)};if(typeof object==="object"&&key in object){value=object[key]}else if(object["get"+capitalize(key)]!==undefined){value=object["get"+capitalize(key)]}else if(object["is"+capitalize(key)]!==undefined){value=object["is"+capitalize(key)]}else{value=undefined}stack.push(Twig.expression.resolve(value,object,params))}},{type:Twig.expression.type.key.brackets,regex:/^\[([^\]]*)\]/,next:Twig.expression.set.operations_extended.concat([Twig.expression.type.parameter.start]),compile:function(token,stack,output){var match=token.match[1];delete token.value;delete token.match;token.stack=Twig.expression.compile({value:match}).stack;output.push(token)},parse:function(token,stack,context){var params=token.params&&Twig.expression.parse.apply(this,[token.params,context]),key=Twig.expression.parse.apply(this,[token.stack,context]),object=stack.pop(),value;if(object===null||object===undefined){if(this.options.strict_variables){throw new Twig.Error("Can't access a key "+key+" on an null or undefined object.")}else{return null}}if(typeof object==="object"&&key in object){value=object[key]}else{value=null}stack.push(Twig.expression.resolve(value,object,params))}},{type:Twig.expression.type._null,regex:/^(null|NULL|none|NONE)/,next:Twig.expression.set.operations,compile:function(token,stack,output){delete token.match;token.value=null;output.push(token)},parse:Twig.expression.fn.parse.push_value},{type:Twig.expression.type.context,regex:/^_context/,next:Twig.expression.set.operations_extended.concat([Twig.expression.type.parameter.start]),compile:Twig.expression.fn.compile.push,parse:function(token,stack,context){stack.push(context)}},{type:Twig.expression.type.number,regex:/^\-?\d+(\.\d+)?/,next:Twig.expression.set.operations,compile:function(token,stack,output){token.value=Number(token.value);output.push(token)},parse:Twig.expression.fn.parse.push_value},{type:Twig.expression.type.bool,regex:/^(true|TRUE|false|FALSE)/,next:Twig.expression.set.operations,compile:function(token,stack,output){token.value=token.match[0].toLowerCase()==="true";delete token.match;output.push(token)},parse:Twig.expression.fn.parse.push_value}];Twig.expression.resolve=function(value,context,params){if(typeof value=="function"){return value.apply(context,params||[])}else{return value}};Twig.expression.handler={};Twig.expression.extendType=function(type){Twig.expression.type[type]="Twig.expression.type."+type};Twig.expression.extend=function(definition){if(!definition.type){throw new Twig.Error("Unable to extend logic definition. No type provided for "+definition)}Twig.expression.handler[definition.type]=definition};while(Twig.expression.definitions.length>0){Twig.expression.extend(Twig.expression.definitions.shift())}Twig.expression.tokenize=function(expression){var tokens=[],exp_offset=0,next=null,type,regex,regex_array,token_next,match_found,invalid_matches=[],match_function;match_function=function(){var match=Array.prototype.slice.apply(arguments),string=match.pop(),offset=match.pop();Twig.log.trace("Twig.expression.tokenize","Matched a ",type," regular expression of ",match);if(next&&Twig.indexOf(next,type)<0){invalid_matches.push(type+" cannot follow a "+tokens[tokens.length-1].type+" at template:"+exp_offset+" near '"+match[0].substring(0,20)+"...'");return match[0]}if(Twig.expression.handler[type].validate&&!Twig.expression.handler[type].validate(match,tokens)){return match[0]}invalid_matches=[];tokens.push({type:type,value:match[0],match:match});match_found=true;next=token_next;exp_offset+=match[0].length;if(Twig.expression.handler[type].transform){return Twig.expression.handler[type].transform(match,tokens)}return""};Twig.log.debug("Twig.expression.tokenize","Tokenizing expression ",expression);while(expression.length>0){expression=expression.trim();for(type in Twig.expression.handler){if(Twig.expression.handler.hasOwnProperty(type)){token_next=Twig.expression.handler[type].next;regex=Twig.expression.handler[type].regex;if(regex instanceof Array){regex_array=regex}else{regex_array=[regex]}match_found=false;while(regex_array.length>0){regex=regex_array.pop();expression=expression.replace(regex,match_function)}if(match_found){break}}}if(!match_found){if(invalid_matches.length>0){throw new Twig.Error(invalid_matches.join(" OR "))}else{throw new Twig.Error("Unable to parse '"+expression+"' at template position"+exp_offset)}}}Twig.log.trace("Twig.expression.tokenize","Tokenized to ",tokens);return tokens};Twig.expression.compile=function(raw_token){var expression=raw_token.value,tokens=Twig.expression.tokenize(expression),token=null,output=[],stack=[],token_template=null;Twig.log.trace("Twig.expression.compile: ","Compiling ",expression);while(tokens.length>0){token=tokens.shift();token_template=Twig.expression.handler[token.type];Twig.log.trace("Twig.expression.compile: ","Compiling ",token);token_template.compile&&token_template.compile(token,stack,output);Twig.log.trace("Twig.expression.compile: ","Stack is",stack);Twig.log.trace("Twig.expression.compile: ","Output is",output)}while(stack.length>0){output.push(stack.pop())}Twig.log.trace("Twig.expression.compile: ","Final output is",output);raw_token.stack=output;delete raw_token.value;return raw_token};Twig.expression.parse=function(tokens,context){var that=this;if(!(tokens instanceof Array)){tokens=[tokens]}var stack=[],token_template=null;Twig.forEach(tokens,function(token){token_template=Twig.expression.handler[token.type];token_template.parse&&token_template.parse.apply(that,[token,stack,context])});return stack.pop()};return Twig}(Twig||{});var Twig=function(Twig){"use strict";Twig.expression.operator={leftToRight:"leftToRight",rightToLeft:"rightToLeft"};var containment=function(a,b){if(b===undefined||b===null){return null}else if(b.indexOf!==undefined){return a===b||a!==""&&b.indexOf(a)>-1}else{var el;for(el in b){if(b.hasOwnProperty(el)&&b[el]===a){return true}}return false}};Twig.expression.operator.lookup=function(operator,token){switch(operator){case"..":case"not in":case"in":token.precidence=20;token.associativity=Twig.expression.operator.leftToRight;break;case",":token.precidence=18;token.associativity=Twig.expression.operator.leftToRight;break;case"?":case":":token.precidence=16;token.associativity=Twig.expression.operator.rightToLeft;break;case"or":token.precidence=14;token.associativity=Twig.expression.operator.leftToRight;break;case"and":token.precidence=13;token.associativity=Twig.expression.operator.leftToRight;break;case"==":case"!=":token.precidence=9;token.associativity=Twig.expression.operator.leftToRight;break;case"<":case"<=":case">":case">=":token.precidence=8;token.associativity=Twig.expression.operator.leftToRight;break;case"~":case"+":case"-":token.precidence=6;token.associativity=Twig.expression.operator.leftToRight;break;case"//":case"**":case"*":case"/":case"%":token.precidence=5;token.associativity=Twig.expression.operator.leftToRight;break;case"not":token.precidence=3;token.associativity=Twig.expression.operator.rightToLeft;break;default:throw new Twig.Error(operator+" is an unknown operator.")}token.operator=operator;return token};Twig.expression.operator.parse=function(operator,stack){Twig.log.trace("Twig.expression.operator.parse: ","Handling ",operator);var a,b,c;switch(operator){case":":break;case"?":c=stack.pop();b=stack.pop();a=stack.pop();if(a){stack.push(b)}else{stack.push(c)}break;case"+":b=parseFloat(stack.pop());a=parseFloat(stack.pop());stack.push(a+b);break;case"-":b=parseFloat(stack.pop());a=parseFloat(stack.pop());stack.push(a-b);break;case"*":b=parseFloat(stack.pop());a=parseFloat(stack.pop());stack.push(a*b);break;case"/":b=parseFloat(stack.pop());a=parseFloat(stack.pop());stack.push(a/b);break;case"//":b=parseFloat(stack.pop());a=parseFloat(stack.pop());stack.push(parseInt(a/b));break;case"%":b=parseFloat(stack.pop());a=parseFloat(stack.pop());stack.push(a%b);break;case"~":b=stack.pop();a=stack.pop();stack.push((a!=null?a.toString():"")+(b!=null?b.toString():""));break;case"not":case"!":stack.push(!stack.pop());break;case"<":b=stack.pop();a=stack.pop();stack.push(a<b);break;case"<=":b=stack.pop();a=stack.pop();stack.push(a<=b);break;case">":b=stack.pop();a=stack.pop();stack.push(a>b);break;case">=":b=stack.pop();a=stack.pop();stack.push(a>=b);break;case"===":b=stack.pop();a=stack.pop();stack.push(a===b);break;case"==":b=stack.pop();a=stack.pop();stack.push(a==b);break;case"!==":b=stack.pop();a=stack.pop();stack.push(a!==b);break;case"!=":b=stack.pop();a=stack.pop();stack.push(a!=b);break;case"or":b=stack.pop();a=stack.pop();stack.push(a||b);break;case"and":b=stack.pop();a=stack.pop();stack.push(a&&b);break;case"**":b=stack.pop();a=stack.pop();stack.push(Math.pow(a,b));break;case"not in":b=stack.pop();a=stack.pop();stack.push(!containment(a,b));break;case"in":b=stack.pop();a=stack.pop();stack.push(containment(a,b));break;case"..":b=stack.pop();a=stack.pop();stack.push(Twig.functions.range(a,b));break;default:throw new Twig.Error(operator+" is an unknown operator.")}};return Twig}(Twig||{});var Twig=function(Twig){function is(type,obj){var clas=Object.prototype.toString.call(obj).slice(8,-1);return obj!==undefined&&obj!==null&&clas===type}Twig.filters={upper:function(value){if(typeof value!=="string"){return value}return value.toUpperCase()},lower:function(value){if(typeof value!=="string"){return value}return value.toLowerCase()},capitalize:function(value){if(typeof value!=="string"){return value}return value.substr(0,1).toUpperCase()+value.toLowerCase().substr(1)},title:function(value){if(typeof value!=="string"){return value}return value.toLowerCase().replace(/(^|\s)([a-z])/g,function(m,p1,p2){return p1+p2.toUpperCase()})},length:function(value){if(Twig.lib.is("Array",value)||typeof value==="string"){return value.length}else if(Twig.lib.is("Object",value)){if(value._keys===undefined){return Object.keys(value).length}else{return value._keys.length}}else{return 0}},reverse:function(value){if(is("Array",value)){return value.reverse()}else if(is("String",value)){return value.split("").reverse().join("")}else if(is("Object",value)){var keys=value._keys||Object.keys(value).reverse();value._keys=keys;return value}},sort:function(value){if(is("Array",value)){return value.sort()}else if(is("Object",value)){delete value._keys;var keys=Object.keys(value),sorted_keys=keys.sort(function(a,b){var a1,a2;if(value[a]>value[b]==!(value[a]<=value[b])){return value[a]>value[b]?1:value[a]<value[b]?-1:0}else if(!isNaN(a1=parseFloat(value[a]))&&!isNaN(b1=parseFloat(value[b]))){return a1>b1?1:a1<b1?-1:0}else if(typeof value[a]=="string"){return value[a]>value[b].toString()?1:value[a]<value[b].toString()?-1:0}else if(typeof value[b]=="string"){return value[a].toString()>value[b]?1:value[a].toString()<value[b]?-1:0}else{return null}});value._keys=sorted_keys;return value}},keys:function(value){if(value===undefined||value===null){return}var keyset=value._keys||Object.keys(value),output=[];Twig.forEach(keyset,function(key){if(key==="_keys")return;if(value.hasOwnProperty(key)){output.push(key)}});return output},url_encode:function(value){if(value===undefined||value===null){return}var result=encodeURIComponent(value);result=result.replace("'","%27");return result},join:function(value,params){if(value===undefined||value===null){return}var join_str="",output=[],keyset=null;if(params&&params[0]){join_str=params[0]}if(is("Array",value)){output=value}else{keyset=value._keys||Object.keys(value);Twig.forEach(keyset,function(key){if(key==="_keys")return;if(value.hasOwnProperty(key)){output.push(value[key])}})}return output.join(join_str)},"default":function(value,params){if(params!==undefined&&params.length>1){throw new Twig.Error("default filter expects one argument")}if(value===undefined||value===null||value===""){if(params===undefined){return""}return params[0]}else{return value}},json_encode:function(value){if(value===undefined||value===null){return"null"}else if(typeof value=="object"&&is("Array",value)){output=[];Twig.forEach(value,function(v){output.push(Twig.filters.json_encode(v))});return"["+output.join(",")+"]"}else if(typeof value=="object"){var keyset=value._keys||Object.keys(value),output=[];Twig.forEach(keyset,function(key){output.push(JSON.stringify(key)+":"+Twig.filters.json_encode(value[key]))});return"{"+output.join(",")+"}"}else{return JSON.stringify(value)}},merge:function(value,params){var obj=[],arr_index=0,keyset=[];if(!is("Array",value)){obj={}}else{Twig.forEach(params,function(param){if(!is("Array",param)){obj={}}})}if(!is("Array",obj)){obj._keys=[]}if(is("Array",value)){Twig.forEach(value,function(val){if(obj._keys)obj._keys.push(arr_index);obj[arr_index]=val;arr_index++})}else{keyset=value._keys||Object.keys(value);Twig.forEach(keyset,function(key){obj[key]=value[key];obj._keys.push(key);var int_key=parseInt(key,10);if(!isNaN(int_key)&&int_key>=arr_index){arr_index=int_key+1}})}Twig.forEach(params,function(param){if(is("Array",param)){Twig.forEach(param,function(val){if(obj._keys)obj._keys.push(arr_index);obj[arr_index]=val;arr_index++})}else{keyset=param._keys||Object.keys(param);Twig.forEach(keyset,function(key){if(!obj[key])obj._keys.push(key);obj[key]=param[key];var int_key=parseInt(key,10);if(!isNaN(int_key)&&int_key>=arr_index){arr_index=int_key+1}})}});if(params.length===0){throw new Twig.Error("Filter merge expects at least one parameter")}return obj},date:function(value,params){var date=Twig.functions.date(value);var format=params&&params.length?params[0]:"F j, Y H:i";return Twig.lib.formatDate(date,format)},date_modify:function(value,params){if(value===undefined||value===null){return}if(params===undefined||params.length!==1){throw new Twig.Error("date_modify filter expects 1 argument")}var modifyText=params[0],time;if(Twig.lib.is("Date",value)){time=Twig.lib.strtotime(modifyText,value.getTime()/1e3)}if(Twig.lib.is("String",value)){time=Twig.lib.strtotime(modifyText,Twig.lib.strtotime(value))}if(Twig.lib.is("Number",value)){time=Twig.lib.strtotime(modifyText,value)}return new Date(time*1e3)},replace:function(value,params){if(value===undefined||value===null){return}var pairs=params[0],tag;for(tag in pairs){if(pairs.hasOwnProperty(tag)&&tag!=="_keys"){value=Twig.lib.replaceAll(value,tag,pairs[tag])}}return value},format:function(value,params){if(value===undefined||value===null){return}return Twig.lib.vsprintf(value,params)},striptags:function(value){if(value===undefined||value===null){return}return Twig.lib.strip_tags(value)},escape:function(value,params){if(value===undefined||value===null){return}var strategy="html";if(params&&params.length&&params[0]!==true)strategy=params[0];if(strategy=="html"){var raw_value=value.toString().replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");return Twig.Markup(raw_value,"html")}else if(strategy=="js"){var raw_value=value.toString();var result="";for(var i=0;i<raw_value.length;i++){if(raw_value[i].match(/^[a-zA-Z0-9,\._]$/))result+=raw_value[i];else{var char_code=raw_value.charCodeAt(i);if(char_code<128)result+="\\x"+char_code.toString(16).toUpperCase();else result+=Twig.lib.sprintf("\\u%04s",char_code.toString(16).toUpperCase())}}return Twig.Markup(result,"js")}else if(strategy=="css"){var raw_value=value.toString();var result="";for(var i=0;i<raw_value.length;i++){if(raw_value[i].match(/^[a-zA-Z0-9]$/))result+=raw_value[i];else{var char_code=raw_value.charCodeAt(i);result+="\\"+char_code.toString(16).toUpperCase()+" "}}return Twig.Markup(result,"css")}else if(strategy=="url"){var result=Twig.filters.url_encode(value);return Twig.Markup(result,"url")}else if(strategy=="html_attr"){var raw_value=value.toString();var result="";for(var i=0;i<raw_value.length;i++){if(raw_value[i].match(/^[a-zA-Z0-9,\.\-_]$/))result+=raw_value[i];else if(raw_value[i].match(/^[&<>"]$/))result+=raw_value[i].replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");else{var char_code=raw_value.charCodeAt(i);if(char_code<=31&&char_code!=9&&char_code!=10&&char_code!=13)result+="&#xFFFD;";else if(char_code<128)result+=Twig.lib.sprintf("&#x%02s;",char_code.toString(16).toUpperCase());else result+=Twig.lib.sprintf("&#x%04s;",char_code.toString(16).toUpperCase())}}return Twig.Markup(result,"html_attr")}else{throw new Twig.Error("escape strategy unsupported")}},e:function(value,params){return Twig.filters.escape(value,params)},nl2br:function(value){if(value===undefined||value===null){return}var linebreak_tag="BACKSLASH_n_replace",br="<br />"+linebreak_tag;value=Twig.filters.escape(value).replace(/\r\n/g,br).replace(/\r/g,br).replace(/\n/g,br);value=Twig.lib.replaceAll(value,linebreak_tag,"\n");return Twig.Markup(value)},number_format:function(value,params){var number=value,decimals=params&&params[0]?params[0]:undefined,dec=params&&params[1]!==undefined?params[1]:".",sep=params&&params[2]!==undefined?params[2]:",";number=(number+"").replace(/[^0-9+\-Ee.]/g,"");var n=!isFinite(+number)?0:+number,prec=!isFinite(+decimals)?0:Math.abs(decimals),s="",toFixedFix=function(n,prec){var k=Math.pow(10,prec);return""+Math.round(n*k)/k};s=(prec?toFixedFix(n,prec):""+Math.round(n)).split(".");if(s[0].length>3){s[0]=s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g,sep)}if((s[1]||"").length<prec){s[1]=s[1]||"";s[1]+=new Array(prec-s[1].length+1).join("0")}return s.join(dec)},trim:function(value,params){if(value===undefined||value===null){return}var str=Twig.filters.escape(""+value),whitespace;if(params&&params[0]){whitespace=""+params[0]}else{whitespace=" \n\r	\f\x0B            ​\u2028\u2029　"}for(var i=0;i<str.length;i++){if(whitespace.indexOf(str.charAt(i))===-1){str=str.substring(i);break}}for(i=str.length-1;i>=0;i--){if(whitespace.indexOf(str.charAt(i))===-1){str=str.substring(0,i+1);break}}return whitespace.indexOf(str.charAt(0))===-1?str:""},truncate:function(value,params){var length=30,preserve=false,separator="...";value=value+"";if(params){if(params[0]){length=params[0]}if(params[1]){preserve=params[1]}if(params[2]){separator=params[2]}}if(value.length>length){if(preserve){length=value.indexOf(" ",length);if(length===-1){return value}}value=value.substr(0,length)+separator}return value},slice:function(value,params){if(value===undefined||value===null){return}if(params===undefined||params.length<1){throw new Twig.Error("slice filter expects at least 1 argument")}var start=params[0]||0;var length=params.length>1?params[1]:value.length;var startIndex=start>=0?start:Math.max(value.length+start,0);if(Twig.lib.is("Array",value)){var output=[];for(var i=startIndex;i<startIndex+length&&i<value.length;i++){output.push(value[i])}return output}else if(Twig.lib.is("String",value)){return value.substr(startIndex,length)}else{throw new Twig.Error("slice filter expects value to be an array or string")}},abs:function(value){if(value===undefined||value===null){return}return Math.abs(value)},first:function(value){if(is("Array",value)){return value[0]}else if(is("Object",value)){if("_keys"in value){return value[value._keys[0]]}}else if(typeof value==="string"){return value.substr(0,1)}return},split:function(value,params){if(value===undefined||value===null){return}if(params===undefined||params.length<1||params.length>2){throw new Twig.Error("split filter expects 1 or 2 argument")}if(Twig.lib.is("String",value)){var delimiter=params[0],limit=params[1],split=value.split(delimiter);if(limit===undefined){return split}else if(limit<0){return value.split(delimiter,split.length+limit)}else{var limitedSplit=[];if(delimiter==""){while(split.length>0){var temp="";for(var i=0;i<limit&&split.length>0;i++){temp+=split.shift()}limitedSplit.push(temp)}}else{for(var i=0;i<limit-1&&split.length>0;i++){limitedSplit.push(split.shift())}if(split.length>0){limitedSplit.push(split.join(delimiter))}}return limitedSplit}}else{throw new Twig.Error("split filter expects value to be a string")}},last:function(value){if(Twig.lib.is("Object",value)){var keys;if(value._keys===undefined){keys=Object.keys(value)}else{keys=value._keys}return value[keys[keys.length-1]]}return value[value.length-1]},raw:function(value){return Twig.Markup(value)},batch:function(items,params){var size=params.shift(),fill=params.shift(),result,last,missing;if(!Twig.lib.is("Array",items)){throw new Twig.Error("batch filter expects items to be an array")}if(!Twig.lib.is("Number",size)){throw new Twig.Error("batch filter expects size to be a number")}size=Math.ceil(size);result=Twig.lib.chunkArray(items,size);if(fill&&items.length%size!=0){last=result.pop();missing=size-last.length;while(missing--){last.push(fill)}result.push(last)}return result},round:function(value,params){params=params||[];var precision=params.length>0?params[0]:0,method=params.length>1?params[1]:"common";value=parseFloat(value);if(precision&&!Twig.lib.is("Number",precision)){throw new Twig.Error("round filter expects precision to be a number")}if(method==="common"){return Twig.lib.round(value,precision)}if(!Twig.lib.is("Function",Math[method])){throw new Twig.Error("round filter expects method to be 'floor', 'ceil', or 'common'")}return Math[method](value*Math.pow(10,precision))/Math.pow(10,precision)}};Twig.filter=function(filter,value,params){if(!Twig.filters[filter]){throw"Unable to find filter "+filter}return Twig.filters[filter].apply(this,[value,params])};Twig.filter.extend=function(filter,definition){Twig.filters[filter]=definition};return Twig}(Twig||{});var Twig=function(Twig){var TEMPLATE_NOT_FOUND_MESSAGE='Template "{name}" is not defined.';function is(type,obj){var clas=Object.prototype.toString.call(obj).slice(8,-1);return obj!==undefined&&obj!==null&&clas===type}Twig.functions={range:function(low,high,step){var matrix=[];var inival,endval,plus;var walker=step||1;var chars=false;if(!isNaN(low)&&!isNaN(high)){inival=parseInt(low,10);endval=parseInt(high,10)}else if(isNaN(low)&&isNaN(high)){chars=true;inival=low.charCodeAt(0);endval=high.charCodeAt(0)}else{inival=isNaN(low)?0:low;endval=isNaN(high)?0:high}plus=inival>endval?false:true;if(plus){while(inival<=endval){matrix.push(chars?String.fromCharCode(inival):inival);inival+=walker}}else{while(inival>=endval){matrix.push(chars?String.fromCharCode(inival):inival);inival-=walker}}return matrix},cycle:function(arr,i){var pos=i%arr.length;return arr[pos]},dump:function(){var EOL="\n",indentChar="  ",indentTimes=0,out="",args=Array.prototype.slice.call(arguments),indent=function(times){var ind="";while(times>0){times--;ind+=indentChar}return ind},displayVar=function(variable){out+=indent(indentTimes);if(typeof variable==="object"){dumpVar(variable)}else if(typeof variable==="function"){out+="function()"+EOL}else if(typeof variable==="string"){out+="string("+variable.length+') "'+variable+'"'+EOL}else if(typeof variable==="number"){out+="number("+variable+")"+EOL}else if(typeof variable==="boolean"){out+="bool("+variable+")"+EOL}},dumpVar=function(variable){var i;if(variable===null){out+="NULL"+EOL}else if(variable===undefined){out+="undefined"+EOL}else if(typeof variable==="object"){out+=indent(indentTimes)+typeof variable;indentTimes++;out+="("+function(obj){var size=0,key;for(key in obj){if(obj.hasOwnProperty(key)){size++}}return size}(variable)+") {"+EOL;for(i in variable){out+=indent(indentTimes)+"["+i+"]=> "+EOL;displayVar(variable[i])}indentTimes--;out+=indent(indentTimes)+"}"+EOL}else{displayVar(variable)}};if(args.length==0)args.push(this.context);Twig.forEach(args,function(variable){dumpVar(variable)});return out},date:function(date,time){var dateObj;if(date===undefined){dateObj=new Date}else if(Twig.lib.is("Date",date)){dateObj=date}else if(Twig.lib.is("String",date)){if(date.match(/^[0-9]+$/)){dateObj=new Date(date*1e3)}else{dateObj=new Date(Twig.lib.strtotime(date)*1e3)}}else if(Twig.lib.is("Number",date)){dateObj=new Date(date*1e3)}else{throw new Twig.Error("Unable to parse date "+date)}return dateObj},block:function(block){if(this.originalBlockTokens[block]){return Twig.logic.parse.apply(this,[this.originalBlockTokens[block],this.context]).output}else{return this.blocks[block]}},parent:function(){return Twig.placeholders.parent},attribute:function(object,method,params){if(Twig.lib.is("Object",object)){if(object.hasOwnProperty(method)){if(typeof object[method]==="function"){return object[method].apply(undefined,params)}else{return object[method]}}}return object[method]||undefined},max:function(values){if(Twig.lib.is("Object",values)){delete values["_keys"];return Twig.lib.max(values)}return Twig.lib.max.apply(null,arguments)},min:function(values){if(Twig.lib.is("Object",values)){delete values["_keys"];return Twig.lib.min(values)}return Twig.lib.min.apply(null,arguments)},template_from_string:function(template){if(template===undefined){template=""}return Twig.Templates.parsers.twig({options:this.options,data:template})},random:function(value){var LIMIT_INT31=2147483648;function getRandomNumber(n){var random=Math.floor(Math.random()*LIMIT_INT31);var limits=[0,n];var min=Math.min.apply(null,limits),max=Math.max.apply(null,limits);return min+Math.floor((max-min+1)*random/LIMIT_INT31)}if(Twig.lib.is("Number",value)){return getRandomNumber(value)}if(Twig.lib.is("String",value)){return value.charAt(getRandomNumber(value.length-1))}if(Twig.lib.is("Array",value)){return value[getRandomNumber(value.length-1)]}if(Twig.lib.is("Object",value)){var keys=Object.keys(value);return value[keys[getRandomNumber(keys.length-1)]]}return getRandomNumber(LIMIT_INT31-1)},source:function(name,ignore_missing){var templateSource;var templateFound=false;var isNodeEnvironment=typeof module!=="undefined"&&typeof module.exports!=="undefined"&&typeof window==="undefined";var loader;var path;if(isNodeEnvironment){loader="fs";path=__dirname+"/"+name}else{loader="ajax";path=name}var params={id:name,path:path,method:loader,parser:"source",async:false,fetchTemplateSource:true};if(typeof ignore_missing==="undefined"){ignore_missing=false}try{templateSource=Twig.Templates.loadRemote(name,params);if(typeof templateSource==="undefined"||templateSource===null){templateSource=""}else{templateFound=true}}catch(e){Twig.log.debug("Twig.functions.source: ","Problem loading template  ",e)}if(!templateFound&&!ignore_missing){return TEMPLATE_NOT_FOUND_MESSAGE.replace("{name}",name)}else{return templateSource}}};Twig._function=function(_function,value,params){if(!Twig.functions[_function]){throw"Unable to find function "+_function}return Twig.functions[_function](value,params)};Twig._function.extend=function(_function,definition){Twig.functions[_function]=definition};return Twig}(Twig||{});var Twig=function(Twig){"use strict";Twig.path={};Twig.path.parsePath=function(template,file){var namespaces=null,file=file||"";if(typeof template==="object"&&typeof template.options==="object"){namespaces=template.options.namespaces}if(typeof namespaces==="object"&&file.indexOf("::")>0||file.indexOf("@")>=0){for(var k in namespaces){if(namespaces.hasOwnProperty(k)){file=file.replace(k+"::",namespaces[k]);file=file.replace("@"+k,namespaces[k])}}return file}return Twig.path.relativePath(template,file)};Twig.path.relativePath=function(template,file){var base,base_path,sep_chr="/",new_path=[],file=file||"",val;if(template.url){if(typeof template.base!=="undefined"){base=template.base+(template.base.charAt(template.base.length-1)==="/"?"":"/")}else{base=template.url}}else if(template.path){var path=__webpack_require__(4),sep=path.sep||sep_chr,relative=new RegExp("^\\.{1,2}"+sep.replace("\\","\\\\"));file=file.replace(/\//g,sep);if(template.base!==undefined&&file.match(relative)==null){file=file.replace(template.base,"");base=template.base+sep}else{base=path.normalize(template.path)}base=base.replace(sep+sep,sep);sep_chr=sep}else if((template.name||template.id)&&template.method&&template.method!=="fs"&&template.method!=="ajax"){base=template.base||template.name||template.id}else{throw new Twig.Error("Cannot extend an inline template.")}base_path=base.split(sep_chr);base_path.pop();base_path=base_path.concat(file.split(sep_chr));while(base_path.length>0){val=base_path.shift();if(val=="."){}else if(val==".."&&new_path.length>0&&new_path[new_path.length-1]!=".."){new_path.pop()}else{new_path.push(val)}}return new_path.join(sep_chr)};return Twig}(Twig||{});var Twig=function(Twig){"use strict";Twig.tests={empty:function(value){if(value===null||value===undefined)return true;if(typeof value==="number")return false;if(value.length&&value.length>0)return false;for(var key in value){if(value.hasOwnProperty(key))return false}return true},odd:function(value){return value%2===1},even:function(value){return value%2===0},divisibleby:function(value,params){return value%params[0]===0},defined:function(value){return value!==undefined},none:function(value){return value===null},"null":function(value){return this.none(value)},sameas:function(value,params){return value===params[0]},iterable:function(value){return value&&(Twig.lib.is("Array",value)||Twig.lib.is("Object",value))}};Twig.test=function(test,value,params){if(!Twig.tests[test]){throw"Test "+test+" is not defined."}return Twig.tests[test](value,params)};Twig.test.extend=function(test,definition){Twig.tests[test]=definition};return Twig}(Twig||{});var Twig=function(Twig){"use strict";Twig.exports={VERSION:Twig.VERSION};Twig.exports.twig=function twig(params){"use strict";var id=params.id,options={strict_variables:params.strict_variables||false,autoescape:params.autoescape!=null&&params.autoescape||false,allowInlineIncludes:params.allowInlineIncludes||false,rethrow:params.rethrow||false,namespaces:params.namespaces};if(Twig.cache&&id){Twig.validateId(id)}if(params.debug!==undefined){Twig.debug=params.debug}if(params.trace!==undefined){Twig.trace=params.trace}if(params.data!==undefined){return Twig.Templates.parsers.twig({data:params.data,path:params.hasOwnProperty("path")?params.path:undefined,module:params.module,id:id,options:options})}else if(params.ref!==undefined){if(params.id!==undefined){throw new Twig.Error("Both ref and id cannot be set on a twig.js template.");
	}return Twig.Templates.load(params.ref)}else if(params.method!==undefined){if(!Twig.Templates.isRegisteredLoader(params.method)){throw new Twig.Error('Loader for "'+params.method+'" is not defined.')}return Twig.Templates.loadRemote(params.name||params.href||params.path||id||undefined,{id:id,method:params.method,parser:params.parser||"twig",base:params.base,module:params.module,precompiled:params.precompiled,async:params.async,options:options},params.load,params.error)}else if(params.href!==undefined){return Twig.Templates.loadRemote(params.href,{id:id,method:"ajax",parser:params.parser||"twig",base:params.base,module:params.module,precompiled:params.precompiled,async:params.async,options:options},params.load,params.error)}else if(params.path!==undefined){return Twig.Templates.loadRemote(params.path,{id:id,method:"fs",parser:params.parser||"twig",base:params.base,module:params.module,precompiled:params.precompiled,async:params.async,options:options},params.load,params.error)}};Twig.exports.extendFilter=function(filter,definition){Twig.filter.extend(filter,definition)};Twig.exports.extendFunction=function(fn,definition){Twig._function.extend(fn,definition)};Twig.exports.extendTest=function(test,definition){Twig.test.extend(test,definition)};Twig.exports.extendTag=function(definition){Twig.logic.extend(definition)};Twig.exports.extend=function(fn){fn(Twig)};Twig.exports.compile=function(markup,options){var id=options.filename,path=options.filename,template;template=new Twig.Template({data:markup,path:path,id:id,options:options.settings["twig options"]});return function(context){return template.render(context)}};Twig.exports.renderFile=function(path,options,fn){if(typeof options==="function"){fn=options;options={}}options=options||{};var settings=options.settings||{};var params={path:path,base:settings.views,load:function(template){fn(null,template.render(options))}};var view_options=settings["twig options"];if(view_options){for(var option in view_options){if(view_options.hasOwnProperty(option)){params[option]=view_options[option]}}}Twig.exports.twig(params)};Twig.exports.__express=Twig.exports.renderFile;Twig.exports.cache=function(cache){Twig.cache=cache};Twig.exports.path=Twig.path;return Twig}(Twig||{});var Twig=function(Twig){Twig.compiler={module:{}};Twig.compiler.compile=function(template,options){var tokens=JSON.stringify(template.tokens),id=template.id,output;if(options.module){if(Twig.compiler.module[options.module]===undefined){throw new Twig.Error("Unable to find module type "+options.module)}output=Twig.compiler.module[options.module](id,tokens,options.twig)}else{output=Twig.compiler.wrap(id,tokens)}return output};Twig.compiler.module={amd:function(id,tokens,pathToTwig){return'define(["'+pathToTwig+'"], function (Twig) {\n	var twig, templates;\ntwig = Twig.twig;\ntemplates = '+Twig.compiler.wrap(id,tokens)+"\n	return templates;\n});"},node:function(id,tokens){return'var twig = require("twig").twig;\n'+"exports.template = "+Twig.compiler.wrap(id,tokens)},cjs2:function(id,tokens,pathToTwig){return'module.declare([{ twig: "'+pathToTwig+'" }], function (require, exports, module) {\n'+'	var twig = require("twig").twig;\n'+"	exports.template = "+Twig.compiler.wrap(id,tokens)+"\n});"}};Twig.compiler.wrap=function(id,tokens){return'twig({id:"'+id.replace('"','\\"')+'", data:'+tokens+", precompiled: true});\n"};return Twig}(Twig||{});if(typeof module!=="undefined"&&module.declare){module.declare([],function(require,exports,module){for(key in Twig.exports){if(Twig.exports.hasOwnProperty(key)){exports[key]=Twig.exports[key]}}})}else if(true){!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){return Twig.exports}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))}else if(typeof module!=="undefined"&&module.exports){module.exports=Twig.exports}else{window.twig=Twig.exports.twig;window.Twig=Twig.exports}
	//# sourceMappingURL=twig.min.js.map

	/* WEBPACK VAR INJECTION */}.call(exports, "/", __webpack_require__(2)(module)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }

	  return parts;
	}

	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};

	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';

	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }

	  return (isAbsolute ? '/' : '') + path;
	};

	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};

	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};


	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);

	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }

	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }

	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }

	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};

	exports.sep = '/';
	exports.delimiter = ':';

	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	exports.extname = function(path) {
	  return splitPath(path)[3];
	};

	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}

	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var map = {
		"./editLink.twig": 7,
		"./umiAppView.twig": 8,
		"./umiDataTableRow.twig": 9,
		"./umiInLineControl.twig": 10,
		"./umiTableChildWrapper.twig": 11,
		"./umiTableEmpty.twig": 12,
		"./umiTableHeader.twig": 13,
		"./umiTablePageNavigationBar.twig": 14,
		"./umiToolbarTemplate.twig": 15
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 6;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	var twig = __webpack_require__(1).twig,
	    template = twig({id:"89e5e26e493a81833c0109cc2813e4e0598b8c8610b2b864673a00cc4df4d3b1f2d50b84686525e81caf723e84f29b04cd0568c93d3fb64391801d1cdd645a23", data:[{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"pre_lang","match":["pre_lang"]}]},{"type":"raw","value":"/admin/"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"module","match":["module"]}]},{"type":"raw","value":"/"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"method","match":["method"]}]},{"type":"raw","value":"/"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"id","match":["id"]}]},{"type":"raw","value":"/"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"params","match":["params"]},{"type":"Twig.expression.type.string","value":"?type="},{"type":"Twig.expression.type.variable","value":"params","match":["params"]},{"type":"Twig.expression.type.operator.binary","value":"~","precidence":6,"associativity":"leftToRight","operator":"~"},{"type":"Twig.expression.type.string","value":""},{"type":"Twig.expression.type.operator.binary","value":"?","precidence":16,"associativity":"rightToLeft","operator":"?"}]},{"type":"raw","value":"\n"}], allowInlineIncludes: true, rethrow: true});

	module.exports = function(context) { return template.render(context); }

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var twig = __webpack_require__(1).twig,
	    template = twig({id:"381b6b71ba8d25ed6c8fe49cb6347ccd2fed352d3786ede4463f0acd3d2f16b8bb5f852131eac14fd214f404e5a46b27f0b8c0b420cffdb8d5ea4943a9918c3a", data:[{"type":"raw","value":"<div class=\"location\" style=\"position: static !important;\">\n    <div class=\"row\" id=\"udcToolbar\"> </div>\n    <div class=\"save_size\"> </div>\n    <div class=\"loc-right\">\n        "},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"domainsList","match":["domainsList"]}],"output":[{"type":"raw","value":"            <div class=\"domains_selector\">\n                <select class=\"default newselect\">\n                    "},{"type":"logic","token":{"type":"Twig.logic.type.for","key_var":null,"value_var":"domain","expression":[{"type":"Twig.expression.type.variable","value":"domainsList","match":["domainsList"]}],"output":[{"type":"raw","value":"                        <option value=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"domain","match":["domain"]},{"type":"Twig.expression.type.key.period","key":"id"}]},{"type":"raw","value":"\">"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"domain","match":["domain"]},{"type":"Twig.expression.type.key.period","key":"host"}]},{"type":"raw","value":"</option>\n                    "}]}},{"type":"raw","value":"                </select>\n            </div>\n        "}]}},{"type":"raw","value":"    </div>\n</div>\n<div style=\"width: 100%;\" class=\"tableItemContainer location\" >\n    <div class=\"overflow overflow-block\">\n        <table id=\"udcControl\" class=\"table allowContextMenu notextselect\" style=\"table-layout: fixed; position: relative;\">\n            <thead id=\"udcControlHeader\"></thead>\n            <tbody id=\"udcControlBody\"></tbody>\n        </table>\n    </div>\n</div>\n"},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"limits","match":["limits"]}],"output":[{"type":"raw","value":"    <div class=\"location\">\n        <div id=\"udcConfigBar\" class=\"paging panel-sorting loc-right\">\n            <span>"},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"trans","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.string","value":"js-label-elements-per-page"},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"</span>\n            "},{"type":"logic","token":{"type":"Twig.logic.type.for","key_var":null,"value_var":"limit","expression":[{"type":"Twig.expression.type.variable","value":"limits","match":["limits"]}],"output":[{"type":"raw","value":"                <a class=\"per_page_limit "},{"type":"output","stack":[{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":true,"params":[{"type":"Twig.expression.type.variable","value":"limit","match":["limit"]},{"type":"Twig.expression.type.variable","value":"current","match":["current"]},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="},{"type":"Twig.expression.type.string","value":"current"},{"type":"Twig.expression.type.string","value":""},{"type":"Twig.expression.type.operator.binary","value":"?","precidence":16,"associativity":"rightToLeft","operator":"?"}]}]},{"type":"raw","value":"\">"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"limit","match":["limit"]}]},{"type":"raw","value":"</a>\n            "}]}},{"type":"raw","value":"        </div>\n    </div>\n"}]}}], allowInlineIncludes: true, rethrow: true});

	module.exports = function(context) { return template.render(context); }

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var twig = __webpack_require__(1).twig,
	    template = twig({id:"ae3c49fde43934d02b79e21964ab1e2f833e2fcc12b186cc95eac62dae61149c9c6e78d444f9e6e40a3200b30d42d105b74b9b1c320669e4d79d2b7ec89330b6", data:[{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"fields","match":["fields"]},{"type":"Twig.expression.type.filter","value":"length","match":["|length","length"]},{"type":"Twig.expression.type.number","value":0,"match":["0",null]},{"type":"Twig.expression.type.operator.binary","value":">","precidence":8,"associativity":"leftToRight","operator":">"}],"output":[{"type":"raw","value":"    "},{"type":"logic","token":{"type":"Twig.logic.type.for","key_var":null,"value_var":"item","expression":[{"type":"Twig.expression.type.variable","value":"used_fields","match":["used_fields"]}],"output":[{"type":"raw","value":"        <td style=\"width:"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"size"},{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"size"},{"type":"Twig.expression.type.string","value":"auto"},{"type":"Twig.expression.type.operator.binary","value":"?","precidence":16,"associativity":"rightToLeft","operator":"?"}]},{"type":"raw","value":";\"  class=\"table-cell td_"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"field"}]},{"type":"raw","value":"\" >\n            "},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"editable"},{"type":"Twig.expression.type.string","value":"false"},{"type":"Twig.expression.type.operator.binary","value":"!=","precidence":9,"associativity":"leftToRight","operator":"!="}],"output":[{"type":"raw","value":"                "},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type._function","fn":"isDefined","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.variable","value":"fields","match":["fields"]},{"type":"Twig.expression.type.comma"},{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"field"},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}],"output":[{"type":"raw","value":"                        <i class=\"small-ico i-change editable\" title=\""},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"trans","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.string","value":"js-table-control-fast-edit"},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"\" umi-field=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"field"}]},{"type":"raw","value":"\"></i>\n                "}]}},{"type":"raw","value":"\n            "}]}},{"type":"raw","value":"            <div class=\"cell-item\">\n                "},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"loop","match":["loop"]},{"type":"Twig.expression.type.key.period","key":"index0"},{"type":"Twig.expression.type.number","value":0,"match":["0",null]},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="}],"output":[{"type":"raw","value":"                    "},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"fields","match":["fields"]},{"type":"Twig.expression.type.key.period","key":"__children"},{"type":"Twig.expression.type.number","value":0,"match":["0",null]},{"type":"Twig.expression.type.operator.binary","value":">","precidence":8,"associativity":"leftToRight","operator":">"}],"output":[{"type":"raw","value":"                        <span class=\"catalog-toggle-wrapper ex_"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"cid","match":["cid"]}]},{"type":"raw","value":"\"><span class=\"catalog-toggle\"></span></span>\n                    "}]}},{"type":"logic","token":{"type":"Twig.logic.type.else","match":["else"],"output":[{"type":"raw","value":"                        <span class=\"catalog-toggle-off ndc\"></span>\n                    "}]}},{"type":"raw","value":"                    "},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"selectable"},{"type":"Twig.expression.type.string","value":"false"},{"type":"Twig.expression.type.operator.binary","value":"!=","precidence":9,"associativity":"leftToRight","operator":"!="}],"output":[{"type":"raw","value":"                        <div class=\"checkbox\"><input type=\"checkbox\" class=\"row_selector\"></div>\n                    "}]}},{"type":"raw","value":"                "}]}},{"type":"raw","value":"\t\t\t\t"},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"type"},{"type":"Twig.expression.type.string","value":"multiple_image"},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="}],"output":[{"type":"raw","value":"\t\t\t\t\t<span class=\"item\" title=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"title"}]},{"type":"raw","value":"\">\n\t\t\t\t\t\t"},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"multipleImageField","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.variable","value":"fields","match":["fields"]},{"type":"Twig.expression.type.key.brackets","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"field"}]},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"\n\t\t\t\t"}]}},{"type":"logic","token":{"type":"Twig.logic.type.elseif","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"type"},{"type":"Twig.expression.type.string","value":"multiple_file"},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="}],"output":[{"type":"raw","value":"\t\t\t\t\t<span class=\"item\" title=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"title"}]},{"type":"raw","value":"\">\n\t\t\t\t\t\t"},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"multipleFileField","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.variable","value":"fields","match":["fields"]},{"type":"Twig.expression.type.key.brackets","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"field"}]},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"\n\t\t\t\t"}]}},{"type":"logic","token":{"type":"Twig.logic.type.elseif","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"type"},{"type":"Twig.expression.type.string","value":"wysiwyg"},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="}],"output":[{"type":"raw","value":"\t\t\t\t\t<span class=\"item\" title=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"title"}]},{"type":"raw","value":"\">\n\t\t\t\t\t\t"},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"textWysiwygField","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.variable","value":"fields","match":["fields"]},{"type":"Twig.expression.type.key.brackets","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"field"}]},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"\n\t\t\t\t"}]}},{"type":"logic","token":{"type":"Twig.logic.type.elseif","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"type"},{"type":"Twig.expression.type.string","value":"symlink"},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="}],"output":[{"type":"raw","value":"\t\t\t\t\t<span class=\"item\" title=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"title"}]},{"type":"raw","value":"\">\n\t\t\t\t\t\t"},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"textSymlinkField","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.variable","value":"fields","match":["fields"]},{"type":"Twig.expression.type.key.brackets","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"field"}]},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"\n\t\t\t\t"}]}},{"type":"logic","token":{"type":"Twig.logic.type.elseif","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"type"},{"type":"Twig.expression.type.string","value":"relation"},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="}],"output":[{"type":"raw","value":"\t\t\t\t\t<span class=\"item\" title=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"title"}]},{"type":"raw","value":"\">\n\t\t\t\t\t\t"},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"relationField","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.variable","value":"fields","match":["fields"]},{"type":"Twig.expression.type.key.brackets","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"field"}]},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"\n\t\t\t\t"}]}},{"type":"logic","token":{"type":"Twig.logic.type.else","match":["else"],"output":[{"type":"raw","value":"\t\t\t\t\t<span class=\"item\" title=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"fields","match":["fields"]},{"type":"Twig.expression.type.key.brackets","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"field"}]}]},{"type":"raw","value":"\">\n\t\t\t\t\t"},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"type"},{"type":"Twig.expression.type.string","value":"bool"},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="}],"output":[{"type":"raw","value":"\t\t\t\t\t\t"},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"fields","match":["fields"]},{"type":"Twig.expression.type.key.brackets","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"field"}]},{"type":"Twig.expression.type.number","value":1,"match":["1",null]},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="}],"output":[{"type":"raw","value":"\t\t\t\t\t\t\t<img src=\"/styles/skins/modern/design/img/tree/checked.png\" style=\"width:13px;height:13px;\" alt=\"\">\n\t\t\t\t\t\t"}]}},{"type":"raw","value":"\t\t\t\t\t"}]}},{"type":"logic","token":{"type":"Twig.logic.type.elseif","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"type"},{"type":"Twig.expression.type.array.start","value":"[","match":["["]},{"type":"Twig.expression.type.string","value":"image"},{"type":"Twig.expression.type.comma"},{"type":"Twig.expression.type.string","value":"photo"},{"type":"Twig.expression.type.array.end","value":"]","match":["]"]},{"type":"Twig.expression.type.operator.binary","value":"in","precidence":20,"associativity":"leftToRight","operator":"in"}],"output":[{"type":"raw","value":"\t\t\t\t\t\t"},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"imageField","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.variable","value":"fields","match":["fields"]},{"type":"Twig.expression.type.key.brackets","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"field"}]},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"\n\t\t\t\t\t"}]}},{"type":"logic","token":{"type":"Twig.logic.type.elseif","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"type"},{"type":"Twig.expression.type.array.start","value":"[","match":["["]},{"type":"Twig.expression.type.string","value":"file"},{"type":"Twig.expression.type.array.end","value":"]","match":["]"]},{"type":"Twig.expression.type.operator.binary","value":"in","precidence":20,"associativity":"leftToRight","operator":"in"}],"output":[{"type":"raw","value":"\t\t\t\t\t\t"},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"fileField","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.variable","value":"fields","match":["fields"]},{"type":"Twig.expression.type.key.brackets","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"field"}]},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"\n\t\t\t\t\t"}]}},{"type":"logic","token":{"type":"Twig.logic.type.else","match":["else"],"output":[{"type":"raw","value":"\t\t\t\t\t\t"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"fields","match":["fields"]},{"type":"Twig.expression.type.key.brackets","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"field"}]}]},{"type":"raw","value":"\n\t\t\t\t\t"}]}},{"type":"raw","value":"                "}]}},{"type":"raw","value":"\t\t\t\t</span>\n\t\t\t\t"},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"loop","match":["loop"]},{"type":"Twig.expression.type.key.period","key":"first"},{"type":"Twig.expression.type.variable","value":"item","match":["item"]},{"type":"Twig.expression.type.key.period","key":"show_edit_page_link"},{"type":"Twig.expression.type.string","value":"false"},{"type":"Twig.expression.type.operator.binary","value":"!=","precidence":9,"associativity":"leftToRight","operator":"!="},{"type":"Twig.expression.type.operator.binary","value":"and","precidence":13,"associativity":"leftToRight","operator":"and"}],"output":[{"type":"raw","value":"\t\t\t\t\t<a class=\"small-ico i-edit editable stucktotext\" title=\""},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"trans","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.string","value":"js-goto-edit-page"},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"\" href=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"editLink","match":["editLink"]}]},{"type":"raw","value":"\"></a>\n\t\t\t\t"}]}},{"type":"raw","value":"            </div>\n\n        </td>\n    "}]}},{"type":"raw","value":"    <td class=\"table-cell empty\">\n        <div class=\"cell-item\">&nbsp;</div>\n    </td>\n"}]}},{"type":"logic","token":{"type":"Twig.logic.type.else","match":["else"],"output":[{"type":"raw","value":"    <td class=\"table-cell\" style=\"height: 100px; vertical-align: middle;\" colspan=\""},{"type":"output","stack":[{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":true,"params":[{"type":"Twig.expression.type.variable","value":"used_fields","match":["used_fields"]},{"type":"Twig.expression.type.filter","value":"length","match":["|length","length"]}]},{"type":"Twig.expression.type.number","value":1,"match":["1",null]},{"type":"Twig.expression.type.operator.binary","value":"+","precidence":6,"associativity":"leftToRight","operator":"+"}]},{"type":"raw","value":"\">\n        <div class=\"cell-item\" style=\"text-align: center;\">"},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"trans","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.string","value":"js-table-control-nodata"},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"</div>\n    </td>\n"}]}}], allowInlineIncludes: true, rethrow: true});

	module.exports = function(context) { return template.render(context); }

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var twig = __webpack_require__(1).twig,
	    template = twig({id:"28d35ac922bdcbee80d3dfbb8fb3e20ebcde20cb6ae787bd023a8357afb511793b5899e4679cd3bd077dc8c6fda9414ab7e2bbfacd7a63d8e7356eb3a2090f9f", data:[{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"conf","match":["conf"]},{"type":"Twig.expression.type.key.period","key":"type"},{"type":"Twig.expression.type.string","value":"bool"},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="}],"output":[{"type":"raw","value":"    <input type=\"checkbox\" "},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"val","match":["val"]},{"type":"Twig.expression.type.string","value":"checked=\"checked\""},{"type":"Twig.expression.type.string","value":""},{"type":"Twig.expression.type.operator.binary","value":"?","precidence":16,"associativity":"rightToLeft","operator":"?"}]},{"type":"raw","value":" />\n"}]}},{"type":"logic","token":{"type":"Twig.logic.type.elseif","stack":[{"type":"Twig.expression.type.variable","value":"conf","match":["conf"]},{"type":"Twig.expression.type.key.period","key":"type"},{"type":"Twig.expression.type.string","value":"relation"},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="}],"output":[{"type":"raw","value":"    <div class=\"layout-col-control quick selectize-container\">\n        <select "},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"conf","match":["conf"]},{"type":"Twig.expression.type.key.period","key":"multiple"},{"type":"Twig.expression.type.bool","value":true},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="},{"type":"Twig.expression.type.string","value":"multiple=\"multiple\" style=\"height: 62px;\""},{"type":"Twig.expression.type.string","value":""},{"type":"Twig.expression.type.operator.binary","value":"?","precidence":16,"associativity":"rightToLeft","operator":"?"}]},{"type":"raw","value":">\n            "},{"type":"logic","token":{"type":"Twig.logic.type.for","key_var":null,"value_var":"option","expression":[{"type":"Twig.expression.type.variable","value":"conf","match":["conf"]},{"type":"Twig.expression.type.key.period","key":"options"}],"output":[{"type":"raw","value":"                <option value=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"option","match":["option"]},{"type":"Twig.expression.type.filter","value":"escape","match":["|escape","escape"]}]},{"type":"raw","value":"\" "},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"val","match":["val"]},{"type":"Twig.expression.type.variable","value":"option","match":["option"]},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="},{"type":"Twig.expression.type.string","value":" selected=\"selected\" "},{"type":"Twig.expression.type.string","value":""},{"type":"Twig.expression.type.operator.binary","value":"?","precidence":16,"associativity":"rightToLeft","operator":"?"}]},{"type":"raw","value":">"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"option","match":["option"]}]},{"type":"raw","value":"</option>\n            "}]}},{"type":"raw","value":"        </select>\n    </div>\n"}]}},{"type":"logic","token":{"type":"Twig.logic.type.elseif","stack":[{"type":"Twig.expression.type.variable","value":"conf","match":["conf"]},{"type":"Twig.expression.type.key.period","key":"type"},{"type":"Twig.expression.type.array.start","value":"[","match":["["]},{"type":"Twig.expression.type.string","value":"image"},{"type":"Twig.expression.type.comma"},{"type":"Twig.expression.type.string","value":"file"},{"type":"Twig.expression.type.array.end","value":"]","match":["]"]},{"type":"Twig.expression.type.operator.binary","value":"in","precidence":20,"associativity":"leftToRight","operator":"in"}],"output":[{"type":"raw","value":"    <div class=\"layout-row-icon\">\n        <div class=\"layout-col-control\">\n            <input type=\"text\" class=\"default\" value=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"val","match":["val"]},{"type":"Twig.expression.type.filter","value":"escape","match":["|escape","escape"]}]},{"type":"raw","value":"\"  id=\"inline_edit_"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"id","match":["id"]}]},{"type":"raw","value":"\" umi-type=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"conf","match":["conf"]},{"type":"Twig.expression.type.key.period","key":"type"}]},{"type":"raw","value":"\"/>\n        </div>\n        <div class=\"layout-col-icon\">\n            <a class=\"icon-action\"><i class=\"small-ico i-choose\"></i></a>\n        </div>\n    </div>\n"}]}},{"type":"logic","token":{"type":"Twig.logic.type.elseif","stack":[{"type":"Twig.expression.type.variable","value":"conf","match":["conf"]},{"type":"Twig.expression.type.key.period","key":"type"},{"type":"Twig.expression.type.string","value":"date"},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="}],"output":[{"type":"raw","value":"    <input type=\"text\" class=\"default\" value=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"val","match":["val"]},{"type":"Twig.expression.type.filter","value":"escape","match":["|escape","escape"]}]},{"type":"raw","value":"\" placeholder=\"dd.mm.yyyy\" id=\"inline_edit_"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"id","match":["id"]}]},{"type":"raw","value":"\" umi-type=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"conf","match":["conf"]},{"type":"Twig.expression.type.key.period","key":"type"}]},{"type":"raw","value":"\"/>\n"}]}},{"type":"logic","token":{"type":"Twig.logic.type.elseif","stack":[{"type":"Twig.expression.type.variable","value":"conf","match":["conf"]},{"type":"Twig.expression.type.key.period","key":"type"},{"type":"Twig.expression.type.string","value":"time"},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="}],"output":[{"type":"raw","value":"    <input type=\"text\" class=\"default\" value=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"val","match":["val"]},{"type":"Twig.expression.type.filter","value":"escape","match":["|escape","escape"]}]},{"type":"raw","value":"\" placeholder=\"hh:mm\" id=\"inline_edit_"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"id","match":["id"]}]},{"type":"raw","value":"\" umi-type=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"conf","match":["conf"]},{"type":"Twig.expression.type.key.period","key":"type"}]},{"type":"raw","value":"\"/>\n"}]}},{"type":"logic","token":{"type":"Twig.logic.type.elseif","stack":[{"type":"Twig.expression.type.variable","value":"conf","match":["conf"]},{"type":"Twig.expression.type.key.period","key":"type"},{"type":"Twig.expression.type.string","value":"datetime"},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="}],"output":[{"type":"raw","value":"    <input type=\"text\" class=\"default\" value=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"val","match":["val"]},{"type":"Twig.expression.type.filter","value":"escape","match":["|escape","escape"]}]},{"type":"raw","value":"\" placeholder=\"dd.mm.yyyy hh:mm\" id=\"inline_edit_"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"id","match":["id"]}]},{"type":"raw","value":"\" umi-type=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"conf","match":["conf"]},{"type":"Twig.expression.type.key.period","key":"type"}]},{"type":"raw","value":"\"/>\n"}]}},{"type":"logic","token":{"type":"Twig.logic.type.elseif","stack":[{"type":"Twig.expression.type.variable","value":"conf","match":["conf"]},{"type":"Twig.expression.type.key.period","key":"type"},{"type":"Twig.expression.type.array.start","value":"[","match":["["]},{"type":"Twig.expression.type.string","value":"multiple_image"},{"type":"Twig.expression.type.comma"},{"type":"Twig.expression.type.string","value":"multiple_file"},{"type":"Twig.expression.type.comma"},{"type":"Twig.expression.type.string","value":"text"},{"type":"Twig.expression.type.comma"},{"type":"Twig.expression.type.string","value":"wysiwyg"},{"type":"Twig.expression.type.comma"},{"type":"Twig.expression.type.string","value":"symlink"},{"type":"Twig.expression.type.array.end","value":"]","match":["]"]},{"type":"Twig.expression.type.operator.binary","value":"in","precidence":20,"associativity":"leftToRight","operator":"in"}],"output":[{"type":"raw","value":"    <input type=\"text\" class=\"default hide\" value=\"\" id=\"inline_edit_"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"id","match":["id"]}]},{"type":"raw","value":"\"/>\n"}]}},{"type":"logic","token":{"type":"Twig.logic.type.else","match":["else"],"output":[{"type":"raw","value":"    <input type=\"text\" class=\"default\" value=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"val","match":["val"]},{"type":"Twig.expression.type.filter","value":"escape","match":["|escape","escape"]}]},{"type":"raw","value":"\" id=\"inline_edit_"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"id","match":["id"]}]},{"type":"raw","value":"\" umi-type=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"conf","match":["conf"]},{"type":"Twig.expression.type.key.period","key":"type"}]},{"type":"raw","value":"\"/>\n"}]}}], allowInlineIncludes: true, rethrow: true});

	module.exports = function(context) { return template.render(context); }

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var twig = __webpack_require__(1).twig,
	    template = twig({id:"58fe59b5ea220de7642c9638e9fae767e553ab21f8670241c8f30928b91ab41fbd59cfa7bba878f3d9fdb47d1c2c8d16b41aa374057ba567d9751135e9c00311", data:[{"type":"raw","value":"<tr id=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"id","match":["id"]}]},{"type":"raw","value":"\" class=\"umiDC\"><td colspan=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"col_count","match":["col_count"]}]},{"type":"raw","value":"\" class=\"ch_wrapper\"><table class=\"table table-bordered\"><tbody id=\"ch_"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"id","match":["id"]}]},{"type":"raw","value":"\"></tbody></table></td></tr>"}], allowInlineIncludes: true, rethrow: true});

	module.exports = function(context) { return template.render(context); }

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	var twig = __webpack_require__(1).twig,
	    template = twig({id:"2c64c87263a7cceecf10fc0ab7a45368c723449d6e8cf5f3e1ade8943d4b7ef4c41c808e859a3f953fb8011667135813f129ed2e155e142fd37a1633af93202d", data:[{"type":"raw","value":"<td class=\"table-cell\" colspan=\""},{"type":"output","stack":[{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":true,"params":[{"type":"Twig.expression.type.variable","value":"used_fields","match":["used_fields"]},{"type":"Twig.expression.type.filter","value":"length","match":["|length","length"]}]},{"type":"Twig.expression.type.number","value":1,"match":["1",null]},{"type":"Twig.expression.type.operator.binary","value":"+","precidence":6,"associativity":"leftToRight","operator":"+"}]},{"type":"raw","value":"\">\n    <div class=\"cell-item\">"},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"trans","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.string","value":"js-table-control-nodata"},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"</div>\n</td>"}], allowInlineIncludes: true, rethrow: true});

	module.exports = function(context) { return template.render(context); }

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	var twig = __webpack_require__(1).twig,
	    template = twig({id:"9ee3bce4b42308bb0f27434fb1d0045d25e7ae10306864bdc39f80c2f67f6f4a254068cdf9440b67c0896ded3c537ef7b29bbafa8e78ac2d016ead7ef0c3d51a", data:[{"type":"raw","value":"<tr class=\"table-row title\">\n    "},{"type":"logic","token":{"type":"Twig.logic.type.for","key_var":null,"value_var":"field","expression":[{"type":"Twig.expression.type.variable","value":"fields","match":["fields"]}],"output":[{"type":"raw","value":"        <th "},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"size"},{"type":"Twig.expression.type.string","value":"style=\"width:"},{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"size"},{"type":"Twig.expression.type.operator.binary","value":"~","precidence":6,"associativity":"leftToRight","operator":"~"},{"type":"Twig.expression.type.string","value":";\""},{"type":"Twig.expression.type.operator.binary","value":"~","precidence":6,"associativity":"leftToRight","operator":"~"},{"type":"Twig.expression.type.string","value":""},{"type":"Twig.expression.type.operator.binary","value":"?","precidence":16,"associativity":"rightToLeft","operator":"?"}]},{"type":"raw","value":" class=\"table-cell\" umi-field=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"field"}]},{"type":"raw","value":"\">\n            <span></span>\n            "},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"sortable"},{"type":"Twig.expression.type.string","value":"false"},{"type":"Twig.expression.type.operator.binary","value":"!=","precidence":9,"associativity":"leftToRight","operator":"!="}],"output":[{"type":"raw","value":"                <div class=\"table-title disabled\" umi-field=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"field"}]},{"type":"raw","value":"\" title=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"title"}]},{"type":"raw","value":"\">"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"title"}]},{"type":"raw","value":"</div>\n            "}]}},{"type":"logic","token":{"type":"Twig.logic.type.else","match":["else"],"output":[{"type":"raw","value":"                <div class=\"table-title-no-order disabled\" umi-field=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"field"}]},{"type":"raw","value":"\" title=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"title"}]},{"type":"raw","value":"\">"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"title"}]},{"type":"raw","value":"</div>\n            "}]}},{"type":"raw","value":"            "},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"filterable"},{"type":"Twig.expression.type.string","value":"false"},{"type":"Twig.expression.type.operator.binary","value":"!=","precidence":9,"associativity":"leftToRight","operator":"!="}],"output":[{"type":"raw","value":"                <div class=\"input-search\" style=\"overflow: visible;\">\n                    "},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"type"},{"type":"Twig.expression.type.string","value":"bool"},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="}],"output":[{"type":"raw","value":"                        <select class=\"default t-filter-select\" umi-field=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"field"}]},{"type":"raw","value":"\">\n                            <option value=\"-1\">"},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"trans","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.string","value":"js-all"},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"</option>\n                            <option value=\"1\">"},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"trans","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.string","value":"js-value-yes"},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"</option>\n                            <option value=\"0\">"},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"trans","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.string","value":"js-value-no"},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"</option>\n                        </select>\n                    "}]}},{"type":"logic","token":{"type":"Twig.logic.type.elseif","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"type"},{"type":"Twig.expression.type.array.start","value":"[","match":["["]},{"type":"Twig.expression.type.string","value":"image"},{"type":"Twig.expression.type.comma"},{"type":"Twig.expression.type.string","value":"photo"},{"type":"Twig.expression.type.comma"},{"type":"Twig.expression.type.string","value":"file"},{"type":"Twig.expression.type.comma"},{"type":"Twig.expression.type.string","value":"multiple_image"},{"type":"Twig.expression.type.comma"},{"type":"Twig.expression.type.string","value":"multiple_file"},{"type":"Twig.expression.type.array.end","value":"]","match":["]"]},{"type":"Twig.expression.type.operator.binary","value":"in","precidence":20,"associativity":"leftToRight","operator":"in"}],"output":[{"type":"raw","value":"                        <select class=\"default t-filter-select\" umi-field=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"field"}]},{"type":"raw","value":"\">\n                            <option value=\"-1\">"},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"trans","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.string","value":"js-all"},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"</option>\n                            <option value=\"1\">"},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"trans","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.string","value":"js-value-file-yes"},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"</option>\n                            <option value=\"0\">"},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"trans","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.string","value":"js-value-no"},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"</option>\n                        </select>\n                    "}]}},{"type":"logic","token":{"type":"Twig.logic.type.elseif","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"type"},{"type":"Twig.expression.type.string","value":"date"},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="}],"output":[{"type":"raw","value":"                        <input type=\"text\" class=\"fcStringInput default\" placeholder=\""},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"trans","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.string","value":"js-date-placeholder"},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"\" umi-field=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"field"}]},{"type":"raw","value":"\" umi-type=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"type"}]},{"type":"raw","value":"\"/>\n                    "}]}},{"type":"logic","token":{"type":"Twig.logic.type.elseif","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"type"},{"type":"Twig.expression.type.string","value":"time"},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="}],"output":[{"type":"raw","value":"                        <input type=\"text\" class=\"fcStringInput default\" placeholder=\""},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"trans","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.string","value":"js-time-placeholder"},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"\" umi-field=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"field"}]},{"type":"raw","value":"\" umi-type=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"type"}]},{"type":"raw","value":"\"/>\n                    "}]}},{"type":"logic","token":{"type":"Twig.logic.type.elseif","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"type"},{"type":"Twig.expression.type.string","value":"datetime"},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="}],"output":[{"type":"raw","value":"                        <input type=\"text\" class=\"fcStringInput default\" placeholder=\""},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"trans","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.string","value":"js-date-time-placeholder"},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"\" umi-field=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"field"}]},{"type":"raw","value":"\" umi-type=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"type"}]},{"type":"raw","value":"\"/>\n                    "}]}},{"type":"logic","token":{"type":"Twig.logic.type.elseif","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"type"},{"type":"Twig.expression.type.string","value":"relation"},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="},{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"options"},{"type":"Twig.expression.type.operator.binary","value":"and","precidence":13,"associativity":"leftToRight","operator":"and"}],"output":[{"type":"raw","value":"                        <select class=\"default t-filter-select\" umi-field=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"field"}]},{"type":"raw","value":"\">\n                            <option value=\"-1\" selected>"},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"trans","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.string","value":"js-all"},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"</option>\n                            "},{"type":"logic","token":{"type":"Twig.logic.type.for","key_var":null,"value_var":"item","expression":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"options"}],"output":[{"type":"raw","value":"                                <option value=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]}]},{"type":"raw","value":"\">"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"item","match":["item"]}]},{"type":"raw","value":"</option>\n                            "}]}},{"type":"raw","value":"                        </select>\n                    "}]}},{"type":"logic","token":{"type":"Twig.logic.type.else","match":["else"],"output":[{"type":"raw","value":"                    <input type=\"text\" placeholder=\""},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"trans","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.string","value":"js-field-search"},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"\" class=\"fcStringInput default\" umi-field=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"field"}]},{"type":"raw","value":"\"/>\n                    "}]}},{"type":"raw","value":"                </div>\n            "}]}},{"type":"raw","value":"        </th>\n    "}]}},{"type":"raw","value":"    <th class=\"table-cell plus\" style=\"width: 100%; text-align: left; vertical-align: middle;\" title=\""},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"trans","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.string","value":"js-add-column"},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"\">\n        "},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"countFields","match":["countFields"]},{"type":"Twig.expression.type.number","value":1,"match":["1",null]},{"type":"Twig.expression.type.operator.binary","value":">","precidence":8,"associativity":"leftToRight","operator":">"}],"output":[{"type":"raw","value":"            <i class=\"small-ico i-add pointer cols_controler\" ></i>\n        "}]}},{"type":"raw","value":"    </th>\n</tr>\n"}], allowInlineIncludes: true, rethrow: true});

	module.exports = function(context) { return template.render(context); }

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	var twig = __webpack_require__(1).twig,
	    template = twig({id:"10a8998beb17999aa942ece4b95fe5d5d6a7814b92eb5b0034cc2964216aea69a75a1a5083256db908ca335352fee9a57c47c601e5dfd65a3640d4187bd33b78", data:[{"type":"raw","value":"<tr class=\"table-row\">\n    "},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"fieldList","match":["fieldList"]},{"type":"Twig.expression.type.filter","value":"length","match":["|length","length"]},{"type":"Twig.expression.type.number","value":0,"match":["0",null]},{"type":"Twig.expression.type.operator.binary","value":">","precidence":8,"associativity":"leftToRight","operator":">"}],"output":[{"type":"raw","value":"        "},{"type":"logic","token":{"type":"Twig.logic.type.for","key_var":null,"value_var":"field","expression":[{"type":"Twig.expression.type.variable","value":"fieldList","match":["fieldList"]}],"output":[{"type":"raw","value":"            <td style=\"width:"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"size"},{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"size"},{"type":"Twig.expression.type.string","value":"auto"},{"type":"Twig.expression.type.operator.binary","value":"?","precidence":16,"associativity":"rightToLeft","operator":"?"}]},{"type":"raw","value":";\" class=\"pages-bar table-cell panel-sorting td_"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"field"}]},{"type":"raw","value":"\">\n                "},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"firstField","match":["firstField"]},{"type":"Twig.expression.type.key.period","key":"field"},{"type":"Twig.expression.type.variable","value":"field","match":["field"]},{"type":"Twig.expression.type.key.period","key":"field"},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="}],"output":[{"type":"raw","value":"                    <span class=\"pagesLabel\">"},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"trans","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.string","value":"js-pages-label"},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"</span>\n                    "},{"type":"logic","token":{"type":"Twig.logic.type.for","key_var":null,"value_var":"page","expression":[{"type":"Twig.expression.type.variable","value":"pageList","match":["pageList"]}],"output":[{"type":"raw","value":"                        "},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"page","match":["page"]},{"type":"Twig.expression.type.variable","value":"current","match":["current"]},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="}],"output":[{"type":"raw","value":"                            <a class=\"current\">"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"page","match":["page"]}]},{"type":"raw","value":"</a>\n                        "}]}},{"type":"logic","token":{"type":"Twig.logic.type.else","match":["else"],"output":[{"type":"raw","value":"                            <a>"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"page","match":["page"]}]},{"type":"raw","value":"</a>\n                        "}]}},{"type":"raw","value":"                    "}]}},{"type":"raw","value":"                "}]}},{"type":"raw","value":"            </td>\n        "}]}},{"type":"raw","value":"        <td class=\"table-cell empty\">\n            <div class=\"cell-item\">&nbsp;</div>\n        </td>\n    "}]}},{"type":"logic","token":{"type":"Twig.logic.type.else","match":["else"],"output":[{"type":"raw","value":"        <td class=\"pages-bar table-cell\" colspan=\""},{"type":"output","stack":[{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":true,"params":[{"type":"Twig.expression.type.variable","value":"fieldList","match":["fieldList"]},{"type":"Twig.expression.type.filter","value":"length","match":["|length","length"]}]},{"type":"Twig.expression.type.number","value":1,"match":["1",null]},{"type":"Twig.expression.type.operator.binary","value":"+","precidence":6,"associativity":"leftToRight","operator":"+"}]},{"type":"raw","value":"\">\n            <span class=\"pagesLabel\">"},{"type":"output","stack":[{"type":"Twig.expression.type._function","fn":"trans","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.string","value":"js-pages-label"},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]},{"type":"raw","value":"</span>\n            "},{"type":"logic","token":{"type":"Twig.logic.type.for","key_var":null,"value_var":"page","expression":[{"type":"Twig.expression.type.variable","value":"pageList","match":["pageList"]}],"output":[{"type":"raw","value":"                "},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"page","match":["page"]},{"type":"Twig.expression.type.variable","value":"current","match":["current"]},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="}],"output":[{"type":"raw","value":"                    <a class=\"current\">"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"page","match":["page"]}]},{"type":"raw","value":"</a>\n                "}]}},{"type":"logic","token":{"type":"Twig.logic.type.else","match":["else"],"output":[{"type":"raw","value":"                    <a>"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"page","match":["page"]}]},{"type":"raw","value":"</a>\n                "}]}},{"type":"raw","value":"            "}]}},{"type":"raw","value":"        </td>\n    "}]}},{"type":"raw","value":"</tr>"}], allowInlineIncludes: true, rethrow: true});

	module.exports = function(context) { return template.render(context); }

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	var twig = __webpack_require__(1).twig,
	    template = twig({id:"6ffd7115393f5536da3f9d3170d1993f0020344def89fd6361ff917a83392cb69b6a85f08c880009eeb51f34706f46981dff205c8d3b802f9fe3fd7510f73ca2", data:[{"type":"raw","value":"<div class=\"toolbar pull-left\" style=\"min-height:18px;\"></div>"}], allowInlineIncludes: true, rethrow: true});

	module.exports = function(context) { return template.render(context); }

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	/** Шаблон разметки под контрол данных */
	var umiAppView = Backbone.Marionette.LayoutView.extend({
	    template: 'umiAppView.twig',

	    regions:{
	        control: '#udcControlBody',
	        toolbar: '#udcToolbar',
	        controlHeader:'#udcControlHeader'
	    },
	    
	    events:{
	        'click #udcConfigBar a.per_page_limit':'limitChangeHandler',
	        'change select':'changeDomainHandler'
		},

	    /**
	     * Обработчик события before:render,
	     * определяет переменные для использования в шаблоне
	     */
	    onBeforeRender: function () {
	        this.templateHelpers = {
	            limits: (this.options.pageLimits.length > 0) ? this.options.pageLimits : false,
	            current: this.options.perPageLimit,
	            domainsList: this.options.domainsList
	        };
	    },

	    /**
	     * Обработчик события измения количества элементов на страницу в контроле настройки
	     * @param e
	     */
	    limitChangeHandler:function (e) {
	        $('#udcConfigBar a.per_page_limit.current').removeClass('current');
	        $(e.target).addClass('current');
	        dc_application.vent.trigger('b:limitchange',$(e.target).text());
	    },

	    /**
	     * Обработчик события измения выбранного домена в контроле
	     * @param e
	     */
	    changeDomainHandler: function (e) {
			var element = $(e.currentTarget);

			if (typeof element.attr('umi-field') == 'undefined') {
				dc_application.vent.trigger('domainchange',element.val());
			}
	    }

	});

	module.exports = umiAppView;


/***/ }),
/* 17 */
/***/ (function(module, exports) {

	/** Класс для подгрузки конфигурации и пользовательских данных */

	var umiConfig = Backbone.Model.extend({
	    configUrl: '',

	    initialize: function (options) {
	      this.configUrl = options.configUrl;
	    },

	    fetch: function () {
	        var that = this;

	        return $.ajax(this.configUrl, {dataType: 'json'}).then(function (datasetConfig) {
	            if (!_.isEmpty(datasetConfig)) {
	                var defaultColumns = datasetConfig['default'],
	                    out = [];

	                if (defaultColumns.length > 0) {
	                    defaultColumns = defaultColumns.split('|');
	                    _.each(defaultColumns, function (column) {
	                        column = column.split('[');
	                        out.push({field: column[0], size: column[1].split(']')[0]});
	                    });
	                    that.set({def: out});
	                }

	                var methods = datasetConfig['methods'];
	                if (methods.length > 0) {
	                    _.each(methods, function (method) {
	                        that.set(
	                            method['type'] + '_method', method['name']
	                        );
	                        that.set(
	                            method['type'] + '_module', method['module']
	                        );
	                    });
	                }

	                if (!_.isUndefined(that.get('saveField_method'))) {
	                    that.set({save_field_method: that.get('saveField_method')});
	                }

	                out = [];
	                var excludedFields = datasetConfig['excludes'];
	                if (!_.isEmpty(excludedFields)) {
	                    _.each(excludedFields, function (item) {
	                        out.push(item['name']);
	                    });
	                    that.set({fields_excluded: out});
	                }

	                out = {};
	                var fields = datasetConfig['fields'];
	                if (fields.length > 0) {
	                    _.each(fields, function (field) {
	                        if (!_.isUndefined(field['options'])) {
	                            field['options'] = field['options'].split(',');
	                        }
	                        out[field['name']] = field;
	                    });
	                    that.set({fields: out});
	                }

	                var orderKey = 'tree-' + that.get('load_module') + '-' + that.get('load_method');

	                if (datasetConfig['column-order-key']) {
	                    orderKey = datasetConfig['column-order-key'];
	                }

	                that.set('column_order_key', orderKey);
	            }


	        }, function (req, status, err) {
	            console.error(req, status, err);
	        })
	    }
	});

	module.exports = umiConfig;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

	/** Пользовательские настройки */
	var umiUserSettings = Backbone.Model.extend({
	    user_setings_url: "/udata/users/loadUserSettings/?r=" + Math.random(),

	    fetch:function () {
	        var that = this;
	        return $.ajax(that.user_setings_url).then(function (res) {
	            res = $(res).find('item');
	            var out ={};
	            if (res.length > 0){
	                for(var i=0,cnt=res.length;i<cnt;i++){
	                    var item = $(res[i]),
	                        data = {},
	                        values = item.find('value');
	                    out = {};
	                    for (var j=0, jcnt=values.length; j<jcnt; j++){
	                        var value = $(values[j]),
	                            tag = value.attr('tag');
	                        if (tag == 'used-columns') {
	                            data = [];
	                            var colums = value.text().split('|');
	                            if (colums.length > 0) {
	                                for (var k = 0, kcnt = colums.length; k < kcnt; k++) {
	                                    var t = colums[k].split('[');
	                                    data.push({field: t[0], size: t[1].split(']')[0]});
	                                }
	                            }
	                            out[tag] = data;
	                        } else if (tag == 'expanded') {
	                            var str = value.text();
	                            str = str.substr(1);
	                            str = str.substr(0,str.length-1);
	                            out[tag] = str.split('}{');
	                        } else {
	                            out[tag] = value.text();
	                        }
	                    }
	                    that.set(item.attr('key'),out);
	                }
	            }
	        })
	    },

	    sync:function () {
	        console.log(arguments);
	    },
	    
	    save:function (key,value,tag){
	        var url = "/admin/users/saveUserSettings/?key=" + key + "&value=" + value;
	        if (tag){
	            url+='&tags[]='+tag;
	        }
	        this.set(key,value);
	        return $.ajax(url)
	    }
	});

	module.exports = umiUserSettings;


/***/ }),
/* 19 */
/***/ (function(module, exports) {

	/**
	 * Генератор запросов для модели данных
	 * почти полностью утащено из старого датаконтрола
	 */

	var umiQueryBuilder = function(options) {
		var opt = options || {};

		/** Параметры */
		this.AllText = [];
		this.Props = {};
		this.EntIDs = [];
		this.Parents = opt.parent || [];
		this.Langs = opt.lang || [];
		this.Domains = opt.domain || [];
		this.Orders = {};
		this.Perms = true;
		this.Full = true;
		this.FldsOr = false;
		this.Depth = null;
		this.Page = opt.page || 0;
		this.Limit = opt.limit;
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

		this.setHTypes = function(_hTypes) {
			if (_hTypes instanceof Array) {
				this.hTypes = _hTypes;
			} else {
				this.hTypes.push(_hTypes);
			}
		};

		/**
		 * Устанавливает проверку свойства объекта/элемента на равенство
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
		 * Устанавливает проверку свойства объекта/элемента на не равенство
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
		 * Определяет установлен ли фильтр по полю
		 * @returns {boolean}
		 */
		this.hasPropertyFilter = function() {
			return Object.keys(this.Props).length > 0;
		};

		/** Сбрасывает фильтры по полям */
		this.resetPropertyFilter = function() {
			this.Props = {};
		};

		/**
		 * Добавляет сортировку по определенному свойству
		 * @param _PropName  имя свойства
		 * @param _Direction направление сортировки
		 * ('forward'/'asc'/true - в прямом порядке, 'backward'/'desc'/false - в обратном)
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
		 * @param _Direction направление сортировки
		 * ('forward'/'asc'/true - в прямом порядке, 'backward'/'desc'/false - в обратном)
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

		/**
		 * Определяет установлена ли сортировка по полю
		 * @returns {boolean}
		 */
		this.hasPropertyOrder = function() {
			return Object.keys(this.Orders).length > 0;
		};

		/** Сбрасывает сортировку по полям */
		this.resetPropertyOrder = function() {
			this.Orders = {};
		};

		/** Устанавливает фильтрацию по правам */
		this.setPermissions = function(_Use) {
			if (_Use == undefined) {
				this.Perms = true;
			} else {
				this.Perms = _Use ? true : false;
			}
		};

		/**
		 * Устанавливает id возможных родителей
		 * @param _ParentElements одиночное значение или массив
		 */
		this.setParentElements = function(_ParentElements) {
			if (_.isArray(_ParentElements)) {
				this.Parents = _ParentElements;
			} else {
				this.Parents = [_ParentElements];
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
		 * @param _aIDs одиночное значение или массив
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
		 * @param domainIds id домена, из которого выбираем элементы, или массив из id
		 */
		this.setDomain = function(domainIds) {
			domainIds = _.isArray(domainIds) ? domainIds : [domainIds];
			this.Domains = domainIds;
		};

		/**
		 * Устанавливает ограничение на просматриваемые языковые версии
		 * @param _Lang id языка, из которого выбираем элементы, или массив из id
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
					jQuery('#search_result').addClass("active");
					jQuery('#search_result').html(getLabel('js-search-result'));
				} else {
					if (!this.Parents.length && !_MergeFilter.Parents.length) {
						jQuery('#search_result').html("");
						jQuery('#search_result').removeClass("active");
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
				}

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
				}
			}

			QueryPieces.push('childs');
			QueryPieces.push('links');
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

		/** Создает копию фильтра */
		this.clone = function() {
			return _.clone(this);
		};
	};

	module.exports = umiQueryBuilder;


/***/ }),
/* 20 */
/***/ (function(module, exports) {

	/** Базовая модель и коллекция контроллера */
	var umiDataModel = Backbone.RelationalModel.extend({
	    relations: [{
	        type: Backbone.HasMany,
	        key: 'children',
	        relatedModel: umiDataModel,
	        collectionType: umiDataCollection,
	        reverseRelation: {
	            key: 'group_parent',
	            includeInJSON: '_id'
	        }
	    }],

	    defaults: {
	        __children:0
	    },
	    selected:false,
	    expanded:false,

	    select:function (param) {
	        var silent = _.isUndefined(param) ? false : param;
	        this.selected = !this.selected;
	        this.trigger('d:select:change',silent);
	    }
	});

	var umiDataCollection = Backbone.Collection.extend({
	    model: umiDataModel,
	    loadMethod: '',
	    prefix: '',
	    dataProtocol:'json',
	    qb:null,
	    offset:0,
	    limit:0,
	    total:0,

	    sync:function () {

	    },

	    initialize: function (options) {
	        this.loadMethod = options.loadMethod || '';
	        this.prefix = options.prefix || '';
	        this.dataProtocol = options.dataProtocol || 'json';
	        this.qb = options.qb || null;
	    },

	    loadData:function (id) {
	        var that = this;
	        return $.getJSON(this.queryBuilder(id)).then(function (res) {
	            var result = [];
	            that.offset = parseInt(res.data['offset']) || 0;
	            that.limit = parseInt(res.data['per_page_limit']) || 0;
	            that.total = parseInt(res.data['total']) || 0;

	            if (res['error'] == undefined && res['data']['error'] == undefined){
	                result = _.toArray(_.omit(res.data,['total','type','action','offset','per_page_limit']));
	                for (var i = 0, cnt = result.length; i < cnt; i++) {
	                    result[i]['id'] = id + '_' + result[i]['id'];
	                }
	            } else {
	                var error = res['error'] || res['data']['error'];
	                openDialog(error, getLabel('js-error-header'));
	                result = [];
	            }

	            return result;
	        });
	    },

	    /** Подгрузка данных */
	    fetch:function (id) {
	        var that = this;
	        id = id || 0;

	        return this.loadData(id).then(function(res){
	            that.reset(res);
	        });

	    },

	    /** Фильтруем данные */
	    filter: function (patern){
	        var out = [];
	        for (var i=0, cnt=this.length; i<cnt; i++) {
	            var item = this.models[i],
	                fieldVal = item.get(patern[0]['field']),
	                res = !!(fieldVal !== undefined && fieldVal.indexOf(patern[0]['value']) > -1);
	            for (var j = 1, jcnt=patern.length;j<jcnt;j++){
	                fieldVal = item.get(patern[j]['field']);
	                res = res && !!(fieldVal !== undefined && fieldVal.indexOf(patern[j]['value']) > -1);
	            }
	            if (res){
	                out.push(_.omit(item.toJSON(),'ch','level'));
	            }

	            var items = item.get('children');
	            if (items !== undefined && items.length !== undefined && items.length > 0) {
	                var sub_out = items.filter(patern);
	                out = out.concat(sub_out);
	            }

	        }
	        return out;
	    },

	    /** получаем выделенные элементы все с учетом вложенности */
	    getSelected:function () {
	        var out = [];
	        for (var i=0, cnt=this.length; i<cnt; i++) {
	            var item = this.models[i];
	            if (item.selected){
	                out.push(item)
	            }
	            if (item.expanded) {
	                var items = item.get('children');
	                if (items !== undefined && items.length !== undefined && items.length > 0) {
	                    var res = items.getSelected();
	                    if (res.length>0) {
	                        out = out.concat(res);
	                    }
	                }
	            }
	        }
	        return out;
	    },

	    processModel:function (func) {
	        if (_.isUndefined(func)) return false;

	        var that = this,
	            out = [];

	        for (var i=0, cnt=this.length; i<cnt; i++) {
	            var item = this.models[i];
	            if (func.call(item)){
	                out.push(item)
	            }
	            if (item.expanded) {
	                var items = item.get('children');
	                if (items !== undefined && items.length !== undefined && items.length > 0) {
	                    var res = items.processModel(func);
	                    if (res.length>0) {
	                        out = out.concat(res);
	                    }
	                }
	            }
	        }
	        return out;

	    },

	    queryBuilder:function(id){
	        this.qb.setParentElements([]);
	        if (!_.isUndefined(id)){
	            this.qb.setParentElements(dc_application.unPackId(id));
	        }
	        return this.prefix+'/'+this.loadMethod+'.'+this.dataProtocol+dc_application.assembleQueryString(this.qb);
	    }
	});

	module.exports = umiDataCollection;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	/** Представление заголовка таблицы */

	var umiTableHeaderView = Backbone.Marionette.LayoutView.extend({
	    tagName:'thead',

	    events:{
	        'keyup input':'onKeyPressHandler',
	        'click .table-title':'orderChange',
	        'change select':'filterSelectChange',
	        'mousedown span':'resizeHandler',
	        'click .cols_controler':'showMenu',
	        'mouseout .cols_controler':'hideMenu'
	    },

	    menu: null,

	    onBeforeRender: function () {
	        this.templateHelpers = {};
	        this.templateHelpers = this.model.attributes;
	    },

	    onRender:function () {

	        _.each($('select',this.$el),function (item){
	            new ControlComboBox({el:$(item)});
	        });

	        $('input[umi-type="date"]').datepicker({
	            dateFormat: "dd.mm.yy",
	            onSelect:function (){
	                var value = $(this).val(),
	                    field = $(this).attr('umi-field'),
	                    type = $(this).attr('umi-type'),
	                    valid = __webpack_require__(22);
	                $(this).removeClass('_error');
	                if (value.length>0){
	                    if (valid.test(type,value)) {
	                        dc_application.vent.trigger('data:filter', [{field: field, value: value}]);
	                    } else {
	                        $(this).addClass('_error');
	                    }
	                }
	            }
	        });
	        $('input[umi-type="datetime"]').datepicker({
	            dateFormat: "dd.mm.yy 00:00",
	            onSelect:function (){
	                var value = $(this).val(),
	                    field = $(this).attr('umi-field'),
	                    type = $(this).attr('umi-type'),
	                    valid = __webpack_require__(22);
	                $(this).removeClass('_error');
	                if (value.length>0){
	                    if (valid.test(type,value)) {
	                        dc_application.vent.trigger('data:filter', [{field: field, value: value}]);
	                    } else {
	                        $(this).addClass('_error');
	                    }
	                }
	            }
	        });
	    },

	    onKeyPressHandler:function (e) {
	        var value = $(e.target).val(),
	            field = $(e.target).attr('umi-field'),
	            type = $(this).attr('umi-type'),
	            valid = __webpack_require__(22);

	        if (e.keyCode == 13 && value.length>0){
	            if (valid.test(type,value)) {
	                dc_application.vent.trigger('data:filter', [{field: field, value: value}]);
	            } else {
	                $(e.target).addClass('_error');
	            }
	        } else if (e.keyCode == 13 && value.length == 0){
	            $(e.target).removeClass('_error');
	            dc_application.vent.trigger('data:filter',[{field:field,value:''}]);
	        }
	    },

	    /** Сбрасывает индикаци фильтров */
	    resetFilter: function() {
	        var $filterContainerList = $('div.input-search');
	        $('input', $filterContainerList).val('');
	        $('select option', $filterContainerList).remove();
	        $('select', $filterContainerList).append('<option value="-1" selected="selected">' + getLabel('js-all') +'</option>');
	        $('div.select div.selected', $filterContainerList).text(getLabel('js-all'));
	    },

	    orderChange:function (e) {
	        var el = $(e.target),
	            field = el.attr('umi-field'),
	            direction = 'asc';
	        if (el.hasClass('disabled')){
	            $('.table-title:not(.disabled)').removeClass('switch').addClass('disabled');
	            el.removeClass('disabled');
	        } else if (el.hasClass('switch')){
	            el.removeClass('switch');
	        } else {
	            direction = 'desc';
	            el.addClass('switch');
	        }
	        dc_application.vent.trigger('b:orderhange',field,direction);
	    },

	    /** Сбрасывает индикацию сортировок */
	    resetOrder: function() {
	        $('.table-title').removeClass('switch').addClass('disabled');
	    },

	    resizeHandler:function (e) {
	        var that = this,
	            floatResizing = $('<div></div>'),
	            tableContainer = this.$el.parent(),
	            containerOffset = tableContainer.offset(),
	            container = $(e.target).parent();

	        floatResizing.addClass('resizer');
	        floatResizing.css({
	            top: containerOffset.top,
	            left: e.clientX,
	            height: tableContainer.outerHeight() + 'px'
	        });

	        $(document).on('mouseup', function (e) {
	            that.resizerMouseUp(floatResizing, container)
	        });
	        $(document).on('mousemove', function (e) {
	            that.resizerMouseMove(floatResizing,e.clientX)
	        });

	        $('body').append(floatResizing);

	    },

	    resizerMouseUp:function (el, tableHeaderCell) {
	        $(document).off('mouseup');
	        $(document).off('mousemove');

	        var $headerContainer = $(tableHeaderCell),
	            newColumnSize = el.position().left - $headerContainer.offset().left,
	            colName = tableHeaderCell.attr('umi-field');

	        newColumnSize = Math.min(newColumnSize, 800);
	        newColumnSize = Math.max(newColumnSize, 150);

	        var oldColumnSize = $headerContainer.outerWidth();

	        if (newColumnSize !== oldColumnSize) {
	            $headerContainer.css({
	                width:newColumnSize + 'px',
	                maxWidth:newColumnSize + 'px'
	            });

	            var $cellContainer = $('td.td_' + colName);
	            $cellContainer.css({
	                width: newColumnSize + 'px',
	                maxWidth: newColumnSize + 'px'
	            });

	            this.recalculateValueCellWidth($cellContainer);
	        }

	        el.detach();
	        dc_application.vent.trigger('data:saveusercolls');
	    },

	    /** Устанавливает ширину для всех ячеек со значениями полей */
	    recalculateAllValueCellsWidth: function () {
	        var that = this;

	        $('#udcControlBody td.table-cell').each(function() {
	            var $cellContainer = $(this);
	            that.recalculateValueCellWidth($cellContainer);
	        });
	    },

	    /**
	     * Устанавливает ширину для ячейки со значением поля
	     * @param {jQuery|Object} $cellContainer контейнер ячейки
	     */
	    recalculateValueCellWidth: function ($cellContainer) {
	        var $valueCellContainer = $('span.item', $cellContainer);

	        if ($valueCellContainer.length) {
	            $valueCellContainer.css({
	                'width': this.calculateValueCellContainerWidth($cellContainer)
	            });
	        }
	    },

	    /**
	     * Вычисляет ширину значения ячейки
	     * @param {jQuery|Object} $cellContainer контейнер ячейки
	     * @returns {number}
	     */
	    calculateValueCellContainerWidth: function ($cellContainer) {
	        var tableValueCellWidth = parseInt($cellContainer.css('width'));
	        var $editButtonContainer = $('i.i-change', $cellContainer);
	        var editButtonWidth = $editButtonContainer.length ? parseInt($editButtonContainer.outerWidth(true)) : 18;
	        var $toggleOnContainer = $('span.catalog-toggle-wrapper', $cellContainer);
	        var toggleOnWidth = $toggleOnContainer.length ? parseInt($toggleOnContainer.outerWidth(true)) : 0;
	        var $toggleOffContainer = $('span.catalog-toggle-off', $cellContainer);
	        var toggleOffWidth = $toggleOffContainer.length ? parseInt($toggleOffContainer.outerWidth(true)) : 0;
	        var $checkboxContainer = $('div.checkbox', $cellContainer);
	        var checkboxWidth = $checkboxContainer.length ? parseInt($checkboxContainer.outerWidth(true)) : 0;
	        var tableValueCellPaddingLeft = parseInt($cellContainer.css('padding-left'));
	        var tableValueCellPaddingRight = parseInt($cellContainer.css('padding-right'));
	        return tableValueCellWidth - toggleOnWidth - editButtonWidth - toggleOffWidth - checkboxWidth - tableValueCellPaddingLeft - tableValueCellPaddingRight;
	    },

	    resizerMouseMove:function (el,x) {
	        el.css('left', x);
	    },

	    filterSelectChange:function(e){
	        var value = $(e.target).val();
	        value = value == -1 ? '' : value;
	        dc_application.vent.trigger('data:filter',[{field:$(e.target).attr('umi-field'),value:value}]);
	    },

	    showMenu:function (e) {
	        if (this.menu === null) {
	            this.menu = $.cmenu.getMenu(dc_application.columnsMenu);
	        }
	        $.cmenu.lockHiding = true;
	        $.cmenu.show(this.menu, $('div.container').get(0), e);
	    },

	    hideMenu:function () {
	        $.cmenu.lockHiding = false;
	    }
	});

	module.exports = umiTableHeaderView;

/***/ }),
/* 22 */
/***/ (function(module, exports) {

	/** Проверка введенных данных. */
	var umiDataValidate = function(){
	    var types = {
	        'date':/^([0-9]{2}).([0-9]{2}).([0-9]{4})$/,
	        'datetime':/^([0-9]{2}).([0-9]{2}).([0-9]{4}) ([0-9]){2}:([0-9]){2}$/,
	        'time':/^([0-9]){2}:([0-9]){2}$/,
			'number': /^[0-9eE.,]+$/,
			'integer': /^[0-9eE]+$/
	    };

	    return {
	        test:function (type,value) {
	            if (types.hasOwnProperty(type)){
	                return types[type].test(value);
	            } else {
	                return true;
	            }
	        }
	    }
	};

	module.exports = new umiDataValidate();

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	/** Представление таблицы */

	var NoChildrenView = Marionette.ItemView.extend({
		tagName: 'tr',
		className: 'table-row',
		template: 'umiTableEmpty.twig',
		dragAllowed: false,

		initialize: function(options) {
			this.template = options.template;
			this.fields = options.fields;
		},

		onBeforeRender: function() {
			this.templateHelpers = {};
			this.templateHelpers = {
				name: this.model.get('name'),
				fields: [],
				used_fields: this.fields
			};
		}
	});

	var umiDataTableRow = Backbone.Marionette.ItemView.extend({
		tagName: 'tr',
		className: 'table-row',
		shiftMode: false,
		dragAllowed: false,
		parent: null,
		parentView: null,

		events: {
			'click .catalog-toggle-wrapper': 'expandHandler',
			'click': 'clickHandler',
			'click .small-ico.i-change.editable': 'enableInLineEdit',
			'mouseover': 'mouseMoveHandler'
		},

		/**
		 * Инициализация вьюхи
		 * @param options
		 */
		initialize: function(options) {
			this.template = options.template;
			this.fields = options.fields;
			this.dragAllowed = options.dragAllowed;
			this.parent = options.parent || false;
		},

		/** Обработчик события до отрисовки вьюхи */
		onBeforeRender: function() {
			var that = this,
				editLink = __webpack_require__(7);
			this.templateHelpers = {};
			this.templateHelpers = {
				name: false,
				fields: this.model.attributes,
				used_fields: this.fields,
				cid: this.model.get('id'),
				editLink: editLink({
					pre_lang: window.pre_lang,
					module: dc_application.config.get('module'),
					method: dc_application.config.get('edit_method'),
					id: dc_application.unPackId(this.model.get('id')),
					params: this.model.get('__type')
				})
			};
			this.model.on('d:select:change', function(e) {
				that.selectChangeHandler.call(that, e);
			});
		},

		/** Обработчик события отрисовки вьюхи */
		onRender: function() {
			var that = this,
					DropMode = 'child',
					dragEl,
					pixelOffset = -2;

			this.model.selected = false;

			//Если разрешена инициализируем драг и дроп
			if (this.dragAllowed) {
				$('td:first-child', this.$el).draggable({
					appendTo: 'body',
					distance: 7,
					handle: 'span.item',
					cursorAt: {right: pixelOffset},
					helper: function() {
						if (!that.model.selected) {
							that.model.select(true);
						}
						dragEl = document.createElement('div');
						var selected = [];

						that.parent.children.each(function(item) {
							if (item.model.selected) {
								selected.push(item.model);
							}
						});

						dragEl.innerHTML = '';
						for (var i = 0, cnt = selected.length; i < cnt; i++) {
							dragEl.innerHTML += '<div>' + selected[i].get(that.fields[0].name) + '</div>';
						}

						dragEl.className = 'ti-draggable';

						jQuery(dragEl).css({
							'position': 'absolute',
							'padding-left': '20px'
						});

						return dragEl
					},
					start: function() {
						dc_application.drugMode = true;
						dc_application.draggableItem = [];

						that.parent.children.each(function(item) {
							if (item.model.selected) {
								dc_application.draggableItem.push(item);
							}
						})

					},
					drag: function(e) {
						if (dc_application.hView && dc_application.hView.cid !== dc_application.draggableItem[0].cid) {
							var y = e.pageY,
									hItem = dc_application.hView,
									cpos = $('table.table', $(dc_application.options.container)).offset(),
									itmHeight = hItem.$el.height(),
									itmDelta = y - cpos.top - hItem.$el.position().top;

							if (itmDelta < itmHeight / 3) {
								DropMode = 'before';
							}
							if (itmDelta > itmHeight / 3 && itmDelta < 2 * itmHeight / 3) {
								DropMode = 'child';
							}
							if (itmDelta > 2 * itmHeight / 3) {
								DropMode = 'after';
							}

							if (hItem.isRoot() && hItem.hasChildren()) {
								DropMode = 'child';
							}

							dc_application.initDroppable(DropMode);
						}

					},
					stop: function() {
						dc_application.tryToMove(DropMode, dc_application.draggableItem, dc_application.hView);
						dc_application.drugMode = false;
						dc_application.hView = null;
						dc_application.draggableItem = null;
						dc_application.dropIndicator.style.display = 'none';
						$(dragEl).remove();
					}
				});
			}
		},

		mouseMoveHandler: function() {
			if (this.dragAllowed && dc_application.drugMode) {
				if (dc_application.hView === null || dc_application.hView.cid !== this.cid) {
					dc_application.hView = this;
				}
			}
		},

		/**
		 * Выделение строк
		 * @param silent
		 */
		selectChangeHandler: function(silent) {
			if (this.model.selected) {
				this.$el.addClass('selected');
				$('.checkbox', this.$el).addClass('checked');
			} else {
				this.$el.removeClass('selected');
				$('.checkbox', this.$el).removeClass('checked');
			}

			if (!silent) {
				dc_application.vent.trigger('item:selected', this);
			}
		},

		/**
		 * Обработчик клилка на контрол разворачивания/сворачивания дерева
		 * @param e
		 */
		expandHandler: function(e) {
			if (!$('.catalog-toggle', this.$el).hasClass('switch')) {
				this.model.expanded = false;
			} else {
				this.model.expanded = true;
			}
			this.model.expanded = !this.model.expanded;
			$('.catalog-toggle', this.$el).toggleClass("switch");
			e.stopPropagation();
			this.trigger('expand');
		},

		/**
		 * Клик по всему контролу обрабатывет выделение
		 * @param e
		 */
		clickHandler: function(e) {
			if (String(e.target.tagName).toLowerCase() !== 'button') {
				this.shiftMode = e.shiftKey;
				this.model.select();
			}
		},

		/**
		 * Обработчик клика по контролу инлайн редактирования
		 * @param e
		 */
		enableInLineEdit: function(e) {
			var inline = __webpack_require__(24),
					that = this,
					el = $(e.target),
					field = el.attr('umi-field');
			if (this.parent.inline !== null) {
				this.parent.inline.row.model.selected = false;
				this.parent.inline.row.selectChangeHandler();
				this.parent.inline.off('il:editcomplite');
				this.parent.inline.removeSilent();
			}
			this.parent.inline = new inline({model: this.model, _target: e.target, row: that});
			this.parent.inline.once('il:editcomplite', function(val) {
				var d = {};
				d[field] = val;
				that.parent.inline = null;
				dc_application.runmethod('save_field_method', {
					id: dc_application.unPackId(that.model.get('id')),
					data: {field: field, value: val, type: that.model.get('__type')}
				}).done(function(res) {
					if (!_.isUndefined(res['data']) && !_.isUndefined(res['data']['error'])) {
						openDialog(res['data']['error'], getLabel('js-error-header'));
					} else {
						that.model.set(d);
					}

					that.render();
					that.selectChangeHandler();

					if (!_.isUndefined(res['data']) && !_.isUndefined(res['data']['refresh'])) {
						dc_application.refresh();
					}
				}).fail(function() {
					that.render();
				});
			});
		},

		/**
		 * Определяет является ли этот ряд корневым элементом
		 * @returns {boolean}
		 */
		isRoot: function() {
			var rootIdLength = 2;
			var idList = this.model.get('id').split('_');
			return (idList.length == rootIdLength && idList[0] == 0);
		},

		/**
		 * Определяет есть ли у ряда дочерние ряды
		 * @returns {boolean}
		 */
		hasChildren: function() {
			return this.model.attributes.children.length > 0;
		}
	});

	var umiDataTableView = Backbone.Marionette.CollectionView.extend({
		childView: umiDataTableRow,
		emptyView: NoChildrenView,
		tagName: 'tbody',
		childViewEventPrefix: "udcrow",
		it: '111',
		fields: null,
		inline: null,
		dragAllowed: false,
		parentView: null,

		events: {
			'click .pages-bar a': 'pageNavigationClick'
		},

		initialize: function(options) {
			this.template = options.template;
			this.fields = options.fields;
			this.dragAllowed = options.dragAllowed;
			this.parentView = options.parentView || null;
		},

		childViewOptions: function() {
			return {
				template: this.template,
				fields: this.fields,
				dragAllowed: this.dragAllowed,
				parent: this
			}
		},

		pageNavigationClick: function(e) {
			dc_application.vent.trigger('b:pagechange', $(e.target).text(), this);
		},

		/** Косле отрисовки колекции генерим и рисуем строку пагинации */
		onBeforeRenderCollection: function() {
			if (this.$el.find('tr.table-row td.pages-bar').length > 0) {
				return true;
			}

			var data = this.collection;

			if (data.limit >= data.total) {
				return true;
			}

			var current = Math.ceil(data.offset / data.limit) + 1;
			current = current === 0 ? 1 : current;
			var total = Math.ceil(data.total / data.limit);
			var pageList = [];

			for (var i = -3; i < 4; i++) {
				var val = current + i;
				if (val > 0 && val <= total) {
					pageList.push(current + i);
				}
			}

			var counter = 0;

			if (total - pageList[pageList.length - 1] <= 3) {
				for (i = pageList[0] - 1, counter = total - 7; i > counter && i > 1; i--) {
					pageList.unshift(i);
				}
			} else if (pageList[0] <= 3) {
				for (i = pageList[pageList.length - 1] + 1, counter = 7; i <= counter && i <= total; i++) {
					pageList.push(i);
				}
			}

			var gapSymbol = '...';

			if (pageList[0] !== 1) {
				if (pageList[0] - 1 <= 3) {
					for (i = pageList[0] - 1; i > 0; i--) {
						pageList.unshift(i);
					}
				} else {
					pageList.unshift(1, gapSymbol);
				}
			}

			if (pageList[pageList.length - 1] !== total) {
				if (total - pageList[pageList.length - 1] <= 3) {
					for (i = pageList[pageList.length - 1] + 1; i <= total; i++) {
						pageList.push(i);
					}
				} else {
					pageList.push(gapSymbol, total);
				}
			}

			var pageNavigationBar = __webpack_require__(14);
			this.$el.append(pageNavigationBar({
				firstField: this.fields.length > 0 ? this.fields[0] : null,
				fieldList: this.fields,
				pageList: pageList,
				current: current
			}));
		}
	});

	module.exports = umiDataTableView;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

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
				valid = __webpack_require__(22);

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


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	/** Тулбар панели */
	var Toolbar = Backbone.Marionette.ItemView.extend({
	    options: {},
	    template: 'umiToolbarTemplate.twig',
	    buttonTemplate: _.template('<a class="icon-action" href="<%= url %>" title="<%= title %>" name="<%= name %>"><i class="small-ico <%= ico %>"></i></a>'),
	    TableToolbarFunctions:__webpack_require__(26),
	    selectedItemsCount:0,
	    selectedItems:[],

	    buttons: [],
	    menu: [],
	    selectButtons: [],
	    resetButtons: [],
	    singleActionButtons: [],
	    exchangeButtons: [],


	    initialize: function (options) {
	        this.options = _.extend(this.options, options);

	        if (typeof this.options.showSelectButtons === 'undefined') {
	            this.options.showSelectButtons = true;
	        }

	        if (typeof this.options.showResetButtons === 'undefined') {
	            this.options.showResetButtons = true;
	        }

	        this.menu = [
	            this.TableToolbarFunctions.addButton,
	            this.TableToolbarFunctions.editButton,
	            this.TableToolbarFunctions.delButton
	        ];

	        if (this.options.showResetButtons) {
	            this.resetButtons = [
	                this.TableToolbarFunctions.refresh,
	                this.TableToolbarFunctions.resetFilterAndSortButton
	            ];
	        }

	        if (this.options.showSelectButtons) {
	            this.selectButtons = [
	                this.TableToolbarFunctions.selectAllButton,
	                this.TableToolbarFunctions.unSelectAllButton,
	                this.TableToolbarFunctions.invertAllButton
	            ];
	        }

	        this.singleActionButtons = [
	            this.TableToolbarFunctions.editButton,
	            this.TableToolbarFunctions.addButton
	        ];
	    },

	    onRender: function () {
	        if (!_.isUndefined(this.options.toolbarFunctions)) {
	            var fkeys = Object.keys(this.options.toolbarFunctions);
	            for (var j = 0, cnt = fkeys.length; j < cnt; j++) {
	                this.TableToolbarFunctions[fkeys[j]] = this.options.toolbarFunctions[fkeys[j]];
	            }
	        }
	        if (!_.isUndefined(this.options.toolbarMenu)) {
	            this.menu = [];
	            for (var k = 0, mcnt = this.options.toolbarMenu.length; k < mcnt; k++) {
	                this.menu.push(this.TableToolbarFunctions[this.options.toolbarMenu[k]]);
	            }
	        }

	        for (var i = 0, cnt = this.menu.length; i < cnt; i++) {
	            if (this.menu[i].name === 'ico_add') {
	                if (this.options.disableAddButton) {
	                    this.appendButton(this.menu[i]);
	                }
	            } else {
	                this.appendButton(this.menu[i]);
	            }

	        }

	        this.disableButtons(this.menu);

	        if (this.options.showResetButtons) {
	            for (var i = 0, cnt = this.resetButtons.length; i < cnt; i++) {
	                this.appendButton(this.resetButtons[i]);
	            }
	        }

	        if (this.options.showSelectButtons) {
	            for (var i = 0, cnt = this.selectButtons.length; i < cnt; i++) {
	                this.appendButton(this.selectButtons[i]);
	            }

	            this.disableButtons(this.selectButtons[2]);
	        }

	        this.initButtons(dc_application.data.models[0]);
	    },

	    appendButton: function (button) {
	        var $buttonElement = this.renderButton(button);
	        this.buttons.push(button);
	        this.$el.find('.toolbar').append($buttonElement);
	    },

	    /**
	     * Формирует Html представление кнопки
	     * @param {Object} button кнопка
	     * @returns {jQuery}
	     */
	    renderButton: function(button) {
	        var html = this.buttonTemplate({
	            url: button.href || '#',
	            name: button.name || 'toolbtn',
	            ico: button.className || "",
	            title: button.hint || ''
	        });

	        if (button['el']) {
	            var newElement = $(html);
	            var existElement = $(button['el']);
	            existElement.attr('class', newElement.attr('class'));
	            existElement.attr('href', newElement.attr('href'));
	            existElement.attr('title', newElement.attr('title'));
	            existElement.attr('name', newElement.attr('name'));
	            existElement.html($('i', newElement));
	            return button['el'];
	        }

	        var buttonElement = $(html);
	        button['el'] = buttonElement;
	        this.bindButtonClick(button);
	        return buttonElement;
	    },

	    /**
	     * Прикрепляет обработчик нажатия к кнопке тулбара
	     * @param {Object} button кнопка
	     */
	    bindButtonClick: function(button) {
	        if (!button['el']) {
	            return;
	        }

	        var buttonElement = $(button['el']);

	        if (typeof(button.release) === 'function') {
	            buttonElement.on('click', function () {

	                if ($(this).hasClass('disabled')) {
	                    return false;
	                }

	                return button.release(button);
	            });
	        } else {
	            buttonElement.on('click', function () {
	                return !$(this).hasClass('disabled');
	            });
	        }
	    },

	    /** Прикрепляет обработчик нажатия ко всем кнопкам тулбара */
	    bindAllButtonsClick: function () {
	        for (var i = 0; i < this.buttons.length; i++) {
	            this.bindButtonClick(this.buttons[i]);
	        }
	    },

	    disableButtons: function (btns) {
	        if (!_.isArray(btns)) {
	            btns = [btns];
	        }

	        for (var i = 0, cnt = btns.length; i < cnt; i++) {
	            this.$el.find('a[name="' + btns[i].name + '"]').addClass('disabled');
	        }
	    },

	    enableButtons: function (btns) {
	        if (!_.isArray(btns)) {
	            btns = [btns];
	        }

	        for (var i = 0, cnt = btns.length; i < cnt; i++) {
	            this.$el.find('a[name="' + btns[i].name + '"]').removeClass('disabled');
	        }
	    },

	    initButtons: function (item) {
	        for (var i = 0; i < this.buttons.length; i++) {
	            this.buttons[i].init(this.buttons[i],item);
	        }
	    },

	    redraw:function () {
	        this.selectedItems = dc_application.data.getSelected();
	        this.selectedItemsCount = this.selectedItems.length;

	        if (this.selectedItemsCount > 0) {
	            this.enableButtons(this.menu);

	            if (this.options.showSelectButtons) {
	                this.enableButtons(this.selectButtons[2]);
	            }

	            if (this.selectedItemsCount > 1) {
	                this.disableButtons(this.singleActionButtons);
	            }
	        } else {
	            this.disableButtons(this.menu);

	            if (this.options.showSelectButtons) {
	                this.disableButtons(this.selectButtons[2]);
	            }
	        }

	        if (this.options.showResetButtons) {
	            for (var i = 0, cnt = this.resetButtons.length; i < cnt; i++) {
	                this.enableButtons(this.resetButtons[i]);
	            }
	        }

	        this.initButtons();
	    }
	});


	module.exports = Toolbar;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	/** Кнопки для тулбара */
	var umiButtons = {
	    delButton: {
	        name: 'ico_del',
	        className: 'i-remove',
	        hint: getLabel('js-delete'),
	        init: function (button,item) {
	            var toolbar = dc_application.getToolBar();
	            var e = button.el,
	                HandleItem = _.isUndefined(item) ? toolbar.selectedItems : [item];

	            if (HandleItem !== null && HandleItem.length > 0) {
	                toolbar.enableButtons(e)
	            } else {
	                toolbar.disableButtons(e)
	            }
	        },

	        release: function (button,item) {
	            var toolbar = dc_application.getToolBar();
	            var entitiesIdList = [],
	                selectedList = toolbar.selectedItems;

	            if (selectedList.length > 0) {
	                entitiesIdList = [];
	                _.each(selectedList,function (item) {
	                    entitiesIdList.push(item.pick('id','__type'));
	                });
	                entitiesIdList = dc_application.unPackId(entitiesIdList);
	            }

	            if (toolbar.selectedItems.length > 0) {

	                dc_application.runmethod('delete_method', {data:{
	                    'element': entitiesIdList
	                }}).done(function (res) {

	                    if (!_.isUndefined(res['data']) && !_.isUndefined(res['data']['error'])) {
	                        return openDialog(res['data']['error'], getLabel('js-error-header'));
	                    }

	                    if (!_.isUndefined(res.data.data.success) || !_.isUndefined(res.data.success)) {
	                        _.each(selectedList,function (item) {
	                            item.collection.remove(item);
	                        });
	                    }
	                }).fail(function(response) {
	                    var message = getLabel('js-server_error');

	                    if (response.status === 403 && response.responseJSON && response.responseJSON.data && response.responseJSON.data.error) {
	                        message = response.responseJSON.data.error;
	                    }

	                    alert(message);
	                });

	            }
	            return false;
	        }
	    },

	    editButton: {
	        name: 'ico_edit',
	        className: 'i-edit',
	        hint: getLabel('js-edit-item'),
	        init: function (button,item) {
	            var toolbar = dc_application.getToolBar();
	            var e = button.el,
	                HandleItem = _.isUndefined(item) ? toolbar.selectedItems : [item];
	            if (HandleItem !== null && HandleItem.length == 1) {
	                var href = __webpack_require__(7);
	                href = href({
	                    module: dc_application.config.get('module'),
	                    method: dc_application.config.get('edit_method'),
	                    id: dc_application.unPackId(HandleItem[0].get('id')),
	                    params: HandleItem[0].get('__type')
	                });
	                e.prop('href', href);
	            }
	        },

	        release: function (button) {
	            return true;
	        }
	    },

	    addButton: {
	        name: 'ico_add',
	        className: 'i-add',
	        hint: getLabel('js-add-page'),
	        init : function(button,item) {
	            var toolbar = dc_application.getToolBar();
	            var e = button.el,
	                HandleItem = _.isUndefined(item) ? toolbar.selectedItems : [item];
	            if (HandleItem !== null && HandleItem.length == 1 && !_.isUndefined(HandleItem[0].createLink)) {
	                toolbar.enableButtons(e);
	            } else {
	                toolbar.disableButtons(e)
	            }
	        },

	        release: function (button) {
	            return true;
	        }
	    },

	    selectAllButton: {
	        name: 'selectAll',
	        hint: getLabel('js-select-all'),
	        className: 'i-select',
	        alwaysActive:true,
	        init: function(button) {

	        },
	        release: function() {
	            dc_application.data.processModel(function (){
	                if (!this.selected){
	                    this.select(true);
	                }
	            });
	            dc_application.getToolBar().redraw();
	            return false;
	        }
	    },

	    unSelectAllButton: {
	        name: 'unSelectAll',
	        hint: getLabel('js-un-select-all'),
	        className: 'i-unselect',
	        alwaysActive:true,
	        init: function(button) {

	        },
	        release: function() {
	            dc_application.data.processModel(function (){
	                if (this.selected){
	                    this.select(true);
	                }
	            });
	            dc_application.getToolBar().redraw();
	            return false;
	        }
	    },

	    invertAllButton: {
	        name: 'invertAll',
	        hint: getLabel('js-invert-all'),
	        className: 'i-invertselect',
	        init: function(button) {
	            var toolbar = dc_application.getToolBar();

	            if (toolbar.selectedItemsCount > 0) {
	                toolbar.enableButtons(button);
	            } else {
	                toolbar.disableButtons(button);
	            }
	        },
	        release: function() {
	            dc_application.data.processModel(function (){
	                this.select(true);
	            });
	            dc_application.getToolBar().redraw();
	            return false;
	        }
	    },

	    /** Конфиг кнопки сброса фильтров и сортировки */
	    resetFilterAndSortButton: {
	        name: 'resetFilterAndSort',
	        hint: getLabel('js-reset-filter-and-sort'),
	        className: 'i-reset-filter-and-sort',
	        init: function(button) {
	            dc_application.getToolBar().enableButtons(button);
	        },
	        release: function() {
	            var app = dc_application;
	            var queryBuilder = app.getQueryBuilder();

	            if (queryBuilder.hasPropertyFilter() || queryBuilder.hasPropertyOrder()) {
	                app.resetFilterAndSort();
	            }

	            return false;
	        }
	    },

	    /** Конфиг кнопки перезагрузки табличного контрола */
	    refresh: {
	        name: 'refresh',
	        className: 'i-refresh',
	        hint: getLabel('js-refresh'),
	        init: function(button) {
	            dc_application.getToolBar().enableButtons(button);
	        },
	        release: function() {
	            dc_application.refresh();
	            return false;
	        }
	    }
	};

	module.exports = umiButtons;


/***/ })
/******/ ]);