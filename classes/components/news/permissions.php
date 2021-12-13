<?php

	/** Группы прав на функционал модуля */
	$permissions = [
		/** Возможные точки входа в административный интерфейс модуля */
		'adminEntryPoints' => [
			'lists',
			'subjects',
			'rss_list',
			'config',
			'edit',
			'add'
		],
		/** Права на просмотр новостей */
		'view' => [
			'lastlist',
			'listlents',
			'rubric',
			'related_links',
			'rss',
			'item',
			'lastlents'
		],
		/** Права на администрирование модуля */
		'lists' => [
			'lists',
			'subjects',
			'add',
			'edit',
			'activity',
			'rss_list',
			'item.edit',
			'rubric.edit',
			'publish',
			'getactivechildrenpart',
			'getinactivechildrenpart',
			'getobjectnamesforrubrics',
			'copy',
		],
		/** Права на работу с настройками */
		'config' => [
			'config'
		],
		/** Права на удаление новостей, лент, сюжетов и RSS фидов */
		'delete' => [
			'getchildrenpart',
			'del'
		]
	];
