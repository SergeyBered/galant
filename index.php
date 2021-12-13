<?php
	define('CURRENT_WORKING_DIR', dirname(__FILE__));
	require_once __DIR__ . '/classes/system/bootstrap/bootstrap.php';

	use UmiCms\Service;

	$uri = Service::Request()
		->uri();

	$parameters = Service::Router()
		->resolve($uri);

	Service::ControllerFactory()
		->create($parameters)
		->execute();
