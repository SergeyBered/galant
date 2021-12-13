<?php

	use UmiCms\Service;

	/** Класс функционала административной панели */
	class MenuAdmin {

		use baseModuleAdmin;

		/** @var menu $module */
		public $module;

		/**
		 * Возвращает список меню
		 * @param int|null $domainId идентификатор домена
		 * @param int|null $languageId идентификатор языка
		 * @return bool
		 * @throws coreException
		 * @throws selectorException
		 */
		public function lists(int $domainId  = null, int $languageId = null) {
			$this->setDataType('list');
			$this->setActionType('view');

			if ($this->module->ifNotXmlMode()) {
				$this->setDirectCallError();
				$this->doData();
				return true;
			}

			$limit = getRequest('per_page_limit');
			$curr_page = Service::Request()->pageNumber();
			$offset = $curr_page * $limit;

			$domainId = $this->getOrDetectDomainId($domainId);
			$languageId = $this->getOrDetectLanguageId($languageId);

			$selector = Service::SelectorFactory()
				->createObjectTypeName('menu', 'item_element');
			$selector->option('or-mode')->field('domain_id_list', 'language_id_list');
			$selector->where('domain_id_list')->equals($domainId);
			$selector->where('domain_id_list')->isnull();
			$selector->where('language_id_list')->equals($languageId);
			$selector->where('language_id_list')->isnull();
			$selector->limit($offset, $limit);
			selectorHelper::detectWhereConditionByRequest($selector, 'id', 'rel');
			selectorHelper::detectFilters($selector);

			$data = $this->prepareData($selector->result(), 'objects');
			$this->setData($data, $selector->length());
			$this->setDataRangeByPerPage($limit, $curr_page);
			$this->doData();
		}

		/**
		 * Возвращает данные для построения формы добавления меню.
		 * Если передан ключевой параметр $_REQUEST['param1'] = do,
		 * то добавляет меню и перенаправляет на страницу со списком меню.
		 * @throws coreException
		 * @throws publicAdminException
		 * @throws wrongElementTypeAdminException
		 */
		public function add() {
			$type = (string) getRequest('param0');
			$this->setHeaderLabel('header-menu-add-' . $type);
			$inputData = [
				'type' => $type,
				'type-id' => getRequest('type-id'),
				'allowed-element-types' => [
					'menu',
					'item_element'
				]
			];

			if ($this->isSaveMode('param1')) {
				$object = $this->saveAddedObjectData($inputData);
				$object->commit();
				$this->chooseRedirect($this->module->pre_lang . '/admin/menu/edit/' . $object->getId() . '/');
			}

			$this->setDataType('form');
			$this->setActionType('create');
			$data = $this->prepareData($inputData, 'object');
			$this->setData($data);
			$this->doData();
		}

		/**
		 * Возвращает данные для построения формы редактирования меню.
		 * Если передан ключевой параметр $_REQUEST['param1'] = do,
		 * то сохраняет изменения меню и перенаправляет на страницу со списком меню.
		 * @throws coreException
		 * @throws expectObjectException
		 */
		public function edit() {
			$object = $this->expectObject('param0', true);
			$this->setHeaderLabel('header-menu-edit-' . $this->getObjectTypeMethod($object));
			$inputData = [
				'object' => $object,
				'allowed-element-types' => [
					'menu',
					'item_element'
				]
			];

			if ($this->isSaveMode('param1')) {
				$object = $this->saveEditedObjectData($inputData);
				$this->chooseRedirect();
			}

			$oldJSON = $object->getValue('menuhierarchy');
			$values = json_decode($oldJSON);
			$values = $this->module->editLinkMenu($values);
			$newJSON = json_encode($values);

			if ($oldJSON != $newJSON) {
				$object->setValue('menuhierarchy', $newJSON);
				$object->commit();
			}

			$this->setDataType('form');
			$this->setActionType('modify');
			$data = $this->prepareData($inputData, 'object');
			$this->setData($data);
			$this->doData();
		}

		/**
		 * Удаляет меню
		 * @throws coreException
		 * @throws expectObjectException
		 * @throws wrongElementTypeAdminException
		 */
		public function del() {
			$objects = getRequest('element');

			if (!is_array($objects)) {
				$objects = [$objects];
			}

			foreach ($objects as $objectId) {
				$object = $this->expectObject($objectId, false, true);
				$params = [
					'object' => $object,
					'allowed-element-types' => [
						'menu',
						'item_element'
					]
				];
				$this->deleteObject($params);
			}

			$this->setDataType('list');
			$this->setActionType('view');
			$data = $this->prepareData($objects, 'objects');
			$this->setData($data);
			$this->doData();
		}

		/**
		 * Изменяет активность меню
		 * @throws coreException
		 * @throws expectObjectException
		 */
		public function activity() {
			$this->changeActivityForObjects();
		}

		/**
		 * Возвращает настройки табличного контрола
		 * @param string $param контрольный параметр
		 * @return array
		 */
		public function getDatasetConfiguration($param = '') {
			return [
				'methods' => [
					[
						'title' => getLabel('smc-load'),
						'forload' => true,
						'module' => 'menu',
						'#__name' => 'lists'
					],
					[
						'title' => getLabel('smc-delete'),
						'module' => 'menu',
						'#__name' => 'del',
						'aliases' => 'tree_delete_element,delete,del'
					],
					[
						'title' => getLabel('smc-activity'),
						'module' => 'menu',
						'#__name' => 'activity',
						'aliases' => 'tree_set_activity,activity'
					]
				],
				'types' => [
					[
						'common' => 'true',
						'id' => 'item_element'
					]
				],
				'stoplist' => [
					'menuhierarchy'
				],
				'default' => 'name[400px]'
			];
		}
	}

