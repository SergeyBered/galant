<?php

	/** Декоратор отчета "openstatCampaigns" */
	class openstatCampaignsXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			return $this->generateFlat($array);
		}
	}
