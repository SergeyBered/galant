<?php
 namespace UmiCms\System\Data\Object\Property\Value;class LangId extends \umiObjectProperty {private $valueId;protected function loadValue() {$v16b2b26000987faccb260b9d39df1269 = (int) $this->getObjectId();$v945100186b119048837b9859c2c46410 = (int) $this->getFieldId();$v80071f37861c360a27b7327e132c911a = $this->getTableName();$v1b1cc7f086b3f074da452bc3129981eb = <<<SQL
SELECT `id`, `obj_id`, `field_id`, `lang_id` FROM `$v80071f37861c360a27b7327e132c911a` 
WHERE `obj_id` = $v16b2b26000987faccb260b9d39df1269 AND `field_id` = $v945100186b119048837b9859c2c46410 LIMIT 0, 1
SQL;
INSERT INTO `$v80071f37861c360a27b7327e132c911a` (`obj_id`, `field_id`, `lang_id`) 
VALUES ($v16b2b26000987faccb260b9d39df1269, $v945100186b119048837b9859c2c46410, $vf585b7f018bb4ced15a03683a733e50b)
SQL;
UPDATE `$v80071f37861c360a27b7327e132c911a` SET `lang_id` = $vf585b7f018bb4ced15a03683a733e50b WHERE `id` = $vdfc5e241a5663b574a0859fe0e4ebe90
SQL;