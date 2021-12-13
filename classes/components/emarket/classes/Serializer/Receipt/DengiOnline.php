<?php

	namespace UmiCms\Classes\Components\Emarket\Serializer\Receipt;

	use UmiCms\Classes\Components\Emarket\Serializer\Receipt;

	/**
	 * Класс сериализатора для чека по ФЗ-54 для способа оплаты Деньги Online
	 * @link https://docs.dengionline.com/index.php?r=page/view&id=36111329
	 * @package UmiCms\Classes\Components\Emarket\Serializer\Receipt
	 */
	class DengiOnline extends Receipt {

		/** @const int MAX_ORDER_ITEM_NAME_LENGTH максимальная длина названия товара (0 - первый символ) */
		const MAX_ORDER_ITEM_NAME_LENGTH = 127;

		/**
		 * Возвращает данные для печати чека
		 * @param \order $order заказ
		 * @return array
		 * @throws \publicException
		 */
		public function getReceipt(\order $order) : array {
			$orderItemInfoList = $this->getOrderItemInfoList($order);
			$receipt['receipt'] = json_encode($orderItemInfoList, JSON_UNESCAPED_UNICODE);
			$receipt['customer_contact'] = $this->getContact($order);

			return $receipt;
		}

		/**
		 * @inheritDoc
		 * @return array
		 *
		 * [
		 * 		'Quantity' => количество товара,
		 * 		'Price' => стоимость товара,
		 * 		'Tax' => id ставки НДС,
		 * 		'Text' => наменование товара
		 * ]
		 * @throws \coreException
		 * @throws \expectObjectException
		 * @throws \publicException
		 */
		protected function getDeliveryInfo(\order $order) : array {
			$delivery = $this->getDelivery($order);

			return [
				'Quantity' => $this->formatQuantity(1),
				'Price' => $this->formatPrice($order->getDeliveryPrice()),
				'Tax' => (int) $this->getVat($delivery)->getDengiOnlineId(),
				'Text' => $this->prepareItemName($delivery->getName())
			];
		}

		/**
		 * @inheritDoc
		 * @return array
		 *
		 * [
		 * 		'Quantity' => количество товара,
		 * 		'Price' => стоимость товара,
		 * 		'Tax' => id ставки НДС,
		 * 		'Text' => наменование товара
		 * ]
		 * @throws \coreException
		 * @throws \publicException
		 */
		protected function getOrderItemInfo(\order $order, \orderItem $orderItem) : array {
			return [
				'Quantity' => $this->formatQuantity($orderItem->getAmount()),
				'Price' => $this->formatPrice($this->getOrderItemPrice($order, $orderItem)),
				'Tax' => (int) $this->getVat($orderItem)->getDengiOnlineId(),
				'Text' => $this->prepareItemName($orderItem->getName())
			];
		}

		/** @inheritDoc */
		protected function prepareItemName($name) : string {
			return mb_substr($name, 0, self::MAX_ORDER_ITEM_NAME_LENGTH);
		}

		/**
		 * @inheritDoc
		 */
		protected function fixItemPriceSummary(\order $order, array $orderItemList) : array {
			$priceDiff = $this->getDiffBetweenOrderCostAndOrderItemsCostsSum($order, $orderItemList);

			if ($priceDiff == 0) {
				return $orderItemList;
			}

			$orderItemsCostsSum = 0;
			foreach ($orderItemList as $orderItemData) {
				$orderItemsCostsSum += (float) $orderItemData['Price'] * $orderItemData['Quantity'];
			}

			foreach ($orderItemList as $key => &$orderItem) {
				$totalOrderItemPrice = $orderItem['Price'] * $orderItem['Quantity'];
				$percentageOfCalculatedPrice = 100 / $orderItemsCostsSum * $totalOrderItemPrice;
				$percentageOfCalculatedPriceForOneItem = $percentageOfCalculatedPrice / $orderItem['Quantity'];
				$priceToAppend = $priceDiff /  100 * $percentageOfCalculatedPriceForOneItem;
				$orderItem['Price'] = round($orderItem['Price'] + $priceToAppend, 2);
			}

			$priceDiff = $this->getDiffBetweenOrderCostAndOrderItemsCostsSum($order, $orderItemList);

			if ($priceDiff == 0) {
				return $orderItemList;
			}

			$lastOrderItem = &$orderItemList[count($orderItemList) - 1];

			if ($priceDiff > 0) {
				$orderItemList[] = $this->createMarkup($priceDiff, $lastOrderItem);

				return $orderItemList;
			}

			foreach ($orderItemList as $key => &$orderItem) {
				$totalOrderItemPrice = $orderItem['Price'] * $orderItem['Quantity'];

				if ($totalOrderItemPrice > abs($priceDiff)) {
					$orderItem['Price'] = $this->formatPrice(round($totalOrderItemPrice + $priceDiff, 2));
					$orderItem['Text'] = getLabel('label-receipt-set-of-goods', 'emarket', $orderItem['Text'], $orderItem['Quantity']);
					$orderItem['Quantity'] = $this->formatQuantity(1);

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
				$orderItemsCostsSum += (float) $orderItem['Price'] * $orderItem['Quantity'];
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

			$markup['Quantity'] = $this->formatQuantity(1);
			$markup['Price'] = $this->formatPrice($price);
			$markup['Tax'] = $orderItem['Tax'];
			$markup['Text'] = getLabel('label-receipt-markup');
			return $markup;
		}
	}
