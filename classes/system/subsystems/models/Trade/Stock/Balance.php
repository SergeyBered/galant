<?php
 namespace UmiCms\System\Trade\Stock;use UmiCms\System\Trade\iOffer;use UmiCms\System\Trade\iStock;use UmiCms\System\Orm\Composite\Entity;class Balance extends Entity implements iBalance {protected $offerId;protected $stockId;protected $value = 0;protected $offer;protected $stock;public function getOfferId() {return $this->offerId;}public function setOfferId($vb80bb7740288fda1f201890375a60c8f) {if (!is_int($vb80bb7740288fda1f201890375a60c8f) || $vb80bb7740288fda1f201890375a60c8f <= 0) {throw new \ErrorException('Incorrect trade stock balance offer id given');}$this->offer = null;return $this->setDifferentValue('offerId', $vb80bb7740288fda1f201890375a60c8f);}public function getStockId() {return $this->stockId;}public function setStockId($vb80bb7740288fda1f201890375a60c8f) {if (!is_int($vb80bb7740288fda1f201890375a60c8f) || $vb80bb7740288fda1f201890375a60c8f <= 0) {throw new \ErrorException('Incorrect trade stock balance stock id given');}$this->stock = null;return $this->setDifferentValue('stockId', $vb80bb7740288fda1f201890375a60c8f);}public function getValue() {return $this->value;}public function setValue($v2063c1608d6e0baf80249c42e2be5804) {if (!is_int($v2063c1608d6e0baf80249c42e2be5804) || $v2063c1608d6e0baf80249c42e2be5804 < 0) {throw new \ErrorException('Incorrect trade stock balance value given');}return $this->setDifferentValue('value', $v2063c1608d6e0baf80249c42e2be5804);}public function getOffer() {if ($this->offer === null) {$this->loadRelation(Balance\iMapper::OFFER);}return $this->offer;}public function setOffer(iOffer $vd60db28d94d538bbb249dcc7f2273ab1) {return $this->setOfferId($vd60db28d94d538bbb249dcc7f2273ab1->getId())    ->setDifferentValue('offer', $vd60db28d94d538bbb249dcc7f2273ab1);}public function getStock() {if ($this->stock === null) {$this->loadRelation(Balance\iMapper::STOCK);}return $this->stock;}public function setStock(iStock $v908880209a64ea539ae8dc5fdb7e0a91) {return $this->setStockId($v908880209a64ea539ae8dc5fdb7e0a91->getId())    ->setDifferentValue('stock', $v908880209a64ea539ae8dc5fdb7e0a91);}}