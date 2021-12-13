<?php
 namespace UmiCms\Classes\System\MiddleWares;use \iDomainsCollection as iDomains;use UmiCms\Classes\System\Controllers\AbstractController;use UmiCms\System\Hierarchy\Domain\iDetector as iDomainDetector;trait tMirrorHandler {private $ve4e46deb7f9cc58c7abfb32e5570b6f3;private $v45651ec82e45766b3d707ee33df1a61a;public function setDomains(iDomains $ve4e46deb7f9cc58c7abfb32e5570b6f3) {$this->domains = $ve4e46deb7f9cc58c7abfb32e5570b6f3;return $this;}public function setDomainDetector(iDomainDetector $v45651ec82e45766b3d707ee33df1a61a) {$this->domainDetector = $v45651ec82e45766b3d707ee33df1a61a;return $this;}public function checkMirror($v15d61712450a686a7f365adf4fef581f = iMirrorHandler::MODE_REDIRECT) {$vf6afee894b3508441e878b464a92f4b0 = $this->domainDetector->detect();$v67b3dba8bc6778101892eb77249db32e = $this->getRequest()->host();if (!in_array($v67b3dba8bc6778101892eb77249db32e, [$vf6afee894b3508441e878b464a92f4b0->getHost(), $vf6afee894b3508441e878b464a92f4b0->getHost(true)])) {$v577e4cbed0f715952cd3a7f893f65608 = $this->domains->getDomainByHost($v67b3dba8bc6778101892eb77249db32e);$this->processRequestFromMirror($vf6afee894b3508441e878b464a92f4b0, $v577e4cbed0f715952cd3a7f893f65608, $v15d61712450a686a7f365adf4fef581f);}}private function processRequestFromMirror(\iDomain $vf6afee894b3508441e878b464a92f4b0, $v577e4cbed0f715952cd3a7f893f65608, $v15d61712450a686a7f365adf4fef581f) {$v10573b873d2fa5a365d558a45e328e47 = $this->getRequest();if ($v10573b873d2fa5a365d558a45e328e47->isCli()) {return;}$v18c8e14aa54da215ffd05da38751a2ac = !$v577e4cbed0f715952cd3a7f893f65608 instanceof \iDomain;if (!$v18c8e14aa54da215ffd05da38751a2ac && $v577e4cbed0f715952cd3a7f893f65608->getId() !== $vf6afee894b3508441e878b464a92f4b0->getId()) {return;}$v7f2db423a49b305459147332fb01cf87 = $this->getBuffer();if ($v15d61712450a686a7f365adf4fef581f == iMirrorHandler::MODE_REDIRECT) {$v9305b73d359bd06734fee0b3638079e1 = $vf6afee894b3508441e878b464a92f4b0->getUrl() . $v10573b873d2fa5a365d558a45e328e47->uri();$v7f2db423a49b305459147332fb01cf87->redirect($v9305b73d359bd06734fee0b3638079e1);}if ($v15d61712450a686a7f365adf4fef581f == iMirrorHandler::MODE_CRASH && $v18c8e14aa54da215ffd05da38751a2ac) {$v7f2db423a49b305459147332fb01cf87->crash('invalid_domain');}if ($v15d61712450a686a7f365adf4fef581f == iMirrorHandler::MODE_ADD_MIRROR && $v18c8e14aa54da215ffd05da38751a2ac) {$vf6afee894b3508441e878b464a92f4b0->addMirror($v10573b873d2fa5a365d558a45e328e47->host());}if ($v15d61712450a686a7f365adf4fef581f == iMirrorHandler::MODE_IGNORE) {}}}