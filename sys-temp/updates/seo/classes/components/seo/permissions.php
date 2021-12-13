<?php

	/** Группы прав на функционал модуля */
	$permissions = [
		/** Возможные точки входа в административный интерфейс модуля */
		'adminEntryPoints' => [
			'sitemap',
			'robots',
			'webmaster',
			'getBrokenLinks',
			'emptyMetaTags',
			'config',
			'yandex'
		],
		/** Права на администрирование модуля */
		'seo' => [
			'webmaster',
			'flushsitelistconfig',
			'flushexternallinkslistconfig',
			'getexternallinklist',
			'getsiteinfo',
			'addsite',
			'verifysite',
			'addsitemap',
			'yandex',
			'getbrokenlinks',
			'getdatasetconfiguration',
			'flushbrokenlinksdatasetconfiguration',
			'indexlinks',
			'checklinks',
			'getlinksources',
			'emptymetatags',
			'sitemap',
			'flushsitemapconfig',
			'updatesitemap',
			'updatesitemapimages',
			'robots',
			'flushrobotsconfig',
			'getrobotstxt',
			'editrobotstxt'
		],
		/** Гостевые права */
		'guest' => [
			'getrelcanonical'
		],
		/** Права на работу с настройками */
		'config' => [
			'config'
		],
		/** Права на удаление сайта из Яндекс.Вебмастер */
		'delete' => [
			'deletesite'
		]
	];
