<?php
	use UmiCms\Service;

	Service::EventHandlerFactory()->createForModuleByConfig([
		/** Системные события */
		[
			'event' => 'systemModifyPropertyValue',
			'method' => 'onModifyIpAddress',
			'is_critical' => true
		],
	], [
		'module' => 'umiStub',
	]);
