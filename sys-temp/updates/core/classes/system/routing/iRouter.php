<?php
	namespace UmiCms\Classes\System\Routing;

	use \iConfiguration as iConfig;
	use UmiCms\System\Events\iEventPointFactory;

	/**
	 * Интерфейс роутера
	 * @package UmiCms\Classes\System\Routing
	 */
	interface iRouter {

		/**
		 * Конструктор
		 * @param iConfig $config конфигурация
		 * @param iEventPointFactory $eventPointFactory фабрика событий
		 */
		public function __construct(iConfig $config, iEventPointFactory $eventPointFactory);

		/**
		 * Разрешает запрос
		 * @param string $path строка запроса
		 * @return array
		 */
		public function resolve($path);
	}