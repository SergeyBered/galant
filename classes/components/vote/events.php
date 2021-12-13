<?php
	use UmiCms\Service;

	Service::EventHandlerFactory()->createForModuleByConfig([
		/** Копирует варианты ответа при копировании страницы с опросом. */
		[
			'event' => 'systemCloneElement',
			'method' => 'onCloneElement'
		],
	], [
		'module' => 'vote',
	]);

