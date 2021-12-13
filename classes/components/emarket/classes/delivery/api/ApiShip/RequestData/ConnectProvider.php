<?php

	namespace UmiCms\Classes\Components\Emarket\Delivery\ApiShip\RequestData;

	use UmiCms\Classes\Components\Emarket\Delivery\ApiShip\iProvider;
	use UmiCms\Classes\Components\Emarket\Delivery\ApiShip\Utils\ArgumentsValidator;

	/**
	 * Данные запроса установления подключения к провайдеру (службе доставки)
	 * @package UmiCms\Classes\Components\Emarket\Delivery\ApiShip\RequestData
	 */
	class ConnectProvider implements iConnectProvider {

		/** @var int $companyId идентификатор компании пользователя ApiShip */
		private $companyId;

		/** @var string $providerKey идентификатор подключаемого провайдера */
		private $providerKey;

		/** @var iProvider $provider подключаемый провайдер */
		private $provider;

		/** @inheritDoc */
		public function __construct(array $data) {
			$this->import($data);
		}

		/** @inheritDoc */
		public function import(array $data) {
			ArgumentsValidator::arrayContainsValue($data, self::COMPANY_ID_KEY, __METHOD__, self::COMPANY_ID_KEY);
			$this->setCompanyId($data[self::COMPANY_ID_KEY]);

			ArgumentsValidator::arrayContainsValue($data, self::PROVIDER_ID_KEY, __METHOD__, self::PROVIDER_ID_KEY);
			$this->setProviderKey($data[self::PROVIDER_ID_KEY]);

			ArgumentsValidator::arrayContainsValue($data, self::PROVIDER_PARAMS_KEY, __METHOD__, self::PROVIDER_PARAMS_KEY);
			$this->setProvider($data[self::PROVIDER_PARAMS_KEY]);

			return $this;
		}

		/** @inheritDoc */
		public function export() {
			return [
				self::COMPANY_ID_KEY => $this->getCompanyId(),
				self::PROVIDER_ID_KEY => $this->getProviderKey(),
				self::PROVIDER_PARAMS_KEY => $this->getProvider()
					->getConnectRequestData(),
			];
		}

		/** @inheritDoc */
		public function setCompanyId($companyId) {
			ArgumentsValidator::notZeroInteger($companyId, self::COMPANY_ID_KEY, __METHOD__);
			$this->companyId = $companyId;
			return $this;
		}

		/** @inheritDoc */
		public function getCompanyId() {
			return $this->companyId;
		}

		/** @inheritDoc */
		public function setProviderKey($providerKey) {
			ArgumentsValidator::notEmptyString($providerKey, self::PROVIDER_ID_KEY, __METHOD__);
			$this->providerKey = $providerKey;
			return $this;
		}

		/** @inheritDoc */
		public function getProviderKey() {
			return $this->providerKey;
		}

		/** @inheritDoc */
		public function setProvider(iProvider $provider = null) {
			$this->provider = $provider;
			return $this;
		}

		/** @inheritDoc */
		public function getProvider() {
			return $this->provider;
		}
	}
