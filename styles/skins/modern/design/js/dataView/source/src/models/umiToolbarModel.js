/** Модель описывающая функции тулбара и колекцию этих функций */
var umiToolbarModel = Backbone.Model.extend({
    disabled:false,
    active:false
});

var umiToolbarCollection = Backbone.Collection.extend({
    model:umiToolbarModel,

    fetch:function () {
        
    },

    getSselectedList:function(){
        return _.filter(this.models,function(item){ return item.disabled })    
    }
});

module.exports = umiToolbarCollection;