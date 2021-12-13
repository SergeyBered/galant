<?php
	use UmiCms\Service;

	if (!defined('CURRENT_WORKING_DIR')) {
		define('CURRENT_WORKING_DIR', str_replace("\\", '/', dirname(dirname(dirname(__FILE__)))));
	}

	if (!defined('CONFIG_INI_PATH')) {
		define('CONFIG_INI_PATH', CURRENT_WORKING_DIR . '/config.ini');
	}

	if (!class_exists('mainConfiguration')) {
		require_once CURRENT_WORKING_DIR . '/classes/system/patterns/iSingleton.php';
		require_once CURRENT_WORKING_DIR . '/classes/system/subsystems/Configuration/iConfiguration.php';
		require_once CURRENT_WORKING_DIR . '/classes/system/subsystems/Configuration/mainConfiguration.php';
	}

	require_once 'functions.php';

	try {
		$config = mainConfiguration::getInstance();
	} catch (Exception $e) {
		echo 'Critical error: ', $e->getMessage();
		exit;
	}

	$ini = $config->getParsedIni();
	initConfigConstants($ini);

	if (!defined('SYS_KERNEL_PATH')) {
		define('SYS_KERNEL_PATH', $config->includeParam('system.kernel'));
	}

	if (!defined('SYS_LIBS_PATH')) {
		define('SYS_LIBS_PATH', $config->includeParam('system.libs'));
	}

	if (!defined('SYS_TPLS_PATH')) {
		define('SYS_TPLS_PATH', $config->includeParam('templates.tpl'));
	}

	if (!defined('SYS_XSLT_PATH')) {
		define('SYS_XSLT_PATH', $config->includeParam('templates.xsl'));
	}

	if (!defined('SYS_SKIN_PATH')) {
		define('SYS_SKIN_PATH', $config->includeParam('templates.skins'));
	}

	if (!defined('SYS_ERRORS_PATH')) {
		define('SYS_ERRORS_PATH', $config->includeParam('system.error'));
	}

	if (!defined('SYS_MODULES_PATH')) {
		define('SYS_MODULES_PATH', CURRENT_WORKING_DIR . '/classes/components/');
	}

	if (!defined('SYS_DEF_MODULE_PATH')) {
		define('SYS_DEF_MODULE_PATH', SYS_MODULES_PATH);
	}

	if (!defined('SYS_CACHE_RUNTIME')) {
		define('SYS_CACHE_RUNTIME', $config->includeParam('system.runtime-cache'));
	}

	if (!defined('SYS_MANIFEST_PATH')) {
		define('SYS_MANIFEST_PATH', $config->includeParam('system.manifest'));
	}

	if (!defined('SYS_KERNEL_STREAMS')) {
		define('SYS_KERNEL_STREAMS', $config->includeParam('system.kernel.streams'));
	}

	if (!defined('KEYWORD_GRAB_ALL')) {
		define('KEYWORD_GRAB_ALL', $config->get('kernel', 'grab-all-keyword'));
	}

	if (!defined('DEFAULT_THUMBNAIL_MAKE_MEMORY_LIMIT')) {
		define('DEFAULT_THUMBNAIL_MAKE_MEMORY_LIMIT', 128 * 1024 * 1024);
	}

	$cacheSalt = $config->get('system', 'salt');

	if (!$cacheSalt) {
		$cacheSalt = sha1(mt_rand());
		$config->set('system', 'salt', $cacheSalt);
		$config->save();
	}

	if (!defined('SYS_CACHE_SALT')) {
		define('SYS_CACHE_SALT', $cacheSalt);
	}

	if (!class_exists('umiAutoload')) {
		require_once CURRENT_WORKING_DIR . '/classes/system/autoload/umiAutoload.php';
	}

	spl_autoload_register('umiAutoload::autoload');

	require_once CURRENT_WORKING_DIR . '/classes/system/autoload/AutoloadMapLoader.php';
	$mapLoader = new \UmiCms\Libs\AutoloadMapLoader();
	$map = $mapLoader
		->fromConfig(mainConfiguration::getInstance())
		->fromFile(CURRENT_WORKING_DIR . '/classes/system/autoload/autoload.php')
		->fromFile(CURRENT_WORKING_DIR . '/classes/system/autoload/autoload.custom.php')
		->fromFile(CURRENT_WORKING_DIR . '/libs/autoload.custom.php') // обратная совместимость
		->getMap();

	umiAutoload::addClassesToAutoload($map);
	implementComposerAutoload();

	if (!class_exists('XSLTProcessor')) {
		Service::Response()
			->getCurrentBuffer()
			->crash('xslt_failed');
	}

	$debug = false;

	if ($config->get('debug', 'enabled')) {
		$ips = $config->get('debug', 'filter.ip');
		if (is_array($ips)) {
			if (in_array(getServer('REMOTE_ADDR'), $ips)) {
				$debug = true;
			}
		} else {
			$debug = true;
		}
	}

	if (!defined('DEBUG')) {
		define('DEBUG', $debug);
	}

	if (!defined('DEBUG_SHOW_BACKTRACE')) {
		$showBacktrace = false;
		$allowedIps = $config->get('debug', 'allowed-ip');
		$allowedIps = is_array($allowedIps) ? $allowedIps : [];

		if ($config->get('debug', 'show-backtrace') &&
			(!umiCount($allowedIps) || in_array(getServer('REMOTE_ADDR'), $allowedIps))) {
			$showBacktrace = true;
		}

		define('DEBUG_SHOW_BACKTRACE', $showBacktrace);
	}

	error_reporting(DEBUG ? (defined('E_DEPRECATED') ? ~E_STRICT & ~E_DEPRECATED : ~E_STRICT) : E_ERROR);
	ini_set('display_errors', '1');

	if (DEBUG === false and function_exists('xdebug_disable')) {
		xdebug_disable();
	}

	initConfigConnections($ini);

	/* Установка обработчика исключений */
	if (!isCronMode()) {
		// Выбор шаблона, в зависимости от режима работы
		if (Service::Request()->isXml()) {
			$template = SYS_ERRORS_PATH . 'exception.xml.php';
		} elseif (Service::Request()->isJson()) {
			$template = SYS_ERRORS_PATH . 'exception.json.php';
		} else {
			$template = SYS_ERRORS_PATH . 'exception.html.php';
		}

		umiExceptionHandler::set('base', $template);
		umiExceptionHandler::handleShutdown();
	}

	initPageNumberRequest();
	registerStreams();

	if (!defined('DEBUG') && function_exists('libxml_use_internal_errors')) {
		libxml_use_internal_errors(true);
	}

	$timezone = $config->get('system', 'time-zone');
	if ($timezone) {
		@date_default_timezone_set($timezone);
	}

	if (!defined('IMAGE_COMPRESSION_LEVEL')) {
		if (isset($ini['system']['image-compression'])) {
			$imageCompression = getImageQualityLevel($ini['system']['image-compression']);
			define('IMAGE_COMPRESSION_LEVEL', $imageCompression);
		} else {
			define('IMAGE_COMPRESSION_LEVEL', 100);
		}
	}

	if (!defined('DOM_LOAD_OPTIONS')) {
		if (defined('LIBXML_VERSION')) {
			define('DOM_LOAD_OPTIONS', (LIBXML_VERSION < 20621) ? 0 : LIBXML_COMPACT);
		} else {
			define('DOM_LOAD_OPTIONS', LIBXML_COMPACT);
		}
	}

	if (!defined('PHP_INT_MAX')) {
		define('PHP_INT_MAX', 4294967296 / 2 - 1);
	}

	if (!is_string(getenv('OS')) || mb_strtolower(mb_substr(getenv('OS'), 0, 3)) != 'win') {
		setlocale(LC_NUMERIC, 'en_US.utf8');
	}

	mb_internal_encoding('UTF-8');

	if (!headers_sent()) {
		ini_set('session.cookie_lifetime', '0');
		ini_set('session.use_cookies', '1');
		ini_set('session.use_only_cookies', '1');
	}

	if (!Service::Request()->isCli() && !isCronMode() && !isCmsCalledFromPhar()) {
		try {
			checkIpAddress($config);
		} catch (Exception $exception) {
			//nothing
		}
	}

	importTemplateAutoload();
	importTemplateServices();