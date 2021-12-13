<?php
 namespace UmiCms\Utils\Dispatches;class Counter implements iCounter {private $connection;private $config;public function __construct(\IConnection $v4717d53ebfdfea8477f780ec66151dcb, \iConfiguration $v2245023265ae4cf87d02c8b6ba991139) {$this->connection = $v4717d53ebfdfea8477f780ec66151dcb;$this->config = $v2245023265ae4cf87d02c8b6ba991139;}public function countEntry($vd6fe1d0be6347b8ef2427fa629c04485) {$vd6fe1d0be6347b8ef2427fa629c04485 = $this->connection->escape($vd6fe1d0be6347b8ef2427fa629c04485);$v6b463f2cc2f409da62a14ee5fe4b816a = <<<SQL
CREATE TABLE IF NOT EXISTS `cms_stat_dispatches`
(
	`hash` Varchar(10) NOT NULL,
	`time` INT(11) NOT NULL
)
engine=innodb DEFAULT CHARSET=utf8;
SQL;   $this->connection->query($v6b463f2cc2f409da62a14ee5fe4b816a);$v07cc694b9b3fc636710fa08b6922c42b = time();$vfd0e43783cc9b69ee94f49f29b77ff30 = <<<SQL
INSERT INTO `cms_stat_dispatches` (`hash`, `time`) VALUES('$vd6fe1d0be6347b8ef2427fa629c04485', $v07cc694b9b3fc636710fa08b6922c42b);
SQL;   $this->connection->query($vfd0e43783cc9b69ee94f49f29b77ff30);}public function generateImage() {$vd78b68a69f88f543cde90ab00273c043 = $this->config->includeParam('system.runtime-cache') . 'counter.gif';if (is_file($vd78b68a69f88f543cde90ab00273c043)) {return $vd78b68a69f88f543cde90ab00273c043;}$v78805a221a988e79ef3f42d7c5bfd418 = imagecreatetruecolor(1, 1);imagealphablending($v78805a221a988e79ef3f42d7c5bfd418, true);$v70dda5dfb8053dc6d1c492574bce9bfd = imagecolorallocate($v78805a221a988e79ef3f42d7c5bfd418, 255, 255, 255);imagecolortransparent($v78805a221a988e79ef3f42d7c5bfd418, $v70dda5dfb8053dc6d1c492574bce9bfd);imagegif($v78805a221a988e79ef3f42d7c5bfd418, $vd78b68a69f88f543cde90ab00273c043);return $vd78b68a69f88f543cde90ab00273c043;}}