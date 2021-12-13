<?php

	/** Декоратор отчета "cityStat" */
	class cityStatXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			return $this->generateDetailDynamic($array);
		}
	}
