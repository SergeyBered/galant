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
