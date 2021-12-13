<?php

	namespace UmiCms\Classes\Components\Emarket\Payment\Yandex\Client;

	use Psr\Http\Message\RequestInterface;
	use Psr\Http\Message\ResponseInterface;
	use UmiCms\Utils\Logger\iFactory as iLoggerFactory;
	use UmiCms\Classes\System\Utils\Api\Http\Json\Client;
	use UmiCms\Classes\System\Utils\Api\Http\Exception\BadResponse;
	use UmiCms\Classes\Components\Emarket\Payment\Yandex\Client\Exception\Response\Incorrect;
	use UmiCms\Classes\Components\Emarket\Payment\Yandex\Client\Exception\Response\Error as ErrorResponse;
	use UmiCms\Classes\Components\Emarket\Payment\Yandex\Client\Exception\Response\Incorrect as IncorrectResponse;

	/**
	 * Класс клиента API Яндекс.Касса
	 * @link https://kassa.yandex.ru/docs/guides/
	 * @link https://yandex.ru/support/checkout/payments/api.html
	 * @link https://kassa.yandex.ru/docs/checkout-api/
	 * @package UmiCms\Classes\Components\Emarket\Payment\Yandex\Client
	 */
	class Kassa extends Client implements iKassa {

		/** @var string $shopId */
		private $shopId;

		/** @var string $secretKey */
		private $secretKey;

		/** @var string $idempotenceKey ключ идемпотентности */
		private $idempotenceKey;

		/** @const string SERVICE_HOST адрес сервиса */
		const SERVICE_HOST = 'https://api.yookassa.ru/';

		/** @const string SERVICE_VERSION версия API */
		const SERVICE_VERSION = 'v3';

		/**
		 * @const int DEFAULT_DELAY значение по умолчанию времени ожидания между запросами при отправке повторного
		 * запроса в случае получения ответа с HTTP статусом 202 в милисекундах
		 */
		const DEFAULT_DELAY = 1800;

		/** @const int ATTEMPTS_COUNT количество повторных запросов при ответе API со статусом 202 */
		const ATTEMPTS_COUNT = 3;

		/** @inheritDoc */
		public function __construct(iLoggerFactory $loggerFactory, \iConfiguration $configuration) {
			$this->initLogger($loggerFactory, $configuration)
				->setIdempotenceKey();
		}

		/** @inheritDoc */
		public function setAuth($shopId, $secretKey) : iKassa {
			return $this->setShopId($shopId)
				->setSecretKey($secretKey)
				->initHttpClient();
		}

		/** @inheritDoc, @internal  */
		public function setShopId($shopId) : iKassa {
			$this->shopId = $shopId;
			return $this;
		}

		/** @inheritDoc, @internal */
		public function setSecretKey($secretKey) : iKassa {
			$this->secretKey = $secretKey;
			return $this;
		}

		/**
		 * @inheritDoc
		 * @throws BadResponse
		 * @throws ErrorResponse
		 * @throws IncorrectResponse
		 */
		public function createPayment(array $request) : array {
			$request = $this->createPostRequest($request, ['payments']);
			$response = $this->getResponse($request);

			if (!isset($response['confirmation']['confirmation_url'], $response['id'])) {
				throw new IncorrectResponse('Confirmation url or id not received');
			}

			return $response;
		}

		/**
		 * @inheritDoc
		 * @throws BadResponse
		 * @throws ErrorResponse
		 * @throws IncorrectResponse
		 */
		public function approvePayment($id, array $request) : bool {
			$request = $this->createPostRequest($request, ['payments', $id, 'capture']);
			$response = $this->getResponse($request);

			if (!isset($response['status'])) {
				throw new IncorrectResponse('Status not received');
			}

			return $response['status'] === 'succeeded';
		}

		/**
		 * @inheritDoc
		 * @throws BadResponse
		 * @throws ErrorResponse
		 * @throws IncorrectResponse
		 */
		public function cancelPayment($id) : bool {
			$request = $this->createPostRequest([], ['payments', $id, 'cancel']);
			$response = $this->getResponse($request);

			if (!isset($response['status'])) {
				throw new IncorrectResponse('Status not received');
			}

			return $response['status'] === 'canceled';
		}

		/**
		 * @inheritDoc
		 * @throws BadResponse
		 * @throws ErrorResponse
		 * @throws IncorrectResponse
		 */
		public function refundPayment(array $request) : bool {
			$request = $this->createPostRequest($request, ['refunds']);
			$response = $this->getResponse($request);

			if (!isset($response['status'])) {
				throw new IncorrectResponse('Status not received');
			}

			return $response['status'] === 'succeeded';
		}

		/** @inheritDoc */
		protected function getServiceUrl() {
			return $this->buildPath([
				self::SERVICE_HOST,
				self::SERVICE_VERSION
			]);
		}

		/**
		 * @inheritDoc
		 * @throws BadResponse
		 * @throws ErrorResponse
		 */
		protected function getResponse(RequestInterface $request) {
			$response = $this->send($request);
			$this->log($request, $response);

			$attempts = self::ATTEMPTS_COUNT;

			while ($response->getStatusCode() === 202 && $attempts > 0) {
				$this->delay($response);
				$attempts--;
				$response = $this->send($request);
				$this->log($request, $response);
			}

			$body = $this->getResponseBody($response);

			if (isset($body['type']) && $body['type'] === 'error') {
				$errorMessage = $this->generateResponseErrorMessage($body);
				throw new ErrorResponse($errorMessage);
			}

			return $body;
		}

		/** @inheritDoc */
		protected function getDefaultHeaders() {
			return array_merge(parent::getDefaultHeaders(), [
				'Idempotence-Key' => $this->getIdempotenceKey(),
				'Authorization' => 'Basic ' . base64_encode($this->getShopId() . ':' . $this->getSecretKey())
			]);
		}

		/** @inheritDoc */
		protected function encodePostData($data) {
			return isEmptyArray($data) ? json_encode($data, JSON_FORCE_OBJECT) : parent::encodePostData($data);
		}
		/**
		 * Осуществляет задержку между повторными запросам
		 * @param ResponseInterface $response ответ на запрос
		 * @throws BadResponse
		 */
		private function delay(ResponseInterface $response) {
			$body = $this->getResponseBody($response);
			$delay = isset($body['retry_after']) ? $body['retry_after'] : self::DEFAULT_DELAY;
			usleep($delay * 1000);
		}

		/** @inheritDoc */
		protected function getLogDirectory() {
			return 'YandexKassaClient';
		}

		/**
		 * Возвращает идентификатор магазина
		 * @return string
		 */
		private function getShopId() {
			return $this->shopId;
		}

		/**
		 * Возвращает секретный ключ
		 * @return string
		 */
		private function getSecretKey() {
			return $this->secretKey;
		}

		/**
		 * Устанавливает ключ идемпотентности
		 * @param string|null $key ключ
		 * @return $this
		 */
		private function setIdempotenceKey($key = null) {
			$key = $key ?: uniqid('', true);
			$this->idempotenceKey = $key;
			return $this;
		}

		/**
		 * Возвращает ключ идемпотентности
		 * @return string
		 */
		private function getIdempotenceKey() {
			return $this->idempotenceKey;
		}

		/**
		 * Формирует сообщение об ошибке на основе ответа Яндекс.Кассы
		 * @param array $response ответ Яндекс.Кассы
		 * @return string
		 */
		private function generateResponseErrorMessage(array $response) : string {
			$code = $response['code'];
			$description = $response['description'];

			if ($code == 'invalid_request') {
				switch ($description) {
					case 'Incorrect amount. The amount must be less than or equal to the amount specified in the payment.': {
						return (string) getLabel('label-error-yandex-payment-incorrect-amount');
					}
					default: {
						return (string) getLabel('label-error-yandex-payment-invalid-request');
					}
				}
			} else if ($code == 'invalid_credentials') {
				return (string) getLabel('label-error-yandex-payment-incorrect-credentials');
			}

			return sprintf('%s : %s', $code, $description);
		}
	}
