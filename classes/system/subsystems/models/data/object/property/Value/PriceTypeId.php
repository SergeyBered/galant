<?php
 namespace UmiCms\System\Data\Object\Property\Value;class PriceTypeId extends \umiObjectProperty {private $valueId;protected function loadValue() {$v16b2b26000987faccb260b9d39df1269 = (int) $this->getObjectId();$v945100186b119048837b9859c2c46410 = (int) $this->getFieldId();$v80071f37861c360a27b7327e132c911a = $this->getTableName();$v1b1cc7f086b3f074da452bc3129981eb = <<<SQL
SELECT `id`, `obj_id`, `field_id`, `price_type_id` FROM `$v80071f37861c360a27b7327e132c911a` 
WHERE `obj_id` = $v16b2b26000987faccb260b9d39df1269 AND `field_id` = $v945100186b119048837b9859c2c46410 LIMIT 0, 1
SQL;
INSERT INTO `$v80071f37861c360a27b7327e132c911a` (`obj_id`, `field_id`, `price_type_id`) 
VALUES ($v16b2b26000987faccb260b9d39df1269, $v945100186b119048837b9859c2c46410, $va29d79168357c56b48f38e38bbc4df39)
SQL;
UPDATE `$v80071f37861c360a27b7327e132c911a` SET `price_type_id` = $va29d79168357c56b48f38e38bbc4df39 WHERE `id` = $vdfc5e241a5663b574a0859fe0e4ebe90
SQL;