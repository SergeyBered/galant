<?php

	namespace UmiCms\Classes\Components\Emarket\Delivery\ApiShip;

	use UmiCms\Service;
	use GuzzleHttp\Client as HttpClient;
	use Psr\Http\Message\RequestInterface;
	use UmiCms\Utils\Logger\iFactory as iLoggerFactory;
	use UmiCms\Classes\System\Utils\Api\Http\Exception\BadResponse;
	use UmiCms\Classes\System\Utils\Api\Http\Json\Client as JsonClient;
	use UmiCms\Classes\Components\Emarket\Delivery\ApiShip\RequestData;
	use UmiCms\Classes\Components\Emarket\Delivery\ApiShip\Enums\ProvidersKeys;
	use UmiCms\Classes\Components\Emarket\Delivery\ApiShip\Utils\ArgumentsValidator;

	/**
	 * Класс запросов к сервису ApiShip
	 * @package UmiCms\Classes\Components\Emarket\Delivery\ApiShip
	 */
	class RequestSender extends JsonClient implements iRequestSender {

		/** @var string $authToken авторизационный токен */
		private $authToken;

		/** @var int $tokenExpireTimestamp время когда авторизационный токен перестанет быть действительным */
		private $tokenExpireTimestamp;

		/** @var string $login логин для авторизации */
		private $login;

		/** @var string $login пароль для авторизации */
		private $password;

		/** @var bool $devModeStatus включен ли режим разработки */
		private $devModeStatus = false;

		/**
		 * @inheritDoc
		 * @throws \publicAdminException
		 */
		public function __construct(
			$login, $password, $devMode = false, $keepLog = false, iLoggerFactory $loggerFactory = null, \iConfiguration $configuration = null
		) {
			$loggerFactory ?: Service::get('LoggerFactory');
			$configuration ?: Service::Configuration();
			$keepLog = $keepLog || $configuration->get('debug', 'enabled');
			$this->setDevModeStatus($devMode)
				->setKeepLog($keepLog)
				->setLogin($login)
				->setPassword($password)
				->initHttpClient()
				->initLogger($loggerFactory, $configuration);
		}

		/**
		 * @inheritDoc
		 * @throws BadResponse
		 * @throws \publicAdminException
		 */
		public function requestAccessToken() {
			$postData = [
				'login' => $this->getLogin(),
				'password' => $this->getPassword(),
			];

			$request = $this->createPostRequest($postData, ['login'], [], parent::getDefaultHeaders());
			$response = $this->getResponse($request);

			if (isset($response['code'])) {
				$this->throwErrorResponse($response);
			}

			ArgumentsValidator::arrayContainsValue($response, 'accessToken', __METHOD__, 'accessToken');
			ArgumentsValidator::arrayContainsValue($response, 'expires', __METHOD__, 'expires');

			$date = \DateTime::createFromFormat(\DateTime::W3C, $response['expires']);
			$this->setTokenExpireTimestamp($date->getTimestamp());
			$this->setAuthToken($response['accessToken']);

			return $response;
		}

		/**
		 * @inheritDoc
		 * @throws BadResponse
		 */
		public function getDeliveryProvidersList() {
			$request = $this->createGetRequest(['lists', 'providers']);
			return $this->getResponse($request);
		}

		/**
		 * @inheritDoc
		 * @throws BadResponse
		 */
		public function getDeliveryPointsList($pointId = null, $providerKey = null, $cityName = null, $typeId = null) {
			$filter = [];

			if ($pointId !== null) {
				$filter[] = "id=$pointId";
			}

			if ($providerKey !== null) {
				$filter[] = "providerKey=$providerKey";
			}

			if ($cityName !== null) {
				$filter[] = "city=$cityName";
			}

			if ($typeId !== null) {
				$filter[] = "availableOperation=$typeId";
			}

			$query = [
				'limit' => 1000
			];

			if (count($filter) > 0) {
				$query['filter'] = implode(';', $filter);
			}

			$request = $this->createGetRequest(['lists', 'points'], $query);
			return $this->getResponse($request);
		}

		/**
		 * @inheritDoc
		 * @throws BadResponse
		 */
		public function getProviderTariffsList($providerKey) {
			$query = [
				'filter' => 'providerKey=' . $providerKey,
				'limit' => 100
			];

			$request = $this->createGetRequest(['lists', 'tariffs'], $query);
			return $this->getResponse($request);
		}

		/**
		 * @inheritDoc
		 * @throws BadResponse
		 */
		public function calculate(RequestData\iCalculateDeliveryCost $calculateRequest) {
			$request = $this->createPostRequest($calculateRequest->export(), ['calculator']);
			return $this->getResponse($request);
		}

		/**
		 * @inheritDoc
		 * @throws BadResponse
		 * @throws \publicAdminException
		 */
		public function order(RequestData\iSendOrder $orderRequest) {
			$request = $this->createPostRequest($orderRequest->export(), ['orders']);
			$response = $this->getResponse($request);

			if (isset($response['code'])) {
				$this->throwErrorResponse($response);
			}

			return $response;
		}

		/**
		 * @inheritDoc
		 * @throws BadResponse
		 * @throws \publicAdminException
		 */
		public function orderModify($apiShipOrderId, RequestData\iSendOrder $orderRequest) {
			$request = $this->createPutRequest($orderRequest->export(), ['orders', $apiShipOrderId]);
			$response = $this->getResponse($request);

			if (isset($response['code'])) {
				$this->throwErrorResponse($response);
			}

			return $response;
		}

		/**
		 * @inheritDoc
		 * @throws BadResponse
		 * @throws \publicAdminException
		 */
		public function cancelOrder($orderNumber) {
			$this->validateOrderNumber($orderNumber);
			$request = $this->createGetRequest(['orders', $orderNumber, 'cancel']);
			return $this->getResponse($request);
		}

		/**
		 * @inheritDoc
		 * @throws BadResponse
		 * @throws \publicAdminException
		 */
		public function getOrdersStatuses(array $ordersNumbers) {
			$postData = [
				'orderIds' => array_map([$this, 'validateOrderNumber'], $ordersNumbers)
			];

			$request = $this->createPostRequest($postData, ['orders', 'statuses']);
			$response = $this->getResponse($request);

			if (isset($response['code'])) {
				$this->throwErrorResponse($response);
			}

			return $response;
		}

		/**
		 * @inheritDoc
		 * @throws BadResponse
		 */
		public function getOrdersLabels(array $ordersNumbers) {
			$postData = [
				'orderIds' => array_map([$this, 'validateOrderNumber'], $ordersNumbers),
				'format' => 'pdf'
			];

			$request = $this->createPostRequest($postData, ['orders', 'labels']);
			return $this->getResponse($request);
		}

		/**
		 * @inheritDoc
		 * @throws BadResponse
		 */
		public function getOrdersWaybills(array $ordersNumbers) {
			$postData = [
				'orderIds' => array_map([$this, 'validateOrderNumber'], $ordersNumbers)
			];

			$request = $this->createPostRequest($postData, ['orders', 'waybills']);
			return $this->getResponse($request);
		}

		/**
		 * @inheritDoc
		 * @throws BadResponse
		 */
		public function getCurrentUserData() {
			$request = $this->createGetRequest(['frontend', 'users', 'me']);
			return $this->getResponse($request);
		}

		/**
		 * @inheritDoc
		 * @throws BadResponse
		 */
		public function connectToProvider(RequestData\iConnectProvider $providerConnectionRequest) {
			$request = $this->createPostRequest($providerConnectionRequest->export(), ['frontend', 'providers', 'params']);
			return $this->getResponse($request);
		}

		/**
		 * @inheritDoc
		 * @throws BadResponse
		 * @throws \publicAdminException
		 */
		public function updateProviderConnection(ProvidersKeys $key, RequestData\iConnectProvider $providerConnectionRequest) {
			$connectionId = $this->getConnectionIdByProvider($key);
			$request = $this->createPutRequest($providerConnectionRequest->export(), ['frontend', 'providers', 'params', $connectionId]);
			$result = $this->getResponse($request);

			if (isset($result['code'])) {
				$this->throwErrorResponse($result);
			}

			return $result;
		}

		/**
		 * Возвращает идентификатор подключения провайдера
		 * @param ProvidersKeys $key ключ подключенного провайдера
		 * @return int
		 * @throws BadResponse
		 * @throws \publicAdminException
		 */
		private function getConnectionIdByProvider(ProvidersKeys $key) {
			$connectedProvidersData = $this->getConnectedProviders();
			$errorFormat = getLabel('label-api-ship-error-provider-not-connected', self::I18N_PATH);

			if (!arrayValueContainsNotEmptyArray($connectedProvidersData, 'rows')) {
				throw new \publicAdminException(
					sprintf($errorFormat, (string) $key)
				);
			}

			foreach ($connectedProvidersData['rows'] as $row) {
				if (!is_array($row) || !isset($row['providerKey'], $row['id']) || $row['providerKey'] != (string) $key) {
					continue;
				}

				return (int) $row['id'];
			}

			throw new \publicAdminException(
				sprintf($errorFormat, (string) $key)
			);
		}

		/**
		 * Возвращает данные подключенных провайдеров
		 * @return array|bool|float|int|string
		 * @throws BadResponse
		 */
		private function getConnectedProviders() {
			$request = $this->createGetRequest(['frontend', 'providers', 'params']);
			return $this->getResponse($request);
		}

		/**
		 * Регистрирует пользователя в ApiShip
		 * @param string $login логин пользователя
		 * @param string $password пароль пользователя
		 * @return bool
		 * @throws \publicAdminException
		 */
		public function register($login, $password) {
			$this->validateUserLogin($login);
			$this->validateUserPassword($password);

			$postData = [
				'login' => $login,
				'password' => $password
			];

			$httpClient = new HttpClient([
				'http_errors' => false,
				'decode_content' => false,
				'verify' => false,
			]);

			try {
				$response = $httpClient->request('POST', self::REGISTER_HOST, [
					'form_params' => $postData
				]);
				$request = $this->createPostRequest($postData, [], [], []);
				$this->log($request, $response);
				$body = $response->getBody()->__toString();
				$result = $this->parseXml($body);
				$resultNodes = $result->xpath('/response');

				if (!(is_array($resultNodes) && umiCount($resultNodes) > 0)) {
					throw new \publicAdminException(
						getLabel('label-api-ship-cant-register-user', self::I18N_PATH)
					);
				}
				/** @var \SimpleXMLElement $resultNode */
				$resultNode = array_shift($resultNodes);
				$resultStatuses = $resultNode->xpath('result');
				$resultStatus = (string) array_shift($resultStatuses);
				$isSuccessStatus = $resultStatus == 'success';
				$isErrorStatus = $resultStatus == 'error';

				if (!$isSuccessStatus && !$isErrorStatus) {
					$exceptionMessage = sprintf(getLabel('label-api-ship-error-unsupported-register-result'), $resultStatus);
					throw new \publicAdminException($exceptionMessage);
				}

				if ($isErrorStatus) {
					$resultMessages = $resultNode->xpath('message');
					$resultMessage = (string) array_shift($resultMessages);
					throw new \publicAdminException($resultMessage);
				}

				return true;
			} catch (\Exception $e) {
				throw new \publicAdminException($e->getMessage());
			}
		}

		/**
		 * @inheritDoc
		 * @throws BadResponse
		 * @throws \publicAdminException
		 */
		protected function getDefaultHeaders() {
			return array_merge(parent::getDefaultHeaders(), [
				'Authorization' => $this->getAuthToken(),
				'platform' => 'umi'
			]);
		}

		/**
		 * Возвращает имя директории с логом
		 * @return string
		 */
		protected function getLogDirectory() {
			return 'ApiShip';
		}

		/** @inheritDoc */
		protected function getServiceUrl() {
			return $this->buildPath([
				$this->getDevModeStatus() ? self::DEV_SERVICE_HOST : self::SERVICE_HOST,
				self::SERVICE_VERSION
			]);
		}

		/**
		 * Устанавливает логин для подключения к сервису ApiShip
		 * @param string $login логин
		 * @return RequestSender
		 * @throws \publicAdminException
		 */
		private function setLogin($login) {
			if ($this->getDevModeStatus()) {
				$this->login = self::DEV_MODE_LOGIN;
			} else {
				$this->validateUserLogin($login);
				$this->login = $login;
			}
			return $this;
		}

		/**
		 * Устанавливает пароль для подключения к сервису ApiShip
		 * @param string $password пароль
		 * @return RequestSender
		 * @throws \publicAdminException
		 */
		private function setPassword($password) {
			if ($this->getDevModeStatus()) {
				$this->password = self::DEV_MODE_PASSWORD;
			} else {
				$this->validateUserPassword($password);
				$this->password = $password;
			}
			return $this;
		}

		/**
		 * Устанавливает статус режима разработки
		 * @param bool $status вкл/выкл
		 * @return RequestSender
		 */
		private function setDevModeStatus($status) {
			$this->devModeStatus = (bool) $status;
			return $this;
		}

		/**
		 * Возвращает статус режима разработки
		 * @return bool
		 */
		private function getDevModeStatus() {
			return $this->devModeStatus;
		}

		/**
		 * @inheritDoc
		 * @throws BadResponse
		 */
		protected function getResponse(RequestInterface $request) {
			$response = $this->send($request);
			$this->log($request, $response);
			return $this->getResponseBody($response);
		}

		/**
		 * Возвращает авторизационный токен
		 * @return string
		 * @throws BadResponse
		 * @throws \publicAdminException
		 */
		private function getAuthToken() {
			if ($this->authToken === null || time() > $this->getTokenExpireTimestamp()) {
				$this->requestAccessToken();
			}

			return $this->authToken;
		}

		/**
		 * Возвращает логин для авторизации
		 * @return string
		 */
		private function getLogin() {
			return $this->login;
		}

		/**
		 * Возвращает пароль для авторизации
		 * @return string
		 */
		private function getPassword() {
			return $this->password;
		}

		/**
		 * Устанавливает авторизационный токен
		 * @param string $authToken авторизационный токен
		 */
		private function setAuthToken($authToken) {
			$this->authToken = $authToken;
		}

		/**
		 * Устанавливает время инвалидации авторизационного токена
		 * @param int $timestamp время в формате unix timestamp
		 */
		private function setTokenExpireTimestamp($timestamp) {
			$this->tokenExpireTimestamp = $timestamp;
		}

		/**
		 * Возвращает время инвалидации авторизационного токена
		 * @return int
		 */
		private function getTokenExpireTimestamp() {
			return $this->tokenExpireTimestamp;
		}

		/**
		 * Формирует сообщение об ошибке на основе данных ответа на запрос к сервису ApiShip и бросает исключение
		 * @param array $result данные ответа на запрос к сервису ApiShip
		 * @throws \publicAdminException
		 */
		private function throwErrorResponse(array $result) {
			$errorMessage = '';
			$code = isset($result['code']) ? $result['code'] : null;
			$title = isset($result['message']) ? $result['message'] : null;
			$moreInfo = isset($result['errors']) ? $result['errors'] : null;

			if ($code !== null) {
				$errorMessage .= $code . ' ';
			}

			if ($title !== null) {
				$errorMessage .= $title . ': ';
			}

			$errorInfo = '';

			if (is_array($moreInfo)) {
				foreach ($moreInfo as $info) {
					if (!isset($info['message'])) {
						continue;
					}

					$errorInfo .= ' ' . $info['message'] . PHP_EOL;
				}
			}

			$errorMessage .= $errorInfo;

			throw new \publicAdminException($errorMessage);
		}

		/**
		 * Валидирует длину строки
		 * @param string $value строка
		 * @param int $minLength минимальная длина
		 * @param int $maxLength максимальная длина
		 * @param string $fieldName имя поля, которое хранит эту строку
		 * @return mixed
		 * @throws \publicAdminException
		 */
		private function validateString($value, $minLength, $maxLength, $fieldName) {
			ArgumentsValidator::stringWithLengthBetween($value, $fieldName, '', $minLength, $maxLength);
			return $value;
		}

		/**
		 * Валидирует логин пользователя для регистрации
		 * @param string $login логин
		 * @return mixed
		 * @throws \publicAdminException
		 */
		private function validateUserLogin($login) {
			return $this->validateString($login, 5, 30, 'login');
		}

		/**
		 * Валидирует пароль пользователя для регистрации
		 * @param string $password пароль
		 * @return mixed
		 * @throws \publicAdminException
		 */
		private function validateUserPassword($password) {
			return $this->validateString($password, 8, 30, 'password');
		}

		/**
		 * Валидирует номер заказа ApiShip
		 * @param int $orderId идентификатор заказа
		 * @return mixed
		 * @throws \publicAdminException
		 */
		private function validateOrderNumber($orderId) {
			ArgumentsValidator::notZeroInteger($orderId, 'orderId', __METHOD__);
			return $orderId;
		}
	}
