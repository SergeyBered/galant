<?php

	/** Коллекция приложений социальные сетей типа "vkontakte" */
	class vkontakte_social_network extends social_network {

		/** @inheritDoc */
		public function isIframeEnabled() {
			return $this->getValue('is_iframe_enabled');
		}

		/** @inheritDoc */
		public function isHierarchyAllowed($elementId) {
			$umiHierarchy = umiHierarchy::getInstance();
			$defaultElementId = $umiHierarchy->getDefaultElementId();

			if ($elementId === $defaultElementId) {
				return true;
			}

			$allowedHierarchyElements = (array) $this->getValue('iframe_pages');

			if (empty($allowedHierarchyElements)) {
				return false;
			}

			/** @var iUmiHierarchyElement $hierarchyElement */
			foreach ($allowedHierarchyElements as $hierarchyElement) {
				if ($hierarchyElement->getId() == $elementId) {
					return true;
				}
			}

			if (!$this->checkParents) {
				return false;
			}

			foreach ($allowedHierarchyElements as $hierarchyElement) {
				if ($umiHierarchy->hasParent($elementId, $hierarchyElement)) {
					return true;
				}
			}

			return false;
		}
	}
