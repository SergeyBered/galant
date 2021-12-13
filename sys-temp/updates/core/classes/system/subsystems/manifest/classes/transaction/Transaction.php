<?php
 class Transaction implements iTransaction, iStateFileWorker {use tStateFileWorker;use tReadinessWorker;protected $name;protected $actionList = [];protected $callback;public function __construct($vb068931cc450442b63f5b3d276ea4297) {$this->name = (string) $vb068931cc450442b63f5b3d276ea4297;}public function getName() {return $this->name;}public function getTitle() {return getLabel('label-' . $this->getName());}public function addAction(iAction $v418c5509e2171d55b0aee5c2ea4442b5) {$this->actionList[$v418c5509e2171d55b0aee5c2ea4442b5->getName()] = $v418c5509e2171d55b0aee5c2ea4442b5;}public function execute() {$vb3bd7ee1d18d0e6663190bec01278879 = $this->getReadyList();foreach ($this->actionList as $v418c5509e2171d55b0aee5c2ea4442b5) {if (in_array($v418c5509e2171d55b0aee5c2ea4442b5->getName(), $vb3bd7ee1d18d0e6663190bec01278879)) {continue;}$this->executeAction($v418c5509e2171d55b0aee5c2ea4442b5);if (!$v418c5509e2171d55b0aee5c2ea4442b5 instanceof iReadinessWorker) {$vb3bd7ee1d18d0e6663190bec01278879[] = $v418c5509e2171d55b0aee5c2ea4442b5->getName();}elseif ($v418c5509e2171d55b0aee5c2ea4442b5->isReady()) {$vb3bd7ee1d18d0e6663190bec01278879[] = $v418c5509e2171d55b0aee5c2ea4442b5->getName();}$this->setReadyList($vb3bd7ee1d18d0e6663190bec01278879);}if (umiCount($this->getReadyList()) == umiCount($this->actionList)) {$this->setIsReady();$this->resetState();}$this->saveState();}public function rollback() {$this->getCallback()->onBeforeRollback($this);$vecd8c7636815f81e0ffed9cc6c0941c0 = array_reverse($this->getReadyList());foreach ($vecd8c7636815f81e0ffed9cc6c0941c0 as $vb35f75a8f71e57273061dd1a7e1c2ae5) {try {$v418c5509e2171d55b0aee5c2ea4442b5 = $this->actionList[$vb35f75a8f71e57273061dd1a7e1c2ae5];$this->getCallback()->onBeforeRollback($v418c5509e2171d55b0aee5c2ea4442b5);$v418c5509e2171d55b0aee5c2ea4442b5->rollback();$this->getCallback()->onAfterRollback($v418c5509e2171d55b0aee5c2ea4442b5);}catch (Exception $v42552b1f133f9f8eb406d4f306ea9fd1) {$this->getCallback()->onException($v418c5509e2171d55b0aee5c2ea4442b5, $v42552b1f133f9f8eb406d4f306ea9fd1);}}$this->resetState();$this->saveState();$this->getCallback()->onAfterRollback($this);}public function setCallback(iAtomicOperationCallback $v924a8ceeac17f54d3be3f8cdf1c04eb2) {$this->callback = $v924a8ceeac17f54d3be3f8cdf1c04eb2;}protected function getReadyList() {$vb3bd7ee1d18d0e6663190bec01278879 = $this->getStatePart('ready');return is_array($vb3bd7ee1d18d0e6663190bec01278879) ? $vb3bd7ee1d18d0e6663190bec01278879 : [];}protected function setReadyList(array $vb3bd7ee1d18d0e6663190bec01278879) {return $this->setStatePart('ready', $vb3bd7ee1d18d0e6663190bec01278879);}protected function executeAction(iAction $v418c5509e2171d55b0aee5c2ea4442b5) {try {$this->getCallback()->onBeforeExecute($v418c5509e2171d55b0aee5c2ea4442b5);$v418c5509e2171d55b0aee5c2ea4442b5->execute();$this->getCallback()->onAfterExecute($v418c5509e2171d55b0aee5c2ea4442b5);}catch (Exception $v42552b1f133f9f8eb406d4f306ea9fd1) {$this->getCallback()->onException($v418c5509e2171d55b0aee5c2ea4442b5, $v42552b1f133f9f8eb406d4f306ea9fd1);$this->getCallback()->onBeforeRollback($v418c5509e2171d55b0aee5c2ea4442b5);$v418c5509e2171d55b0aee5c2ea4442b5->rollback();$this->getCallback()->onAfterRollback($v418c5509e2171d55b0aee5c2ea4442b5);throw $v42552b1f133f9f8eb406d4f306ea9fd1;}}protected function getCallback() {if (!$this->callback instanceof iAtomicOperationCallback) {throw new Exception('You should set iAtomicOperationCallback before use it');}return $this->callback;}}