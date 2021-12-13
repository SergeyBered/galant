<?php

	/** Группы прав на функционал модуля */
	$permissions = [
		/** Возможные точки входа в административный интерфейс модуля */
		'adminEntryPoints' => [
			'getTemplateList',
			'getTemplateEditor',
			'getTemplateBackups',
			'getRelatedPageTree'
		],
		/** Права на регистрацию шаблонов */
		'registration' => [
			'gettemplatelist',
			'flushtemplatelistconfig',
			'settemplateattributevalue',
			'createtemplate',
			'domaintemplates',
		],
		/** Права на управление привязкой страниц к шаблонам */
		'binding' => [
			'getrelatedpagetree',
			'flushrelatedpagetreeconfig',
			'changetemplateforpagelist',
		],
		/** Права на редактирование файлов шаблонов */
		'editing' => [
			'gettemplateeditor',
			'gettemplateeditorconfig',
		],
		/** Права на бэкапирование файлов шаблонов */
		'backups' => [
			'gettemplatebackups',
			'flushtemplatebackupsconfig',
			'downloadbackup',
			'createbackup',
			'restorefrombackup',
			'deletebackup',
		],
		/** Права на клиентские методы */
		'client' => [
			'getresourcedirectory'
		],
		/** Права на удаление шаблонов и их файлов */
		'delete' => [
			'deletetemplatelist',
			'deletebackuplist'
		]
	];