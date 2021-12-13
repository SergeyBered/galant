<?php
 use UmiCms\Service;class mainConfiguration implements iConfiguration {private static $instance;private $ini = [];private $edited = false;private $readOnlyConfig = false;public static function getInstance($v6f66e878c62db60568a3487869695820 = null) {if (self::$instance === null) {self::$instance = new self();}return self::$instance;}private function __construct() {$this->loadConfig(CONFIG_INI_PATH);}private function __clone() {}public function save() {if ($this->isChanged()) {$this->writeIni();}}private function isChanged() {return $this->edited;}private function markAsChanged() {$this->edited = true;}private function getConfigTemporaryPath() {return CONFIG_INI_PATH . '.temp';}private function writeIni() {if ($this->isReadOnlyConfig()) {return false;}$v656840677a2dbd5ab56a2202e415b293 = $this->getConfigTemporaryPath();$ve606bc0ea93891f61f3643761502fe66 = fopen($v656840677a2dbd5ab56a2202e415b293, 'a+');if ($ve606bc0ea93891f61f3643761502fe66 === false) {trigger_error('Cannot open temp config file!', E_USER_WARNING);return false;}$v96ab4e163f4ee03aaa4d1051aa51d204 = fopen(CONFIG_INI_PATH, 'a+');if ($v96ab4e163f4ee03aaa4d1051aa51d204 === false) {fclose($ve606bc0ea93891f61f3643761502fe66);trigger_error('Cannot open config file!', E_USER_WARNING);return false;}if (!flock($v96ab4e163f4ee03aaa4d1051aa51d204, LOCK_EX)) {fclose($v96ab4e163f4ee03aaa4d1051aa51d204);fclose($ve606bc0ea93891f61f3643761502fe66);trigger_error("Cannot lock config file!", E_USER_WARNING);return false;}ftruncate($ve606bc0ea93891f61f3643761502fe66, 0);$v30b99f8ced2f4077e72ee73534b8417f = $this->packConfigContent();$vd352d1481e000611ebca3b29ec07b357 = fwrite($ve606bc0ea93891f61f3643761502fe66, $v30b99f8ced2f4077e72ee73534b8417f);$v2ec24890f7b3f145193c9b0ff33fa163 = strlen($v30b99f8ced2f4077e72ee73534b8417f);$v483eea5f0f4624adf9db67a4e7a534f4 = 0;if ($vd352d1481e000611ebca3b29ec07b357 === $v2ec24890f7b3f145193c9b0ff33fa163) {ftruncate($ve606bc0ea93891f61f3643761502fe66, 0);fclose($ve606bc0ea93891f61f3643761502fe66);ftruncate($v96ab4e163f4ee03aaa4d1051aa51d204, 0);$v483eea5f0f4624adf9db67a4e7a534f4 = fwrite($v96ab4e163f4ee03aaa4d1051aa51d204, $v30b99f8ced2f4077e72ee73534b8417f);fflush($v96ab4e163f4ee03aaa4d1051aa51d204);}else {fclose($ve606bc0ea93891f61f3643761502fe66);trigger_error('Cannot write temp config file!', E_USER_WARNING);}if (!flock($v96ab4e163f4ee03aaa4d1051aa51d204, LOCK_UN)) {fclose($v96ab4e163f4ee03aaa4d1051aa51d204);trigger_error('Cannot unlock config file!', E_USER_WARNING);return false;}fclose($v96ab4e163f4ee03aaa4d1051aa51d204);clearstatcache();chmod(CONFIG_INI_PATH, 0666);if (!unlink($v656840677a2dbd5ab56a2202e415b293)) {trigger_error('Cannot delete temp config file!', E_USER_WARNING);return false;}if ($v483eea5f0f4624adf9db67a4e7a534f4 !== $v2ec24890f7b3f145193c9b0ff33fa163) {trigger_error('Cannot write config file!', E_USER_WARNING);return false;}return true;}private function packConfigContent() {$vf45acc4a1a9cdb4fdf92ffb1ce8b7b2b = '';foreach ($this->ini as $v73d5342eba070f636ac3246f319bf77f => $v87cd8b8808600624d8c590cfc2e6e94b) {if (empty($v87cd8b8808600624d8c590cfc2e6e94b)) {continue;}$vf45acc4a1a9cdb4fdf92ffb1ce8b7b2b .= "[{$v73d5342eba070f636ac3246f319bf77f}]" . PHP_EOL;foreach ($v87cd8b8808600624d8c590cfc2e6e94b as $vb068931cc450442b63f5b3d276ea4297 => $v2063c1608d6e0baf80249c42e2be5804) {if (is_array($v2063c1608d6e0baf80249c42e2be5804)) {foreach ($v2063c1608d6e0baf80249c42e2be5804 as $vf35f97ea7b20a3701c7cb122497e89a9) {$vf35f97ea7b20a3701c7cb122497e89a9 = ($vf35f97ea7b20a3701c7cb122497e89a9 !== '') ? '"' . $vf35f97ea7b20a3701c7cb122497e89a9 . '"' : '';$vf45acc4a1a9cdb4fdf92ffb1ce8b7b2b .= "{$vb068931cc450442b63f5b3d276ea4297}[] = {$vf35f97ea7b20a3701c7cb122497e89a9}" . PHP_EOL;}}else {$v2063c1608d6e0baf80249c42e2be5804 = ($v2063c1608d6e0baf80249c42e2be5804 !== '') ? '"' . $v2063c1608d6e0baf80249c42e2be5804 . '"' : '';$vf45acc4a1a9cdb4fdf92ffb1ce8b7b2b .= "{$vb068931cc450442b63f5b3d276ea4297} = {$v2063c1608d6e0baf80249c42e2be5804}" . PHP_EOL;}}$vf45acc4a1a9cdb4fdf92ffb1ce8b7b2b .= PHP_EOL;}return $vf45acc4a1a9cdb4fdf92ffb1ce8b7b2b;}public function getParsedIni() {return $this->ini;}public function get($v73d5342eba070f636ac3246f319bf77f, $ve04aa5104d082e4a51d241391941ba26, $vc21f969b5f03d33d43e04f8f136e7682 = null, bool $vbe3da9b7096065f9c3d4dbbdb8f7216b = false) {if (isset($this->ini[$v73d5342eba070f636ac3246f319bf77f]) && isset($this->ini[$v73d5342eba070f636ac3246f319bf77f][$ve04aa5104d082e4a51d241391941ba26])) {$v2063c1608d6e0baf80249c42e2be5804 = $this->ini[$v73d5342eba070f636ac3246f319bf77f][$ve04aa5104d082e4a51d241391941ba26];if ($vbe3da9b7096065f9c3d4dbbdb8f7216b === false) {$v2063c1608d6e0baf80249c42e2be5804 = $this->removeSingeQuotes($v2063c1608d6e0baf80249c42e2be5804);}if ($v73d5342eba070f636ac3246f319bf77f == 'session' && $ve04aa5104d082e4a51d241391941ba26 == 'active-lifetime' && $v2063c1608d6e0baf80249c42e2be5804 < 1) {$v2063c1608d6e0baf80249c42e2be5804 = 1440;}return $v2063c1608d6e0baf80249c42e2be5804;}return $vc21f969b5f03d33d43e04f8f136e7682;}public function set($v73d5342eba070f636ac3246f319bf77f, $ve04aa5104d082e4a51d241391941ba26, $v2063c1608d6e0baf80249c42e2be5804) {if (!isset($this->ini[$v73d5342eba070f636ac3246f319bf77f])) {$this->ini[$v73d5342eba070f636ac3246f319bf77f] = [];}$v4339767add16b387a06839d3f7fc6441 = $v2063c1608d6e0baf80249c42e2be5804 != $this->get($v73d5342eba070f636ac3246f319bf77f, $ve04aa5104d082e4a51d241391941ba26);if ($v2063c1608d6e0baf80249c42e2be5804 === null && isset($this->ini[$v73d5342eba070f636ac3246f319bf77f][$ve04aa5104d082e4a51d241391941ba26])) {unset($this->ini[$v73d5342eba070f636ac3246f319bf77f][$ve04aa5104d082e4a51d241391941ba26]);}else {if ($v73d5342eba070f636ac3246f319bf77f == 'session' && $ve04aa5104d082e4a51d241391941ba26 == 'active-lifetime' && $v2063c1608d6e0baf80249c42e2be5804 < 1) {$v2063c1608d6e0baf80249c42e2be5804 = 1440;}$this->ini[$v73d5342eba070f636ac3246f319bf77f][$ve04aa5104d082e4a51d241391941ba26] = $v2063c1608d6e0baf80249c42e2be5804;}if ($v4339767add16b387a06839d3f7fc6441) {$this->markAsChanged();}}public function getList($v73d5342eba070f636ac3246f319bf77f) {if (isset($this->ini[$v73d5342eba070f636ac3246f319bf77f]) && is_array($this->ini[$v73d5342eba070f636ac3246f319bf77f])) {return array_keys($this->ini[$v73d5342eba070f636ac3246f319bf77f]);}return null;}public function includeParam($v3c6e0b8a9c15224a8228b9a98ca1531d, array $v21ffce5b8a6cc8cc6a41448dd69623c9 = null) {static $v50e5261d8bca7ae22f750db5a5e38482 = [];$vd6fe1d0be6347b8ef2427fa629c04485 = $this->get('includes', $v3c6e0b8a9c15224a8228b9a98ca1531d);if (mb_strpos($vd6fe1d0be6347b8ef2427fa629c04485, '{') !== false) {if (class_exists('\UmiCms\Service') && !count($v50e5261d8bca7ae22f750db5a5e38482)) {$v50e5261d8bca7ae22f750db5a5e38482['lang'] = Service::LanguageDetector()->detectPrefix();$v50e5261d8bca7ae22f750db5a5e38482['domain'] = Service::DomainDetector()->detectHost();}$v21ffce5b8a6cc8cc6a41448dd69623c9 = ($v21ffce5b8a6cc8cc6a41448dd69623c9 === null) ? $v50e5261d8bca7ae22f750db5a5e38482 : array_merge($v21ffce5b8a6cc8cc6a41448dd69623c9, $v50e5261d8bca7ae22f750db5a5e38482);foreach ($v21ffce5b8a6cc8cc6a41448dd69623c9 as $v865c0c0b4ab0e063e5caa3387c1a8741 => $v9e3669d19b675bd57058fd4664205d2a) {$vd6fe1d0be6347b8ef2427fa629c04485 = str_replace('{' . $v865c0c0b4ab0e063e5caa3387c1a8741 . '}', $v9e3669d19b675bd57058fd4664205d2a, $vd6fe1d0be6347b8ef2427fa629c04485);}}if (mb_substr($vd6fe1d0be6347b8ef2427fa629c04485, 0, 2) == '~/') {$vd6fe1d0be6347b8ef2427fa629c04485 = CURRENT_WORKING_DIR . mb_substr($vd6fe1d0be6347b8ef2427fa629c04485, 1);}return $vd6fe1d0be6347b8ef2427fa629c04485;}public function setReadOnlyConfig($v327a6c4304ad5938eaf0efb6cc3e53dc = true) {$this->readOnlyConfig = (bool) $v327a6c4304ad5938eaf0efb6cc3e53dc;return $this;}public function loadConfig($v032b3f8b77a334416437bb804895de35) {if (!is_readable($v032b3f8b77a334416437bb804895de35)) {throw new Exception("Can't find configuration file: $v032b3f8b77a334416437bb804895de35");}$v2245023265ae4cf87d02c8b6ba991139 = parse_ini_file($v032b3f8b77a334416437bb804895de35, true);if (empty($this->ini)) {$this->ini = $v2245023265ae4cf87d02c8b6ba991139;}else {$this->ini = $this->mergeCustomConfig($this->ini, $v2245023265ae4cf87d02c8b6ba991139);$this->markAsChanged();}if (isset($this->ini['session']) && isset($this->ini['session']['active-lifetime']) &&    $this->ini['session']['active-lifetime'] < 1) {$this->ini['session']['active-lifetime'] = 1440;}return $this->replaceConfigToFastCgiParams()    ->defineStateDirPathConstants();}private function mergeCustomConfig(array $v4ac0703155905ae50c2dc69772b0db9b, array $v6b20ad3a6cdc9a3f70738e511acac346) {foreach ($v6b20ad3a6cdc9a3f70738e511acac346 as $v73d5342eba070f636ac3246f319bf77f => $v3fc4ccbf592add60bab4a416a13b81e7) {if (!isset($v4ac0703155905ae50c2dc69772b0db9b[$v73d5342eba070f636ac3246f319bf77f])) {$v4ac0703155905ae50c2dc69772b0db9b[$v73d5342eba070f636ac3246f319bf77f] = $v3fc4ccbf592add60bab4a416a13b81e7;continue;}$v4ac0703155905ae50c2dc69772b0db9b[$v73d5342eba070f636ac3246f319bf77f] = array_merge($v4ac0703155905ae50c2dc69772b0db9b[$v73d5342eba070f636ac3246f319bf77f], $v3fc4ccbf592add60bab4a416a13b81e7);}return $v4ac0703155905ae50c2dc69772b0db9b;}private function removeSingeQuotes($v2063c1608d6e0baf80249c42e2be5804) {if (is_string($v2063c1608d6e0baf80249c42e2be5804)) {return trim($v2063c1608d6e0baf80249c42e2be5804, "'");}if (is_array($v2063c1608d6e0baf80249c42e2be5804)) {return array_map([$this, 'removeSingeQuotes'], $v2063c1608d6e0baf80249c42e2be5804);}return $v2063c1608d6e0baf80249c42e2be5804;}private function replaceConfigToFastCgiParams() {foreach ($_SERVER as $v3c6e0b8a9c15224a8228b9a98ca1531d => $v3a6d0284e743dc4a9b86f97d6dd1a3bf) {if (mb_strpos($v3c6e0b8a9c15224a8228b9a98ca1531d, 'cp_') !== false) {$v3c6e0b8a9c15224a8228b9a98ca1531d = str_replace('cp_', '', $v3c6e0b8a9c15224a8228b9a98ca1531d);$v3c6e0b8a9c15224a8228b9a98ca1531d = str_replace('_', '.', $v3c6e0b8a9c15224a8228b9a98ca1531d);$v3c6e0b8a9c15224a8228b9a98ca1531d = explode('.', $v3c6e0b8a9c15224a8228b9a98ca1531d, 2);$this->ini[$v3c6e0b8a9c15224a8228b9a98ca1531d[0]][$v3c6e0b8a9c15224a8228b9a98ca1531d[1]] = $v3a6d0284e743dc4a9b86f97d6dd1a3bf;}}return $this;}private function defineStateDirPathConstants() {$v87cd8b8808600624d8c590cfc2e6e94b = [    'user-files-path' => '/files',    'user-images-path' => '/images',    'errors-logs-path' => '/sys-temp/logs/errors',    'sys-temp-path' => '/sys-temp'   ];foreach ($v87cd8b8808600624d8c590cfc2e6e94b as $v3c6e0b8a9c15224a8228b9a98ca1531d => $v2063c1608d6e0baf80249c42e2be5804) {$vd6fe1d0be6347b8ef2427fa629c04485 = CURRENT_WORKING_DIR . $v2063c1608d6e0baf80249c42e2be5804;if (isset($this->ini['includes'][$v3c6e0b8a9c15224a8228b9a98ca1531d]) && $this->ini['includes'][$v3c6e0b8a9c15224a8228b9a98ca1531d] !== '') {$vd6fe1d0be6347b8ef2427fa629c04485 = $this->ini['includes'][$v3c6e0b8a9c15224a8228b9a98ca1531d];}if (mb_strpos($vd6fe1d0be6347b8ef2427fa629c04485, '~') !== false) {$vd6fe1d0be6347b8ef2427fa629c04485 = CURRENT_WORKING_DIR . mb_substr($vd6fe1d0be6347b8ef2427fa629c04485, 1);}$v7183a32922e8142b0724bec630565582 = mb_strtoupper(str_replace('-', '_', $v3c6e0b8a9c15224a8228b9a98ca1531d));if (!defined($v7183a32922e8142b0724bec630565582)) {define($v7183a32922e8142b0724bec630565582, $vd6fe1d0be6347b8ef2427fa629c04485);}}return $this;}private function isReadOnlyConfig() {return $this->readOnlyConfig;}public function __destruct() {}}