<?php
 class CheckPermissionsAction extends Action {public function execute() {$ve6c2a6346c15ba2584950ab8e0f946f8 = $this->getParam('target');if (!file_exists($ve6c2a6346c15ba2584950ab8e0f946f8)) {throw new Exception("Doesn't exsist target \"{$ve6c2a6346c15ba2584950ab8e0f946f8}\"");}$v15d61712450a686a7f365adf4fef581f = $this->getParam('mode');switch ($v15d61712450a686a7f365adf4fef581f) {case 'write' : {if (!is_writable($ve6c2a6346c15ba2584950ab8e0f946f8)) {throw new Exception("Target must be writable \"{$ve6c2a6346c15ba2584950ab8e0f946f8}\"");}break;}case 'read' : {if (!is_readable($ve6c2a6346c15ba2584950ab8e0f946f8)) {throw new Exception("Target must be readable \"{$ve6c2a6346c15ba2584950ab8e0f946f8}\"");}break;}default : {throw new Exception("Unknown mode \"{$v15d61712450a686a7f365adf4fef581f}\", use \"write\" or \"read\"");}}}public function rollback() {}}