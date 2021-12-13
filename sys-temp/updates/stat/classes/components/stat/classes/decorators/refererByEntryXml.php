<?php

	/** Декоратор отчета "refererByEntry" */
	class refererByEntryXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			return $this->generateDetailDynamic($array);
		}
	}
