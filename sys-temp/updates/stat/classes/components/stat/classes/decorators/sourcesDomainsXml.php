<?php

	/** Декоратор отчета "sourcesDomains" */
	class sourcesDomainsXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			return $this->generateFlat($array);
		}
	}
