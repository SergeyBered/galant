<?php

	/** @var array $classes конфигурация для автозагрузки классов модуля */
	$classes = [
		'UmiCms\Classes\Components\Exchange\AdminSettingsManager' => [
			__DIR__ . '/classes/AdminSettingsManager.php'
		],

		'UmiCms\Classes\Components\Exchange\iAdminSettingsManager' => [
			__DIR__ . '/classes/iAdminSettingsManager.php'
		],
	];
