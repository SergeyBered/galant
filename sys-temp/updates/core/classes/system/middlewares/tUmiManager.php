<?php
 namespace UmiCms\Classes\System\MiddleWares;use UmiCms\Classes\System\MobileApp\UmiManager\iChecker;use UmiCms\Classes\System\Controllers\AbstractController;trait tUmiManager {protected $v9bcf0edc75944b260de8279d7a6d8174;public function setChecker(iChecker $v9bcf0edc75944b260de8279d7a6d8174) {$this->checker = $v9bcf0edc75944b260de8279d7a6d8174;return $this;}public function validateUmiManagerRequest() {if ($this->getRequest()->isUmiManager()) {$this->checker->checkRequiredModules();}}}