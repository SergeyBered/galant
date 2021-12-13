<?php

	/** Декоратор отчета "auditoryVolumeGrowth" */
	class auditoryVolumeGrowthXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			return $this->generateFlat($array);
		}
	}
