<?php

	/** Группы прав на функционал модуля */
	$permissions = [
		/** Возможные точки входа в административный интерфейс модуля */
		'adminEntryPoints' => [
			'shared_files',
			'watermark',
			'edit_shared_file',
			'add_shared_file'
		],
		/** Права на просмотр файлов для скачивания */
		'list_files' => [
			'shared_file',
			'list_files'
		],
		/** Право на скачивание файлов */
		'download' => [
			'download'
		],
		/** Права на администрирование модуля */
		'directory_list' => [
			'shared_files',
			'shared_file_activity',
			'add_shared_file',
			'edit_shared_file',
			'shared_file.edit',
			'publish',
			'getactivechildrenpart',
			'copy',
		],
		/** Права работу с файловым менеджером */
		'files' => [
			'getinactivechildrenpart',
			'getfilelist',
			'uploadfile',
			'elfinder_connector',
			'get_filemanager_info',
		],
		/** Права на удаление страниц со скачиваемым файлом */
		'delete' => [
			'getchildrenpart',
			'del_shared_file',
		],
		/** Права на работу с настройками водяного знака */
		'watermark' => [
			'watermark'
		],
	];
