<?php
 use UmiCms\Service;class domain extends umiEntinty implements iDomain {private $host;private $defaultLanguageId;private $mirrors = [];private $isDefaultFlag;private $usingSsl;private $favicon;private static $FAVICON_EXT_LIST = ['ico', 'png', 'svg', 'jpeg', 'gif', 'jpg', 'webp'];protected $store_type = 'domain';const INSTANCE_ATTRIBUTE_COUNT = 6;public function getHost($v97a57645a3f0e1518f8c9f4d340d4c4f = false) {if ($v97a57645a3f0e1518f8c9f4d340d4c4f) {return $this->getEncodedHost();}return $this->host;}public function getEncodedHost() {return Service::IdnConverter()    ->encode($this->getHost());}public function getDecodedHost() {return Service::IdnConverter()    ->decode($this->getHost());}public function setHost($v67b3dba8bc6778101892eb77249db32e) {if (!is_string($v67b3dba8bc6778101892eb77249db32e) || empty($v67b3dba8bc6778101892eb77249db32e)) {throw new wrongParamException('Wrong domain host given');}$v67b3dba8bc6778101892eb77249db32e = self::filterHostName($v67b3dba8bc6778101892eb77249db32e);if ($this->getHost() != $v67b3dba8bc6778101892eb77249db32e) {$this->host = $v67b3dba8bc6778101892eb77249db32e;$this->setIsUpdated();}}public function getIsDefault() {return $this->isDefaultFlag;}public function setIsDefault($v327a6c4304ad5938eaf0efb6cc3e53dc) {$v327a6c4304ad5938eaf0efb6cc3e53dc = (bool) $v327a6c4304ad5938eaf0efb6cc3e53dc;if ($this->getIsDefault() != $v327a6c4304ad5938eaf0efb6cc3e53dc) {$this->isDefaultFlag = $v327a6c4304ad5938eaf0efb6cc3e53dc;$this->setIsUpdated();}}public function isUsingSsl() {return $this->usingSsl;}public function setUsingSsl($v327a6c4304ad5938eaf0efb6cc3e53dc = true) {$v327a6c4304ad5938eaf0efb6cc3e53dc = (bool) $v327a6c4304ad5938eaf0efb6cc3e53dc;if ($this->isUsingSsl() !== $v327a6c4304ad5938eaf0efb6cc3e53dc) {$this->usingSsl = $v327a6c4304ad5938eaf0efb6cc3e53dc;$this->setIsUpdated();}return $this;}public function getFavicon() {return $this->favicon;}public function setFavicon($vbaec6461b0d69dde1b861aefbe375d8a) {if (!$vbaec6461b0d69dde1b861aefbe375d8a instanceof iUmiImageFile && $vbaec6461b0d69dde1b861aefbe375d8a !== null) {throw new wrongParamException('Wrong favicon given');}if ($vbaec6461b0d69dde1b861aefbe375d8a instanceof iUmiImageFile) {if ($vbaec6461b0d69dde1b861aefbe375d8a->getIsBroken()) {throw new wrongParamException(sprintf('Broken favicon path given: "%s"', $vbaec6461b0d69dde1b861aefbe375d8a->getFilePath()));}if (!in_array(strtolower($vbaec6461b0d69dde1b861aefbe375d8a->getExt()), self::$FAVICON_EXT_LIST)) {throw new wrongParamException(sprintf('Incorrect file format for favicon "%s"', $vbaec6461b0d69dde1b861aefbe375d8a->getExt()));}}if ($this->getFavicon() !== $vbaec6461b0d69dde1b861aefbe375d8a) {$this->favicon = $vbaec6461b0d69dde1b861aefbe375d8a;$this->setIsUpdated();}return $this;}public function getDefaultLangId() {return $this->defaultLanguageId;}public function setDefaultLangId($vb80bb7740288fda1f201890375a60c8f) {if (!Service::LanguageCollection()->isExists($vb80bb7740288fda1f201890375a60c8f)) {throw new coreException("Language #{$vb80bb7740288fda1f201890375a60c8f} doesn't exist");}if ($this->getDefaultLangId() != $vb80bb7740288fda1f201890375a60c8f) {$this->defaultLanguageId = $vb80bb7740288fda1f201890375a60c8f;$this->setIsUpdated();}return true;}public function addMirror($v67b3dba8bc6778101892eb77249db32e) {$v13c1f5c5e4829e276308259711c5bd33 = $this->getMirrorId($v67b3dba8bc6778101892eb77249db32e);if ($v13c1f5c5e4829e276308259711c5bd33) {throw new coreException("Domain mirror #{$v67b3dba8bc6778101892eb77249db32e} already exist.");}$v4717d53ebfdfea8477f780ec66151dcb = ConnectionPool::getInstance()->getConnection();$v4717d53ebfdfea8477f780ec66151dcb->startTransaction("Create domain mirror {$v67b3dba8bc6778101892eb77249db32e}");try {$v817f7de13f58df29b13a9570082097da = (int) $this->getId();$vac5c74b64b4b8352ef2f181affb5ac2a = "INSERT INTO `cms3_domain_mirrows` (`rel`) VALUES ($v817f7de13f58df29b13a9570082097da)";$v4717d53ebfdfea8477f780ec66151dcb->query($vac5c74b64b4b8352ef2f181affb5ac2a);$v13c1f5c5e4829e276308259711c5bd33 = $v4717d53ebfdfea8477f780ec66151dcb->insertId();$vfbe322a89bc0ba531c3f0050e3935f28 = new domainMirror($v13c1f5c5e4829e276308259711c5bd33);$vfbe322a89bc0ba531c3f0050e3935f28->setHost($v67b3dba8bc6778101892eb77249db32e);$vfbe322a89bc0ba531c3f0050e3935f28->setDomainId($v817f7de13f58df29b13a9570082097da);$vfbe322a89bc0ba531c3f0050e3935f28->commit();}catch (Exception $ve1671797c52e15f763380b45e841ec32) {$v4717d53ebfdfea8477f780ec66151dcb->rollbackTransaction();throw $ve1671797c52e15f763380b45e841ec32;}$v4717d53ebfdfea8477f780ec66151dcb->commitTransaction();$this->mirrors[$v13c1f5c5e4829e276308259711c5bd33] = $vfbe322a89bc0ba531c3f0050e3935f28;return $v13c1f5c5e4829e276308259711c5bd33;}public function delMirror($vb80bb7740288fda1f201890375a60c8f) {if (!$this->isMirrorExists($vb80bb7740288fda1f201890375a60c8f)) {throw new coreException("Domain mirror #{$vb80bb7740288fda1f201890375a60c8f} doesn't exist.");}$v817f7de13f58df29b13a9570082097da = (int) $vb80bb7740288fda1f201890375a60c8f;$v4717d53ebfdfea8477f780ec66151dcb = ConnectionPool::getInstance()->getConnection();$vac5c74b64b4b8352ef2f181affb5ac2a = "DELETE FROM cms3_domain_mirrows WHERE id = $v817f7de13f58df29b13a9570082097da";$v4717d53ebfdfea8477f780ec66151dcb->query($vac5c74b64b4b8352ef2f181affb5ac2a);unset($this->mirrors[$v817f7de13f58df29b13a9570082097da]);return true;}public function delAllMirrors() {$v4717d53ebfdfea8477f780ec66151dcb = ConnectionPool::getInstance()->getConnection();$v817f7de13f58df29b13a9570082097da = (int) $this->getId();$vac5c74b64b4b8352ef2f181affb5ac2a = "DELETE FROM cms3_domain_mirrows WHERE rel = $v817f7de13f58df29b13a9570082097da";$v4717d53ebfdfea8477f780ec66151dcb->query($vac5c74b64b4b8352ef2f181affb5ac2a);return true;}public function getMirrorId($v67b3dba8bc6778101892eb77249db32e, $v67e64ff6d302b3c7ffd5e192df30fe7a = true) {if (!is_string($v67b3dba8bc6778101892eb77249db32e) || empty($v67b3dba8bc6778101892eb77249db32e)) {return false;}foreach ($this->getMirrorsList() as $vfbe322a89bc0ba531c3f0050e3935f28) {if ($vfbe322a89bc0ba531c3f0050e3935f28->getHost() == $v67b3dba8bc6778101892eb77249db32e) {return $vfbe322a89bc0ba531c3f0050e3935f28->getId();}}if ($v67e64ff6d302b3c7ffd5e192df30fe7a) {$v67b3dba8bc6778101892eb77249db32e = Service::IdnConverter()     ->convert($v67b3dba8bc6778101892eb77249db32e);return $this->getMirrorId($v67b3dba8bc6778101892eb77249db32e, false);}return false;}public function getMirror($vb80bb7740288fda1f201890375a60c8f) {return $this->isMirrorExists($vb80bb7740288fda1f201890375a60c8f) ? $this->mirrors[$vb80bb7740288fda1f201890375a60c8f] : false;}public function isMirrorExists($vb80bb7740288fda1f201890375a60c8f) {if (!is_string($vb80bb7740288fda1f201890375a60c8f) && !is_int($vb80bb7740288fda1f201890375a60c8f)) {return false;}return array_key_exists($vb80bb7740288fda1f201890375a60c8f, $this->mirrors);}public function getMirrorsList() {return $this->mirrors;}public function getUrl() {return $this->getProtocol() . '://' . $this->getHost();}public function getCurrentUrl() {return $this->getProtocol() . '://' . $this->getCurrentHostName();}public function getProtocol() {return $this->isUsingSsl() ? 'https' : 'http';}public static function filterHostName($v67b3dba8bc6778101892eb77249db32e) {return preg_replace("/([^\p{Ll}\p{Lu}\d\._:-]+)/u", '', $v67b3dba8bc6778101892eb77249db32e);}public function getCurrentHostName() {$v67b3dba8bc6778101892eb77249db32e = Service::Request()->host();if (startsWith($v67b3dba8bc6778101892eb77249db32e, 'xn--')) {$v67b3dba8bc6778101892eb77249db32e = Service::IdnConverter()     ->decode($v67b3dba8bc6778101892eb77249db32e);}if ($this->getHost() != $v67b3dba8bc6778101892eb77249db32e) {$v13c1f5c5e4829e276308259711c5bd33 = $this->getMirrorId($v67b3dba8bc6778101892eb77249db32e, false);if ($v13c1f5c5e4829e276308259711c5bd33 !== false) {return $this->getMirror($v13c1f5c5e4829e276308259711c5bd33)      ->getHost();}}return $this->getHost();}protected function save() {$v4717d53ebfdfea8477f780ec66151dcb = ConnectionPool::getInstance()->getConnection();$v67b3dba8bc6778101892eb77249db32e = $v4717d53ebfdfea8477f780ec66151dcb->escape($this->getHost());$vee5e3183223e8f5a2ba5c6f34dfb7640 = (int) $this->getIsDefault();$va8824de960fc60e621d3db2ac003cc0b = (int) $this->getDefaultLangId();$v66e6283a2d6b70fd594bdf4f315d6074 = (int) $this->isUsingSsl();$v817f7de13f58df29b13a9570082097da = (int) $this->getId();$vd02a42d9cb3dec9320e5f550278911c7 = $this->getFavicon();if ($vd02a42d9cb3dec9320e5f550278911c7 instanceof iUmiImageFile) {$v6a2a431fe8b621037ea949531c28551d = $v4717d53ebfdfea8477f780ec66151dcb->escape('.' . $vd02a42d9cb3dec9320e5f550278911c7->getFilePath(true));$v6a2a431fe8b621037ea949531c28551d = sprintf("'%s'", $v6a2a431fe8b621037ea949531c28551d);}else {$v6a2a431fe8b621037ea949531c28551d = 'NULL';}$vac5c74b64b4b8352ef2f181affb5ac2a = <<<SQL
UPDATE `cms3_domains`
	SET `host` = '$v67b3dba8bc6778101892eb77249db32e', `is_default` = $vee5e3183223e8f5a2ba5c6f34dfb7640, `default_lang_id` = $va8824de960fc60e621d3db2ac003cc0b, `use_ssl` = $v66e6283a2d6b70fd594bdf4f315d6074, `favicon` = $v6a2a431fe8b621037ea949531c28551d
		WHERE `id` = $v817f7de13f58df29b13a9570082097da
SQL;
SELECT `id`, `host`, `is_default`, `default_lang_id`, `use_ssl`, `favicon` FROM `cms3_domains` WHERE `id` = $v817f7de13f58df29b13a9570082097da LIMIT 0,1
SQL;