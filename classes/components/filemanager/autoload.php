<?php
	/** @var array $classes конфигурация для автозагрузки классов модуля */
	$classes = [
		'elFinderVolumeUmiLocalFileSystem' => [
			dirname(__FILE__) . '/Classes/elfinder/elFinderVolumeUmiLocalFileSystem.class.php'
		],
		'UmiCms\Classes\Components\Filemanager\Watermark\AdminSettingsManager' => [
			__DIR__ . '/Classes/Watermark/AdminSettingsManager.php'
		],
		'UmiCms\Classes\Components\Filemanager\Watermark\iAdminSettingsManager' => [
			__DIR__ . '/Classes/Watermark/iAdminSettingsManager.php'
		],
	];
