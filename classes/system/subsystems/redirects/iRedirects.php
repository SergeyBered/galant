<?php
 use UmiCms\System\Hierarchy\Domain\iDetector;interface iRedirects {public static function getInstance();public function add($v36cd38f49b9afa08222c0dc9ebfe35eb, $v42aefbae01d2dfd981f7da7d823d689e, $v9acb44549b41563697bb490144ec6258 = 301, $v6a1ceb246b9ea27f5ab29fbd0a01ca06 = false);public function getRedirectsIdBySource($v36cd38f49b9afa08222c0dc9ebfe35eb, $v6a1ceb246b9ea27f5ab29fbd0a01ca06 = false);public function getRedirectIdByTarget($v42aefbae01d2dfd981f7da7d823d689e, $v6a1ceb246b9ea27f5ab29fbd0a01ca06 = false);public function del($vb80bb7740288fda1f201890375a60c8f);public function redirectIfRequired($vf0183130c6c478a364b95e4325786eb9, $v6a1ceb246b9ea27f5ab29fbd0a01ca06 = false);public function deleteAll();public function init();public function setDomainDetector(iDetector $v21aed3df2077b5d91ce46bf123446731);public function setDomainCollection(\iDomainsCollection $v0d771fa031fb27561ed207afa6cf9983);public function setLanguageCollection(\iLangsCollection $vffae938c1d7ffccb4fffb0259d052c2a);}