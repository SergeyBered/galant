<?php

	/** Декоратор отчета "openstatServices" */
	class openstatServicesXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			return $this->generateFlat($array);
		}
	}
