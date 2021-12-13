<?php
	namespace UmiCms\System\Streams;

	use UmiCms\System\Auth\iAuth;
	use \iConfiguration as iConfig;
	use \iUmiObjectsCollection as iObjects;
	use UmiCms\System\Request\iFacade as iRequest;
	use \iPermissionsCollection as iBasePermissions;

	/**
	 * Интерфейс определения прав доступа на выполнение протоколов|потоков
	 * @package UmiCms\System\Streams
	 */
	interface iPermissions {

		/**
		 * Конструктор
		 * @param iAuth $auth фасад аутентификации и авторизации
		 * @param iConfig $config конфигурация
		 * @param iObjects $objects фасад объектов
		 * @param iRequest $request запрос
		 * @param iBasePermissions $permission фасад прав доступа
		 */
		public function __construct(iAuth $auth, iConfig $config, iObjects $objects, iRequest $request, iBasePermissions $permission);

		/**
		 * Определяет можно ли выполнять протокол|поток
		 * @param string $stream имя протокола|потока
		 * @return bool
		 */
		public function isAllowed($stream);

		/**
		 * Определяет можно ли выполнять протокол|поток по http
		 * @param string $stream имя протокола|потока
		 * @return bool
		 */
		public function isAllowedForHttp($stream);
	}