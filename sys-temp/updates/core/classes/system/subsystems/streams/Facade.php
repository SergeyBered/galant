<?php
	namespace UmiCms\System\Streams;

	use \iConfiguration as iConfig;
	use \iCmsController as iExecutor;
	use UmiCms\System\Request\iFacade as iRequest;

	/**
	 * Класс фасада потоков|протоколов
	 * @package UmiCms\System\Streams
	 */
	class Facade implements iFacade {

		/** @var iConfig $config конфигурация */
		private $config;

		/** @var iRequest $request запрос */
		private $request;

		/** @var iExecutor $executor исполнитель потоков */
		private $executor;

		/** @var iPermissions $permission права на потоки */
		private $permission;

		/** @inheritDoc */
		public function __construct(iConfig $config, iRequest $request, iExecutor $executor, iPermissions $permission) {
			$this->config = $config;
			$this->request = $request;
			$this->executor = $executor;
			$this->permission = $permission;
		}

		/** @inheritDoc */
		public function execute($stream) {
			$this->executor::doSomething();
			$this->executor->calculateRefererUri();
			$this->executor->analyzePath();

			if (!$this->permission->isAllowed($stream)) {
				throw new \ErrorException(sprintf('Not allowed stream "%s"', $stream));
			}

			if (!$this->permission->isAllowedForHttp($stream)) {
				throw new \ErrorException(sprintf('Not allowed stream "%s" for http', $stream));
			}

			try {
				if (!$this->config->get('streams', 'udata.http.extended.allow')) {
					$oldValue = \umiBaseStream::$allowExtendedOptions;
					\umiBaseStream::$allowExtendedOptions = false;
				}

				$result = $this->executor->executeStream($stream . '://' . $this->getPath($stream));

				if (!$this->config->get('streams', 'udata.http.extended.allow')) {
					\umiBaseStream::$allowExtendedOptions = $oldValue;
				}

				return $result;
			} catch (\Exception $exception) {
				throw new \ErrorException($exception->getMessage());
			}
		}

		/**
		 * Возвращает адрес запроса к системе
		 * @param string $stream имя потока|протокола
		 * @return string
		 */
		private function getPath($stream) {
			$path = (string) $this->request->getPath();
			$uri = $this->request->uri();

			if ($uri) {
				preg_match("/\/(" . implode('|', $this->config->get('streams', 'enable')) . "):?\/{0,2}(.*)?/i", $uri, $out);
				$path = $out[2];
				$_SERVER['REQUEST_URI'] = '/' . $stream . '/' . $path; // unknown legacy
			}

			return $path;
		}
	}