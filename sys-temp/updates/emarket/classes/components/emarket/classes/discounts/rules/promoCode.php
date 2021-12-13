<?php

	use UmiCms\Service;

	/**
	 * Класс правила скидки типа "Промокод".
	 * Подходит для скидок на заказ и на товар.
	 *
	 * Содержит 1 настройку:
	 *
	 * 1) Промокод, который представлен строкой;
	 *
	 * Значения настроек хранятся в объекте-источнике данных для правила скидки.
	 */
	class promoCodeDiscountRule extends discountRule implements orderDiscountRule, itemDiscountRule {
		/** @inheritDoc */
		public function validateOrder(order $order) {
			return $this->validate();
		}

		/** @inheritDoc */
		public function validateItem(iUmiHierarchyElement $element) {
			return $this->validate();
		}

		/**
		 * Запускает валидацию и возвращает результат
		 * @return bool
		 */
		private function validate() : bool {
			$promoCode = Service::CookieJar()->getDecrypted('PromoCode');
			return $this->getValue('promocode') == $promoCode;
		}
	}
