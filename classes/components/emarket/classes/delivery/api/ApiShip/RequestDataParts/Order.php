<?php

	namespace UmiCms\Classes\Components\Emarket\Delivery\ApiShip\RequestDataParts;

	use UmiCms\Classes\Components\Emarket\Delivery\ApiShip\Enums\DeliveryTypes;
	use UmiCms\Classes\Components\Emarket\Delivery\ApiShip\Enums\PickupTypes;
	use UmiCms\Classes\Components\Emarket\Delivery\ApiShip\Enums\ProvidersKeys;
	use UmiCms\Classes\Components\Emarket\Delivery\ApiShip\Utils\ArgumentsValidator;

	/**
	 * Часть данных запроса с общей информацией о заказе
	 * @package UmiCms\Classes\Components\Emarket\Delivery\ApiShip\RequestDataParts
	 */
	class Order implements iOrder {

		/** @var string $orderNumber номер заказа */
		private $orderNumber;

		/** @var float $height высота заказа */
		private $height;

		/** @var float $length длина заказа */
		private $length;

		/** @var float $width ширина заказа */
		private $width;

		/** @var float $weight вес заказа */
		private $weight;

		/** @var string $providerKey идентификатор провайдера (службы доставки) */
		private $providerKey;

		/** @var int $pickupTypeId идентификатор типа отгрузки заказа */
		private $pickupTypeId;

		/** @var int $deliveryTypeId идентификатор типа доставки заказа */
		private $deliveryTypeId;

		/** @var int $tariffId идентификатор заказа */
		private $tariffId;

		/** @var \iUmiDate $pickupDate дата отгрузки */
		private $pickupDate;

		/** @var \iUmiDate $deliveryDate дата доставки */
		private $deliveryDate;

		/** @var int $pointInId идентификатор точки приема заказа */
		private $pointInId;

		/** @var int $pointOutId идентификатор точки выдачи заказа */
		private $pointOutId;

		/** @var string $deliveryTimeStart начало интервала времени доставки заказа клиенту */
		private $deliveryTimeStart;

		/** @var string $deliveryTimeEnd конец интервала времени доставки заказа клиенту */
		private $deliveryTimeEnd;

		/** @inheritDoc */
		public function __construct(array $data) {
			$this->import($data);
		}

		/** @inheritDoc */
		public function import(array $data) {
			ArgumentsValidator::arrayContainsValue($data, self::ORDER_NUMBER_KEY, __METHOD__, self::ORDER_NUMBER_KEY);
			$this->setOrderNumber($data[self::ORDER_NUMBER_KEY]);

			ArgumentsValidator::arrayContainsValue($data, self::WEIGHT_KEY, __METHOD__, self::WEIGHT_KEY);
			$this->setWeight($data[self::WEIGHT_KEY]);

			ArgumentsValidator::arrayContainsValue($data, self::PROVIDER_ID_KEY, __METHOD__, self::PROVIDER_ID_KEY);
			$this->setProviderKey($data[self::PROVIDER_ID_KEY]);

			ArgumentsValidator::arrayContainsValue($data, self::PICKUP_TYPE_KEY, __METHOD__, self::PICKUP_TYPE_KEY);
			$this->setPickupTypeId($data[self::PICKUP_TYPE_KEY]);

			ArgumentsValidator::arrayContainsValue($data, self::DELIVERY_TYPE_KEY, __METHOD__, self::DELIVERY_TYPE_KEY);
			$this->setDeliveryTypeId($data[self::DELIVERY_TYPE_KEY]);

			ArgumentsValidator::arrayContainsValue($data, self::TARIFF_ID_KEY, __METHOD__, self::TARIFF_ID_KEY);
			$this->setTariffId($data[self::TARIFF_ID_KEY]);

			if (isset($data[self::HEIGHT_KEY])) {
				$this->setHeight($data[self::HEIGHT_KEY]);
			}

			if (isset($data[self::LENGTH_KEY])) {
				$this->setLength($data[self::LENGTH_KEY]);
			}

			if (isset($data[self::WIDTH_KEY])) {
				$this->setWidth($data[self::WIDTH_KEY]);
			}

			if (isset($data[self::DELIVERY_DATE_KEY])) {
				$this->setDeliveryDate($data[self::DELIVERY_DATE_KEY]);
			}

			if (isset($data[self::PICKUP_DATE_KEY])) {
				$this->setPickupDate($data[self::PICKUP_DATE_KEY]);
			}

			if (isset($data[self::POINT_IN_KEY])) {
				$this->setPointInId($data[self::POINT_IN_KEY]);
			}

			if (isset($data[self::POINT_OUT_KEY])) {
				$this->setPointOutId($data[self::POINT_OUT_KEY]);
			}

			if (isset($data[self::DELIVERY_TIME_START_KEY])) {
				$this->setDeliveryTimeStart($data[self::DELIVERY_TIME_START_KEY]);
			}

			if (isset($data[self::DELIVERY_TIME_END_KEY])) {
				$this->setDeliveryTimeEnd($data[self::DELIVERY_TIME_END_KEY]);
			}

			return $this;
		}

		/** @inheritDoc */
		public function export() {
			$data = [
				self::ORDER_NUMBER_KEY => $this->getOrderNumber(),
				self::WEIGHT_KEY => $this->getWeight(),
				self::PROVIDER_ID_KEY => $this->getProviderKey(),
				self::PICKUP_TYPE_KEY => $this->getPickupTypeId(),
				self::DELIVERY_TYPE_KEY => $this->getDeliveryTypeId(),
				self::TARIFF_ID_KEY => $this->getTariffId()
			];

			if ($this->getHeight() !== null) {
				$data[self::HEIGHT_KEY] = $this->getHeight();
			}

			if ($this->getLength() !== null) {
				$data[self::LENGTH_KEY] = $this->getLength();
			}

			if ($this->getWidth() !== null) {
				$data[self::WIDTH_KEY] = $this->getWidth();
			}

			if ($this->getPickupDate(self::DATE_FORMAT) !== null) {
				$data[self::PICKUP_DATE_KEY] = $this->getPickupDate(self::DATE_FORMAT);
			}

			if ($this->getDeliveryDate(self::DATE_FORMAT) !== null) {
				$data[self::DELIVERY_DATE_KEY] = $this->getDeliveryDate(self::DATE_FORMAT);
			}

			if ($this->getPointInId() !== null) {
				$data[self::POINT_IN_KEY] = $this->getPointInId();
			}

			if ($this->getPointOutId() !== null) {
				$data[self::POINT_OUT_KEY] = $this->getPointOutId();
			}

			if ($this->getDeliveryTimeStart() !== null) {
				$data[self::DELIVERY_TIME_START_KEY] = $this->getDeliveryTimeStart();
			}

			if ($this->getDeliveryTimeEnd() !== null) {
				$data[self::DELIVERY_TIME_END_KEY] = $this->getDeliveryTimeEnd();
			}

			return $data;
		}

		/** @inheritDoc */
		public function setOrderNumber($orderNumber) {
			try {
				ArgumentsValidator::notEmptyString($orderNumber, self::ORDER_NUMBER_KEY, __METHOD__);
			} catch (\wrongParamException $e) {
				throw new \wrongParamException(getLabel('label-api-ship-error-incorrect-order-number', self::I18N_PATH));
			}
			$this->orderNumber = $orderNumber;
			return $this;
		}

		/** @inheritDoc */
		public function getOrderNumber() {
			return $this->orderNumber;
		}

		/** @inheritDoc */
		public function setHeight($height) {
			try {
				ArgumentsValidator::notZeroFloat($height, self::HEIGHT_KEY, __METHOD__);
			} catch (\wrongParamException $e) {
				throw new \wrongParamException(getLabel('label-api-ship-error-incorrect-order-height', self::I18N_PATH));
			}
			$this->height = $height;
			return $this;
		}

		/** @inheritDoc */
		public function getHeight() {
			return $this->height;
		}

		/** @inheritDoc */
		public function setLength($length) {
			try {
				ArgumentsValidator::notZeroFloat($length, self::LENGTH_KEY, __METHOD__);
			} catch (\wrongParamException $e) {
				throw new \wrongParamException(getLabel('label-api-ship-error-incorrect-order-length', self::I18N_PATH));
			}
			$this->length = $length;
			return $this;
		}

		/** @inheritDoc */
		public function getLength() {
			return $this->length;
		}

		/** @inheritDoc */
		public function setWidth($width) {
			try {
				ArgumentsValidator::notZeroFloat($width, self::WIDTH_KEY, __METHOD__);
			} catch (\wrongParamException $e) {
				throw new \wrongParamException(getLabel('label-api-ship-error-incorrect-order-width', self::I18N_PATH));
			}
			$this->width = $width;
			return $this;
		}

		/** @inheritDoc */
		public function getWidth() {
			return $this->width;
		}

		/** @inheritDoc */
		public function setWeight($weight) {
			try {
				ArgumentsValidator::notZeroFloat($weight, self::WEIGHT_KEY, __METHOD__);
			} catch (\wrongParamException $e) {
				throw new \wrongParamException(getLabel('label-api-ship-error-incorrect-order-weight', self::I18N_PATH));
			}
			$this->weight = $weight;
			return $this;
		}

		/** @inheritDoc */
		public function getWeight() {
			return $this->weight;
		}

		/** @inheritDoc */
		public function setProviderKey(ProvidersKeys $providerKey) {
			$this->providerKey = (string) $providerKey;
			return $this;
		}

		/** @inheritDoc */
		public function getProviderKey() {
			return $this->providerKey;
		}

		/** @inheritDoc */
		public function setPickupTypeId(PickupTypes $pickupType) {
			$this->pickupTypeId = (int) $pickupType->__toString();
			return $this;
		}

		/** @inheritDoc */
		public function getPickupTypeId() {
			return $this->pickupTypeId;
		}

		/** @inheritDoc */
		public function setDeliveryTypeId(DeliveryTypes $deliveryType) {
			$this->deliveryTypeId = (int) $deliveryType->__toString();
			return $this;
		}

		/** @inheritDoc */
		public function getDeliveryTypeId() {
			return $this->deliveryTypeId;
		}

		/** @inheritDoc */
		public function setTariffId($tariffId) {
			try {
				ArgumentsValidator::notZeroInteger($tariffId, self::TARIFF_ID_KEY, __METHOD__);
			} catch (\wrongParamException $e) {
				throw new \wrongParamException(
					getLabel('label-api-ship-error-incorrect-order-delivery-tariff', self::I18N_PATH)
				);
			}
			$this->tariffId = $tariffId;
			return $this;
		}

		/** @inheritDoc */
		public function getTariffId() {
			return $this->tariffId;
		}

		/** @inheritDoc */
		public function setPickupDate(\iUmiDate $date) {
			$minimalDate = new \umiDate(strtotime('-1 day'));

			try {
				ArgumentsValidator::dateGreaterDate(
					$date, self::DELIVERY_DATE_KEY, '', $minimalDate
				);
			} catch (\wrongParamException $e) {
				throw new \wrongParamException(
					getLabel('label-api-ship-error-incorrect-pickup-date-later', self::I18N_PATH)
				);
			}

			$maximalDate = $this->getDeliveryDate();

			try {
				ArgumentsValidator::dateLessDate(
					$date, self::PICKUP_DATE_KEY, '', $maximalDate
				);
			} catch (\wrongParamException $e) {
				throw new \wrongParamException(
					getLabel('label-api-ship-error-incorrect-pickup-date-early', self::I18N_PATH)
				);
			}

			$this->pickupDate = $date;
			return $this;
		}

		/** @inheritDoc */
		public function getPickupDate($format = null) {
			if ($this->pickupDate === null) {
				return $this->pickupDate;
			}

			return $this->getFormattedDate(
				$this->pickupDate, $format
			);
		}

		/** @inheritDoc */
		public function setDeliveryDate(\iUmiDate $date) {
			$minimalDate = new \umiDate(time());

			try {
				ArgumentsValidator::dateGreaterDate(
					$date, self::DELIVERY_DATE_KEY, '', $minimalDate
				);
			} catch (\wrongParamException $e) {
				throw new \wrongParamException(
					getLabel('label-api-ship-error-incorrect-delivery-date-later', self::I18N_PATH)
				);
			}

			$maximalDate = new \umiDate(strtotime('+1 month'));

			try {
				ArgumentsValidator::dateLessDate(
					$date, self::DELIVERY_DATE_KEY, '', $maximalDate
				);
			} catch (\wrongParamException $e) {
				throw new \wrongParamException(
					getLabel('label-api-ship-error-incorrect-delivery-date-early', self::I18N_PATH)
				);
			}

			$this->deliveryDate = $date;
			return $this;
		}

		/** @inheritDoc */
		public function getDeliveryDate($format = null) {
			if ($this->deliveryDate === null) {
				return $this->deliveryDate;
			}

			return $this->getFormattedDate(
				$this->deliveryDate, $format
			);
		}

		/** @inheritDoc */
		public function setPointInId($pointId) {
			try {
				ArgumentsValidator::notZeroInteger($pointId, self::POINT_IN_KEY, __METHOD__);
			} catch (\wrongParamException $e) {
				throw new \wrongParamException(getLabel('label-api-ship-error-incorrect-point-in', self::I18N_PATH));
			}
			$this->pointInId = $pointId;
			return $this;
		}

		/** @inheritDoc */
		public function getPointInId() {
			return $this->pointInId;
		}

		/** @inheritDoc */
		public function setPointOutId($pointId) {
			try {
				ArgumentsValidator::notZeroInteger($pointId, self::POINT_OUT_KEY, __METHOD__);
			} catch (\wrongParamException $e) {
				throw new \wrongParamException(getLabel('label-api-ship-error-incorrect-point-out', self::I18N_PATH));
			}
			$this->pointOutId = $pointId;
			return $this;
		}

		/** @inheritDoc */
		public function getPointOutId() {
			return $this->pointOutId;
		}

		/** @inheritDoc */
		public function getDeliveryTimeStart() {
			return $this->deliveryTimeStart;
		}

		/** @inheritDoc */
		public function setDeliveryTimeStart($time) {
			if (!preg_match(self::TIME_FORMAT, $time)) {
				throw new \wrongParamException(
					getLabel('label-api-ship-error-incorrect-order-delivery-time-start', self::I18N_PATH)
				);
			}
			$this->deliveryTimeStart = $time;
			return $this;
		}

		/** @inheritDoc */
		public function getDeliveryTimeEnd() {
			return $this->deliveryTimeEnd;
		}

		/** @inheritDoc */
		public function setDeliveryTimeEnd($time) {
			if (!preg_match(self::TIME_FORMAT, $time)) {
				throw new \wrongParamException(
					getLabel('label-api-ship-error-incorrect-order-delivery-time-end', self::I18N_PATH)
				);
			}
			$this->deliveryTimeEnd = $time;
			return $this;
		}

		/**
		 * Возвращает дату в заданном формате
		 * @param \iUmiDate $date дата
		 * @param string|null $format формат, если не передан - вернет дату как есть
		 * @return \iUmiDate|int|string
		 */
		private function getFormattedDate(\iUmiDate $date, $format = null) {
			switch ($format) {
				case null : {
					return $date;
				}
				case self::DATE_TIMESTAMP : {
					return $date->getDateTimeStamp();
				}
				default : {
					return $date->getFormattedDate($format);
				}
			}
		}
	}
