<?php
 interface iXmlImporter {public function __construct($v7c95caafbd5e4b5db3977617a0498de6 = false);public function loadXmlString($v58309fbfe87fa90ec9f4b9d78ead9d77);public function loadXmlFile($vd6fe1d0be6347b8ef2427fa629c04485);public function loadXmlDocument(DOMDocument $v9a09b4dfda82e3e665e31092d1c3ec8d);public function setDestinationElement($v8e2dcfd7e7e24b1ca76c1193f645902b);public function setAutoGuideCreation($vae1a55c0b778947dc65e0150c16befba = false);public function execute();public function demolish();public function enableEvents();public function disableEvents();public function setForcedDomainId($vb80bb7740288fda1f201890375a60c8f);public function getImportLog();public function getErrorCount();public function getCreatedEntityCount();public function getUpdatedEntityCount();public function getDeletedEntityCount();public function setWriteLogFile(bool $v16fc24b6ec7a83e5bb20c1bac4196454) : iXmlImporter;public function setImportFormat(string $vd0b86cf78681c016b42b6c54d1591ab9) : iXmlImporter;public function setImportId(int $v495a73fe6d3367859f634a689771d209) : iXmlImporter;public function setCalledFrom(string $vd4bfca8a72a308f3abe6e49e605fbf83) : iXmlImporter;}