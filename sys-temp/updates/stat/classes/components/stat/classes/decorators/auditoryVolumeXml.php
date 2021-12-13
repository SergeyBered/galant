<?php

	/** Декоратор отчета "auditoryVolume" */
	class auditoryVolumeXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			return $this->generateFlat($array);
		}
	}
