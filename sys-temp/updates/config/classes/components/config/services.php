<?php

	/** @var array $parameters параметры инициализации сервисов */
	$parameters = [
	];

	/** @var array $rules правила инициализации сервисов */
	$rules = [
		'CaptchaAdminSettingsManager' => [
			'class' => 'UmiCms\Classes\Components\Config\Captcha\AdminSettingsManager',
		],
		'MailAdminSettingsManager' => [
			'class' => 'UmiCms\Classes\Components\Config\Mail\AdminSettingsManager',
		],
	];
