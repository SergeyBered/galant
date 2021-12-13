<?php
use UmiCms\Service;class umiFile implements iUmiFile {const ATTRIBUTE_LIST = ['title', 'ord'];protected $filepath,   $size, $ext, $name, $dirname, $modify_time,   $is_broken = false;public static $mask = 0777;protected static $class_name = 'umiFile';protected static $forbiddenFileTypes = [   'php',   'php3',   'php4',   'php5',   'phtml'  ];protected static $allowedFileTypes = [   'txt',   'doc',   'docx',   'tif',   'tiff',   'xls',   'xlsx',   'ppt',   'pptx',   'pps',   'ppsx',   'pcx',   'odt',   'odf',   'vsd',   'vsdx',   'sxw',   'ods',   'odg',   'pdf',   'csv',   'html',   'js',   'tpl',   'xsl',   'xml',   'css',   'zip',   'rar',   '7z',   'tar',   'gz',   'tar.gz',   'exe',   'msi',   'rtf',   'chm',   'ico',   'file',   'psd',   'flv',   'mp4',   'swf',   'mp3',   'wav',   'wma',   'ogg',   'aac',   'gpx',   'avi',   'mkv',   'wmv',   'mov'  ];protected static $allowedImageTypes = ['jpg', 'jpeg', 'gif', 'bmp', 'png', 'svg', 'ico', 'webp'];protected static $allowedUserFileTypes;protected static $addWaterMark = false;protected $order;protected $id;protected $title;private $ignoreSecurity = false;private $isReadable = false;private $isWritable = false;public function __construct($v47826cacc65c665212b821e6ff80b9b0) {$this->setFilePath($v47826cacc65c665212b821e6ff80b9b0);}public function delete() {if (is_writable($this->filepath)) {return unlink($this->filepath);}return false;}public function download($v789726e10bf01b1777c5d2ae06bede3e = false) {$va72d36fa9eea31552f2d69d8fa79727c = $this->getDownloadMode();switch ($va72d36fa9eea31552f2d69d8fa79727c) {case 'nginx': {$this->downloadByNginx($v789726e10bf01b1777c5d2ae06bede3e);break;}default: {$this->downloadByApache($v789726e10bf01b1777c5d2ae06bede3e);}}}public function getDownloadMode() {$v3f48301f2668ec4eec370518ddcffe63 = mainConfiguration::getInstance();$va72d36fa9eea31552f2d69d8fa79727c = (string) $v3f48301f2668ec4eec370518ddcffe63->get('kernel', 'umi-file-download-mode');switch ($va72d36fa9eea31552f2d69d8fa79727c) {case 'nginx': {return $va72d36fa9eea31552f2d69d8fa79727c;}default: {return 'apache';}}}public function copy($v42aefbae01d2dfd981f7da7d823d689e) {$v260ca9dd8a4577fc00b7bd5810298076 = copy($this->getFilePath(), $v42aefbae01d2dfd981f7da7d823d689e);if ($v260ca9dd8a4577fc00b7bd5810298076) {$this->setFilePath($v42aefbae01d2dfd981f7da7d823d689e);}return $this;}public function isExists() {return !$this->getIsBroken();}public function isReadable() {return $this->isReadable;}public function isWritable() {return $this->isWritable;}public function setFilePath($vd6fe1d0be6347b8ef2427fa629c04485) {$vd6fe1d0be6347b8ef2427fa629c04485 = $this->prepareFilePath($vd6fe1d0be6347b8ef2427fa629c04485);$vd6fe1d0be6347b8ef2427fa629c04485 = str_replace("\\", '/', $vd6fe1d0be6347b8ef2427fa629c04485);if ($vd6fe1d0be6347b8ef2427fa629c04485 !== $this->filepath) {$this->filepath = $vd6fe1d0be6347b8ef2427fa629c04485;$this->loadInfo();}return $this;}public function getTitle() {return $this->title;}public function setTitle($vd5d3db1765287eef77d7927cc956f50a) {$this->title = (string) $vd5d3db1765287eef77d7927cc956f50a;return $this;}private function prepareFilePath($v47826cacc65c665212b821e6ff80b9b0) {$v47826cacc65c665212b821e6ff80b9b0 = str_replace('//', '/', $v47826cacc65c665212b821e6ff80b9b0);$v47826cacc65c665212b821e6ff80b9b0 = str_replace("\\\\", "\\", $v47826cacc65c665212b821e6ff80b9b0);if (mb_substr($v47826cacc65c665212b821e6ff80b9b0, 0, 2) == './') {$v109633366fd0d46d371ede589998abaa = str_replace('/\\/', '/', getcwd());if ($v109633366fd0d46d371ede589998abaa != CURRENT_WORKING_DIR) {$vc47e0ad23824d553c9ce6a11a030b8ec = $v47826cacc65c665212b821e6ff80b9b0;$vb90024c4c5f91e126514ccbbee2a4263 = preg_replace("/^\.\//", CURRENT_WORKING_DIR . '/', $v47826cacc65c665212b821e6ff80b9b0);if (file_exists($vc47e0ad23824d553c9ce6a11a030b8ec)) {if (!defined('UMICMS_CLI_MODE')) {trigger_error(        "Files started with './' should be placed relative to CURRENT_WORKING_DIR '" .        CURRENT_WORKING_DIR . "'. " . "File '$vc47e0ad23824d553c9ce6a11a030b8ec' loaded from '" . $v109633366fd0d46d371ede589998abaa . "' ",        E_USER_DEPRECATED       );}$v47826cacc65c665212b821e6ff80b9b0 = $vc47e0ad23824d553c9ce6a11a030b8ec;}else {$v47826cacc65c665212b821e6ff80b9b0 = $vb90024c4c5f91e126514ccbbee2a4263;}}}return $v47826cacc65c665212b821e6ff80b9b0;}public static function isAllowedFileType($v566bbee0f961ad71b54c3c2fd36db053) {$v566bbee0f961ad71b54c3c2fd36db053 = mb_strtolower($v566bbee0f961ad71b54c3c2fd36db053);if (in_array($v566bbee0f961ad71b54c3c2fd36db053, self::$forbiddenFileTypes)) {return false;}if (in_array($v566bbee0f961ad71b54c3c2fd36db053, self::$allowedFileTypes) || in_array($v566bbee0f961ad71b54c3c2fd36db053, self::$allowedImageTypes)) {return true;}if (self::$allowedUserFileTypes === null) {$vfa53b91ccc1b78668d5af58e1ed3a485 = Service::Auth();$v8e44f0089b076e18a718eb9ca3d94674 = $vfa53b91ccc1b78668d5af58e1ed3a485->getUserId();$v23e91e891070db669547556402a176b5 = umiObjectsCollection::getInstance()     ->getObject($v8e44f0089b076e18a718eb9ca3d94674)     ->getValue('appended_file_extensions');self::$allowedUserFileTypes = [];foreach (explode(',', $v23e91e891070db669547556402a176b5) as $va175f0d82e080972dd2c0cf2c56450b3) {$va175f0d82e080972dd2c0cf2c56450b3 = mb_strtolower(trim($va175f0d82e080972dd2c0cf2c56450b3));if ($va175f0d82e080972dd2c0cf2c56450b3 !== '') {self::$allowedUserFileTypes[] = $va175f0d82e080972dd2c0cf2c56450b3;}}}if (in_array($v566bbee0f961ad71b54c3c2fd36db053, self::$allowedUserFileTypes)) {return true;}return false;}public static function getSupportedFileTypes() {return self::$allowedFileTypes;}public static function getFileExtension($vc75d48372800068d11ac9b972f28a022) {$ve161483dba4eb093757d4b06499efc75 = explode('.', $vc75d48372800068d11ac9b972f28a022);$v566bbee0f961ad71b54c3c2fd36db053 = (string) array_pop($ve161483dba4eb093757d4b06499efc75);return mb_convert_case($v566bbee0f961ad71b54c3c2fd36db053, MB_CASE_LOWER);}public static function manualUpload($vb068931cc450442b63f5b3d276ea4297, $ve440be6a92dba11caa790215081671ae, $vf7bd60b75b29d79b660a2859395c1a24, $vb2ed5fc91c9760886b14c955ac6c82d7) {if (!$vf7bd60b75b29d79b660a2859395c1a24 || !$vb068931cc450442b63f5b3d276ea4297 || !self::isLegalUploadedFileName($vb068931cc450442b63f5b3d276ea4297) || !is_uploaded_file($ve440be6a92dba11caa790215081671ae)) {return 1;}$v566bbee0f961ad71b54c3c2fd36db053 = self::getFileExtension($vb068931cc450442b63f5b3d276ea4297);if (!self::isAllowedFileType($v566bbee0f961ad71b54c3c2fd36db053)) {return 2;}$vb068931cc450442b63f5b3d276ea4297 = mb_substr($vb068931cc450442b63f5b3d276ea4297, 0, mb_strlen($vb068931cc450442b63f5b3d276ea4297) - mb_strlen($v566bbee0f961ad71b54c3c2fd36db053) - 1);if (self::isTransliterateUploadedFiles()) {$vb068931cc450442b63f5b3d276ea4297 = translit::convert($vb068931cc450442b63f5b3d276ea4297);}$vb068931cc450442b63f5b3d276ea4297 .= '.' . $v566bbee0f961ad71b54c3c2fd36db053;$v9024b204fb4c4ffdd07ee631ed791f75 = $vb2ed5fc91c9760886b14c955ac6c82d7 . '/' . $vb068931cc450442b63f5b3d276ea4297;if (!self::isLegalUploadedFileName($vb068931cc450442b63f5b3d276ea4297)) {return 3;}if (is_uploaded_file($ve440be6a92dba11caa790215081671ae)) {$v9024b204fb4c4ffdd07ee631ed791f75 = umiFile::getUnconflictPath($v9024b204fb4c4ffdd07ee631ed791f75);if (move_uploaded_file($ve440be6a92dba11caa790215081671ae, $v9024b204fb4c4ffdd07ee631ed791f75)) {chmod($v9024b204fb4c4ffdd07ee631ed791f75, self::$mask);$v9024b204fb4c4ffdd07ee631ed791f75 = self::getRelPath($v9024b204fb4c4ffdd07ee631ed791f75);return new self::$class_name($v9024b204fb4c4ffdd07ee631ed791f75);}return 5;}return 6;}private static function isLegalUploadedFileName($vb068931cc450442b63f5b3d276ea4297) {return $vb068931cc450442b63f5b3d276ea4297 !== '.htaccess';}public static function upload($va2b861d0e7719d9108522aacfd4181bc, $v51746fc9cfaaf892e94c2d56d7508b37, $v207e5b7e7d2b07f6b19066e8d62f4b1d, $vb80bb7740288fda1f201890375a60c8f = false) {$v5f8f22b8cdbaeee8cf857673a9b6ba20 = new umiDirectory(realpath($v207e5b7e7d2b07f6b19066e8d62f4b1d));if ($v5f8f22b8cdbaeee8cf857673a9b6ba20->getIsBroken() || !$v5f8f22b8cdbaeee8cf857673a9b6ba20->isWritable()) {return false;}if ($va2b861d0e7719d9108522aacfd4181bc === false && $v51746fc9cfaaf892e94c2d56d7508b37 === false) {return self::uploadByRawPostBody($v5f8f22b8cdbaeee8cf857673a9b6ba20->getPath());}return self::uploadByHtmlForm($va2b861d0e7719d9108522aacfd4181bc, $v51746fc9cfaaf892e94c2d56d7508b37, $v5f8f22b8cdbaeee8cf857673a9b6ba20->getPath(), $vb80bb7740288fda1f201890375a60c8f);}public static function requireFile($vd6fe1d0be6347b8ef2427fa629c04485) {$v8c7dd922ad47494fc02c388e12c00eac = new umiFile($vd6fe1d0be6347b8ef2427fa629c04485);if ($v8c7dd922ad47494fc02c388e12c00eac->isExists()) {return true;}$v5f8f22b8cdbaeee8cf857673a9b6ba20 = new umiDirectory(dirname($vd6fe1d0be6347b8ef2427fa629c04485));if ($v5f8f22b8cdbaeee8cf857673a9b6ba20->getIsBroken()) {umiDirectory::requireFolder($v5f8f22b8cdbaeee8cf857673a9b6ba20->getPath());}touch($vd6fe1d0be6347b8ef2427fa629c04485);chmod($vd6fe1d0be6347b8ef2427fa629c04485, 0777);return $v8c7dd922ad47494fc02c388e12c00eac->refresh()    ->isExists();}private static function uploadByRawPostBody($vb2ed5fc91c9760886b14c955ac6c82d7) {$vb068931cc450442b63f5b3d276ea4297 = $_REQUEST['filename'];$v9a0364b9e99bb480dd25e1f0284c8555 = Service::Request()->getRawBody();$v566bbee0f961ad71b54c3c2fd36db053 = self::getFileExtension($vb068931cc450442b63f5b3d276ea4297);if (!self::isAllowedFileType($v566bbee0f961ad71b54c3c2fd36db053)) {return false;}$vb068931cc450442b63f5b3d276ea4297 = mb_substr($vb068931cc450442b63f5b3d276ea4297, 0, mb_strlen($vb068931cc450442b63f5b3d276ea4297) - mb_strlen($v566bbee0f961ad71b54c3c2fd36db053) - 1);if (self::isTransliterateUploadedFiles()) {$vb068931cc450442b63f5b3d276ea4297 = translit::convert($vb068931cc450442b63f5b3d276ea4297);}$vb068931cc450442b63f5b3d276ea4297 .= '.' . $v566bbee0f961ad71b54c3c2fd36db053;if (!self::isLegalUploadedFileName($vb068931cc450442b63f5b3d276ea4297)) {return false;}$v9024b204fb4c4ffdd07ee631ed791f75 = $vb2ed5fc91c9760886b14c955ac6c82d7 . '/' . $vb068931cc450442b63f5b3d276ea4297;if (file_put_contents($v9024b204fb4c4ffdd07ee631ed791f75, $v9a0364b9e99bb480dd25e1f0284c8555) == 0) {return false;}chmod($v9024b204fb4c4ffdd07ee631ed791f75, self::$mask);$v9024b204fb4c4ffdd07ee631ed791f75 = self::getRelPath($v9024b204fb4c4ffdd07ee631ed791f75);return new self::$class_name($v9024b204fb4c4ffdd07ee631ed791f75);}private static function uploadByHtmlForm($veeeb23fbd23e52a6a6ff78b9f18cbc4e, $v86536e21993c5a96a4d4c9c9afcc9b17, $vb2ed5fc91c9760886b14c955ac6c82d7, $vb80bb7740288fda1f201890375a60c8f) {$v45b963397aa40d4a0063e0d85e4fe7a1 = Service::Request()    ->Files();$ve067156fc3a90cfa942be4efa6f5bc7e = $v45b963397aa40d4a0063e0d85e4fe7a1->getArrayCopy();if (!is_array($ve067156fc3a90cfa942be4efa6f5bc7e)) {return false;}if (!isset($ve067156fc3a90cfa942be4efa6f5bc7e[$veeeb23fbd23e52a6a6ff78b9f18cbc4e]) && isset($ve067156fc3a90cfa942be4efa6f5bc7e['pics'])) {$ve067156fc3a90cfa942be4efa6f5bc7e[$veeeb23fbd23e52a6a6ff78b9f18cbc4e] = $ve067156fc3a90cfa942be4efa6f5bc7e['pics'];$veeeb23fbd23e52a6a6ff78b9f18cbc4e = 'pics';}if (!array_key_exists($veeeb23fbd23e52a6a6ff78b9f18cbc4e, $ve067156fc3a90cfa942be4efa6f5bc7e)) {return false;}$v080505fba0c91df9d7cff41d972acaf1 = $ve067156fc3a90cfa942be4efa6f5bc7e[$veeeb23fbd23e52a6a6ff78b9f18cbc4e];if (isset($v080505fba0c91df9d7cff41d972acaf1['size'][$v86536e21993c5a96a4d4c9c9afcc9b17])) {$vb80bb7740288fda1f201890375a60c8f = false;}if ($vb80bb7740288fda1f201890375a60c8f === false) {$vf7bd60b75b29d79b660a2859395c1a24 = (isset($v080505fba0c91df9d7cff41d972acaf1['size'][$v86536e21993c5a96a4d4c9c9afcc9b17]) ? $v080505fba0c91df9d7cff41d972acaf1['size'][$v86536e21993c5a96a4d4c9c9afcc9b17] : 0);}else {$vf7bd60b75b29d79b660a2859395c1a24 = (isset($v080505fba0c91df9d7cff41d972acaf1['size'][$vb80bb7740288fda1f201890375a60c8f][$v86536e21993c5a96a4d4c9c9afcc9b17]) ? $v080505fba0c91df9d7cff41d972acaf1['size'][$vb80bb7740288fda1f201890375a60c8f][$v86536e21993c5a96a4d4c9c9afcc9b17] : 0);}if ($vf7bd60b75b29d79b660a2859395c1a24 == 0) {return false;}$vb068931cc450442b63f5b3d276ea4297 = ($vb80bb7740288fda1f201890375a60c8f === false) ? $v080505fba0c91df9d7cff41d972acaf1['name'][$v86536e21993c5a96a4d4c9c9afcc9b17] : $v080505fba0c91df9d7cff41d972acaf1['name'][$vb80bb7740288fda1f201890375a60c8f][$v86536e21993c5a96a4d4c9c9afcc9b17];$v566bbee0f961ad71b54c3c2fd36db053 = self::getFileExtension($vb068931cc450442b63f5b3d276ea4297);if (!self::isAllowedFileType($v566bbee0f961ad71b54c3c2fd36db053)) {return false;}$vb068931cc450442b63f5b3d276ea4297 = mb_substr($vb068931cc450442b63f5b3d276ea4297, 0, mb_strlen($vb068931cc450442b63f5b3d276ea4297) - mb_strlen($v566bbee0f961ad71b54c3c2fd36db053) - 1);if (self::isTransliterateUploadedFiles()) {$vb068931cc450442b63f5b3d276ea4297 = translit::convert($vb068931cc450442b63f5b3d276ea4297);}$vb068931cc450442b63f5b3d276ea4297 .= '.' . $v566bbee0f961ad71b54c3c2fd36db053;if (!self::isLegalUploadedFileName($vb068931cc450442b63f5b3d276ea4297)) {return false;}$ve440be6a92dba11caa790215081671ae = ($vb80bb7740288fda1f201890375a60c8f === false) ? $v080505fba0c91df9d7cff41d972acaf1['tmp_name'][$v86536e21993c5a96a4d4c9c9afcc9b17] : $v080505fba0c91df9d7cff41d972acaf1['tmp_name'][$vb80bb7740288fda1f201890375a60c8f][$v86536e21993c5a96a4d4c9c9afcc9b17];if (!is_uploaded_file($ve440be6a92dba11caa790215081671ae)) {return false;}$v9024b204fb4c4ffdd07ee631ed791f75 = umiFile::getUnconflictPath($vb2ed5fc91c9760886b14c955ac6c82d7 . "/{$vb068931cc450442b63f5b3d276ea4297}");if (!move_uploaded_file($ve440be6a92dba11caa790215081671ae, $v9024b204fb4c4ffdd07ee631ed791f75)) {return false;}chmod($v9024b204fb4c4ffdd07ee631ed791f75, self::$mask);$v9024b204fb4c4ffdd07ee631ed791f75 = self::getRelPath($v9024b204fb4c4ffdd07ee631ed791f75);return new self::$class_name($v9024b204fb4c4ffdd07ee631ed791f75);}public static function upload_zip($v86536e21993c5a96a4d4c9c9afcc9b17, $v8c7dd922ad47494fc02c388e12c00eac = '', $v851148b4fd8fd7ae74bd9100c5c0c898 = '__default__', $v043f01e8ecc376fc15ecb17504a1f05e = false) {if ($v8c7dd922ad47494fc02c388e12c00eac === '__default__') {$v8c7dd922ad47494fc02c388e12c00eac = USER_IMAGES_PATH . '/cms/data/';}if ($v8c7dd922ad47494fc02c388e12c00eac == '') {$ve440be6a92dba11caa790215081671ae = $v86536e21993c5a96a4d4c9c9afcc9b17['tmp_name'];$vb068931cc450442b63f5b3d276ea4297 = $v86536e21993c5a96a4d4c9c9afcc9b17['name'];list($v6b3123b3b5e195a9a1879ae0ec5f0683, $vda1ef537e6ddb2d00e50fa5e51ee3b17, $v566bbee0f961ad71b54c3c2fd36db053) = array_values(getPathInfo($vb068931cc450442b63f5b3d276ea4297));$vb068931cc450442b63f5b3d276ea4297 = mb_substr($vb068931cc450442b63f5b3d276ea4297, 0, mb_strlen($vb068931cc450442b63f5b3d276ea4297) - mb_strlen($v566bbee0f961ad71b54c3c2fd36db053));if (self::isTransliterateUploadedFiles()) {$vb068931cc450442b63f5b3d276ea4297 = translit::convert($vb068931cc450442b63f5b3d276ea4297);}$vb068931cc450442b63f5b3d276ea4297 .= '.' . $v566bbee0f961ad71b54c3c2fd36db053;$v9024b204fb4c4ffdd07ee631ed791f75 = $v851148b4fd8fd7ae74bd9100c5c0c898 . $vb068931cc450442b63f5b3d276ea4297;$v51b7b5d0a5d6f26dc31ce613f4966356 = SYS_TEMP_PATH . '/uploads';if (!is_dir($v51b7b5d0a5d6f26dc31ce613f4966356)) {mkdir($v51b7b5d0a5d6f26dc31ce613f4966356);}$v3cc7992a6d5b20ce784f6169f4423048 = $v51b7b5d0a5d6f26dc31ce613f4966356 . '/' . $vb068931cc450442b63f5b3d276ea4297;if ($v86536e21993c5a96a4d4c9c9afcc9b17['size'] == 0) {return false;}if (is_uploaded_file($ve440be6a92dba11caa790215081671ae)) {$v9024b204fb4c4ffdd07ee631ed791f75 = umiFile::getUnconflictPath($v9024b204fb4c4ffdd07ee631ed791f75);if (move_uploaded_file($ve440be6a92dba11caa790215081671ae, $v3cc7992a6d5b20ce784f6169f4423048)) {chmod($v3cc7992a6d5b20ce784f6169f4423048, self::$mask);}else {return false;}}else {return false;}}else {$v8c7dd922ad47494fc02c388e12c00eac = CURRENT_WORKING_DIR . '/' . $v8c7dd922ad47494fc02c388e12c00eac;if (!file_exists($v8c7dd922ad47494fc02c388e12c00eac) || !is_writable($v8c7dd922ad47494fc02c388e12c00eac)) {return 'File does not exist!';}$ve6223bee17b330d9aed62e68463e0515 = getPathInfo($v8c7dd922ad47494fc02c388e12c00eac);if ($ve6223bee17b330d9aed62e68463e0515['extension'] != 'zip') {return "It's not zip-file!";}$v9024b204fb4c4ffdd07ee631ed791f75 = $v8c7dd922ad47494fc02c388e12c00eac;$v3cc7992a6d5b20ce784f6169f4423048 = $v8c7dd922ad47494fc02c388e12c00eac;}$vcedff02a1ddad18efd0b59b7b09e0eb5 = self::$addWaterMark;self::$addWaterMark = $v043f01e8ecc376fc15ecb17504a1f05e;$v888d0ee361af3603736f32131e7b20a2 = new UmiZipArchive($v3cc7992a6d5b20ce784f6169f4423048);$v10ae9fc7d453b0dd525d0edf2ede7961 = $v888d0ee361af3603736f32131e7b20a2->listContent();if (umiCount($v10ae9fc7d453b0dd525d0edf2ede7961) < 1) {throw new publicAdminException(getLabel('zip-file-empty'));}$v79001f389eb5f5185f6945430cb57be1 = cmsController::getInstance()->getModule('data')->getAllowedMaxFileSize();$ve6a7ab42343e8bc9131d89646abcb773 = Service::Registry()->get('//settings/max_img_filesize');if (!$ve6a7ab42343e8bc9131d89646abcb773) {$ve6a7ab42343e8bc9131d89646abcb773 = $v79001f389eb5f5185f6945430cb57be1;}$ve6a7ab42343e8bc9131d89646abcb773 = $ve6a7ab42343e8bc9131d89646abcb773 * 1024 * 1024;$va80da1282f2c775bbc5f2c92c836968b = 0;foreach ($v10ae9fc7d453b0dd525d0edf2ede7961 as $v3c6e0b8a9c15224a8228b9a98ca1531d => $v8a8e67a18097123aaa2495f5465224da) {$v566bbee0f961ad71b54c3c2fd36db053 = self::getFileExtension($v8a8e67a18097123aaa2495f5465224da['filename']);if (!umiFile::isAllowedImageType($v566bbee0f961ad71b54c3c2fd36db053)) {unset($v10ae9fc7d453b0dd525d0edf2ede7961[$v3c6e0b8a9c15224a8228b9a98ca1531d]);continue;}if ($v8a8e67a18097123aaa2495f5465224da['size'] > $ve6a7ab42343e8bc9131d89646abcb773) {throw new publicAdminException(getLabel('zip-file-image-max-size') . "{$v8a8e67a18097123aaa2495f5465224da['filename']}");}$va80da1282f2c775bbc5f2c92c836968b += $v8a8e67a18097123aaa2495f5465224da['size'];}if (umiCount($v10ae9fc7d453b0dd525d0edf2ede7961) < 1) {throw new publicAdminException(getLabel('zip-file-images-absent'));}if (!checkAllowedDiskSize($va80da1282f2c775bbc5f2c92c836968b)) {throw new publicAdminException(getLabel('zip-file-images-no-free-size'));}$v10ae9fc7d453b0dd525d0edf2ede7961 = $v888d0ee361af3603736f32131e7b20a2->extract($v851148b4fd8fd7ae74bd9100c5c0c898, true, 'callbackPreExtract', 'callbackPostExtract');self::$addWaterMark = $vcedff02a1ddad18efd0b59b7b09e0eb5;if (!is_array($v10ae9fc7d453b0dd525d0edf2ede7961)) {throw new coreException ('Zip extracting error: ' . $v888d0ee361af3603736f32131e7b20a2->errorInfo());}if (is_writable($v3cc7992a6d5b20ce784f6169f4423048)) {unlink($v3cc7992a6d5b20ce784f6169f4423048);}return $v10ae9fc7d453b0dd525d0edf2ede7961;}public function getFileName() {return $this->name;}public function getDirName($vb660cf7888d38578b005371413e1c0a6 = false) {$vd6fe1d0be6347b8ef2427fa629c04485 = $this->dirname;if ($vb660cf7888d38578b005371413e1c0a6) {return $this->convertAbsoluteToLocal($vd6fe1d0be6347b8ef2427fa629c04485);}return $vd6fe1d0be6347b8ef2427fa629c04485;}public function getModifyTime() {return $this->modify_time;}public function getContent() {return file_get_contents($this->getFilePath());}public function putContent($v9a0364b9e99bb480dd25e1f0284c8555, $v4e5868d676cb634aa75b125a0f741abf = 0) {if (contains($this->getFilePath(), '/dev/null/')) {return mb_strlen($v9a0364b9e99bb480dd25e1f0284c8555);}return file_put_contents($this->getFilePath(), $v9a0364b9e99bb480dd25e1f0284c8555, $v4e5868d676cb634aa75b125a0f741abf);}public function getHash() {return md5_file($this->getFilePath());}public function getExt($vb3a0d433146c211a7bc4f1f5618004f0 = false) {$v566bbee0f961ad71b54c3c2fd36db053 = $this->ext;if ($vb3a0d433146c211a7bc4f1f5618004f0) {return $v566bbee0f961ad71b54c3c2fd36db053;}return mb_strtolower($v566bbee0f961ad71b54c3c2fd36db053);}public function getSize() {return $this->size;}public function getFilePath($v335fe1286880112c216697dceb9e2bd3 = false) {$vd6fe1d0be6347b8ef2427fa629c04485 = $this->filepath;if ($v335fe1286880112c216697dceb9e2bd3) {return $this->convertAbsoluteToLocal($vd6fe1d0be6347b8ef2427fa629c04485);}return $vd6fe1d0be6347b8ef2427fa629c04485;}public function getUrl(\iDomain $vad5f82e879a9c5d6b5b442eb37e50551) : string {return $vad5f82e879a9c5d6b5b442eb37e50551->getUrl() . $this->getFilePath(true);}public function getOrder() {return $this->order;}public function setOrder($v70a17ffa722a3985b86d30b034ad06d7) {$this->order = (int) $v70a17ffa722a3985b86d30b034ad06d7;}public function getId() {return $this->id;}public function setId($vb80bb7740288fda1f201890375a60c8f) {$this->id = (int) $vb80bb7740288fda1f201890375a60c8f;}public function refresh() {$this->loadInfo();return $this;}public function getHumanSize() : string {$v4b3a6218bb3e3a7303e8a171a60fcf92 = $this->size;$v7dabf5c198b0bab2eaa42bb03a113e55 = 'bkmgtp';$v742f32c65ffd18b766fa307f8de2d47d = floor((strlen($v4b3a6218bb3e3a7303e8a171a60fcf92) - 1) / 3);return sprintf(getLabel('label-file-size-format-' . @$v7dabf5c198b0bab2eaa42bb03a113e55[$v742f32c65ffd18b766fa307f8de2d47d]), $v4b3a6218bb3e3a7303e8a171a60fcf92 / pow(1024, $v742f32c65ffd18b766fa307f8de2d47d));}public function getBaseFileName() : string {return basename($this->getFileName(), '.' . $this->getExt());}public function getFormattedModifyTime(string $v3c64ab0a1c8c902a8cfc3bdeedccd50a = null) : string {$v27822b7f77d606927a1725766e30f7e4 = Service::DateFactory()    ->createByTimeStamp($this->getModifyTime());return $v27822b7f77d606927a1725766e30f7e4->getFormattedDate($v3c64ab0a1c8c902a8cfc3bdeedccd50a);}private function convertAbsoluteToLocal($vd6fe1d0be6347b8ef2427fa629c04485) {$vbf7be97451be760d000d8fd7b26c5a3d = ini_get('include_path');if ($vbf7be97451be760d000d8fd7b26c5a3d != '.' && mb_substr($vd6fe1d0be6347b8ef2427fa629c04485, 0, mb_strlen($vbf7be97451be760d000d8fd7b26c5a3d)) === $vbf7be97451be760d000d8fd7b26c5a3d) {return '/' . mb_substr($vd6fe1d0be6347b8ef2427fa629c04485, mb_strlen($vbf7be97451be760d000d8fd7b26c5a3d));}$vbf7be97451be760d000d8fd7b26c5a3d = CURRENT_WORKING_DIR;if (mb_substr($vd6fe1d0be6347b8ef2427fa629c04485, 0, mb_strlen($vbf7be97451be760d000d8fd7b26c5a3d)) === $vbf7be97451be760d000d8fd7b26c5a3d) {return mb_substr($vd6fe1d0be6347b8ef2427fa629c04485, mb_strlen($vbf7be97451be760d000d8fd7b26c5a3d));}return (mb_substr($vd6fe1d0be6347b8ef2427fa629c04485, 0, 2) == './') ? ('/' . mb_substr($vd6fe1d0be6347b8ef2427fa629c04485, 2, mb_strlen($vd6fe1d0be6347b8ef2427fa629c04485) - 2)) : $vd6fe1d0be6347b8ef2427fa629c04485;}private function loadInfo() {$ve9a95f404b4c843d111ee88f48b2d8d4 = pathinfo($this->filepath);$this->dirname = isset($ve9a95f404b4c843d111ee88f48b2d8d4['dirname']) ? $ve9a95f404b4c843d111ee88f48b2d8d4['dirname'] : '';$this->name = isset($ve9a95f404b4c843d111ee88f48b2d8d4['basename']) ? $ve9a95f404b4c843d111ee88f48b2d8d4['basename'] : '';$this->ext = isset($ve9a95f404b4c843d111ee88f48b2d8d4['extension']) ? $ve9a95f404b4c843d111ee88f48b2d8d4['extension'] : '';$this->setReadable(is_readable($this->filepath));$this->setWritable(is_writable($this->filepath));if (!is_file($this->filepath)) {$this->is_broken = true;return false;}$this->is_broken = false;$this->modify_time = filemtime($this->filepath);$this->size = filesize($this->filepath);if ($this->isSecurityIgnored()) {return true;}if ($this->getExt() == 'php' || $this->getExt() == 'php5' || $this->getExt() == 'phtml') {$this->is_broken = true;}if ($this->name == '.htaccess') {$this->is_broken = true;}}public function setIgnoreSecurity($v327a6c4304ad5938eaf0efb6cc3e53dc = true) {$this->ignoreSecurity = (bool) $v327a6c4304ad5938eaf0efb6cc3e53dc;return $this;}public function __toString() {$v6a2a431fe8b621037ea949531c28551d = $this->getFilePath(true);return $v6a2a431fe8b621037ea949531c28551d === null ? '' : $v6a2a431fe8b621037ea949531c28551d;}public function getIsBroken() {return (bool) $this->is_broken;}public static function getUnconflictPath($vd833f6a7fa188532a7e5937356764b6d) {if (!file_exists($vd833f6a7fa188532a7e5937356764b6d)) {return $vd833f6a7fa188532a7e5937356764b6d;}$vcaf9b6b99962bf5c2264824231d7a40c = getPathInfo($vd833f6a7fa188532a7e5937356764b6d);$v954eef6d6eac59aca304b6d7abb4fb3e = $vcaf9b6b99962bf5c2264824231d7a40c['dirname'];$v435ed7e9f07f740abf511a62c00eef6e = $vcaf9b6b99962bf5c2264824231d7a40c['filename'];$vabf77184f55403d75b9d51d79162a7ca = $vcaf9b6b99962bf5c2264824231d7a40c['extension'];for ($v865c0c0b4ab0e063e5caa3387c1a8741 = 1;$v865c0c0b4ab0e063e5caa3387c1a8741 < 512;$v865c0c0b4ab0e063e5caa3387c1a8741++) {$v4b63f7a305661bfc995cbefa682f722b = $v954eef6d6eac59aca304b6d7abb4fb3e . '/' . $v435ed7e9f07f740abf511a62c00eef6e . $v865c0c0b4ab0e063e5caa3387c1a8741 . '.' . $vabf77184f55403d75b9d51d79162a7ca;if (!file_exists($v4b63f7a305661bfc995cbefa682f722b)) {return $v4b63f7a305661bfc995cbefa682f722b;}}throw new coreException('This is really hard to happen');}public static function getAddWaterMark() {return self::$addWaterMark;}public static function isAllowedImageType($v566bbee0f961ad71b54c3c2fd36db053) {return in_array($v566bbee0f961ad71b54c3c2fd36db053, self::$allowedImageTypes);}public function getDirHash() : string {return elfinder_get_hash($this->dirname);}public function getPathHash() : string {return elfinder_get_hash($this->filepath);}protected static function getRelPath($vd6fe1d0be6347b8ef2427fa629c04485) {$v109633366fd0d46d371ede589998abaa = realpath(getcwd());return '.' . mb_substr(realpath($vd6fe1d0be6347b8ef2427fa629c04485), mb_strlen($v109633366fd0d46d371ede589998abaa));}protected static function isTransliterateUploadedFiles() {$v2245023265ae4cf87d02c8b6ba991139 = mainConfiguration::getInstance();$v544d95d540cd2669e78a15fa25c078a0 = $v2245023265ae4cf87d02c8b6ba991139->get('system', 'transliterate-uploaded-files');return ($v544d95d540cd2669e78a15fa25c078a0 === null || $v544d95d540cd2669e78a15fa25c078a0 == 1);}protected function downloadByApache($v789726e10bf01b1777c5d2ae06bede3e) {$v7f2db423a49b305459147332fb01cf87 = Service::Response()    ->getCurrentBuffer();$v7f2db423a49b305459147332fb01cf87->clear();$v7f2db423a49b305459147332fb01cf87->reset();$v7f2db423a49b305459147332fb01cf87->setHeader('Cache-Control', 'public, must-revalidate');$v7f2db423a49b305459147332fb01cf87->setHeader('Pragma', 'no-cache');$v7f2db423a49b305459147332fb01cf87->contentType('application/force-download');$v7f2db423a49b305459147332fb01cf87->setHeader('Accept-Ranges', 'bytes');$v7f2db423a49b305459147332fb01cf87->setHeader('Content-Encoding', 'None');$v7f2db423a49b305459147332fb01cf87->setHeader('Content-Transfer-Encoding', 'Binary');$v7f2db423a49b305459147332fb01cf87->setHeader('Content-Disposition', 'attachment; filename=' . $this->getFileName());$v47826cacc65c665212b821e6ff80b9b0 = realpath($this->getFilePath());$v7f2db423a49b305459147332fb01cf87->push(file_get_contents($v47826cacc65c665212b821e6ff80b9b0));if ($v789726e10bf01b1777c5d2ae06bede3e) {$this->delete();}$v7f2db423a49b305459147332fb01cf87->end();}protected function downloadByNginx($v789726e10bf01b1777c5d2ae06bede3e) {$v7f2db423a49b305459147332fb01cf87 = Service::Response()    ->getCurrentBuffer();$v7f2db423a49b305459147332fb01cf87->clear();$v7f2db423a49b305459147332fb01cf87->reset();$v7f2db423a49b305459147332fb01cf87->contentType('application/force-download');$v7f2db423a49b305459147332fb01cf87->setHeader('X-Accel-Redirect', '/' . trim($this->getFilePath(), ".\\/"));$v7f2db423a49b305459147332fb01cf87->contentType('application/force-download');$v7f2db423a49b305459147332fb01cf87->setHeader('Accept-Ranges', 'bytes');$v7f2db423a49b305459147332fb01cf87->setHeader('Content-Encoding', 'None');$v7f2db423a49b305459147332fb01cf87->setHeader('Content-Transfer-Encoding', 'Binary');$v7f2db423a49b305459147332fb01cf87->setHeader('Content-Disposition', 'attachment; filename=' . $this->getFileName());$v7f2db423a49b305459147332fb01cf87->setHeader('Expires', '0');$v7f2db423a49b305459147332fb01cf87->setHeader('Cache-Control', 'public, must-revalidate, post-check=0, pre-check=0');$v7f2db423a49b305459147332fb01cf87->setHeader('Pragma', 'no-cache');$v7f2db423a49b305459147332fb01cf87->push(' ');if ($v789726e10bf01b1777c5d2ae06bede3e) {$this->delete();}$v7f2db423a49b305459147332fb01cf87->end();}protected function setReadable($v327a6c4304ad5938eaf0efb6cc3e53dc = true) {$this->isReadable = (bool) $v327a6c4304ad5938eaf0efb6cc3e53dc;return $this;}protected function setWritable($v327a6c4304ad5938eaf0efb6cc3e53dc = true) {$this->isWritable = (bool) $v327a6c4304ad5938eaf0efb6cc3e53dc;return $this;}private function isSecurityIgnored() {return $this->ignoreSecurity;}}function callbackPreExtract($v50cd20d6ab1f950f5f7cd9594d824078, &$v346210869c15b12ae6d906bb9e095aac) {$vcaf9b6b99962bf5c2264824231d7a40c = getPathInfo($v346210869c15b12ae6d906bb9e095aac['filename']);$v566bbee0f961ad71b54c3c2fd36db053 = mb_strtolower($vcaf9b6b99962bf5c2264824231d7a40c['extension']);if (!umiFile::isAllowedImageType($v566bbee0f961ad71b54c3c2fd36db053)) {return 0;}$v954eb83bca864c64ee1e669dfab01c95 = mb_substr($vcaf9b6b99962bf5c2264824231d7a40c['basename'], 0, (mb_strlen($vcaf9b6b99962bf5c2264824231d7a40c['basename']) - mb_strlen($vcaf9b6b99962bf5c2264824231d7a40c['extension'])) - 1);$v954eb83bca864c64ee1e669dfab01c95 = translit::convert($v954eb83bca864c64ee1e669dfab01c95);$v346210869c15b12ae6d906bb9e095aac['filename'] = $vcaf9b6b99962bf5c2264824231d7a40c['dirname'] . '/' . $v954eb83bca864c64ee1e669dfab01c95 . '.' . $vcaf9b6b99962bf5c2264824231d7a40c['extension'];$v346210869c15b12ae6d906bb9e095aac['filename'] = umiFile::getUnconflictPath($v346210869c15b12ae6d906bb9e095aac['filename']);return 1;}function callbackPostExtract($v50cd20d6ab1f950f5f7cd9594d824078, &$v346210869c15b12ae6d906bb9e095aac) {$vcaf9b6b99962bf5c2264824231d7a40c = getPathInfo($v346210869c15b12ae6d906bb9e095aac['stored_filename']);$v566bbee0f961ad71b54c3c2fd36db053 = isset($vcaf9b6b99962bf5c2264824231d7a40c['extension']) ? mb_strtolower($vcaf9b6b99962bf5c2264824231d7a40c['extension']) : '';$v435ed7e9f07f740abf511a62c00eef6e = $v346210869c15b12ae6d906bb9e095aac['filename'];if (umiFile::isAllowedImageType($v566bbee0f961ad71b54c3c2fd36db053)) {$v3f6abb5601f05f03e3fdf4dec2668666 = @getimagesize($v435ed7e9f07f740abf511a62c00eef6e);if (!is_array($v3f6abb5601f05f03e3fdf4dec2668666)) {@unlink($v435ed7e9f07f740abf511a62c00eef6e);}if (umiFile::getAddWaterMark()) {if (umiImageFile::addWatermark($v435ed7e9f07f740abf511a62c00eef6e) !== false) {return 1;}}$vf9a3266ad8c9b1c7135d1e0d787fe91b = (bool) mainConfiguration::getInstance()->get('kernel', 'jpg-through-gd');if ($vf9a3266ad8c9b1c7135d1e0d787fe91b) {if ($v566bbee0f961ad71b54c3c2fd36db053 == 'jpg' || $v566bbee0f961ad71b54c3c2fd36db053 == 'jpeg') {$v9b207167e5381c47682c6b4f58a623fb = imagecreatefromjpeg($v435ed7e9f07f740abf511a62c00eef6e);if ($v9b207167e5381c47682c6b4f58a623fb) {imagejpeg($v9b207167e5381c47682c6b4f58a623fb, $v435ed7e9f07f740abf511a62c00eef6e, 100);imagedestroy($v9b207167e5381c47682c6b4f58a623fb);}}}}else {unlink($v435ed7e9f07f740abf511a62c00eef6e);}return 1;}