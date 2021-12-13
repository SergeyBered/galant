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
