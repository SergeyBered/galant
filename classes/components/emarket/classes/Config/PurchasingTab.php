<?php
	namespace UmiCms\Classes\Components\Emarket\Config;

	/** Класс вкладки настроек оформления заказа */
	class PurchasingTab extends Tab {

		/** @var array конфиг опций вкладки */
		protected $options = [
			'order-purchase-settings' => [
				'ufloat:min-order-price' => [
					'group' => 'ORDER_SECTION',
					'name' => 'minOrderPrice',
				],
				'ufloat:max-order-price' => [
					'group' => 'ORDER_SECTION',
					'name' => 'maxOrderPrice',
				],
				'int:min-order-amount' => [
					'group' => 'ORDER_SECTION',
					'name' => 'minOrderAmount',
				],
				'int:max-order-amount' => [
					'group' => 'ORDER_SECTION',
					'name' => 'maxOrderAmount',
				],
			],
		];

		/**
		 * @inheritDoc
		 * @throws \coreException
		 * @throws \requireAdminParamException
		 * @throws \wrongParamException
		 * @throws \RequiredPropertyHasNoValueException
		 * @throws \publicAdminException
		 * @throws \Exception
		 */
		public function purchasingSettings() {
			$this->handleSettings();
		}

		/** @inheritDoc */
		protected function getTabName() {
			return 'purchasingSettings';
		}
	}