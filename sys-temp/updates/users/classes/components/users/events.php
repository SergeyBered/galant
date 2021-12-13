<?php
	use UmiCms\Service;

	Service::EventHandlerFactory()->createForModuleByConfig([
		/** События модуля "Пользователи" */
		[
			'event' => 'users_settings_do',
			'method' => 'onAutoCreateAvatar'
		],
		[
			'event' => 'users_registrate',
			'method' => 'onAutoCreateAvatar'
		],
		[
			'event' => 'users_registrate',
			'method' => 'onRegisterAdminMail'
		],
		[
			'event' => 'users_login_successfull',
			'method' => 'onLoginSuccess'
		],
		/** События модуля "Форум" */
		[
			'event' => 'forum_message_post_do',
			'method' => 'onSubscribeChanges'
		],
		[
			'event' => 'forum_topic_post_do',
			'method' => 'onSubscribeChanges'
		],
		/** Системные события */
		[
			'event' => 'systemCreateObject',
			'method' => 'onCreateObject'
		],
		[
			'event' => 'systemModifyObject',
			'method' => 'onModifyObject'
		],
		[
			'event' => 'systemModifyObject',
			'method' => 'onSwitchUserActivity'
		],
		[
			'event' => 'systemChangeObjectActivity',
			'method' => 'onSwitchUserActivity'
		],
		[
			'event' => 'dummy_message_init',
			'method' => 'checkMessage',
		],
		[
			'event' => 'systemModifyPropertyValue',
			'method' => 'onModifyPropertyValue',
			'is_critical' => true
		]
	], [
		'module' => 'users',
	]);