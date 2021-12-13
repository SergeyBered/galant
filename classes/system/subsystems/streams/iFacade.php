<?php
	namespace UmiCms\System\Streams;

	use \iConfiguration as iConfig;
	use \iCmsController as iExecutor;
	use UmiCms\System\Request\iFacade as iRequest;

	/**
	 * Интерфейс фасада потоков|протоколов
	 * @package UmiCms\System\Streams
	 */
	interface iFacade {

		/**
		 * Конструктор
		 * @param iConfig $config конфигурация
		 * @param iRequest $request запрос
		 * @param iExecutor $executor исполнитель потоков
		 * @param iPermissions $permission права на потоки
		 */
		public function __construct(iConfig $config, iRequest $request, iExecutor $executor, iPermissions $permission);

		/**
		 * Выполняет поток|протокол
		 * @param string $stream имя потока|протокола
		 * @return string
		 * @throws \ErrorException
		 * @throws \coreException
		 */
		public function execute($stream);
	}