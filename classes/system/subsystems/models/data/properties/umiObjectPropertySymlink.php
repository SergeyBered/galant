<?php
 class umiObjectPropertySymlink extends umiObjectProperty {protected function loadValue() {$v9b207167e5381c47682c6b4f58a623fb = [];$v945100186b119048837b9859c2c46410 = $this->field_id;$v475d6424dac268bb5fffd0235530c333 = umiHierarchy::getInstance();$v8d777f385d3dfec8815d20f7496026dc = $this->getPropData();if ($v8d777f385d3dfec8815d20f7496026dc) {$v475d6424dac268bb5fffd0235530c333->loadElements($v8d777f385d3dfec8815d20f7496026dc['tree_val']);foreach ($v8d777f385d3dfec8815d20f7496026dc['tree_val'] as $v3a6d0284e743dc4a9b86f97d6dd1a3bf) {if ($v3a6d0284e743dc4a9b86f97d6dd1a3bf === null) {continue;}$v8e2dcfd7e7e24b1ca76c1193f645902b = $v475d6424dac268bb5fffd0235530c333->getElement((int) $v3a6d0284e743dc4a9b86f97d6dd1a3bf);if ($v8e2dcfd7e7e24b1ca76c1193f645902b === false || !$v8e2dcfd7e7e24b1ca76c1193f645902b->getIsActive()) {continue;}$v9b207167e5381c47682c6b4f58a623fb[] = $v8e2dcfd7e7e24b1ca76c1193f645902b;}return $v9b207167e5381c47682c6b4f58a623fb;}$v4717d53ebfdfea8477f780ec66151dcb = $this->getConnection();$v80071f37861c360a27b7327e132c911a = $this->getTableName();$vac5c74b64b4b8352ef2f181affb5ac2a = "SELECT tree_val FROM {$v80071f37861c360a27b7327e132c911a} WHERE obj_id = '{$this->object_id}' AND field_id = '{$v945100186b119048837b9859c2c46410}'";$result = $v4717d53ebfdfea8477f780ec66151dcb->queryResult($vac5c74b64b4b8352ef2f181affb5ac2a);$result->setFetchType(IQueryResult::FETCH_ROW);foreach ($result as $vf1965a857bc285d26fe22023aa5ab50d) {$v3a6d0284e743dc4a9b86f97d6dd1a3bf = array_shift($vf1965a857bc285d26fe22023aa5ab50d);if ($v3a6d0284e743dc4a9b86f97d6dd1a3bf === null) {continue;}$v8e2dcfd7e7e24b1ca76c1193f645902b = $v475d6424dac268bb5fffd0235530c333->getElement((int) $v3a6d0284e743dc4a9b86f97d6dd1a3bf);if ($v8e2dcfd7e7e24b1ca76c1193f645902b === false || !$v8e2dcfd7e7e24b1ca76c1193f645902b->getIsActive()) {continue;}$v9b207167e5381c47682c6b4f58a623fb[] = $v8e2dcfd7e7e24b1ca76c1193f645902b;}return $v9b207167e5381c47682c6b4f58a623fb;}protected function saveValue() {$this->deleteCurrentRows();$vef019cabbf54484ac8984054c6fe670b = array_filter($this->value, function ($v2063c1608d6e0baf80249c42e2be5804) {return ($v2063c1608d6e0baf80249c42e2be5804 instanceof iUmiHierarchyElement) ? $v2063c1608d6e0baf80249c42e2be5804->getId() : (int) $v2063c1608d6e0baf80249c42e2be5804;});if (isEmptyArray($vef019cabbf54484ac8984054c6fe670b)) {return;}$v80071f37861c360a27b7327e132c911a = $this->getTableName();$v1b1cc7f086b3f074da452bc3129981eb = <<<SQL
INSERT INTO `$v80071f37861c360a27b7327e132c911a` (`obj_id`, `field_id`, `tree_val`) VALUES
SQL;   $v16b2b26000987faccb260b9d39df1269 = (int) $this->getObjectId();$v945100186b119048837b9859c2c46410 = (int) $this->getFieldId();foreach ($vef019cabbf54484ac8984054c6fe670b as $v331042c17673e19c71d18ad399d6957a) {$vb80bb7740288fda1f201890375a60c8f = ($v331042c17673e19c71d18ad399d6957a instanceof iUmiHierarchyElement) ? $v331042c17673e19c71d18ad399d6957a->getId() : (int) $v331042c17673e19c71d18ad399d6957a;$v1b1cc7f086b3f074da452bc3129981eb .= sprintf("(%d, %d, %d),", $v16b2b26000987faccb260b9d39df1269, $v945100186b119048837b9859c2c46410, $vb80bb7740288fda1f201890375a60c8f);}$v1b1cc7f086b3f074da452bc3129981eb = rtrim($v1b1cc7f086b3f074da452bc3129981eb, ',') . ';';$this->getConnection()->query($v1b1cc7f086b3f074da452bc3129981eb);$vb81ca7c0ccaa77e7aa91936ab0070695 = umiHierarchy::getInstance();foreach ($this->value as $v6a992d5529f459a44fee58c733255e86 => $v2063c1608d6e0baf80249c42e2be5804) {if ($v2063c1608d6e0baf80249c42e2be5804 instanceof iUmiHierarchyElement) {continue;}$this->value[$v6a992d5529f459a44fee58c733255e86] = $vb81ca7c0ccaa77e7aa91936ab0070695->getElement($v2063c1608d6e0baf80249c42e2be5804);}}protected function isNeedToSave(array $v7f7cfde5ec586119b48911a2c75851e5) {$v0382b9fd9ef50b6a335f35e0aaaebf99 = $this->value;$v0382b9fd9ef50b6a335f35e0aaaebf99 = $this->normaliseValue($v0382b9fd9ef50b6a335f35e0aaaebf99);$v7f7cfde5ec586119b48911a2c75851e5 = $this->normaliseValue($v7f7cfde5ec586119b48911a2c75851e5);if (umiCount($v0382b9fd9ef50b6a335f35e0aaaebf99) !== umiCount($v7f7cfde5ec586119b48911a2c75851e5)) {return true;}foreach ($v7f7cfde5ec586119b48911a2c75851e5 as $v75903fd2815e70b25d9b9d511f806f2b) {if (!in_array($v75903fd2815e70b25d9b9d511f806f2b, $v0382b9fd9ef50b6a335f35e0aaaebf99)) {return true;}}return false;}private function normaliseValue(array $vf09cc7ee3a9a93273f4b80601cafb00c) {if (umiCount($vf09cc7ee3a9a93273f4b80601cafb00c) == 0) {return $vf09cc7ee3a9a93273f4b80601cafb00c;}$v538eb62c1deb2956e1a9e6c8a9f40352 = [];foreach ($vf09cc7ee3a9a93273f4b80601cafb00c as $v2063c1608d6e0baf80249c42e2be5804) {switch (true) {case $v2063c1608d6e0baf80249c42e2be5804 instanceof iUmiEntinty: {$v538eb62c1deb2956e1a9e6c8a9f40352[] = (int) $v2063c1608d6e0baf80249c42e2be5804->getId();break;}case is_numeric($v2063c1608d6e0baf80249c42e2be5804): {$v538eb62c1deb2956e1a9e6c8a9f40352[] = (int) $v2063c1608d6e0baf80249c42e2be5804;break;}}}return $v538eb62c1deb2956e1a9e6c8a9f40352;}}