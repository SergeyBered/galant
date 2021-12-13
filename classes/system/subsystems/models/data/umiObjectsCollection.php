<?php
 use UmiCms\Service;class umiObjectsCollection extends singleton implements iSingleton, iUmiObjectsCollection {private $objects = [];private $updatedObjects = [];protected function __construct() {}public static function getInstance($v4a8a08f09d37b73795649038408b5f33 = null) {return parent::getInstance(__CLASS__);}public static function isGuideItemsOrderedById() {$vc3f4c753beb9cb66d27cc964ad4c924c = Service::Registry()->get('//settings/ignore_guides_sort');if ($vc3f4c753beb9cb66d27cc964ad4c924c) {return true;}return (bool) mainConfiguration::getInstance()->get('kernel', 'order-guide-items-by-id');}public function isLoaded($vb80bb7740288fda1f201890375a60c8f) {if (!is_int($vb80bb7740288fda1f201890375a60c8f) && !is_string($vb80bb7740288fda1f201890375a60c8f)) {return false;}return array_key_exists($vb80bb7740288fda1f201890375a60c8f, $this->objects);}public function isExists($vb80bb7740288fda1f201890375a60c8f, $v5f694956811487225d15e973ca38fbab = false) {if (!is_numeric($vb80bb7740288fda1f201890375a60c8f)) {return false;}$vdd72c7e6b438fd5745e06d5af3ba9b2f = is_numeric($v5f694956811487225d15e973ca38fbab);if (!$vdd72c7e6b438fd5745e06d5af3ba9b2f && func_num_args() > 1) {return false;}$vb80bb7740288fda1f201890375a60c8f = (int) $vb80bb7740288fda1f201890375a60c8f;$v3f9178c25b78ed8bed19091bcb62e266 = " `id` = $vb80bb7740288fda1f201890375a60c8f";if ($vdd72c7e6b438fd5745e06d5af3ba9b2f) {$v5f694956811487225d15e973ca38fbab = (int) $v5f694956811487225d15e973ca38fbab;$v3f9178c25b78ed8bed19091bcb62e266 .= " AND `type_id` = $v5f694956811487225d15e973ca38fbab";}$v1b1cc7f086b3f074da452bc3129981eb = <<<SQL
SELECT `id` FROM `cms3_objects` WHERE $v3f9178c25b78ed8bed19091bcb62e266 LIMIT 0,1
SQL;
SELECT id
FROM   `cms3_objects`
WHERE  ${v20012c0b3e5db47f77aef7ef52598f71}
       ${ve1ba59ed55820ca11c343ef4c47793ff}
LIMIT  1
QUERY;
SELECT o.id,
	   o.name,
	   o.type_id,
	   o.is_locked,
	   o.owner_id,
	   o.guid AS `guid`,
	   t.guid AS `type_guid`,
	   o.updatetime,
	   o.ord
FROM   cms3_objects `o`,
	   cms3_object_types `t`
WHERE  o.type_id = $vb80bb7740288fda1f201890375a60c8f
	   AND o.type_id = t.id
SQL;
SELECT `id` FROM `cms3_objects` WHERE `guid` = '{$v1e0ca5b1252f1f6b1e0ac91be7e7219e}' LIMIT 0,1
SQL;
	SELECT o.id,
		   o.name,
		   o.type_id,
		   o.is_locked,
		   o.owner_id,
		   o.guid AS `guid`,
		   t.guid AS `type_guid`,
		   o.updatetime,
		   o.ord
	FROM   cms3_objects `o`,
		   cms3_object_types `t`
	WHERE  o.id IN ({$v5a2576254d428ddc22a03fac145c8749})
		   AND o.type_id = t.id
QUERY;
INSERT INTO cms3_objects VALUES(NULL, NULL, NULL, NULL, $v5f694956811487225d15e973ca38fbab, NULL, 0, NULL)
SQL;
INSERT INTO `cms3_objects` (`name`, `guid`, `is_locked`, `type_id`, `owner_id`, `ord`, `updatetime`)
SELECT `name`, `guid`, `is_locked`, `type_id`, `owner_id`, `ord`, `updatetime`
FROM `cms3_objects` WHERE `id` = $vb80bb7740288fda1f201890375a60c8f
SQL;
INSERT INTO `$vd786b32f1fc780f2e4f1b9a638f20089` (`obj_id`, `field_id`, `int_val`, `varchar_val`, `text_val`, `rel_val`, `tree_val`, `float_val`)
SELECT $vb15d7cc6038948c5f9aae452c262d0cb as `obj_id`, `field_id`, `int_val`, `varchar_val`, `text_val`, `rel_val`, `tree_val`, `float_val`
FROM `$vd786b32f1fc780f2e4f1b9a638f20089` WHERE `obj_id` = $vb80bb7740288fda1f201890375a60c8f
SQL;
INSERT INTO `$v6481430c31dc2d69eef9755166009a96` (`obj_id`, `field_id`, `src`, `alt`, `title`, `ord`)
SELECT $vb15d7cc6038948c5f9aae452c262d0cb as `obj_id`, `field_id`, `src`, `alt`, `title`, `ord`
FROM `$v6481430c31dc2d69eef9755166009a96` WHERE `obj_id` = $vb80bb7740288fda1f201890375a60c8f
SQL;
INSERT INTO `$v04bfa0a237da4a2db6a7587f5bdfa042` (`obj_id`, `field_id`, `src`, `title`, `ord`)
SELECT $vb15d7cc6038948c5f9aae452c262d0cb as `obj_id`, `field_id`, `src`, `title`, `ord`
FROM `$v04bfa0a237da4a2db6a7587f5bdfa042` WHERE `obj_id` = $vb80bb7740288fda1f201890375a60c8f
SQL;
INSERT INTO `$v43d5a664cec7d50d0db5e48b0444f5c7` (`obj_id`, `field_id`, `domain_id`)
SELECT $vb15d7cc6038948c5f9aae452c262d0cb as `obj_id`, `field_id`, `domain_id`
FROM `$v43d5a664cec7d50d0db5e48b0444f5c7` WHERE `obj_id` = $vb80bb7740288fda1f201890375a60c8f
SQL;
INSERT INTO `$vd5b9631e98a7ed194a9b608875bf49b8` (`obj_id`, `field_id`, `cnt`)
SELECT $vb15d7cc6038948c5f9aae452c262d0cb as `obj_id`, `field_id`, `cnt`
FROM `$vd5b9631e98a7ed194a9b608875bf49b8` WHERE `obj_id` = $vb80bb7740288fda1f201890375a60c8f
SQL;
INSERT INTO `$vcc9a49f501227168c678e3c615c171ed` (`obj_id`, `field_id`, `offer_id`)
SELECT $vb15d7cc6038948c5f9aae452c262d0cb as `obj_id`, `field_id`, `offer_id`
FROM `$vcc9a49f501227168c678e3c615c171ed` WHERE `obj_id` = $vb80bb7740288fda1f201890375a60c8f
SQL;
UPDATE `cms3_objects`
SET `ord` = `ord` + 1
WHERE $vf7252e33f6f4e64cffdca52a60b66f80
AND `ord` >= $v719a86ee781d3f80c573e69fd9292a55;
SQL;
UPDATE `cms3_objects`
SET `ord` = `ord` + 1
WHERE $vf7252e33f6f4e64cffdca52a60b66f80
AND `ord` > $v719a86ee781d3f80c573e69fd9292a55;
SQL;
SELECT max(`ord`) as `ord` FROM `cms3_objects` WHERE $vf7252e33f6f4e64cffdca52a60b66f80
SQL;