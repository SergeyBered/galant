<?php

	namespace UmiCms\Classes\Components\Emarket\Delivery\ApiShip;

	use UmiCms\Classes\Components\Emarket\Config\Settings;

	/**
	 * Интерфейс фабрики данных для запросов к сервису ApiShip
	 * @package UmiCms\Classes\Components\Emarket\Delivery\ApiShip
	 */
	interface iRequestDataFactory {

		/** @const string SENDER_TITLE наименование отправителя */
		const SENDER_TITLE = 'Склад';

		/** @const string RECIPIENT_TITLE наименование получателя */
		const RECIPIENT_TITLE = 'Покупатель';

		/** @const string DEFAULT_DELIVERY_TIME_START начало интервала времени доставки заказа клиенту по умолчанию */
		const DEFAULT_DELIVERY_TIME_START = '09:00';

		/** @const string DEFAULT_DELIVERY_TIME_END конец интервала времени доставки заказа клиенту по умолчанию */
		const DEFAULT_DELIVERY_TIME_END = '18:00';

		/**
		 * Формирует данные для запроса вычисления вариантов стоимости доставки заказа
		 * @param string $senderCity город отправителя
		 * @param \order $order отправляемый заказ
		 * @param \ApiShipDelivery $delivery экземпляр доставки через сервис ApiShip
		 * @param string $senderCountryCode код страны отправителя
		 * @return RequestData\CalculateDeliveryCost
		 */
		public static function createCalculateDeliveryCost($senderCity, \order $order, \ApiShipDelivery $delivery, $senderCountryCode);

		/**
		 * Формирует данные для запроса установления подключения провайдера
		 * @param int $companyId идентификатор компании клиента (на сервисе ApiShip)
		 * @param iProvider $provider подключаемый провайдер
		 * @return RequestData\ConnectProvider
		 */
		public static function createConnectProvider($companyId, iProvider $provider);

		/**
		 * Формирует данные для запроса отправки заказа в ApiShip
		 * @param \order $order отправляемый заказ
		 * @param \ApiShipDelivery $delivery экземпляр доставки через сервис ApiShip
		 * @param  Settings $settings настройки доставки модуля "Интернет-магазин"
		 * @return RequestData\SendOrder
		 * @throws \publicAdminException
		 */
		public static function createSendOrder(\order $order, \ApiShipDelivery $delivery, Settings $settings);
	}
