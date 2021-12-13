<?php

	/** Группы прав на функционал модуля */
	$permissions = [
		/** Возможные точки входа в административный интерфейс модуля */
		'adminEntryPoints' => [
			'notifications',
			'edit'
		],
		/** Административные права */
		'admin' => [
			'notifications',
			'edit',
			'flushdatasetconfiguration',
			'getfieldlistinfo',
			'addvariable',
			'deletevariable'
		]
	];
