//-------------------------------------------------------------------------
// Transliteration functions
//-------------------------------------------------------------------------
var rus2eng   = {"А":"A", "Б":"B", "В":"V", "Г":"G", "Д":"D", "Е":"E", "Ё":"YO", "Ж":"ZH", "З":"Z", "И":"I", "Й":"J", "К":"K", "Л":"L", "М":"M", "Н":"N", "О":"O", "П":"P", "Р":"R", "С":"S", "Т":"T", "У":"U", "Ф":"F", "Х":"H", "Ц":"C", "Ч":"CH", "Ш":"SH", "Щ":"W", "Ъ":"", "Ы":"Y", "Ь":"", "Э":"E", "Ю":"YU", "Я":"YA",
				 "а":"a", "б":"b", "в":"v", "г":"g", "д":"d", "е":"e", "ё":"yo", "ж":"zh", "з":"z", "и":"i", "й":"j", "к":"k", "л":"l", "м":"m", "н":"n", "о":"o", "п":"p", "р":"r", "с":"s", "т":"t", "у":"u", "ф":"f", "х":"h", "ц":"c", "ч":"ch", "ш":"sh", "щ":"w", "ъ":"", "ы":"y", "ь":"", "э":"e", "ю":"yu", "я":"ya"};
var eng2rus   = {"А":"A", "YA":"Я"};
var rus2engRE = /(?:[А-Яа-я])/g;
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
 * Delete cookie value
 * @param name cookie name
 */
