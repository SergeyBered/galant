<?php
	/** Группы прав на функционал модуля */
	$permissions = [
		/** Возможные точки входа в административный интерфейс модуля */
		'adminEntryPoints' => [
			'catalog',
			'solutions',
			'modules',
			'extensions'
		],
		/** Права на работу с каталогом */
		'catalog' => [
			'catalog'
		],
		/** Права на работу с решениями */
		'solutions' => [
			'solutions',
			'getfullsolutionlist'
		],
		/** Права на работу с модулями */
		'modules' => [
			'modules',
			'addModule'
		],
		/** Права на работу с расширениями */
		'extensions' => [
			'extensions'
		],
		/** Права на удаление модулей, решений и расширений */
		'delete' => [
			'deletesolution',
			'deleteextension',
			'deletemodule'
		]
	];