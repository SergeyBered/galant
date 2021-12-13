<?php
	namespace UmiCms\Classes\System\Template\Engine;

	/**
	 * Интерфейс фабрики шаблонизаторов
	 * @package UmiCms\Classes\System\Template\Engine
	 */
	interface iFactory {

		/**
		 * Создает php шаблонизатор
		 * @param string $templatesSource источник шаблонов
		 * @return \umiTemplaterPHP|\iUmiTemplater|\IFullResult
		 */
		public function createPhp($templatesSource);

		/**
		 * Создает xsl шаблонизатор
		 * @param string $templatesSource источник шаблонов
		 * @return \umiTemplaterXSLT|\iUmiTemplater|\IFullResult
		 */
		public function createXsl($templatesSource);

		/**
		 * Создает tpl шаблонизатор
		 * @param string $templatesSource источник шаблонов
		 * @return \umiTemplaterXSLT|\iUmiTemplater
		 */
		public function createTpl($templatesSource);
	}