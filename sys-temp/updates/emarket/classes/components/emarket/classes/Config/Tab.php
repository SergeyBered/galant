<?php
	namespace UmiCms\Classes\Components\Emarket\Config;

	/** Класс абстрактной вкладки настроек */
	abstract class Tab implements \iModulePart {

		use \baseModuleAdmin;
		use \tModulePart;

		/** @var Settings настройки модуля */
		protected $settings;

		/** @var array конфиг опций вкладки */
		protected $options = [];

		/**
		 * Конструктор
		 * @param \emarket $module
		 * @throws \coreException
		 */
		public function __construct(\emarket $module) {
			$tabsManager = $module->getConfigTabs();

			if (!$tabsManager instanceof \iAdminModuleTabs) {
				return false;
			}

			$tabsManager->add($this->getTabName());
			$this->settings = $module->getImplementedInstance($module::SETTINGS_CLASS);
		}

		/**
		 * Метод вкладки настроек оформления заказа.
		 * Возврашает список групп и настроек, при необходимости сохраняет переданные значения.
		 * @throws \Exception
		 * @throws \coreException
		 * @throws \wrongParamException
		 * @throws \publicAdminException
		 * @throws \requireAdminParamException
		 * @throws \RequiredPropertyHasNoValueException
		 */
		public function handleSettings() {
			$options = $this->initOptions();
			$settings = $this->settings;

			if ($this->isSaveMode()) {
				$options = $this->expectParams($options);

				$this->forEachOption(function ($group, $option, $settingGroup, $settingName) use ($settings, $options) {
					$settings->set($settingGroup, $settingName, $options[$group][$option]);
				});

				$this->chooseRedirect();
			}

			$this->forEachOption(function ($group, $option, $settingGroup, $settingName) use ($settings, &$options) {
				$options[$group][$option]['value'] = $settings->get($settingGroup, $settingName);
			});

			/** @var baseModuleAdmin|emarket $module */
			$module = $this->getModule();
			$module->setConfigResult($options);
		}

		/**
		 * Возвращает название вкладки
		 * @return string
		 */
		abstract protected function getTabName();
	}