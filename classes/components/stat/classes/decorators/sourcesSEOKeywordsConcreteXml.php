<?php

	/** Декоратор отчета "sourcesSEOKeywordsConcrete" */
	class sourcesSEOKeywordsConcreteXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			return $this->generateFlat($array);
		}
	}
