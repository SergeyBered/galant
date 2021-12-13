<?php

	namespace UmiCms\Classes\Components\Emarket\Serializer\Receipt;

	use UmiCms\Classes\Components\Emarket\Serializer\Receipt;

	/**
	 * Класс сериализатора для чека по ФЗ-54 для api Робокасса
	 * @package UmiCms\Classes\Components\Emarket\Serializer
	 */
	class RoboKassa extends Receipt {

		/** @const int MAX_ORDER_ITEM_NAME_LENGTH максимальная длина названия товара (0 - первый символ) */
		const MAX_ORDER_ITEM_NAME_LENGTH = 63;

		/**
		 * @inheritDoc
		 * @return array
		 *
		 * [
		 *      'name' => Название товара,
		 *      'quantity' => Количество товара,
		 *      'sum' => Цена за единицу товара,
		 *      'tax' => id ставки НДС
		 * ]
		 *
		 * @throws \expectObjectException
		 * @throws \publicException
		 * @throws \coreException
		 * @throws \privateException
		 */
		protected function getDeliveryInfo(\order $order) {
			$delivery = $this->getDelivery($order);

			return [
				'name' => $this->prepareItemName($delivery->getName()),
				'quantity' => $this->formatQuantity(1),
				'sum' => $this->formatPrice($order->getDeliveryPrice()),
				'tax' => $this->getVat($delivery)->getRoboKassaId(),
				'payment_object' => $this->getPaymentSubject($delivery)->getRoboKassaId(),
				'payment_method' => $this->getPaymentMode($delivery)->getRoboKassaId()
			];
		}

		/**
		 * @inheritDoc
		 * @return array
		 *
		 * [
		 *      'name' => Название товара,
		 *      'quantity' => Количество товара,
		 *      'sum' => Цена за единицу товара,
		 *      'tax' => id ставки НДС
		 * ]
		 * @throws \publicException
		 * @throws \coreException
		 * @throws \privateException
		 */
		protected function getOrderItemInfo(\order $order, \orderItem $orderItem) {
			return [
				'name' => $this->prepareItemName($orderItem->getName()),
				'quantity' => $this->formatQuantity($orderItem->getAmount()),
				'sum' => $this->formatPrice($this->getOrderItemPrice($order, $orderItem)),
				'tax' => $this->getVat($orderItem)->getRoboKassaId(),
				'payment_object' => $this->getPaymentSubject($orderItem)->getRoboKassaId(),
				'payment_method' => $this->getPaymentMode($orderItem)->getRoboKassaId()
			];
		}

		/** @inheritDoc */
		protected function fixItemPriceSummary(\order $order, array $orderItemList) {
			$priceDiff = $this->getDiffBetweenOrderCostAndOrderItemsCostsSum($order, $orderItemList);

			if ($priceDiff == 0) {
				return [
					'items' => $orderItemList
				];
			}

			$orderItemsCostsSum = 0;
			foreach ($orderItemList as $orderItemData) {
				$orderItemsCostsSum += (float) $orderItemData['sum'] * $orderItemData['quantity'];
			}

			foreach ($orderItemList as $key => &$orderItem) {
				$totalOrderItemPrice = $orderItem['sum'] * $orderItem['quantity'];
				$percentageOfCalculatedPrice = 100 / $orderItemsCostsSum * $totalOrderItemPrice;
				$percentageOfCalculatedPriceForOneItem = $percentageOfCalculatedPrice / $orderItem['quantity'];
				$priceToAppend = $priceDiff /  100 * $percentageOfCalculatedPriceForOneItem;
				$orderItem['sum'] = round($orderItem['sum'] + $priceToAppend, 2);
			}

			$priceDiff = $this->getDiffBetweenOrderCostAndOrderItemsCostsSum($order, $orderItemList);

			if ($priceDiff == 0) {
				return [
					'items' => $orderItemList
				];
			}

			$lastOrderItem = &$orderItemList[count($orderItemList) - 1];

			if ($priceDiff > 0) {
				$orderItemList[] = $this->createMarkup($priceDiff, $lastOrderItem);

				return [
					'items' => $orderItemList
				];
			}

			foreach ($orderItemList as $key => &$orderItem) {
				$totalOrderItemPrice = $orderItem['sum'] * $orderItem['quantity'];

				if ($totalOrderItemPrice > abs($priceDiff)) {
					$orderItem['sum'] = $this->formatPrice(round($totalOrderItemPrice + $priceDiff, 2));
					$orderItem['name'] = getLabel('label-receipt-set-of-goods', 'emarket', $orderItem['name'], $orderItem['quantity']);
					$orderItem['quantity'] = $this->formatQuantity(1);

					return [
						'items' => $orderItemList
					];
				}
			}

			throw new \privateException(getLabel('error-payment-wrong-receipt-info'));
		}

		/**
		 * Возвращает разницу между актуальной стоимостью заказа и суммой стоимостей товарных наименований
		 * @param \order $order заказ
		 * @param array $orderItems товарные наименования
		 * @return float
		 */
		private function getDiffBetweenOrderCostAndOrderItemsCostsSum(\order $order, array $orderItems) : float {
			$orderItemsCostsSum = 0;
			foreach ($orderItems as $key => $orderItem) {
				$orderItemsCostsSum += (float) $orderItem['sum'] * $orderItem['quantity'];
			}

			return round($order->getActualPrice() - $orderItemsCostsSum, 2);
		}

		/**
		 * Создает товарное наименование "Наценка"
		 * @param float $price цена
		 * @param array $orderItem товарное наименование из целевого заказа, необходимое для получения актуальных данных
		 * @return array
		 */
		private function createMarkup(float $price, array $orderItem) : array {
			$price = round($price, 2);

			$markup['name'] = getLabel('label-receipt-markup');
			$markup['quantity'] = $this->formatQuantity(1);
			$markup['sum'] = $this->formatPrice($price);
			$markup['tax'] = $orderItem['tax'];
			$markup['payment_object'] = $orderItem['payment_object'];
			$markup['payment_method'] = $orderItem['payment_method'];
			return $markup;
		}

		/** @inheritDoc */
		protected function prepareItemName($name) {
			return mb_substr($name, 0, self::MAX_ORDER_ITEM_NAME_LENGTH);
		}
	}
