<?php

	namespace UmiCms\Classes\Components\Emarket\Payment\PayOnline\Client;

	use Psr\Http\Message\RequestInterface;
	use UmiCms\Utils\Logger\iFactory as iLoggerFactory;
	use UmiCms\Classes\System\Utils\Api\Http\Json\Client;
	use UmiCms\Classes\Components\Emarket\Payment\Yandex\Client\Exception\Response\Error as ErrorResponse;
	use UmiCms\Classes\Components\Emarket\Payment\Yandex\Client\Exception\Response\Incorrect as IncorrectResponse;

	/**
	 * Класс клиента сервиса онлайн-фискализации интернет-платежей PayOnline
	 * @link https://payonline.ru/rel/doc/merchant/servis_onlajn-fiskalizacii_internet-platezhej.pdf
	 * @package UmiCms\Classes\Components\Emarket\Payment\PayOnline\Client
	 */
	class Fiscal extends Client implements iFiscal {

		/** @var string $merchantId идентификатор клиента сервиса */
		private $merchantId;

		/** @var string $privateSecurityKey приватный ключ безопасности сервиса */
		private $privateSecurityKey;

		/** @const string SERVICE_HOST адрес сервиса */
		const SERVICE_HOST = 'https://secure.payonlinesystem.com/Services/Fiscal/Request.ashx';

		/** @inheritDoc */
		public function __construct(iLoggerFactory $loggerFactory, \iConfiguration $configuration) {
			$this->initHttpClient()
				->initLogger($loggerFactory, $configuration);
		}

		/** @inheritDoc */
		public function setMerchantId($id) {
			$this->merchantId = $id;
			return $this;
		}

		/** @inheritDoc */
		public function setPrivateSecurityKey($key) {
			$this->privateSecurityKey = $key;
			return $this;
		}

		/**
		 * @inheritDoc
		 * @throws ErrorResponse
		 * @throws IncorrectResponse
		 */
		public function requestReceipt(\stdClass $request) {
			$request = $this->createPostRequest($request, [], [
				'MerchantId' => $this->getMerchantId(),
				'SecurityKey' => $this->getPublicSecurityKey($request),
			]);

			return $this->getResponse($request);
		}

		/**
		 * Возвращает публичный ключ безопасноити
		 * @param \stdClass $request данные запроса чека
		 * @return string
		 */
		private function getPublicSecurityKey(\stdClass $request) {
			$body = json_encode($request);
			$id = $this->getMerchantId();
			$privateKey = $this->getPrivateSecurityKey();
			$publicKey = sprintf('RequestBody=%s&MerchantId=%s&PrivateSecurityKey=%s', $body, $id, $privateKey);
			return md5($publicKey);
		}

		/** @inheritDoc */
		protected function getDefaultHeaders() {
			return [
				'Accept' => 'application/json',
				'Content-Type' => 'application/json'
			];
		}

		/** @inheritDoc */
		protected function getServiceUrl() {
			return $this->buildPath([
				self::SERVICE_HOST
			]);
		}

		/**
		 * @inheritDoc
		 * @throws ErrorResponse
		 * @throws IncorrectResponse
		 */
		protected function getResponse(RequestInterface $request) {
			$response = $this->send($request);
			$this->log($request, $response);

			try {
				$body = $this->getResponseBody($response);
			} catch (\Exception $exception) {
				throw new IncorrectResponse(sprintf('Incorrect response: %s', $response->getBody()->__toString()));
			}

			if (!isset($body['status']['code'], $body['status']['text'])) {
				throw new IncorrectResponse(sprintf('Incorrect response: %s', var_export($body, true)));
			}

			if ($body['status']['text'] !== 'OK') {
				throw new ErrorResponse(sprintf('%s: %s', $body['status']['code'], $body['status']['text']));
			}

			return $body;
		}

		/** @inheritDoc */
		protected function getLogDirectory() {
			return 'PayOnlineFiscalClient';
		}

		/**
		 * Возвращает идентификатор клиента сервиса
		 * @return string
		 */
		private function getMerchantId() {
			return $this->merchantId;
		}

		/**
		 * Возвращает приватный ключ безопасности сервиса
		 * @return string
		 */
		private function getPrivateSecurityKey() {
			return $this->privateSecurityKey;
		}
	}
