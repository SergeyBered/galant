<?php
 namespace UmiCms\Classes\System\Utils\QuickExchange\Source;class Detector implements iDetector {private $cmsController;public function __construct(\iCmsController $v8b1dc169bf460ee884fceef66c6607d6) {$this->cmsController = $v8b1dc169bf460ee884fceef66c6607d6;}public function detectForImport() {return sprintf('%s.csv', $this->detectForExport());}public function detectForExport() {$v8b1dc169bf460ee884fceef66c6607d6 = $this->getCmsController();return sprintf('sync-%s-%s', $v8b1dc169bf460ee884fceef66c6607d6->getCurrentModule(), $v8b1dc169bf460ee884fceef66c6607d6->getCurrentMethod());}private function getCmsController() {return $this->cmsController;}}