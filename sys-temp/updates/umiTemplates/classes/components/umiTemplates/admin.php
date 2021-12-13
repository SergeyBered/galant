<?php

	use UmiCms\Service;

	/** Класс функционала административной панели */
	class UmiTemplatesAdmin implements iModulePart {

		use tModulePart;
		use baseModuleAdmin;

		/** @var string ключевое имя атрибута сущности - идентификатора */
		const ID_KEY = 'id';
		/** @var string ключевое имя атрибута сущности - идентификатора для отображения в админзоне */
		const ADMIN_TEMPLATE_ID_KEY = 'admin_template_id';
		/** @var string ключевое имя атрибута шаблона сайта - названия */
		const NAME_KEY = 'name';
		/** @var string ключевое имя атрибута шаблона сайта или страницы - идентификатор модуля */
		const MODULE_ID_KEY = 'module_id';
		/** @var string ключевое имя атрибута шаблона сайта или страницы - название модуля */
		const MODULE_TITLE_KEY = 'module_title';
		/** @var string ключевое имя атрибута шаблона сайта - имени файла */
		const FILE_NAME_KEY = 'fileName';
		/** @var string ключевое имя атрибута шаблона сайта - имени директории */
		const DIRECTORY_KEY = 'directory';
		/** @var string ключевое имя атрибута шаблона сайта - типа */
		const TYPE_KEY = 'type';
		/** @var string ключевое имя атрибута шаблона сайта - флага "Основной" */
		const IS_DEFAULT_KEY = 'isDefault';
		/** @var string ключевое имя атрибута бэкапа сайта - даты модификации */
		const FILE_DATE_KEY = 'date';
		/** @var string ключевое имя атрибута бэкапа сайта - размера */
		const FILE_SIZE_KEY = 'size';

		/**
		 * Возвращает список шаблонов сайта
		 * @param int|null $domainId идентификатор домена
		 * @param int|null $languageId идентификатор языка
		 * @param int|string|null $limit ограничение на количество шаблонов или ключевое слово KEYWORD_GRAB_ALL
		 * @param int|null $offset смещение ограничения на количество
		 * @throws coreException
		 */
		public function getTemplateList($domainId = null, $languageId = null, $limit = null, $offset = null) {
			if (!Service::Request()->isJson()) {
				$this->setDataSetDirectCallMessage();
				return;
			}

			$domainId = $this->getOrDetectDomainId($domainId);
			$languageId = $this->getOrDetectLanguageId($languageId);
			$templateCollection = templatesCollection::getInstance();

			try {
				$templateList = $templateCollection->getTemplatesList($domainId, $languageId);
				$totalCount = count($templateList);
				$templateList = $this->sliceDataRowList($templateList, $limit, $offset);
				$templateList = $this->prepareTemplateList($templateList);
				$result = $this->appendPageNavigation($templateList, $totalCount);
			} catch (\Exception $exception) {
				$result = $this->getEntityTableControlErrorResult($exception);
			}

			$this->printEntityTableControlResult($result);
		}

		/**
		 * Возвращает дерево шаблонов сайта, где корни - шаблоны сайта, а ветви - страницы
		 * @param int|null $templateId идентификатор шаблона (передается для формирования ветви)
		 * @param int|null $domainId идентификатор домена (передается для формирования корня)
		 * @param int|null $languageId идентификатор языка (передается для формирования корня)
		 * @throws coreException
		 * @return void
		 */
		public function getRelatedPageTree($templateId = null, $domainId = null, $languageId = null) {
			if (!Service::Request()->isJson()) {
				$this->setDataSetDirectCallMessage();
				return;
			}

			$templateId = $templateId ?: $this->getRelationId();
			$nameFilter = $this->getPageNameFilter();

			if ($templateId !== null) {
				$this->getRelatedPageBranchList($templateId, $nameFilter);
				return;
			}

			$this->getTemplateRootList($domainId, $languageId, $nameFilter);
		}

		/**
		 * Выводит в буффер конфигурацию табличного контрола дерева шаблонов
		 */
		public function flushRelatedPageTreeConfig() {
			$config = $this->getRelatedPageTreeConfig();
			Service::Response()->printJson($config);
		}

		/**
		 * Выводит в буффер конфигурацию табличного контрола списка шаблонов
		 */
		public function flushTemplateListConfig() {
			$config = $this->getTemplateListConfig();
			Service::Response()->printJson($config);
		}

		/**
		 * Удаляет список шаблонов сайта
		 * @param int[] $idList список идентификаторов удаляемых шаблонов
		 */
		public function deleteTemplateList(array $idList = []) {
			$idList = $idList ?: Service::Request()->Post()->get('id_list');
			$templateCollection = templatesCollection::getInstance();

			try {
				if (!is_array($idList) || $idList === []) {
					throw new InvalidArgumentException('Template id list expected');
				}

				foreach ($idList as $id) {
					$template = $templateCollection->getTemplate($id);

					if (!$template instanceof iTemplate) {
						continue;
					}

					$templateCollection->delTemplate($id);
				}

				$result = $this->getSimpleRefreshMessage();
			} catch (Exception $exception) {
				$result = $this->getSimpleErrorMessage($exception);
			}

			$this->printEntityTableControlResult($result);
		}

		/**
		 * Устанавливает значение атрибута шаблона сайта
		 * @param int|null $id идентификатор шаблона
		 * @param string|null $attribute имя атрибута
		 * @param mixed $value значение атрибута
		 */
		public function setTemplateAttributeValue($id = null, $attribute = null, $value = null) {
			$id = $id ?: $this->getNumberedParameter(0);
			$templateCollection = templatesCollection::getInstance();

			try {
				$template = $templateCollection->getTemplate($id);

				if (!$template instanceof iTemplate) {
					throw new ExpectTemplateException('Template id expected');
				}

				$post = Service::Request()->Post();
				$attribute = $attribute ?: $post->get('field');

				if (!$this->isTemplateAttributeExists($attribute)) {
					throw new InvalidArgumentException('Template attribute name expected');
				}

				$value = $value ?: $post->get('value');
				$result = $this->saveTemplateAttributeValue($template, $attribute, $value);
			} catch (Exception $exception) {
				$result = $this->getSimpleErrorMessage($exception);
			}

			$this->printEntityTableControlResult($result);
		}

		/**
		 * Создает шаблон сайта
		 * @param array $formData атрибуты шаблона из формы создания
		 * @param int|null $domainId идентификатор домена
		 * @param int|null $languageId идентификатор языка
		 */
		public function createTemplate(array $formData = [], $domainId = null, $languageId = null) {
			$formData = $formData ?: (array) Service::Request()->Post()->get('data');
			$domainId = $domainId ?: (isset($formData['domain_id']) ? $formData['domain_id'] : false);
			$languageId = $languageId ?: (isset($formData['language_id']) ? $formData['language_id'] : false);

			try {
				$this->validateTemplateCreateFormData($formData);
				$name = $formData[self::NAME_KEY];
				$fileName = $formData[self::FILE_NAME_KEY];
				$isDefault = (bool) $formData[self::IS_DEFAULT_KEY];

				$templateCollection = templatesCollection::getInstance();

				if ($templateCollection->getDefaultTemplate($domainId, $languageId instanceof iTemplate)) {
					$isDefault = false;
				}

				$templateId = $templateCollection
					->addTemplate($fileName, $name, $domainId, $languageId, $isDefault);
				$template = $templateCollection->getTemplate($templateId);

				if (!$template instanceof iTemplate) {
					throw new ExpectTemplateException('Cannot create template');
				}

				$directory = isset($formData[self::DIRECTORY_KEY]) ? $formData[self::DIRECTORY_KEY] : null;
				$template->setName($directory);
				$type = (string) $formData[self::TYPE_KEY];
				$template->setType($type);
				$template->commit();

				$templateCollection->clearCache();
				$template = $templateCollection->getTemplate($templateId);
				$path = $template->getResourcesDirectory();

				$directory = Service::DirectoryFactory()->create($path);

				if ($directory->getIsBroken()) {
					$directory::requireFolder($directory->getPath());
				}

				$result = $this->getSimpleRefreshMessage();
			} catch (Exception $exception) {
				$result = $this->getSimpleErrorMessage($exception);
			}

			$this->printEntityTableControlResult($result);
		}

		/** Возвращает список шаблонов сайта с доменами и языками для инициализации контролов */
		public function domainTemplates() {
			$domainCollection = Service::DomainCollection();
			$languageCollection = Service::LanguageCollection();
			$templateCollection = templatesCollection::getInstance();
			$result = [];

			foreach ($domainCollection->getList() as $domain) {
				/** @var iDomain $domain */
				$domainId = $domain->getId();

				foreach ($languageCollection->getList() as $language) {
					/** @var iLang $language */
					$languageId = $language->getId();

					foreach ($templateCollection->getTemplatesList($domainId, $languageId) as $template) {
						$result['templates']['nodes:template'][] = $template;
					}
				}
			}

			foreach ($domainCollection->getList() as $domain) {
				$result['domains']['nodes:domain'][] = $domain;
			}

			foreach ($languageCollection->getList() as $language) {
				$result['langs']['nodes:lang'][] = $language;
			}

			$this->setDataType('list');
			$this->setActionType('view');

			$this->setData($result);
			$this->doData();
		}

		/**
		 * Меняет шаблон для списка страниц
		 * @param int|null $templateId идентификатор шаблона
		 * @param int[] $pageIdList список идентификаторов страниц
		 */
		public function changeTemplateForPageList($templateId = null, array $pageIdList = []) {
			$templateId = $templateId ?: $this->getDragTargetEntityId();
			$pageIdList = $pageIdList ?: $this->getDraggedEntitiesIdList();

			try {
				$template = templatesCollection::getInstance()
					->getTemplate($templateId);

				if (!$template instanceof iTemplate) {
					$dummy = $this->createDummyTemplate();

					if ($templateId !== $dummy->getId()) {
						throw new ExpectTemplateException('Template id expected');
					}

					$template = $dummy;
				}

				$pageCollection = umiHierarchy::getInstance();

				foreach ($pageIdList as $pageId) {
					$page = $pageCollection->getElement($pageId);

					if (!$page instanceof iUmiHierarchyElement) {
						throw new expectElementException('Page id expected');
					}

					$page->setTplId($template->getId());
					$page->commit();
				}

				$result = $this->getSimpleSuccessMessage();
			} catch (Exception $exception) {
				$result = $this->getSimpleErrorMessage($exception);
			}

			$this->printEntityTableControlResult($result);
		}

		/**
		 * Заглушка для реализации вкладки "Редактор"
		 * @throws coreException
		 * @throws publicAdminException
		 */
		public function getTemplateEditor() {
			if (isDemoMode()) {
				throw new publicAdminException(getLabel('label-stop-in-demo'));
			}
			$this->setConfigResult([]);
		}

		/**
		 * Реализует бэкенд для редактора шаблонов
		 * @throws Exception
		 */
		public function getTemplateEditorConfig() {
			$domainId = Service::DomainDetector()->detectId();
			$languageId = Service::LanguageDetector()->detectId();
			$templateList = templatesCollection::getInstance()
				->getTemplatesList($domainId, $languageId);
			$rootList = [];

			foreach ($templateList as $template) {
				if (!$template->getName()) {
					continue;
				}

				/** @var umiTemplates|$this $module */
				$module = $this->module;
				$rootList[] = $module->getTemplateDirectoryConfig($template);
			}

			$options = [
				'debug' => (bool) mainConfiguration::getInstance()
					->get('debug', 'enabled'),
				'roots' => $rootList
			];

			$connector = new elFinderConnector(new elFinder($options));
			$connector->run();
		}

		/**
		 * Возвращает конфигурацию директории шаблона для редактора шаблонов
		 * @param iTemplate $template шаблон
		 * @return array
		 */
		public function getTemplateDirectoryConfig(iTemplate $template) {
			/** @var umiTemplates|$this $module */
			$module = $this->module;
			$tempPath = $template->getResourcesDirectory() . '/.temp';
			return [
				'id' => $template->getName(),
				'driver' => $module->getFileManagerDriverName(),
				'path' => $template->getResourcesDirectory(),
				'URL' => $template->getResourcesDirectory(true),
				'tmbPath' => $tempPath . '/.tmb/',
				'tmpPath' => $tempPath . '/.tmp/',
				'quarantine' => $tempPath . '/.quarantine/',
				'attributes' => [
					[
						'pattern' => '|\/\.|',
						'hidden' => true
					]
				],
			];
		}

		/**
		 * Возвращает имя драйвера файлового менеджера для редактора шаблонов.
		 * Может быть переопределен в файле customAdmin.php.
		 * Оригинальный файл лежит по пути /styles/common/other/elfinder/php/elFinderVolumeTemplateEditorDriver.php,
		 * Вы можете его унаследовать для добавления своей логики, например для добавления поддержки своих форматов файлов.
		 * @return string
		 */
		public function getFileManagerDriverName() {
			return 'TemplateEditorDriver';
		}

		/**
		 * Выводит в буффер конфигурацию табличного контрола списка бэкапов шаблонов
		 */
		public function flushTemplateBackupsConfig() {
			$config = $this->getTemplateBackupsConfig();
			Service::Response()->printJson($config);
		}

		/**
		 * Возвращает список бэкапов шаблонов для табличного контрола
		 */
		public function getTemplateBackups() {
			if (isDemoMode()) {
				throw new publicAdminException(getLabel('label-stop-in-demo'));
			}

			if (!Service::Request()->isJson()) {
				$this->setDataSetDirectCallMessage();
				return;
			}

			try {
				$fileList = $this->getBackupList();
				$totalCount = count($fileList);
				$fileList = $this->sliceDataRowList($fileList);
				$fileList = $this->prepareBackupList($fileList);
				$result = $this->appendPageNavigation($fileList, $totalCount);
			} catch (\Exception $exception) {
				$result = $this->getEntityTableControlErrorResult($exception);
			}

			$this->printEntityTableControlResult($result);
		}

		/** Создает бэкап */
		public function createBackup() {
			if (isDemoMode()) {
				$result = $this->getSimpleErrorMessage(getLabel('label-stop-in-demo'));
				$this->printEntityTableControlResult($result);
				return;
			}

			try {
				Service::ManifestFactory()
					->create('MakeTemplatesBackup', [], iAtomicOperationCallbackFactory::COMMON)
					->execute();
				$result = $this->getSimpleSuccessMessage();
			} catch (Exception $exception) {
				$result = $this->getSimpleErrorMessage($exception);
			}

			$this->printEntityTableControlResult($result);
		}

		/**
		 * Инициирует скачивание файла бэкапа
		 * @param string|null $fileName имя файла
		 */
		public function downloadBackup($fileName = null) {
			$this->downloadFile($this->getBackupDirectory(), $fileName);
		}

		/**
		 * Инициирует восстановления из бэкапа
		 * @param string|null $fileName имя файла
		 */
		public function restoreFromBackup($fileName = null) {
			if (isDemoMode()) {
				$result = $this->getSimpleErrorMessage(getLabel('label-stop-in-demo'));
				$this->printEntityTableControlResult($result);
				return;
			}

			try {
				$backup = $this->getBackupFile($fileName);
				$params = [
					'filepath' => $backup->getFileName()
				];

				Service::ManifestFactory()
					->create('RestoreTemplatesBackup', $params, iAtomicOperationCallbackFactory::COMMON)
					->execute();
				$result = $this->getSimpleSuccessMessage();
			} catch (Exception $exception) {
				$result = $this->getSimpleErrorMessage($exception);
			}

			$this->printEntityTableControlResult($result);
		}

		/**
		 * Удаляет список бэкапов
		 * @param string[] $fileNameList список имен файлов
		 */
		public function deleteBackupList(array $fileNameList = []) {
			$this->deleteFileList($this->getBackupDirectory(), $fileNameList);
		}

		/**
		 * Возвращает файл бэкапа
		 * @param string $fileName имя файла
		 * @return iUmiFile
		 * @throws ErrorException
		 */
		private function getBackupFile($fileName) {
			$request = Service::Request();
			$fileName = $fileName ?: $request->Get()->get('fileName');
			$fileName = $fileName ?: $request->Post()->get('fileName');
			$filePath = $this->getBackupDirectory()->getPath() . '/' . $fileName;
			$backup = Service::FileFactory()->create($filePath);

			if ($backup->getIsBroken()) {
				throw new ErrorException(sprintf('File "%s" was not found', $fileName));
			}

			return $backup;
		}

		/**
		 * Возвращает список файлов бекапов
		 * @return iUmiFile[]
		 */
		private function getBackupList() {
			$fileList = [];
			$fileFactory = Service::FileFactory();

			foreach ($this->getBackupDirectory()->getFiles('(\.zip)$') as $filePath) {
				$fileList[] = $fileFactory->create($filePath);
			}

			rsort($fileList);
			return $fileList;
		}

		/**
		 * Возвращает директорию с бэкапами
		 * @return iUmiDirectory
		 */
		private function getBackupDirectory() {
			$path = SYS_MANIFEST_PATH . 'backup/templates/';
			return $this->getDirectory($path);
		}

		/**
		 * Подготавливает список бекапов к выводу в табличный контрол
		 * @param iUmiFile[] $fileList
		 * @return array
		 */
		private function prepareBackupList(array $fileList) {
			$result = [];

			foreach ($fileList as $file) {
				$result[] = [
					self::ID_KEY => $file->getFileName(),
					self::FILE_DATE_KEY => $this->getBackupDate($file),
					self::FILE_SIZE_KEY => $this->getBackupSize($file)
				];
			}

			return $result;
		}

		/**
		 * Возвращает дату создания бэкапа
		 * @param iUmiFile $file файл бэкапа
		 * @return string
		 */
		private function getBackupDate(iUmiFile $file) {
			return $file->getBaseFileName();
		}

		/**
		 * Возвращает размер бэкапа в мегабайтах
		 * @param iUmiFile $file файл бэкапа
		 * @return string
		 */
		private function getBackupSize(iUmiFile $file) {
			return $file->getHumanSize();
		}

		/**
		 * Возвращает значения фильтра по названию страницы
		 * @return string|null
		 */
		private function getPageNameFilter() {
			$filter = (array) Service::Request()->Get()->get('fields_filter');
			return isset($filter['name']['like']) ? (string) $filter['name']['like'] : null;
		}

		/**
		 * Возвращает списк имен шаблонов.
		 * Используется для формирования корней дерева шаблонов сайта
		 * @param int $domainId идентификатор домена
		 * @param int $languageId идентификатор языка
		 * @param string|null $nameFilter фильтр по имени страницы
		 * @return void
		 * @throws coreException
		 */
		private function getTemplateRootList($domainId, $languageId, $nameFilter) {
			$domainId = $this->getOrDetectDomainId($domainId);
			$languageId = $this->getOrDetectLanguageId($languageId);
			$templateCollection = templatesCollection::getInstance();

			try {
				$templateList = $templateCollection->getTemplatesList($domainId, $languageId);
				$templateList[] = $this->createDummyTemplate();
				$totalCount = count($templateList);
				$templateList = $this->sliceDataRowList($templateList);
				$templateList = $this->prepareTemplateNameRelatedList($templateList, $nameFilter);
				$result = $this->appendPageNavigation($templateList, $totalCount);
			} catch (\Exception $exception) {
				$result = $this->getEntityTableControlErrorResult($exception);
			}

			$this->printEntityTableControlResult($result);
		}

		/**
		 * Создает шаблон-заглушку
		 * @return iTemplate
		 * @throws privateException
		 */
		private function createDummyTemplate() {
			/** @var UmiCms\System\Hierarchy\Template\iFactory $templateFactory */
			$templateFactory = Service::get('TemplateFactory');
			return $templateFactory->createDummy();
		}

		/**
		 * Возвращает список страниц, использующих шаблон.
		 * Используется для формирования ветвей дерева шаблонов сайта
		 * @param int $templateId идентификатор шаблона
		 * @param string|null $nameFilter фильтр по имени страницы
		 * @return void
		 */
		private function getRelatedPageBranchList($templateId, $nameFilter = null) {
			$templateCollection = templatesCollection::getInstance();

			try {
				$template = $templateCollection->getTemplate($templateId);

				if (!$template instanceof iTemplate) {
					$dummy = $this->createDummyTemplate();

					if ($templateId !== $dummy->getId()) {
						throw new ExpectTemplateException('Template id expected');
					}

					$template = $dummy;
				}

				$limit = $this->getLimit();
				$offset = $this->getOffset($limit);
				$pageList = $template->getRelatedPagesWithNameLike($nameFilter, $limit, $offset);
				$pageList = $this->prepareRelatedPageList($pageList);
				$result = $this->appendPageNavigation($pageList, $template->getTotalUsedPagesWithNameLike($nameFilter));
			} catch (\Exception $exception) {
				$result = $this->getEntityTableControlErrorResult($exception);
			}

			$this->printEntityTableControlResult($result);
		}

		/**
		 * Конвертирует список страниц в список их имен для формирования ветвей дерева шаблонов
		 * @param iUmiHierarchyElement[] $pageList список страниц
		 * @return array
		 */
		private function prepareRelatedPageList(array $pageList) {
			$result = [];

			foreach ($pageList as $page) {
				$moduleId = $page->getModule();
				$result[$page->getId()] = [
					self::ID_KEY => $page->getId(),
					self::NAME_KEY => $page->getName(),
					self::MODULE_ID_KEY => $moduleId,
					self::MODULE_TITLE_KEY => getLabel(sprintf('module-%s', $moduleId))
				];
			}

			return $result;
		}

		/**
		 * Конвертирует список шаблонов в список их имен для формирования корней дерева шаблонов
		 * @param iTemplate[] $templateList список шаблонов
		 * @param string|null $nameFilter фильтр по имени страницы
		 * @return array
		 * @throws privateException
		 * @throws databaseException
		 */
		private function prepareTemplateNameRelatedList(array $templateList, $nameFilter) {
			$result = [];
			$moduleId = 'umiTemplates';
			$moduleTitle = getLabel(sprintf('module-%s', $moduleId));

			foreach ($templateList as $template) {
				$result[$template->getId()] = [
					self::ID_KEY => $template->getId(),
					self::NAME_KEY => $this->getTreeTemplateName($template),
					self::MODULE_ID_KEY => $moduleId,
					self::MODULE_TITLE_KEY => $moduleTitle,
					'__children' => (int) $template->hasRelatedPagesWithNameLike($nameFilter)
				];
			}

			return $result;
		}

		/**
		 * Возвращает имя шаблона для вывода в дереве
		 * @param iTemplate $template шаблон
		 * @return string
		 * @throws privateException
		 */
		private function getTreeTemplateName(iTemplate $template) {
			if ($template->getId() === $this->createDummyTemplate()->getId()) {
				return $template->getTitle();
			}

			return sprintf('%s (%s)', $template->getTitle(), $template->getType());
		}

		/**
		 * Валидирует данные формы создания шаблона сайта
		 * @param array $formData
		 */
		private function validateTemplateCreateFormData(array $formData) {
			if (!isset($formData[self::NAME_KEY], $formData[self::FILE_NAME_KEY], $formData[self::TYPE_KEY], $formData[self::IS_DEFAULT_KEY])) {
				throw new InvalidArgumentException('Template data expected');
			}

			$name = $formData[self::NAME_KEY];

			if (!is_string($name) || $name === '') {
				throw new InvalidArgumentException(getLabel('js-error-label-empty-template-name'));
			}

			$fileName = $formData[self::FILE_NAME_KEY];

			if (!is_string($fileName) || !preg_match('/([a-zA-Z0-9-_]+\.(phtml|xsl|tpl)$)/', $fileName)) {
				throw new InvalidArgumentException(getLabel('js-error-label-invalid-template-file-name'));
			}

			$directory = isset($formData[self::DIRECTORY_KEY]) ? $formData[self::DIRECTORY_KEY] : null;

			if (!is_string($directory) || $directory !== '' && !preg_match('/^([a-zA-Z0-9-_\/]+)/', $directory)) {
				throw new InvalidArgumentException(getLabel('js-error-label-invalid-template-directory'));
			}

			$type = $formData[self::TYPE_KEY];

			if (!in_array($type, $this->getTypeList())) {
				throw new InvalidArgumentException('Incorrect type given');
			}
		}

		/**
		 * Определяет существует ли атрибут шаблона с заданным именем
		 * @param string $name имя атрибута
		 * @return bool
		 */
		private function isTemplateAttributeExists($name) {
			if (!is_string($name) || $name === '') {
				return false;
			}

			foreach ($this->getTemplateListColumnsConfig() as $fieldConfig) {
				if ($fieldConfig['name'] === $name) {
					return true;
				}
			}

			return false;
		}

		/**
		 * Сохраняет значение атрибута шаблона сайта
		 * @param iTemplate $template шаблон сайта
		 * @param string $attribute имя атрибута
		 * @param mixed $value значение атрибута
		 * @return array ответ для табличного контрола
		 * [
		 *		error|success|refresh => bool|string
		 * ]
		 */
		private function saveTemplateAttributeValue(iTemplate $template, $attribute, $value) {
			switch ($attribute) {
				case self::NAME_KEY : {
					$template->setTitle($value);
					$template->commit();
					return $this->getSimpleSuccessMessage();
				}
				case self::FILE_NAME_KEY : {
					$template->setFilename($value);
					$template->commit();
					return $this->getSimpleSuccessMessage();
				}
				case self::DIRECTORY_KEY : {
					$template->setName($value);
					$template->commit();
					return $this->getSimpleSuccessMessage();
				}
				case self::TYPE_KEY : {
					$template->setType($value);
					$template->commit();
					return $this->getSimpleSuccessMessage();
				}
				case self::IS_DEFAULT_KEY : {
					templatesCollection::getInstance()
						->setDefaultTemplate($template->getId());
					return $this->getSimpleRefreshMessage();
				}
				default : {
					return $this->getSimpleErrorMessage(sprintf('Unexpected attribute given "%s"', $attribute));
				}
			}
		}

		/**
		 * Конвертирует список шаблонов в список их атрибутов для вывода
		 * @param iTemplate[] $templateList
		 * @return array
		 */
		private function prepareTemplateList(array $templateList) {
			$result = [];

			foreach ($templateList as $template) {
				$result[$template->getId()] = [
					self::ID_KEY => $template->getId(),
					self::ADMIN_TEMPLATE_ID_KEY => $template->getId(),
					self::NAME_KEY => $template->getTitle(),
					self::FILE_NAME_KEY => $template->getFilename(),
					self::DIRECTORY_KEY => $template->getName(),
					self::TYPE_KEY => $template->getType(),
					self::IS_DEFAULT_KEY => $template->getIsDefault()
				];
			}

			return $result;
		}

		/**
		 * Возвращает конфигурацию табличного контрола списка шаблонов
		 * @return array
		 */
		private function getTemplateListConfig() {
			return [
				'methods' => $this->getTemplateListMethodsConfig(),
				'default' => $this->getTemplateListDefaultVisibleColumnsConfig(),
				'fields' => $this->getTemplateListColumnsConfig()
			];
		}

		/**
		 * Возвращает конфигурацию методов табличного контрола списка шаблонов
		 * @return array
		 */
		private function getTemplateListMethodsConfig() {
			return [
				[
					'title' => getLabel('smc-load'),
					'module' => 'umiTemplates',
					'type' => 'load',
					'name' => 'getTemplateList'
				],
				[
					'title' => getLabel('js-confirm-unrecoverable-yes'),
					'module' => 'umiTemplates',
					'type' => 'delete',
					'name' => 'deleteTemplateList'
				],
				[
					'title' => getLabel('js-confirm-unrecoverable-yes'),
					'module' => 'umiTemplates',
					'type' => 'saveField',
					'name' => 'setTemplateAttributeValue'
				]
			];
		}

		/**
		 * Возвращает список полей, отображаемых в табличном контроле списка шаблонов по умолчанию
		 * @return string
		 */
		private function getTemplateListDefaultVisibleColumnsConfig() {
			return implode('|', [
				self::ADMIN_TEMPLATE_ID_KEY . '[120px]',
				self::NAME_KEY . '[250px]',
				self::FILE_NAME_KEY . '[300px]',
				self::DIRECTORY_KEY . '[200px]',
				self::TYPE_KEY . '[200px]',
				self::IS_DEFAULT_KEY . '[200px]'
			]);
		}

		/**
		 * Возвращает конфигурацию полей табличного контрола списка шаблонов
		 * @return array
		 */
		private function getTemplateListColumnsConfig() {
			return [
				[
					'name' => self::ADMIN_TEMPLATE_ID_KEY,
					'title' => getLabel('js-label-template-id'),
					'type' => 'integer',
					'show_edit_page_link' => 'false',
					'editable' => 'false',
					'filterable' => 'false',
					'sortable' => 'false'
				],
				[
					'name' => self::NAME_KEY,
					'title' => getLabel('js-label-template-title'),
					'type' => 'string',
					'show_edit_page_link' => 'false',
					'filterable' => 'false',
					'sortable' => 'false'
				],
				[
					'name' => self::FILE_NAME_KEY,
					'title' => getLabel('js-label-template-filename'),
					'type' => 'string',
					'show_edit_page_link' => 'false',
					'filterable' => 'false',
					'sortable' => 'false'
				],
				[
					'name' => self::DIRECTORY_KEY,
					'title' => getLabel('js-label-template-directory'),
					'type' => 'string',
					'show_edit_page_link' => 'false',
					'filterable' => 'false',
					'sortable' => 'false'
				],
				[
					'name' => self::TYPE_KEY,
					'title' => getLabel('js-label-template-type'),
					'type' => 'relation',
					'show_edit_page_link' => 'false',
					'multiple' => 'false',
					'options' => implode(',', $this->getTypeList()),
					'filterable' => 'false',
					'sortable' => 'false'
				],
				[
					'name' => self::IS_DEFAULT_KEY,
					'title' => getLabel('js-label-template-is-default'),
					'type' => 'bool',
					'show_edit_page_link' => 'false',
					'filterable' => 'false',
					'sortable' => 'false'
				]
			];
		}

		/**
		 * Возвращает список доступных типов шаблона
		 * @return string[]
		 */
		private function getTypeList() {
			return [
				'php',
				'xslt',
				'tpls'
			];
		}

		/**
		 * Возвращает конфигурацию табличного контрола дерева шаблонов
		 * @return array
		 */
		private function getRelatedPageTreeConfig() {
			return [
				'methods' => $this->getRelatedPageTreeMethodsConfig(),
				'default' => $this->getRelatedPageTreeDefaultVisibleColumnsConfig(),
				'fields' => $this->getRelatedPageTreeColumnsConfig()
			];
		}

		/**
		 * Возвращает конфигурацию методов табличного контрола дерева шаблонов
		 * @return array
		 */
		private function getRelatedPageTreeMethodsConfig() {
			return [
				[
					'title' => getLabel('smc-load'),
					'module' => 'umiTemplates',
					'type' => 'load',
					'name' => 'getRelatedPageTree'
				],
				[
					'title' => getLabel('smc-move'),
					'module' => 'umiTemplates',
					'type' => 'move',
					'name' => 'changeTemplateForPageList'
				]
			];
		}

		/**
		 * Возвращает список полей, отображаемых в табличном контроле дерева шаблонов по умолчанию
		 * @return string
		 */
		private function getRelatedPageTreeDefaultVisibleColumnsConfig() {
			return implode('|', [
				self::NAME_KEY . '[800px]',
				self::MODULE_TITLE_KEY . '[200px]'
			]);
		}

		/**
		 * Возвращает конфигурацию полей табличного контрола дерева шаблонов
		 * @return array
		 */
		private function getRelatedPageTreeColumnsConfig() {
			return [
				[
					'name' => self::NAME_KEY,
					'title' => getLabel('js-label-template-title'),
					'type' => 'string',
					'show_edit_page_link' => 'false',
					'sortable' => 'false',
					'editable' => 'false'
				],
				[
					'name' => self::MODULE_TITLE_KEY,
					'title' => getLabel('label-module'),
					'type' => 'string',
					'filterable' => 'false',
					'sortable' => 'false',
					'editable' => 'false'
				]
			];
		}

		/**
		 * Возвращает конфигурацию табличного контрола бэкапов шаблонов
		 * @return array
		 */
		private function getTemplateBackupsConfig() {
			return [
				'methods' => $this->getTemplateBackupsMethodsConfig(),
				'default' => $this->getTemplateBackupsDefaultVisibleColumnsConfig(),
				'fields' => $this->getTemplateBackupsColumnsConfig()
			];
		}

		/**
		 * Возвращает конфигурацию методов табличного контрола бэкапов шаблонов
		 * @return array
		 */
		private function getTemplateBackupsMethodsConfig() {
			return [
				[
					'title' => getLabel('smc-load'),
					'module' => 'umiTemplates',
					'type' => 'load',
					'name' => 'getTemplateBackups'
				]
			];
		}

		/**
		 * Возвращает список полей, отображаемых в табличном контроле бэкапов шаблонов по умолчанию
		 * @return string
		 */
		private function getTemplateBackupsDefaultVisibleColumnsConfig() {
			return implode('|', [
				self::FILE_DATE_KEY . '[350px]',
				self::FILE_SIZE_KEY . '[350px]'
			]);
		}

		/**
		 * Возвращает конфигурацию полей табличного контрола бэкапов шаблонов
		 * @return array
		 */
		private function getTemplateBackupsColumnsConfig() {
			return [
				[
					'name' => self::FILE_DATE_KEY,
					'title' => getLabel('label-file-date'),
					'type' => 'string',
					'show_edit_page_link' => 'false',
					'filterable' => 'false',
					'sortable' => 'false',
					'editable' => 'false'
				],
				[
					'name' => self::FILE_SIZE_KEY,
					'title' => getLabel('label-file-size'),
					'type' => 'string',
					'filterable' => 'false',
					'sortable' => 'false',
					'editable' => 'false'
				]
			];
		}
	}