<?php
 interface iUmiObjectsExpiration {public function getLimit();public function isExpirationExists($v16b2b26000987faccb260b9d39df1269);public function getExpiredObjectsByTypeId($v5f694956811487225d15e973ca38fbab, $vaa9f73eea60a006820d0f8768bc8a3fc = 50);public function update($v16b2b26000987faccb260b9d39df1269, $v09bcb72d61c0d6d1eff5336da6881557 = false);public function add($v16b2b26000987faccb260b9d39df1269, $v09bcb72d61c0d6d1eff5336da6881557 = false);public function clear($v16b2b26000987faccb260b9d39df1269);}