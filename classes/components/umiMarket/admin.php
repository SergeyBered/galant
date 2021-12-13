<?php
	use UmiCms\Service;
	use UmiCms\Classes\Components\UmiMarket\Market\iClient;

	/** Класс функционала административной панели */
	class UmiMarketAdmin implements iModulePart {

		use tModulePart;
		use baseModuleAdmin;

		/** @var string MARKET_SHOP_LINK ссылка на маркет с шаблонами магазинов */
		const MARKET_SHOP_LINK = 'https://market.umi-cms.ru/all_magaziny/?filter_by=pay&utm_source=korobka&utm_medium=admin&utm_campaign=configuration';

		/** @var string MARKET_SHOP_LINK ссылка на маркет с шаблонами сайтов */
		const MARKET_SITE_LINK = 'https://market.umi-cms.ru/all_sajty/?filter_by=pay&utm_source=korobka&utm_medium=admin&utm_campaign=configuration';

		/** @var int PRODUCT_LIST_LIMIT ограничение на размер списка товаров */
		const PRODUCT_LIST_LIMIT = 12;

		/**
		 * Возвращает данные для вкладки "Каталог"
		 * @param int|null $siteTypeId идентификатор типа сайта
		 * @param int|null $categoryId идентификатор категории товаров
		 * @return mixed
		 * @throws Exception
		 */
		public function catalog($siteTypeId = null, $categoryId = null) {
			$this->setDataType('list');
			$this->setActionType('view');

			$siteTypeId = $siteTypeId ?: (int) $this->getNumberedParameter(0);
			$categoryId = $categoryId ?: (int) $this->getNumberedParameter(1);
			$isMainPage = ($categoryId + $siteTypeId) === 0;

			$data = $isMainPage ? $this->getCatalogMainPageData() : $this->getCatalogData($siteTypeId, $categoryId);

			$this->setData($data);
			$this->doData();
		}

		/**
		 * Возвращает содержимое вкладки "Решения": список доменов с информацией об установленном решении
		 * @throws coreException
		 * @throws Exception
		 */
		public function solutions() {
			$this->setDataType('list');
			$this->setActionType('view');
			$data = [
				'attribute:is-last-version' => $this->isLastVersion()
			];
			/** @var autoupdate $autoUpdate */
			$autoUpdate = cmsController::getInstance()
				->getModule('autoupdate');
			try {
				switch (true) {
					case (!$autoUpdate instanceof autoupdate) : {
						$installedSolutionList = [
							'error' => getLabel('label-error-autoupdate-not-installed'),
						];
						break;
					}
					default : {
						$installedSolutionList = $autoUpdate->getInstalledSolutionList();
					}
				}
			} catch (publicException $exception) {
				$installedSolutionList = [
					'error' => $exception->getMessage()
				];
			}

			$solutionRegistry = Service::SolutionRegistry();
			$domainNodeList = [];

			foreach (Service::DomainCollection()->getList() as $domain) {
				$domainNode = [
					'@id' => $domain->getId(),
					'@host' => $domain->getHost()
				];
				$solutionName = $solutionRegistry->getByDomain($domain->getId());

				if (is_string($solutionName) && isset($installedSolutionList[$solutionName])) {
					$installedSolution = $installedSolutionList[$solutionName];
					$solutionNode = [];

					foreach ($installedSolution as $index => $value) {
						$solutionNode['@' . $index] = $value;
					}

					$domainNode['solution'] = array_merge($solutionNode, ['@isCustom' => '0']);
				}

				if (!isset($domainNode['solution']) && $this->hasCustomTemplateOrData($domain)) {
					$domainNode['solution'] = $this->getCustomSolutionNode();
				}

				$domainNodeList[] = $domainNode;
			}

			if (isset($installedSolutionList['error'])) {
				$domainNodeList = [
					[
						'error' => $installedSolutionList['error']
					]
				];
			}

			$data['nodes:domain'] = $domainNodeList;
			$this->setData($data);
			$this->doData();
		}

		/**
		 * Возвращает список всех доступных решений с категориями и типами
		 * @throws publicException
		 */
		public function getFullSolutionList() {
			$this->setDataType('list');
			$this->setActionType('view');

			/** @var autoupdate $autoUpdate */
			$autoUpdate = cmsController::getInstance()
				->getModule('autoupdate');
			$result = [];

			if (!$autoUpdate instanceof autoupdate) {
				$this->setData($result);
				$this->doData();
			}

			$fullSolutionList = $autoUpdate->getFullSolutionList();
			$result += $this->parseSolutionList($fullSolutionList, 'types', 'type');
			$result += $this->parseSolutionList($fullSolutionList, 'categories', 'category');
			$solutionList = [
				'solutions' => array_merge($fullSolutionList['paid'], $fullSolutionList['demo'], $fullSolutionList['free'])
			];
			$result += $this->parseSolutionList($solutionList, 'solutions', 'solution');
			$result += ['market_link' => $this->getMarketLink($autoUpdate->getEdition())];
			$this->setData($result);
			$this->doData();
		}

		/**
		 * Запускает удаление решения и перенаправляет на список установленных решений.
		 * Требует наличия скачанных пакетов обновления (/sys-temp/updates/).
		 * @param string|null $name название решения
		 * @param int|null $domainId идентификатор, куда устанавливает решение
		 * @throws coreException
		 * @throws errorPanicException
		 * @throws privateException
		 * @throws ErrorException
		 * @throws publicException
		 */
		public function deleteSolution($name = null, $domainId = null) {
			/** @var UmiMarketAdmin|umiMarket $module */
			$module = $this->getModule();

			if (isDemoMode()) {
				$module->errorNewMessage(getLabel('js-label-stop-in-demo'));
				return;
			}

			$name = $name ?: (string) getRequest('param0');
			$domainId = $domainId ?: (string) getRequest('param1');
			$registry = Service::SolutionRegistry();

			if ($registry->isAppendedToDomain($name, $domainId)) {
				$dumpPath = $this->getDumpPath($name);

				$source = Service::UmiDumpSolutionPostfixBuilder()
					->run($name, $domainId);
				$importer = new xmlImporter($source);
				$importer->loadXmlFile($dumpPath);
				$importer->demolish();

				$registry->deleteFromDomain($domainId);
			}

			$module->chooseRedirect($module->pre_lang . '/admin/umiMarket/solutions/');
		}

		/**
		 * Возвращает содержимое вкладки "Модули":
		 *
		 * 1) Список модулей, которые не были установлены, но их можно установить;
		 * 2) Список модулей, которые были установлены;
		 *
		 * @throws coreException
		 */
		public function modules() {
			$this->setDataType('list');
			$this->setActionType('view');
			$cmsController = cmsController::getInstance();
			/** @var autoupdate $autoUpdate */
			$autoUpdate = $cmsController->getModule('autoupdate');
			$moduleList = $cmsController->getModulesList();
			$data = $this->prepareData($moduleList, 'modules');
			$data['attribute:is-last-version'] = $this->isLastVersion();

			try {
				switch (true) {
					case isDemoMode() : {
						$availableModuleList = [];
						break;
					}
					case (!$autoUpdate instanceof autoupdate) : {
						$availableModuleList = [
							'autoupdate' => getLabel('module-autoupdate'),
							'error' => getLabel('label-error-autoupdate-not-installed'),
						];
						break;
					}
					default : {
						$availableModuleList = $autoUpdate->getAvailableModuleList();
					}
				}
			} catch (publicException $exception) {
				$availableModuleList = [
					'error' => $exception->getMessage()
				];
			}

			$installedModuleList = [];

			foreach ($moduleList as $module) {
				$installedModuleList[$module] = getLabel('module-' . $module);
			}

			$notInstalledModules = array_diff_key($availableModuleList, $installedModuleList);
			$installList = [];

			foreach ($notInstalledModules as $name => $label) {
				if ($name == 'error') {
					$installList[$label] = [
						'attribute:error' => $label
					];
					continue;
				}

				$installList[$label] = [
					'attribute:label' => $label,
					'node:available-module' => $name
				];
			}

			ksort($installList);
			$data['nodes:available-module'] = array_values($installList);
			$this->setData($data);
			$this->doData();
		}

		/**
		 * Запускает установку модуля и
		 * перенаправляет на список установленных
		 * модулей
		 * @throws publicAdminException
		 * @throws coreException
		 * @throws errorPanicException
		 * @throws privateException
		 * @throws ErrorException
		 */
		public function addModule() {
			/** @var UmiMarketAdmin|umiMarket $module */
			$module = $this->getModule();

			if (isDemoMode()) {
				$module->errorNewMessage(getLabel('js-label-stop-in-demo'));
				return;
			}

			$cmsController = cmsController::getInstance();
			$modulePath = getRequest('module_path');

			if (!preg_match("/.\.php$/", $modulePath)) {
				$modulePath .= '/install.php';
			}

			$cmsController->installModule($modulePath);

			$module->chooseRedirect($module->pre_lang . '/admin/umiMarket/modules/');
		}

		/**
		 * Запускает удаление модуля и перенаправляет на список установленных модулей
		 * @throws publicAdminException
		 * @throws coreException
		 * @throws errorPanicException
		 * @throws privateException
		 * @throws ErrorException
		 */
		public function deleteModule() {
			/** @var UmiMarketAdmin|umiMarket $module */
			$module = $this->getModule();

			if (isDemoMode()) {
				$module->errorNewMessage(getLabel('js-label-stop-in-demo'));
				return;
			}

			$restrictedModules = ['config', 'content', 'users', 'data', 'umiMarket'];
			$target = getRequest('param0');

			if (in_array($target, $restrictedModules)) {
				throw new publicAdminException(getLabel("error-can-not-delete-{$target}-module"));
			}

			$module = cmsController::getInstance()
				->getModule($target);
			$module = ($module instanceof def_module) ? $module : $this->module;
			$module->uninstall($target);
			$module->chooseRedirect($module->pre_lang . '/admin/umiMarket/modules/');
		}

		/**
		 * Возвращает содержимое вкладки "Расширения":
		 *
		 * 1) Список расширений, которые не были установлены, но их можно установить;
		 * 2) Список расширений, которые были установлены;
		 *
		 * @throws Exception
		 */
		public function extensions() {
			$this->setDataType('list');
			$this->setActionType('view');
			$data = [
				'attribute:is-last-version' => $this->isLastVersion()
			];
			/** @var autoupdate $autoUpdate */
			$autoUpdate = cmsController::getInstance()
				->getModule('autoupdate');
			try {
				switch (true) {
					case isDemoMode() : {
						$allExtensions = [];
						break;
					}
					case (!$autoUpdate instanceof autoupdate) : {
						$allExtensions = [
							'error' => getLabel('label-error-autoupdate-not-installed'),
						];
						break;
					}
					default : {
						$allExtensions = $autoUpdate->getAvailableExtensionList();
					}
				}
			} catch (publicException $exception) {
				$allExtensions = [
					'error' => $exception->getMessage()
				];
			}

			$installedExtensions = Service::ExtensionRegistry()
				->getList();
			$data['nodes:installed-extension'] = array_map(function ($name) use ($allExtensions) {
				return [
					'attribute:label' => isset($allExtensions[$name]) ? $allExtensions[$name] : $name,
					'node:value' => $name
				];
			}, $installedExtensions);

			$availableExtensionList = array_diff_key($allExtensions, array_flip($installedExtensions));

			foreach ($availableExtensionList as $name => $label) {
				if ($name == 'error') {
					$data['nodes:available-extension'][] = [
						'attribute:error' => $label
					];
					continue;
				}

				$data['nodes:available-extension'][] = [
					'attribute:label' => $label,
					'node:value' => $name
				];
			}

			$this->setData($data);
			$this->doData();
		}

		/**
		 * Запускает удаление расширения и перенаправляет на список установленных расширений.
		 * Требует наличия скачанных пакетов обновления (/sys-temp/updates/).
		 * @param string|null $name название расширения
		 * @throws coreException
		 * @throws errorPanicException
		 * @throws privateException
		 * @throws ErrorException
		 * @throws publicException
		 */
		public function deleteExtension($name = null) {
			/** @var UmiMarketAdmin|umiMarket $module */
			$module = $this->getModule();

			if (isDemoMode()) {
				$module->errorNewMessage(getLabel('js-label-stop-in-demo'));
				return;
			}

			$name = $name ?: (string) getRequest('param0');
			$registry = Service::ExtensionRegistry();

			if ($registry->contains($name)) {
				$dumpPath = $this->getDumpPath($name);

				$importer = new xmlImporter('system');
				$importer->loadXmlFile($dumpPath);
				$importer->demolish();

				$registry->delete($name);
			}

			$module->chooseRedirect($module->pre_lang . '/admin/umiMarket/extensions/');
		}

		/**
		 * Возвращает данные для главной страницы вкладки "Каталог"
		 * @return array
		 * @throws Exception
		 */
		private function getCatalogMainPageData() {
			$client = $this->getMarketHttpClient();
			return [
				'menu' => $client->getCategoryList(),
				'newProducts' => $client->getNewProductList(),
				'popularProducts' => $client->getPopularProductList()
			];
		}

		/**
		 * Возвращает данные для страницы вкладки "Каталог"
		 * @param int|null $siteTypeId идентификатор типа сайта
		 * @param int|null $categoryId идентификатор категории товаров
		 * @return array
		 * @throws Exception
		 */
		private function getCatalogData($siteTypeId = null, $categoryId = null) {
			$client = $this->getMarketHttpClient();
			$limit = self::PRODUCT_LIST_LIMIT;
			return [
				'menu' => $client->getCategoryList(),
				'products' => ['@limit' => $limit]
					+ $client->getProductList($categoryId, $siteTypeId, Service::Request()->pageNumber(), $limit),
			];
		}

		/**
		 * Возвращает http клиента для https://market.umi-cms.ru
		 * @return iClient
		 * @throws Exception
		 */
		private function getMarketHttpClient() {
			return Service::get('MarketHttpClient');
		}

		/**
		 * Определяет установлена ли последняя версия
		 * @return int
		 */
		private function isLastVersion() {
			/** @var autoupdate $autoUpdate */
			$autoUpdate = cmsController::getInstance()
				->getModule('autoupdate');
			try {
				return ($autoUpdate instanceof autoupdate) ? (int) $autoUpdate->isLastVersion() : 0;
			} catch (Exception $exception) {
				return 0;
			}
		}

		/**
		 * Определяет есть ли у домена шаблон или данные
		 * @param iDomain $domain проверяемы домен
		 * @return bool
		 * @throws selectorException
		 */
		private function hasCustomTemplateOrData(iDomain $domain) {
			return $this->hasCustomData($domain) || $this->hasCustomTemplate($domain);
		}

		/**
		 * Определяет есть у домена шаблон
		 * @param iDomain $domain домен
		 * @return bool
		 */
		private function hasCustomTemplate(iDomain $domain) {
			$templateList = templatesCollection::getInstance()
				->getTemplatesList($domain->getId(), $domain->getDefaultLangId());
			return count($templateList) > 0;
		}

		/**
		 * Определяет есть у домена данные
		 * @param iDomain $domain
		 * @return bool
		 * @throws selectorException
		 */
		private function hasCustomData(iDomain $domain) {
			$query = Service::SelectorFactory()
				->createPage();
			$query->where('domain')->equals($domain->getId());
			$query->option('return', 'id');
			$query->limit(0, 1);
			return count($query->result()) > 0;
		}

		/**
		 * Возвращает данные пользовательского сайта
		 * @return array
		 */
		private function getCustomSolutionNode() {
			return [
				'@title' => getLabel('label-custom-site'),
				'@isCustom' => '1'
			];
		}

		/**
		 * Возвращает ссылку на маркет для редакции
		 * @param string $edition системное имя редакции
		 * @return string
		 */
		private function getMarketLink($edition) {
			if (in_array($edition, ['shop', 'commerce', 'ultimate'])) {
				return self::MARKET_SHOP_LINK;
			}

			return self::MARKET_SITE_LINK;
		}

		/**
		 * Форматирует список решений, типов или категорий для последующей сериализации
		 * @param array $fullList список всех доступных решений, категорий и типов
		 * @param string $nodeListIndex индекс отдельного списка (types/categories/solutions)
		 * @param string $nodeIndex имя узла элемента списка (type/category/solution)
		 * @return array
		 */
		private function parseSolutionList(array $fullList, $nodeListIndex, $nodeIndex) {
			$nodeList = [];

			foreach ($fullList[$nodeListIndex] as $item) {
				$node = [];

				foreach ($item as $index => $value) {
					$node['@' . $index] = $value;
				}

				$nodeList[$node['@id']] = $node;
			}

			return [
				$nodeListIndex => ['nodes:' . $nodeIndex => $nodeList]
			];
		}

		/**
		 * Возвращает путь до пакета обновлений
		 * @param string $name имя пакета (решения/расширения/модуля)
		 * @return string
		 */
		private function getDumpPath($name) {
			return CURRENT_WORKING_DIR . "/sys-temp/updates/$name/$name.xml";;
		}
	}