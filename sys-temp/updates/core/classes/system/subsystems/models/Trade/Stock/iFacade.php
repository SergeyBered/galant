<?php
 namespace UmiCms\System\Trade\Stock;use UmiCms\System\Trade\iStock;use \iUmiObjectsCollection as iDataObjectCollection;use \iUmiObjectTypesCollection as iDataObjectTypeCollection;interface iFacade {public function __construct(iFactory $v9549dd6065d019211460c59a86dd6536, iDataObjectCollection $vfa5a883455df69e98c0f154ad0e5d47b, iDataObjectTypeCollection $v545d7f16f17a5ddcfa8b52e72077b5bd);public function get($vb80bb7740288fda1f201890375a60c8f);public function getList();public function create($vb068931cc450442b63f5b3d276ea4297);public function save(iStock $v908880209a64ea539ae8dc5fdb7e0a91);public function delete($vb80bb7740288fda1f201890375a60c8f);}