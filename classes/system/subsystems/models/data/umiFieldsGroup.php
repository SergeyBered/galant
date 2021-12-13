<?php
 class umiFieldsGroup extends umiEntinty implements iUmiFieldsGroup {private $name;private $title;private $type_id;private $ord;private $is_active = true;private $is_visible = true;private $is_locked = false;private $tip = '';private $autoload_fields = false;private $fields = [];protected $store_type = 'fields_group';public function getName() {return $this->name;}public function getTitle($v06ce91230184ce59c2eb3ef5a4ad4d3b = false) {return $v06ce91230184ce59c2eb3ef5a4ad4d3b ? $this->title : $this->translateLabel($this->title);}public function getTypeId() {return $this->type_id;}public function getOrd() {return $this->ord;}public function getIsActive() {return $this->is_active;}public function getIsVisible() {return $this->is_visible;}public function getIsLocked() {return $this->is_locked;}public function getTip($v06ce91230184ce59c2eb3ef5a4ad4d3b = false) {return $v06ce91230184ce59c2eb3ef5a4ad4d3b ? $this->tip : $this->translateLabel($this->tip);}public function setName($vb068931cc450442b63f5b3d276ea4297) {if ($this->getName() != $vb068931cc450442b63f5b3d276ea4297) {$vb068931cc450442b63f5b3d276ea4297 = umiHierarchy::convertAltName($vb068931cc450442b63f5b3d276ea4297, '_');$vb068931cc450442b63f5b3d276ea4297 = umiObjectProperty::filterInputString($vb068931cc450442b63f5b3d276ea4297);$vb068931cc450442b63f5b3d276ea4297 = $vb068931cc450442b63f5b3d276ea4297 !== '' ? $vb068931cc450442b63f5b3d276ea4297 : '_';$this->name = $vb068931cc450442b63f5b3d276ea4297;$this->setIsUpdated();}}public function setTitle($vd5d3db1765287eef77d7927cc956f50a) {if ($this->getTitle() != $vd5d3db1765287eef77d7927cc956f50a) {$vd5d3db1765287eef77d7927cc956f50a = $this->translateI18n($vd5d3db1765287eef77d7927cc956f50a, 'fields-group');$vd5d3db1765287eef77d7927cc956f50a = umiObjectProperty::filterInputString($vd5d3db1765287eef77d7927cc956f50a);$this->title = $vd5d3db1765287eef77d7927cc956f50a;$this->setIsUpdated();}}public function setTypeId($v5f694956811487225d15e973ca38fbab) {$v5f694956811487225d15e973ca38fbab = (int) $v5f694956811487225d15e973ca38fbab;if ($this->getTypeId() != $v5f694956811487225d15e973ca38fbab) {$this->type_id = $v5f694956811487225d15e973ca38fbab;$this->setIsUpdated();}return true;}public function setOrd($v8bef1cc20ada3bef55fdf132cb2a1cb9) {$v8bef1cc20ada3bef55fdf132cb2a1cb9 = (int) $v8bef1cc20ada3bef55fdf132cb2a1cb9;if ($this->getOrd() != $v8bef1cc20ada3bef55fdf132cb2a1cb9) {$this->ord = $v8bef1cc20ada3bef55fdf132cb2a1cb9;$this->setIsUpdated();}}public function setIsActive($v367e854225a0810977297b3bedb2f309) {$v367e854225a0810977297b3bedb2f309 = (bool) $v367e854225a0810977297b3bedb2f309;if ($this->getIsActive() != $v367e854225a0810977297b3bedb2f309) {$this->is_active = $v367e854225a0810977297b3bedb2f309;$this->setIsUpdated();}}public function setIsVisible($v19fad0416b4b101ab72faccf4c323024) {$v19fad0416b4b101ab72faccf4c323024 = (bool) $v19fad0416b4b101ab72faccf4c323024;if ($this->getIsVisible() != $v19fad0416b4b101ab72faccf4c323024) {$this->is_visible = $v19fad0416b4b101ab72faccf4c323024;$this->setIsUpdated();}}public function setIsLocked($v73b8754d45983f35756b157ea439de8c) {$v73b8754d45983f35756b157ea439de8c = (bool) $v73b8754d45983f35756b157ea439de8c;if ($this->getIsLocked() != $v73b8754d45983f35756b157ea439de8c) {$this->is_locked = $v73b8754d45983f35756b157ea439de8c;$this->setIsUpdated();}}public function setTip($v21f671ba2273d4db289238e1bb9a2472) {if ($this->getTip() != $v21f671ba2273d4db289238e1bb9a2472) {$v6a2139364f96787c8ce1bbb0070b898c = $this->translateI18n($v21f671ba2273d4db289238e1bb9a2472, 'fields-group');$v21f671ba2273d4db289238e1bb9a2472 = umiObjectProperty::filterInputString($v6a2139364f96787c8ce1bbb0070b898c);$this->tip = $v21f671ba2273d4db289238e1bb9a2472;$this->setIsUpdated();}}protected function loadInfo($vf1965a857bc285d26fe22023aa5ab50d = false) {if (!is_array($vf1965a857bc285d26fe22023aa5ab50d) || count($vf1965a857bc285d26fe22023aa5ab50d) < 9) {$v4717d53ebfdfea8477f780ec66151dcb = ConnectionPool::getInstance()->getConnection();$v817f7de13f58df29b13a9570082097da = (int) $this->getId();$vac5c74b64b4b8352ef2f181affb5ac2a = <<<SQL
SELECT id, name, title, type_id, is_active, is_visible, is_locked, tip, ord 
FROM cms3_object_field_groups WHERE id = $v817f7de13f58df29b13a9570082097da LIMIT 0,1
SQL;
UPDATE cms3_object_field_groups
SET    NAME = '{$vb068931cc450442b63f5b3d276ea4297}',
       title = '{$vd5d3db1765287eef77d7927cc956f50a}',
       type_id = '{$v5f694956811487225d15e973ca38fbab}',
       is_active = '{$v367e854225a0810977297b3bedb2f309}',
       is_visible = '{$v19fad0416b4b101ab72faccf4c323024}',
       ord = '{$v8bef1cc20ada3bef55fdf132cb2a1cb9}',
       is_locked = '{$v73b8754d45983f35756b157ea439de8c}',
       tip = '{$v6a2139364f96787c8ce1bbb0070b898c}'
WHERE  id = '{$this->id}'
QUERY;
SELECT cof.id, cof.name, cof.title, cof.is_locked, cof.is_inheritable, cof.is_visible, cof.field_type_id,
       cof.guide_id, cof.in_search, cof.in_filter, cof.tip, cof.is_required, cof.sortable, cof.is_system,
       cof.restriction_id, cof.is_important
FROM cms3_fields_controller cfc, cms3_object_fields cof
WHERE cfc.group_id = '{$this->id}' AND cof.id = cfc.field_id ORDER BY cfc.ord ASC
SQL;
INSERT INTO cms3_fields_controller (field_id, group_id, ord)
VALUES('{$v945100186b119048837b9859c2c46410}', '{$this->id}', '{$v8bef1cc20ada3bef55fdf132cb2a1cb9}')
SQL;
SELECT ord FROM cms3_fields_controller
WHERE group_id = '{$v47db2588331bbe530c80dd001fc60aed}' AND field_id = '{$ve2e125f7ad54e80b659a4b3e87bf8d4a}'
SQL;
UPDATE cms3_fields_controller
SET ord = (ord + 1)
WHERE group_id = '{$this->id}' AND ord >= '{$v8437225ef7c926cdd9bc4b9783a3be54}'
SQL;
UPDATE cms3_fields_controller
SET ord = '{$v8437225ef7c926cdd9bc4b9783a3be54}', group_id = '$v47db2588331bbe530c80dd001fc60aed'
WHERE group_id = '{$this->id}' AND field_id = '{$v945100186b119048837b9859c2c46410}'
SQL;