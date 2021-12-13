<?php

	/** Декоратор отчета "visitDeep" */
	class visitDeepXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			return $this->generateDetailDynamic($array);
		}
	}
