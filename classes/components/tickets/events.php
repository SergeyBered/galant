<?php
	use UmiCms\Service;

	Service::EventHandlerFactory()->createForModuleByConfig([
		/** Обработчики событий создания пользователя. При создании пользователя ему назначается цвет заметок, */
		[
			'event' => 'users_registrate',
			'method' => 'onRegisterUserFillTicketsColor'
		],
		[
			'event' => 'systemCreateObject',
			'method' => 'onCreateUserFillTicketsColor'
		],
	], [
		'module' => 'tickets',
	]);