<?php

	namespace UmiCms\Classes\Components\Emarket\Tax\Rate;

	/**
	 * Класс калькулятора суммы налога от цены
	 * @package UmiCms\Classes\Components\Emarket\Tax\Rate
	 */
	class Calculator implements iCalculator {

		/** @inheritDoc */
		public function calculate($price, $rateBase, $rate) {
			return $price * $rate / $rateBase;
		}
	}