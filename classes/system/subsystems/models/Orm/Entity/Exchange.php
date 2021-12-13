<?php
 namespace UmiCms\System\Orm\Entity;use UmiCms\System\Orm\iEntity;use \iXmlExporter as iBaseExporter;use UmiCms\System\Import\UmiDump\Entity\iBaseImporter;use UmiCms\System\Import\UmiDump\Helper\Entity\iSourceIdBinder;use UmiCms\System\Orm\Entity\Facade\tInjector as tFacadeInjector;use UmiCms\System\Orm\Entity\Builder\tInjector as tBuilderInjector;use UmiCms\System\Orm\Entity\Importer\tInjector as tImporterInjector;use UmiCms\System\Orm\Entity\Exporter\tInjector as tExporterInjector;use UmiCms\System\Orm\Entity\Demolisher\tInjector as tDemolisherInjector;use UmiCms\System\Orm\Entity\Relation\Accessor\tInjector as tRelationAccessorInjector;abstract class Exchange implements iExchange {use tFacadeInjector;use tBuilderInjector;use tImporterInjector;use tExporterInjector;use tDemolisherInjector;use tRelationAccessorInjector;public function __construct(   iImporter $v1bc49dba86c5074c5266c6d38c301a46, iExporter $ved780287e302ec3b9fd3c5e78771919f, iFacade $v00c169d5e8a598d3908199ef8c64c279,   iBuilder $vc87a8ca60f0891b79d192fa86f019916, iAccessor $v9efcb42ee143be09c45d33ed2fba175b, iDemolisher $v01785e53d949d6df885f78b3939831f2  ) {$this->setImporter($v1bc49dba86c5074c5266c6d38c301a46)    ->setExporter($ved780287e302ec3b9fd3c5e78771919f)    ->setFacade($v00c169d5e8a598d3908199ef8c64c279)    ->setBuilder($vc87a8ca60f0891b79d192fa86f019916)    ->setRelationAccessor($v9efcb42ee143be09c45d33ed2fba175b)    ->setDemolisher($v01785e53d949d6df885f78b3939831f2);}public function importOne(array $v6dd047148d685270458ecc44ee128a4d, iBaseImporter $vd7648ce30cce00f43e53cae171ed8d84) {return $this->getImporter()    ->import($v6dd047148d685270458ecc44ee128a4d, $vd7648ce30cce00f43e53cae171ed8d84);}public function importMany(array $v3c8f981e1c2c882508f219cdbd2032e4, iBaseImporter $vd7648ce30cce00f43e53cae171ed8d84) {$v8e4a156539e5e358472044b3e46a1fa1 = [];$v1bc49dba86c5074c5266c6d38c301a46 = $this->getImporter();foreach ($v3c8f981e1c2c882508f219cdbd2032e4 as $v6dd047148d685270458ecc44ee128a4d) {$vf5e638cc78dd325906c1298a0c21fb6b = $v1bc49dba86c5074c5266c6d38c301a46->import($v6dd047148d685270458ecc44ee128a4d, $vd7648ce30cce00f43e53cae171ed8d84);if (!$vf5e638cc78dd325906c1298a0c21fb6b instanceof iEntity) {continue;}$v8e4a156539e5e358472044b3e46a1fa1[] = $vf5e638cc78dd325906c1298a0c21fb6b;}return $this->getFacade()    ->mapCollection($v8e4a156539e5e358472044b3e46a1fa1);}public function getInternalIdList(array $ve7143c35e910d05210552bcc5b236bc8, iBaseImporter $vd7648ce30cce00f43e53cae171ed8d84) {$va06a7c3dcee9cf0b3c792a0033535e1d = $this->getImporter()    ->getRelationMap($ve7143c35e910d05210552bcc5b236bc8, $vd7648ce30cce00f43e53cae171ed8d84);return array_values($va06a7c3dcee9cf0b3c792a0033535e1d);}public function exportOne($vb80bb7740288fda1f201890375a60c8f ,iBaseExporter $va8697596728df0c97f17acab91567f11) {$v5a2576254d428ddc22a03fac145c8749 = (array) $vb80bb7740288fda1f201890375a60c8f;$result = $this->exportMany($v5a2576254d428ddc22a03fac145c8749, $va8697596728df0c97f17acab91567f11);return isset($result[$vb80bb7740288fda1f201890375a60c8f]) ? $result[$vb80bb7740288fda1f201890375a60c8f] : [];}public function exportMany(array $v5a2576254d428ddc22a03fac145c8749, iBaseExporter $va8697596728df0c97f17acab91567f11) {return $this->getExporter()    ->export($v5a2576254d428ddc22a03fac145c8749, $va8697596728df0c97f17acab91567f11);}public function getExternalIdList(array $v689f9b0d90e82b15fbd75db891fc65b5, iBaseExporter $va8697596728df0c97f17acab91567f11) {$va06a7c3dcee9cf0b3c792a0033535e1d = $this->getExporter()    ->getRelationMap($v689f9b0d90e82b15fbd75db891fc65b5, $va8697596728df0c97f17acab91567f11);return array_values($va06a7c3dcee9cf0b3c792a0033535e1d);}public function getDependenciesForExportOne($vb80bb7740288fda1f201890375a60c8f) {$v5a2576254d428ddc22a03fac145c8749 = (array) $vb80bb7740288fda1f201890375a60c8f;return $this->getDependenciesForExportMany($v5a2576254d428ddc22a03fac145c8749);}public function getDependenciesForExportMany(array $v5a2576254d428ddc22a03fac145c8749) {$vdb6d9b451b818ccc9a449383f2f0c450 = $this->getFacade()->getCollectionByIdList($v5a2576254d428ddc22a03fac145c8749);if ($vdb6d9b451b818ccc9a449383f2f0c450->getCount() === 0) {return [];}$this->getBuilder()->buildAllRelationsForCollection($vdb6d9b451b818ccc9a449383f2f0c450);$v33be3a3c75ce4db80ebf75afaca4e008 = $this->getRelationAccessor();$v10141553c7fcba937faa0be5ec92ee7b = [];foreach ($v33be3a3c75ce4db80ebf75afaca4e008->accessCollectionToAll($vdb6d9b451b818ccc9a449383f2f0c450) as $vb80bb7740288fda1f201890375a60c8f => $v2617c9384e4bb1af369e034ffd4490c9) {foreach ($v2617c9384e4bb1af369e034ffd4490c9 as $v06e3d36fa30cea095545139854ad1fb9 => $ve54debd65d8142e7785275aab411fd8f) {if ($ve54debd65d8142e7785275aab411fd8f === null) {continue;}$va2f2ed4f8ebc2cbb4c21a29dc40ab61d = $this->getDependencyExchangeClass($ve54debd65d8142e7785275aab411fd8f);$v5a2576254d428ddc22a03fac145c8749 = isset($v10141553c7fcba937faa0be5ec92ee7b[$va2f2ed4f8ebc2cbb4c21a29dc40ab61d]) ? $v10141553c7fcba937faa0be5ec92ee7b[$va2f2ed4f8ebc2cbb4c21a29dc40ab61d] : [];$v10141553c7fcba937faa0be5ec92ee7b[$va2f2ed4f8ebc2cbb4c21a29dc40ab61d] = array_merge($v5a2576254d428ddc22a03fac145c8749, $this->getDependencyIdList($ve54debd65d8142e7785275aab411fd8f));}}foreach ($v10141553c7fcba937faa0be5ec92ee7b as $va2f2ed4f8ebc2cbb4c21a29dc40ab61d => $v5a2576254d428ddc22a03fac145c8749) {$v10141553c7fcba937faa0be5ec92ee7b[$va2f2ed4f8ebc2cbb4c21a29dc40ab61d] = array_unique($v5a2576254d428ddc22a03fac145c8749);}return $v10141553c7fcba937faa0be5ec92ee7b;}public function demolishByExternalIdList($ve7143c35e910d05210552bcc5b236bc8, iSourceIdBinder $vb508148712cb53958c7e3d25ec86d72a) {$this->getDemolisher()->demolishList($ve7143c35e910d05210552bcc5b236bc8, $vb508148712cb53958c7e3d25ec86d72a);return $this;}protected function getDependencyIdList($ve54debd65d8142e7785275aab411fd8f) {switch (true) {case is_callable([$ve54debd65d8142e7785275aab411fd8f, 'getId']) : {return (array) $ve54debd65d8142e7785275aab411fd8f->getId();}case is_callable([$ve54debd65d8142e7785275aab411fd8f, 'extractId']) : {return $ve54debd65d8142e7785275aab411fd8f->extractId();}default : {throw new \ErrorException('Unexpected dependency');}}}protected function getDependencyExchangeClass($ve54debd65d8142e7785275aab411fd8f) {switch (true) {case is_callable([$ve54debd65d8142e7785275aab411fd8f, 'getId']) : {$v0ec0834cc50f974d7f2bff3cbaa558bc = get_class($ve54debd65d8142e7785275aab411fd8f);break;}case is_callable([$ve54debd65d8142e7785275aab411fd8f, 'extractId']) : {$v0ec0834cc50f974d7f2bff3cbaa558bc = str_replace('Collection', '', get_class($ve54debd65d8142e7785275aab411fd8f));break;}default : {throw new \ErrorException('Unexpected dependency');}}return $this->buildExchangeClass($v0ec0834cc50f974d7f2bff3cbaa558bc);}protected function buildExchangeClass($v0ec0834cc50f974d7f2bff3cbaa558bc) {$v0ec0834cc50f974d7f2bff3cbaa558bc = str_replace('UmiCms\System\\', '', $v0ec0834cc50f974d7f2bff3cbaa558bc);$v0ec0834cc50f974d7f2bff3cbaa558bc = explode('\\', $v0ec0834cc50f974d7f2bff3cbaa558bc);$v0ec0834cc50f974d7f2bff3cbaa558bc = implode('', $v0ec0834cc50f974d7f2bff3cbaa558bc);return sprintf('%sExchange', $v0ec0834cc50f974d7f2bff3cbaa558bc);}}