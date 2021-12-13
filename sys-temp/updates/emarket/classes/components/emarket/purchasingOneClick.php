<?php

	use UmiCms\Service;

	/** Класс функционала оформления заказа в 1 клик */
	class EmarketPurchasingOneClick {

		/** @var emarket|EmarketPurchasingOneClick|EmarketMacros $module */
		public $module;

		/**
		 * Клиентский метод.
		 * Выводит данные для построения формы создания заказа в клик
		 * @param int $objectType идентификатор типа данных заказа в клик
		 * @return mixed
		 */
		public function createForm($objectType) {
			/** @var DataForms $data */
			$data = cmsController::getInstance()
				->getModule('data');

			$isGuest = Service::Auth()->isLoginAsGuest();
			$form = $data->getCreateForm($objectType);
			$formIsEmpty = $this->formIsEmpty($form);

			if (!$formIsEmpty) {
				$form = $this->attachLangPrefix($form);

				if ($isGuest) {
					$form = $this->attachRequiredFields($form);
				}

				return $form;
			}

			$form = $this->getNewCustomerRequiredForm();

			if (!$this->formIsEmpty($form)) {
				$form = $this->attachLangPrefix($form);
			}

			return $form;
		}

		/**
		 * Клиентский метод.
		 * Принимает данные формы создания заказа в 1 клик и формирует на их основе заказ.
		 * Если указаны оба параметра - добавляет товар в корзину перед тем, как оформить заказ.
		 * Возвращает данные созданного заказа.
		 * @param mixed $addProductToCart Флаг добавления товара в корзину
		 * @param bool|int $elementId Идентификатор товара (объекта каталога)
		 * @return array
		 * @throws ErrorException
		 * @throws ReflectionException
		 * @throws coreException
		 * @throws databaseException
		 * @throws privateException
		 * @throws publicException
		 * @throws selectorException
		 * @throws wrongParamException
		 */
		public function getOneClickOrder($addProductToCart = false, $elementId = false) {
			$this->validateRequiredFields('emarket-purchase-oneclick');

			if (Service::Auth()->isLoginAsGuest()) {
				$this->validateRequiredFields('emarket-customer');
			}

			$errors = $this->validateOneClickInfo();

			if (umiCount($errors) > 0) {
				return $errors;
			}

			$order = $this->processOrder($addProductToCart, $elementId);
			return ['orderId' => $order->getNumber()];
		}

		/** 
		 * Проверяет заполненность обязательных полей в форме оформления заказа для указанного типа данных
		 * @param string $typeGUID GUID типа данных для проверки
		 * @throws publicException
		 * */
		private function validateRequiredFields($typeGUID) {
			/** @var data $data */
			$data = cmsController::getInstance()->getModule('data');

			$type = umiObjectTypesCollection::getInstance()
				->getTypeByGUID($typeGUID);

			if (!$type instanceof iUmiObjectType) {
				throw new publicException("Wrong type GUID \"{$typeGUID}\"");
			}

			$errors = $data->checkRequiredFields($type->getId());
			if (is_array($errors)) {
				$message = getLabel('error-required_one_click_list') . $data->assembleErrorFields($errors);
				throw new publicException($message);
			}
		}

		/**
		 * Валидирует данные формы создания заказа в один клик и возвращает полученные ошибки
		 * @return array
		 */
		public function validateOneClickInfo() {
			$dataForm = getRequest('data');
			$oneClickOrderType = $this->getOneClickOrderType();
			$errors = [];

			foreach ($oneClickOrderType->getAllFields() as $field) {
				if (!array_key_exists($field->getName(), $dataForm['new'])) {
					continue;
				}

				$value = $dataForm['new'][$field->getName()];
				$restriction = baseRestriction::get($field->getRestrictionId());

				if (!$restriction) {
					continue;
				}

				if ($restriction instanceof iNormalizeInRestriction) {
					$value = $restriction->normalizeIn($value);
				}

				if ($restriction->validate($value)) {
					continue;
				}

				$fieldTitle = $field->getTitle();
				$errorMessage = getLabel('error-wrong-field-value');
				$errorMessage .= " \"{$fieldTitle}\" - " . $restriction->getErrorMessage();
				$errors['nodes:error'][] = $errorMessage;

				if (umiCount($errors) > 0) {
					return $errors;
				}
			}

			return $errors;
		}

		/**
		 * Оформляет заказ в один клик и возвращает объект заказа.
		 * @param mixed $addProductToCart Флаг добавления товара в корзину
		 * @param bool|int $elementId Идентификатор товара (объекта каталога)
		 * @return order
		 * @throws Exception
		 * @throws ErrorException
		 * @throws ReflectionException
		 * @throws coreException
		 * @throws databaseException
		 * @throws privateException
		 * @throws publicException
		 * @throws selectorException
		 * @throws wrongParamException
		 */
		private function processOrder($addProductToCart, $elementId) {
			$previousBasket = $this->module->getBasketOrder();
			$oneClickBasket = $previousBasket;

			if ($addProductToCart && $elementId) {
				$oneClickBasket = order::create();
				$this->module->setCurrentBasket($oneClickBasket);

				$_REQUEST['no-redirect'] = 1;
				$this->module->basket('put', 'element', $elementId);
			}

			$this->module->setCurrentBasket($previousBasket);

			$domainId = Service::DomainDetector()->detectId();
			customer::get()->setLastOrder($previousBasket->getId(), $domainId);

			$this->saveOneClickInfo($oneClickBasket);

			$oneClickBasket->order();
			return $oneClickBasket;
		}

		/**
		 * Создает заказ в один клик, заполняет его и покупателя данными из формы
		 * @param order $order текущая корзина
		 * @throws coreException
		 */
		public function saveOneClickInfo(order $order) {
			$umiObjects = umiObjectsCollection::getInstance();

			$oneClickOrderType = $this->getOneClickOrderType();
			$oneClickCustomerId = $umiObjects->addObject($order->getName(), $oneClickOrderType->getId());
			$oneClickCustomer = $umiObjects->getObject($oneClickCustomerId);

			$this->saveCustomer($oneClickCustomer);
			$oneClickCustomer->commit();

			$regularCustomer = customer::get();

			if (!$regularCustomer->isFilled()) {
				$this->saveCustomer($regularCustomer);
				$regularCustomer->commit();
			}

			$order->setValue('purchaser_one_click', $oneClickCustomerId);
			$order->commit();
		}

		/**
		 * Сохраняет информацию о покупателе из формы заказа в один клик
		 * @param iUmiObject|umiObjectProxy $customer объект покупателя
		 */
		private function saveCustomer($customer) {
			$oneClickOrderType = $this->getOneClickOrderType();
			$dataForm = getRequest('data');

			foreach ($oneClickOrderType->getAllFields() as $field) {
				if (!array_key_exists($field->getName(), $dataForm['new'])) {
					continue;
				}

				$value = $dataForm['new'][$field->getName()];
				$customer->setValue($field->getName(), $value);
			}
		}

		/**
		 * Возвращает тип данных "Заказ в один клик"
		 * @return iUmiObjectType
		 */
		private function getOneClickOrderType() {
			return umiObjectTypesCollection::getInstance()
				->getTypeByGUID('emarket-purchase-oneclick');
		}

		/**
		 * Возвращает результат проверки, содержится ли в массиве информация о полях
		 * @param array $form данные формы
		 * @return bool
		 */
		private function formIsEmpty($form) {
			return !array_key_exists('nodes:group', $form) || umiCount($form['nodes:group']) == 0;
		}

		/**
		 * Добавляет к данным формы информацию о текущем языковом префиксе
		 * @param array $form данные формы
		 * @return mixed
		 * @throws coreException
		 */
		private function attachLangPrefix($form) {
			$form['nodes:group'][0]['attribute:lang'] = Service::LanguageDetector()->detectPrefix();
			return $form;
		}

		/**
		 * Добавляет к данным формы информацию об обязательных полях и возвращает обновленные данные формы
		 * @param array $form данные формы
		 * @return array
		 * @throws ErrorException
		 * @throws coreException
		 */
		private function attachRequiredFields($form) {
			$requiredFieldsData = $this->getNewCustomerRequiredFields();

			foreach ($requiredFieldsData as $requiredGroup) {
				$newGroupIndex = count($form['nodes:group']);

				foreach ($requiredGroup['fields'] as $requiredField) {
					$fieldsUpdated = $this->updateFormFieldsByRequiredField($requiredField['attribute:name'], $form);

					if ($fieldsUpdated) {
						continue;
					}

					$form['void:groups'][$newGroupIndex]['attribute:name'] = $requiredGroup['name'];
					$form['void:groups'][$newGroupIndex]['attribute:title'] = $requiredGroup['title'];
					$form['void:groups'][$newGroupIndex]['void:fields'][] = $requiredField;
					$form['void:groups'][$newGroupIndex]['nodes:field'][] = $requiredField;

					$form['nodes:group'][$newGroupIndex]['attribute:name'] = $requiredGroup['name'];
					$form['nodes:group'][$newGroupIndex]['attribute:title'] = $requiredGroup['title'];
					$form['nodes:group'][$newGroupIndex]['void:fields'][] = $requiredField;
					$form['nodes:group'][$newGroupIndex]['nodes:field'][] = $requiredField;
				}
			}

			return $form;
		}

		/**
		 * Возвращает информацию об обязательных полях типа данных "Незарегистрированный покупатель"
		 * @return array
		 * @throws ErrorException
		 * @throws coreException
		 */
		private function getNewCustomerRequiredFields() {
			/** @var DataForms $data */
			$data = cmsController::getInstance()
				->getModule('data');

			$newCustomerForm = $data->getCreateForm('emarket-customer');

			if ($this->formIsEmpty($newCustomerForm)) {
				return [];
			}

			$requiredFields = [];

			foreach ($newCustomerForm['nodes:group'] as $group) {
				foreach ($group['nodes:field'] as $field) {
					if (array_key_exists('attribute:required', $field)) {
						$requiredFields[$group['attribute:name']]['name'] = $group['attribute:name'];
						$requiredFields[$group['attribute:name']]['title'] = $group['attribute:title'];
						$requiredFields[$group['attribute:name']]['fields'][] = $field;
					}
				}
			}

			return $requiredFields;
		}

		/**
		 * Обновляет поля формы на основе переданного поля и возвращает результат операции - были обновлены поля или нет
		 * @param string $requiredFieldName имя обязательного поля
		 * @param array $form данные формы
		 * @return bool
		 */
		private function updateFormFieldsByRequiredField($requiredFieldName, &$form) {
			foreach ($form['nodes:group'] as $groupIndex => $group) {
				foreach ($group['nodes:field'] as $fieldIndex => $field) {
					if ($requiredFieldName == $field['attribute:name']) {
						$form['void:groups'][$groupIndex]['void:fields'][$fieldIndex]['attribute:required'] = 'required';
						$form['void:groups'][$groupIndex]['nodes:field'][$fieldIndex]['attribute:required'] = 'required';
						$form['nodes:group'][$groupIndex]['void:fields'][$fieldIndex]['attribute:required'] = 'required';
						$form['nodes:group'][$groupIndex]['nodes:field'][$fieldIndex]['attribute:required'] = 'required';

						return true;
					}
				}
			}

			return false;
		}

		/**
		 * Возвращает данные для построения формы на основе обязательных полей типа данных "Незарегистрированный покупатель"
		 * @return array
		 * @throws ErrorException
		 * @throws coreException
		 */
		private function getNewCustomerRequiredForm() {
			/** @var DataForms $data */
			$data = cmsController::getInstance()
				->getModule('data');

			$newCustomerForm = $data->getCreateForm('emarket-customer');
			$newCustomerRequiredForm = [];

			foreach ($newCustomerForm['nodes:group'] as $group) {
				$groupIndex = count($newCustomerRequiredForm['nodes:group']);

				foreach ($group['nodes:field'] as $fieldIndex => $filed) {
					if (!array_key_exists('attribute:required', $filed)) {
						continue;
					}

					$newCustomerRequiredForm['void:groups'][$groupIndex]['attribute:name'] = $newCustomerForm['void:groups'][$groupIndex]['attribute:name'];
					$newCustomerRequiredForm['void:groups'][$groupIndex]['attribute:title'] = $newCustomerForm['void:groups'][$groupIndex]['attribute:title'];
					$newCustomerRequiredForm['void:groups'][$groupIndex]['void:fields'][] = $newCustomerForm['void:groups'][$groupIndex]['void:fields'][$fieldIndex];
					$newCustomerRequiredForm['void:groups'][$groupIndex]['nodes:field'][] = $newCustomerForm['void:groups'][$groupIndex]['nodes:field'][$fieldIndex];

					$newCustomerRequiredForm['nodes:group'][$groupIndex]['attribute:name'] = $newCustomerForm['nodes:group'][$groupIndex]['attribute:name'];
					$newCustomerRequiredForm['nodes:group'][$groupIndex]['attribute:title'] = $newCustomerForm['nodes:group'][$groupIndex]['attribute:title'];
					$newCustomerRequiredForm['nodes:group'][$groupIndex]['void:fields'][] = $newCustomerForm['nodes:group'][$groupIndex]['void:fields'][$fieldIndex];
					$newCustomerRequiredForm['nodes:group'][$groupIndex]['nodes:field'][] = $newCustomerForm['nodes:group'][$groupIndex]['nodes:field'][$fieldIndex];
				}
			}

			return $newCustomerRequiredForm;
		}

		/** @deprecated */
		public function validOneClickInfo() {
			return $this->validateOneClickInfo();
		}
	}
