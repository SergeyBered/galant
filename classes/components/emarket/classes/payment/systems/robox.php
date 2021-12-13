<?php

	use UmiCms\Classes\Components\Emarket\Serializer\iReceipt;
	use UmiCms\Classes\Components\Emarket\Serializer\Receipt\RoboKassa as Serializer;
	use UmiCms\Service;

	/** Способ оплаты через платежную систему "Robokassa" */
	class roboxPayment extends payment {

		/** @const string REQUEST_URL адрес для запросов к Robokassa */
		const REQUEST_URL = 'https://auth.robokassa.ru/Merchant/Index.aspx';

		/** @const int MAX_ORDER_ITEM_NAME_LENGTH максимальная длина названия товара (0 - первый символ) */
		const MAX_ORDER_ITEM_NAME_LENGTH = 63;

		/** @const string[] CURRENCIES поддерживаемые валюты, информацию о которых нужно передавать (информация о российском рубле не передаётся) */
		const CURRENCIES = ['USD', 'EUR', 'KZT'];

		/** @inheritDoc */
		public static function getOrderId() {
			return (int) getRequest('shp_orderId');
		}

		/**
		 * @inheritDoc
		 * Устанавливает заказу статус оплаты "Инициализирована"
		 */
		public function process($template = null) {
			$object = $this->object;
			$login = (string) $object->getValue('login');
			$password = (string) $object->getValue('password1');
			$testMode = (int) $object->getValue('test_mode');

			if ($login === '' || $password === '') {
				throw new publicException(getLabel('error-payment-wrong-settings'));
			}

			$order = $this->order;
			$orderPrice = $this->formatPrice($order->getActualPrice());
			$orderId = $order->getId();
			$needToSendReceipt = (bool) $this->isNeedReceiptInfo();
			$receiptInfo = $needToSendReceipt ? $this->getReceiptInfo($order) : '';
			$currency = $this->getCurrencyCode();

			$signatureParts = [
				$login,
				$orderPrice,
				$orderId
			];

			$needToAddCurrencyInfo = (!$this->isRubleCurrency() && $this->isSupportedCurrency());

			if ($needToAddCurrencyInfo) {
				$signatureParts[] = $currency;
			}

			if ($needToSendReceipt) {
				$signatureParts[] = $receiptInfo;
			}

			$signatureParts = array_merge($signatureParts, [
				$password,
				"shp_orderId=$orderId"
			]);

			$signature = $this->glueSignature($signatureParts);
			$languagePrefix = Service::LanguageDetector()->detectPrefix();

			$templateData = [
				'formAction' => self::REQUEST_URL,
				'MrchLogin' => $login,
				'OutSum' => $orderPrice,
				'InvId' => $orderId,
				'Desc' => "Payment for order $orderId",
				'SignatureValue' => $signature,
				'IncCurrLabel' => '',
				'Culture' => mb_strtolower($languagePrefix),
				'shp_orderId' => $orderId,
				'IsTest' => $testMode
			];

			if ($needToAddCurrencyInfo) {
				$templateData['OutSumCurrency'] = $currency;
			}

			if ($needToSendReceipt) {
				$templateData['Receipt'] = $receiptInfo;
			}

			$order->order();
			$order->setPaymentStatus('initialized', true);

			list($templateString) = emarket::loadTemplates(
				'emarket/payment/robokassa/' . $template,
				'form_block'
			);

			return emarket::parseTemplate($templateString, $templateData);
		}

		/**
		 * Валидирует заказ платежной системы.
		 * Если заказа валиден - заказу в UMI.CMS
		 * устанавливается номер платежного документа
		 * и статус оплаты "Принята".
		 * @throws coreException
		 */
		public function poll() {
			$orderPrice = (string) getRequest('OutSum');
			$invoiceId = (string) getRequest('InvId');
			$requestSignature = (string) getRequest('SignatureValue');
			$orderId = (string) getRequest('shp_orderId');

			$object = $this->object;
			$password = (string) $object->getValue('password2');

			$signature = $this->glueSignature([
				$orderPrice,
				$invoiceId,
				$password,
				"shp_orderId=$orderId"
			]);

			$isCorrectSignature = Service::Protection()->hashEquals(strtoupper($signature), $requestSignature);
			$order = $this->order;
			$isCorrectOrderPrice = (float) $order->getActualPrice() == (float) $orderPrice;

			$buffer = Service::Response()
				->getCurrentBuffer();
			$buffer->clear();
			$buffer->contentType('text/plain');

			if (!$isCorrectSignature || !$isCorrectOrderPrice) {
				$order->setPaymentStatus('declined');
				$buffer->push('failed');

				return $buffer;
			}

			$order->setPaymentStatus('accepted');
			$order->setPaymentDocumentNumber($invoiceId);
			$order->commit();

			$buffer->push("OK{$invoiceId}");

			return $buffer;
		}

		/** @inheritDoc */
		public function isSuitable(order $order): bool {
			$isSuitable = parent::isSuitable($order);
			if (!$isSuitable) {
				return false;
			}

			if (!$this->isRubleCurrency() && !$this->isSupportedCurrency()) {
				return false;
			}

			$price = $order->getActualPrice();
			if ($price <= 0) {
				return false;
			}

			return true;
		}

		/**
		 * Склеивает подпись (контрольный параметр)
		 * @param string[] $parts части подписи
		 * @return string
		 */
		protected function glueSignature(array $parts) {
			$signature = implode(':', $parts);
			return md5($signature);
		}

		/**
		 * Возвращает данные для печати чека.
		 * @link https://docs.robokassa.ru/#6865
		 * @param order $order $order заказ
		 * @return string json
		 * @throws publicException
		 */
		protected function getReceiptInfo(order $order) {
			$receiptInfo = $this->getSerializer()
				->getOrderItemInfoList($order);

			if (!is_array($receiptInfo)) {
				throw new publicException(getLabel('error-payment-wrong-receipt-info'));
			}

			return urlencode(json_encode($receiptInfo));
		}

		/**
		 * Возвращает сериализатор
		 * @return Serializer|iReceipt
		 * @throws Exception
		 */
		protected function getSerializer() {
			return $this->getSerializerReceiptFactory()
				->create('RoboKassa');
		}

		/**
		 * Определяет, поддерживается ли валюта платежной системой
		 * @return bool
		 * @throws coreException
		 * @throws privateException
		 */
		private function isSupportedCurrency() : bool {
			$currency = $this->getCurrencyCode();
			return in_array(strtoupper($currency), self::CURRENCIES);
		}

		/**
		 * Определяет, является ли валюта российским рублем
		 * @return bool
		 * @throws coreException
		 * @throws privateException
		 */
		private function isRubleCurrency() : bool {
			$currency = $this->getCurrencyCode();
			return in_array(strtoupper($currency), ['RUR', 'RUB']);
		}
	}
