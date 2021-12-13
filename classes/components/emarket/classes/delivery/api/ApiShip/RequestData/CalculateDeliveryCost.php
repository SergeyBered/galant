<?php

	namespace UmiCms\Classes\Components\Emarket\Delivery\ApiShip\RequestData;

	use UmiCms\Classes\Components\Emarket\Delivery\ApiShip\RequestDataParts;
	use UmiCms\Classes\Components\Emarket\Delivery\ApiShip\Utils\ArgumentsValidator;

	/**
	 * Данные запроса вычисление вариантов стоимости доставки
	 * @package UmiCms\Classes\Components\Emarket\Delivery\ApiShip\RequestData
	 */
	class CalculateDeliveryCost implements iCalculateDeliveryCost {

		/** @var RequestDataParts\iCity $cityFrom город откуда доставляется заказ */
		private $cityFrom;

		/** @var RequestDataParts\iCity $cityTo город куда доставляется заказ */
		private $cityTo;

		/** @var float $weight вес заказа */
		private $weight;

		/** @var float $width ширина заказа */
		private $width;

		/** @var float $height высота заказа */
		private $height;

		/** @var float $length длина заказа */
		private $length;

		/** @var float $assessedCost оценочная стоимость заказа (стоимость заказа без стоимости доставки) */
		private $assessedCost;

		/** @var array $pickupTypes поддерживаемые способы отгрузки */
		private $pickupTypes;

		/** @var array $deliveryTypes поддерживаемые способы доставки */
		private $deliveryTypes;

		/** @var array $providerKeys поддерживаемые провайдеры */
		private $providerKeys;

		/** @var int $timeout время ожидания ответа от сервиса ApiShip */
		private $timeout = self::DEFAULT_TIMEOUT;

		/** @var bool $includeFees включать ли в цену страховой сбор и сбор за кассовое обслуживание */
		private $includeFees = false;

		/** @inheritDoc */
		public function __construct(array $data) {
			$this->import($data);
		}

		/** @inheritDoc */
		public function import(array $data) {
			ArgumentsValidator::arrayContainsValue($data, self::FROM_CITY_KEY, __METHOD__, self::FROM_CITY_KEY);
			$this->setCityFrom($data[self::FROM_CITY_KEY]);

			ArgumentsValidator::arrayContainsValue($data, self::TO_CITY_KEY, __METHOD__, self::TO_CITY_KEY);
			$this->setCityTo($data[self::TO_CITY_KEY]);

			ArgumentsValidator::arrayContainsValue($data, self::WEIGHT_KEY, __METHOD__, self::WEIGHT_KEY);
			$this->setWeight($data[self::WEIGHT_KEY]);

			ArgumentsValidator::arrayContainsValue($data, self::WIDTH_KEY, __METHOD__, self::WIDTH_KEY);
			$this->setWidth($data[self::WIDTH_KEY]);

			ArgumentsValidator::arrayContainsValue($data, self::HEIGHT_KEY, __METHOD__, self::HEIGHT_KEY);
			$this->setHeight($data[self::HEIGHT_KEY]);

			ArgumentsValidator::arrayContainsValue($data, self::LENGTH_KEY, __METHOD__, self::LENGTH_KEY);
			$this->setLength($data[self::LENGTH_KEY]);

			ArgumentsValidator::arrayContainsValue($data, self::ASSESSED_COST_KEY, __METHOD__, self::ASSESSED_COST_KEY);
			$this->setAssessedCost($data[self::ASSESSED_COST_KEY]);

			ArgumentsValidator::arrayContainsValue($data, self::PICKUP_TYPES_KEY, __METHOD__, self::PICKUP_TYPES_KEY);
			$this->setPickupTypes($data[self::PICKUP_TYPES_KEY]);

			ArgumentsValidator::arrayContainsValue($data, self::DELIVERY_TYPES_KEY, __METHOD__, self::DELIVERY_TYPES_KEY);
			$this->setDeliveryTypes($data[self::DELIVERY_TYPES_KEY]);

			ArgumentsValidator::arrayContainsValue($data, self::PROVIDERS_KEY, __METHOD__, self::PROVIDERS_KEY);
			$this->setProvidersKeys($data[self::PROVIDERS_KEY]);

			ArgumentsValidator::arrayContainsValue($data, self::INCLUDE_FEES_KEY, __METHOD__, self::INCLUDE_FEES_KEY);
			$this->setIncludeFees($data[self::INCLUDE_FEES_KEY]);

			return $this;
		}

		/** @inheritDoc */
		public function export() {
			$data = [
				self::FROM_CITY_KEY => $this->getCityFrom()
					->export(),
				self::TO_CITY_KEY => $this->getCityTo()
					->export(),
				self::WEIGHT_KEY => $this->getWeight(),
				self::WIDTH_KEY => $this->getWidth(),
				self::HEIGHT_KEY => $this->getHeight(),
				self::LENGTH_KEY => $this->getLength(),
				self::ASSESSED_COST_KEY => $this->getAssessedCost(),
				self::PICKUP_TYPES_KEY => $this->getPickupTypes(),
				self::DELIVERY_TYPES_KEY => $this->getDeliveryTypes(),
				self::PROVIDERS_KEY => $this->getProvidersKeys(),
				self::TIMEOUT_KEY => $this->getTimeout()
			];

			if ($this->includeFees()) {
				$data[self::INCLUDE_FEES_KEY] = $this->includeFees();
			}

			return $data;
		}

		/** @inheritDoc */
		public function setCityFrom(RequestDataParts\iCity $city) {
			$this->cityFrom = $city;
			return $this;
		}

		/** @inheritDoc */
		public function getCityFrom() {
			return $this->cityFrom;
		}

		/** @inheritDoc */
		public function setCityTo(RequestDataParts\iCity $city) {
			$this->cityTo = $city;
			return $this;
		}

		/** @inheritDoc */
		public function getCityTo() {
			return $this->cityTo;
		}

		/** @inheritDoc */
		public function setWeight($weight) {
			ArgumentsValidator::notZeroFloat($weight, self::WEIGHT_KEY, __METHOD__);
			$this->weight = $weight;
			return $this;
		}

		/** @inheritDoc */
		public function getWeight() {
			return $this->weight;
		}

		/** @inheritDoc */
		public function setWidth($width) {
			ArgumentsValidator::notZeroFloat($width, self::WIDTH_KEY, __METHOD__);
			$this->width = $width;
			return $this;
		}

		/** @inheritDoc */
		public function getWidth() {
			return $this->width;
		}

		/** @inheritDoc */
		public function setHeight($height) {
			ArgumentsValidator::notZeroFloat($height, self::HEIGHT_KEY, __METHOD__);
			$this->height = $height;
			return $this;
		}

		/** @inheritDoc */
		public function getHeight() {
			return $this->height;
		}

		/** @inheritDoc */
		public function setLength($length) {
			ArgumentsValidator::notZeroFloat($length, self::LENGTH_KEY, __METHOD__);
			$this->length = $length;
			return $this;
		}

		/** @inheritDoc */
		public function getLength() {
			return $this->length;
		}

		/** @inheritDoc */
		public function setAssessedCost($cost) {
			ArgumentsValidator::notZeroFloat($cost, self::ASSESSED_COST_KEY, __METHOD__);
			$this->assessedCost = $cost;
			return $this;
		}

		/** @inheritDoc */
		public function getAssessedCost() {
			return $this->assessedCost;
		}

		/** @inheritDoc */
		public function setPickupTypes(array $typesIds) {
			$this->pickupTypes = $typesIds;
			return $this;
		}

		/** @inheritDoc */
		public function getPickupTypes() {
			return $this->pickupTypes;
		}

		/** @inheritDoc */
		public function setDeliveryTypes(array $typesIds) {
			$this->deliveryTypes = $typesIds;
			return $this;
		}

		/** @inheritDoc */
		public function getDeliveryTypes() {
			return $this->deliveryTypes;
		}

		/** @inheritDoc */
		public function setProvidersKeys(array $providersIds) {
			$this->providerKeys = $providersIds;
			return $this;
		}

		/** @inheritDoc */
		public function getProvidersKeys() {
			return $this->providerKeys;
		}

		/** @inheritDoc */
		public function getTimeout() {
			return $this->timeout;
		}

		/** @inheritDoc */
		public function setIncludeFees(bool $status) : iCalculateDeliveryCost {
			$this->includeFees = $status;
			return $this;
		}

		/** @inheritDoc */
		public function includeFees() : bool {
			return $this->includeFees;
		}
	}
