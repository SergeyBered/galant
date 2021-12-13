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
		/** Права на управление редиректами */
		'manage' => [
			'lists',
			'add',
			'edit',
			'getdatasetconfiguration',
			'savevalue',
			'flushdataconfig'
		],
		/** Права на работу с настройками */
		'config' => [
			'config'
		],
		/** Права на удаление редиректов */
		'delete' => [
			'del',
			'removeallredirects'
		]
	];
