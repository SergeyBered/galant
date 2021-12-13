<?php
	/** Глобальные функции */
	use UmiCms\Service;

	if (!function_exists('implementComposerAutoload')) {
		/** Подключает автозагрузку классов через composer */
		function implementComposerAutoload() {
			$composerAutoloadFiles = [
				CURRENT_WORKING_DIR . '/classes/vendor/autoload.php',
				CURRENT_WORKING_DIR . '/vendor/autoload.php',
			];

			foreach ($composerAutoloadFiles as $file) {
				if (file_exists($file)) {
					require_once $file;
				}
			}
		}
	}

	if (!function_exists('initPageNumberRequest')) {
		/**
		 * Устанавливает номер страниц пагинации в старом стиле
		 * для поддержки пользовательских шаблонов и кастомов
		 * @throws Exception
		 */
		function initPageNumberRequest() {
			$request = Service::Request();

			if (!$request->issetPageNumber()) {
				return;
			}

			$pageNumber = $request->pageNumber();
			$parameter = (string) mainConfiguration::getInstance()
				->get('page-navigation', 'parameter-key');

			if ($parameter) {
				$_REQUEST[$parameter] = $pageNumber;
				$_GET[$parameter] = $pageNumber;
				$request->Get()->set($parameter, $pageNumber);
			}

			$_REQUEST['p'] = $pageNumber;
			$_GET['p'] = $pageNumber;
			$request->Get()->set('p', $pageNumber);
		}
	}

	if (!function_exists('checkIpAddress')) {
		/**
		 * Проверяет не был ли текущий ip пользователя добавлен в черный список ip адресов.
		 * Если был добавлен, то обратившемуся отдастся белый экран со статусом 403.
		 * Добавить ip в черный список можно либо через справочник "Список IP-адресов, которым недоступен сайт"
		 * (если включена опция "use-ip-blacklist-guide" в config.ini), либо через опцию "ip-blacklist" в config.ini.
		 * Обе управляющие опции расположены в секции "kernel", синтаксис добавления ip адреса в "ip-blacklist":
		 * ip-blacklist = "XXX.XXX.X.XXX,XXX.XXX.X.XXX"
		 * @param iConfiguration $config
		 * @throws coreException
		 */
		function checkIpAddress(iConfiguration $config) {
			$useIpBlacklistGuide = (bool) $config->get('kernel', 'use-ip-blacklist-guide');
			$isUseBlackList = ($useIpBlacklistGuide && !isUseDomainSettings()) || isUseBlackListForCurrentDomain();

			if (!$isUseBlackList) {
				return;
			}

			$remoteIP = Service::Request()->remoteAddress();

			if (isIpInBlackList($remoteIP)) {
				$buffer = Service::Response()
					->getCurrentBuffer();
				$buffer->contentType('text/html');
				$buffer->charset('utf-8');
				$buffer->status('403 Forbidden');
				$buffer->clear();
				$buffer->end();
			}
		}
	}

	if (!function_exists('isIpInBlackList')) {
		/**
		 * Проверяет находится ли IP в черном списке
		 * @param string $remoteIP
		 * @return bool
		 * @throws coreException
		 * @throws selectorException
		 */
		function isIpInBlackList($remoteIP) {
			$ipList = mainConfiguration::getInstance()->get('kernel', 'ip-blacklist');
			$isIpInConfigBlackList = in_array($remoteIP, explode(',', $ipList));

			$selector = new selector('objects');
			$selector->types('object-type')->guid('ip-blacklist');
			$selector->option('ignore-translate', true);

			if (isUseBlackListForCurrentDomain()) {
				$selector->where('domain_id')->equals(getCurrentDomain()->getId());
			} else {
				$selector->where('domain_id')->isnull();
			}

			$selector->where('name')->equals($remoteIP);
			$selector->limit(0,1);

			return ($selector->result() || $isIpInConfigBlackList);
		}
	}

	if (!function_exists('isUseBlackListForCurrentDomain')) {
		/**
		 * Используется ли черный список для данного домена
		 * @return bool
		 * @throws coreException
		 */
		function isUseBlackListForCurrentDomain() {
			$blacklistDomainList = (array) mainConfiguration::getInstance()
				->get('kernel', 'use-ip-blacklist-guide-for-domain');

			return in_array(getCurrentDomain()->getHost(), $blacklistDomainList) && isUseDomainSettings();
		}
	}

	if (!function_exists('isUseDomainSettings')) {
		/**
		 * Используются ли настройки домена
		 * @return string
		 * @throws coreException
		 */
		function isUseDomainSettings() {
			$langId = Service::LanguageDetector()->detectId();
			return Service::Registry()->get("//umiStub/" . getCurrentDomain()->getId() . "/$langId/use-custom-settings");
		}
	}

	if (!function_exists('getCurrentDomain')) {
		/**
		 * Возвращает текущий домен
		 * @return iDomain
		 * @throws coreException
		 */
		function getCurrentDomain() {
			return Service::DomainDetector()->detect();
		}
	}

	if (!function_exists('initConfigConstants')) {
		function initConfigConstants($ini) {
			$defineConstants = [
				'system:db-driver' => ['DB_DRIVER', '%value%'],
				'system:version-line' => ['CURRENT_VERSION_LINE', '%value%'],
				'session:active-lifetime' => ['SESSION_LIFETIME', '%value%'],
				'system:default-date-format' => ['DEFAULT_DATE_FORMAT', '%value%'],
				'kernel:use-reflection-extension' => ['USE_REFLECTION_EXT', '%value%'],
				'kernel:xslt-nested-menu' => ['XSLT_NESTED_MENU', '%value%'],
				'kernel:pages-auto-index' => ['PAGES_AUTO_INDEX', '%value%'],
				'kernel:enable-pre-auth' => ['PRE_AUTH_ENABLED', '%value%'],
				'kernel:ignore-module-names-overwrite' => ['IGNORE_MODULE_NAMES_OVERWRITE', '%value%'],
				'kernel:xml-format-output' => ['XML_FORMAT_OUTPUT', '%value%'],
				'kernel:selection-max-joins' => ['MAX_SELECTION_TABLE_JOINS', '%value%'],
				'kernel:property-value-mode' => ['XML_PROP_VALUE_MODE', '%value%'],
				'kernel:xml-macroses-disable' => ['XML_MACROSES_DISABLE', '%value%']
			];

			foreach ($defineConstants as $name => $const) {
				list($section, $variable) = explode(':', $name);
				$value = $const[1];

				if (is_string($value)) {
					$iniValue = isset($ini[$section][$variable]) ? $ini[$section][$variable] : '';
					$value = str_replace('%value%', $iniValue, $value);
				} else {
					if (!$value && isset($const[2])) {
						$value = $const[2];
					}
				}

				if (!defined($const[0])) {
					if ($const[0] == 'CURRENT_VERSION_LINE' && !$value) {
						continue;
					}
					define($const[0], $value);
				}
			}
		}
	}

	if (!function_exists('initConfigConnections')) {
		function initConfigConnections($ini) {
			$connections = [];

			foreach ($ini['connections'] as $name => $value) {
				list($class, $pname) = explode('.', $name);
				if (!isset($connections[$class])) {
					$connections[$class] = [
						'type' => 'mysql',
						'connection-class' => '',
						'host' => 'localhost',
						'login' => 'root',
						'password' => '',
						'dbname' => 'umi',
						'port' => false,
						'persistent' => false,
						'compression' => false
					];
				}
				$connections[$class][$pname] = $value;
			}

			$pool = ConnectionPool::getInstance();

			foreach ($connections as $class => $con) {
				$connectionClass = $con['connection-class'];
				$connectionClass = $connectionClass ?: 'mysqliConnection';

				$pool->setConnectionObjectClass($connectionClass);

				if ($con['dbname'] == '-=demo=-' || $con['dbname'] == '-=custom=-') {
					if ($con['dbname'] == '-=demo=-') {
						require './demo-center.php';
					}

					$con['host'] = MYSQL_HOST;
					$con['login'] = MYSQL_LOGIN;
					$con['password'] = MYSQL_PASSWORD;
					$con['dbname'] = ($con['dbname'] == '-=custom=-') ? MYSQL_DB_NAME : DEMO_DB_NAME;
				}

				$pool->addConnection(
					$class,
					$con['host'],
					$con['login'],
					$con['password'],
					$con['dbname'],
					($con['port'] !== false) ? $con['port'] : false,
					(bool) (int) $con['persistent']
				);
			}

			$connection = ConnectionPool::getInstance()->getConnection();
			ini_set('mysql.trace_mode', false);

			$config = mainConfiguration::getInstance();

			if ($config->get('kernel', 'mysql-queries-log-enable')) {
				$logType = $config->get('kernel', 'mysql-queries-log-type');
				$mysqlLoggerCreator = MysqlLoggerCreator::getInstance();
				$mysqlLogger = $mysqlLoggerCreator->createMysqlLogger($logType, $config);
				/* @var mysqliConnection $connection */
				$connection->setLogger($mysqlLogger);
			}
		}
	}

	if (!function_exists('getParamFromFastcgiParams')) {
		/**
		 * Читаем настройки переданные в fastcgi_param от сервера и заменяет ими прочитанные из config.ini
		 * собавляет новые которых нет в файле конфигурации
		 * @param $ini
		 * @return mixed
		 */
		function getParamFromFastcgiParams($ini) {
			foreach ($_SERVER as $key => $val) {
				if (contains($key, 'UMI_')) {
					$key = str_replace('UMI_', '', $key);
					$key = str_replace('_', '.', $key);
					$key = explode('.', $key, 2);
					$ini[$key[0]][$key[1]] = $val;
				}
			}
			return $ini;
		}
	}

	if (!function_exists('importTemplateAutoload')) {
		/** Импортирует файл правил автозагрузки классов из директории с шаблоном */
		function importTemplateAutoload() {
			try {
				$directory = cmsController::getInstance()
					->getResourcesDirectory();
			} catch (Exception $exception) {
				umiExceptionHandler::report($exception);
				return;
			}

			$mapPath = sprintf('%s/' . def_module::AUTOLOAD_FILE, rtrim($directory, '/'));
			$mapLoader = new \UmiCms\Libs\AutoloadMapLoader();
			$map =$mapLoader->fromFile($mapPath)
				->getMap();
			umiAutoload::addClassesToAutoload($map);
		}
	}

	if (!function_exists('importTemplateServices')) {
		/** Импортирует файл с параметрами и правилами инициализации сервисов из директории с шаблоном */
		function importTemplateServices() {
			try {
				$directory = cmsController::getInstance()
					->getResourcesDirectory();
			} catch (Exception $exception) {
				umiExceptionHandler::report($exception);
				return;
			}

			$servicesFile = sprintf('%s/' . def_module::SERVICES_FILE, rtrim($directory, '/'));

			if (!file_exists($servicesFile)) {
				return;
			}

			/** переменные наполняются в файле def_module::SERVICES_FILE */
			$rules = [];
			$parameters = [];
			/** @noinspection PhpIncludeInspection */
			require_once $servicesFile;
			$serviceContainer = ServiceContainerFactory::create();
			$serviceContainer->addRules($rules);
			$serviceContainer->addParameters($parameters);
		}
	}

	if (!function_exists('checkMobileApplication')) {
		/**
		 * Проверяет, что при запросе из мобильного приложения в системе подключен модуль "Интернет-магазин".
		 * Если он не подключен, приложению возвращается сообщение об ошибке.
		 * @throws \Exception
		 * @throws \ErrorException
		 * @throws \publicException
		 */
		function checkMobileApplication() {
			if (!Service::Request()->isUmiManager()) {
				return;
			}

			/** @var UmiCms\Classes\System\MobileApp\UmiManager\iChecker $checker */
			$checker = Service::get('UmiManagerChecker');
			$checker->checkRequiredModules();
		}
	}

	if (!function_exists('registerStreams')) {
		/** Регистрирует системные протоколы */
		function registerStreams() {
			$config = mainConfiguration::getInstance();
			$schemeList = $config->get('streams', 'enable');

			if (is_array($schemeList)) {
				foreach ($schemeList as $scheme) {
					try {
						umiBaseStream::registerStream($scheme);
					} catch (Exception $exception) {
						//nothing
					}
				}
			}

			$userAgent = $config->get('streams', 'user-agent');

			if ($userAgent) {
				$options = [
					'http' => [
						'user_agent' => $userAgent,
					]
				];

				$context = stream_context_create($options);
				libxml_set_streams_context($context);
			}
		}
	}

	if (!function_exists('bytes_strlen')) {
		/**
		 * Возвращает количество байтов в строке
		 * @param $string
		 * @return int
		 */
		function bytes_strlen($string) {
			$current = mb_internal_encoding();
			mb_internal_encoding('latin1');
			$length = strlen($string);
			mb_internal_encoding($current);
			return $length;
		}
	}

	if (!function_exists('bytes_substr')) {
		/**
		 * Возвращает подстроку в однобайтовой кодировке
		 * @see substr
		 *
		 * @param $string
		 * @param $start
		 * @param bool|int $length
		 * @return bool|string
		 */
		function bytes_substr($string, $start, $length = false) {
			$current = mb_internal_encoding();
			mb_internal_encoding('latin1');

			if ($length !== false) {
				$result = substr($string, $start, $length);
			} else {
				$result = substr($string, $start);
			}

			mb_internal_encoding($current);
			return $result;
		}
	}

	if (!function_exists('getArrayKey')) {
		/**
		 * @param array $array
		 * @param string|int $key
		 * @return bool|mixed|null
		 */
		function getArrayKey($array, $key) {
			if (!is_array($array)) {
				return false;
			}

			if ($key === false) {
				return null;
			}

			if (array_key_exists($key, $array)) {
				return $array[$key];
			}

			return null;
		}
	}

	if (!function_exists('arrayValueContainsNotEmptyArray')) {
		/**
		 * Проверяет что значение массива содержит непустой массив по заданному ключу
		 * @param array $array массив
		 * @param mixed $valueKey ключ проверяемого значения
		 * @return bool результат проверки
		 */
		function arrayValueContainsNotEmptyArray(array $array, $valueKey) {
			if (!array_key_exists($valueKey, $array)) {
				return false;
			}

			$value = $array[$valueKey];
			return is_array($value) && count($value) > 0;
		}
	}

	if (!function_exists('getDeepArrayUniqueValues')) {
		/**
		 * Возвращает уникальные значения массива.
		 * Умеет работать с многомерными массивами, в отличие от array_values.
		 * @param array $array массив
		 * @return array
		 */
		function getDeepArrayUniqueValues(array $array) {
			$result = [];

			foreach ($array as $value) {
				$value = is_array($value) ? getDeepArrayUniqueValues($value) : (array) $value;

				foreach ($value as $item) {
					$result[] = $item;
				}
			}

			return array_unique($result);
		}
	}

	if (!function_exists('getServerProtocol')) {
		/**
		 * Определяет протокол работы сервера
		 * На данный момент различает HTTP и HTTPS протоколы
		 * @return string Протокол сервера в нижнем регистре
		 */
		function getServerProtocol() {
			static $protocol = null;

			if (!$protocol) {
				if ((isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] == 'on' || $_SERVER['HTTPS'] == 1)) ||
					(isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https') ||
					mb_strtolower(mb_substr($_SERVER['SERVER_PROTOCOL'], 0, 5)) == 'https') {
					$protocol = 'https';
				} else {
					$protocol = 'http';
				}
			}

			return $protocol;
		}
	}

	if (!function_exists('getSelectedServerProtocol')) {
		/**
		 * Возвращает протокол работы сервера, с которым требуется генерировать ссылки на сайт.
		 * @param iDomain|null $domain домен, на который ведет ссылка. Если не передан - возьмет текущий домен.
		 * @return mixed|string
		 * @throws coreException
		 */
		function getSelectedServerProtocol(iDomain $domain = null) {
			$domain = $domain ?: Service::DomainDetector()->detect();

			if ($domain instanceof iDomain) {
				return $domain->getProtocol();
			}

			$selectedServerProtocol = mainConfiguration::getInstance()
				->get('system', 'server-protocol');
			$correctServerProtocols = ['http', 'https'];

			if (!is_string($selectedServerProtocol) || !in_array($selectedServerProtocol, $correctServerProtocols)) {
				return 'http';
			}

			return $selectedServerProtocol;
		}
	}

	if (!function_exists('startsWith')) {
		/**
		 * Определяет, начинается ли строка $source со строки $prefix
		 * @param string $source
		 * @param string $prefix
		 * @return bool
		 */
		function startsWith($source, $prefix) {
			if (!is_string($source) || !is_string($prefix)) {
				return false;
			}

			$prefixLength = mb_strlen($prefix);

			if ($prefixLength === 0) {
				return true;
			}

			if ($source === '') {
				return false;
			}

			return (mb_substr($source, 0, $prefixLength) === $prefix);
		}
	}

	if (!function_exists('endsWith')) {
		/**
		 * Определяет, оканчивается ли строка $source строкой $postfix
		 * @param string $source
		 * @param string $postfix
		 * @return bool
		 */
		function endsWith($source, $postfix) {
			if (!is_string($source) || !is_string($postfix)) {
				return false;
			}

			$postfixLength = mb_strlen($postfix);

			if ($postfixLength === 0) {
				return true;
			}

			if ($source === '') {
				return false;
			}

			return (mb_substr($source, -$postfixLength) === $postfix);
		}
	}

	if (!function_exists('contains')) {
		/**
		 * Определяет, содержит ли строка $source строку $suffix
		 * @param string $source
		 * @param string $suffix
		 * @return bool
		 */
		function contains($source, $suffix) {
			if (!is_string($source) || !is_string($suffix)) {
				return false;
			}

			if ($suffix === '') {
				return true;
			}

			if ($source === '') {
				return false;
			}

			return mb_strpos($source, $suffix) !== false;
		}
	}

	if (!function_exists('umiCount')) {
		/**
		 * Вычисляет количество элементов массива или объект класса, реализующего интефейс countable.
		 * Обертка над http://php.net/manual/ru/function.count.php.
		 * Сделан для обратной совместости, так как на php версии 7.2 count() стал выводить предупреждения, если
		 * в него передавать не массив или объект класса, реализующего интефейс countable.
		 * Метод создан для legacy кода, в новом коде можно применять стандартную функцию.
		 * @param array|Countable $arrayOrCountable массив или объект класса, реализующего интефейс countable
		 * @param bool $isRecursive вычислять рекурсивно, принимается для многомерных массивов
		 * @return int
		 */
		function umiCount($arrayOrCountable, $isRecursive = false) {

			if (is_array($arrayOrCountable)) {
				$mode = $isRecursive ? COUNT_RECURSIVE : COUNT_NORMAL;
				return count($arrayOrCountable, $mode);
			}

			if (is_object($arrayOrCountable)) {

				if ($arrayOrCountable instanceof Countable) {
					return count($arrayOrCountable);
				}

				if ($arrayOrCountable instanceof SimpleXMLElement) {
					return $arrayOrCountable->count();
				}
			}

			if ($arrayOrCountable !== null) {
				return 1;
			}

			return 0;
		}
	}

	if (!function_exists('getFirstValue')) {
		/**
		 * Возвращает первое значение массива, либо переданное значение, если массив не передан
		 * @param mixed $array массив
		 * @return mixed
		 */
		function getFirstValue($array) {
			$copy = (array) $array;
			return array_shift($copy);
		}
	}

	if (!function_exists('isEmptyArray')) {
		/**
		 * Определяет пуст ли массив
		 * @param array $array массив
		 * @return bool
		 */
		function isEmptyArray(array $array) {
			return count($array) === 0;
		}
	}

	if (!function_exists('isEmptyString')) {
		/**
		 * Определяет пуста ли строка
		 * @param string $string строка
		 * @return bool
		 */
		function isEmptyString($string) {
			return $string === '';
		}
	}

	if (!function_exists('implodeRecursively')) {
		/**
		 * Склеивает многомерный массив в строку
		 * @link https://stackoverflow.com/questions/3899971/implode-and-explode-multi-dimensional-arrays/3900091#3900091
		 * @param string $glue разделитель значений
		 * @param array $array массив
		 * @return string
		 */
		function implodeRecursively($glue, array $array) {
			$result = '';

			foreach ($array as $item) {
				if (is_array($item)) {
					$result .= implodeRecursively($glue, $item) . $glue;
				} else {
					$result .= $item . $glue;
				}
			}

			return mb_substr($result, 0, 0 - mb_strlen($glue));
		}
	}

	if (!function_exists('getImageQualityLevel')) {
		/**
		 * Возвращает корректный уровень качества изображения
		 * @param int $quality уровень качества изображения
		 * @return int
		 */
		function getImageQualityLevel($quality) {
			if (defined('IMAGE_COMPRESSION_LEVEL') && !is_numeric($quality)) {
				return IMAGE_COMPRESSION_LEVEL;
			}

			if ($quality < 0) {
				return 0;
			} elseif ($quality > 100) {
				return 100;
			}

			return (int) $quality;
		}
	}

	if (!function_exists('getRequest')) {
		/**
		 * @param string $key
		 * @return bool|mixed|null
		 */
		function getRequest($key) {
			$parameterList = [
				'p',
				'per_page_limit'
			];

			$parameter = (string) mainConfiguration::getInstance()
				->get('page-navigation', 'parameter-key') ?: 'p';
			$parameterList[] = $parameter;

			if (in_array($key, $parameterList)) {
				prepareRequest($key);
			}

			return getArrayKey($_REQUEST, $key);
		}
	}

	if (!function_exists('getServer')) {
		/**
		 * @param string $key
		 * @return bool|mixed|null
		 */
		function getServer($key) {
			if ($key == 'REMOTE_ADDR' && getArrayKey($_SERVER, 'HTTP_X_REAL_IP') !== null) {
				return getArrayKey($_SERVER, 'HTTP_X_REAL_IP');
			}
			return getArrayKey($_SERVER, $key);
		}
	}

	if (!function_exists('getLabel')) {
		/**
		 * @param string $key
		 * @param bool $path
		 * @return mixed|string
		 */
		function getLabel($key, $path = false) {
			$args = func_get_args();
			return ulangStream::getLabel($key, $path, $args);
		}
	}

	if (!function_exists('getI18n')) {
		/**
		 * @param string $key
		 * @param string $pattern
		 * @return array|string|null
		 */
		function getI18n($key, $pattern = '') {
			return ulangStream::getI18n($key, $pattern);
		}
	}

	if (!function_exists('removeDirectory')) {
		/**
		 * @param string $dir
		 * @return bool
		 */
		function removeDirectory($dir) {
			if (!$dh = @opendir($dir)) {
				return false;
			}
			while (($obj = readdir($dh)) !== false) {
				if ($obj == '.' || $obj == '..') {
					continue;
				}
				if (!@unlink($dir . '/' . $obj)) {
					removeDirectory($dir . '/' . $obj);
				}
			}
			@rmdir($dir);
			return true;
		}
	}

	if (!function_exists('array_extract_values')) {
		/**
		 * @param array $array
		 * @param null $result
		 * @param bool $ignoreVoidValues
		 * @return array|null
		 */
		function array_extract_values($array, &$result = null, $ignoreVoidValues = false) {
			if (!is_array($array)) {
				return [];
			}

			if (!is_array($result)) {
				$result = [];
			}

			foreach ($array as $value) {
				if (is_array($value)) {
					array_extract_values($value, $result, $ignoreVoidValues);
				} else {
					if ($value || $ignoreVoidValues) {
						$result[] = $value;
					}
				}
			}

			return $result;
		}
	}

	if (!function_exists('array_unique_arrays')) {
		/**
		 * @param array $array
		 * @param string|int $key
		 * @return array
		 */
		function array_unique_arrays($array, $key) {
			$result = [];
			$keys = [];

			foreach ($array as $arr) {
				$currKey = isset($arr[$key]) ? $arr[$key] : null;
				if (in_array($currKey, $keys)) {
					continue;
				}

				$keys[] = $currKey;
				$result[] = $arr;
			}

			return $result;
		}
	}

	if (!function_exists('array_distinct')) {
		/**
		 * @param array $array
		 * @return array
		 */
		function array_distinct($array) {
			$result = $hashes = [];

			foreach ($array as $subArray) {
				$key = sha1(serialize($subArray));

				if (in_array($key, $hashes)) {
					continue;
				}
				$result[] = $subArray;
				$hashes[] = $key;
			}

			return $result;
		}
	}

	if (!function_exists('array_positive_values')) {
		/**
		 * @param array $arr
		 * @param bool $recursion
		 * @return array
		 */
		function array_positive_values($arr, $recursion = true) {
			if (!is_array($arr)) {
				return [];
			}

			$result = [];
			foreach ($arr as $key => $value) {
				if ($value) {
					if (is_array($value)) {
						if ($recursion) {
							$value = array_positive_values($value, $recursion);
							if (count($value) == 0) {
								continue;
							}
						}
					}
					$result[$key] = $value;
				}
			}

			return $result;
		}
	}

	if (!function_exists('natsort2d')) {
		/**
		 * @param array $originalArray
		 * @param int $seekKey
		 */
		function natsort2d(&$originalArray, $seekKey = 0) {
			if (!is_array($originalArray)) {
				return;
			}

			$temp = $resultArray = [];

			foreach ($originalArray as $key => $value) {
				$temp[$key] = $value[$seekKey];
			}

			natsort($temp);

			foreach ($temp as $key => $value) {
				$resultArray[] = $originalArray[$key];
			}

			$originalArray = $resultArray;
		}
	}

	if (!function_exists('set_timebreak')) {
		/**
		 * @param bool $time_end
		 * @return string
		 */
		function set_timebreak($time_end = false) {
			global $time_start;

			if (!$time_end) {
				$time_end = microtime(true);
			}
			$time = $time_end - $time_start;
			return "\r\n<!-- This page generated in {$time} secs -->\r\n";
		}
	}

	if (!function_exists('makeThumbnailFullUnsharpMask')) {
		/**
		 * @param $img
		 * @param $amount
		 * @param $radius
		 * @param $threshold
		 * @return string
		 */
		function makeThumbnailFullUnsharpMask($img, $amount, $radius, $threshold) {
			if (function_exists('UnsharpMask')) {
				return UnsharpMask($img, $amount, $radius, $threshold);
			}

			// Attempt to calibrate the parameters to Photoshop:
			if ($amount > 500) {
				$amount = 500;
			}
			$amount = $amount * 0.016;
			if ($radius > 50) {
				$radius = 50;
			}
			$radius = $radius * 2;
			if ($threshold > 255) {
				$threshold = 255;
			}

			$radius = abs(round($radius));    // Only integers make sense.
			if ($radius == 0) {
				return $img;
			}
			$w = imagesx($img);
			$h = imagesy($img);
			$imgCanvas = $img;
			$imgCanvas2 = $img;
			$imgBlur = imagecreatetruecolor($w, $h);

			// Gaussian blur matrix:
			//	1	2	1
			//	2	4	2
			//	1	2	1

			// Move copies of the image around one pixel at the time and merge them with weight
			// according to the matrix. The same matrix is simply repeated for higher radii.
			for ($i = 0; $i < $radius; $i++) {
				imagecopy($imgBlur, $imgCanvas, 0, 0, 1, 1, $w - 1, $h - 1); // up left
				imagecopymerge($imgBlur, $imgCanvas, 1, 1, 0, 0, $w, $h, 50); // down right
				imagecopymerge($imgBlur, $imgCanvas, 0, 1, 1, 0, $w - 1, $h, 33.33333); // down left
				imagecopymerge($imgBlur, $imgCanvas, 1, 0, 0, 1, $w, $h - 1, 25); // up right
				imagecopymerge($imgBlur, $imgCanvas, 0, 0, 1, 0, $w - 1, $h, 33.33333); // left
				imagecopymerge($imgBlur, $imgCanvas, 1, 0, 0, 0, $w, $h, 25); // right
				imagecopymerge($imgBlur, $imgCanvas, 0, 0, 0, 1, $w, $h - 1, 20); // up
				imagecopymerge($imgBlur, $imgCanvas, 0, 1, 0, 0, $w, $h, 16.666667); // down
				imagecopymerge($imgBlur, $imgCanvas, 0, 0, 0, 0, $w, $h, 50); // center
			}
			$imgCanvas = $imgBlur;

			// Calculate the difference between the blurred pixels and the original
			// and set the pixels
			for ($x = 0; $x < $w; $x++) { // each row
				for ($y = 0; $y < $h; $y++) { // each pixel
					$rgbOrig = imagecolorat($imgCanvas2, $x, $y);
					$aOrig = (($rgbOrig >> 24) & 0x7F);
					$rOrig = (($rgbOrig >> 16) & 0xFF);
					$gOrig = (($rgbOrig >> 8) & 0xFF);
					$bOrig = ($rgbOrig & 0xFF);
					$rgbBlur = imagecolorat($imgCanvas, $x, $y);
					$aBlur = (($rgbBlur >> 24) & 0x7F);
					$rBlur = (($rgbBlur >> 16) & 0xFF);
					$gBlur = (($rgbBlur >> 8) & 0xFF);
					$bBlur = ($rgbBlur & 0xFF);

					// When the masked pixels differ less from the original
					// than the threshold specifies, they are set to their original value.
					$aNew = (abs($aOrig - $aBlur) >= $threshold)
						? max(0, min(127, ($amount * ($aOrig - $aBlur)) + $aOrig))
						: $aOrig;
					$rNew = (abs($rOrig - $rBlur) >= $threshold)
						? max(0, min(255, ($amount * ($rOrig - $rBlur)) + $rOrig))
						: $rOrig;
					$gNew = (abs($gOrig - $gBlur) >= $threshold)
						? max(0, min(255, ($amount * ($gOrig - $gBlur)) + $gOrig))
						: $gOrig;
					$bNew = (abs($bOrig - $bBlur) >= $threshold)
						? max(0, min(255, ($amount * ($bOrig - $bBlur)) + $bOrig))
						: $bOrig;

					if (($rOrig != $rNew) || ($gOrig != $gNew) || ($bOrig != $bNew)) {
						$pixCol = imagecolorallocatealpha($img, $rNew, $gNew, $bNew, $aNew);
						imagesetpixel($img, $x, $y, $pixCol);
					}
				}
			}
			return $img;
		}
	}

	if (!function_exists('getPathInfo')) {
		/**
		 * @deprecated*
		 * Обертка над стандартной функцией pathinfo()
		 * TODO убрать использования этой функции из кода
		 *
		 * @param (string) $filename - полный путь
		 * @param (string|int) default=null $req_param ('dirname'|'basename'|'extension'|'filename')
		 * @return string|array or requested value
		 */
		function getPathInfo($filename, $req_param = null) {
			$info = pathinfo($filename);

			if ($req_param === null) {
				return $info;
			}

			switch ($req_param) {
				case 'dirname':
				case '1':
					return $info['dirname'];

				case 'basename':
				case '2':
					return $info['basename'];

				case 'extension':
				case '4':
					return $info['extension'];

				case 'filename':
				case '8':
					return $info['filename'];

				default:
					return $info;
			}
		}
	}

	if (!function_exists('checkEnoughMemoryForThumbnail')) {
		/**
		 * Проверяет хватает ли памяти для создания миниатюры картинки
		 * @param int $width - ширина
		 * @param int $height - высота
		 * @param bool $isTrueColor - флаг полноцветного изображения
		 * @return bool
		 */
		function checkEnoughMemoryForThumbnail($width, $height, $isTrueColor = true) {
			$rgbRate = $isTrueColor ? 3 : 1;
			$memoryRate = (float) mainConfiguration::getInstance()->get('system', 'bitmap-memory-rate');

			if ($memoryRate <= 0 || $width <= 0 || $height <= 0) {
				return true;
			}

			$needMemory = $width * $height * $rgbRate * $memoryRate;

			return $needMemory < (getThumbnailCreateMemoryLimit() - memory_get_usage());
		}
	}

	if (!function_exists('getThumbnailCreateMemoryLimit')) {
		/**
		 * Возвращает количество выделенной памяти для создания миниатюры картинки
		 * @param string $memoryLimit - лимит памяти
		 * @return float
		 */
		function getThumbnailCreateMemoryLimit($memoryLimit = null) {
			$sizesLetters = [
				'K' => 1,
				'M' => 2,
				'G' => 3,
			];

			$memoryLimit = $memoryLimit ?: ini_get('memory_limit');
			if (preg_match('/^(\d+)(.?)$/', $memoryLimit, $matches)) {
				if (umiCount($matches) < 2 || !is_numeric($matches[1])) {
					return (float) DEFAULT_THUMBNAIL_MAKE_MEMORY_LIMIT;
				}

				$limitSize = (float) $matches[1];
				if (umiCount($matches) < 3 || !$matches[2]) {
					return $limitSize;
				}

				$letter = $matches[2];
				$lettersList = array_keys($sizesLetters);
				$letterIdx = array_search($letter, $lettersList, true);
				if ($letterIdx !== false) {
					return $limitSize * pow(1024, $sizesLetters[$letter]);
				}

				return $limitSize;
			}
			return (float) DEFAULT_THUMBNAIL_MAKE_MEMORY_LIMIT;
		}
	}

	if (!function_exists('makeThumbnailFull')) {
		/**
		 * @param $path
		 * @param $thumbs_path
		 * @param $width
		 * @param $height
		 * @param bool $crop
		 * @param int $cropside
		 * @param bool $isLogo
		 * @param string $quality
		 * @return array|string
		 * @throws Exception
		 */
		function makeThumbnailFull(
			$path,
			$thumbs_path,
			$width,
			$height,
			$crop = true,
			$cropside = 5,
			$isLogo = false,
			$quality = 'default'
		) {
			if ($quality === 'default') {
				$quality = IMAGE_COMPRESSION_LEVEL;
			}
			$isSharpen = true;

			$no_image_file = mainConfiguration::getInstance()->includeParam('no-image-holder');

			$image = new umiImageFile($path);
			$file_name = $image->getFileName();
			$file_ext = mb_strtolower($image->getExt());
			$file_ext = ($file_ext == 'bmp' ? 'jpg' : $file_ext);

			$allowedExts = ['gif', 'jpeg', 'jpg', 'png', 'bmp', 'webp'];

			if (!in_array($file_ext, $allowedExts)) {
				return '';
			}

			$file_name = mb_substr($file_name, 0, mb_strlen($file_name) - (mb_strlen($file_ext) + 1));

			$thumbPath = sha1($image->getDirName());

			if (!is_dir($thumbs_path . $thumbPath)) {
				mkdir($thumbs_path . $thumbPath, 0755, true);
			}

			$file_name_new = $file_name . '_' . $width . '_' . $height . '_' . $image->getExt(true) . '_' . $cropside .
				'_' . $quality . '.' . $file_ext;

			$path_new = $thumbs_path . $thumbPath . '/' . $file_name_new;

			if (!file_exists($path_new) || filemtime($path_new) < filemtime($path)) {
				if (file_exists($path_new)) {
					unlink($path_new);
				}

				if ($file_ext == 'webp' && !function_exists('imagecreatefromwebp')) {
					return getImageHolder('no-support-image-holder');
				}

				$width_src = $image->getWidth();
				$height_src = $image->getHeight();

				if (!checkEnoughMemoryForThumbnail($width_src, $height_src)) {
					return getImageHolder('too-big-image-holder');
				}

				if (!($width_src && $height_src)) {
					$path = $no_image_file;
					$image = new umiImageFile($path);
					$file_name = $image->getFileName();
					$file_ext = mb_strtolower($image->getExt());
					$file_ext = ($file_ext == 'bmp' ? 'jpg' : $file_ext);
					$file_name = mb_substr($file_name, 0, mb_strlen($file_name) - (mb_strlen($file_ext) + 1));
					$thumbPath = sha1($image->getDirName());
					if (!is_dir($thumbs_path . $thumbPath)) {
						mkdir($thumbs_path . $thumbPath, 0755, true);
					}
					$file_name_new =
						$file_name . '_' . $width . '_' . $height . '_' . $cropside . '_' . $quality . '.' . $file_ext;
					$path_new = $thumbs_path . $thumbPath . '/' . $file_name_new;
					if (file_exists($path_new)) {
						unlink($path_new);
					}
					$width_src = $image->getWidth();
					$height_src = $image->getHeight();
				}

				if (!($width_src && $height_src)) {
					return '';
				}

				$real_height = $height;
				$real_width = $width;

				switch (true) {
					case ($height == 'auto' && $width == 'auto'): {
						$real_width = (int) $width_src;
						$real_height = (int) $height_src;
						break;
					}
					case ($height == 'auto'): {
						$real_height = (int) round($height_src * ($width / $width_src));
						$real_width = (int) $width;
						break;
					}
					case ($width == 'auto'): {
						$real_width = (int) round($width_src * ($height / $height_src));
						$real_height = (int) $height;
						break;
					}
					default:
						// No default
				}

				$width = $real_width;
				$height = $real_height;

				$offset_h = 0;
				$offset_w = 0;

				if (!(int) $width || !(int) $height) {
					$crop = false;
				}

				if ($crop) {
					$width_ratio = $width_src / $width;
					$height_ratio = $height_src / $height;

					if ($width_ratio > $height_ratio) {
						$offset_w = round(($width_src - $width * $height_ratio) / 2);
						$width_src = round($width * $height_ratio);
					} elseif ($width_ratio < $height_ratio) {
						$offset_h = round(($height_src - $height * $width_ratio) / 2);
						$height_src = round($height * $width_ratio);
					}

					if ($cropside) {
						//defore all it was cropside work like as - 5
						//123
						//456
						//789
						switch ($cropside):
							case 1:
								$offset_w = 0;
								$offset_h = 0;
								break;
							case 2:
								$offset_h = 0;
								break;
							case 3:
								$offset_w += $offset_w;
								$offset_h = 0;
								break;
							case 4:
								$offset_w = 0;
								break;
							case 5:
								break;
							case 6:
								$offset_w += $offset_w;
								break;
							case 7:
								$offset_w = 0;
								$offset_h += $offset_h;
								break;
							case 8:
								$offset_h += $offset_h;
								break;
							case 9:
								$offset_w += $offset_w;
								$offset_h += $offset_h;
								break;
						endswitch;
					}
				}

				try {
					$pr = imageUtils::getImageProcessor();
					$pr->cropThumbnail(
						$path,
						$path_new,
						$width,
						$height,
						$width_src,
						$height_src,
						$offset_w,
						$offset_h,
						$isSharpen,
						$quality
					);
				} catch (coreException $exception) {
					umiExceptionHandler::report($exception);
					return '';
				}

				if ($isLogo) {
					try {
						umiImageFile::addWatermark($path_new);
					} catch (Exception $e) {
						return getImageHolder('no-support-image-holder');
					}
				}
			}

			$value = new umiImageFile($path_new);
			$info = imageUtils::getGDProcessor()->info($path_new);
			$arr = [];
			$arr['size'] = $value->getSize();
			$arr['filename'] = $value->getFileName();
			$arr['filepath'] = $value->getFilePath();
			$arr['src'] = $value->getFilePath(true);
			$arr['ext'] = $value->getExt();
			$arr['width'] = $info['width'];
			$arr['height'] = $info['height'];

			if (Service::Request()->isAdmin()) {
				$arr['src'] = str_replace('&', '&amp;', $arr['src']);
			}

			return $arr;
		}
	}

	if (!function_exists('getImageHolder')) {
		/**
		 * Возвращает заглушку для изображения по ее типу
		 * @param string $typeHolder тип заглушки
		 * @return string
		 */
		function getImageHolder($typeHolder) {
			/** @var $imageFilePathHolder - путь до картинки с сообщением, о
			 * возникшей в процессе создания миниатюры проблеме */
			$imageFilePathHolder = mainConfiguration::getInstance()->includeParam($typeHolder);

			$imageFileHolder = new umiImageFile($imageFilePathHolder);
			return [
				'src' => $imageFileHolder->getFilePath(true),
				'width' => $imageFileHolder->getWidth(),
				'heigth' => $imageFileHolder->getHeight(),
			];
		}
	}

	if (!function_exists('dateToString')) {
		/**
		 * Конвертирует дату в строку
		 * @param int $timestamp дата в формате Unix timestamp
		 * @return string
		 */
		function dateToString($timestamp) {
			$monthsList = [
				getLabel('month-jan'),
				getLabel('month-feb'),
				getLabel('month-mar'),
				getLabel('month-apr'),
				getLabel('month-may'),
				getLabel('month-jun'),
				getLabel('month-jul'),
				getLabel('month-aug'),
				getLabel('month-sep'),
				getLabel('month-oct'),
				getLabel('month-nov'),
				getLabel('month-dec'),
			];

			$date = date('j.m.Y', $timestamp);
			list($day, $month, $year) = explode('.', $date);
			return implode(' ', [
				$day,
				$monthsList[(int) $month - 1],
				$year,
			]);
		}
	}

	if (!function_exists('sumToString')) {
		/**
		 * @param $i_number
		 * @param int $i_gender
		 * @param string $s_w1
		 * @param string $s_w2to4
		 * @param string $s_w5to10
		 * @param bool $convertCopecks
		 * @return mixed|string
		 */
		function sumToString(
			$i_number,
			$i_gender = 1,
			$s_w1 = 'рубль',
			$s_w2to4 = 'рубля',
			$s_w5to10 = 'рублей',
			$convertCopecks = true
		) {
			if (!$i_number) {
				return rtrim('ноль ' . $s_w5to10);
			}

			$s_answer = '';
			$v_number = $i_number;

			if (mb_strpos($i_number, '.') !== 0) {
				$i_number = number_format($i_number, 2, '.', '');
				list($v_number, $copecks) = explode('.', $i_number);
				$arr_tmp = SummaStringThree($s_answer, $copecks, 2, 'копейка', 'копейки', 'копеек', $convertCopecks);
				$s_answer = $arr_tmp['Summa'];
			}

			$arr_tmp = SummaStringThree($s_answer, $v_number, $i_gender, $s_w1, $s_w2to4, $s_w5to10);
			$v_number = $arr_tmp['TempValue'];
			$s_answer = $arr_tmp['Summa'];
			if (!$v_number) {
				return $s_answer;
			}

			$arr_tmp = SummaStringThree($s_answer, $v_number, 2, 'тысяча', 'тысячи', 'тысяч');
			$v_number = $arr_tmp['TempValue'];
			$s_answer = $arr_tmp['Summa'];
			if (!$v_number) {
				return $s_answer;
			}

			$arr_tmp = SummaStringThree($s_answer, $v_number, 1, 'миллион', 'миллиона', 'миллионов');
			$v_number = $arr_tmp['TempValue'];
			$s_answer = $arr_tmp['Summa'];
			if (!$v_number) {
				return $s_answer;
			}

			$arr_tmp = SummaStringThree($s_answer, $v_number, 1, 'миллиард', 'миллиарда', 'миллиардов');
			$v_number = $arr_tmp['TempValue'];
			$s_answer = $arr_tmp['Summa'];
			if (!$v_number) {
				return $s_answer;
			}

			$arr_tmp = SummaStringThree($s_answer, $v_number, 1, 'триллион', 'триллиона', 'триллионов');
			$v_number = $arr_tmp['TempValue'];
			$s_answer = $arr_tmp['Summa'];
			return $s_answer;
		}
	}

	if (!function_exists('SummaStringThree')) {
		/**
		 * @param $Summa
		 * @param $TempValue
		 * @param $Rod
		 * @param $w1
		 * @param $w2to4
		 * @param $w5to10
		 * @param bool $convertNumber
		 * @return array
		 */
		function SummaStringThree($Summa, $TempValue, $Rod, $w1, $w2to4, $w5to10, $convertNumber = true) {
			$s10 = '';
			$s100 = '';

			$Rest = mb_strlen($TempValue) < 4 ? $TempValue : mb_substr($TempValue, -3);
			$newTempValue = floor($TempValue / 1000);
			if ($Rest === 0) {
				if ($Summa === '') {
					$Summa = $w5to10 . ' ';
				}
				return ['TempValue' => $newTempValue, 'Summa' => $Summa];
			}

			$EndWord = $w5to10;

			$i_i = floor($Rest / 100);
			switch ($i_i) {
				case 0:
					$s100 = '';
					break;
				case 1:
					$s100 = 'сто ';
					break;
				case 2:
					$s100 = 'двести ';
					break;
				case 3:
					$s100 = 'триста ';
					break;
				case 4:
					$s100 = 'четыреста ';
					break;
				case 5:
					$s100 = 'пятьсот ';
					break;
				case 6:
					$s100 = 'шестьсот ';
					break;
				case 7:
					$s100 = 'семьсот ';
					break;
				case 8:
					$s100 = 'восемьсот ';
					break;
				case 9:
					$s100 = 'девятьсот ';
					break;
			}
			$Rest = $Rest % 100;
			$Rest1 = (int) floor($Rest / 10);
			$s1 = '';
			switch ($Rest1) {
				case 0:
					$s10 = '';
					break;
				case 1:
					switch ($Rest) {
						case 10:
							$s10 = 'десять ';
							break;
						case 11:
							$s10 = 'одиннадцать ';
							break;
						case 12:
							$s10 = 'двенадцать ';
							break;
						case 13:
							$s10 = 'тринадцать ';
							break;
						case 14:
							$s10 = 'четырнадцать ';
							break;
						case 15:
							$s10 = 'пятнадцать ';
							break;
						case 16:
							$s10 = 'шестнадцать ';
							break;
						case 17:
							$s10 = 'семнадцать ';
							break;
						case 18:
							$s10 = 'восемнадцать ';
							break;
						case 19:
							$s10 = 'девятнадцать ';
							break;
					}
					break;
				case 2:
					$s10 = 'двадцать ';
					break;
				case 3:
					$s10 = 'тридцать ';
					break;
				case 4:
					$s10 = 'сорок ';
					break;
				case 5:
					$s10 = 'пятьдесят ';
					break;
				case 6:
					$s10 = 'шестьдесят ';
					break;
				case 7:
					$s10 = 'семьдесят ';
					break;
				case 8:
					$s10 = 'восемьдесят ';
					break;
				case 9:
					$s10 = 'девяносто ';
					break;
			}

			if ($Rest1 !== 1) {
				$i_j = $Rest % 10;
				switch ($i_j) {
					case 1:
						switch ($Rod) {
							case 1:
								$s1 = 'один ';
								break;
							case 2:
								$s1 = 'одна ';
								break;
							case 3:
								$s1 = 'одно ';
								break;
						}
						$EndWord = $w1;
						break;
					case 2:
						if ($Rod === 2) {
							$s1 = 'две ';
						} else {
							$s1 = 'два ';
						}
						$EndWord = $w2to4;
						break;
					case 3:
						$s1 = 'три ';
						$EndWord = $w2to4;
						break;
					case 4:
						$s1 = 'четыре ';
						$EndWord = $w2to4;
						break;
					case 5:
						$s1 = 'пять ';
						break;
					case 6:
						$s1 = 'шесть ';
						break;
					case 7:
						$s1 = 'семь ';
						break;
					case 8:
						$s1 = 'восемь ';
						break;
					case 9:
						$s1 = 'девять ';
						break;
				}
			}
			$stringNum = ($convertNumber === true) ? $s100 . $s10 . $s1 : $TempValue . ' ';
			$Summa = rtrim(rtrim($stringNum . $EndWord) . ' ' . $Summa);

			return ['TempValue' => $newTempValue, 'Summa' => $Summa];
		}
	}

	if (!function_exists('prepareRequest')) {
		/**
		 * @param string $key
		 * @return bool
		 */
		function prepareRequest($key) {
			if (Service::Request()->isNotAdmin()) {
				return false;
			}

			$session = Service::Session();
			$paging = (array) $session->get('paging');
			$path = '/' . Service::Request()->getPath();

			if (!isset($paging[$path]['per_page_limit'])) {
				$paging[$path] = [
					'per_page_limit' => (int) mainConfiguration::getInstance()
						->get('page-navigation', 'default-admin-page-limit') ?: 20
				];
			}

			$relId = (int) getFirstValue((array) getRequest('rel'));
			if (!isset($paging[$path][$relId])) {
				$paging[$path][$relId] = null;
			}

			if ($key == 'per_page_limit') {
				$perPageLimit = getArrayKey($_REQUEST, $key);
				if ($perPageLimit !== null) {
					$perPageLimit = (int) $perPageLimit;
					$oldLimit = $paging[$path]['per_page_limit'];
					$paging[$path]['per_page_limit'] = $perPageLimit;
					$pageLimitDiff = $oldLimit / ($perPageLimit ?: 1);

					foreach ($paging[$path] as $rel => $page) {
						if ($rel == 'per_page_limit') {
							continue;
						}

						$paging[$path][$rel] = (int) ($page * $pageLimitDiff);
					}
				}

				$_REQUEST['per_page_limit'] = $paging[$path]['per_page_limit'];
				$session->set('paging', $paging);
				return;
			}

			$parameter = (string) mainConfiguration::getInstance()
				->get('page-navigation', 'parameter-key') ?: 'p';

			//Ветка обратной совместимости для тех, кто использует getRequest('p');
			if (in_array($key, ['p', $parameter])) {
				$currentPage = getArrayKey($_REQUEST, $key);

				if ($currentPage !== null) {
					$paging[$path][$relId] = $currentPage;
				}
			}

			$_REQUEST['p'] = $paging[$path][$relId];
			$_REQUEST[$parameter] = $paging[$path][$relId];
			$session->set('paging', $paging);
		}
	}

	if (!function_exists('umi_var_dump')) {
		/**
		 * @param mixed $value
		 * @param bool $return
		 */
		function umi_var_dump($value, $return = false) {
			$remoteIp = getServer('HTTP_X_REAL_IP');
			if (!$remoteIp) {
				$remoteIp = getServer('REMOTE_ADDR');
			}

			$config = mainConfiguration::getInstance();
			$allowedIps = $config->get('debug', 'allowed-ip');
			$allowedIps = is_array($allowedIps) ? $allowedIps : [];

			if (in_array($remoteIp, $allowedIps)) {
				var_dump($value);
			} elseif ($return) {
				var_dump($value);
			}
		}
	}

	if (!function_exists('elfinder_get_hash')) {
		/**
		 * Возвращает хеш пути до директории или файла для файлового менеджера
		 * @param string $path путь до директории или файла
		 * @return string
		 */
		function elfinder_get_hash($path) {
			$path = (string) $path;

			if ($path === '') {
				return '';
			}

			$path = str_replace('\\', '/', realpath('./' . trim($path, "./\\")));
			$auth = Service::Auth();
			$userId = $auth->getUserId();
			$user = umiObjectsCollection::getInstance()->getObject($userId);

			$source = '';
			$filemanagerDirectory = $user->getValue('filemanager_directory');

			if ($filemanagerDirectory) {
				$i = 1;
				$directories = explode(',', $filemanagerDirectory);

				foreach ($directories as $directory) {
					$directory = trim($directory);
					$directory = trim($directory, '/');

					if ($directory === '') {
						continue;
					}

					$directoryPath = realpath(CURRENT_WORKING_DIR . '/' . $directory);

					if (!contains($directoryPath, CURRENT_WORKING_DIR) || !is_dir($directoryPath)) {
						continue;
					}

					if (contains($path, $directory)) {
						$source = 'files' . $i;
						$path = trim(str_replace(CURRENT_WORKING_DIR . '/' . $directory, '', $path), '/');
						break;
					}

					$i++;
				}
			} else {
				$images_path = str_replace('\\', '/', realpath(USER_IMAGES_PATH));
				$files_path = str_replace('\\', '/', realpath(USER_FILES_PATH));

				if (startsWith($path, $images_path)) {
					$path = trim(str_replace($images_path, '', $path), '/');
					$source = 'images';
				} elseif (startsWith($path, $files_path)) {
					$path = trim(str_replace($files_path, '', $path), '/');
					$source = 'files';
				}
			}

			$path = str_replace('/', DIRECTORY_SEPARATOR, $path);
			$hash = strtr(base64_encode($path), '+/=', '-_.');
			$hash = rtrim($hash, '.');

			/**
			 * @see:
			 *
			 * DataFileManager::FILES_HASH_PREFIX
			 * DataFileManager::IMAGES_HASH_PREFIX
			 */

			return $hash !== '' ? 'umi' . $source . '_' . $hash : 'umi' . $source;
		}
	}

	if (!function_exists('get_server_load')) {
		/**
		 * @return string
		 */
		function get_server_load() {
			if (!stristr(PHP_OS, 'win') && function_exists('sys_getloadavg')) {
				$load = sys_getloadavg();
				return getLabel('load-average') . $load[0] . ', ' . $load[1] . ', ' . $load[2];
			}
		}
	}

	if (!function_exists('secure_load_simple_xml')) {
		/**
		 * Создает и возвращает SimpleXMLElement.
		 * Игнорирует загрузку внешних сущностей.
		 * @param string $xml
		 * @param null $xmlElement
		 * @return SimpleXMLElement|bool SimpleXMLElement либо false
		 */
		function secure_load_simple_xml($xml, &$xmlElement = null) {
			$disableEntities = libxml_disable_entity_loader();
			$xmlElement = @simplexml_load_string($xml);
			libxml_disable_entity_loader($disableEntities);

			return $xmlElement;
		}
	}

	if (!function_exists('secure_load_dom_document')) {
		/**
		 * Загружает и возвращает DOMDocument.
		 * Игнорирует загрузку внешних сущностей.
		 * @param string $xml
		 * @param DOMDocument|null $domDocument если null, будет создан новый DOMDocument
		 * @return bool результат операции
		 */
		function secure_load_dom_document($xml, &$domDocument = null) {
			$disableEntities = libxml_disable_entity_loader();

			if ($domDocument === null) {
				$domDocument = new DOMDocument('1.0', 'utf-8');
			}
			$result = @$domDocument->loadXML($xml, DOM_LOAD_OPTIONS);

			libxml_disable_entity_loader($disableEntities);
			return $result;
		}
	}

	if (!function_exists('idn_to_utf8')) {
		/** @deprecated */
		function idn_to_utf8($host) {
			return Service::IdnConverter()->decode($host);
		}
	}

	if (!function_exists('idn_to_ascii')) {
		/** @deprecated */
		function idn_to_ascii($host) {
			return Service::IdnConverter()->encode($host);
		}
	}

	if (!function_exists('chooseSeparator')) {
		/** Возвращает разделитель слов. */
		function chooseSeparator() {
			$separator = mainConfiguration::getInstance()->get('seo', 'alt-name-separator');

			if ($separator == '_' || $separator == '-') {
				return $separator;
			}

			return '-';
		}
	}

	if (!function_exists('bytesToString')) {
		/**
		 * Возвращает человекопонятное представление размера файла,
		 * например: 524288000 => 500 MB
		 * @param int $bytes байты
		 * @return string
		 */
		function bytesToString($bytes) {
			$bytes = (float) $bytes;

			$unitsBindings = [
				0 => [
					'unit' => 'TB',
					'value' => pow(1024, 4),
				],
				1 => [
					'unit' => 'GB',
					'value' => pow(1024, 3),
				],
				2 => [
					'unit' => 'MB',
					'value' => pow(1024, 2),
				],
				3 => [
					'unit' => 'KB',
					'value' => 1024,
				],
				4 => [
					'unit' => 'B',
					'value' => 1,
				],
			];

			$result = '';

			foreach ($unitsBindings as $unitBinding) {
				if ($bytes >= $unitBinding['value']) {
					$result = $bytes / $unitBinding['value'];
					$result = str_replace('.', ',', (string) round($result, 2)) . ' ' . $unitBinding['unit'];
					break;
				}
			}
			return $result;
		}
	}

	if (!function_exists('recursive_array_search')) {
		/**
		 * Осуществляет поиск заданного значения в многомерном
		 * массиве и возвращает соответствующий ключ в случае удачи
		 * @param mixed $needle искомое значение
		 * @param array $haystack многомерный массив
		 * @return bool|int|string
		 */
		function recursive_array_search($needle, $haystack) {
			foreach ($haystack as $key => $value) {
				if ($needle === $value || (is_array($value) && recursive_array_search($needle, $value) !== false)) {
					return $key;
				}
			}
			return false;
		}
	}

	if (!function_exists('trimNameSpace')) {
		/**
		 * Удаляет пространство имен из имени класса
		 * @param string $className
		 * @return null|string|string[]
		 * @throws ErrorException
		 */
		function trimNameSpace($className) {
			if (!is_string($className)) {
				throw new ErrorException('Class name expected');
			}

			return preg_replace('/^.*\\\/', '', $className);
		}
	}

	if (!function_exists('system_get_skinName')) {
		/**
		 * Текущий скин админки
		 * @return string
		 */
		function system_get_skinName() {
			static $skinName;

			if ($skinName) {
				return $skinName;
			}

			$skinName = Service::AdminSkin()->name();
			return $skinName;
		}
	}

	if (!function_exists('system_buildin_load')) {
		/**
		 * Экземпляр виртуального модуля (core, system, custom)
		 * @param string $moduleName название модуля
		 * @return mixed
		 */
		function system_buildin_load($moduleName) {
			static $moduleClasses = [];

			if (isset($moduleClasses[$moduleName])) {
				return $moduleClasses[$moduleName];
			}

			$modulePath = SYS_MODULES_PATH . $moduleName . '.php';

			if (file_exists($modulePath)) {
				require $modulePath;
				if (class_exists($moduleName)) {
					return $moduleClasses[$moduleName] = new $moduleName;
				}
			}

			return false;
		}
	}

	if (!function_exists('truncStr')) {
		/**
		 * Обрезать строку до указанной длины, добавляя $endingString в конце
		 * @param string $string строка
		 * @param string $length максимальная длина результата
		 * @param string $endingString строка в конце
		 * @param bool $stripTags убирать ли html-теги?
		 * @return string
		 */
		function truncStr($string, $length = '50', $endingString = '...', $stripTags = false) {
			$result = $string;

			if ($stripTags) {
				$result = html_entity_decode(strip_tags($result), ENT_QUOTES, 'UTF-8');
			}

			if ($length <= 0) {
				return '';
			}

			if (mb_strlen($string) > $length) {
				$length -= mb_strlen($endingString);
				$result = mb_substr($result, 0, $length + 1);
				$result = preg_replace('/\s+([^\s]+)?$/i', '', $result) . $endingString;
			}

			return $result;
		}
	}

	if (!function_exists('toTimeStamp')) {
		/**
		 * Дата в формате UNIX TIMESTAMP
		 *
		 * Примеры:
		 * toTimeStamp("1970-06-15") === 14245200
		 * toTimeStamp("15 июня 1970 года") === 14245200
		 * toTimeStamp("15:30 15 июня 1970 года") === 14301000
		 * toTimeStamp("завтра") === 1470254400
		 *
		 * @param string $date дата в произвольном формате
		 * @return int
		 */
		function toTimeStamp($date) {
			if (is_numeric($date)) {
				return $date;
			}

			$day = '';
			$month = '';
			$year = '';
			$hours = '';
			$minutes = '';

			$date = trim($date);

			if ($date == 'сейчас') {
				return time();
			}

			$date = str_replace('-', ' ', $date);
			$date = str_replace(',', ' ', $date);
			$date = str_replace("\\'", ' ', $date);

			$timeRegex = "/\d{2}\:\d{2}/";

			if (preg_match($timeRegex, $date, $matches)) {
				$time = $matches[0];
				preg_replace($timeRegex, '', $date);
				list($hours, $minutes) = explode(':', $time);
			}

			$spaceRegex = "[ \.\-\/\\\\]{1,10}";

			$date = preg_replace("/(\d{4}){$spaceRegex}(\d{2}){$spaceRegex}(\d{2})/im", "^\\3^ !\\2! ?\\1?", $date);
			$date = preg_replace("/(\d{1,2}){$spaceRegex}(\d{1,2}){$spaceRegex}(\d{2,4})/im", "^\\1^ !\\2! ?\\3?", $date);

			$months = [
				'январь',
				'февраль',
				'март',
				'апрель',
				'май',
				'июнь',
				'июль',
				'август',
				'сентябрь',
				'октябрь',
				'ноябрь',
				'декабрь'
			];

			$monthsAccusative = [
				'января',
				'февраля',
				'марта',
				'апреля',
				'мая',
				'июня',
				'июля',
				'августа',
				'сентября',
				'октября',
				'ноября',
				'декабря'
			];

			$monthsShort = [
				'янв',
				'фев',
				'мар',
				'апр',
				'май',
				'июн',
				'июл',
				'авг',
				'сен',
				'окт',
				'ноя',
				'дек'
			];

			$monthsShortEn = [
				'jan',
				'feb',
				'mar',
				'apr',
				'may',
				'jun',
				'jul',
				'aug',
				'sep',
				'oct',
				'nov',
				'dec'
			];

			$monthsTo = [
				'01',
				'02',
				'03',
				'04',
				'05',
				'06',
				'07',
				'08',
				'09',
				'10',
				'11',
				'12'
			];

			foreach ($months as $k => $v) {
				$months[$k] = '/' . $v . '/i';
			}

			foreach ($monthsAccusative as $k => $v) {
				$monthsAccusative[$k] = '/' . $v . '/i';
			}

			foreach ($monthsShort as $k => $v) {
				$monthsShort[$k] = '/' . $v . '/i';
			}

			foreach ($monthsShortEn as $k => $v) {
				$monthsShortEn[$k] = '/' . $v . '/i';
			}

			foreach ($monthsTo as $k => $v) {
				$monthsTo[$k] = ' !' . $v . '! ';
			}

			$date = preg_replace($months, $monthsTo, $date);
			$date = preg_replace($monthsAccusative, $monthsTo, $date);
			$date = preg_replace($monthsShort, $monthsTo, $date);
			$date = preg_replace($monthsShortEn, $monthsTo, $date);

			$years = [
				'/(\d{2,4})[ ]*года/i',
				'/(\d{2,4})[ ]*год/i',
				'/(\d{2,4})[ ]*г/i',
				'/(\d{4})/i',
			];

			$date = preg_replace($years, "?\\1?", $date);
			$date = preg_replace("/[^!^\?^\d](\d{1,2})[^!^\?^\d]/i", "^\\1^", ' ' . $date . ' ');

			if (preg_match("/\^(\d{1,2})\^/", $date, $matches)) {
				$day = $matches[1];
				if (mb_strlen($day) == 1) {
					$day = '0' . $day;
				}
			}

			if (preg_match("/!(\d{1,2})!/", $date, $matches)) {
				$month = $matches[1];
				if (mb_strlen($month) == 1) {
					$month = '0' . $month;
				}
			}

			if (preg_match("/\?(\d{2,4})\?/", $date, $matches)) {
				$year = $matches[1];
				if (mb_strlen($year) == 2) {
					$leadingDigit = (int) mb_substr($year, 0, 1);
					if ($leadingDigit >= 0 && $leadingDigit <= 4) {
						$year = '20' . $year;
					} else {
						$year = '19' . $year;
					}
				}
			}

			if ($day > 31) {
				$temp = $year;
				$year = $day;
				$day = $temp;
			}

			if ($month > 12) {
				$temp = $month;
				$month = $day;
				$day = $temp;
				unset($temp);
			}

			$tds = trim(mb_strtolower($date));

			switch ($tds) {
				case 'сегодня':
					$ts = time();
					$year = date('Y', $ts);
					$month = date('m', $ts);
					$day = date('d', $ts);
					break;

				case 'завтра':
					$ts = time() + (3600 * 24);
					$year = date('Y', $ts);
					$month = date('m', $ts);
					$day = date('d', $ts);
					break;

				case 'вчера':
					$ts = time() - (3600 * 24);
					$year = date('Y', $ts);
					$month = date('m', $ts);
					$day = date('d', $ts);
					break;

				case 'послезавтра':
					$ts = time() + (3600 * 48);
					$year = date('Y', $ts);
					$month = date('m', $ts);
					$day = date('d', $ts);
					break;

				case 'позавчера':
					$ts = time() - (3600 * 48);
					$year = date('Y', $ts);
					$month = date('m', $ts);
					$day = date('d', $ts);
					break;
			}

			if (!$day) {
				$tds = str_replace([$year, $month], '', $date);
				preg_match("/(\d{1,2})/", $tds, $matches);
				$day = isset($matches[1]) ? $matches[1] : null;
			}

			if (!$month && !$day && !$year) {
				return 0;
			}

			if ($day && !$month) {
				$month = $day;
				$day = 0;
			}

			return $timestamp = mktime((int) $hours, (int) $minutes, 0, (int) $month, (int) $day, (int) $year);
		}
	}

	if (!function_exists('system_parse_short_calls')) {
		/**
		 * Распарсить вызовы коротких макросов поля "контент" у страницы
		 * @param string $content контент
		 * @param mixed $elementId идентификатор страницы
		 * @param mixed $objectId идентификатор объекта
		 * @param array $scopeVariables переменные области видимости
		 * @return mixed
		 * @throws coreException
		 * @throws ErrorException
		 */
		function system_parse_short_calls($content, $elementId = false, $objectId = false, $scopeVariables = []) {
			if (!contains($content, '%')) {
				return $content;
			}

			$cmsController = cmsController::getInstance();
			$umiObjects = umiObjectsCollection::getInstance();

			$shouldDumpScope = contains($content, '%scope%');
			$element = null;
			$object = null;

			if ($elementId === false && $objectId === false) {
				$elementId = $cmsController->getCurrentElementId();
			}

			if (contains($content, 'id%')) {
				$content = str_replace('%id%', $elementId, $content);
				$content = str_replace('%pid%', $cmsController->getCurrentElementId(), $content);
			}

			if ($elementId !== false) {
				if (!($element = umiHierarchy::getInstance()->getElement($elementId))) {
					return $content;
				}

				$object = $element->getObject();
			}

			if ($objectId !== false) {
				if (!($object = $umiObjects->getObject($objectId))) {
					return $content;
				}
			}

			if (!$object) {
				return $content;
			}

			$objectTypeId = $object->getTypeId();
			$objectType = umiObjectTypesCollection::getInstance()->getType($objectTypeId);

			if ($shouldDumpScope) {
				$fields = $objectType->getAllFields();
				foreach ($fields as $field) {
					$name = $field->getName();
					$scopeVariables[$name] = $object->getValue($name);
				}
				$content = str_replace('%scope%', system_print_template_scope($scopeVariables), $content);
			}

			if (preg_match_all("/%([A-z0-9\-_]*)%/", $content, $matches)) {
				foreach ($matches[1] as $objPropName) {
					if ($objectType->getFieldId($objPropName)) {
						$value = $object->getValue($objPropName);

						if (is_object($value)) {
							if ($value instanceof umiDate) {
								$value = $value->getFormattedDate('U');
							}

							if ($value instanceof umiFile) {
								$value = $value->getFilePath(true);
							}

							if ($value instanceof umiHierarchy) {
								$value = $value->getName();
							}
						}

						if (is_array($value)) {
							$count = umiCount($value);
							$stringValue = '';

							for ($i = 0; $i < $count; $i++) {
								$currentValue = $value[$i];

								if (is_numeric($currentValue)) {
									$obj = $umiObjects->getObject($currentValue);

									if ($obj) {
										$currentValue = $obj->getName();
										unset($obj);
									} else {
										continue;
									}
								}

								if ($currentValue instanceof iUmiHierarchyElement) {
									$currentValue = $currentValue->getName();
								}

								$stringValue .= $currentValue;
								if ($i < ($count - 1)) {
									$stringValue .= ', ';
								}
							}

							$value = $stringValue;
						}

						if (contains($value, '%')) {
							$value = def_module::parseTPLMacroses($value);
						}

						$content = str_replace('%' . $objPropName . '%', $value, $content);
					}
				}
			}

			if (contains($content, 'id%')) {
				$content = str_replace('%id%', $elementId, $content);
				$content = str_replace('%pid%', $cmsController->getCurrentElementId(), $content);
			}

			return $content;
		}
	}

	if (!function_exists('system_print_template_scope')) {
		/**
		 * Область видимости шаблона со значением всех переменных
		 * @param array $scopeVariables переменные области видимости
		 * @param bool $scopeName не используется
		 * @return mixed
		 * @throws coreException
		 */
		function system_print_template_scope($scopeVariables, $scopeName = false) {
			list($block, $varLine, $macroLine) = def_module::loadTemplates(
				'system/reflection',
				'scope_dump_block',
				'scope_dump_line_variable',
				'scope_dump_line_macro'
			);

			$assembledLines = '';

			foreach ($scopeVariables as $name => $value) {
				if ($name == '#meta') {
					continue;
				}

				if (is_array($value)) {
					$tmp = str_replace('%name%', $name, $macroLine);
				} else {
					$tmp = $varLine;
					$tmp = str_replace('%name%', $name, $tmp);
					$tmp = str_replace('%type%', gettype($value), $tmp);
					$tmp = str_replace('%value%', htmlspecialchars($value), $tmp);
				}

				$assembledLines .= $tmp;
			}

			if (isset($scopeVariables['#meta'])) {
				$scopeName = isset($scopeVariables['#meta']['name']) ? $scopeVariables['#meta']['name'] : '';
				$scopeFile = isset($scopeVariables['#meta']['file']) ? $scopeVariables['#meta']['file'] : '';
			} else {
				$scopeName = '';
				$scopeFile = '';
			}

			$block = str_replace('%lines%', $assembledLines, $block);
			$block = str_replace('%block_name%', $scopeName, $block);
			$block = str_replace('%block_file%', $scopeFile, $block);
			$block = preg_replace('/%[A-z0-9_]+%/i', '', $block);

			return $block;
		}
	}

	if (!function_exists('isDemoMode')) {
		/**
		 * Возвращает является ли текущий режим — демо режимом.
		 * @return bool
		 */
		function isDemoMode() {
			$versionLine = mainConfiguration::getInstance()->get('system', 'version-line');
			$issetVersionLine = $versionLine !== null;

			return ($issetVersionLine && $versionLine === 'demo');
		}
	}

	if (!function_exists('isCronMode')) {
		/**
		 * Проверяет работает ли система в режиме "Крона"
		 * @return bool результат проверки
		 */
		function isCronMode() {
			return defined(iConfiguration::CRON_MODE) && constant(iConfiguration::CRON_MODE);
		}
	}

	if (!function_exists('getCronMode')) {
		/**
		 * Возвращает режим работы "Крона"
		 * @return mixed
		 */
		function getCronMode() {
			if (!isCronMode()) {
				return false;
			}

			return constant(iConfiguration::CRON_MODE);
		}
	}

	if (!function_exists('isCronCliMode')) {
		/**
		 * Проверяет работает ли система в режиме "Крона" и запущена через консоль
		 * @return bool результат проверки
		 */
		function isCronCliMode() {
			return getCronMode() == iConfiguration::CLI_MODE;
		}
	}

	if (!function_exists('isCronHttpMode')) {
		/**
		 * Проверяет работает ли система в режиме "Крона" и запущена по http
		 * @return bool результат проверки
		 */
		function isCronHttpMode() {
			return getCronMode() == iConfiguration::HTTP_MODE;
		}
	}

	if (!function_exists('is_demo')) {
		/**
		 * Алиас для функции isDemoMode(). Оставлен для обратной совместимости.
		 * @return bool
		 * @deprecated
		 */
		function is_demo() {
			return isDemoMode();
		}
	}

	if (!function_exists('detectCharset')) {
		/**
		 * Кодировка строки
		 * @param string $string строка
		 * @return string
		 */
		function detectCharset($string) {
			if (preg_match("/[\x{0000}-\x{FFFF}]+/u", $string)) {
				return 'UTF-8';
			}

			$encoding = 'CP1251';

			if (!function_exists('iconv')) {
				return $encoding;
			}

			$cyrillicEncodings = [
				'CP1251',
				'ISO-8859-5',
				'KOI8-R',
				'UTF-8',
				'CP866'
			];

			if (function_exists('mb_detect_encoding')) {
				return mb_detect_encoding($string, implode(', ', $cyrillicEncodings));
			}

			return 'UTF-8';
		}
	}

	if (!function_exists('checkAllowedDiskSize')) {
		/**
		 * Возможно ли записать количество байт $bytes в пользовательские директории?
		 * @param mixed $bytes количество байт
		 * @return bool
		 */
		function checkAllowedDiskSize($bytes = false) {
			$maxFilesSize = mainConfiguration::getInstance()->get('system', 'quota-files-and-images');
			return isAllowedToWriteBytes($bytes, getResourcesDirs(), $maxFilesSize);
		}
	}

	if (!function_exists('getBusyDiskSize')) {
		/**
		 * Размер директорий на сервере в байтах
		 * @param mixed $dirs список директорий
		 * @return int
		 */
		function getBusyDiskSize($dirs = '__default__') {
			if ($dirs === '__default__') {
				$dirs = [USER_IMAGES_PATH, USER_FILES_PATH];
			}

			clearstatcache();
			$busySize = 0;

			if (!is_array($dirs)) {
				return 0;
			}

			foreach ($dirs as $dir) {
				if (!contains(CURRENT_WORKING_DIR, $dir)) {
					$busySize += getDirSize($dir);
				} else {
					$busySize += getDirSize(CURRENT_WORKING_DIR . $dir);
				}
			}

			return $busySize;
		}
	}

	if (!function_exists('getBusyDiskPercent')) {
		/**
		 * Процент занятого дискового пространства в пользовательских директориях для файлов и изображений
		 * @param mixed $dirs не используется
		 * @return int
		 */
		function getBusyDiskPercent($dirs = '__default__') {
			$maxFilesSize = mainConfiguration::getInstance()->get('system', 'quota-files-and-images');
			return getOccupiedDiskPercent(getResourcesDirs(), $maxFilesSize);
		}
	}

	if (!function_exists('isAllowedToWriteBytes')) {
		/**
		 * Возможно ли записать количество байт $bytes в директории в соответствии с ограничением?
		 * @param int $bytes количество байт для записи
		 * @param array $dirs список директорий
		 * @param string $quota ограничение дискового пространства
		 * @return bool
		 */
		function isAllowedToWriteBytes($bytes, $dirs, $quota = '0') {
			if (!$bytes) {
				return false;
			}

			if ($quota == 0) {
				return true;
			}

			$maxFilesSize = getBytesFromString($quota);
			$busySize = getBusyDiskSize($dirs);

			return $maxFilesSize >= $busySize + $bytes;
		}
	}

	if (!function_exists('getOccupiedDiskPercent')) {
		/**
		 * Процент занятого дискового пространства в директориях
		 * @param array $dirs список директорий
		 * @param string $quota ограничение дискового пространства
		 * @return float|int
		 */
		function getOccupiedDiskPercent($dirs, $quota = '0') {
			if ($quota == 0 || !is_array($dirs)) {
				return 0;
			}

			$maxFilesSize = getBytesFromString($quota);
			$busySize = getBusyDiskSize($dirs);

			return ceil($busySize / $maxFilesSize * 100);
		}
	}

	if (!function_exists('getResourcesDirs')) {
		/**
		 * Список путей до директорий, в которых хранятся пользовательские файлы
		 * @return array
		 */
		function getResourcesDirs() {
			return [USER_IMAGES_PATH, USER_FILES_PATH];
		}
	}

	if (!function_exists('getUploadsDir')) {
		/**
		 * Путь до директории, в которую загружаются файлы из форм
		 * @return array
		 */
		function getUploadsDir() {
			return [SYS_TEMP_PATH . '/uploads'];
		}
	}

	if (!function_exists('getBytesFromString')) {
		/**
		 * Конвертировать строку в байты с учетом единицы измерения (кило, мега, гига)
		 * @example getBytesFromString("10MB") === 10485760
		 * @param string $string строка
		 * @return int|mixed
		 */
		function getBytesFromString($string) {
			if (empty($string)) {
				return 0;
			}

			$string = str_replace(' ', '', mb_strtolower($string));
			$bytes = $string;

			if (mb_strpos($string, 'kb')) {
				$bytes = (int) str_replace('kb', '', $string) * 1024;
			}

			if (mb_strpos($string, 'k')) {
				$bytes = (int) str_replace('k', '', $string) * 1024;
			}

			if (mb_strpos($string, 'mb')) {
				$bytes = (int) str_replace('mb', '', $string) * 1024 * 1024;
			}

			if (mb_strpos($string, 'm')) {
				$bytes = (int) str_replace('m', '', $string) * 1024 * 1024;
			}

			if (mb_strpos($string, 'gb')) {
				$bytes = (int) str_replace('gb', '', $string) * 1024 * 1024 * 1024;
			}

			if (mb_strpos($string, 'g')) {
				$bytes = (int) str_replace('g', '', $string) * 1024 * 1024 * 1024;
			}

			return $bytes;
		}
	}

	if (!function_exists('getDirSizePhp')) {
		/**
		 * Размер папки, полученный средствами php
		 * @param string $path путь до директории
		 * @param int $startTime время запуска
		 * @return bool|int
		 */
		function getDirSizePhp($path, $startTime = 0) {
			$size = 0;
			$maxTime = (int) ini_get('max_execution_time');
			$maxTime = $maxTime > 0 ? $maxTime * 0.5 : 2;

			$startTime = $startTime === 0 ? microtime(true) : $startTime;

			if (mb_substr($path, -1, 1) !== DIRECTORY_SEPARATOR) {
				$path .= DIRECTORY_SEPARATOR;
			}

			if (is_file($path)) {
				return filesize($path);
			}

			if (!is_dir($path)) {
				return false;
			}

			$files = glob(rtrim($path, '/') . '/*', GLOB_NOSORT);
			$files = $files ?: [];

			foreach ($files as $file) {
				if (microtime(true) - $startTime >= $maxTime) {
					return $size;
				}
				$size += is_file($file) ? filesize($file) : getDirSizePhp($file, $startTime);
			}

			return $size;
		}
	}

	if (!function_exists('getDirSizeConsole')) {
		/**
		 * Размер папки, полученный с помощью консольных програм
		 * @param string $path путь до директории
		 * @return string
		 */
		function getDirSizeConsole($path) {
			$path = realpath($path);

			if (contains(mb_strtolower(PHP_OS), 'linux')) {
				$io = popen('/usr/bin/du -sk -b ' . $path, 'r');
				$size = fgets($io, 4096);
				$size = mb_substr($size, 0, mb_strpos($size, "\t"));
				pclose($io);
			} else {
				if (contains(mb_strtolower(PHP_OS), 'win') && class_exists('com')) {
					$obj = new COM ('scripting.filesystemobject');
					if (is_object($obj)) {
						$ref = $obj->getfolder($path);
						$obj = null;
						$size = $ref->size;
					} else {
						$size = getDirSizePhp($path);
					}
				} else {
					$size = getDirSizePhp($path);
				}
			}

			return $size;
		}
	}

	if (!function_exists('getDirSize')) {
		/**
		 * Дисковое пространство в байтах, занятое директорией $path
		 * @param string $path путь до директории
		 * @return int
		 */
		function getDirSize($path) {
			$disabled_func = ini_get('disable_functions');

			if (!contains($disabled_func, 'popen')) {
				$size = getDirSizeConsole($path);
			} else {
				$size = getDirSizePhp($path);
			}
			return $size;
		}
	}

	if (!function_exists('checkFileForReading')) {
		/**
		 * Доступен ли файл на чтение?
		 * @param string $path путь до файла
		 * @param array $extension допустимые расширения файла
		 * @return bool
		 */
		function checkFileForReading($path, $extension = []) {
			$path = realpath($path);

			if (!file_exists($path)) {
				return false;
			}

			$path = str_replace("\\", '/', $path);
			$pathInfo = pathinfo($path);

			if (isset($pathInfo)) {
				if ($pathInfo['filename'] == '.htaccess' || $pathInfo['filename'] == '.htpasswd') {
					return false;
				}
			}

			return !(umiCount($extension) && !in_array($pathInfo['extension'], $extension));
		}
	}

	if (!function_exists('macros_title')) {
		/**
		 * Возвращает title текущей страницы
		 * @return string
		 * @throws coreException
		 */
		function macros_title() {
			$cmsController = cmsController::getInstance();

			if (Service::Request()->isSite()) {
				$elementId = $cmsController->getCurrentElementId();
				$element = umiHierarchy::getInstance()
					->getElement($elementId);

				if ($element instanceof iUmiHierarchyElement && $element->getValue('title')) {
					return getTitleWithPrefix($element->getValue('title'));
				}
			}

			if ($cmsController->currentTitle) {
				return getTitleWithPrefix($cmsController->currentTitle);
			}

			$langId = Service::LanguageDetector()->detectId();
			$domainId = Service::DomainDetector()->detectId();
			$defaultTitle = Service::Registry()->get("//settings/default_title/{$domainId}/{$langId}");
			$defaultTitle = $defaultTitle ?: Service::Registry()->get("//settings/default_title/{$langId}/{$domainId}");
			$title = $defaultTitle ?: macros_header();

			return getTitleWithPrefix($title);
		}
	}

	if (!function_exists('getTitleWithPrefix')) {
		/**
		 * Добавляет в title страницы префикс или постфикс
		 * @param string $title
		 * @return string
		 * @throws coreException
		 */
		function getTitleWithPrefix($title) {
			$titlePrefix = getTitlePrefix();

			if (!is_string($title)) {
				return $titlePrefix;
			}

			if (contains($titlePrefix, '%title_string%')) {
				return (string) str_replace('%title_string%', $title, $titlePrefix);
			}

			return $titlePrefix !== '' ? $titlePrefix . ' ' . $title : $title;
		}
	}

	if (!function_exists('getTitlePrefix')) {
		/**
		 * Возвращает префикс для title по домену и языковой версии
		 * @param int|bool $langId id языка, если не передано - возьмет текущий
		 * @param int|bool $domainId id домена, если не передано - возьмет текущий
		 * @return string
		 * @throws coreException
		 */
		function getTitlePrefix($langId = false, $domainId = false) {
			$langId = $langId ?: Service::LanguageDetector()->detectId();
			$domainId = $domainId ?: Service::DomainDetector()->detectId();
			$prefix = Service::Registry()->get("//settings/title_prefix/{$domainId}/{$langId}");

			return $prefix ?: Service::Registry()->get("//settings/title_prefix/{$langId}/{$domainId}");

		}
	}

	if (!function_exists('macros_sitename')) {
		/** @deprecated */
		function macros_sitename() {
			/** @var ContentMacros $module */
			$module = cmsController::getInstance()->getModule('content');
			return ($module instanceof def_module) ? $module->getSiteName() : '';
		}
	}

	if (!function_exists('macros_header')) {
		/**
		 * @return bool|mixed|string
		 */
		function macros_header() {
			$cmsController = cmsController::getInstance();
			$hierarchy = umiHierarchy::getInstance();

			if ($cmsController->currentHeader) {
				return $cmsController->currentHeader;
			}

			$elementId = $cmsController->getCurrentElementId();

			if ($elementId) {
				$element = $hierarchy->getElement($elementId);

				if ($element) {
					return ($tmp = $element->getValue('h1')) ? $tmp : '';
				}
			}

			$currentModule = $cmsController->getCurrentModule();
			$currentMethod = $cmsController->getCurrentMethod();
			$langList = $cmsController->getLangConstantList();

			if (isset($langList[$currentModule][$currentMethod])) {
				return $langList[$currentModule][$currentMethod];
			}

			return false;
		}
	}

	if (!function_exists('macros_systemBuild')) {
		/**
		 * @return string
		 */
		function macros_systemBuild() {
			return Service::RegistrySettings()->getRevision();
		}
	}

	if (!function_exists('macros_menu')) {
		/**
		 * @return string
		 */
		function macros_menu() {
			$cmsController = cmsController::getInstance();
			$contentModule = $cmsController->getModule('content');

			return ($contentModule instanceof def_module) ? $contentModule->menu() : '';
		}
	}

	if (!function_exists('macros_describtion')) {
		/**
		 * @return string
		 * @throws coreException
		 */
		function macros_describtion() {
			$elementId = cmsController::getInstance()
				->getCurrentElementId();
			$element = umiHierarchy::getInstance()
				->getElement($elementId);
			$description = '';

			if ($element instanceof iUmiHierarchyElement) {
				$description = $element->getValue('meta_descriptions');
			}

			if ($description) {
				return $description;
			}

			$domainId = Service::DomainDetector()->detectId();
			$langId = Service::LanguageDetector()->detectId();
			$description = Service::Registry()->get("//settings/meta_description/{$domainId}/{$langId}");

			return $description ?: Service::Registry()->get("//settings/meta_description/{$langId}/{$domainId}");
		}
	}

	if (!function_exists('macros_keywords')) {
		/**
		 * @return string
		 * @throws coreException
		 */
		function macros_keywords() {
			$elementId = cmsController::getInstance()
				->getCurrentElementId();
			$element = umiHierarchy::getInstance()
				->getElement($elementId);
			$keywords = '';

			if ($element instanceof iUmiHierarchyElement) {
				$keywords = $element->getValue('meta_keywords');
			}

			if ($keywords) {
				return $keywords;
			}

			$domainId = Service::DomainDetector()->detectId();
			$langId = Service::LanguageDetector()->detectId();
			$keywords = Service::Registry()->get("//settings/meta_keywords/{$domainId}/{$langId}");

			return $keywords ?: Service::Registry()->get("//settings/meta_keywords/{$langId}/{$domainId}");
		}
	}

	if (!function_exists('macros_returnPid')) {
		/**
		 * @return bool|int
		 */
		function macros_returnPid() {
			return cmsController::getInstance()->getCurrentElementId();
		}
	}

	if (!function_exists('macros_returnPreLang')) {
		/**
		 * @return string
		 */
		function macros_returnPreLang() {
			return cmsController::getInstance()->getPreLang();
		}
	}

	if (!function_exists('macros_returnDomain')) {
		/**
		 * @return bool|mixed|null
		 */
		function macros_returnDomain() {
			return getServer('HTTP_HOST');
		}
	}

	if (!function_exists('macros_returnDomainFloated')) {
		/**
		 * @return bool|mixed|string|null
		 */
		function macros_returnDomainFloated() {

			if (Service::Request()->isSite()) {
				return getServer('HTTP_HOST');
			}

			$arr = [];
			if (is_numeric(getRequest('param0'))) {
				$arr[] = getRequest('param0');
			}

			if (is_numeric(getRequest('param1'))) {
				$arr[] = getRequest('param1');
			}

			if (getRequest('parent')) {
				$arr[] = getRequest('parent');
			}

			$domainCollection = Service::DomainCollection();

			foreach ($arr as $c) {
				if (is_numeric($c)) {
					try {
						$element = umiHierarchy::getInstance()
							->getElement($c);

						if ($element) {
							$domain = $domainCollection->getDomain($element->getDomainId());

							if ($domain) {
								return $domain->getHost();
							}
						}
					} catch (baseException $e) {
						//Do nothing
					}
				}

				if (is_string($c)) {
					$domain_id = $domainCollection->getDomainId($c);
					$domain = $domainCollection->getDomain($domain_id);

					if ($domain) {
						return $domain->getHost();
					}
				}
			}

			return getServer('HTTP_HOST');
		}
	}

	if (!function_exists('macros_curr_time')) {
		/**
		 * @return int
		 */
		function macros_curr_time() {
			return time();
		}
	}

	if (!function_exists('macros_skin_path')) {
		/**
		 * @return bool|mixed|string|null
		 */
		function macros_skin_path() {
			if (getRequest('skin_sel')) {
				return getRequest('skin_sel');
			}

			$cookieJar = Service::CookieJar();
			return $cookieJar->get('skin') ?: Service::Registry()->get('//skins');
		}
	}

	if (!function_exists('macros_current_user_id')) {
		/**
		 * @return int
		 */
		function macros_current_user_id() {
			$auth = Service::Auth();
			return $auth->getUserId();
		}
	}

	if (!function_exists('macros_current_version_line')) {
		/**
		 * @return int|string
		 */
		function macros_current_version_line() {
			if (defined('CURRENT_VERSION_LINE')) {
				return CURRENT_VERSION_LINE;
			}

			return 'pro';
		}
	}

	if (!function_exists('macros_catched_errors')) {
		/**
		 * @return string
		 */
		function macros_catched_errors() {
			$res = '';
			foreach (baseException::$catchedExceptions as $exception) {
				$res .= '<p>' . $exception->getMessage() . '</p>';
			}
			return $res;
		}
	}

	if (!function_exists('macros_current_alt_name')) {
		/**
		 * @return string
		 */
		function macros_current_alt_name() {
			$cmsController = cmsController::getInstance();
			$element_id = $cmsController->getCurrentElementId();

			if ($element_id) {
				$element = umiHierarchy::getInstance()->getElement($element_id);

				if ($element) {
					return $element->getAltName();
				}

				return '';
			}

			return '';
		}
	}

	if (!function_exists('macros_returnParentId')) {
		/**
		 * @return int|string
		 */
		function macros_returnParentId() {
			$cmsController = cmsController::getInstance();
			$element_id = $cmsController->getCurrentElementId();

			if ($element_id) {
				$element = umiHierarchy::getInstance()->getElement($element_id);

				if ($element) {
					return $element->getParentId();
				}

				return '';
			}

			return '';
		}
	}

	if (!function_exists('macros_csrf')) {
		/**
		 * Возвращает значение csrf-токена
		 * @return bool|mixed|null
		 */
		function macros_csrf() {
			return Service::Session()->get('csrf_token');
		}
	}

	if (!function_exists('macros_getPageNumber')) {
		/**
		 * Возвращает номер текущей страницы (в рамках пагинации) по определенному формату
		 * @return string
		 */
		function macros_getPageNumber() {
			$format = getLabel('page-number-format');

			if (!is_string($format) || empty($format)) {
				return '';
			}

			$pageNumber = Service::Request()->pageNumber();

			if ($pageNumber === 0) {
				return '';
			}

			$realPageNumber = $pageNumber + 1;

			return sprintf($format, $realPageNumber);
		}
	}

	if (!function_exists('isCmsUpdating')) {
		/**
		 * Определяет обновляется ли система в данный момент
		 * @return bool
		 */
		function isCmsUpdating() {
			return file_exists(CURRENT_WORKING_DIR . '/updating');
		}
	}

	if (!function_exists('isCmsCalledFromPhar')) {
		/**
		 * Определяет была ли вызвана система phar
		 * @return bool
		 */
		function isCmsCalledFromPhar() {
			return CURRENT_WORKING_DIR === 'phar://umi.phar.php';
		}
	}

	if (!function_exists('system_is_allowed')) {
		/**
		 * @deprecated
		 * @see permissionsCollection::isAllowedMethod()
		 * @see permissionsCollection::isAllowedModule()
		 */
		function system_is_allowed($module, $method = false, $elementId = false) {
			if (cmsController::getInstance()->isVirtualModule($module)) {
				return true;
			}

			$permissions = permissionsCollection::getInstance();
			$userId = Service::Auth()->getUserId();

			if ($elementId) {
				list($readAllowed, $editAllowed) = $permissions->isAllowedObject($userId, $elementId);
				return contains($method, 'edit') ? (bool) $editAllowed : (bool) $readAllowed;
			}

			if ($method) {
				return (bool) $permissions->isAllowedMethod($userId, $module, $method);
			}

			if ($module) {
				return (bool) $permissions->isAllowedModule($userId, $module);
			}

			return false;
		}
	}

	if (!function_exists('system_is_mobile')) {
		/**
		 * @deprecated
		 * @return bool
		 */
		function system_is_mobile() {
			return Service::Request()->isMobile();
		}
	}

	if (!function_exists('translit')) {
		/**
		 * @deprecated
		 * @param string $input
		 * @return string
		 */
		function translit($input) {
			return translit::convert($input);
		}
	}

	if (!function_exists('isLocalMode')) {
		/**
		 * @deprecated
		 * @return bool
		 */
		function isLocalMode() {
			return Service::Request()->isLocal();
		}
	}

	if (!function_exists('getSession')) {
		/**
		 * @deprecated
		 * @return mixed
		 */
		function getSession($key) {
			return Service::Session()->get($key);
		}
	}

	if (!function_exists('l_mysql_query')) {
		/**
		 * @deprecated
		 * @param string $sql
		 * @param bool $no_cache
		 * @param string $className
		 * @return bool|mysqli_result|Resource
		 * @throws databaseException
		 */
		function l_mysql_query($sql, $no_cache = false, $className = 'core') {
			return ConnectionPool::getInstance()->getConnection($className)->query($sql);
		}
	}

	if (!function_exists('l_mysql_real_escape_string')) {
		/**
		 * @deprecated
		 * @param string $inputString
		 * @param string $className
		 * @return string
		 * @throws databaseException
		 */
		function l_mysql_real_escape_string($inputString, $className = 'core') {
			return ConnectionPool::getInstance()->getConnection($className)->escape($inputString);
		}
	}

	if (!function_exists('l_mysql_insert_id')) {
		/**
		 * @deprecated
		 * @param string $className
		 * @return int
		 * @throws databaseException
		 */
		function l_mysql_insert_id($className = 'core') {
			return ConnectionPool::getInstance()->getConnection($className)->insertId();
		}
	}

	if (!function_exists('l_mysql_error')) {
		/**
		 * @deprecated
		 * @param string $className
		 * @return string
		 * @throws databaseException
		 */
		function l_mysql_error($className = 'core') {
			return ConnectionPool::getInstance()->getConnection($className)->errorMessage();
		}
	}

	if (!function_exists('l_mysql_affected_rows')) {
		/**
		 * @deprecated
		 * @param string $className
		 * @return int
		 * @throws databaseException
		 */
		function l_mysql_affected_rows($className = 'core') {
			return ConnectionPool::getInstance()->getConnection($className)->affectedRows();
		}
	}

	if (!function_exists('getCookie')) {
		/**
		 * @deprecated
		 * @param string $key
		 * @return mixed|string|null
		 */
		function getCookie($key) {
			return Service::CookieJar()->get($key);
		}
	}

	if (!function_exists('wa_strtolower')) {
		/**
		 * @deprecated
		 * @param string $str
		 * @return string
		 */
		function wa_strtolower($str) {
			return mb_strtolower($str);
		}
	}

	if (!function_exists('wa_strtoupper')) {
		/**
		 * @deprecated
		 * @param string $str
		 * @return string
		 */
		function wa_strtoupper($str) {
			return mb_strtoupper($str);
		}
	}

	if (!function_exists('wa_substr')) {
		/**
		 * @deprecated
		 * @param string $str
		 * @param int $pos
		 * @param int $offset
		 * @return string
		 */
		function wa_substr($str, $pos, $offset) {
			return mb_substr($str, $pos, $offset);
		}
	}

	if (!function_exists('wa_strlen')) {
		/**
		 * @deprecated
		 * @param string $str
		 * @return int
		 */
		function wa_strlen($str) {
			return mb_strlen($str);
		}
	}

	if (!function_exists('wa_strpos')) {
		/**
		 * @deprecated
		 * @param string $str
		 * @param string $seek
		 * @return false|int
		 */
		function wa_strpos($str, $seek) {
			return mb_strpos($str, $seek);
		}
	}

	if (!function_exists('string_bytes')) {
		/**
		 * @deprecated
		 * @param string $string
		 * @return int
		 */
		function string_bytes($string) {
			return bytes_strlen($string);
		}
	}

	if (!function_exists('check_session')) {
		/**
		 * @deprecated
		 * @return null
		 */
		function check_session() {
			return null;
		}
	}

	if (!function_exists('system_get_tpl')) {
		/**
		 * @deprecated
		 * @return null
		 */
		function system_get_tpl() {
			return null;
		}
	}

	if (!function_exists('system_remove_cache')) {
		/**
		 * @deprecated
		 * @return null
		 */
		function system_remove_cache() {
			return null;
		}
	}

	if (!function_exists('system_gen_password')) {
		/**
		 * @deprecated
		 * @return null
		 */
		function system_gen_password() {
			return null;
		}
	}

	if (!function_exists('getPrintableTpl')) {
		/**
		 * @deprecated
		 * @return null
		 */
		function getPrintableTpl() {
			return null;
		}
	}

	if (!function_exists('system_checkSession')) {
		/**
		 * @deprecated
		 * @return null
		 */
		function system_checkSession() {
			return null;
		}
	}

	if (!function_exists('system_setSession')) {
		/**
		 * @deprecated
		 * @return null
		 */
		function system_setSession() {
			return null;
		}
	}

	if (!function_exists('system_removeSession')) {
		/**
		 * @deprecated
		 * @return null
		 */
		function system_removeSession() {
			return null;
		}
	}

	if (!function_exists('system_getSession')) {
		/**
		 * @deprecated
		 * @return null
		 */
		function system_getSession() {
			return null;
		}
	}

	if (!function_exists('system_runSession')) {
		/**
		 * @deprecated
		 * @return null
		 */
		function system_runSession() {
			return null;
		}
	}