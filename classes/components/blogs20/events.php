<?php
	use UmiCms\Service;

	Service::EventHandlerFactory()->createForModuleByConfig([
		/** Обработчики уведомления автора блога о комментарии */
		[
			'event' => 'blogs20CommentAdded',
			'method' => 'onCommentAdd'
		],
		/** Обработчики для проверки наличия спама */
		[
			'event' => 'blogs20PostAdded',
			'method' => 'onPostAdded'
		],
		[
			'event' => 'blogs20CommentAdded',
			'method' => 'onCommentAdded'
		],
	], [
		'module' => 'blogs20',
	]);
