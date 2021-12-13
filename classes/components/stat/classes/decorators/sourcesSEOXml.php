<?php

	/** Декоратор отчета "sourcesSEO" */
	class sourcesSEOXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			return $this->generateFlat($array);
		}
	}
