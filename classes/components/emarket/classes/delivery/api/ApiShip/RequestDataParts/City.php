<?php

	namespace UmiCms\Classes\Components\Emarket\Delivery\ApiShip\RequestDataParts;

	use UmiCms\Classes\Components\Emarket\Delivery\ApiShip\Utils\ArgumentsValidator;

	/**
	 * Часть данных запроса с информацией о городе
	 * @package UmiCms\Classes\Components\Emarket\Delivery\ApiShip\RequestDataParts
	 */
	class City implements iCity {

		/** @var string $name название города */
		private $name;

		/** @var string $countryCode код страны */
		private $countryCode;

		/** @inheritDoc */
		public function __construct(array $data) {
			$this->import($data);
		}

		/** @inheritDoc */
		public function import(array $data) {
			ArgumentsValidator::arrayContainsValue($data, self::NAME_KEY, __METHOD__, self::NAME_KEY);
			$this->setName($data[self::NAME_KEY]);
			ArgumentsValidator::arrayContainsValue($data, self::COUNTRY_CODE, __METHOD__, self::COUNTRY_CODE);
			$this->setCountryCode($data[self::COUNTRY_CODE]);
			return $this;
		}

		/** @inheritDoc */
		public function export() {
			return [
				self::NAME_KEY => $this->getName(),
				self::COUNTRY_CODE => $this->getCountryCode()
			];
		}

		/** @inheritDoc */
		public function getName() {
			return $this->name;
		}

		/** @inheritDoc */
		public function setName($name) {
			try {
				ArgumentsValidator::notEmptyString($name, self::NAME_KEY, __METHOD__);
			} catch (\wrongParamException $e) {
				throw new \wrongParamException(getLabel('label-api-ship-error-incorrect-city-name'), $this->getName());
			}
			$this->name = $name;
			return $this;
		}

		/** @inheritDoc */
		public function getCountryCode() {
			return $this->countryCode;
		}

		/** @inheritDoc */
		public function setCountryCode($countryCode) {
			try {
				ArgumentsValidator::notEmptyString($countryCode, self::COUNTRY_CODE, __METHOD__);
			} catch (\wrongParamException $e) {
				throw new \wrongParamException(getLabel('label-api-ship-error-incorrect-country-code'), $this->getName());
			}
			$this->countryCode = $countryCode;
			return $this;
		}
	}
