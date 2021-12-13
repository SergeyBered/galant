<?php

	/** Декоратор отчета "sourcesSEOConcrete" */
	class sourcesSEOConcreteXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			return $this->generateFlat($array);
		}
	}
