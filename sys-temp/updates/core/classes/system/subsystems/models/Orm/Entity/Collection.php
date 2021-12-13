<?php
 namespace UmiCms\System\Orm\Entity;use UmiCms\System\Orm\iEntity;use UmiCms\System\Orm\Entity\Map\Sort;use UmiCms\System\Orm\Entity\Map\Filter;use UmiCms\System\Orm\Entity\Attribute\Accessor\tInjector as tAttributeAccessorInjector;abstract class Collection implements iCollection {private $collection = [];private $idList = [];private $position = 0;use tAttributeAccessorInjector;public function __construct(iAccessor $v4209ae65645472477d5389fe6ba7c0fa) {$this->setAttributeAccessor($v4209ae65645472477d5389fe6ba7c0fa);}public function getList() {return $this->collection;}public function get($vb80bb7740288fda1f201890375a60c8f) {if (!is_numeric($vb80bb7740288fda1f201890375a60c8f)) {return null;}foreach ($this->getList() as $vf5e638cc78dd325906c1298a0c21fb6b) {if ($vf5e638cc78dd325906c1298a0c21fb6b->getId() == $vb80bb7740288fda1f201890375a60c8f) {return $vf5e638cc78dd325906c1298a0c21fb6b;}}return null;}public function getFirst() {return getFirstValue($this->getList());}public function getListBy($vb068931cc450442b63f5b3d276ea4297, $v2063c1608d6e0baf80249c42e2be5804, $vd4a6347717091debb166e768f315fcec = Filter::COMPARE_TYPE_EQUALS) {return $this->filterListBy($this->getList(), $vb068931cc450442b63f5b3d276ea4297, $v2063c1608d6e0baf80249c42e2be5804, $vd4a6347717091debb166e768f315fcec = Filter::COMPARE_TYPE_EQUALS);}public function getSortedList($vb068931cc450442b63f5b3d276ea4297, $v196ff468dd22ac429da86fe7084fd6b5 = Sort::SORT_TYPE_ASC) {return $this->sortListBy($this->getList(), $vb068931cc450442b63f5b3d276ea4297, $v196ff468dd22ac429da86fe7084fd6b5);}public function getFirstBy($vb068931cc450442b63f5b3d276ea4297, $v2063c1608d6e0baf80249c42e2be5804, $vd4a6347717091debb166e768f315fcec = Filter::COMPARE_TYPE_EQUALS) {$result = $this->getListBy($vb068931cc450442b63f5b3d276ea4297, $v2063c1608d6e0baf80249c42e2be5804);return getFirstValue($result);}public function push(iEntity $vf5e638cc78dd325906c1298a0c21fb6b) {if ($this->isPushed($vf5e638cc78dd325906c1298a0c21fb6b)) {return $this;}$this->collection[] = $vf5e638cc78dd325906c1298a0c21fb6b;$vb80bb7740288fda1f201890375a60c8f = $vf5e638cc78dd325906c1298a0c21fb6b->getId();$this->idList[$vb80bb7740288fda1f201890375a60c8f] = $vb80bb7740288fda1f201890375a60c8f;return $this;}public function pushList(array $v8e4a156539e5e358472044b3e46a1fa1) {foreach ($v8e4a156539e5e358472044b3e46a1fa1 as $vf5e638cc78dd325906c1298a0c21fb6b) {$this->push($vf5e638cc78dd325906c1298a0c21fb6b);}return $this;}public function pull($vb80bb7740288fda1f201890375a60c8f) {$vf5e638cc78dd325906c1298a0c21fb6b = $this->get($vb80bb7740288fda1f201890375a60c8f);if ($vf5e638cc78dd325906c1298a0c21fb6b === null) {return null;}$v6a992d5529f459a44fee58c733255e86 = array_search($vf5e638cc78dd325906c1298a0c21fb6b, $this->collection);if ($v6a992d5529f459a44fee58c733255e86 !== false) {unset($this->collection[$v6a992d5529f459a44fee58c733255e86]);}unset($this->idList[$vb80bb7740288fda1f201890375a60c8f]);return $vf5e638cc78dd325906c1298a0c21fb6b;}public function pullList(array $v5a2576254d428ddc22a03fac145c8749) {$v8e4a156539e5e358472044b3e46a1fa1 = [];foreach ($v5a2576254d428ddc22a03fac145c8749 as $vb80bb7740288fda1f201890375a60c8f) {$vf5e638cc78dd325906c1298a0c21fb6b = $this->pull($vb80bb7740288fda1f201890375a60c8f);if (!$vf5e638cc78dd325906c1298a0c21fb6b instanceof iEntity) {continue;}$v8e4a156539e5e358472044b3e46a1fa1[$vf5e638cc78dd325906c1298a0c21fb6b->getId()] = $vf5e638cc78dd325906c1298a0c21fb6b;}return $v8e4a156539e5e358472044b3e46a1fa1;}public function pullCollection(iCollection $vdb6d9b451b818ccc9a449383f2f0c450) : array {$v5a2576254d428ddc22a03fac145c8749 = $vdb6d9b451b818ccc9a449383f2f0c450->extractId();return $this->pullList($v5a2576254d428ddc22a03fac145c8749);}public function filter(array $v1d78dc8ed51214e518b5114fe24490ae) {if (isEmptyArray($v1d78dc8ed51214e518b5114fe24490ae)) {return $this;}$v52cb3943bb665a1c56ce0a6a2c505805 = $this->getList();foreach ($v1d78dc8ed51214e518b5114fe24490ae as $vb068931cc450442b63f5b3d276ea4297 => $v63973cd3ad7ccf2c8d5dce94b215f683) {if (!is_array($v63973cd3ad7ccf2c8d5dce94b215f683) || count($v63973cd3ad7ccf2c8d5dce94b215f683) !== 1) {$v2063c1608d6e0baf80249c42e2be5804 = $v63973cd3ad7ccf2c8d5dce94b215f683;$vd4a6347717091debb166e768f315fcec = Filter::COMPARE_TYPE_EQUALS;}else {$v2063c1608d6e0baf80249c42e2be5804 = getFirstValue($v63973cd3ad7ccf2c8d5dce94b215f683);$vd4a6347717091debb166e768f315fcec = getFirstValue(array_keys($v63973cd3ad7ccf2c8d5dce94b215f683));}$v52cb3943bb665a1c56ce0a6a2c505805 = $this->filterListBy($v52cb3943bb665a1c56ce0a6a2c505805, $vb068931cc450442b63f5b3d276ea4297, $v2063c1608d6e0baf80249c42e2be5804, $vd4a6347717091debb166e768f315fcec);}return $this->clear()    ->pushList($v52cb3943bb665a1c56ce0a6a2c505805);}public function filterByEqualityMap(array $v1d78dc8ed51214e518b5114fe24490ae) : iCollection {$vd37ea62bef927cc3e22f4ca5a69e4967 = [];foreach ($v1d78dc8ed51214e518b5114fe24490ae as $vb068931cc450442b63f5b3d276ea4297 => $v2063c1608d6e0baf80249c42e2be5804) {$vd37ea62bef927cc3e22f4ca5a69e4967[] = [     $vb068931cc450442b63f5b3d276ea4297 => [      Filter::COMPARE_TYPE_EQUALS => $v2063c1608d6e0baf80249c42e2be5804     ]    ];}return $this->filter($vd37ea62bef927cc3e22f4ca5a69e4967);}public function filterByList(array $v2384a9fed7762b0ed7b71646e2494456) {foreach ($v2384a9fed7762b0ed7b71646e2494456 as $v1d78dc8ed51214e518b5114fe24490ae) {$this->filter($v1d78dc8ed51214e518b5114fe24490ae);}return $this;}public function sort(array $v1d78dc8ed51214e518b5114fe24490ae) {if (isEmptyArray($v1d78dc8ed51214e518b5114fe24490ae)) {return $this;}$v4deaca10c04ee118079bc6d38c9b0908 = $this->getList();foreach ($v1d78dc8ed51214e518b5114fe24490ae as $v06e3d36fa30cea095545139854ad1fb9 => $v196ff468dd22ac429da86fe7084fd6b5) {$v4deaca10c04ee118079bc6d38c9b0908 = $this->sortListBy($v4deaca10c04ee118079bc6d38c9b0908, $v06e3d36fa30cea095545139854ad1fb9, $v196ff468dd22ac429da86fe7084fd6b5);}return $this->clear()    ->pushList($v4deaca10c04ee118079bc6d38c9b0908);}public function sortByIdList(array $v5a2576254d428ddc22a03fac145c8749) {return $this->sortByValueList('id', $v5a2576254d428ddc22a03fac145c8749);}public function sortByValueList($vb068931cc450442b63f5b3d276ea4297, array $v993fcb1e163e40a45771f626d3ea0f0f) {if (isEmptyArray($v993fcb1e163e40a45771f626d3ea0f0f)) {return $this;}$v10ae9fc7d453b0dd525d0edf2ede7961 = $this->getList();$v10ae9fc7d453b0dd525d0edf2ede7961 = $this->sortListByValueList($v10ae9fc7d453b0dd525d0edf2ede7961, $vb068931cc450442b63f5b3d276ea4297, $v993fcb1e163e40a45771f626d3ea0f0f);return $this->clear()    ->pushList($v10ae9fc7d453b0dd525d0edf2ede7961);}public function extractField($vb068931cc450442b63f5b3d276ea4297) {return $this->getAttributeAccessor()    ->accessCollection($this, $vb068931cc450442b63f5b3d276ea4297);}public function extractUniqueField($vb068931cc450442b63f5b3d276ea4297) {$v993fcb1e163e40a45771f626d3ea0f0f = $this->extractField($vb068931cc450442b63f5b3d276ea4297);return array_unique($v993fcb1e163e40a45771f626d3ea0f0f);}public function extractId() {return $this->extractField('id');}public function slice($v7a86c157ee9713c34fbd7a1ee40f0c5a, $vaa9f73eea60a006820d0f8768bc8a3fc = null) {$vdf7b712058e85cdcbe7e22c396878f66 = array_slice($this->getList(), $v7a86c157ee9713c34fbd7a1ee40f0c5a, $vaa9f73eea60a006820d0f8768bc8a3fc);return $this->clear()    ->pushList($vdf7b712058e85cdcbe7e22c396878f66);}public function map() {$v4209ae65645472477d5389fe6ba7c0fa = $this->getAttributeAccessor();$result = [];foreach ($this->getList() as $vf5e638cc78dd325906c1298a0c21fb6b) {$result[$vf5e638cc78dd325906c1298a0c21fb6b->getId()] = $v4209ae65645472477d5389fe6ba7c0fa->accessOneToAll($vf5e638cc78dd325906c1298a0c21fb6b);}return $result;}public function copy() {$vdb6d9b451b818ccc9a449383f2f0c450 = clone $this;return $vdb6d9b451b818ccc9a449383f2f0c450->pushList($this->getList());}public function clear() {$this->collection = [];$this->idList = [];return $this;}public function getCount() {return count($this->getList());}public function isEmpty() {return $this->getCount() === 0;}public function isNotEmpty() {return $this->isEmpty() === false;}public function __clone() {$this->clear();return $this;}public function current() {return $this->getList()[$this->key()];}public function next() {return $this->incrementPosition();}public function key() {return $this->getPosition();}public function valid() {return isset($this->getList()[$this->key()]);}public function rewind() {return $this->setPosition(0);}protected function sortListByValueList($v8e4a156539e5e358472044b3e46a1fa1, $vb068931cc450442b63f5b3d276ea4297, array $v993fcb1e163e40a45771f626d3ea0f0f) {$v9efcb42ee143be09c45d33ed2fba175b = $this->getAttributeAccessor();usort($v8e4a156539e5e358472044b3e46a1fa1, function(iEntity $vda3eafcd19083f5df766940065ee9768, iEntity $vfc8b6e2096824bfd3f7bcae6de2d34bc) use ($vb068931cc450442b63f5b3d276ea4297, $v993fcb1e163e40a45771f626d3ea0f0f, $v9efcb42ee143be09c45d33ed2fba175b) {$v5f94200c4ee9f6d7ed3031389c5ea078 = array_search($v9efcb42ee143be09c45d33ed2fba175b->accessOne($vda3eafcd19083f5df766940065ee9768, $vb068931cc450442b63f5b3d276ea4297), $v993fcb1e163e40a45771f626d3ea0f0f);$v95c11860759edbbd4eda130093cd83ed = array_search($v9efcb42ee143be09c45d33ed2fba175b->accessOne($vfc8b6e2096824bfd3f7bcae6de2d34bc, $vb068931cc450442b63f5b3d276ea4297), $v993fcb1e163e40a45771f626d3ea0f0f);return ($v5f94200c4ee9f6d7ed3031389c5ea078 < $v95c11860759edbbd4eda130093cd83ed) ? -1 : 1;});return $v8e4a156539e5e358472044b3e46a1fa1;}protected function isPushed(iEntity $vf5e638cc78dd325906c1298a0c21fb6b) {return isset($this->idList[$vf5e638cc78dd325906c1298a0c21fb6b->getId()]);}private function filterListBy(array $v8e4a156539e5e358472044b3e46a1fa1, $vb068931cc450442b63f5b3d276ea4297, $v2063c1608d6e0baf80249c42e2be5804, $vd4a6347717091debb166e768f315fcec = Filter::COMPARE_TYPE_EQUALS) {$v9efcb42ee143be09c45d33ed2fba175b = $this->getAttributeAccessor();$result = [];foreach ($v8e4a156539e5e358472044b3e46a1fa1 as $v6a992d5529f459a44fee58c733255e86 => $vf5e638cc78dd325906c1298a0c21fb6b) {$ved5eeae4113b5ff774c04af8f4f10f44 = $v9efcb42ee143be09c45d33ed2fba175b->accessOne($vf5e638cc78dd325906c1298a0c21fb6b, $vb068931cc450442b63f5b3d276ea4297);if ($this->assert($ved5eeae4113b5ff774c04af8f4f10f44, $v2063c1608d6e0baf80249c42e2be5804, $vd4a6347717091debb166e768f315fcec)) {$result[$v6a992d5529f459a44fee58c733255e86] = $vf5e638cc78dd325906c1298a0c21fb6b;}}return $result;}protected function sortListBy(array $v8e4a156539e5e358472044b3e46a1fa1, $vb068931cc450442b63f5b3d276ea4297, $v196ff468dd22ac429da86fe7084fd6b5 = Sort::SORT_TYPE_ASC) {$v6dd047148d685270458ecc44ee128a4d = $this->getAttributeAccessor()    ->accessMany($v8e4a156539e5e358472044b3e46a1fa1, $vb068931cc450442b63f5b3d276ea4297);$v6dd047148d685270458ecc44ee128a4d = $this->sortAttributeList($v6dd047148d685270458ecc44ee128a4d, $v196ff468dd22ac429da86fe7084fd6b5);return $this->sortListByValueList($v8e4a156539e5e358472044b3e46a1fa1, $vb068931cc450442b63f5b3d276ea4297, $v6dd047148d685270458ecc44ee128a4d);}private function assert($v235063b1cbca83735c62ed6b83b05f45, $v9ca3392f96c70723222c5992c6114599, $v599dcce2998a6b40b1e38e8c6006cb0a) {switch ($v599dcce2998a6b40b1e38e8c6006cb0a) {case Filter::COMPARE_TYPE_EQUALS : {return $v235063b1cbca83735c62ed6b83b05f45 == $v9ca3392f96c70723222c5992c6114599;}case Filter::COMPARE_TYPE_NOT_EQUALS : {return $v235063b1cbca83735c62ed6b83b05f45 != $v9ca3392f96c70723222c5992c6114599;}case Filter::COMPARE_TYPE_LIKE : {$v235063b1cbca83735c62ed6b83b05f45 = mb_convert_case((string) $v235063b1cbca83735c62ed6b83b05f45, MB_CASE_LOWER);$v9ca3392f96c70723222c5992c6114599 = mb_convert_case((string) $v9ca3392f96c70723222c5992c6114599, MB_CASE_LOWER);return contains($v235063b1cbca83735c62ed6b83b05f45, $v9ca3392f96c70723222c5992c6114599);}case Filter::COMPARE_TYPE_NOT_LIKE : {$v235063b1cbca83735c62ed6b83b05f45 = mb_convert_case((string) $v235063b1cbca83735c62ed6b83b05f45, MB_CASE_LOWER);$v9ca3392f96c70723222c5992c6114599 = mb_convert_case((string) $v9ca3392f96c70723222c5992c6114599, MB_CASE_LOWER);return !contains($v235063b1cbca83735c62ed6b83b05f45, $v9ca3392f96c70723222c5992c6114599);}case Filter::COMPARE_TYPE_IN_LIST : {$v9ca3392f96c70723222c5992c6114599 = (array) $v9ca3392f96c70723222c5992c6114599;return in_array($v235063b1cbca83735c62ed6b83b05f45, $v9ca3392f96c70723222c5992c6114599);}case Filter::COMPARE_TYPE_NOT_IN_LIST : {$v9ca3392f96c70723222c5992c6114599 = (array) $v9ca3392f96c70723222c5992c6114599;return !in_array($v235063b1cbca83735c62ed6b83b05f45, $v9ca3392f96c70723222c5992c6114599);}case Filter::COMPARE_TYPE_IS_NULL : {return $v235063b1cbca83735c62ed6b83b05f45 === null;}case Filter::COMPARE_TYPE_IS_NOT_NULL : {return $v235063b1cbca83735c62ed6b83b05f45 !== null;}case Filter::COMPARE_TYPE_LESS : {return $v235063b1cbca83735c62ed6b83b05f45 < $v9ca3392f96c70723222c5992c6114599;}case Filter::COMPARE_TYPE_LESS_OR_EQUALS : {return $v235063b1cbca83735c62ed6b83b05f45 <= $v9ca3392f96c70723222c5992c6114599;}case Filter::COMPARE_TYPE_MORE : {return $v235063b1cbca83735c62ed6b83b05f45 > $v9ca3392f96c70723222c5992c6114599;}case Filter::COMPARE_TYPE_MORE_OR_EQUALS : {return $v235063b1cbca83735c62ed6b83b05f45 >= $v9ca3392f96c70723222c5992c6114599;}case Filter::COMPARE_TYPE_BETWEEN : {$v9ca3392f96c70723222c5992c6114599 = (array) $v9ca3392f96c70723222c5992c6114599;$v8defbc4b4bace001cb8149ccacebae29 = array_shift($v9ca3392f96c70723222c5992c6114599);$v13d45ed74c4c4de2dfedb4921ecb2765 = array_shift($v9ca3392f96c70723222c5992c6114599);return ($v235063b1cbca83735c62ed6b83b05f45 > $v8defbc4b4bace001cb8149ccacebae29 && $v235063b1cbca83735c62ed6b83b05f45 < $v13d45ed74c4c4de2dfedb4921ecb2765);}default : {throw new \ErrorException(sprintf('Incorrect compare type: "%s"', $v599dcce2998a6b40b1e38e8c6006cb0a));}}}protected function sortAttributeList(array $v6dd047148d685270458ecc44ee128a4d, $v196ff468dd22ac429da86fe7084fd6b5) {switch ($v196ff468dd22ac429da86fe7084fd6b5) {case Sort::SORT_TYPE_ASC : {sort($v6dd047148d685270458ecc44ee128a4d, SORT_NATURAL | SORT_FLAG_CASE);break;}case Sort::SORT_TYPE_DESC : {sort($v6dd047148d685270458ecc44ee128a4d, SORT_NATURAL | SORT_FLAG_CASE);$v6dd047148d685270458ecc44ee128a4d = array_reverse($v6dd047148d685270458ecc44ee128a4d);break;}case Sort::SORT_TYPE_RAND : {$v14f802e1fba977727845e8872c1743a7 = array_keys($v6dd047148d685270458ecc44ee128a4d);shuffle($v14f802e1fba977727845e8872c1743a7);$v40cea585503df322b8788f12b6a81dcd = [];foreach ($v14f802e1fba977727845e8872c1743a7 as $v3c6e0b8a9c15224a8228b9a98ca1531d) {$v40cea585503df322b8788f12b6a81dcd[$v3c6e0b8a9c15224a8228b9a98ca1531d] = $v6dd047148d685270458ecc44ee128a4d[$v3c6e0b8a9c15224a8228b9a98ca1531d];}$v6dd047148d685270458ecc44ee128a4d = $v40cea585503df322b8788f12b6a81dcd;break;}default : {throw new \ErrorException(sprintf('Incorrect sort type: "%s"', $v196ff468dd22ac429da86fe7084fd6b5));}}return $v6dd047148d685270458ecc44ee128a4d;}private function getPosition() {return $this->position;}private function setPosition($v4757fe07fd492a8be0ea6a760d683d6e) {$this->position = $v4757fe07fd492a8be0ea6a760d683d6e;return $this;}private function incrementPosition() {$v4757fe07fd492a8be0ea6a760d683d6e = $this->getPosition();return $this->setPosition($v4757fe07fd492a8be0ea6a760d683d6e + 1);}}