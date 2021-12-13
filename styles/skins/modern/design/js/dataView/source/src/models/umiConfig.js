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
