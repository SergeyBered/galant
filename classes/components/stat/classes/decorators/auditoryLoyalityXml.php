<?php

	/** Декоратор отчета "auditoryLoyality" */
	class auditoryLoyalityXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			return $this->generateDetailDynamic($array);
		}
	}
