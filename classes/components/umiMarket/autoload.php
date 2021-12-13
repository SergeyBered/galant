<?php
	/** @var array $classes конфигурация для автозагрузки классов модуля */
	$classes = [
		'UmiCms\Classes\Components\UmiMarket\Market\iClient' => [
			dirname(__FILE__) . '/Classes/Market/iClient.php'
		],
		'UmiCms\Classes\Components\UmiMarket\Market\Client' => [
			dirname(__FILE__) . '/Classes/Market/Client.php'
		]
	];