function deleteCookie(name) {
	setCookie(name, "", {
		expires: -1
	})
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
	var idPrefix = typeof _options['idPrefix'] == 'string' ? _options['idPrefix'] : 'symlinkInput';
	var inputWidth =  _options['inputWidth'] || null;
	var pagesCache   = {};
	var popupCallback = (_mode ? "&callback=symlinkControlsList." + id + ".onlyOne":"");
	
	var init = function() {
		if(!window.symlinkControlsList) window.symlinkControlsList = {};
		window.symlinkControlsList[id] = _self;
		var containerId = idPrefix + id;
		_self.container = container = document.getElementById(containerId);

		if(!container) {
			alert('Container #' + containerId + ' not found');
			return;
		}

		pagesList  = document.createElement('ul');
		container.appendChild(pagesList);
		var bottomContainer = document.createElement('div');
		container.appendChild(bottomContainer);

		var iWrapper = document.createElement('div');
		iWrapper.classList.add('layout-col-control');

		textInput = document.createElement('input');
		textInput.setAttribute('placeholder', getLabel('js-cms-eip-symlink-search'));
		bottomContainer.className = 'pick-element layout-row-icon';
		iWrapper.appendChild(textInput);
		bottomContainer.appendChild(iWrapper);
		var treeIconWidth  = 18,
			extraSpace	   = 28;
		textInput.classList.add('default');

		if (inputWidth) {
			textInput.style.width = inputWidth;
			textInput.style.minWidth = 'auto';
		}

		var tiWrapper = document.createElement('div');
		tiWrapper.classList.add('layout-col-icon');
		treeButton = noImages ? document.createElement('input') : document.createElement('img');
		treeButton.classList.add('icon-action');
		tiWrapper.appendChild(treeButton);
		bottomContainer.appendChild(tiWrapper);

		textInput.type  = 'text';
		
		if(noImages) {
			treeButton.type = 'button';
			treeButton.value = '╘';
		} else {
			treeButton.src    = "/styles/skins/modern/design/img/tree.png" ;
			treeButton.height = "18";
		}
		treeButton.className = 'treeButton icon-action';
		var popupName = "Sitetree";

		treeButton.onclick = function() {			
			jQuery.openPopupLayer({
				name   : popupName,
				title  : popupTitle,
				width  : '100%',
				height : 335,
				url    : treeBaseURL + "?id=" + id + (module ? "&module=" + module : "" ) +
						 '&name=' + popupName +
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
		var maxResultsCount = 15;

		jQuery.ajax({
			url: "/admin/content/load_tree_node.xml?per_page_limit=" + maxResultsCount + "&domain_id[]=" +
					   (window.domain_id ? window.domain_id : '1') + typesStr + 
					   (window.lang_id ? "&lang_id=" + window.lang_id : "") + 
					   (rootId ? "&rel=" + rootId : "") +
					   "&search-all-text[]=" + encodeURIComponent(searchText),
			type: "get",
			complete: function(r, t) {
				_self.updateItems(r);
			}
		});
	};

	this.onlyOne = function(pageId, name, href, basetype) {
		jQuery.closePopupLayer("Sitetree");
		if (confirm(getLabel('js-symlink-only-one-warning'))) {
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

		if (text.length > 0) {
			_self.loadItems(text);
		}
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
			var btnImage = document.createElement('i');
			//btnImage.src = iconBase + 'symlink_delete.png';
			btnImage.alt = 'delete';
			btnImage.className = 'small-ico i-remove';
			if (eip_mode) btnImage.classList.add('symlink-item-delete');
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
		return ((element.firstChild && element.firstChild.nodeType == 3) ? element.firstChild.nodeValue : element.nodeValue) || '';
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

function permissionsControl(_containerId) {
	var _self			= this;
	var container		= document.getElementById(_containerId); // Check
	var ownertable      = null;
	var input			= null;
	var permissionCache = {};
	var guestLevel	    = 0;
	var guestRow		= null;
	var suggestDiv		= null;
	var suggestItems	= null;
	var suggestIndex	= null;
	var mouseX			= 0;
	var mouseY			= 0;

	var titles = [getLabel('js-permissions-view'),
				getLabel('js-permissions-edit'),
				getLabel('js-permissions-create'),
				getLabel('js-permissions-delete'),
				getLabel('js-permissions-move')];

	var construct = function() {
		var table  = document.createElement('table');
		var header = document.createElement('tr');
		var th = document.createElement('th');
		th.style.width = "100%";
		th.appendChild( document.createTextNode(' ') );
		header.appendChild(th);
		var images = ["i-see",
				      "i-edit",
					  "i-add",
					  "i-remove",
					  "i-copy-other"];
		for(var i=0; i<titles.length; i++) {
			th = document.createElement('th');
			var img = document.createElement("i");
			img.className = 'small-ico '+images[i];
			img.alt = img.title = titles[i];
			th.appendChild( img );
			th.className = "permissionType";
			header.appendChild(th);
		}

		table.className = "permissionTable btable btable-striped";

		var addRow  = document.createElement('tr');
		var addCell = document.createElement('td');
		addCell.colspan   = 6;
		addCell.setAttribute('colspan','6');
		addCell.className = 'addOwner';
		addRow.appendChild(addCell);

		input = document.createElement('input');
		input.className = 'default';
		input.placeholder = getLabel('js-user-search-placeholder');
		input.style.width = '50%';
		addCell.appendChild(input);

		input.onkeypress = function(e) {
			var keyCode = e ? e.keyCode : window.event.keyCode;
			if(keyCode == 13) return false;
		};
		input.onkeyup = inputKeyup;
		input.onblur  = inputBlur;

		ownertable = document.createElement('tbody');

		var thead = document.createElement("thead");
		thead.appendChild(header);

		var tfoot = document.createElement("tfoot");
		tfoot.appendChild(addRow);

		table.appendChild(thead);
		table.appendChild(ownertable);
		table.appendChild(tfoot);
		container.appendChild(table);

		_self.add("system-guest", "", 0);
	};

	this.add = function(id, name, level, ignoreGuestLevel) {
		var pObject = {};
		pObject.id    = id;
		pObject.name  = name;
		pObject.level = level;
		if(id == "system-guest") { guestLevel = level; name = getLabel('js-all'); }
		else if(level == guestLevel && !ignoreGuestLevel) { return; }
		if(id == "system-supervisor" || id == "users-users-15") return;
		permissionCache[id] = pObject;
		var row  = document.createElement('tr');
		var td   = document.createElement('td');
		var icon = document.createElement('img');
		icon.src = "/styles/skins/modern/design/img/perm_user.png";
		td.appendChild( document.createTextNode(name) );
		row.appendChild(td);
		var l = [1, 2, 4, 8, 16];
		var n = ['perms_read', 'perms_edit', 'perms_create', 'perms_delete', 'perms_move'];
		for(var i=0; i<l.length; i++) {
			var cbW = document.createElement('div');
			cbW.className = 'checkbox';
			var cb = document.createElement('input');
			cb.type  = 'checkbox';
			cb.name  = n[i] + '[' + id + ']';
			cb.value = l[i];
			cb.title = titles[i];
			cbW.appendChild(cb);
			td = document.createElement('td');
			td.appendChild( cbW );
			td.className = "permissionType";
			row.appendChild(td);
			if(level & l[i]) {
				cbW.classList.add('checked');
				cb.checked = true;
			}
		}
		if(id == "system-guest" && guestRow) {
			ownertable.replaceChild(row, guestRow);
		} else {
			ownertable.appendChild(row);
		}
		$(row).find('.checkbox').on('click', function(){
			$(this).toggleClass('checked');
		});
		if(id == "system-guest") guestRow = row;
	};

	this.loadItems = function(searchText) {
		jQuery.ajax({url      : "/admin/users/getPermissionsOwners/4.xml?limit&search-all-text[]=" + encodeURIComponent(searchText),
				method   : "get",
				complete : function(r) { _self.updateItems(r); } });
	};

	this.updateItems = function(response) {
		suggestIndex = null;
		suggestItems = response.responseXML.getElementsByTagName('owner');
		var tmp = [];
		if(!suggestItems.length) return;
		for(var i=0; i<suggestItems.length; i++) {
			var id   = parseInt( suggestItems[i].getAttribute('id') );
			if(permissionCache[id] == undefined) {
				tmp[tmp.length] = suggestItems[i];
			}
		}
		suggestItems = tmp;
		if(!suggestItems.length) return;
		var ul    = null;
		if(!suggestDiv) {
			suggestDiv = document.createElement('div');
			suggestDiv.className      = 'symlinkAutosuggest';
			var pos = jQuery(input).offset();
			suggestDiv.style.position = 'absolute';
			suggestDiv.style.zIndex = 1050;
			suggestDiv.style.width  = input.clientWidth + "px";
			suggestDiv.style.top    = (pos.top + input.offsetHeight) + "px";
			suggestDiv.style.left   = pos.left + "px";
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
		var index = 0;
		for(i = 0; i < suggestItems.length; i++) {
			var text = suggestItems[i].getAttribute('name');
			var li   = document.createElement('li');
			var icon = document.createElement('img');
			icon.src = "/styles/skins/modern/design/img/perm_" + suggestItems[i].getAttribute('type') + ".png";
			li.appendChild(icon);
			li.appendChild(document.createTextNode(text));
			if(suggestItems[i].getAttribute('type') == 'group') {
				li.appendChild(document.createElement('br'));
				var span  = document.createElement('span');
				li.appendChild(span);
				var users = suggestItems[i].getElementsByTagName('user');
				var s     = "";
				for(var j = 0; j < users.length; j++) {
					s = s + (j ? ", " : "") + users[j].getAttribute('name');
				}
				span.appendChild(document.createTextNode(s));
			}


			li.onmouseover = function() { highlightSuggestItem(this.suggestIndex); };
			li.onmouseout  = function() { this.className  = ''; };
			li.onclick     = function() { addHighlitedItem(); hideSuggest(); input.value=""; };
			li.suggestIndex = index;
			ul.appendChild(li);
			index++;
		}
	};

	this.doSearch = function() {
		var text = input.value;
		_self.loadItems(text);
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
		if (suggestDiv && suggestDiv.style.display !== 'none' && suggestIndex !== null) {
			var id    = suggestItems[suggestIndex].getAttribute('id');
			var name  = suggestItems[suggestIndex].getAttribute('name');
			var type  = suggestItems[suggestIndex].getAttribute('type');
			if (type !== 'user') {
				_self.add(id, name, guestLevel, true);
			} else {
				jQuery.ajax({url: "/admin/users/getUserPermissions/" + id + "/" + window.page_id + "/.xml",
				method: "get",
				complete : function(response) {
					var data = response.responseXML.getElementsByTagName('data');

					if (data.length === 0) {
						return;
					}

					data = data[0];
					var userList = data.getElementsByTagName('user');
					var permissionLevel = guestLevel;

					if (userList.length) {
						permissionLevel = parseInt(jQuery(userList[0]).text());
					}

					_self.add(id, name, permissionLevel, true);
				}});
			}
		}
	};

	var inputBlur = function() {
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

	var inputKeyup = function(e) {
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

	var showSuggest = function() {
		if(suggestDiv) {
			var pos = jQuery(input).offset();
			suggestDiv.style.width  = input.clientWidth;
			suggestDiv.style.top    = pos.top + input.offsetHeight;
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

	construct();
};
(function() {
	var checkPrivateMessages = function() {
		$.get('/umess/inbox/?mark-as-opened=1', function(xml) {
			$('message', xml).each(function(index, node) {
				var title = $(node).attr('title');
				var content = $('content', node).text();
				var date = $('date', node).text();
				var sender = $('sender', node).attr('name');

				content = '<p>' + content + '</p><div class="header">' + date + ', ' + sender + '</div>';
				$.jGrowl(content, {
					'header': title,
					'life': 10000
				});
			});
		});

		setTimeout(checkPrivateMessages, 15000);
	};
})();

/** Обработчик нажатия на кнопку "Обратиться за помощью" */
var askSupport = function() {
	$.get('/styles/skins/modern/design/js/common/html/supportRequestPopup.html', function(html) {
		openSupportRequestPopup(html);
		checkLicenseKey();
	});

	/**
	 * Открывает всплывающее окно "Запрос в Службу Заботы"
	 * @param {String} html HTML-код всплывающего окна
	 */
	var openSupportRequestPopup = function(html) {
		openDialog('', getLabel('js-ask-support'), {
			stdButtons: false,
			html: html,
			width: 700,
			openCallback: function() {
				$('#stop_btn').on('click', function() {
					closeDialog();
				});
			},
			confirmCallback: function() {
			}
		});
	};

	/**
	 * Запускает проверку доменного ключа пользователя,
	 * и в случае успеха загружает поля для формы запроса в Службу Заботы.
	 */
	var checkLicenseKey = function() {
		$.ajax({
			type: 'POST',
			url: '/udata/system/checkLicenseKey/',
			dataType: 'xml',

			success: function(doc) {
				$('#form_body').html('');
				$('#loading').html('');
				var message = '';

				var errors = doc.getElementsByTagName('error');
				if (errors.length) {
					$('#ask_support_form').remove();
					message = errors[0].firstChild.nodeValue;
				}

				var notes = doc.getElementsByTagName('notes');

				if (notes.length) {
					message += notes[0].firstChild.nodeValue;
				}

				$('#license_message').html(message);

				var forms = doc.getElementsByTagName('form');
				if (!forms.length) {
					return;
				}

				var user = doc.getElementsByTagName('user');

				$('#form_body').html('<form id="support_request" action="" method="post" enctype="multipart/form-data">' + forms[0].firstChild.nodeValue + '</form>');

				$('input[name="data[fio_frm]"]').val(user[0].getAttribute('name'));
				$('#email_frm').val(user[0].getAttribute('email'));
				$('#server_credentials').val(localStorage.getItem('serverCredentials'));


				var parent = $('input[name="data[cms_domain]"]').parent();
				$('input[name="data[cms_domain]"]').remove();
				var select = document.createElement('select');
				select.name = 'data[cms_domain]';

				var domains = doc.getElementsByTagName('domains');

				for (var i = 0; i < domains[0].getElementsByTagName('domain').length; i++) {
					var domain = domains[0].getElementsByTagName('domain');
					domain = domain[i];
					var option = document.createElement('option');
					option.value = domain.getAttribute('host');

					if (domain.getAttribute('host') == user[0].getAttribute('domain')) {
						option.selected = true;
					}

					option.appendChild(document.createTextNode(domain.getAttribute('host')));
					select.appendChild(option);
				}

				parent.append(select);
				$('#attach_file').parent('div');
				$('.button_1').remove();
				$('#checkLicenseKey').attr('style', '');

				$('#show_info').attr('style', 'display:inline-block;');
				$('#show_info').on('click', function() {
					$('#info_support').slideToggle('slow');
				});

				$.centerPopupLayer();

				var $wrapper = $('#license_wrapper');
				var lastFormBlock = $('#support_request > div', $wrapper).addClass('col-md-6').last();
				lastFormBlock.removeClass('col-md-6').addClass('col-md-12');
				$('input[type=text]', $wrapper).addClass('default');
				$('.asterisk', $wrapper).parent(':contains(обязательные)').remove();
				$('select', $wrapper).selectize();
				$('#server_credentials').on('focusout', function(){
					localStorage.setItem('serverCredentials', $(this).val());
				});

				$('#checkLicenseKey').on('click', sendSupportRequest);
			},

			error: function(jqXHR, textStatus, errorThrown) {
				if (window.session) {
					window.session.stopAutoActions();
				}
			}
		});
	};

	/** Отправляет запрос в Службу Заботы */
	var sendSupportRequest = function() {
		$.ajax({
			type: 'POST',
			url: '/udata/system/sendSupportRequest/',
			data: new FormData($('#support_request')[0]),

			cache: false,
			contentType: false,
			processData: false,

			success: function(data) {
				var message;
				$('#loading').html('');

				var error = data.getElementsByTagName('error');
				if (error.length) {
					message = '<span style="color:red;">' + error[0].firstChild.nodeValue + '</span>';
				}

				var success = data.getElementsByTagName('success');
				if (success.length) {
					message = success[0].firstChild.nodeValue;
					$('#ask_support_form').remove();
					$('#checkLicenseKey').remove();
				}

				$('#license_message').html(message);
				$.centerPopupLayer();
			}
		});
	};
};

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
/**
 * Модуль по умолчанию
 * @type {{getRequestUrl, sendAjaxRequest}}
 */
let DefaultModule;
DefaultModule = (function($) {
	"use strict";

	/** @type {String} REQUEST_PREFIX префикс запроса к api */
	const REQUEST_PREFIX = '/admin/';
	/** @type {String} ERROR_REQUEST_MESSAGE сообщение об ошибке, если запрос к серверу завершился неудачно */
	const ERROR_REQUEST_MESSAGE = getLabel('js-label-request-error');

	/**
	 * Возвращает адрес для запроса к бэкэнду
	 * @param {String} module модуль
	 * @param {String} method метод
	 * @param {String|Null} params параметры
	 * @returns {String}
	 */
	let getRequestUrl = function(module, method, params) {
		params = params || '';
		return DefaultModule.getRequestUrlPrefix()  + module + '/' + method + '/.json' + params;
	};

	/**
	 * Отправляет ajax запрос
	 * @param {Object} requestParams параметры запроса
	 * @param {Function} successCallback обработчик успешного получения ответа
	 * @param {Function|Boolean} errorCallback обработчик ошибочного получения ответа
	 */
	let sendAjaxRequest = function(requestParams, successCallback, errorCallback) {
		errorCallback = errorCallback || showMessage;

		if (!requestParams.data) {
			requestParams.data = {};
		}

		requestParams.data.csrf = getCSRFToken();
		let response = $.ajax(requestParams);

		response.done(function(result) {

			if (isRequestResultContainsErrorMessage(result)) {
				return errorCallback(result.data.error);
			}

			if (isRequestResultContainsException(result)) {
				return errorCallback(result.message);
			}

			successCallback(result);
		});

		response.fail(function(response) {
			let message = ERROR_REQUEST_MESSAGE;

			if (response.status === 403 && response.responseJSON && response.responseJSON.data && response.responseJSON.data.error) {
				message = response.responseJSON.data.error;
			}

			errorCallback(message);
		});
	};

	/**
	 * Возвращает CSRF токен
	 * @returns {String}
	 */
	let getCSRFToken = function() {
		return csrfProtection.token;
	};

	/**
	 * Проверяет содержит ли результат запроса сообщение об ошибке и возвращает результат проверки
	 * @param {Object} result результат запроса
	 * @returns {Boolean}
	 */
	let isRequestResultContainsErrorMessage = function(result) {
		return !_.isUndefined(result.data) && !_.isUndefined(result.data.error);
	};

	/**
	 * Проверяет содержит ли результат запроса данные исключения и возвращает результат проверки
	 * @param {Object} result результат запроса
	 * @returns {Boolean}
	 */
	let isRequestResultContainsException = function(result) {
		return !_.isUndefined(result.code) && !_.isUndefined(result.trace) && !_.isUndefined(result.message);
	};

	/**
	 * Показывает сообщение
	 * @param {String} message сообщение
	 * @param {Object} options опции сообщения
	 */
	let showMessage = function(message, options) {
		options = options || {
			'header': 'UMI.CMS',
			'life': 10000
		};

		$.jGrowl(message, options);
	};

	/**
	 * Возвращает идентификатор домена
	 * @returns {*}
	 */
	let getDomainId = function() {
		let TableControl = dc_application;
		let QueryBuilder = TableControl.getQueryBuilder();
		let selectedDomain = QueryBuilder.Domains;
		return (typeof selectedDomain === 'object') ? selectedDomain[0] : selectedDomain;
	};

	/**
	 * Возвращает идентификатор языка
	 * @returns {*}
	 */
	let getLanguageId = function() {
		let TableControl = dc_application;
		let QueryBuilder = TableControl.getQueryBuilder();
		let selectedLanguage = QueryBuilder.Langs;
		return (typeof selectedLanguage === 'object') ? selectedLanguage[0] : selectedLanguage;
	};

	/**
	 * Очищает ответ на запрос списка сущностей от служебных параметров
	 * @param {Object} response ответ на запрос списка сущностей
	 * @return {Object}
	 */
	let extractRowList = function(response) {
		return _.omit(response.data, ['action', 'offset', 'per_page_limit', 'total', 'type']);
	};

	/**
	 * Извлекает список идентификаторов сущностей из ответа на запрос сущностей
	 * @param {Object} response ответ на запрос списка сущностей
	 * @return {Object}
	 */
	let extractIdList = function(response) {
		let pageList = this.extractRowList(response);
		let idList = [];

		for (let index in pageList) {
			idList.push(pageList[index].id)
		}

		return idList;
	};

	/**
	 * Включает отображения контрола "Дерево" для выбора страницы
	 * @param {String} inputSelector селектор input, куда требуется сохранить id
	 * @param {Function} callback обработчик выбора страницы
	 */
	let showTreeControl = function(inputSelector, callback) {
		window.saveTreeElementToContainer = function(id) {

			if (typeof callback === 'function') {
				callback(id);
			} else {
				$(inputSelector).val('%content get_page_url(' + id + ')%');
			}

			jQuery.closePopupLayer("tree");
		};

		jQuery.openPopupLayer({
			name : "tree",
			title : getLabel('js-label-select-page'),
			width : 'auto',
			height : 340,
			url : "/styles/common/js/tree.html?callback=saveTreeElementToContainer"
		});
	};

	/**
	 * Возвращает префикс для адреса запроса
	 * @returns {String}
	 */
	let getRequestUrlPrefix = function() {
		return window.pre_lang + REQUEST_PREFIX;
	};

	/**
	 * Возвращает строковый идентификатор текущего языка
	 * @returns {String}
	 */
	let getRequestLanguageCodeName = function() {
		return window.pre_lang ? window.pre_lang : 'ru';
	};

	/**
	 * Включает отображения файлового менеджера для выбора изображений
	 * @param {String} inputSelector селектор input, куда требуется сохранить изображение
	 * @param {Function} callback обработчик выбора изображения
	 */
	let showImageBrowser = function (inputSelector, callback) {
		let $imageContainer = $(inputSelector);
		let infoRequest = {};

		if ($imageContainer.val()) {
			let imageSource = $imageContainer.val();
			infoRequest.file = imageSource;
			infoRequest.folder = imageSource.substr(0, imageSource.lastIndexOf('/'));
		} else {
			infoRequest.folder = './images/cms/data/';
		}

		jQuery.ajax({
			url: DefaultModule.getRequestUrlPrefix() + '/filemanager/get_filemanager_info/',
			data: infoRequest,
			dataType: 'json',
			type: 'GET',
			complete: function (data) {
				let response = eval('(' + data.responseText + ')');

				if (typeof response !== 'object') {
					return DefaultModule.showMessage(getLabel('js-error-cannot-show-file-browser'));
				}

				let folderHash = (typeof response['folder_hash'] == 'string') ? response['folder_hash'] : '';
				let	fileHash = (typeof response['file_hash'] == 'string') ? response['file_hash'] : '';
				let	lang = (typeof response['lang'] == 'string') ? response['lang'] : DefaultModule.getRequestLanguageCodeName();
				let fileBrowser = (typeof response['filemanager'] == 'string') ? response['filemanager'] : 'elfinder';

				let filesRequest = [];
				filesRequest.push('image=1');
				filesRequest.push('multiple=0');
				filesRequest.push('imagesOnly=1');
				filesRequest.push('noTumbs=1');
				filesRequest.push('lang=' + lang);
				filesRequest.push('folder_hash=' + folderHash);
				filesRequest.push('file_hash=' + fileHash);

				jQuery.openPopupLayer({
					name: "Filemanager",
					title: window.parent.getLabel('js-file-manager'),
					width  : 1200,
					height : 600,
					url: "/styles/common/other/elfinder/umifilebrowser.html?" + filesRequest.join("&"),
					afterClose: function (selectedImage) {
						if (typeof selectedImage !== 'object' || !selectedImage[0] || !selectedImage[0].url){
							return false;
						}

						if (typeof callback === 'function') {
							callback(selectedImage[0].url);
							return true;
						}

						$imageContainer.attr('src', selectedImage[0].url);
						return true;
					},
					success: function() {
						if (uAdmin.wysiwyg) {
							let fileBrowserFooter = uAdmin.wysiwyg.getFilemanagerFooter(fileBrowser);
							jQuery('#popupLayer_Filemanager').append(fileBrowserFooter);
						}
					}
				});
			}
		});
	};

	/**
	 * Возвращает адрес страницы редактирования объекта
	 * @param {String} module модуль
	 * @param {String} method метод
	 * @param {String|Null} objectId id объекта
	 * @returns {String}
	 */
	let getRequestObjextUrl = function(module, method, objectId) {
		return DefaultModule.getRequestUrlPrefix() + module + '/' + method + '/' + objectId + '/';
	};

	/**
	 * Возвращает выбранную сущность в табличном контроле
	 * @returns {Object}
	 */
	var getSelectedEntity = function() {
		return dc_application.toolbar.selectedItems[0];
	};

	/**
	 * Возвращает значение поля выбранной сущности табличного контрола
	 * @param {String} name название поля
	 * @returns {*}
	 */
	let getSelectedEntityValue = function(name) {
		var item = DefaultModule.getSelectedEntity();
		return (typeof item === 'object') ? item.attributes[name] : '';
	};

	return {
		getRequestUrl: getRequestUrl,
		sendAjaxRequest: sendAjaxRequest,
		showMessage: showMessage,
		getDomainId: getDomainId,
		getLanguageId: getLanguageId,
		extractRowList: extractRowList,
		extractIdList: extractIdList,
		showTreeControl: showTreeControl,
		getRequestLanguageCodeName: getRequestLanguageCodeName,
		getRequestUrlPrefix: getRequestUrlPrefix,
		showImageBrowser: showImageBrowser,
		getRequestObjextUrl: getRequestObjextUrl,
		getSelectedEntity: getSelectedEntity,
		getSelectedEntityValue: getSelectedEntityValue,
	};
})(jQuery);
/**
 * Модуль, содержащий конструкторы контролов и некоторые функции для модуля "Каталог"
 * @type {{ElementMovingControl, CopyCreatingControl, getControl, addControl, openCategoriesWindow, moveItem}}
 */
var CatalogModule;
CatalogModule = (function($, _) {
	"use strict";

	/** @type {String} MODULE_NAME системное имя модуля */
	var MODULE_NAME = 'catalog';
	/** @type {String} REQUEST_ADD_TRADE_OFFER_METHOD метод, который создает торговое предложение */
	var REQUEST_ADD_TRADE_OFFER_METHOD = 'addTradeOffer';
	/** @type {String} REQUEST_COPY_TRADE_OFFER_METHOD метод, который копирует торговое предложение */
	var REQUEST_COPY_TRADE_OFFER_METHOD = 'copyTradeOffer';
	/** @type {String} REQUEST_CHANGE_ACTIVITY_TRADE_OFFER_LIST_METHOD метод, который изменяет активность торговых предложений */
	var REQUEST_CHANGE_ACTIVITY_TRADE_OFFER_LIST_METHOD = 'changeTradeOfferListActivity';
	/** @type {String} REQUEST_DELETE_TRADE_OFFER_METHOD метод, который удаляет торговые предложения */
	var REQUEST_DELETE_TRADE_OFFER_LIST_METHOD = 'deleteTradeOfferList';
	/** @type {String} REQUEST_ADD_TRADE_OFFER_PRICE_TYPE_METHOD метод, который создает тип цены торгового предложения */
	var REQUEST_ADD_TRADE_OFFER_PRICE_TYPE_METHOD = 'addTradeOfferPriceType';
	/** @type {String} REQUEST_DELETE_TRADE_OFFER_PRICE_TYPE_LIST_METHOD метод, который удаляет типы цен торговых предложений */
	var REQUEST_DELETE_TRADE_OFFER_PRICE_TYPE_LIST_METHOD = 'deleteTradeOfferPriceTypeList';

	/**
	 * Инициализирует контрол
	 * @param {Object} context объект контекста выполнения
	 * @param {String} id идентификатор контейнера для контрола
	 * @param {String} module текущий модуль
	 * @param {Object} options объект срдержащий опции для контрола
	 * @param {String} hierarchyType строка вида: 'Модуль::Метод',
	 * обозначающая тип выводимых объектов в дереве
	 */
	var initControl = function(context, id, module, options, hierarchyType) {
		hierarchyType = hierarchyType || '';
		var self = context;
		var hierarchyTypeString = hierarchyType.split('::').join('-');
		var controlOptions = {
			idPrefix: '',
			treeURL: '/styles/skins/modern/design/js/common/parents.html',
			inputWidth: '100%',
			popupTitle: getLabel('js-choose-category')
		};

		var construct = function() {
			var userOptions = $.extend(options, controlOptions);
			self.symlinkControl = new symlinkControl(id, module, hierarchyTypeString, userOptions, hierarchyType);
			self.id = id;
			self.container = self.symlinkControl.container;
			self.itemsContainer = $('.items-list', self.container).get(0);
			$('li i', self.itemsContainer).each(function() {
				var deleteIcon = $(this);
				var page = deleteIcon.parent();
				var pageId = page.attr('umi:id');
				bindDeletePage(deleteIcon, pageId, page);
			});
		};

		construct();
	};

	/**
	 * Возвращает ID текущей страницы
	 * @returns {*}
	 */
	var getCurrentId = function() {
		return (uAdmin.data && uAdmin.data.page ? uAdmin.data.page.id : window.page_id);
	};

	/**
	 * Создает элемент со ссылками на родительские страницы (хлебные крошки)
	 * @param {JSON} data исходные данные страницы
	 * @returns {Element}
	 */
	var createPathLinks = function(data) {
		var parentsList = data.parents.item;
		var parent;
		var linksContainer = document.createElement('span');
		linksContainer.className = 'paths';

		for (var i in parentsList) {
			if (!parentsList.hasOwnProperty(i)) {
				continue;
			}

			parent = parentsList[i];
			linksContainer.appendChild(createParentLink(parent));
		}

		linksContainer.appendChild(createPathElement(data));
		return linksContainer;
	};

	/**
	 * Создает ссылку на родительскую страницу
	 * @param {JSON} data исходные данные родительской страницы
	 * @returns {Element}
	 */
	var createParentLink = function createParentLink(data) {
		var link = document.createElement('a');

		link.href = "/admin/" + data.module + "/" + data.method + "/";
		link.className = "tree_link";
		link.target = "_blank";
		link.title = data.url;
		link.appendChild(document.createTextNode(data.name));

		$(link).on('click', function() {
			return treeLink(data.settingsKey, data.treeLink);
		});

		return link;
	};

	/**
	 * Создает текстовый элемент, содержащий название страницы
	 * @param {JSON} data исходные данные страницы
	 * @returns {Element}
	 */
	var createPathElement = function(data) {
		var pathElement = document.createElement('span');
		pathElement.title = data.url;
		pathElement.appendChild(document.createTextNode(data.name));
		return pathElement;
	};

	/**
	 * Перемещает страницу в другой раздел
	 * @param {Number} parentId ID нового родителя
	 * @param {Function} callback вызывается при успешном перемещении
	 * @param {Number} element ID перемещаемой страницы
	 * @param {Boolean} toEnd переносить ли страницу в конец списка
	 */
	var moveItem = function(parentId, callback, element, toEnd) {
		var elementId = element || getCurrentId(),
			selectedList = (Control.HandleItem !== null) ? Control.HandleItem.control.selectedList : [],
			data;
		callback = typeof callback == 'function' ? callback : function() {
		};

		if (!elementId || !parentId || elementId == parentId) {
			return;
		}

		var isMoveToEnd = toEnd ? 1 : 0;

		data = {
			element: elementId,
			rel: parentId,
			return_copies: true,
			to_end: isMoveToEnd
		};

		if (_.keys(selectedList).length > 0) {
			data['selected_list'] = [];
			_.each(selectedList, function(item) {
				data['selected_list'].push(item.id);
			});
		}

		$.ajax({
			url: "/admin/content/tree_move_element.json",
			type: "get",
			dataType: "json",
			data: data,
			success: function(response) {
				callback(response);
			}
		});
	};

	/**
	 * Контрол для осуществления перемещения элементов
	 * @param {String} id идентификатор контейнера
	 * @param {String} module целевой модуль
	 * @param {Object} options опции контрола
	 * @param {String} hierarchyType строка вида: 'Модуль::Метод',
	 * обозначающая тип выводимых объектов в дереве
	 * @constructor
	 */
	function ElementMovingControl(id, module, options, hierarchyType) {
		initControl(this, id, module, options, hierarchyType);
	}

	/**
	 * Перемещает элемент в другой раздел
	 * @param {Number} parentId ID нового раздела
	 * @param {Boolean} toEnd переносить ли страницу в конец списка
	 */
	ElementMovingControl.prototype.moveItem = function(parentId, toEnd) {
		var self = this;
		var isMoveToEnd = toEnd ? 1 : 0;

		moveItem(parentId, function(response) {
			if (!response.data || !response.data.page) {
				return;
			}

			var movedElementData = response.data.page.copies.copy[0];
			var pathElement = createPathLinks(movedElementData);
			var listElement = $('li', self.itemsContainer).eq(0);
			listElement.html('');
			listElement.append(pathElement);
		}, null, isMoveToEnd);
	};

	/**
	 * Возвращает идентификатор контрола
	 * @returns {*}
	 */
	ElementMovingControl.prototype.getId = CopyCreatingControl.prototype.getId = function() {
		return this.id;
	};

	/**
	 * Контрол для создания виртуальных копий
	 * @param {String} id идентификатор контейнера
	 * @param {String} module целевой модуль
	 * @param {Object} options опции контрола
	 * @param {String} hierarchyType строка вида: 'Модуль::Метод',
	 * обозначающая тип выводимых объектов в дереве
	 * @constructor
	 */
	function CopyCreatingControl(id, module, options, hierarchyType) {
		initControl(this, id, module, options, hierarchyType);
	}

	/**
	 * Создает виртуальную копию страницы в разделе с ID = parentId
	 * @param {Number} parentId ID раздела, в котором будет создана виртуальная копия
	 */
	CopyCreatingControl.prototype.addCopy = function(parentId) {
		var elementId = getCurrentId();
		var self = this;

		if (!elementId || !parentId || elementId == parentId) {
			return;
		}

		$.ajax({
			url: "/admin/content/tree_copy_element.json",
			type: "get",
			dataType: "json",
			data: {
				element: elementId,
				rel: parentId,
				copyAll: 1,
				return_copies: 1,
				clone_mode: 0
			},
			success: function(response) {
				if (!response.data || !response.data.page) {
					return;
				}

				var copyData = response.data.page.copies.copy[0];
				var pathElement = createPathLinks(copyData);

				var deleteIcon = $(document.createElement('i'));
				deleteIcon.attr('class', 'small-ico i-remove virtual-copy-delete');

				var listElement = $(document.createElement('li'));
				listElement.attr('umi:id', copyData.id);

				bindDeletePage(deleteIcon, copyData.id, listElement);

				if (copyData.basetype) {
					listElement.attr('umi:module', copyData.basetype.module);
					listElement.attr('umi:method', copyData.basetype.method);
				}

				listElement.append(deleteIcon);
				listElement.append(pathElement);
				$(self.itemsContainer).append(listElement);
			}
		});
	};

	/** @var [] controlsList хранит список добавленных контролов**/
	var controlsList = [];

	/**
	 * Устанавливает обработчик клика кнопки, который
	 * удаляет заданную страницу
	 * @param {Object} button jquery объект, которому назначается обработчик
	 * @param {String} pageId идентификатор удаляемой страницы
	 * @param {Object} page jquery объект, который нужно удалить вместе со страницей
	 */
	function bindDeletePage(button, pageId, page) {
		button.on("click", function() {
			$.ajax({
				url: "/admin/content/tree_delete_element.xml?csrf=" + csrfProtection.getToken(),
				type: "get",
				dataType: "xml",
				data: {
					element: pageId,
					childs: 1,
					allow: true
				},
				context: this,
				success: function() {
					page.remove();
				}
			});
		});
	}

	/**
	 * Возвращает контрол по его идентификатору
	 * @param {String} id идентификатор контрола
	 * @returns {*}
	 */
	function getControl(id) {
		return controlsList[id];
	}

	/**
	 * Добавляет контрол в список
	 * @param {Object} control объект контрола
	 * @returns {*}
	 */
	function addControl(control) {
		return controlsList[control.getId()] = control;
	}

	/**
	 * Открывает окно с выбором категорий
	 * @param {TableItem|TreeItem} handleItem выбранный элемент, для которого нужно произвести
	 * какие-либо действия
	 */
	function openCategoriesWindow(handleItem) {
		var popupName = 'SiteTree';
		var popupTitle = getLabel('js-choose-category');
		var treeBaseURL = '/styles/skins/modern/design/js/common/parents.html';
		var module = 'catalog';
		var typeString = '&hierarchy_types=catalog-category';
		var rootId = '';

		jQuery.openPopupLayer({
			name: popupName,
			title: popupTitle,
			width: '100%',
			height: 335,
			url: treeBaseURL + "?id=" + (handleItem.id) + (module ? "&module=" + module : "") +
				'&name=' + popupName +
				typeString + (window.lang_id ? "&lang_id=" + window.lang_id : "") +
				(rootId ? "&root_id=" + rootId : "") + '&mode=tree'
		});
	}

	/**
	 * Возвращает реализацию функций тулбара табличного контрола списка торговых предложений
	 * @return {Object}
	 */
	var getTradeOfferListToolBarFunctions = function() {
		return {
			add: {
				name: 'add',
				className: 'i-add',
				hint: getLabel('js-add'),
				init: function(button) {
					var TableControl = dc_application;
					var toolBar = TableControl.getToolBar();

					if (TableControl.hasSelectedRows()) {
						return toolBar.disableButtons(button);
					}

					toolBar.enableButtons(button);
				},
				release: function() {
					requestAddTradeOffer();
					return false;
				}
			},
			copy: {
				name: 'copy',
				className: 'i-copy',
				hint: getLabel('js-copy'),
				init: function(button) {
					var TableControl = dc_application;
					var toolBar = TableControl.getToolBar();

					if (!TableControl.isOneRowSelected()) {
						return toolBar.disableButtons(button);
					}

					toolBar.enableButtons(button);
				},
				release: function() {
					requestCopyTradeOffer();
					return false;
				}
			},
			activate: {
				name: 'activate',
				className: 'i-vision',
				hint: getLabel('js-activate'),
				init: function(button) {
					var TableControl = dc_application;
					var toolBar = TableControl.getToolBar();

					if (!TableControl.hasSelectedRows()) {
						return toolBar.disableButtons(button);
					}

					var className = 'i-vision';
					var hint = getLabel('js-activate');

					if (TableControl.getFirstSelectedRow().attributes.is_active) {
						className = 'i-hidden';
						hint = getLabel('js-deactivate');
					}

					button.className = className;
					button.hint = hint;
					toolBar.renderButton(button);
					toolBar.enableButtons(button);
				},
				release: function() {
					requestChangeTradeOfferListActivity();
					return false;
				}
			},
			remove: {
				name: 'delete',
				className: 'i-remove',
				hint: getLabel('js-remove'),
				init: function(button) {
					var TableControl = dc_application;
					var toolBar = TableControl.getToolBar();

					if (!TableControl.hasSelectedRows()) {
						return toolBar.disableButtons(button);
					}

					toolBar.enableButtons(button);
				},
				release: function() {
					requestDeleteTradeOfferList();
					return false;
				}
			}
		};
	};

	/** Запрашивает добавление торгового предложения */
	var requestAddTradeOffer = function() {
		var requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_ADD_TRADE_OFFER_METHOD),
			dataType: 'json',
			data: {
				object_id: getProductObjectId(),
				field_name: getTradeOfferFieldName()
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			dc_application.refresh();
		}, false);
	};

	/**
     * Возвращает идентификатор объекта товара
	 * @returns {Number}
	 */
	var getProductObjectId = function() {
	    return window.object_id;
    };

	/**
     * Возвращает имя поля объекта товара со списком торговых предложений
	 * @returns {String}
	 */
	var getTradeOfferFieldName = function() {
		return dc_application.config.attributes.param;
    };

	/** Запрашивает копирование торгового предложения */
	var requestCopyTradeOffer = function() {
		var TableControl = dc_application;
		var requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_COPY_TRADE_OFFER_METHOD),
			dataType: 'json',
			data: {
				offer_id: TableControl.getFirstSelectedId(),
				object_id: getProductObjectId(),
				field_name: getTradeOfferFieldName()
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			TableControl.refresh();
		}, false);
	};

	/** Запрашивает удаление выбранных торговых предложений */
	var requestDeleteTradeOfferList = function() {
		var TableControl = dc_application;
		var requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_DELETE_TRADE_OFFER_LIST_METHOD),
			dataType: 'json',
			data: {
				offer_id_list: TableControl.getSelectedIdList()
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			TableControl.refresh();
		}, false);
	};

	/** Запрашивает изменение статуса активности выбранных торговых предложений **/
	var requestChangeTradeOfferListActivity = function() {
		var TableControl = dc_application;
		var requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_CHANGE_ACTIVITY_TRADE_OFFER_LIST_METHOD),
			dataType: 'json',
			data: {
				offer_id_list: TableControl.getSelectedIdList(),
				is_active: Number(!TableControl.getFirstSelectedRow().attributes.is_active)
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			TableControl.refresh();
		}, false);
	};

	/**
	 * Возвращает список названий кнопок для формирования меню тулбара табличного контрола списка торговых предложений
	 * @returns {String[]}
	 */
	var getTradeOfferListToolBarMenu = function() {
		return ['add', 'copy', 'activate', 'remove'];
	};

	/**
	 * Валидирует операцию перетаскивания в табличном контроле списка торговых предложений
	 * @param {umiDataTableRow} target элемент, относительно которого выполняется перетаскивание
	 * @param {umiDataTableRow} dragged перетаскиваемый элемент
	 * @param {String} mode режим перетаскивания (after/before/child)
	 * @returns {String|boolean}
	 */
	var getDragAndDropValidator = function(target, dragged, mode) {

		if (mode === 'child') {
			return false;
		}

		return mode;
	};

	/**
	 * Возвращает реализацию функций тулбара табличного контрола списка типов цен торговых предложений
	 * @return {Object}
	 */
	var getTradeOfferPriceTypeListToolBarFunction = function() {
		return {
			add: {
				name: 'add',
				className: 'i-add',
				hint: getLabel('js-add'),
				init: function(button) {
					var TableControl = dc_application;
					var toolBar = TableControl.getToolBar();

					if (TableControl.hasSelectedRows()) {
						return toolBar.disableButtons(button);
					}

					toolBar.enableButtons(button);
				},
				release: function() {
					requestAddTradeOfferPriceType();
					return false;
				}
			},
			remove: {
				name: 'delete',
				className: 'i-remove',
				hint: getLabel('js-remove'),
				init: function(button) {
					var TableControl = dc_application;
					var toolBar = dc_application.getToolBar();

					if (!TableControl.hasSelectedRows()) {
						return toolBar.disableButtons(button);
					}

					toolBar.enableButtons(button);
				},
				release: function() {
					requestDeleteTradeOfferPriceTypeList();
					return false;
				}
			}
		};
	};

	/**
	 * Возвращает список названий кнопок для формирования меню тулбара табличного контрола списка типов цен торговых предложений
	 * @returns {String[]}
	 */
	var getTradeOfferPriceTypeListToolBarMenu = function() {
		return ['add', 'remove'];
	};

	/** Запрашивает добавление типа цены торгового предложения */
	var requestAddTradeOfferPriceType = function() {
		var requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_ADD_TRADE_OFFER_PRICE_TYPE_METHOD),
			dataType: 'json'
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			dc_application.refresh();
		}, false);
	};

	/** Запрашивает удаление выбранных типов цен торговых предложений */
	var requestDeleteTradeOfferPriceTypeList = function() {
		var TableControl = dc_application;
		var requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_DELETE_TRADE_OFFER_PRICE_TYPE_LIST_METHOD),
			dataType: 'json',
			data: {
				price_type_id_list: TableControl.getSelectedIdList()
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			dc_application.refresh();
		}, false);
	};

	return {
		ElementMovingControl: ElementMovingControl,
		CopyCreatingControl: CopyCreatingControl,
		getControl: getControl,
		addControl: addControl,
		openCategoriesWindow: openCategoriesWindow,
		moveItem: moveItem,
		getTradeOfferListToolBarFunctions: getTradeOfferListToolBarFunctions,
		getTradeOfferListToolBarMenu: getTradeOfferListToolBarMenu,
		getDragAndDropValidator: getDragAndDropValidator,
		getTradeOfferPriceTypeListToolBarFunction: getTradeOfferPriceTypeListToolBarFunction,
		getTradeOfferPriceTypeListToolBarMenu: getTradeOfferPriceTypeListToolBarMenu
	};

})(jQuery, _);


