<?php

	/** Декоратор отчета "visitTimeX" */
	class visitTimeXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			return $this->generateDetailDynamic($array);
		}
	}
