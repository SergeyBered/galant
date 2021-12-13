<?php
	use UmiCms\Classes\System\Controllers;
	use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

	return function (RoutingConfigurator $routes) {

		$routes->add('license-restore', '/license_restore.php{query}')
			->controller(Controllers\LicenseCheckController::class)
			->requirements(['query' => '.*']);

		$routes->add('save-domain-keycode', '/save_domain_keycode.php{query}')
			->controller(Controllers\SaveDomainKeyCodeController::class)
			->requirements(['query' => '.*']);

		$routes->add('updater', '/updater.php{path}')
			->controller(Controllers\UpdaterController::class)
			->requirements([
				'path' => '.*',
			]);

		$routes->add('index', '/{path}')
			->controller(Controllers\IndexController::class)
			->requirements([
				'path' => '.*'
			]);
	};