/**
 * Функционал административной панели модуля SEO:
 *
 * 1) showBadLinkSources() - показывает источники битой ссылки
 * 2) findBadLinks() - ищет битые ссылки
 */
var SeoModule = (function($, _) {
	"use strict";

	/** @type {String} MODULE_NAME системное имя модуля */
	var MODULE_NAME = 'seo';
	/** @type {String} REQUEST_PREFIX префикс запроса к api */
	var REQUEST_PREFIX = '/admin/';
	/** @type {String} REQUEST_LINK_SOURCES_METHOD метод, который возвращает источники битой ссылки */
	var REQUEST_LINK_SOURCES_METHOD = 'getLinkSources';
	/** @type {String} REQUEST_INDEX_LINKS_METHOD метод, который индексирует ссылки на сайте */
	var REQUEST_INDEX_LINKS_METHOD = 'indexLinks';
	/** @type {String} REQUEST_CHECK_LINKS_METHOD метод, который проверяет проиндексированные ссылки */
	var REQUEST_CHECK_LINKS_METHOD = 'checkLinks';
	/** @type {String} REQUEST_ADD_SITE_METHOD метод, который добавляет сайт в Яндекс.Вебмастер */
	var REQUEST_ADD_SITE_METHOD = 'addSite';
	/** @type {String} REQUEST_VERIFY_SITE_METHOD метод, который подтвержает права на сайт в Яндекс.Вебмастер */
	var REQUEST_VERIFY_SITE_METHOD = 'verifySite';
	/** @type {String} REQUEST_ADD_SITE_MAP_METHOD метод, который добавляет карту сайта в Яндекс.Вебмастер */
	var REQUEST_ADD_SITE_MAP_METHOD = 'addSiteMap';
	/** @type {String} REQUEST_DELETE_SITE_METHOD метод, который удаляет сайт из Яндекс.Вебмастер */
	var REQUEST_DELETE_SITE_METHOD = 'deleteSite';
	/** @type {String} REQUEST_GET_SITE_INFO_METHOD метод, который возвращает данные о сайте из Яндекс.Вебмастер */
	var REQUEST_GET_SITE_INFO_METHOD = 'getSiteInfo';
	/** @type {String} INDEX_LINKS_STEP_NAME название шага поиска битых ссылок: индексация ссылок */
	var INDEX_LINKS_STEP_NAME = getLabel('js-label-step-linksGrabber');
	/** @type {String} CHECK_LINKS_STEP_NAME название шага поиска битых ссылок: проверка ссылок */
	var CHECK_LINKS_STEP_NAME = getLabel('js-label-step-linksChecker');
	/** @type {String} ERROR_REQUEST_MESSAGE сообщение об ошибке, если запрос к серверу завершился неудачно */
	var ERROR_REQUEST_MESSAGE = getLabel('js-label-request-error');
	/** @type {String} FIND_BAD_LINKS_BUTTON_ID id элемента кнопки поиска битых ссылок */
	var FIND_BAD_LINKS_BUTTON_ID = 'findBadLinks';
	/** @type {String} BAD_LINKS_SEARCH_INFO_ELEMENT_ID id элемента текста progress bar поиска битых ссылок */
	var BAD_LINKS_SEARCH_INFO_ELEMENT_ID = 'badLinksSearchInfo';
	/**
	 * @type {String} BAD_LINKS_SEARCH_ANIMATION_WRAPPER_CLASS class элемента, в котором отображается анимация прогресс
	 * бара поиска битых ссылок
	 */
	var BAD_LINKS_SEARCH_ANIMATION_WRAPPER_CLASS = 'loading-wrapper';
	/** @type {String} BAD_LINKS_SEARCH_CANCEL_BUTTON_ID id элемента кнопки завершения поиска битых ссылок */
	var BAD_LINKS_SEARCH_CANCEL_BUTTON_ID = 'cancel-button';
	/** @type {String} BAD_LINKS_SEARCH_TEMPLATE_ID id элемента с шаблоном контента progress bar поиска битых ссылок */
	var BAD_LINKS_SEARCH_TEMPLATE_ID = 'bad-links-search-template';
	/** @type {String} BAD_LINK_SOURCES_TEMPLATE_ID id элемента с шаблоном источников битой ссылки */
	var BAD_LINK_SOURCES_TEMPLATE_ID = 'bad-link-sources-template';
	/** @type {String} REQUEST_EDIT_ROBOTS_METHOD метод, который сохраняет данные добавляемые в robots.txt */
	var REQUEST_EDIT_ROBOTS_METHOD = 'editRobotsTxt';
	/** @type {String} REQUEST_GET_ROBOTS_METHOD метод, который возвращает данные из robots.txt */
	var REQUEST_GET_ROBOTS_METHOD = 'getRobotsTxt';

	/** Выполняется, когда все элементы DOM готовы */
	$(function () {
		initRenderSeoCharts();
		bindFindBadLinksButton();
	});

	/** Прикрепляет действие к кнопке поиска битых ссылок */
	var bindFindBadLinksButton = function() {
		$('#' + FIND_BAD_LINKS_BUTTON_ID).on('click', findBadLinks);
	};

	/** Инициализирует отрисовку графиков модуля SEO */
	var initRenderSeoCharts = function() {
		$('div.seo_chart canvas').each(function() {
			new Chart(this.getContext('2d'), window[this.id + 'config']);
		});
	};

	/**
	 * Показывает источники битой ссылки
	 * @param {Integer} linkId идентификатор битой ссылки
	 */
	var showBadLinkSources = function(linkId) {
		requestBadLinkSources(linkId, prepareAndShowBadLinkSources);
	};

	/** Запускает поиск битых ссылок и показыват результат клиенту */
	var findBadLinks = function() {
		showBadLinksSearchProgressBar();

		var firstStepName = getNameOfBadLinksSearchNextStep();
		var responseHandler = handleBadLinksSearchResponse;
		var errorHandler = stopBadLinksSearch;

		requestBadLinksSearchProgress(firstStepName, responseHandler, errorHandler);
	};

	/**
	 * Возвращает название следующего шага поиска битых ссылок
	 * @param {String|Undefined} currentStep название текущего шага поиска, если он был начат
	 * @returns {String|Undefined}
	 */
	var getNameOfBadLinksSearchNextStep = function(currentStep) {
		var stepsNames = getBadLinkSearchStepsNames();

		if (_.isUndefined(currentStep)) {
			return stepsNames.shift();
		}

		var currentStepIndex = stepsNames.indexOf(currentStep);
		var newStepIndex = currentStepIndex + 1;

		return stepsNames[newStepIndex];
	};

	/**
	 * Возвращает название шагов поиска битых ссылок
	 * @returns {Array}
	 */
	var getBadLinkSearchStepsNames = function() {
		return [
			INDEX_LINKS_STEP_NAME,
			CHECK_LINKS_STEP_NAME
		];
	};

	/**
	 * Запрашивает прогресс поиска битых ссылок и обрабатывает ответ
	 * @param {String} stepName название шага поиска
	 * @param {Function} responseHandler обработчик корректно ответа
	 * @param {Function} errorHandler обработчик ошибочного ответа
	 */
	var requestBadLinksSearchProgress = function(stepName, responseHandler, errorHandler) {
		var requestMethod = getRequestMethodBySearchStepName(stepName);

		var requestParams = {
			type:		"POST",
			url:		REQUEST_PREFIX + MODULE_NAME + '/' + requestMethod + '/.json',
			dataType:	"json",
			data: {
				csrf: getCSRFToken()
			}
		};

		sendAjaxRequest(requestParams, responseHandler, errorHandler);
	};

	/**
	 * Запрашивает добавление сайта в Яндекс.Вебмастер
	 * @param {Integer} domainId идентификатор домена, на основен его данных будет добавлен сайт
	 */
	var requestAddSite = function(domainId) {
		var requestParams = {
			type:		'POST',
			url:		REQUEST_PREFIX + MODULE_NAME + '/' + REQUEST_ADD_SITE_METHOD + '/.json',
			dataType:	'json',
			data: {
				csrf: getCSRFToken(),
				domain_id: domainId
			}
		};

		sendAjaxRequest(requestParams, function() {
			dc_application.refresh();
		}, showMessage);
	};

	/**
	 * Запрашивает подтверждение прав на сайт в Яндекс.Вебмастер
	 * @param {String} siteId идентификатор сайта в Яндекс.Вебмастер
	 */
	var requestVerifySite = function(siteId) {
		var requestParams = {
			type:		'POST',
			url:		REQUEST_PREFIX + MODULE_NAME + '/' + REQUEST_VERIFY_SITE_METHOD + '/.json',
			dataType:	'json',
			data: {
				csrf: getCSRFToken(),
				site_id: siteId
			}
		};

		sendAjaxRequest(requestParams, function() {
			dc_application.refresh();
		}, showMessage);
	};

	/**
	 * Запрашивает добавление карты сайта в Яндекс.Вебмастер
	 * @param {String} siteId идентификатор сайта в Яндекс.Вебмастер
	 */
	var requestAddSiteMap = function(siteId) {
		var requestParams = {
			type:		'POST',
			url:		REQUEST_PREFIX + MODULE_NAME + '/' + REQUEST_ADD_SITE_MAP_METHOD + '/.json',
			dataType:	'json',
			data: {
				csrf: getCSRFToken(),
				site_id: siteId
			}
		};

		sendAjaxRequest(requestParams, function() {
			dc_application.refresh();
		}, showMessage);
	};

	/**
	 * Запрашивает удаление сайта из Яндекс.Вебмастер
	 * @param {String} siteId идентификатор сайта в Яндекс.Вебмастер
	 */
	var requestDeleteSite = function(siteId) {
		var requestParams = {
			type:		'POST',
			url:		REQUEST_PREFIX + MODULE_NAME + '/' + REQUEST_DELETE_SITE_METHOD + '/.json',
			dataType:	'json',
			data: {
				csrf: getCSRFToken(),
				site_id: siteId
			}
		};

		sendAjaxRequest(requestParams, function() {
			dc_application.refresh();
		}, showMessage);
	};

	/**
	 * Открывает страницу с информацией о сайте из Яндекс.Вебмастер
	 * @param {String} siteId идентификатор сайта в Яндекс.Вебмастер
	 */
	var openSiteInfoPage = function(siteId) {
		document.location.href = REQUEST_PREFIX + MODULE_NAME + '/' + REQUEST_GET_SITE_INFO_METHOD + '/' + siteId + '/';
	};

	/**
	 * Возвращает идентификатор выбранной сущности в табличном контроле
	 * @returns {String|Integer}
	 */
	var getSelectedId = function() {
		return dc_application.unPackId(getSelectedEntity().attributes.id);
	};

	/**
	 * Возвращает выбранную сущность в табличном контроле
	 * @returns {Object}
	 */
	var getSelectedEntity = function() {
		return dc_application.toolbar.selectedItems[0];
	};

	/**
	 * Определяет выбрана ли только одна сущность в табличном контроле
	 * @returns {Boolean}
	 */
	var isOneEntitySelected = function() {
		return dc_application.toolbar.selectedItemsCount === 1;
	};

	/**
	 * Возвращает значение поля выбранной сущности табличного контрола
	 * @param {String} name название поля
	 * @returns {*}
	 */
	var getSelectedEntityValue = function(name) {
		var item = getSelectedEntity();
		return (typeof item === 'object') ? item.attributes[name] : '';
	};

	/**
	 * Возвращает описание функций тулбара табличного контрола списка сайтов
	 * @return {Object}
	 */
	var getSiteListToolBarFunctions = function() {
		return {
			view: {
				name: 'view',
				className: 'i-vision',
				hint: getLabel('js-label-yandex-button-view'),
				init: function(button) {
					if (!isOneEntitySelected()) {
						return dc_application.toolbar.disableButtons(button);
					}

					var statusCode = getSelectedEntityValue('status_code');

					if (statusCode === 'OK') {
						dc_application.toolbar.enableButtons(button);
					} else {
						dc_application.toolbar.disableButtons(button);
					}
				},
				release: function() {
					openSiteInfoPage(getSelectedId());
					return false;
				}
			},
			add: {
				name: 'add',
				className: 'i-add',
				hint: getLabel('js-label-yandex-button-add'),
				init: function(button) {
					if (!isOneEntitySelected()) {
						return dc_application.toolbar.disableButtons(button);
					}

					var statusCode = getSelectedEntityValue('status_code');

					if (statusCode === 'NOT_ADDED') {
						dc_application.toolbar.enableButtons(button);
					} else {
						dc_application.toolbar.disableButtons(button);
					}
				},
				release: function() {
					requestAddSite(getSelectedId());
					return false;
				}
			},
			verify: {
				name: 'verify',
				className: 'i-edit',
				hint: getLabel('js-label-yandex-button-verify'),
				init: function(button) {
					if (!isOneEntitySelected()) {
						return dc_application.toolbar.disableButtons(button);
					}

					var verifyCode = getSelectedEntityValue('verify_code');
					var statusCode = getSelectedEntityValue('status_code');

					if (verifyCode === 'VERIFIED' || verifyCode === 'IN_PROGRESS' || statusCode === 'NOT_ADDED') {
						dc_application.toolbar.disableButtons(button);
					} else {
						dc_application.toolbar.enableButtons(button);
					}
				},
				release: function() {
					requestVerifySite(getSelectedId());
					return false;
				}
			},
			add_site_map: {
				name: 'add_site_map',
				className: 'i-create',
				hint: getLabel('js-label-yandex-button-add_site_map'),
				init: function(button) {
					if (!isOneEntitySelected()) {
						return dc_application.toolbar.disableButtons(button);
					}

					var isSiteMapAdded = getSelectedEntityValue('is_site_map_added');
					var verifyCode = getSelectedEntityValue('verify_code');
					var statusCode = getSelectedEntityValue('status_code');

					if (isSiteMapAdded || verifyCode !== 'VERIFIED' || statusCode !== 'OK') {
						dc_application.toolbar.disableButtons(button);
					} else {
						dc_application.toolbar.enableButtons(button);
					}
				},
				release: function() {
					requestAddSiteMap(getSelectedId());
					return false;
				}
			},
			remove: {
				name: 'delete',
				className: 'i-remove',
				hint: getLabel('js-label-yandex-button-delete'),
				init: function(button) {
					if (!isOneEntitySelected()) {
						return dc_application.toolbar.disableButtons(button);
					}

					var statusCode = getSelectedEntityValue('status_code');

					if (statusCode === 'NOT_ADDED') {
						dc_application.toolbar.disableButtons(button);
					} else {
						dc_application.toolbar.enableButtons(button);
					}
				},
				release: function() {
					requestDeleteSite(getSelectedId());
					return false;
				}
			},
			refresh: {
				name: 'refresh',
				className: 'i-restore',
				hint: getLabel('js-label-yandex-button-refresh'),
				init: function(button) {
					dc_application.toolbar.enableButtons(button);
				},
				release: function() {
					dc_application.refresh();
					return false;
				}
			}
		};
	};

	/**
	 * Возвращает список названий кнопок для формирования меню тулбара табличного контрола списка сайтов
	 * @returns {String[]}
	 */
	var getSiteListToolBarMenu = function() {
		return ['view', 'add', 'verify', 'add_site_map', 'remove', 'refresh'];
	};

	/**
	 * Возвращает список значений для переключение постраничного вывода (Элементов на странице: 10 20 50 100)
	 * @returns {Array}
	 */
	var getSiteListPageLimitList = function() {
		return [];
	};

	/**
	 * Возвращает описание функций тулбара табличного контрола списка доменов для вкладки sitemap
	 * @return {Object}
	 */
	var getSiteMapToolBarFunctions = function() {
		return {
			updateSiteMap: {
				name: 'updateSiteMap',
				className: 'i-site-map-update',
				hint: getLabel('js-label-button-refresh-sitemap'),
				init: function(button) {
					return dc_application.toggleToolBarButton(button, function(TableControl) {
						return TableControl.isOneRowSelected();
					});
				},
				release: function() {
					showUpdateSiteMapForm(
						getLabel('js-update-sitemap-submit'),
						getLabel('js-update-sitemap'),
						'updateSiteMap'
					);
					return false;
				}
			},
			updateSiteMapImages: {
				name: 'updateSiteMapImages',
				className: 'i-site-map-image-update',
				hint: getLabel('js-label-button-refresh-sitemap-images'),
				init: function(button) {
					return dc_application.toggleToolBarButton(button, function(TableControl) {
						return TableControl.isOneRowSelected();
					});
				},
				release: function() {
					showUpdateSiteMapForm(
						getLabel('js-update-sitemap-images-submit'),
						getLabel('js-update-sitemap-images'),
						'updateSiteMapImages'
					);
					return false;
				}
			}
		};
	};

	/**
	 * Возвращает список названий кнопок для формирования меню тулбара табличного контрола списка доменов
	 * @returns {String[]}
	 */
	var getSiteMapToolBarMenu = function() {
		return ['updateSiteMap', 'updateSiteMapImages'];
	};

	/**
	 * Показывает форму подтверждения обновления карты сайта
	 * @param {String} content содержимое окна
	 * @param {String} header заголовок окна
	 * @param {String} method метод бекенда
	 */
	var showUpdateSiteMapForm = function(content, header, method) {
		openDialog(content, header, {
			width: 390,
			cancelButton: true,
			confirmText: getLabel('js-label-yes'),
			cancelText: getLabel('js-label-no'),
			confirmCallback: function (popupName) { 
				$.get('/styles/skins/modern/design/js/common/html/TemplateUpdateSitemap.html', function(html) {
					openDialog('', header, {
						stdButtons: false,
						html: html,
						width: 390,
						openCallback: function(popupSelector) {
							initTemplateUpdateSiteMap(popupSelector);
						}
					});
					updatingIsStopped = false;
					processUpdateSiteMap(method);
					closeDialog(popupName);
				});	
			}
		});
	};

	/** Инициализирует шаблон сообщения окна обновления карты */
	var initTemplateUpdateSiteMap = function(popupSelector) {
		replaceJsI18nConstants('div[data-i18n-value]', popupSelector, function($element, label) {
			$element.text(label);
		});

		replaceJsI18nConstants('input[data-i18n-value]', popupSelector, function($element, label) {
			$element.val(label);
		});
	};

	/**
	 * Заменяет языковую метку элемента на ее значение
	 * @param {String} elementSelector селектор элемента
	 * @param {String} containerSelector селектор контейнера элемента
	 * @param {Function} callback функция обратного вызова для установки значения метки
	 */
	var replaceJsI18nConstants = function(elementSelector, containerSelector, callback) {
		$(elementSelector, containerSelector).each(function() {
			var $element = $(this);
			var key = $element.data('i18n-value');
			var label = getLabel(key);
			callback($element, label);
		});
	};

	/** Сообщает об ошибке в процессе обновления карты сайта */
	var reportErrorUpdateSiteMap = function(msg) {
		$('#export_log').append(msg + "<br />");
		$('.progress', '.exchange_container').detach();
		$('#process-header').detach();
		$('#exchange-container').detach();
		$.get('/styles/skins/modern/design/js/common/html/TemplateOkButton.html', function(html) {
			$('.eip_buttons').html(html);
			$('.eip_buttons #ok_btn').val(getLabel('js-sitemap-ok'));
			$('#ok_btn').one("click", function() { closeDialog(); });
		});
		if (window.session) {
			window.session.stopAutoActions();
		}
	}

	/** Сообщает о завершении обновления карты сайта */
	var completeUpdatingSiteMap = function() {
		var container = $('.exchange_container');
		$('#process-header', container).text(getLabel('js-sitemap-updating-complete'));
		$('.eip_buttons #stop_btn').val(getLabel('js-sitemap-ok'));
		var progressBar = $('.progress-bar', container);
		progressBar.attr('aria-valuenow', 0);
		progressBar.css('width', 0);
	}

	/** @var boolean updatingIsStopped остановить обновление карты сайта */
	var updatingIsStopped = false;

	/**
	 * Выполняет обновление карты сайта
	 * @param {String} method метод бекенда
	 */
	var processUpdateSiteMap = function (method) {
		var TableControl = dc_application;
		var domainId = TableControl.getFirstSelectedId();
		$('#stop_btn').one("click", function() {
			updatingIsStopped = true;
			closeDialog();
			return false;
		});

		if (window.session) {
			window.session.startAutoActions();
		}

		$.ajax({
			type: "GET",
			url: "/admin/seo/" + method + "/"+ domainId +".xml"+"?r=" + Math.random(),
			dataType: "xml",

			success: function(doc){
				var data_nl = doc.getElementsByTagName('data');
				if (!data_nl.length) {
					reportErrorUpdateSiteMap(getLabel('js-sitemap-ajax-error'));
					return false;
				}
				var data = data_nl[0];
				var complete = data.getAttribute('complete') || false;

				if (complete === false) {
					var errors = data.getElementsByTagName('error');
					var error = errors[0] || false;

					var errorMessage = '';
					if (error !== false) {
						errorMessage = error.textContent;
					} else {
						errorMessage = getLabel('js-sitemap-ajax-error');
					}

					reportErrorUpdateSiteMap(errorMessage);
					return false;
				}

				if (complete == 1) {
					if (window.session) {
						window.session.stopAutoActions();
					}
					completeUpdatingSiteMap();
				} else if (!updatingIsStopped) {
					processUpdateSiteMap(method);
				}
			},
			error: function(event, XMLHttpRequest, ajaxOptions, thrownError) {
				if (window.session) {
					window.session.stopAutoActions();
				}
				reportErrorUpdateSiteMap(getLabel('js-sitemap-ajax-error'));
			}
		});
	};

	/**
	 * Возвращает описание функций тулбара табличного контрола списка доменов для вкладки robots
	 * @return {Object}
	 */
	var getRobotsToolBarFunctions = function() {
		return {
			editRobots: {
				name: 'editRobots',
				className: 'i-edit',
				hint: getLabel('js-label-button-edit-robots'),
				init: function(button) {
					return dc_application.toggleToolBarButton(button, function(TableControl) {
						return TableControl.isOneRowSelected();
					});
				},
				release: function() {
					showRobotsEditForm();
					return false;
				}
			}
		};
	};

	/**
	 * Возвращает список названий кнопок для формирования меню тулбара табличного контрола вкладки robots
	 * @returns {String[]}
	 */
	var getRobotsToolBarMenu = function() {
		return ['editRobots'];
	};

	/** Показывает форму редактирования robots.txt */
	var showRobotsEditForm = function() {
		$.get('/styles/skins/modern/design/js/common/html/TemplateRobotsEditForm.html', function(html) {
			openDialog('', getLabel('js-label-button-edit-robots'), {
				html: html,
				width: 500,
				cancelButton: true,
				confirmText: getLabel('js-label-save-robots-txt'),
				cancelText: getLabel('js-cancel'),
				customClass: 'modalUp',
				confirmCallback: function(popupName, popupSelector) {
					var data = parseRobotsEditForm(popupSelector);
					requestRobotsEdit(data);
					closeDialog(popupName);
				},
				openCallback: function(popupSelector) {
					initRobotsEditForm(popupSelector);
				}
			});
		});
	};

	/**
	 * Запрашивает редактирование robots.txt
	 * @param {Object} data данные robots.txt
	 */
	var requestRobotsEdit = function(data) {
		var TableControl = dc_application;
		data['domain_id'] = TableControl.getFirstSelectedId();

		var requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_EDIT_ROBOTS_METHOD),
			dataType: 'json',
			data: data
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			TableControl.refresh();
		}, false);
	};

	/**
	 * Инициализирует форму редактирования robots.txt
	 * @param {String} popupSelector селектор окна с формой
	 */
	var initRobotsEditForm = function(popupSelector) {
		$('div[data-i18n-value]', popupSelector).each(function() {
			var $div = $(this);
			var key = $div.data('i18n-value');
			$div.text(getLabel(key));
		});
		requestGetRobotsTxt(popupSelector);
	};

	/**
	 * Запрашивает текущеие значение robots.txt для домена
	 * @param {String} popupSelector селектор окна с формой
	 */
	var requestGetRobotsTxt = function(popupSelector) {
		var data = {};
		var TableControl = dc_application;
		data['domain_id'] = TableControl.getFirstSelectedId();

		var requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_GET_ROBOTS_METHOD),
			dataType: 'json',
			data: data
		};

		DefaultModule.sendAjaxRequest(requestParams, function(json) {
			if (json.data['robots_txt']) {
				$('#text-robots-txt', popupSelector).val(json.data['robots_txt']);
			}
		}, false);
	};

	/**
	 * Извлекает данные формы редактирования robots.txt
	 * @param {String} popupSelector селектор окна с формой
	 * @returns {{
	 *      'data[text]': String,
	 * }}
	 */
	var parseRobotsEditForm = function(popupSelector) {
		return {
			'robots_txt': $('#text-robots-txt', popupSelector).val()
		};
	};

	/**
	 * Обрабатывает progress bar битых ссылок.
	 * В зависимости от полученных данных, продожает или завершает поиск.
	 * @param {Object} result результат запрос прогресса поиска битых ссылок
	 */
	var handleBadLinksSearchResponse = function(result) {
		var isResultCorrect =
			!(_.isUndefined(result.isComplete) || _.isUndefined(result.step) || _.isUndefined(result.info));

		if (!isResultCorrect) {
			return stopBadLinksSearch(ERROR_REQUEST_MESSAGE);
		}

		var responseHandler = handleBadLinksSearchResponse;
		var errorHandler = stopBadLinksSearch;

		if (!result.isComplete) {
			setBadLinksSearchProgressBarMessage(result.info);
			return requestBadLinksSearchProgress(result.step, responseHandler, errorHandler);
		}

		var nextStepName = getNameOfBadLinksSearchNextStep(result.step);

		if (!_.isUndefined(nextStepName)) {
			return requestBadLinksSearchProgress(nextStepName, responseHandler, errorHandler);
		}

		finishBadLinksSearch();
	};

	/** Успешно завершает поиск битых ссылок */
	var finishBadLinksSearch = function() {
		var successMessage = getLabel('js-label-bad-links-search-complete');
		setBadLinksSearchProgressBarMessage(successMessage);
		hideBadLinksSearchProgressBarAnimation();
		setBadLinksSearchProgressBarButtonValue(getLabel('js-label-close'));

		$('#'+ BAD_LINKS_SEARCH_CANCEL_BUTTON_ID).on('click', function(){
			window.location.reload();
		});
	};

	/**
	 * Прерывает поиск битых ссылок и показывает результирующее сообщение
	 * @param {String} message сообщение
	 */
	var stopBadLinksSearch  = function(message) {
		closeBadLinksSearchProgressBarWindow();
		showMessage(message);
	};

	/** Показывает окно с progress bar поиска битых ссылок */
	var showBadLinksSearchProgressBar = function() {
		var template = _.template($('#' + BAD_LINKS_SEARCH_TEMPLATE_ID).html());

		var content = template({
			id: BAD_LINKS_SEARCH_INFO_ELEMENT_ID,
			message: getLabel('js-label-bad-links-search-start-message')
		});

		var popupOptions = {
			width: 400,
			html: content,
			confirmButton: false,
			cancelButton: true,
			cancelText: getLabel('js-label-interrupt'),
			cancelCallback: closeBadLinksSearchProgressBarWindow,
			closeCallback: closeBadLinksSearchProgressBarWindow
		};

		openDialog('', getLabel('js-label-bad-links-search'), popupOptions);
	};

	/**
	 * Устанавливает сообщение для progress bar поиска битых ссылок
	 * @param {String} message сообщение
	 */
	var setBadLinksSearchProgressBarMessage = function(message) {
		$('#'+ BAD_LINKS_SEARCH_INFO_ELEMENT_ID).html(message);
	};

	/**
	 * Обновляет текст кнопки прогрес бара поиска битых ссылок
	 * @param {String} text текст
	 */
	var setBadLinksSearchProgressBarButtonValue = function(text) {
		$('#'+ BAD_LINKS_SEARCH_CANCEL_BUTTON_ID).val(text);
	};

	/** Скрывает анимацию progress bar поиска битых ссылок */
	var hideBadLinksSearchProgressBarAnimation = function() {
		$('.' + BAD_LINKS_SEARCH_ANIMATION_WRAPPER_CLASS).hide();
	};

	/** Закрывает окно с progress bar поиска битых ссылок */
	var closeBadLinksSearchProgressBarWindow = function() {
		closeDialog();
	};

	/**
	 * Возвращает имя метода, который отвечает за выполнение шага поиска битых ссылок
	 * @param {String} stepName имя шага поиска битых ссылок
	 * @returns {String} имя метода или null, если передан имя неизвестного шага
	 * @throws Error
	 */
	var getRequestMethodBySearchStepName = function(stepName) {
		switch (stepName) {
			case INDEX_LINKS_STEP_NAME : {
				return REQUEST_INDEX_LINKS_METHOD;
			}
			case CHECK_LINKS_STEP_NAME : {
				return REQUEST_CHECK_LINKS_METHOD;
			}
		}

		throw new Error(getLabel('js-error-label-unknown-search-step-name'));
	};

	/**
	 * Оформляет источники битой ссылки и показывает их пользователю во всплывающем окне
	 * @param {Array} linkSources
	 */
	var prepareAndShowBadLinkSources = function(linkSources) {
		var template = _.template($('#' + BAD_LINK_SOURCES_TEMPLATE_ID).html());

		var content = template({
			header: getLabel('js-label-header-sources'),
			sources: linkSources
		});

		var popupOptions = {
			width: 650,
			html: content,
			confirmText: getLabel('js-confirm'),
			closeButton: false
		};

		openDialog('', getLabel('js-label-title-sources'), popupOptions);
	};

	/**
	 * Запрашивает источники битой ссылки и вызывает callback в случае успеха
	 * @param {Integer} linkId идентификатор битой ссылки
	 * @param {Function} showSources callback успешного запроса
	 */
	var requestBadLinkSources = function(linkId, showSources) {
		var requestParams = {
			type:		"GET",
			url:		REQUEST_PREFIX + MODULE_NAME + '/' + REQUEST_LINK_SOURCES_METHOD + '/.json',
			dataType:	"json",
			data: 	{
				param0: linkId,
				csrf: getCSRFToken()
			}
		};

		sendAjaxRequest(requestParams, showSources, handleRequestError);
	};

	/**
	 * Отправляет ajax запрос
	 * @param {Object} requestParams параметры запроса
	 * @param {Function} successCallback обработчик успешного получения ответа
	 * @param {Function} errorCallback обработчик ошибочного получения ответа
	 */
	var sendAjaxRequest = function(requestParams, successCallback, errorCallback) {
		var response = $.ajax(requestParams);

		response.done(function(result){
			if (isRequestResultContainsErrorMessage(result)) {
				return errorCallback(result.data.error);
			}

			if (isRequestResultContainsException(result)) {
				return errorCallback(result.message);
			}

			successCallback(result);
		});

		response.fail(function(){
			var message = ERROR_REQUEST_MESSAGE;

			if (response.status === 403 && response.responseJSON && response.responseJSON.data && response.responseJSON.data.error) {
				message = response.responseJSON.data.error;
			}

			errorCallback(message);
		});
	};

	/**
	 * Проверяет содержит ли результат запроса сообщение об ошибке и возвращает результат проверки
	 * @param {Object} result результат запроса
	 * @returns {Boolean}
	 */
	var isRequestResultContainsErrorMessage = function(result) {
		return !_.isUndefined(result.data) && !_.isUndefined(result.data.error);
	};

	/**
	 * Проверяет содержит ли результат запроса данные исключения и возвращает результат проверки
	 * @param {Object} result результат запроса
	 * @returns {Boolean}
	 */
	var isRequestResultContainsException = function(result) {
		return !_.isUndefined(result.code) && !_.isUndefined(result.trace) && !_.isUndefined(result.message);
	};

	/**
	 * Обрабатывает ошибку запроса
	 * @param {String} message текст ошибки
	 */
	var handleRequestError = function(message) {
		return showMessage(message);
	};

	/**
	 * Показывает сообщение
	 * @param {String} message сообщение
	 */
	var showMessage = function(message) {
		$.jGrowl(message);
	};

	/**
	 * Возвращает CSRF токен
	 * @returns {String}
	 */
	var getCSRFToken = function() {
		return csrfProtection.token;
	};

	return {
		showBadLinkSources: showBadLinkSources,
		findBadLinks: findBadLinks,
		getSiteListToolBarFunctions: getSiteListToolBarFunctions,
		getSiteListToolBarMenu: getSiteListToolBarMenu,
		getSiteListPageLimitList: getSiteListPageLimitList,
		getSiteMapToolBarFunctions: getSiteMapToolBarFunctions,
		getSiteMapToolBarMenu: getSiteMapToolBarMenu,
		getRobotsToolBarFunctions: getRobotsToolBarFunctions,
		getRobotsToolBarMenu: getRobotsToolBarMenu
	};
})(jQuery, _);

