<?php

	/** Класс модификатора цены скидки "Абсолютная скидка" */
	class absoluteDiscountModificator extends discountModificator {

		/** @inheritDoc */
		public function recalcPrice($originalPrice) {
			$resultPrice = round($originalPrice - $this->getValue('size'), 2);
			return ($resultPrice > 0 ? $resultPrice : 0);
		}
	}
