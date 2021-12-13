<?php

	/** Декоратор отчета "sourcesTop" */
	class sourcesTopXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			return $this->generateFlat($array);
		}
	}