/**
 * Функционал административной панели модуля Статистика:
 *
 * 1) CRUD действия над списком счетчиков из "Яндекс.Метрика";
 * 2) Фильтры по периоду времени для статистики счетчика из "Яндекс.Метрика";
 */
var StatModule = (function($, _) {
	"use strict";

	/** @type {String} MODULE_NAME системное имя модуля */
	var MODULE_NAME = 'stat';
	/** @type {String} REQUEST_PREFIX префикс запроса к api */
	var REQUEST_PREFIX = '/admin/';
	/** @type {String} REQUEST_ADD_COUNTER_METHOD метод, который добавляет счетчик в "Яндекс.Метрика" */
	var REQUEST_ADD_COUNTER_METHOD = 'addCounter';
	/** @type {String} REQUEST_DELETE_COUNTER_METHOD метод, который удаляет счетчик из "Яндекс.Метрика" */
	var REQUEST_DELETE_COUNTER_METHOD = 'deleteCounter';
	/** @type {String} REQUEST_SAVE_COUNTER_CODE_METHOD метод, инициирует сохранение кода счетчика */
	var REQUEST_SAVE_COUNTER_CODE_METHOD = 'saveCounterCode';
	/** @type {String} REQUEST_DOWNLOAD_COUNTER_CODE_METHOD метод, инициирует скачивание кода счетчика */
	var REQUEST_DOWNLOAD_COUNTER_CODE_METHOD = 'downloadCounterCode';
	/** @type {String} REQUEST_GET_COUNTER_STAT_METHOD метод, запрашивает статистику счетчика */
	var REQUEST_GET_COUNTER_STAT_METHOD = 'getCounterStat';
	/** @type {String} DEFAULT_STAT_PAGE страница статистики, по умолчанию */
	var DEFAULT_STAT_PAGE = '/traffic/attendance/';
	/** @type {String} DATE_FILTER_FORM_SELECTOR селектор формы фильтрации по периоду дат */
	var DATE_FILTER_FORM_SELECTOR = '#statdate_settings';
	/** @type {String} DATE_START_INPUT_SELECTOR поле для ввода начала периода времени фильтра */
	var DATE_START_INPUT_SELECTOR = 'input[name = "fromDate"]';
	/** @type {String} DATE_START_INPUT_SELECTOR поле для ввода конца периода времени фильтра */
	var DATE_END_INPUT_SELECTOR = 'input[name = "toDate"]';
	/** @type {String} ERROR_REQUEST_MESSAGE сообщение об ошибке, если запрос к серверу завершился неудачно */
	var ERROR_REQUEST_MESSAGE = getLabel('js-label-request-error');

	/** Выполняется, когда все элементы DOM готовы */
	$(function () {
		bindFilterButton();
	});

	/** Прикрепляет к кнопке фильтрации действие */
	var bindFilterButton = function() {
		getDateFilterForm().on('submit', redirectToUrlWithFilter);
	};

	/**
	 * Возвращает форму фильтрации статистики по периоду времени
	 * @returns {*|HTMLElement}
	 */
	var getDateFilterForm = function() {
		return $(DATE_FILTER_FORM_SELECTOR);
	};

	/**
	 * Перенаправляет на страницу с примененным фильтром
	 * @param {Object} event событие отправки формы фильтра по периоду времени
	 */
	var redirectToUrlWithFilter = function(event) {
		event.preventDefault();
		var startDateTime = getDateStart().val();
		var endDateTime = getEndStart().val();
		var pattern = /\d{4}-\d{2}-\d{2}\s?\d{0,2}\:?\d{0,2}\:?\d{0,2}\:?$/;

		if (!pattern.test(startDateTime) || !pattern.test(endDateTime)) {
			alert(getLabel('js-error-label-incorrect-date-period'));
			return;
		}

		var startDate = trimDateTime(startDateTime);
		var endDate = trimDateTime(endDateTime);
		window.location.href = buildFilterUrl(startDate, endDate);
	};

	/**
	 * Удаляет из даты время
	 * @param {String} dateWithTime дата со временем
	 * @return {String}
	 */
	var trimDateTime = function(dateWithTime) {
		return dateWithTime.replace(/\s\d{1,2}:\d{1,2}(:\d{1,2})?$/, '');
	};

	/**
	 * Удаляет из адреса страницы фильтр по периоду времени
	 * @param {String} url адрес страницы
	 * @return {String}
	 */
	var trimDateFilter = function(url) {
		return url.replace(/(\d{4}\-\d{2}\-\d{2}\/){2}$/, '');
	};

	/**
	 * Возвращает поле ввода начала периода времени фильтра
	 * @returns {*|HTMLElement}
	 */
	var getDateStart = function() {
		return $(DATE_START_INPUT_SELECTOR);
	};

	/**
	 * Возвращает поле ввода конца периода времени фильтра
	 * @returns {*|HTMLElement}
	 */
	var getEndStart = function() {
		return $(DATE_END_INPUT_SELECTOR);
	};

	/**
	 * Формирует адрес страницы с фильтром по периоду времени
	 * @param {String} startDate начало периода (в формате Y-m-d)
	 * @param {String} endDate конец периода (в формате Y-m-d)
	 * @returns {String}
	 */
	var buildFilterUrl = function(startDate, endDate) {
		var url = trimDateFilter(window.location.href);
		return url + startDate +  '/' + endDate + '/';
	};

	/**
	 * Возвращает описание функций тулбара табличного контрола списка счетчиков
	 * @return {Object}
	 */
	var getCounterListToolBarFunctions = function() {
		return {
			add: {
				name: 'add',
				className: 'i-add',
				hint: getLabel('js-label-yandex-metric-button-add'),
				init: function(button) {
					if (!isOneEntitySelected()) {
						return dc_application.toolbar.disableButtons(button);
					}

					var statusCode = getSelectedEntityValue('status_code');

					if (statusCode === 'CS_AVAILABLE') {
						dc_application.toolbar.enableButtons(button);
					} else {
						dc_application.toolbar.disableButtons(button);
					}
				},
				release: function() {
					requestAddCounter(getSelectedId());
					return false;
				}
			},
			view: {
				name: 'view',
				className: 'i-vision',
				hint: getLabel('js-label-yandex-metric-button-view'),
				init: function(button) {
					if (!isOneEntitySelected()) {
						return dc_application.toolbar.disableButtons(button);
					}

					var statusCode = getSelectedEntityValue('status_code');

					if (statusCode === 'CS_OK') {
						dc_application.toolbar.enableButtons(button);
					} else {
						dc_application.toolbar.disableButtons(button);
					}
				},
				release: function() {
					openCounterStatPage(getSelectedId());
					return false;
				}
			},
			code: {
				name: 'code',
				className: 'i-see',
				hint: getLabel('js-label-yandex-metric-button-code'),
				init: function(button) {
					if (!isOneEntitySelected()) {
						return dc_application.toolbar.disableButtons(button);
					}

					var statusCode = getSelectedEntityValue('status_code');

					if (statusCode !== 'CS_AVAILABLE') {
						dc_application.toolbar.enableButtons(button);
					} else {
						dc_application.toolbar.disableButtons(button);
					}
				},
				release: function() {
					requestDownloadCounterCode(getSelectedId());
					return false;
				}
			},
			remove: {
				name: 'delete',
				className: 'i-remove',
				hint: getLabel('js-label-yandex-metric-button-delete'),
				init: function(button) {
					if (!isOneEntitySelected()) {
						return dc_application.toolbar.disableButtons(button);
					}

					var statusCode = getSelectedEntityValue('status_code');

					if (statusCode !== 'CS_AVAILABLE') {
						dc_application.toolbar.enableButtons(button);
					} else {
						dc_application.toolbar.disableButtons(button);
					}
				},
				release: function() {
					requestDeleteCounter(getSelectedId());
					return false;
				}
			},
			refresh: {
				name: 'refresh',
				className: 'i-restore',
				hint: getLabel('js-label-yandex-metric-button-refresh'),
				init: function(button) {
					dc_application.toolbar.enableButtons(button);
				},
				release: function() {
					dc_application.refresh();
					return false;
				}
			}
		};
	};

	/**
	 * Возвращает список названий кнопок для формирования меню тулбара табличного контрола списка счетчиков
	 * @returns {String[]}
	 */
	var getCounterListToolBarMenu = function() {
		return ['add', 'view', 'code', 'remove', 'refresh'];
	};

	/**
	 * Возвращает список значений для переключение постраничного вывода (Элементов на странице: 10 20 50 100)
	 * @returns {Array}
	 */
	var getCounterListPageLimitList = function() {
		return [];
	};

	/**
	 * Возвращает идентификатор выбранной сущности в табличном контроле
	 * @returns {String|Integer}
	 */
	var getSelectedId = function() {
		return dc_application.unPackId(getSelectedEntity().attributes.id);
	};

	/**
	 * Возвращает выбранную сущность в табличном контроле
	 * @returns {Object}
	 */
	var getSelectedEntity = function() {
		return dc_application.toolbar.selectedItems[0];
	};

	/**
	 * Возвращает значение поля выбранной сущности табличного контрола
	 * @param {String} name название поля
	 * @returns {*}
	 */
	var getSelectedEntityValue = function(name) {
		var item = getSelectedEntity();
		return (typeof item === 'object') ? item.attributes[name] : '';
	};

	/**
	 * Определяет выбрана ли только одна сущность в табличном контроле
	 * @returns {Boolean}
	 */
	var isOneEntitySelected = function() {
		return dc_application.toolbar.selectedItemsCount === 1;
	};

	/**
	 * Открывает страницу со статистикой счетчика
	 * @param {Integer} counterId идентификатор счетчика
	 */
	var openCounterStatPage = function(counterId) {
		var url = REQUEST_PREFIX + MODULE_NAME + '/' + REQUEST_GET_COUNTER_STAT_METHOD + '/' + counterId +
			DEFAULT_STAT_PAGE;
		redirect(url);
	};

	/**
	 * Запрашивает добавление счетчика в "Яндекс.Метрика"
	 * @param {Integer} domainId идентификатор домена
	 */
	var requestAddCounter = function(domainId) {
		var requestParams = {
			type:		'POST',
			url:		REQUEST_PREFIX + MODULE_NAME + '/' + REQUEST_ADD_COUNTER_METHOD + '/.json',
			dataType:	'json',
			data: {
				csrf: getCSRFToken(),
				domain_id: domainId
			}
		};

		sendAjaxRequest(requestParams, function() {
			dc_application.refresh();
		}, showMessage);
	};

	/**
	 * Запрашивает удаление счетчика из "Яндекс.Метрика"
	 * @param {String} counterId идентификатор счетчика
	 */
	var requestDeleteCounter = function(counterId) {
		var requestParams = {
			type:		'POST',
			url:		REQUEST_PREFIX + MODULE_NAME + '/' + REQUEST_DELETE_COUNTER_METHOD + '/.json',
			dataType:	'json',
			data: {
				csrf: getCSRFToken(),
				counter_id: counterId
			}
		};

		sendAjaxRequest(requestParams, function() {
			dc_application.refresh();
		}, showMessage);
	};

	/**
	 * Запрашивает скачивание кода счетчика
	 * @param {String} counterId идентификатор счетчика
	 */
	var requestDownloadCounterCode = function(counterId) {
		var requestParams = {
			type:		'GET',
			url:		REQUEST_PREFIX + MODULE_NAME + '/' + REQUEST_SAVE_COUNTER_CODE_METHOD + '/.json',
			dataType:	'json',
			data: {
				csrf: getCSRFToken(),
				counter_id: counterId
			}
		};

		sendAjaxRequest(requestParams, function(response) {
			if (response.data && response.data.success) {
				var url = REQUEST_PREFIX + MODULE_NAME + '/' + REQUEST_DOWNLOAD_COUNTER_CODE_METHOD + '/' + counterId;
				return redirect(url);
			}

			dc_application.refresh();
		}, showMessage);
	};

	/**
	 * Перенаправляет на указанный адрес
	 * @param {String} url адрес
	 */
	var redirect = function(url) {
		document.location.href = url;
	};

	/**
	 * Отправляет ajax запрос
	 * @param {Object} requestParams параметры запроса
	 * @param {Function} successCallback обработчик успешного получения ответа
	 * @param {Function} errorCallback обработчик ошибочного получения ответа
	 */
	var sendAjaxRequest = function(requestParams, successCallback, errorCallback) {
		var response = $.ajax(requestParams);

		response.done(function(result){
			if (isRequestResultContainsErrorMessage(result)) {
				return errorCallback(result.data.error);
			}

			if (isRequestResultContainsException(result)) {
				return errorCallback(result.message);
			}

			successCallback(result);
		});

		response.fail(function(){
			var message = ERROR_REQUEST_MESSAGE;

			if (response.status === 403 && response.responseJSON && response.responseJSON.data && response.responseJSON.data.error) {
				message = response.responseJSON.data.error;
			}

			errorCallback(message);
		});
	};

	/**
	 * Проверяет содержит ли результат запроса сообщение об ошибке и возвращает результат проверки
	 * @param {Object} result результат запроса
	 * @returns {Boolean}
	 */
	var isRequestResultContainsErrorMessage = function(result) {
		return !_.isUndefined(result.data) && !_.isUndefined(result.data.error);
	};

	/**
	 * Проверяет содержит ли результат запроса данные исключения и возвращает результат проверки
	 * @param {Object} result результат запроса
	 * @returns {Boolean}
	 */
	var isRequestResultContainsException = function(result) {
		return !_.isUndefined(result.code) && !_.isUndefined(result.trace) && !_.isUndefined(result.message);
	};

	/**
	 * Показывает сообщение
	 * @param {String} message сообщение
	 */
	var showMessage = function(message) {
		$.jGrowl(message);
	};

	/**
	 * Возвращает CSRF токен
	 * @returns {String}
	 */
	var getCSRFToken = function() {
		return csrfProtection.token;
	};

	return {
		getCounterListToolBarFunctions: getCounterListToolBarFunctions,
		getCounterListToolBarMenu: getCounterListToolBarMenu,
		getCounterListPageLimitList: getCounterListPageLimitList
	};
})(jQuery, _);
/**
 * Модуль, содержащий функционал тулбара табличного контрола шаблонов сайта
 * @type {{getTemplatesListToolBarMenu, getTemplatesListToolBarFunctions}}
 */
