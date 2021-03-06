<?php

	/** Группы прав на функционал модуля */
	$permissions = [
		/** Возможные точки входа в административный интерфейс модуля */
		'adminEntryPoints' => [
			'stub',
			'whiteList',
			'blackList',
			'edit',
			'add'
		],
		/** Права на доступ к странице заглушке */
		'stub' => [
			'addusertowhitelist',
		],
		/** Права на управление белым списком ip адресов */
		'whiteList' => [
			'add',
			'edit'
		],
		/** Права на управление черным списком ip адресов */
		'blackList' => [
			'add',
			'edit'
		],
		/** Права на удаление ip адресов */
		'delete' => [
			'del'
		]
	];