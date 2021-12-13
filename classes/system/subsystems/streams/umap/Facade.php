<?php
	namespace UmiCms\System\Streams\Umap;

	use \iConfiguration as iConfig;

	/**
	 * Класс фасада маршрутизатора umap
	 * @package UmiCms\System\Streams\Umap
	 */
	class Facade implements iFacade {

		/** @var iConfig $config конфигурация */
		private $config;

		/** @var iExecutor $executor исполнитель запросов */
		private $executor;

		/** @inheritDoc */
		public function __construct(iConfig $config, iExecutor $executor) {
			$this->config = $config;
			$this->executor = $executor;
		}

		/** @inheritDoc */
		public function execute($path) {
			try {
				$this->executor->execute($path);
			} catch (\Exception $exception) {
				//nothing
			}
		}

		/** @inheritDoc */
		public function isEnabled() {
			return (bool) $this->config->get('kernel', 'matches-enabled');
		}
	}