let TemplatesModule;
TemplatesModule = (function($, _) {
	"use strict";

	/** @type {String} MODULE_NAME системное имя модуля */
	const MODULE_NAME = 'umiTemplates';
	/** @type {String} REQUEST_ADD_TEMPLATE_METHOD метод, который создает шаблон */
	const REQUEST_ADD_TEMPLATE_METHOD = 'createTemplate';
	/** @type {String} REQUEST_DELETE_TEMPLATE_LIST_METHOD метод, который удаляет шаблоны */
	const REQUEST_DELETE_TEMPLATE_LIST_METHOD = 'deleteTemplateList';
	/** @type {String} REQUEST_GET_TEMPLATE_TREE_METHOD метод, который возвращает дерево шаблонов */
	const REQUEST_GET_TEMPLATE_TREE_METHOD = 'getRelatedPageTree';
	/** @type {String} REQUEST_CHANGE_TEMPLATE_FOR_PAGE_LIST метод, который изменяет шаблон для списка страниц */
	const REQUEST_CHANGE_TEMPLATE_FOR_PAGE_LIST = 'changeTemplateForPageList';
	/** @type {String} REQUEST_CREATE_BACKUP метод, который создает бэкап шаблонов */
	const REQUEST_CREATE_BACKUP = 'createBackup';
	/** @type {String} REQUEST_DOWNLOAD_BACKUP метод, который скачивает бэкап шаблонов */
	const REQUEST_DOWNLOAD_BACKUP = 'downloadBackup';
	/** @type {String} REQUEST_RESTORE_FROM_BACKUP метод, который восстаналивает шаблоны из бэкапа */
	const REQUEST_RESTORE_FROM_BACKUP = 'restoreFromBackup';
	/** @type {String} REQUEST_DELETE_BACKUP_LIST метод, который удаляет список бэкапов */
	const REQUEST_DELETE_BACKUP_LIST = 'deleteBackupList';

	/**
	 * Возвращает реализацию функций тулбара табличного контрола списка шаблонов
	 * @return {Object}
	 */
	let getTemplatesListToolBarFunctions = function() {
		return {
			add: {
				name: 'add',
				className: 'i-add',
				hint: getLabel('js-add'),
				init: function(button) {
					return dc_application.toggleToolBarButton(button, function(TableControl) {
						return !TableControl.hasSelectedRows();
					});
				},
				release: function() {
					showTemplateCreateForm();
					return false;
				}
			},
			remove: {
				name: 'delete',
				className: 'i-remove',
				hint: getLabel('js-remove'),
				init: function(button) {
					return dc_application.toggleToolBarButton(button, function(TableControl) {
						return TableControl.hasSelectedRows();
					});
				},
				release: function() {
					showDeleteTemplatesConfirmationForm();
					return false;
				}
			}
		};
	};

	/** Показывает форму создания шаблона сайта */
	let showTemplateCreateForm = function() {
		$.get('/styles/skins/modern/design/js/common/html/TemplateCreateForm.html', function(html) {
			openDialog('', getLabel('js-label-template-creating'), {
				html: html,
				width: 360,
				cancelButton: true,
				confirmText: getLabel('js-add'),
				cancelText: getLabel('js-cancel'),
				customClass: 'modalUp',
				confirmCallback: function(popupName, popupSelector) {
					let data = parseTemplateCreateFormData(popupSelector);

					if (validateTemplateCreateFormData(data)) {
						requestCreateTemplate(data);
						closeDialog(popupName);
					}
				},
				openCallback: function(popupSelector) {
					initTemplateCreateForm(popupSelector);
				}
			});
		});
	};

	/**
	 * Извлекает данные формы создания шаблона сайта
	 * @param {String} popupSelector селектор окна с формой
	 * @returns {{
	 *      'data[isDefault]': Number,
	 *      'data[type]': String,
	 *      'data[name]': String,
	 *      'data[fileName]': String,
	 *      'data[directory]': String
	 * }}
	 */
	let parseTemplateCreateFormData = function(popupSelector) {
		return {
			'data[name]': $('#new-template-name', popupSelector).val(),
			'data[fileName]': $('#new-template-file-name', popupSelector).val(),
			'data[directory]': $('#new-template-directory', popupSelector).val(),
			'data[type]': $('select[name = "type"] option[selected]', popupSelector).val(),
			'data[isDefault]': $('div.checkbox input', popupSelector).is(':checked') ? 1 : 0
		};
	};

	/**
	 * Валидирует заполнение формы создания шаблона сайта
	 * @param {Object} data данные формы создания шаблона сайта
	 * @returns {boolean}
	 */
	let validateTemplateCreateFormData = function(data) {
		let messageList = [];
		let name = data['data[name]'].toString();

		if (name === '') {
			messageList.push(getLabel('js-error-label-empty-template-name'));
		}

		let fileName = data['data[fileName]'].toString();

		if (!fileName.match(/([a-zA-Z0-9-_]+\.(phtml|xsl|tpl)$)/)) {
			messageList.push(getLabel('js-error-label-invalid-template-file-name'));
		}

		let directory = data['data[directory]'].toString();

		if (!directory.match(/^([a-zA-Z0-9-_\/]+)/)) {
			messageList.push(getLabel('js-error-label-invalid-template-directory'));
		}

		if (messageList.length === 0) {
			return true;
		}

		let message = messageList.join('<br>');
		DefaultModule.showMessage(message);
		return false;
	};

	/**
	 * Инициализирует форму создания шаблона сайта
	 * @param {String} popupSelector селектор окна с формой
	 */
	let initTemplateCreateForm = function(popupSelector) {
		$('div[data-i18n-value]', popupSelector).each(function() {
			let $div = $(this);
			let key = $div.data('i18n-value');
			$div.text(getLabel(key));
		});
		$('label.checkbox-wrapper span[data-i18n-value]', popupSelector).each(function() {
			let $span = $(this);
			let key = $span.data('i18n-value');
			$span.text(getLabel(key));
		});
		$('input[data-i18n-placeholder]', popupSelector).each(function() {
			let $input = $(this);
			let key = $input.data('i18n-placeholder');
			$input.attr('placeholder', getLabel(key));
		});

		$('select[name = "type"]', popupSelector).selectize();
		$('input[name = "isDefault"]', popupSelector).on('click', function(event) {
			let $input = $(event.target);
			$input.toggleClass('checked');
			$input.parent().toggleClass('checked');
		});
	};

	/**
	 * Запрашивает создание нового шаблона
	 * @param {Object} data данные нового шаблона
	 */
	let requestCreateTemplate = function(data) {
		data['data[domain_id]'] = DefaultModule.getDomainId();
		data['data[language_id]'] = DefaultModule.getLanguageId();

		let TableControl = dc_application;
		let requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_ADD_TEMPLATE_METHOD),
			dataType: 'json',
			data: data
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			TableControl.refresh();
		}, false);
	};

	/** Показывает форму подтверждения удаления шаблона сайта */
	let showDeleteTemplatesConfirmationForm = function() {
		openDialog('', getLabel('js-label-template-confirm-delete'), {
			html: getLabel('js-label-template-confirmation-delete'),
			confirmText: getLabel('js-del-do'),
			cancelButton: true,
			cancelText: getLabel('js-cancel'),
			confirmCallback: function (dialogName) {
				requestDeleteTemplateList();
				closeDialog(dialogName);
			}
		});
	};

	/** Запрашивает удаление списка шаблонов, выбранных в табличном контроле */
	let requestDeleteTemplateList = function() {
		let TableControl = dc_application;
		let requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_DELETE_TEMPLATE_LIST_METHOD),
			dataType: 'json',
			data: {
				id_list: TableControl.getSelectedIdList()
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			TableControl.refresh();
		}, false);
	};

	/**
	 * Возвращает список названий кнопок для формирования меню тулбара табличного контрола списка шаблонов
	 * @returns {String[]}
	 */
	let getTemplatesListToolBarMenu = function() {
		return ['add', 'remove'];
	};

	/**
	 * Возвращает реализацию функций тулбара табличного контрола дерева шаблонов
	 * @return {Object}
	 */
	let getRelatedPageTreeToolBarFunctions = function() {
		return {
			bindTemplate: {
				name: 'bindTemplate',
				className: 'i-bind',
				hint: getLabel('js-label-bind-template'),
				init: toggleToolBarButtonForPageAction,
				release: function() {
					triggerShowTemplateSelectForm(function(popupName, popupSelector) {
						let templateId = parseSelectedTemplateId(popupSelector);
						let TableControl = dc_application;
						let selectedIdList = TableControl.getSelectedIdList();
						requestChangeTemplateForSelectedPageList(templateId, selectedIdList, function() {
							TableControl.refresh();
						});
						closeDialog(popupName);
					});
					return false;
				}
			},
			bindTemplateForAll: {
				name: 'bindTemplateForAll',
				className: 'i-mass-bind',
				hint: getLabel('js-label-mass-bind-template'),
				init: toggleToolBarButtonForTemplateAction,
				release: function() {
					triggerShowTemplateSelectForm(function(popupName, popupSelector) {
						let oldTemplateId = dc_application.getFirstSelectedId();
						let newTemplateId = parseSelectedTemplateId(popupSelector);
						closeDialog(popupName);

						if (oldTemplateId === newTemplateId) {
							return DefaultModule.showMessage(getLabel('js-label-error-old-and-new-templates-equal'));
						}

						showProgressWindow(getLabel('js-label-template-change-for-all-pages'));
						requestChangeTemplateForAllPages(oldTemplateId, newTemplateId, '');
					});
					return false;
				}
			}
		};
	};

	/**
	 * Запрашивает смену шаблона для всех страниц заданного шаблона.
	 * @param {Integer|String} oldTemplateId шаблон, которому принадлежат изменяемые страницы
	 * @param {Integer|String} newTemplateId новый шаблон
	 * @param {String} popupName имя окна, которое требуется закрыть по завершению процесса
	 */
	let requestChangeTemplateForAllPages = function(oldTemplateId, newTemplateId, popupName) {
		requestPageList(oldTemplateId, function(response) {
			let idList = DefaultModule.extractIdList(response);

			if (idList.length === 0) {
				dc_application.refresh();
				return closeDialog(popupName);
			}

			requestChangeTemplateForSelectedPageList(newTemplateId, idList, function() {
				requestChangeTemplateForAllPages(oldTemplateId, newTemplateId, popupName);
			});
		});
	};

	/**
	 * Показывает окно с индикатором итерационной операции
	 * @param {String} header заголовок окна
	 */
	let showProgressWindow = function(header) {
		$.get('/styles/skins/modern/design/js/common/html/ProgressBar.html', function(html) {
			openDialog('', header, {
				html: html,
				width: 400,
				cancelButton: false,
				stdButtons: false,
				closeButton: false,
				customClass: 'modalUp'
			});
		});
	};

	/**
	 * Переключает активность кнопки тулбара, работающей только для страниц
	 * @param {Object} button кнопка тулбара
	 * @returns {*|void}
	 */
	let toggleToolBarButtonForPageAction = function(button) {
		dc_application.toggleToolBarButton(button, function(TableControl) {
			return TableControl.hasSelectedRows() && !isTemplateInList(TableControl.getSelectedRowList());
		});
	};

	/**
	 * Запускает показ формы выбора шаблона сайта
	 * @param {Function} selectTemplateCallback обработчик выбора шаблона
	 */
	let triggerShowTemplateSelectForm = function(selectTemplateCallback) {
		requestTemplateList(function(response) {
			let templateList = DefaultModule.extractRowList(response);
			showTemplateSelectForm(templateList, selectTemplateCallback);
		});
	};

	/**
	 * Показывает форму выбора шаблона сайта
	 * @param {Object} templateList список шаблонов сайта
	 * @param {Function} selectTemplateCallback обработчик выбора шаблона
	 */
	let showTemplateSelectForm = function(templateList, selectTemplateCallback) {
		$.get('/styles/skins/modern/design/js/common/html/TemplateSelectForm.html', function(html) {
			openDialog('', getLabel('js-label-template-change-for-pages'), {
				html: html,
				width: 360,
				cancelButton: true,
				confirmText: getLabel('js-choose'),
				cancelText: getLabel('js-cancel'),
				customClass: 'modalUp',
				confirmCallback: selectTemplateCallback,
				openCallback: function(popupSelector) {
					initTemplateSelectForm(popupSelector, templateList);
				}
			});
		});
	};

	/**
	 * Запрашивает список шаблонов сайта
	 * @param {Function} callback обработчик ответа на запрос
	 */
	let requestTemplateList = function(callback) {
		let requestParams = {
			type: 'GET',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_GET_TEMPLATE_TREE_METHOD),
			dataType: 'json',
			data: {
				per_page_limit: 'mode=all',
				p: '0',
				domain_id: DefaultModule.getDomainId()
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, function(response) {
			callback(response);
		}, false);
	};

	/**
	 * Возвращает список страниц, использующих заданный шаблон
	 * @param {Integer|String} templateId идентификатор шаблона
	 * @param {Function} callback обработчик ответа на запрос
	 */
	let requestPageList = function(templateId, callback) {
		let requestParams = {
			type: 'GET',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_GET_TEMPLATE_TREE_METHOD),
			dataType: 'json',
			data: {
				rel: [templateId],
				domain_id: DefaultModule.getDomainId()
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, function(response) {
			callback(response);
		}, false);
	};

	/**
	 * Извлекает идентификатор выбранного шаблона
	 * @param {String} popupSelector селектор окна с формой выбора шаблона
	 * @returns {Integer}
	 */
	let parseSelectedTemplateId = function(popupSelector) {
		return $('select[name = "id"] option[selected]', popupSelector).val();
	};

	/**
	 * Запрашивает смену шаблона для списка выбранных страниц
	 * @param {Integer|String} templateId идентификатор шаблона, на который производится замена
	 * @param {Array} selectedIdList список выбранных страниц
	 * @param {Function} callback обработчик успешной смены
	 */
	let requestChangeTemplateForSelectedPageList = function(templateId, selectedIdList, callback) {
		let pageIdList = [];

		for (let i = 0; i < selectedIdList.length; i++) {
			pageIdList.push({
				id: selectedIdList[i]
			});
		}

		let requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_CHANGE_TEMPLATE_FOR_PAGE_LIST),
			dataType: 'json',
			data: {
				rel: {
					id: templateId
				},
				selected_list: pageIdList
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, callback, false);
	};

	/**
	 * Инициализирует форму создания шаблона сайта
	 * @param {String} popupSelector селектор окна с формой
	 * @param {Object} templateList список шаблонов
	 */
	let initTemplateSelectForm = function(popupSelector, templateList) {
		let templateListPattern = _.template($('#template-option', popupSelector).html());
		let templateListHtml = templateListPattern({
			label: getLabel('js-label-select-template-from-list'),
			templateList: templateList
		});
		$('div.group-block', popupSelector).html(templateListHtml);
		$('select', popupSelector).selectize();
	};

	/**
	 * Переключает активность кнопки тулбара, работающей только для шаблонов
	 * @param {Object} button кнопка тулбара
	 * @returns {*|void}
	 */
	let toggleToolBarButtonForTemplateAction = function(button) {
		dc_application.toggleToolBarButton(button, function(TableControl) {
			return TableControl.hasSelectedRows() && !isNoTemplateInList(TableControl.getSelectedRowList()) && TableControl.isOneRowSelected();
		});
	};

	/**
	 * Возвращает список названий кнопок для формирования меню тулбара табличного контрола дерева шаблонов
	 * @returns {String[]}
	 */
	let getRelatedPageTreeToolBarMenu = function() {
		return ['bindTemplate', 'bindTemplateForAll'];
	};

	/**
	 * Валидирует операцию перетаскивания в табличном контроле дерева привязанных страниц
	 * @param {umiDataTableRow} target элемент, относительно которого выполняется перетаскивание
	 * @param {umiDataTableRow[]} draggedList список перетаскиваемых элементов
	 * @param {String} mode режим перетаскивания (after/before/child)
	 * @returns {String|Boolean}
	 */
	let getRelatedPageTreeDragAndDropValidator = function(target, draggedList, mode) {
		if (isTemplateInList(draggedList) || !isTemplate(target)) {
			return false;
		}

		mode = 'child';
		return mode;
	};

	/**
	 * Определяет есть шаблон в списке сущностей
	 * @param {umiDataTableRow[]} entityList
	 * @returns {Boolean}
	 */
	let isTemplateInList = function(entityList) {
		return entityList.some(isTemplate);
	};

	/**
	 * Определяет отсутствует ли шаблон в списке сущностей
	 * @param {umiDataTableRow[]} entityList
	 * @returns {Boolean}
	 */
	let isNoTemplateInList = function(entityList) {
		return entityList.some(function(entity) {
			return !isTemplate(entity);
		});
	};

	/**
	 * Определяет является ли сущность шаблонов
	 * @param {umiDataTableRow} entity сущность
	 * @returns {Boolean}
	 */
	let isTemplate = function(entity) {
		let attributes = entity.attributes || entity.model.attributes;
		return attributes.module_id === MODULE_NAME;
	};

	/**
	 * Обрабатывает ошибку запроса бекенда
	 * @param {String} errorMessage сообщение об ошибке
	 */
	let handleError = function(errorMessage) {
		DefaultModule.showMessage(errorMessage);
		closeDialog();
		dc_application.refresh();
	};

	/**
	 * Возвращает реализацию функций тулбара табличного контрола списка бэкапов
	 * @return {Object}
	 */
	let getTemplateBackupsToolBarFunctions = function() {
		return {
			create: {
				name: 'create',
				className: 'i-create-backup',
				hint: getLabel('js-label-create-backup'),
				init: function(button) {
					dc_application.toggleToolBarButton(button, function(TableControl) {
						return !TableControl.hasSelectedRows();
					});
				},
				release: function() {
					requestCreateBackup();
					return false;
				}
			},
			download: {
				name: 'download',
				className: 'i-download-backup',
				hint: getLabel('js-label-download-backup'),
				init: function(button) {
					dc_application.toggleToolBarButton(button, function(TableControl) {
						return TableControl.isOneRowSelected();
					});
				},
				release: function() {
					requestDownloadBackup();
					return false;
				}
			},
			restore: {
				name: 'restore',
				className: 'i-restore-backup',
				hint: getLabel('js-label-restore-backup'),
				init: function(button) {
					dc_application.toggleToolBarButton(button, function(TableControl) {
						return TableControl.isOneRowSelected();
					});
				},
				release: function() {
					requestRestoreFromBackup();
					return false;
				}
			},
			remove: {
				name: 'delete',
				className: 'i-delete-backup',
				hint: getLabel('js-label-delete-backup'),
				init: function(button) {
					dc_application.toggleToolBarButton(button, function(TableControl) {
						return TableControl.hasSelectedRows();
					});
				},
				release: function() {
					showDeleteBackupConfirmationForm();
					return false;
				}
			}
		};
	};

	/** Запрашивает создание бэкапа */
	let requestCreateBackup = function() {
		showProgressWindow(getLabel('js-label-backup-creating-processing'));

		let requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_CREATE_BACKUP),
			dataType: 'json'
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			closeDialog();
			dc_application.refresh();
		}, handleError);
	};

	/** Запрашивает скачивание бэкапа */
	let requestDownloadBackup = function() {
		location.href = DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_DOWNLOAD_BACKUP, '?fileName=' + dc_application.getFirstSelectedId());
	};

	/** Запрашивает восстановление из бэкапа */
	let requestRestoreFromBackup = function() {
		showProgressWindow(getLabel('js-label-backup-restoring-processing'));

		let TableControl = dc_application;
		let requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_RESTORE_FROM_BACKUP),
			dataType: 'json',
			data: {
				fileName: TableControl.getFirstSelectedId()
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			closeDialog();
			TableControl.refresh();
		}, handleError);
	};

	/** Показывает форму подтверждения удаления бекапов шаблонов */
	let showDeleteBackupConfirmationForm = function() {
		openDialog('', getLabel('js-label-template-confirm-delete'), {
			html: getLabel('js-label-backup-delete-confirm'),
			confirmText: getLabel('js-del-do'),
			cancelButton: true,
			cancelText: getLabel('js-cancel'),
			confirmCallback: function (dialogName) {
				requestDeleteBackupList();
				closeDialog(dialogName);
			}
		});
	};

	/** Запрашивает удаление бэкапов */
	let requestDeleteBackupList = function() {
		let TableControl = dc_application;
		let requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_DELETE_BACKUP_LIST),
			dataType: 'json',
			data: {
				fileNameList: TableControl.getSelectedIdList()
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			TableControl.refresh();
		}, handleError);
	};

	/**
	 * Возвращает список названий кнопок для формирования меню тулбара табличного контрола списка бэкапов
	 * @returns {String[]}
	 */
	let getTemplateBackupsToolBarMenu = function() {
		return ['create', 'download', 'restore', 'remove'];
	};

	return {
		getTemplatesListToolBarFunctions: getTemplatesListToolBarFunctions,
		getTemplatesListToolBarMenu: getTemplatesListToolBarMenu,
		getRelatedPageTreeToolBarFunctions: getRelatedPageTreeToolBarFunctions,
		getRelatedPageTreeToolBarMenu: getRelatedPageTreeToolBarMenu,
		getRelatedPageTreeDragAndDropValidator: getRelatedPageTreeDragAndDropValidator,
		getTemplateBackupsToolBarFunctions: getTemplateBackupsToolBarFunctions,
		getTemplateBackupsToolBarMenu: getTemplateBackupsToolBarMenu
	};
})(jQuery, _);
/**
 * Функционал административной панели модуля Exchange:
 */
