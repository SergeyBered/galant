<?php
 namespace UmiCms\Classes\System\Utils\Mail\Settings;use UmiCms\Classes\System\Utils\Settings\iSettings as iMainSettings;use UmiCms\Classes\System\Utils\Mail\Settings\Smtp\iSettings as iSmtpSettings;interface iSettings extends iMainSettings {public function getAdminEmail();public function setAdminEmail($v0c83f57c786a0b4a39efab23731c7ebc);public function getSenderEmail();public function setSenderEmail($v0c83f57c786a0b4a39efab23731c7ebc);public function getSenderName();public function setSenderName($vb068931cc450442b63f5b3d276ea4297);public function getEngine();public function setEngine($vad1943a9fd6d3d7ee1e6af41a5b0d3e7);public function isDisableParseContent();public function setDisableParseContent($vfada7443f242172212e4b0734b76fab5);public function getXMailer();public function setXMailer($v2063c1608d6e0baf80249c42e2be5804);public function Smtp();}