<?php

	namespace UmiCms\Classes\Components\Emarket\Serializer\Receipt;

	use UmiCms\Classes\Components\Emarket\Serializer\Receipt;

	/**
	 * Класс сериализатора для чека по ФЗ-54 для api PayAnyWay
	 * @package UmiCms\Classes\Components\Emarket\Serializer
	 */
	class PayAnyWay extends Receipt {

		/**
		 * @inheritDoc
		 * @return \stdClass
		 *
		 * {
		 *      'name' => Название товара,
		 *      'price' => Цена за единицу товара,
		 *      'quantity' => Количество товара в заказе,
		 *      'vatTag' => id ставки НДС
		 * }
		 *
		 * @throws \expectObjectException
		 * @throws \publicException
		 * @throws \coreException
		 * @throws \privateException
		 */
		protected function getDeliveryInfo(\order $order) {
			$delivery = $this->getDelivery($order);

			$info = new \stdClass();
			$info->name = $this->prepareItemName($delivery->getName());
			$info->price = $this->formatPrice($order->getDeliveryPrice());
			$info->quantity = '1';
			$info->vatTag = (int) $this->getVat($delivery)->getPayAnyWayId();
			$info->po = $this->getPaymentSubject($delivery)->getPayAnyWayId();
			$info->pm = $this->getPaymentMode($delivery)->getPayAnyWayId();
			return $info;
		}

		/**
		 * @inheritDoc
		 * @return \stdClass
		 *
		 * {
		 *      'name' => Название товара,
		 *      'price' => Цена за единицу товара,
		 *      'quantity' => Количество товара в заказе,
		 *      'vatTag' => id ставки НДС
		 * }
		 * @throws \publicException
		 * @throws \coreException
		 * @throws \privateException
		 */
		protected function getOrderItemInfo(\order $order, \orderItem $orderItem) {
			$info = new \stdClass();
			$info->name = $this->prepareItemName($orderItem->getName());
			$info->price = $this->formatPrice($this->getOrderItemPrice($order, $orderItem));
			$info->quantity = (string) $orderItem->getAmount();
			$info->vatTag = (int) $this->getVat($orderItem)->getPayAnyWayId();
			$info->po = $this->getPaymentSubject($orderItem)->getPayAnyWayId();
			$info->pm = $this->getPaymentMode($orderItem)->getPayAnyWayId();
			return $info;
		}

		/** @inheritDoc */
		protected function fixItemPriceSummary(\order $order, array $orderItemList) {
			$priceDiff = $this->getDiffBetweenOrderCostAndOrderItemsCostsSum($order, $orderItemList);

			if ($priceDiff == 0) {
				return $orderItemList;
			}

			$orderItemsCostsSum = 0;
			foreach ($orderItemList as $orderItemData) {
				$orderItemsCostsSum += (float) $orderItemData->price * $orderItemData->quantity;
			}

			foreach ($orderItemList as $key => $orderItem) {
				$totalOrderItemPrice = $orderItem->price * $orderItem->quantity;
				$percentageOfCalculatedPrice = 100 / $orderItemsCostsSum * $totalOrderItemPrice;
				$percentageOfCalculatedPriceForOneItem = $percentageOfCalculatedPrice / $orderItem->quantity;
				$priceToAppend = $priceDiff /  100 * $percentageOfCalculatedPriceForOneItem;
				$orderItem->price = round($orderItem->price + $priceToAppend, 2);
			}

			$priceDiff = $this->getDiffBetweenOrderCostAndOrderItemsCostsSum($order, $orderItemList);

			if ($priceDiff == 0) {
				return $orderItemList;
			}

			$lastOrderItem = $orderItemList[count($orderItemList) - 1];

			if ($priceDiff > 0) {
				$orderItemList[] = $this->createMarkup($priceDiff, $lastOrderItem);
				return $orderItemList;
			}

			foreach ($orderItemList as $key => $orderItem) {
				$totalOrderItemPrice = $orderItem->price * $orderItem->quantity;

				if ($totalOrderItemPrice > abs($priceDiff)) {
					$orderItem->price = $this->formatPrice(round($totalOrderItemPrice + $priceDiff, 2));
					$orderItem->name = getLabel('label-receipt-set-of-goods', 'emarket', $orderItem->name, $orderItem->quantity);
					$orderItem->quantity = 1;

					return $orderItemList;
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
				$orderItemsCostsSum += (float) $orderItem->price * $orderItem->quantity;
			}

			return round($order->getActualPrice() - $orderItemsCostsSum, 2);
		}

		/**
		 * Создает товарное наименование "Наценка"
		 * @param float $price цена
		 * @param \stdClass $orderItem товарное наименование из целевого заказа, необходимое для получения актуальных данных
		 * @return \stdClass
		 */
		private function createMarkup(float $price, \stdClass $orderItem) : \stdClass {
			$price = round($price, 2);

			$markup = new \stdClass();
			$markup->name = getLabel('label-receipt-markup');
			$markup->price = $this->formatPrice($price);
			$markup->quantity = '1';
			$markup->vatTag = $orderItem->vatTag;
			$markup->po = $orderItem->po;
			$markup->pm = $orderItem->pm;
			return $markup;
		}

		/** @inheritDoc */
		protected function prepareItemName($name) {
			return trim(preg_replace('/&?[a-z0-9]+;/i', '', htmlspecialchars($name)));
		}
	}
