<?php
 namespace UmiCms\Classes\System\Utils\SiteMap\Location;use UmiCms\Classes\System\Utils\SiteMap\iLocation;use UmiCms\System\Orm\Entity\Repository as AbstractRepository;class Repository extends AbstractRepository implements iRepository {public function getCountByDomain(int $vb80bb7740288fda1f201890375a60c8f) : int {return $this->getCountBy(iMapper::DOMAIN_ID, $vb80bb7740288fda1f201890375a60c8f);}public function getIndexListForDomain(int $vb80bb7740288fda1f201890375a60c8f) : array {$vd99c042d62b1734bebf3f8ab49338fa4 = iMapper::SORT;$v8e9f1b0abbb7cd9e094023c18bb0259e = iMapper::DATE_TIME;$vaab9e1de16f38176f86d7a92ba337a8d = $this->getTable();$v92ffbe893ff334f604ddbb4b8179f80c = iMapper::DOMAIN_ID;$v72ee76c5c29383b7c9f9225c1fa4d10b = (int) $vb80bb7740288fda1f201890375a60c8f;$vac5c74b64b4b8352ef2f181affb5ac2a = <<<SQL
SELECT `$vd99c042d62b1734bebf3f8ab49338fa4`, MAX(`$v8e9f1b0abbb7cd9e094023c18bb0259e`) FROM `$vaab9e1de16f38176f86d7a92ba337a8d` WHERE `$v92ffbe893ff334f604ddbb4b8179f80c` = $v72ee76c5c29383b7c9f9225c1fa4d10b GROUP BY `$vd99c042d62b1734bebf3f8ab49338fa4`
SQL;
SELECT * FROM `$vaab9e1de16f38176f86d7a92ba337a8d` WHERE `$v92ffbe893ff334f604ddbb4b8179f80c` = $v72ee76c5c29383b7c9f9225c1fa4d10b ORDER BY `$v2e1adfa7da1d9e2af9a986179afa5727`;
SQL;
SELECT * FROM `$vaab9e1de16f38176f86d7a92ba337a8d` WHERE `$v92ffbe893ff334f604ddbb4b8179f80c` = $v72ee76c5c29383b7c9f9225c1fa4d10b AND `$vd99c042d62b1734bebf3f8ab49338fa4` = $vcadc8c8db42409733582cb3e2298ef87 ORDER BY `$v2e1adfa7da1d9e2af9a986179afa5727`;
SQL;
DELETE FROM `$vaab9e1de16f38176f86d7a92ba337a8d` WHERE `$v92ffbe893ff334f604ddbb4b8179f80c` = $v72ee76c5c29383b7c9f9225c1fa4d10b;
SQL;