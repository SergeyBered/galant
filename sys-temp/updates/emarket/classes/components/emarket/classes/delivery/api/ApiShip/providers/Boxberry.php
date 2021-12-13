<?php

	namespace UmiCms\Classes\Components\Emarket\Delivery\ApiShip\Providers;

	use UmiCms\Classes\Components\Emarket\Delivery\ApiShip;

	/**
	 * Служба доставки Boxberry
	 * @package UmiCms\Classes\Components\Emarket\Delivery\ApiShip\Providers
	 */
	class Boxberry extends ApiShip\Provider {

		/** @var string $token авторизационный токен */
		private $token;

		/** @var bool $isNewUrlUsed используется ли адрес нового кабинета */
		private $isNewUrlUsed = false;

		/** @const string KEY идентификатор провайдера */
		const KEY = 'boxberry';

		/** @const string TOKEN_KEY ключ настроек провайдера с авторизационным токеном */
		const TOKEN_KEY = 'token';

		/** @const string TOKEN_TITLE расшифровка поля $token */
		const TOKEN_TITLE = 'Уникальный ключ (API-token) для авторизации';

		/** @const string URL_KEY ключ настроек провайдера с тип адреса личного кабинета */
		const URL_KEY = 'url';

		/** @const string URL_TITLE расшифровка поля $isNewUrlUsed  */
		const URL_TITLE = 'Используется ли новый личный кабинет (account.boxberry.ru).';

		/** @inheritDoc */
		public function import(array $data) {
			$valueRequired = true;

			try {
				$this->setToken(
					$this->getPropertyValue($data, self::TOKEN_KEY, $valueRequired)
				);
			} catch (\wrongParamException $e) {
				throw new \wrongParamException(
					$this->getEmptySettingParamErrorMessage(self::TOKEN_TITLE)
				);
			}

			if ($this->issetPropertyValue($data, self::URL_KEY)) {
				$this->setNewUrlIsUsed(
					$this->getPropertyValue($data, self::URL_KEY)
				);
			}

			parent::import($data);
		}

		/** @inheritDoc */
		public function export() {
			$data = [
				self::TOKEN_KEY => [
					self::DESCRIPTION_KEY => self::TOKEN_TITLE,
					self::TYPE_KEY => self::STRING_TYPE_KEY,
					self::REQUIRED_KEY => true,
					self::VALUE_KEY => $this->getToken()
				],
				self::URL_KEY => [
					self::DESCRIPTION_KEY => self::URL_TITLE,
					self::TYPE_KEY => self::BOOL_TYPE_KEY,
					self::VALUE_KEY => $this->isNewUrlUsed()
				]
			];

			return array_merge($data, parent::export());
		}

		/** @inheritDoc */
		public function getConnectRequestData() {
			return [
				self::TOKEN_KEY => $this->getToken(),
				self::URL_KEY => $this->isNewUrlUsed()
			];
		}

		/** @inheritDoc */
		public function getKey() {
			return self::KEY;
		}

		/** @inheritDoc */
		public function getAllowedDeliveryTypes() {
			return [
				$this->getDeliveryTypeIdToDoor(),
				$this->getDeliveryTypeIdToPoint()
			];
		}

		/** @inheritDoc */
		public function getAllowedPickupTypes() {
			return [
				$this->getPickupTypeIdFromPoint()
			];
		}

		/**
		 * Устанавливает авторизационный токен
		 * @param string $token авторизационный токен
		 * @return Boxberry
		 */
		public function setToken($token) {
			$this->validateStringField($token, self::TOKEN_TITLE);
			$this->token = $token;
			return $this;
		}

		/**
		 * Возвращает авторизационный токен
		 * @return string
		 */
		public function getToken() {
			return $this->token;
		}

		/**
		 * Устанавливает используется ли адрес нового личного кабинета
		 * @param bool $status
		 * @return $this
		 */
		public function setNewUrlIsUsed($status = true) {
			$this->validateBoolField($status, self::URL_TITLE);
			$this->isNewUrlUsed = $status;
			return $this;
		}

		/**
		 * Определяет используется ли адрес нового личного кабинета
		 * @return bool
		 */
		public function isNewUrlUsed() {
			return $this->isNewUrlUsed;
		}
	}
