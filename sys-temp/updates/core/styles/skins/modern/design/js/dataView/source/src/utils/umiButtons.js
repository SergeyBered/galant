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
                var href = require('./../templates_src/editLink.twig');
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
