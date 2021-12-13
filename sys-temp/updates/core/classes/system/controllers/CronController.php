<?php
 namespace UmiCms\Classes\System\Controllers;use \iUmiCron as iExecutor;use \iPermissionsCollection as iPermissions;use UmiCms\Classes\System\MiddleWares\tAuth;class CronController extends AbstractController implements iCronController {private $executor;private $permissions;use tAuth;public function setExecutor(iExecutor $vb1925939f66c2e4625aadb18cabf1cea) {$this->executor = $vb1925939f66c2e4625aadb18cabf1cea;return $this;}public function setPermissions(iPermissions $permissions) {$this->permissions = $permissions;return $this;}public function execute() {parent::execute();$this->loginByEnvironment();$v8e44f0089b076e18a718eb9ca3d94674 = $this->auth->getUserId();if (!$this->permissions->isAllowedMethod($v8e44f0089b076e18a718eb9ca3d94674, 'config', 'cron_http_execute')) {$this->buffer->crash('required_more_permissions', 403);}$this->buffer->contentType('text/plain');$v06d4cd63bde972fc66a0aed41d2f5c51 = <<<END
This file should be executed by cron only. Please, run it via HTTP for test only.
Maximum priority level can accept values between "1" and "10", where "1" is maximum priority.


END;