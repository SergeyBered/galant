<?php

	/** Декоратор отчета "openstatSources" */
	class openstatSourcesXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			return $this->generateFlat($array);
		}
	}
