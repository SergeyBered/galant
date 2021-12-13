/** Основной класс контроллер компонента Data */
var Twig = require('twig');

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
            return require('./templates_src/' + rawTemplate).template;
        };

        Backbone.Marionette.Renderer.render = function(template, data) {
            return require('./templates_src/' + template)(data);
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
        this.layouts = require('./view/umiAppView');
        this.layouts = new this.layouts({
            perPageLimit: this.perPageLimit,
            pageLimits: this.pageLimits,
            domainsList: this.options.domainsList || false
        });
        this.layouts.on('show', function() {
            that.onLayoutShow.call(that);
        });
        this.getRegion('umiMain').show(this.layouts);

        this.childTemplate = require('./templates_src/umiTableChildWrapper.twig');
    },

    /** Обработчик события отрисовки базовой верстки контрола */
    onLayoutShow: function() {
        var that = this;
        this.config = require('./models/umiConfig');
        this.config = new this.config({
            configUrl: this.configUrl,
            module: this.options['module'],
            param: this.options['controlParam']
        });

        this.config.fetch().then(function() {
            that.userSettings = require('./models/umiUserSettings');
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

            var filter = require('./utils/umiQueryBuilder');
            that.data = require('./models/umiDataModel');
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
        var headerView = require('./view/umiTableHeaderView');
        headerView = new headerView({model: header, el: '#udcControlHeader', template: this.head});
        headerView.render();
        this.tableHeaderView = headerView;

        this.vent.on('data:filter', function(pattern) {
            that.filterData.call(that, pattern);
        });
        this.vent.on('data:reset_filter', function() {
            that.resetFilter.call(that);
        });

        var Table = require('./view/umiDataTableView');
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
        this.toolbar = require('./utils/umiToolbar');
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

                var ch_data = require('./models/umiDataModel');
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
        var Table = require('./view/umiDataTableView');
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
