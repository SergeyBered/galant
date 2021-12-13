<?php
	use UmiCms\Classes\System\Controllers;
	use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

	return function (RoutingConfigurator $routes) {

		$routes->add('tiny-url', '/~/{id}')
			->controller(Controllers\TinyUrlController::class)
			->requirements(['id' => '\d+']);

		$routes->add('robots', '/robots.txt')
			->controller(Controllers\RobotsController::class);

		$routes->add('favicon', '/favicon.ico')
			->controller(Controllers\FaviconController::class);

		$routes->add('sitemap', '/sitemap{id}.xml')
			->controller(Controllers\SiteMapController::class)
			->requirements(['id' => '[\d]{0,}']);

		$routes->add('sitemap-images', '/sitemap-images{id}.xml')
			->controller(Controllers\SiteMapImagesController::class)
			->requirements(['id' => '[\d]{0,}']);

		$routes->add('autothumb', '/autothumbs.php?img={file}')
			->controller(Controllers\AutoThumbController::class)
			->requirements([
				'file' => '.*'
			]);

		$routes->add('captcha', '/captcha.php{query}')
			->controller(Controllers\CaptchaController::class)
			->requirements(['query' => '.*']);

		$routes->add('counter', '/counter.php')
			->controller(Controllers\DispatchesCounterController::class);

		$routes->add('counter-hash', '/counter.php?path={path}')
			->controller(Controllers\DispatchesCounterController::class)
			->requirements(['path' => '.*']);

		$routes->add('cron', '/cron.php{query}')
			->controller(Controllers\CronController::class)
			->requirements(['query' => '.*']);

		$routes->add('go-out', '/go-out.php?url={url}')
			->controller(Controllers\GoOutController::class)
			->requirements(['url' => '.*']);

		$routes->add('session', '/session.php{query}')
			->controller(Controllers\SessionCheckController::class)
			->requirements(['query' => '.*']);

		$routes->add('static-banner', '/static_banner.php{query}')
			->controller(Controllers\StaticBannerController::class)
			->requirements(['query' => '.*']);

		$routes->add('streams', '/{stream}{path}')
			->controller(Controllers\StreamsController::class)
			->requirements([
				'stream' => 'udata|upage|uobject|ufs|usel|ulang|utype|umess|uhttp',
				'path' => '.*'
			]);

		$routes->add('xml-force', '/{path}{format}{query}')
			->controller(Controllers\XmlForceController::class)
			->requirements([
				'path' => '.*',
				'format' => '\.xml',
				'query' => '(.*){0,}',
			]);

		$routes->add('json-force', '/{path}{format}{query}')
			->controller(Controllers\JsonForceController::class)
			->requirements([
				'path' => '.*',
				'format' => '\.json',
				'query' => '(.*){0,}',
			]);
	};