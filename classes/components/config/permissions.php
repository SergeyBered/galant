<?php

	/** Группы прав на функционал модуля */
	$permissions = [
		/** Возможные точки входа в административный интерфейс модуля */
		'adminEntryPoints' => [
			'main',
			'langs',
			'domains',
			'mails',
			'cache',
			'security',
			'phpInfo',
			'captcha'
		],
		/** Права на запуск крона по http */
		'cron_http_execute' => [
			'cron_http_execute'
		],
		/** Права на работу с глобальными настройками */
		'main' => [
			'main'
		],
		/** Права на работу с языками */
		'langs' => [
			'langs'
		],
		/** Права на работу с доменами */
		'domains' => [
			'domains',
			'domain_mirrows',
		],
		/** Права на работу с настройками почты */
		'mails' => [
			'mails'
		],
		/** Права на работу с настройками производительности */
		'cache' => [
			'cache',
			'speedtest'
		],
		/** Права на выполнение тестов безопасности */
		'security' => [
			'security',
			'securityruntest'
		],
		/** Права на чтение phpInfo */
		'phpInfo' => [
			'phpInfo'
		],
		/** Права на работу с настройками captcha */
		'captcha' => [
			'captcha'
		],
		/** Права на удаление доменов, зеркал и языков */
		'delete' => [
			'lang_del',
			'domain_mirrow_del',
			'domain_del'
		]
	];
