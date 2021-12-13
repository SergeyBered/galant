<?php
	use UmiCms\Service;

	Service::EventHandlerFactory()->createForModuleByConfig([
		/** Обработчики изменения вопроса, отправляют уведомления автору вопроса. */
		[
			'event' => 'systemSwitchElementActivity',
			'method' => 'onChangeActivity'
		],
		[
			'event' => 'systemModifyElement',
			'method' => 'onChangeActivity'
		],
		/** Обработчик создания вопроса с клиентской части, проверяет вопрос на антиспам */
		[
			'event' => 'faq_post_question',
			'method' => 'onQuestionPost'
		]
	], [
		'module' => 'faq',
	]);