<?php
 namespace UmiCms\System\Utils\Image\Processor;class Factory implements iFactory {public function create() {return \imageUtils::getImageProcessor();}}