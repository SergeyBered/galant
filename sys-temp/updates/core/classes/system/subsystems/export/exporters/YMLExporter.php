<?php
 use UmiCms\Service;class YMLExporter extends umiExporter {public function setOutputBuffer() {$v7f2db423a49b305459147332fb01cf87 = Service::Response()    ->getCurrentBuffer();$v7f2db423a49b305459147332fb01cf87->charset($this->encoding);$v7f2db423a49b305459147332fb01cf87->contentType('text/xml');return $v7f2db423a49b305459147332fb01cf87;}public function export($v6f017b01ac7b836b216574ebb3f5d73c, $vd1051e3a7d64c17a9cba77188937d2cd) {$vb80bb7740288fda1f201890375a60c8f = getRequest('param0');$v100664c6e2c0333b19a729f2f3ddb7dd = $this->getExportPath();if (!file_exists($v100664c6e2c0333b19a729f2f3ddb7dd . $vb80bb7740288fda1f201890375a60c8f . 'el')) {$v24190bd07f7169496f08b7d03e8ec88a = getLabel('label-errors-no-information');$v78e731027d8fd50ed642340b7c9a63b3 = <<<HTML
<a href="$v24190bd07f7169496f08b7d03e8ec88a" target="blank">$v24190bd07f7169496f08b7d03e8ec88a</a>
HTML;
<?xml version="1.0" encoding="$v84bea1f0fd2ce16f7e562a9f06ef03d3"?>
<!DOCTYPE yml_catalog SYSTEM "shops.dtd">
<yml_catalog date="$v5486a4ee42bf560955c9377cdc6928f2">
	<shop>
XML;