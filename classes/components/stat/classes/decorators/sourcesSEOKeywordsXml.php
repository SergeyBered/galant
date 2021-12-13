<?php

	/** Декоратор отчета "sourcesSEOKeywords" */
	class sourcesSEOKeywordsXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			return $this->generateFlat($array);
		}
	}
