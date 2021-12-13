<?php
	use UmiCms\Service;

	Service::EventHandlerFactory()->createForModuleByConfig([
		/** Импортирует все фиды по срабатыванию системного крона */
		[
			'event' => 'cron',
			'method' => 'feedsImportListener'
		],
		/** Активирует новости с подходящей датой публикации по срабатыванию системного крона */
		[
			'event' => 'cron',
			'method' => 'cronActivateNews'
		],
		/** Ставит у созданной новости в поле "Дата публикации" текущую дату, если поле было пустым */
		[
			'event' => 'cron',
			'method' => 'setNewsItemPublishTime'
		],
		/** Ставит у созданной через EIP новости в поле "Дата публикации" текущую дату, если поле было пустым */
		[
			'event' => 'eipQuickAdd',
			'method' => 'eipSetNewsItemPublishTime'
		],
		/** Удаляют пробелы из начала и конца полей "Название" и "URL" ленты rss при создании и изменении */
		[
			'event' => 'systemCreateObject',
			'method' => 'fixRssSettings'
		],
		[
			'event' => 'systemModifyObject',
			'method' => 'fixRssSettings'
		]
	], [
		'module' => 'news',
	]);
