<?php
 namespace UmiCms\Classes\System\Controllers;class Factory implements iFactory {private $serviceContainer;public function __construct(\iServiceContainer $v06d419f75cbecf6df5a44ea9471105ba) {$this->serviceContainer = $v06d419f75cbecf6df5a44ea9471105ba;}public function create(array $v166e64f6c3677d0c513901242a3e702d) {$va2f2ed4f8ebc2cbb4c21a29dc40ab61d = $this->getControllerClass($v166e64f6c3677d0c513901242a3e702d);try {$vb068931cc450442b63f5b3d276ea4297 = $this->getControllerService($v166e64f6c3677d0c513901242a3e702d);$v594c103f2c6e04c3d8ab059f031e0c1a = $this->instantiateController($vb068931cc450442b63f5b3d276ea4297, $v166e64f6c3677d0c513901242a3e702d);}catch (\ErrorException $v42552b1f133f9f8eb406d4f306ea9fd1) {\umiExceptionHandler::report($v42552b1f133f9f8eb406d4f306ea9fd1);$v10573b873d2fa5a365d558a45e328e47 = $this->serviceContainer->get('Request');$vd1fc8eaf36937be0c3ba8cfe0a2c1bfe = $this->serviceContainer->get('Response');$v594c103f2c6e04c3d8ab059f031e0c1a = new $va2f2ed4f8ebc2cbb4c21a29dc40ab61d($v10573b873d2fa5a365d558a45e328e47, $vd1fc8eaf36937be0c3ba8cfe0a2c1bfe);}if (is_object($v594c103f2c6e04c3d8ab059f031e0c1a) && is_callable([$v594c103f2c6e04c3d8ab059f031e0c1a, 'execute'])) {return $v594c103f2c6e04c3d8ab059f031e0c1a;}throw new \ErrorException(sprintf('Incorrect _controller given: %s', $va2f2ed4f8ebc2cbb4c21a29dc40ab61d));}private function getControllerClass(array $v166e64f6c3677d0c513901242a3e702d) : string {if (!isset($v166e64f6c3677d0c513901242a3e702d['_controller'])) {throw new \ErrorException('Incorrect router parameters given, _controller expected');}return $v166e64f6c3677d0c513901242a3e702d['_controller'];}private function getControllerService(array $v166e64f6c3677d0c513901242a3e702d) : string {if (isset($v166e64f6c3677d0c513901242a3e702d['_service'])) {return $v166e64f6c3677d0c513901242a3e702d['_service'];}$va2f2ed4f8ebc2cbb4c21a29dc40ab61d = $this->getControllerClass($v166e64f6c3677d0c513901242a3e702d);return trimNameSpace($va2f2ed4f8ebc2cbb4c21a29dc40ab61d);}private function instantiateController($vb068931cc450442b63f5b3d276ea4297, array $v166e64f6c3677d0c513901242a3e702d) {$v594c103f2c6e04c3d8ab059f031e0c1a = $this->serviceContainer->get($vb068931cc450442b63f5b3d276ea4297);return $v594c103f2c6e04c3d8ab059f031e0c1a->setRouterParameters($v166e64f6c3677d0c513901242a3e702d);}}