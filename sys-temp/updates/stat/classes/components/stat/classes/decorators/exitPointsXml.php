<?php

	/** Декоратор отчета "exitPoints" */
	class exitPointsXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			return $this->generateFlat($array);
		}
	}
