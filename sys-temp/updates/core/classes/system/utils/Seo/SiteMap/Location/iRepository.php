<?php
 namespace UmiCms\Classes\System\Utils\SiteMap\Location;use UmiCms\Classes\System\Utils\SiteMap\iLocation;use UmiCms\System\Orm\Entity\iRepository as iAbstractRepository;interface iRepository extends iAbstractRepository {public function getCountByDomain(int $vb80bb7740288fda1f201890375a60c8f) : int;public function getIndexListForDomain(int $vb80bb7740288fda1f201890375a60c8f) : array;public function getListByDomain(int $vb80bb7740288fda1f201890375a60c8f) : array;public function getListByDomainAndSort(int $vb80bb7740288fda1f201890375a60c8f, int $vcadc8c8db42409733582cb3e2298ef87) : array;public function deleteByDomain(int $vb80bb7740288fda1f201890375a60c8f) : iRepository;}