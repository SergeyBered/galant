<?php
 class umiFieldTypeWrapper extends translatorWrapper {public function translate($va8cfde6331bd59eb2ac96f8911c4b666) {return $this->translateData($va8cfde6331bd59eb2ac96f8911c4b666);}protected function translateData(iUmiFieldType $v833750ac635fcc57dc33ecafe365f9a7) {$result = [    'attribute:id' => $v833750ac635fcc57dc33ecafe365f9a7->getId(),    'attribute:name' => $v833750ac635fcc57dc33ecafe365f9a7->getName($this->getOption(xmlTranslator::IGNORE_I18N)),    'attribute:data-type' => $v833750ac635fcc57dc33ecafe365f9a7->getDataType()   ];if ($v833750ac635fcc57dc33ecafe365f9a7->getIsMultiple()) {$result['attribute:multiple'] = 'multiple';}return $result;}}