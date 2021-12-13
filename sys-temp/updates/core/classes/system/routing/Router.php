<?php
	namespace UmiCms\Classes\System\Routing;

	use \iConfiguration as iConfig;
	use Symfony\Component\Config\FileLocator;
	use UmiCms\System\Events\iEventPointFactory;
	use Symfony\Component\Routing\RequestContext;
	use Symfony\Component\Routing\RouteCollection;
	use Symfony\Component\Routing\Matcher\UrlMatcher;
	use Symfony\Component\Routing\Loader\PhpFileLoader;

	/**
	 * Класс роутера
	 * @package UmiCms\Classes\System\Routing
	 */
	class Router implements iRouter {

		/** @var iConfig $config конфигурация */
		private $config;

		/** @var iEventPointFactory $eventPointFactory фабрика событий */
		private $eventPointFactory;

		/** @inheritDoc */
		public function __construct(iConfig $config, iEventPointFactory $eventPointFactory) {
			$this->config = $config;
			$this->eventPointFactory = $eventPointFactory;
		}

		/** @inheritDoc */
		public function resolve($path) {
			$context = new RequestContext('/');
			$overWritableRoutes = $this->loadOverWritableRoutes();
			$customRoutes = $this->loadCustomRoutes();

			$event = $this->eventPointFactory->create('load-routes', 'before');
			$event->setParam('overWritableRoutes', $overWritableRoutes);
			$event->setParam('customRoutes', $customRoutes);
			$event->setParam('context', $context);

			try {
				$event->call();
			} catch (\ErrorException $exception) {
				\umiExceptionHandler::report($exception);
			}

			$overWritableRoutes = ($event->getParam('overWritableRoutes') instanceof RouteCollection)
				? $event->getParam('overWritableRoutes') : $overWritableRoutes;
			$customRoutes = ($event->getParam('customRoutes') instanceof RouteCollection)
				? $event->getParam('customRoutes') : $customRoutes;
			$systemRoutes = $this->loadSystemRouters();

			$routesCollection = new RouteCollection();
			$routesCollection->addCollection($overWritableRoutes);
			$routesCollection->addCollection($customRoutes);
			$routesCollection->addCollection($systemRoutes);

			$matcher = new UrlMatcher($routesCollection, $context);
			$path = sprintf('/%s', ltrim($path, '/'));
			return $matcher->match($path);
		}

		/**
		 * Загружает перезаписываемые маршруты
		 * @return RouteCollection
		 */
		private function loadOverWritableRoutes() {
			return $this->createLoader()
				->load('classes/system/routing/OverWritableRoutes.php');
		}

		/**
		 * Загружает пользовательские маршруты
		 * @return RouteCollection
		 */
		private function loadCustomRoutes() {
			$path = $this->config->get('router', 'custom-routes-path');

			try {
				$routeCollection = $this->createLoader()->load(ltrim($path, '/'));
			} catch (\InvalidArgumentException $exception) {
				$routeCollection = new RouteCollection();
			}

			return $routeCollection;
		}

		/**
		 * Загружает системные маршруты
		 * @return RouteCollection
		 */
		private function loadSystemRouters() {
			return $this->createLoader()
				->load('classes/system/routing/SystemRoutes.php');
		}

		/**
		 * Создает загрузчика маршрутов
		 * @return PhpFileLoader
		 */
		private function createLoader() {
			$fileLocator =  $this->createLocator();
			return new PhpFileLoader($fileLocator);
		}

		/**
		 * Создает указатель на путь
		 * @return FileLocator
		 */
		private function createLocator() {
			return  new FileLocator([CURRENT_WORKING_DIR]);
		}
	}