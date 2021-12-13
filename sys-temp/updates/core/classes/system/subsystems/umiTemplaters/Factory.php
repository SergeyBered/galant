<?php
	namespace UmiCms\Classes\System\Template\Engine;

	/**
	 * Класс фабрики шаблонизаторов
	 * @package UmiCms\Classes\System\Template\Engine
	 */
	class Factory implements iFactory {

		/** @inheritDoc */
		public function createPhp($templatesSource) {
			return new \umiTemplaterPHP($templatesSource);
		}

		/** @inheritDoc */
		public function createXsl($templatesSource) {
			return new \umiTemplaterXSLT($templatesSource);
		}

		/** @inheritDoc */
		public function createTpl($templatesSource) {
			return new \umiTemplaterTPL($templatesSource);
		}
	}