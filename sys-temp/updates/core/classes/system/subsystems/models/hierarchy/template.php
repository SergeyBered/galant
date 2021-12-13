<?php
 use UmiCms\Service;class template extends umiEntinty implements iTemplate {protected $store_type = 'template';private $name;private $filename;private $type;private $title;private $domain_id;private $lang_id;private $is_default;private $templatesDirectory;private $filePath;protected $resourcesDirectory;public function getName() {return $this->name;}public function getFilename() {return $this->filename;}public function getResourcesDirectory($v64feae0988f5b61c96c305e3c3f04551 = false) {if ($v64feae0988f5b61c96c305e3c3f04551) {return $this->resourcesDirectory ? '/templates/' . $this->getName() . '/' : '/';}return $this->resourcesDirectory;}public function getCustomsDirectory() {$vfbfa50b2e3ef554f9ac216be37adaaa0 = $this->getResourcesDirectory();if (!is_dir($vfbfa50b2e3ef554f9ac216be37adaaa0)) {return false;}$vcab0a02aad4fe268eec8962d0c42dc38 = $vfbfa50b2e3ef554f9ac216be37adaaa0 . "classes/components/";$vcab0a02aad4fe268eec8962d0c42dc38 = is_dir($vcab0a02aad4fe268eec8962d0c42dc38) ? $vcab0a02aad4fe268eec8962d0c42dc38 : ($vfbfa50b2e3ef554f9ac216be37adaaa0 . "classes/modules/");return is_dir($vcab0a02aad4fe268eec8962d0c42dc38) ? $vcab0a02aad4fe268eec8962d0c42dc38 : false;}public function getTemplatesDirectory() {return $this->templatesDirectory;}public function getFilePath() {return $this->filePath;}public function getType() {return $this->type;}public function getTitle() {return $this->title;}public function getDomainId() {return $this->domain_id;}public function getLangId() {return $this->lang_id;}public function getIsDefault() {return $this->is_default;}public function setName($vb068931cc450442b63f5b3d276ea4297) {if ($this->getName() != $vb068931cc450442b63f5b3d276ea4297) {$this->name = $vb068931cc450442b63f5b3d276ea4297;$this->setIsUpdated();}}public function setFilename($v435ed7e9f07f740abf511a62c00eef6e) {if ($this->getFilename() != $v435ed7e9f07f740abf511a62c00eef6e) {$this->filename = $v435ed7e9f07f740abf511a62c00eef6e;$this->setIsUpdated();}}public function setTitle($vd5d3db1765287eef77d7927cc956f50a) {if ($this->getTitle() != $vd5d3db1765287eef77d7927cc956f50a) {$this->title = $vd5d3db1765287eef77d7927cc956f50a;$this->setIsUpdated();}}public function setType($v599dcce2998a6b40b1e38e8c6006cb0a) {if ($this->getType() != $v599dcce2998a6b40b1e38e8c6006cb0a) {$this->type = $v599dcce2998a6b40b1e38e8c6006cb0a;$this->setIsUpdated();}}public function setDomainId($v72ee76c5c29383b7c9f9225c1fa4d10b) {if (!Service::DomainCollection()->isExists($v72ee76c5c29383b7c9f9225c1fa4d10b)) {return false;}if ($this->getDomainId() != $v72ee76c5c29383b7c9f9225c1fa4d10b) {$this->domain_id = (int) $v72ee76c5c29383b7c9f9225c1fa4d10b;$this->setIsUpdated();}return true;}public function setLangId($vf585b7f018bb4ced15a03683a733e50b) {if (!Service::LanguageCollection()->isExists($vf585b7f018bb4ced15a03683a733e50b)) {return false;}if ($this->getLangId() != $vf585b7f018bb4ced15a03683a733e50b) {$this->lang_id = (int) $vf585b7f018bb4ced15a03683a733e50b;$this->setIsUpdated();}return true;}public function setIsDefault($ve558e63f3083922542d8745224a66eea) {$ve558e63f3083922542d8745224a66eea = (bool) $ve558e63f3083922542d8745224a66eea;if ($this->getIsDefault() != $ve558e63f3083922542d8745224a66eea) {$this->is_default = $ve558e63f3083922542d8745224a66eea;$this->setIsUpdated();}}public function getFileExtension() {switch ($this->getType()) {case 'xslt' : {return 'xsl';}case 'php' : {return 'phtml';}case 'tpls' : {return 'tpl';}default : {throw new coreException('Unsupported type given: ' . $this->getType());}}}public function getConfigPath() {$vb068931cc450442b63f5b3d276ea4297 = $this->getName();if (is_string($vb068931cc450442b63f5b3d276ea4297) && !empty($vb068931cc450442b63f5b3d276ea4297)) {return $this->resourcesDirectory . 'config.ini';}return null;}public function getUsedPages($vaa9f73eea60a006820d0f8768bc8a3fc = 0, $v7a86c157ee9713c34fbd7a1ee40f0c5a = 0) {$vf287ed381c001989407dc155355eb3b2 = '';$v4717d53ebfdfea8477f780ec66151dcb = ConnectionPool::getInstance()->getConnection();$v5a0f217f54927dfb5cb016b73d657e97 = $v4717d53ebfdfea8477f780ec66151dcb->escape($vaa9f73eea60a006820d0f8768bc8a3fc);$v8c9b5763e67cd287e1e815fffa4de408 = $v4717d53ebfdfea8477f780ec66151dcb->escape($v7a86c157ee9713c34fbd7a1ee40f0c5a);if (is_numeric($vaa9f73eea60a006820d0f8768bc8a3fc) && $vaa9f73eea60a006820d0f8768bc8a3fc > 0) {$vf287ed381c001989407dc155355eb3b2 = "LIMIT ${v8c9b5763e67cd287e1e815fffa4de408}, ${v5a0f217f54927dfb5cb016b73d657e97}";}$v3200a31fc05da4e9d5a0465c36822e2f = (int) $this->getId();$v1325df055fd788c1764cdb4962f00abd = $this->getTemplateCondition($v3200a31fc05da4e9d5a0465c36822e2f);$v72ee76c5c29383b7c9f9225c1fa4d10b = (int) $this->getDomainId();$vac5c74b64b4b8352ef2f181affb5ac2a = <<<QUERY
SELECT SQL_CALC_FOUND_ROWS
	     h.id,
       o.NAME
FROM   cms3_hierarchy h,
       cms3_objects o
WHERE  h.tpl_id $v1325df055fd788c1764cdb4962f00abd
       AND o.id = h.obj_id
       AND h.is_deleted = '0'
       AND h.domain_id = $v72ee76c5c29383b7c9f9225c1fa4d10b
       ${vf287ed381c001989407dc155355eb3b2}
QUERY;
SELECT count(`id`)
FROM   cms3_hierarchy h USE INDEX (PRIMARY)
WHERE  h.tpl_id $v1325df055fd788c1764cdb4962f00abd
       AND h.is_deleted = '0'
       AND h.domain_id = $v72ee76c5c29383b7c9f9225c1fa4d10b
QUERY;
SELECT count(h.id)
FROM   cms3_hierarchy h,
       cms3_objects o
WHERE  h.tpl_id $v1325df055fd788c1764cdb4962f00abd
       AND o.id = h.obj_id
       AND h.is_deleted = '0'
       AND h.domain_id = $v72ee76c5c29383b7c9f9225c1fa4d10b
       AND o.name LIKE "$vb068931cc450442b63f5b3d276ea4297%"
QUERY;
SELECT `id` FROM `cms3_hierarchy` h WHERE h.`tpl_id` $v1325df055fd788c1764cdb4962f00abd 
	AND h.`is_deleted` = '0'
   	AND h.`domain_id` = $v72ee76c5c29383b7c9f9225c1fa4d10b
	LIMIT 0,1;
SQL;
SELECT h.`id` FROM `cms3_hierarchy` h, `cms3_objects` o 
	WHERE h.`tpl_id` $v1325df055fd788c1764cdb4962f00abd 
	AND o.`id` = h.`obj_id`
	AND h.`is_deleted` = '0'
   	AND h.`domain_id` = $v72ee76c5c29383b7c9f9225c1fa4d10b
   	AND o.`name` LIKE "$vb068931cc450442b63f5b3d276ea4297%"
	LIMIT 0,1;
SQL;
SELECT h.id
FROM   cms3_hierarchy h,
       cms3_objects o
WHERE  h.tpl_id $v1325df055fd788c1764cdb4962f00abd
       AND o.id = h.obj_id
       AND h.is_deleted = '0'
       AND h.domain_id = $v72ee76c5c29383b7c9f9225c1fa4d10b
       AND o.name LIKE "$vb068931cc450442b63f5b3d276ea4297%"
LIMIT $v7a86c157ee9713c34fbd7a1ee40f0c5a, $vaa9f73eea60a006820d0f8768bc8a3fc
QUERY;
UPDATE cms3_hierarchy
SET tpl_id = $vde0c2006a577d53dfd22f172baf697ed
WHERE tpl_id = $v3200a31fc05da4e9d5a0465c36822e2f AND is_deleted = '0' AND domain_id = $v72ee76c5c29383b7c9f9225c1fa4d10b
SQL;
SELECT id, name, filename, type, title, domain_id, lang_id, is_default 
FROM cms3_templates WHERE id = $v817f7de13f58df29b13a9570082097da LIMIT 0,1
SQL;
UPDATE cms3_templates
SET name = '{$vb068931cc450442b63f5b3d276ea4297}', filename = '{$v435ed7e9f07f740abf511a62c00eef6e}', type = '{$v599dcce2998a6b40b1e38e8c6006cb0a}', title = '{$vd5d3db1765287eef77d7927cc956f50a}',
    domain_id = '{$v72ee76c5c29383b7c9f9225c1fa4d10b}', lang_id = '{$vf585b7f018bb4ced15a03683a733e50b}', is_default = '{$ve558e63f3083922542d8745224a66eea}'
WHERE id = '{$this->id}'
SQL;