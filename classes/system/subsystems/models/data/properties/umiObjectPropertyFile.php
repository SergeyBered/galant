<?php
 use UmiCms\Service;class umiObjectPropertyFile extends umiObjectProperty {const SINGLE_FILE_ORDER = 1;protected function loadValue() {$vd97a187384fb2a6e45703dfaee973d62 = [];$v0fea6a13c52b4d4725368f24b045ca84 = $this->getPropData();if (isset($v0fea6a13c52b4d4725368f24b045ca84['file_val']) && !isEmptyArray($v0fea6a13c52b4d4725368f24b045ca84['file_val'])) {return $this->getFromCache($v0fea6a13c52b4d4725368f24b045ca84['file_val']);}$v4717d53ebfdfea8477f780ec66151dcb = $this->getConnection();$v80071f37861c360a27b7327e132c911a = $this->getTableName();$v16b2b26000987faccb260b9d39df1269 = (int) $this->getObjectId();$v945100186b119048837b9859c2c46410 = (int) $this->getFieldId();$vef5714e0519bfaa645cdff7d28843b70 =<<<SQL
SELECT `id`, `src`, `title`, `ord`
FROM `$v80071f37861c360a27b7327e132c911a`
WHERE `obj_id` = $v16b2b26000987faccb260b9d39df1269 AND `field_id` = $v945100186b119048837b9859c2c46410;
SQL;
INSERT INTO `$v80071f37861c360a27b7327e132c911a` (`obj_id`, `field_id`, `src`, `title`, `ord`) VALUES
($v16b2b26000987faccb260b9d39df1269, $v945100186b119048837b9859c2c46410, '$v25d902c24283ab8cfbac54dfa101ad31', '$vd5d3db1765287eef77d7927cc956f50a', $v70a17ffa722a3985b86d30b034ad06d7)
SQL;
SELECT max(`ord`) as ord FROM `$v80071f37861c360a27b7327e132c911a` WHERE `obj_id` = $v16b2b26000987faccb260b9d39df1269 AND `field_id` = $v945100186b119048837b9859c2c46410;
SQL;