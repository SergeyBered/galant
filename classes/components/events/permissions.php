<?php

	/** Группы прав на функционал модуля */
	$permissions = [
		/** Возможные точки входа в административный интерфейс модуля */
		'adminEntryPoints' => [
			'last',
			'feed',
			'config'
		],
		/** Группы прав на функционал модуля */
		'events' => [
			'feed',
			'last',
			'getusersettings',
			'savesettings',
			'getuser',
			'markunreadevents',
			'markreadevents'
		],
		/** Права на работу с настройками */
		'config' => [
			'config'
		]
	];
