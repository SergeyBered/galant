<?php

	use UmiCms\Service;

	/**
	 * Базовый класс модуля "Шаблоны сайта"
	 * Отвечает за:
	 *
	 * 1) Регистрацию шаблонов в системе;
	 * 2) Привязку шаблонов к страницам;
	 * 3) Редактирование файлов шаблонов;
	 * 4) Бэкапирование файлов шаблонов;
	 */
	class umiTemplates extends def_module {

		/** @inheritDoc */
		public function __construct() {
			parent::__construct();

			if (Service::Request()->isAdmin()) {
				$this->initTabs()
					->includeAdminClasses();
			}

			$this->includeCommonClasses();
		}

		/**
		 * Создает вкладки административной панели модуля
		 * @return $this
		 */
		public function initTabs() {
			$commonTabs = $this->getCommonTabs();

			if ($commonTabs instanceof iAdminModuleTabs) {
				$commonTabs->add('getTemplateList');
				$commonTabs->add('getTemplateEditor');
				$commonTabs->add('getTemplateBackups');
				$commonTabs->add('getRelatedPageTree');
			}

			return $this;
		}

		/**
		 * Подключает классы функционала административной панели
		 * @return $this
		 */
		public function includeAdminClasses() {
			$this->__loadLib('admin.php');
			$this->__implement('UmiTemplatesAdmin');

			$this->loadAdminExtension();

			$this->__loadLib('customAdmin.php');
			$this->__implement('UmiTemplatesCustomAdmin', true);

			return $this;
		}

		/**
		 * Подключает общие классы функционала
		 * @return $this
		 */
		public function includeCommonClasses() {
			$this->__loadLib('macros.php');
			$this->__implement('UmiTemplatesMacros');

			$this->loadSiteExtension();

			$this->__loadLib('customMacros.php');
			$this->__implement('UmiTemplatesCustomMacros', true);

			$this->loadCommonExtension();
			$this->loadTemplateCustoms();

			return $this;
		}
	}