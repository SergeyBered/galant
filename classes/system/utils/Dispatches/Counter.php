<?php
 namespace UmiCms\Utils\Dispatches;class Counter implements iCounter {private $connection;private $config;public function __construct(\IConnection $v4717d53ebfdfea8477f780ec66151dcb, \iConfiguration $v2245023265ae4cf87d02c8b6ba991139) {$this->connection = $v4717d53ebfdfea8477f780ec66151dcb;$this->config = $v2245023265ae4cf87d02c8b6ba991139;}public function countEntry($vd6fe1d0be6347b8ef2427fa629c04485) {$vd6fe1d0be6347b8ef2427fa629c04485 = $this->connection->escape($vd6fe1d0be6347b8ef2427fa629c04485);$v6b463f2cc2f409da62a14ee5fe4b816a = <<<SQL
CREATE TABLE IF NOT EXISTS `cms_stat_dispatches`
(
	`hash` Varchar(10) NOT NULL,
	`time` INT(11) NOT NULL
)
engine=innodb DEFAULT CHARSET=utf8;
SQL;
INSERT INTO `cms_stat_dispatches` (`hash`, `time`) VALUES('$vd6fe1d0be6347b8ef2427fa629c04485', $v07cc694b9b3fc636710fa08b6922c42b);
SQL;