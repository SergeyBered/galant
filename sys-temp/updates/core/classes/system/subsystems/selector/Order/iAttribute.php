<?php
 namespace UmiCms\System\Selector\Order;interface iAttribute {public function asc();public function desc();public function rand();public function __get($v23a5b8ab834cb5140fa6665622eb6417);public function __isset($v23a5b8ab834cb5140fa6665622eb6417);public function beforeQuery(\selectorExecutor $vb1925939f66c2e4625aadb18cabf1cea) : void;public function afterQuery(\selectorExecutor $vb1925939f66c2e4625aadb18cabf1cea) : void;}