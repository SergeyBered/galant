<?php
	namespace UmiCms\Classes\Components\Emarket\Config;

	/** Класс вкладки настроек оплаты */
	class PaymentTab extends Tab {

		/** @var array конфиг опций вкладки */
		protected $options = [
			'order-item-default-settings' => [
				'select:item-default-tax-id' => [
					'group' => 'ORDER_ITEM_SECTION',
					'name' => 'taxRateId',
					'initialValue' => 'getOrderItemTaxList',
					'extra' => [
						'empty' => 'label-not-chosen'
					]
				],
				'select:item-default-payment-subject' => [
					'group' => 'ORDER_ITEM_SECTION',
					'name' => 'paymentSubjectId',
					'initialValue' => 'getOrderItemPaymentSubjectList',
					'extra' => [
						'empty' => 'label-not-chosen'
					]
				],
				'select:item-default-payment-mode' => [
					'group' => 'ORDER_ITEM_SECTION',
					'name' => 'paymentModeId',
					'initialValue' => 'getOrderItemPaymentModeList',
					'extra' => [
						'empty' => 'label-not-chosen'
					]
				]
			],
		];

		/**
		 * @inheritDoc
		 * @throws \coreException
		 * @throws \wrongParamException
		 * @throws \publicAdminException
		 * @throws \requireAdminParamException
		 * @throws \RequiredPropertyHasNoValueException
		 */
		public function paymentSettings() {
			$this->handleSettings();
		}

		/**
		 * Возвращает список ставок НДС
		 * @return array
		 *
		 * [
		 *      umiObject::getId() => umiObject::getName()
		 * ]
		 * @throws \coreException
		 */
		protected function getOrderItemTaxList() {
			return $this->getOrderItemPropertyListByGuid('tax-rate-guide');
		}

		/**
		 * Возвращает список предметов расчета
		 * @return array
		 *
		 * [
		 *      umiObject::getId() => umiObject::getName()
		 * ]
		 * @throws \coreException
		 */
		protected function getOrderItemPaymentSubjectList() {
			return $this->getOrderItemPropertyListByGuid('payment_subject');
		}

		/**
		 * Возвращает список способов расчета
		 * @return array
		 *
		 * [
		 *      umiObject::getId() => umiObject::getName()
		 * ]
		 * @throws \coreException
		 */
		protected function getOrderItemPaymentModeList() {
			return $this->getOrderItemPropertyListByGuid('payment_mode');
		}

		/**
		 * Возвращает список значений по гуиду типа данных
		 * @param string $guid
		 * @return array
		 *
		 * [
		 *      umiObject::getId() => umiObject::getName()
		 * ]
		 * @throws \coreException
		 */
		protected function getOrderItemPropertyListByGuid($guid) {
			$taxGuideId = \umiObjectTypesCollection::getInstance()
				->getTypeIdByGUID($guid);

			return \umiObjectsCollection::getInstance()
				->getGuidedItems($taxGuideId);
		}

		/** @inheritDoc */
		protected function getTabName() {
			return 'paymentSettings';
		}
	}
