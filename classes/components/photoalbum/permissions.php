<?php

	/** Группы прав на функционал модуля */
	$permissions = [
		/** Возможные точки входа в административный интерфейс модуля */
		'adminEntryPoints' => [
			'lists',
			'config',
			'edit',
			'add'
		],
		/** Права на просмотр фотогелерей */
		'albums' => [
			'album',
			'albums',
			'photo'
		],
		/** Права на администрирование модуля */
		'albums_list' => [
			'lists',
			'add',
			'edit',
			'activity',
			'uploadimages',
			'upload_arhive',
			'album.edit',
			'photo.edit',
			'publish',
			'getactivechildrenpart',
			'getinactivechildrenpart',
			'copy',
		],
		/** Права на работу с настройками */
		'config' => [
			'config'
		],
		/** Права на удаление фотографий и альбомов */
		'delete' => [
			'getchildrenpart',
			'del'
		]
	];
