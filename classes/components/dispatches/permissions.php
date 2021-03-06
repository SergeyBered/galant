<?php

	/** Группы прав на функционал модуля */
	$permissions = [
		/** Возможные точки входа в административный интерфейс модуля */
		'adminEntryPoints' => [
			'lists',
			'subscribers',
			'messages',
			'releases',
			'config',
			'edit',
			'add'
		],
		/** Права на администрирование модуля */
		'dispatches_list' => [
			'add',
			'edit',
			'activity',
			'messages',
			'subscribers',
			'releasees',
			'fill_release',
			'release_send',
			'lists',
			'add_message',
			'releases',
			'getnewsrubriclist'
		],
		/** Права на подписку и отписку */
		'subscribe' => [
			'subscribe',
			'subscribe_do',
			'unsubscribe',
			'parsedispatches'
		],
		/** Права на работу с настройками */
		'config' => [
			'config'
		],
		/** Права на удаление рассылок, сообщений, выпусков и подписчиков */
		'delete' => [
			'del'
		]
	];
