<?php
 use UmiCms\System\Trade\Offer\Price\iCollection;class OfferPriceCollectionWrapper extends translatorWrapper {public function translate($va8cfde6331bd59eb2ac96f8911c4b666) {return $this->translateData($va8cfde6331bd59eb2ac96f8911c4b666);}protected function translateData(iCollection $v761fc1a7e9f4596187a9a3d5b1194c47) {$result = [    '@count' => $v761fc1a7e9f4596187a9a3d5b1194c47->getCount(),    'nodes:price' => []   ];foreach ($v761fc1a7e9f4596187a9a3d5b1194c47 as $v78a5eb43deef9a7b5b9ce157b9d52ac4) {$result['nodes:price'][] = translatorWrapper::get($v78a5eb43deef9a7b5b9ce157b9d52ac4)->translate($v78a5eb43deef9a7b5b9ce157b9d52ac4);}return $result;}}