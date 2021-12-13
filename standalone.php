<?php
	if (!defined('CURRENT_WORKING_DIR')) {
		define('CURRENT_WORKING_DIR', dirname(__FILE__));
	}

	require_once __DIR__ . '/classes/system/bootstrap/bootstrap.php';

	/** @deprecated  */
	function run_standalone($moduleName) {
		return cmsController::getInstance()->getModule($moduleName);
	}
