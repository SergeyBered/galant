<?php

	namespace UmiCms\Classes\Components\AutoUpdate\UpdateServer;

	use UmiCms\System\Registry\iSettings;
	use UmiCms\System\Cache\iEngineFactory;
	use UmiCms\System\Request\Http\iRequest;
	use UmiCms\Classes\System\Entities\Date\iFactory;
	use UmiCms\Utils\Logger\iFactory as iLoggerFactory;
	use UmiCms\Classes\Components\AutoUpdate\iRegistry;
	use UmiCms\Classes\System\Utils\Api\Http\Exception\BadResponse;

	/**
	 * Интерфейс клиента сервера обновлений
	 *
	 * @solution
	 *
	 * [
	 * 		'title' => 'Сайт по продаже часов',
	 * 		'name' => 's100500',
	 * 		'type' => 'Интернет-магазин',
	 * 		'image' => 'https://umi.ru/design/s100500/white/preview.png',
	 * 		'thumb' => 'https://umi.ru/design/s100500/white/preview_thumb.png',
	 * 		'category' => 'Стиль, Часы'
	 * ]
	 *
	 * @type|@category
	 *
	 * [
	 * 		'id' => '100500',
	 * 		'title' => 'Сайт специалиста'
	 * ]
	 *
	 * @package UmiCms\Classes\Components\AutoUpdate\UpdateServer
	 */
	interface iClient {

		/**
		 * Конструктор
		 * @param iRequest $request http запрос
		 * @param iRegistry $registry реестр модуля "Автообновления"
		 * @param iSettings $settings реестр общих настроек системы
		 * @param iFactory $dateFactory фабрика дат
		 * @param iEngineFactory $engineFactory фабрика хранилищ кеша
		 * @param \iDomainsCollection $domainCollection коллекция доменов
		 * @param iLoggerFactory $loggerFactory экземпляр фабрики логгеров
		 * @param \iConfiguration $configuration конфигурация
		 */
		public function __construct(
			iRequest $request,
			iRegistry $registry,
			iSettings $settings,
			iFactory $dateFactory,
			iEngineFactory $engineFactory,
			\iDomainsCollection $domainCollection,
			iLoggerFactory $loggerFactory,
			\iConfiguration $configuration
		);

		/**
		 * Возвращает номер последней ревизии
		 * @return int
		 * @throws BadResponse
		 * @throws \RuntimeException
		 */
		public function getLastRevision();

		/**
		 * Возвращает номер последней версии
		 * @return int
		 * @throws BadResponse
		 * @throws \RuntimeException
		 */
		public function getLastVersion();

		/**
		 * Возвращает дату окончания поддержки
		 * @return \iUmiDate
		 * @throws BadResponse
		 * @throws \RuntimeException
		 */
		public function getSupportEndTime();

		/**
		 * Возвращает список модулей, доступных для установки
		 * @return array
		 *
		 * [
		 *      'news' => 'Новости',
		 * ]
		 *
		 * @throws BadResponse
		 * @throws \RuntimeException
		 */
		public function getAvailableModuleList();

		/**
		 * Возвращает список расширений, доступных для установки
		 * @return array
		 *
		 * [
		 *      'cpunumpages' => 'ЧПУ numpages',
		 * ]
		 *
		 * @throws BadResponse
		 * @throws \RuntimeException
		 */
		public function getAvailableExtensionList();

		/**
		 * Возвращает список модулей, которые не должны быть установлены на текущей системе
		 * @return array
		 *
		 * [
		 *      'news'
		 * ]
		 *
		 * @throws BadResponse
		 * @throws \RuntimeException
		 */
		public function getIllegalModuleList();

		/**
		 * Возвращает список расширений, которые не должны быть установлены на текущей системе
		 * @return array
		 *
		 * [
		 *      'cpunumpages'
		 * ]
		 *
		 * @throws BadResponse
		 * @throws \RuntimeException
		 */
		public function getIllegalExtensionList();

		/**
		 * Возвращает список файлов компонента
		 * @param string $name имя компонента
		 * @return array
		 *
		 * [
		 *      '7aabc04173bb8edf45a000cc9e6f0bf8' => './classes/modules/faq/events.php'
		 * ]
		 *
		 * @throws BadResponse
		 * @throws \RuntimeException
		 */
		public function getComponentFileList($name);

		/**
		 * Возвращает список заданных решений
		 * @param string[] $nameList список имен готовых решений
		 *
		 * [
		 *		's100500',
		 * 		'p1488',
		 * 		'demomarket'
		 * ]
		 *
		 * @return array
		 *
		 * [
		 *		<id> => iClient @solution
		 * ]
		 *
		 * @throws BadResponse
		 * @throws \RuntimeException
		 */
		public function getSolutionList(array $nameList);

		/**
		 * Возвращает полный список решений (демо, бесплатных и купленных) с их категориями и типами
		 * @return array
		 *
		 * [
		 *		'types' => [
		 * 			iClient @type|@category
		 * 		],
		 *		'categories' => [
		 * 			iClient @type|@category
		 * 		],
		 *		'demo' => [
		 * 			iClient @solution
		 * 		],
		 *		'free' => [
		 * 			iClient @solution
		 * 		],
		 *		'paid' => [
		 * 			iClient @solution
		 * 		]
		 * ]
		 *
		 * @throws BadResponse
		 * @throws \RuntimeException
		 */
		public function getFullSolutionList();
	}
