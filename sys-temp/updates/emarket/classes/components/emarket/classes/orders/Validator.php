<?php
	namespace UmiCms\Classes\Components\Emarket\Order;

	use UmiCms\Classes\Components\Emarket\Config\Settings;

	/**
	 * Класс валидатора заказа
	 * @package UmiCms\Classes\Components\Emarket\Order
	 */
	class Validator implements iValidator {

		/** @var Settings $settings */
		private $settings;

		/** @inheritDoc */
		public function __construct(Settings $settings) {
			$this->settings = $settings;
		}

		/** @inheritDoc */
		public function validateForPurchasing(\order $order) {
			$this->validateEmptyAmount($order)
				->validateMinAmountQuota($order)
				->validateMaxAmountQuota($order)
				->validateMinPriceQuota($order)
				->validateMaxPriceQuota($order);
		}

		/**
		 * Валидирует заказ на предмет соответствия минимальной стоимости для оформления
		 * @param \order $order заказ
		 * @return $this
		 * @throws \publicException
		 */
		private function validateMinPriceQuota(\order $order) {
			$limit = $this->settings->get(Settings::ORDER_SECTION, 'minOrderPrice');

			if ($limit && $order->getActualPrice() < $limit) {
				throw new \publicException(
					getLabel('label-error-purchasing-min-order-price-limit', 'emarket', $limit)
				);
			}

			return $this;
		}

		/**
		 * Валидирует заказ на предмет соответствия максимальной стоимости для оформления
		 * @param \order $order заказ
		 * @return $this
		 * @throws \publicException
		 */
		private function validateMaxPriceQuota(\order $order) {
			$limit = $this->settings->get(Settings::ORDER_SECTION, 'maxOrderPrice');

			if ($limit && $order->getActualPrice() > $limit) {
				throw new \publicException(
					getLabel('label-error-purchasing-max-order-price-limit', 'emarket', $limit)
				);
			}

			return $this;
		}

		/**
		 * Валидирует заказ на предмет наличия товаров
		 * @param \order $order заказ
		 * @return $this
		 * @throws \publicException
		 */
		private function validateEmptyAmount(\order $order) {
			if ($order->isEmpty()) {
				throw new \publicException('%error-market-empty-basket%');
			}

			return $this;
		}

		/**
		 * Валидирует заказ на предмет соответствия минимального количества товаров для оформления
		 * @param \order $order заказ
		 * @return $this
		 * @throws \publicException
		 */
		private function validateMinAmountQuota(\order $order) {
			$limit = $this->settings->get(Settings::ORDER_SECTION, 'minOrderAmount');

			if ($limit && $order->getTotalAmount() < $limit) {
				throw new \publicException(
					getLabel('label-error-purchasing-min-order-amount-limit', 'emarket', $limit)
				);
			}

			return $this;
		}

		/**
		 * Валидирует заказ на предмет соответствия максимального количества товаров для оформления
		 * @param \order $order заказ
		 * @return $this
		 * @throws \publicException
		 */
		private function validateMaxAmountQuota(\order $order) {
			$limit = $this->settings->get(Settings::ORDER_SECTION, 'maxOrderAmount');

			if ($limit && $order->getTotalAmount() > $limit) {
				throw new \publicException(
					getLabel('label-error-purchasing-max-order-amount-limit', 'emarket', $limit)
				);
			}

			return $this;
		}
	}
