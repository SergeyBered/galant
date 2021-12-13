<?php

	namespace UmiCms\Classes\Components\Emarket\Serializer\Receipt;

	/**
	 * Класс параметра передаваемого в чеке платежной системы
	 * Параметр содержит идентификаторы для внешних сервисов, для того, чтобы связывать
	 * идентификаторы ставок в UMI.CMS с идентификаторами ставок в интегрируемых системах.
	 * @package UmiCms\Classes\Components\Emarket\Serializer\Receipt
	 */
	class Parameter implements iParameter {

		/** @var \iUmiObject $dataObject объект данных параметра */
		protected $dataObject;

		/** @inheritDoc */
		public function __construct(\iUmiObject $dataObject) {
			$this->dataObject = $dataObject;
		}

		/** @inheritDoc */
		public function getId() {
			return $this->getDataObject()
				->getId();
		}

		/** @inheritDoc */
		public function getName() {
			return $this->getDataObject()
				->getName();
		}

		/** @inheritDoc */
		public function getYandexKassaId() {
			return (string) $this->getDataObject()
				->getValue(self::YANDEX_KASSA_ID_FIELD);
		}

		/** @inheritDoc */
		public function getRoboKassaId() {
			return (string) $this->getDataObject()
				->getValue(self::ROBO_KASSA_ID_FIELD);
		}

		/** @inheritDoc */
		public function getPayAnyWayId() {
			return (string) $this->getDataObject()
				->getValue(self::PAY_ANY_WAY_ID_FIELD);
		}

		/** @inheritDoc */
		public function getPayOnlineId() {
			return (string) $this->getDataObject()
				->getValue(self::PAY_ONLINE_ID_FIELD);
		}

		/** @inheritDoc */
		public function getSberbankId() {
			return (string) $this->getDataObject()
				->getValue(self::SBERBANK_ID_FIELD);
		}

		/** @inheritDoc */
		public function getDengiOnlineId() : string {
			return (string) $this->getDataObject()
				->getValue(self::DENGI_ONLINE_ID_FIELD);
		}

		/**
		 * Возвращает объект данных параметра
		 * @return \iUmiObject
		 */
		public function getDataObject() {
			return $this->dataObject;
		}
	}