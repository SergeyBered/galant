/**
 * Контрол поля типа "Изображения"
 * @param {Object} options настройки поля
 */
let ControlImageFile = function(options) {
	let wrapper = options.container || null;

	/** Инициализирует поле */
	function init() {
		let wrapperId = wrapper.attr('id');
		let	selectId = 'imageControlSelect_' + wrapperId;
		let id = 'imageField_' + wrapperId;

		initControl({
			file: wrapper.attr('umi:file'),
			alt: wrapper.attr('umi:alt'),
			title: wrapper.attr('umi:title'),
			selectId: selectId,
			element: $('#' + id, wrapper)
		});
	}

	/**
	 * Инициализирует контрол поля
	 * @param {Object} property свойства поля
	 */
	function initControl(property) {
		let file;

		try {
			file = decodeURI(property.file);
		} catch (e) {
			file = property.file;
		}

		let alt = property.alt;
		let title = property.title;
		let selectId = property.selectId;
		let container = property.element;
		let settings = property;

		appendThumbnail({
			file: file,
			thumbnailTitle: file,
			propertyId: wrapper.attr('umi:field-id'),
			container: container,
			selectId: selectId,
			alt: alt,
			title: title,
			prefix: 'data[images]',
			value: $('<img>').attr('src', file),
			label: getLabel('js-image-field-empty'),
			closeButtonHint: getLabel('js-image-field-remove-image'),
			titleButtonHint: title || getLabel('js-image-field-empty-attribute'),
			altButtonHint: alt || getLabel('js-image-field-empty-attribute'),
			emptyInputName: wrapper.attr('umi:input-name'),
			isMultiple: false
		});

		let selectedObject = $('#' + selectId, wrapper);

		container.find('.thumbnail').on('click', function() {
			if (wrapper.attr('umi:filemanager') === 'elfinder') {
				showElfinderFileBrowser({
					select: selectedObject,
					folder: '.',
					imageOnly: true,
					videoOnly: false,
					folderHash: wrapper.attr('umi:folder-hash'),
					fileHash: wrapper.attr('umi:file-hash'),
					lang: options.lang || 'ru',
					isMultiple: false,
					onGetFileFunction: wrapper.attr('umi:on_get_file_function'),
					fieldName:  wrapper.attr('umi:name') || null,
				});
			}
		});

		if (file !== '') {
			prepareActionButtons({
				id: 'imageAttribute',
				title: true,
				alt: true,
				$container: container,
				isMultiple: false,
				settings: {
					selectedObject: selectedObject,
					wrapper: wrapper
				}
			});
		}

		selectedObject.on('change', function() {
			fileChangeHandler($(this), settings);
		});
	}

	/**
	 * Обработчик изменения файла
	 * @param {jQuery} object текущий объект
	 * @param {Object} property свойство
	 */
	function fileChangeHandler(object, property) {
		initControl(changeFileInProperty(object, property));
	}

	init();
};
