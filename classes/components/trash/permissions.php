<?php

	/** Группы прав на функционал модуля */
	$permissions = [
		/** Возможные точки входа в административный интерфейс модуля */
		'adminEntryPoints' => [
			'trash'
		],
		/** Права на получение списка страниц и их восстановление */
		'trash' => [
			'trash',
			'trash_restore',
			'getdeletedchildrenpart',
		],
		/** Права на очищение корзины */
		'delete' => [
			'trash_del',
			'trash_empty'
		]
	];
