<?php

	namespace UmiCms\Classes\Components\Exchange;

	use UmiCms\Service;

	/** Класс функционала редактора 1С-идентификаторов */
	class OneCIdentifierEditor implements \iModulePart {

		use \tModulePart;

		/** @var string ключевое имя атрибута редактора 1С-индентификаторов - id страницы */
		const IDS_PAGE_ID = 'page_id';
		/** @var string ключевое имя атрибута редактора 1С-индентификаторов - название страницы */
		const IDS_PAGE_NAME = 'page_name';
		/** @var string ключевое имя атрибута редактора 1С-индентификаторов - id товара в 1С */
		const IDS_CML_ID = 'cml_id';

		/** @var \ExchangeAdmin $admin базовый класс административной панели модуля */
		private $admin;
		/** @var null Идентификатор запрошенной страницы */
		private $requestedPageId = null;

		/**
		 * Конструктор
		 * @param \exchange $module экземпляр модуля "Обмен данными"
		 * @throws \coreException
		 */
		public function __construct(\exchange $module) {
			if (!$module->isClassImplemented($module::ADMIN_CLASS)) {
				throw new \coreException(
					getLabel('label-error-exchange-admin-not-implemented')
				);
			}

			$this->admin = $module->getImplementedInstance($module::ADMIN_CLASS);
		}
		/**
		 * Выводит в буффер конфигурацию табличного контрола редактора 1С-идентификаторов разделов каталога
		 * @return void
		 */
		public function flushCategoryIdentifiersConfig() : void {
			$config = $this->getIdentifiersConfig('categoryIdentifiers');
			Service::Response()->printJson($config);
		}

		/**
		 * Выводит в буффер конфигурацию табличного контрола редактора 1С-идентификаторов объектов каталога
		 * @return void
		 */
		public function flushObjectIdentifiersConfig() : void {
			$config = $this->getIdentifiersConfig('objectIdentifiers');
			Service::Response()->printJson($config);
		}

		/**
		 * Выводит информацию об 1С-идентификаторах разделов каталога
		 * @throws \publicAdminException
		 */
		public function categoryIdentifiers() : void {
			$this->identifiers('category');
		}

		/**
		 * Выводит информацию об 1С-идентификаторах объектов каталога
		 * @throws \publicAdminException
		 */
		public function objectIdentifiers() : void {
			$this->identifiers('object');
		}

		/**
		 * Сохраняет 1С-идентификатор
		 * @param int|null $pageId id страницы
		 * @param string|null $value значение 1С-идентификатора
		 */
		public function saveIdentifier(int $pageId = null, string $value = null) : void {
			$pageId = $pageId ?: $this->admin->getNumberedParameter(0);
			$value = $value ?: Service::Request()->Post()->get('value');
			$value = trim($value);
			$importRelations = \umiImportRelations::getInstance();
			$cmlSourceId = $this->module->getCmlSourceId();

			try {
				if ($value === '') {
					$importRelations->deleteRelation($cmlSourceId, null, $pageId);
				} else {
					$importRelations->setIdRelation($cmlSourceId, $value, $pageId);
				}
			} catch (\databaseException $exception) {
				$result = $this->admin->getEntityTableControlErrorResult($exception);
				$this->admin->printEntityTableControlResult($result);
			}
		}

		/**
		 * Возвращает конфигурацию табличного контрола редактора 1С-идентификаторов
		 * @param string $method админский метод редактора
		 * @return array
		 */
		private function getIdentifiersConfig(string $method) : array {
			return [
				'methods' => $this->getIdentifiersMethodsConfig($method),
				'default' => $this->getIdentifiersDefaultVisibleColumnsConfig(),
				'fields' => $this->getIdentifiersColumnsConfig()
			];
		}

		/**
		 * Возвращает конфигурацию методов табличного контрола раздела "1С идентификаторы"
		 * @param string $method метод-запрашиваемый таб раздела
		 * @return array
		 */
		private function getIdentifiersMethodsConfig(string $method) : array {
			$requestedPageId = (int) getRequest('param0');

			if ($requestedPageId) {
				$method .= "/$requestedPageId";
			}

			return [
				[
					'title' => getLabel('smc-load'),
					'module' => 'exchange',
					'type' => 'load',
					'name' => $method
				],
				[
					'title' => '',
					'module' => 'exchange',
					'type' => 'saveField',
					'name' => 'saveIdentifier'
				]
			];
		}

		/**
		 * Возвращает список полей, отображаемых в табличном контроле раздела "1С идентификаторы" по умолчанию
		 * @return string
		 */
		private function getIdentifiersDefaultVisibleColumnsConfig() : string {
			return implode('|', [
				self::IDS_PAGE_ID . '[220px]',
				self::IDS_PAGE_NAME . '[450px]',
				self::IDS_CML_ID . '[450px]'
			]);
		}

		/**
		 * Возвращает конфигурацию полей табличного контрола раздела "1С идентификаторы"
		 * @return array
		 */
		private function getIdentifiersColumnsConfig() : array {
			return [
				[
					'name' => self::IDS_PAGE_ID,
					'title' => getLabel('label-page-id'),
					'type' => 'string',
					'show_edit_page_link' => 'false',
					'selectable' => 'false',
					'filterable' => 'true',
					'sortable' => 'true',
					'editable' => 'false'
				],
				[
					'name' => self::IDS_PAGE_NAME,
					'title' => getLabel('label-page-name'),
					'type' => 'string',
					'filterable' => 'true',
					'sortable' => 'true',
					'editable' => 'false'
				],
				[
					'name' => self::IDS_CML_ID,
					'title' => getLabel('label-1c-identifier'),
					'type' => 'string',
					'filterable' => 'true',
					'sortable' => 'true',
					'editable' => 'true'
				],
			];
		}

		/**
		 * Выводит информацию об 1С-идентификаторах каталога
		 * @param string $type иерархический тип страниц каталога category/object
		 * @throws \publicAdminException
		 */
		private function identifiers(string $type) : void {
			if (isDemoMode()) {
				throw new \publicAdminException(getLabel('label-stop-in-demo'));
			}

			if (!\cmsController::getInstance()->getModule('catalog')) {
				throw new \publicAdminException(getLabel('label-stop-no-catalog'));
			}

			if (!Service::Request()->isJson()) {
				$this->admin->setHeaderLabel("header-exchange-categoryIdentifiers");
				$this->admin->setDataSetDirectCallMessage();
				return;
			}

			$pageId = $this->admin->getNumberedParameter(0);

			if ($pageId) {
				$this->requestedPageId = $pageId;
			}

			try {
				$result = $this->getIdentifiersByHierarchyType($type);
				$result = $this->getPreparedIdentifiersData($result);
			} catch (\databaseException $exception) {
				$result = $this->admin->getEntityTableControlErrorResult($exception);
			}

			$this->admin->printEntityTableControlResult($result);
		}

		/**
		 * Возвращает список с данными об 1С-идентификаторах и страницах каталога
		 * @param string $typeName тип объектов, данные о которых нужно вернуть
		 * @return array
		 * @throws \databaseException
		 */
		private function getIdentifiersByHierarchyType(string $typeName) : array {
			$typeId = \umiHierarchyTypesCollection::getInstance()
				->getTypeByName('catalog', $typeName)
				->getId();

			$connection = \ConnectionPool::getInstance()
				->getConnection();

			$idKey = self::IDS_PAGE_ID;
			$pageNameKey = self::IDS_PAGE_NAME;
			$cmlKey = self::IDS_CML_ID;
			$cmlSourceId = $connection->escape($this->module->getCmlSourceId());
			$typeId = $connection->escape($typeId);

			$sql = <<<SQL
SELECT `cms3_hierarchy`.`id` as `$idKey`, `cms3_objects`.`name` as `$pageNameKey`, `cms3_import_relations`.`old_id` as `$cmlKey`
FROM `cms3_hierarchy`
LEFT JOIN `cms3_objects` ON `cms3_objects`.`id` = `cms3_hierarchy`.`obj_id`
LEFT JOIN `cms3_import_relations` ON `new_id` = `cms3_hierarchy`.`id` AND `source_id` = $cmlSourceId
WHERE `cms3_hierarchy`.`type_id` = $typeId
SQL;
			$sql = $this->applyIdentifiersFilterConditions($sql);
			$sql = $this->applyRequestedPageIdentifiersCondition($sql);
			$sql = $this->applyIdentifiersSortConditions($sql);

			$result = $connection->queryResult($sql)
				->setFetchAssoc();

			$identifiers = [];

			foreach ($result as $row) {
				$identifiers[] = [
					$this->admin::ID_KEY => $row[self::IDS_PAGE_ID],
					self::IDS_PAGE_ID => $row[self::IDS_PAGE_ID],
					self::IDS_PAGE_NAME => $row[self::IDS_PAGE_NAME],
					self::IDS_CML_ID => $row[self::IDS_CML_ID]
				];
			}

			return $identifiers;
		}

		/**
		 * Возвращает запрос выборки 1С-идентификаторов, к которому применены условия фильтрации
		 * @param string $sql sql-запрос
		 * @return string
		 * @throws \databaseException
		 */
		private function applyIdentifiersFilterConditions(string $sql) : string {
			$connection = \ConnectionPool::getInstance()
				->getConnection();

			$domainId = $this->admin->getDomainId();

			if (isset($domainId)) {
				$domainId = $connection->escape($domainId);
				$sql .= " AND `cms3_hierarchy`.`domain_id` = $domainId";
			}

			$filters = $this->admin->getFilterValues();

			if (!$filters || count($filters) === 0) {
				return $sql;
			}

			foreach ($filters as $filterName => $filterData) {
				$filterValue = $connection->escape($filterData['like']);

				switch($filterName) {
					case self::IDS_PAGE_ID: {
						$sql .= " AND `cms3_hierarchy`.`id` LIKE '%$filterValue%'";
						break;
					}
					case self::IDS_PAGE_NAME: {
						$sql .= " AND `cms3_objects`.`name` LIKE '%$filterValue%'";
						break;
					}
					case self::IDS_CML_ID: {
						$sql .= " AND `cms3_import_relations`.`old_id` LIKE '%$filterValue%'";
						break;
					}
					default:
						break;
				}
			}

			return $sql;
		}

		/**
		 * Возвращает запрос выборки 1С-идентификаторов, ограничивая его запрошенным идентификатором страницы
		 * @param string $sql sql-запрос
		 * @return string
		 * @throws \databaseException
		 */
		private function applyRequestedPageIdentifiersCondition(string $sql) : string {
			if ($this->requestedPageId) {
				$pageId = \ConnectionPool::getInstance()
					->getConnection()
					->escape($this->requestedPageId);

				$sql .= " AND `cms3_hierarchy`.`id` = $pageId LIMIT 0,1";
			}

			return $sql;
		}

		/**
		 * Возвращает запрос выборки 1С-идентификаторов, к которому применены условия сортировки
		 * @param string $sql sql-запрос
		 * @return string
		 * @throws \databaseException
		 */
		private function applyIdentifiersSortConditions(string $sql) : string {
			$sort = $this->admin->getSortValues();

			if (!$sort || count($sort) === 0) {
				return $sql;
			}

			$field = getFirstValue(array_keys($sort));
			$direction = getFirstValue(array_values($sort));

			if (!in_array($field, [self::IDS_PAGE_ID, self::IDS_PAGE_NAME, self::IDS_CML_ID])) {
				return $sql;
			}

			if (!in_array($direction, ['asc', 'desc'])) {
				return $sql;
			}

			$connection = \ConnectionPool::getInstance()
				->getConnection();

			$field = $connection->escape($field);
			$direction = $connection->escape($direction);

			return $sql . " ORDER BY `$field` $direction";
		}

		/**
		 * Подготавливает для отображения в админке и возвращает информацию об 1С-идентификаторах
		 * @param array $identifiers список идентификаторов
		 * @return array
		 */
		private function getPreparedIdentifiersData(array $identifiers) : array {
			$totalCount = count($identifiers);
			$identifiers = $this->admin->sliceDataRowList($identifiers);
			return $this->admin->appendPageNavigation($identifiers, $totalCount);
		}
	}
