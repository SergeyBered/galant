<?php
	use UmiCms\Service;

	$eventHandlerFactory = Service::EventHandlerFactory();

	$eventHandlerFactory->createForModuleByConfig([
		/** Валидация почтового ящика при создании, сохранении подписчика */
		[
			'event' => 'systemCreateObject',
			'method' => 'onCreateObject'
		],
		[
			'event' => 'systemModifyObject',
			'method' => 'onModifyObject'
		],
		[
			'event' => 'systemModifyPropertyValue',
			'method' => 'onPropertyChanged',
			'is_critical' => true
		],
		/** Отправка рассылок про системному крону */
		[
			'event' => 'cron',
			'method' => 'onAutosendDispathes',
		],
	], [
		'module' => 'dispatches',
	]);

	$forumModule = cmsController::getInstance()->getModule('forum');

	if ($forumModule instanceof def_module) {
		$eventHandlerFactory->createForModuleByConfig([
			/** Обработчики изменения рассылки, подключают к рассылке выгрузку топиков из форума */
			[
				'event' => 'systemModifyObject',
				'method' => 'changeLoadForumOptionModify'
			],
			[
				'event' => 'systemModifyPropertyValue',
				'method' => 'changeLoadForumOptionQuickEdit'
			],
		], [
			'module' => 'dispatches',
		]);
	}