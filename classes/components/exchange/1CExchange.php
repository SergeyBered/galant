<?php

	use UmiCms\Service;
	use UmiCms\Classes\System\Utils\DOM\Document\iFactory as iDomDocumentFactory;

	/**
	 * Класс интеграции с системой «1С:Предприятие» редакции «Управление торговлей».
	 *
	 * Умеет:
	 *
	 * 1) Импортировать из 1С каталог, предложения, заказы.
	 * 2) Экспортировать в 1С каталог, заказы.
	 *
	 * За импорт из 1С каталога, предложений, заказов и экспорт в 1С заказов отвечает метод auto().
	 * За экспорт в 1С каталог отвечает метод export1C().
	 *
	 * @see http://help.docs.umi-cms.ru/vvedenie/integraciya_s_1supravlenie_torgovlej/
	 */
	class OneCExchange {

		/** @var exchange|OneCExchange $module */
		public $module;

		/** @var string $importDirectory относительный путь до директории, куда файлы от 1C */
		public $importDirectory = '/1c_import/';

		/** @var string статус успешного завершения синхронизации */
		public $success = 'success';

		/**
		 * Обрабатывает запрос от 1С и прозводит запрошенную операцию.
		 * Результат операции выводится в буффер.
		 *
		 * Операции:
		 *
		 * 1) catalog-checkauth - авторизоваться для импорта каталога и предложений в UMI.CMS;
		 * 2) sale-checkauth  - авторизоваться для двустороннего обмена данными заказов;
		 * 3) catalog-init - инициировать импорт каталога и предложений в UMI.CMS;
		 * 4) sale-init - инициировать двусторонний обмен данными заказов;
		 * 5) catalog-file - сохранить передаваемый файл в UMI.CMS;
		 * 6) catalog-import - импортировать файлы каталога и предложений в UMI.CMS;
		 * 7) sale-query - экспортировать список заказов в 1С;
		 * 8) sale-success - инициировать успешное завершение экспорта заказов;
		 * 9) sale-file - импортировать данные заказов в UMI.CMS;
		 *
		 * @throws publicException
		 * @throws coreException
		 * @throws baseException
		 * @throws databaseException
		 * @throws wrongParamException
		 */
		public function auto() {
			$umiConfig = mainConfiguration::getInstance();
			$timeOut = (int) $umiConfig->get('modules', 'exchange.commerceML.timeout');

			if ($timeOut < 0) {
				$timeOut = 0;
			}

			sleep($timeOut);

			$type = getRequest('type');
			$mode = getRequest('mode');
			$instance1c = getRequest('param0') ? md5(getRequest('param0')) . '/' : '';
			$this->importDirectory = SYS_TEMP_PATH . '/1c_import/' . $instance1c;

			$module = $this->module;
			$buffer = $this->getBuffer();
			$module->checkAuth($buffer);

			$session = Service::Session();
			$sessionId = $session->getId();
			$sessionName = $session->getName();

			switch ($type . '-' . $mode) {
				case 'catalog-checkauth':
				case 'sale-checkauth': {
					$buffer->push("success\n$sessionName\n" . $sessionId);
					break;
				}
				case 'catalog-init':
				case 'sale-init': {
					removeDirectory($this->importDirectory);

					$maxFileSize = (int) $umiConfig->get('modules', 'exchange.commerceML.maxFileSize');

					if ($maxFileSize <= 0) {
						$maxFileSize = 102400;
					}

					$isZipAcceptable = $umiConfig->get('modules', 'exchange.commerceML.accept-zip');
					$zipResponse = $isZipAcceptable ? 'yes' : 'no';

					$buffer->push("zip={$zipResponse}\nfile_limit={$maxFileSize}");
					break;
				}
				case 'catalog-file': {
					$buffer->push($module->saveIncomingFile());
					break;
				}
				case 'catalog-import' : {
					$buffer->push($module->importCommerceML());
					break;
				}
				case 'sale-query' : {
					$buffer->push($module->exportOrders());
					break;
				}
				case 'sale-success' : {
					$buffer->push($module->markExportedOrders());
					break;
				}
				case 'sale-file' : {
					$buffer->push($module->importOrders());
					break;
				}
				default: {
					$buffer->push("failure\nUnknown import type ($type) or mode ($mode).");
				}
			}

			$buffer->end();
		}

		/**
		 * Возвращает буффер вывода для 1С
		 * @return iOutputBuffer
		 */
		public function getBuffer() : iOutputBuffer {
			$buffer = Service::Response()
				->getCurrentBuffer();
			$buffer->charset('utf-8');
			$buffer->contentType('text/plain');
			return $buffer;
		}

		/**
		 * Определяет авторизован ли пользователь
		 * @param iOutputBuffer $buffer буффер вывода
		 * @return iOutputBuffer
		 */
		public function checkAuth(iOutputBuffer $buffer) : iOutputBuffer {
			if (!permissionsCollection::getInstance()->isAdmin()) {
				$buffer->push("failure\nNot authorized as administrator.");
				$buffer->end();
			}

			return $buffer;
		}

		/** Выводит в буффер настройки заказов для УНФ */
		public function orderSettings() : void {
			$module = $this->module;
			$buffer = $module->getBuffer();

			try {
				$module->checkAuth($buffer);
				/** @var ordersSettingsExporter $exporter */
				$exporter = umiExporter::get('ordersSettings');
				$exporter->setOutputBuffer();
				$document = $exporter->export([], []);
				Service::Response()->printXml($document);
			} catch (Exception $e) {
				$buffer->push("failure\n{$e->getMessage()}");
			}

			$buffer->end();
		}

		/**
		 * Принимает запрос от внешней обработки для 1С и проводит запрошенную операцию.
		 * Результат операции выводится в буффер.
		 *
		 * Операции:
		 *
		 * 1) 'catalog' - экспортировать каталог товаров во внешнюю обработку 1С;
		 * 2) 'identification' - добавить связи между идентификаторами сущностей в UMI.CMS
		 * и в 1С.
		 *
		 * @return mixed
		 * @throws coreException
		 * @throws publicAdminException
		 * @throws ErrorException
		 */
		public function export1C() {
			$module = $this->module;

			if (!permissionsCollection::getInstance()->isAdmin()) {
				$module->reportError(getLabel('error-wrong-user'));
			}

			$mode = getRequest('mode');

			switch ($mode) {
				case 'catalog': {
					$module->exportCatalog();
					break;
				}
				case 'identification': {
					$module->makeRelations();
					break;
				}
				default: {
					$module->reportError(getLabel('error-unknown-action-type') . ' "' . $mode . '".');
				}
			}
		}

		/**
		 * Валидирует файл, отправленный 1С, и
		 * инициирует его сохранение.
		 * @return string
		 * @throws Exception
		 */
		public function saveIncomingFile() {
			$fileName = (string) getRequest('filename');

			if ($fileName === '') {
				return "failure\nEmpty filename.";
			}

			$extension = (string) getPathInfo($fileName, 'extension');

			if ($extension === '' || !umiFile::isAllowedFileType($extension)) {
				return "failure\nUnknown file type.";
			}

			if (!is_dir($this->importDirectory)) {
				mkdir($this->importDirectory, 0777, true);
			}

			return $this->module->saveFile($fileName);
		}

		/**
		 * Сохраняет файл и возвращает статус операции
		 * @param string $fileName имя файла
		 * @param string $fileContent содержимое файла, если не передано, то содержмое файла
		 * будет получено из тела запроса
		 * @return string
		 * @throws Exception
		 */
		public function saveFile($fileName, $fileContent = '') {
			$extension = getPathInfo($fileName, 'extension');

			if ($extension === '' || !umiFile::isAllowedFileType($extension)) {
				return "failure\nUnknown file type.";
			}

			$content = $fileContent ?: Service::Request()->getRawBody();
			$session = Service::Session();
			$fileNameFromSession = $session->get('1c_latest_catalog-file');
			$writingMode = (($fileNameFromSession == $fileName && !$fileContent) ? FILE_APPEND : 0);

			$dirName = getPathInfo($fileName, 'dirname');
			$module = $this->module;

			switch ($extension) {
				case 'xml': {
					$status = $module->saveXMLFile($fileName, $content, $writingMode);
					break;
				}
				case 'zip': {
					$status = $module->saveZipFile($fileName, $content, $writingMode);
					break;
				}
				default: {
					$status = $module->saveImageFile($fileName, $content, $dirName, $writingMode);
				}
			}

			$session->set('1c_latest_catalog-file', $fileName);
			return $status;
		}

		/**
		 * Сохраняет XML-файл на сервер и возвращает статус операции
		 * @param string $fileName имя файла
		 * @param string $content содержимое файла
		 * @param int $writingMode режим записи файла
		 * @return string
		 */
		public function saveXMLFile($fileName, $content, $writingMode) {
			file_put_contents($this->importDirectory . $fileName, $content, $writingMode);
			return $this->success;
		}

		/**
		 * Сохраняет ZIP-архив на сервер и возвращает статус операции
		 * @param string $fileName имя файла
		 * @param string $content содержимое файла
		 * @param int $writingMode режим записи файла
		 * @return string
		 * @throws Exception
		 */
		public function saveZipFile($fileName, $content, $writingMode) {
			$filePath = $this->importDirectory . $fileName;
			file_put_contents($filePath, $content, $writingMode);

			$workingDir = getcwd();
			$importDirectoryFull = $this->importDirectory;
			chdir($importDirectoryFull);

			$zipArchive = new UmiZipArchive($fileName);
			$extractedFiles = $zipArchive->extract();
			chdir($workingDir);

			if (!is_array($extractedFiles) || (is_int($extractedFiles) && $extractedFiles === 0)) {
				return "failure\nCan't extract zip archive.";
			}

			foreach ($extractedFiles as $fileInfo) {
				$fileName = $fileInfo['stored_filename'];
				$filePath = $this->importDirectory . $fileName;

				if (is_file($filePath)) {
					$fileContent = file_get_contents($filePath);
					$this->module->saveFile($fileName, $fileContent);
				}
			}

			return $this->success;
		}

		/**
		 * Сохраняет изображение на сервер и возвращает статус операции
		 * @param string $filePath путь до файла
		 * @param string $content содержимое файла
		 * @param string $dirPath путь до директории, в которой находится файл
		 * @param int $writingMode режим записи файла
		 * @return string
		 */
		public function saveImageFile($filePath, $content, $dirPath, $writingMode) {
			$quota = getBytesFromString(mainConfiguration::getInstance()->get('system', 'quota-files-and-images'));

			if ($quota != 0) {
				if ((getBusyDiskSize() + mb_strlen($content)) >= $quota) {
					return "failure\nReached maximum allowed size for /files and /images directories.";
				}
			}

			$imagesDirPath = USER_IMAGES_PATH . '/cms/data/';

			if ($dirPath !== '.' && $dirPath !== '..') {
				$imagesDirPath .= $dirPath . '/';
			}

			if (!is_dir($imagesDirPath)) {
				mkdir($imagesDirPath, 0777, true);
			}

			$fileName = getPathInfo($filePath, 'basename');
			$newFilePath = $imagesDirPath . $fileName;

			file_put_contents($newFilePath, $content, $writingMode);

			if (realpath($newFilePath) != $newFilePath) {
				unlink($newFilePath);
				return "failure\nWrong file path.";
			}

			return $this->success;
		}

		/**
		 * Производит одну итерацию импорта данных о каталоге и предложениях
		 * со стороны 1С в формате commerceML и возвращает результат операции.
		 * @return string
		 * @throws baseException
		 * @throws coreException
		 * @throws databaseException
		 * @throws publicException
		 * @throws wrongParamException
		 * @throws Exception
		 */
		public function importCommerceML() {
			$file_name = getRequest('filename');
			$file_path = $this->importDirectory . $file_name;

			if (!is_file($file_path)) {
				return "failure\nFile $file_path does not exist.";
			}

			$session = Service::Session();
			$import_offset = (int) $session->get('1c_import_offset');
			$umiConfig = mainConfiguration::getInstance();

			$blockSize = (int) $umiConfig->get('modules', 'exchange.splitter.limit');

			if ($blockSize < 0) {
				$blockSize = 25;
			}

			$splitterName = (string) $umiConfig->get('modules', 'exchange.commerceML.splitter');

			if (!trim(mb_strlen($splitterName))) {
				$splitterName = 'commerceML2';
			}
			/** @var iUmiImportSplitter|umiImportSplitter $splitter */
			$splitter = umiImportSplitter::get($splitterName);
			$splitter->load($file_path, $blockSize, $import_offset);
			$doc = $splitter->getDocument();
			$xml = $splitter->translate($doc);

			$oldIgnoreSiteMap = umiHierarchy::$ignoreSiteMap;
			umiHierarchy::$ignoreSiteMap = true;

			$importer = new xmlImporter();
			$importer->loadXmlString($xml);
			$importer->setIgnoreParentGroups($splitter->ignoreParentGroups);
			$importer->setAutoGuideCreation($splitter->autoGuideCreation);
			$importer->setRenameFiles($splitter->getRenameFiles());
			$domainId = Service::DomainDetector()->detectId();
			$importer->setForcedDomainId($domainId);

			$writeFileLog = Service::get('ExchangeSettingsFactory')
				->getCurrentSettings()
				->getWriteImportLog();

			$importer->setWriteLogFile($writeFileLog)
				->setImportFormat($splitterName)
				->setCalledFrom('1C');
			$importer->execute();

			umiHierarchy::$ignoreSiteMap = $oldIgnoreSiteMap;
			$session->set('1c_import_offset', $splitter->getOffset());
			$resultMessage = "progress\nImported elements: " . $splitter->getOffset();

			if ($splitter->getIsComplete()) {
				$importFinished = new umiEventPoint('exchangeOnAutoFinish');
				$importFinished->setMode('after');
				$importFinished->addRef('splitter', $splitter);
				$importFinished->call();
				$session->set('1c_import_offset', 0);
				$resultMessage = "success\nComplete. Imported elements: " . $splitter->getOffset();
			}

			return $resultMessage;
		}

		/**
		 * Экспортирует заказы с сайта и возвращает результат экспорта.
		 * @return mixed|string
		 * @throws publicException
		 */
		public function exportOrders() {
			/** @var ordersCommerceMLExporter $exporter */
			$exporter = umiExporter::get('ordersCommerceML');
			$exporter->setOutputBuffer();
			return $exporter->export([], []);
		}

		/**
		 * Импортирует данные о заказах со стороны 1С в формате CommerceML
		 * и возвращает результат операции.
		 * @return string
		 * @throws publicException
		 * @throws coreException
		 * @throws baseException
		 * @throws databaseException
		 * @throws wrongParamException
		 */
		public function importOrders() : string {
			$module = $this->module;
			$module->saveIncomingFile();
			$fileName = getRequest('filename');
			$filePath = $this->importDirectory . $fileName;

			$file = Service::FileFactory()->create($filePath);

			if ($file->getExt() == 'zip') {
				try {
					$module->importOrdersFromZip($filePath);
					return 'success';
				} catch (FileNotFoundException $e) {
					return $e->getMessage();
				}
			}

			try {
				$module->importOrdersFromFile($filePath);
				return 'success';
			} catch (FileNotFoundException $e) {
				return $e->getMessage();
			}
		}

		/**
		 * Ставит пометку всем заказам сайта, что их
		 * не нужно экспортировать в 1С.
		 * @return string
		 * @throws selectorException
		 * @throws coreException
		 */
		public function markExportedOrders() {
			$session = Service::Session();
			$orders = new selector('objects');
			$orders->types('object-type')->name('emarket', 'order');
			$orders->where('need_export')->equals(1);

			$orderIdList = $session->get('exportOrderIdList');
			if (!$orderIdList) {
				return 'success';
			}
			$orders->where('id')->equals($orderIdList);
			$orders->order('id')->asc();

			$config = mainConfiguration::getInstance();

			if ($config->get('modules', 'exchange.commerceML.ordersByDomains')) {
				$orders->where('domain_id')->equals(Service::DomainDetector()->detectId());
			}

			/** @var iUmiObject $order */
			foreach ($orders as $order) {
				$order->setValue('need_export', false);
				$order->commit();
			}
			$session->del('exportOrderIdList');

			return 'success';
		}

		/**
		 * Выводит в буффер каталог в формате commerceML, который
		 * импортирует внешняя обработка 1С.
		 * @throws coreException
		 * @throws ErrorException
		 */
		public function exportCatalog() {
			$module = $this->module;
			$export = $module->getExport();
			$exporter = $module->getExporter($export);
			$elements = $module->get1CElementsToExport($export);

			if (umiCount($elements) == 0) {
				@unlink(SYS_TEMP_PATH . "/export/{$export->getId()}.txt");
				$buffer = Service::Response()
					->getCurrentBuffer();
				$buffer->charset('utf-8');
				$buffer->contentType('text/plain');
				$buffer->push('complete');
				$buffer->end();
			}

			$umiDump = $module->dumpElementList($exporter->getSourceName(), $elements);

			$style_file = './xsl/export/' . $exporter->getType() . '.xsl';
			if (!is_file($style_file)) {
				$module->reportError(getLabel('error-no-export-template', false, $style_file));
			}

			$doc = new DOMDocument('1.0', 'utf-8');
			$doc->formatOutput = XML_FORMAT_OUTPUT;
			$doc->loadXML($umiDump);

			$templater = umiTemplater::create('XSLT', $style_file);
			$result = $templater->parse($doc);

			/** @var iOutputBuffer $buffer */
			$buffer = $exporter->setOutputBuffer();
			$buffer->push($result);
			$buffer->end();
		}

		/**
		 * Экспортирует список страниц и возвращает результат экспорта - xml в формате umiDump2.0
		 * @param string $sourceName название источника экспорта
		 * @param int[] $elementList список идентификаторов страниц
		 * @return string
		 */
		public function dumpElementList($sourceName, array $elementList) {
			return $this->module->buildElementListExporter($sourceName, $elementList)
				->execute()
				->saveXML();
		}

		/**
		 * Создает экспортер списка страниц
		 * @param string $sourceName название источника экспорта
		 * @param int[] $elementList список идентификаторов страниц
		 * @return xmlExporter
		 */
		public function buildElementListExporter($sourceName, array $elementList) {
			$xmlExporter = new xmlExporter($sourceName);
			$xmlExporter->addElements($elementList);
			$xmlExporter->setIgnoreRelations();
			return $xmlExporter;
		}

		/**
		 * Устанавливает связь между идентификаторами сущностей в UMI.CMS и в 1C
		 * и выводить результат в буффер.
		 *
		 * Обрабатывает сущности:
		 *
		 * 1) Товар;
		 * 2) Группа товаров;
		 * 3) Характеристика;
		 *
		 * @throws coreException
		 * @throws publicAdminException
		 */
		public function makeRelations() {
			$module = $this->module;
			$handle = fopen('php://input', 'r');

			if ($handle === false) {
				$module->reportError(getLabel('error-cant-get-data'));
			}

			/** @var umiImportRelations $relations */
			$relations = umiImportRelations::getInstance();
			$sourceId = $relations->getSourceId('commerceML2');

			if (!$sourceId) {
				$sourceId = $relations->addNewSource('commerceML2');
			}

			while (($data = fgets($handle, 1000)) !== false) {

				file_put_contents(CURRENT_WORKING_DIR . '/1cexport.log', 'data: ' . $data . "\n", FILE_APPEND);
				$data = explode(';', $data);

				if (umiCount($data) != 4) {
					$module->reportError(getLabel('error-wrong-identification-data-format'));
				}

				list ($umiId, $type, $guid, $title) = $data;

				switch ($type) {
					case 'group':
					case 'good': {
						$id = ltrim(substr_replace($umiId, '', 0, 2), '0');

						if (!filter_var($id, FILTER_VALIDATE_INT) || !umiHierarchy::getInstance()->isExists($id)) {
							$module->reportError(getLabel('error-no-element', false, $id));
						}

						$relations->setIdRelation($sourceId, $guid, $id);
						break;
					}
					case 'property': {
						list($typeId, $fieldId) = explode('_', ltrim(substr_replace($umiId, '', 0, 2), '0'));

						$umiObjectTypesCollection = umiObjectTypesCollection::getInstance();
						$umiFieldsCollection = umiFieldsCollection::getInstance();

						if (!filter_var($typeId, FILTER_VALIDATE_INT) ||
							!$umiObjectTypesCollection->getType($typeId) instanceof iUmiObjectType) {
							$module->reportError(getLabel('error-no-type', false, $typeId));
						}

						if (!filter_var($fieldId, FILTER_VALIDATE_INT) ||
							!$umiFieldsCollection->getField($fieldId) instanceof iUmiField) {
							$module->reportError(getLabel('error-no-field', false, $fieldId));
						}

						$name = umiHierarchy::convertAltName(trim($title), '_');
						$name = umiObjectProperty::filterInputString($name);

						if ($name === '') {
							$name = '_';
						}

						$name = mb_substr($name, 0, 64);
						$relations->setFieldIdRelation($sourceId, $typeId, $name, $fieldId);
						break;
					}
					default: {
						$module->reportError(getLabel('error-wrong-entity-type') . ' "' . $type . '".');
					}
				}
			}

			fclose($handle);

			$buffer = Service::Response()
				->getCurrentBuffer();
			$buffer->charset('utf-8');
			$buffer->contentType('text/plain');
			$buffer->push('complete');
			$buffer->end();
		}

		/**
		 * Выводит сообщение об ошибке запроса со стороны внешней обработке 1С
		 * в буффер.
		 * @param string $message сообщение об ошибке
		 */
		public function reportError($message) {
			$buffer = Service::Response()
				->getCurrentBuffer();
			$buffer->charset('utf-8');
			$buffer->contentType('text/plain');
			$buffer->push("error\n{$message}");
			$buffer->end();
		}

		/**
		 * Возвращает экспортер, соответствующий сценарию экспорта
		 * @param iUmiObject $export сценарий экспорта
		 * @return mixed
		 */
		public function getExporter(iUmiObject $export) {
			$objects = umiObjectsCollection::getInstance();

			$formatId = $export->getValue('format');
			$exportFormat = $objects->getObject($formatId);
			$module = $this->module;

			if (!$exportFormat instanceof iUmiObject || $exportFormat->getGUID() != 'exchange-export-commerceml') {
				$module->reportError(getLabel('error-wrong-export-format'));
			}

			$exportSuffix = $exportFormat->getValue('sid');

			try {
				$exporter = umiExporter::get($exportSuffix);
			} catch (Exception $e) {
				$exporter = null;
				$module->reportError($e->getMessage());
			}

			return $exporter;
		}

		/**
		 * Возвращает сценарий экспорт
		 * @return bool|umiObject
		 */
		public function getExport() {
			$exportId = getRequest('param0');
			$export = umiObjectsCollection::getInstance()->getObject($exportId);

			if (!$export instanceof iUmiObject) {
				$this->module->reportError(getLabel('error-wrong-export-id'));
			}

			return $export;
		}

		/**
		 * Возвращает список идентификаторов разделов и объектов каталога,
		 * которые необходимо передать внешней обработке 1С.
		 * @param iUmiObject $export сценарий экспорта
		 * @return array
		 * @throws selectorException
		 */
		public function get1CElementsToExport(iUmiObject $export) {
			$limit = getRequest('package_size');
			$packageNumber = getRequest('package');

			if ($limit <= 0 || $packageNumber < 0) {
				$this->module->reportError(getLabel('error-impossible-export-parametrs'));
			}

			$elementsToExport = [];
			$cacheFileDir = SYS_TEMP_PATH . '/export/';

			if (!is_dir($cacheFileDir)) {
				mkdir($cacheFileDir, 0777, true);
			}

			$cacheFile = $cacheFileDir . $export->getId() . '.txt';
			$hierarchy = umiHierarchy::getInstance();

			if (!file_exists($cacheFile) || getRequest('package') == 0) {
				$branches = $export->getValue('elements');
				$excludedBranches = $export->getValue('excluded_elements');

				if (!umiCount($branches)) {
					$sel = new selector('pages');
					$sel->where('hierarchy')->page(0)->childs(0);
					$sel->types('hierarchy-type')->name('catalog', 'category');
					$sel->types('hierarchy-type')->name('catalog', 'object');
					$branches = $sel->result();
				}

				foreach ($branches as $element) {
					if (!$element instanceof iUmiHierarchyElement) {
						$element = $hierarchy->getElement($element, true, true);
					}

					if (!$element instanceof iUmiHierarchyElement) {
						continue;
					}

					$elementId = $element->getId();
					$elementsToExport[$elementId] = $elementId;

					$level = $hierarchy->getMaxNestingLevel($elementId);
					if (!$level) {
						continue;
					}

					for ($i = 1; $i <= $level; $i++) {
						$sel = new selector('pages');
						$sel->option('return')->value('id');
						$sel->where('hierarchy')->page($elementId)->childs($i);
						$sel->types('hierarchy-type')->name('catalog', 'category');
						$sel->types('hierarchy-type')->name('catalog', 'object');
						foreach ($sel->result() as $res) {
							$elementsToExport[$res['id']] = $res['id'];
						}
					}
				}

				foreach ($excludedBranches as $element) {
					if (!$element instanceof iUmiHierarchyElement) {
						$element = $hierarchy->getElement($element, true, true);
					}

					if (!$element instanceof iUmiHierarchyElement) {
						continue;
					}

					$elementId = $element->getId();

					if (isset($elementsToExport[$elementId])) {
						unset($elementsToExport[$elementId]);
					}

					$level = $hierarchy->getMaxNestingLevel($elementId);

					if (!$level) {
						continue;
					}

					for ($i = 1; $i <= $level; $i++) {
						$sel = new selector('pages');
						$sel->option('return')->value('id');
						$sel->where('hierarchy')->page($elementId)->childs($i);
						foreach ($sel->result() as $res) {
							if (isset($elementsToExport[$res['id']])) {
								unset($elementsToExport[$res['id']]);
							}
						}
					}
				}
			} else {
				$elementsToExport = unserialize(file_get_contents($cacheFile));
			}

			$offset = $packageNumber * $limit;
			$nextElements = array_slice($elementsToExport, $offset, $limit);
			$elements = [];

			foreach ($nextElements as $elementId) {
				$parents = $hierarchy->getAllParents($elementId, true);
				$usedParents = array_intersect($parents, $elementsToExport);

				foreach ($usedParents as $parent) {
					$elements[] = $parent;
				}
			}

			return array_unique($elements);
		}

		/**
		 * Импортирует заказы из zip-архива
		 * @param string $filePath путь до архива с файлами импорта
		 * @return void
		 * @throws Exception
		 * @throws baseException
		 * @throws coreException
		 * @throws databaseException
		 * @throws publicException
		 * @throws wrongParamException
		 * @throws FileNotFoundException
		 */
		public function importOrdersFromZip(string $filePath) : void {
			if (!is_file($filePath)) {
				throw new FileNotFoundException("File $filePath is not exists.");
			}

			$zipArchive = new UmiZipArchive($filePath);
			$archiveFiles = $zipArchive->listContent();

			if (isset($archiveFiles) && is_array($archiveFiles)) {
				foreach ($archiveFiles as $archiveFile) {
					$filePath = $this->importDirectory . $archiveFile['filename'];
					$this->module->importOrdersFromFile($filePath);
				}
			}
		}

		/**
		 * Импортирует заказы из файла в формате CommerceML
		 * @param string $filePath путь до импортируемого файла
		 * @return void
		 * @throws baseException
		 * @throws coreException
		 * @throws databaseException
		 * @throws publicException
		 * @throws wrongParamException
		 * @throws FileNotFoundException
		 * @throws Exception
		 */
		public function importOrdersFromFile(string $filePath) : void {
			if (!is_file($filePath)) {
				throw new FileNotFoundException("File $filePath is not exists.");
			}

			$splitterName = (string) mainConfiguration::getInstance()->get('modules', 'exchange.commerceML.splitter');

			if (!trim(mb_strlen($splitterName))) {
				$splitterName = 'commerceML2';
			}

			/** @var iUmiImportSplitter|umiImportSplitter $splitter */
			$splitter = umiImportSplitter::get($splitterName);
			$splitter->load($filePath);
			$doc = $splitter->getDocument();
			$xml = $splitter->translate($doc);

			$importer = new xmlImporter();
			$importer->loadXmlString($xml);
			$importer->setIgnoreParentGroups($splitter->ignoreParentGroups);
			$importer->setAutoGuideCreation($splitter->autoGuideCreation);

			$writeFileLog = Service::get('ExchangeSettingsFactory')
				->getCurrentSettings()
				->getWriteImportLog();

			$importer->setWriteLogFile($writeFileLog)
				->setImportFormat($splitterName)
				->setCalledFrom('1C');
			$importer->execute();
		}
	}
