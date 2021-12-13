//-------------------------------------------------------------------------
// Transliteration functions
//-------------------------------------------------------------------------
var rus2eng   = {"А":"A", "Б":"B", "В":"V", "Г":"G", "Д":"D", "Е":"E", "Ё":"YO", "Ж":"ZH", "З":"Z", "И":"I", "Й":"J", "К":"K", "Л":"L", "М":"M", "Н":"N", "О":"O", "П":"P", "Р":"R", "С":"S", "Т":"T", "У":"U", "Ф":"F", "Х":"H", "Ц":"C", "Ч":"CH", "Ш":"SH", "Щ":"SHCH", "Ъ":"", "Ы":"Y", "Ь":"", "Э":"EH", "Ю":"YU", "Я":"YA",
				 "а":"a", "б":"b", "в":"v", "г":"g", "д":"d", "е":"e", "ё":"yo", "ж":"zh", "з":"z", "и":"i", "й":"j", "к":"k", "л":"l", "м":"m", "н":"n", "о":"o", "п":"p", "р":"r", "с":"s", "т":"t", "у":"u", "ф":"f", "х":"h", "ц":"c", "ч":"ch", "ш":"sh", "щ":"shch", "ъ":"", "ы":"y", "ь":"", "э":"eh", "ю":"yu", "я":"ya"};
var eng2rus   = {"А":"A", "YA":"Я"};
var rus2engRE = /(?:[АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя])/g;
var eng2rusRE = /(?:YA|A)/g;

function trCallbackRu(str){
        return rus2eng[str];
}
function trCallbackEn(str){
        return eng2rus[str];
}

/**
 * Transliterate russian string
 * @param str string to transliterate
 * @return String
 */
function transliterateRu(str) {
	return str.replace(rus2engRE, trCallbackRu);
}

/**
 * Transliterate romanian string to russain
 * @param str string to transliterate
 * @return String
 */
function transliterateEn(str) {
	return str; // ToDo: write proper regexp
}

/**
 * Encode string to base64
 * @param str string to encode
 * @return String base64 encoded string
 */
function base64encode(str) {
		var sWinChrs     = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя';
		var sBase64Chrs  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
		var arrBase64    = sBase64Chrs.split('');

		var a = new Array();
		var i = 0;
		for(i = 0; i < str.length; i++) {
			var cch = str.charCodeAt(i);
			if (cch > 127) {
				cch = sWinChrs.indexOf(str.charAt(i)) + 163;
				if(cch < 163) continue;
			}
			a.push(cch);
		}
		var s    = new Array();
		var lPos = a.length - a.length % 3;
		var t = 0;
		for (i=0; i<lPos; i+=3) {
			t = (a[i]<<16) + (a[i+1]<<8) + a[i+2];
			s.push(arrBase64[(t>>18)&0x3f] + arrBase64[(t>>12)&0x3f] + arrBase64[(t>>6)&0x3f] + arrBase64[t&0x3f] );
		}
		switch (a.length-lPos) {
			case 1 :
					t = a[lPos]<<4;
					s.push(arrBase64[(t>>6)&0x3f] + arrBase64[t&0x3f] + '==');
					break;
			case 2 :
					t = (a[lPos]<<10)+(a[lPos+1]<<2);
					s.push(arrBase64[(t>>12)&0x3f] + arrBase64[(t>>6)&0x3f] + arrBase64[t&0x3f] + '=');
					break;
		}
		return s.join('');
}

//-------------------------------------------------------------------------
// Cookie helpers
//-------------------------------------------------------------------------

var parsedCookies = null;

/**
 * Set cookie value
 * @param name cookie name
 * @param value cookie value
 * @param expires cookie expire time in seconds
 */
function setCookie(name, value, expires) {
	var e = "";
	if (expires) {
			var d = new Date();
			d.setTime(d.getTime() + expires);
			e = "; expires=" + d.toGMTString();
	}
	if(value === null) {
		e = "; expires=Thu, 01-Jan-1970 00:00:01 GMT";
	}
	document.cookie = name + "=" + value + e + "; path=/";
	if(parsedCookies) {
		if(value != null)
			parsedCookies[name] = value;
		else
			delete parsedCookies[name];
	}
}

/**
 * Get cookie value
 * @param name cookie name
 * @param nocache use cache
 * @return string cookie value
 */
