<?php

	/** Декоратор отчета "entryByReferer" */
	class entryByRefererXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			return $this->generateDetailDynamic($array);
		}
	}
