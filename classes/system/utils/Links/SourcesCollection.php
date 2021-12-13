<?php
 namespace UmiCms\Classes\System\Utils\Links;class SourcesCollection implements  iSourcesCollection,  \iUmiDataBaseInjector,  \iUmiService,  \iUmiConstantMapInjector,  \iClassConfigManager {use \tUmiDataBaseInjector;use \tUmiService;use \tCommonCollection;use \tUmiConstantMapInjector;use \tClassConfigManager;private $collectionItemClass = 'UmiCms\Classes\System\Utils\Links\Source';private static $classConfig = [   'service' => 'LinksSources',   'fields' => [    [     'name' => 'ID_FIELD_NAME',     'type' => 'INTEGER_FIELD_TYPE',     'used-in-creation' => false,    ],    [     'name' => 'LINK_ID_FIELD_NAME',     'type' => 'INTEGER_FIELD_TYPE',     'required' => true,    ],    [     'name' => 'PLACE_FIELD_NAME',     'type' => 'STRING_FIELD_TYPE',     'required' => true,    ],    [     'name' => 'TYPE_FIELD_NAME',     'type' => 'STRING_FIELD_TYPE',     'required' => true,    ]   ]  ];public function getCollectionItemClass() {return $this->collectionItemClass;}public function getTableName() {return $this->getMap()->get('TABLE_NAME');}public function exportByLinkId($vab4d719bb5871955352ccf0727db833e) {$v21ffce5b8a6cc8cc6a41448dd69623c9 = [    $this->getMap()->get('LINK_ID_FIELD_NAME') => (int) $vab4d719bb5871955352ccf0727db833e   ];return $this->export($v21ffce5b8a6cc8cc6a41448dd69623c9);}public function createByLinkIdAndPlace($vab4d719bb5871955352ccf0727db833e, $vebed715e82a0a0f3e950ef6565cdc4a8) {$vf8f04d92e325e16edbc1e588f7e2b1df = $this->getMap();$vb5ffe8173b212427b5e0913bf0948ac2 = [    $vf8f04d92e325e16edbc1e588f7e2b1df->get('LINK_ID_FIELD_NAME') => $vab4d719bb5871955352ccf0727db833e,    $vf8f04d92e325e16edbc1e588f7e2b1df->get('PLACE_FIELD_NAME') => $vebed715e82a0a0f3e950ef6565cdc4a8,    $vf8f04d92e325e16edbc1e588f7e2b1df->get('TYPE_FIELD_NAME') => $this->getTypeByPlace($vebed715e82a0a0f3e950ef6565cdc4a8)   ];return $this->create($vb5ffe8173b212427b5e0913bf0948ac2);}private function getTypeByPlace($vebed715e82a0a0f3e950ef6565cdc4a8) {$v599dcce2998a6b40b1e38e8c6006cb0a = new SourceTypes(SourceTypes::OBJECT_KEY);if (is_file($vebed715e82a0a0f3e950ef6565cdc4a8)) {$v599dcce2998a6b40b1e38e8c6006cb0a = new SourceTypes(SourceTypes::TEMPLATE_KEY);}return (string) $v599dcce2998a6b40b1e38e8c6006cb0a;}}