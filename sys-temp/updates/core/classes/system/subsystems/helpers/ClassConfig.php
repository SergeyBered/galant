<?php
 class ClassConfig implements iClassConfig {private $config;public function __construct($va2f2ed4f8ebc2cbb4c21a29dc40ab61d, $v2245023265ae4cf87d02c8b6ba991139) {if (!$va2f2ed4f8ebc2cbb4c21a29dc40ab61d) {throw new Exception('Передано некорректное название класса');}if (!is_array($v2245023265ae4cf87d02c8b6ba991139)) {throw new Exception('Передана некорректная конфигурация класса');}$this->config = $v2245023265ae4cf87d02c8b6ba991139;}public function get() {if (func_num_args() === 0) {return null;}$v2063c1608d6e0baf80249c42e2be5804 = $this->config;foreach (func_get_args() as $vef3e30e070f70244fd6578d88a6b77ac) {$v2063c1608d6e0baf80249c42e2be5804 = $this->getSubConfig($v2063c1608d6e0baf80249c42e2be5804, $vef3e30e070f70244fd6578d88a6b77ac);if ($v2063c1608d6e0baf80249c42e2be5804 === null) {return $v2063c1608d6e0baf80249c42e2be5804;}}return $v2063c1608d6e0baf80249c42e2be5804;}protected function getSubConfig($v2245023265ae4cf87d02c8b6ba991139, $v73d5342eba070f636ac3246f319bf77f) {if (is_array($v2245023265ae4cf87d02c8b6ba991139) && isset($v2245023265ae4cf87d02c8b6ba991139[$v73d5342eba070f636ac3246f319bf77f])) {return $v2245023265ae4cf87d02c8b6ba991139[$v73d5342eba070f636ac3246f319bf77f];}return null;}}