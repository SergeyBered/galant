<?php

	/** Декоратор отчета "pagesHits" */
	class pagesHitsXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			return $this->generateFlat($array);
		}
	}
