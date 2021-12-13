<?php
 namespace UmiCms\System\Orm\Entity;use UmiCms\System\Orm\iEntity;interface iFacade {const MOVE_MODE_AFTER_ENTITY = 'after';const MOVE_MODE_BEFORE_ENTITY = 'before';const MOVE_MODE_AS_ENTITY_CHILD = 'child';public function __construct(   iCollection $vdb6d9b451b818ccc9a449383f2f0c450,   iRepository $vb3f2035551f6e48c67489ace9f588f94,   iFactory $v9549dd6065d019211460c59a86dd6536,   iAccessor $v4209ae65645472477d5389fe6ba7c0fa,   iAccessor $v33be3a3c75ce4db80ebf75afaca4e008,   iBuilder $vc87a8ca60f0891b79d192fa86f019916  );public function get($vb80bb7740288fda1f201890375a60c8f);public function getAll();public function getListSliceByEqualityMap(array $v5802a0c16daf57810f3df4f0233e541f, int $v7a86c157ee9713c34fbd7a1ee40f0c5a, int $vaa9f73eea60a006820d0f8768bc8a3fc) : array;public function getListSliceByFilterMap(array $v1d78dc8ed51214e518b5114fe24490ae, int $v7a86c157ee9713c34fbd7a1ee40f0c5a, int $vaa9f73eea60a006820d0f8768bc8a3fc) : array;public function getSortedListSliceByFilterMap(array $vd37ea62bef927cc3e22f4ca5a69e4967, int $v7a86c157ee9713c34fbd7a1ee40f0c5a, int $vaa9f73eea60a006820d0f8768bc8a3fc, array $vf7fcd64f6639af3548b3b9c8fdfd2c99) : array;public function getListByEqualityMap(array $v5802a0c16daf57810f3df4f0233e541f) : array;public function getCountByEqualityMap(array $v5802a0c16daf57810f3df4f0233e541f) : int;public function getCountByFilterMap(array $v1d78dc8ed51214e518b5114fe24490ae) : int;public function getList(array $v5a2576254d428ddc22a03fac145c8749);public function extractAttributeList(iEntity $vf5e638cc78dd325906c1298a0c21fb6b);public function extractRelationList(iEntity $vf5e638cc78dd325906c1298a0c21fb6b);public function extractPropertyList(iEntity $vf5e638cc78dd325906c1298a0c21fb6b);public function loadRelations(iCollection $vdb6d9b451b818ccc9a449383f2f0c450, array $ve6498ce498a90ba6ffb84132a321ea00 = []);public function importToEntity(iEntity $vf5e638cc78dd325906c1298a0c21fb6b, array $v6dd047148d685270458ecc44ee128a4d);public function copy(iEntity $v36cd38f49b9afa08222c0dc9ebfe35eb);public function getCollectionBy($vb068931cc450442b63f5b3d276ea4297, $v2063c1608d6e0baf80249c42e2be5804);public function getCollectionByValueList($vb068931cc450442b63f5b3d276ea4297, array $v993fcb1e163e40a45771f626d3ea0f0f);public function getCollectionByIdList(array $v5a2576254d428ddc22a03fac145c8749);public function mapCollection(array $v8e4a156539e5e358472044b3e46a1fa1);public function mapCollectionWithRelations(array $v8e4a156539e5e358472044b3e46a1fa1);public function create(array $v6dd047148d685270458ecc44ee128a4d = []);public function save(iEntity $vf5e638cc78dd325906c1298a0c21fb6b);public function delete($vb80bb7740288fda1f201890375a60c8f);public function deleteList(array $v5a2576254d428ddc22a03fac145c8749);public function deleteByEqualityMap(array $v5802a0c16daf57810f3df4f0233e541f) : int;public function deleteAll();}