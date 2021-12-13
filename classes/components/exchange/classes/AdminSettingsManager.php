<?php

	namespace UmiCms\Classes\Components\Exchange;

	use UmiCms\Service;

	/** Класс для управления настройками модуля "Обмен данными" */
	class AdminSettingsManager implements iAdminSettingsManager {

		/** @inheritDoc */
		public function getParams() {
			return array_merge($this->getCommonParams(), $this->getSiteParams());
		}

		/** @inheritDoc */
		public function setParams(array $params) : void {
			$this->setCommonParams($params);
			$this->setSiteParams($params);
		}

		/**
		 * Возвращает общие настройки модуля
		 * @return array
		 * @throws \Exception
		 */
		private function getCommonParams() : array {
			$settings = Service::get('ExchangeSettingsFactory')->getCommonSettings();
			return [
				'config' => [
					'bool:use_cml_trade_offers' => $settings->getTradeOffersUsedInCMl(),
					'bool:restore_deleted_catalog_items_from_cml' => $settings->getNeedToRestoreCatalogItemsFromTrashInCML(),
					'bool:is_change_catalog_item_h1_from_cml' => $settings->getChangeCatalogItemH1InCML(),
					'bool:is_change_catalog_item_title_from_cml' => $settings->getChangeCatalogItemTitleInCML(),
					'bool:is_write_import_log' => $settings->getWriteImportLog(),
					'bool:is_update_parents' => $settings->getUpdateParents()
				]
			];
		}

		/**
		 * Устанавливает общие настройки модуля
		 * @param array $params настройки модуля
		 * @return void
		 * @throws \Exception
		 */
		private function setCommonParams(array $params) : void {
			Service::get('ExchangeSettingsFactory')
				->getCommonSettings()
				->setTradeOffersUsedInCMl($params['config']['bool:use_cml_trade_offers'])
				->setNeedToRestoreCatalogItemsFromTrashInCML($params['config']['bool:restore_deleted_catalog_items_from_cml'])
				->setChangeCatalogItemH1InCML($params['config']['bool:is_change_catalog_item_h1_from_cml'])
				->setChangeCatalogItemTitleInCML($params['config']['bool:is_change_catalog_item_title_from_cml'])
				->setWriteImportLog($params['config']['bool:is_write_import_log'])
				->setUpdateParents($params['config']['bool:is_update_parents']);
		}

		/**
		 * Возвращает специфические настройки модуля для всех сайтов
		 * @return array
		 * @throws \Exception
		 */
		private function getSiteParams() : array {
			$params = [];

			foreach (Service::DomainCollection()->getList() as $domain) {
				$domainId = $domain->getId();
				$settings = Service::get('ExchangeSettingsFactory')->getSiteSettings($domainId);
				$params["config-$domainId"] = [
					"status:domain" => $domain->getDecodedHost(),
					"bool:use_custom_params-$domainId" => $settings->getUseSiteSettings(),
					"bool:use_cml_trade_offers-$domainId" => $settings->getTradeOffersUsedInCMl(),
					"bool:restore_deleted_catalog_items_from_cml-$domainId" => $settings->getNeedToRestoreCatalogItemsFromTrashInCML(),
					"bool:is_change_catalog_item_h1_from_cml-$domainId" => $settings->getChangeCatalogItemH1InCML(),
					"bool:is_change_catalog_item_title_from_cml-$domainId" => $settings->getChangeCatalogItemTitleInCML(),
					"bool:is_write_import_log-$domainId" => $settings->getWriteImportLog(),
					"bool:is_update_parents-$domainId" => $settings->getUpdateParents()
				];
			}

			return $params;
		}

		/**
		 * Устанавливает специфические настройки модуля для всех сайтов
		 * @param array $params настройки модуля
		 * @return void
		 * @throws \Exception
		 */
		private function setSiteParams(array $params) : void {
			foreach (Service::DomainCollection()->getList() as $domain) {
				$domainId = $domain->getId();
				Service::get('ExchangeSettingsFactory')
					->getSiteSettings($domainId)
					->setUseSiteSettings($params["config-$domainId"]["bool:use_custom_params-$domainId"])
					->setTradeOffersUsedInCMl($params["config-$domainId"]["bool:use_cml_trade_offers-$domainId"])
					->setNeedToRestoreCatalogItemsFromTrashInCML($params["config-$domainId"]["bool:restore_deleted_catalog_items_from_cml-$domainId"])
					->setChangeCatalogItemH1InCML($params["config-$domainId"]["bool:is_change_catalog_item_h1_from_cml-$domainId"])
					->setChangeCatalogItemTitleInCML($params["config-$domainId"]["bool:is_change_catalog_item_title_from_cml-$domainId"])
					->setWriteImportLog($params["config-$domainId"]["bool:is_write_import_log-$domainId"])
					->setUpdateParents($params["config-$domainId"]["bool:is_update_parents-$domainId"]);
			}
		}
	}
