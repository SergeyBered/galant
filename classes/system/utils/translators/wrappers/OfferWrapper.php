<?php
 use UmiCms\Service;use UmiCms\System\Trade\iOffer;class OfferWrapper extends translatorWrapper {public function translate($va8cfde6331bd59eb2ac96f8911c4b666) {return $this->translateData($va8cfde6331bd59eb2ac96f8911c4b666);}protected function translateData(iOffer $vd60db28d94d538bbb249dcc7f2273ab1) {$result = [];foreach (Service::TradeOfferFacade()->extractPropertyList($vd60db28d94d538bbb249dcc7f2273ab1) as $vb068931cc450442b63f5b3d276ea4297 => $v2063c1608d6e0baf80249c42e2be5804) {if (!is_object($v2063c1608d6e0baf80249c42e2be5804)) {$result[sprintf('@%s', $vb068931cc450442b63f5b3d276ea4297)] = $v2063c1608d6e0baf80249c42e2be5804;continue;}$result[$vb068931cc450442b63f5b3d276ea4297] = translatorWrapper::get($v2063c1608d6e0baf80249c42e2be5804)->translate($v2063c1608d6e0baf80249c42e2be5804);}return $result;}}