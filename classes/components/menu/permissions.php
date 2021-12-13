<?php

	/** Группы прав на функционал модуля */
	$permissions = [
		/** Возможные точки входа в административный интерфейс модуля */
		'adminEntryPoints' => [
			'lists',
			'edit',
			'add'
		],
		/** Права на просмотр меню */
		'view' => [
			'draw'
		],
		/** Права на администрирование модуля */
		'lists' => [
			'lists',
			'add',
			'edit',
			'activity',
			'item_element.edit',
			'publish'
		],
		/** Права на удаление меню */
		'delete' => [
			'del'
		]
	];

