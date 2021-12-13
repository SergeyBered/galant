/**
 * Отображает файловый менеджер Elfinder
 * @todo Рефакторинг
 * @param {Object} options
 */
function showElfinderFileBrowser(options) {
	let select = options.select;
	let folder = options.folder;
	let imageOnly = options.imageOnly;
	let videoOnly = options.videoOnly;
	let folderHash = options.folderHash || '';
	let fileHash = options.fileHash || '';
	let lang = options.lang || 'ru';
	let isMultiple = options.isMultiple;
	let onGetFileFunction = options.onGetFileFunction;
	let objectId = options.objectId || window.object_id || null;
	let pageId = options.pageId || window.page_id || null;
	let fieldName = options.fieldName || null;

	let index = select.val().lastIndexOf('/');
	index = (index !== -1) ? select.val().substr(index) : select.val();

	let qs = 'id=' + select.attr('id');
	let file = folder.replace(/^\.\//, '/') + index;
	qs = qs + '&multiple=' + isMultiple + '&file=' + file;

	if (folder) {
		qs = qs + '&folder=' + folder;
	}

	if (imageOnly) {
		qs = qs + '&image=1';
	}

	if (videoOnly) {
		qs = qs + '&video=1';
	}

	if (typeof (folderHash) != 'undefined') {
		qs = qs + '&folder_hash=' + folderHash;
	}

	if (typeof (fileHash) != 'undefined') {
		qs = qs + '&file_hash=' + fileHash;
	}

	if (lang) {
		qs = qs + '&lang=' + lang;
	}

	if (onGetFileFunction) {
		qs = qs + '&onGetFile=' + onGetFileFunction;
	}

	if (objectId) {
		qs = qs + '&objectId=' + objectId;
	}

	if (pageId) {
		qs = qs + '&pageId=' + pageId;
	}

	if (fieldName) {
		qs = qs + '&fieldName=' + fieldName;
	}

	$.openPopupLayer({
		name: 'Filemanager',
		title: getLabel('js-file-manager'),
		width: 1200,
		height: 600,
		url: '/styles/common/other/elfinder/umifilebrowser.html?' + qs
	});

	let filemanager = $('div#popupLayer_Filemanager div.popupBody');
	if (!filemanager.length) {
		filemanager = $(window.parent.document.getElementById('popupLayer_Filemanager')).find('div.popupBody');
	}

	let footer = '<div id="watermark_wrapper"><label for="add_watermark">';
	footer += getLabel('js-water-mark');
	footer += '</label><input type="checkbox" name="add_watermark" id="add_watermark"/>';
	footer += '<label for="remember_last_folder">';
	footer += getLabel('js-remember-last-dir');
	footer += '</label><input type="checkbox" name="remember_last_folder" id="remember_last_folder"';
	if (getCookie('remember_last_folder', true) > 0) {
		footer += 'checked="checked"';
	}
	footer += '/></div>';

	filemanager.append(footer);
}

/**
 * Прикрепляет миниатюру
 * @param {Object} options опции
 */
function appendThumbnail(options) {
	let file = options.file;
	let thumbnailTitle = options.thumbnailTitle;
	let propertyId = options.propertyId;
	let $container = options.container;
	let selectId = options.selectId;
	let alt = options.alt === undefined ? false : options.alt;
	let title = options.title === undefined ? false : options.title;
	let order = options.order === undefined ? false : options.order;
	let prefix = options.prefix;
	let $value = options.value;
	let label = options.label;
	let altButtonHint = options.altButtonHint;
	let altButtonExtraClass = alt ? '' : 'empty';
	let closeButtonHint = options.closeButtonHint;
	let titleButtonHint = options.titleButtonHint;
	let titleButtonExtraClass = title ? '' : 'empty';
	let emptyInputName = options.emptyInputName === undefined ? '' : options.emptyInputName;
	let isMultiple = options.isMultiple;
	$container.html = '';

	if ($('.thumbnail', $container).length === 0) {
		appendDiv('thumbnail', thumbnailTitle, '', $container);
	}

	let $thumbnail = $('.thumbnail:eq(0)', $container);

	if (file === '') {
		$thumbnail.text(label);

		if ($(selectId, $container).length === 0) {
			appendHiddenInput(emptyInputName, '', selectId, $container);
		}
	} else {
		$value.appendTo($thumbnail);
		appendDiv('close', closeButtonHint, '&times;', $thumbnail);

		let extension = file.split('.').pop();

		if (extension) {
			appendDiv('extension extension-type-' + extension, extension, extension, $thumbnail);
		}

		if (alt !== false) {
			appendDiv('alt ' + altButtonExtraClass, altButtonHint, 'ALT', $thumbnail);
		}

		if (title !== false) {
			appendDiv('title ' + titleButtonExtraClass, titleButtonHint, 'TITLE', $thumbnail);
		}

		$('input', $container).remove();

		if (isMultiple) {
			appendHiddenInput(getInputName(propertyId, prefix, 'src'), file, selectId, $container);
		} else {
			appendHiddenInput(emptyInputName, '.' + file, selectId, $container);
		}

		if (alt !== false) {
			appendHiddenInput(getInputName(propertyId, prefix, 'alt'), alt, '', $container);
		}

		if (title !== false) {
			appendHiddenInput(getInputName(propertyId, prefix, 'title'), title, '', $container);
		}

		if (order !== false) {
			appendHiddenInput(getInputName(propertyId, prefix, 'order'), order, '', $container);
		}
	}
}

/**
 * Прикрепляет div
 * @param {String} divClass класс
 * @param {String} title
 * @param {String} value значение
 * @param {jQuery} $container родительский контейнер
 */
function appendDiv(divClass, title, value, $container) {
	$('<div>').attr({
		class: divClass,
		title: title
	}).html(value).appendTo($container);
}

/**
 * Возвращает имя для инпута
 * @param {Integer} propertyId идентификатор поля
 * @param {String} prefix префикс
 * @param {String} name имя
 * @returns {String}
 */
function getInputName(propertyId, prefix, name) {
	return prefix + '[' + propertyId + '][' + name + ']';
}

/**
 * Прикрепляет скрытый инпут
 * @param {String} name имя
 * @param {String} value значение
 * @param {String} id идентификатор
 * @param {jQuery} $container родительский контейнер
 */
function appendHiddenInput(name, value, id, $container) {
	$('<input>').attr({
		type: 'hidden',
		name: name,
		value: value,
		id: id
	}).appendTo($container);
}

/**
 * Подготавливает кнопки действий
 * @param {Object} options настройки
 */
function prepareActionButtons(options) {
	let $container = options.$container;

	$container.find('.close').on('click', function(e) {
		closeClickHandler(options.settings, options.isMultiple, $container);
		e.stopPropagation();
	});

	bindFileAttributeEditors({
		$container: $container,
		alt: options.alt,
		title: options.title,
		id : options.id,
	});
}

/**
 * Прикрепляет действия к кнопкам редактирования атрибутов изображения
 * @param options
 */
function bindFileAttributeEditors(options) {
	let $container = options.$container;
	let alt = options.alt;
	let title = options.title;
	let id = options.id;

	if (alt) {
		let $altInput = $('input[name$="[alt]"]', $container);

		$container.find('.alt').on('click', function(e) {
			let $altButton = $('div.alt', $container);
			fileAttributeClickHandler($altInput, getLabel('js-image-field-alt-dialog-title'), $altButton, id);
			e.stopPropagation();
		});
	}

	if (title) {
		let $titleInput = $('input[name$="[title]"]', $container);

		$container.find('.title').on('click', function(e) {
			let $titleButton = $('div.title', $container);
			fileAttributeClickHandler($titleInput, getLabel('js-image-field-title-dialog-title'), $titleButton, id);
			e.stopPropagation();
		});
	}
}

/**
 * Обработчик нажатия на кнопку редактирование атрибута изображения
 * @param {jQuery} $input контейнер для значения атрибута
 * @param {String} header заголовок окна для ввода значения атрибута
 * @param {jQuery} $button кнопка вызова редактирования
 * @param inputId
 */
function fileAttributeClickHandler($input, header, $button, inputId) {
	let value = $input.val()
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
	openDialog('', header, {
		html: '<input type="text" class="default" value="' + value + '" id="' + inputId + '"/>',
		confirmText: 'OK',
		confirmOnEnterElement: '#' + inputId,
		cancelButton: true,
		cancelText: getLabel('js-cancel'),
		confirmCallback: function(dialogName) {
			let val = $('#' + inputId).val();

			if (val.length > 0) {
				$button.attr('title', val);
				$button.removeClass('empty');
			} else {
				$button.attr('title', getLabel('js-image-field-empty-attribute'));
				$button.addClass('empty');
			}

			$input.val(val);
			closeDialog(dialogName);
		}
	});
}

/**
 * Обработчик нажатия на кнопку закрытия
 * @param {Object} property настройки
 * @param {Boolean} isMultiple является ли поле набором
 * @param {jQuery} $container родительский контейнер
 */
function closeClickHandler(property, isMultiple, $container) {
	if (isMultiple) {
		$(property.element).remove();
	} else {
		property.selectedObject.val('');
		let $thumbnail = $container.find('.thumbnail');
		$thumbnail.html(getLabel('js-image-field-empty'));
		$thumbnail.attr('title', '');
		property.wrapper.attr('umi:file', '');
	}
}

/**
 * Возвращает выбранное поле
 * @param {String} file название файла
 * @param {jQuery} $container ролительский контейнер
 * @returns {jQuery|HTMLElement}
 */
function getSelectObject(file, $container) {
	return file === '' ? $('input', $container) : $('input[name$="[src]"]', $container);
}

/**
 * Выполняет сортировку файлов/изображений
 * @param {jQuery.Event} event событие mousedown
 * @param {Object} ui объект параметров сортировки
 * @link https://stackoverflow.com/a/38275657/10787288
 */
function sortMultipleFiles(event, ui) {
	let container = $(this);
	let placeholder = container.children('.ui-sortable-placeholder');
	let draggedCenterX = ui.helper.position().left + ui.helper.outerWidth()/2;
	let draggedCenterY = ui.helper.position().top + ui.helper.outerHeight()/2;

	container.children().each(function () {
		let item = $(this);

		if (!item.hasClass('ui-sortable-helper') && !item.hasClass('ui-sortable-placeholder')) {
			let itemCenterX = item.position().left + item.outerWidth()/2;
			let itemCenterY = item.position().top + item.outerHeight()/2;
			let distanceBetweenCenters = Math.sqrt(Math.pow(itemCenterX - draggedCenterX, 2) + Math.pow(itemCenterY - draggedCenterY, 2));
			let minDimension = Math.min(item.outerWidth(), item.outerHeight(), ui.helper.outerWidth(), ui.helper.outerHeight());
			let overlaps = distanceBetweenCenters < (minDimension/2);

			if (overlaps) {
				if (placeholder.index() > item.index()) {
					placeholder.insertBefore(item);
				} else {
					placeholder.insertAfter(item);
				}
				container.sortable('refreshPositions');
				return false;
			}

		}
	});
}

/**
 * Обновляет порядок в наборе
 * @param {jQuery} $element элемент набора
 * @param {Integer} maxOrder значение максимального порядка
 * @returns {number} максимальный порядок
 */
function updateOrder($element, maxOrder) {
	if ($element.length > 0) {
		maxOrder = 0;

		for (var i = 0, cnt = $element.length; i < cnt; i++) {
			maxOrder++;
			$($element[i]).find('input[name$="[order]"]').val(maxOrder);
		}
	}

	return maxOrder;
}

/**
 * Изменяет файл в настройках поля
 * @param {jQuery} $object объект поля
 * @param {Object} property настройки
 * @returns {Object}
 */
function changeFileInProperty($object, property) {
	$(property.element).html('');
	property.file = $object.val();
	return property;
}

/**
 * Заполняет настройки поле данными
 * @param {Object} property настройки поля
 * @param {String} className имя класса
 * @param {Integer} maxOrder максимальный порядок
 * @returns {Object}
 */
function fillProperty(property, className, maxOrder) {
	property.id = property.file;
	property.order = maxOrder + 1;
	let $element = $(property.element);
	$element[0].className = className;
	$element.attr('id', 'mifile_' + property.id);

	return property;
}

/**
 * Возвращает имя файла
 * @param {String} filePath путь к файлу
 * @returns {String}
 */
function getFileName(filePath) {
	return filePath.replace(/^.*(\\|\/|\:)/, '');
}

