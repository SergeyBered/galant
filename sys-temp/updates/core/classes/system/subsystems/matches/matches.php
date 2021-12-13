<?php
 use UmiCms\Service;class matches implements iMatches {protected $sitemapFilePath;protected $uri;protected $dom;protected $matchNode;protected $buffer;protected $pattern;protected $params;protected $cache = false;protected $externalCall = true;public function __construct($v5b063e275d506f65ebf1b02d926f19a4 = 'sitemap.xml') {$this->sitemapFilePath = $this->findSitemapFilePath($v5b063e275d506f65ebf1b02d926f19a4);}public function setCurrentURI($v9305b73d359bd06734fee0b3638079e1) {$this->uri = (string) $v9305b73d359bd06734fee0b3638079e1;}public function execute($vfa6b3c4a6238cc6e84e234abcfe10265 = true) {$this->externalCall = $vfa6b3c4a6238cc6e84e234abcfe10265;$this->loadXmlDOM();$vbb60f04b9e80a969b75911fa6dfc9b99 = $this->dom->firstChild;if (!$vbb60f04b9e80a969b75911fa6dfc9b99 instanceof DOMElement) {return false;}$v0fea6a13c52b4d4725368f24b045ca84 = ($vbb60f04b9e80a969b75911fa6dfc9b99->nodeName === 'sitemap') ? (int) $vbb60f04b9e80a969b75911fa6dfc9b99->getAttribute('cache') : 0;$this->setCacheTimeout($v0fea6a13c52b4d4725368f24b045ca84);$v8d6652e544ac78162c4dfe3994130b01 = $this->searchPattern();if ($v8d6652e544ac78162c4dfe3994130b01) {return $this->beginProcessing($v8d6652e544ac78162c4dfe3994130b01);}return false;}private function findSitemapFilePath($v5b063e275d506f65ebf1b02d926f19a4) {$v7194be0228be94cb56d4cfca7fd544d7 = "/umaps/$v5b063e275d506f65ebf1b02d926f19a4";$v9a56643c1cc4258dddc07182b4e01784 = '';$v6829cdfdefd69b947abedd8fa2c4bcc7 = cmsController::getInstance()->getResourcesDirectory();if ($v6829cdfdefd69b947abedd8fa2c4bcc7) {$v9a56643c1cc4258dddc07182b4e01784 = $v6829cdfdefd69b947abedd8fa2c4bcc7 . $v7194be0228be94cb56d4cfca7fd544d7;}$v8c7dd922ad47494fc02c388e12c00eac = Service::FileFactory()->create($v9a56643c1cc4258dddc07182b4e01784);if (!$v8c7dd922ad47494fc02c388e12c00eac->isExists()) {$v8c7dd922ad47494fc02c388e12c00eac->setFilePath(CURRENT_WORKING_DIR . $v7194be0228be94cb56d4cfca7fd544d7);}if (!$v8c7dd922ad47494fc02c388e12c00eac->isExists()) {throw new publicException("Can't find sitemap file in $v9a56643c1cc4258dddc07182b4e01784");}return $v8c7dd922ad47494fc02c388e12c00eac->getFilePath();}private function setCacheTimeout($v0fea6a13c52b4d4725368f24b045ca84) {$v0fea6a13c52b4d4725368f24b045ca84 = (int) $v0fea6a13c52b4d4725368f24b045ca84;$this->cache = ($v0fea6a13c52b4d4725368f24b045ca84 > 0) ? $v0fea6a13c52b4d4725368f24b045ca84 : false;}private function loadXmlDOM() {secure_load_dom_document(file_get_contents($this->sitemapFilePath), $this->dom);}private function searchPattern() {$v3d788fa62d7c185a1bee4c9147ee1091 = new DOMXPath($this->dom);$v41e2e40b3652ac906787653abab3bcb9 = $v3d788fa62d7c185a1bee4c9147ee1091->query('/sitemap/match');foreach ($v41e2e40b3652ac906787653abab3bcb9 as $v8d6652e544ac78162c4dfe3994130b01) {$v240bf022e685b0ee30ad9fe9e1fb5d5b = $v8d6652e544ac78162c4dfe3994130b01->getAttribute('pattern');if ($this->comparePattern($v240bf022e685b0ee30ad9fe9e1fb5d5b)) {return $v8d6652e544ac78162c4dfe3994130b01;}}return false;}private function comparePattern($v240bf022e685b0ee30ad9fe9e1fb5d5b) {foreach ([$this->uri, $this->uri . '/'] as $v9305b73d359bd06734fee0b3638079e1) {if (preg_match('|' . $v240bf022e685b0ee30ad9fe9e1fb5d5b . '|', $v9305b73d359bd06734fee0b3638079e1, $v21ffce5b8a6cc8cc6a41448dd69623c9)) {$this->pattern = $v240bf022e685b0ee30ad9fe9e1fb5d5b;$this->params = $v21ffce5b8a6cc8cc6a41448dd69623c9;return true;}}return false;}private function beginProcessing(DOMElement $v8d6652e544ac78162c4dfe3994130b01) {def_module::isXSLTResultMode(true);$this->processRedirection();$v21ffce5b8a6cc8cc6a41448dd69623c9 = $this->extractParams($v8d6652e544ac78162c4dfe3994130b01);if (isset($v21ffce5b8a6cc8cc6a41448dd69623c9['cache'])) {$this->cache = $v21ffce5b8a6cc8cc6a41448dd69623c9['cache'];}$this->processGeneration();$this->processTransformation();$this->processValidation();if ($this->externalCall) {$this->processSerialization();return true;}return $this->buffer;}private function replaceParams($vaa8d056981feeec7a56c9491bf6902ab) {$vf83553aac4e101a17ef1c9f5efebc788 = $this->substituteParams($this->params, $vaa8d056981feeec7a56c9491bf6902ab);$vf83553aac4e101a17ef1c9f5efebc788 = $this->substituteParams($_GET, $vf83553aac4e101a17ef1c9f5efebc788, '', true);return $this->substituteParams($_SERVER, $vf83553aac4e101a17ef1c9f5efebc788, '_');}private function substituteParams($v21ffce5b8a6cc8cc6a41448dd69623c9, $v36cd38f49b9afa08222c0dc9ebfe35eb, $v851f5ac9941d720844d143ed9cfcf60a = '', $v68ff897a1d5590e8991a9e1e626eeb35 = false) {if (!is_array($v21ffce5b8a6cc8cc6a41448dd69623c9)) {return $v36cd38f49b9afa08222c0dc9ebfe35eb;}$result = $v36cd38f49b9afa08222c0dc9ebfe35eb;foreach ($v21ffce5b8a6cc8cc6a41448dd69623c9 as $vb068931cc450442b63f5b3d276ea4297 => $v2063c1608d6e0baf80249c42e2be5804) {if (is_array($v2063c1608d6e0baf80249c42e2be5804) || is_object($v2063c1608d6e0baf80249c42e2be5804)) {continue;}$v2063c1608d6e0baf80249c42e2be5804 = ($v68ff897a1d5590e8991a9e1e626eeb35 ? urlencode($v2063c1608d6e0baf80249c42e2be5804) : $v2063c1608d6e0baf80249c42e2be5804);$result = str_replace($this->getParamSign($vb068931cc450442b63f5b3d276ea4297, $v851f5ac9941d720844d143ed9cfcf60a), $v2063c1608d6e0baf80249c42e2be5804, $result);}return $result;}private function getParamSign($v13f88dc44ff0794f441a6e73ebf40826, $v851f5ac9941d720844d143ed9cfcf60a = '') {return '{' . $v851f5ac9941d720844d143ed9cfcf60a . mb_strtolower($v13f88dc44ff0794f441a6e73ebf40826) . '}';}private function processGeneration() {$v3d788fa62d7c185a1bee4c9147ee1091 = new DOMXPath($this->dom);$v22a3c602451fa234213b052a9190ea4e = $v3d788fa62d7c185a1bee4c9147ee1091->query("/sitemap/match[@pattern = '{$this->pattern}']/generate");if ($v22a3c602451fa234213b052a9190ea4e->length > 1) {throw new coreException('Only 1 generate tag allowed in match section.');}$v36c4536996ca5615dcf9911f068786dc = $v22a3c602451fa234213b052a9190ea4e->item(0);$v25d902c24283ab8cfbac54dfa101ad31 = $this->replaceParams($v36c4536996ca5615dcf9911f068786dc->getAttribute('src'));if ($this->cache !== false) {$v8d777f385d3dfec8815d20f7496026dc = Service::CacheFrontend()->loadSql($v25d902c24283ab8cfbac54dfa101ad31);}else {$v8d777f385d3dfec8815d20f7496026dc = false;}if (!$v8d777f385d3dfec8815d20f7496026dc) {$v8d777f385d3dfec8815d20f7496026dc = file_get_contents($v25d902c24283ab8cfbac54dfa101ad31);if ($this->cache !== false) {Service::CacheFrontend()->saveData($v25d902c24283ab8cfbac54dfa101ad31, $v8d777f385d3dfec8815d20f7496026dc, $this->cache);}}$this->buffer = $v8d777f385d3dfec8815d20f7496026dc;}private function processTransformation() {$v3d788fa62d7c185a1bee4c9147ee1091 = new DOMXpath($this->dom);$v22a3c602451fa234213b052a9190ea4e = $v3d788fa62d7c185a1bee4c9147ee1091->query("/sitemap/match[@pattern = '{$this->pattern}']/transform");foreach ($v22a3c602451fa234213b052a9190ea4e as $v36c4536996ca5615dcf9911f068786dc) {$v25d902c24283ab8cfbac54dfa101ad31 = $this->replaceParams($v36c4536996ca5615dcf9911f068786dc->getAttribute('src'));if (!file_exists($v25d902c24283ab8cfbac54dfa101ad31)) {throw new coreException("Transformation failed. File {$v25d902c24283ab8cfbac54dfa101ad31} doesn't exist.");}$vc3aaa7dd2c4cf0305f95e82438b46e82 = new DOMDocument('1.0', 'utf-8');$vc3aaa7dd2c4cf0305f95e82438b46e82->resolveExternals = true;$vc3aaa7dd2c4cf0305f95e82438b46e82->substituteEntities = true;$vc3aaa7dd2c4cf0305f95e82438b46e82->load($v25d902c24283ab8cfbac54dfa101ad31, DOM_LOAD_OPTIONS);$v801f7201346b43f8ee8390a1ef20ddcd = new XSLTProcessor;$v801f7201346b43f8ee8390a1ef20ddcd->registerPHPFunctions();$v801f7201346b43f8ee8390a1ef20ddcd->importStylesheet($vc3aaa7dd2c4cf0305f95e82438b46e82);$v21ffce5b8a6cc8cc6a41448dd69623c9 = $this->extractParams($v36c4536996ca5615dcf9911f068786dc);foreach ($v21ffce5b8a6cc8cc6a41448dd69623c9 as $vb068931cc450442b63f5b3d276ea4297 => $v2063c1608d6e0baf80249c42e2be5804) {$v2063c1608d6e0baf80249c42e2be5804 = $this->replaceParams($v2063c1608d6e0baf80249c42e2be5804);$v801f7201346b43f8ee8390a1ef20ddcd->setParameter('', $vb068931cc450442b63f5b3d276ea4297, $v2063c1608d6e0baf80249c42e2be5804);}$this->buffer = $v801f7201346b43f8ee8390a1ef20ddcd->transformToXml($this->loadBufferDom());}}private function processSerialization() {$v3d788fa62d7c185a1bee4c9147ee1091 = new DOMXpath($this->dom);$v22a3c602451fa234213b052a9190ea4e = $v3d788fa62d7c185a1bee4c9147ee1091->query("/sitemap/match[@pattern = '{$this->pattern}']/serialize");if ($v22a3c602451fa234213b052a9190ea4e->length === 0) {throw new coreException('Serializer tag required, but not found in umap rule.');}if ($v22a3c602451fa234213b052a9190ea4e->length > 1) {throw new coreException('Only 1 serialize tag allowed in match section.');}$v36c4536996ca5615dcf9911f068786dc = $v22a3c602451fa234213b052a9190ea4e->item(0);$v599dcce2998a6b40b1e38e8c6006cb0a = $v36c4536996ca5615dcf9911f068786dc->getAttribute('type') ?: 'xml';$v21ffce5b8a6cc8cc6a41448dd69623c9 = $this->extractParams($v36c4536996ca5615dcf9911f068786dc);baseSerialize::serializeDocument($v599dcce2998a6b40b1e38e8c6006cb0a, $this->buffer, $v21ffce5b8a6cc8cc6a41448dd69623c9);Service::Response()    ->getCurrentBuffer()    ->end();}private function processRedirection() {$v3d788fa62d7c185a1bee4c9147ee1091 = new DOMXpath($this->dom);$v22a3c602451fa234213b052a9190ea4e = $v3d788fa62d7c185a1bee4c9147ee1091->query("/sitemap/match[@pattern = '{$this->pattern}']/redirect");if ($v22a3c602451fa234213b052a9190ea4e->length === 0) {return false;}if ($v22a3c602451fa234213b052a9190ea4e->length > 1) {throw new coreException('Only 1 redirect tag allowed in match section.');}$v36c4536996ca5615dcf9911f068786dc = $v22a3c602451fa234213b052a9190ea4e->item(0);$v21ffce5b8a6cc8cc6a41448dd69623c9 = $this->extractParams($v36c4536996ca5615dcf9911f068786dc);$v9acb44549b41563697bb490144ec6258 = isset($v21ffce5b8a6cc8cc6a41448dd69623c9['status']) ? $v21ffce5b8a6cc8cc6a41448dd69623c9['status'] : 301;$v9305b73d359bd06734fee0b3638079e1 = $v36c4536996ca5615dcf9911f068786dc->getAttribute('uri');$v7f2db423a49b305459147332fb01cf87 = Service::Response()    ->getCurrentBuffer();$v7f2db423a49b305459147332fb01cf87->status($v9acb44549b41563697bb490144ec6258);$v7f2db423a49b305459147332fb01cf87->redirect($v9305b73d359bd06734fee0b3638079e1);}private function processValidation() {$v3d788fa62d7c185a1bee4c9147ee1091 = new DOMXpath($this->dom);$v22a3c602451fa234213b052a9190ea4e = $v3d788fa62d7c185a1bee4c9147ee1091->query("/sitemap/match[@pattern = '{$this->pattern}']/validate");if ($v22a3c602451fa234213b052a9190ea4e->length === 0) {return false;}if ($v22a3c602451fa234213b052a9190ea4e->length > 1) {throw new coreException('Only 1 validate tag allowed in match section.');}$v36c4536996ca5615dcf9911f068786dc = $v22a3c602451fa234213b052a9190ea4e->item(0);$v25d902c24283ab8cfbac54dfa101ad31 = $v36c4536996ca5615dcf9911f068786dc->getAttribute('src');$v599dcce2998a6b40b1e38e8c6006cb0a = $v36c4536996ca5615dcf9911f068786dc->getAttribute('type');switch ($v599dcce2998a6b40b1e38e8c6006cb0a) {case 'xsd': {if ($this->validateXmlByXsd($v25d902c24283ab8cfbac54dfa101ad31)) {return true;}throw new coreException("Document is not valid according to xsd scheme \"{$v25d902c24283ab8cfbac54dfa101ad31}\"");break;}case 'dtd': {if ($this->validateXmlByDtd($v25d902c24283ab8cfbac54dfa101ad31)) {return true;}throw new coreException("Document is not valid according to dtd scheme \"{$v25d902c24283ab8cfbac54dfa101ad31}\"");break;}default: {throw new coreException("Unknown validation method \"{$v599dcce2998a6b40b1e38e8c6006cb0a}\"");break;}}}private function extractParams(DOMElement $v36c4536996ca5615dcf9911f068786dc) {$v21ffce5b8a6cc8cc6a41448dd69623c9 = [];$v3d788fa62d7c185a1bee4c9147ee1091 = new DOMXpath($this->dom);$ve43f0203c36cc70bf17296f7a7ad0a7d = $v3d788fa62d7c185a1bee4c9147ee1091->query('param', $v36c4536996ca5615dcf9911f068786dc);foreach ($ve43f0203c36cc70bf17296f7a7ad0a7d as $vfe35958165bbc2da0b84301b7ac74205) {$v865c0c0b4ab0e063e5caa3387c1a8741 = (string) $vfe35958165bbc2da0b84301b7ac74205->getAttribute('name');$v9e3669d19b675bd57058fd4664205d2a = (string) $vfe35958165bbc2da0b84301b7ac74205->getAttribute('value');$v21ffce5b8a6cc8cc6a41448dd69623c9[$v865c0c0b4ab0e063e5caa3387c1a8741] = $v9e3669d19b675bd57058fd4664205d2a;$_subnodes = $v3d788fa62d7c185a1bee4c9147ee1091->query('param', $vfe35958165bbc2da0b84301b7ac74205);if ($_subnodes->length > 0) {$v21ffce5b8a6cc8cc6a41448dd69623c9[$v865c0c0b4ab0e063e5caa3387c1a8741] = $this->extractParams($vfe35958165bbc2da0b84301b7ac74205);}}return $v21ffce5b8a6cc8cc6a41448dd69623c9;}private function validateXmlByXsd($v25d902c24283ab8cfbac54dfa101ad31) {if (!file_exists($v25d902c24283ab8cfbac54dfa101ad31)) {throw new coreException("Failed to validate, because xsd scheme not found \"{$v25d902c24283ab8cfbac54dfa101ad31}\"");}$vdd988cfd769c9f7fbd795a0f5da8e751 = $this->loadBufferDom();return $vdd988cfd769c9f7fbd795a0f5da8e751->schemaValidate($v25d902c24283ab8cfbac54dfa101ad31);}private function validateXmlByDtd($v25d902c24283ab8cfbac54dfa101ad31) {if (!file_exists($v25d902c24283ab8cfbac54dfa101ad31)) {throw new coreException("Failed to validate, because dtd scheme not found \"{$v25d902c24283ab8cfbac54dfa101ad31}\"");}$vdd988cfd769c9f7fbd795a0f5da8e751 = $this->loadBufferDom();return $vdd988cfd769c9f7fbd795a0f5da8e751->validate($v25d902c24283ab8cfbac54dfa101ad31);}private function loadBufferDom() {secure_load_dom_document($this->buffer, $vdd988cfd769c9f7fbd795a0f5da8e751);return $vdd988cfd769c9f7fbd795a0f5da8e751;}}