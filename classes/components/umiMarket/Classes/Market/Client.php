<?php
	namespace UmiCms\Classes\Components\UmiMarket\Market;

	use Psr\Http\Message\RequestInterface;
	use UmiCms\Utils\Logger\iFactory as iLoggerFactory;
	use UmiCms\System\Cache\iEngineFactory as iCacheEngineFactory;
	use UmiCms\Classes\System\Utils\Api\Http\Exception\BadResponse;
	use UmiCms\Classes\System\Utils\Api\Http\Xml\Client as HttpClient;
	use UmiCms\Classes\System\Entities\Image\iFactory as iImageFactory;

	/**
	 * Класс http клиента для сервиса https://market.umi-cms.ru
	 * @package UmiCms\Classes\Components\UmiMarket\Market
	 */
	class Client extends HttpClient implements iClient {

		/** @var \iConfiguration $config конфигурация системы */
		private $config;

		/** @var iImageFactory $imageFactory фабрика изображений */
		private $imageFactory;

		/** @var \iCacheEngine $cacheEngine хранилище кеша */
		private $cacheEngine;

		/** @var string SERVICE_URL адрес сервиса */
		const SERVICE_URL = 'https://market.umi-cms.ru/';

		/** @var int SHOP_TYPE_ID идентификатор типа товара "сайт" */
		const SHOP_TYPE_ID = 440324;

		/** @var int SHOP_TYPE_ID идентификатор типа товара "магазин" */
		const SITE_TYPE_ID = 440325;

		/** @var int SHOP_TYPE_ID идентификатор типа товара "лендинг" */
		const LANDING_TYPE_ID = 474208;

		/** @var int MODULES_TYPE_ID идентификатор типа товара "модуль" */
		const MODULES_TYPE_ID = 439940;

		/** @var int EXTENSION_TYPE_ID идентификатор типа товара "расширение" */
		const EXTENSION_TYPE_ID = 439942;

		/** @var int MODULES_BINDING_ID идентификатор привязки категории товара к модулям */
		const MODULES_BINDING_ID = 439906;

		/** @inheritDoc */
		public function __construct(\iConfiguration $config, iImageFactory $imageFactory, iCacheEngineFactory $cacheEngineFactory, iLoggerFactory $loggerFactory) {
			$this->config = $config;
			$this->imageFactory = $imageFactory;
			$this->cacheEngine = $cacheEngineFactory->create();
			$this->initLogger($loggerFactory, $this->config);
			$keepLog = $this->config->get('debug', 'enabled');
			$this->setKeepLog($keepLog);
			$this->initHttpClient();
		}

		/** @inheritDoc */
		public function getCategoryList() {
			$request = $this->createGetRequest(['udata', 'partners', 'getCategoryMarketToXslt']);
			return $this->getResult($request, [$this, 'parseCategoryList']);
		}

		/** @inheritDoc */
		public function getNewProductList() {
			$request = $this->createGetRequest(['usel', 'getNew']);
			return $this->getResult($request, [$this, 'parseProductList']);
		}

		/** @inheritDoc */
		public function getPopularProductList() {
			$request = $this->createGetRequest(['usel', 'getPopular']);
			return $this->getResult($request, [$this, 'parseProductList']);
		}

		/** @inheritDoc */
		public function getProductList($categoryId = 0, $siteTypeId = 0, $offset = 0, $limit = 15) {

			if ($siteTypeId === self::MODULES_TYPE_ID && $categoryId === 0) {
				$request = $this->createGetRequest(['usel', 'getObjectsByParentCategory', $limit], ['p' => $offset]);
			} else {
				$siteTypeId = ($siteTypeId === self::MODULES_TYPE_ID) ? 0 : $siteTypeId;
				$request = $this->createGetRequest(['usel', 'getObjectsByCategory', $categoryId, $limit, $siteTypeId], ['p' => $offset]);
			}

			return $this->getResult($request, [$this, 'parseProductList']);
		}

		/**
		 * Разбирает ответ сервиса и возвращает список категорий
		 * @param \SimpleXMLElement $categoryNodeList узлы категорий ответа сервиса
		 * @return array
		 */
		private function parseCategoryList(\SimpleXMLElement $categoryNodeList) {
			$shopList = [];
			$siteList = [];
			$landingList = [];
			$moduleList = [];

			foreach ($categoryNodeList->xpath('/udata/items/item') as $categoryNode) {
				$category = $this->parseCategory($categoryNode);
				$attributeList = $categoryNode->attributes();
				$isModule = (string) $attributeList->prinadlezhnost == self::MODULES_BINDING_ID;

				$shopCount = (string) $attributeList->magaziny;

				if ($shopCount > 0 && !$isModule) {
					$category['@count'] = $shopCount;
					$shopList[] = $category;
				}

				$siteCount = (string) $attributeList->sajty;

				if ($siteCount > 0 && !$isModule) {
					$category['@count'] = $siteCount;
					$siteList[] = $category;
				}

				$landingCount = (string) $attributeList->lendingi;

				if ($landingCount > 0 && !$isModule) {
					$category['@count'] = $landingCount;
					$landingList[] = $category;
				}

				$moduleCount = (string) $attributeList->modules;

				if ($moduleCount > 0 && $isModule) {
					$category['@count'] = $moduleCount;
					$moduleList[] = $category;
				}
			}

			return  [
				'nodes:type' => [
					[
						'@label' => getLabel('label-market-shop-type'),
						'@siteTypeId' => self::SHOP_TYPE_ID,
						'nodes:category' => $shopList
					],
					[
						'@label' => getLabel('label-market-site-type'),
						'@siteTypeId' => self::SITE_TYPE_ID,
						'nodes:category' => $siteList
					],
					[
						'@label' => getLabel('label-market-landing-type'),
						'@siteTypeId' => self::LANDING_TYPE_ID,
						'nodes:category' => $landingList
					],
					[
						'@label' => getLabel('label-market-module-type'),
						'@siteTypeId' => self::MODULES_TYPE_ID,
						'nodes:category' => $moduleList
					]
				]
			];
		}

		/**
		 * Разбирает ответ сервиса и возвращает атрибуты категории
		 * @param \SimpleXMLElement $categoryNode узел категории ответа сервиса
		 * @return array
		 */
		private function parseCategory(\SimpleXMLElement $categoryNode) {
			$attributeList = $categoryNode->attributes();
			return [
				'@id' => (string) $attributeList->id,
				'@name' => (string) $attributeList->name,
			];
		}

		/**
		 * Разбирает ответ сервиса и возвращает список товаров
		 * @param \SimpleXMLElement $productNodeList узлы товаров ответа сервиса
		 * @return array
		 * @throws BadResponse
		 */
		private function parseProductList(\SimpleXMLElement $productNodeList) {
			$productList = [];

			foreach ($productNodeList->xpath('/udata/page') as $productNode) {
				$productList[] = $this->parseProduct($productNode);
			}

			return [
				'@total' => (string) $productNodeList->xpath('/udata/total')[0],
				'nodes:item' => $productList
			];
		}

		/**
		 * Разбирает ответ сервиса и возвращает список атрибутов товара
		 * @param \SimpleXMLElement $productNode узел товара ответа сервиса
		 * @return array
		 * @throws BadResponse
		 */
		private function parseProduct(\SimpleXMLElement $productNode) {
			$id = (string) $productNode->xpath('@id')[0];
			return [
				'@id' => $id,
				'@name' => (string) $productNode->xpath('name')[0],
				'@price' => (string) $productNode->xpath('extended/properties/property[@name = "price"]/value')[0],
				'@link' => $this->buildAbsoluteMarketUrl((string) $productNode->xpath('@link')[0]),
				'type' => $this->parseRelatedObjectList($productNode,
					'extended/groups/group[@name = "good_props"]/property[@name = "tip_tovara"]/value/item'
				),
				'category' => $this->parseRelatedObjectList($productNode,
					'extended/groups/group[@name = "good_props"]/property[@name = "kategoriya"]/value/item'
				),
				'edition' => $this->parseRelatedPageList($productNode,
					'extended/groups/group[@name = "good_props"]/property[@name = "podhodyawie_redakcii"]/value/page'
				),
				'siteType' => $this->parseRelatedObjectList($productNode,
					'extended/groups/group[@name = "good_props"]/property[@name = "tip_gotovogo_resheniya"]/value/item'
				),
				'@image' => $this->getMainImage($productNode),
				'@rate' => $this->getProductRate($id),
				'@isModule' => $this->isModule($productNode)
			];
		}

		/**
		 * Возвращает основное изображение товара
		 * @param \SimpleXMLElement $productNode узел товара ответа сервиса
		 * @return string
		 */
		private function getMainImage(\SimpleXMLElement $productNode) {
			$xpath = 'extended/groups/group[@name = "images_props"]/property[@name = "skrinshot_1"]/value';

			if ($this->isModule($productNode)) {
				$xpath = 'extended/groups/group[@name = "images_props"]/property[@name = "izobrazhenie"]/value';
			}

			return $this->parseImage($productNode, $xpath);
		}

		/**
		 * Определяет является ли товар модулем (или расширением)
		 * @param \SimpleXMLElement $productNode узел товара ответа сервиса
		 * @return bool
		 */
		private function isModule(\SimpleXMLElement $productNode) {
			$productTypeID = (string) $productNode->xpath('extended/groups/group[@name = "good_props"]/property[@name = "tip_tovara"]/value/item/@id')[0];
			$nodesetType = (string) $productNode->xpath('../@method')[0];
			return in_array($productTypeID, [self::MODULES_TYPE_ID, self::EXTENSION_TYPE_ID]) || $nodesetType === 'getNew';
		}

		/**
		 * Возвращает рейтинг товара
		 * @param int $id идентификатор товара
		 * @return int
		 * @throws BadResponse
		 */
		private function getProductRate($id) {
			$request = $this->createGetRequest([
				'udata', 'vote', 'getRate', $id
			]);

			return $this->getResult($request, [$this, 'parseProductRate']);
		}

		/**
		 * Разбирает ответ сервиса и возвращает рейтинг товара
		 * @param \SimpleXMLElement $rateNodeList список узлов рейтинга товара
		 * @return int
		 */
		private function parseProductRate(\SimpleXMLElement $rateNodeList) {
			$rateList = $rateNodeList->xpath('/udata/ceil_rate');
			return isset($rateList[0]) ? (int) (string) $rateList[0] : 0;
		}

		/**
		 * Разбирает ответ сервиса и возвращает список объектов, связанных с товаром
		 * @param \SimpleXMLElement $productNode узел товара ответа сервиса
		 * @param string $xpath выражение для получения списка
		 * @return array
		 */
		private function parseRelatedObjectList(\SimpleXMLElement $productNode, $xpath) {
			$objectList = [];

			foreach ($productNode->xpath($xpath) as $objectNode) {
				$attributeList = $objectNode->attributes();
				$objectList[] = [
					'@id' => (string) $attributeList->id,
					'@name' => (string) $attributeList->name
				];
			}

			return ['nodes:item' => $objectList];
		}

		/**
		 * Разбирает ответ сервиса и возвращает список страниц, связанных с товаром
		 * @param \SimpleXMLElement $productNode узел товара ответа сервиса
		 * @param string $xpath выражение для получения списка
		 * @return array
		 */
		private function parseRelatedPageList(\SimpleXMLElement $productNode, $xpath) {
			$pageList = [];

			foreach ($productNode->xpath($xpath) as $pageNode) {
				$pageList[] = [
					'@id' => (string) $pageNode->attributes()->id,
					'@name' => (string) (string) $pageNode->xpath('name')[0]
				];
			}

			return ['nodes:item' => $pageList];
		}

		/**
		 * Разбирает ответ сервиса и возвращает изображение товара
		 * @param \SimpleXMLElement $productNode узел товара ответа сервиса
		 * @param string $xpath выражение для получения изображения
		 * @return string
		 */
		private function parseImage(\SimpleXMLElement $productNode, $xpath) {
			$imageList = $productNode->xpath($xpath);
			return isset($imageList[0]) ? $this->buildAbsoluteMarketUrl((string) $imageList[0]) : $this->getPlaceHolderPath();
		}

		/**
		 * Формирует абсолютную ссылку на ресурс сервиса
		 * @param string $localPath относительная ссылка на ресурс сервиса
		 * @return string
		 */
		private function buildAbsoluteMarketUrl($localPath) {
			return self::SERVICE_URL . ltrim($localPath, '/');
		}

		/**
		 * Возвращает путь до изображения-заглушки
		 * @return string
		 */
		private function getPlaceHolderPath() {
			$absolutePath = $this->config->includeParam('no-image-holder');
			$placeHolder = $this->imageFactory->create($absolutePath);
			return $placeHolder->getFilePath(true);
		}

		/** @inheritDoc */
		protected function getServiceUrl() {
			return $this->buildPath([self::SERVICE_URL]);
		}

		/** @inheritDoc */
		protected function getLogDirectory() {
			return 'UmiMarket';
		}

		/**
		 * @inheritDoc
		 * @throws \Exception
		 * @throws BadResponse
		 */
		protected function getResponse(RequestInterface $request) {
			try {
				$response = $this->send($request);
			} catch (\Exception $exception) {
				\umiExceptionHandler::report($exception);
				return new \SimpleXMLElement('<udata><total>0</total></udata>');
			}

			$this->log($request, $response);
			return $this->getResponseBody($response);
		}

		/**
		 * Отправляет запрос к серверу обновлений и возвращает ответ
		 * @param RequestInterface $request запрос
		 * @return \SimpleXMLElement
		 * @throws BadResponse
		 */
		private function sendRequest(RequestInterface $request) {
			/** @var \SimpleXMLElement $response */
			$response = $this->getResponse($request);

			if (!$response instanceof \SimpleXMLElement) {
				throw new \RuntimeException('Incorrect response given', 3);
			}

			return $response;
		}

		/**
		 * Возвращает результат запроса к сервису
		 * @param RequestInterface $request запрос к сервису
		 * @param callable $parser обработчик запроса
		 * @return mixed
		 * @throws BadResponse
		 */
		private function getResult(RequestInterface $request, callable $parser) {
			$key = $request->getUri();
			$resultFromCache = $this->cacheEngine->loadRawData($key);

			if (is_array($resultFromCache)) {
				return $resultFromCache;
			}

			$response = $this->sendRequest($request);
			$result = $parser($response);

			$this->cacheEngine->saveRawData($key, $result, 60 * 60 * 24 * 7);

			return $result;
		}
	}