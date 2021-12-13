<?php
	use UmiCms\Service;

	$eventHandlerFactory = Service::EventHandlerFactory();

	/** Обработчик события запуска системного cron'а */
	$eventHandlerFactory->createForModuleByConfig([
		[
			'event' => 'cron',
			'method' => 'runGarbageCollector'
		],
		[
			'event' => 'cron',
			'method' => 'maintainDataBaseCache'
		],
	], [
		'module' => 'config',
	]);

	$config = mainConfiguration::getInstance();

	if ($config->get('messages', 'catch-system-events')) {
		/** Обработчики событий сохранения изменений страниц и объектов */;
		$eventHandlerFactory->createForModuleByConfig([
			[
				'event' => 'systemModifyObject',
				'method' => 'systemEventsNotify'
			],
			[
				'event' => 'systemModifyElement',
				'method' => 'systemEventsNotify'
			],
		], [
			'module' => 'config',
		]);
	}

	if ($config->get('debug', 'log-response-error-entry')) {
		/** Обработчик события отправки буфера для ведения лога записей об обработке ответа с ошибкой */
		$eventHandlerFactory->createForModule(
			'systemBufferSend',
			'config',
			'logResponseErrorEntry'
		);
	}
