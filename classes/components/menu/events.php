<?php
	use UmiCms\Service;

	Service::EventHandlerFactory()->createForModuleByConfig([
		/** Обработчики изменения страниц для актуализации состава меню */
		[
			'event' => 'systemModifyElement',
			'method' => 'onMenuEditLink'
		],
		[
			'event' => 'systemMoveElement',
			'method' => 'onMenuEditLink'
		],
		[
			'event' => 'systemDeleteElement',
			'method' => 'onMenuEditLink'
		],
		[
			'event' => 'systemSwitchElementActivity',
			'method' => 'onMenuEditLink'
		],
	], [
		'module' => 'menu',
	]);
