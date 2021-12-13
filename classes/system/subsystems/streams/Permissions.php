<?php
	namespace UmiCms\System\Streams;

	use \iUmiObject as iObject;
	use UmiCms\System\Auth\iAuth;
	use \iConfiguration as iConfig;
	use \iUmiObjectsCollection as iObjects;
	use UmiCms\System\Request\iFacade as iRequest;
	use \iPermissionsCollection as iBasePermissions;

	/**
	 * Класс определения прав доступа на выполнение протоколов|потоков
	 * @package UmiCms\System\Streams
	 */
	class Permissions implements iPermissions {

		/** @var iAuth $auth фасад аутентификации и авторизации */
		private $auth;

		/** @var iConfig $config конфигурация */
		private $config;

		/** @var iObjects $objects фасад объектов */
		private $objects;

		/** @var iRequest $request запрос */
		private $request;

		/** @var iBasePermissions $permission фасад прав доступа */
		private $permission;

		/** @const string[] SECURE_STREAM_LIST  список безопасных протоколов|потоков для выполнения по http */
		const SECURE_STREAM_LIST = ['ulang', 'utype'];

		/**
		 * Конструктор
		 * @param iAuth $auth фасад аутентификации и авторизации
		 * @param iConfig $config конфигурация
		 * @param iObjects $objects фасад объектов
		 * @param iRequest $request запрос
		 * @param iBasePermissions $permission фасад прав доступа
		 */
		public function __construct(iAuth $auth, iConfig $config, iObjects $objects, iRequest $request, iBasePermissions $permission) {
			$this->auth = $auth;
			$this->config = $config;
			$this->objects = $objects;
			$this->request = $request;
			$this->permission = $permission;
		}

		/**
		 * Определяет можно ли выполнять протокол|поток
		 * @param string $stream имя протокола|потока
		 * @return bool
		 */
		public function isAllowed($stream) {
			return in_array($stream, $this->getAllowedStreamList());
		}

		/**
		 * Определяет можно ли выполнять протокол|поток по http
		 * @param string $stream имя протокола|потока
		 * @return bool
		 */
		public function isAllowedForHttp($stream) {
			if ($this->isAllowedHttpStream($stream) || $this->isHttpSecureStream($stream)) {
				return true;
			}

			$isPermittedScheme = $this->isPermittedHttpScheme($stream);
			$isPermittedMacro = $this->isPermittedHttpMacro($stream);
			$isPermittedIp = false;

			if (!$isPermittedMacro && $this->request->remoteAddress()) {
				$isPermittedIp = $this->isPermittedHttpIp($stream);
			}

			return ($isPermittedScheme || $isPermittedMacro || $isPermittedIp);
		}

		/**
		 * Возвращает список поддерживаемых протоколов|потоков
		 * @return array
		 */
		private function getAllowedStreamList() {
			return (array) $this->config->get('streams', 'enable');
		}

		/**
		 * Определяет разрешено ли выполнения протокола|потока по http
		 * @param string $stream имя протокола|потока
		 * @return mixed
		 */
		private function isAllowedHttpStream($stream) {
			return $this->config->get('streams', $stream . '.http.allow');
		}

		/**
		 * Определяет является ли протокол|поток безопасным для выполнения по http
		 * @param string $stream имя протокола|потока
		 * @return bool
		 */
		private function isHttpSecureStream($stream) {
			return in_array($stream, self::SECURE_STREAM_LIST);
		}

		/**
		 * Определяет разрешено ли выполнение заданного протокола|потока по http текущим уровнем доступа
		 * @param string $stream имя протокола|потока
		 * @return bool
		 */
		private function isPermittedHttpScheme($stream) {
			$securityLevel = $this->getHttpSecurityLevel($stream);
			return $this->isPermittedHttpBySecurityLevel($securityLevel);
		}

		/**
		 * Возвращает уровень доступа к заданному протоколу|потоку
		 * @param string $stream имя протокола|потока
		 * @return string
		 */
		private function getHttpSecurityLevel($stream) {
			return (string) $this->config->get('streams', $stream . '.http.permissions');
		}

		/**
		 * Определяет разрешено ли выполнение текущего протокола|потока по уровню доступа по http
		 * @param string $level уровень доступа
		 * @return bool
		 */
		private function isPermittedHttpBySecurityLevel($level) {
			switch ($level) {
				case '' : {
					return false;
				}
				case 'all' : {
					return true;
				}
				case 'sv': {
					return $this->permission->isSv();
				}
				case 'admin': {
					return $this->permission->isAdmin() || $this->permission->isSv();
				}
				case 'auth': {
					return $this->auth->isAuthorized();
				}
				default: {
					$userId = $this->auth->getUserId();
					$groupIdList = $this->getUserGroupIdList($userId);

					foreach (explode(',', $level) as $permittedId) {
						$permittedId = (int) $permittedId;

						if ($permittedId == $userId || in_array($permittedId, $groupIdList)) {
							return true;
						}
					}

					return false;
				}
			}
		}

		/**
		 * Возвращает список идентификаторов групп пользователя
		 * @param int $id идентификатор пользователя
		 * @return int[]
		 */
		private function getUserGroupIdList($id) {
			$user = $this->objects->getObject($id);
			return ($user instanceof iObject) ? $user->getValue('groups') : [];
		}

		/**
		 * Определяет разрешено ли выполнение текущего макроса по заданному протоколу|потоку по http
		 * @param string $stream имя протокола|потока
		 * @return bool
		 */
		private function isPermittedHttpMacro($stream) {
			return $this->config->get('streams', $stream . '.http.allow.' . $this->getMacroKey()) == '1';
		}

		/**
		 * Возвращает обозначение текущего выполняемого макроса
		 * @return string
		 */
		private function getMacroKey() {
			$data = explode('/', $this->request->getPath());
			$module = isset($data[1]) ? $data[1] : '';
			$method = isset($data[2]) ? $data[2] : '';
			return $module . '.' . $method;
		}

		/**
		 * Определяет разрешено ли выполнение заданного протокола|потока по http c текущего ip
		 * @param string $stream имя протокола|потока
		 * @return bool
		 */
		private function isPermittedHttpIp($stream) {
			$streamMacroIpList = $this->getPermittedHttpStreamMacroIpList($stream);
			$remoteIP = $this->request->remoteAddress();

			if ($streamMacroIpList) {
				return contains($streamMacroIpList, $remoteIP);
			}

			$streamIpList = $this->getPermittedHttpStreamIpList($stream);

			if ($streamIpList) {
				return contains($streamIpList, $remoteIP);
			}

			return false;
		}

		/**
		 * Возврашает список ip-адресов, разделенных запятой
		 * для которых разрешено выполнение заданного протокола|потока
		 * @param string $stream имя протокола|потока
		 * @return string
		 */
		private function getPermittedHttpStreamIpList($stream) {
			return $this->config->get('streams', $stream . '.http.ip-allow');
		}

		/**
		 * Возврашает список ip-адресов, разделенных запятой
		 * для которых разрешено выполнение текущего макроса по заданному протоколу|потоку
		 * @param string $stream имя протокола|потока
		 * @return string
		 */
		private function getPermittedHttpStreamMacroIpList($stream) {
			return $this->config->get('streams', $stream . '.http.ip-allow.' . $this->getMacroKey());
		}
	}