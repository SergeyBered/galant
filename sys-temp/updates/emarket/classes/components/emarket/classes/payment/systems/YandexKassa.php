<?php

	use UmiCms\Service;
	use UmiCms\Classes\Components\Emarket\Serializer\iReceipt;
	use UmiCms\Classes\Components\Emarket\Payment\Yandex\Client\iKassa;
	use UmiCms\Classes\Components\Emarket\Serializer\Receipt\YandexKassa4;

	/**
	 * Способ оплаты через платежную систему "Яндекс.Касса" версии 4
	 * @link https://kassa.yandex.ru/docs/guides/
	 * @link https://yandex.ru/support/checkout/payments/api.html
	 * @link https://kassa.yandex.ru/docs/checkout-api/
	 */
	class YandexKassaPayment extends payment {

		/** @var string EVENT_PAYMENT_CANCELED событие Яндекс.Касса платеж отменен  */
		const EVENT_PAYMENT_CANCELED = 'payment.canceled';

		/** @var string EVENT_PAYMENT_CANCELED событие Яндекс.Касса платеж оплачен  */
		const EVENT_PAYMENT_SUCCEEDED = 'payment.succeeded';

		/** @var string EVENT_PAYMENT_CANCELED событие Яндекс.Касса платеж ожидает подтверждения  */
		const EVENT_PAYMENT_WAITING_FOR_CAPTURE = 'payment.waiting_for_capture';

		/** @var string EVENT_PAYMENT_CANCELED событие Яндекс.Касса возврат средств произвенен  */
		const EVENT_REFUND_SUCCEEDED = 'refund.succeeded';

		/** @inheritDoc */
		public static function getOrderId() {
			$rawRequest = Service::Request()
				->getRawBody();
			$request = json_decode($rawRequest, true);

			if (!is_array($request) || !isset($request['object']['id'])) {
				return false;
			}

			$paymentId = $request['object']['id'];

			//todo: сделать репозиторий заказов и отрефакторить класс order
			$orderQuery = new selector('objects');
			$orderQuery->types('object-type')->guid('emarket-order');
			$orderQuery->where('payment_document_num')->equals($paymentId);
			$orderQuery->option('no-length', true);
			$orderQuery->option('return', 'id');
			$orderQuery->limit(0, 1);
			$orderId = $orderQuery->result();

			if (empty($orderId)) {
				return false;
			}

			return (int) $orderId[0]['id'];
		}

		/**
		 * @inheritDoc
		 * Создает платеж и возвращает адрес, куда необходимо отправиться пользователю.
		 * Устанавливает заказу статус оплаты "Инициализирована".
		 */
		public function process($template = null) {
			$order = $this->order;
			$request = $this->getPaymentData($order);
			$response = $this->getClient()
				->createPayment($request);

			$order->setPaymentDocumentNumber($response['id']);
			$order->order();
			$order->setPaymentStatus('initialized', true);

			list($templateString) = emarket::loadTemplates(
				'emarket/payment/yandex4/' . $template,
				'form_block'
			);

			$templateData = [
				'url' => $response['confirmation']['confirmation_url']
			];

			return emarket::parseTemplate($templateString, $templateData);
		}

		/**
		 * @inheritDoc
		 * Получает запрос от Яндекс.Касса и валидирует параметры платежа.
		 * В зависимости от результата валидации отправляет запрос на подтверждение или отклонение платежа.
		 * Устанавливает заказу статус оплаты "Проверена" или "Отклонена".
		 */
		public function poll() {
			$rawRequest = Service::Request()
				->getRawBody();
			$request = json_decode($rawRequest, true);

			if (!is_array($request) || !isset($request['object']['amount']['value'])) {
				throw new \expectObjectException(getLabel('error-unexpected-exception'));
			}

			$order = $this->order;
			$paymentId = $order->getPaymentDocumentNumber();
			$client = $this->getClient();
			$requestObject = $request['object'];
			$event = $request['event'];
			$wasPriceNotFullyPaid = $order->getActualPrice() != $requestObject['amount']['value'];

			if ($wasPriceNotFullyPaid) {

				if ($client->cancelPayment($paymentId)) {
					$order->setPaymentStatus('declined');
				}

			} elseif ($event === self::EVENT_PAYMENT_CANCELED) {

				$order->setPaymentStatus('declined');

			} elseif ($event === self::EVENT_PAYMENT_WAITING_FOR_CAPTURE) {

				$order->setPaymentStatus('waiting_confirmation');

			} elseif ($event === self::EVENT_PAYMENT_SUCCEEDED) {

				$order->setPaymentStatus('accepted');

			} elseif ($event === self::EVENT_REFUND_SUCCEEDED) {

				$order->setPaymentStatus('refund');
			}

			$order->commit();

			$buffer = Service::Response()
				->getCurrentBuffer();
			$buffer->clear();
			$buffer->contentType('text/plain');
			$buffer->push('200 OK for Yandex.Kassa');

			return $buffer;
		}

		/**
		 * @inheritDoc
		 * @return string
		 * @throws ErrorException
		 * @throws coreException
		 * @throws publicException
		 */
		public function approvePayment() : string {
			if (!$this->order instanceof order) {
				throw new ErrorException('You should pass order to class constructor');
			}

			$order = $this->order;
			$request = $this->getPaymentData($order);
			$paymentId = $order->getPaymentDocumentNumber();

			if ($this->getClient()->approvePayment($paymentId, $request)) {
				$order->setPaymentStatus('accepted');
				$order->commit();
				return (string) getLabel('label-success-yandex-payment-approve');
			}

			return (string) getLabel('label-error-yandex-payment-approve');
		}

		/**
		 * @inheritDoc
		 * @return string
		 * @throws ErrorException
		 * @throws publicException
		 */
		public function cancelPayment() : string {
			if (!$this->order instanceof order) {
				throw new ErrorException('You should pass order to class constructor');
			}

			$order = $this->order;
			$paymentId = $order->getPaymentDocumentNumber();

			try {
				if ($this->getClient()->cancelPayment($paymentId)) {
					$order->setPaymentStatus('declined');
					$order->commit();
					return (string) getLabel('label-success-yandex-payment-cancel');
				}
			} catch (Exception $exception) {
				if (contains($exception->getMessage(), 'You can only cancel payments with the waiting_for_capture')) {
					return (string) getLabel('label-error-yandex-payment-cancel-bad-status');
				}

				throw $exception;
			}

			return (string) getLabel('label-error-yandex-payment-cancel');
		}

		/**
		 * @inheritDoc
		 * @return string
		 * @throws ErrorException
		 * @throws coreException
		 * @throws publicException
		 */
		public function refundPayment() : string {
			if (!$this->order instanceof order) {
				throw new ErrorException('You should pass order to class constructor');
			}

			$order = $this->order;
			$amount = $this->getSerializer()
				->getPrice($order->getActualPrice());
			$amount['payment_id'] = $order->getPaymentDocumentNumber();

			if ($this->getClient()->refundPayment($amount)) {
				$order->setPaymentStatus('refund');
				$order->commit();
				return (string) getLabel('label-success-yandex-payment-refund');
			}

			return (string) getLabel('label-error-yandex-payment-refund');
		}

		/**
		 * Возвращает данные платежа заказа
		 * @param order $order Заказ
		 * @return array
		 * @throws coreException
		 * @throws publicException
		 */
		protected function getPaymentData(order $order) {
			$serializer = $this->getSerializer();

			$url = $this->isOpenPaymentResultWaitingPage()
				? YandexKassa4::RESULT_URL_WAIT
				: YandexKassa4::RESULT_URL_SUCCESSFUL;

			$serializer->setReturnUrl($url);

			$data = $serializer->getPrice($order->getActualPrice());
			$data += $serializer->getCapture($this);
			$data += $serializer->getConfirmation();

			if ($this->isNeedReceiptInfo()) {
				$data += $serializer->getReceipt($order);
			}

			return $data;
		}

		/**
		 * Возвращает клиента для интеграции
		 * @return iKassa
		 * @throws publicException
		 */
		protected function getClient() {
			$object = $this->object;
			$shopId = (string) $object->getValue('shop_id');
			$secretKey = (string) $object->getValue('secret_key');

			if ($shopId === '' || $secretKey === '') {
				throw new publicException(getLabel('error-payment-wrong-settings'));
			}

			/** @var iKassa $client */
			$client = Service::getNew('YandexKassaClient');
			return $client->setAuth($shopId, $secretKey)
				->setKeepLog($this->isNeedKeepLog());
		}

		/**
		 * Возвращает сериализатор
		 * @return YandexKassa4|iReceipt
		 */
		protected function getSerializer() {
			return $this->getSerializerReceiptFactory()
				->create('YandexKassa4');
		}

		/**
		 * Определяет открывать ли страницу ожидания результата оплаты
		 * @return bool
		 */
		private function isOpenPaymentResultWaitingPage() {
			return (bool) $this->getObject()->getValue('open_the_payment_result_waiting_page');
		}
	}
