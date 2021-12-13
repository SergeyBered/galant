<?php

	/** Группы прав на функционал модуля */
	$permissions = [
		/** Возможные точки входа в административный интерфейс модуля */
		'adminEntryPoints' => [
			'tree',
			'filters',
			'config',
			'tradeOfferPriceTypes',
			'edit',
			'add'
		],
		/** Права на администрирование каталога */
		'tree' => [
			'tree',
			'filters',
			'indexposition',
			'setvalueforindexfield',
			'cleangroupallfields',
			'getindexgroup',
			'getsettings',
			'add',
			'edit',
			'activity',
			'category.edit',
			'object.edit',
			'publish',
			'getproductofferlist',
			'savetradeofferfield',
			'changetradeofferorder',
			'addtradeoffer',
			'copytradeoffer',
			'changetradeofferlistactivity',
			'flushtradeofferlistconfig',
			'getactivechildrenpart',
			'getinactivechildrenpart',
			'copy',
		],
		/** Права на просмотр каталога */
		'view' => [
			'category',
			'object',
			'viewobject',
			'getcategorylist',
			'getsmartfilters',
			'makeemptyfilterresponse',
			'getsmartcatalog',
			'makeemptycatalogresponse',
			'getproductsbyflag'
		],
		/** Права на работу с настройками */
		'config' => [
			'config',
			'tradeofferpricetypes',
			'addtradeofferpricetype',
			'savetradeofferpricetypefield',
			'flushtradeofferpricetypelistconfig'
		],
		/** Права на удаление объектов и разделов, индексов фильтра, торговых предложений и их типов цен */
		'delete' => [
			'getchildrenpart',
			'del',
			'deleteindex',
			'deletetradeofferlist',
			'deletetradeofferpricetypelist',
		]
	];
