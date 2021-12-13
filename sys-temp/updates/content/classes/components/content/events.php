<?php
	use UmiCms\Service;

	$eventHandlerFactory = Service::EventHandlerFactory();

	/** Обработчики событий редактирования страниц, которые отвечают за блокирование редактирования */
	if (Service::Registry()->get('//settings/lock_pages')) {
		$eventHandlerFactory->createForModuleByConfig([
			[
				'event' => 'sysytemBeginPageEdit',
				'method' => 'systemLockPage'
			],
			[
				'event' => 'systemModifyElement',
				'method' => 'systemUnlockPage'
			],
		], [
			'module' => 'content',
		]);
	}

	/** Обработчики событий редактирования страниц, которые отвечают работу с актуальностью публикации страниц */
	if (Service::Registry()->get('//settings/expiration_control')) {
		$eventHandlerFactory->createForModuleByConfig([
			[
				'event' => 'cron',
				'method' => 'cronSendNotification'
			],
			[
				'event' => 'cron',
				'method' => 'cronUnpublishPage'
			],
			[
				'event' => 'systemCreateElementAfter',
				'method' => 'pageCheckExpirationAdd'
			],
			[
				'event' => 'systemModifyElement',
				'method' => 'pageCheckExpiration'
			],
		], [
			'module' => 'content',
		]);
	}

	/** Обработчики событий редактирования страниц, которые отвечают за фильтрацию спама */
	if ((int) mainConfiguration::getInstance()->get('anti-spam', 'service.enabled')) {
		$eventHandlerFactory->createForModuleByConfig([
			[
				'event' => 'systemModifyPropertyValue',
				'method' => 'onModifyPropertyAntiSpam'
			],
			[
				'event' => 'systemModifyElement',
				'method' => 'onModifyElementAntiSpam'
			],
		], [
			'module' => 'content',
		]);
	}

	$eventHandlerFactory->createForModuleByConfig([
		/** Обработчики событий модуля "Форум" */
		[
			'event' => 'systemCreateElementAfter',
			'method' => 'onElementAppend'
		],
		[
			'event' => 'systemDeleteElement',
			'method' => 'onElementRemove'
		],
		[
			'event' => 'systemSwitchElementActivity',
			'method' => 'onElementActivity'
		],
		/** Обработчики событий модуля "FAQ" */
		[
			'event' => 'systemSwitchElementActivity',
			'method' => 'onChangeActivity'
		],
		/** Обработчик тестового события */
		[
			'event' => 'users_login_successfull',
			'method' => 'testMessages'
		],
	], [
		'module' => 'content',
	]);
