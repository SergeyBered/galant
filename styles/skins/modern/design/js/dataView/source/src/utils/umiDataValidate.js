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