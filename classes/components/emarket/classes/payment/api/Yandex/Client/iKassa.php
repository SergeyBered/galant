<?php

	namespace UmiCms\Classes\Components\Emarket\Payment\Yandex\Client;

	use UmiCms\Utils\Logger\iFactory as iLoggerFactory;

	/**
	 * Интерфейс клиента API Яндекс.Касса
	 * @link https://kassa.yandex.ru/docs/guides/
	 * @link https://yandex.ru/support/checkout/payments/api.html
	 * @link https://kassa.yandex.ru/docs/checkout-api/
	 * @package UmiCms\Classes\Components\Emarket\Payment\Yandex\Client
	 */
	interface iKassa {

		/**
		 * Конструктор
		 * @param iLoggerFactory $loggerFactory экземпляр фабрики логгеров
		 * @param \iConfiguration $configuration конфигурация
		 */
		public function __construct(iLoggerFactory $loggerFactory, \iConfiguration $configuration);

		/**
		 * Устанавливает флаг ведения журнала
		 * @param bool $flag значение флага
		 * @return $this
		 */
		public function setKeepLog($flag = true);

		/**
		 * Устанавливает параметры авторизации
		 * @param string $shopId идентификатор магазина
		 * @param string $secretKey секретный ключ
		 * @return iKassa|Kassa
		 */
		public function setAuth($shopId, $secretKey) : iKassa;

		/**
		 * @internal
		 * Устанавливает идентификатор магазина
		 * @param string $shopId идентификатор магазина
		 * @return $this
		 */
		public function setShopId($shopId) : iKassa;

		/**
		 * @internal
		 * Устанавливает секретный ключ
		 * @param string $secretKey секретный ключ
		 * @return $this
		 */
		public function setSecretKey($secretKey) : iKassa;

		/**
		 * Создает платеж и возвращает его данные
		 * @param array $request данные запроса
		 * @return array
		 *
		 * [
		 *      'id' => 'Идентификатор платежа',
		 *      'confirmation' => [
		 *          'confirmation_url'  => 'Адрес, куда нужно перенаправить пользователя для оплаты'
		 *      ]
		 * ]
		 */
		public function createPayment(array $request) : array;

		/**
		 * Подтверждает заказ
		 * @param string $id идентификатор платежа
		 * @param array $request данные запроса
		 * @return bool
		 */
		public function approvePayment($id, array $request) : bool;

		/**
		 * Отменяет заказ
		 * @param string $id идентификатор платежа
		 * @return bool
		 */
		public function cancelPayment($id) : bool;

		/**
		 * Возвращает средства клиенту
		 * @param array $request данные запроса
		 * @return bool
		 */
		public function refundPayment(array $request) : bool;
	}
