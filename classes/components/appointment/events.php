<?php
	use UmiCms\Service;

	Service::EventHandlerFactory()->createForModuleByConfig([
		/** Обработчик события создания заявки на запись */
		[
			'event' => 'addAppointmentOrder',
			'method' => 'onCreateOrder'
		],
		/** Обработчик события изменения заявки на запись */
		[
			'event' => 'modifyEntityAppointmentOrders',
			'method' => 'onModifyOrder'
		],
	], [
		'module' => 'appointment',
	]);

