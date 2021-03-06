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