<?php

	namespace UmiCms\Classes\Components\Emarket\Serializer\Receipt;

	use UmiCms\Classes\Components\Emarket\Serializer\Receipt;

	/**
	 * Класс сериализатора для чека по ФЗ-54 для api PayOnline
	 * @link https://payonline.ru/rel/doc/merchant/servis_onlajn-fiskalizacii_internet-platezhej.pdf
	 * @package UmiCms\Classes\Components\Emarket\Serializer
	 */
	class PayOnline extends Receipt {

		/** @const int MAX_ORDER_ITEM_NAME_LENGTH максимальная длина названия товара (0 - первый символ) */
		const MAX_ORDER_ITEM_NAME_LENGTH = 127;

		/** @const string DEFAULT_PROVIDER тип платежной системы по умолчанию */
		const DEFAULT_PROVIDER = 'Card';

		/**
		 * Возвращает данные для печати чека
		 * @param \order $order заказ
		 * @param string|null $provider тип платежной системы
		 * @return \stdClass
		 *
		 * {
		 *      'operation' => Тип операции (чека),
		 *      'transactionId' => Идентификатор транзакции,
		 *      'paymentSystemType' => Тип платежной системы,
		 *      'totalAmount' => Итоговая сумма чека в рублях,
		 *      'goods' => [
		 * @see PayOnline::getOrderItemInfo()
		 *      ],
		 *      'email' => Почтовый ящик клиента,
		 *      'typeOfProcessing' => Название процессинга
		 * }
		 * @throws \publicException
		 */
		public function getReceipt(\order $order, $provider = null) {
			$receipt = new \stdClass();
			$receipt->operation = 'Benefit';
			$receipt->transactionId = $order->getPaymentDocumentNumber();
			$receipt->paymentSystemType = $provider ?: self::DEFAULT_PROVIDER;
			$receipt->totalAmount = $this->formatPrice($order->getActualPrice());
			$receipt->goods = $this->getOrderItemInfoList($order);
			$receipt->email = $this->getContact($order);
			$receipt->typeOfProcessing = 'PayOnline';
			return $receipt;
		}

		/**
		 * @inheritDoc
		 * @return \stdClass
		 *
		 * {
		 *      'description' => Название товара,
		 *      'quantity' => Количество товара в заказе,
		 *      'amount' => Цена за единицу товара,
		 *      'tax' => id ставки НДС
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
			$info->description = $this->prepareItemName($delivery->getName());
			$info->quantity = '1';
			$info->amount = $this->formatPrice($order->getDeliveryPrice());
			$info->tax = $this->getVat($delivery)->getPayOnlineId();
			$info->paymentSubjectType = $this->getPaymentSubject($delivery)->getPayOnlineId();
			$info->paymentMethodType = $this->getPaymentMode($delivery)->getPayOnlineId();
			return $info;
		}

		/**
		 * @inheritDoc
		 * @return \stdClass
		 *
		 * {
		 *      'description' => Название товара,
		 *      'quantity' => Количество товара в заказе,
		 *      'amount' => Цена за единицу товара,
		 *      'tax' => id ставки НДС
		 * }
		 * @throws \publicException
		 * @throws \coreException
		 * @throws \privateException
		 */
		protected function getOrderItemInfo(\order $order, \orderItem $orderItem) {
			$info = new \stdClass();
			$info->description = $this->prepareItemName($orderItem->getName());
			$info->quantity = (int) $orderItem->getAmount();
			$info->amount = $this->formatPrice($this->getOrderItemPrice($order, $orderItem));
			$info->tax = $this->getVat($orderItem)->getPayOnlineId();
			$info->paymentSubjectType = $this->getPaymentSubject($orderItem)->getPayOnlineId();
			$info->paymentMethodType = $this->getPaymentMode($orderItem)->getPayOnlineId();
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
				$orderItemsCostsSum += (float) $orderItemData->amount * $orderItemData->quantity;
			}

			foreach ($orderItemList as $key => $orderItem) {
				$totalOrderItemPrice = $orderItem->amount * $orderItem->quantity;
				$percentageOfCalculatedPrice = 100 / $orderItemsCostsSum * $totalOrderItemPrice;
				$percentageOfCalculatedPriceForOneItem = $percentageOfCalculatedPrice / $orderItem->quantity;
				$priceToAppend = $priceDiff /  100 * $percentageOfCalculatedPriceForOneItem;
				$orderItem->amount = round($orderItem->amount + $priceToAppend, 2);
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
				$totalOrderItemPrice = $orderItem->amount * $orderItem->quantity;

				if ($totalOrderItemPrice > abs($priceDiff)) {
					$orderItem->amount = $this->formatPrice(round($totalOrderItemPrice + $priceDiff, 2));
					$orderItem->description = getLabel('label-receipt-set-of-goods', 'emarket', $orderItem->description, $orderItem->quantity);
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
				$orderItemsCostsSum += (float) $orderItem->amount * $orderItem->quantity;
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
			$markup->description = getLabel('label-receipt-markup');
			$markup->quantity = '1';
			$markup->amount = $this->formatPrice($price);
			$markup->tax = $orderItem->tax;
			$markup->paymentSubjectType = $orderItem->paymentSubjectType;
			$markup->paymentMethodType = $orderItem->paymentMethodType;
			return $markup;
		}

		/** @inheritDoc */
		protected function prepareItemName($name) {
			$name = parent::prepareItemName($name);
			return mb_substr($name, 0, self::MAX_ORDER_ITEM_NAME_LENGTH);
		}
	}
