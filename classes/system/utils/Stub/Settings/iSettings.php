<?php
 namespace UmiCms\Classes\System\Utils\Stub\Settings;use UmiCms\Classes\System\Utils\Settings\iSettings as iMainSettings;interface iSettings extends iMainSettings {const STUB_DIRECTORY = '/styles/common/errors';const FILE_NAME = '/userStub';const FILE_EXTENSION = '.html';public function isIpStub();public function setIpStub($ve8f65fd8d973f9985dc7ea3cf1614ae1);public function isDisableRobotIndex();public function setDisableRobotIndex($vfada7443f242172212e4b0734b76fab5);public function getStubContent();public function setStubContent($v9a0364b9e99bb480dd25e1f0284c8555);public function getWhiteList();public function addToWhiteList($v957b527bcfbad2e80f58d20683931435);public function isUseBlackList();public function setUseBlackList($v181c94263f0b71f3aac03c6e252db5fd);public function getBlackList();public function addToBlackList($v957b527bcfbad2e80f58d20683931435);public function getStubFilePath();}