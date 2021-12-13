<?php
 namespace UmiCms\System\Hierarchy\Language;use UmiCms\System\Hierarchy\Domain\iDetector as DomainDetector;use UmiCms\System\Request\iFacade;class Detector implements iDetector {private $languageCollection;private $domainDetector;private $request;private $pageCollection;public function __construct(   \iLangsCollection $vffae938c1d7ffccb4fffb0259d052c2a,   DomainDetector $v45651ec82e45766b3d707ee33df1a61a,   iFacade $v10573b873d2fa5a365d558a45e328e47,   \iUmiHierarchy $vf8aea31a0fd948447674cb859137e6e7  ) {$this->languageCollection = $vffae938c1d7ffccb4fffb0259d052c2a;$this->domainDetector = $v45651ec82e45766b3d707ee33df1a61a;$this->request = $v10573b873d2fa5a365d558a45e328e47;$this->pageCollection = $vf8aea31a0fd948447674cb859137e6e7;}public function detect() {$v4d612b1d5c8df2e4e5fc52bffd474e57 = $this->getRequestLanguage();$v68ee4faf4e39ab67f566a28afa16b501 = $this->getDomainLanguage();$v7de1466c735364cf7169f74f0a35ba65 = $this->getDefaultLanguage();switch (true) {case ($v4d612b1d5c8df2e4e5fc52bffd474e57 instanceof \iLang) : {return $v4d612b1d5c8df2e4e5fc52bffd474e57;}case ($v68ee4faf4e39ab67f566a28afa16b501 instanceof \iLang) : {return $v68ee4faf4e39ab67f566a28afa16b501;}case ($v7de1466c735364cf7169f74f0a35ba65 instanceof \iLang) : {return $v7de1466c735364cf7169f74f0a35ba65;}default : {throw new \coreException('Cannot detect current language');}}}public function detectId() {return $this->detect()    ->getId();}public function detectPrefix() {return $this->detect()    ->getPrefix();}private function getRequestLanguage() {$v10573b873d2fa5a365d558a45e328e47 = $this->getRequest();$v0093d01f722d72f92a2f51227e27c6d9 = $v10573b873d2fa5a365d558a45e328e47->Get();$v1b987e6bb3a569cf9391396c32c5b2c3 = $v10573b873d2fa5a365d558a45e328e47->Post();$vf585b7f018bb4ced15a03683a733e50b = false;if ($v0093d01f722d72f92a2f51227e27c6d9->isExist('lang_id') || $v1b987e6bb3a569cf9391396c32c5b2c3->isExist('lang_id')) {$vf585b7f018bb4ced15a03683a733e50b = $v0093d01f722d72f92a2f51227e27c6d9->get('lang_id') ?: $v1b987e6bb3a569cf9391396c32c5b2c3->get('lang_id');$vf585b7f018bb4ced15a03683a733e50b = is_array($vf585b7f018bb4ced15a03683a733e50b) ? getFirstValue($vf585b7f018bb4ced15a03683a733e50b) : $vf585b7f018bb4ced15a03683a733e50b;}$vffae938c1d7ffccb4fffb0259d052c2a = $this->getLanguageCollection();if (!$vf585b7f018bb4ced15a03683a733e50b && ($v0093d01f722d72f92a2f51227e27c6d9->isExist('lang') || $v1b987e6bb3a569cf9391396c32c5b2c3->isExist('lang'))) {$v851f5ac9941d720844d143ed9cfcf60a = $v0093d01f722d72f92a2f51227e27c6d9->get('lang') ?: $v1b987e6bb3a569cf9391396c32c5b2c3->get('lang');$vf585b7f018bb4ced15a03683a733e50b = $vffae938c1d7ffccb4fffb0259d052c2a->getLangId($v851f5ac9941d720844d143ed9cfcf60a);}if (!$vf585b7f018bb4ced15a03683a733e50b && ($v0093d01f722d72f92a2f51227e27c6d9->isExist('rel') || $v1b987e6bb3a569cf9391396c32c5b2c3->isExist('rel'))) {$va6eb4816205178e88dad66a16a19ff45 = $v0093d01f722d72f92a2f51227e27c6d9->get('rel') ?: $v1b987e6bb3a569cf9391396c32c5b2c3->get('rel');$va6eb4816205178e88dad66a16a19ff45 = is_array($va6eb4816205178e88dad66a16a19ff45) ? getFirstValue($va6eb4816205178e88dad66a16a19ff45) : $va6eb4816205178e88dad66a16a19ff45;$v71860c77c6745379b0d44304d66b6a13 = $this->getPageCollection()->getElement($va6eb4816205178e88dad66a16a19ff45);$vf585b7f018bb4ced15a03683a733e50b = ($v71860c77c6745379b0d44304d66b6a13 instanceof \iUmiHierarchyElement) ? $v71860c77c6745379b0d44304d66b6a13->getLangId() : false;}if (!$vf585b7f018bb4ced15a03683a733e50b) {if ($v10573b873d2fa5a365d558a45e328e47->isStream()) {$v1bbcb648e0b1869444f3a2d344a5b3ac = $v10573b873d2fa5a365d558a45e328e47->getPathParts();$v851f5ac9941d720844d143ed9cfcf60a = $v1bbcb648e0b1869444f3a2d344a5b3ac[1];}else {$v851f5ac9941d720844d143ed9cfcf60a = $v10573b873d2fa5a365d558a45e328e47->getFirstPart();}$vf585b7f018bb4ced15a03683a733e50b = $vffae938c1d7ffccb4fffb0259d052c2a->getLangId($v851f5ac9941d720844d143ed9cfcf60a);}return $vffae938c1d7ffccb4fffb0259d052c2a->getLang($vf585b7f018bb4ced15a03683a733e50b);}private function getDomainLanguage() {$vb80bb7740288fda1f201890375a60c8f = $this->getDomainDetector()    ->detect()    ->getDefaultLangId();return $this->getLanguageCollection()    ->getLang($vb80bb7740288fda1f201890375a60c8f);}private function getDefaultLanguage() {return $this->getLanguageCollection()    ->getDefaultLang();}private function getLanguageCollection() {return $this->languageCollection;}private function getDomainDetector() {return $this->domainDetector;}private function getRequest() {return $this->request;}private function getPageCollection() {return $this->pageCollection;}}