function getCookie(name, nocache) {
	if (typeof(nocache) == 'undefined') {
		nocache = false;
	}
	if(!parsedCookies || nocache) {
		parsedCookies = {};
		var pairs = document.cookie.split(";");
		for(var i=0; i<pairs.length; i++) {
			var pair = pairs[i].split("=");
			parsedCookies[ pair[0].replace(/^\s/, "") ] = pair[1];
		}
	}
	return parsedCookies[name] || null;
}

/**
 * Возвращает get параметры
 * @returns {Object}
 */
function getArgumentList() {
	var argumentList = new Object();
	var query = location.search.substring(1);
	var pairs = query.split("&");
	for (var i = 0; i < pairs.length; i++) {
		var pos = pairs[i].indexOf('=');

		if (pos === -1) {
			continue;
		}

		var name = pairs[i].substring(0,pos);
		var value = pairs[i].substring(pos+1);
		argumentList[name] = unescape(value);
	}
	return argumentList;
}

/**
 * Возвращает максимальный размер загружаемого файла
 * @returns {number}
 */
function getMaxFileSize() {
	var defaultMaxFileSize = 83886080;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/udata/data/getAllowedMaxFileSize', false);
	xhr.send();

	if (xhr.status != 200) {
		return defaultMaxFileSize;
	}

	var maxFileSize = /<!\[CDATA\[(.*)]]>/.exec(xhr.responseText)[1] * 1024 * 1024 ;

	return (typeof(maxFileSize) == 'number') ? maxFileSize : defaultMaxFileSize;
}

/**
 * Возвращает csrf токен
 * @returns {String}
 */
function getCsrfToken() {
	if (window.csrfProtection && window.csrfProtection.getToken) {
		return csrfProtection.getToken();
	}

	if (parent && parent.csrfProtection && parent.csrfProtection.getToken) {
		return parent.csrfProtection.getToken();
	}

	if (parent && parent.uAdmin && parent.uAdmin.csrf) {
		return parent.uAdmin.csrf;
	}

	return '';
}

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


