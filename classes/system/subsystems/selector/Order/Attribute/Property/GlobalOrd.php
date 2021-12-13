<?php
 namespace UmiCms\System\Selector\Order\Attribute\Property;use UmiCms\System\Selector\Order\Attribute\Property;class GlobalOrd extends Property implements iGlobalOrd {protected $connection;public function setConnection(\IConnection $v4717d53ebfdfea8477f780ec66151dcb) : iGlobalOrd {$this->connection = $v4717d53ebfdfea8477f780ec66151dcb;return $this;}public function beforeQuery(\selectorExecutor $vb1925939f66c2e4625aadb18cabf1cea) : void {$vbf95cbea2fbc6aab956a058a7afb3e45 = $vb1925939f66c2e4625aadb18cabf1cea->getHierarchyElementCandidateIdList();$v85cd96ae4e27f5b0cd3b199e4c39879a = $vb1925939f66c2e4625aadb18cabf1cea->getObjectTypeIdList();$v418f3315de6802dc0a9ce776bf1a19b8 = $vb1925939f66c2e4625aadb18cabf1cea->getHierarchyTypeIdList();if (count($vbf95cbea2fbc6aab956a058a7afb3e45) === 0 && count($v85cd96ae4e27f5b0cd3b199e4c39879a) === 0 && count($v418f3315de6802dc0a9ce776bf1a19b8) === 0) {return;}$this->dropTemporaryTable();if ($vbf95cbea2fbc6aab956a058a7afb3e45) {$this->createTemporaryTableByPageIdList($vbf95cbea2fbc6aab956a058a7afb3e45);return;}if ($v85cd96ae4e27f5b0cd3b199e4c39879a) {$this->createTemporaryTableByObjectTypeIdList($v85cd96ae4e27f5b0cd3b199e4c39879a);return;}if ($v418f3315de6802dc0a9ce776bf1a19b8) {$this->createTemporaryTableByHierarchyTypeIdList($v418f3315de6802dc0a9ce776bf1a19b8);return;}}public function afterQuery(\selectorExecutor $vb1925939f66c2e4625aadb18cabf1cea) : void {$this->dropTemporaryTable();}private function createTemporaryTableByPageIdList(array $vbf95cbea2fbc6aab956a058a7afb3e45) : void {$v741c85561e43c92e212a8b0007c338c4 = implode(', ', $vbf95cbea2fbc6aab956a058a7afb3e45);$vac5c74b64b4b8352ef2f181affb5ac2a = <<<SQL
CREATE TEMPORARY TABLE `cms3_hierarchy_global_ord`
SELECT child.`id`, child.`ord`, sum(parents.`ord`) as parent_ord
FROM `cms3_hierarchy` as child
LEFT JOIN `cms3_hierarchy_relations` relations ON relations.child_id = child.`id`
LEFT JOIN `cms3_hierarchy` parents ON parents.id = relations.rel_id
WHERE child.`id` IN ($v741c85561e43c92e212a8b0007c338c4)
GROUP BY child.`id`;
SQL;   try {$this->connection->query($vac5c74b64b4b8352ef2f181affb5ac2a);}catch (\databaseException $v42552b1f133f9f8eb406d4f306ea9fd1) {throw new \selectorException('Cannot create temporary table `cms3_hierarchy_global_ord` by page id list');}}private function createTemporaryTableByObjectTypeIdList(array $v85cd96ae4e27f5b0cd3b199e4c39879a) : void {$vc0d7dab0f58a94ba3e59346ece172993 = implode(', ', $v85cd96ae4e27f5b0cd3b199e4c39879a);$vac5c74b64b4b8352ef2f181affb5ac2a = <<<SQL
CREATE TEMPORARY TABLE `cms3_hierarchy_global_ord`
SELECT child.`id`, child.`ord`, sum(parents.`ord`) as parent_ord
FROM `cms3_hierarchy` as child
LEFT JOIN `cms3_hierarchy_relations` relations ON relations.child_id = child.`id`
LEFT JOIN `cms3_hierarchy` parents ON parents.id = relations.rel_id
WHERE child.`id` IN (SELECT `id` FROM `cms3_hierarchy` WHERE `obj_id` IN (
	SELECT `id` FROM `cms3_objects` WHERE `type_id` IN ($vc0d7dab0f58a94ba3e59346ece172993)
))
GROUP BY child.`id`;
SQL;   try {$this->connection->query($vac5c74b64b4b8352ef2f181affb5ac2a);}catch (\databaseException $v42552b1f133f9f8eb406d4f306ea9fd1) {throw new \selectorException('Cannot create temporary table `cms3_hierarchy_global_ord` by object type id list');}}private function createTemporaryTableByHierarchyTypeIdList(array $v418f3315de6802dc0a9ce776bf1a19b8) : void {$vb00c7c3a173817111b598deec463f305 = implode(', ', $v418f3315de6802dc0a9ce776bf1a19b8);$vac5c74b64b4b8352ef2f181affb5ac2a = <<<SQL
CREATE TEMPORARY TABLE `cms3_hierarchy_global_ord`
SELECT child.`id`, child.`ord`, sum(parents.`ord`) as parent_ord
FROM `cms3_hierarchy` as child
LEFT JOIN `cms3_hierarchy_relations` relations ON relations.child_id = child.`id`
LEFT JOIN `cms3_hierarchy` parents ON parents.id = relations.rel_id
WHERE child.`id` IN (SELECT `id` FROM `cms3_hierarchy` WHERE `type_id` IN ($vb00c7c3a173817111b598deec463f305))
GROUP BY child.`id`;
SQL;   try {$this->connection->query($vac5c74b64b4b8352ef2f181affb5ac2a);}catch (\databaseException $v42552b1f133f9f8eb406d4f306ea9fd1) {throw new \selectorException('Cannot create temporary table `cms3_hierarchy_global_ord` by hierarchy type id list');}}private function dropTemporaryTable() : void {$vac5c74b64b4b8352ef2f181affb5ac2a = <<<SQL
DROP TEMPORARY TABLE IF EXISTS `cms3_hierarchy_global_ord`;
SQL;   try {$this->connection->query($vac5c74b64b4b8352ef2f181affb5ac2a);}catch (\databaseException $v42552b1f133f9f8eb406d4f306ea9fd1) {throw new \selectorException('Cannot drop temporary table `cms3_hierarchy_global_ord`');}}}