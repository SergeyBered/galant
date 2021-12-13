<?php

	namespace UmiCms\Classes\Components\Emarket\Serializer\Receipt;

	use \YandexKassaPayment as iPayment;
	use UmiCms\Classes\Components\Emarket\Serializer\Receipt;

	/**
	 * Класс сериализатора для чека по ФЗ-54 для api Яндекс.Касса версии 4
	 * @link https://kassa.yandex.ru/docs/checkout-api/#sozdanie-platezha
	 * @package UmiCms\Classes\Components\Emarket\Serializer
	 */
	class YandexKassa4 extends Receipt {

		/** @const string RESULT_URL_WAIT адрес страницы ожидания результата платежа */
		const RESULT_URL_WAIT = 'emarket/purchase/result/wait/';

		/** @const string RESULT_URL_SUCCESSFUL адрес страницы успешного результата платежа */
		const RESULT_URL_SUCCESSFUL = 'emarket/purchase/result/successful/';

		/** @var string $returnUrl адрес, куда должен перейти пользователь */
		private $returnUrl = '';

		/**
		 * Возвращает данные для печати чека
		 * @param \order $order заказ
		 * @return array
		 *
		 * [
		 *      'receipt' => [
		 *          'items' => $this->getOrderItemInfoList(),
		 *          'email' => $this->getContact()
		 *      ]
		 * ]
		 * @throws \publicException
		 */
		public function getReceipt(\order $order) {
			return [
				'receipt' => array_merge(
					$this->getOrderItemInfoList($order),
					$this->getContact($order)
				)
			];
		}

		/**
		 * @inheritDoc
		 * @return array
		 *
		 * [
		 *       'email' => Почтовый ящик покупателя
		 * ]
		 *
		 * @throws \publicException
		 */
		public function getContact(\order $order) {
			return [
				'email' => parent::getContact($order)
			];
		}

		/**
		 * Формирует данные стоимости
		 * @param float $price стоимость
		 * @return array
		 *
		 * [
		 *      'amount' => [
		 *          'value' => Цена
		 *          'currency' => Код валюты в формате ISO
		 *      ]
		 * ]
		 */
		public function getPrice($price) {
			return [
				'amount' => [
					'value' => $this->formatPrice($price),
					'currency' => $this->getCurrencyCode()
				]
			];
		}

		/**
		 * Формирует данные автоподтверждения платежа
		 * @param iPayment $payment способ оплаты
		 * @return array
		 */
		public function getCapture(iPayment $payment) {
			return [
				'capture' => !$payment->getValue('disable_auto_capture')
			];
		}

		/**
		 * Возвращает данные подтверждения платежа
		 * @return array
		 *
		 * [
		 *      'confirmation' => [
		 *          'type' => 'redirect',
		 *          'return_url' => 'Адрес, куда можно отправить пользователя'
		 *      ]
		 * ]
		 * @throws \coreException
		 */
		public function getConfirmation() {
			$returnUrl = $this->getReturnUrl() ?: self::RESULT_URL_SUCCESSFUL;

			return [
				'confirmation' => [
					'type' => 'redirect',
					'return_url' => "{$this->getDomain()}/$returnUrl"
				]
			];
		}

		/**
		 * Изменяет адрес, куда должен перейти пользователь
		 * @param string $url адрес
		 * @return $this
		 */
		public function setReturnUrl($url) {
			$this->returnUrl = $url;
			return $this;
		}

		/**
		 * Возвращает адрес, куда должен перейти пользователь
		 * @return string
		 */
		protected function getReturnUrl() {
			return $this->returnUrl;
		}

		/**
		 * @inheritDoc
		 * @return array
		 *
		 * [
		 *      'description' => Название товара,
		 *      'quantity' => Количество товара,
		 *      'vat_code' => id ставки НДС,
		 *      'amount' => $this->getPrice()
		 * ]
		 *
		 * @throws \expectObjectException
		 * @throws \Exception
		 */
		protected function getDeliveryInfo(\order $order) {
			$delivery = $this->getDelivery($order);

			return [
					'description' => $this->prepareItemName($delivery->getName()),
					'quantity' => $this->formatQuantity(1),
					'vat_code' => (int) $this->getVat($delivery)->getYandexKassaId(),
					'payment_subject' => $this->getPaymentSubject($delivery)->getYandexKassaId(),
					'payment_mode' => $this->getPaymentMode($delivery)->getYandexKassaId()
				] + $this->getPrice($order->getDeliveryPrice());
		}

		/**
		 * @inheritDoc
		 * @return array
		 *
		 * [
		 *      'description' => Название товара,
		 *      'quantity' => Количество товара,
		 *      'vat_code' => id ставки НДС,
		 *      'amount' => $this->getPrice()
		 * ]
		 * @throws \Exception
		 */
		protected function getOrderItemInfo(\order $order, \orderItem $orderItem) {
			return [
					'description' => $this->prepareItemName($orderItem->getName()),
					'quantity' => $this->formatQuantity($orderItem->getAmount()),
					'vat_code' => (int) $this->getVat($orderItem)->getYandexKassaId(),
					'payment_subject' => $this->getPaymentSubject($orderItem)->getYandexKassaId(),
					'payment_mode' => $this->getPaymentMode($orderItem)->getYandexKassaId()
				] + $this->getPrice($this->getOrderItemPrice($order, $orderItem));
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
				$orderItemsCostsSum += (float) $orderItemData['amount']['value'] * $orderItemData['quantity'];
			}

			foreach ($orderItemList as $key => &$orderItem) {
				$totalOrderItemPrice = $orderItem['amount']['value'] * $orderItem['quantity'];
				$percentageOfCalculatedPrice = 100 / $orderItemsCostsSum * $totalOrderItemPrice;
				$percentageOfCalculatedPriceForOneItem = $percentageOfCalculatedPrice / $orderItem['quantity'];
				$priceToAppend = $priceDiff /  100 * $percentageOfCalculatedPriceForOneItem;
				$orderItem['amount']['value'] = round($orderItem['amount']['value'] + $priceToAppend, 2);
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
				$totalOrderItemPrice = $orderItem['amount']['value'] * $orderItem['quantity'];

				if ($totalOrderItemPrice > abs($priceDiff)) {
					$orderItem['amount']['value'] = $this->formatPrice(round($totalOrderItemPrice + $priceDiff, 2));
					$orderItem['description'] = getLabel('label-receipt-set-of-goods', 'emarket', $orderItem['description'], $orderItem['quantity']);
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
				$orderItemsCostsSum += (float) $orderItem['amount']['value'] * $orderItem['quantity'];
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

			$markup['description'] = getLabel('label-receipt-markup');
			$markup['quantity'] = $this->formatQuantity(1);
			$markup['vat_code'] = $orderItem['vat_code'];
			$markup['payment_subject'] = $orderItem['payment_subject'];
			$markup['payment_mode'] = $orderItem['payment_mode'];
			$markup['amount']['value'] = $this->formatPrice($price);
			$markup['amount']['currency'] = $orderItem['amount']['currency'];
			return $markup;
		}
	}
