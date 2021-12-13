<?php
	use UmiCms\Service;

	Service::EventHandlerFactory()->createForModuleByConfig([
		/** Уведомление подписчиков на топик форума о новом сообщении */
		[
			'event' => 'forum_message_post_do',
			'method' => 'onDispatchChanges'
		],
		/** Добавление топика модуля "Форум" в выпуск рассылки модуля "Рассылки" */
		[
			'event' => 'forum_topic_post_do',
			'method' => 'onAddTopicToDispatch'
		],
		/** Проверка сообщения форума на антиспам */
		[
			'event' => 'forum_message_post_do',
			'method' => 'onMessagePost'
		],
		/** Актуализаторы счетчиков в конференция форума */
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
	], [
		'module' => 'forum',
	]);
