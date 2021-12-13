<?php
	use UmiCms\Service;

	$eventHandlerFactory = Service::EventHandlerFactory();

	/** Обработчик окончания индексации, устанавливает источник индекса для задействованых разделов */
	$eventHandlerFactory->createForModule(
		'releaseFilterIndex',
		'catalog',
		'setSourceIndex'
	);

	$config = mainConfiguration::getInstance();

	if ($config->get('modules', 'catalog.allow-auto-update-filter-index')) {
		/** Обработчики событий изменения каталога для обновления индекса фильтров */
		$eventHandlerFactory->createForModuleByConfig([
			[
				'event' => 'systemModifyElement',
				'method' => 'updateIndexOnModify'
			],
			[
				'event' => 'exchangeOnUpdateElement',
				'method' => 'updateIndexOnModify'
			],
			[
				'event' => 'systemSwitchElementActivity',
				'method' => 'updateIndexOnSwitchActivity'
			],
			[
				'event' => 'systemCreateElement',
				'method' => 'updateIndexOnCreate'
			],
			[
				'event' => 'exchangeOnAddElement',
				'method' => 'updateIndexOnCreate'
			],
			[
				'event' => 'systemMoveElement',
				'method' => 'updateIndexOnMove'
			],
			[
				'event' => 'systemDeleteElement',
				'method' => 'updateIndexOnDelete'
			],
			[
				'event' => 'systemVirtualCopyElement',
				'method' => 'updateIndexOnVirtualCopy'
			],
			[
				'event' => 'systemModifyPropertyValue',
				'method' => 'updateIndexOnModifyPropertyByFastEdit'
			],
			[
				'event' => 'eipSave',
				'method' => 'updateIndexOnModifyPropertyByEIP'
			],
			[
				'event' => 'systemKillElement',
				'method' => 'updateIndexOnKill'
			],
			[
				'event' => 'systemRestoreElement',
				'method' => 'updateIndexOnRestore'
			],
		], [
			'module' => 'catalog',
		]);
	}

	/** Обработчик запуска системного крона, запускает переиндексацию всех разделов */
	if ($config->get('modules', 'catalog.reindex-on-cron-event-enable')) {
		$eventHandlerFactory->createForModule(
			'cron',
			'catalog',
			'reIndexOnCron'
		);
	}

