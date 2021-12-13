<?php
 class umiImportRelations extends singleton implements iUmiImportRelations {const FIELD_RELATIONS_TABLE = 'cms3_import_fields';const FIELD_RELATIONS_EXTERNAL_ID_FIELD = 'field_name';const FIELD_RELATIONS_TYPE_ID_FIELD = 'type_Id';const FIELD_RELATIONS_INTERNAL_ID_FIELD = 'new_id';const SOURCE_FIELD = 'source_id';private $sourceId = null;protected function __construct() {}public static function getInstance($v4a8a08f09d37b73795649038408b5f33 = null) {return parent::getInstance(__CLASS__);}public function getSourceId($vb068931cc450442b63f5b3d276ea4297) {$v4717d53ebfdfea8477f780ec66151dcb = ConnectionPool::getInstance()    ->getConnection();$vb068931cc450442b63f5b3d276ea4297 = $v4717d53ebfdfea8477f780ec66151dcb->escape($vb068931cc450442b63f5b3d276ea4297);$v8bc4403642c02217dc1341694acb244d = <<<SQL
SELECT `id` FROM `cms3_import_sources` WHERE `source_name` = '{$vb068931cc450442b63f5b3d276ea4297}' LIMIT 0,1
SQL;
SELECT `source_name` FROM `cms3_import_sources` WHERE `id` = $vb80bb7740288fda1f201890375a60c8f LIMIT 0,1
SQL;
INSERT INTO `cms3_import_sources` (`source_name`) VALUES ('{$vb068931cc450442b63f5b3d276ea4297}')
SQL;
DELETE FROM `cms3_import_sources` WHERE `id` = $vb80bb7740288fda1f201890375a60c8f
SQL;
DELETE FROM `cms3_import_relations` WHERE `source_id` = $v52195dae0174459c5f066fa0df053c26 AND (`new_id` = $vb80bb7740288fda1f201890375a60c8f OR `old_id` = '{$v1fad63c9b56ba99b63a65cbfd3b3672a}')
SQL;
INSERT INTO `cms3_import_relations` (`source_id`, `old_id`, `new_id`) VALUES ($v52195dae0174459c5f066fa0df053c26, '{$v1fad63c9b56ba99b63a65cbfd3b3672a}', $vb80bb7740288fda1f201890375a60c8f)
SQL;
DELETE FROM `cms3_import_relations` WHERE `source_id` = $v52195dae0174459c5f066fa0df053c26
SQL;
SELECT `new_id` FROM `cms3_import_relations` WHERE `old_id` = '{$v1fad63c9b56ba99b63a65cbfd3b3672a}' AND `source_id` = $v52195dae0174459c5f066fa0df053c26 LIMIT 0,1
SQL;
SELECT `old_id` FROM `cms3_import_relations` WHERE `new_id` = $vb80bb7740288fda1f201890375a60c8f AND `source_id` = $v52195dae0174459c5f066fa0df053c26 LIMIT 0,1
SQL;
DELETE FROM `cms3_import_objects` WHERE `source_id` = $v52195dae0174459c5f066fa0df053c26 AND (`new_id` = $vb80bb7740288fda1f201890375a60c8f OR `old_id` = '{$v1fad63c9b56ba99b63a65cbfd3b3672a}')
SQL;
INSERT INTO `cms3_import_objects` (`source_id`, `old_id`, `new_id`) VALUES ($v52195dae0174459c5f066fa0df053c26, '{$v1fad63c9b56ba99b63a65cbfd3b3672a}', $vb80bb7740288fda1f201890375a60c8f)
SQL;
SELECT `new_id` FROM `cms3_import_objects` WHERE old_id = '{$v1fad63c9b56ba99b63a65cbfd3b3672a}' AND source_id = $v52195dae0174459c5f066fa0df053c26 LIMIT 0,1
SQL;
SELECT `old_id` FROM `cms3_import_objects` WHERE `new_id` = $vb80bb7740288fda1f201890375a60c8f AND `source_id` = $v52195dae0174459c5f066fa0df053c26 LIMIT 0,1
SQL;
SELECT `source_id` FROM `cms3_import_objects` WHERE `new_id` = $vb80bb7740288fda1f201890375a60c8f LIMIT 0,1
SQL;
SELECT `source_id` FROM `cms3_import_templates` WHERE `new_id` = $vb80bb7740288fda1f201890375a60c8f LIMIT 0,1
SQL;
DELETE FROM `cms3_import_types` WHERE `source_id` = $v52195dae0174459c5f066fa0df053c26 AND (`new_id` = $vb80bb7740288fda1f201890375a60c8f OR `old_id` = '{$v1fad63c9b56ba99b63a65cbfd3b3672a}')
SQL;
INSERT INTO `cms3_import_types` (`source_id`, `old_id`, `new_id`) VALUES ($v52195dae0174459c5f066fa0df053c26, '{$v1fad63c9b56ba99b63a65cbfd3b3672a}', $vb80bb7740288fda1f201890375a60c8f)
SQL;
SELECT `new_id` FROM `cms3_import_types` WHERE `old_id` = '{$v1fad63c9b56ba99b63a65cbfd3b3672a}' AND `source_id` = $v52195dae0174459c5f066fa0df053c26 LIMIT 0,1
SQL;
SELECT `old_id` FROM `cms3_import_types` WHERE `new_id` = $vb80bb7740288fda1f201890375a60c8f AND `source_id` = $v52195dae0174459c5f066fa0df053c26 LIMIT 0,1
SQL;
DELETE FROM `cms3_import_fields` 
	WHERE `source_id` = $v52195dae0174459c5f066fa0df053c26 AND `type_id` = $v5f694956811487225d15e973ca38fbab AND (`field_name` = '{$v1fad63c9b56ba99b63a65cbfd3b3672a}' OR `new_id` = $vb80bb7740288fda1f201890375a60c8f)
SQL;
INSERT INTO `cms3_import_fields` (`source_id`, `type_id`, `field_name`, `new_id`) 
	VALUES ($v52195dae0174459c5f066fa0df053c26, $v5f694956811487225d15e973ca38fbab, '{$v1fad63c9b56ba99b63a65cbfd3b3672a}', $vb80bb7740288fda1f201890375a60c8f)
SQL;
SELECT `new_id` FROM `cms3_import_fields` 
	WHERE `source_id` = $v52195dae0174459c5f066fa0df053c26 AND `type_id` = $v5f694956811487225d15e973ca38fbab AND `field_name` = '{$v1fad63c9b56ba99b63a65cbfd3b3672a}' LIMIT 0,1
SQL;
SELECT `field_name` FROM `cms3_import_fields` 
	WHERE `source_id` = $v52195dae0174459c5f066fa0df053c26 AND `type_id` = $v5f694956811487225d15e973ca38fbab AND `new_id` = $vb80bb7740288fda1f201890375a60c8f LIMIT 0,1
SQL;
DELETE FROM `cms3_import_groups` 
	WHERE `source_id` = $v52195dae0174459c5f066fa0df053c26 AND `type_id` = $v5f694956811487225d15e973ca38fbab AND (`group_name` = '{$v1fad63c9b56ba99b63a65cbfd3b3672a}' OR `new_id` = $vb80bb7740288fda1f201890375a60c8f)
SQL;
INSERT INTO `cms3_import_groups` (`source_id`, `type_id`, `group_name`, `new_id`) 
	VALUES ($v52195dae0174459c5f066fa0df053c26, $v5f694956811487225d15e973ca38fbab, '{$v1fad63c9b56ba99b63a65cbfd3b3672a}', $vb80bb7740288fda1f201890375a60c8f)
SQL;
SELECT `new_id` FROM `cms3_import_groups` 
	WHERE `source_id` = $v52195dae0174459c5f066fa0df053c26 AND `type_id` = $v5f694956811487225d15e973ca38fbab AND `group_name` = '{$v1fad63c9b56ba99b63a65cbfd3b3672a}' LIMIT 0,1
SQL;
SELECT `group_name` FROM `cms3_import_groups` 
	WHERE `source_id` = $v52195dae0174459c5f066fa0df053c26 AND `type_id` = $v5f694956811487225d15e973ca38fbab AND `new_id` = $vb80bb7740288fda1f201890375a60c8f LIMIT 0,1
SQL;
DELETE FROM `cms3_import_domains` WHERE `source_id` = $v52195dae0174459c5f066fa0df053c26 AND (`new_id` = $vb80bb7740288fda1f201890375a60c8f OR `old_id` = '{$v1fad63c9b56ba99b63a65cbfd3b3672a}')
SQL;
INSERT INTO `cms3_import_domains` (`source_id`, `old_id`, `new_id`) VALUES ($v52195dae0174459c5f066fa0df053c26, '{$v1fad63c9b56ba99b63a65cbfd3b3672a}', $vb80bb7740288fda1f201890375a60c8f)
SQL;
SELECT `new_id` FROM `cms3_import_domains` WHERE `old_id` = '{$v1fad63c9b56ba99b63a65cbfd3b3672a}' AND `source_id` = $v52195dae0174459c5f066fa0df053c26 LIMIT 0,1
SQL;
SELECT `old_id` FROM `cms3_import_domains` WHERE `new_id` = $vb80bb7740288fda1f201890375a60c8f AND `source_id` = $v52195dae0174459c5f066fa0df053c26 LIMIT 0,1
SQL;
DELETE FROM `cms3_import_domain_mirrors` WHERE `source_id` = $v52195dae0174459c5f066fa0df053c26 AND (`new_id` = $vb80bb7740288fda1f201890375a60c8f OR `old_id` = '{$v1fad63c9b56ba99b63a65cbfd3b3672a}')
SQL;
INSERT INTO `cms3_import_domain_mirrors` (`source_id`, `old_id`, `new_id`) VALUES ($v52195dae0174459c5f066fa0df053c26, '{$v1fad63c9b56ba99b63a65cbfd3b3672a}', $vb80bb7740288fda1f201890375a60c8f)
SQL;
SELECT `new_id` FROM `cms3_import_domain_mirrors` WHERE `old_id` = '{$v1fad63c9b56ba99b63a65cbfd3b3672a}' AND `source_id` = $v52195dae0174459c5f066fa0df053c26 LIMIT 0,1
SQL;
SELECT `old_id` FROM `cms3_import_domain_mirrors` WHERE `new_id` = $vb80bb7740288fda1f201890375a60c8f AND `source_id` = $v52195dae0174459c5f066fa0df053c26 LIMIT 0,1
SQL;
DELETE FROM `cms3_import_langs` WHERE `source_id` = $v52195dae0174459c5f066fa0df053c26 AND (`new_id` = $vb80bb7740288fda1f201890375a60c8f OR `old_id` = '{$v1fad63c9b56ba99b63a65cbfd3b3672a}')
SQL;
INSERT INTO `cms3_import_langs` (`source_id`, `old_id`, `new_id`) VALUES ($v52195dae0174459c5f066fa0df053c26, '{$v1fad63c9b56ba99b63a65cbfd3b3672a}', $vb80bb7740288fda1f201890375a60c8f)
SQL;
SELECT `new_id` FROM `cms3_import_langs` WHERE `old_id` = '{$v1fad63c9b56ba99b63a65cbfd3b3672a}' AND `source_id` = $v52195dae0174459c5f066fa0df053c26 LIMIT 0,1
SQL;
SELECT `old_id` FROM `cms3_import_langs` WHERE `new_id` = $vb80bb7740288fda1f201890375a60c8f AND `source_id` = $v52195dae0174459c5f066fa0df053c26 LIMIT 0,1
SQL;
DELETE FROM `cms3_import_templates` WHERE `source_id` = $v52195dae0174459c5f066fa0df053c26 AND (`new_id` = $vb80bb7740288fda1f201890375a60c8f OR `old_id` = '{$v1fad63c9b56ba99b63a65cbfd3b3672a}')
SQL;
INSERT INTO `cms3_import_templates` (`source_id`, `old_id`, `new_id`) VALUES ($v52195dae0174459c5f066fa0df053c26, '{$v1fad63c9b56ba99b63a65cbfd3b3672a}', $vb80bb7740288fda1f201890375a60c8f)
SQL;
SELECT `new_id` FROM `cms3_import_templates` WHERE `old_id` = '{$v1fad63c9b56ba99b63a65cbfd3b3672a}' AND `source_id` = $v52195dae0174459c5f066fa0df053c26 LIMIT 0,1
SQL;
SELECT `old_id` FROM `cms3_import_templates` WHERE `new_id` = $vb80bb7740288fda1f201890375a60c8f AND `source_id` = $v52195dae0174459c5f066fa0df053c26 LIMIT 0,1
SQL;
DELETE FROM `cms3_import_restrictions` WHERE `source_id` = $v52195dae0174459c5f066fa0df053c26 AND (`new_id` = $vb80bb7740288fda1f201890375a60c8f OR `old_id` = '{$v1fad63c9b56ba99b63a65cbfd3b3672a}')
SQL;
INSERT INTO `cms3_import_restrictions` (`source_id`, `old_id`, `new_id`) VALUES ($v52195dae0174459c5f066fa0df053c26, '{$v1fad63c9b56ba99b63a65cbfd3b3672a}', $vb80bb7740288fda1f201890375a60c8f)
SQL;
SELECT `new_id` FROM `cms3_import_restrictions` WHERE `old_id` = '{$v1fad63c9b56ba99b63a65cbfd3b3672a}' AND `source_id` = $v52195dae0174459c5f066fa0df053c26 LIMIT 0,1
SQL;
SELECT `old_id` FROM `cms3_import_restrictions` WHERE `new_id` = $vb80bb7740288fda1f201890375a60c8f AND `source_id` = $v52195dae0174459c5f066fa0df053c26 LIMIT 0,1
SQL;
SELECT `source_id` FROM `$vaab9e1de16f38176f86d7a92ba337a8d` WHERE `source_id` != $v52195dae0174459c5f066fa0df053c26 AND `new_id` = $vb80bb7740288fda1f201890375a60c8f LIMIT 0,1
SQL;
SELECT `%s` FROM `%s` WHERE `%s` = '%s' AND `%s` = '%s'
SQL;
INSERT INTO `%s` (`%s`, `%s`, `%s`, `%s`) VALUES ('%s', '%s', '%s', '%s')
SQL;
DELETE FROM `%s` WHERE `%s` = '%s'
SQL;
DELETE FROM `cms3_import_offer_price_type_list` WHERE `source_id` = $v52195dae0174459c5f066fa0df053c26 AND (`new_id` = $vb80bb7740288fda1f201890375a60c8f OR `old_id` = '{$v1fad63c9b56ba99b63a65cbfd3b3672a}')
SQL;
INSERT INTO `cms3_import_offer_price_type_list` (`source_id`, `old_id`, `new_id`) VALUES ($v52195dae0174459c5f066fa0df053c26, '{$v1fad63c9b56ba99b63a65cbfd3b3672a}', $vb80bb7740288fda1f201890375a60c8f)
SQL;
SELECT `new_id` FROM `cms3_import_offer_price_type_list` WHERE `old_id` = '{$v1fad63c9b56ba99b63a65cbfd3b3672a}' AND `source_id` = $v52195dae0174459c5f066fa0df053c26 LIMIT 0,1
SQL;
SELECT `source_id` FROM `$vaab9e1de16f38176f86d7a92ba337a8d` WHERE `source_id` = $v52195dae0174459c5f066fa0df053c26 AND `new_id` = $vb80bb7740288fda1f201890375a60c8f LIMIT 0,1
SQL;