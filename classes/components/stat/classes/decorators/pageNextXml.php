<?php

	/** Декоратор отчета "pageNext" */
	class pageNextXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			return $this->generateFlat($array);
		}
	}
