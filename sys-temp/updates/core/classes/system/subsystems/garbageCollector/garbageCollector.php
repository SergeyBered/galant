<?php
 use UmiCms\Service;class garbageCollector implements iGarbageCollector {protected $maxIterationsCount = 50000;protected $executedIterationsCount = 0;public function run() {return $this->resetExecutedIterationCount()    ->deleteInvalidStaticCache()    ->deleteEmptyObjectProperties();}public function setMaxIterationCount($v01a02ac01bd734f00a6e7c0f31d19375) {$this->maxIterationsCount = (int) $v01a02ac01bd734f00a6e7c0f31d19375;return $this;}public function getMaxIterationCount() {return $this->maxIterationsCount;}public function getExecutedIterationsCount() {return $this->executedIterationsCount;}protected function deleteInvalidStaticCache() {$vc431a4425bc56080c868435c8d910f83 = Service::StaticCache()    ->getTimeToLive();$v2245023265ae4cf87d02c8b6ba991139 = mainConfiguration::getInstance();return $this->deleteDirectoryIfExpired(    $v2245023265ae4cf87d02c8b6ba991139->includeParam('system.static-cache'),    $vc431a4425bc56080c868435c8d910f83   );}protected function deleteIfExpired($v447b7147e84be512208dcc0995d67ebc, $v6159e57fd3d04c0a77cf7c61ee8f0a9e = 0) {switch (true) {case ($v447b7147e84be512208dcc0995d67ebc instanceof iUmiDirectory) : {$this->deleteDirectoryIfExpired($v447b7147e84be512208dcc0995d67ebc->getPath(), $v6159e57fd3d04c0a77cf7c61ee8f0a9e);break;}case ($v447b7147e84be512208dcc0995d67ebc instanceof iUmiFile) : {$this->deleteFileIfExpired($v447b7147e84be512208dcc0995d67ebc, $v6159e57fd3d04c0a77cf7c61ee8f0a9e);break;}default : {throw new coreException('Got unexpected result of type "' . gettype($v447b7147e84be512208dcc0995d67ebc) . '"');}}}protected function deleteDirectoryIfExpired($v06f0066e65410a0a1c9f39991a3f3b01, $v6159e57fd3d04c0a77cf7c61ee8f0a9e = 0) {$v736007832d2167baaae763fd3a3f3cf1 = new umiDirectory($v06f0066e65410a0a1c9f39991a3f3b01);if ($v736007832d2167baaae763fd3a3f3cf1->getIsBroken() || !$v736007832d2167baaae763fd3a3f3cf1->isReadable()) {return $this;}foreach ($v736007832d2167baaae763fd3a3f3cf1 as $v447b7147e84be512208dcc0995d67ebc) {$this->incrementExecutedIterationCount();$this->checkMaxIterations();$this->deleteIfExpired($v447b7147e84be512208dcc0995d67ebc, $v6159e57fd3d04c0a77cf7c61ee8f0a9e);}$v736007832d2167baaae763fd3a3f3cf1->deleteEmptyDirectory();return $this;}protected function checkMaxIterations() {$vd8cf3624f665e1bb2e9e0d7b4ab36bdf = $this->getMaxIterationCount();if ($this->getExecutedIterationsCount() > $vd8cf3624f665e1bb2e9e0d7b4ab36bdf) {throw new maxIterationsExeededException('Maximum iterations count reached: ' . $vd8cf3624f665e1bb2e9e0d7b4ab36bdf);}return $this;}protected function deleteEmptyObjectProperties() {$v4717d53ebfdfea8477f780ec66151dcb = ConnectionPool::getInstance()->getConnection();$vac5c74b64b4b8352ef2f181affb5ac2a = <<<SQL
DELETE FROM `cms3_object_content`
WHERE
	`int_val` IS NULL AND
	`varchar_val` IS NULL AND
	`text_val` IS NULL AND
	`rel_val` IS NULL AND
	`tree_val` IS NULL AND
	`float_val` IS NULL
SQL;