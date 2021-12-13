<?php
 namespace UmiCms\System\Orm\Entity\Repository;class History implements iHistory {private $createLog = [];private $updateLog = [];private $deleteLog = [];private $getLog = [];private $getAllLog = [];public function logCreate($vb80bb7740288fda1f201890375a60c8f) {$this->createLog[] = $vb80bb7740288fda1f201890375a60c8f;return $this;}public function logUpdate($vb80bb7740288fda1f201890375a60c8f) {$this->updateLog[] = $vb80bb7740288fda1f201890375a60c8f;return $this;}public function logDelete($vb80bb7740288fda1f201890375a60c8f) {$this->deleteLog[] = $vb80bb7740288fda1f201890375a60c8f;return $this;}public function logGet($vb068931cc450442b63f5b3d276ea4297, $v2063c1608d6e0baf80249c42e2be5804) {$this->getLog[] = $this->packGetArgs($vb068931cc450442b63f5b3d276ea4297, $v2063c1608d6e0baf80249c42e2be5804);return $this;}public function logEqualityMap(array $v5802a0c16daf57810f3df4f0233e541f) : iHistory {foreach ($v5802a0c16daf57810f3df4f0233e541f as $vb068931cc450442b63f5b3d276ea4297 => $v2063c1608d6e0baf80249c42e2be5804) {$this->logGet($vb068931cc450442b63f5b3d276ea4297, $v2063c1608d6e0baf80249c42e2be5804);}return $this;}public function logGetAll($ve2942a04780e223b215eb8b663cf5353) {$this->getAllLog[] = $ve2942a04780e223b215eb8b663cf5353;return $this;}public function isCreationLogged($vb80bb7740288fda1f201890375a60c8f) {return in_array($vb80bb7740288fda1f201890375a60c8f, $this->createLog);}public function isUpdatingLogged($vb80bb7740288fda1f201890375a60c8f) {return in_array($vb80bb7740288fda1f201890375a60c8f, $this->updateLog);}public function isDeletionLogged($vb80bb7740288fda1f201890375a60c8f) {return in_array($vb80bb7740288fda1f201890375a60c8f, $this->deleteLog);}public function isGettingLogged($vb068931cc450442b63f5b3d276ea4297, $v2063c1608d6e0baf80249c42e2be5804) {return in_array($this->packGetArgs($vb068931cc450442b63f5b3d276ea4297, $v2063c1608d6e0baf80249c42e2be5804), $this->getLog);}public function isEqualityMapLogged(array $v5802a0c16daf57810f3df4f0233e541f) : bool {$v886bb73b3156b0aa24aac99d2de0b238= 0;foreach ($v5802a0c16daf57810f3df4f0233e541f as $vb068931cc450442b63f5b3d276ea4297 => $v2063c1608d6e0baf80249c42e2be5804) {if ($this->isGettingLogged($vb068931cc450442b63f5b3d276ea4297, $v2063c1608d6e0baf80249c42e2be5804)) {$v886bb73b3156b0aa24aac99d2de0b238++;}}return $v886bb73b3156b0aa24aac99d2de0b238 === count($v5802a0c16daf57810f3df4f0233e541f);}public function isGetAllLogged() {return count($this->getAllLog) > 0;}public function readCreateLog() {return $this->createLog;}public function readUpdateLog() {return $this->updateLog;}public function readDeleteLog() {return $this->deleteLog;}public function readGetLog() {return $this->getLog;}public function readGetAllLog() {return $this->getAllLog;}public function clear() {$this->createLog = [];$this->updateLog = [];$this->deleteLog = [];$this->getLog = [];$this->getAllLog = [];return $this;}private function packGetArgs($vb068931cc450442b63f5b3d276ea4297, $v2063c1608d6e0baf80249c42e2be5804) {return sprintf('%s::%s', $vb068931cc450442b63f5b3d276ea4297, serialize($v2063c1608d6e0baf80249c42e2be5804));}}