function fileControl(name, options) {
	var _self      = this;
	var container  = document.getElementById('fileControlContainer_' + name);
	var select     = null;
	var inputName  = options.inputName  || name;
	var imagesOnly = options.imagesOnly || false;
	var videosOnly = options.videosOnly || false;
	var folderHash = options.folderHash;
	var fileHash   = options.fileHash;
	var lang   = options.lang || 'ru';
	var fm   = options.fm || 'flash';
	var cwd        = '.';
	var defaultCwd = '.';
	var loaded     = false;

	var construct = function() {
		select    = document.createElement('select');
		container.appendChild(select);

		select.onmouseover = function () { if(!loaded) loadListing(); };

		window['fileControlSelect_' + name] = select;

		select.id      = 'fileControlSelect_' + name;
		select.name    = inputName;
		select.control = _self;
		select.className = 'fileControlSelect';

		if ((navigator.userAgent.toLowerCase().indexOf("firefox") != -1) || (navigator.userAgent.toLowerCase().indexOf("chrome") != -1)) {
			select.addEventListener( "drop" , doDrop, false);
			select.addEventListener( "dragexit" , dragExit, false);
			select.addEventListener( "dragover" , dragExit, false);
			jQuery(select).addClass('dragNDrop');
		}

		var option = document.createElement('option');
		option.innerHTML = '';
		option.value     = '';
		option.selected  = true;
		select.appendChild(option);

		var img   = document.createElement('img');
		img.src   = "/styles/common/images/browse_folder.png";
		var a     = document.createElement('a');
		a.href	  = 'javascript:void(0);';
		a.onclick = function() {
			var functionName = 'show' + fm + 'FileBrowser';
			eval(functionName + '(select.id, defaultCwd, imagesOnly, videosOnly, folderHash, fileHash, lang)');
		};
		a.appendChild(img);

		container.appendChild(a);
	};

	function doDrop(event) {
		dragExit(event);

		var dt = event.dataTransfer;
		var files = dt.files;

		var file = files[0];
		jQuery.ajax({
			url: "/admin/filemanager/uploadfile/?filename=" + file.name + "&csrf=" + uAdmin.csrf + "&folder=" + base64encode(cwd.substr(1)) + (imagesOnly ? "&showOnlyImages=1" : "" ) + (videosOnly ? "&showOnlyVideos=1" : ""),
			type: "POST",
			processData: false,
			data: file,
			complete : function(r, t) {
				_self.updateItem(r);
			}
		});
	}

	function dragExit(event) {
		event.stopPropagation();
		event.preventDefault();
	}

	var showflashFileBrowser = function(selectId, folder, imageOnly, videoOnly, folder_hash, file_hash, lang) {
		var qs    = 'id='+selectId;
		var index = 0;
		var file  = cwd.replace(/^\.\//, "/") + ((index = select.value.lastIndexOf('/')) != -1 ? select.value.substr(index) : select.value );
		qs = qs + '&file=' + file;
		if(folder) {
			qs = qs + '&folder=' + folder;
		}
		if(imageOnly) {
			qs = qs + '&image=1';
		}
		if(videoOnly) {
			qs = qs + '&video=1';
		}
		jQuery.openPopupLayer({
			name   : "Filemanager",
			title  : getLabel('js-file-manager'),
			width  : 1200,
			height : 600,
			url    : "/styles/common/other/filebrowser/umifilebrowser.html?"+qs
		});
	};

	var showelfinderFileBrowser = function(selectId, folder, imageOnly, videoOnly, folder_hash, file_hash, lang) {
		var qs    = 'id='+selectId;
		var index = 0;
		var file  = cwd.replace(/^\.\//, "/") + ((index = select.value.lastIndexOf('/')) != -1 ? select.value.substr(index) : select.value );
		qs = qs + '&file=' + file;
		if(folder) {
			qs = qs + '&folder=' + folder;
		}
		if(imageOnly) {
			qs = qs + '&image=1';
		}
		if(videoOnly) {
			qs = qs + '&video=1';
		}
		if(typeof(folder_hash) != 'undefined') {
			qs = qs + '&folder_hash=' + folder_hash;
		}
		if(typeof(file_hash) != 'undefined') {
			qs = qs + '&file_hash=' + file_hash;
		}
		if(lang) {
			qs = qs + '&lang=' + lang;
		}
		$.openPopupLayer({
			name   : "Filemanager",
			title  : getLabel('js-file-manager'),
			width  : 1200,
			height : 600,
			url    : "/styles/common/other/elfinder/umifilebrowser.html?"+qs
		});
		
		var filemanager = jQuery('div#popupLayer_Filemanager div.popupBody');
		if (!filemanager.length) {
			filemanager = jQuery(window.parent.document.getElementById('popupLayer_Filemanager')).find('div.popupBody');	
		}
		
		var options = '<div id="watermark_wrapper"><label for="add_watermark">';
		options += getLabel('js-water-mark');
		options += '</label><input type="checkbox" name="add_watermark" id="add_watermark"/>';
		options += '<label for="remember_last_folder">';
		options += getLabel('js-remember-last-dir');
		options += '</label><input type="checkbox" name="remember_last_folder" id="remember_last_folder"'
		if (getCookie('remember_last_folder', true)) options += 'checked="checked"';
		options +='/></div>';
		
		filemanager.append(options);
	};

	this.clearItems = function() {
		while(select.options.length) {
			select.options[0].parentNode.removeChild(select.options[0]);
		}
		var option = document.createElement('option');
		option.innerHTML = '';
		option.value     = cwd + '/';
		option.selected  = true;
		select.appendChild(option);
		loaded = false;
	};

	var loadListing = function() {
		loaded = true;
		jQuery.ajax({
			url      : "/admin/filemanager/getfilelist/?folder=" + base64encode(cwd.substr(1)) + (imagesOnly ? "&showOnlyImages=1" : "" ) + (videosOnly ? "&showOnlyVideos=1" : "" ),
			type     : "get",
			complete : function(r, t) {
				_self.updateItems(r);
			}
		});

	};

	this.updateItems = function(response) {
		if(!response.responseXML.getElementsByTagName('empty').length) {

		var files = response.responseXML.getElementsByTagName('file');
		if(!select.options.length) {
			this.add(null, true);
		}
		for(var i=0; i<files.length; i++) {
			this.add(files[i].getAttribute('name'));
		}
		if(jQuery.browser.msie) {
			var d = select.style.display;
			select.style.display = 'none';
			select.style.display = d;
		}
		} else {
			var option = document.createElement('option');
			option.value = '';
			option.disabled = 'disable';
			option.appendChild( document.createTextNode( getLabel('js-files-use_search') ) );
			select.appendChild(option);
		}
	};

	this.setFolder = function(name, isDefault) {
		if(name.indexOf('./') !== 0) { name = '.' + name; }

		// delete ending slash
		var re = new RegExp('[\/]+$', 'g');
		name = (name + '').replace(re, '');

		if(cwd != name) {
			cwd = name;
			this.clearItems();
		}
		if(isDefault != undefined && isDefault) {
			defaultCwd = name;
		}
	};

	this.add = function(name, selected) {
		if(name && !name.length) return;
		if(!name) name = '';
		if(name.lastIndexOf("/") != -1) {
			this.setFolder(name.substr(0, name.lastIndexOf("/")));
			name = name.substr(name.lastIndexOf("/") + 1);
		}
		for(var i=0; i<select.options.length; i++) {
			if(select.options[i].innerHTML == name) {
				if(selected) select.options[i].selected = selected;
				return;
			}
		}
		var option = document.createElement('option');
		option.innerHTML = name;
		option.value     = ((cwd.indexOf("./") != 0) ? '.' : '') + (cwd + '/' + name);
		if(selected != undefined && selected) option.selected  = true;
		select.appendChild(option);
	};

	this.updateItem = function(response) {
		var files = response.responseXML.getElementsByTagName('file');
		if(!select.options.length) {
			this.add(null, true);
		}
		for(var i=0; i<files.length; i++) {
			this.add(files[i].getAttribute('name'), true);
		}
		if(jQuery.browser.msie) {
			var d = select.style.display;
			select.style.display = 'none';
			select.style.display = d;
		}
	};

	construct();
}

(function () {
	var checkPrivateMessages = function () {
		jQuery.get('/umess/inbox/?mark-as-opened=1', function (xml) {
			jQuery('message', xml).each(function (index, node) {
				var title = jQuery(node).attr('title');
				var content = jQuery('content', node).text();
				var date = jQuery('date', node).text();
				var sender = jQuery('sender', node).attr('name');
				
				content = '<p>' + content + '</p><div class="header">' + date + ', ' + sender + '</div>';
				jQuery.jGrowl(content, {
					'header': title,
					'life': 10000
				});
			});
		});
		setTimeout(checkPrivateMessages, 15000);
	};
	//checkPrivateMessages();
})();

var askSupport = function() {

	var h  = '<h3 id="license_message">' + getLabel('js-now-we-will-check-your-domain-key') + '</h3>';
	h += '<div id="ask_support_form">';
	h += '<div id="loading"></div>';
	h += '<span id="show_info" style="">' + getLabel('js-info') + '</span>';
	h += '<div id="info_support">';
	h += '<div class="left"><h4>' + getLabel('js-when-creating-request-remember') + '</h4>';
	h += '<ul>';
	h += '<li>' + getLabel('js-i-hate-multiple-questions') + '</li>';
	h += '<li>' + getLabel('js-i-want-postpone') + '</li>';
	h += '<li>' + getLabel('js-i-hate-doubles') + '</li>';
	h += '<li>' + getLabel('js-no-demo') + '</li>';
	h += '</ul></div>';
	h += '<div class="right"><h4>' + getLabel('js-i-decline-support') + '</h4>';
	h += '<ul>';
	h += '<li>' + getLabel('js-if-somebody-do-something-perverted') + '</li>';
	h += '<li>' + getLabel('js-if-you-have-not-read-manual') + '</li>';
	h += '<li>' + getLabel('js-if-mysql-has-gone-away') + '</li>';
	h += '</ul></div>';
	h += '<div class="clear"></div>';
	h += '</div>';
	h += '<div id="form_body"></div>';
	h += '</div>';
	h += '<div class="eip_buttons">';
	h += '<input id="checkLicenseKey" type="button" value="' + getLabel('js-send') + '" class="ok" style="display:none;"/>';
	h += '<input id="stop_btn" type="button" value="' + getLabel('js-close') + '" class="stop" />';
	h += '<div style="clear: both;"></div>';
	h += '</div>';

	openDialog({
		stdButtons: false,
		title      : getLabel('js-ask-support'),
		text       : h,
		width      : 637,
		OKCallback : function () {

		}
	});
	
	$('#stop_btn').one("click", function() { closeDialog(); });
	
	jQuery(document).ajaxStart(function() {
		jQuery("#loading").html('<img src="/styles/skins/modern/design/img/ajax_loader.gif" alt="Loading..." />');
	});

	jQuery.ajax({
		type: "POST",
		url: "/udata/system/checkLicenseKey/",
		dataType: "xml",

		success: function(doc) {
		
			jQuery("#form_body").html('');
			jQuery("#loading").html('');
			var message = '';
		
			var errors = doc.getElementsByTagName('error');
			if (errors.length) message = errors[0].firstChild.nodeValue;
		
			var notes = doc.getElementsByTagName('notes');	
			if (notes.length) message += notes[0].firstChild.nodeValue;
				
			jQuery("#license_message").html(message);
			
			var forms = doc.getElementsByTagName('form');

			if (forms.length) {
				var user = doc.getElementsByTagName('user');
				
				jQuery("#form_body").html('<form id="support_request" action="" method="post">' + forms[0].firstChild.nodeValue + '</form>');
				
				jQuery('input[name="data[fio_frm]"]').val(user[0].getAttribute('name'));
				jQuery('#email_frm').val(user[0].getAttribute('email'));
				
				var parent = jQuery('input[name="data[cms_domain]"]').parent();
				jQuery('input[name="data[cms_domain]"]').remove();
				
				var select = document.createElement('select');
				select.name = "data[cms_domain]";
				
				var domains = doc.getElementsByTagName('domains');
				
				for(var i = 0; i < domains[0].getElementsByTagName('domain').length; i++) {
					var domain = domains[0].getElementsByTagName('domain');
					domain = domain[i];
					var option   = document.createElement('option');
					option.value = domain.getAttribute('host');
					if (domain.getAttribute('host') == user[0].getAttribute('domain')) option.selected = true;
					option.appendChild(document.createTextNode(domain.getAttribute('host')));
					select.appendChild(option);
				}
				parent.append(select);
				
				jQuery("#attach_file").parent('div').remove();
				jQuery(".button_1").remove();
				jQuery("#checkLicenseKey").attr("style", "");
				
				jQuery("#show_info").attr("style", "display:inline-block;");
				jQuery("#show_info").on('click', function(){
					jQuery("#info_support").toggle('slow');
				});
				
				jQuery.centerPopupLayer();
				
				jQuery('#checkLicenseKey').on("click", function() {
					
					jQuery.ajax({  
						type: "POST",  
						url: "/udata/system/sendSupportRequest/",  
						data: jQuery("#support_request").serializeArray(),
						success: function(data) {
						
							jQuery("#loading").html('');  
							
							var error = data.getElementsByTagName('error');
							if (error.length) {
								message = '<span style="color:red;">' + error[0].firstChild.nodeValue + '</span>';
							}
						
							var success = data.getElementsByTagName('success');	
							if (success.length) {
								message = success[0].firstChild.nodeValue;
								jQuery("#ask_support_form").remove();
								jQuery("#checkLicenseKey").remove();
							}
							
							jQuery("#license_message").html(message);
							
							jQuery.centerPopupLayer();
							
						}  
					});  
					return false;  
					
				});
												
			}
			
			
			return;

		},

		error: function(jqXHR, textStatus, errorThrown) {
			if(window.session) {
				window.session.stopAutoActions();
			}
		}

	});
}

/**
 * Контрол для полей типа "Цвет"
 * В качестве color picker используется Bootstrap Colorpicker
 * http://www.jqueryrain.com/?zETM2MpT
 *
 * @param {HTMLElement|jQuery} element контейнер, содержащий поле для ввода
 * @param {Object} options опции
 *
 * Описание опций:
 * debug - подключает неминифицированную версию JS файла пикера
 * pickerOptions - опции color picker (ссылка на описание сверху)
 */
function colorControl(element, options) {
    var options = options || {};
    var defaults = {
        colorBox: '<span class="color-box"><i></i></span>',
        container: element,
        assets: {
            js: '/styles/common/js/jquery/colorpicker/js/bootstrap-colorpicker.js',
            jsMin: '/styles/common/js/jquery/colorpicker/js/bootstrap-colorpicker.min.js',
            css: '/styles/common/js/jquery/colorpicker/css/bootstrap-colorpicker.min.css'
        }
    };

    var colorPicker = {
        options: {
            defaultValues: {
                component: '.color-box',
                customClass: 'color-picker',
            },
            user: options.pickerOptions || {}
        }
    };

    jQuery.extend(colorPicker.options.user, colorPicker.options.defaultValues);
    jQuery.extend(options, defaults);

    jQuery(options.colorBox).insertAfter(jQuery('input', element));

    if (typeof jQuery.colorpicker !== 'function') {
        if (options.debug) {
            loadLibFiles(options.assets.js, options.assets.css);
        } else {
            loadLibFiles(options.assets.jsMin, options.assets.css);
        }
    }

    jQuery(options.container).colorpicker(colorPicker.options.user);

    function loadLibFiles(js, css) {
        jQuery('<script src="' + js + '" type="text/javascript" charset="utf-8"></script>').appendTo('head');
        jQuery('<link href="' + css + '" rel="stylesheet" charset="utf-8"></script>').appendTo('head');
    }
}