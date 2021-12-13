<?php
	namespace UmiCms\System\Streams\Umap;

	/**
	 * Интерфейс исполнителя машрутов по umap
	 * @package UmiCms\System\Streams\Umap
	 */
	interface iExecutor {

		/**
		 * Конструктор
		 * @param iFactory $factory фабрика маршрутизаторов
		 */
		public function __construct(iFactory $factory);

		/**
		 * Выполняет маршрутизацию по umap
		 * @param string $path маршрут
		 */
		public function execute($path);
	}