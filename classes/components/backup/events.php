<?php
	use UmiCms\Service;

	/** Обработчик события срабатывания системного cron'а */
	Service::EventHandlerFactory()
		->createForModule(
		'cron',
		'backup',
		'onCronCleanChangesHistory'
	);
