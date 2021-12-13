<?php
 use UmiCms\Service;class umiHierarchyElementWrapper extends translatorWrapper {public function translate($va8cfde6331bd59eb2ac96f8911c4b666) {return $this->translateData($va8cfde6331bd59eb2ac96f8911c4b666);}protected function translateData(iUmiHierarchyElement $v71860c77c6745379b0d44304d66b6a13) {$vf8aea31a0fd948447674cb859137e6e7 = umiHierarchy::getInstance();$result = [    '@id' => $v71860c77c6745379b0d44304d66b6a13->getId(),    '@parentId' => $v71860c77c6745379b0d44304d66b6a13->getParentId(),    '@link' => $vf8aea31a0fd948447674cb859137e6e7->getPathById($v71860c77c6745379b0d44304d66b6a13->getId()),    '@object-id' => $v71860c77c6745379b0d44304d66b6a13->getObjectId(),    '@object-guid' => $v71860c77c6745379b0d44304d66b6a13->getObject()->getGUID(),    '@type-id' => $v71860c77c6745379b0d44304d66b6a13->getObjectTypeId(),    '@type-guid' => $v71860c77c6745379b0d44304d66b6a13->getObject()->getTypeGUID(),    '@alt-name' => $v71860c77c6745379b0d44304d66b6a13->getAltName(),    '@update-time' => $v71860c77c6745379b0d44304d66b6a13->getUpdateTime(),    'name' => str_replace(['<', '>'], ['&lt;', '&gt;'], $v71860c77c6745379b0d44304d66b6a13->getName($this->getOption(xmlTranslator::IGNORE_I18N))),    'xlink:href' => 'upage://' . $v71860c77c6745379b0d44304d66b6a13->getId()   ];if ($v71860c77c6745379b0d44304d66b6a13->getIsDefault()) {$result['@is-default'] = $v71860c77c6745379b0d44304d66b6a13->getIsDefault();}if ($v71860c77c6745379b0d44304d66b6a13->getIsVisible()) {$result['@is-visible'] = $v71860c77c6745379b0d44304d66b6a13->getIsVisible();}if ($v71860c77c6745379b0d44304d66b6a13->getIsActive()) {$result['@is-active'] = $v71860c77c6745379b0d44304d66b6a13->getIsActive();}if ($v71860c77c6745379b0d44304d66b6a13->getIsDeleted()) {$result['@is-deleted'] = $v71860c77c6745379b0d44304d66b6a13->getIsDeleted();}$v797bf25c165393c1aa5fd92576e0f011 = $this->getLockInfo($v71860c77c6745379b0d44304d66b6a13);if (!empty($v797bf25c165393c1aa5fd92576e0f011)) {$result['locked-by'] = $v797bf25c165393c1aa5fd92576e0f011;}$vcc8cb5c7e9f5fb9e2d754682f542ffb4 = $this->getExpirationInfo($v71860c77c6745379b0d44304d66b6a13);if (!empty($vcc8cb5c7e9f5fb9e2d754682f542ffb4)) {$result['expiration'] = $vcc8cb5c7e9f5fb9e2d754682f542ffb4;}if (getRequest('virtuals') !== null && $v71860c77c6745379b0d44304d66b6a13->hasVirtualCopy()) {$result['has-virtual-copy'] = 1;if ($v71860c77c6745379b0d44304d66b6a13->isOriginal()) {$result['is-original'] = 1;}}if (getRequest('templates') !== null) {$result['@template-id'] = $v71860c77c6745379b0d44304d66b6a13->getTplId();$result['@domain-id'] = $v71860c77c6745379b0d44304d66b6a13->getDomainId();$result['@lang-id'] = $v71860c77c6745379b0d44304d66b6a13->getLangId();}if (getRequest('childs') !== null) {$result['childs'] = $vf8aea31a0fd948447674cb859137e6e7->getChildrenCount($v71860c77c6745379b0d44304d66b6a13->getId(), true, true, 1);}if (getRequest('permissions') !== null) {$result['permissions'] = $this->getPermissionLevel($v71860c77c6745379b0d44304d66b6a13);}$v89b0b9deff65f8b9cd1f71bc74ce36ba = umiHierarchyTypesCollection::getInstance()    ->getType($v71860c77c6745379b0d44304d66b6a13->getTypeId());$result['basetype'] = $v89b0b9deff65f8b9cd1f71bc74ce36ba;if (getRequest('links') !== null && !$v71860c77c6745379b0d44304d66b6a13->getIsDeleted()) {$v356b78ef3464950612e870ac24919793 = $this->getAdminLinkList($v71860c77c6745379b0d44304d66b6a13, $v89b0b9deff65f8b9cd1f71bc74ce36ba);if (isset($v356b78ef3464950612e870ac24919793[0])) {$result['create-link'] = $v356b78ef3464950612e870ac24919793[0];}if (isset($v356b78ef3464950612e870ac24919793[1])) {$result['edit-link'] = $v356b78ef3464950612e870ac24919793[1];}}if (!$this->getOption('serialize-related-entities')) {return $result;}$v726e8e4809d4c1b28a6549d86436a124 = umiObjectTypesCollection::getInstance()    ->getType($v71860c77c6745379b0d44304d66b6a13->getObjectTypeId());if (!$v726e8e4809d4c1b28a6549d86436a124 instanceof iUmiObjectType) {return $result;}$result['properties'] = [    'nodes:group' => []   ];$v865c0c0b4ab0e063e5caa3387c1a8741 = 0;$v37a5809f9a759faa7a2db401d89ce84e = Service::Request()    ->isJson();foreach ($v726e8e4809d4c1b28a6549d86436a124->getFieldsGroupsList() as $vdb0f6f37ebeb6ea09489124345af2a45) {$v84f6fb7cd5cd53b5679489a29396448f = parent::get($vdb0f6f37ebeb6ea09489124345af2a45);foreach ($this->getOptionList() as $vb068931cc450442b63f5b3d276ea4297 => $v2063c1608d6e0baf80249c42e2be5804) {$v84f6fb7cd5cd53b5679489a29396448f->setOption($vb068931cc450442b63f5b3d276ea4297, $v2063c1608d6e0baf80249c42e2be5804);}$v9ef2442354c7bbb7c8a4b00cce7dcff2 = $v84f6fb7cd5cd53b5679489a29396448f->translateProperties($vdb0f6f37ebeb6ea09489124345af2a45, $v71860c77c6745379b0d44304d66b6a13->getObject());if (empty($v9ef2442354c7bbb7c8a4b00cce7dcff2)) {continue;}$v6a992d5529f459a44fee58c733255e86 = $v37a5809f9a759faa7a2db401d89ce84e ? $v865c0c0b4ab0e063e5caa3387c1a8741++ : ++$v865c0c0b4ab0e063e5caa3387c1a8741;$result['properties']['nodes:group'][$v6a992d5529f459a44fee58c733255e86] = $v9ef2442354c7bbb7c8a4b00cce7dcff2;}return $result;}private function getPermissionLevel(iUmiHierarchyElement $v71860c77c6745379b0d44304d66b6a13) {$vc9e9a848920877e76685b2e4e76de38d = permissionsCollection::getInstance()    ->isAllowedObject(Service::Auth()->getUserId(), $v71860c77c6745379b0d44304d66b6a13->getId());return ($vc9e9a848920877e76685b2e4e76de38d[4] ? 16 : 0) |    ($vc9e9a848920877e76685b2e4e76de38d[3] ? 8 : 0) |    ($vc9e9a848920877e76685b2e4e76de38d[2] ? 4 : 0) |    ($vc9e9a848920877e76685b2e4e76de38d[1] ? 2 : 0) |    ($vc9e9a848920877e76685b2e4e76de38d[0] ? 1 : 0);}private function getAdminLinkList(iUmiHierarchyElement $v71860c77c6745379b0d44304d66b6a13, iUmiHierarchyType $v599dcce2998a6b40b1e38e8c6006cb0a) {$v22884db148f0ffb0d830ba431102b0b5 = cmsController::getInstance()    ->getModule($v599dcce2998a6b40b1e38e8c6006cb0a->getName());if (!$v22884db148f0ffb0d830ba431102b0b5 instanceof def_module) {return [];}return (array) $v22884db148f0ffb0d830ba431102b0b5->getEditLink($v71860c77c6745379b0d44304d66b6a13->getId(), $v599dcce2998a6b40b1e38e8c6006cb0a->getExt());}private function getLockInfo(iUmiHierarchyElement $v71860c77c6745379b0d44304d66b6a13) {$v840767d63139b4dca4928d5ec734c79e = (int) $v71860c77c6745379b0d44304d66b6a13->getValue('lockuser');if ($v840767d63139b4dca4928d5ec734c79e === 0) {return [];}$v31e6b624e5c05c45b0f1e8a7f59801ba = $v71860c77c6745379b0d44304d66b6a13->getValue('locktime');$vd5034fb9092631c8a2869ebb11b5c591 = (int) Service::Registry()    ->get('//settings/lock_duration');if (!$v31e6b624e5c05c45b0f1e8a7f59801ba instanceof iUmiDate || !(($v31e6b624e5c05c45b0f1e8a7f59801ba->getDateTimeStamp() + $vd5034fb9092631c8a2869ebb11b5c591) > time())) {$v71860c77c6745379b0d44304d66b6a13->setValue('lockuser', null);$v71860c77c6745379b0d44304d66b6a13->setValue('locktime', null);$v71860c77c6745379b0d44304d66b6a13->commit();return [];}if (Service::Auth()->getUserId() == $v840767d63139b4dca4928d5ec734c79e) {return [];}$v4e6ada6f19cc32bd67dbad5b15bd218d = umiObjectsCollection::getInstance()    ->getObject($v840767d63139b4dca4928d5ec734c79e);if (!$v4e6ada6f19cc32bd67dbad5b15bd218d instanceof iUmiObject) {return [];}return [    'user-id' => $v840767d63139b4dca4928d5ec734c79e,    'login' => $v4e6ada6f19cc32bd67dbad5b15bd218d->getValue('login'),    'lname' => $v4e6ada6f19cc32bd67dbad5b15bd218d->getValue('lname'),    'fname' => $v4e6ada6f19cc32bd67dbad5b15bd218d->getValue('fname'),    'father-name' => $v4e6ada6f19cc32bd67dbad5b15bd218d->getValue('father_name'),    'locktime' => $v31e6b624e5c05c45b0f1e8a7f59801ba->getFormattedDate(),    '@ts' => $v31e6b624e5c05c45b0f1e8a7f59801ba->getDateTimeStamp()   ];}private function getExpirationInfo(iUmiHierarchyElement $v71860c77c6745379b0d44304d66b6a13) {if (!Service::Registry()->get('//settings/expiration_control')) {return [];}$v9acb44549b41563697bb490144ec6258 = umiObjectsCollection::getInstance()    ->getObject($v71860c77c6745379b0d44304d66b6a13->getValue('publish_status'));if (!$v9acb44549b41563697bb490144ec6258 instanceof iUmiObject) {return [     'status' => [      '@id' => 'page_status_publish',      '#name' => getLabel('object-status-publish'),     ],     '@ts' => ''    ];}$v018e77635d40709feb0c09c6fb84ee00 = [    'status' => [     '@id' => $v9acb44549b41563697bb490144ec6258->getValue('publish_status_id') ?: 'page_status_publish',     '#name' => $v9acb44549b41563697bb490144ec6258->getName(),    ],   ];$vac89cc3bb8407b8f6f24df3d2f088752 = $v71860c77c6745379b0d44304d66b6a13->getValue('expiration_date');if ($vac89cc3bb8407b8f6f24df3d2f088752 instanceof iUmiDate) {$v018e77635d40709feb0c09c6fb84ee00['@id'] = $vac89cc3bb8407b8f6f24df3d2f088752->getDateTimeStamp();$v018e77635d40709feb0c09c6fb84ee00['date'] = $vac89cc3bb8407b8f6f24df3d2f088752->getFormattedDate();$v018e77635d40709feb0c09c6fb84ee00['comments'] = $v71860c77c6745379b0d44304d66b6a13->getValue('publish_comments');}return $v018e77635d40709feb0c09c6fb84ee00;}}