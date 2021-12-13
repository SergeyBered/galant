<?php

	/** Декоратор отчета "openstatAds" */
	class openstatAdsXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			return $this->generateFlat($array);
		}
	}
