<?php
	namespace UmiCms\System\Streams\Umap;

	use \iConfiguration as iConfig;

	/**
	 * Интерфейс фасада маршрутизатора umap
	 * @package UmiCms\System\Streams\Umap
	 */
	interface iFacade {

		/**
		 * Конструктор
		 * @param iConfig $config конфигурация
		 * @param iExecutor $executor исполнитель запросов
		 */
		public function __construct(iConfig $config, iExecutor $executor);

		/**
		 * Выполняет маршрут через umap
		 * @param string $path маршрут
		 * @throws \Exception
		 */
		public function execute($path);

		/**
		 * Определяет включена ли маршуртизация через umap
		 * @return bool
		 */
		public function isEnabled();
	}