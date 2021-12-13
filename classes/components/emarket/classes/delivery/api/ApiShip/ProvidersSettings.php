<?php

	namespace UmiCms\Classes\Components\Emarket\Delivery\ApiShip;

	use UmiCms\Classes\Components\Emarket\Delivery\ApiShip\Utils\ArgumentsValidator;

	/**
	 * Контейнер настроек провайдеров
	 * @package UmiCms\Classes\Components\Emarket\Delivery\ApiShip
	 */
	class ProvidersSettings implements iProvidersSettings {

		/** @var array $settings настройки провайдеров */
		private $settings = [];

		/** @var iProvidersFactory $providersFactory фабрика провайдеров */
		private $providersFactory;

		/** @var \ApiShipDelivery $delivery экземпляр способа доставки "ApiShip" */
		private $delivery;

		/** @inheritDoc */
		public function __construct(\ApiShipDelivery $delivery, iProvidersFactory $providersFactory) {
			$this->setProvidersFactory($providersFactory);
			$this->setDelivery($delivery);
			$this->loadSettings();
		}

		/** @inheritDoc */
		public function get($key = null) {
			switch (true) {
				case ($key === null) : {
					return $this->settings;
				}
				case isset($this->settings[$key]) : {
					return $this->settings[$key];
				}
				default : {
					return [];
				}
			}
		}

		/** @inheritDoc */
		public function set(array $settings, $key = null) {
			ArgumentsValidator::notEmptyArray($settings, \ApiShipDelivery::DELIVERY_SETTINGS, __METHOD__);

			switch (true) {
				case ($key === null) : {
					$this->settings = $settings;
					break;
				}
				default : {
					$this->settings[$key] = $settings;
				}
			}

			return $this;
		}

		/** @inheritDoc */
		public function save() {
			$settings = $this->get();

			$this->getDelivery()
				->saveProviderSettingsList($settings);

			return $this;
		}

		/** @inheritDoc */
		public function appendProvidersSettings(array $keys) {
			$providersFactory = $this->getProvidersFactory();

			foreach ($keys as $providerKey) {
				$providerKey = new Enums\ProvidersKeys($providerKey);
				$provider = $providersFactory::create($providerKey);
				$this->set(
					$provider->export(), $provider->getKey()
				);
			}

			return $this;
		}

		/** @inheritDoc */
		public function removeProvidersSettings(array $keys) {
			foreach ($keys as $key) {
				$this->remove($key);
			}

			return $this;
		}

		/** @inheritDoc */
		public function remove($key = null) {
			switch (true) {
				case ($key === null) : {
					$this->settings = [];
					break;
				}
				case isset($this->settings[$key]) : {
					unset($this->settings[$key]);
				}
			}

			return $this;
		}

		/**
		 * Устанавливает фабрику провайдеров
		 * @param iProvidersFactory $providersFactory фабрика провайдеров
		 * @return iProvidersSettings
		 */
		private function setProvidersFactory(iProvidersFactory $providersFactory) {
			$this->providersFactory = $providersFactory;
			return $this;
		}

		/**
		 * Устанавливает экземпляр способа доставки ApiShip
		 * @param \ApiShipDelivery $delivery экземпляр способа доставки ApiShip
		 * @return $this
		 */
		private function setDelivery(\ApiShipDelivery $delivery) {
			$this->delivery = $delivery;
			return $this;
		}

		/**
		 * Возвращает экземпляр способа доставки ApiShip
		 * @return \ApiShipDelivery
		 */
		private function getDelivery() {
			return $this->delivery;
		}

		/**
		 * Возвращает фабрику провайдеров
		 * @return iProvidersFactory
		 */
		private function getProvidersFactory() {
			return $this->providersFactory;
		}

		/**
		 * Загружает настройки
		 * @return iProvidersSettings
		 */
		private function loadSettings() {
			$filledSettings = $this->getSavedSettings();
			$settingsWithEmptyValues = $this->getSettingsWithEmptyValues();

			$this->settings = $this->mergeSettings($filledSettings, $settingsWithEmptyValues);
			return $this;
		}

		/**
		 * Дополняет заполненные настройки с пустыми значениями.
		 * Добавляет новые настройки и удаляет старые.
		 * @param array $filledSetting заполненные настройки
		 * @param array $emptySettings пустые настройки
		 * @return array
		 */
		private function mergeSettings(array $filledSetting, array $emptySettings) {

			foreach ($emptySettings as $providerKey => $providerEmptySettings) {
				if (!isset($filledSetting[$providerKey])) {
					$filledSetting[$providerKey] = $providerEmptySettings;
					continue;
				}

				foreach ($providerEmptySettings as $key => $meta) {
					if (!isset($filledSetting[$providerKey][$key])) {
						$filledSetting[$providerKey][$key] = $meta;
					}
				}
			}

			foreach ($filledSetting as $providerKey => $providerFilledSettings) {
				if (!isset($emptySettings[$providerKey])) {
					unset($filledSetting[$providerKey]);
					continue;
				}

				foreach ($providerFilledSettings as $key => $meta) {
					if (!isset($emptySettings[$providerKey][$key])) {
						unset($filledSetting[$providerKey][$key]);
						continue;
					}
				}
			}

			return $filledSetting;
		}

		/**
		 * Возвращает сохраненные настройки
		 * @return array
		 */
		private function getSavedSettings() {
			$settings = $this->getDelivery()
				->getSavedProviderSettingsList();

			if (!is_array($settings)) {
				return [];
			}

			return $settings;
		}

		/**
		 * Возвращает настройки с пустыми значениями
		 * @return array
		 */
		private function getSettingsWithEmptyValues() {
			$providersFactory = $this->getProvidersFactory();
			$providers = $providersFactory::getProvidersList();
			$settings = [];

			foreach ($providers as $provider) {
				$settings[$provider->getKey()] = $provider->export();
			}

			return $settings;
		}
	}
