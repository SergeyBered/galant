//! moment.js
//! version : 2.5.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (undefined) {

    /************************************
        Constants
    ************************************/

    var moment,
        VERSION = "2.5.1",
        global = this,
        round = Math.round,
        i,

        YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,

        // internal storage for language config files
        languages = {},

        // moment internal properties
        momentProperties = {
            _isAMomentObject: null,
            _i : null,
            _f : null,
            _l : null,
            _strict : null,
            _isUTC : null,
            _offset : null,  // optional. Combine with _isUTC
            _pf : null,
            _lang : null  // optional
        },

        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined'),

        // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
        aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,

        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
        parseTokenDigits = /\d+/, // nonzero number of digits
        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO separator)
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123

        //strict parsing regexes
        parseTokenOneDigit = /\d/, // 0 - 9
        parseTokenTwoDigits = /\d\d/, // 00 - 99
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999
        parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999
        parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf

        // iso 8601 regex
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
        isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,

        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
            ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
            ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d{2}/],
            ['YYYY-DDD', /\d{4}-\d{3}/]
        ],

        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d{1,3}/],
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
            ['HH:mm', /(T| )\d\d:\d\d/],
            ['HH', /(T| )\d\d/]
        ],

        // timezone chunker "+10:00" > ["10", "00"] or "-1530" > ["-15", "30"]
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

        // getter and setter names
        proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        unitMillisecondFactors = {
            'Milliseconds' : 1,
            'Seconds' : 1e3,
            'Minutes' : 6e4,
            'Hours' : 36e5,
            'Days' : 864e5,
            'Months' : 2592e6,
            'Years' : 31536e6
        },

        unitAliases = {
            ms : 'millisecond',
            s : 'second',
            m : 'minute',
            h : 'hour',
            d : 'day',
            D : 'date',
            w : 'week',
            W : 'isoWeek',
            M : 'month',
            y : 'year',
            DDD : 'dayOfYear',
            e : 'weekday',
            E : 'isoWeekday',
            gg: 'weekYear',
            GG: 'isoWeekYear'
        },

        camelFunctions = {
            dayofyear : 'dayOfYear',
            isoweekday : 'isoWeekday',
            isoweek : 'isoWeek',
            weekyear : 'weekYear',
            isoweekyear : 'isoWeekYear'
        },

        // format function strings
        formatFunctions = {},

        // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w W M D d'.split(' '),
        paddedTokens = 'M D H h m s w W'.split(' '),

        formatTokenFunctions = {
            M    : function () {
                return this.month() + 1;
            },
            MMM  : function (format) {
                return this.lang().monthsShort(this, format);
            },
            MMMM : function (format) {
                return this.lang().months(this, format);
            },
            D    : function () {
                return this.date();
            },
            DDD  : function () {
                return this.dayOfYear();
            },
            d    : function () {
                return this.day();
            },
            dd   : function (format) {
                return this.lang().weekdaysMin(this, format);
            },
            ddd  : function (format) {
                return this.lang().weekdaysShort(this, format);
            },
            dddd : function (format) {
                return this.lang().weekdays(this, format);
            },
            w    : function () {
                return this.week();
            },
            W    : function () {
                return this.isoWeek();
            },
            YY   : function () {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY : function () {
                return leftZeroFill(this.year(), 4);
            },
            YYYYY : function () {
                return leftZeroFill(this.year(), 5);
            },
            YYYYYY : function () {
                var y = this.year(), sign = y >= 0 ? '+' : '-';
                return sign + leftZeroFill(Math.abs(y), 6);
            },
            gg   : function () {
                return leftZeroFill(this.weekYear() % 100, 2);
            },
            gggg : function () {
                return leftZeroFill(this.weekYear(), 4);
            },
            ggggg : function () {
                return leftZeroFill(this.weekYear(), 5);
            },
            GG   : function () {
                return leftZeroFill(this.isoWeekYear() % 100, 2);
            },
            GGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 4);
            },
            GGGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 5);
            },
            e : function () {
                return this.weekday();
            },
            E : function () {
                return this.isoWeekday();
            },
            a    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), true);
            },
            A    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), false);
            },
            H    : function () {
                return this.hours();
            },
            h    : function () {
                return this.hours() % 12 || 12;
            },
            m    : function () {
                return this.minutes();
            },
            s    : function () {
                return this.seconds();
            },
            S    : function () {
                return toInt(this.milliseconds() / 100);
            },
            SS   : function () {
                return leftZeroFill(toInt(this.milliseconds() / 10), 2);
            },
            SSS  : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            SSSS : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            Z    : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(a / 60), 2) + ":" + leftZeroFill(toInt(a) % 60, 2);
            },
            ZZ   : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
            },
            z : function () {
                return this.zoneAbbr();
            },
            zz : function () {
                return this.zoneName();
            },
            X    : function () {
                return this.unix();
            },
            Q : function () {
                return this.quarter();
            }
        },

        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'];

    function defaultParsingFlags() {
        // We need to deep clone this object, and es5 standard is not very
        // helpful.
        return {
            empty : false,
            unusedTokens : [],
            unusedInput : [],
            overflow : -2,
            charsLeftOver : 0,
            nullInput : false,
            invalidMonth : null,
            invalidFormat : false,
            userInvalidated : false,
            iso: false
        };
    }

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func, period) {
        return function (a) {
            return this.lang().ordinal(func.call(this, a), period);
        };
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


    /************************************
        Constructors
    ************************************/

    function Language() {

    }

    // Moment prototype object
    function Moment(config) {
        checkOverflow(config);
        extend(this, config);
    }

    // Duration Constructor
    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            years * 12;

        this._data = {};

        this._bubble();
    }

    /************************************
        Helpers
    ************************************/


    function extend(a, b) {
        for (var i in b) {
            if (b.hasOwnProperty(i)) {
                a[i] = b[i];
            }
        }

        if (b.hasOwnProperty("toString")) {
            a.toString = b.toString;
        }

        if (b.hasOwnProperty("valueOf")) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function cloneMoment(m) {
        var result = {}, i;
        for (i in m) {
            if (m.hasOwnProperty(i) && momentProperties.hasOwnProperty(i)) {
                result[i] = m[i];
            }
        }

        return result;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;

        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    }

    // helper function for _.addTime and _.subtractTime
    function addOrSubtractDurationFromMoment(mom, duration, isAdding, ignoreUpdateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months,
            minutes,
            hours;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        // store the minutes and hours so we can restore them
        if (days || months) {
            minutes = mom.minute();
            hours = mom.hour();
        }
        if (days) {
            mom.date(mom.date() + days * isAdding);
        }
        if (months) {
            mom.month(mom.month() + months * isAdding);
        }
        if (milliseconds && !ignoreUpdateOffset) {
            moment.updateOffset(mom);
        }
        // restore the minutes and hours after possibly changing dst
        if (days || months) {
            mom.minute(minutes);
            mom.hour(hours);
        }
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return  Object.prototype.toString.call(input) === '[object Date]' ||
                input instanceof Date;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function normalizeUnits(units) {
        if (units) {
            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');
            units = unitAliases[units] || camelFunctions[lowered] || lowered;
        }
        return units;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (inputObject.hasOwnProperty(prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeList(field) {
        var count, setter;

        if (field.indexOf('week') === 0) {
            count = 7;
            setter = 'day';
        }
        else if (field.indexOf('month') === 0) {
            count = 12;
            setter = 'month';
        }
        else {
            return;
        }

        moment[field] = function (format, index) {
            var i, getter,
                method = moment.fn._lang[field],
                results = [];

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            getter = function (i) {
                var m = moment().utc().set(setter, i);
                return method.call(moment.fn._lang, m, format || '');
            };

            if (index != null) {
                return getter(index);
            }
            else {
                for (i = 0; i < count; i++) {
                    results.push(getter(i));
                }
                return results;
            }
        };
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function checkOverflow(m) {
        var overflow;
        if (m._a && m._pf.overflow === -2) {
            overflow =
                m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :
                m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :
                m._a[HOUR] < 0 || m._a[HOUR] > 23 ? HOUR :
                m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :
                m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :
                m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            m._pf.overflow = overflow;
        }
    }

    function isValid(m) {
        if (m._isValid == null) {
            m._isValid = !isNaN(m._d.getTime()) &&
                m._pf.overflow < 0 &&
                !m._pf.empty &&
                !m._pf.invalidMonth &&
                !m._pf.nullInput &&
                !m._pf.invalidFormat &&
                !m._pf.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    m._pf.charsLeftOver === 0 &&
                    m._pf.unusedTokens.length === 0;
            }
        }
        return m._isValid;
    }

    function normalizeLanguage(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function makeAs(input, model) {
        return model._isUTC ? moment(input).zone(model._offset || 0) :
            moment(input).local();
    }

    /************************************
        Languages
    ************************************/


    extend(Language.prototype, {

        set : function (config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                if (typeof prop === 'function') {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        },

        _months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months : function (m) {
            return this._months[m.month()];
        },

        _monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort : function (m) {
            return this._monthsShort[m.month()];
        },

        monthsParse : function (monthName) {
            var i, mom, regex;

            if (!this._monthsParse) {
                this._monthsParse = [];
            }

            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                if (!this._monthsParse[i]) {
                    mom = moment.utc([2000, i]);
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        },

        _weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays : function (m) {
            return this._weekdays[m.day()];
        },

        _weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort : function (m) {
            return this._weekdaysShort[m.day()];
        },

        _weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin : function (m) {
            return this._weekdaysMin[m.day()];
        },

        weekdaysParse : function (weekdayName) {
            var i, mom, regex;

            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
            }

            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already
                if (!this._weekdaysParse[i]) {
                    mom = moment([2000, 1]).day(i);
                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._weekdaysParse[i].test(weekdayName)) {
                    return i;
                }
            }
        },

        _longDateFormat : {
            LT : "h:mm A",
            L : "MM/DD/YYYY",
            LL : "MMMM D YYYY",
            LLL : "MMMM D YYYY LT",
            LLLL : "dddd, MMMM D YYYY LT"
        },
        longDateFormat : function (key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },

        isPM : function (input) {
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
            // Using charAt should be more compatible.
            return ((input + '').toLowerCase().charAt(0) === 'p');
        },

        _meridiemParse : /[ap]\.?m?\.?/i,
        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        },

        _calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        calendar : function (key, mom) {
            var output = this._calendar[key];
            return typeof output === 'function' ? output.apply(mom) : output;
        },

        _relativeTime : {
            future : "in %s",
            past : "%s ago",
            s : "a few seconds",
            m : "a minute",
            mm : "%d minutes",
            h : "an hour",
            hh : "%d hours",
            d : "a day",
            dd : "%d days",
            M : "a month",
            MM : "%d months",
            y : "a year",
            yy : "%d years"
        },
        relativeTime : function (number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return (typeof output === 'function') ?
                output(number, withoutSuffix, string, isFuture) :
                output.replace(/%d/i, number);
        },
        pastFuture : function (diff, output) {
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
        },

        ordinal : function (number) {
            return this._ordinal.replace("%d", number);
        },
        _ordinal : "%d",

        preparse : function (string) {
            return string;
        },

        postformat : function (string) {
            return string;
        },

        week : function (mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        },

        _week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 1st is the first week of the year.
        },

        _invalidDate: 'Invalid date',
        invalidDate: function () {
            return this._invalidDate;
        }
    });

    // Loads a language definition into the `languages` cache.  The function
    // takes a key and optionally values.  If not in the browser and no values
    // are provided, it will load the language file module.  As a convenience,
    // this function also returns the language values.
    function loadLang(key, values) {
        values.abbr = key;
        if (!languages[key]) {
            languages[key] = new Language();
        }
        languages[key].set(values);
        return languages[key];
    }

    // Remove a language from the `languages` cache. Mostly useful in tests.
    function unloadLang(key) {
        delete languages[key];
    }

    // Determines which language definition to use and returns it.
    //
    // With no parameters, it will return the global language.  If you
    // pass in a language key, such as 'en', it will return the
    // definition for 'en', so long as 'en' has already been loaded using
    // moment.lang.
    function getLangDefinition(key) {
        var i = 0, j, lang, next, split,
            get = function (k) {
                if (!languages[k] && hasModule) {
                    try {
                        require('./lang/' + k);
                    } catch (e) { }
                }
                return languages[k];
            };

        if (!key) {
            return moment.fn._lang;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            lang = get(key);
            if (lang) {
                return lang;
            }
            key = [key];
        }

        //pick the language from the array
        //try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
        //substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
        while (i < key.length) {
            split = normalizeLanguage(key[i]).split('-');
            j = split.length;
            next = normalizeLanguage(key[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                lang = get(split.slice(0, j).join('-'));
                if (lang) {
                    return lang;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return moment.fn._lang;
    }

    /************************************
        Formatting
    ************************************/


    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, "");
        }
        return input.replace(/\\/g, "");
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = "";
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {

        if (!m.isValid()) {
            return m.lang().invalidDate();
        }

        format = expandFormat(format, m.lang());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, lang) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return lang.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }


    /************************************
        Parsing
    ************************************/


    // get the regex to find the next token
    function getParseRegexForToken(token, config) {
        var a, strict = config._strict;
        switch (token) {
        case 'DDDD':
            return parseTokenThreeDigits;
        case 'YYYY':
        case 'GGGG':
        case 'gggg':
            return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;
        case 'Y':
        case 'G':
        case 'g':
            return parseTokenSignedNumber;
        case 'YYYYYY':
        case 'YYYYY':
        case 'GGGGG':
        case 'ggggg':
            return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;
        case 'S':
            if (strict) { return parseTokenOneDigit; }
            /* falls through */
        case 'SS':
            if (strict) { return parseTokenTwoDigits; }
            /* falls through */
        case 'SSS':
            if (strict) { return parseTokenThreeDigits; }
            /* falls through */
        case 'DDD':
            return parseTokenOneToThreeDigits;
        case 'MMM':
        case 'MMMM':
        case 'dd':
        case 'ddd':
        case 'dddd':
            return parseTokenWord;
        case 'a':
        case 'A':
            return getLangDefinition(config._l)._meridiemParse;
        case 'X':
            return parseTokenTimestampMs;
        case 'Z':
        case 'ZZ':
            return parseTokenTimezone;
        case 'T':
            return parseTokenT;
        case 'SSSS':
            return parseTokenDigits;
        case 'MM':
        case 'DD':
        case 'YY':
        case 'GG':
        case 'gg':
        case 'HH':
        case 'hh':
        case 'mm':
        case 'ss':
        case 'ww':
        case 'WW':
            return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;
        case 'M':
        case 'D':
        case 'd':
        case 'H':
        case 'h':
        case 'm':
        case 's':
        case 'w':
        case 'W':
        case 'e':
        case 'E':
            return parseTokenOneOrTwoDigits;
        default :
            a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), "i"));
            return a;
        }
    }

    function timezoneMinutesFromString(string) {
        string = string || "";
        var possibleTzMatches = (string.match(parseTokenTimezone) || []),
            tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
            parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
            minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? -minutes : minutes;
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, config) {
        var a, datePartArray = config._a;

        switch (token) {
        // MONTH
        case 'M' : // fall through to MM
        case 'MM' :
            if (input != null) {
                datePartArray[MONTH] = toInt(input) - 1;
            }
            break;
        case 'MMM' : // fall through to MMMM
        case 'MMMM' :
            a = getLangDefinition(config._l).monthsParse(input);
            // if we didn't find a month name, mark the date as invalid.
            if (a != null) {
                datePartArray[MONTH] = a;
            } else {
                config._pf.invalidMonth = input;
            }
            break;
        // DAY OF MONTH
        case 'D' : // fall through to DD
        case 'DD' :
            if (input != null) {
                datePartArray[DATE] = toInt(input);
            }
            break;
        // DAY OF YEAR
        case 'DDD' : // fall through to DDDD
        case 'DDDD' :
            if (input != null) {
                config._dayOfYear = toInt(input);
            }

            break;
        // YEAR
        case 'YY' :
            datePartArray[YEAR] = toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
            break;
        case 'YYYY' :
        case 'YYYYY' :
        case 'YYYYYY' :
            datePartArray[YEAR] = toInt(input);
            break;
        // AM / PM
        case 'a' : // fall through to A
        case 'A' :
            config._isPm = getLangDefinition(config._l).isPM(input);
            break;
        // 24 HOUR
        case 'H' : // fall through to hh
        case 'HH' : // fall through to hh
        case 'h' : // fall through to hh
        case 'hh' :
            datePartArray[HOUR] = toInt(input);
            break;
        // MINUTE
        case 'm' : // fall through to mm
        case 'mm' :
            datePartArray[MINUTE] = toInt(input);
            break;
        // SECOND
        case 's' : // fall through to ss
        case 'ss' :
            datePartArray[SECOND] = toInt(input);
            break;
        // MILLISECOND
        case 'S' :
        case 'SS' :
        case 'SSS' :
        case 'SSSS' :
            datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);
            break;
        // UNIX TIMESTAMP WITH MS
        case 'X':
            config._d = new Date(parseFloat(input) * 1000);
            break;
        // TIMEZONE
        case 'Z' : // fall through to ZZ
        case 'ZZ' :
            config._useUTC = true;
            config._tzm = timezoneMinutesFromString(input);
            break;
        case 'w':
        case 'ww':
        case 'W':
        case 'WW':
        case 'd':
        case 'dd':
        case 'ddd':
        case 'dddd':
        case 'e':
        case 'E':
            token = token.substr(0, 1);
            /* falls through */
        case 'gg':
        case 'gggg':
        case 'GG':
        case 'GGGG':
        case 'GGGGG':
            token = token.substr(0, 2);
            if (input) {
                config._w = config._w || {};
                config._w[token] = input;
            }
            break;
        }
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromConfig(config) {
        var i, date, input = [], currentDate,
            yearToUse, fixYear, w, temp, lang, weekday, week;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            fixYear = function (val) {
                var int_val = parseInt(val, 10);
                return val ?
                  (val.length < 3 ? (int_val > 68 ? 1900 + int_val : 2000 + int_val) : int_val) :
                  (config._a[YEAR] == null ? moment().weekYear() : config._a[YEAR]);
            };

            w = config._w;
            if (w.GG != null || w.W != null || w.E != null) {
                temp = dayOfYearFromWeeks(fixYear(w.GG), w.W || 1, w.E, 4, 1);
            }
            else {
                lang = getLangDefinition(config._l);
                weekday = w.d != null ?  parseWeekday(w.d, lang) :
                  (w.e != null ?  parseInt(w.e, 10) + lang._week.dow : 0);

                week = parseInt(w.w, 10) || 1;

                //if we're parsing 'd', then the low day numbers may be next week
                if (w.d != null && weekday < lang._week.dow) {
                    week++;
                }

                temp = dayOfYearFromWeeks(fixYear(w.gg), week, weekday, lang._week.doy, lang._week.dow);
            }

            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = config._a[YEAR] == null ? currentDate[YEAR] : config._a[YEAR];

            if (config._dayOfYear > daysInYear(yearToUse)) {
                config._pf._overflowDayOfYear = true;
            }

            date = makeUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // add the offsets to the time to be parsed so that we can have a clean array for checking isValid
        input[HOUR] += toInt((config._tzm || 0) / 60);
        input[MINUTE] += toInt((config._tzm || 0) % 60);

        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
    }

    function dateFromObject(config) {
        var normalizedInput;

        if (config._d) {
            return;
        }

        normalizedInput = normalizeObjectUnits(config._i);
        config._a = [
            normalizedInput.year,
            normalizedInput.month,
            normalizedInput.day,
            normalizedInput.hour,
            normalizedInput.minute,
            normalizedInput.second,
            normalizedInput.millisecond
        ];

        dateFromConfig(config);
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate()
            ];
        } else {
            return [now.getFullYear(), now.getMonth(), now.getDate()];
        }
    }

    // date from string and format string
    function makeDateFromStringAndFormat(config) {

        config._a = [];
        config._pf.empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var lang = getLangDefinition(config._l),
            string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, lang).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    config._pf.unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    config._pf.empty = false;
                }
                else {
                    config._pf.unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                config._pf.unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            config._pf.unusedInput.push(string);
        }

        // handle am pm
        if (config._isPm && config._a[HOUR] < 12) {
            config._a[HOUR] += 12;
        }
        // if is 12 am, change hours to 0
        if (config._isPm === false && config._a[HOUR] === 12) {
            config._a[HOUR] = 0;
        }

        dateFromConfig(config);
        checkOverflow(config);
    }

    function unescapeFormat(s) {
        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        });
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function regexpEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            config._pf.invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = extend({}, config);
            tempConfig._pf = defaultParsingFlags();
            tempConfig._f = config._f[i];
            makeDateFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += tempConfig._pf.charsLeftOver;

            //or tokens
            currentScore += tempConfig._pf.unusedTokens.length * 10;

            tempConfig._pf.score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    // date from iso format
    function makeDateFromString(config) {
        var i, l,
            string = config._i,
            match = isoRegex.exec(string);

        if (match) {
            config._pf.iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    // match[5] should be "T" or undefined
                    config._f = isoDates[i][0] + (match[6] || " ");
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (string.match(parseTokenTimezone)) {
                config._f += "Z";
            }
            makeDateFromStringAndFormat(config);
        }
        else {
            config._d = new Date(string);
        }
    }

    function makeDateFromInput(config) {
        var input = config._i,
            matched = aspNetJsonRegex.exec(input);

        if (input === undefined) {
            config._d = new Date();
        } else if (matched) {
            config._d = new Date(+matched[1]);
        } else if (typeof input === 'string') {
            makeDateFromString(config);
        } else if (isArray(input)) {
            config._a = input.slice(0);
            dateFromConfig(config);
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof(input) === 'object') {
            dateFromObject(config);
        } else {
            config._d = new Date(input);
        }
    }

    function makeDate(y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function makeUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    function parseWeekday(input, language) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = language.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    /************************************
        Relative Time
    ************************************/


    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {
        return lang.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime(milliseconds, withoutSuffix, lang) {
        var seconds = round(Math.abs(milliseconds) / 1000),
            minutes = round(seconds / 60),
            hours = round(minutes / 60),
            days = round(hours / 24),
            years = round(days / 365),
            args = seconds < 45 && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < 45 && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < 22 && ['hh', hours] ||
                days === 1 && ['d'] ||
                days <= 25 && ['dd', days] ||
                days <= 45 && ['M'] ||
                days < 345 && ['MM', round(days / 30)] ||
                years === 1 && ['y'] || ['yy', years];
        args[2] = withoutSuffix;
        args[3] = milliseconds > 0;
        args[4] = lang;
        return substituteTimeAgo.apply({}, args);
    }


    /************************************
        Week of Year
    ************************************/


    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = moment(mom).add('d', daysToDayOfWeek);
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;

        weekday = weekday != null ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    /************************************
        Top Level Functions
    ************************************/

    function makeMoment(config) {
        var input = config._i,
            format = config._f;

        if (input === null) {
            return moment.invalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = getLangDefinition().preparse(input);
        }

        if (moment.isMoment(input)) {
            config = cloneMoment(input);

            config._d = new Date(+input._d);
        } else if (format) {
            if (isArray(format)) {
                makeDateFromStringAndArray(config);
            } else {
                makeDateFromStringAndFormat(config);
            }
        } else {
            makeDateFromInput(config);
        }

        return new Moment(config);
    }

    moment = function (input, format, lang, strict) {
        var c;

        if (typeof(lang) === "boolean") {
            strict = lang;
            lang = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._i = input;
        c._f = format;
        c._l = lang;
        c._strict = strict;
        c._isUTC = false;
        c._pf = defaultParsingFlags();

        return makeMoment(c);
    };

    // creating with utc
    moment.utc = function (input, format, lang, strict) {
        var c;

        if (typeof(lang) === "boolean") {
            strict = lang;
            lang = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._useUTC = true;
        c._isUTC = true;
        c._l = lang;
        c._i = input;
        c._f = format;
        c._strict = strict;
        c._pf = defaultParsingFlags();

        return makeMoment(c).utc();
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            parseIso;

        if (moment.isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {
            sign = (match[1] === "-") ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoDurationRegex.exec(input))) {
            sign = (match[1] === "-") ? -1 : 1;
            parseIso = function (inp) {
                // We'd normally use ~~inp for this, but unfortunately it also
                // converts floats to ints.
                // inp may be undefined, so careful calling replace on it.
                var res = inp && parseFloat(inp.replace(',', '.'));
                // apply sign while we're at it
                return (isNaN(res) ? 0 : res) * sign;
            };
            duration = {
                y: parseIso(match[2]),
                M: parseIso(match[3]),
                d: parseIso(match[4]),
                h: parseIso(match[5]),
                m: parseIso(match[6]),
                s: parseIso(match[7]),
                w: parseIso(match[8])
            };
        }

        ret = new Duration(duration);

        if (moment.isDuration(input) && input.hasOwnProperty('_lang')) {
            ret._lang = input._lang;
        }

        return ret;
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    moment.updateOffset = function () {};

    // This function will load languages and then set the global language.  If
    // no arguments are passed in, it will simply return the current global
    // language key.
    moment.lang = function (key, values) {
        var r;
        if (!key) {
            return moment.fn._lang._abbr;
        }
        if (values) {
            loadLang(normalizeLanguage(key), values);
        } else if (values === null) {
            unloadLang(key);
            key = 'en';
        } else if (!languages[key]) {
            getLangDefinition(key);
        }
        r = moment.duration.fn._lang = moment.fn._lang = getLangDefinition(key);
        return r._abbr;
    };

    // returns language data
    moment.langData = function (key) {
        if (key && key._lang && key._lang._abbr) {
            key = key._lang._abbr;
        }
        return getLangDefinition(key);
    };

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment ||
            (obj != null &&  obj.hasOwnProperty('_isAMomentObject'));
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };

    for (i = lists.length - 1; i >= 0; --i) {
        makeList(lists[i]);
    }

    moment.normalizeUnits = function (units) {
        return normalizeUnits(units);
    };

    moment.invalid = function (flags) {
        var m = moment.utc(NaN);
        if (flags != null) {
            extend(m._pf, flags);
        }
        else {
            m._pf.userInvalidated = true;
        }

        return m;
    };

    moment.parseZone = function (input) {
        return moment(input).parseZone();
    };

    /************************************
        Moment Prototype
    ************************************/


    extend(moment.fn = Moment.prototype, {

        clone : function () {
            return moment(this);
        },

        valueOf : function () {
            return +this._d + ((this._offset || 0) * 60000);
        },

        unix : function () {
            return Math.floor(+this / 1000);
        },

        toString : function () {
            return this.clone().lang('en').format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
        },

        toDate : function () {
            return this._offset ? new Date(+this) : this._d;
        },

        toISOString : function () {
            var m = moment(this).utc();
            if (0 < m.year() && m.year() <= 9999) {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            } else {
                return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        },

        toArray : function () {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hours(),
                m.minutes(),
                m.seconds(),
                m.milliseconds()
            ];
        },

        isValid : function () {
            return isValid(this);
        },

        isDSTShifted : function () {

            if (this._a) {
                return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
            }

            return false;
        },

        parsingFlags : function () {
            return extend({}, this._pf);
        },

        invalidAt: function () {
            return this._pf.overflow;
        },

        utc : function () {
            return this.zone(0);
        },

        local : function () {
            this.zone(0);
            this._isUTC = false;
            return this;
        },

        format : function (inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.lang().postformat(output);
        },

        add : function (input, val) {
            var dur;
            // switch args to support add('s', 1) and add(1, 's')
            if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, 1);
            return this;
        },

        subtract : function (input, val) {
            var dur;
            // switch args to support subtract('s', 1) and subtract(1, 's')
            if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, -1);
            return this;
        },

        diff : function (input, units, asFloat) {
            var that = makeAs(input, this),
                zoneDiff = (this.zone() - that.zone()) * 6e4,
                diff, output;

            units = normalizeUnits(units);

            if (units === 'year' || units === 'month') {
                // average number of days in the months in the given dates
                diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2
                // difference in months
                output = ((this.year() - that.year()) * 12) + (this.month() - that.month());
                // adjust by taking difference in days, average number of days
                // and dst in the given months.
                output += ((this - moment(this).startOf('month')) -
                        (that - moment(that).startOf('month'))) / diff;
                // same as above but with zones, to negate all dst
                output -= ((this.zone() - moment(this).startOf('month').zone()) -
                        (that.zone() - moment(that).startOf('month').zone())) * 6e4 / diff;
                if (units === 'year') {
                    output = output / 12;
                }
            } else {
                diff = (this - that);
                output = units === 'second' ? diff / 1e3 : // 1000
                    units === 'minute' ? diff / 6e4 : // 1000 * 60
                    units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                    units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                    units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                    diff;
            }
            return asFloat ? output : absRound(output);
        },

        from : function (time, withoutSuffix) {
            return moment.duration(this.diff(time)).lang(this.lang()._abbr).humanize(!withoutSuffix);
        },

        fromNow : function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar : function () {
            // We want to compare the start of today, vs this.
            // Getting start-of-today depends on whether we're zone'd or not.
            var sod = makeAs(moment(), this).startOf('day'),
                diff = this.diff(sod, 'days', true),
                format = diff < -6 ? 'sameElse' :
                    diff < -1 ? 'lastWeek' :
                    diff < 0 ? 'lastDay' :
                    diff < 1 ? 'sameDay' :
                    diff < 2 ? 'nextDay' :
                    diff < 7 ? 'nextWeek' : 'sameElse';
            return this.format(this.lang().calendar(format, this));
        },

        isLeapYear : function () {
            return isLeapYear(this.year());
        },

        isDST : function () {
            return (this.zone() < this.clone().month(0).zone() ||
                this.zone() < this.clone().month(5).zone());
        },

        day : function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (input != null) {
                input = parseWeekday(input, this.lang());
                return this.add({ d : input - day });
            } else {
                return day;
            }
        },

        month : function (input) {
            var utc = this._isUTC ? 'UTC' : '',
                dayOfMonth;

            if (input != null) {
                if (typeof input === 'string') {
                    input = this.lang().monthsParse(input);
                    if (typeof input !== 'number') {
                        return this;
                    }
                }

                dayOfMonth = this.date();
                this.date(1);
                this._d['set' + utc + 'Month'](input);
                this.date(Math.min(dayOfMonth, this.daysInMonth()));

                moment.updateOffset(this);
                return this;
            } else {
                return this._d['get' + utc + 'Month']();
            }
        },

        startOf: function (units) {
            units = normalizeUnits(units);
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
                /* falls through */
            }

            // weeks are a special case
            if (units === 'week') {
                this.weekday(0);
            } else if (units === 'isoWeek') {
                this.isoWeekday(1);
            }

            return this;
        },

        endOf: function (units) {
            units = normalizeUnits(units);
            return this.startOf(units).add((units === 'isoWeek' ? 'week' : units), 1).subtract('ms', 1);
        },

        isAfter: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) > +moment(input).startOf(units);
        },

        isBefore: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) < +moment(input).startOf(units);
        },

        isSame: function (input, units) {
            units = units || 'ms';
            return +this.clone().startOf(units) === +makeAs(input, this).startOf(units);
        },

        min: function (other) {
            other = moment.apply(null, arguments);
            return other < this ? this : other;
        },

        max: function (other) {
            other = moment.apply(null, arguments);
            return other > this ? this : other;
        },

        zone : function (input) {
            var offset = this._offset || 0;
            if (input != null) {
                if (typeof input === "string") {
                    input = timezoneMinutesFromString(input);
                }
                if (Math.abs(input) < 16) {
                    input = input * 60;
                }
                this._offset = input;
                this._isUTC = true;
                if (offset !== input) {
                    addOrSubtractDurationFromMoment(this, moment.duration(offset - input, 'm'), 1, true);
                }
            } else {
                return this._isUTC ? offset : this._d.getTimezoneOffset();
            }
            return this;
        },

        zoneAbbr : function () {
            return this._isUTC ? "UTC" : "";
        },

        zoneName : function () {
            return this._isUTC ? "Coordinated Universal Time" : "";
        },

        parseZone : function () {
            if (this._tzm) {
                this.zone(this._tzm);
            } else if (typeof this._i === 'string') {
                this.zone(this._i);
            }
            return this;
        },

        hasAlignedHourOffset : function (input) {
            if (!input) {
                input = 0;
            }
            else {
                input = moment(input).zone();
            }

            return (this.zone() - input) % 60 === 0;
        },

        daysInMonth : function () {
            return daysInMonth(this.year(), this.month());
        },

        dayOfYear : function (input) {
            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
            return input == null ? dayOfYear : this.add("d", (input - dayOfYear));
        },

        quarter : function () {
            return Math.ceil((this.month() + 1.0) / 3.0);
        },

        weekYear : function (input) {
            var year = weekOfYear(this, this.lang()._week.dow, this.lang()._week.doy).year;
            return input == null ? year : this.add("y", (input - year));
        },

        isoWeekYear : function (input) {
            var year = weekOfYear(this, 1, 4).year;
            return input == null ? year : this.add("y", (input - year));
        },

        week : function (input) {
            var week = this.lang().week(this);
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        isoWeek : function (input) {
            var week = weekOfYear(this, 1, 4).week;
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        weekday : function (input) {
            var weekday = (this.day() + 7 - this.lang()._week.dow) % 7;
            return input == null ? weekday : this.add("d", input - weekday);
        },

        isoWeekday : function (input) {
            // behaves the same as moment#day except
            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
            // as a setter, sunday should belong to the previous week.
            return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units]();
        },

        set : function (units, value) {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                this[units](value);
            }
            return this;
        },

        // If passed a language key, it will set the language for this
        // instance.  Otherwise, it will return the language configuration
        // variables for this instance.
        lang : function (key) {
            if (key === undefined) {
                return this._lang;
            } else {
                this._lang = getLangDefinition(key);
                return this;
            }
        }
    });

    // helper for adding shortcuts
    function makeGetterAndSetter(name, key) {
        moment.fn[name] = moment.fn[name + 's'] = function (input) {
            var utc = this._isUTC ? 'UTC' : '';
            if (input != null) {
                this._d['set' + utc + key](input);
                moment.updateOffset(this);
                return this;
            } else {
                return this._d['get' + utc + key]();
            }
        };
    }

    // loop through and add shortcuts (Month, Date, Hours, Minutes, Seconds, Milliseconds)
    for (i = 0; i < proxyGettersAndSetters.length; i ++) {
        makeGetterAndSetter(proxyGettersAndSetters[i].toLowerCase().replace(/s$/, ''), proxyGettersAndSetters[i]);
    }

    // add shortcut for year (uses different syntax than the getter/setter 'year' == 'FullYear')
    makeGetterAndSetter('year', 'FullYear');

    // add plural methods
    moment.fn.days = moment.fn.day;
    moment.fn.months = moment.fn.month;
    moment.fn.weeks = moment.fn.week;
    moment.fn.isoWeeks = moment.fn.isoWeek;

    // add aliased format methods
    moment.fn.toJSON = moment.fn.toISOString;

    /************************************
        Duration Prototype
    ************************************/


    extend(moment.duration.fn = Duration.prototype, {

        _bubble : function () {
            var milliseconds = this._milliseconds,
                days = this._days,
                months = this._months,
                data = this._data,
                seconds, minutes, hours, years;

            // The following code bubbles up values, see the tests for
            // examples of what that means.
            data.milliseconds = milliseconds % 1000;

            seconds = absRound(milliseconds / 1000);
            data.seconds = seconds % 60;

            minutes = absRound(seconds / 60);
            data.minutes = minutes % 60;

            hours = absRound(minutes / 60);
            data.hours = hours % 24;

            days += absRound(hours / 24);
            data.days = days % 30;

            months += absRound(days / 30);
            data.months = months % 12;

            years = absRound(months / 12);
            data.years = years;
        },

        weeks : function () {
            return absRound(this.days() / 7);
        },

        valueOf : function () {
            return this._milliseconds +
              this._days * 864e5 +
              (this._months % 12) * 2592e6 +
              toInt(this._months / 12) * 31536e6;
        },

        humanize : function (withSuffix) {
            var difference = +this,
                output = relativeTime(difference, !withSuffix, this.lang());

            if (withSuffix) {
                output = this.lang().pastFuture(difference, output);
            }

            return this.lang().postformat(output);
        },

        add : function (input, val) {
            // supports only 2.0-style add(1, 's') or add(moment)
            var dur = moment.duration(input, val);

            this._milliseconds += dur._milliseconds;
            this._days += dur._days;
            this._months += dur._months;

            this._bubble();

            return this;
        },

        subtract : function (input, val) {
            var dur = moment.duration(input, val);

            this._milliseconds -= dur._milliseconds;
            this._days -= dur._days;
            this._months -= dur._months;

            this._bubble();

            return this;
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units.toLowerCase() + 's']();
        },

        as : function (units) {
            units = normalizeUnits(units);
            return this['as' + units.charAt(0).toUpperCase() + units.slice(1) + 's']();
        },

        lang : moment.fn.lang,

        toIsoString : function () {
            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
            var years = Math.abs(this.years()),
                months = Math.abs(this.months()),
                days = Math.abs(this.days()),
                hours = Math.abs(this.hours()),
                minutes = Math.abs(this.minutes()),
                seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);

            if (!this.asSeconds()) {
                // this is the same as C#'s (Noda) and python (isodate)...
                // but not other JS (goog.date)
                return 'P0D';
            }

            return (this.asSeconds() < 0 ? '-' : '') +
                'P' +
                (years ? years + 'Y' : '') +
                (months ? months + 'M' : '') +
                (days ? days + 'D' : '') +
                ((hours || minutes || seconds) ? 'T' : '') +
                (hours ? hours + 'H' : '') +
                (minutes ? minutes + 'M' : '') +
                (seconds ? seconds + 'S' : '');
        }
    });

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    function makeDurationAsGetter(name, factor) {
        moment.duration.fn['as' + name] = function () {
            return +this / factor;
        };
    }

    for (i in unitMillisecondFactors) {
        if (unitMillisecondFactors.hasOwnProperty(i)) {
            makeDurationAsGetter(i, unitMillisecondFactors[i]);
            makeDurationGetter(i.toLowerCase());
        }
    }

    makeDurationAsGetter('Weeks', 6048e5);
    moment.duration.fn.asMonths = function () {
        return (+this - this.years() * 31536e6) / 2592e6 + this.years() * 12;
    };


    /************************************
        Default Lang
    ************************************/


    // Set default language, other languages will inherit from English.
    moment.lang('en', {
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    /* EMBED_LANGUAGES */

    /************************************
        Exposing Moment
    ************************************/

    function makeGlobal(deprecate) {
        var warned = false, local_moment = moment;
        /*global ender:false */
        if (typeof ender !== 'undefined') {
            return;
        }
        // here, `this` means `window` in the browser, or `global` on the server
        // add `moment` as a global object via a string identifier,
        // for Closure Compiler "advanced" mode
        if (deprecate) {
            global.moment = function () {
                if (!warned && console && console.warn) {
                    warned = true;
                    console.warn(
                            "Accessing Moment through the global scope is " +
                            "deprecated, and will be removed in an upcoming " +
                            "release.");
                }
                return local_moment.apply(null, arguments);
            };
            extend(global.moment, local_moment);
        } else {
            global['moment'] = moment;
        }
    }

    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
        makeGlobal(true);
    } else if (typeof define === "function" && define.amd) {
        define("moment", function (require, exports, module) {
            if (module.config && module.config() && module.config().noGlobal !== true) {
                // If user provided noGlobal, he is aware of global
                makeGlobal(module.config().noGlobal === undefined);
            }

            return moment;
        });
    } else {
        makeGlobal();
    }
}).call(this);

// moment.js language configuration
// language : russian (ru)
// author : Viktorminator : https://github.com/Viktorminator
// Author : Menelion Elensúle : https://github.com/Oire

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['moment'], factory); // AMD
    } else if (typeof exports === 'object') {
        module.exports = factory(require('../moment')); // Node
    } else {
        factory(window.moment); // Browser global
    }
}(function (moment) {
    function plural(word, num) {
        var forms = word.split('_');
        return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
    }

    function relativeTimeWithPlural(number, withoutSuffix, key) {
        var format = {
            'mm': 'минута_минуты_минут',
            'hh': 'час_часа_часов',
            'dd': 'день_дня_дней',
            'MM': 'месяц_месяца_месяцев',
            'yy': 'год_года_лет'
        };
        if (key === 'm') {
            return withoutSuffix ? 'минута' : 'минуту';
        }
        else {
            return number + ' ' + plural(format[key], +number);
        }
    }

    function monthsCaseReplace(m, format) {
        var months = {
            'nominative': 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_'),
            'accusative': 'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря'.split('_')
        },

        nounCase = (/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/).test(format) ?
            'accusative' :
            'nominative';

        return months[nounCase][m.month()];
    }

    function monthsShortCaseReplace(m, format) {
        var monthsShort = {
            'nominative': 'янв_фев_мар_апр_май_июнь_июль_авг_сен_окт_ноя_дек'.split('_'),
            'accusative': 'янв_фев_мар_апр_мая_июня_июля_авг_сен_окт_ноя_дек'.split('_')
        },

        nounCase = (/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/).test(format) ?
            'accusative' :
            'nominative';

        return monthsShort[nounCase][m.month()];
    }

    function weekdaysCaseReplace(m, format) {
        var weekdays = {
            'nominative': 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
            'accusative': 'воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу'.split('_')
        },

        nounCase = (/\[ ?[Вв] ?(?:прошлую|следующую)? ?\] ?dddd/).test(format) ?
            'accusative' :
            'nominative';

        return weekdays[nounCase][m.day()];
    }

    return moment.lang('ru', {
        months : monthsCaseReplace,
        monthsShort : monthsShortCaseReplace,
        weekdays : weekdaysCaseReplace,
        weekdaysShort : "вс_пн_вт_ср_чт_пт_сб".split("_"),
        weekdaysMin : "вс_пн_вт_ср_чт_пт_сб".split("_"),
        monthsParse : [/^янв/i, /^фев/i, /^мар/i, /^апр/i, /^ма[й|я]/i, /^июн/i, /^июл/i, /^авг/i, /^сен/i, /^окт/i, /^ноя/i, /^дек/i],
        longDateFormat : {
            LT : "HH:mm",
            L : "DD.MM.YYYY",
            LL : "D MMMM YYYY г.",
            LLL : "D MMMM YYYY г., LT",
            LLLL : "dddd, D MMMM YYYY г., LT"
        },
        calendar : {
            sameDay: '[Сегодня в] LT',
            nextDay: '[Завтра в] LT',
            lastDay: '[Вчера в] LT',
            nextWeek: function () {
                return this.day() === 2 ? '[Во] dddd [в] LT' : '[В] dddd [в] LT';
            },
            lastWeek: function () {
                switch (this.day()) {
                case 0:
                    return '[В прошлое] dddd [в] LT';
                case 1:
                case 2:
                case 4:
                    return '[В прошлый] dddd [в] LT';
                case 3:
                case 5:
                case 6:
                    return '[В прошлую] dddd [в] LT';
                }
            },
            sameElse: 'L'
        },
        relativeTime : {
            future : "через %s",
            past : "%s назад",
            s : "несколько секунд",
            m : relativeTimeWithPlural,
            mm : relativeTimeWithPlural,
            h : "час",
            hh : relativeTimeWithPlural,
            d : "день",
            dd : relativeTimeWithPlural,
            M : "месяц",
            MM : relativeTimeWithPlural,
            y : "год",
            yy : relativeTimeWithPlural
        },

        // M. E.: those two are virtually unused but a user might want to implement them for his/her website for some reason

        meridiem : function (hour, minute, isLower) {
            if (hour < 4) {
                return "ночи";
            } else if (hour < 12) {
                return "утра";
            } else if (hour < 17) {
                return "дня";
            } else {
                return "вечера";
            }
        },

        ordinal: function (number, period) {
            switch (period) {
            case 'M':
            case 'd':
            case 'DDD':
                return number + '-й';
            case 'D':
                return number + '-го';
            case 'w':
            case 'W':
                return number + '-я';
            default:
                return number;
            }
        },

        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 1st is the first week of the year.
        }
    });
}));

var uAdmin = (function() {

	/**
	 * @type {Object} Коллекция обработчиков события загрузки модулей.
	 * Для каждого модуля указан список обработчиков:
	 *
	 * {
	 *   'module1': [handler1, handler2, ...],
	 *   'module2': [handler3]
	 * }
	 */
	var onLoadEventHandlers = {};

	function uAdmin() {
		if (uAdmin.prototype.instance == null) {
			uAdmin.prototype.instance = new uAdmin.prototype.get();
		}
		register(arguments);
		return uAdmin.prototype.instance;
	}

	function register() {
		var checkClass = function(parent, parent_str) {
			for (var module in parent.reg) {
				if (parent.reg[parent_str]) {
					return parent.reg[parent_str];
				} else {
					return checkClass(parent.reg[module], parent_str);
				}
			}

			return false;
		};

		var name;
		var value;
		var parent;
		var params = arguments[0];

		if (!params.length) {
			return false;
		}

		if (typeof params[0] === 'object') {
			if (Object.prototype.toString.call(params[0]) === '[object Array]') {
				return false;
			}

			for (var i in params[0]) {
				register([i, params[0][i], params[1] || null]);
			}

			return true;
		} else if (typeof params[0] === 'string') {
			if (typeof params[1] === 'undefined') {
				return false;
			}

			name = params[0];
			value = params[1];
			parent = params[2] || null;
		} else {
			return false;
		}

		if (!parent) {
			parent = uAdmin;
		}

		if (typeof parent === 'string') {
			parent = checkClass(uAdmin, parent);
		}

		if (typeof parent !== 'function') {
			return false;
		}

		var isClass = false;
		name = name.split('.');
		if (name.length > 1) {
			isClass = true;
		}

		name = name.pop();

		var reg = function() {
			parent.reg[name] = value;
			if (isClass) {
				parent.reg[name].isclass = true;
			}
		};

		if (!parent.reg) {
			parent.reg = reg;
		}

		reg();
		return true;
	}

	uAdmin.prototype.get = function() {
		return this;
	};

	uAdmin.prototype.get.prototype = uAdmin.prototype;

	uAdmin.prototype.init = function() {
		uAdmin.load(uAdmin);
		delete uAdmin.reg;

		//apply CSRF protection
		if (uAdmin.csrf) {
			jQuery(document).ajaxSend(function(event, jqXhr, settings) {
				if (settings.data instanceof FormData) {
					settings.data.append('csrf', uAdmin.csrf);
					return;
				}

				if (!settings || !settings.type || (typeof settings.data !== 'string' && typeof settings.data !== 'undefined')) {
					return true;
				}

				switch (settings.type) {
					case 'POST':
						if (typeof settings.data == 'undefined') {
							settings.data = '';
						}

						settings.data += settings.data.length ? '&csrf=' + uAdmin.csrf : 'csrf=' + uAdmin.csrf;
						break;

					case 'GET':
						settings.url += ~settings.url.indexOf('?') ? '&csrf=' + uAdmin.csrf : '?csrf=' + uAdmin.csrf;
						break;
				}
			});
		}

		var images = document.getElementsByTagName('img');
		for (var i = 0; i < images.length; i++) {
			if (images[i].getAttribute('umi:field-name') == 'photo') {
				if (!!images[i].width) {
					images[i].style.maxWidth = images[i].width + 'px';
				}
				if (!!images[i].height) {
					images[i].style.maxHeight = images[i].height + 'px';
				}
			}
		}
	};

	if (typeof JSON == 'undefined') {
		JSON = {
			parse: function(str) {
				try {
					if (str.match(/^{/g)) {
						var val = eval('(' + str + ')');
						if (Object.prototype.toString.call(val) == '[object Object]') {
							return val;
						}
					}
					throw new SyntaxError('JSON.parse: unexpected end of data');
				}
				catch (e) {
					throw new SyntaxError('JSON.parse: unexpected end of data');
				}
			}
		};
	}

	/**
	 * Возвращает признак наличия кастомной функции
	 * с указанным именем
	 * @param name
	 * @returns boolean
	 */
	uAdmin.prototype.isCustomFunction = function (name) {
		return typeof cmsCustoms === 'object' && cmsCustoms !== null &&
			name && typeof cmsCustoms[name] === 'function';
	};

	/**
	 * Подписывает handler на событие загрузки определенного модуля
	 * @param {String} module имя загруженного модуля
	 * @param {Function} handler функция-обработчик
	 * @return {Boolean} результат
	 */
	uAdmin.onLoad = function(module, handler) {
		if (typeof handler !== 'function') {
			return false;
		}

		if (module in onLoadEventHandlers === false) {
			onLoadEventHandlers[module] = [];
		}

		onLoadEventHandlers[module].push(handler);
		return handler in onLoadEventHandlers[module];
	};

	uAdmin.load = function(parent) {
		for (var module in parent.reg) {
			if (parent.reg[module].reg) {
				uAdmin.load(parent.reg[module]);
			}

			if (parent.reg[module].isclass) {
				var extend = function(usedClass, extendClass) {
					for (var i in extendClass) {
						usedClass.prototype[i] = extendClass[i];
					}
					return new usedClass();
				};

				if (parent == uAdmin) {
					parent[module] = new parent.reg[module](extend);
				} else {
					parent.prototype[module] = new parent.reg[module](extend);
				}
			} else if (parent == uAdmin) {
				parent[module] = parent.reg[module];
			} else {
				parent.prototype[module] = parent.reg[module];
			}

			// если есть обработчики события onLoad для модуля, они исполняются
			var moduleOnLoadEventHandlers = onLoadEventHandlers[module];
			if (moduleOnLoadEventHandlers != undefined && moduleOnLoadEventHandlers.length > 0) {
				for (var j = 0; j < moduleOnLoadEventHandlers.length; j++) {
					if (typeof moduleOnLoadEventHandlers[j] === 'function') {
						moduleOnLoadEventHandlers[j]();
					}
				}
			}
		}
	};

	var pageData = {
		'module': null,
	};
	if (window.pageData) {
		pageData = window.pageData;
	} else if (!~location.pathname.indexOf('/do/')) {
		var data = jQuery.ajax({
			url: location.pathname + '.json' + location.search,
			dataType: 'json',
			async: false
		});
		pageData = JSON.parse(data.responseText);
	}

	uAdmin('data', pageData);
	return uAdmin;
})();

jQuery(function () {
	var uAdminObject = uAdmin();

	uAdminObject.init();
	if (uAdminObject.isCustomFunction('uAdminInit')) {
		cmsCustoms.uAdminInit();
	}
});

// Панель быстрого редактирования EIP
uAdmin('.panel', function(extend) {

	function uPanel() {
		var self = this;
		$('html').addClass('u-eip');

		this.panelHolder = this.addPanelHolder();
		this.quickpanel = this.addQuickpanel();
		this.showHideBtn = this.addShowHideBtn();
		this.drawControls();

		$(document).on('click', function(event) {
			if (!$(event.target).parents('#u-quickpanel').length) {
				self.changeAct();
			}
		});

		if (!$.cookie('eip-panel-state-first')) {
			this.quickpanel.css({'overflow': 'hidden', 'height': '0'});
			this.showHideBtn.addClass('collapse');

			this.quickpanel.delay(500).animate({
				height: '38px'
			}, 500, function() {
				$(this).css('overflow', 'visible');
				self.showHideBtn.removeClass('collapse');
			});

			this.quickpanel.fadeTo(300, 0.3);
			this.quickpanel.fadeTo(300, 1);

			$.cookie('eip-panel-state', '', {
				path: '/',
				expires: 0
			});

			var date = new Date();
			date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));

			$.cookie('eip-panel-state-first', 'Y', {
				path: '/',
				expires: date
			});
		}

		var url = self.getUrlPrefix() + '/admin/content/frontendPanel/.json?links';
		url += '&ts=' + Math.round(Math.random() * 1000);

		$.ajax({
			url: url,
			dataType: 'json',
			success: this.onLoadData
		});
	}

	/** Возвращает префикс для ссылок с учетом языка */
	uPanel.prototype.getUrlPrefix = function() {
		return uAdmin.lang_prefix ? '/' + uAdmin.lang_prefix : '';
	};

	uPanel.prototype.drawControls = function() {
		this.exitButton = this.addExitButton();
		this.helpButton = this.addHelpButton();
		this.butterfly = this.addButtrfly();
		this.eipHolder = this.addEipHolder();
		this.editMenu = this.addEditMenu();
		this.lastDoc = this.addLastDoc();
		this.changelogDd = this.addChangelogDd();
		this.note = this.addNote();
		this.metaHolder = this.addMetaHolder();
	};

	uPanel.prototype.addPanelHolder = function() {
		return $('<div id="u-panel-holder" />').appendTo('body');
	};

	uPanel.prototype.addQuickpanel = function() {
		if (!this.panelHolder.length) {
			return null;
		}
		return $('<div id="u-quickpanel" />').appendTo(this.panelHolder);
	};

	uPanel.prototype.addShowHideBtn = function() {
		if (!this.panelHolder.length) {
			return null;
		}

		var self = this;
		return $('<div id="u-show_hide_btn" />')
			.appendTo(this.panelHolder)
			.on('click', function() {
				self.swap(this);
			});
	};

	uPanel.prototype.addExitButton = function() {
		if (!this.quickpanel.length) {
			return null;
		}

		var self = this;
		return $('\n\
			<div id="exit" title="' + getLabel('js-panel-exit') + '">&#160;</div>\n\
		')
			.appendTo(this.quickpanel)
			.on('click', function() {
				window.location = self.getUrlPrefix() + '/users/logout/';
				return false;
			});
	};

	uPanel.prototype.addHelpButton = function() {
		if (!this.quickpanel.length) {
			return null;
		}
		return $('\n\
			<div id="help" title="' + getLabel('js-panel-documentation') + '">&#160;</div>\n\
		')
			.appendTo(this.quickpanel)
			.on('click', function() {
				window.open('http://help.docs.umi-cms.ru');
				return false;
			});
	};

	uPanel.prototype.addButtrfly = function() {
		if (!this.quickpanel.length) {
			return null;
		}

		return $('\n\
			<div id="butterfly">\n\
				<span class="in_ico_bg">&#160;</span>' + getLabel('js-panel-modules') + '\n\
				<div class="bg">\n\
					<ul id="u-mods-cont-left"></ul>\n\
					<ul id="u-mods-cont-right"></ul>\n\
					<div class="clear separate"></div>\n\
					<ul id="u-mods-utils"></ul>\n\
					<ul id="u-mods-admin"></ul>\n\
					<div class="clear"></div>\n\
				</div>\n\
			</div>\n\
		').appendTo(this.quickpanel);
	};

	uPanel.prototype.addEipHolder = function() {
		if (!this.quickpanel.length) {
			return null;
		}
		return $('<div />').attr({id: 'eip_holder'}).appendTo(this.quickpanel);
	};

	uPanel.prototype.addMetaHolder = function() {
		if (!this.quickpanel.length) {
			return null;
		}
		return $('<div />').attr({id: 'meta_holder'}).appendTo(this.quickpanel);
	};

	uPanel.prototype.addEditMenu = function() {
		if (!this.quickpanel.length) {
			return null;
		}
		return $('\n\
			<div id="edit_menu" title="' + getLabel('js-panel-edit-menu') + '">\n\
				<span class="in_ico_bg">&#160;</span>\n\
				<div>\n\
					<ul id="u-docs-edit"></ul>\n\
					<span class="clear"></span>\n\
				</div>\n\
			</div>\n\
		').appendTo(this.quickpanel);
	};

	uPanel.prototype.addLastDoc = function() {
		if (!this.quickpanel.length) {
			return null;
		}
		var self = this;
		return $('\n\
			<div id="last_doc">\n\
				<span class="in_ico_bg"></span>\n\
				' + getLabel('js-panel-last-documents') + '\n\
				<div>\n\
					<ul id="u-docs-recent"></ul>\n\
					<span class="clear"></span>\n\
				</div>\n\
			</div>\n\
		')
			.appendTo(this.quickpanel)
			.on('click', function() {
				self.changeAct(this);
			});
	};

	uPanel.prototype.addChangelogDd = function() {
		if (!this.quickpanel.length) {
			return null;
		}
		var self = this;
		return $('\n\
			<div id="changelog_dd" style="display:none;">\n\
				<span class="in_ico_bg">&#160;</span>\n\
				' + getLabel('js-panel-history-changes') + '\n\
				<div>\n\
					<ul id="u-changelog"></ul>\n\
					<span class="clear"></span>\n\
				</div>\n\
			</div>\n\
		')
			.appendTo(this.quickpanel)
			.on('click', function() {
				self.changeAct(this);
			});
	};

	uPanel.prototype.addNote = function() {
		if (!this.quickpanel.length) {
			return null;
		}
		return $('\n\
			<div id="note">\n\
				<span class="in_ico_bg">&#160;</span>\n\
				' + getLabel('js-panel-note') + '\n\
			</div>\n\
		').appendTo(this.quickpanel);
	};

	uPanel.prototype.addSeoButton = function() {
		if (!this.quickpanel.length) {
			return null;
		}

		var self = this;
		return $('\n\
			<div id="seo">\
				<span class="in_ico_bg">&#160;</span>\n\
				' + getLabel('module-seo') + '\n\
			</div>\n\
		').appendTo(this.quickpanel).on('click', function() {
			window.location = self.getUrlPrefix() + '/admin/seo/';
		});
	};

	uPanel.prototype.onLoadData = function(data) {
		var self = uAdmin.panel;
		if (!self) {
			return false;
		}

		$('<link type="text/css" rel="stylesheet" href="/styles/common/js/jquery/jquery.jgrowl.css">').appendTo('head');
		var page, module;
		for (page in data.documents.recent.page) {
			page = data.documents.recent.page[page];
			$('ul#u-docs-recent', self.lastDoc).append('<li><a href="' + page.link + '">' + page.name + '</a></li>');
		}

		var i = 0;
		for (page in data.documents.editable.page) {
			page = data.documents.editable.page[page];

			if (typeof page !== 'object') {
				continue;
			}

			for (module in data.modules.module) {
				module = data.modules.module[module];
				if (module.name == page.basetype.module) {
					continue;
				}
			}
			$('ul#u-docs-edit', self.quickpanel || null).append('<li><a href="' + self.getUrlPrefix() + page['edit-link'] + '">' + page.name + '</a></li>');
			i++;
		}

		if (i && self.editMenu) {
			self.editMenu.on('click', function() {
				self.changeAct(this);
			});
		} else if (self.editMenu) {
			self.editMenu.hide(0);
		}

		i = 0;
		for (module in data.modules.module) {
			module = data.modules.module[module];
			var selector;
			switch (module.type) {
				case 'system':
					selector = 'ul#u-mods-utils';
					break;
				case 'util':
					selector = 'ul#u-mods-admin';
					break;
				default:
					selector = (++i % 2) ? 'ul#u-mods-cont-left' : 'ul#u-mods-cont-right';
			}
			$(selector, self.butterfly || null).append('<li><a href="' + self.getUrlPrefix() + '/admin/' + module.name + '/' + '">' + module.label + '</a></li>');
		}

		if (i && self.butterfly) {
			self.butterfly.on('click', function() {
				self.changeAct(this);
			}).addClass('butterfly_hover');
		}

		if (typeof data.changelog != 'undefined' && self.changelogDd) {
			for (var revision in data.changelog.revision) {
				revision = data.changelog.revision[revision];
				var label = revision.date.std + (revision.author.name ? ' - ' + revision.author.name : '') + (revision.active == 'active' ? '&nbsp;&nbsp;&nbsp;&larr;' : '');
				var link = revision.link + '?force-redirect=' + window.location.pathname;
				$('#u-changelog', self.changelogDd).append('<li><a href="' + link + '">' + label + '</a></li>');
			}
			self.changelogDd.css('display', '');
		} else if (self.changelogDd) {
			self.changelogDd.css('display', 'none');
		}

		if (typeof data.tickets != 'undefined' && typeof uAdmin.tickets == 'object') {
			uAdmin.tickets.draw(data);
		}
		else if (self.note) {
			self.note.remove();
		}
	};

	uPanel.prototype.swap = function(el) {
		var quickpanel_height = $('#u-quickpanel').css('height');
		if (quickpanel_height == '0px') {
			return this.expand(el);

		}
		else {
			if (uAdmin.eip.meta.enabled) {
				$('#u-quickpanel #meta').trigger('click');
			}
			return this.collapse(el);
		}
	};

	uPanel.prototype.expand = function(el) {
		var quickpanel = $('#u-quickpanel');
		quickpanel.css('overflow', 'visible');
		quickpanel.animate({height: '38px'}, 700);
		$(el).removeClass('collapse');

		$.cookie('eip-panel-state', '', {path: '/', expires: 0});
	};

	uPanel.prototype.collapse = function(el) {
		var quickpanel = $('#u-quickpanel');
		quickpanel.css('overflow', 'hidden');
		quickpanel.animate({height: '0'}, 700);
		$(el).addClass('collapse');

		var date = new Date();
		date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
		$.cookie('eip-panel-state', 'collapsed', {path: '/', expires: date});
	};

	uPanel.prototype.loadRes = function(type, src, callback) {
		var node;
		switch (type) {
			case 'js':
			case 'text/javascript':
				node = document.createElement('script');
				node.src = src;
				node.charset = 'utf-8';
				break;

			case 'css':
			case 'text/css':
				node = document.createElement('link');
				node.href = src;
				node.rel = 'stylesheet';
				break;
			default:
				return;
		}

		document.body.parentNode.firstChild.appendChild(node);
		if (typeof callback == 'function') {
			$(document).one('ready', callback);
		}
	};

	uPanel.prototype.changeAct = function(el) {
		var eCond = (uAdmin.eip && uAdmin.eip.enabled) ? '[id != \'edit\'][id != \'ieditor-switcher\']' : '',
			save_edit = $('#save_edit');

		if (!el) {
			$('#u-quickpanel .act div:first').hide();
			$('#u-quickpanel .act' + eCond).removeClass('act');
		}
		else if ($(el).hasClass('act')) {
			$('#u-quickpanel .act div:first').hide();
			$('#u-quickpanel .act' + eCond).removeClass('act');
			
			if (el.id == 'edit') {
				save_edit.css('display', 'none');
			}
		}
		else {
			var act_arr = $('#u-quickpanel .act'), opera_width = false;
			
			if (act_arr.length) {
				$('#u-quickpanel .act div:first').hide();
				$('#u-quickpanel .act' + eCond).removeClass('act');
				if (el.id == 'edit' && !eCond) {
					save_edit.css('display', 'none');
				}
			}
			
			if ($.browser.opera) {
				opera_width = $(el).width();
			}
			
			$(el).addClass('act');
			
			if (opera_width) {
				$(el).width(opera_width);
			}
			
			$('#u-quickpanel .act div:first').show();
			
			if (el.id == 'edit') {
				save_edit.css('display', 'block');
			}
		}

		if ($(el).attr('id') != 'meta' && uAdmin.eip && uAdmin.eip.meta.enabled) {
			$('#u-quickpanel #meta').addClass('act');
		}

	};

	uPanel.prototype.editInAdmin = function(type) {
		if (type == 'enable') {
			$(document).on('keypress', this.editInAdmin.bindEvents);
		}
		
		if (type == 'disable') {
			$(document).off('keypress', this.editInAdmin.bindEvents);
		}
	};

	uPanel.prototype.editInAdmin.bindEvents = function(e) {
		if (e.shiftKey) {
			switch (e.charCode || e.keyCode) {
				case 68:// latin - D
				case 100:// latin - d
				case 1042:// russian - В
				case 1074:// russian - в
					$('#u-quickpanel #edit_menu').each(function(i, node) {
						uAdmin.panel.changeAct(node);
					});
					break;
			}
		}
	};

	return extend(uPanel, this);
});

uAdmin('.tickets', function (extend) {
	function uTickets() {
		/** @var {int} minTicketHeight Минимальная ширина элемента заметок */
		var minTicketHeight = 100;
		/** @param {string} defaultColor Цвет заметок по умолчанию */
		this.defaultColor = '#FFFFE1';
		/** @param {string} colorProperty Имя свойства, в котором хранится цвет для заметок */
		this.colorProperty = 'ticketsColor';
		this.buttonSelector = '#u-quickpanel #note, #quickpanel #note';

		/**
		 * Отображает сообщение об ошибке
		 * @param {string} message текст сообщения
		 */
		var showError = function(message) {
			jQuery.jGrowl(message, {
				'header': 'UMI.CMS',
				'life': 5000
			});
		};

		var ticket = function (params) {
			var self = this;
			self.params = params;

			(function init() {
				if (params.message)  {
					self.createMessage();
				}
				self.update();
			})();

		};

		/** Восстановливет предыдущие значения параметров заметки */
		ticket.prototype.rollbackParams = function () {
			if (this.params.oldWidth) {
				this.params.width = this.params.oldWidth;
			}

			if (this.params.oldHeight) {
				this.params.height = this.params.oldHeight;
			}

			if (this.params.oldX) {
				this.params.x = this.params.oldX;
			}

			if (this.params.oldY) {
				this.params.y = this.params.oldY;
			}

			if (this.params.oldMessage) {
				this.params.message.text = this.params.oldMessage;
			}
		};

		ticket.prototype.resetSelection = function () {
			if (document.selection && document.selection.empty) {
				document.selection.empty();
			}
			else if(window.getSelection) {
				var sel = window.getSelection();
				if(sel && sel.removeAllRanges) {
					sel.removeAllRanges();
				}
			}
		};

		ticket.prototype.createMessage = function () {
			var self = this;
			self.messageNode = jQuery('<div class="u-ticket-comment"><div></div><textarea></textarea><a></a></div>').appendTo('body');
			self.messageNode.css('background-color', self.params.message.color);

			self.messageNode.draggable({
				scroll: false,
				containment: document.body,
				stop: function(event, ui) {
					self.params.oldX = self.params.x;
					self.params.oldY = self.params.y;
					self.params.x = ui.position.left;
					self.params.y = ui.position.top;
					self.save();
				}
			});

			if (self.params.message) {
				jQuery('div', self.messageNode).html('<span>' + self.params.message.authorName +
					' (' + self.params.message.authorLogin + ')</span>');
				jQuery('textarea', self.messageNode).prop('value', self.params.message.text);
			}

			self.messageNode.resizable({
				minWidth: jQuery('div:first-child span', self.messageNode).outerWidth() + 'px',
				minHeight: minTicketHeight + 'px',
				containment: document.body,
				start: function() {
					jQuery(self.messageNode).css('cursor', 'default');
				},
				stop: function(event, ui) {
					self.params.oldWidth = self.params.width;
					self.params.oldHeight = self.params.height;
					self.params.width = ui.size.width;
					self.params.height = ui.size.height;
					self.save();
					jQuery(self.messageNode).css('cursor', 'move');
				}
			});

			jQuery('a', self.messageNode).html(getLabel('js-ticket-delete'));

			jQuery('textarea', self.messageNode).on('change', function () {
				self.save();
			});

			jQuery('textarea', self.messageNode).on('focus', function () {
				self.params.oldMessage = jQuery(this).prop('value');
			});

			jQuery('a', self.messageNode).on('click', function () {
				self.del();
			});
		};

		ticket.prototype.del = function () {
			var self = this;

			if (self.params.id) {
				var url = '/tickets/manage/delete/' + self.params.id + '/';
				jQuery.ajax({
					url: url,
					type: 'get',
					success: function(response) {
						if (response && typeof response.error == 'string') {
							showError(response.error);
							return;
						}

						removeNodes(self.node, self.messageNode);
					}
				});
			} else {
				removeNodes(self.node, self.messageNode);
			}

			function removeNodes(node, messageNode) {
				if (node && typeof node.remove == 'function') {
					node.remove();
				}
				if (messageNode && typeof messageNode.remove == 'function') {
					messageNode.remove();
				}
			}
		};

		ticket.prototype.save = function () {
			var self = this;
			var mode = self.params.id ? 'modify' : 'create';
			var url = '/tickets/manage/' + mode + '/' + self.params.id + '/';
			url += '?ts=' + Math.round(Math.random() * 1000);
			jQuery.ajax({
				type: 'POST',
				url: url,
				dataType: 'json',
				data: {
					x: self.params.x,
					y: self.params.y,
					width: self.params.width,
					height: self.params.height,
					message: jQuery('textarea', self.messageNode).prop('value'),
					color: self.params.message.color || uAdmin.tickets.defaultColor,
					referer: window.location.href.split('#')[0]
				},
				success: function (resp) {
					if (resp && typeof resp.error == 'string') {
						showError(resp.error);
						self.rollbackParams();
						self.update();
						return;
					}
					self.params.id = resp.id;
				}
			});
		};

		ticket.prototype.update = function () {
			var self = this;

			self.params.width = self.params.width || self.messageNode.outerWidth();
			self.params.height = self.params.height || self.messageNode.outerHeight();

			if (self.messageNode) {
				jQuery('textarea', self.messageNode).prop('value', self.params.message.text);

				self.messageNode.css({
					top: self.params.y,
					left: self.params.x,
					width: self.params.width,
					height: self.params.height
				});
			}

		};

		this.ticket = ticket;
	};

	uTickets.prototype.initNewTicket = function () {
		this.changeState(jQuery(this.buttonSelector).get(0));

		if(!uAdmin.tickets.created) {
			alert(getLabel('js-panel-note-add'));
			uAdmin.tickets.created = true;
		}

		if (uAdmin.tickets.isInit) return false;

		uAdmin.tickets.isInit = true;

		var self = this;
		var firstName = uAdmin.tickets.user.fname;
		var secondName = (uAdmin.tickets.user.lname == null) ? '' : ' ' + uAdmin.tickets.user.lname;
		jQuery(document).one('mousedown', function (event) {
			new uAdmin.tickets.ticket({
				x: event.pageX,
				y: event.pageY,
				message: {
					authorName: firstName + secondName,
					authorLogin: uAdmin.tickets.user.login,
					color: uAdmin.tickets.user[self.colorProperty],
					text: getLabel('js-ticket-empty')
				}
			});
			uAdmin.tickets.isInit = false;
			self.changeState(jQuery(self.buttonSelector).get(0));
		});
	};

	/**
	 * Изменяет визуальное состояние кнопки (Нажата/Не нажата)
	 * @param {HTMLElement} element элемент кнопки
	 */
	uTickets.prototype.changeState = function(element) {
		var $element = jQuery(element);

		if (typeof uAdmin.panel == 'object') {
			uAdmin.panel.changeAct(element);
		} else if (jQuery('#quickpanel').length > 0) {
			var actClass = 'act';

			if ($element.hasClass(actClass)) {
				$element.removeClass(actClass);
			} else {
				$element.addClass(actClass);
			}
		}

	};

	uTickets.prototype.swapVisible = function() {
		this.disabled ? this.enable() : this.disable();
	};

	uTickets.prototype.disable = function () {
		var self = this;
		jQuery('div.u-ticket, div.u-ticket-comment, ' + self.buttonSelector).hide();
		jQuery(document).off('keydown', self.bindEvents);
		jQuery(self.buttonSelector).off('click', self.bindEvents);
		self.disabled = true;
	};

	uTickets.prototype.enable = function () {
		var self = this;
		jQuery('div.u-ticket, div.u-ticket-comment, ' + self.buttonSelector).show();
		jQuery(document).on('keydown', self.bindEvents);
		jQuery(self.buttonSelector).on('click', self.bindEvents);
		self.disabled = false;
	};

	uTickets.prototype.bindEvents = function (event) {
		if (event.delegateTarget !== document) {
			event.preventDefault();
		}

		if ((event.shiftKey && (event.keyCode == 67 || event.keyCode == 99)  && (event.target.nodeName != 'INPUT' && event.target.nodeName != 'TEXTAREA')) || (event.type=='click' && document.getElementById('note').id=='note')) {
			uAdmin.tickets.initNewTicket();
		}
	};

	uTickets.prototype.draw = function(data) {
		var self = this;
		uAdmin.tickets.user = data.user;

		for (var tick in data.tickets.ticket) {
			tick = data.tickets.ticket[tick];
			var pos = tick.position,
				author = tick.author;

			var firstName = author.fname;
			var secondName = (author.lname == null) ? '' : ' ' + author.lname;

			var t = new this.ticket({
				id: tick.id,
				x: pos.x,
				y: pos.y,
				width: pos.width,
				height: pos.height,
				message: {
					authorName: firstName + secondName,
					authorLogin: author.login,
					color: author[self.colorProperty] || self.defaultColor,
					text: tick.message
				}
			});
			t.update();
		}
	};

	uTickets.prototype.disabled = true;

	uTickets.prototype.isInit = false;

	return extend(uTickets, this);
});

uAdmin('.eip', function(extend) {

	function uEditInPlace() {
		this.isMac = (navigator.userAgent.indexOf('Mac OS') != -1);
		this.drawControls();

		if (uAdmin.data && uAdmin.data.pageId) {
			this.metaInit();
		} else {
			uAdmin.onLoad('data', function() {
				uAdmin.eip.metaInit();
			});
		}

		this.bindEditorEvents();

		// переключаем состояние eip по куке, когда загружены все необходимые модули
		if (!uAdmin.tickets && uAdmin.panel) {
			uAdmin.onLoad('tickets', this.activateByCookie);
		} else if (uAdmin.tickets && !uAdmin.panel) {
			uAdmin.onLoad('panel', this.activateByCookie);
		} else {
			uAdmin.onLoad('eip', this.activateByCookie);
		}

		this.init();
		this.bindGlobalEvents();
	}

	uEditInPlace.prototype.init = function() {
		this.deleteButtonsTimeout = null;
		this.initEditBoxes();
	};

	uEditInPlace.prototype.initEditBoxes = function() {
		var self = this;

		jQuery(document).on('mouseover', '.u-eip-edit-box', function() {
			self.editBoxMouseoverHandler(this);
		});

		jQuery(document).on('mouseout', '.u-eip-edit-box-hover', function() {
			self.editBoxMouseoutHandler(this);
		});
	};

	uEditInPlace.prototype.editBoxMouseoverHandler = function(element) {

		var self = this,
			node = jQuery(element).addClass('u-eip-edit-box-hover'),
			info = self.searchAttr(element);

		if (node.attr('umi:delete') && info.id) {
			self.addDeleteButton(element, info);
		} else {
			self.dropDeleteButtons();
		}

		element.onclick = function(e) {
			element.onclick = function() {
				return true;
			};
			if (window.event) {
				return window.event.ctrlKey;
			} else {
				return e.ctrlKey;
			}
		};
	};

	uEditInPlace.prototype.editBoxMouseoutHandler = function(element) {
		var node = jQuery(element).removeClass('u-eip-edit-box-hover'),
			self = this;

		if (node.attr('umi:delete')) {
			self.deleteButtonsTimeout = setTimeout(self.dropDeleteButtons, 500);
		}

		node.on('click', function() {
			return true;
		});

	};

	uEditInPlace.prototype.addDeleteButton = function(element, info) {
		var self = this;

		if (this.deleteButtonsTimeout) {
			clearTimeout(this.deleteButtonsTimeout);
		}
		this.dropDeleteButtons();

        var deleteButton = document.createElement('div');
        jQuery(deleteButton)
            .attr('class', 'eip-del-button')
            .css({
                'z-index': '565'
            });
		jQuery(deleteButton).attr('class', 'eip-del-button');
		jQuery(deleteButton).text(getLabel("js-ieditor-module-delete-title"));
		jQuery(deleteButton).prepend( '<img src="/styles/skins/_eip/images/del_button.svg" alt="×">' );
		document.body.appendChild(deleteButton);
		self.placeWith(element, deleteButton, 'right', 'middle');

		jQuery(deleteButton)
			.on('mouseover', function() {
				if (self.deleteButtonsTimeout) {
					clearTimeout(self.deleteButtonsTimeout);
				}
			})
			.on('mouseout', function() {
				self.deleteButtonsTimeout = setTimeout(self.dropDeleteButtons, 500);
			})
			.on('click', function() {
				info['delete'] = true;
				self.queue.add(info);
				uAdmin.eip.normalizeBoxes();
			});

		return deleteButton;

	};

	uEditInPlace.prototype.dropDeleteButtons = function() {
		jQuery('.eip-del-button').remove();
	};

	uEditInPlace.prototype.bindGlobalEvents = function() {
		this.bindKeyboardShortcut();
		window.onresize = function() {
			uAdmin.eip.normalizeBoxes();
		};
	};

	uEditInPlace.prototype.bindKeyboardShortcut = function() {
		jQuery(document).on('keydown', function(e) {
			if (e.keyCode == 113) {
				uAdmin.eip.swapEditor();
			}
		});
	};

	uEditInPlace.prototype.activateByCookie = function() {
		if (jQuery.cookie('eip-editor-state')) {
			uAdmin.eip.swapEditor();
		} else {
			uAdmin.tickets.enable();
			uAdmin.panel.editInAdmin('enable');
		}
	};

	uEditInPlace.prototype.drawControls = function() {
		this.editorToggleButton = this.addEditorToggleButton();
		this.editorControlsHolder = this.addEditorControlsHolder();
		this.saveButton = this.addSaveButton();
		this.undoButton = this.addUndoButton();
		this.redoButton = this.addRedoButton();
	};

	uEditInPlace.prototype.addEditorControlsHolder = function() {
		return jQuery('\n\
			<div id="save_edit"></div>\n\
		').appendTo(uAdmin.panel.eipHolder);
	};

	uEditInPlace.prototype.addSaveButton = function() {
		var self = this;
		if (!this.editorControlsHolder) {
			return null;
		}
		return jQuery('\n\
			<div id="save" title="' + getLabel('js-panel-save') + ' (' + (this.isMac ? 'Cmd' : 'Ctrl') + '+S)">&#160;</div>\n\
		')
			.appendTo(this.editorControlsHolder)
			.on('click', function() {
				self.queue.save();
				return false;
			});
	};

	uEditInPlace.prototype.addUndoButton = function() {
		var self = this;
		if (!this.editorControlsHolder) {
			return null;
		}
		return jQuery('\n\
			<div id="edit_back" title="' + getLabel('js-panel-cancel') + ' (' + (this.isMac ? 'Cmd' : 'Ctrl') + '+Z)">&#160;</div>\n\
		')
			.appendTo(this.editorControlsHolder)
			.on('click', function() {
				self.queue.back();
				return false;
			});
	};

	uEditInPlace.prototype.addRedoButton = function() {
		var self = this;
		if (!this.editorControlsHolder) {
			return null;
		}
		return jQuery('\n\
			<div id="edit_next" title="' + getLabel('js-panel-repeat') + ' (' + (this.isMac ? 'Cmd+Shift+Z' : 'Ctrl+Y') + ')">&#160;</div>\n\
		')
			.appendTo(this.editorControlsHolder)
			.on('click', function() {
				self.queue.forward();
				return false;
			});
	};

	uEditInPlace.prototype.addEditorToggleButton = function() {
		var self = this,
			button = jQuery('\n\
				<div id="edit">\n\
					<span class="in_ico_bg">&#160;</span>\n\
					<span class="edit-button-label"></span> (F2)\
				</div>\n\
			');
		button
			.appendTo(uAdmin.panel.eipHolder)
			.on('click', function() {
				self.swapEditor();
				return false;
			});
		button.setLabelText = function(sText) {
			if (sText) {
				button.find('.edit-button-label').text(sText);
			}
		};
		button.setLabelText(getLabel('js-panel-edit'));
		return button;
	};

	uEditInPlace.prototype.metaInit = function() {
		var self = this;
		this.meta.element_id = uAdmin.data.pageId;

		/**
		 * Экранирует двойные кавычки в строке
		 * @param {String} str Строка
		 * @returns {String}
		 */
		function escapeQuotes(str) {
			return (str || '').replace(/"/g, '&quot;');
		}

		this.meta.old = {
			alt_name: escapeQuotes(uAdmin.data.page['alt-name']),
			title: escapeQuotes(uAdmin.data.title),
			keywords: escapeQuotes(uAdmin.data.meta.keywords),
			descriptions: escapeQuotes(uAdmin.data.meta.description)
		};

		this.meta['new'] = {};
		this.metaToggleButton = this.addMetaToggleButton();
		this.metaPanel = this.addMetaPanel();
		this.metaSaveButton = this.getMetaSaveButton();

		this.metaPanel
			.find('input[type!="submit"]').on('blur', function(e) {
				var name = this.name.replace(/^meta_/g, '');
				self.meta['new'][name] = this.value;
			})
			.on('keyup mousedown blur', function() {
				var l = this.value.length;
				if (l > 255) {
					this.value = this.value.substring(0, 255);
				} else {
					var id = this.id + '-count';
					jQuery('#' + id).html(l);
				}
			})
			.trigger('keyup');
	};

	/* Show block eip info */
	uEditInPlace.prototype.showBlockInfo = function() {
	};

	uEditInPlace.prototype.addMetaToggleButton = function() {
		var $element = jQuery('\n\
			<div id="meta">\n\
				<span class="in_ico_bg">&#160;</span>\n\
				' + getLabel('js-panel-meta') + '\n\
			</div>\n\
		')
			.appendTo(uAdmin.panel.metaHolder);
		if (this.addMetaToggleButtonClickHandler($element)) {
			return $element;
		}

		$element.on('click', function() {
			uAdmin.panel.changeAct(this);
			uAdmin.eip.metaPanel.toggle();
			uAdmin.eip.meta.enabled = uAdmin.eip.metaPanel.is(':visible');
			return false;
		});

		return $element;
	};

	/*
	 * Assign ClickHandler on MetaToggleButton
	 * @return bool
	 */
	uEditInPlace.prototype.addMetaToggleButtonClickHandler = function($element) {
		return false;
	};

	uEditInPlace.prototype.addMetaPanel = function() {
		if (!uAdmin.panel.panelHolder) {
			return null;
		}
		var self = this;
		return jQuery('\n\
				<div id="u-quickpanel-meta">\n\
					<table>\n\
						<tr>\n\
							<td width="100px">' + getLabel('js-panel-meta-altname') + ': </td>\n\
							<td>\n\
								<input type="text" name="alt_name" id="u-quickpanel-metaaltname" value="' + self.meta.old.alt_name + '"/>\n\
								<div class="meta_count" id="u-quickpanel-metaaltname-count"></div>\n\
							</td>\n\
						</tr>\n\
						<tr>\n\
							<td width="100px">' + getLabel('js-panel-meta-title') + ': </td>\n\
							<td>\n\
								<input type="text" name="title" id="u-quickpanel-metatitle" value="' + self.meta.old.title + '"/>\n\
								<div class="meta_count" id="u-quickpanel-metatitle-count"></div>\n\
							</td>\n\
						</tr>\n\
						<tr>\n\
							<td>' + getLabel('js-panel-meta-keywords') + ': </td>\n\
							<td>\n\
								<input type="text" name="meta_keywords" id="u-quickpanel-metakeywords" value="' + self.meta.old.keywords + '"/>\n\
								<div class="meta_count" id="u-quickpanel-metakeywords-count"></div>\n\
							</td>\n\
						</tr>\n\
						<tr>\n\
							<td>' + getLabel('js-panel-meta-descriptions') + ':</td>\n\
							<td>\n\
								<input type="text" name="meta_descriptions" id="u-quickpanel-metadescription" value="' + self.meta.old.descriptions + '"/>\n\
								<div class="meta_count" id="u-quickpanel-metadescription-count"></div>\n\
								<div class="meta_buttons">\n\
									<input type="submit" id="save_meta_button" value="' + getLabel('js-panel-save') + '">\n\
								</div>\n\
							</td>\n\
						</tr>\n\
					</table>\n\
				</div>\n\
			').appendTo(uAdmin.panel.panelHolder);
	};

	uEditInPlace.prototype.getMetaSaveButton = function() {
		if (!this.metaPanel) {
			return null;
		}
		var self = this;
		return this.metaPanel
			.find('#save_meta_button')
			.on('click', function() {
				self.metaSave();
				return false;
			});
	};

	uEditInPlace.prototype.metaSave = function() {
		var params = {},
			i,
			self = this,
			sentRequests = 0,
			recievedRequests = 0;

		for (i in self.meta['new']) {
			if (self.meta['new'][i] != self.meta.old[i]) {
				params['field-name'] = ((i == 'keywords' || i == 'descriptions') ? 'meta_' + i : i);
				params['element-id'] = self.meta.element_id;
				params['value'] = self.meta['new'][i];
				sentRequests++;
				jQuery.post('/admin/content/editValue/save.json', params, function(data) {
					if (data.error) {
						self.message(data.error);
						return;
					}

					recievedRequests++;
					self.meta.old[i] = data.property.value;

					if (recievedRequests == sentRequests) {
						self.message(getLabel('js-panel-message-changes-saved'));
						uAdmin.eip.metaToggleButton.trigger('click');
						self.onMetaSaved();
					}
				}, 'json');
			}

			delete self.meta['new'][i];
		}
	};

	/**
	 * Обрабатывает событие успешного сохранения полей мета тегов
	 */
	uEditInPlace.prototype.onMetaSaved = function() {
	};

	uEditInPlace.prototype.bindEditorEvents = function() {
		this.bind('Enable', this.enableEventHandler);
		this.bind('Disable', this.disableEventHandler);
		this.bind('Repaint', this.repaintEventHandler);
		this.bind('Save', this.saveEventHandler);
	};

	uEditInPlace.prototype.enableEventHandler = function(type) {
		if (type == 'after') {
			uAdmin.panel.changeAct(uAdmin.eip.editorToggleButton.get(0));
		}
	};

	uEditInPlace.prototype.disableEventHandler = function(type) {
		if (type == 'after') {
			uAdmin.panel.changeAct(uAdmin.eip.editorToggleButton.get(0));
		}
	};

	uEditInPlace.prototype.repaintEventHandler = function(type) {
	};

	uEditInPlace.prototype.saveEventHandler = function(type) {
	};

	uEditInPlace.prototype.swapEditor = function() {
		this.onSwapEditor();

		if (this.enabled) {
			this.disable();
			this.editorToggleButton.setLabelText(getLabel('js-panel-edit'));
			jQuery('#on_edit_in_place').html(getLabel('js-on-eip'));
			uAdmin.tickets.enable();
			uAdmin.panel.editInAdmin('enable');
			this.onSwapEnabledEditor();
		}
		else {
			this.enable();
			this.editorToggleButton.setLabelText(getLabel('js-panel-view'));
			jQuery('#on_edit_in_place').html(getLabel('js-off-eip'));
			uAdmin.tickets.disable();
			uAdmin.panel.editInAdmin('disable');
			this.onSwapDisabledEditor();
		}
		this.bindEvents();
	};

	/* onSwapEditor event handler */
	uEditInPlace.prototype.onSwapEditor = function() {
	};

	/* onSwapEnabledEditor event handler */
	uEditInPlace.prototype.onSwapEnabledEditor = function() {
	};

	/* onSwapDisabledEditor event handler */
	uEditInPlace.prototype.onSwapDisabledEditor = function() {
	};

	uEditInPlace.prototype.enable = function() {
		var self = this;
		self.onEnable('before');
		self.finishLast();
		self.inspectDocument();
		self.highlight();
		self.normalizeBoxes();

		jQuery(window).on('load', function() {
			setTimeout(function() {
				self.normalizeBoxes();
			}, 250);
		});

		self.enabled = true;

		if (self.queue.current >= 0) {
			self.queue.setSaveStatus(true);
		}

		var date = new Date();
		date.setTime(date.getTime() + (3 * 24 * 60 * 60 * 1000));
		jQuery.cookie('eip-editor-state', 'enabled', {path: '/', expires: date});

		self.message(getLabel('js-panel-message-edit-on'));
		jQuery(document).on('keydown', self.bindHotkeys);
		self.onEnable('after');
	};

	uEditInPlace.prototype.disable = function() {
		this.onDisable('before');
		this.finishLast();
		this.unhighlight();

		this.enabled = false;

		jQuery.cookie('eip-editor-state', '', {path: '/', expires: 0});
		this.queue.setSaveStatus(false);
		this.message(getLabel('js-panel-message-edit-off'));

		if (this.queue.current >= 0) {
			this.onDisableWithQueueSave();
		}
		jQuery(document).off('keydown', this.bindHotkeys);
		this.onDisable('after');
	};

	/* onDisableWithQueueSave event handler */
	uEditInPlace.prototype.onDisableWithQueueSave = function() {
		var self = this;

		jQuery.openPopupLayer({
			name: 'save',
			width: 200,
			height: 80,
			data: '\n\
            						<div class="eip_win_head popupHeader">\n\
            							<div class="eip_win_close popupClose">&#160;</div>\n\
            						</div>\n\
                                    <div class="eip_win_body popupBody">\n\
                                    <div class="popupText">' + getLabel('js-panel-message-save-confirm') + '</div>\n\
                                    <div class="eip_buttons">\n\
                                        <input type="button" class\
                                        ="primary ok" id="saveProgressBtn" value="OK" />\n\
                                        \<input type="button" id="closeProgressBtn"class\
                                        ="primary back" id="" value="Отмена"/>\n\
                                        <div style="clear: both;"></div>\n\
                                    </div>\n\
            					'
		});

		jQuery('#saveProgressBtn').on('click', function() {
			jQuery.closePopupLayer('save');
			uAdmin.eip.queue.save();
		});

		jQuery('#closeProgressBtn').on('click', function() {
			jQuery.closePopupLayer('save');
		});
	};

	uEditInPlace.prototype.bind = function(event, callback) {
		var self = this,
			f = (typeof self['on' + event] == 'function') ? self['on' + event] : function() {
			};

		self['on' + event] = function(type, options) {
			f(type, options);
			callback(type, options);
		};
	};

	uEditInPlace.prototype.trigger = function(event, type, options) {
		if (typeof this['on' + event] == 'function') {
			this['on' + event](type, options);
		}
	};

	uEditInPlace.prototype.bindHotkeys = function(e) {
		var self = uAdmin.eip.queue;
		if (navigator.userAgent.indexOf('Mac OS') != -1) {
			if (e.metaKey) {
				switch (e.keyCode) {
					case 83:
						self.save();
						break; // Cmd + S
					case 90:
						if (e.shiftKey) {
							self.forward();
						}// Cmd + Z
						else {
							self.back();
						} // Cmd + Shift + Z
						break;
					default:
						return true;
				}
				return false;
			}
		} else {
			if (e.ctrlKey) {
				switch (e.keyCode) {
					case 83:
						self.save();
						break; // Ctrl + S
					case 90:
						self.back();
						break; // Ctrl + Z
					case 89:
						self.forward();
						break; // Ctrl + Y
					default:
						return true;
				}
				return false;
			}
		}

		return true;
	};

	uEditInPlace.prototype.finishLast = function() {
		if (this.previousEditBox) {
			this.previousEditBox.finish(true);
			this.previousEditBox = null;
		}
	};

	uEditInPlace.prototype.normalizeBoxes = function() {
		var self = this;
		jQuery(self.listNodes).each(function(index, node) {
			if (!node.boxNode) {
				return;
			}

			var position = self.nodePositionInfo(node);
			jQuery(node.boxNode).css({
				'width': position.width,
				'height': position.height,
				'left': position.x,
				'top': position.y
			});

			var button = node.addButtonNode;
			var fDim = 'bottom', sDim = 'left';
			if (button) {
				var userPos;
				if ((userPos = jQuery(node).attr('umi:button-position'))) {
					var arr = userPos.split(/ /);
					if (arr.length == 2) {
						fDim = arr[0];
						sDim = arr[1];
					}
				}
				self.placeWith(node, button, fDim, sDim);
			}
		});
		self.onRepaint('after');
	};

	uEditInPlace.prototype.bindEvents = function() {
		var self = this,
			nodes = jQuery('.u-eip-edit-box');

		jQuery(document).off('click drop dragexit dragover', '.u-eip-edit-box');

		nodes.off('click');
		nodes.off('drop');
		nodes.off('dragexit');
		nodes.off('dragover');

		var eventString = 'click';

		if (navigator.userAgent.toLowerCase().indexOf('firefox') || navigator.userAgent.toLowerCase().indexOf('chrome')) {
			eventString = eventString + ' drop';

			jQuery(document).on('dragexit', '.u-eip-edit-box', function(e) {
				e.stopPropagation();
				e.preventDefault();
			});

			jQuery(document).on('dragover', '.u-eip-edit-box', function(e) {
				e.stopPropagation();
				e.preventDefault();
			});
		}

		jQuery(document).on(eventString, '.u-eip-edit-box', function(e) {
			var node = e.target;
			if (e.ctrlKey || (navigator.userAgent.indexOf('Mac OS') != -1 && e.metaKey)) {
				if (this.tagName == 'A') {
					location.href = this.href;
				}
				return true;
			}

			var handler = (typeof node.onclick == 'function') ? node.onclick : function() {
			};
			var nullHandler = function() {
				return false;
			};
			node.onclick = nullHandler;
			setTimeout(function() {
				if (node && handler != nullHandler) {
					node.onclick = handler;
				}
			}, 100);

			for (var i = 0; i < 25; i++) {
				if (!node) {
					return false;
				}
				if (node.tagName != 'TABLE' && jQuery(node).attr('umi:field-name')) {
					break;
				}
				node = node.parentNode;
			}
			if (!node) {
				return false;
			}
			e.stopPropagation();
			e.stopImmediatePropagation();
			e.preventDefault();
			self.edit(node, e && e.originalEvent && e.originalEvent.dataTransfer ? e.originalEvent.dataTransfer.files : null);
			e.stopPropagation();
			e.stopImmediatePropagation();
			e.preventDefault();
			return false;
		});

		window.onbeforeunload = function() {
			if (uAdmin.eip.queue.current >= 0 || uAdmin.eip.queue.save.count > 0) {
				return getLabel('js-panel-message-save-before-exit');
			}
		};
	};

	/** Найти все помеченные области, пригодные для редактирования */
	uEditInPlace.prototype.inspectDocument = function() {
		var self = this;

		self.editNodes = [];
		self.listNodes = [];

		var regions = self.getRegions();
		regions.each(function(index, node) {
			if (jQuery(node).css('display') == 'none') {
				return;
			}
			self.inspectNode(node);
		});
	};

	/** Проверить и при необходимости занести в редактируемый список html-элемент */
	uEditInPlace.prototype.inspectNode = function(node) {
		if (node.tagName == 'TABLE') {
			return;
		}
		if (jQuery(node).attr('umi:field-name')) {
			this.editNodes.push(node);
		}
		if (jQuery(node).attr('umi:module')) {
			this.listNodes.push(node);
		}
		// Fix editing behaviour for links child elements in ie
		if (jQuery.browser.msie) {
			jQuery(node).parents('a:first').each(function() {
				var href = this.href;
				jQuery(this).on('click', function(e) {
					if (e.ctrlKey) {
						window.location.href = href;
					}
				});
				this.removeAttribute('href');
			});
		}
	};

	uEditInPlace.prototype.getRegions = function() {
		return jQuery('*[umi\\:field-name], *[umi\\:module]');
	};

	uEditInPlace.prototype.isParentOf = function(seekNode, excludeNode) {
		if (!excludeNode || !seekNode) {
			return false;
		}
		if (excludeNode == seekNode) {
			return true;
		}
		if (seekNode.parentNode) {
			return this.isParentOf(seekNode.parentNode, excludeNode);
		}
		return false;
	};

	/** Подсветить все редактируемые области */
	uEditInPlace.prototype.highlight = function(excludeNode, skipListNodes) {
		var self = this;
		if (self.highlighted) {
			self.unhighlight();
		}
		self.highlighted = true;

		jQuery(self.editNodes).each(function(index, node) {
			if (self.isParentOf(node, excludeNode) == false) {
				self.highlightNode(node);
			}
		});

		if (!skipListNodes) {
			jQuery(self.listNodes).each(function(index, node) {
				if (self.isParentOf(node, excludeNode) == false) {
					self.highlightListNode(node);
				}
			});
		}

		self.onRepaint('after');
		self.markInversedBoxes();
	};

	/** Снять подсветку с редактируемых блоков */
	uEditInPlace.prototype.unhighlight = function() {

		var n = jQuery('.u-eip-edit-box');

		n.each(function(index, node) {
			node = jQuery(node);
			var empty = node.attr('umi:empty');
			if (empty && (node.attr('tagName') != 'IMG') && (node.html() == empty)) {
				node.html('');
			}

			node.attr('title', '');
		});

		n.removeClass('u-eip-edit-box u-eip-edit-box-hover u-eip-modified u-eip-deleted u-eip-edit-box-inversed');

		n.off('click');
		n.off('mouseover');
		n.off('mouseout');
		n.off('mousedown');
		n.off('mouseup');

		jQuery('.u-eip-add-box, .u-eip-add-button, .u-eip-del-button').remove();

		jQuery('.u-eip-sortable').sortable('destroy');
		jQuery('.u-eip-sortable').removeClass('u-eip-sortable');
	};

	/** Подсветить редактируемый html-элемент */
	uEditInPlace.prototype.highlightNode = function(node) {
		if (!jQuery(node).attr('umi:field-name')) {
			return;
		}
		var info = this.searchAttr(node);
		if (!info) {
			return;
		}

		var empty = this.htmlTrim(jQuery(node).attr('umi:empty'));

		if (empty && this.htmlTrim(jQuery(node).html()) == '' && (jQuery(node).attr('tagName') != 'IMG')) {
			try {
				jQuery(node).html(empty);
			} catch (e) {
			}
			jQuery(node).addClass('u-eip-empty-field');
		}

		jQuery(node).addClass('u-eip-edit-box');

		if (this.queue.search(info)) {
			jQuery(node).addClass('u-eip-modified');
		}

		if (node.tagName == 'A' || node.parentNode.tagName == 'A' || jQuery('a', node).length > 0) {
			var label = getLabel('js-panel-link-to-go');
			if (navigator.userAgent.indexOf('Mac OS') != -1) {
				label = label.replace(/Ctrl/g, 'Cmd');
			}
			jQuery(node).attr('title', label);
			jQuery(node).on('dblclick', function() {
				return false;
			});
		}
		else {
			jQuery(node).attr('title', '');
		}

		this.markInversedBoxes(jQuery(node));
	};

	uEditInPlace.prototype.searchAttr = function(node, callback, deep) {
		if (!node) {
			return false;
		}
		var info;
		deep = deep || 20;
		if (this.getAttrSearchReturnCondition(deep, node.tagName)) {
			return false;
		}

		if (!this.searchAttr.info.node && jQuery(node).attr('umi:field-name')) {
			this.searchAttr.info.node = node;
			var fieldName = jQuery(node).attr('umi:field-name');
			if (!fieldName && typeof callback != 'function') {
				this.message('You should specify umi:field-name attribute');
				return false;
			}
			if (!this.searchAttr.info.field_name) {
				this.searchAttr.info.field_name = fieldName;
			}
		}

		var region = jQuery(node);
		if (typeof callback != 'function' || callback(node)) {
			if (region.attr('umi:element-id')) {
				this.searchAttr.info.id = region.attr('umi:element-id');
				this.searchAttr.info.type = 'element';
				info = this.searchAttr.info;
				this.searchAttr.info = {};
				return info;
			}
			else if (region.attr('umi:object-id')) {
				this.searchAttr.info.id = region.attr('umi:object-id');
				this.searchAttr.info.type = 'object';
				info = this.searchAttr.info;
				this.searchAttr.info = {};
				return info;
			}
		}
		if (node.parentNode) {
			return this.searchAttr(node.parentNode, callback, --deep);
		}
		this.message('You should specify umi:element-id or umi:object attribute');
		return false;
	};

	/* Возвращает список тегов в которых
	 * не осуществляется поиск аттрибутов
	 * @param int deep
	 * @param string tagName
	 * @return boolean
	 */
	uEditInPlace.prototype.getAttrSearchReturnCondition = function(deep, tagName) {
		return jQuery.inArray(tagName, ['BODY', 'TABLE']) >= 0;
	};

	uEditInPlace.prototype.searchAttr.info = {};

	uEditInPlace.prototype.searchRow = function(node, parent) {
		if (parent) {
			if (node.tagName == 'BODY' || node.tagName == 'TABLE') {
				return false;
			}
			if (jQuery(node.parentNode).attr('umi:region')) {
				return node.parentNode;
			} else {
				return this.searchRow(node.parentNode, true);
			}
		}
		else {
			return jQuery('*[umi\\:region]', node).filter(function() {
				var selector = '[umi\\:element-id^="new"], [umi\\:object-id^="new"]';
				return !jQuery(this).find(selector).length && !jQuery(this).is(selector);
			}).get(0);
		}
	};

	uEditInPlace.prototype.searchRowId = function(node) {
		var elementId = jQuery(node).attr('umi:element-id');
		return elementId || (jQuery('*[umi\\:element-id]', node).length ? jQuery('*[umi\\:element-id]', node).get(0).attr('umi:element-id') : null);
	};

	uEditInPlace.prototype.inlineAddPage = function(node) {
		var self = this, originalRow = self.searchRow(node);
		if (!originalRow) {
			self.message('Error, umi:region=row is not defined');
			return false;
		}
		node = jQuery(node);
		var parentId = {
				element: node.attr('umi:element-id'),
				object: node.attr('umi:object-id')
			},
			typeId = node.attr('umi:type-id');

		var parentDel = false;
		jQuery('.u-eip-deleted').each(function(i, n) {
			if (self.searchAttr(n).id == (parentId.element || parentId.object)) {
				parentDel = true;
				return;
			}
		});
		if (parentDel) {
			self.message(getLabel('js-panel-message-cant-add'));
			return false;
		}

		if (!typeId && parentId.element) {
			if (parentId.element.match(/^new/g)) {
				var parent = self.queue.search({id: parentId.element});
				typeId = parent.type_id;
			}
			else {
				var data = jQuery.ajax({
					url: '/admin/content/getTypeAdding/' + parentId.element + '/.json',
					async: false,
					dataType: 'json'
				});
				data = JSON.parse(data.responseText);
				typeId = data.result;
			}
		}
		if (!typeId) {
			self.message('Error, umi:type-id is not defined');
			return false;
		}

		var prepend = (node.attr('umi:method') == 'lastlist' || jQuery(node).attr('umi:add-prepend') == 'prepend'),
			rowNode = jQuery(originalRow).clone(),
			newRowNode = (prepend) ? rowNode.prependTo(originalRow.parentNode) : rowNode.appendTo(originalRow.parentNode);

		newRowNode.removeClass('blank_item');

		var searchFieldName = function(node) {
			var item, i;
			if (jQuery(node).attr('umi:field-name')) {
				return node;
			}
			else if (node.children) {
				for (i = 0; i < node.children.length; i++) {
					item = searchFieldName(node.children[i]);
					if (item) {
						return item;
					}
				}
			}
			return false;
		};
		rowNode = searchFieldName(newRowNode.get(0));
		if (!rowNode) {
			self.message('Error, umi:field-name is not defined');
			return false;
		}
		var info = self.searchAttr(rowNode);

		info.id = 'new_' + new Date().getTime();
		info.type_id = typeId;
		info.add = true;
		info.node = newRowNode.get(0);
		if (parentId.object) {
			info.parent = parentId.object;
			info.type = 'object';
		}
		if (parentId.element) {
			info.parent = parentId.element;
			info.type = 'element';
		}
		delete info.field_name;

		if (jQuery(originalRow).attr('umi:' + info.type + '-id') == '') {
			jQuery(originalRow).remove();
			jQuery(newRowNode).attr('umi:' + info.type + '-id', info.id);
			jQuery('*', newRowNode).each(function(i, n) {
				if (!n.children.length) {
					n.style.display = '';
				}
			});
		}

		var typeFields = jQuery.ajax({
			url: '/admin/content/getTypeFields/' + typeId + '/.json',
			async: false,
			dataType: 'json'
		});
		typeFields = JSON.parse(typeFields.responseText);
		var arTypeFields = [];
		for (var i in typeFields) {
			if (parseInt(i) == i) {
				arTypeFields.push(typeFields[i]);
			}
		}
		arTypeFields.push('name');

		var cleanTags = function(node) {
			var _attr = 'umi:' + info.type + '-id';
			if (jQuery(node).attr('tagName') == 'TABLE') {
				return;
			}

			if (jQuery(node).attr('umi:field-name')) {
				if (jQuery.inArray(jQuery(node).attr('umi:field-name'), arTypeFields) == -1) {
					return false;
				}
				var empty = jQuery(node).attr('umi:empty');

				self.onClearTags(node);

				if (jQuery(node).is('img') && empty) {
					jQuery(node).attr('src', empty);
				} else {
					jQuery(node).html(empty ? empty : '');
				}

				jQuery(node).addClass('u-eip-empty-field');
				self.editNodes[self.editNodes.length] = node;
			}

			if (jQuery(node).attr(_attr)) {
				jQuery(node).attr('umi:clone-source-id', jQuery(node).attr(_attr));
				jQuery(node).attr(_attr, info.id);
			}
		};

		//Delete subregions
		var childRowNode = jQuery('*[umi\\:region="row"]', newRowNode).get(0);
		jQuery('*[umi\\:region="row"]', newRowNode).remove();

		cleanTags(newRowNode);
		newRowNode.addClass('u-eip-newitem');
		var subnodes = jQuery('*', newRowNode);
		subnodes.each(function(index, node) {
			self.inspectNode(node);
			self.highlightListNode(node);
			if (jQuery(node).attr('umi:region')) {
				jQuery(node).html(childRowNode);
				jQuery('*', node).each(function(i, n) {
					n = jQuery(n);
					if (!n.children().length) {
						n.text('');
						n.css('display', 'none');
					}
					if (n.attr('href')) {
						n.attr('href', '');
					}
					if (n.attr('umi:' + info.type + '-id')) {
						n.attr('umi:' + info.type + '-id', '');
					}
				});
			}
			cleanTags(node);
		});

		self.onAfterInlineAdd(newRowNode);

		self.queue.add(info);
		self.normalizeBoxes();
		return true;
	};

	/**
	 * Event "onClearTags" handler
	 */
	uEditInPlace.prototype.onClearTags = function(node) {
	};

	/**
	 * Event "onAfterInlineAdd" handler
	 */
	uEditInPlace.prototype.onAfterInlineAdd = function(newRowNode) {
	};

	/**
	 * Adds new page link after popup closed
	 * @param pageData
	 * @return {Boolean}
	 */
	uEditInPlace.prototype.onSuccessAddNewPage = function(pageData) {
		this.onSuccessAddNewPageBegin(pageData);

		if (!pageData || pageData.forceReload) {
			document.location.reload();
			return false;
		}

		var jqParents = jQuery('[umi\\:element-id=' + pageData.parentId + '][umi\\:region=list]');
		if (!jqParents.length) {
			return false;
		}

		var self = this;

		jqParents.each(function() {
			self.appendNewPageToDOM(pageData, jQuery(this));
		});

		jQuery.closePopupLayer(null, {});

	};

	/**
	 * @param {jQuery} jqElement
	 * @param {Object} data object with properties: {url: 'url', title: 'title', elementId: 'id'}
	 */
	uEditInPlace.prototype.replaceNewPageAttributes = function (jqElement, data) {
		jqElement.removeClass('current blank_item');
		if (jqElement.is('[umi\\:url-attribute]')) {
			jqElement.attr(jqElement.attr('umi:url-attribute'), data.url);
		} else if (jqElement.is('a')) {
			jqElement.attr('href', data.url);
		}

		if (jqElement.is('[umi\\:element-id]')) {
			jqElement.attr('umi:element-id', data.elementId);
		}

		if (jqElement.is('[umi\\:field-name=name]')) {
			jqElement.text(data.title);
		}

		var self = this;
		jqElement.children().each(function() {
			self.replaceNewPageAttributes(jQuery(this), data);
		});
	};

	/* Добавляет в DOM созданный элемент
	 * @param pageData
	 * @param parent
	 */
	uEditInPlace.prototype.appendNewPageToDOM = function (pageData, parent) {
		var newItem = parent.find('[umi\\:region=row]').first().clone();
		this.replaceNewPageAttributes(newItem, pageData);
		newItem.appendTo(parent);
	};

	/* Обрабатывает событие успешного добавления страницы */
	uEditInPlace.prototype.onSuccessAddNewPageBegin = function (pageData) {
	};

	uEditInPlace.prototype.htmlTrim = function(html) {
		html = (html || '').trim();
		return html.replace(/<br ?\/?>/g, '').replace(/(<p>)|(<\/p>)/g, '');
	};

	uEditInPlace.prototype.markInversedBoxes = function(nodes) {
		setTimeout(function() {
			if (!nodes) {
				nodes = jQuery('.u-eip-edit-box');
			}
			nodes.each(function(i, node) {
				var color = new RGBColor(jQuery(node).css('color'));
				var colorHash = color.toHash();
				var alpha = (colorHash['red'] / 255 + colorHash['green'] / 255 + colorHash['blue'] / 224) / 3;
				if (alpha >= 0.9) {
					jQuery(node).addClass('u-eip-edit-box-inversed');
				}
			});
		}, 500);
	};

	uEditInPlace.prototype.highlightListNode = function(node) {
		var self = this;
		if (!jQuery(node).attr('umi:module')) {
			return false;
		}

		var box = document.createElement('div');
		document.body.appendChild(box);
		node.boxNode = box;

		var position = self.nodePositionInfo(node);
		if (!position.x && !position.y) {
			return false;
		}

		jQuery(box).attr('class', 'u-eip-add-box');

		jQuery(box).css({
			'position': 'absolute',
			'width': position.width,
			'height': position.height,
			'left': position.x,
			'top': position.y
		});

		if (jQuery(node).attr('umi:add-method') != 'none') {
			this.addAddButton(node, box);
		}

		if (jQuery(node).attr('umi:sortable') == 'sortable') {
			this.setNodeSortable(node, box);
		}

		return box;
	};

	uEditInPlace.prototype.addAddButton = function(node, box) {

		var buttonTag = this.getEipAddButtonTagName(),
			button = document.createElement(buttonTag);

		node.addButtonNode = button;
		jQuery(button).attr({
			'class': 'u-eip-add-button'
		}).html(getLabel('js-panel-add')).prepend( '<img src="/styles/skins/_eip/images/add_button.svg" alt="+">' );

		this.onSetAddButtonText(node, button);
		jQuery(button).on('mouseenter mouseleave', function() {
			jQuery(this).addClass('u-eip-add-button-hover');
		}, function() {
			jQuery(this).removeClass('u-eip-add-button-hover');
		});

		this.onSetAddButtonHoverEvents(node, button);

		var fDim = 'bottom';
		var sDim = 'left';
		var userPos;
		if (userPos = jQuery(node).attr('umi:button-position')) {
			var arr = userPos.split(/ /);
			if (arr.length == 2) {
				fDim = arr[0];
				sDim = arr[1];
			}
		}

		this.placeWith(node, button, fDim, sDim);

		var self = this;
		jQuery(button).on('mouseup', function() {
			self.onAddButtonMouseup(node);
		}).on('mouseover', function() {
			self.onAddButtonMouseover(box);
		}).on('mouseout', function() {
			self.onAddButtonMouseout(box);
		});

		document.body.appendChild(button);

	};

	/* onSetAddButtonText event handler */
	uEditInPlace.prototype.onSetAddButtonText = function(node, button) {
	};

	/* onSetAddButtonHoverEvents event handler */
	uEditInPlace.prototype.onSetAddButtonHoverEvents = function(node, button) {
	};

	uEditInPlace.prototype.onAddButtonMouseup = function(node) {
		var self = this;
		var regionType = jQuery(node).attr('umi:region');
		var rowNode = self.searchRow(node);
		var elementId = jQuery(node).attr('umi:element-id');
		var module = jQuery(node).attr('umi:module');
		var method = jQuery(node).attr('umi:method');
		var addMethod = jQuery(node).attr('umi:add-method');
		var typeId = jQuery(node).attr('umi:type-id');

		if (rowNode && (regionType == 'list') && (addMethod != 'popup')) {
			self.inlineAddPage(node);
			self.onListAddButtonMouseUp(jQuery(node));
		}
		else {
			if (self.queue.current >= 0) {
				self.message(getLabel('js-panel-message-save-first'));
				return;
			}

			var url = '/admin/content/eip_add_page/choose/' + parseInt(elementId) + '/' + module + '/' + method + '/',
				sCsrfToken = uAdmin.csrf ? '?csrf=' + uAdmin.csrf : '',
				typeIdPart = typeId ? '&type-id=' + typeId : '';
			jQuery.ajax({
				url: url + '.json' + sCsrfToken,
				dataType: 'json',
				success: function(data) {
					if (data.data.error) {
						uAdmin.eip.message(data.data.error);
						return;
					}
					jQuery.openPopupLayer({
						'name': 'CreatePage',
						'title': getLabel('js-eip-create-page'),
						'url': url + sCsrfToken + typeIdPart
					});

					self.onListAddButtonMouseUp(jQuery(node));
				},
				error: function() {
					uAdmin.eip.message(getLabel('error-require-more-permissions'));
					return;
				}
			});
		}
	};

	/* onListAddButtonMouseUp event handler */
	uEditInPlace.prototype.onListAddButtonMouseUp = function($node) {
	};

	/**
	 * Событие при открытии окна после нажатия кнопки "добавить"
	 */
	uEditInPlace.prototype.onAddButtonMouseupPopupOpened = function () {};

	uEditInPlace.prototype.onAddButtonMouseover = function(box) {
		jQuery(box).addClass('u-eip-add-box-hover');
	};

	uEditInPlace.prototype.onAddButtonMouseout = function(box) {
		jQuery(box).removeClass('u-eip-add-box-hover');
	};

	uEditInPlace.prototype.setNodeSortable = function(node, box) {

		var self = this;

		jQuery(node).addClass('u-eip-sortable');

		var oldNextItem = null, oldParent = null, movingItem,
			parentInfo, isSorting = false, connectedLists = [];
		jQuery('*').each(function(i, n) {
			if (n.tagName == 'TABLE') {
				return;
			}

			if (jQuery(n).attr('umi:sortable') != 'sortable') {
				return;
			}

			// Filter parent nodes
			var isParent = false;
			jQuery(n).parents().each(function(_i, _n) {
				if (_n == node) {
					isParent = true;
				}
			});

			if (isParent) {
				return;
			}

			// Filter child nodes
			var isChild = false;
			jQuery('*', n).each(function(_i, _n) {
				if (_n == node) {
					isChild = true;
				}
			});

			if (isChild) {
				return;
			}

			connectedLists.push(n);
		});

		jQuery(node).sortable({
			'items': '> [umi\\:region="row"]',
			'tolerance': 'pointer',
			'cursor': 'move',
			'dropOnEmpty': true,
			'revert': true,
			'forcePlaceholderSize': true,
			'placeholder': 'u-eip-sortable-placeholder',

			'update': function(event, ui) {
				movingItem = ui.item[0];
				if (!jQuery(movingItem).hasClass('u-eip-newitem') && !(window.cloudController && window.cloudController.onController)) {
					var checkEipMovePage = jQuery.ajax({
						url: '/admin/content/eip_move_page/' + jQuery(movingItem).attr('umi:element-id') + '/.json?check',
						async: false,
						dataType: 'json',
						type: 'GET'
					});
					var result = JSON.parse(checkEipMovePage.responseText);
					if (result.error) {
						jQuery(node).sortable('cancel');
						uAdmin.eip.message(result.error);
						return false;
					}
				}

				var nextItem = movingItem.nextSibling;

				do {
					if (!nextItem) {
						break;
					}
					if (nextItem.nodeType != 1) {
						continue;
					}
					if (self.searchRowId(nextItem)) {
						break;
					}
				}
				while (nextItem = nextItem.nextSibling);

				oldNextItem = nextItem;
				oldParent = movingItem.parentNode;

				var info = self.searchAttr(movingItem.parentNode, function(node) {
					return jQuery(node).attr('umi:sortable') == 'sortable';
				});
				var parentId = parseInt(info ? info.id : null);
				info.node = movingItem;
				info.move = true;
				info.moved = self.searchRowId(movingItem);
				info.next = nextItem;
				info.old_next = oldNextItem;
				info.parent_id = parentId;
				info.parent = movingItem.parentNode;
				info.old_parent = oldParent;

				delete info.field_name;

				oldNextItem = null;
				oldParent = null;
				self.normalizeBoxes();
				self.queue.add(info);
			}
		});

	};

	/** Получить позиционные параметры html-элемента */
	uEditInPlace.prototype.nodePositionInfo = function(node) {
		node = jQuery(node);

		return {
			'width': node.innerWidth(),
			'height': node.innerHeight(),
			'x': node.offset().left,
			'y': node.offset().top
		};
	};

	uEditInPlace.prototype.placeWith = function(placer, node, fDim, sDim) {
		if (!placer || !node) {
			return;
		}
		var position = this.nodePositionInfo(placer);
		var region = jQuery(node);

		var x, y;
		switch (fDim) {
			case 'top':
				y = position.y - parseInt(region.css('height'));
				break;

			case 'right':
				x = position.x + position.width;
				break;

			case 'left':
				x = position.x - region.width();
				break;

			default:
				y = position.y + position.height;
		}

		if (fDim == 'top' || fDim == 'bottom') {
			switch (sDim) {
				case 'right':
					x = position.x + position.width - region.width();
					break;

				case 'middle':
				case 'center':
					if (position.width - parseInt(region.css('width')) > 0) {
						x = position.x + Math.ceil((position.width - region.width()) / 2);
					} else {
						x = position.x;
					}
					break;

				default:
					x = position.x;
					x += parseInt(jQuery(placer).css('padding-left'));
			}
		}
		else {
			switch (sDim) {
				case 'top':
					y = position.y;
					break;

				case 'bottom':
					y = position.y + position.height - parseInt(region.css('height'));
					break;

				default:
					if (position.height - parseInt(region.css('height')) > 0) {
						y = position.y + Math.ceil((position.height - parseInt(region.css('height'))) / 2);
					} else {
						y = position.y;
					}
			}
		}

		var rightBound = region.width() + x;
		var jWindow = jQuery(window);
		if (rightBound > jWindow.width()) {
			x = jWindow.width() - region.width() - 30;
		}

		try {
			region.css({
				'position': 'absolute',
				'left': x + 'px',
				'top': y + 'px'
			});
		} catch (e) {
		}
	};

	uEditInPlace.prototype.applyStyles = function(originalNode, targetNode, bApplyDimentions) {
		var styles = [
			'font-size', 'font-family', 'font-name',
			'margin-left', 'margin-right', 'margin-top', 'margin-bottom',
			'font-weight'
		], i;
		originalNode = jQuery(originalNode);
		targetNode = jQuery(targetNode);

		for (i in styles) {
			var ruleName = styles[i];
			targetNode.css(ruleName, originalNode.css(ruleName));
		}

		if (bApplyDimentions !== false) {
			targetNode.width(originalNode.outerWidth());
			targetNode.height(originalNode.outerHeight());
		}
	};

	uEditInPlace.prototype.message = function(msg) {
		jQuery.jGrowl('<p>' + msg + '</p>', {
			'header': 'UMI.CMS',
			'life': 10000
		});
	};

	/** Редактировать элемент */
	uEditInPlace.prototype.edit = function(node, files) {
		if (jQuery(node).hasClass('u-eip-deleted') || jQuery(node).parents().hasClass('u-eip-deleted')) {
			this.message(getLabel('js-panel-message-cant-edit'));
			return false;
		}

		this.finishLast();
		jQuery('.eip-del-button').remove();

		this.previousEditBox = this.editor.get(node, files);

		if (this.previousEditBox) {
			jQuery('.u-eip-add-button, .u-eip-add-box').css('display', 'none');
		}

		jQuery(node).removeClass('u-eip-edit-box u-eip-edit-box-hover u-eip-modified u-eip-deleted u-eip-empty-field u-eip-edit-box-inversed');

		if (this.previousEditBox) {
			jQuery(node).addClass('u-eip-editing');
		}
		var empty = this.htmlTrim(jQuery(node).attr('umi:empty'));
		if (empty && this.htmlTrim(jQuery(node).html()) == empty) {
			jQuery(node).html('&nbsp;');
			jQuery(node).removeClass('u-eip-empty-field');
		}
		return true;
	};

	uEditInPlace.prototype.queue = [];

	uEditInPlace.prototype.queue.add = function(rev) {
		if (this.current == -1) {
			this.setSaveStatus(true);
		}
		if (this.current < this.length - 1) {
			for (var i = this.length - 1; i > this.current; i--) {
				this.pop();
			}
			this.current = (this.length);
		} else {
			++this.current;
		}

		this.push(rev);
		this.step();
		if (rev.add) {
			uAdmin.eip.message(getLabel('js-panel-message-add-after-save'));
			jQuery(rev.node).css('display', '');
		}
		if (rev.move) {
			jQuery(rev.node.parentNode).addClass('u-eip-modified');
		}
		if (rev['delete']) {
			uAdmin.eip.message(getLabel('js-panel-message-delete-after-save'));
			jQuery(rev.node).addClass('u-eip-deleted');
		}
		jQuery(rev.node).addClass('u-eip-modified');
		return this.length;
	};

	uEditInPlace.prototype.queue.get = function(revision) {
		if (!parseInt(revision)) {
			revision = this.current;
		}
		return this[revision] || null;
	};

	uEditInPlace.prototype.queue._saveStatus = false;

	uEditInPlace.prototype.queue.setSaveStatus = function(bStatus) {
		var eip = uAdmin.eip;
		if (bStatus) {
			jQuery('#save').addClass('save_me');
			eip.editorToggleButton.setLabelText(getLabel('js-panel-edit-save'));
		} else {
			jQuery('#save').removeClass('save_me');
			eip.editorToggleButton.setLabelText(eip.enabled ? getLabel('js-panel-view') : getLabel('js-panel-edit'));
		}
		uAdmin.eip.queue._saveStatus = bStatus;
	};

	uEditInPlace.prototype.queue.getSaveStatus = function(bStatus) {
		return uAdmin.eip.queue._saveStatus;
	};

	uEditInPlace.prototype.queue.search = function(revision) {
		var i = this.current;
		while (i >= 0) {
			if (this[i].id == revision.id &&
				(
					this[i].field_name == revision.field_name ||
					(this[i].add && revision.add) ||
					(this[i].move && revision.move) ||
					(this[i]['delete'] && revision['delete'])
					|| (this[i].custom && revision.custom)
				)) {
				return this[i];
			}
			--i;
		}
		return false;
	};

	uEditInPlace.prototype.queue.back = function(steps) {
		steps = parseInt(steps) || 1;
		while (steps--) {
			if (this[this.current]) {
				this.cancel();
			}
		}
		uAdmin.eip.normalizeBoxes();
		this.step();
	};

	uEditInPlace.prototype.queue.forward = function(steps) {
		steps = parseInt(steps) || 1;
		while (steps--) {
			if (this[this.current + 1]) {
				this.apply();
			}
		}
		uAdmin.eip.normalizeBoxes();
		this.step();
	};

	uEditInPlace.prototype.queue.apply = function() {
		uAdmin.eip.finishLast();
		++this.current;
		var rev = this.get();
		if (!rev.add && !rev.move && !rev['delete'] && !rev['custom'] && !uAdmin.eip.editor.replace(rev, rev.new_value, rev.old_value)) {
			--this.current;
		}
		else {
			switch (true) {
				case rev.add:
					uAdmin.eip.message(getLabel('js-panel-message-add-after-save'));
					jQuery(rev.node).css('display', '');
					break;
				case rev['delete']:
					uAdmin.eip.message(getLabel('js-panel-message-delete-after-save'));
					jQuery(rev.node).addClass('u-eip-deleted');
					break;
				case rev.move:
					if (rev.next) {
						jQuery(rev.node).insertBefore(rev.next);
					} else {
						jQuery(rev.node).appendTo(rev.parent);
					}
					jQuery(rev.node).addClass('u-eip-modified');
					jQuery(rev.parent).addClass('u-eip-modified');
					break;
				case rev.custom:
					if (rev.target && rev.target.forward) {
						rev.target.forward();
					}
					break;
				default:
					jQuery(rev.node).addClass('u-eip-modified');
			}
		}
		if (this.current == 0) {
			this.setSaveStatus(true);
		}
	};

	uEditInPlace.prototype.queue.cancel = function() {
		uAdmin.eip.finishLast();
		var rev = this.get(), isModified = false;
		switch (true) {
			case rev.add:
				--this.current;
				jQuery(rev.node).css('display', 'none');
				break;
			case rev['delete']:
				--this.current;
				jQuery(rev.node).removeClass('u-eip-deleted');
				break;
			case rev.move:
				--this.current;
				if (rev.old_next) {
					jQuery(rev.node).insertBefore(rev.old_next);
				} else {
					jQuery(rev.node).appendTo(rev.old_parent);
				}
				jQuery(rev.node).removeClass('u-eip-modified');
				if (!this.search(rev)) {
					jQuery(rev.parent).removeClass('u-eip-modified');
				}
				break;
			case rev.custom:
				--this.current;
				if (rev.target && rev.target.back) {
					rev.target.back();
				}
				break;
			default:
				isModified = uAdmin.eip.editor.replace(rev, rev.old_value, rev.new_value);
				if (isModified) {
					--this.current;
					jQuery(rev.node).addClass('u-eip-modified');
				}
		}

		if (rev.add || rev.move || rev['delete'] || rev.custom || isModified) {
			if (!this.search(rev)) {
				jQuery(rev.node).removeClass('u-eip-modified');
			}
			if (this.current == -1) {
				this.setSaveStatus(false);
				uAdmin.eip.message(getLabel('js-panel-message-changes-revert'));
			}
		}
	};

	uEditInPlace.prototype.queue.step = function() {
		jQuery('#u-quickpanel #save_edit #edit_back').attr('class', (this.current == -1) ? '' : 'ac');
		jQuery('#u-quickpanel #save_edit #edit_next').attr('class', ((this.length - this.current) == 1) ? '' : 'ac');
	};

	/* onEipSaveQueue event handler */
	uEditInPlace.prototype.onEipSaveQueue = function(eip) {
	};

	/* onEipSaveQueueOnEdit event handler */
	uEditInPlace.prototype.onEipSaveQueueWithEdit = function(node) {
	};

	uEditInPlace.prototype.queue.save = function(action) {
		uAdmin.eip.finishLast();
		if (this.current == -1 && !action) {
			return false;
		}
		var self = this, node = false, params = {},
			progress = jQuery('div.popupText span', self.progress);

		uAdmin.eip.onEipSaveQueue(this);

		switch (action) {
			case 'add':
				for (i in self.save.add) {
					node = self.save.add[i];
					delete self.save.add[i];
					break;
				}
				if (node) {
					for (i in self.save.added) {
						if (node.parent == i) {
							node.parent = self.save.added[i];
						}
					}
					var uri = '/admin/content/eip_quick_add/' + node.parent + '.json?type-id=' + node.type_id;

					if (jQuery(node.node).parent().attr('umi:module') != 'data') {
						uri += '&force-hierarchy=1';
					}

					var saveCallback = function(data) {
						if (uAdmin.eip.performSaveError.call(self, data, node)) {
							return;
						}

						// Recieve new element id
						var elementId = parseInt(data.data['element-id']);
						var objectId = parseInt(data.data['object-id']);

						self.save.added[node.id] = elementId || objectId;
						jQuery(node.node).removeClass('u-eip-newitem u-eip-modified');
						jQuery(node.node).attr('umi:' + node.type + '-id', elementId || objectId);
						jQuery('*[umi\\:' + node.type + '-id="' + node.id + '"]', node.node).attr('umi:' + node.type + '-id', elementId || objectId);

						var addedNode = jQuery(node.node);
						var newId = elementId || objectId;
						var parentId = node.parent;
						var parentNode = addedNode.parents('[umi\\:region=list]').first();
						var prepend = parentNode.attr('umi:add-prepend') == 'prepend';

						/**
						 * @param {jQuery} target jQuery set with target element
						 * @param {jQuery} source jQuery set with source element
						 * @param {Boolean} withLinks Force replacing href attributes of all target links
						 */
						var replaceAttributes = function(target, source, withLinks) {
							withLinks = !!withLinks;
							if (target.attr('umi:element-id')) {
								target.attr('umi:element-id', source.attr('umi:element-id') || newId);
							}

							if (target.attr('umi:object-id')) {
								target.attr('umi:object-id', source.attr('umi:object-id') || newId);
							}

							if (target.is('img')) {
								target.attr('src', source.attr('src'));
							} else {
								if (withLinks && target.is('a')) {
									target.attr('href', source.attr('href'));
								}

								if (target.is('[umi\\:field-name]')) {
									if (source.attr('umi:empty')) {
										target.attr('umi:empty', source.attr('umi:empty'));
									}

									if (target.attr('umi:empty')) {
										target.addClass('u-eip-empty-field');
									} else {
										target.removeClass('u-eip-empty-field');
									}

									target.text(source.text() || source.attr('umi:empty') || '');
								}
							}
						};

						// Getting elements same as added element's parent
						var parentTypeId = parentNode.attr('umi:type-id');
						jQuery('[umi\\:' + node.type + '-id=' + parentId + '][umi\\:region=list]')
						// filtering added element's parent
							.filter(function() {
								return jQuery(this).find('[umi\\:' + node.type + '-id=' + newId + ']').length == 0;
							})
							// filtering parents by content type
							.filter(function() {
								var result = false,
									nodeTypeId = jQuery(this).attr('umi:type-id');
								if ((!nodeTypeId && !parentTypeId) || nodeTypeId == parentTypeId) {
									result = true;
								}
								return result;
							})
							.each(function() {

								var parentNode = jQuery(this),
									newItem = parentNode.children('[umi\\:region=row]:first').clone().removeClass('blank_item current'),
									linkItem = uAdmin.eip.addPrevOnStack(addedNode.find('*'))
										.filter('[umi\\:url-attribute]').first(); // element that contains 'umi:url-attribute'

								if (linkItem.length) {
									var urlAttribute = linkItem.attr('umi:url-attribute'),
										newLinkItem = uAdmin.eip.addPrevOnStack(newItem.find('*'));
									// if target element contains 'umi:url-attribute' then set it equals to source one
									if (newLinkItem.filter('[umi\\:url-attribute]').attr(urlAttribute, linkItem.attr(urlAttribute)).length == 0) {
										// if not, then apply 'umi:url-attribute' value of source element to target 'a' element
										newLinkItem.filter('a').attr('href', linkItem.attr(urlAttribute));
									}

									// replace other attributes
									replaceAttributes(newItem, addedNode);
								} else {
									replaceAttributes(newItem, addedNode, true);
								}

								// replace attributes for other children elements with umi:field-name attribute
								addedNode.find('[umi\\:field-name]').each(function() {
									var sourceField = jQuery(this);
									var sourceFieldValue = sourceField.attr('umi:field-name');
									newItem.find('[umi\\:field-name=' + sourceFieldValue + ']').each(function() {
										replaceAttributes(jQuery(this), sourceField);
									});
								});
								// insert new element into DOM
								if (prepend) {
									newItem.prependTo(parentNode);
								} else {
									newItem.appendTo(parentNode);
								}

								parentNode.find('[umi\\:field-name]').each(function() {
									uAdmin.eip.highlightNode(this);
								});

							});
						node = false;
						uAdmin.eip.normalizeBoxes();
						progress.text(parseInt(progress.text()) + 1);
						--self.save.count;
						self.save('add');
					};

					if (uAdmin.eip.getSaveAjaxMethod() === 'GET') {
						jQuery.get(uri, saveCallback, 'json');
					} else {
						jQuery.post(uri, saveCallback, 'json');
					}
				} else {
					self.save('move');
				}
				break;
			case 'move':
				for (i in self.save.move) {
					node = self.save.move[i];
					delete self.save.move[i];
					break;
				}
				if (node) {
					node.next = (node.next == null ? '' : uAdmin.eip.searchRowId(node.next));
					for (i in self.save.added) {
						if (node.parent_id == i) {
							node.parent_id = self.save.added[i];
						}
						if (node.moved == i) {
							node.moved = self.save.added[i];
						}
						if (node.next == i) {
							node.next = self.save.added[i];
						}
					}
					jQuery.post('/admin/content/eip_move_page/' + node.moved + '/' + node.next + '.json', {'parent-id': node.parent_id}, function(data) {
						if (data.error) {
							uAdmin.eip.message(data.error);
							return;
						}
						jQuery(node.node).removeClass('u-eip-modified');
						jQuery(node.node).parent().removeClass('u-eip-modified');

						jQuery('[umi\\:region=list]')
							.filter('[umi\\:element-id=' + node.parent_id + '], [umi\\:object-id=' + node.parent_id + ']')
							.filter(function() {
								return this != node.parent;
							})
							.each(function() {
								var newPosition = jQuery(node.node).index(),
									jqNewNode = jQuery(this).find('[umi\\:region=row][umi\\:' + node.type + '-id=' + node.moved + ']'),
									jqTargetNode = jQuery(this).children().eq(newPosition);
								if (jqNewNode.index() > newPosition) {
									jqNewNode.insertBefore(jqTargetNode);
								} else if (jqNewNode.index() < newPosition) {
									jqNewNode.insertAfter(jqTargetNode);
								}
							});
						uAdmin.eip.normalizeBoxes();
						if (uAdmin.eip.enabled) {
							uAdmin.eip.highlight(node.moved);
						}

						uAdmin.eip.message(getLabel('js-panel-message-page-moved'));
						--self.save.count;
						progress.text(parseInt(progress.text()) + 1);
						self.save('move');
					}, 'json');
				} else {
					self.save('edit');
				}
				break;
			case 'edit':
				for (i in self.save.edit) {
					node = self.save.edit[i];
					delete self.save.edit[i];
					break;
				}

				if (node) {
					for (i in self.save.added) {
						if (node.id == i) {
							node.id = self.save.added[i];
						}
					}

					uAdmin.eip.onEipSaveQueueWithEdit(node);

					if (uAdmin.eip.editor.equals(node.new_value, node.old_value)) {
						jQuery(node.node).removeClass('u-eip-modified');
						node = false;
						uAdmin.eip.normalizeBoxes();
						progress.text(parseInt(progress.text()) + 1);
						--self.save.count;
						self.save('edit');
					}
					else {
						params = {};
						params[node.type + '-id'] = node.id;
						params.qt = new Date().getTime();
						params['field-name'] = node.field_name;
						var value, i;
						switch (typeof node.new_value) {
							case 'object':
								if (node.new_value.src) {
									value = node.new_value.src;
								}
								else {
									value = [];
									for (i in node.new_value) {
										value.push(i);
									}
								}
								break;
							case 'string':
								if (jQuery.browser.mozilla && node.new_value.match(/="\.\.\//g)) {
									node.new_value = node.new_value.replace(/="[\.\.\/]+/g, '="/');
								}
								value = node.new_value.replace(/\sumi:[-a-z]+="[^"]*"/g, '');
								break;
							default:
								value = node.new_value;
						}
						params.value = value;

						jQuery.post('/admin/content/editValue/save.json', params, function(data) {
							if (data.error) {
								uAdmin.eip.message(data.error);
								return;
							}

							var newLink = data.property['new-link'],
								oldLink = data.property['old-link'];

							var parentNode = jQuery(node.node).parents('[umi\\:element-id], [umi\\:object-id]').first(),
								parentType = parentNode.is('[umi\\:object-id]') ? 'object' : 'element',
								parentId = parentNode.attr('umi:' + parentType + '-id'),
								rootNodes = jQuery('[umi\\:' + parentType + '-id=' + parentId + ']');

							if (!rootNodes.length) {
								rootNodes = jQuery(node.node).parent();
							}

							if (oldLink && newLink) {
								var iProcessedNodes = 0;
								rootNodes.each(function() {
									jQuery(this).find('[umi\\:url-attribute]').each(function() {
										jQuery(this).attr(jQuery(this).attr('umi:url-attribute'), newLink).on('click mousedown mouseup', function() {
											return true;
										});
										iProcessedNodes++;
									});
								});
								if (!iProcessedNodes) {
									rootNodes.find('a').each(function(i, n) {
										jQuery(this).attr('href', newLink).on('click mousedown mouseup', function() {
											return true;
										});
									});
								}
							}

							jQuery('[umi\\:' + node.type + '-id=\'' + node.id + '\']')
								.find('[umi\\:field-name=' + data.property['name'] + ']')
								.add('[umi\\:' + node.type + '-id=\'' + node.id + '\'][umi\\:field-name=' + data.property['name'] + ']')
								.not('[umi\\:' + node.type + '-id][umi\\:' + node.type + '-id!=\'' + node.id + '\']')
								.each(function() {
									var elem = jQuery(this);

									if (elem.is('img')) {
										var value = (data.property.value === null) ? '' : data.property['value']['src'];
										elem.attr('src', value);
									} else {
										elem.html(node.node.innerHTML);
									}

									elem.parents('.not_hidden').removeClass('not_hidden');
								});

							jQuery(node.node).removeClass('u-eip-modified');
							node = false;
							uAdmin.eip.normalizeBoxes();
							progress.text(parseInt(progress.text()) + 1);
							--self.save.count;
							self.save('edit');
						}, 'json');
					}
				} else {
					self.save('custom');
				}
				break;
			case 'custom':

				for (i in self.save.custom) {
					node = self.save.custom[i];
					delete self.save.custom[i];
					break;
				}

				if (node) {

					if (node.target && node.target.save && typeof node.target.save == 'function') {
						node.target.save();
					}

					progress.text(parseInt(progress.text()) + 1);
					--self.save.count;
					self.save('custom');
				} else {
					self.save('del');
				}
				break;
			case 'del':
				for (i in self.save.del) {
					node = self.save.del[i];
					delete self.save.del[i];
					break;
				}
				if (node) {
					for (i in self.save.added) {
						if (node.id == i) {
							node.id = self.save.added[i];
						}
					}
					params = {};
					params[node.type + '-id'] = node.id;
					params.qt = new Date().getTime();

					jQuery.ajax({
						type: 'POST',
						url: '/admin/content/eip_del_page.json',
						data: params,
						dataType: 'json',
						success: function(data) {
							if (data.error) {
								uAdmin.eip.message(data.error);
								return;
							}

							var rowNode = uAdmin.eip.searchRow(node.node, true);

							if (rowNode && jQuery(rowNode).attr('umi:region') != 'list') {
								jQuery(rowNode).remove();
							} else {
								jQuery(node.node).remove();
							}

							jQuery('[umi\\:element-id=' + node.id + '], [umi\\:object-id=' + node.id + ']').remove();
							uAdmin.eip.normalizeBoxes();
							node = false;
							uAdmin.eip.normalizeBoxes();
							progress.text(parseInt(progress.text()) + 1);
							--self.save.count;
							self.save('del');
						},
						error: function(response) {
							var message = getLabel('js-label-request-error');

							if (response.status === 403 && response.responseJSON && response.responseJSON.data && response.responseJSON.data.error) {
								message = response.responseJSON.data.error;
							}

							uAdmin.eip.message(message);
						}
					});
				} else {
					self.save.add = {};
					self.save.added = {};
					self.save.move = {};
					self.save.edit = {};
					self.save.del = {};
					self.save.custom = {};
					self.setSaveStatus(false);
					this.step();

					var message = uAdmin.eip.getDeleteMessageOfEipSave(parseInt(progress.text()) === 0);
					uAdmin.eip.message(message);
					jQuery('input:button', self.progress).removeClass('hidden');
					uAdmin.eip.onSave('after');
				}

				break;

			default:
				uAdmin.eip.onSave('before');
				while (0 <= this.current) {
					if (self[0].add) {
						self.save.add[self[0].id] = self[0];
						++self.save.count;
					}
					else if (this[0].move) {
						if (self.save.move[self[0].moved]) {
							delete self.save.move[self[0].moved];
							--self.save.count;
						}
						self.save.move[self[0].moved] = self[0];
						++self.save.count;
					}
					else if (this[0]['delete']) {
						self.save.del[self[0].id] = self[0];
						++self.save.count;
					}
					else if (this[0]['custom']) {
						self.save.custom[self[0].id] = self[0];
						++self.save.count;
					}
					else {
						if (self.save.edit[self[0].id + '_' + self[0].field_name]) {
							self.save.edit[self[0].id + '_' + self[0].field_name].new_value = self[0].new_value;
						}
						else {
							self.save.edit[self[0].id + '_' + self[0].field_name] = self[0];
							++self.save.count;
						}
					}
					self.shift();
					--self.current;
				}

				self.progress = jQuery.openPopupLayer({
					name: 'SaveProgress',
					width: 400,
					height: 'auto',
					data: '\n\
						<div class="eip_win_head popupHeader">\n\
							<div class="eip_win_close popupClose hidden">&#160;</div>\n\
							<div class="eip_win_title">' + getLabel('js-cms-eip-edit_in_place-save_processing') + '</div>\n\
						</div>\n\
						<div class="eip_win_body popupBody">\n\
							<div class="popupText">' + getLabel('js-cms-eip-edit_in_place-saved_count_modify', self.save.count) + '</div>\n\
							<div class="eip_buttons">\n\
								<input type="button" class="primary ok hidden" value="OK" />\n\
								<div style="clear: both;"></div>\n\
							</div>\n\
						</div>\n\
					'
				}).find('#popupLayer_SaveProgress');

				jQuery('input:button', self.progress).on('click', function() {
					jQuery.closePopupLayer('SaveProgress');

					uAdmin.eip.onSaveFinish();
				});

				self.save('add');
		}
		return false;
	};

	/**
	 * Возвращает тип ajax запроса eip при сохранении
	 * @returns string
	 */
	uEditInPlace.prototype.getSaveAjaxMethod = function() {
		return 'GET';
	};

	/**
	 * Обрабатывает ошибку запроса eip при сохранении
	 * @param object data
	 * @param object node
	 * @returns string
	 */
	uEditInPlace.prototype.performSaveError = function(data, node) {
		if (data && data.error) {
			uAdmin.eip.message(data.error);
			return true;
		}

		return false;
	};

	/**
	 * Удаляет из очереди на сохранение все действия связанные с элементом,
	 * который не удалось добавить.
	 * @param elementId string - идентифкатор элемента
	 */
	uEditInPlace.prototype.removeAddFail = function(elementId) {
	};

	/**
	 * Возвращает сообщение при сохранении операций удаления
	 * @param isNotStarted
	 * @returns string
	 */
	uEditInPlace.prototype.getDeleteMessageOfEipSave = function(isNotStarted) {
		return getLabel('js-panel-message-changes-saved');
	};

	/**
	 * Возвращает разрешение на инициализацию редактора
	 * изображений в процедуре активации модуля редактирования EditModule
	 * @returns boolean
	 */
	uEditInPlace.prototype.isImageEditorReinitEnabled = function(name) {
		return true;
	};

	/** onEditModuleActivate event handler */
	uEditInPlace.prototype.onEditModuleActivate = function() {
	};


	/** onSaveFinish event handler */
	uEditInPlace.prototype.onSaveFinish = function() {
	};

	/** Return base tag for eip add button
	 *  @returns string
	 */
	uEditInPlace.prototype.getEipAddButtonTagName = function() {
		return 'a';
	};

	/**
	 * Return relation draw apply dimentions param
	 * @returns boolean|null
	 */
	uEditInPlace.prototype.isRelationDrawApplyDimentions = function() {
		return null;
	};

	/**
	 * Add the previous set of elements on the stack to the current set.
	 * @param elements
	 * @returns {}
	 */
	uEditInPlace.prototype.addPrevOnStack = function(elements) {
		return elements.addBack();
	};

	/**
	 * Get true when has custom bind finish event return
	 * @returns boolean
	 */
	uEditInPlace.prototype.isBindFinishEventCustomReturn = function(target) {
		return false;
	};

	/**
	 * Get search field width or false if default
	 * @returns int
	 */
	uEditInPlace.prototype.getRelationSearchFieldWidth = function(box) {
		return 0;
	};

	/**
	 * Get flag of cleanup  html on wysiwyg ctrl shift
	 * @returns boolean
	 */
	uEditInPlace.prototype.isCleanupHtmlOnWysiwygCtrlShift = function() {
		return true;
	};

	/**
	 * Get MSIE stub image usage flag
	 * @returns boolean
	 */
	uEditInPlace.prototype.getMSIEStubImgCondition = function() {
		return true;
	};

	/* onTinymceInitEditorTune event handler */
	uEditInPlace.prototype.onTinymceInitEditorTune = function(settings) {
	};

	/**
	 * Запускает ознакомительные подсказки по сайту
	 */
	uEditInPlace.prototype.showWizard = function() {
	};

	/**
	 * Возвращает признак того, что редактируемое изображение является слайдером
	 * @param editor
	 * @return boolean
	 */
	uEditInPlace.prototype.isEditedImageTypeSlider = function(editor) {
		return editor && editor.iImageType && editor.iImageType == editor.IMAGE_TYPE_SLIDER;
	};

	/**
	 * Возвращает url всплывающего диалога редактирования слайдера
	 * @param editor
	 * @return string
	 */
	uEditInPlace.prototype.getSliderEditPopupLayerUrl = function(editor) {
		var queryParams = {
			'slider_id': $(editor.jqImgNode[0]).attr('umi:slider-id'),
			'token': uAdmin['csrf'],
			'prefix': uAdmin['lang_prefix']
		};

		return '/styles/common/other/slidereditor/slideEditor.html?' + $.param(queryParams);
	};

	uEditInPlace.prototype.queue.save.add = {};
	uEditInPlace.prototype.queue.save.added = {};
	uEditInPlace.prototype.queue.save.move = {};
	uEditInPlace.prototype.queue.save.edit = {};
	uEditInPlace.prototype.queue.save.del = {};
	uEditInPlace.prototype.queue.save.custom = {};
	uEditInPlace.prototype.queue.save.count = 0;

	uEditInPlace.prototype.queue.current = -1;

	uEditInPlace.prototype.enabled = false;
	uEditInPlace.prototype.previousEditBox = null;
	uEditInPlace.prototype.editNodes = [];
	uEditInPlace.prototype.listNodes = [];
	uEditInPlace.prototype.meta = {};

	return extend(uEditInPlace, this);
});

uAdmin('.ieditor', function (extend) {

	var settings = {

		backend_request_url: '/udata://content/ieditor/',
		backend_request_method: 'POST',
		image_data_url: '/admin/content/getImageData.json',
		image_data_request_method: 'POST',
		coockie_name: 'eip_ieditor_state',
		preloader_src: '/styles/skins/_eip/images/loader.gif',
		preloader_holder_css_class: 'eip-ieditor-preloader',

		collection: {
			editor_id_attribute: 'data-ieditor-id'
		},

		editor: {
			menu_wrapper_css_class: 'eip-ieditor-menu-wrapper',
			img_wrapper_css_class: 'eip-ieditor-img-wrapper',
			animation_speed: 100
		},

		layout: {
			extended: {
				css_class: 'eip-ieditor-layout-extended',
				right_margin: '5px',
				bottom_margin: '5px'
			},
			simple: {
				css_class: 'eip-ieditor-layout-simple',
				right_margin: '5px',
				bottom_margin: '5px'
			},
			bubble: {
				css_class: 'eip-ieditor-layout-bubble',
				arrow_css_class: 'eip-ieditor-layout-bubble-arrow',
				bottom_margin: -50,
				bottom_margin_delta: 0
			},
			big_img_min_width: 300,
			big_img_min_height: 350,
			small_img_max_width: 150,
			small_img_max_height: 150
		},

		module: {
			module_css_class: 'eip-ieditor-module',
			icon_holder_css_class: 'eip-ieditor-module-icon',
			title_holder_css_class: 'eip-ieditor-module-title',
			upload_module: {
				url: '/udata/content/ieditor/upload.json',
				iframe_name: 'eip-ieditor-upload-iframe',
				file_input_name: 'eip-ieditor-upload-fileinput[]',
				css_class: 'eip-ieditor-module-upload'
			},
			filemanager_module: {
				css_class: 'eip-ieditor-module-filemanager'
			},
			popup_module: {
				css_class: 'eip-ieditor-module-popup',
				fancybox_css_class: 'fancybox-group',
				wrapper_css_class: 'eip-ieditor-module-popup-wrapper',
				thumb_width: 100
			},
			delete_module: {
				css_class: 'eip-ieditor-module-delete'
			},
			apply_module: {
				css_class: 'eip-ieditor-module-apply'
			},
			cancel_module: {
				css_class: 'eip-ieditor-module-cancel'
			}
		},

		img_area_select: {
			css_class: 'eip-ieditor-imgareaselect-wrapper',
			plugin_options: {
				parent: null,
				hide: true,
				handles: true,
				instance: true,
				keys: true,
				movable: true,
				persistent: true,
				resizeMargin: 10,
				zIndex: 100001
			}
		},

		filemanager: {
			url: '/styles/common/other/elfinder/umifilebrowser.html?lang=ru',
			window_width: 1200,
			window_height: 600
		},

		browser_modules: {
			msie: [FilemanagerModule, SliderModule, PopupModule, ApplyModule, CancelModule, DeleteModule],
			mozilla: [FilemanagerModule, SliderModule, PopupModule, UploadModule, ApplyModule, CancelModule, DeleteModule],
			opera: [FilemanagerModule, SliderModule, PopupModule, UploadModule, ApplyModule, CancelModule, DeleteModule],
			webkit: [FilemanagerModule, SliderModule, PopupModule, UploadModule, ApplyModule, CancelModule, DeleteModule]
		}

	};

	uAdmin.inherit = function (Child, Parent) {
		var F = function() {};
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		Child.prototype.constructor = Child;
		Child.superclass = Parent.prototype;
	};

	var uImageEditor = function () {

		if (!uAdmin || !uAdmin.eip) {
			throw "Edit-in-place is not initialized";
		}

		this.COOKIE_NAME = settings.coockie_name;
		this.COOKIE_ENABLED_VALUE = 'enabled';
		this.COOKIE_DISABLED_VALUE = 'disabled';

		this.jqToggleButton = null;
		this.bEnabled = true;
		this.skipDeactivateClick = false;

		var self = this;
		uAdmin.eip.bind('Enable', function(type){
			if (type == 'after') {
				self.addPanelButton();
			}
		});
		uAdmin.eip.bind('Disable', function(type){
			if (type == 'after') {
				self.removePanelButton();
				self.disable();
			}
		});
		uAdmin.eip.bind('ActiveEditorCommit', function(type){
			if (type == 'before' && uAdmin.eip.editor.info.field_type == 'wysiwyg' && uAdmin.eip.editor.info.old_value && uAdmin.eip.editor.info.new_value) {
				uAdmin.eip.editor.info.old_value = uAdmin.eip.editor.info.old_value.replace(/\sdata-ieditor-id=["']{1}[0-9\._]+["']{1}/gi, '');
				uAdmin.eip.editor.info.new_value = uAdmin.eip.editor.info.new_value.replace(/\sdata-ieditor-id=["']{1}[0-9\._]+["']{1}/gi, '');
				uAdmin.eip.editor.info.old_value = uAdmin.eip.editor.info.old_value.replace(/(src=".*)\?[0-9]+/gi, "$1");
				uAdmin.eip.editor.info.new_value = uAdmin.eip.editor.info.new_value.replace(/(src=".*)\?[0-9]+/gi, "$1");
			} else {
				uAdmin.eip.normalizeBoxes();
			}
		});
		uAdmin.eip.bind('AddPhotoToAlbum', function(type, options){
			if (type == 'after' && options && options.newNode && options.newNode.length) {
				var sAttr = ImageEditorsCollection.getInstance().EDITOR_ID_ATTRIBUTE,
					imageNodes = options.newNode.find("img[" + sAttr + "]");

				uAdmin.eip.addPrevOnStack(imageNodes).removeAttr(sAttr);

				if (!uAdmin.ieditor.isEnabled()) return;
				var imgNode = options.newNode.find('img')[0],
					jqImgNode = jQuery(imgNode),
					oEditor = ImageEditorsCollection.getInstance().initEditor(imgNode);
				if (oEditor instanceof ImageEditorBase) {
					jqImgNode.on('load', function(){
						oEditor.init(jqImgNode, jqImgNode.attr(sAttr));
					});
				}
			}
		});

		uAdmin.onLoad('wysiwyg', function(){
			tinymce.on("AddEditor", function(oEvent){
				oEvent.editor.on('SetAttrib', function(oEvent){
					jQuery(oEvent.attrElm).on('load', function(oEvent){
						if (!uAdmin.ieditor.isEnabled()) return;
						var oImgEditor = ImageEditorsCollection.getInstance().initEditor(this);
						if (oImgEditor.getEditState()) return;
						oImgEditor.destroy(true);
						oImgEditor.init(jQuery(this), jQuery(this).attr(ImageEditorsCollection.getInstance().EDITOR_ID_ATTRIBUTE));
						window.setTimeout(function(){
							tinymce.activeEditor.selection.collapse();
						}, 0);
					});
				});
				oEvent.editor.on('init', function(oEvent){
					var arImages = this.dom.select('img:not(.mce-object)');
					if (uAdmin.ieditor.isEnabled() && arImages && arImages.length) {
						uAdmin.ieditor.enable(arImages);
					}
				});

				var originalOpen = oEvent.editor.windowManager.open;
				oEvent.editor.windowManager.open = function() {
					uAdmin.ieditor.disable();

					var win = originalOpen.apply(this, arguments);
					win.on('close', function onClose() {
						setTimeout(function() {
							uAdmin.ieditor.enable()
						}, 500);
					});
					return win;
				}
			});
		});

		jQuery("body").on('click', function(oEvent){
			if (
				(jQuery(oEvent.target).closest("." + settings.collection.editor_id_attribute + ", ." + settings.img_area_select.css_class).length) ||
				(jQuery(oEvent.target).is(".mce-resizehandle, img"))
			) {
				return;
			}

			var oEditor = ImageEditorsCollection.getInstance().getActiveEditor();

			if ((oEditor instanceof ImageEditorBase === false) || (uAdmin.ieditor.skipDeactivateClick)) {
				return
			};

			var oEnabledModule = oEditor.getEnabledModule();
			oEnabledModule.cancel();
			oEnabledModule.deactivate();

			oEditor.hide();
			oEditor.switchOn();
			oEditor.redrawMenu();
			oEditor.drawDeleteButton();
		});

		if (uAdmin.eip.enabled) {
			this.addPanelButton();
		}

	};

	uImageEditor.prototype.isEnabled = function () {
		return this.bEnabled;
	};

	uImageEditor.prototype.getNodes = uImageEditor.getNodes = function (bReturnJquery) {
		jqNodes = jQuery("img[umi\\:field-name], .mceEditor img, [umi\\:field-type='wysiwyg'] img, img[umi\\:slider-id]");
		return bReturnJquery ? jqNodes : jqNodes.toArray();
	};

	uImageEditor.prototype.enable = function (arNodes) {
		if (!uAdmin.eip.enabled) return;
		if (!arNodes) arNodes = this.getNodes();
		var oEditorsCollection = ImageEditorsCollection.getInstance(),
			oActiveEditor = oEditorsCollection.getActiveEditor();
		for (var i = 0; i < arNodes.length; i++) {
			if (oEditorsCollection.getEditorByNode(arNodes[i])) {
				if (!oActiveEditor || oActiveEditor.jqImgNode[0] !== arNodes[i]) {
					oEditorsCollection.getEditorByNode(arNodes[i]).destroy();
					oEditorsCollection.initEditor(arNodes[i]);
				}
			} else {
				oEditorsCollection.initEditor(arNodes[i]);
			}
		}
		this.removeEipDeleteButtons();
		this.bEnabled = true;
		this.jqToggleButton.addClass('act');
	};

	uImageEditor.prototype.disable = function () {
		if (!this.isEnabled()) return;
		var oActiveEditor = ImageEditorsCollection.getInstance().getActiveEditor();
		if (oActiveEditor instanceof ImageEditorBase) {
			oActiveEditor.getEnabledModule() && oActiveEditor.getEnabledModule().cancel();
		}
		ImageEditorsCollection.getInstance().removeAllEditors();
		ImageEditorsCollection.getInstance().turnOffEditMode();
		this.addEipDeleteButtons();
		this.bEnabled = false;
		this.jqToggleButton.removeClass('act');
	};

	uImageEditor.prototype.reinit = function () {
		ImageEditorsCollection.getInstance().reinitActiveEditors();
	};

	uImageEditor.prototype.setSettings = function (oSettings) {
		var applySettings = function (oNewSettings, oOldSettings) {
			for (var param in oNewSettings) {
				if (!oNewSettings.hasOwnProperty(param) || !oOldSettings.hasOwnProperty(param)) continue;
				if (typeof oNewSettings[param] === 'object' && oNewSettings[param] instanceof Object) {
					applySettings(oNewSettings[param], oOldSettings[param]);
				} else {
					oOldSettings[param] = oNewSettings[param];
				}
			}
		};
		applySettings(oSettings, settings);
		ImageEditorsCollection.getInstance().reinitActiveEditors();
	};

	uImageEditor.prototype.getEditorsCollection = function () {
		return ImageEditorsCollection.getInstance();
	};

	uImageEditor.prototype.removeEipDeleteButtons = function () {
		this.jqEipDeleteButtonsNodes = this.getNodes(true);
		if (!this.jqEipDeleteButtonsNodes.length) return;
		var jqParentNodes = this.jqEipDeleteButtonsNodes.parents("[umi\\:delete]").filter(function(index, node){
			return !!jQuery(this).parents("[umi\\:module='photoalbum']").length;
		});
		this.jqEipDeleteButtonsNodes = this.jqEipDeleteButtonsNodes.filter('[umi\\:delete]').add(jqParentNodes);
		this.jqEipDeleteButtonsNodes.removeAttr('umi:delete');
		uAdmin.eip.dropDeleteButtons();
	};

	uImageEditor.prototype.addEipDeleteButtons = function () {
		if (!this.jqEipDeleteButtonsNodes || !this.jqEipDeleteButtonsNodes.length) return;
		this.jqEipDeleteButtonsNodes.attr('umi:delete', 'delete');
		uAdmin.eip.dropDeleteButtons();
	};

	uImageEditor.prototype.addPanelButton = function () {
		var self = this;
		this.jqToggleButton = jQuery("<div/>");
		this.jqToggleButton.attr('id', 'ieditor-switcher')
			.text(getLabel('js-ieditor-switcher'))
			.appendTo(uAdmin.panel.quickpanel)
			.on('click', function(){
				if (self.isEnabled()) {
					self.disable();
				} else {
					self.enable();
				}
				self.saveStateToCookie();
			});
		jQuery('<span class="in_ico_bg">').prependTo(this.jqToggleButton);
		this.applyStateFromCookie();
	};

	uImageEditor.prototype.removePanelButton = function () {
		this.jqToggleButton && this.jqToggleButton.length && this.jqToggleButton.remove();
	};

	uImageEditor.prototype.applyStateFromCookie = function () {
		if (!jQuery.cookie) return;
		if (jQuery.cookie(this.COOKIE_NAME) == this.COOKIE_ENABLED_VALUE) {
			this.enable();
		} else if (jQuery.cookie(this.COOKIE_NAME) == this.COOKIE_DISABLED_VALUE) {
			this.disable();
		} else {
			this.enable();
		}
	};

	uImageEditor.prototype.saveStateToCookie = function () {
		if (!jQuery.cookie) return;
		var state = this.isEnabled() ? this.COOKIE_ENABLED_VALUE : this.COOKIE_DISABLED_VALUE,
			date = new Date();
		date.setTime(date.getTime() + (3 * 24 * 60 * 60 * 1000));
		jQuery.cookie(this.COOKIE_NAME, state, { path: '/', expires: date});
	};


	/* ================================== ENTITY ================================= */

	var EntityBase = function () {

		this.oEventHandlers = {};

	};

	EntityBase.prototype.bindEvent = function (sEventName, fEventHandler) {
		if (typeof fEventHandler != 'function') return false;

		if (!this.oEventHandlers[sEventName]) {
			this.oEventHandlers[sEventName] = [];
		}
		this.oEventHandlers[sEventName].push({'context': this, 'handler': fEventHandler});
		return true;
	};

	EntityBase.prototype.triggerEvent = function (sEventName, arEventHandlerParams) {
		var arEventHandlers = this._getHandlersForObjectEvent(sEventName, this);
		if (!arEventHandlers || !arEventHandlers.length) {
			return false;
		}
		for (var i = 0; i < arEventHandlers.length; i++) {
			arEventHandlers[i].apply(this, arEventHandlerParams);
		}
		return true;
	};

	EntityBase.prototype._getHandlersForObjectEvent = function (sEventName, oContext) {
		var arEventListeners = this.oEventHandlers[sEventName];
		if (!arEventListeners) {
			return [];
		}
		var arEventHandlers = [];
		for (var i in arEventListeners) {
			if (arEventListeners.hasOwnProperty(i) && arEventListeners[i].context === oContext && typeof arEventListeners[i].handler == 'function') {
				arEventHandlers.push(arEventListeners[i].handler);
			}
		}
		return arEventHandlers;
	};


	/* ================================== COLLECTION ================================= */

	var ImageEditorsCollection = function () {

		this.settings = settings;

		this.EDITOR_ID_ATTRIBUTE = settings.collection.editor_id_attribute;
		this.BIG_IMG_MIN_WIDTH = settings.collection.big_img_min_width;
		this.BIG_IMG_MIN_HEIGHT = settings.collection.big_img_min_height;
		this.SMALL_IMG_MAX_WIDTH = settings.collection.small_img_max_width;
		this.SMALL_IMG_MAX_HEIGHT = settings.collection.small_img_max_height;

		this._arEditors = {};

		this.oActiveEditor = null;
		this.bEditMode = false;

		jQuery("body")
			.on("mouseenter", "img", function(oEvent){
				if (!uAdmin.eip.enabled || !uAdmin.ieditor.isEnabled()) return false;
				if (ImageEditorsCollection.getInstance().isInEditState()) return false;
				var jqImgNode = jQuery(this),
					sEditorIdAttribute = ImageEditorsCollection.getInstance().EDITOR_ID_ATTRIBUTE;
				if (!jqImgNode.attr(sEditorIdAttribute)) return false;
				var oEditor = ImageEditorsCollection.getInstance().initEditor(this);
				oEditor.init(jqImgNode, jqImgNode.attr(sEditorIdAttribute));
				oEditor.show();
				window.setTimeout(function(){
					if (!oEditor.isImageInFocus()) {
						oEditor.hide(function(){
							oEditor.destroy(true);
						});
					}
				}, 100);
				return true;
			})
			.on('mousemove', function(oEvent){
				window.mouseX = oEvent.pageX || oEvent.clientX + jQuery(document).scrollLeft();
				window.mouseY = oEvent.pageY || oEvent.clientY + jQuery(document).scrollTop();
			});

	};

	ImageEditorsCollection._instance = null;

	ImageEditorsCollection.getInstance = function () {
		if (!ImageEditorsCollection._instance) {
			ImageEditorsCollection._instance = new ImageEditorsCollection();
		}
		return ImageEditorsCollection._instance;
	};

	ImageEditorsCollection.cleanupHtml = function (sHtml) {
		return new ImageEditorBase.cleanupHtml(sHtml);
	};

	ImageEditorsCollection.prototype.initEditor = function (imgNode) {

		if (ImageEditorsCollection.getInstance().isInEditState()) {
			return new ImageEditorVoid();
		}

		if (this.getEditorByNode(imgNode)) {
			return this.getEditorByNode(imgNode);
		}

		var jqImgNode = jQuery(imgNode),
			sNodeUniqueId = this.getUniqueId();

		jqImgNode.attr(this.EDITOR_ID_ATTRIBUTE, sNodeUniqueId);

		var oEditor = new ImageEditor();

		this._arEditors[sNodeUniqueId] = oEditor;

		return oEditor;

	};

	ImageEditorsCollection.prototype.reinitActiveEditors = function () {
		var arActiveEditors = [];
		for (var i in this._arEditors) {
			if (!this._arEditors.hasOwnProperty(i) || this._arEditors[i] instanceof ImageEditorBase === false) continue;
			arActiveEditors.push(this._arEditors[i].jqImgNode[0]);
		}
		this.removeAllEditors();
		for (i = 0; i < arActiveEditors.length; i++) {
			this.initEditor(arActiveEditors[i]);
		}
	};

	ImageEditorsCollection.prototype.updateEditorsByNodes = function (context) {
		jQuery("img", context)
			.filter(function(){
				return !!jQuery(this).attr(ImageEditorsCollection.getInstance().EDITOR_ID_ATTRIBUTE);
			})
			.each(function(i, node){
				var oEditor = ImageEditorsCollection.getInstance().initEditor(node);
				oEditor.reinit();
			});
	};

	ImageEditorsCollection.prototype.repositionActiveEditors = function () {
		for (var i in this._arEditors) {
			if (!this._arEditors.hasOwnProperty(i) || this._arEditors[i] instanceof ImageEditorBase === false) continue;
			if (!this._arEditors[i].jqImgNode || !this._arEditors[i].jqImgNode.length || !this._arEditors[i].jqImgNode.is(":visible")) {
				this._arEditors[i].destroy();
				continue;
			}
			this._arEditors[i].reinit();
		}
	};

	ImageEditorsCollection.prototype.getEditorByNode = function (imgNode) {
		return this._arEditors[jQuery(imgNode).attr(this.EDITOR_ID_ATTRIBUTE)];
	};

	ImageEditorsCollection.prototype.getEditorByEditorId = function (sEditorId) {
		return this._arEditors[sEditorId];
	};

	ImageEditorsCollection.prototype.getAllEditors = function () {
		return this._arEditors;
	};

	ImageEditorsCollection.prototype.findEditors = function (context) {
		var jqImgNode = jQuery("img["+this.EDITOR_ID_ATTRIBUTE+"]", context),
			arEditors = [],
			self = this;
		jqImgNode.each(function(index, node){
			arEditors.push(self.getEditorByNode(node));
		});
		return arEditors;
	};

	ImageEditorsCollection.prototype.removeAllEditors = function () {
		for (var sEditorId in this._arEditors) {
			if (!this._arEditors.hasOwnProperty(sEditorId)) continue;
			this.removeEditor(sEditorId);
		}
		this.oActiveEditor = null;
		this._arEditors = {};
	};

	ImageEditorsCollection.prototype.removeEditor = function (sEditorId) {
		this._arEditors[sEditorId].destroy();
		delete this._arEditors[sEditorId];
	};

	ImageEditorsCollection.prototype.removeEmptyEditors = function () {
		var arImgEditors = this.getAllEditors();
		for (var i in arImgEditors) {
			if (!arImgEditors.hasOwnProperty(i)) continue;
			var oImgEditor = arImgEditors[i];
			if (oImgEditor instanceof ImageEditorBase === false) continue;
			if (!oImgEditor.getEditorId()) continue;
			if (!oImgEditor.jqImgNode || !oImgEditor.jqImgNode.length || !oImgEditor.jqImgNode.is(':visible')) {
				this.removeEditor(oImgEditor.getEditorId());
			}
		}
	};

	ImageEditorsCollection.prototype.getUniqueId = function () {
		var sId = '';
		do {
			sId = new Date().getTime() + '_' + Math.random();
		} while (sId in this._arEditors);
		return sId;
	};

	ImageEditorsCollection.prototype.setActiveEditor = function (oEditor) {
		if (this.oActiveEditor && this.oActiveEditor.deactivateEnabledModule) {
			if (this.oActiveEditor.deactivateEnabledModule(true)){
				this.oActiveEditor = oEditor;
				return true;
			} else {
				return false;
			}
		} else {
			this.oActiveEditor = oEditor;
			return true;
		}
	};

	ImageEditorsCollection.prototype.getActiveEditor = function () {
		return this.oActiveEditor;
	};

	ImageEditorsCollection.prototype.deactivateActiveEditor = function () {
		return this.setActiveEditor(null);
	};

	ImageEditorsCollection.prototype.turnOnEditMode = function () {
		this.bEditMode = true;
	};

	ImageEditorsCollection.prototype.turnOffEditMode = function () {
		this.bEditMode = false;
	};

	ImageEditorsCollection.prototype.isInEditState = function () {
		return this.bEditMode;
	};

	ImageEditorsCollection.prototype.each = function (callback) {
		if (typeof callback != 'function') return;
		for (var i = 0; i < this._arEditors; i++) {
			var oEditor = this._arEditors[i];
			if (oEditor instanceof ImageEditorBase === false) continue;
			callback.call(oEditor, i, oEditor);
		}
	};


	/* ================================== LAYOUTS ================================= */


	var LayoutBase = function (oEditor) {
		LayoutBase.superclass.constructor.call(this);

		this.CSS_CLASS_NAME = '';
		this.ANIMATIONS_SPEED = settings.editor.animation_speed;

		this.oEditor = oEditor;

	};
	uAdmin.inherit(LayoutBase, EntityBase);

	LayoutBase.prototype.init = function () {
		this.oEditor.jqMenuWrapper.addClass(this.CSS_CLASS_NAME);
		this.reposition();
	};

	LayoutBase.prototype.remove = function () {
		this.oEditor.jqMenuWrapper.removeClass(this.CSS_CLASS_NAME);
		this.resetPosition();
		this.oEditor.layout = null;
	};

	LayoutBase.prototype.reposition = function () {};

	LayoutBase.prototype.resetPosition = function () {
		var oMenuNode = this.oEditor.jqMenuWrapper[0];
		oMenuNode.style.top = '';
		oMenuNode.style.bottom = '';
		oMenuNode.style.left = '';
		oMenuNode.style.right = '';
	};

	LayoutBase.prototype.show = function () {
		var self = this;
		this.oEditor.jqMenuWrapper.stop(true, true).fadeIn(this.ANIMATIONS_SPEED, function(){
			self.oEditor.triggerEvent('onShow');
		});
	};

	LayoutBase.prototype.hide = function (callback) {
		var self = this;
		this.oEditor.jqMenuWrapper.add().stop(true, true).fadeOut(this.ANIMATIONS_SPEED, function(){
			if (typeof callback == 'function') {
				callback();
			}
			self.oEditor.triggerEvent('onHide');
		});
	};


	var LayoutExtended = function (oEditor) {
		LayoutExtended.superclass.constructor.call(this, oEditor);

		this.CSS_CLASS_NAME = settings.layout.extended.css_class;

		this.init();

	};
	uAdmin.inherit(LayoutExtended, LayoutBase);

	LayoutExtended.prototype.reposition = function () {
		this.oEditor.jqMenuWrapper.css({
			right: settings.layout.extended.right_margin,
			bottom: settings.layout.extended.bottom_margin
		});
	};


	var LayoutSimple = function (oEditor) {
		LayoutSimple.superclass.constructor.call(this, oEditor);

		this.CSS_CLASS_NAME = settings.layout.simple.css_class;

		this.init();

	};
	uAdmin.inherit(LayoutSimple, LayoutBase);

	LayoutSimple.prototype.reposition = function () {
		this.oEditor.jqMenuWrapper.css({
			right: settings.layout.simple.right_margin,
			bottom: settings.layout.simple.bottom_margin
		});
	};


	var LayoutBubble = function (oEditor) {
		LayoutBubble.superclass.constructor.call(this, oEditor);

		this.CSS_CLASS_NAME = settings.layout.bubble.css_class;
		this.BUBBLE_ARROW_CSS_CLASS = settings.layout.bubble.arrow_css_class;

		this.init();

	};
	uAdmin.inherit(LayoutBubble, LayoutBase);

	LayoutBubble.prototype.init = function () {
		LayoutBubble.superclass.init.call(this);
		this.oEditor.jqMenuWrapper.prepend("<div class='"+this.BUBBLE_ARROW_CSS_CLASS+"'/>");
	};

	LayoutBubble.prototype.remove = function () {
		this.oEditor.jqMenuWrapper.find("." + this.BUBBLE_ARROW_CSS_CLASS).remove();
		LayoutBubble.superclass.remove.call(this);
	};

	LayoutBubble.prototype.reposition = function () {
		var jqMeasurableNode = this.oEditor.jqMenuWrapper.clone().css('left', -10000).appendTo("body").show();
		var iLeft = (this.oEditor.jqImgWrapper.outerWidth() - jqMeasurableNode.outerWidth()) / 2;
		jqMeasurableNode.remove();
		this.oEditor.jqMenuWrapper.css({
			'left': iLeft + 'px',
			'bottom': settings.layout.bubble.bottom_margin - settings.layout.bubble.bottom_margin_delta + 'px'
		});
	};

	LayoutBubble.prototype.show = function () {
		var self = this;
		this.oEditor.jqMenuWrapper.stop(true, true).fadeIn(this.ANIMATIONS_SPEED).animate({'bottom': settings.layout.bubble.bottom_margin + 'px'}, this.ANIMATIONS_SPEED, function(){
			self.oEditor.triggerEvent('onShow');
		});
	};

	LayoutBubble.prototype.hide = function (callback) {
		var self = this;
		this.oEditor.jqMenuWrapper
			.stop(true, true)
			.animate({'bottom': settings.layout.bubble.bottom_margin - settings.layout.bubble.bottom_margin_delta + 'px'}, this.ANIMATIONS_SPEED)
			.fadeOut(this.ANIMATIONS_SPEED, function(){
				if (typeof callback == 'function') {
					callback();
				}
				self.oEditor.triggerEvent('onHide');
			});
	};


	/* ================================== EDITORS ================================= */

	var ImageEditorBase = function () {

		ImageEditorBase.superclass.constructor.call(this);

		this.MENU_WRAPPER_CLASS_NAME = settings.editor.menu_wrapper_css_class;
		this.IMG_WRAPPER_CLASS_NAME = settings.editor.img_wrapper_css_class;
		this.ANIMATIONS_SPEED = settings.editor.animation_speed;

		this.IMAGE_TYPE_UNKNOWN = 0;
		this.IMAGE_TYPE_EIP = 1;
		this.IMAGE_TYPE_WYSIWYG = 2;
		this.IMAGE_TYPE_PHOTOALBUM = 3;
		this.IMAGE_TYPE_SLIDER = 4;

		this._imageUrl = '';
		this.sEditorId = '';

		this.layout = ''; // must be redeclared in childrens
		this.jqImgNode = null;
		this.jqMenuWrapper = null;
		this.jqDeleteButton = null;
		this.jqCloseButton = null;
		this.jqImgWrapper = null;
		this.jqPreloader = null;

		this.iImageType = this.IMAGE_TYPE_UNKNOWN;
		this.bEditStateEnabled = false;

		this.arModulesSet = [];

		this.arDefaultModules = [
			UploadModule,
			FilemanagerModule,
			SliderModule,
			PopupModule
		];

		this.arActiveModules = [];

		this.oEnabledModule = null;

		this.oEventHandlers = {};

	};
	uAdmin.inherit(ImageEditorBase, EntityBase);

	ImageEditorBase.prototype.init = function (jqImgNode, sEditorId) {
		var self = this;

		if (!jqImgNode) {
			if (this.jqImgNode && this.jqImgNode.length) {
				jqImgNode = this.jqImgNode;
			} else {
				return false;
			}
		}

		if (!sEditorId && jqImgNode && jqImgNode.length) {
			sEditorId = jqImgNode.attr(ImageEditorsCollection.getInstance().EDITOR_ID_ATTRIBUTE);
		}

		this.sEditorId = sEditorId || jqImgNode.attr(ImageEditorsCollection.getInstance().EDITOR_ID_ATTRIBUTE);

		if (jqImgNode.parents(".mceEditor").length || jqImgNode.parents("[umi\\:field-type='wysiwyg']").length || jqImgNode.parents(".mce-content-body").length) {
			this.iImageType = this.IMAGE_TYPE_WYSIWYG;
		} else if (jqImgNode.parents("[umi\\:module='photoalbum']").length) {
			this.iImageType = this.IMAGE_TYPE_PHOTOALBUM;
		} else if (jqImgNode.is("[umi\\:field-name]")) {
			this.iImageType = this.IMAGE_TYPE_EIP;
		} else if (jqImgNode.is("[umi\\:slider-id]")) {
			this.iImageType = this.IMAGE_TYPE_SLIDER;
		}

		this.jqImgNode = jqImgNode;
		this.jqImgWrapper = jQuery("<div/>").addClass(this.IMG_WRAPPER_CLASS_NAME);
		this.hideTimer = null;
		this.jqImgWrapper
			.attr(ImageEditorsCollection.getInstance().EDITOR_ID_ATTRIBUTE, this.sEditorId)
			.on('click', function(oEvent){
				if (jQuery(oEvent.target).parents("." + self.MENU_WRAPPER_CLASS_NAME). length) return false;
				self.jqImgNode.trigger('click');
				return false;
			})
			.on('contextmenu', function(oEvent){
				if (!tinymce || !tinymce.activeEditor) return true;
				oEvent.preventDefault();
				oEvent.target = self.jqImgNode[0];
				oEvent.originalEvent.target = self.jqImgNode[0];
				oEvent.currentTarget = self.jqImgNode[0];
				oEvent.delegateTarget = self.jqImgNode[0];
				tinymce.activeEditor.selection.select(self.jqImgNode[0]);
				tinymce.activeEditor.dom.fire(self.jqImgNode[0], 'contextmenu', oEvent);
				return false;
			})
			.appendTo("body");
		this.applyImageSizes();
		this.drawMenu();
		this.switchOn();

		this.jqImgNode.on('mousemove mouseover mouseout mouseenter mouseleave', function(oEvent){
			oEvent.stopPropagation();
			oEvent.stopImmediatePropagation();
			oEvent.preventDefault();
			return false;
		});

		this.triggerEvent('onInit');

	};

	ImageEditorBase.prototype.reinit = function () {
		var sEditorIdAttribute = ImageEditorsCollection.getInstance().EDITOR_ID_ATTRIBUTE;
		this.jqImgNode = jQuery("img[" + sEditorIdAttribute + "='" + this.sEditorId + "']");
		this.jqImgWrapper = jQuery('.'+this.IMG_WRAPPER_CLASS_NAME).filter("[" + sEditorIdAttribute + "='" + this.sEditorId + "']").first();
		if (!this.jqImgWrapper.length) return;
		this.jqMenuWrapper = this.jqImgWrapper.find("."+this.MENU_WRAPPER_CLASS_NAME).first();
		if (!this.jqImgNode.length) return;
		this.applyImageSizes();
		this.layout.reposition();
		this.jqImgWrapper.offset(this.jqImgNode.offset());
	};

	ImageEditorBase.prototype.initLayout = function () {

		if (this.layout instanceof LayoutBase) {
			this.layout.remove();
		}

		var iImgWidth = this.jqImgNode.width(),
			iImgHeight = this.jqImgNode.height();

		if (iImgWidth >= settings.layout.big_img_min_width && iImgHeight >= settings.layout.big_img_min_height) {
			this.layout = new LayoutExtended(this);
		} else if (iImgWidth <= settings.layout.small_img_max_width || iImgHeight <= settings.layout.small_img_max_height) {
			this.layout = new LayoutBubble(this);
		} else {
			this.layout = new LayoutSimple(this);
		}
	};

	ImageEditorBase.prototype.drawMenu = function (arModules) {

		this.jqMenuWrapper = jQuery("<div/>").addClass(this.MENU_WRAPPER_CLASS_NAME);
		this.initLayout();

		this.drawModules(arModules);

		if (!this.isStub() || this.iImageType === this.IMAGE_TYPE_PHOTOALBUM) {
			this.drawDeleteButton();
		}

		this.reposition();

		this.jqMenuWrapper.appendTo(this.jqImgWrapper);

	};

	ImageEditorBase.prototype.applyImageBoxSizes = function (jqImageNode) {
		if (!jqImageNode || !jqImageNode.length) jqImageNode = this.jqImgNode;
		var self = this,
			getVal = function (sPropertyName) {
				return jqImageNode.css(sPropertyName);
			};

		this.jqImgWrapper.css({
			width: getVal('width'),
			height: getVal('height'),
			paddingTop: getVal('paddingTop'),
			paddingRight: getVal('paddingRight'),
			paddingBottom: getVal('paddingBottom'),
			paddingLeft: getVal('paddingLeft'),
			borderTop: getVal('borderTop'),
			borderRight: getVal('borderRight'),
			borderBottom: getVal('borderBottom'),
			borderLeft: getVal('borderLeft'),
			marginTop: getVal('marginTop'),
			marginRight: getVal('marginRight'),
			marginBottom: getVal('marginBottom'),
			marginLeft: getVal('marginLeft')
		});
	};

	ImageEditorBase.prototype.applyImageSizes = function (jqImageNode) {
		if (!jqImageNode || !jqImageNode.length) jqImageNode = this.jqImgNode;

		this.applyImageBoxSizes(jqImageNode);
		this.jqImgWrapper.offset(jqImageNode.offset());
	};

	ImageEditorBase.prototype.lockImageSize = function () {
		this.jqImgNode.css({
			maxWidth: this.jqImgNode.parent().width(),
			maxHeight: this.jqImgNode.parent().height()
		});
	};

	ImageEditorBase.prototype.redrawMenu = function (arModules) {
		for (var i in this.arActiveModules) {
			var oModule = this.arActiveModules[i];
			if (oModule instanceof ModuleBase) {
				oModule.remove();
			}
		}
		this.jqMenuWrapper.children().remove();
		this.removeCloseButton();
		this.drawModules(arModules);
		this.initLayout();
	};

	ImageEditorBase.prototype.drawModules = function (arModules) {
		if (this.isPopupThumb()) {
			arModules = [PopupModule];
		}
		this.resetModules();
		if (!arModules) {
			this.setDefaultModules();
		} else {
			for (var i in arModules) {
				this.addModule(arModules[i]);
			}
		}

		var bIsStub = this.isStub();
		this.arActiveModules = [];
		for (var i in this.arModulesSet) {
			if (!this.arModulesSet.hasOwnProperty(i)) continue;
			// disable some modules on IE
			if (jQuery.browser.msie && (this.arModulesSet[i] == UploadModule)) continue;
			// end disable
			var module = new this.arModulesSet[i](this);
			this.arActiveModules.push(module);
			this.jqMenuWrapper.append(module.getView(true));
		}

	};

	ImageEditorBase.prototype.drawDeleteButton = function (bShow) {
		if (this.iImageType == this.IMAGE_TYPE_SLIDER) {
			return false;
		}

		if (this.jqDeleteButton && this.jqDeleteButton.length) {
			this.jqDeleteButton.remove();
		}

		var module = DeleteModule,
			self = this;

		if (!this.checkModule(module)) {
			return false;
		}
		module = new module(this);
		this.jqDeleteButton = module.getView(true);
		this.jqDeleteButton.addClass(this.layout.CSS_CLASS_NAME);
		this.jqImgWrapper.append(this.jqDeleteButton);

		if (bShow) {
			this.jqDeleteButton.show();
		}
		return true;

	};

	ImageEditorBase.prototype.removeDeleteButton = function () {
		if (this.iImageType == this.IMAGE_TYPE_SLIDER) {
			return false;
		}

		this.jqDeleteButton && this.jqDeleteButton.length && this.jqDeleteButton.remove() && (this.jqDeleteButton = null);
	};

	ImageEditorBase.prototype.addCloseButton = function (closeCallback) {
		if (this.jqCloseButton && this.jqCloseButton.length) return;
		this.jqCloseButton = jQuery("<span/>").html("&times;");
		this.jqCloseButton
			.css({
				position: 'absolute',
				top: 0,
				right: 0,
				cursor: 'pointer',
				color: 'white',
				fontSize: '15px',
				lineHeight: '10px',
				fontWeight: 'bold',
				padding: '3px'
			})
			.on("click", function(oEvent){
				if (typeof closeCallback == 'function') {
					closeCallback(oEvent);
				}
			})
			.appendTo(this.jqMenuWrapper);
	};

	ImageEditorBase.prototype.removeCloseButton = function () {
		this.jqCloseButton && this.jqCloseButton.length && this.jqCloseButton.remove() && (this.jqCloseButton = null);
	};

	ImageEditorBase.prototype.showPreloader = function () {
		this.jqPreloader && this.jqPreloader.length && this.hidePreloader();
		this.jqPreloader = jQuery('<div/>')
			.addClass(settings.preloader_holder_css_class)
			.append("<img src='" + settings.preloader_src + "'>")
			.appendTo(this.jqImgWrapper);

		if (!this.jqImgWrapper.data('incrementedZIndex')) {
			this.jqImgWrapper.data('incrementedZIndex', true);
			this.jqImgWrapper.css('zIndex', parseInt(this.jqImgWrapper.css('zIndex')) * 10 || 999999);
		}

		this.switchOff();
	};

	ImageEditorBase.prototype.hidePreloader = function () {
		this.jqPreloader && this.jqPreloader.length && this.jqPreloader.remove() && (this.jqPreloader = null);

		if (this.jqImgWrapper.data('incrementedZIndex')) {
			this.jqImgWrapper.removeData();
			this.jqImgWrapper.css('zIndex', Math.floor(parseInt(this.jqImgWrapper.css('zIndex')) / 10) || 99999);
		}
	};

	ImageEditorBase.prototype.reposition = function () {
		this.layout.reposition();
	};

	ImageEditorBase.prototype.destroy = function (bIgnoreImageNode) {
		this.reinit();
		this.jqImgWrapper.remove();
		this.jqImgNode.off('mousemove mouseover mouseout mouseenter mouseleave');
		if (!bIgnoreImageNode) {
			this.jqImgNode.removeAttr(ImageEditorsCollection.getInstance().EDITOR_ID_ATTRIBUTE);
		}

		this.triggerEvent('onDestroy');
	};

	ImageEditorBase.prototype.show = function () {
		this.jqDeleteButton && this.jqDeleteButton.length && this.jqDeleteButton.show();
		this.layout.show();
	};

	ImageEditorBase.prototype.hide = function (callback) {
		this.jqDeleteButton && this.jqDeleteButton.length && this.jqDeleteButton.hide();
		this.layout.hide(callback);
	};

	/**
	 * @param skipDestroyOnMouseLeave bool - флаг для пропуска удаления обертки редактора картинки при событии 'mouseleave'
	 */
	ImageEditorBase.prototype.switchOn = function (skipDestroyOnMouseLeave) {
		var self = this;
		this.jqImgWrapper
			.css('zIndex', parseInt(this.jqImgWrapper.css('zIndex')) || 99999)
			.on('mouseenter', function() {
				// Don't hide menu on reenter
				if (self.hideTimer) {
					clearTimeout(self.hideTimer);
					self.hideTimer = null;
				}

				self.show();
				if (self.jqDeleteButton && self.jqDeleteButton.length) {
					self.jqDeleteButton.stop(true, true).show(self.ANIMATIONS_SPEED);
				}
			})
			.on('mouseleave', function() {
				// Schedule menu hide
				self.hideTimer = window.setTimeout(function() {
					self.hideTimer = null;
					if (self.jqDeleteButton && self.jqDeleteButton.length) {
						self.jqDeleteButton.stop(true, true).hide(self.ANIMATIONS_SPEED);
					}
					self.hide(function(){
						if (skipDestroyOnMouseLeave === true) {
							return;
						}
						self.destroy(true);
					});
				}, 200);
			});
	};

	ImageEditorBase.prototype.switchOff = function (bHide) {
		this.jqImgWrapper.off("mouseenter mouseleave");
		if (bHide) {
			this.hide();
			this.jqDeleteButton.hide();
		}
	};

	ImageEditorBase.prototype.checkModule = function (Module) {
		var enabledInBrowser = false;
		for (var i in settings.browser_modules) {
			if (!settings.browser_modules.hasOwnProperty(i) || !jQuery.browser[i]) continue;
			for (var m = 0; m < settings.browser_modules[i].length; m++) {
				if (settings.browser_modules[i][m] === Module) {
					enabledInBrowser = true;
					break;
				}
			}
		}
		return typeof Module === 'function' && !!Module.isImageEditorModule && enabledInBrowser;
	};

	ImageEditorBase.prototype.addModule = function (Module) {
		if (this.checkModule(Module)) {
			this.arModulesSet.push(Module);
			this.triggerEvent('onAddModule', [Module]);
		}
	};

	ImageEditorBase.prototype.resetModules = function () {
		this.arModulesSet = [];
	};

	ImageEditorBase.prototype.setDefaultModules = function () {
		this.resetModules();
		for (var i in this.arDefaultModules) {
			this.addModule(this.arDefaultModules[i]);
		}
	};

	ImageEditorBase.prototype.isThumb = function () {
		return (!!this.jqImgNode.attr('src').match(/\/thumbs\//gi) || !!this.jqImgNode.attr('src').match(/\/autothumbs\//gi));
	};

	ImageEditorBase.prototype.isPopupThumb = function() {
		if (typeof PopupModule == 'undefined') {
			return false;
		}
		return !!this.jqImgNode.parents('.' + PopupModule.WRAPPER_CSS_CLASS).length;
	};

	ImageEditorBase.prototype.isStub = function () {
		var bAttrCondition = this.jqImgNode.attr("umi:is-stub") === "true",
			stubImageMSIELow8Condition = uAdmin.eip.getMSIEStubImgCondition(),
			bImgCondition = stubImageMSIELow8Condition && this.jqImgNode[0] &&
				this.jqImgNode[0].complete && !this.jqImgNode[0].naturalWidth &&
				!this.jqImgNode[0].naturalHeight;
		return bAttrCondition || bImgCondition;
	};

	ImageEditorBase.prototype.getImageUrl = function () {
		if (!this._imageUrl) {
			if (this.iImageType === this.IMAGE_TYPE_WYSIWYG) {
				this._imageUrl = this.jqImgNode.attr('src');
			} else {
				var oImgElementInfo = uAdmin.eip.searchAttr(this.jqImgNode);
				var reqResult = jQuery.ajax({
					async: false,
					url: '/udata/content/getImageUrl/'+oImgElementInfo.id+"/"+oImgElementInfo.field_name+"/.json",
					type: 'GET'
				});
				var data = JSON.parse(reqResult.responseText);
				this._imageUrl = data.result;
			}
		}
		return this._imageUrl;
	};

	ImageEditorBase.prototype.getCurrentImageUrl = function () {
		return this.isThumb() ? this.getImageUrl() : this.jqImgNode.attr('src');
	};

	ImageEditorBase.prototype.getEipInfo = function (oNode) {
		oNode = oNode || this.jqImgNode[0];
		return uAdmin.eip.searchAttr(oNode);
	};

	ImageEditorBase.prototype.getEipNode = function () {
		var oInfo = this.getEipInfo();
		if (!oInfo || !oInfo.node) {
			return null;
		}
		return oInfo.node;
	};

	ImageEditorBase.prototype.getEditorId = function () {
		return this.sEditorId;
	};

	ImageEditorBase.prototype.checkImageIsEmpty = function () {
		return this.jqImgNode.attr('src') == this.jqImgNode.attr('umi:empty');
	};

	ImageEditorBase.prototype.setEnabledModule = function (oModule) {
		if (!oModule || !oModule.deactivate) {
			return false;
		}
		this.oEnabledModule = oModule;
		ImageEditorsCollection.getInstance().setActiveEditor(this);
		return true;
	};

	ImageEditorBase.prototype.getEnabledModule = function () {
		return this.oEnabledModule;
	};

	ImageEditorBase.prototype.deactivateEnabledModule = function (bExecuteRollback) {
		if (!this.oEnabledModule || !this.oEnabledModule.deactivate) {
			this.oEnabledModule = null;
			return true;
		}
		if (!bExecuteRollback) {
			this.oEnabledModule = null;
			return true;
		}
		this.oEnabledModule.cancel();
		if (this.oEnabledModule.deactivate()) {
			this.oEnabledModule = null;
			return true;
		}
		return false;
	};

	ImageEditorBase.prototype.cleanupHtml = function (sHtml) {
		return sHtml.replace(/\sdata-ieditor-id=["']{1}[0-9\._]+["']{1}/gi, '');
	};

	ImageEditorBase.prototype.isImageInFocus = function () {
		var iTop = this.jqImgNode.offset().top,
			iBottom = this.jqImgNode.offset().top + this.jqImgNode.height(),
			iLeft = this.jqImgNode.offset().left,
			iRight = this.jqImgNode.offset().left + this.jqImgNode.width();
		return window.mouseX > iLeft && window.mouseX < iRight && window.mouseY >iTop && window.mouseY < iBottom;
	};

	ImageEditorBase.prototype.getQueueValue = function (newImageSrc) {
		if (this.iImageType === this.IMAGE_TYPE_WYSIWYG) {
			var node = this.getEipNode();
			return node ? node.innerHTML : undefined;
		}

		return (typeof newImageSrc !== 'undefined') ? newImageSrc : this.jqImgNode.attr('src');
	};

	var ImageEditor = function () {

		ImageEditor.superclass.constructor.call(this);

	};
	uAdmin.inherit(ImageEditor, ImageEditorBase);

	var ImageEditorVoid = function () {};
	ImageEditorVoid.prototype.show = function () {};
	ImageEditorVoid.prototype.hide = function () {};
	ImageEditorVoid.prototype.reposition = function () {};
	ImageEditorVoid.prototype.initLayout = function () {};
	ImageEditorVoid.prototype.init = function () {};
	ImageEditorVoid.prototype.reinit = function () {};
	ImageEditorVoid.prototype.destroy = function () {};
	ImageEditorVoid.prototype.switchOn = function () {};
	ImageEditorVoid.prototype.switchOff = function () {};


	/* ================================== MODULES ================================= */

	var ModuleBase = function () {

		ModuleBase.superclass.constructor.call(this);

		this.MODULE_CSS_CLASS = settings.module.module_css_class;
		this.MODULE_ICON_HOLDER_CSS_CLASS = settings.module.icon_holder_css_class;
		this.MODULE_TITLE_HOLDER_CSS_CLASS = settings.module.title_holder_css_class;
		this.BACKEND_REQUEST_URL = settings.backend_request_url;
		this.BACKEND_REQUEST_METHOD = settings.backend_request_method;

		this.title = ""; // Must be rediclared in childrens
		this.cssClass = "";
		this.jqElement = null;

		this.oEditor = null;

	};
	uAdmin.inherit(ModuleBase, EntityBase);

	ModuleBase.prototype.init = function (oEditor) {

		this.oEditor = oEditor;
		this.jqElement = jQuery("<div/>");
		this.jqElement.addClass(this.cssClass);
		this.jqElement.addClass(this.MODULE_CSS_CLASS);
		this.jqElement.append(jQuery("<span/>"));
		jQuery("<span/>").addClass(this.MODULE_TITLE_HOLDER_CSS_CLASS).appendTo(this.jqElement);
		this.setIcon(this.MODULE_ICON_HOLDER_CSS_CLASS);
		this.setTitle(this.title);
		this.bindEvents();

		this.triggerEvent('onInit');

	};

	ModuleBase.prototype.setIcon = function (sIconCssClassName) {
		var jqIconNode = this.jqElement.find("span").first();
		jqIconNode.get(0).className = '';
		jqIconNode.addClass(sIconCssClassName);
	};

	ModuleBase.prototype.setTitle = function (sNewTitle) {
		if (!sNewTitle) sNewTitle = this.title;
		this.title = sNewTitle;
		this.jqElement.find("span").first().attr('title', sNewTitle);
		this.jqElement.find("span").last().text(sNewTitle);
	};

	ModuleBase.prototype.bindEvents = function () {

		var self = this;
		this.jqElement.on("click", function(event){
			event.stopPropagation();
			event.stopImmediatePropagation();
			event.preventDefault();
			self.activate();
			return false;
		});

	};

	ModuleBase.prototype.getView = function (returnJqueryObject) {

		if (returnJqueryObject === true) {
			return this.jqElement;
		}
		return this.jqElement[0].outerHTML;

	};

	ModuleBase.prototype.activate = function () {
		var self = this;

		ImageEditorsCollection.getInstance().deactivateActiveEditor();
		this.oEditor.setEnabledModule(this);
		this.triggerEvent('onActivate');
	};

	ModuleBase.prototype.deactivate = function () {
		this.triggerEvent('onDeactivate');
		return true;
	};

	ModuleBase.prototype.save = function () {
		this.triggerEvent('onSave');
	};

	ModuleBase.prototype.cancel = function () {
		this.triggerEvent('onCancel');
	};

	ModuleBase.prototype.remove = function () {
		this.jqElement.remove();
		this.triggerEvent('onRemove');
	};

	ModuleBase.prototype.process = function (sAction, oParams) {
		if (!sAction) {
			return {
				"result": false,
				"error": getLabel("js-ieditor-invalid-action")
			}
		}
		this.oEditor.showPreloader();
		if (!oParams) oParams = {};
		oParams['image_url'] = this.oEditor.jqImgNode.attr('src');
		oParams['empty_url'] = this.oEditor.jqImgNode.attr('umi:empty');
		oParams['action'] = sAction;
		var oEipNodeInfo = uAdmin.eip.searchAttr(this.oEditor.jqImgNode[0]);
		if (oEipNodeInfo) {
			oParams['element_id'] = oEipNodeInfo['id'];
			oParams['field_name'] = oEipNodeInfo['field_name'];
		}
		var reqResult = jQuery.ajax({
			async: false,
			url: this.BACKEND_REQUEST_URL + sAction + "/.json",
			type: this.BACKEND_REQUEST_METHOD,
			data: oParams
		});
		var oResult = JSON.parse(reqResult.responseText);
		this.processResult(oResult);
		return oResult;
	};

	ModuleBase.prototype.processResult = function (oResult) {
		if (!oResult) {
			uAdmin.eip.message(getLabel('js-ieditor-request-failed'));
			this.oEditor.hidePreloader();
		} else if (oResult.error && typeof oResult.error == 'string') {
			uAdmin.eip.message(oResult.error);
			this.oEditor.hidePreloader();
		} else if (oResult.error && oResult.error.message) {
			uAdmin.eip.message(oResult.error.message);
			this.oEditor.hidePreloader();
		} else if (oResult.result && oResult.result.length) {
			this.setNewImage(oResult.result);
		} else {
			uAdmin.eip.message(getLabel('js-ieditor-request-failed'));
			this.oEditor.hidePreloader();
		}
	};

	ModuleBase.prototype.addToEipQueue = function (sNewValue, sOldValue, oEipNode) {
		var oEipInfo = this.oEditor.getEipInfo(oEipNode);
		if (!oEipInfo || !oEipInfo.node) {
			return false;
		}
		if (this.oEditor.iImageType == this.oEditor.IMAGE_TYPE_WYSIWYG) {
			oEipInfo['old_value'] = sOldValue || oEipInfo.node.innerHTML;
			oEipInfo['new_value'] = sNewValue || oEipInfo.node.innerHTML.replace(this.oEditor.jqImgNode.attr('src'), sNewValue);
			oEipInfo['field_type'] = 'wysiwyg';
		} else {
			oEipInfo['old_value'] = {src: sOldValue || this.oEditor.getCurrentImageUrl()};
			oEipInfo['new_value'] = {src: sNewValue};
			oEipInfo['field_type'] = 'img_file';
		}
		uAdmin.eip.queue.add(oEipInfo);
		return true;
	};

	ModuleBase.prototype.getWysiwygContent = function (oWysiwygNode) {
		oWysiwygNode = oWysiwygNode || this.oEditor.getEipNode();
		if (!oWysiwygNode || !oWysiwygNode) return null;
		if (tinymce && tinymce.activeEditor) {
			return tinymce.activeEditor.getContent();
		} else {
			return oWysiwygNode.innerHTML;
		}
	};

	ModuleBase.prototype.setNewImage = function (sNewImageSrc, resetCache) {
		var self = this,
			sNewImageSrcNoCache = (sNewImageSrc || '');

		if (resetCache !== false) {
			this.oEditor.showPreloader();
			sNewImageSrcNoCache += "?" + new Date().getTime();
		}

		if (this.oEditor.iImageType == this.oEditor.IMAGE_TYPE_WYSIWYG) {
			if (PopupModule && PopupModule.changeImage) {
				PopupModule.changeImage(this.oEditor, !sNewImageSrc);
			}
			if (!sNewImageSrc) {
				this.oEditor.jqImgNode.remove();
				this.oEditor.jqImgWrapper.remove();
			} else {
				this.oEditor.jqImgNode.attr('src', sNewImageSrcNoCache);
				if (this.oEditor.jqImgNode.attr('data-mce-src')) {
					this.oEditor.jqImgNode.attr('data-mce-src', sNewImageSrcNoCache);
				}
			}
		} else {
			this.oEditor.jqImgNode.attr({
				'src': sNewImageSrcNoCache,
				'umi:is-stub': false
			});
		}
		this.oEditor.jqImgNode.on("load", function(){
			self.oEditor.hidePreloader();
			if (self.oEditor.jqImgNode) {
				self.oEditor.jqImgNode.removeAttr('width').removeAttr('height').css({width: '', height: ''});
			}
			self.oEditor.reinit();
			window.setTimeout(function(){
				uAdmin.eip.normalizeBoxes();
			}, 0);
		});
		this.oEditor.triggerEvent('onImageChange', {
			target: this,
			sNewSrc: sNewImageSrc,
			sNewSrcNoCache: sNewImageSrcNoCache
		});
	};

	ModuleBase.prototype.getImageFromFilemanager = function (fCallback) {
		if (typeof fCallback != 'function') return false;

		$element = this.oEditor.jqImgNode;
		let pageId = $element.attr('umi:element-id');
		let objectId = $element.attr('umi:object-id');
		let fieldName = $element.attr('umi:field-name');
		let folderHash = $element.attr('umi:folder-hash');
		let fileHash = $element.attr('umi:file-hash');

		let filesRequest = [];
		filesRequest.push('pageId=' + (pageId ? pageId : ''));
		filesRequest.push('objectId=' + (objectId ? objectId : ''));
		filesRequest.push('fieldName=' + (fieldName ? fieldName : ''));
		filesRequest.push('folder_hash=' + (folderHash ? folderHash : ''));
		filesRequest.push('file_hash=' + (fileHash ? fileHash : ''));

		jQuery.openPopupLayer({
			name   : "Filemanager",
			title  : getLabel('js-file-manager'),
			width  : settings.filemanager.window_width,
			height : settings.filemanager.window_height,
			url    : settings.filemanager.url + '&' + filesRequest.join("&"),
			afterClose : function (arFiles) {
				if (arFiles) {
					fCallback(arFiles);
				}
			},
			success : function () {
				var footer = '<div id="watermark_wrapper"><label for="add_watermark">';
				footer += window.parent.getLabel('js-water-mark');
				footer += '</label><input type="checkbox" name="add_watermark" id="add_watermark"/>';
				footer += '<label for="remember_last_folder">';
				footer += window.parent.getLabel('js-remember-last-dir');
				footer += '</label><input type="checkbox" name="remember_last_folder" id="remember_last_folder"'
				if (jQuery.cookie('remember_last_folder')) {
					footer += 'checked="checked"';
				}
				footer +='/></div>';
				window.parent.jQuery('#popupLayer_Filemanager .popupBody').append(footer);
			}
		});
		return true;
	};


	function UploadModule (oEditor) {

		UploadModule.superclass.constructor.call(this);

		this.UPLOAD_URL = settings.module.upload_module.url;
		this.IFRAME_NAME = settings.module.upload_module.iframe_name;
		this.FILE_INPUT_NAME = settings.module.upload_module.file_input_name;

		this.title = getLabel("js-ieditor-module-upload-title");

		if (oEditor.iImageType == oEditor.IMAGE_TYPE_SLIDER){
			this.cssClass = 'eip-ieditor-empty';
		} else {
			this.cssClass = settings.module.upload_module.css_class;
		}

		this.jqFileInput = null;
		this.jqForm = null;
		this.jqIframe = null;

		this.init(oEditor);

	};
	uAdmin.inherit(UploadModule, ModuleBase);

	UploadModule.isImageEditorModule = true;

	UploadModule.prototype.init = function (oEditor) {

		var self = this;

		UploadModule.superclass.init.call(this, oEditor);

		this.jqElement.css({
			overflow: 'hidden',
			position: 'relative'
		});

		this.jqFileInput = jQuery("<input/>")
			.attr({
				type: 'file',
				name: this.FILE_INPUT_NAME,
				title: this.title
			})
			.css({
				opacity: 0,
				cursor: 'pointer'
			})
			.on("click", function(e){
				e.stopPropagation();
				e.stopImmediatePropagation();
				self.activate();
			});

		this.jqForm = jQuery("<form/>")
			.attr({
				method: 'post',
				action: this.UPLOAD_URL,
				target: this.IFRAME_NAME,
				enctype: 'multipart/form-data'
			})
			.css({
				padding: 0,
				margin: 0,
				border: 'none',
				position: 'absolute',
				top: 0,
				right: 0
			})
			.appendTo(this.jqElement)
			.append(this.jqFileInput);

		this.jqForm.append('<input type="hidden" name="action" value="upload">');

	};

	UploadModule.prototype.activate = function () {
		UploadModule.superclass.activate.call(this);

		this.oEditor.switchOff();

		var self = this;

		jQuery('iframe[name=' + this.IFRAME_NAME + ']').remove();

		this.jqIframe = jQuery("<iframe/>")
			.attr({
				name: this.IFRAME_NAME
			})
			.css({
				display: 'none'
			})
			.appendTo("body")
			.on("load", function(){
				if (!self.bImageChanged) return;
				self.oEditor.hidePreloader();
				self.oEditor.switchOn();
				var sImgPath = jQuery(this).contents().find("body").text();
				if (!sImgPath) {
					uAdmin.eip.message(getLabel('js-ieditor-request-failed'));
				} else {
					var sOldValue = self.oEditor.getQueueValue();
					self.setNewImage(sImgPath);
					self.addToEipQueue(self.oEditor.getQueueValue(sImgPath), sOldValue);
				}
				self.cleanup();
			});

		this.jqFileInput.on("change", function(){
			self.oEditor.showPreloader();
			self.bImageChanged = true;
			self.jqForm.trigger("submit");
		});

		window.setTimeout(function(){
			self.oEditor.switchOn(true);
			if (jQuery.browser.webkit) {
				self.oEditor.hide();
			}
		}, 1000);

	};

	UploadModule.prototype.cleanup = function () {
		this.oEditor.switchOff();
		this.oEditor.switchOn();
		this.jqIframe.remove();
	};

	function SliderModule (oEditor) {

		SliderModule.superclass.constructor.call(this);

		this.title = getLabel('js-ieditor-module-slider-title');

		if (uAdmin.eip.isEditedImageTypeSlider(oEditor)){
			this.cssClass = 'eip-ieditor-module-slider';
		} else {
			this.cssClass = 'eip-ieditor-empty';
		}

		this.init(oEditor);
	};

	uAdmin.inherit(SliderModule, ModuleBase);

	SliderModule.isImageEditorModule = true;

	SliderModule.prototype.activate = function () {
		SliderModule.superclass.activate.call(this);

		$.openPopupLayer({
			'name':'SliderEditor',
			'title':getLabel('js-ieditor-module-slider-popup-title'),
			'url': uAdmin.eip.getSliderEditPopupLayerUrl(this.oEditor),
			'width':710,
			'height': 700,
			'success': function(){
				$('#popupLayer_SliderEditor .popupBody').css({'padding':'0'});
				$('#popupLayer_SliderEditor iframe.umiPopupFrame').css({'width':'100%'});
			}
		});
	};

	function FilemanagerModule (oEditor) {

		FilemanagerModule.superclass.constructor.call(this);

		this.title = getLabel('js-ieditor-module-filemanager-title');

		if (oEditor.iImageType == oEditor.IMAGE_TYPE_SLIDER){
			this.cssClass = 'eip-ieditor-empty';
		} else {
			this.cssClass = settings.module.filemanager_module.css_class;
		}

		this.init(oEditor);

	};
	uAdmin.inherit(FilemanagerModule, ModuleBase);

	FilemanagerModule.isImageEditorModule = true;

	FilemanagerModule.prototype.activate = function () {
		FilemanagerModule.superclass.activate.call(this);

		this.oEditor.switchOff();
		let self = this;
		this.getImageFromFilemanager(function (arFiles) {
			let sOldValue = self.oEditor.getQueueValue();
			if (arFiles[0]) {
				let imageUrl;

				try {
					imageUrl = decodeURI(arFiles[0].url);
				} catch (e) {
					imageUrl = arFiles[0].url;
				}

				self.setNewImage(imageUrl);
				self.addToEipQueue(self.oEditor.getQueueValue(imageUrl), sOldValue);
			}
		});
		window.setTimeout(function(){
			self.oEditor.switchOn();
			if (jQuery.browser.webkit) {
				self.oEditor.hide();
			}
		}, 500);

	};

	function PopupModule(oEditor) {

		PopupModule.superclass.constructor.call(this);

		this.title = getLabel('js-ieditor-module-popup-title');

		if (oEditor.iImageType == oEditor.IMAGE_TYPE_WYSIWYG) {
			this.cssClass = settings.module.popup_module.css_class;
		} else {
			this.cssClass = 'eip-ieditor-empty';
		}

		this.jqWrapper = null;
		this.bEnabled = false;

		this.init(oEditor);

	};
	uAdmin.inherit(PopupModule, ModuleBase);

	PopupModule.isImageEditorModule = true;

	PopupModule.FANCYBOX_CSS_CLASS = settings.module.popup_module.fancybox_css_class;
	PopupModule.WRAPPER_CSS_CLASS = settings.module.popup_module.wrapper_css_class;
	PopupModule.THUMB_WIDTH = settings.module.popup_module.thumb_width;

	PopupModule.prototype.init = function(oEditor) {
		PopupModule.superclass.init.call(this, oEditor);

		this.jqWrapper = this.oEditor.jqImgNode.parents('.' + PopupModule.WRAPPER_CSS_CLASS);

		if (!this.jqWrapper.length) {
			this.bEnabled = false;
			this.setTitle(getLabel('js-ieditor-module-popup-title'));
			this.jqWrapper = jQuery('<a/>')
				.addClass(PopupModule.FANCYBOX_CSS_CLASS)
				.addClass(PopupModule.WRAPPER_CSS_CLASS)
				.attr('href', this.oEditor.jqImgNode.attr('src'));
		} else {
			this.bEnabled = true;
			this.setTitle(getLabel('js-ieditor-module-popup-title-active'));
		}

	};

	PopupModule.prototype.activate = function() {
		PopupModule.superclass.activate.call(this);

		if (this.bEnabled) {
			this.turnOff();
		} else {
			this.turnOn();
		}

		this.oEditor.reinit();
		this.oEditor.initLayout();

		uAdmin.ieditor.disable();
		uAdmin.ieditor.enable();

	};

	PopupModule.prototype.turnOn = function() {
		var oNode = this.oEditor.getEipNode(),
			sOldValue = '',
			sNewValue = '';
		if (oNode) {
			sOldValue = this.oEditor.cleanupHtml(oNode.innerHTML);
		}
		var flAspectRatio = this.oEditor.jqImgNode.width() / this.oEditor.jqImgNode.height();
		this.oEditor.jqImgNode
			.width(PopupModule.THUMB_WIDTH)
			.height(Math.round(PopupModule.THUMB_WIDTH / flAspectRatio))
			.attr({
				width: PopupModule.THUMB_WIDTH,
				height: Math.round(PopupModule.THUMB_WIDTH / flAspectRatio)
			})
			.wrap(this.jqWrapper)
			.removeAttr('data-mce-style');

		if (oNode) {
			sNewValue = this.oEditor.cleanupHtml(oNode.innerHTML);
		}
		if (tinymce && tinymce.activeEditor) {
			tinymce.activeEditor.on('remove', function() {
				window.setTimeout(fancybox_init, 100);
			});
		}
		uAdmin.eip.bind('Disable', function(type) {
			if (type == 'after') {
				window.setTimeout(fancybox_init, 500);
			}
		});
		this.addToEipQueue(sNewValue, sOldValue);
		uAdmin.eip.message(getLabel('js-ieditor-module-popup-title-msg'));
		uAdmin.eip.normalizeBoxes();
		this.bEnabled = true;
	};

	PopupModule.prototype.turnOff = function() {
		var oNode = this.oEditor.getEipNode(),
			sOldValue = '',
			sNewValue = '';
		if (oNode) {
			sOldValue = this.oEditor.cleanupHtml(oNode.innerHTML);
		}
		this.jqWrapper = this.oEditor.jqImgNode.parents('.' + PopupModule.WRAPPER_CSS_CLASS);
		this.oEditor.jqImgNode.insertAfter(this.jqWrapper);
		this.jqWrapper.remove();
		this.oEditor.jqImgNode[0].style.width = '';
		this.oEditor.jqImgNode[0].style.height = '';
		this.oEditor.jqImgNode.removeAttr('data-mce-style width height');
		if (oNode) {
			sNewValue = this.oEditor.cleanupHtml(oNode.innerHTML);
		}
		this.addToEipQueue(sNewValue, sOldValue);
		uAdmin.eip.message(getLabel('js-ieditor-module-popup-title-active-msg'));
		uAdmin.eip.normalizeBoxes();
		this.bEnabled = false;
	};

	PopupModule.changeImage = function(oEditor, isRemove) {
		if (oEditor instanceof ImageEditorBase === false) {
			return;
		}
		var oPopupModule = new PopupModule(oEditor);
		oPopupModule.init(oEditor);
		if (oPopupModule.bEnabled) {
			if (isRemove) {
				oPopupModule.jqWrapper.remove();
			} else {
				oPopupModule.turnOff();
				oPopupModule.turnOn();
			}
		}
		oPopupModule = null;
	};

	function DeleteModule (oEditor) {

		DeleteModule.superclass.constructor.call(this);

		this.title = getLabel("js-ieditor-module-delete-title");
		this.cssClass = settings.module.delete_module.css_class;

		this.init(oEditor);

	};
	uAdmin.inherit(DeleteModule, ModuleBase);

	DeleteModule.isImageEditorModule = true;

	DeleteModule.prototype.init = function (oEditor) {
		DeleteModule.superclass.init.call(this, oEditor);
		this.jqElement.find("." + this.MODULE_ICON_HOLDER_CSS_CLASS).append( '<img src="/styles/skins/_eip/images/del_button.svg" alt="×">' );
	};

	DeleteModule.prototype.activate = function () {
		DeleteModule.superclass.activate.call(this);

		var info = {};
		switch (this.oEditor.iImageType) {

			case this.oEditor.IMAGE_TYPE_EIP:
			case this.oEditor.IMAGE_TYPE_PHOTOALBUM:
				var sNewSrc = this.oEditor.jqImgNode.attr("umi:empty"),
					sOldSrc = this.oEditor.jqImgNode.attr('src');
				this.setNewImage(sNewSrc, false);
				this.oEditor.jqImgNode.attr("umi:is-stub", true);
				this.oEditor.redrawMenu();
				this.addToEipQueue(sNewSrc, sOldSrc);
				break;

			case this.oEditor.IMAGE_TYPE_WYSIWYG:
				var oEipNode = this.oEditor.getEipNode(),
					sOldValue = this.getWysiwygContent(oEipNode),
					sNewValue = '';
				this.setNewImage('');
				sNewValue = this.getWysiwygContent(oEipNode);
				this.addToEipQueue(sNewValue, sOldValue, oEipNode);
				break;

		}
		ImageEditorsCollection.getInstance().removeEmptyEditors();
		uAdmin.eip.normalizeBoxes();
		this.triggerEvent('onActivate');
	};


	function ApplyModule (oEditor) {
		CancelModule.superclass.constructor.call(this);

		this.title = getLabel("js-ieditor-module-apply-title");
		this.cssClass = settings.module.apply_module.css_class;
		this.oActiveModule = oEditor.getEnabledModule();

		this.init(oEditor);

	};
	uAdmin.inherit(ApplyModule, ModuleBase);
	ApplyModule.isImageEditorModule = true;

	ApplyModule.prototype.activate = function () {
		if (this.oActiveModule instanceof ModuleBase) {
			this.oActiveModule.save();
			this.oEditor.reinit();
		}
	};


	function CancelModule (oEditor) {
		CancelModule.superclass.constructor.call(this);

		this.title = getLabel("js-ieditor-module-cancel-title");
		this.cssClass = settings.module.cancel_module.css_class;
		this.oActiveModule = oEditor.getEnabledModule();

		this.init(oEditor);

	};
	uAdmin.inherit(CancelModule, ModuleBase);
	CancelModule.isImageEditorModule = true;

	CancelModule.prototype.activate = function () {
		if (this.oActiveModule instanceof ModuleBase) {
			this.oActiveModule.cancel();
		}
	};


	return extend(uImageEditor, this);

});

uAdmin('.editor', function (extend) {
	function uEditor() {}

	uEditor.prototype.get = function(node, files) {
		var info = uAdmin.eip.searchAttr(node);

		if (info) {
			this.info = info;
			this.files = files;
			return this.load();
		}
		return false;
	};

	/** Получить текущее значение поля */
	uEditor.prototype.load = function () {
		var self = this, data, params, i, group, field,
			revision = uAdmin.eip.queue.search(self.info);

		if (revision) {
			if (revision.add) {
				if (self.info.field_name == 'name') {
					self.info.field_type = 'string';
				}
				else if (jQuery(self.info.node).attr('umi:field-type')) {
					self.info.field_type = jQuery(self.info.node).attr('umi:field-type');
				}
				else {
					data = jQuery.ajax({
						url : '/utype/' + revision.type_id + '.json',
						async : false,
						dataType : 'json'
					});
					data = JSON.parse(data.responseText);

					for (group in data.type.fieldgroups.group) {
						group = data.type.fieldgroups.group[group];
						for (field in group.field) {
							field = group.field[field];
							if (field.name == self.info.field_name) {
								self.info.field_type = field.type['data-type'];
								break;
							}
						}
						if (self.info.field_type) break;
					}
				}
				self.info.old_value = jQuery(self.info.node).attr('umi:empty');
				return self.draw(self.info.field_type);
			};

			self.info.old_value  = revision.new_value;
			self.info.field_type = revision.field_type;
			self.info.params     = revision.params;
			self.info.node       = revision.node;
			if (self.info.field_type == 'relation') {
				self.info.guide_id  = revision.guide_id;
				self.info.multiple  = revision.multiple;
				self.info['public'] = revision['public'];
			}
			return self.draw(revision.field_type);
		}

		var jqNode = jQuery(self.info.node),
			attrFieldType = jqNode.attr('umi:field-type');
		if (attrFieldType && attrFieldType != 'relation' && attrFieldType != 'symlink') {
			self.info.field_type = attrFieldType;
			if (self.info.node.tagName == 'IMG') {
				self.info.old_value = {src: jqNode.attr('src')};
			} else {
				self.info.old_value = (jqNode.attr('umi:empty') && jqNode.attr('umi:empty') == jqNode.html()) ? '' : jqNode.html();
			}
			return self.draw(self.info.field_type);
		}

		params = {};

		var elementId = jQuery(self.info.node).attr("umi:"+self.info.type+"-id");
		if (!elementId || elementId.match(/^new/)) {
			elementId =
				jQuery(self.info.node).attr('umi:clone-source-id') ||
				jQuery(self.info.node).parents("[umi\\:"+self.info.type+"-id]").first().attr("umi:clone-source-id") ||
				self.info.id;
		}

		params[self.info.type + '-id'] = elementId;
		params['field-name'] = self.info.field_name;
		params.qt = new Date().getTime();

		jQuery.ajax({
			async : false,
			type : 'POST',
			url : '/admin/content/editValue/load.json',
			dataType : 'json',
			data : params
		}).done(function(response) {
			data = response;
		});

		if (data.error) {
			uAdmin.eip.message(data.error);
			return false;
		}

		if (data.user && data.user.type == 'guest') {
			uAdmin.eip.message(getLabel('error-auth-required'));
			uAdmin.eip.closeMessages();
			uAdmin.session.sessionCloseMessage(true);
			return false;
		}

		self.info.old_value = {};

		if (data.property.type) {
			jqNode.attr('umi:field-type', data.property.type);
		}
		switch(data.property.type) {
			case 'relation':
				for(i in data.property.item) {
					self.info.old_value[data.property.item[i].id] = data.property.item[i].name;
				}
				self.info.guide_id  = data.property['guide-id'];
				self.info.multiple  = (data.property.multiple == 'multiple');
				self.info['public'] = (data.property['public'] == 'public');
				break;
			case 'symlink':
				for (i in data.property.page) {
					self.info.old_value[data.property.page[i].id] = {
						name: data.property.page[i].name,
						type: {
							module: data.property.page[i].basetype.module,
							method: data.property.page[i].basetype.method
						}
					};
				}
				break;
			default:
				self.info.old_value = data.property.value;
		}

		if (jQuery(self.info.node).attr('umi:clone-source-id') || jQuery(self.info.node).parents('[umi\\:clone-source-id]').length) {
			var filesTypes = ['img_file', 'swf_file', 'file', 'video_file'],
				simpleTypes = ['string', 'text', 'wysiwyg', 'int', 'date', 'boolean', 'password', 'float', 'formula', 'price', 'counter'];
			
			if (filesTypes.indexOf(data.property.type) !== -1) {
				self.info.old_value = {src: ''};
			} else if (simpleTypes.indexOf(data.property.type) !== -1){
				self.info.old_value = '';
			} else {
				self.info.old_value = [];
			}
		}

		self.info.field_type = data.property.type;

		return self.draw(data.property.type);
	};

	uEditor.prototype.bindFinishEvent = function () {
		var self = this, target, parents, parentsAndSelf,
			parentNode, $parentNode, $parentNodeParents, i;
		jQuery(document).on('click', function (e) {
			target = jQuery(e.target);
			parents = target.parents();
			parentsAndSelf = uAdmin.eip.addPrevOnStack(parents);

			if (!uAdmin.eip.enabled) {
				return;
			}

			if (target.attr('contentEditable') === 'true') {
				return;
			}
			if (jQuery.inArray(target.attr('class'),
				[
					'eip-ui-element',
					'ui-datepicker',
					'symlink-item-delete'
				]) >= 0
			) {
				return;
			}

			if (parentsAndSelf.hasClass('eip_win') ||
				parentsAndSelf.hasClass('eip-ieditor-img-wrapper') ||
				parentsAndSelf.hasClass('eip-ieditor-imgareaselect-wrapper')) {
				return true;
			}

			if (parentsAndSelf.filter('#mce-modal-block').length ||
				parentsAndSelf.filter('#popupLayerScreenLocker').length ||
				parentsAndSelf.filter('#jGrowl').length) {
				return true;
			}

			if (target.parents('.eip-ui-element, .ui-datepicker, .ui-datepicker-title,' +
				' .ui-datepicker-header, .ui-datepicker-calendar').length) {
				return;
			}

			if (uAdmin.eip.isBindFinishEventCustomReturn(target)) {
				return true;
			}

			for (i = 0; i < parents.length; i++) {
				parentNode = parents[i];
				$parentNode = jQuery(parentNode);
				$parentNodeParents = uAdmin.eip.addPrevOnStack($parentNode.parents());

				if (parentNode.tagName === 'TABLE') {
					continue;
				}
				if (parentNode.tagName === 'BODY') {
					break;
				}

				if ($parentNode.attr('class') === 'symlink-item-delete') {
					return;
				}
				if ($parentNode.attr('contentEditable') === 'true') {
					return;
				}

				if ($parentNode.hasClass("mceMenu") ||
					$parentNode.hasClass('mceEditor')) {
					return true;
				}

				if ($parentNodeParents.hasClass('mceColorSplitMenu') ||
					$parentNodeParents.hasClass('mceMenuItem') ||
					$parentNodeParents.hasClass('mce-panel') ||
					$parentNodeParents.hasClass('eip-ieditor-imgareaselect-wrapper')) {
					return true;
				}
			}

			self.finish(true);
		});
	};

	uEditor.prototype.draw = function(type) {
		var self = this;

		if (typeof self.draw[type] == 'function') {
			return self.draw[type](self);
		}
		uAdmin.eip.message('Unknown field type "' + type + '"');
		return false;
	};

	uEditor.prototype.draw['boolean'] = function(self) {

		uEditor.prototype.YES_TEXT = getLabel('js-cms-eip-editor-yes');
		uEditor.prototype.NO_TEXT = getLabel('js-cms-eip-editor-no');

		var position = uAdmin.eip.nodePositionInfo(self.info.node);
		if (typeof self.info.old_value != 'boolean') {
			var oldValue = self.info.old_value;
			oldValue = (typeof oldValue == 'string') ? oldValue.trim() : oldValue;
			switch (oldValue) {
				case uEditor.prototype.NO_TEXT:
				case "0":
					self.info.old_value = false;
					break;
				case uEditor.prototype.YES_TEXT:
				case "1":
					self.info.old_value = true;
					break;
				default:
					self.info.old_value = !!self.info.old_value;
					break;
			};
		};

		if (self.info.node.tagName == 'INPUT' && self.info.node.type == 'checkbox') {
			setTimeout(function () {
				self.info.new_value = !self.info.old_value;
				self.info.node.checked = self.info.new_value;
				self.commit();
				self.cleanup();
			}, 300);
			return self;
		}

		var checkboxNode = document.createElement('input');
		checkboxNode.type = 'checkbox';
		document.body.appendChild(checkboxNode);

		jQuery(window).on("resize.ns"+self.info.guide_id, function() {
			var position = uAdmin.eip.nodePositionInfo(self.info.node);

			jQuery(checkboxNode).css({
				'left'     : position.x,
				'top'      : position.y
			});
		});

		self.finish = function (apply) {
			if (apply) {
				self.info.new_value = checkboxNode.checked;
				jQuery(self.info.node).text(self.info.new_value ? uEditor.prototype.YES_TEXT : uEditor.prototype.NO_TEXT);
				self.commit();
			}

			jQuery(checkboxNode).remove();
			jQuery(window).off("resize.ns"+self.info.guide_id);
			self.info.node.style.visibility = 'visible';
			self.cleanup();
		};

		checkboxNode.checked = !!self.info.old_value;
		jQuery(checkboxNode).attr('class', 'eip-ui-element eip-ui-boolean');
		jQuery(checkboxNode).css({
			'position' : 'absolute',
			'left'     : position.x,
			'top'      : position.y,
			'z-index'  : 1100
		});
		uAdmin.eip.applyStyles(self.info.node, checkboxNode);
		self.info.node.style.visibility = 'hidden';

		jQuery(checkboxNode).on('click', function () {
			self.finish(true);
		});
		return self;
	};

	uEditor.prototype.draw['int'] = function(self) {
		return self.draw.text(self);
	};

	uEditor.prototype.draw['float'] = function(self) {
		return self.draw.text(self);
	};

	uEditor.prototype.draw.counter = function(self) {
		return self.draw.text(self);
	};

	uEditor.prototype.draw.price = function(self) {
		return self.draw.text(self);
	};

	uEditor.prototype.draw.string = function(self) {
		return self.draw.text(self);
	};

	uEditor.prototype.draw.tags = function(self) {
		return self.draw.text(self);
	};

	/**
	 * Отрисовывает элементы для редактирования полей типа "Цвет"
	 * @param {uEditor} self
	 */
	uEditor.prototype.draw.color = function(self) {
		var $parentNode = jQuery(self.info.node);
		$parentNode.html('');
		$parentNode.addClass('u-eip-editing');

		var $input = jQuery('<input type="text" class="color_value">').appendTo($parentNode);
		var oldValue = self.info.old_value;

		$input.val(oldValue);

		if (typeof colorControl == 'undefined') {
			jQuery('<script src="/styles/common/js/color.control.js" type="text/javascript" charset="utf-8"></script>').appendTo('head');
		}

		var color = new colorControl($parentNode);

		jQuery(document).on('mousedown.color', function() {
			jQuery(document).off('mousedown.color');

			var isChild = $parentNode.find(event.target).length > 0;
			var isSelf = event.target == $parentNode.get(0);
			var $picker = jQuery('color-picker');
			var isPickerChild = $picker.find(event.target).length > 0;
			var isPicker = event.target == $picker.get(0);

			if (!isChild && !isSelf && !isPickerChild && !isPicker) {
				finish();
			}

		});

		$parentNode.on('hidePicker', function() {
			finish()
		});

		function finish() {
			var newValue = $input.val();
			self.info.new_value = newValue;
			$parentNode.html(newValue);

			self.commit();
			$parentNode.addClass('u-eip-edit-box');

			$parentNode.removeClass('u-eip-editing');
			$parentNode.data('colorpicker', null);

			jQuery('.u-eip-add-button').css('display', 'flex');
			uAdmin.eip.normalizeBoxes();
		}

		return self;
	};

	uEditor.prototype.draw.text = function(self, allowHTMLTags) {
		var node = jQuery(self.info.node), source = node.html();
		if (!self.info.old_value) self.info.old_value = "";
		if (allowHTMLTags && self.info.old_value !== '') self.info.old_value = self.info.old_value.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
		if (!(self.info.field_type == 'wysiwyg' && uAdmin.wysiwyg.settings.inline)) {
			node[0].innerHTML = self.info.old_value || '&nbsp;';
			node.attr('contentEditable', true);
		}
		node.trigger("blur").trigger("focus");

		self.finish = function (apply) {
			self.finish = function () {};
			jQuery(document).off('keyup');
			jQuery(document).off('click');

			node.attr('contentEditable', false);
			jQuery('.u-eip-sortable').sortable('enable');

			if (apply) {
				if (!allowHTMLTags && self.info.field_type != 'wysiwyg') {
					var html = node.html();
					if (html.match(/\s<br>$/g)) html = html.replace(/<br>$/g, '');
					var originalHtml = html;
					html = html.replace(/<!--[\w\W\n]*?-->/mig, '');
					html = html.replace(/<style[^>]*>[\w\W\n]*?<\/style>/mig, '');
					html = html.replace(/<([^>]+)>/mg, '');
					html = html.replace(/(\t|\n)/gi, " ");
					html = html.replace(/[\s]{2,}/gi, " ");
					if (jQuery.browser.safari) {
						html = html.replace(/\bVersion:\d+\.\d+\s+StartHTML:\d+\s+EndHTML:\d+\s+StartFragment:\d+\s+EndFragment:\d+\s*\b/gi, "");
					}
					if (html != originalHtml) node.html(html);
				}
				self.info.new_value = node.html();

				if (self.info.new_value == ' ' || self.info.new_value == '&nbsp;' || self.info.new_value == '<p>&nbsp;</p>') {
					self.info.new_value = '';
					node.html(self.info.new_value);
				}

				if (self.info.field_type != 'wysiwyg' && self.info.field_type != 'text') {
					self.info.new_value = self.info.new_value.trim();
					if (self.info.new_value.substr(-4, 4) == '<br>') {
						self.info.new_value = self.info.new_value.substr(0, self.info.new_value.length -4);
					}
				}
				else {
					self.info.new_value = self.info.new_value.replace(/%[A-z0-9_]+(?:%20)+[A-z0-9_]+%28[A-z0-9%]*%29%/gi, unescape);
				}

				switch(self.info.field_type) {
					case "int":
					case "float":
					case "price":
					case "counter":
						self.info.new_value = parseFloat(self.info.new_value);
						break;
				}

				self.commit();
			}
			else node.html(source);
			self.cleanup();
		};

		self.bindFinishEvent();

		var prevWidth = node.width(),
			prevHeight = node.height(),
			timeoutId = null;

		jQuery('.u-eip-sortable').sortable('disable');
		node.trigger("focus");

		var prevLength = null;

		jQuery(document).on('keyup', function (e) {
			if (prevWidth != node.width() || prevHeight != node.height()) {
				prevWidth = node.width();
				prevHeight = node.height();

				if (timeoutId) clearTimeout(timeoutId);
				timeoutId = setTimeout(function () {
					uAdmin.eip.normalizeBoxes();
					timeoutId = null;
				}, 1000);
			}

			if (e.keyCode == 46) {
				if (prevLength == node.html().length) {
					if (prevLength == 1) {
						node.html('');
					}
				}
			}
		}).on('keydown', function (e) {
			if (e.keyCode == 46) {
				prevLength = node.html().length;
			}

			//Enter key - save content
			if (e.keyCode == 13 && self.info.field_type != 'wysiwyg' && self.info.field_type != 'text') {
				self.finish(true);
				return false;
			}

			//Esc key - cancel and revert original value
			if (e.keyCode == 27) {
				self.finish(false);
				return false;
			}

			return true;
		});
		return self;
	};

	uEditor.prototype.draw.wysiwyg = function(self) {
		var node = jQuery(self.info.node),
			ctrl = false, shift = false, vkey = false, ins = false,
			cleanupHTML = function (html) {
				html = html.replace(/<![\s\S]*?--[ \t\n\r]*>/ig, ' ');
				html = html.replace(/<!--.*?-->/ig, ' ');

				if (jQuery.browser.mozilla) {
					html = html.replace(/<\/?(style|font|title).*[^>]*>/ig, "");
				}

				html = html.replace(/<\/?(title|style|font|meta)\s*[^>]*>/ig, '');
				html = html.replace(/\s*mso-[^:]+:[^;""]+;?/ig, '');
				html = html.replace(/<\/?o:[^>]*\/?>/ig, '');
				html = html.replace(/ style=['"]?[^'"]*['"]?/ig, '');
				html = html.replace(/ class=['"]?[^'">]*['"]?/ig, '');
				html = html.replace(/<span\s*[^>]*>\s*&nbsp;\s*<\/span>/ig, " ");
				html = html.replace(/<span\s*[^>]*>/ig, '');
				html = html.replace(/<\/span\s*[^>]*>/ig, '');
				// Glue
				html = html.replace(/<\/(b|i|s|u|strong|center)>[\t\n]*<\1[^>]*>/gi, "");
				html = html.replace(/<\/(b|i|s|u|strong|center)>\s*<\1[^>]*>/gi, " ");
				// Cut epmty
				html = html.replace(/<(b|i|s|u|strong|center)[^>]*>[\s\t\n\xC2\xA0]*<\/\1>/gi, "");
				// Cut trash symbols
				html = html.replace(/(\t|\n)/gi, " ");
				html = html.replace(/[\s]{2,}/gi, " ");

				if (jQuery.browser.safari) {
					html = html.replace(/\bVersion:\d+\.\d+\s+StartHTML:\d+\s+EndHTML:\d+\s+StartFragment:\d+\s+EndFragment:\d+\s*\b/gi, "");
				}

				return html;
			};

		self.draw.text(self, true);

		jQuery(document).on('keyup', function (e) {
			if ((e.keyCode == 86 || ctrl) || (e.keyCode == 45 && shift)) {
				if (!(tinymce && tinymce.settings && tinymce.settings.inline) &&
					uAdmin.eip.isCleanupHtmlOnWysiwygCtrlShift()) {
					var html = cleanupHTML(node.html());
					if (html != node.html()) {
						node.html(html);
					}
				}
				if (ctrl && !e.ctrlKey) ctrl = false;
				if (shift && !e.shiftKey) shift = false;
			}
			switch(e.keyCode) {
				case 16: if (!ins) shift = false; break;
				case 17: if (!vkey) ctrl = false; break;
				case 45: ins  = false; break;
				case 86: vkey = false; break;
			}
		}).on('keydown', function(e) {
			switch(e.keyCode) {
				case 16: shift = true; break;
				case 17: ctrl  = true; break;
				case 45: ins   = true; break;
				case 86: vkey  = true; break;
			}
		});

		var wysiwyg = uAdmin.wysiwyg.init(self.info.node);

		var finish = self.finish;
		self.finish = function (apply) {
			if (wysiwyg) {
				wysiwyg.destroy();
			}
			finish(apply);
			uAdmin.eip.bindEvents();
		};
		return self;
	};

	uEditor.prototype.draw.file = function(self, image) {
		var folder = './images/cms/data/',
			fileName = '', file, data, params;

		self.finish = function (apply) {
			if (apply) {
				if (self.info.node.tagName == 'IMG') {
					self.info.node.src = self.info.new_value.src;
				} else if (image) {
					self.info.node.style.backgroundImage = 'url(' + self.info.new_value.src + ')';
				} else {
					self.info.node.innerText = self.info.new_value.src.substr(self.info.new_value.src.lastIndexOf('/') + 1);
				}
				self.commit();
				if (uAdmin && uAdmin.eip && uAdmin.eip.reinitEmptyLists) {
					uAdmin.eip.reinitEmptyLists();
				}
			}
			self.cleanup();
		};

		if (self.info.old_value) {
			if (self.info.old_value.src == undefined) {
				self.info.old_value = {
					src: self.info.old_value
				}
			}
			fileName = self.info.old_value.src.split(/\//g).pop();
			folder = '.' + self.info.old_value.src.substr(0, self.info.old_value.src.length - fileName.length - 1);
		}

		if (self.files && self.files.length) {
			file = self.files[0];

			file.folder = folder;
			if (self.info.old_value) {
				file.file = self.info.old_value.src;
			}
			if (image) {
				file.image = 1;
			}

			data = jQuery.ajax({
				url: "/admin/filemanager/uploadfile/&csrf=" + uAdmin.csrf,
				async : false,
				data : file,
				type : 'POST',
				dataType : 'json'
			});

			data = JSON.parse(data.responseText);

			if (data.file.path) {
				self.new_value = data.file.path;
				self.finish(true);
			}
			else self.finish();
		}
		else {
			params = {
				folder : folder,
				file   : self.info.old_value ? self.info.old_value.src : ''
			};
			data = jQuery.ajax({
				url: "/admin/filemanager/get_filemanager_info/",
				async : false,
				data : params,
				type : 'POST',
				dataType : 'json'
			});
			data = JSON.parse(data.responseText);

			var qs = 'folder=' + folder;
			if (self.info.old_value) qs += '&file=' + self.info.old_value.src;
			if (image) qs += '&image=1';

			var fm = {
				flash :  {
					height : 460,
					url    : "/styles/common/other/filebrowser/umifilebrowser.html?" + qs
				},
				elfinder : {
					height : 600,
					url    : "/styles/common/other/elfinder/umifilebrowser.html?" + qs + '&lang=' + data.lang + '&file_hash=' + data.file_hash + '&folder_hash=' + data.folder_hash
				}
			};

			jQuery.openPopupLayer({
				name   : "Filemanager",
				title  : getLabel('js-file-manager'),
				width  : 1200,
				height : fm[data.filemanager].height,
				url    : fm[data.filemanager].url,
				afterClose : function (value) {
					if (value) {
						if (typeof value == 'object') value = value[0];
						self.info.new_value = value ? {src:value.toString()} : '';
						self.finish(true);
					}
					else self.finish();
				}
			});

			if (data.filemanager == 'elfinder') {
				var footer = '<div id="watermark_wrapper"><label for="add_watermark">';
				footer += getLabel('js-water-mark');
				footer += '</label><input type="checkbox" name="add_watermark" id="add_watermark"/>';
				footer += '<label for="remember_last_folder">';
				footer += getLabel('js-remember-last-dir');
				footer += '</label><input type="checkbox" name="remember_last_folder" id="remember_last_folder"'
				if (jQuery.cookie('remember_last_folder')) {
					footer += 'checked="checked"';
				}
				footer +='/></div>';

				jQuery('#popupLayer_Filemanager .popupBody').append(footer);
			}
		}
		return self;
	};

	uEditor.prototype.draw.img_file = function(self) {
		return self.draw.file(self, true);
	};

	uEditor.prototype.draw.video_file = function(self) {
		return self.draw.file(self);
	};

	uEditor.prototype.draw.date = function(self) {
		var date;

		if (self.info.old_value != jQuery(self.info.node).attr('umi:empty')) {
			date = self.info.old_value;
		}

		date = moment(date, ['DD-MM-YYYY hh:mm', 'DD-MM-YYYY', 'YYYY-MM-DD hh:mm', 'YYYY-MM-DD']);
		if (!date.isValid()) {
			date = moment();
		}
		self.info.old_value = date.format('DD-MM-YYYY');

		self.draw.text(self);

		var position = uAdmin.eip.nodePositionInfo(self.info.node);
		var node = jQuery('#u-datepicker-input');
		if (!node.length) {
			node = document.createElement('input');
			node.id = 'u-datepicker-input';
			document.body.appendChild(node);
		}

		jQuery(window).on("resize.ns" + self.info.guide_id, function() {
			var position = uAdmin.eip.nodePositionInfo(self.info.node);
			jQuery('.ui-datepicker-trigger').css({
				'left':	position.x + position.width + 5,
				'top':	position.y
			});
			jQuery(node).css({
				'left':	(position.x + position.width + 5),
				'top':	position.y
			});
		});

		self.finish = function (apply) {
			jQuery(window).off("resize.ns" + self.info.guide_id);
			jQuery(node).datepicker('destroy');
			jQuery('.ui-datepicker-trigger').remove();
			if (!self.info.new_value) {
				self.info.new_value = jQuery(self.info.node).html();
			}
			self.cleanup();
			self.commit();
		};

		jQuery(node).css({
			'position':		'absolute',
			'left':			(position.x + position.width + 5),
			'top':			(position.y),
			'width':		'1',
			'height':		'1',
			'visibility':	'hidden',
			'font-size':	'62.5%',
			'z-index':		555
		});

		jQuery(node).datepicker(jQuery.extend({}, jQuery.datepicker.regional[uAdmin.data.lang], {
			showOn: 'button',
			buttonImage: '/styles/common/other/calendar/icons_calendar_eip.png',
			buttonImageOnly: true,
			dateFormat: 'dd-mm-yy',
			defaultDate:	date.toDate(),
			onSelect: function (dateText) {
				self.info.new_value = dateText;
				jQuery(self.info.node).html(dateText);
				jQuery(self.info.node).trigger("focus");
			}
		}));

		jQuery(self.info.node).html(self.info.old_value);

		uAdmin.eip.placeWith(self.info.node, jQuery('.ui-datepicker-trigger'), 'right', 'middle');
		if (!self.info.id) {
			self.info.old_value = '';
		}

		jQuery('.ui-datepicker-trigger').css({
			'left': (position.x + position.width + 5),
			'top': (position.y)
		});

		return self;
	};

	uEditor.prototype.draw.relation = function(self) {
		jQuery(document).one('mouseup', function () {
			setTimeout(function () {
				self.bindFinishEvent();
			}, 100);
		});
		setTimeout(function () {
			jQuery(document).off('mouseup');
			self.bindFinishEvent();
		}, 1000);

		var position = uAdmin.eip.nodePositionInfo(self.info.node);
		var selectBox = document.createElement('select');
		var searchBox = document.createElement('input');
		document.body.appendChild(selectBox);

		if (self.info.guide_id && self.info['public']) {
			var relationButton = document.createElement('input');
			relationButton.type = 'button';
			relationButton.value = ' ';
			relationButton.id = 'relationButton' + self.info.guide_id;
			relationButton.className = 'relationAddButton';
			document.body.appendChild(relationButton);
		}

		jQuery(selectBox).attr('class', 'eip-ui-element');
		jQuery(selectBox).css({
			'position':		'absolute',
			'left':			position.x,
			'top':			position.y,
			'z-index':		1100
		});

		uAdmin.eip.applyStyles(self.info.node, selectBox,
			uAdmin.eip.isRelationDrawApplyDimentions());
		jQuery(self.info.node).css('visibility', 'hidden');

		if (self.info.multiple) {
			jQuery(selectBox).attr('multiple', 'multiple');
			jQuery(selectBox).attr('size', 3);
		}

		for (var i in self.info.old_value) {
			var option = document.createElement('option');
			jQuery(option).attr('value', i);
			jQuery(option).attr('selected', 'selected');
			jQuery(option).html(self.info.old_value[i]);
			selectBox.appendChild(option);
		}

		jQuery(selectBox).trigger("focus");
		jQuery(selectBox).attr('name', 'rel_input');
		jQuery(selectBox).attr('id', 'relationSelect' + self.info.guide_id);

		document.body.appendChild(searchBox);

		uAdmin.eip.applyStyles(self.info.node, searchBox);
		jQuery(searchBox).attr({
			'id'    : 'relationInput' + self.info.guide_id,
			'class' : 'eip-ui-element',
			'name'  : 'rel_input_new'
		});

		if (typeof relationControl == 'undefined') {
			jQuery('<script src="/styles/common/js/relation.control.js" type="text/javascript" charset="utf-8"></script>').appendTo('head');
		}

		var control = new relationControl(self.info.guide_id, null, true, '/admin/data/guide_items_all/');

		jQuery(window).on("resize.ns"+self.info.guide_id, function() {
			var position = uAdmin.eip.nodePositionInfo(self.info.node);
			jQuery(selectBox).css({
				'left':			position.x,
				'top':			position.y
			});
			jQuery(searchBox).css({
				'left'     : position.x,
				'top'      : (position.y + jQuery(selectBox).height()+5)
			});
			jQuery(relationButton).css({
				'left'     : (position.x + jQuery(searchBox).width() + 5),
				'top'      : (position.y + jQuery(selectBox).height() + Math.round((jQuery(searchBox).height() - jQuery(relationButton).height()) / 2))
			});
		});

		self.finish = function () {
			var value = [];
			self.info.new_value = control.getValue();
			self.commit();

			for (var i in self.info.new_value) {
				value.push(self.info.new_value[i]);
			}
			self.info.node.innerHTML = value.join(', ');
			self.info.node.style.visibility = 'visible';

			jQuery(selectBox).resizable();

			try {
				jQuery(selectBox).resizable('destroy');
			} catch (e) {
				jQuery(selectBox).resizable({disabled: true});
			}

			jQuery(selectBox).remove();
			jQuery(searchBox).remove();
			jQuery(relationButton).remove();
			jQuery('#u-ep-search-trigger').remove();
			jQuery(window).off("resize.ns"+self.info.guide_id);

			self.cleanup();
		};

		control.loadItemsAll();

		if (self.info.multiple) {
			var minHeight = jQuery(selectBox).height(), maxHeight = 350;
			if (minHeight < 150) {
				minHeight = 75;
				jQuery(selectBox).css('height', minHeight);
			}

			jQuery(selectBox).resizable({
				'minWidth' : jQuery(selectBox).width(),
				'maxWidth' : jQuery(selectBox).width(),
				'minHeight': minHeight,
				'maxHeight': maxHeight
			});

			jQuery('.ui-wrapper').css('z-index', '1100');
		}
		var $selectWidth = jQuery(selectBox).width(),
			$searchWidth = jQuery(searchBox).width(),
			fieldWidth = uAdmin.eip.getRelationSearchFieldWidth(selectBox);

		if (fieldWidth) {
			$searchWidth = $selectWidth = fieldWidth;
		}

		jQuery(searchBox).css({
			'position' : 'absolute',
			'width'    : $selectWidth,
			'left'     : position.x,
			'top'      : (position.y + jQuery(selectBox).height()+5),
			'z-index'  : 1111
		});
		jQuery(relationButton).css({
			'position' : 'absolute',
			'left'     : (position.x + $searchWidth + 5),
			'top'      : (position.y + jQuery(selectBox).height() + Math.round((jQuery(searchBox).height() - jQuery(relationButton).height()) / 2)),
			'z-index'  : 1112
		});
		return self;
	};

	uEditor.prototype.draw.symlink = function(self) {
		jQuery(document).one('mouseup', function () {
			setTimeout(function () {
				self.bindFinishEvent();
			}, 100);
		});
		setTimeout(function () {
			jQuery(document).off('mouseup');
			self.bindFinishEvent();
		}, 1000);

		var h_type = jQuery(self.info.node).attr('umi:type') ? jQuery(self.info.node).attr('umi:type').split('::') : [];
		var position = uAdmin.eip.nodePositionInfo(self.info.node);
		var searchBox = jQuery('<div><div id="symlinkInput' + self.info.id + '" /></div>').attr({
			"class":'eip-ui-element'
		}).css({
			'position':'absolute',
			'left': position.x,
			'top': position.y,
			'z-index':1100
		}).appendTo('body');
		
		// Setting width for symlink div
		var defaultWidth = 150,
			originElementWidth = jQuery(self.info.node).outerWidth(),
			symLinkWidth = (originElementWidth > defaultWidth ? originElementWidth : defaultWidth);
		jQuery("#symlinkInput" + self.info.id).width(symLinkWidth);

		if (typeof symlinkControl == 'undefined') {
			jQuery('<script src="/styles/common/js/symlink.control.js" type="text/javascript" charset="utf-8"></script>').appendTo('head');
		}

		var control = new symlinkControl(self.info.id, (h_type[0] || null), h_type, {
			inputName      : self.info.field_name + '[]',
			fadeColorStart : [255, 255, 225],
			fadeColorEnd   : [255, 255, 255]
		});
		
		if (jQuery.isEmptyObject(self.info.old_value)) {
			control.addPlaceHolder();
		}

		for (var i in self.info.old_value) {
			if (h_type.length === 0) {
				h_type = [self.info.old_value[i].type.module, self.info.old_value[i].type.method];
			}
			control.addItem(i, self.info.old_value[i].name, h_type, '');
		}

		jQuery(self.info.node).css('visibility', 'hidden');

		jQuery(window).on("resize.ns"+self.info.guide_id, function() {
			var position = uAdmin.eip.nodePositionInfo(self.info.node);

			jQuery(searchBox).css({
				'left'     : position.x,
				'top'      : position.y
			});
		});

		self.finish = function () {
			var inputs = jQuery('input[name="' + self.info.field_name + '[]"]'), value = [];
			jQuery(self.info.node).css('visibility', 'visible');

			self.info.new_value = {};
			for (i = 0; i < inputs.length; i++) {
				if (inputs[i].value) {
					var spanNode = jQuery('ul li span', searchBox)[i - 1],
							type = jQuery(spanNode).data('basetype').split(" ");

					self.info.new_value[inputs[i].value] = {
						name: jQuery('ul li span', searchBox)[i - 1].innerHTML,
						type: {
							module: type[0],
							method: type[1]
						}
					};
					value.push(self.info.new_value[inputs[i].value].name);
				}
			}
			self.info.node.innerHTML = value.join(', ');;
			self.commit();

			searchBox.resizable();

			try {
				searchBox.resizable('destroy');
			} catch (e) {
				searchBox.resizable({disabled: true});
			}

			searchBox.remove();
			jQuery('div.symlinkAutosuggest').remove();
			jQuery('#u-ep-search-trigger').remove();
			jQuery(window).off("resize.ns"+self.info.guide_id);

			self.cleanup();
		};

		control.loadItems();
		return self;
	};

	uEditor.prototype.replace = function (info, new_value, old_value) {
		return info ? this.replace[info.field_type](info, new_value, old_value) : false;
	};

	uEditor.prototype.replace.img_file = function(info, new_value, old_value) {
		var isModified = false, node = jQuery(info.node), childs, subNode, i;

		var compare = function (left, right) {
			return left == right;
		};

		var checkIsThumb = function (src) {
			if(src.indexOf('/images/cms/thumbs/') >= 0) return true;
			if(src.indexOf('autothumbs.php') >= 0) return true;
			return false;
		};

		var makeNewThumb = function (src, width, height) {
			src = src.toString();
			var tempArr = src.split(/\./g);
			if(tempArr.length < 2) return false;

			var ext = tempArr[tempArr.length - 1].toString();
			tempArr = tempArr[tempArr.length - 2].toString().split(/\//g);

			var filename = tempArr[tempArr.length - 1].toString();
			var dirname = src.substr(0, src.length - filename.length - ext.length - 1);

			return '/autothumbs.php?img=' + dirname + filename + '_' + width + '_' + height + '.' + ext;
		};

		//If image tag
		if (info.node.tagName == 'IMG') {
			//If image set by src
			if (compare(node.attr('src'), old_value.src || '')) {
				info.node.src = new_value.src || '';
				isModified = true;
			}
			else if(checkIsThumb(info.node.src)) {
				var width = node.width();
				var height = node.height();
				var tSrc = info.node.src;
				if(tSrc.indexOf(width) != -1 && tSrc.indexOf(height) == -1) height = 'auto';
				if(tSrc.indexOf(width) == -1 && tSrc.indexOf(height) != -1) width = 'auto';

				info.node.src = makeNewThumb(new_value.src, width, height);
				isModified = true;
			}

			node.one('load', function () {
				uAdmin.eip.normalizeBoxes();
			});
		}

		//If image set by css background
		var bg_image = info.node.style.backgroundImage.replace(/"/g, '');
		if (bg_image.substr(0, 4) != 'url(') {
			if (!isModified && node.attr('childNodes')) {
				childs = node.attr('childNodes');

				for(i = 0; i < childs.length; i++) {
					subNode = childs.item(i);
					if (subNode && jQuery(subNode).attr('tagName')) {
						replaceImage(jQuery(subNode), new_value.src, old_value.src);
					}
				}
			}
			return isModified;
		}

		bg_image = bg_image.substring(4, bg_image.length - 1);
		var httpHost = window.location.protocol + '//' + window.location.host;
		if (bg_image.substr(0, httpHost.length) == httpHost) {
			bg_image = bg_image.substr(httpHost.length);
		}
		if (!bg_image) return isModified;

		if (compare(bg_image, old_value.src)) {
			info.node.style.backgroundImage = 'url(' + new_value.src + ')';
			isModified = true;
		}

		if (!isModified && node.attr('childNodes')) {
			childs = node.attr('childNodes');
			for(i = 0; i < childs.length; i++) {
				subNode = childs.item(i);
				if (subNode && jQuery(subNode).attr('tagName')) {
					replaceImage(jQuery(subNode), new_value.src, old_value.src);
				}
			}
		}
		return isModified;
	};

	uEditor.prototype.replace.video_file = function (info, new_value, old_value) {
		var getFlexApp = function (appName) {
			return (navigator.appName.indexOf ("Microsoft") != -1) ? window[appName] : document[appName];
		};

		getFlexApp('UmiVideoPlayer').setVideoFile(new_value);
		return true;
	};

	uEditor.prototype.replace['boolean'] = function(info, new_value, old_value) {
		if (info.node.tagName == 'INPUT' && info.node.type == 'checkbox') {
			info.node.checked = new_value ? true : false;
		}
		else {
			jQuery(info.node).html(new_value ? getLabel('js-cms-eip-editor-yes') : getLabel('js-cms-eip-editor-no'));
		}
		return true;
	};

	uEditor.prototype.replace.relation = function(info, new_value, old_value) {
		var html = [], i;
		for (i in new_value) {
			html.push(new_value[i]);
		}
		jQuery(info.node).html(html.join(', '));
		return true;
	};

	uEditor.prototype.replace.symlink = function(info, new_value, old_value) {
		var html = '', i;

		for(i in new_value) {
			html += '<span>' + new_value[i] + '</span><br />';
		}

		jQuery(info.node).html(html);
		return true;
	};

	uEditor.prototype.replace['int'] = function(info, new_value, old_value) {
		return this.text(info, new_value, old_value);
	};

	uEditor.prototype.replace['float'] = function(info, new_value, old_value) {
		return this.text(info, new_value, old_value);
	};

	uEditor.prototype.replace.counter = function(info, new_value, old_value) {
		return this.text(info, new_value, old_value);
	};

	uEditor.prototype.replace.price = function(info, new_value, old_value) {
		return this.text(info, new_value, old_value);
	};

	uEditor.prototype.replace.string = function(info, new_value, old_value) {
		return jQuery(info.node).html(new_value);
	};

	uEditor.prototype.replace.tags = function(info, new_value, old_value) {
		return this.text(info, new_value, old_value);
	};

	uEditor.prototype.replace.text = function(info, new_value, old_value) {
		return jQuery(info.node).html(new_value);
	};

	uEditor.prototype.replace.wysiwyg = function(info, new_value, old_value) {
		return jQuery(info.node).html(new_value||'&nbsp;');
	};

	uEditor.prototype.replace.file = function(info, new_value, old_value) {
		return this.text(info, new_value, old_value);
	};

	uEditor.prototype.replace.date = function(info, new_value, old_value) {
		return this.text(info, new_value, old_value);
	};

	uEditor.prototype.commit = function() {
		uAdmin.eip.trigger('ActiveEditorCommit', 'before');
		var new_value = this.info.new_value,
			old_value = this.info.old_value;
		if (this.info.field_type.match(/file/)) {
			new_value = this.info.new_value.src;
			old_value = this.info.old_value ? this.info.old_value.src : '';
		}
		if (!this.equals(new_value, old_value)) {
			jQuery(this.info.node).addClass('u-eip-modified');
			uAdmin.eip.queue.add(this.info);
		}
		else {
			if (uAdmin.eip.queue.search(this.info)) {
				jQuery(this.info.node).addClass('u-eip-modified');
			}
		}
		uAdmin.eip.trigger('ActiveEditorCommit', 'after');
	};

	uEditor.prototype.cleanup = function () {
		uAdmin.eip.bindEvents();

		this.finish = function() {
			this.cleanup();
		};

		uAdmin.eip.highlightNode(this.info.node);
		jQuery('.u-eip-add-button').css('display', 'flex');
		uAdmin.eip.normalizeBoxes();

		this.info.node.blur();
		jQuery(this.info.node).removeClass('u-eip-editing');
	};

	uEditor.prototype.finish = function() {
		this.cleanup();
	};

	uEditor.prototype.equals = function() {
		var result = false, arg = arguments,
			os = Object.prototype.toString, i, temp = {length:0};

		switch(true) {
			case (arg.length !== 2):break;
			case (typeof arg[0] !== typeof arg[1]):break;
			case (os.call(arg[0]) !== os.call(arg[1])):break;
			default:
				switch(typeof arg[0]) {
					case "undefined":break;
					case "object":
						if (os.call(arg[0]) == '[object Array]') {
							result = (arg[0].length === arg[1].length);
							if (result) {
								for (i = 0; i < arg[0].length; i++) {
									temp[arg[0][i]] = i;
									++temp.length;
								}
								for (i = 0; i < arg[1].length; i++) {
									if (delete temp[arg[0][i]]) {
										--temp.length;
									}
								}
								if (temp.length === 0) result = true;
							}
						}
						else {
							for (i in arg[0]) {
								temp[i] = i;
								++temp.length;
							}
							for (i in arg[1]) {
								if (delete temp[i]) {
									--temp.length;
								}
							}
							if (temp.length === 0) result = true;
							if (result) {
								for (i in arg[0]) {
									result = this.equals(arg[0][i], arg[1][i]);
									if (!result) break;
								}
							}
						}
						break;
					default:
						result = (arg[0] === arg[1]);
				}
		}

		return result;
	};

	return extend(uEditor, this);
}, 'eip');

/** Модуль визуального редактора на сайте. */
uAdmin('.wysiwyg', function (extend) {

	/**
	 * @constructor Конструктор модуля визуального редактора.
	 * Для корректной работы ожидает, что в него была передана опция `type`
	 * из клиентского кода, @example:
	 *   uAdmin('type', 'tinymce47', 'wysiwyg');
	 *
	 * После загрузки модуль становится доступен как выражение `uAdmin.wysiwyg`
	 */
	function WYSIWYG() {
		this.settings = jQuery.extend(this[this.type].settings, this.settings);
		this[this.type]();
		this.init = this[this.type].init;
	}

	/**
	 * Заглушка функции инициализации визуальных редакторов на странице.
	 * Переопределяется в конструкторе модуля WYSIWYG на функцию того типа tinyMCE,
	 * который используется на данной странице (@example WYSIWYG.prototype.tinymce47.init).
	 * @returns {boolean}
	 */
	WYSIWYG.prototype.init = function() {
		return false;
	};

	/**
	 * Заглушка настроек tinyMCE.
	 * Переопределяется в конструкторе модуля WYSIWYG на объект настроек того типа tinyMCE,
	 * который используется на данной странице (@example WYSIWYG.prototype.tinymce47.settings).
	 * @returns {boolean}
	 */
	WYSIWYG.prototype.settings = function() {
		return false;
	};

	/**
	 * Функция подключения Wysiwyg-редактора TinyMCE 4.7,
	 * вызывается в конструкторе модуля WYSIWYG.
	 */
	WYSIWYG.prototype.tinymce47 = function() {
		window.tinyMCEPreInit = {
			suffix : '.min',
			base : '/styles/common/js/node_modules/tinymce'
		};

		if (!window.tinymce) {
			$('<script src="/styles/common/js/node_modules/tinymce/tinymce.min.js" charset="utf-8"></script>')
				.appendTo('head');
		}

		if (!window.mceCustomSettings) {
			$('<script src="/styles/common/js/cms/wysiwyg/tinymce47/tinymce_custom.js" charset="utf-8"></script>')
				.appendTo('head');
		}
	};

	/**
	 * Инициализирует wysiwyg-редакторы на странице
	 * @param {Object} options дополнительные опции для tinyMCE
	 * @returns {{}}
	 */
	WYSIWYG.prototype.tinymce47.init = function(options) {
		if (!tinyMCE) {
			throw 'tinyMCE is not defined';
		}

		options = options || {};
		var editor = {};
		var selector = 'textarea.wysiwyg';

		if (uAdmin.eip && uAdmin.eip.editor) {
			editor = {
				id : 'mceEditor-' + new Date().getTime(),
				destroy : function() {
					tinymce && tinymce.activeEditor && tinymce.activeEditor.destroy();
				}
			};

			selector = '#' + editor.id;
			options.id = editor.id;
			options.inline = true;

			tinymce.on("AddEditor", function(event) {
				event.editor.on('init', function() {
					this.fire("focus");
				});
			});
		}

		var settings = {
			language: uAdmin.data['interface-lang'] || uAdmin.data['lang'],
			language_url : '/styles/common/js/cms/wysiwyg/tinymce47/langs/ru.js',
			external_plugins: {
				'codemirror': '/styles/common/js/cms/wysiwyg/tinymce47/plugins/codemirror/plugin.min.js'
			}
		};

		$.extend(
			settings,
			this.settings,
			window.mceCustomSettings,
			options.settings || {}
		);

		tinyMCE.init(settings);

		if (typeof options.selector === 'string') {
			selector = options.selector;
		}

		jQuery(selector).each(function (i, n) {
			tinyMCE.execCommand('mceToggleEditor', false, n.id);
		});

		return editor;
	};

	/**
	 * Настройки по умолчанию для tinyMCE
	 * @type {Object}
	 */
	WYSIWYG.prototype.tinymce47.settings = {
		// Убирает надпись "Powered by TinyMCE"
		branding: false,

		// Тема редактора
		theme : "modern",

		// Скин редактора
		skin : 'lightgray',

		// По умолчанию вставлять текст как простой текст (без форматирования)
		paste_as_text: true,

		// Расширение разрешенных html-элементов
		extended_valid_elements : "script[src|*],style[*],map[*],area[*],umi:*[*],input[*],noindex[*],nofollow[*],iframe[frameborder|src|width|height|name|align],div[*],span[*],a[*],-p[*]",

		// Используемые плагины
		plugins: [
			"anchor",
			"advlist",
			"charmap",
			// "code",
			"codemirror",
			"contextmenu",
			// "directionality",
			// "emoticons",
			"fullscreen",
			// "hr",
			"image",
			// "insertdatetime",
			"link",
			"lists",
			"media",
			// "nonbreaking",
			// "noneditable",
			// "pagebreak",
			"paste",
			// "preview",
			// "print",
			// "save",
			"searchreplace",
			// "spellchecker",
			"table",
			// "template",
			"textcolor",
			"visualchars"
		],

		// Расширенные настройки для изображений
		image_advtab: true,

		// Подпись для изображений
		image_caption: true,

		// Тулбар
		toolbar: 'paste pastetext undo redo removeformat link unlink anchor image media table charmap code blockquote ' +
			'formatselect fontselect fontsizeselect bold italic strikethrough underline alignleft aligncenter alignright ' +
			'alignjustify bullist numlist outdent indent forecolor backcolor subscript superscript',

		// Убирает меню
		menubar: false,

		// Разрешает изменять вертикальный размер редактора (не меньше 300px)
		resize: true,
		min_height: 300,

		// Настройки плагина codemirror (html-редактор вместо стандартного плагина `code`)
		// @link https://github.com/christiaan/tinymce-codemirror
		codemirror: {
			// Форматирует текст сразу при открытии редактора
			indentOnInit: true,

			// название директории с библиотекой codemirror (./plugins/codemirror/codemirror)
			// @link https://github.com/codemirror/CodeMirror
			path: 'codemirror',

			// Ширина редактора
			width: 1000,

			// Высота редактора
			height: 500,

			// Настройки для библиотеки codemirror
			// @link http://codemirror.net/doc/manual.html
			config: {
				// Включает нумерацию строк
				lineNumbers: true,

				// Включает перенос длинных строк
				lineWrapping: true,

				// Включает автоматическую фокусировку редактора при открытии
				autofocus: true,
			}
		},

		// Никак специально не преобразовывает ссылки
		convert_urls : false,

		// Превращает все ссылки в абсолютные
		relative_urls : false,

		// Функция обратного вызова для открытия файлового менеджера изнутри tinyMCE
		file_browser_callback: function() {
			uAdmin.wysiwyg.umiFileBrowserCallback.apply(uAdmin.wysiwyg, arguments);
		},

		// Исправляет вставку ссылки
		urlconverter_callback: function(url) {
			var umiPageLink = url.match(/^%content%20get_page_url\((\d+)\)%$/);
			return (umiPageLink === null) ? url : '%content get_page_url(' + umiPageLink[1] + ')%';
		},

		valid_children: "+a[div|p|span],+div[li]"
	};

	/**
	 * Функция обратного вызова для открытия файлового менеджера изнутри tinyMCE
	 * @param {String} fieldName ID поля
	 * @param {String} url текстовое содержимое поля
	 * @param {String} type тип поля
	 * @param {Window} win
	 * @returns {boolean}
	 */
	WYSIWYG.prototype.umiFileBrowserCallback = function(fieldName, url, type, win) {
		switch (type) {
			case "file"  :
				return uAdmin.wysiwyg.umiTreeLink(fieldName, url, type, win);

			case "image" :
			case "media" :
				var input = win.document.getElementById(fieldName);
				if (!input) {
					return false;
				}

				var folder = '';
				var file = '';
				if (input.value.length) {
					folder = input.value.substr(0, input.value.lastIndexOf('/'));
					file = input.value;
				}

				jQuery.ajax({
					url: "/admin/filemanager/get_filemanager_info/",
					data: "folder=" + folder + '&file=' + file,
					dataType: 'json',
					complete: function(data) {
						data = JSON.parse(data.responseText);
						var folderHash = data.folder_hash;
						var fileHash = data.file_hash;
						var lang = data.lang;

						var fileManager = data.filemanager;
						if (fileManager === 'elfinder') {
							return uAdmin.wysiwyg.umielfinderFileManager(fieldName, url, type, win, lang, folderHash, fileHash);
						}

						// вызов deprecated файлового менеджера на flash (или другого кастомного файлового менеджера)
						// @see WYSIWYG.prototype.umiflashFileManager
						var functionName = 'uAdmin.wysiwyg.umi' + fileManager + 'FileManager';
						eval(functionName + '(fieldName, url, type, win, lang, folderHash, fileHash)');
					}
				});
				break;

			default:
				throw 'Invalid type';
		}

		return false;
	};

	/**
	 * Файловый менеджер elFinder
	 * @param {String} fieldName ID поля
	 * @param {String} url текстовое содержимое поля
	 * @param {String} type тип поля
	 * @param {Window} win
	 * @param {String} lang строковой идентификатор языковой версии сайта
	 * @param {String} folderHash хеш пути до директории
	 * @param {String} fileHash хеш пути до файла
	 * @returns {boolean}
	 */
	WYSIWYG.prototype.umielfinderFileManager = function(fieldName, url, type, win, lang, folderHash, fileHash) {
		var query = [];
		query.push("id=" + fieldName);

		switch (type) {
			case "image" :
				query.push("image=1");
				break;
			case "media" :
				query.push("media=1");
				break;
		}

		let pageId = 0, 
			objectId = 0, 
			fName = '', 
			$element = $(win.document.getElementById(tinyMCE.EditorManager.activeEditor.id));
		if ($element.is('textarea')) {
			pageId = win.page_id;
			objectId = win.object_id;
			let result = /data\[(\d{1,6})\]\[(.+?)\]/.exec($element.attr('name'));
			if (result) {
				fName = objectId == result[1] ? result[2] : fName;
			}
		} else {
			pageId = $element.attr('umi:element-id');
			objectId = pageId == win.pageData.pageId ? win.pageData.objectId : '';
			fName = $element.attr('umi:field-name');
		}

		query.push('pageId=' + (pageId ? pageId : ''));
		query.push('objectId=' + objectId);
		query.push('fieldName=' + (fName ? fName : ''));
		query.push("folder_hash=" + folderHash);
		query.push("file_hash=" + fileHash);
		query.push("lang=" + lang);

		$.openPopupLayer(jQuery.extend({
			name: 'Filemanager',
			title: getLabel('js-file-manager'),
			width: 1200,
			height: 600,
			url: "/styles/common/other/elfinder/umifilebrowser.html?" + query.join("&")
		}, uAdmin.wysiwyg.getOpenPopupLayerExtParams(fieldName, win)));

		var selector = '#popupLayer_Filemanager .popupBody',
			footerHtml = uAdmin.wysiwyg.getFilemanagerFooter('elfinder');

		if (tinymce && tinymce.activeEditor && tinymce.activeEditor.settings.inline) {
			jQuery(selector).append(footerHtml);
		} else {
			window.parent.jQuery(selector).append(footerHtml);
		}

		return false;
	};

	/**
	 * Возвращает дополнительные параметры открытия всплывающего окна
	 * @param {String} fieldName ID поля
	 * @param {Window} win
	 * @returns {object}
	 */
	WYSIWYG.prototype.getOpenPopupLayerExtParams = function (fieldName, win) {
		return {};
	};

	/**
	 * Обработчик действия "Вставить ссылку" в визуальном редакторе
	 * @see WYSIWYG.prototype.umiFileBrowserCallback
	 * @param {String} fieldName ID поля
	 * @param {String} url текстовое содержимое поля
	 * @param {String} type тип поля
	 * @param {Window} win
	 * @returns {boolean}
	 */
	WYSIWYG.prototype.umiTreeLink = function (fieldName, url, type, win) {
		var domainFloated;
		var domainFloatedId;
		var langId;

		if (window.pageData) {
			domainFloated = window.pageData.domain;
			domainFloatedId = window.pageData.domain_id;
			langId = window.pageData.lang_id;
		} else if (uAdmin && uAdmin.data) {
			domainFloated = uAdmin.data['domain-floated'];
			domainFloatedId = uAdmin.data['domain-id'];
			langId = uAdmin.data['lang-id'];
		} else {
			throw 'Page data is not defined';
		}

		var query = "?from=tinymce&domain=" + domainFloated + "&domain_id=" + domainFloatedId + "&lang_id=" + langId;
		var treeLinkUrl = '/styles/common/js/tree.html' + query;
		var pageHeight = 320;

		// Поддержка @deprecated версии tinyMCE 3
		if (tinyMCE.majorVersion == 3) {
			treeLinkUrl = "/js/cms/wysiwyg/tinymce/jscripts/tiny_mce/themes/umi/treelink.html" + query;
			pageHeight = 308;
		}

		tinyMCE.activeEditor.windowManager.open({
			url: treeLinkUrl,
			title: getLabel('js-choose-page'),
			width: 525,
			height: pageHeight,
			inline: true,
			scrollbars: false,
			resizable: false,
			maximizable: false,
			close_previous: false
		}, {
			window: win,
			input: fieldName,
			editor_id: tinyMCE.activeEditor.id
		});

		return false;
	};

	/**
	 * Возвращает html-код нижней панели файлового менеджера
	 * TODO убрать html-код в отдельный шаблон
	 * @param {String} filemanager название файлового менеджера
	 * @returns {String}
	 */
	WYSIWYG.prototype.getFilemanagerFooter = function(filemanager) {
		var footer = "";

		if (filemanager === 'elfinder') {
			getCookie = $.cookie || getCookie;

			footer = '<div id="watermark_wrapper"><label for="add_watermark">';
			footer += getLabel('js-water-mark');
			footer += '</label><input type="checkbox" name="add_watermark" id="add_watermark"/>';
			footer += '<label for="remember_last_folder">';
			footer += getLabel('js-remember-last-dir');
			footer += '</label><input type="checkbox" name="remember_last_folder" id="remember_last_folder"';
			if (getCookie('remember_last_folder')) {
				footer += 'checked="checked"';
			}
			footer += '/></div>';
		}

		return footer;
	};

	defineDeprecatedWysiwygFunctions(WYSIWYG);
	return extend(WYSIWYG, this);
});

/** Обработчик события загрузки модуля визуального редактора */
uAdmin.onLoad('wysiwyg', function() {
	uAdmin.wysiwyg.curr_mouse_position = {
		top: 0,
		left: 0
	};

	$('body').on('click', function(e) {
		uAdmin.wysiwyg.curr_mouse_position = {
			top : e.pageY - window.pageYOffset,
			left : e.pageX - window.pageXOffset
		};
	});
});

/**
 * Добавляет в объект WYSIWYG deprecated-функции
 * для работы с устаревшими версиями визуальных редакторов. Это необходимо,
 * потому что у клиентов могут все еще работать старые версии,
 * в том числе с кастомными плагинами, то есть этот функционал нельзя удалять.
 *
 * Примеры старых версий:
 *   js/cms/wysiwyg/inline
 *   js/cms/wysiwyg/tinymce
 *   js/cms/wysiwyg/tinymce4
 *
 * @param WYSIWYG
 */
function defineDeprecatedWysiwygFunctions(WYSIWYG) {
	/** @deprecated */
	WYSIWYG.prototype.inline = function() {
		jQuery('<script src="/js/cms/wysiwyg/inline/inlineWYSIWYG.js" type="text/javascript" charset="utf-8"></script>').appendTo('head');
	};

	/** @deprecated */
	WYSIWYG.prototype.inline.init = function(node) {
		return new inlineWYSIWYG(node);
	};

	/*
	* Return tinymce on destroy holder html content
	* @returns string
	*/
	WYSIWYG.prototype.getTinymceUmiruDestroyHolderContent = function(newNode) {
		var frame = jQuery('iframe', newNode)[0];
		return frame.contentDocument.body.innerHTML;
	};

	/* Return reposition toolbar width */
	WYSIWYG.prototype.getRepositionToolbarWidth = function() {
		return 1025;
	};

	/**
	 * @deprecated
	 * tinyMCE 3, который раньше использовался в административной панели.
	 * Этот код еще может использоваться у клиентов.
	 */
	WYSIWYG.prototype.tinymce = function() {
		window.tinyMCEPreInit = {
			suffix : '',
			base : '/js/cms/wysiwyg/tinymce/jscripts/tiny_mce'
		};

		jQuery('<script src="/js/cms/wysiwyg/tinymce/jscripts/tiny_mce/tiny_mce.js" type="text/javascript" charset="utf-8"></script>').appendTo('head');
		/* adding custom settings */
		jQuery('<script src="/js/cms/wysiwyg/tinymce/jscripts/tiny_mce/tinymce_custom.js" type="text/javascript" charset="utf-8"></script>').appendTo('head');
	};

	/** @deprecated */
	WYSIWYG.prototype.tinymce.init = function(options) {
		var editor = {}, selector = "textarea.wysiwyg", settings = {};
		if (uAdmin.eip && uAdmin.eip.editor) {
			uAdmin.eip.onTinymceInitEditorTune.call(this, settings);
			editor = {
				id : 'mceEditor-' + new Date().getTime(),
				destroy : function() {
					tinyMCE.execCommand('mceToggleEditor', false, editor.id);
				}
			};
			options.id = editor.id;
			selector = '#' + editor.id;
		}

		settings.language = uAdmin.data["interface-lang"] || uAdmin.data["lang"];
		settings = jQuery.extend(this.settings, settings);
		/* custom settings */

		settings = jQuery.extend(settings, window.mceCustomSettings);
		var customSettings = options ? (options.settings || {}) : {};
		settings = jQuery.extend(settings, customSettings);
		tinyMCE.init(settings);

		if (options && typeof options.selector === 'string') {
			selector = options.selector;
		}

		jQuery(selector).each(function (i, n) {
			tinyMCE.execCommand('mceToggleEditor', false, n.id);
		});

		return editor;
	};

	/** @deprecated */
	WYSIWYG.prototype.tinymce.settings = {
		// General options
		mode : "none",
		theme : "umi",
		width : "100%",
		language : typeof window.interfaceLang == 'string' ? interfaceLang : 'ru',
		plugins : "safari,spellchecker,pagebreak,style,layer,table,save,"
		+"advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,"
		+"preview,media,searchreplace,print,contextmenu,paste,directionality,"
		+"fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",

		inlinepopups_skin : 'butterfly',

		toolbar_standart : "fontsettings,tablesettings,|,"
		+"cut,copy,paste,|,pastetext,pasteword,|,selectall,cleanup,|,"
		+ "undo,redo,|,link,unlink,anchor,image,media,|,charmap,code",

		toolbar_tables : "table,delete_table,|,col_after,col_before,"
		+"row_after,row_before,|,delete_col,delete_row,|,"
		+"split_cells,merge_cells,|,row_props,cell_props",

		toolbar_fonts: "formatselect,fontselect,fontsizeselect,|,"
		+ "bold,italic,underline,|,"
		+ "justifyleft,justifycenter,justifyright,justifyfull,|,"
		+ "bullist,numlist,outdent,indent,|,"
		+ "forecolor,backcolor,|,sub,sup",

		theme_umi_toolbar_location : "top",
		theme_umi_toolbar_align : "left",
		theme_umi_statusbar_location : "bottom",
		theme_umi_resize_horizontal : false,
		theme_umi_resizing : true,

		convert_urls : false,
		relative_urls : false,

		file_browser_callback : function(field_name, url, type, win) {
			if (type == 'file') {
				var sTreeLinkUrl = "/styles/common/js/cms/wysiwyg/tinymce/jscripts/tiny_mce/themes/umi/treelink.html" + (window.lang_id ? "?lang_id=" + window.lang_id : '');
				tinyMCE.activeEditor.windowManager.open({
					url    : sTreeLinkUrl,
					width  : 525,
					height : 308,
					inline         : true,
					scrollbars	   : false,
					resizable      : false,
					maximizable    : false,
					close_previous : false
				}, {
					window    : win,
					input     : field_name,
					editor_id : tinyMCE.selectedInstance.editorId
				});
				return false;
			}
			else {
				var input = win.document.getElementById(field_name),
					params = {}, qs = [];
				if (!input) return false;
				if (input.value.length) {
					params.folder = input.value.substr(0, input.value.lastIndexOf('/'));
					params.file = input.value;
				}
				qs.push("id=" + field_name);
				switch(type) {
					case "image" : qs.push("image=1"); break;
					case "media" : qs.push("media=1"); break;
				}
				jQuery.ajax({
					url: "/admin/filemanager/get_filemanager_info/",
					data: params,
					dataType: 'json',
					success: function(data){
						if (data.filemanager == 'flash') {
							if (input.value.length) {
								qs.push("folder=." + params.folder);
								qs.push("file=" + input.value);
							}
						}
						else {
							qs.push("folder_hash=" + data.folder_hash);
							qs.push("file_hash=" + data.file_hash);
							qs.push("lang=" + data.lang);
						}

						var fm = {
							flash :  {
								height : 460,
								url    : "/styles/common/other/filebrowser/umifilebrowser.html?" + qs.join("&")
							},
							elfinder : {
								height : 600,
								url    : "/styles/common/other/elfinder/umifilebrowser.html?" + qs.join("&")
							}
						};

						jQuery.openPopupLayer({
							name   : "Filemanager",
							title  : getLabel('js-file-manager'),
							width  : 1200,
							height : fm[data.filemanager].height,
							url    : fm[data.filemanager].url
						});

						if (data.filemanager == 'elfinder') {
							var footer = '<div id="watermark_wrapper"><label for="add_watermark">';
							footer += getLabel('js-water-mark');
							footer += '</label><input type="checkbox" name="add_watermark" id="add_watermark"/>';
							footer += '<label for="remember_last_folder">';
							footer += getLabel('js-remember-last-dir');
							footer += '</label><input type="checkbox" name="remember_last_folder" id="remember_last_folder"'
							if (getCookie('remember_last_folder', true) > 0) {
								footer += 'checked="checked"';
							}
							footer +='/></div>';

							window.parent.jQuery('#popupLayer_Filemanager .popupBody').append(footer);
						}
						return false;
					}
				});
			}
			return false;
		},// Callbacks

		extended_valid_elements : "script[type=text/javascript|src|languge|lang],map[*],area[*],umi:*[*],input[*],noindex[*],nofollow[*],iframe[frameborder|src|width|height|name|align]", // extend tags and atributes

		content_css : "/css/cms/style.css" // enable custom CSS
	};

	/**
	 * @deprecated
	 * tinyMCE 3, который раньше использовался в EIP.
	 * Этот код еще может использоваться у клиентов.
	 */
	/** @deprecated */
	WYSIWYG.prototype.tinymce_umiru = function() {
		window.tinyMCEPreInit = {
			suffix : '_src',
			base : '/js/cms/wysiwyg/tinymce/jscripts/tiny_mce'
		};

		if (!window.tinymce) {
			jQuery('<script src="/js/cms/wysiwyg/tinymce/jscripts/tiny_mce/tiny_mce_src.js" type="text/javascript" charset="utf-8"></script>').appendTo('head');
		}

		/* adding custom settings */
		jQuery('<script src="/js/cms/wysiwyg/tinymce/jscripts/tiny_mce/tinymce_src_custom.js" type="text/javascript" charset="utf-8"></script>').appendTo('head');
	};

	/** @deprecated */
	WYSIWYG.prototype.tinymce_umiru.init = function(node) {
		var editor, selector = "textarea.wysiwyg", settings = {};
		if (uAdmin.eip && uAdmin.eip.editor) {
			uAdmin.eip.onTinymceInitEditorTune.call(this, settings);
			editor = {
				id : 'mceEditor-' + new Date().getTime(),
				destroy : function() {
					var oldNode = jQuery('#' + editor.id),
						newNode = jQuery('#' + editor.id + '_parent'),
						content;

					content = uAdmin.wysiwyg.getTinymceUmiruDestroyHolderContent(newNode);
					oldNode.html(content);
					newNode.remove();
					oldNode.css('display','');
					oldNode[0].id = '';
				}
			};
			node.id = editor.id;
			selector = '#' + editor.id;
		}

		settings.language = uAdmin.data["interface-lang"] || uAdmin.data["lang"];
		settings = jQuery.extend(this.settings, settings);

		if (window.mceUmiRUCustomSettings) {
			settings = jQuery.extend(settings, window.mceUmiRUCustomSettings);
		}

		tinyMCE.init(settings);

		jQuery(selector).each(function (i, n) {
			tinyMCE.execCommand('mceAddControl', false, n.id);
		});
		return editor;
	};

	/** @deprecated */
	WYSIWYG.prototype.tinymce_umiru.settings = {

		// General options
		mode : "none",
		theme : "umiru",
		language : typeof window.interfaceLang == 'string' ? interfaceLang : 'ru',
		width : "100%",
		suffix : "_src",

		body_class : "text",

		theme_umi_resizing_use_cookie : false,
		init_instance_callback : "uAdmin.wysiwyg.initInstance", //trigger event on editor instance creation
		theme_umi_path : false, //dispable path control
		//constrain_menus : true,
		constrain_menus : false,
		extended_valid_elements : "script[src|*],style[*],map[*],area[*],umi:*[*],input[*],noindex[*],nofollow[*],iframe[frameborder|src|width|height|name|align],div[*],span[*],a[*]", // extend tags and atributes
		plugins : "safari,spellchecker,pagebreak,style,layer,table,save,advhr,umiimage,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",

		inlinepopups_skin : 'butterfly',

		setup : function(ed) {
			function resize (ed, l) {
				jQuery(ed.getContainer()).children('table.mceLayout').eq(0).css('height', 'auto');
				//select iframe element
				var i = jQuery(ed.getContentAreaContainer()).children('iframe')[0];
				//select body of iframe
				var h = i.contentWindow.document.body;
				//.parent() doesn't work in IE properly
				iHeight = Math.max(jQuery(h).parent().outerHeight(), jQuery(h).outerHeight())
				//set iframe heigth to height of html inside
				i.style.height = iHeight + 'px';

				$('img', ed.getBody()).on('load', function() {
					resize(ed, l);
				});
			}

			ed.onChange.add(resize);
			ed.onKeyDown.add(resize);
			ed.onLoadContent.add(function(ed, o) {
				if(o.content == "&nbsp;" || o.content == " ") {
					ed.setContent("");
				}
				ed.focus();

				/** Поиск с возвращением: поиск первой ноды с текстом */
				function backTrackTextnode(node) {
					if(node.nodeType == 3) return node;

					var subnodes = $(node).contents();

					for(var bkt = 0; bkt < subnodes.length; bkt++) {
						var result = backTrackTextnode(subnodes[bkt]);
						if(result) return result;
					}

					return false;
				}

				var nodes_all = ed.dom.select('body');
				var node = backTrackTextnode(nodes_all[0]);
				if(!node) {
					if(ed.dom.select('body *').length > 0) {
						node = ed.dom.select('body *')[0];
					} else {
						node = nodes_all[0];
					}
				} else {
					node = node.parentNode;
				}

				var rng = ed.selection.getRng();
				if(!rng || typeof rng.selectNode == "undefined") return;
				var tn = ed.getDoc().createTextNode(".");
				node.insertBefore(tn, node.firstChild);


				rng.selectNode(tn);
				rng.setStartBefore(tn);
				rng.setStartAfter(tn);

				ed.selection.setRng(rng);

				node.removeChild(tn);

				//Передвигаем панельку с кнопками туда, куда кликнули
				var panel = $('#' + ed.editorContainer + ' .toolbarHolder');
				var panelWidth = 1110;
				var bodyWidth = $('body').width();
				panel.css('position', 'fixed');
				panel.css('top', 40);
				if(bodyWidth > panelWidth) {
					panel.css('left', (bodyWidth - panelWidth)/2);
				}else{
					panel.css('left', (bodyWidth - 800)/2);
				}
			});
		},


		toolbar_standart : "umiimage,tablesettings,|,"
		+ "pastetext,pasteword,|,cleanup,|,"
		+ "link,unlink,|,"
		+ "charmap,code",

		toolbar_tables : "table,delete_table,|,col_after,col_before,row_after,row_before,|,delete_col,delete_row,|,split_cells,merge_cells,|,row_props,cell_props",

		toolbar_fonts: "formatselect,fontselect,fontsizeselect,|,"
		+ "bold,italic,underline,|,"
		+ "justifyleft,justifycenter,justifyright,justifyfull,|,"
		+ "bullist,numlist,outdent,indent,|,"
		+ "forecolor,backcolor,|,"
		+ "sub,sup",


		theme_umi_toolbar_location : "top",
		theme_umi_toolbar_align : "left",
		theme_umi_statusbar_location : "bottom",
		theme_umi_resize_horizontal : false,
		theme_umi_resizing : false,

		convert_urls : false,
		relative_urls : false,

		// Example content CSS (should be your site CSS)
		//content_css : "css/example.css",

		// Callbacks
		file_browser_callback : "uAdmin.wysiwyg.umiFileBrowserCallback",


		// Drop lists for link/image/media/template dialogs
		template_external_list_url : "js/template_list.js",
		external_link_list_url : '',
		external_image_list_url : '',
		media_external_list_url : ''
	};

	/**
	 * @deprecated
	 * tinyMCE 4, который раньше использовался в EIP.
	 * Этот код еще может использоваться у клиентов.
	 */
	WYSIWYG.prototype.tinymce4 = function() {
		window.tinyMCEPreInit = {
			suffix : '.min',
			base : '/js/cms/wysiwyg/tinymce4'
		};

		/* adding custom settings */
		jQuery('<script src="/js/cms/wysiwyg/tinymce4/tinymce_custom.js" type="text/javascript" charset="utf-8"></script>').appendTo('head');

		if (window.customLinkTinymce4) {
			window.customLinkTinymce4();
		} else if (!window.tinymce) {
			jQuery(
				'<script src="/js/cms/wysiwyg/tinymce4/tinymce.min.js" type="text/javascript" charset="utf-8"></script>'
			).appendTo('head');
		}

		var jqToolbarHolder = jQuery('<div/>')
			.addClass('toolbarHolder')
			.css({
				position: 'fixed',
				top: '40px',
				display: 'none'
			})
			.appendTo("body");

		var repositionToolbarHolder = function (editor) {
			if (!editor || editor instanceof tinymce.Editor === false) editor = tinymce && tinymce.activeEditor;
			if (!editor) return false;
			var iDocWidth = jQuery(document).width(),
				iPanelWidth = Math.min(iDocWidth * 0.9, uAdmin.wysiwyg.getRepositionToolbarWidth()),
				iLeft = (iDocWidth - iPanelWidth) / 2;
			var jqPanel = jQuery(editor.theme.panel.getEl());
			jqToolbarHolder.width(iPanelWidth).offset({left: iLeft}).draggable().css('cursor', 'move');
			jqPanel.find(".mce-toolbar").css('display', 'inline-block').parent().css('white-space', 'normal');
			if (jQuery.draggable) {
				jqPanel.draggable();
			}
		};

		jQuery(document).add(window).on('resize', function(oEvent){
			if (tinymce && tinymce.activeEditor) {
				repositionToolbarHolder(tinymce.activeEditor);
			}
		});

		tinymce.on('AddEditor', function(oEvent){
			oEvent.editor.on('ShowPanel', function(oEvent){
				repositionToolbarHolder(oEvent.target);
				window.setTimeout(function(){ jQuery(".toolbarHolder").show() }, 0);
			});
		});

	};

	/** @deprecated */
	WYSIWYG.prototype.tinymce4.init = function(node) {
		if (window.tinymce4InitAbort && window.tinymce4InitAbort()) {
			return null;
		}
		var editor, selector = "textarea.wysiwyg", settings = {};
		if (uAdmin.eip && uAdmin.eip.editor) {
			editor = {
				id : 'mceEditor-' + new Date().getTime(),
				destroy : function() {
					tinymce && tinymce.activeEditor && tinymce.activeEditor.destroy();
				}
			};
			node.id = editor.id;
			selector = '#' + editor.id;
			settings.fixed_toolbar_container = ".toolbarHolder";
			tinymce.on("AddEditor", function(oEvent){
				oEvent.editor
					.on('init', function(oEvent){
						this.fire("focus");
					});
			});
		}

		settings.language = uAdmin.data["interface-lang"] || uAdmin.data["lang"];
		settings = jQuery.extend(this.settings, settings);
		/* custom settings */
		if (window.mceCustomSettings) {
			settings = jQuery.extend(settings, window.mceCustomSettings);
		}

		if (window.mce4CustomSettings) {
			settings = jQuery.extend(settings, window.mce4CustomSettings);
		}

		settings.selector = selector;
		tinymce.init(settings);
		return editor;
	};

	/** @deprecated */
	WYSIWYG.prototype.tinymce4.settings = {

		// General options
		inline : true,
		theme : "modern",
		skin : 'darkgray',
		language : typeof window.interfaceLang == 'string' ? interfaceLang : 'ru',
		suffix : ".min",
		schema: "html4",
		paste_as_text: true,
		convert_urls: false,
		toolbar_items_size: 'small',

		extended_valid_elements : "script[src|*],style[*],map[*],area[*],umi:*[*],input[*],noindex[*],nofollow[*],iframe[frameborder|src|width|height|name|align],div[*],span[*],a[*]", // extend tags and atributes
		plugins : "umiimage,spellchecker,pagebreak,layer,table,save,hr,image,link,emoticons,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,template,anchor,charmap,code,textcolor",

		inlinepopups_skin : 'butterfly',

		toolbar1 : "image table | paste pastetext | removeformat | link unlink | charmap code",
		toolbar2 : "formatselect fontselect fontsizeselect",
		toolbar3 : "bold italic underline",
		toolbar4 : "alignleft aligncenter alignright alignjustify",
		toolbar5 : "bullist numlist outdent indent",
		toolbar6 : "forecolor backcolor",
		toolbar7 : "subscript superscript",

		block_formats: getLabel("js-wysiwyg-paragraph")+"=p;Address=address;Pre=pre;Header 1=h1;Header 2=h2;Header 3=h3;Header 4=h4;Header 5=h5;Header 6=h6",

		menubar: false,
		statusbar: false,
		resize: false,
		object_resizing : false,

		convert_urls : false,
		relative_urls : false,

		// Callbacks
		file_browser_callback : function(){ uAdmin.wysiwyg.umiFileBrowserCallback.apply(uAdmin.wysiwyg, arguments) },


		// Drop lists for link/image/media/template dialogs
		template_external_list_url : "js/template_list.js",
		external_link_list_url : '',
		external_image_list_url : '',
		media_external_list_url : ''

	};

	/** @deprecated */
	WYSIWYG.prototype.initInstance = function (inst) {

		//Auto add styles into iframe document body, inherited from real element
		jQuery('div.toolbarHolder').draggable();
		var el = jQuery(inst.getElement());
		var iframeBody = jQuery(inst.getDoc()).find('body').eq(0);
		var attrArray = ['font-family','font-size','font-weight','font-style','color',
			'text-transform','text-decoration','letter-spacing','word-spacing',
			'line-height','text-align','vertical-align','direction','background-color',
			'background-image','background-repeat','background-position',
			'background-attachment','opacity','top','right','bottom',
			'left','padding-top','padding-right','padding-bottom','padding-left',
			'overflow-x','overflow-y','white-space',
			'clip','list-style-image','list-style-position',
			'list-style-type','marker-offset'];
		for (var i in attrArray) {
			iframeBody.css(attrArray[i], el.css(attrArray[i]));
		}

		function getInternetExplorerVersion() {
			// Returns the version of Internet Explorer or a -1
			// (indicating the use of another browser).
			var rv = -1; // Return value assumes failure.
			if (navigator.appName == 'Microsoft Internet Explorer') {
				var ua = navigator.userAgent;
				var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
				if (re.exec(ua) != null)
					rv = parseFloat( RegExp.$1 );
			}
			return rv;
		}
		var ieVersion = getInternetExplorerVersion();
		if(ieVersion > -1 && ieVersion <= 8.0) {
			iframeBody.css('background-color', '');
		}
		iframeBody.css('height', 'auto');
		var containerAttrArray = ['margin-top','margin-right','margin-bottom','margin-left'];
		jQuery('#' + inst.editorContainer).css('display', 'block');
		for (var j in containerAttrArray) {
			jQuery('#' + inst.editorContainer).css(containerAttrArray[j], el.css(containerAttrArray[j]));
		}

		//Auto adding line-height when changing size of font
		inst.formatter.register({
			fontsize : {inline : 'span', styles : {fontSize : '%value', 'line-height' : '1.3em'}}
		});

		//Remove alert when toggling "Insert as text" button
		var cookie = tinymce.util.Cookie;
		cookie.set("tinymcePasteText", "1", new Date(new Date().getFullYear() + 1, 12, 31));

	};

	/**
	 * @deprecated
	 * Устаревший файловый менеджер на flash
	 */
	WYSIWYG.prototype.umiflashFileManager = function (field_name, url, type, win, lang, folder_hash, file_hash) {

		var input = win.document.getElementById(field_name);
		if(!input) return false;
		var qs    = [];
		qs.push("id=" + field_name);
		switch(type) {
			case "image" :qs.push("image=1");break;
			case "media" :qs.push("media=1");break;
		}
		if(input.value.length) {
			var folder = input.value.substr(0, input.value.lastIndexOf('/'));
			qs.push("folder=." + folder);
			qs.push("file=" + input.value);
		}
		$.openPopupLayer({
			name   : "Filemanager",
			title  : getLabel('js-file-manager'),
			width  : 1200,
			height : 600,
			url    : "/styles/common/other/filebrowser/umifilebrowser.html?" + qs.join("&")
		});
		return false;

	};
}

uAdmin('.session', function (extend) {
	function uSession() {
		var self = this;

		self.access = !!self.access;
		self.lifetime = parseInt(self.lifetime) || 10;

		self.pingInterval = Math.min((self.lifetime*60)/2, 300);
		self.awayTimeout = 0;
		self.lastPingedTime = new Date();

		self.currentMessage = null;

		this.lastActionTime = new Date();

		(function init() {
			jQuery(document).on('click keydown mousedown', null, function(eventObject){
				self.eventHandler(eventObject);
			});

			setTimeout(function() {
				jQuery( 'iframe' ).each( function() {
					try {
						var d = this.contentWindow || this.contentDocument;
						if (d.document) {
							jQuery(d.document).on('click keydown mousedown', function(eventObject){
								self.eventHandler(eventObject);
							});
						}
					} catch (e) {}
				});
			}, 5000);

			self.pingIntervalHandler = setInterval(function() {
				self.pingHandler();
			}, self.pingInterval * 1000);
		})();
	}

	uSession.prototype.sessionAjax = function (data, callback) {
		jQuery.get("/session.php", data, function(response) {
			if (typeof callback == 'function') callback(response);
		});
	}

	uSession.prototype.login = function (login, password, callback) {
		this.sessionAjax({'u-login': login, 'u-password': password, 'a': 'ping'}, function(response) {
			if (typeof callback == 'function') callback(response != "-1");
		});
	}
	uSession.prototype.check = function () {
		var self = this;

		this.sessionAjax(null, function(response){
			self.checkHandler(response);
		});
	}

	uSession.prototype.ping = function (force) {
		var self = this;

		// пингуем не чаще, чем раз в 5 секунд, либо принудительно
		if(((new Date()).getTime() - self.lastPingedTime.getTime() < 5000) && !force) { // < 2 sec
			return;
		}
		self.lastPingedTime = new Date();

		self.sessionAjax({'a': 'ping'}, function(response) {
			self.checkHandler(response);
		});
	}

	uSession.prototype.checkHandler = function(data) {
		switch(data) {
			case '-1': case '0': {
				this.showCloseMessage(true);
				break;
			}
			default: {
				this.awayTimeout = parseInt(data, 10);
				if (this.awayTimeout <= this.pingInterval + 10) {
					this.showWarningMessage();
				} else {
					if(!this.pingIntervalHandler) {
						var self = this;
						this.pingIntervalHandler = setInterval(function() {
							self.pingHandler();
						}, this.pingInterval * 1000);
					}
					this.closeMessage();
				}
				break;
			}
		}
	}

	uSession.prototype.isUserActive = function () {
		if (getCookie('umi-auth-token')) {
			return true;
		}

		return (new Date().getTime() - this.lastActionTime.getTime())/1000 < this.pingInterval;
	}

	/** Event handler for users actions */
	uSession.prototype.eventHandler = function (eventObject) {
		this.lastActionTime = new Date();

		switch (this.currentMessage) {
			case 'warning': {
				this.closeMessage();
				this.ping(true);
			}
			case 'close': {
				if (this.jgrowl && $.contains(this.jgrowl[0], eventObject.target)) {
					return;
				}
				this.ping();
			}
		}
	}

	uSession.prototype.pingHandler = function () {
		if (this.isUserActive()) {
			this.ping();
		} else {
			this.check();
		}
	}

	uSession.prototype.showWarningMessage = function(force) {
		var self = this;

		if (force) {
			clearInterval(self.timer);
			self.timer = null;
		}

		self.currentMessage = 'warning';

		if (self.timer){
			return;
		}

		self.timer = setInterval(function() {
			// отображается таймер
			if (self.awayTimeout > 0) {
				var timeRemains = self.awayTimeout;

				var minRemains = parseInt(timeRemains/60);
				var secRemains = timeRemains%60;

				if (secRemains < 10) secRemains = "0" + secRemains;

				var msg = minRemains + ":" + secRemains;

				var timeNoUserHereMin = parseInt((self.lifetime * 60 - self.awayTimeout) / 60);

				self.message(
					getLabel("js-session-is-away") + " " + timeNoUserHereMin + " " + getLabel("js-minutes") + ". " +
					getLabel("js-session-warning") + "<br/>" + msg
				);
				self.awayTimeout--;
			} else {
				self.closeMessage();
				self.check();
			}
		}, 1000);


	};

	uSession.prototype.showCloseMessage = function(force) {
		var self = this;

		if (force) {
			clearInterval(self.timer);
			self.timer = null;
		}

		if (self.currentMessage == "close") {
			return;
		}

		self.currentMessage = "close";

		if (self.pingIntervalHandler) {
			clearInterval(self.pingIntervalHandler);
			self.pingIntervalHandler = 0;
		}

		var msg = jQuery('<div><br />' + getLabel("js-session-was-away") + " " + self.lifetime + " " + getLabel("js-minutes") + ", " +
			getLabel("js-session-close") + '<br/><br/></div>');

		var form = jQuery('\n\
			<form>\n\
				<table cellspacing="5" width="100%">\n\
					<tr>\n\
						<td>' + getLabel("js-label-login") + ': </td>\n\
						<td><input type="text" name="session_contorl_login" /></td>\n\
					</tr>\n\
					<tr>\n\
						<td>' + getLabel("js-label-password") + ':</td>\n\
						<td><input type="password" name="session_contorl_passsword" /></td>\n\
					</tr>\n\
				</table>\n\
				<br/>\n\
				<input type="submit" value="' + getLabel("js-label-login-do") + '">\n\
			</form>\n\
		').appendTo(msg);

		if (self.access) {
			jQuery("<br/> <br/><a href='/admin/config/main/' target='_blank'>" + getLabel("js-session-lifetime-configure") + "</a>").appendTo(form);
		}

		form.on('submit', function() {
			var login  = (this.session_contorl_login.value || "").trim(),
				passwd = (this.session_contorl_passsword.value || "").trim();

			if (login && passwd) {
				self.login(login, passwd, function(response) {
					if (response) {
						jQuery.getJSON('/admin/config/main/.json', {}, function(r) {
							if (uAdmin.csrf && uAdmin.csrf != r.csrf) {
								uAdmin.csrf = r.csrf;
							} else if (csrfProtection && csrfProtection.getToken() != r.csrf) {
								csrfProtection.changeToken(r.csrf);
							}
						});

						self.closeMessage();

						self.pingIntervalHandler = setInterval(function() {
							self.pingHandler();
						}, self.pingInterval * 1000);

						jQuery.jGrowl(getLabel("js-session-restored"), {
							'header': 'UMI.CMS',
							'life': 5000
						});
					} else {
						jQuery.jGrowl(getLabel("js-label-text-error"), {
							'header': 'UMI.CMS',
							'life': 5000
						});
					}
				});
			} else {
				jQuery.jGrowl(getLabel("js-label-text-error"), {
					'header': 'UMI.CMS',
					'life': 5000
				});
			}

			return false;
		});

		self.message(msg);
	};

	uSession.prototype.message = function(msg) {
		var self = this;

		if (typeof msg == 'string') {
			msg = '<br/><p> ' + msg + ' </p>';
		}

		if (!self.jgrowl) {
			self.jgrowl = -1;
			jQuery.jGrowl(msg, {
				header: 'UMI.CMS',
				dont_close: true,
				beforeOpen: function(domObject) {
					self.jgrowl = jQuery(domObject);
				},
				close: function() {
					self.closeMessage();
					self.ping(true);
				}
			});
			return;
		} else {
			if (self.jgrowl != -1) {
				var jGrowlMessage = self.jgrowl.find('.jGrowl-message');
				if (typeof msg == 'string') {
					jGrowlMessage.html(msg);
				} else {
					jGrowlMessage.html("");
					jGrowlMessage.append(msg);
				}
			}
		}
	};

	uSession.prototype.closeMessage = function() {
		this.currentMessage = null;

		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}

		if (this.jgrowl && this.jgrowl != -1) {
			this.jgrowl.mouseout();
			this.jgrowl.remove();
			this.jgrowl = null;
		}
	};

	uSession.prototype.destroy = function() {
		if (this.pingIntervalHandler) {
			clearInterval(this.pingIntervalHandler);
			this.pingIntervalHandler = 0;
		}

		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}

		return true;
	};

	return extend(uSession, this);
});
/**
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * @link   http://www.phpied.com/rgb-color-parser-in-javascript/
 * @license Use it if you like it
 */
function RGBColor(color_string)
{
    this.ok = false;

    // strip any leading #
    if (color_string.charAt(0) == '#') { // remove # if any
        color_string = color_string.substr(1,6);
    }

    color_string = color_string.replace(/ /g,'');
    color_string = color_string.toLowerCase();

    // before getting into regexps, try simple matches
    // and overwrite the input
    var simple_colors = {
        aliceblue: 'f0f8ff',
        antiquewhite: 'faebd7',
        aqua: '00ffff',
        aquamarine: '7fffd4',
        azure: 'f0ffff',
        beige: 'f5f5dc',
        bisque: 'ffe4c4',
        black: '000000',
        blanchedalmond: 'ffebcd',
        blue: '0000ff',
        blueviolet: '8a2be2',
        brown: 'a52a2a',
        burlywood: 'deb887',
        cadetblue: '5f9ea0',
        chartreuse: '7fff00',
        chocolate: 'd2691e',
        coral: 'ff7f50',
        cornflowerblue: '6495ed',
        cornsilk: 'fff8dc',
        crimson: 'dc143c',
        cyan: '00ffff',
        darkblue: '00008b',
        darkcyan: '008b8b',
        darkgoldenrod: 'b8860b',
        darkgray: 'a9a9a9',
        darkgreen: '006400',
        darkkhaki: 'bdb76b',
        darkmagenta: '8b008b',
        darkolivegreen: '556b2f',
        darkorange: 'ff8c00',
        darkorchid: '9932cc',
        darkred: '8b0000',
        darksalmon: 'e9967a',
        darkseagreen: '8fbc8f',
        darkslateblue: '483d8b',
        darkslategray: '2f4f4f',
        darkturquoise: '00ced1',
        darkviolet: '9400d3',
        deeppink: 'ff1493',
        deepskyblue: '00bfff',
        dimgray: '696969',
        dodgerblue: '1e90ff',
        feldspar: 'd19275',
        firebrick: 'b22222',
        floralwhite: 'fffaf0',
        forestgreen: '228b22',
        fuchsia: 'ff00ff',
        gainsboro: 'dcdcdc',
        ghostwhite: 'f8f8ff',
        gold: 'ffd700',
        goldenrod: 'daa520',
        gray: '808080',
        green: '008000',
        greenyellow: 'adff2f',
        honeydew: 'f0fff0',
        hotpink: 'ff69b4',
        indianred : 'cd5c5c',
        indigo : '4b0082',
        ivory: 'fffff0',
        khaki: 'f0e68c',
        lavender: 'e6e6fa',
        lavenderblush: 'fff0f5',
        lawngreen: '7cfc00',
        lemonchiffon: 'fffacd',
        lightblue: 'add8e6',
        lightcoral: 'f08080',
        lightcyan: 'e0ffff',
        lightgoldenrodyellow: 'fafad2',
        lightgrey: 'd3d3d3',
        lightgreen: '90ee90',
        lightpink: 'ffb6c1',
        lightsalmon: 'ffa07a',
        lightseagreen: '20b2aa',
        lightskyblue: '87cefa',
        lightslateblue: '8470ff',
        lightslategray: '778899',
        lightsteelblue: 'b0c4de',
        lightyellow: 'ffffe0',
        lime: '00ff00',
        limegreen: '32cd32',
        linen: 'faf0e6',
        magenta: 'ff00ff',
        maroon: '800000',
        mediumaquamarine: '66cdaa',
        mediumblue: '0000cd',
        mediumorchid: 'ba55d3',
        mediumpurple: '9370d8',
        mediumseagreen: '3cb371',
        mediumslateblue: '7b68ee',
        mediumspringgreen: '00fa9a',
        mediumturquoise: '48d1cc',
        mediumvioletred: 'c71585',
        midnightblue: '191970',
        mintcream: 'f5fffa',
        mistyrose: 'ffe4e1',
        moccasin: 'ffe4b5',
        navajowhite: 'ffdead',
        navy: '000080',
        oldlace: 'fdf5e6',
        olive: '808000',
        olivedrab: '6b8e23',
        orange: 'ffa500',
        orangered: 'ff4500',
        orchid: 'da70d6',
        palegoldenrod: 'eee8aa',
        palegreen: '98fb98',
        paleturquoise: 'afeeee',
        palevioletred: 'd87093',
        papayawhip: 'ffefd5',
        peachpuff: 'ffdab9',
        peru: 'cd853f',
        pink: 'ffc0cb',
        plum: 'dda0dd',
        powderblue: 'b0e0e6',
        purple: '800080',
        red: 'ff0000',
        rosybrown: 'bc8f8f',
        royalblue: '4169e1',
        saddlebrown: '8b4513',
        salmon: 'fa8072',
        sandybrown: 'f4a460',
        seagreen: '2e8b57',
        seashell: 'fff5ee',
        sienna: 'a0522d',
        silver: 'c0c0c0',
        skyblue: '87ceeb',
        slateblue: '6a5acd',
        slategray: '708090',
        snow: 'fffafa',
        springgreen: '00ff7f',
        steelblue: '4682b4',
        tan: 'd2b48c',
        teal: '008080',
        thistle: 'd8bfd8',
        tomato: 'ff6347',
        turquoise: '40e0d0',
        violet: 'ee82ee',
        violetred: 'd02090',
        wheat: 'f5deb3',
        white: 'ffffff',
        whitesmoke: 'f5f5f5',
        yellow: 'ffff00',
        yellowgreen: '9acd32'
    };
    for (var key in simple_colors) {
        if (color_string == key) {
            color_string = simple_colors[key];
        }
    }
    // emd of simple type-in colors

    // array of color definition objects
    var color_defs = [
        {
            re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
            example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
            process: function (bits){
                return [
                    parseInt(bits[1]),
                    parseInt(bits[2]),
                    parseInt(bits[3])
                ];
            }
        },
        {
            re: /^(\w{2})(\w{2})(\w{2})$/,
            example: ['#00ff00', '336699'],
            process: function (bits){
                return [
                    parseInt(bits[1], 16),
                    parseInt(bits[2], 16),
                    parseInt(bits[3], 16)
                ];
            }
        },
        {
            re: /^(\w{1})(\w{1})(\w{1})$/,
            example: ['#fb0', 'f0f'],
            process: function (bits){
                return [
                    parseInt(bits[1] + bits[1], 16),
                    parseInt(bits[2] + bits[2], 16),
                    parseInt(bits[3] + bits[3], 16)
                ];
            }
        }
    ];

    // search through the definitions to find a match
    for (var i = 0; i < color_defs.length; i++) {
        var re = color_defs[i].re;
        var processor = color_defs[i].process;
        var bits = re.exec(color_string);
        if (bits) {
            channels = processor(bits);
            this.r = channels[0];
            this.g = channels[1];
            this.b = channels[2];
            this.ok = true;
        }

    }

    // validate/cleanup values
    this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
    this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
    this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);

    // some getters
    this.toRGB = function () {
        return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
    };
    
    this.toHash = function () {
	return {'red': this.r, 'green': this.g, 'blue': this.b};
    };
    
    this.inverse = function () {
	this.r = 255 - this.r;
	this.g = 255 - this.g;
	this.b = 255 - this.b;
    };
    
    this.toHex = function () {
        var r = this.r.toString(16);
        var g = this.g.toString(16);
        var b = this.b.toString(16);
        if (r.length == 1) r = '0' + r;
        if (g.length == 1) g = '0' + g;
        if (b.length == 1) b = '0' + b;
        return '#' + r + g + b;
    };


};


function relationControl(_typeId, _fieldSuffix, _prependEmpty, _sourceUri) {
	var _self       = this;
	var typeId      = _typeId;
	var fieldSuffix = _fieldSuffix || _typeId;
	var needLoad    = true;	
	var selectInput = null;
	var textInput   = null;
	var addButton   = null;
	var addedOption = null;
	var useSearchOption = null;
	var suggestDiv  = null;
	var timeHandler = null;
	var suggestItems = null;
	var suggestIndex = null;
	var mouseX       = 0;
	var mouseY       = 0;
	var sourceUri = _sourceUri || '/admin/data/guide_items_all/';
	
	/** Initialize the control */
	var init = function() {
		selectInput = document.getElementById('relationSelect' + fieldSuffix);
		textInput   = document.getElementById('relationInput'  + fieldSuffix);
		addButton   = document.getElementById('relationButton' + fieldSuffix);
		if(!selectInput) {
			alert('Select input for field #' + fieldSuffix + ' not found');
			return;
		}

		jQuery("option", selectInput).each(function() {
			if (!this.selected && this.value.length !== 0) {
				needLoad = false;
			}
		});

		// Bind some events		
		if(addButton) {
			addButton.onclick = function() {
				_self.addObjectToGuide(null, null, function(name, id) {
					_self.addItem(name, id);
				});

			}
		}

		if(textInput) {
			textInput.onkeyup = function(keyEvent) {
				var code = keyEvent ? keyEvent.keyCode : event.keyCode;
				if(code == 13 && addButton) {
					_self.addItem();
					return false;
				} else {
					_self.doSearch();
				}
			};
			textInput.onkeydown = function(keyEvent) {
				var code = keyEvent ? keyEvent.keyCode : event.keyCode;
				if(code == 13) {
					return false;
				}
			};
		}
		var onLoadItems = function() { if(needLoad) { _self.loadItemsAll(); needLoad = false; } };
		selectInput.onmouseover = onLoadItems;
		selectInput.onfocus		= onLoadItems;
		// Cleanup
		for(var i = 0; i < selectInput.childNodes.length; i++) {
			if(selectInput.childNodes[i].nodeType != 1) {
				selectInput.removeChild(selectInput.childNodes[i]);
				i = 0;
			}
		}		
		if(_prependEmpty && jQuery("option[value='']", selectInput).length==0) {
			jQuery(selectInput).prepend("<option value=''></option>");
		}
	};

	/**
	 * Создает объект в справочнике на сервере
	 * @param {string} _name имя создаваемого объекта, если не передано, то будет использовано содержимое
	 * поля textInput
	 * @param {int} _guideId ID справочника, в который будет добавлен объект, если не передано, то будет
	 * использовано значение переменной typeId
	 * @param {function} callback функция, которая вызывается при успешном создании объекта
	 * @param callback
	 */
	this.addObjectToGuide = function(_name, _guideId, callback) {
		var	objectName = (typeof(textInput) === 'object' ? textInput.value : _name);
		var guideId = (parseInt(typeId) > 0 ? parseInt(typeId) : parseInt(_guideId));
		var request = {
			url: '',
			data: null
		};
		var newObject = {
			id: 0,
			name: ''
		};
		var addButton   = document.getElementById('relationButton' + fieldSuffix);
		var selectedOption = null;
		var lastOption = null;

		if (typeof(objectName) !== 'string' || objectName.length <= 0 || guideId <= 0) {
			return;
		}

		request.url = '/admin/udata://data/addObjectToGuide/.json';
		request.data = {
			param0: objectName,
			param1: guideId
		};
		addButton.setAttribute('disabled', '');

		jQuery.ajax({
			url: request.url,
			dataType: 'json',
			data: request.data,
			type: 'post',
			success: function(response) {
				if (typeof(response.data) !== 'undefined' &&
					typeof(response.data.object) !== 'undefined') {
					newObject.id = parseInt(response.data.object.id);

					if (isNaN(newObject.id) || newObject.id <= 0) {
						return;
					}

					newObject.name = response.data.object.name;

					if (typeof(callback) === 'function') {
						callback(newObject.name, newObject.id);
					}
					addButton.removeAttribute('disabled');
					if (useSearchOption) {
						selectedOption = jQuery('option:selected', selectInput);
						lastOption = jQuery('option:last', selectInput);
						selectedOption = selectedOption.detach();
						jQuery(lastOption).replaceWith(selectedOption);
					}

				}
			},
			error: function() {
				addButton.removeAttribute('disabled');
			}
		});


	};
	
	this.rescan = function () {
		textInput   = document.getElementById('relationInput'  + fieldSuffix);
		
		if(textInput) {
			textInput.onkeyup = function(keyEvent) {
				var code = keyEvent ? keyEvent.keyCode : event.keyCode;
				if(code == 13 && addButton) {
					_self.addItem();
				} else {
					_self.doSearch();
				}
			};
		}
	};

	this.getValue = function() {
		var opts   = jQuery("option:selected", jQuery(selectInput));
		var values = {};
		for(var i = 0; i< opts.length; i++) {
			values[opts[i].value] = jQuery(opts[i]).text();
		}
		return values;
	};
	
	/** Sends request to load items */
	this.loadItems = function(startsWith) {
		jQuery.ajax({url      : sourceUri + typeId + ".xml?limit&search[]=" + encodeURIComponent(startsWith),
				type     : "get",
				complete : function(r, t) { _self.updateItems(r);} });
	};
	this.loadItemsAll = function() {
		jQuery.ajax({url      : sourceUri + typeId + ".xml?allow-empty",
				type     : "get",
				complete : function(r, t) { _self.updateItemsAll(r);} });
	};
	this.updateItemsAll = function(response) {
		if(response.responseXML.getElementsByTagName('empty').length) {
			if(textInput) {
				textInput.onkeyup = function(keyEvent) {
					var code = keyEvent ? keyEvent.keyCode : event.keyCode;
					switch(code) {
						case 38 : // Arrow up
							{
								if(suggestItems.length && (suggestIndex > 0 || suggestIndex == null )) {
									highlightSuggestItem((suggestIndex === null) ? (suggestItems.length - 1) : (suggestIndex - 1) );
								}
								break;
							}
						case 40 : // Arrow down
							{
								if(suggestItems.length && (suggestIndex < (suggestItems.length - 1) || suggestIndex == null )) {
									highlightSuggestItem((suggestIndex === null) ? 0 : (suggestIndex + 1) );
								}
								break;
							}
						case 13 : // Enter
							{
								addHighlitedItem();
								hideSuggest();
								break;
							}
						case 27 :
							{
								hideSuggest();
								break;
							}
						default :
							{
								clearTimeout(timeHandler);
								timeHandler = setTimeout(function(){_self.doSearchAjax();}, 500);
							}
					}
				};
				textInput.onblur  = function() {
					if(suggestDiv) {
						if(mouseX < parseInt(suggestDiv.style.left) ||
							mouseX > (parseInt(suggestDiv.style.left) + parseInt(suggestDiv.offsetWidth)) ||
							mouseY < parseInt(suggestDiv.style.top) ||
							mouseY > (parseInt(suggestDiv.style.top) + parseInt(suggestDiv.offsetHeight)) )
						 {
							hideSuggest();
						 }
					}
				};
				var total = response.responseXML.getElementsByTagName('empty')[0].getAttribute('total');
				if(!useSearchOption) {
					useSearchOption = new Option(' ', '');
					useSearchOption.innerHTML = getLabel('js-relation-total') + total + ". " + getLabel('js-relation-use_search');
					selectInput.insertBefore(useSearchOption, selectInput.firstChild);
				}
			}
			return;
		}
		var items     = response.responseXML.getElementsByTagName('object');
		var selection = [];
		var i = 0;
		for(i = 0; i < selectInput.options.length; i++){
			if(selectInput.options[i].selected) {
				selection.push(selectInput.options[i].value);
			}
		}
		jQuery("option", selectInput).each(function() {
			if (!this.selected || this.value.length===0) {
				jQuery(this).remove();
			}
		});
		if(_prependEmpty) $(selectInput).prepend("<option value=''> </option>");
		for(i = 0; i < items.length; i++) {
			var itemId  = items[i].getAttribute('id');
			var hasItem = false;
			for(var idx in selection) {
				if(selection[idx] == itemId) {
					hasItem = true;
					delete selection[idx];
					break;
				}
			}
			if(!hasItem) {
				var text = items[i].getAttribute('name');
				var opt  = new Option(text, itemId);
				opt.innerHTML = text; // Fix for stupid IE!!!
				selectInput.appendChild(opt);
			}
		}
		if(jQuery.browser.msie) {
			var d = selectInput.style.display;
			selectInput.style.display = 'none';
			selectInput.style.display = d;
		}
	};
	this.updateItems = function(response) {
		suggestIndex = null;
		suggestItems = response.responseXML.getElementsByTagName('object');
		if(!suggestItems.length) return;
		var ul    = null;
		if(!suggestDiv) {
			suggestDiv = document.createElement('div');
			suggestDiv.className      = 'relationAutosuggest';
			var pos =  jQuery(textInput).offset();
			suggestDiv.style.position = 'absolute';
			suggestDiv.style.zIndex = 1050;
			suggestDiv.style.width  = textInput.clientWidth + "px";
			suggestDiv.style.top    = (pos.top + textInput.offsetHeight) + "px";
			suggestDiv.style.left   = pos.left + "px";
			ul = document.createElement('ul');
			suggestDiv.appendChild(ul);
			document.body.appendChild(suggestDiv);
		}
		suggestDiv.style.display = '';
		jQuery(document).on('mousemove', documentMouseMoveHandler);
		ul = suggestDiv.firstChild;
		while(ul.firstChild) {
			ul.removeChild(ul.firstChild);
		}
		for(i = 0; i < suggestItems.length; i++) {
			var text = suggestItems[i].getAttribute('name');
			var li   = document.createElement('li');
			li.innerHTML = text;
			li.onmouseover = function() { highlightSuggestItem(this.suggestIndex); };
			li.onmouseout  = function() { this.className  = ''; };
			li.onclick     = function() { addHighlitedItem(); hideSuggest(); };
			li.suggestIndex = i;
			ul.appendChild(li);
		}
	};
	var documentMouseMoveHandler = function(e) {
		if(!e) {
			mouseX = event.clientX + document.body.scrollLeft;
			mouseY = event.clientY + document.body.scrollTop;
		} else {
			mouseX = e.pageX;
			mouseY = e.pageY;
		}
		return true;
	};
	/** Add new item to list */
	this.addItem = function(_text, _value) {
		if(!(_text && _text.length) && !(textInput && textInput.value.length)) {
			return;
		}
		clearSearch();
		removeGroups();
		if(!selectInput.multiple && addedOption && !_text && !_value) {
			addedOption.innerHTML  = (_value ? '' : '&rarr;&nbsp;&nbsp;') + textInput.value;
			addedOption.value      = _value ? _value : textInput.value;
			selectInput.selectedIndex = 0;
		} else {
			addedOption = new Option(_text ? _text : textInput.value, _value ? _value : textInput.value);
			addedOption.innerHTML  = (_value ? '' : '&rarr;&nbsp;&nbsp;') + (_text ? _text : textInput.value);
			if(selectInput.options.length) {
				selectInput.insertBefore(addedOption, selectInput.firstChild)
			} else {
				selectInput.appendChild(addedOption);
			}
		}
		textInput.value      = '';
		addedOption.selected = true;
		if(jQuery.browser.msie) {
			setTimeout(function(){ addedOption.selected = false; addedOption.selected = true; }, 20);
		}
	};
	var highlightSuggestItem = function(itemIndex) {
		if(suggestDiv.style.display != 'none') {
			var list = suggestDiv.firstChild;
			var oldHighlited = list.childNodes.item(suggestIndex);
			if(oldHighlited) {
				oldHighlited.className = '';
			}
			list.childNodes.item(itemIndex).className    = 'active';
			suggestIndex = itemIndex;
		}
	};
	var addHighlitedItem = function() {
		if(suggestDiv && suggestDiv.style.display != 'none' && suggestIndex !== null) {
			var text  = suggestItems[suggestIndex].getAttribute('name');
			var value = suggestItems[suggestIndex].getAttribute('id');
			var found = false;
			for(var i = 0; i < selectInput.options.length; i++) {
				if(selectInput.options[i].value == value) {
					found = true;
					selectInput.options[i].selected = true;
					break;
				}
			}
			if(!found) {
				_self.addItem(text, value);
			}
		} else if(textInput.value.length && addButton) {
			_self.addItem();
		}
	};
	var hideSuggest = function() {
		if(suggestDiv && suggestDiv.style.display != 'none') {
			suggestDiv.style.display = 'none';
			jQuery(document).off('mousemove', documentMouseMoveHandler);
		}
	};
	/** Process a search */
	this.doSearch = function() {
		var text = textInput.value.toLowerCase();
		clearSearch();
		if(text == '') {
			if(selectInput.multiple) removeGroups();
			return;
		}
		for(var i=0; i < selectInput.options.length; i++) {
			var optionText  = selectInput.options[i].text;
			var optionText2 = optionText.replace(/^.\s\s/, '');
			if(optionText.substring(0, text.length).toLowerCase()  === text ||
				optionText2.substring(0, text.length).toLowerCase() === text) {
				if(selectInput.multiple) {
					if(selectInput.firstChild.nodeName.toLowerCase() != 'optgroup') {
						createGroups();
						searchGroup	= selectInput.firstChild;
						itemsGroup  = selectInput.lastChild;
					}
					var currentItem = selectInput.options[i];
					if(currentItem.parentNode == searchGroup) continue;
					currentItem.oldPrevSibling = currentItem.previousSibling;
					itemsGroup.removeChild(currentItem);
					searchGroup.appendChild(currentItem);
					if(searchGroup.childNodes.length == 5) return;
				} else {
					selectInput.selectedIndex = i;
					return;
				}
			}
		}
	};
	/** Process a search with ajax */
	this.doSearchAjax = function() {
		if(textInput.value) {
			this.loadItems(textInput.value);
		}
	};
	
	var createGroups = function() {
		var searchGroup   = document.createElement('optgroup');
		searchGroup.label = 'Search results';
		var itemsGroup    = document.createElement('optgroup');
		itemsGroup.label  = '------------------------------------------------';
		while(selectInput.firstChild) {
			var child = selectInput.firstChild;
			selectInput.removeChild(child);
			itemsGroup.appendChild(child);
		}
		selectInput.appendChild(searchGroup);
		selectInput.appendChild(itemsGroup);
	};
	
	var removeGroups = function() {
		if(selectInput.firstChild && selectInput.firstChild.nodeName.toLowerCase() == 'optgroup') {
			selectInput.removeChild(selectInput.firstChild);
			var itemsGroup = selectInput.firstChild;
			while(itemsGroup.firstChild) {
				var child = itemsGroup.firstChild;
				itemsGroup.removeChild(child);
				selectInput.appendChild(child);
			}
			selectInput.removeChild(itemsGroup);
		}
	};
	
	var clearSearch = function() {
		if(selectInput.firstChild && selectInput.firstChild.nodeName.toLowerCase() == 'optgroup') {
			var searchGroup	= selectInput.firstChild;
			var itemsGroup  = selectInput.lastChild;
			while(searchGroup.firstChild) {
				var child = searchGroup.firstChild;
				searchGroup.removeChild(child);
				if(child.oldPrevSibling !== undefined || child.oldPrevSibling == null) {
					if(child.oldPrevSibling && child.oldPrevSibling.nextSibling) {
						itemsGroup.insertBefore(child, child.oldPrevSibling.nextSibling);
					} else if(child.oldPrevSibling === null) {
						itemsGroup.insertBefore(child, itemsGroup.firstChild);
					} else {
						itemsGroup.appendChild(child);
					}
					//delete child['oldPrevSibling'];
					child.oldPrevSibling = undefined;
				}
			}
		}
	};
	// Init our control
	init();
}

function symlinkControl(_id, _module, _types, _options, hierarchy_types, _mode) {
	hierarchy_types  = (hierarchy_types instanceof Array) ? hierarchy_types : [hierarchy_types];
	var _self      = this;
	var id         = _id;
	var types      = (_types instanceof Array) ? _types : [_types];
	var typesStr   = (types) ? '&hierarchy_types=' + types.join('-') : '';
	var htypesStr   = (hierarchy_types instanceof Array) ? '&hierarchy_types=' + hierarchy_types.join(',') : '';
	var module     = _module || null;
	var container  = null;
	var textInput  = null;
	var treeButton = null;
	var pagesList  = null;
	var suggestDiv = null;
	var suggestItems = null;
	var suggestIndex = null;
	var mouseX       = 0;
	var mouseY       = 0;
	let itemsCount   = 0;
	if(!_options) _options = {};
	/*
	 * Описание опций:
	 * iconsPath	   - корневая директория с иконками
	 * fadeColorStart  - цвет начала анимации исчезновения элемента
	 * fadeColorEnd	   - цвет конца анимации исчезновения элемента
	 * inputName	   - имя поля поиска элементов
	 * noImages		   - Не использовать изображения для кнопок
	 * treeBaseURL	   - URL страницы, на которой будет отрисовано дерево
	 * rootId		   - ID корневого элемента, от которой может быть построено дерево
	 * popupTitle	   - Заголовок всплывающего (popup) окна выбора элемента
	 * showSuggestType - Отображать тип элементов при их поиске
	 * cutSuggestNames - Обрезать названия найденных элементов
	 * suggestDivWidth - Ширина блока, в котором отображаются найденные элементы
	 */
	var iconBase		= _options['iconsPath']      || '/styles/skins/modern/design/img/tree/';
	var fadeClrStart	= _options['fadeColorStart'] || [255,   0,   0];
	var fadeClrEnd		= _options['fadeColorEnd']   || [255, 255, 255];
	var inputName		= _options['inputName']      || ('symlinkInput' + id);
	var noImages		= _options['noImages']       || false;
	var treeBaseURL		= _options['treeURL'] || "/styles/common/js/tree.html";
	var rootId			= _options['rootId'];
	var popupTitle		= _options['popupTitle'] || getLabel("js-cms-eip-symlink-choose-element");
	var showSuggestType = typeof(_options['showSuggestType']) === 'undefined' ? true : _options['showSuggestType'];
	var cutSuggestNames	= typeof(_options['cutSuggestNames']) === 'undefined' ? true : _options['cutSuggestNames'];
	var suggestDivWidth	= parseInt(_options['suggestDivWidth']);
	var pagesCache   = {};
	var popupCallback = (_mode ? "&callback=symlinkControlsList." + id + ".onlyOne":"");
	
	var init = function() {
		if(!window.symlinkControlsList) window.symlinkControlsList = {};
		window.symlinkControlsList[id] = _self;
		container = document.getElementById('symlinkInput' + id);
		if(!container) {
			alert('Symlink container #' + id + ' not found');
			return;
		}

		pagesList  = document.createElement('ul');
		container.appendChild(pagesList);
		var bottomContainer = document.createElement('div');
		container.appendChild(bottomContainer);
		textInput = document.createElement('input');
		textInput.setAttribute('placeholder', getLabel('js-cms-eip-symlink-search'));
		bottomContainer.className = 'pick-element';
		bottomContainer.appendChild(textInput);
		var treeIconWidth  = 18,
			extraSpace	   = 28;
		textInput.style.width = bottomContainer.parentNode.offsetWidth - (treeIconWidth + extraSpace) + 'px';
		textInput.style.minWidth = bottomContainer.parentNode.offsetWidth - (treeIconWidth + extraSpace) + 'px';
		treeButton = noImages ? document.createElement('input') : document.createElement('img');
		bottomContainer.appendChild(treeButton);

		textInput.type  = 'text';
		
		if(noImages) {
			treeButton.type = 'button';
			treeButton.value = '╘';
		} else {
			treeButton.src    = "/styles/skins/modern/design/img/tree.png" ;
			treeButton.height = "18";
		}
		treeButton.className = 'treeButton';

		treeButton.onclick = function() {			
			jQuery.openPopupLayer({
				name   : "Sitetree",
				title  : popupTitle,
				width  : 620,
				height : 335,
				url    : treeBaseURL + "?id=" + id + (module ? "&module=" + module : "" ) + 
						 htypesStr + (window.lang_id ? "&lang_id=" + window.lang_id : "") + 
						 (rootId ? "&root_id=" + rootId : "") + popupCallback
			});
		};

		pagesList.className = 'pageslist';

		textInput.onkeypress = function(e) {
			var keyCode = e ? e.keyCode : window.event.keyCode;
			if(keyCode == 13) return false;
		};

		textInput.onkeyup = function(e) {
			var keyCode = e ? e.keyCode : window.event.keyCode;
			switch(keyCode) {
				case 38 : // Arrow up
					{
						if(suggestItems.length && (suggestIndex > 0 || suggestIndex == null )) {
							highlightSuggestItem((suggestIndex === null) ? (suggestItems.length - 1) : (suggestIndex - 1) );
						}
						break;
					}
				case 40 : // Arrow down
					{
						if(suggestItems.length && (suggestIndex < (suggestItems.length - 1) || suggestIndex == null )) {
							highlightSuggestItem((suggestIndex === null) ? 0 : (suggestIndex + 1) );
						}
						break;
					}
				case 13 : // Enter
					{
						addHighlitedItem();
						hideSuggest();
						return false;
						break;
					}
				case 27 :
					{
						hideSuggest();
						break;
					}
				default :
					{

						_self.doSearch();
					}
			}
		};
		textInput.onblur  = function() {
					if(suggestDiv) {
						if(mouseX < parseInt(suggestDiv.style.left) ||
						   mouseX > (parseInt(suggestDiv.style.left) + parseInt(suggestDiv.offsetWidth)) ||
						   mouseY < parseInt(suggestDiv.style.top) ||
						   mouseY > (parseInt(suggestDiv.style.top) + parseInt(suggestDiv.offsetHeight)) )
						 {
							hideSuggest();
						 }
					}
				}
	};

	this.loadItems = function(searchText) {
		jQuery.ajax({
			url      : "/admin/content/load_tree_node.xml?limit&domain_id[]=" + 
					   (window.domain_id ? window.domain_id : '1') + typesStr + 
					   (window.lang_id ? "&lang_id=" + window.lang_id : "") + 
					   (rootId ? "&rel=" + rootId : "") +
					   "&search-all-text[]=" + encodeURIComponent(searchText),
			type     : "get",
			complete : function(r,t) { _self.updateItems(r); } 
		});
	};

	this.onlyOne = function(pageId, name, href, basetype) {
		jQuery.closePopupLayer("Sitetree");
		if (confirm(getLabel('js-island-change-symlink-warning'))) {
			jQuery('a.button', pagesList).trigger('click');
			_self.addItem(pageId, name, basetype, href);
			jQuery('form input[name="save-mode"]:first').trigger('click');
		}
	}

	this.updateItems = function(response) {
		var eip_mode = (jQuery('html.u-eip').length > 0);
		var elements = null;
		suggestIndex = null;
		
		elements = response.responseXML.getElementsByTagName('page');
		if (!elements.length) {
			return;
		}
		
		suggestItems = elements;
		var tmp = [];
		for(var i=0; i<suggestItems.length; i++) {
			if(pagesCache[suggestItems[i].getAttribute('id')]) continue;
			tmp[tmp.length] = suggestItems[i];
		}
		suggestItems = tmp;
		var ul    = null;
		if(!suggestDiv) {
			suggestDiv = document.createElement('div');
			suggestDiv.className      = 'symlinkAutosuggest';
			var pos = jQuery(textInput).offset();
			suggestDiv.style.position = 'absolute';
			suggestDiv.style.zIndex = 1100;
			
			suggestDiv.style.width  = textInput.clientWidth + "px";
			if (!isNaN(suggestDivWidth)) {
				suggestDiv.style.width  = suggestDivWidth + "px";
			} 
			
			suggestDiv.style.top    = (pos.top + textInput.offsetHeight) + "px";
			suggestDiv.style.left   = pos.left + "px";
			if (eip_mode) {
				suggestDiv.style.backgroundColor = 'white';
				suggestDiv.style.border = '1px solid #ccc';
			}
			ul = document.createElement('ul');
			suggestDiv.appendChild(ul);
			document.body.appendChild(suggestDiv);
		}
		showSuggest();
		jQuery(document).on('mousemove', documentMouseMoveHandler);
		ul = suggestDiv.firstChild;
		while(ul.firstChild) {
			ul.removeChild(ul.firstChild);
		}
		for(i = 0; i < suggestItems.length; i++) {
			if(pagesCache[suggestItems[i].getAttribute('id')]) continue;
			var name = getElementText(suggestItems[i].getElementsByTagName('name')[0]);
			var type = getElementText(suggestItems[i].getElementsByTagName('basetype')[0]);
			var link =  suggestItems[i].getAttribute('link');
			var li   = document.createElement('li');
			var span = document.createElement('span');
			var a    = document.createElement('a');
			li.title = name;
			
			if (cutSuggestNames) {
				if(name.length > 20) {
					name = name.substr(0, 20) + '...';
				}
			}
			
			if(link.length > 55) link = link.substr(0, 55) + '...';
			li.appendChild(document.createTextNode(name));			
			if (showSuggestType) {
				li.appendChild(span);
			}
			span.appendChild(document.createTextNode(' (' + type + ')'));
			if (!eip_mode) {
				li.appendChild(document.createElement('br'));
				li.appendChild(a);
				a.appendChild(document.createTextNode(link));
				a.href = link;
				a.target = "_blank";
			}
			else {
				span.style.display = 'block';
				li.className = 'symlink-item-delete';
				li.style.padding = '3px';
			}
			li.onmouseover = function() {
				highlightSuggestItem(this.suggestIndex);
			};
			li.onclick     = function() {
				addHighlitedItem();
				hideSuggest();
			};
			li.suggestIndex = i;
			ul.appendChild(li);
		}
	};

	this.doSearch = function() {
		var text = textInput.value;
		_self.loadItems(text);
	};

	var highlightSuggestItem = function(itemIndex) {
		var eip_mode = (jQuery('html.u-eip').length > 0);
		if(suggestDiv.style.display != 'none') {
			var list = suggestDiv.firstChild;
			var oldHighlited = list.childNodes.item(suggestIndex);
			if(oldHighlited) {
				if (eip_mode) oldHighlited.style.backgroundColor = '';
				else oldHighlited.className = '';
			}
			if (eip_mode) list.childNodes.item(itemIndex).style.backgroundColor = '#ceeaf6';
			else list.childNodes.item(itemIndex).className    = 'active';
			suggestIndex = itemIndex;
		}
	};

	var addHighlitedItem = function() {
		if(suggestDiv && suggestDiv.style.display != 'none' && suggestIndex !== null) {
			var id    = suggestItems[suggestIndex].getAttribute('id');
			var name  = getElementText(suggestItems[suggestIndex].getElementsByTagName('name')[0]);
			var aname = suggestItems[suggestIndex].getAttribute('link');
			var type  = suggestItems[suggestIndex].getElementsByTagName('basetype')[0];
			var t     = '';
			var module = (t = type.getAttribute('module')) ? t : '';
			var method = (t = type.getAttribute('method')) ? t : '';
			_self.addItem(id, name, [module,method], aname);
		}
	};

	/** Добавляет в контейнер симлинка поле-заглушку без значения */
	this.appendStub = function() {
		let input = document.createElement('input');
		input.type  = 'hidden';
		input.name  = inputName;
		input.name  = inputName.replace(/\[]$/, '');
		_self.stub = input;
		_self.container.parentNode.insertBefore(input, container);
	};

	/** Удаляет поле-заглушку */
	this.delStub = function() {
		if (_self.stub) {
			_self.stub.remove();
		}
	};

	this.addItem = function(pageId, name, basetype, href) {
		this.delPlaceHolder();
		if(pagesCache[pageId] !== undefined) return;
		var eip_mode = (jQuery('html.u-eip').length > 0);
		var page  = document.createElement('li');
		var text  = document.createElement('span');
		var link  = document.createElement('a');
		var btn   = document.createElement('a');
		var input = document.createElement('input');
		var _self = this;
		input.type  = 'hidden';
		input.name  = inputName;
		input.value = pageId;
		btn.input  = input;
		link.href  = href;

		itemsCount++;
		_self.delStub();
		
		if (noImages) {
			btn.appendChild( document.createTextNode('[x]') );
		}
		else {
			var btnImage = document.createElement('img');
			btnImage.src = iconBase + 'symlink_delete.png';
			btnImage.alt = 'delete';
			if (eip_mode) btnImage.className = 'symlink-item-delete';
			btn.appendChild(btnImage);
		}
		btn.href = 'javascript:void(0);';
		if (eip_mode) {
			btn.style.marginRight = '5px';
		}
		else btn.className = 'button';
		btn.onclick = function() {
						this.input.parentNode.removeChild(this.input);
						pagesList.removeChild(this.parentNode);
						_self.addPlaceHolder();
						delete pagesCache[pageId];

						itemsCount--;
						if (itemsCount === 0) {
							_self.appendStub();
						}
					  };
		text.dataset.basetype = basetype[0] + " " + basetype[1];
		if (eip_mode) {
			text.style.marginLeft = '5px';
		}
		text.appendChild(document.createTextNode(name));
		link.appendChild(document.createTextNode(href));
		
		if(!noImages) {
			var icon  = document.createElement('img');
			icon.src   = iconBase + 'ico_' + basetype[0] + '_' + basetype[1] + '.png';
			page.appendChild(icon);
		}
		page.appendChild(text);
		var iconsWidth = 32,
			extraSpace = 38;
		text.style.maxWidth = pagesList.parentNode.offsetWidth - (iconsWidth + extraSpace) + 'px';
		
		page.appendChild(btn);
		if (eip_mode) {
			delete link;
		} else {
			page.appendChild(link);
		}
		pagesList.appendChild(page);
		container.parentNode.insertBefore(input, container);
		page.style.backgroundColor = makeHexRgb(fadeClrStart);
		page.startColor = fadeClrStart;
		page.endColor   = fadeClrEnd;
		page.pname      = name;
		page.fade		= fader;
		setTimeout(function(){page.fade()}, 2000);
		pagesCache[pageId] = true;
		if (jQuery('#eip_page').length) {
			frameElement.height = (jQuery('#eip_page').height() > 500) ? 500 : jQuery('#eip_page').height();
		}
	};
	
	this.delPlaceHolder = function () {
		if (jQuery('.eip-placeholder', pagesList).length >= 1) {
			jQuery('.eip-placeholder', pagesList).remove();
		}
	};

	this.addPlaceHolder = function (text) {
		var element = document.createElement('li'),
				_text = text || getLabel("js-cms-eip-symlink-no-elements"),
				holderClass = 'eip-placeholder';
		element.className = holderClass;
		element.appendChild(document.createTextNode(_text));

		if (jQuery('li', pagesList).length < 1) {
			pagesList.appendChild(element);
		}
	};

	var fader = function() {
		if(this.fadeColor == undefined) {
			this.fadeColor    = [];
			this.fadeColor[0] = this.startColor[0];
			this.fadeColor[1] = this.startColor[1];
			this.fadeColor[2] = this.startColor[2];
		}
		if(Math.round(this.fadeColor[0] + this.fadeColor[1] + this.fadeColor[2]) ==
		   Math.round(this.endColor[0] + this.endColor[1] + this.endColor[2])) return;
		this.fadeColor[0] += (this.endColor[0] - this.startColor[0]) / 50;
		this.fadeColor[1] += (this.endColor[1] - this.startColor[1]) / 50;
		this.fadeColor[2] += (this.endColor[2] - this.startColor[2]) / 50;
		this.style.backgroundColor = makeHexRgb(this.fadeColor);
		var _p = this;
		setTimeout(function(){_p.fade();}, 20);
	};

	var showSuggest = function() {
		if(suggestDiv) {
			var pos = jQuery(textInput).offset();
			suggestDiv.style.width  = textInput.clientWidth;
			suggestDiv.style.top    = pos.top + textInput.offsetHeight;
			suggestDiv.style.left   = pos.left;
			suggestDiv.style.display = '';
		}
	};

	var hideSuggest = function() {
		if(suggestDiv && suggestDiv.style.display != 'none') {
			suggestDiv.style.display = 'none';
			jQuery(document).off('mousemove', documentMouseMoveHandler);
		}
	};

	var documentMouseMoveHandler = function(e) {
		if(!e) {
			mouseX = event.clientX + document.body.scrollLeft;
			mouseY = event.clientY + document.body.scrollTop;
		} else {
			mouseX = e.pageX;
			mouseY = e.pageY;
		}
		return true;
	};

	var getElementText = function(element) {		
		return (element.firstChild && element.firstChild.nodeType == 3) ? element.firstChild.nodeValue : element.nodeValue;
	};

	// initialize
	init();
};
var hex = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
function makeHexRgb(rgb) {
	var result = '';
	for(var i = 0; i < 3; i++) {
		result = result + hex[Math.floor(rgb[i] / 16)] + hex[Math.floor(rgb[i] % 16)];
	}
	return '#' + result;
}
