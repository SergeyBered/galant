<?php
 abstract class baseRestriction {protected $errorMessage = 'restriction-error-common',   $id, $title, $classPrefix, $fieldTypeId;const SYSTEM_RESTRICTION_LIST = ['webFormMessage'];final public static function get($v6b1a57fa235477758817df3c91158006) {static $v0fea6a13c52b4d4725368f24b045ca84;if (isset($v0fea6a13c52b4d4725368f24b045ca84[$v6b1a57fa235477758817df3c91158006]) && $v0fea6a13c52b4d4725368f24b045ca84[$v6b1a57fa235477758817df3c91158006] instanceof baseRestriction) {return $v0fea6a13c52b4d4725368f24b045ca84[$v6b1a57fa235477758817df3c91158006];}$v6b1a57fa235477758817df3c91158006 = (int) $v6b1a57fa235477758817df3c91158006;$v4717d53ebfdfea8477f780ec66151dcb = ConnectionPool::getInstance()->getConnection();$vac5c74b64b4b8352ef2f181affb5ac2a = <<<SQL
SELECT `class_prefix`, `title`, `field_type_id`
FROM `cms3_object_fields_restrictions`
WHERE `id` = '{$v6b1a57fa235477758817df3c91158006}'
SQL;
INSERT INTO `cms3_object_fields_restrictions`
	(`class_prefix`, `title`, `field_type_id`)
	VALUES ('{$v6f65638723a69dfa99474478b83b7b17}', '{$vd5d3db1765287eef77d7927cc956f50a}', '{$ve2aeb4e882d60b1eb4b7c8cd97986a28}')
SQL;