<?php
 namespace UmiCms\Classes\System\MiddleWares;use UmiCms\System\Auth\iAuth;use UmiCms\System\Auth\AuthenticationException;use UmiCms\Classes\System\Controllers\AbstractController;trait tAuth {protected $vfa53b91ccc1b78668d5af58e1ed3a485;public function setAuth(iAuth $vfa53b91ccc1b78668d5af58e1ed3a485) {$this->auth = $vfa53b91ccc1b78668d5af58e1ed3a485;return $this;}public function loginByEnvironment() {try {$this->auth->loginByEnvironment();}catch (HttpAuthenticationException $v42552b1f133f9f8eb406d4f306ea9fd1) {$v7f2db423a49b305459147332fb01cf87 = $this->getBuffer();$v7f2db423a49b305459147332fb01cf87->setHeader('WWW-Authenticate', 'Basic realm="UMI.CMS"');$v7f2db423a49b305459147332fb01cf87->crash('authenticate_failed', 401);}}}