<?php
 use UmiCms\Service;use UmiCms\System\Trade\Offer\iPrice;use UmiCms\System\Trade\Offer\Price\iMapper;class OfferPriceWrapper extends translatorWrapper {public function translate($va8cfde6331bd59eb2ac96f8911c4b666) {return $this->translateData($va8cfde6331bd59eb2ac96f8911c4b666);}protected function translateData(iPrice $v78a5eb43deef9a7b5b9ce157b9d52ac4) {$result = [];foreach (Service::TradeOfferPriceFacade()->extractAttributeList($v78a5eb43deef9a7b5b9ce157b9d52ac4) as $vd2eb444e35c0a71f0a85df8194acb5b6 => $v2063c1608d6e0baf80249c42e2be5804) {if ($vd2eb444e35c0a71f0a85df8194acb5b6 === iMapper::CURRENCY_ID) {continue;}$result[sprintf('@%s', $vd2eb444e35c0a71f0a85df8194acb5b6)] = $v2063c1608d6e0baf80249c42e2be5804;}$v62542be3d6b87b86fd4883b1f2a588fa = Service::CurrencyFacade();$vfe57874e452f6fd2e15b7cb0004098a2 = $v62542be3d6b87b86fd4883b1f2a588fa->getCurrent();$v95fc42381e1358da816d21235b0e80bd = $v62542be3d6b87b86fd4883b1f2a588fa->calculate($v78a5eb43deef9a7b5b9ce157b9d52ac4->getValue(), $v78a5eb43deef9a7b5b9ce157b9d52ac4->getCurrency(), $vfe57874e452f6fd2e15b7cb0004098a2);return $result + [    '@value' => $v95fc42381e1358da816d21235b0e80bd,    '@formatted_value' => sprintf('%.2f %s', $v95fc42381e1358da816d21235b0e80bd, $vfe57874e452f6fd2e15b7cb0004098a2->getSuffix()),    '@type_title' => $v78a5eb43deef9a7b5b9ce157b9d52ac4->getType()->getTitle()   ];}}