var ExchangeModule = (function($, _) {
	"use strict";

	/** @type {String} MODULE_NAME системное имя модуля */
	var MODULE_NAME = 'exchange';
	/** @type {String} REQUEST_PREFIX префикс запроса к api */
	var REQUEST_PREFIX = '/admin/';
	/** @type {String} REQUEST_DOWNLOAD_LOG_FILE метод, который скачивает файл логов */
	const REQUEST_DOWNLOAD_LOG_FILE = 'downloadLogFile';
	/** @type {String} REQUEST_DELETE_LOG_FILE_LIST метод, который удаляет файл логов */
	const REQUEST_DELETE_LOG_FILE_LIST = 'deleteLogFileList';
	/** @type {String} REQUEST_EDIT метод, редактирования сценария импорта */
	const REQUEST_EDIT = 'edit';

	/**
	 * Обрабатывает ошибку запроса бекенда
	 * @param {String} errorMessage сообщение об ошибке
	 */
	let handleError = function(errorMessage) {
		DefaultModule.showMessage(errorMessage);
		closeDialog();
		dc_application.refresh();
	};

	/**
	 * Возвращает реализацию функций тулбара табличного контрола списка логов
	 * @return {Object}
	 */
	let getLogListToolBarFunctions = function() {
		return {
			download: {
				name: 'download',
				className: 'i-download-backup',
				hint: getLabel('js-label-download-log-file'),
				init: function(button) {
					dc_application.toggleToolBarButton(button, function(TableControl) {
						return TableControl.isOneRowSelected();
					});
				},
				release: function() {
					requestDownloadLogFile();
					return false;
				}
			},
			remove: {
				name: 'delete',
				className: 'i-delete-backup',
				hint: getLabel('js-label-delete-log-file'),
				init: function(button) {
					dc_application.toggleToolBarButton(button, function(TableControl) {
						return TableControl.hasSelectedRows();
					});
				},
				release: function() {
					showDeleteLogFileConfirmationForm();
					return false;
				}
			},
			open: {
				name: 'open',
				className: 'i-see',
				hint: getLabel('js-label-open-import'),
				init: function(button) {
					dc_application.toggleToolBarButton(button, function(TableControl) {
						let scriptId = Number(DefaultModule.getSelectedEntityValue('script_id'));
						return TableControl.isOneRowSelected() && scriptId;
					});
				},
				release: function() {
					openImportScenario();
					return false;
				}
			}
		};
	};

	/** Запрашивает скачивание файла лога */
	let requestDownloadLogFile = function() {
		location.href = DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_DOWNLOAD_LOG_FILE, '?fileName=' + dc_application.getFirstSelectedId());
	};

	/** Показывает форму подтверждения удаления лог файлов */
	let showDeleteLogFileConfirmationForm = function() {
		openDialog('', getLabel('js-label-template-confirm-delete'), {
			html: getLabel('js-label-log-file-delete-confirm'),
			confirmText: getLabel('js-del-do'),
			cancelButton: true,
			cancelText: getLabel('js-cancel'),
			confirmCallback: function (dialogName) {
				requestDeleteLogFileList();
				closeDialog(dialogName);
			}
		});
	};

	/** Запрашивает удаление лог файлов */
	let requestDeleteLogFileList = function() {
		let TableControl = dc_application;
		let requestParams = {
			type: 'POST',
			url: DefaultModule.getRequestUrl(MODULE_NAME, REQUEST_DELETE_LOG_FILE_LIST),
			dataType: 'json',
			data: {
				fileNameList: TableControl.getSelectedIdList(),
				domain_id: [DefaultModule.getDomainId()]
			}
		};

		DefaultModule.sendAjaxRequest(requestParams, function() {
			TableControl.refresh();
		}, handleError);
	};

	/** Открывает страницу сценария импорта выбранного лога */
	let openImportScenario = function() {
		let scriptId = DefaultModule.getSelectedEntityValue('script_id');
		location.href = DefaultModule.getRequestObjextUrl(MODULE_NAME, REQUEST_EDIT, scriptId);
	};

	/**
	 * Возвращает список названий кнопок для формирования меню тулбара табличного контрола списка лог файлов
	 * @returns {String[]}
	 */
	let getLogListToolBarMenu = function() {
		return ['download', 'remove', 'open'];
	};

	/**
	 * Возвращает реализацию функций тулбара табличного контрола раздела "1С идентификаторы"
	 * @return {Object}
	 */
	let getIdentifiersToolBarFunctions = function() {
		let moduleHref = window.location.href.replace(/(\?page=.*)/, '');

		return {
			goToModule: {
				name: 'goToModule',
				className: 'i-rollback',
				hint: getLabel('js-label-open-full-identifiers-list'),
				href: moduleHref,
				init: function(button) {
					dc_application.getToolBar().enableButtons(button);
				}
			}
		}
	}

	/**
	 * Возвращает список названий кнопок для формирования меню тулбара табличного контрола раздела "1С идентификаторы"
	 * @return {String[]}
	 */
	let getIdentifiersToolBarMenu = function () {
		let requestedPageRegexp = /Identifiers\/\?page=(\d*)/;
		let matches = window.location.href.match(requestedPageRegexp);

		return matches ?  ['goToModule'] : [];
	}

	return {
		getLogListToolBarFunctions: getLogListToolBarFunctions,
		getLogListToolBarMenu: getLogListToolBarMenu,
		getIdentifiersToolBarMenu: getIdentifiersToolBarMenu,
		getIdentifiersToolBarFunctions: getIdentifiersToolBarFunctions
	};
})(jQuery, _);
