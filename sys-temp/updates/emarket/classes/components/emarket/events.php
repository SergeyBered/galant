<?php
	use UmiCms\Service;

	Service::EventHandlerFactory()->createForModuleByConfig([
		/**
		 * Обработчики изменения заказа в UMI.CMS:
		 *
		 * 1) Отправляют уведомления по e-mail менеджерам и клиентам;
		 * 2) Отправляют push уведомления в приложение UMI.Manager;
		 * 3) Ведут начисление, списание и учет бонусов;
		 * 4) Обновляют статистику модуля;
		 * 5) Изменяют поля в заказе
		 */
		[
			'event' => 'systemModifyPropertyValue',
			'method' => 'onModifyProperty',
			'is_critical' => true,
		],
		[
			'event' => 'systemModifyObject',
			'method' => 'onModifyObject',
			'is_critical' => true,
		],
		[
			'event' => 'order-status-changed',
			'method' => 'onStatusChanged',
			'is_critical' => true,
		],
		[
			'event' => 'order-payment-status-changed',
			'method' => 'onPaymentStatusChanged',
		],
		[
			'event' => 'order-delivery-status-changed',
			'method' => 'onDeliveryStatusChanged',
		],
		/** Следит за тем, чтобы только у одного склада стоял флаг "Основной" */
		[
			'event' => 'systemModifyPropertyValue',
			'method' => 'onStorePropChange',
		],
		/** Удаляет объекты, связанные с заказом при его удалении */
		[
			'event' => 'systemDeleteObject',
			'method' => 'onOrderDeleteCleanRelations',
		],
		/** Синхронизирует курсы валют с цб по срабатыванию системного крона */
		[
			'event' => 'cron',
			'method' => 'onCronSyncCurrency',
		],
		/**
		 * Удаляют "просроченные" объекты незавершенных заказов, незарегистрированных
		 * покупателей и т.д. по срабатыванию системного крона
		 */
		[
			'event' => 'cron',
			'method' => 'onCronCheckExpiredCustomers',
			'priority' => 0,
		],
		[
			'event' => 'cron',
			'method' => 'onCronCheckExpiredOrders',
			'priority' => 0,
		],
		[
			'event' => 'cron',
			'method' => 'onCronCheckExpiredCustomersOneClick',
			'priority' => 0,
		],
		/** Исправляют значения в полях способов оплаты при их создании и сохранении */
		[
			'event' => 'systemCreateObject',
			'method' => 'fixPaymentSettings'
		],
		[
			'event' => 'systemModifyObject',
			'method' => 'fixPaymentSettings'
		]
	], [
		'module' => 'emarket',
	]);

