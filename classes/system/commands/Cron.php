#!/usr/local/bin/php
<?php
    define('CRON', 'CLI');
    use UmiCms\Service;
    include_once __DIR__  . '/../../../standalone.php';

    $modules = [];

    if (!empty($argv[1])) {
        $modules = explode(',', $argv[1]);
        $modules = ($modules === ['all']) ? [] : $modules;
    }

    $methods = [];

    if (!empty($argv[2])) {
        $methods = explode(',', $argv[2]);
        $methods = ($methods === ['all']) ? [] : $methods;
    }

    /** @var iUmiCron $cron */
    $cron = Service::get('CronExecutor');
    $cron->setModules($modules);
    $cron->setMethods($methods);
    $cron->run();

    $buffer = Service::Response()
        ->getCliBuffer();
    $buffer->push($cron->getParsedLogs());
    $buffer->end();