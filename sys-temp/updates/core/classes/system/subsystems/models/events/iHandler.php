<?php
 namespace UmiCms\System\Events;interface iHandler {public function setEventId(string $vb80bb7740288fda1f201890375a60c8f) : iHandler;public function getEventId() : ?string;public function setIsCritical($v12adfdc02f1648be7a61845ae7ff4691 = false) : iHandler;public function getIsCritical() : bool;public function setPriority($vb988295c268025b49dfb3df26171ddc3 = 5) : iHandler;public function getPriority() : int;public function isAllowed(array $vfc5364bf9dbfa34954526becad136d4b) : bool;}