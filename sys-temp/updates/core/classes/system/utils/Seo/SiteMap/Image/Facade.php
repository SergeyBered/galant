<?php
 namespace UmiCms\Classes\System\Utils\SiteMap\Image;use UmiCms\Classes\System\Utils\SiteMap\iImage;use UmiCms\Classes\System\Utils\SiteMap\iLocation;use UmiCms\System\Orm\Entity\Facade as AbstractFacade;class Facade extends AbstractFacade implements iFacade {private $imageExtractor;public function setImageExtractor(iExtractor $vab3bc126e6d3037a0c2c9f084bafb1c9) : iFacade {$this->imageExtractor = $vab3bc126e6d3037a0c2c9f084bafb1c9;return $this;}public function create(array $v6dd047148d685270458ecc44ee128a4d = []) {if (!isset($v6dd047148d685270458ecc44ee128a4d[iMapper::LOCATION_ID])) {throw new \ErrorException('Location id expected');}if (!isset($v6dd047148d685270458ecc44ee128a4d[iMapper::DOMAIN_ID])) {throw new \ErrorException('Domain id expected');}if (!isset($v6dd047148d685270458ecc44ee128a4d[iMapper::LINK])) {throw new \ErrorException('Source expected');}return parent::create($v6dd047148d685270458ecc44ee128a4d);}public function createByLocation(iLocation $vd5189de027922f81005951e6efe0efd5) : array {$vad5f82e879a9c5d6b5b442eb37e50551 = $vd5189de027922f81005951e6efe0efd5->getDomain();$v72bc6e7707131edcbe44c867e3bc83e1 = [];foreach ($this->imageExtractor->extract($vd5189de027922f81005951e6efe0efd5) as $v78805a221a988e79ef3f42d7c5bfd418) {$v72bc6e7707131edcbe44c867e3bc83e1[] = $this->create([     iMapper::LOCATION_ID => $vd5189de027922f81005951e6efe0efd5->getId(),     iMapper::DOMAIN_ID => $vd5189de027922f81005951e6efe0efd5->getDomainId(),     iMapper::LINK => $v78805a221a988e79ef3f42d7c5bfd418->getUrl($vad5f82e879a9c5d6b5b442eb37e50551),     iMapper::ALT => $v78805a221a988e79ef3f42d7c5bfd418->getAlt(),     iMapper::TITLE => $v78805a221a988e79ef3f42d7c5bfd418->getTitle()    ]);}return $v72bc6e7707131edcbe44c867e3bc83e1;}public function deleteByDomain(int $vb80bb7740288fda1f201890375a60c8f) : iFacade {$this->getRepository()    ->deleteByDomain($vb80bb7740288fda1f201890375a60c8f);return $this;}protected function isValidEntity($vf5e638cc78dd325906c1298a0c21fb6b) {return $vf5e638cc78dd325906c1298a0c21fb6b instanceof iImage;}}