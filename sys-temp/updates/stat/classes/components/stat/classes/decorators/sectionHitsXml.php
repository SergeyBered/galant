<?php

	/** Декоратор отчета "sectionHits" */
	class sectionHitsXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			return $this->generateFlat($array);
		}
	}
