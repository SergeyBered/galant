<?php

	/** Группы прав на функционал модуля */
	$permissions = [
		/** Возможные точки входа в административный интерфейс модуля */
		'adminEntryPoints' => [
			'import',
			'export',
			'logList',
			'categoryIdentifiers',
			'objectIdentifiers',
			'config',
			'edit',
			'add'
		],
		/** Права на интеграция с 1С */
		'auto' => [
			'getcurrencycodebyalias',
			'export1c',
			'gettranslatorsettings',
			'istradeoffersusedincml',
			'getcmlproducttypeid',
			'definecmldefaultpricetyperelation',
			'getcmlcurrencyidbyalias',
			'getcmlofferexternalid',
			'getcmlofferpriceinternalid',
			'getcmlstockinternalid',
			'ordersettings',
			'checkorderstatusexistsbyid'
		],
		/** Права на ручной импорт и экспорт */
		'exchange' => [
			'import',
			'export',
			'add',
			'edit',
			'import_do',
			'prepareelementstoexport'
		],
		/** Права на доступ к экспорту данных по http */
		'get_export' => [
			'get_export'
		],
		/** Права на работу с настройками */
		'config' => [
			'config'
		],
		/** Права на удаление сценариев экспорта, импорта и логов */
		'delete' => [
			'del',
			'deletelogfilelist',
		],
		/** Права на просмотр логов импорта */
		'logList' => [
			'logList',
			'flushloglistconfig',
			'downloadlogfile',
		],
		/** Права на редактирование идентификаторов 1С */
		'identifiers' => [
			'categoryidentifiers',
			'objectidentifiers',
			'flushcategoryidentifiersconfig',
			'flushobjectidentifiersconfig',
			'saveidentifier'
		]
	];
