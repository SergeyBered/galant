<?php

	namespace UmiCms\Classes\Components\Exchange;

	/** Интерфейс для управления настройками модуля "Обмен данными" */
	interface iAdminSettingsManager {

		/**
		 * Возвращает настройки модуля (общие + специфические для каждого сайта)
		 * @return array
		 * @throws \Exception
		 */
		public function getParams();

		/**
		 * Устанавливает настройки модуля (общие + специфические для каждого сайта)
		 * @param array $params настройки модуля
		 * @return void
		 * @throws \Exception
		 */
		public function setParams(array $params) : void;
	}
