<?php
 namespace UmiCms\System\Data\Object\Property\Value;class MultipleFile extends \umiObjectPropertyFile {protected function loadValue() {$v0fea6a13c52b4d4725368f24b045ca84 = $this->getPropData();if (isset($v0fea6a13c52b4d4725368f24b045ca84['file_val']) && !isEmptyArray($v0fea6a13c52b4d4725368f24b045ca84['file_val'])) {return $this->getFromCache($v0fea6a13c52b4d4725368f24b045ca84['file_val']);}$v80071f37861c360a27b7327e132c911a = $this->getTableName();$v16b2b26000987faccb260b9d39df1269 = (int) $this->getObjectId();$v945100186b119048837b9859c2c46410 = (int) $this->getFieldId();$vef5714e0519bfaa645cdff7d28843b70 = <<<SQL
	SELECT `id`, `src`, `title`, `ord`
	FROM `$v80071f37861c360a27b7327e132c911a`
	WHERE `obj_id` = $v16b2b26000987faccb260b9d39df1269 AND `field_id` = $v945100186b119048837b9859c2c46410;
SQL;
INSERT INTO `$v80071f37861c360a27b7327e132c911a` (`obj_id`, `field_id`, `src`, `title`, `ord`) VALUES
SQL;