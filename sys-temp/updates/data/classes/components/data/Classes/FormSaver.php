<?php

	namespace UmiCms\Classes\Components\Data;

	use UmiCms\Service;

	/**
	 * Класс для сохранения данных формы
	 * @todo рефакторинг методов
	 * @package UmiCms\Classes\Components\Data
	 */
	class FormSaver implements iFormSaver {

		/** @var \data $module */
		public $module;

		/**
		 * @inheritDoc
		 * @throws \Exception
		 * @throws \coreException
		 * @throws \privateException
		 * @throws \errorPanicException
		 */
		public function saveEditedObject($objectId, $isNew = false, $ignorePermissions = false, $all = false) {
			return $this->saveEditedObjectWithIgnorePermissions($objectId, $isNew, false, $all);
		}

		/**
		 * @inheritDoc
		 * @throws \Exception
		 * @throws \coreException
		 * @throws \privateException
		 * @throws \errorPanicException
		 */
		public function saveEditedObjectWithIgnorePermissions(
			$objectId,
			$isNew = false,
			$ignorePermissions = false,
			$all = false
		) {
			$data = $this->prepareEditedObjectRequestData($objectId, $isNew);

			if ($data === true) {
				return true;
			}

			return $this->saveEditedObjectData($objectId, $data, $isNew, $ignorePermissions);
		}

		/** @inheritDoc */
		public function prepareEditedObjectRequestData($objectId, $isNew = false) {
			$key = $this->getRequestDataKey($isNew, $objectId);
			$fileList = $this->getRequestFileList($key);

			if ($this->getDataFromPostRequest() === null) {
				return $this->isEmptyFilesData() ? [] : $fileList;
			}

			$data = $this->getRequestData($key);
			$data += $this->getRequestFieldList($data) + $fileList;

			return $data;
		}

		/**
		 * @inheritDoc
		 * @throws \coreException
		 * @throws \errorPanicException
		 * @throws \privateException
		 * @throws \publicException
		 */
		public function saveEditedObjectData(
			$objectId,
			array $data,
			$isNew = false,
			$ignorePermissions = false
		) {
			$key = $this->getRequestDataKey($isNew, $objectId);
			$object = \umiObjectsCollection::getInstance()->getObject($objectId);

			$isPermissionsChecked = $ignorePermissions || $this->checkPermissions($objectId);

			if (!$isPermissionsChecked) {
				throw new \publicException(getLabel('error-require-more-permissions'));
			}

			if (!$object instanceof \iUmiObject) {
				return false;
			}

			$objectType = \umiObjectTypesCollection::getInstance()
				->getType($object->getTypeId());

			$data = $this->checkRequiredData($objectType, $data, $objectId, $isNew);
			$data = $this->checkAllowedData($objectType, $data, $objectId);

			$fieldTypesCollection = \umiFieldTypesCollection::getInstance();
			$fieldsCollection = \umiFieldsCollection::getInstance();

			foreach ($data as $fieldName => $fieldValue) {
				$fieldId = $objectType->getFieldId($fieldName);

				if (!$fieldId) {
					continue;
				}

				$fieldTypeId = $fieldsCollection->getField($fieldId)
					->getFieldTypeId();

				$fieldType = $fieldTypesCollection->getFieldType($fieldTypeId);

				$fieldValue = $this->prepareFieldValue($fieldValue, $fieldName, $fieldId, $key, $object, $fieldType);
				$object->setValue($fieldName, $fieldValue);
			}
			$object->commit();
			return $data;
		}

		/**
		 * @inheritDoc
		 * @throws \Exception
		 * @throws \coreException
		 * @throws \privateException
		 * @throws \errorPanicException
		 */
		public function checkAllowedData(\iUmiObjectType $objectType, array $data, $objectId = false) {
			$userTypeId = \umiHierarchyTypesCollection::getInstance()
				->getTypeByName('users', 'user')
				->getId();

			$isObjectUser = $objectType->getHierarchyTypeId() == $userTypeId;
			/** @var \users $usersModule */
			$usersModule = \cmsController::getInstance()
				->getModule('users');

			if ($isObjectUser && $usersModule instanceof \def_module) {
				if (isset($data['e-mail']) && !$usersModule->checkIsUniqueEmail($data['e-mail'], $objectId)) {
					$this->module->errorNewMessage('%error_users_non_unique_email%');
					$this->module->errorPanic();
				}

				if (isset($data['login']) && !$usersModule->checkIsUniqueLogin($data['login'], $objectId)) {
					$this->module->errorNewMessage('%err_users_user_exists%');
					$this->module->errorPanic();
				}
			}

			$isSv = \permissionsCollection::getInstance()->isSv();
			$isAdminMode = Service::Request()->isAdmin();
			$isObjectCustomer = $objectType->getGUID() == 'emarket-customer';

			if (!$isSv && !$isAdminMode && ($isObjectCustomer || $isObjectUser)) {
				unset(
					$data['bonus'],
					$data['spent_bonus'],
					$data['filemanager_directory'],
					$data['groups']
				);
			}

			return $data;
		}

		/**
		 * @inheritDoc
		 * @throws \Exception
		 * @throws \coreException
		 */
		public function checkRequiredData(\iUmiObjectType $objectType, $data, $objectId, $isNew) {
			if (!is_array($data)) {
				return $data;
			}

			$admin = Service::Request()->isAdmin();
			$wrongFieldsCount = 0;
			$fields = \umiFieldsCollection::getInstance();

			foreach ($data as $fieldName => &$value) {
				$fieldId = $objectType->getFieldId($fieldName);
				$field = $fields->getField($fieldId);

				if (!$field instanceof \iUmiField) {
					continue;
				}

				if ($field->getIsRequired()) {
					if ($value === null || $value === false || $value === '') {
						$fieldTitle = $field->getTitle();
						$errstr = $admin ? '%errors_missed_field_value%' : getLabel('error-missed-field-value');
						$this->module->errorNewMessage($errstr . " \"{$fieldTitle}\". ", false, 100, 'input-missed-field');
						++$wrongFieldsCount;
					}
				}

				$restrictionId = $field->getRestrictionId();
				if ($restrictionId) {
					$restriction = \baseRestriction::get($restrictionId);

					if ($restriction instanceof \baseRestriction) {
						if ($restriction instanceof \iNormalizeInRestriction) {
							$value = $restriction->normalizeIn($value);
						}

						if (!$restriction->validate($value)) {
							$fieldTitle = $field->getTitle();
							$errstr = $admin ? '%errors_wrong_field_value%' : getLabel('error-wrong-field-value');
							$errstr .= " \"{$fieldTitle}\" - " . $restriction->getErrorMessage();
							$this->module->errorNewMessage($errstr, false, 101, 'input-wrong-field');
							++$wrongFieldsCount;
						}
					}
				}
			}

			if ($wrongFieldsCount > 0) {
				if ($isNew && $objectId) {
					$hierarchy = \umiHierarchy::getInstance();
					$elementIds = $hierarchy->getObjectInstances($objectId);

					if (umiCount($elementIds)) {
						foreach ($elementIds as $elementId) {
							$hierarchy->delElement($elementId);
							$hierarchy->removeDeletedElement($elementId);
						}
					}

					\umiObjectsCollection::getInstance()->delObject($objectId);
				}

				$this->module->errorPanic();
			}

			return $data;
		}

		/**
		 * Проверяет доступно ли редактирование объекта текущему пользователю.
		 * @param int $objectId идентификатор объекта
		 * @return bool
		 */
		private function checkPermissions($objectId) {
			return (bool) \permissionsCollection::getInstance()->isOwnerOfObject($objectId);
		}

		/**
		 * Возвращает ключ объекта в массиве $_REQUEST
		 * @param bool $isNew является ли объект новым
		 * @param int $objectId идентификатор объекта
		 * @return string
		 */
		private function getRequestDataKey($isNew, $objectId) {
			return $isNew ? 'new' : $objectId;
		}

		/**
		 * Определяет пуст ли массив $_FILES
		 * @return bool
		 */
		private function isEmptyFilesData() {
			$files = $this->getFilesRequest()->getArrayCopy();
			return isEmptyArray($files);
		}

		/**
		 * Возвращает информацию о редактируемом/создаваемом объекте
		 * @param int|string $key идентификатор редактируемого объекта или 'new'
		 * @return mixed|array
		 */
		private function getRequestData($key) {
			$data = $this->getDataFromPostRequest();
			return (is_array($data) && isset($data[$key])) ? $data[$key] : [];
		}

		/**
		 * Возвращает список полей редактируемого/создаваемого объекта
		 * @param array $data данные объекта
		 * @return array
		 */
		private function getRequestFieldList($data) {
			$fieldList = [];

			foreach ($this->getRequestObject()->getArrayCopy() as $key => $value) {
				$realKey = mb_substr($key, 7);
				if (startsWith($key, 'select_') && !isset($data[$realKey])) {
					$fieldList[$realKey] = $value;
				}
			}

			return $fieldList;
		}


		/**
		 * Возвращает список файлов в полях редактируемого/создаваемого объекта
		 * @param int|string $key идентификатор редактируемого объекта или 'new'
		 * @return array
		 */
		private function getRequestFileList($key) {
			$data = $this->getFilesRequest()->get('data');
			$requestFileList = isset($data['tmp_name'][$key]) ? $data['tmp_name'][$key] : [];
			$fileList = [];

			foreach ($requestFileList as $filesKey => $filePath) {
				if ($filePath) {
					$fileList[$filesKey] = $filePath;
				}
			}

			return $fileList;
		}

		/**
		 * Подготавливает значение поля
		 * @param mixed $fieldValue значение поля
		 * @param string $fieldName имя поля
		 * @param int $fieldId идентификатор поля
		 * @param int|string $key идентификатор редактируемого объекта или 'new'
		 * @param \iUmiObject $object редактируемый объект
		 * @param \iUmiFieldType $fieldType тип поля
		 * @return array|bool|int|\iUmiDate|\iUmiFile|\iUmiImageFile|string|null
		 */
		private function prepareFieldValue(
			$fieldValue,
			$fieldName,
			$fieldId,
			$key,
			\iUmiObject $object,
			\iUmiFieldType $fieldType
		) {
			switch ($fieldType->getDataType()) {
				case 'password': {
					$fieldValue = $this->preparePasswordFieldValue($fieldValue);
					break;
				}
				case 'date' : {
					$fieldValue = $this->prepareDateFieldValue($fieldValue);
					break;
				}
				case 'swf_file':
				case 'img_file': {
					$fieldValue = $this->prepareImageFieldValue($fieldValue, $fieldName, $fieldId, $key);
					break;
				}

				case 'file':
				case 'video_file': {
					$fieldValue = $this->prepareFile($fieldValue, $fieldName, $key, $object, $fieldId);
					break;
				}

				case 'multiple_image': {
					$fieldValue = $this->prepareMultipleImage($fieldValue);
					break;
				}
				case 'multiple_file': {
					$fieldValue = $this->prepareMultipleFile($fieldValue);
					break;
				}

				case 'symlink' : {
					$fieldValue = is_array($fieldValue) ? $fieldValue : [];
					break;
				}
			}

			return $fieldValue;
		}

		/**
		 * Подготавливает значение поля "Пароль"
		 * @param mixed $fieldValue значение поля
		 * @return string|null
		 */
		private function preparePasswordFieldValue($fieldValue) {
			$password = $fieldValue;

			if (isset($fieldValue[1])) {
				$password = ($fieldValue[0] == $fieldValue[1]) ? $fieldValue[0] : null;
			} else if (is_array($fieldValue)) {
				$password = $fieldValue[0] ? $fieldValue[0] : null;
			}

			if (is_null($password)) {
				return null;
			}

			$isNoHash = Service::Request()->Post()->get('no-hash') ?: false;
			return $isNoHash ? $password : md5($password);
		}

		/**
		 * Подготавливает значение поля "Дата"
		 * @param mixed $fieldValue значение поля
		 * @return int|\iUmiDate
		 */
		private function prepareDateFieldValue($fieldValue) {
			$date = Service::DateFactory()->create();
			return $date->setDateByString($fieldValue) ? $date : 0;
		}

		/**
		 * Подготавливает значение поля "Изображение"
		 * @param mixed $fieldValue значение поля
		 * @param string $fieldName имя поля
		 * @param int $fieldId идентификатор поля
		 * @param int|string $key идентификатор редактируемого объекта или 'new'
		 * @return bool|\iUmiImageFile
		 */
		private function prepareImageFieldValue($fieldValue, $fieldName, $fieldId, $key) {
			$destinationFolder = $this->getImageDestinationFolder();
			$value = \umiImageFile::upload('data', $fieldName, $destinationFolder, $key);

			if ($value instanceof \iUmiImageFile) {
				return $value;
			}

			$imageAttributeList = $this->getImageAttributeList();
			$imageAttributeList = isset($imageAttributeList[$fieldId]) ? $imageAttributeList[$fieldId] : [];
			$path = $this->getFilePath($fieldValue, $destinationFolder);

			return $this->createImage($path, $imageAttributeList);
		}

		/**
		 * Возвращает список атрибутов изображения
		 * @return array
		 */
		private function getImageAttributeList() {
			return $this->getAttributeList('images');
		}

		/**
		 * Возвращает папку для изображения
		 * @return string
		 */
		private function getImageDestinationFolder() {
			return USER_IMAGES_PATH . self::IMAGE_PATH;
		}

		/**
		 * Подготавливает значение файлового поля
		 * @param mixed $fieldValue значение поля
		 * @param string $fieldName имя поля
		 * @param int|string $key идентификатор редактируемого объекта или 'new'
		 * @param \iUmiObject $object редактируемый объект
		 * @param int $fieldId идентификатор поля
		 * @return \iUmiFile
		 */
		private function prepareFile($fieldValue, $fieldName, $key, \iUmiObject $object, $fieldId) {
			$fileDirectory = is_dir(USER_FILES_PATH . "/$fieldName/") ? "$fieldName/" : '';
			$destinationFolder = USER_FILES_PATH . $fileDirectory;
			$value = \umiFile::upload('data', $fieldName, $destinationFolder, $key);

			if ($value instanceof \iUmiFile) {
				return $value;
			}

			$oldValue = $object->getValue($fieldName);

			if ($oldValue) {
				$destinationFolder = $oldValue->getDirName() . '/';
			}

			$fileAttributeList = $this->getFileAttributeList();
			$fileAttributeList = isset($fileAttributeList[$fieldId]) ? $fileAttributeList[$fieldId] : [];
			$filePath = $this->getFilePath($fieldValue, $destinationFolder);

			return $this->createFile($filePath, $fileAttributeList);
		}

		/**
		 * Возвращает список атрибутов изображения
		 * @return array
		 */
		private function getFileAttributeList() {
			return $this->getAttributeList('files');
		}

		/**
		 * Возвращает список атрибутов поля по ключу в запросе
		 * @param string $key
		 * @return array
		 */
		private function getAttributeList($key) {
			$data = $this->getDataFromPostRequest();
			return (is_array($data) && isset($data[$key])) ? $data[$key] : [];
		}

		/**
		 * Возвращает путь к файлу
		 * @param string $fileName имя файла
		 * @param string $destinationFolder путь к папке в которой находится файл
		 * @return string
		 */
		private function getFilePath($fileName, $destinationFolder = '/') {
			return startsWith($fileName, './') ? $fileName : ($destinationFolder . $fileName);
		}

		/**
		 * Подготавливает значения поля "Набор изображений"
		 * @param mixed $fieldValue значение поля
		 * @return array
		 */
		private function prepareMultipleImage($fieldValue) {
			$imageList = [];

			foreach ((array) $fieldValue as $key => $value) {
				$imageList[$key] = isset($value['src'])
					? $this->createImage($value['src'], $value)
					: $this->createImage($value);
			}

			return $imageList;
		}

		/**
		 * Подготавливает значения поля "Набор файлов"
		 * @param mixed $fieldValue значение поля
		 * @return array
		 */
		private function prepareMultipleFile($fieldValue) {
			$fileList = [];

			foreach ((array) $fieldValue as $key => $value) {
				$fileList[$key] = isset($value['src'])
					? $this->createFile($value['src'], $value)
					: $this->createFile($value);
			}

			return $fileList;
		}

		/**
		 * Создает iUmiImageFile
		 * @param string $path путь к изображению
		 * @param array $attributeList список атрибутов изображения
		 * @return \iUmiImageFile
		 */
		private function createImage($path, array $attributeList = []) {
			return Service::ImageFactory()->createWithAttributes($path, $attributeList);
		}

		/**
		 * Создает файл
		 * @param string $path путь к файлу
		 * @param array $attributeList список атрибутов файла
		 * @return \iUmiFile
		 */
		private function createFile($path, array $attributeList = []) {
			return Service::FileFactory()->createWithAttributes($path, $attributeList);
		}

		/**
		 * Возвращает данные POST запроса по ключу 'data'.
		 * Использует getRequest для поддержки обратной совместимости.
		 * @see UsersHandlers::onCreateObject() и UsersHandlers::onModifyObject()
		 * @return mixed
		 */
		private function getDataFromPostRequest() {
			return getRequest('data');
		}

		/**
		 * Возвращает объект запроса
		 * @return \UmiCms\System\Request\Http\iPost| \UmiCms\System\Request\Http\iGet
		 */
		private function getRequestObject() {
			$requestFacade = $this->getRequestFacade();
			$post = $requestFacade->Post();
			return !isEmptyArray($post->getArrayCopy()) ? $post : $requestFacade->Get();
		}

		/**
		 * Возвращает объект iFiles
		 * @return \UmiCms\System\Request\Http\iFiles
		 */
		private function getFilesRequest() {
			return $this->getRequestFacade()->Files();
		}

		/**
		 * Возвращает фасад запроса
		 * @return mixed|\UmiCms\System\Request\iFacade
		 */
		private function getRequestFacade() {
			return Service::Request();
		}
	}