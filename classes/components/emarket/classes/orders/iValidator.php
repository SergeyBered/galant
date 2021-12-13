<?php
	namespace UmiCms\Classes\Components\Emarket\Order;

	use UmiCms\Classes\Components\Emarket\Config\Settings;

	/**
	 * Интерфейс валидатора заказа
	 * @package UmiCms\Classes\Components\Emarket\Order
	 */
	interface iValidator {

		/**
		 * Конструктор
		 * @param Settings $settings настройки модуля
		 */
		public function __construct(Settings $settings);

		/**
		 * Валидирует заказа на предмет возможности его оформления
		 * @param \order $order заказ
		 * @throws \publicException
		 */
		public function validateForPurchasing(\order $order);
	}