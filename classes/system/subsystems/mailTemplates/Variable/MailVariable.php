<?php
 class MailVariable implements  iUmiCollectionItem,  iUmiDataBaseInjector,  iUmiConstantMapInjector,  iClassConfigManager {use tUmiDataBaseInjector;use tCommonCollectionItem;use tUmiConstantMapInjector;use tClassConfigManager;private $templateId;private $name;private static $classConfig = [   'fields' => [    [     'name' => 'ID_FIELD_NAME',     'required' => true,     'unchangeable' => true,     'setter' => 'setId',     'getter' => 'getId'    ],    [     'name' => 'TEMPLATE_ID_FIELD_NAME',     'required' => true,     'setter' => 'setTemplateId',     'getter' => 'getTemplateId'    ],    [     'name' => 'VARIABLE_FIELD_NAME',     'required' => true,     'setter' => 'setName',     'getter' => 'getName'    ],   ]  ];public function setId($vb80bb7740288fda1f201890375a60c8f) {$this->setDifferentValue('id', $vb80bb7740288fda1f201890375a60c8f, 'int');}public function getTemplateId() {return $this->templateId;}public function setTemplateId($vb80bb7740288fda1f201890375a60c8f) {$this->setDifferentValue('templateId', $vb80bb7740288fda1f201890375a60c8f, 'int');}public function getName() {return $this->name;}public function setName($vb068931cc450442b63f5b3d276ea4297) {$this->setDifferentValue('name', $vb068931cc450442b63f5b3d276ea4297, 'string');}public function commit() {if (!$this->isUpdated()) {return false;}$v1d78dc8ed51214e518b5114fe24490ae = $this->getMap();$v4717d53ebfdfea8477f780ec66151dcb = $this->getConnection();$v80071f37861c360a27b7327e132c911a = $v4717d53ebfdfea8477f780ec66151dcb->escape($v1d78dc8ed51214e518b5114fe24490ae->get('TABLE_NAME'));$vbb1df230a5150b8ac17121321b3b514c = $v4717d53ebfdfea8477f780ec66151dcb->escape($v1d78dc8ed51214e518b5114fe24490ae->get('ID_FIELD_NAME'));$v3d8c97885fa0aada9c7f8c8fc1238897 = $v4717d53ebfdfea8477f780ec66151dcb->escape($v1d78dc8ed51214e518b5114fe24490ae->get('TEMPLATE_ID_FIELD_NAME'));$v83ea2c7be983b2f78a3ee8cfa6556bbc = $v4717d53ebfdfea8477f780ec66151dcb->escape($v1d78dc8ed51214e518b5114fe24490ae->get('VARIABLE_FIELD_NAME'));$vb80bb7740288fda1f201890375a60c8f = $this->getId();$vb068931cc450442b63f5b3d276ea4297 = $v4717d53ebfdfea8477f780ec66151dcb->escape($this->getName());$v3200a31fc05da4e9d5a0465c36822e2f = $v4717d53ebfdfea8477f780ec66151dcb->escape($this->getTemplateId());$vac5c74b64b4b8352ef2f181affb5ac2a = <<<SQL
UPDATE `$v80071f37861c360a27b7327e132c911a`
	SET `$v3d8c97885fa0aada9c7f8c8fc1238897` = '$v3200a31fc05da4e9d5a0465c36822e2f', `$v83ea2c7be983b2f78a3ee8cfa6556bbc` = '$vb068931cc450442b63f5b3d276ea4297'
		WHERE `$vbb1df230a5150b8ac17121321b3b514c` = $vb80bb7740288fda1f201890375a60c8f;
SQL;   $v4717d53ebfdfea8477f780ec66151dcb->query($vac5c74b64b4b8352ef2f181affb5ac2a);return true;}}