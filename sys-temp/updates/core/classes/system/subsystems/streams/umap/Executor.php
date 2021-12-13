<?php
	namespace UmiCms\System\Streams\Umap;

	/**
	 * Класс исполнителя машрутов по umap
	 * @package UmiCms\System\Streams\Umap
	 */
	class Executor implements iExecutor {

		/** @var iFactory $factory */
		private $factory;

		/** @inheritDoc */
		public function __construct(iFactory $factory) {
			$this->factory = $factory;
		}

		/** @inheritDoc */
		public function execute($path) {
			$matches = $this->factory->create();
			$matches->setCurrentURI($path);
			$matches->execute();
		}
	}