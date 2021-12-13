/**
 * Контрол поля типа "Файл"
 * @param {Object} options настройки поля
 */
let ControlFile = function(options) {
	let wrapper = options.container || null;

	/** Инициализирует поле */
	function init() {
		let wrapperId = wrapper.attr('id');
		let	selectId = 'fileControlSelect_' + wrapperId;
		let id = 'fileControlContainer_' + wrapperId;

		initControl({
			file: wrapper.attr('umi:file'),
			title: wrapper.attr('umi:title'),
			selectId: selectId,
			element:  $('#' + id, wrapper)
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
			title: title,
			prefix: 'data[files]',
			value: $('<span>').text(getFileName(file)),
			label: getLabel('js-image-field-empty'),
			closeButtonHint: getLabel('js-file-field-remove-file'),
			titleButtonExtraClass: title || getLabel('js-image-field-empty-attribute'),
			emptyInputName: wrapper.attr('umi:input-name'),
			isMultiple: false
		});

		let selectedObject = $('#' + selectId, wrapper);

		container.find('.thumbnail').on('click', function() {
			if (wrapper.attr('umi:filemanager') === 'elfinder') {
				showElfinderFileBrowser({
					select: selectedObject,
					folder: '.',
					imageOnly: false,
					videoOnly: wrapper.attr('umi:field-type') === 'video_file',
					folderHash: wrapper.attr('umi:folder-hash'),
					fileHash: wrapper.attr('umi:file-hash'),
					lang: options.lang || 'ru',
					isMultiple: 0,
					onGetFileFunction: wrapper.attr('umi:on_get_file_function'),
					fieldName:  wrapper.attr('umi:name') || null,
				});
			}
		});

		if (file !== '') {
			prepareActionButtons({
				id: 'fileAttribute',
				title: true,
				alt: false,
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

	function fileChangeHandler(obj, property) {
		initControl(changeFileInProperty(obj, property));
	}

	init();
};
