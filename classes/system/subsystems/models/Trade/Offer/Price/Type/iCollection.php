<?php
 namespace UmiCms\System\Trade\Offer\Price\Type;use UmiCms\System\Orm\iEntity;use UmiCms\System\Orm\Entity\Map\Sort;use UmiCms\System\Orm\Entity\Map\Filter;use UmiCms\System\Trade\Offer\Price\iType;use UmiCms\System\Orm\Entity\iCollection as iAbstractCollection;interface iCollection extends iAbstractCollection {public function getList();public function get($vb80bb7740288fda1f201890375a60c8f);public function getFirst();public function getListBy($vb068931cc450442b63f5b3d276ea4297, $v2063c1608d6e0baf80249c42e2be5804, $vd4a6347717091debb166e768f315fcec = Filter::COMPARE_TYPE_EQUALS);public function getSortedList($vb068931cc450442b63f5b3d276ea4297, $v196ff468dd22ac429da86fe7084fd6b5 = Sort::SORT_TYPE_ASC);public function getFirstBy($vb068931cc450442b63f5b3d276ea4297, $v2063c1608d6e0baf80249c42e2be5804, $vd4a6347717091debb166e768f315fcec = Filter::COMPARE_TYPE_EQUALS);public function push(iEntity $v599dcce2998a6b40b1e38e8c6006cb0a);public function pushList(array $va9e2e7908a1f06effc849966dcf44b1c);public function pull($vb80bb7740288fda1f201890375a60c8f);}