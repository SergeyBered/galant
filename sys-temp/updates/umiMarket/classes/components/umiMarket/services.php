<?php
	/** @var array $rules правила инициализации сервисов */
	$rules = [
		'MarketHttpClient' => [
			'class' => 'UmiCms\Classes\Components\UmiMarket\Market\Client',
			'arguments' => [
				new \ServiceReference('Configuration'),
				new \ServiceReference('ImageFactory'),
				new \ServiceReference('CacheEngineFactory'),
				new \ServiceReference('LoggerFactory'),
			],
		]
	];
