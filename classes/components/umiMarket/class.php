<?php
	use UmiCms\Service;

	/**
	 * Базовый класс модуля "Маркет"
	 * Модуль отвечает за:
	 *
	 * 1) Просмотр каталога решений, модулей и расширений на http://umi.market;
	 * 2) Установку решений, модулей и расширений;
	 * 3) Удаление решений модулей и расширений;
	 */
	class umiMarket extends def_module {

		/** @inheritDoc */
		public function __construct() {
			parent::__construct();

			if (Service::Request()->isAdmin()) {
				$this->initTabs()
					->includeAdminClasses();
			}

			$this->includeCommonClasses()
				->initTemplates();
		}

		/**
		 * Создает вкладки административной панели модуля
		 * @return $this
		 */
		public function initTabs() {
			$commonTabs = $this->getCommonTabs();

			if ($commonTabs instanceof iAdminModuleTabs) {
				$commonTabs->add('catalog');
				$commonTabs->add('solutions');
				$commonTabs->add('modules');
				$commonTabs->add('extensions');
			}

			return $this;
		}

		/**
		 * Подключает классы функционала административной панели
		 * @return $this
		 */
		public function includeAdminClasses() {
			$this->__loadLib('admin.php');
			$this->__implement('UmiMarketAdmin');

			$this->loadAdminExtension();

			$this->__loadLib('customAdmin.php');
			$this->__implement('UmiMarketCustomAdmin', true);

			return $this;
		}

		/**
		 * Подключает общие классы функционала
		 * @return $this
		 */
		public function includeCommonClasses() {
			$this->__loadLib('macros.php');
			$this->__implement('UmiMarketMacros');

			$this->loadSiteExtension();

			$this->__loadLib('customMacros.php');
			$this->__implement('UmiMarketCustomMacros', true);

			$this->loadCommonExtension();
			$this->loadTemplateCustoms();

			return $this;
		}

		/**
		 * Инициализирует шаблоны виджетов модуля
		 * @return $this
		 */
		public function initTemplates() {
			$config = mainConfiguration::getInstance();
			$templateBindingList = (array) $config->get('casual-skins', 'solutions');
			$templateBinding = array_shift($templateBindingList);
			$correctTemplateBinding = 'umiMarket::getFullSolutionList';

			if ($templateBinding === $correctTemplateBinding) {
				return $this;
			}

			$config->set('casual-skins', 'solutions', (array) $correctTemplateBinding);
			$config->save();
			return $this;
		}
	}