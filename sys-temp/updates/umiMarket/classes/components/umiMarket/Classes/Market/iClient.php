<?php
	namespace UmiCms\Classes\Components\UmiMarket\Market;

	use UmiCms\Utils\Logger\iFactory as iLoggerFactory;
	use UmiCms\System\Cache\iEngineFactory as iCacheEngineFactory;
	use UmiCms\Classes\System\Utils\Api\Http\Exception\BadResponse;
	use UmiCms\Classes\System\Entities\Image\iFactory as iImageFactory;

	/**
	 * Интерфейс http клиента для сервиса https://market.umi-cms.ru
	 * @package UmiCms\Classes\Components\UmiMarket\Market
	 */
	interface iClient {

		/**
		 * Конструктор
		 * @param \iConfiguration $config конфигурация системы
		 * @param iImageFactory $imageFactory фабрика изображений
		 * @param iCacheEngineFactory $cacheEngineFactory фабрика хранилищей кеша
		 * @param iLoggerFactory $loggerFactory экземпляр фабрики логгеров
		 * @throws \coreException
		 */
		public function __construct(
			\iConfiguration $config, iImageFactory $imageFactory, iCacheEngineFactory $cacheEngineFactory, iLoggerFactory $loggerFactory
		);

		/**
		 * Возвращает список категорий товаров
		 * @return array
		 * @throws BadResponse
		 */
		public function getCategoryList();

		/**
		 * Возвращает список новых товаров
		 * @return array
		 * @throws BadResponse
		 */
		public function getNewProductList();

		/**
		 * Возвращает список популярных товаров
		 * @return array
		 * @throws BadResponse
		 */
		public function getPopularProductList();

		/**
		 * Возвращает список товаров с заданными параметрами
		 * @param int $categoryId идентификатор категории
		 * @param int $siteTypeId идентификатор типа сайта
		 * @param int $offset смещение списка
		 * @param int $limit длина списка
		 * @return array
		 * @throws BadResponse
		 */
		public function getProductList($categoryId = 0, $siteTypeId = 0, $offset = 0, $limit = 15);
	}