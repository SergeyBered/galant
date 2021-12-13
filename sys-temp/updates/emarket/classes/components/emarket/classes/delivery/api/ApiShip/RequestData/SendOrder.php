<?php

	namespace UmiCms\Classes\Components\Emarket\Delivery\ApiShip\RequestData;

	use UmiCms\Classes\Components\Emarket\Delivery\ApiShip\RequestDataParts;
	use UmiCms\Classes\Components\Emarket\Delivery\ApiShip\Utils\ArgumentsValidator;

	/**
	 * Данные запроса на создание заказа в ApiShip
	 * @package UmiCms\Classes\Components\Emarket\Delivery\ApiShip\RequestData
	 */
	class SendOrder implements iSendOrder {

		/** @var RequestDataParts\iOrder $order часть данных запроса с общей информацией о заказе */
		private $order;

		/** @var RequestDataParts\iOrderCost $cost часть данных запроса с информацией о стоимости заказа */
		private $cost;

		/** @var RequestDataParts\iDeliveryAgent $sender часть данных запроса с информацией об отправителе заказа */
		private $sender;

		/** @var RequestDataParts\iDeliveryAgent $recipient часть данных запроса с информацией о получателе заказа */
		private $recipient;

		/** @var RequestDataParts\iOrderItem[] $items части данных запроса с информацией об отправляемых товарах */
		private $items = [];

		/** @inheritDoc */
		public function __construct(array $data) {
			$this->import($data);
		}

		/** @inheritDoc */
		public function import(array $data) {
			ArgumentsValidator::arrayContainsValue($data, self::ORDER_KEY, __METHOD__, self::ORDER_KEY);
			$this->setOrder($data[self::ORDER_KEY]);

			ArgumentsValidator::arrayContainsValue($data, self::COST_KEY, __METHOD__, self::COST_KEY);
			$this->setCost($data[self::COST_KEY]);

			ArgumentsValidator::arrayContainsValue($data, self::SENDER_KEY, __METHOD__, self::SENDER_KEY);
			$this->setSender($data[self::SENDER_KEY]);

			ArgumentsValidator::arrayContainsValue($data, self::RECIPIENT_KEY, __METHOD__, self::RECIPIENT_KEY);
			$this->setRecipient($data[self::RECIPIENT_KEY]);

			ArgumentsValidator::arrayContainsValue($data, self::ITEMS_KEY, __METHOD__, self::ITEMS_KEY);
			$this->setItems($data[self::ITEMS_KEY]);

			$items = $this->fixItemPriceSummary($this->cost, $this->items);
			$this->setItems($data[self::ITEMS_KEY]);
		}

		/** @inheritDoc */
		public function export() {
			$data = [
				self::ORDER_KEY => $this->getOrder()
					->export(),
				self::COST_KEY => $this->getCost()
					->export(),
				self::SENDER_KEY => $this->getSender()
					->export(),
				self::RECIPIENT_KEY => $this->getRecipient()
					->export(),
			];

			foreach ($this->getItems() as $item) {
				$data[self::ITEMS_KEY][] = $item->export();
			}

			return $data;
		}

		/** @inheritDoc */
		public function setOrder(RequestDataParts\iOrder $order) {
			$this->order = $order;
			return $this;
		}

		/** @inheritDoc */
		public function getOrder() {
			return $this->order;
		}

		/** @inheritDoc */
		public function setCost(RequestDataParts\iOrderCost $cost) {
			$this->cost = $cost;
			return $this;
		}

		/** @inheritDoc */
		public function getCost() {
			return $this->cost;
		}

		/** @inheritDoc */
		public function setSender(RequestDataParts\iDeliveryAgent $sender) {
			$this->sender = $sender;
			return $this;
		}

		/** @inheritDoc */
		public function getSender() {
			return $this->sender;
		}

		/** @inheritDoc */
		public function setRecipient(RequestDataParts\iDeliveryAgent $recipient) {
			$this->recipient = $recipient;
			return $this;
		}

		/** @inheritDoc */
		public function getRecipient() {
			return $this->recipient;
		}

		/** @inheritDoc */
		public function setItems(array $items) {
			$this->validateOrderItems($items);
			$this->items = $items;
			return $this;
		}

		/** @inheritDoc */
		public function getItems() {
			return $this->items;
		}

		/**
		 * Валидирует части данных запроса с информацией о товарных наименования заказа
		 * @param array $items части данных запроса с информацией о товарных наименования заказа
		 * @return RequestDataParts\iOrderItem[]
		 */
		private function validateOrderItems(array $items) {
			return array_map(function (RequestDataParts\iOrderItem $item) {
				return $item;
			}, $items);
		}

		/**
		 * Исправляет стоимости товарных наименований, если они "не бьются" со стоимостями заказа
		 * @param RequestDataParts\iOrderCost $orderCost стоимость заказа
		 * @param RequestDataParts\iOrderItem[] $orderItemList стоимости товарных наименований
		 * @return RequestDataParts\iOrderItem[]
		 */
		private function fixItemPriceSummary(RequestDataParts\iOrderCost $orderCost, array $orderItemList) {
			if (count($orderItemList) === 0) {
				return $orderItemList;
			}

			$calculatedOrderAssessedCost = 0;
			$calculatedOrderCodCost = 0;

			foreach ($orderItemList as $orderItemData) {
				$calculatedOrderAssessedCost += (float) $orderItemData->getAssessedCost() * $orderItemData->getQuantity();
				$calculatedOrderCodCost += (float) $orderItemData->getCodCost() * $orderItemData->getQuantity();
			}

			$lastIndex = count($orderItemList) - 1;

			if ($orderCost->getAssessedCost() != $calculatedOrderAssessedCost) {
				$assessedCostDiff = $orderCost->getAssessedCost() - $calculatedOrderAssessedCost;
				$orderItemList[$lastIndex]->setAssessedCost($orderItemList[$lastIndex]->getAssessedCost() + $assessedCostDiff);
			}

			if (($orderCost->getCodCost() - $orderCost->getDeliveryCost()) != $calculatedOrderCodCost) {
				$codCostDiff = $orderCost->getCodCost() - $orderCost->getDeliveryCost() - $calculatedOrderCodCost;
				$orderItemList[$lastIndex]->setCodCost($orderItemList[$lastIndex]->getCodCost() + $codCostDiff);
			}

			return $orderItemList;
		}
	}
