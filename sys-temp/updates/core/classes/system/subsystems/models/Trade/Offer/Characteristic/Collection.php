<?php
 namespace UmiCms\System\Trade\Offer\Characteristic;use UmiCms\System\Orm\iEntity;use UmiCms\System\Orm\Entity\Map\Filter;use UmiCms\System\Trade\Offer\iCharacteristic;use UmiCms\System\Orm\Entity\Collection as AbstractCollection;class Collection extends AbstractCollection implements iCollection {public function filterByDataObject($vb80bb7740288fda1f201890375a60c8f) {return $this->filter([    iMapper::DATA_OBJECT_ID => [     Filter::COMPARE_TYPE_EQUALS => $vb80bb7740288fda1f201890375a60c8f    ]   ]);}public function filterByField($vb068931cc450442b63f5b3d276ea4297) {return $this->filter([    iMapper::NAME => [     Filter::COMPARE_TYPE_EQUALS => $vb068931cc450442b63f5b3d276ea4297    ]   ]);}public function extractDataObjectId() {return $this->extractField(iMapper::DATA_OBJECT_ID);}protected function isPushed(iEntity $vf5e638cc78dd325906c1298a0c21fb6b) {$v725f5890dd789bf0bb5855eee997ce80 = $this->get($vf5e638cc78dd325906c1298a0c21fb6b);if ($v725f5890dd789bf0bb5855eee997ce80 === null) {return false;}if ($v725f5890dd789bf0bb5855eee997ce80->hasDataObject() && $vf5e638cc78dd325906c1298a0c21fb6b->hasDataObject()) {return $v725f5890dd789bf0bb5855eee997ce80->getDataObjectId() === $vf5e638cc78dd325906c1298a0c21fb6b->getDataObjectId();}return false;}}