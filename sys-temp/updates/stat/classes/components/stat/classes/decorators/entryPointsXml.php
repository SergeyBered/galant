<?php

	/** Декоратор отчета "entryPoints" */
	class entryPointsXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			return $this->generateFlat($array);
		}
	}
