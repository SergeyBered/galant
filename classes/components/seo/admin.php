<?php

	use UmiCms\Service;
	use UmiCms\Classes\System\Utils\Links\Injectors;
	use UmiCms\Classes\System\Utils\Links\Checker\iChecker;
	use UmiCms\Classes\System\Utils\Links\Grabber\iGrabber;

	/** Класс функционала административной панели */
	class SeoAdmin implements Injectors\iLinksCollection, Injectors\iLinksSourcesCollection {

		use baseModuleAdmin;
		use Injectors\tLinksCollection;
		use Injectors\tLinksSourcesCollection;

		/** @const string DEFAULT_PER_PAGE_NUMBER значение по умолчанию для кол-ва страниц к выводу в рамках пагинации */
		const DEFAULT_PER_PAGE_NUMBER = 10;

		/** @const string IS_COMPLETE_RESPONSE_KEY ключ данных ответа со статусом завершенности операции */
		const IS_COMPLETE_RESPONSE_KEY = 'isComplete';

		/** @const string STEP_RESPONSE_KEY ключ данных ответа с названием шага операции */
		const STEP_RESPONSE_KEY = 'step';

		/** @const string INFO_RESPONSE_KEY ключ данных ответа с информацией о прохождении операции */
		const INFO_RESPONSE_KEY = 'info';

		/** @const string STEP_LABEL_PREFIX префикс для языковой метки шага операции */
		const STEP_LABEL_PREFIX = 'js-label-step-';

		/** @const string INFO_LABEL_PREFIX префикс для языковой метки информации о прохождении операции */
		const INFO_LABEL_PREFIX = 'label-info-';

		/** @var int UPDATE_SITE_MAP_LOCATION_LIMIT лимит страниц обрабатываемых за одну итерацию обновления карты сайта */
		const UPDATE_SITE_MAP_LOCATION_LIMIT = 25;

		/** @var int UPDATE_SITE_MAP_IMAGE_LIMIT лимит страниц обрабатываемых за одну итерацию обновления карты изображений */
		const UPDATE_SITE_MAP_IMAGE_LIMIT = 6;

		/** @var seo $module */
		public $module;

		/** @var null|UmiCms\Classes\System\Utils\Links\Grabber\Grabber $linksGrabber собиратель ссылок */
		private $linksGrabber;

		/** @var null|UmiCms\Classes\System\Utils\Links\Checker\Checker $linksChecker проверщик ссылок */
		private $linksChecker;

		/**
		 * Конструктор
		 * @throws Exception
		 */
		public function __construct() {
			$serviceContainer = ServiceContainerFactory::create();
			$this->setLinksCollection(
				$serviceContainer->get('linksCollection')
			);
			$this->setLinksSourcesCollection(
				$serviceContainer->get('linksSourcesCollection')
			);
			$this->setLinksGrabber(
				$serviceContainer->get('linksGrabber')
			);
			$this->setLinksChecker(
				$serviceContainer->get('linksChecker')
			);
		}

		/**
		 * Возвращает данные для вкладки "Страницы с незаполненными meta-тегами"
		 * @throws coreException
		 */
		public function emptyMetaTags() {
			$this->setDataType('list');
			$this->setActionType('view');

			if ($this->module->ifNotXmlMode()) {
				$this->setDirectCallError();
				$this->doData();
				return true;
			}

			$limit = (int) getRequest('per_page_limit');
			$limit = ($limit === 0) ? self::DEFAULT_PER_PAGE_NUMBER : $limit;
			$currentPage = Service::Request()->pageNumber();
			$offset = $currentPage * $limit;

			$sel = new selector('pages');
			$fields = [];

			try {
				$fields = $this->getAllowedMetaFields();
			} catch (Exception $exception) {
				umiExceptionHandler::report($exception);
			}

			$sel->option('or-mode')->fields($fields);

			foreach ($fields as $field) {
				$sel->where($field)->isnull();
			}

			$sel->limit($offset, $limit);

			selectorHelper::detectDomainFilter($sel);
			selectorHelper::detectLanguageFilter($sel);
			selectorHelper::checkSyncParams($sel);
			selectorHelper::detectOrderFilters($sel);

			$data = $this->prepareData($sel->result(), 'pages');
			$this->setData($data, $sel->length());
			$this->setDataRangeByPerPage($limit, $currentPage);
			$this->doData();
		}

		/**
		 * Возвращает настройки табличного контрола
		 * @param string $param контрольный параметр (чаще всего - название текущей вкладки
		 * административной панели)
		 * @return array
		 * @throws coreException
		 */
		public function getDatasetConfiguration($param = '') {
			if ($param == 'emptyMetaTags') {
				return $this->getPagesWithEmptyMetaTagsConfiguration();
			}

			return [];
		}

		/**
		 * Возвращает настройки табличного контрола для вкладки "Страницы с незаполненными meta тегами"
		 * @return array
		 * @throws coreException
		 */
		public function getPagesWithEmptyMetaTagsConfiguration() {
			$umiObjectTypes = umiObjectTypesCollection::getInstance();
			return [
				'methods' => [
					[
						'title' => getLabel('smc-load'),
						'forload' => true,
						'module' => 'seo',
						'#__name' => 'emptyMetaTags'
					]
				],
				'types' => [
					[
						'common' => true,
						'id' => $umiObjectTypes->getTypeIdByGUID('root-pages-type')
					]
				],
				'stoplist' => [
					'more_params',
					'robots_deny',
					'is_unindexed',
					'store_amounts',
					'locktime',
					'lockuser',
					'anons',
					'content',
					'rate_voters',
					'rate_sum',
					'begin_time',
					'end_time',
					'tags',
					'show_submenu',
					'is_expanded'
				],
				'default' => 'name[350px]|title[250px]|meta_descriptions[250px]|h1[250px]'
			];
		}

		/**
		 * Возвращает данные конфигурации табличного контрола вкладки "Страницы с битыми ссылками"
		 * @return array
		 */
		public function getBrokenLinksDatasetConfiguration() {
			return [
				'methods' => [
					[
						'title' => getLabel('smc-load'),
						'forload' => true,
						'module' => 'seo',
						'type' => 'load',
						'name' => 'getBrokenLinks'
					]
				],
				'default' => 'address[600px]|place[600px]',
				'fields' => [
					[
						'name' => 'address',
						'title' => getLabel('label-link-address', 'seo'),
						'type' => 'string',
						'editable' => 'false',
						'filterable' => 'false',
						'sortable' => 'false',
						'show_edit_page_link' => 'false'
					],
					[
						'name' => 'place',
						'title' => getLabel('label-page-address', 'seo'),
						'type' => 'string',
						'editable' => 'false',
						'filterable' => 'false',
						'sortable' => 'false'
					]
				]
			];
		}

		/** Возвращает конфиг вкладки "Страницы с битыми ссылками" в формате JSON для табличного контрола */
		public function flushBrokenLinksDatasetConfiguration() {
			$this->module->printJson($this->getBrokenLinksDatasetConfiguration());
		}

		/**
		 * Возвращает основные настройки модуля.
		 * Если передан ключевой параметр $_REQUEST['param0'] = do,
		 * то сохраняет настройки.
		 * @throws coreException
		 * @throws publicAdminException
		 * @throws requireAdminParamException
		 * @throws wrongParamException
		 * @throws Exception
		 */
		public function config() {
			$settingsManager = $this->module->getAdminSettingsManager();
			$params = $settingsManager->getParams();

			if ($this->isSaveMode()) {
				$params = self::expectedParams($params);
				$settingsManager->setParams($params);
				$this->chooseRedirect();
			}

			$this->setConfigResult($params);
		}

		/** @inheritDoc */
		public function getDefaultPerPageNumber() {
			return self::DEFAULT_PER_PAGE_NUMBER;
		}

		/**
		 * Выводит в буффер данные для вкладки "Битые ссылки"
		 * @return bool|void
		 * @throws Exception
		 */
		public function getBrokenLinks() {
			if ($this->module->ifNotJsonMode()) {
				$this->setDataSetDirectCallMessage();
				return;
			}

			try {
				$limit = $this->getLimit();
				$offset = $this->getOffset($limit);
				$links = $this->getLinksCollection()
					->exportBrokenLinks($offset, $limit);
				$total = $this->getLinksCollection()
					->countBrokenLinks();
			} catch (Exception $e) {
				$links = $this->getSimpleErrorMessage(
					$e->getMessage()
				);
				$total = 0;
			}

			$this->module->printJson(
				$this->prepareTableControlEntities($links, $total)
			);
		}

		/**
		 * Запускает индексацию ссылок и выводит результат в буффер
		 * @throws Exception
		 */
		public function indexLinks() {
			$grabber = $this->getLinksGrabber();
			$isComplete = $grabber->grab()
				->saveResult()
				->saveState()
				->isComplete();

			if ($isComplete) {
				$grabber->flushSavedState();
			}

			$this->module->printJson([
				self::IS_COMPLETE_RESPONSE_KEY => $isComplete,
				self::STEP_RESPONSE_KEY => getLabel(self::STEP_LABEL_PREFIX . $grabber->getServiceName()),
				self::INFO_RESPONSE_KEY => getLabel(self::INFO_LABEL_PREFIX . $grabber->getStateName())
			]);
		}

		/**
		 * Запускает проверку ссылок и выводит результат в буффер
		 * @throws Exception
		 */
		public function checkLinks() {
			$checker = $this->getLinksChecker();
			$isComplete = $this->getLinksChecker()
				->checkBrokenUrls()
				->saveState()
				->isComplete();

			if ($isComplete) {
				$checker->flushSavedState();
			}

			$this->module->printJson([
				self::IS_COMPLETE_RESPONSE_KEY => $isComplete,
				self::STEP_RESPONSE_KEY => getLabel(self::STEP_LABEL_PREFIX . $checker->getServiceName()),
				self::INFO_RESPONSE_KEY => getLabel(self::INFO_LABEL_PREFIX . $checker->getServiceName())
			]);
		}

		/**
		 * Выводит в буффер ссылки, найденные в шаблонах и базе данных,
		 * с таким же адресом, как у ссылки, найденной на страницах сайта.
		 * @param bool|int $linkId идентификатор ссылки, найденной на страницах сайта
		 * @throws Exception
		 */
		public function getLinkSources($linkId = false) {
			if (!$linkId) {
				$linkId = $this->getNumberedParameter(0);
			}

			$sourceLinks = $this->getLinksSourcesCollection()
				->exportByLinkId($linkId);

			if (umiCount($sourceLinks) == 0) {
				throw new publicAdminException(getLabel('label-error-links-not-found'));
			}

			$this->module->printJson($sourceLinks);
		}

		/**
		 * Возвращает данные о sitemap по доменам
		 * @throws Exception
		 * @throws coreException
		 * @throws publicAdminException
		 */
		public function sitemap() {
			if (!Service::Request()->isJson()) {
				$this->setDataSetDirectCallMessage();
				return;
			}

			$domains = Service::DomainCollection()->getList();

			$this->printEntityTableControlResult($domains);
		}

		/** Возвращает конфиг вкладки "Карта сайта" в формате JSON для табличного контрола */
		public function flushSitemapConfig() {
			Service::Response()->printJson($this->getDomainListConfiguration('sitemap'));
		}

		/** Возвращает конфиг вкладки "robots.txt" в формате JSON для табличного контрола */
		public function flushRobotsConfig() {
			Service::Response()->printJson($this->getDomainListConfiguration('robots'));
		}

		/**
		 * Возвращает данные конфигурации табличного контрола со списком доменов
		 * @param string $tabName Название вкладки
		 * @return array
		 */
		public function getDomainListConfiguration($tabName) {
			return [
				'methods' => [
					[
						'title' => getLabel('smc-load'),
						'module' => 'seo',
						'type' => 'load',
						'name' => $tabName
					]
				],
				'default' => 'host[350px]',
				'fields' => [
					[
						'name' => 'host',
						'title' => getLabel('label-seo-domain'),
						'type' => 'string',
						'show_edit_page_link' => 'false',
						'filterable' => 'false',
						'sortable' => 'false',
						'editable' => 'false'
					]
				]
			];
		}

		/**
		 * Обновляет данные для построения sitemap.xml.
		 * Используется для итеративновного вызова.
		 * @throws Exception
		 */
		public function updateSiteMap() {
			$domainId = (int) getRequest('param0');
			$updater = Service::SiteMapUpdater();
			$deleteCallback = [
				$updater, 'deleteByDomain'
			];
			$updateCallback = [
				$updater, 'update'
			];
			$limit = (int) mainConfiguration::getInstance()
				->get('site-map', 'update-site-map-location-limit', self::UPDATE_SITE_MAP_LOCATION_LIMIT);
			$key = 'site_map_' . $domainId;
			$complete = $this->foreachSiteMapLocation($domainId, $deleteCallback, $updateCallback, $limit, $key);

			$data = [
				'attribute:complete' => (int) $complete
			];

			$this->setData($data);
			$this->doData();
		}

		/**
		 * Обновляет данные для построения sitemap-images.xml.
		 * Используется для итеративновного вызова.
		 * @throws Exception
		 */
		public function updateSiteMapImages() {
			$domainId = (int) getRequest('param0');
			$updater = Service::SiteMapUpdater();
			$deleteCallback = [
				$updater, 'deleteImagesByDomain'
			];
			$updateCallback = [
				$updater, 'updateImages'
			];
			$limit = (int) mainConfiguration::getInstance()
				->get('site-map', 'update-site-map-image-limit', self::UPDATE_SITE_MAP_IMAGE_LIMIT);
			$key = 'site_map_images_' . $domainId;
			$complete = $this->foreachSiteMapLocation($domainId, $deleteCallback, $updateCallback, $limit, $key);

			$data = [
				'attribute:complete' => (int) $complete
			];

			$this->setData($data);
			$this->doData();
		}

		/** Возвращает данные о robots.txt по доменам */
		public function robots() {
			if (!Service::Request()->isJson()) {
				$this->setDataSetDirectCallMessage();
				return;
			}

			$domains = Service::DomainCollection()->getList();
			$this->printEntityTableControlResult($domains);
		}
		

		/** Редактирует robots.txt */
		public function editRobotsTxt() {
			$domainId = getRequest('domain_id');
			$robotsTxt = getRequest('robots_txt');

			try {
				$result = $this->setCustomRobotsTxt($domainId, $robotsTxt);
				if (!$result) {
					$object = $this->getObjectRobotsTxt($domainId);
					$object->setValue('robots_txt', $robotsTxt);
					$object->commit();
				}

				$result = $this->getSimpleRefreshMessage();
			} catch (Exception $exception) {
				$result = $this->getSimpleErrorMessage($exception);
			}

			$this->printEntityTableControlResult($result);
		}

		/** Возвращает текст robots.txt для домена */
		public function getRobotsTxt() {
			$domainId = getRequest('domain_id');

			$robotsTxt = $this->getCustomRobotsTxt($domainId);
			if (!$robotsTxt) {
				$object = $this->getObjectRobotsTxt($domainId);
				$robotsTxt = $object->getValue('robots_txt');
			}

			$result = [
				'robots_txt' => $robotsTxt
			];

			$this->printEntityTableControlResult($result);
		}

		/**
		 * Возвращает объект robots.txt для домена
		 * @param int $domainId идентификатор домена
		 * @return iUmiObject
		 * @throws publicAdminException
		 * @throws selectorException
		 */
		public function getObjectRobotsTxt($domainId) {
			if (!$domainId) {
				throw new publicAdminException(getLabel('label-error-wrong-domain'));
			}

			$objectsCollection = umiObjectsCollection::getInstance();
			$typesCollection = umiObjectTypesCollection::getInstance();

			$typeId = $typesCollection->getTypeIdByHierarchyTypeName('seo', 'robots-txt');

			$selector = Service::SelectorFactory()->createObjectTypeId($typeId);
			$selector->where('domain_id')->equals($domainId);
			$selector->limit(0, 1);
			$object = $selector->first();

			if ($object instanceof iUmiObject) {
				return $object;
			}

			$objectId = $objectsCollection->addObject('robots.txt', $typeId);
			$object = $objectsCollection->getObject($objectId);

			$robotsTxt = <<<ROBOTS
User-Agent: Googlebot
Disallow: /?
%disallow_umi_pages%

User-Agent: Yandex
Disallow: /?
%disallow_umi_pages%

User-Agent: *
Disallow: /?
%disallow_umi_pages%

Host: %host%
Sitemap: %host%/sitemap.xml
Crawl-delay: %crawl_delay%
ROBOTS;

			$object->setValue('domain_id', $domainId);
			$object->setValue('robots_txt', $robotsTxt);
			$object->commit();

			return $object;
		}

		/** @inheritDoc */
		protected function getYandexClientId() {
			return '47fc30ca18e045cdb75f17c9779cfc36';
		}

		/** @inheritDoc */
		protected function getYandexSecret() {
			return '8c744620c2414522867e358b74b4a2ff';
		}

		/**
		 * @inheritDoc
		 * @throws Exception
		 */
		protected function getTokenRegistry() {
			return $this->module->getRegistry();
		}

		/**
		 * Выполняет операцию для каждого адреса карты сайта
		 * @param int $domainId домен, к которому принадлежат страницы карты сайта
		 * @param callable $delete функция обратного вызова для удаления адресов
		 * @param callable $update функция обратного вызова для добавления адресов
		 * @param int $limit ограничение на количество обрабатываемых адресов за одну итерацию
		 * @param string $key имя ключа для сохранения прогресса операции
		 * @return bool
		 */
		private function foreachSiteMapLocation(
			int $domainId, callable $delete, callable $update, int $limit, string $key) : bool
		{
			$complete = false;
			$hierarchy = umiHierarchy::getInstance();
			$dirName = CURRENT_WORKING_DIR . "/sys-temp/sitemap/{$domainId}/";

			if (!is_dir($dirName)) {
				mkdir($dirName, 0777, true);
			}

			$filePath = $dirName . $key;

			if (!file_exists($filePath)) {
				call_user_func($delete, $domainId);
				$elements = [];
				$languageCollection = Service::LanguageCollection()->getList();
				/** @var lang $lang */
				foreach ($languageCollection as $lang) {
					$elements = array_merge(
						$elements,
						$hierarchy->getChildrenList(0, false, true, false, $domainId, false, $lang->getId())
					);
				}
				sort($elements);
				file_put_contents($filePath, serialize($elements));
			}

			$session = Service::Session();
			$offset = (int) $session->get($key);
			$elements = unserialize(file_get_contents($filePath));

			for ($i = $offset; $i <= $offset + $limit - 1; $i++) {
				if (!array_key_exists($i, $elements)) {
					$complete = true;
					break;
				}
				$element = $hierarchy->getElement($elements[$i], true, true);

				if ($element instanceof iUmiHierarchyElement && !$element->hasInactiveParents()) {
					call_user_func($update, $element);
				}
			}

			$progressValue = $offset + $limit;
			$session->set($key, $progressValue);

			if ($complete) {
				$session->del($key);
				unlink($filePath);
			}

			return $complete;
		}

		/**
		 * Возвращает список поддерживаемых meta полей
		 * @return string[]
		 * @throws Exception
		 */
		private function getAllowedMetaFields() {
			$settings = Service::SeoSettingsFactory()->createCommon();
			$fields = [];

			if ($settings->isAllowEmptyH1()) {
				$fields[] = 'h1';
			}

			if ($settings->isAllowEmptyTitle()) {
				$fields[] = 'title';
			}

			if ($settings->isAllowEmptyDescription()) {
				$fields[] = 'meta_descriptions';
			}

			if ($settings->isAllowEmptyKeywords()) {
				$fields[] = 'meta_keywords';
			}

			return $fields;
		}

		/**
		 * Устанавливает собиратель ссылок
		 * @param iGrabber $grabber
		 * @return $this
		 */
		private function setLinksGrabber(iGrabber $grabber) {
			$this->linksGrabber = $grabber;
			return $this;
		}

		/**
		 * Возвращает собиратель ссылок
		 * @return \UmiCms\Classes\System\Utils\Links\Grabber\Grabber|iGrabber
		 * @throws RequiredPropertyHasNoValueException
		 */
		private function getLinksGrabber() {
			if (!$this->linksGrabber instanceof iGrabber) {
				throw new \RequiredPropertyHasNoValueException('You should set iGrabber first');
			}

			return $this->linksGrabber;
		}

		/**
		 * Устанавливает проверщик ссылок
		 * @param iChecker $checker
		 * @return $this
		 */
		private function setLinksChecker(iChecker $checker) {
			$this->linksChecker = $checker;
			return $this;
		}

		/**
		 * Возвращает проверщик ссылок
		 * @return \UmiCms\Classes\System\Utils\Links\Checker\Checker|iChecker
		 * @throws RequiredPropertyHasNoValueException
		 */
		private function getLinksChecker() {
			if (!$this->linksChecker instanceof iChecker) {
				throw new \RequiredPropertyHasNoValueException('You should set iChecker first');
			}

			return $this->linksChecker;
		}

		/**
		 * Возвращает текст кастомного robots.txt для домена
		 * @param int $domainId идентификатор домена
		 * @return string 
		 */
		private function getCustomRobotsTxt(int $domainId) : ?string {
			$fileRobotsTxt = $this->getCustomRobotsTxtFile($domainId);

			if ($fileRobotsTxt->isExists()) {
				return $fileRobotsTxt->getContent();
			}
			return null;
		}

		/**
		 * Записывает текст кастомного robots.txt для домена
		 * @param int $domainId идентификатор домена
		 * @param string $robotsTxt текст robots.txt
		 * @return bool 
		 */
		private function setCustomRobotsTxt(int $domainId, string $robotsTxt) : bool {
			$fileRobotsTxt = $this->getCustomRobotsTxtFile($domainId);

			if ($fileRobotsTxt->isExists()) {
				return $fileRobotsTxt->putContent($robotsTxt);
			}
			return false;
		}

		/**
		 * Возвращает кастомный файл robots.txt для домена
		 * @param int $domainId идентификатор домена
		 * @return iUmiFile 
		 */
		private function getCustomRobotsTxtFile(int $domainId) : iUmiFile {
			$path = CURRENT_WORKING_DIR . '/robots/' . $domainId . '.robots.txt';
			return Service::FileFactory()->create($path);
		}
	}
