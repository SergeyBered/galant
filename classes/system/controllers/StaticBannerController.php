<?php
 namespace UmiCms\Classes\System\Controllers;use \iCmsController as iModuleLoader;use \umiTemplaterPHP as iPhpTemplateEngine;use UmiCms\Classes\System\Template\Engine\iFactory as iTemplateEngineFactory;class StaticBannerController extends AbstractController implements iStaticBannerController {private $moduleLoader;private $phpTemplateEngine;const TEMPLATE_PATH = './styles/common/phtml/static_banner.phtml';public function setModuleLoader(iModuleLoader $ve73640dc910137b64969c6b9234502ea) {$this->moduleLoader = $ve73640dc910137b64969c6b9234502ea;return $this;}public function setPhpTemplateEngine(iTemplateEngineFactory $v9549dd6065d019211460c59a86dd6536) {$this->phpTemplateEngine = $v9549dd6065d019211460c59a86dd6536->createPhp(self::TEMPLATE_PATH);return $this;}public function execute() {parent::execute();$v009a93317a248d0fbcd664b6fa5e79e8 = $this->moduleLoader->getModule('banners');if (!$v009a93317a248d0fbcd664b6fa5e79e8 instanceof \banners) {$this->buffer->stop();}$vb5eda0a74558a342cf659187f06f746f = $this->request->Get();$vebed715e82a0a0f3e950ef6565cdc4a8 = addslashes($vb5eda0a74558a342cf659187f06f746f->get('place'));$v50d644c42a9f32486af6d339527e1020 = (int) $vb5eda0a74558a342cf659187f06f746f->get('current_element_id');$v12df53fea8b3adfa6c2ec456dd22e204 = $v009a93317a248d0fbcd664b6fa5e79e8->insert($vebed715e82a0a0f3e950ef6565cdc4a8, 0, false, $v50d644c42a9f32486af6d339527e1020);$v12df53fea8b3adfa6c2ec456dd22e204 = trim($v12df53fea8b3adfa6c2ec456dd22e204);$v12df53fea8b3adfa6c2ec456dd22e204 = str_replace('&amp;', '&', htmlspecialchars($v12df53fea8b3adfa6c2ec456dd22e204));$v12df53fea8b3adfa6c2ec456dd22e204 = str_replace('\"', '"', $v12df53fea8b3adfa6c2ec456dd22e204);$v87cd8b8808600624d8c590cfc2e6e94b = [    'place' => $vebed715e82a0a0f3e950ef6565cdc4a8,    'banner' => $v12df53fea8b3adfa6c2ec456dd22e204   ];$v9a0364b9e99bb480dd25e1f0284c8555 = $this->phpTemplateEngine->parse($v87cd8b8808600624d8c590cfc2e6e94b);$this->buffer->contentType('text/javascript');$this->buffer->charset('utf-8');$this->buffer->push($v9a0364b9e99bb480dd25e1f0284c8555);$this->buffer->end();}}