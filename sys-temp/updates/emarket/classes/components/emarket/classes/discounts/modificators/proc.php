<?php

	/** Класс модификатора цены скидки "Процентная скидка" */
	class procDiscountModificator extends discountModificator {

		/** @inheritDoc */
		public function recalcPrice($originalPrice) {
			$resultPrice = round($originalPrice - ($originalPrice * $this->getValue('proc') / 100), 2);
			return ($resultPrice > 0 ? $resultPrice : 0);
		}
	}
